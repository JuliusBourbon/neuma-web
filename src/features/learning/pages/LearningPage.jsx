import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Lesson from "../components/lesson";
import UnderSection from "../components/underSection";
import Quiz from "../components/quiz";
import Camera from "../components/camera";
import { getLevelDetail } from "../../../services/api/levelService";
import { startQuestion, submitQuestion, completeLevel } from "../../../services/api/learningService";
import { getText } from "../../../utils/text";

function extractTargetLetter(question) {
    if (!question) return "";
    if (question.correctAnswer) return String(question.correctAnswer).trim().toUpperCase();

    const text = getText(question?.questionText);
    const match =
        text.match(/huruf\s*['"`]?([A-Za-z])['"`]?/i) ||
        text.match(/letter\s*['"`]?([A-Za-z])['"`]?/i) ||
        text.match(/['"`]([A-Za-z])['"`]/);
    return match ? match[1].toUpperCase() : "";
}

export default function LearningPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const levelId = searchParams.get("levelId");

    // Level data state
    const [level, setLevel] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Steps: merged array of materials & questions, ordered
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    // Per-question state tracking
    const [attemptData, setAttemptData] = useState({});
    const [answers, setAnswers] = useState({});
    const [submitResults, setSubmitResults] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStartingQuestion, setIsStartingQuestion] = useState(false);
    const startingQuestionsRef = useRef(new Set());
    const questionStartPromisesRef = useRef(new Map());

    // Timer states & refs for question time limits
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const timeoutTriggeredRef = useRef(new Set());
    const timerStartTimesRef = useRef({});
    const remainingTimesRef = useRef({});

    // Fetch level detail on mount
    useEffect(() => {
        if (!levelId) {
            setErrorMessage("Level ID tidak ditemukan. Kembali ke halaman utama.");
            setIsLoading(false);
            return;
        }

        const fetchLevel = async () => {
            setIsLoading(true);
            setErrorMessage("");
            try {
                const data = await getLevelDetail(levelId);
                setLevel(data);

                // Merge materials and questions (materials first, then questions)
                const materialSteps = (data.materials || []).map((m) => ({
                    type: "material",
                    data: m,
                    sortKey: m.orderIndex * 10,
                }));

                const questionSteps = (data.questions || []).map((q, idx) => ({
                    type: q.type === "camera_practice" ? "camera" : "quiz",
                    data: q,
                    sortKey: (materialSteps.length + idx + 1) * 10,
                }));

                // Materials first, then questions in order
                const mergedSteps = [...materialSteps, ...questionSteps];
                setSteps(mergedSteps);

            } catch (err) {
                setErrorMessage(err.message || "Gagal memuat detail level.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLevel();
    }, [levelId]);

    // Start question attempt
    const handleStartQuestion = useCallback(
        async (questionId) => {
            if (!levelId || !questionId) return;
            if (attemptData[questionId] || startingQuestionsRef.current.has(questionId)) return;

            startingQuestionsRef.current.add(questionId);
            setIsStartingQuestion(true);
            const promise = startQuestion(levelId, questionId);
            questionStartPromisesRef.current.set(questionId, promise);
            try {
                const result = await promise;
                setAttemptData((prev) => ({
                    ...prev,
                    [questionId]: result,
                }));
                return result;
            } catch (err) {
                console.error("Failed to start question:", err);
            } finally {
                startingQuestionsRef.current.delete(questionId);
                setIsStartingQuestion(false);
            }
        },
        [levelId, attemptData]
    );

    // Auto-start question attempting quiz/camera step
    useEffect(() => {
        const currentItem = steps[currentStep];
        if (!currentItem) return;

        if (
            (currentItem.type === "quiz" || currentItem.type === "camera") &&
            !attemptData[currentItem.data.id] &&
            !submitResults[currentItem.data.id]
        ) {
            handleStartQuestion(currentItem.data.id);
        }
    }, [currentStep, steps, attemptData, submitResults, handleStartQuestion]);

    // Handle submit question answer
    const handleSubmitAnswer = useCallback(
        async (question, isTimeout = false, directPayload = null) => {
            const qId = question.id;
            const currentAns = directPayload || answers[qId];

            if (!isTimeout && !currentAns && question.type !== "camera_practice") return;

            // Wait for startQuestion session if still initializing
            if (questionStartPromisesRef.current.has(qId)) {
                try {
                    await questionStartPromisesRef.current.get(qId);
                } catch {
                    // Ignore start failure
                    console.error("Failed to start question:", err);
                }
            }

            let payload = {};
            if (isTimeout) {
                // Empty payload for timeout
                payload = {};
            } else if (question.type === "multiple_choice" || question.type === "true_false") {
                if (!currentAns) return;
                payload = { answerKey: currentAns };
            } else if (question.type === "camera_practice") {
                const detected = currentAns?.detectedLetter || (typeof currentAns === "string" ? currentAns : null);
                if (!detected) return;
                payload = {
                    detectedLetter: detected,
                    spelledWord: currentAns?.spelledWord || detected,
                    confidence: parseFloat(currentAns?.confidence || 0.95),
                };
            }

            setIsSubmitting(true);
            try {
                const result = await submitQuestion(levelId, qId, payload);
                const finalResult = isTimeout ? { ...result, isTimeout: true } : result;
                setSubmitResults((prev) => ({
                    ...prev,
                    [qId]: finalResult,
                }));
                if (directPayload) {
                    setAnswers((prev) => ({
                        ...prev,
                        [qId]: directPayload,
                    }));
                }
            } catch (err) {
                console.error("Failed to submit answer:", err);
            } finally {
                setIsSubmitting(false);
            }
        },
        [levelId, answers]
    );

    // Handle Next button
    const handleNext = useCallback(async () => {
        const currentItem = steps[currentStep];

        if (currentItem && (currentItem.type === "quiz" || currentItem.type === "camera")) {
            const qId = currentItem.data.id;

            // If answer not yet submitted, submit it first
            if (!submitResults[qId]) {
                await handleSubmitAnswer(currentItem.data);
                return; // To stay on this step
            }
        }

        // Move to next step
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            // All steps complete — complete the level
            handleCompleteLevel();
        }
    }, [currentStep, steps, submitResults, handleSubmitAnswer]);

    // Handle Back button
    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    // Handle complete level
    const handleCompleteLevel = async () => {
        setIsSubmitting(true);
        try {
            const result = await completeLevel(levelId);
            // Navigate to score page
            navigate("/score", {
                state: {
                    levelId,
                    levelTitle: level?.title,
                    ...result,
                },
            });
        } catch (err) {
            console.error("Failed to complete level:", err);
            setErrorMessage(err.message || "Gagal menyelesaikan level.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Current step info
    const totalSteps = steps.length;
    const currentItem = steps[currentStep];
    const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;

    const isQuestionStep =
        currentItem && (currentItem.type === "quiz" || currentItem.type === "camera");
    const currentQId = isQuestionStep ? currentItem.data.id : null;
    const isCurrentSubmitted = currentQId ? !!submitResults[currentQId] : false;

    // Handle timer
    useEffect(() => {
        // If it's not a question (material), set time to 0
        if (!isQuestionStep || !currentQId) {
            setTimeLeft(0);
            setTotalTime(0);
            return;
        }

        // Set the limit based on the question data, attempt data, or default (30 sec)
        const limit = currentItem.data.timeLimitSeconds || attemptData[currentQId]?.timeLimitSeconds || 30;
        setTotalTime(limit);

        // If question submitted, freeze it
        if (isCurrentSubmitted) {
            const saved = remainingTimesRef.current[currentQId] ?? 0;
            setTimeLeft(saved);
            return;
        }

        // Record start time if not yet set for this question
        if (!timerStartTimesRef.current[currentQId]) {
            timerStartTimesRef.current[currentQId] = Date.now();
        }

        const startTime = timerStartTimesRef.current[currentQId];

        const tick = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = Math.max(0, limit - elapsed);
            setTimeLeft(remaining);
            remainingTimesRef.current[currentQId] = remaining;

            if (remaining <= 0) {
                if (
                    !timeoutTriggeredRef.current.has(currentQId) &&
                    !submitResults[currentQId] &&
                    !isSubmitting
                ) {
                    timeoutTriggeredRef.current.add(currentQId);
                    handleSubmitAnswer(currentItem.data, true);
                }
            }
        };

        tick();
        const intervalId = setInterval(tick, 100);

        return () => clearInterval(intervalId);
    }, [
        isQuestionStep,
        currentQId,
        isCurrentSubmitted,
        currentItem,
        attemptData,
        submitResults,
        isSubmitting,
        handleSubmitAnswer,
    ]);

    // Timer bar percentage
    const timerPercentage =
        isQuestionStep && totalTime > 0
            ? Math.min(100, Math.max(0, (timeLeft / totalTime) * 100))
            : 0;

    // Timer bar color based on percentage
    let timerColorClass = "bg-neon shadow-[0_0_12px_#C2FF00]";
    if (timerPercentage <= 15) {
        timerColorClass = "bg-red-500 shadow-[0_0_14px_rgba(239,68,68,1)] animate-pulse";
    } else if (timerPercentage <= 30) {
        timerColorClass = "bg-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]";
    }

    // Next button state
    const getNextButtonState = () => {
        if (!currentItem) return { canGoNext: false, label: "Lanjut" };

        if (currentItem.type === "material") {
            const isLastStep = currentStep === totalSteps - 1;
            return { canGoNext: true, label: isLastStep ? "Selesai" : "Lanjut" };
        }

        const qId = currentItem.data.id;
        const hasAnswer =
            currentItem.type === "camera"
                ? !!answers[qId]?.detectedLetter
                : !!answers[qId];
        const hasResult = !!submitResults[qId];

        if (hasResult) {
            const isLastStep = currentStep === totalSteps - 1;
            return { canGoNext: true, label: isLastStep ? "Selesai" : "Lanjut" };
        }

        return {
            canGoNext: hasAnswer,
            label: "Kirim Jawaban",
        };
    };

    const { canGoNext, label: nextLabel } = getNextButtonState();

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-primary min-h-screen flex flex-col items-center justify-center text-tertiary">
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-medium text-sm">Loading...</p>
            </div>
        );
    }

    // Error state
    if (errorMessage) {
        return (
            <div className="bg-primary min-h-screen flex flex-col items-center justify-center text-tertiary p-6">
                <div className="bg-white/90 backdrop-blur-md border border-red-300 text-red-700 px-8 py-6 rounded-3xl max-w-md text-center shadow-2xl">
                    <p className="text-base font-bold mb-3">{errorMessage}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="text-sm text-secondary px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow transition cursor-pointer"
                    >
                        Kembali ke Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary min-h-screen flex flex-col text-tertiary">
            {/* Time Indicator */}
            {isQuestionStep && (
                <div className="fixed top-0 left-0 right-0 w-full h-2 z-50 bg-black/25 overflow-hidden">
                    <div
                        className={`h-full transition-[width] duration-100 ease-linear ${timerColorClass}`}
                        style={{ width: `${timerPercentage}%` }}
                    />
                </div>
            )}

            {/* Top Navigation Bar */}
            <header className="relative w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 px-4 py-4 rounded-full bg-tertiary hover:bg-black text-white font-semibold text-sm shadow-sm transition active:scale-95 cursor-pointer z-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Progress Indicator */}
                <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
                    <div className="flex justify-between text-sm font-semibold mb-1 text-tertiary">
                        <span className="text-xs opacity-60">
                            {currentStep + 1} / {totalSteps}
                        </span>
                        <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-tertiary/80 h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-secondary h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-between p-2">
                {currentItem?.type === "material" && <Lesson material={currentItem.data} />}

                {currentItem?.type === "quiz" && (
                    <Quiz
                        key={currentItem.data.id}
                        question={currentItem.data}
                        selectedAnswer={answers[currentItem.data.id] || null}
                        onSelectAnswer={(answerKey) =>
                            setAnswers((prev) => ({
                                ...prev,
                                [currentItem.data.id]: answerKey,
                            }))
                        }
                        isSubmitted={!!submitResults[currentItem.data.id]}
                        result={submitResults[currentItem.data.id] || null}
                    />
                )}

                {currentItem?.type === "camera" && (
                    <Camera
                        key={currentItem.data.id}
                        question={currentItem.data}
                        questionId={currentItem.data.id}
                        targetLetter={extractTargetLetter(currentItem.data)}
                        savedAnswer={answers[currentItem.data.id] || null}
                        onDetectedAnswer={(letter, confidence) =>
                            setAnswers((prev) => ({
                                ...prev,
                                [currentItem.data.id]: {
                                    detectedLetter: letter,
                                    confidence,
                                },
                            }))
                        }
                        onCompleteAnswer={(payload) => {
                            handleSubmitAnswer(currentItem.data, false, payload);
                        }}
                        onResetAnswer={() =>
                            setAnswers((prev) => {
                                const updated = { ...prev };
                                delete updated[currentItem.data.id];
                                return updated;
                            })
                        }
                        isSubmitted={!!submitResults[currentItem.data.id]}
                        result={submitResults[currentItem.data.id] || null}
                    />
                )}
            </main>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-center">
                <UnderSection
                    onBack={handleBack}
                    onNext={handleNext}
                    canGoBack={currentStep > 0}
                    canGoNext={canGoNext}
                    nextLabel={nextLabel}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
}
