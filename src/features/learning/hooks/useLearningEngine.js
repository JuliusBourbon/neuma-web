import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getLevelDetail } from "../../../services/api/levelService";
import { startQuestion, submitQuestion, completeLevel } from "../../../services/api/learningService";

// Helper for local client-side evaluation
function evaluateLocalAnswer(question, payload) {
    if (question.type === 'multiple_choice' || question.type === 'true_false') {
        return payload.answerKey === question.correctAnswer;
    }

    if (question.type === 'camera_practice') {
        const { detectedLetter, spelledWord, confidence } = payload;
        const rawAnswer = spelledWord || detectedLetter || '';
        const cleanAnswer = String(rawAnswer).replace(/[-\s]/g, '').toUpperCase();
        const cleanCorrect = String(question.correctAnswer || '').replace(/[-\s]/g, '').toUpperCase();
        return (
            cleanAnswer === cleanCorrect &&
            (parseFloat(confidence) ?? 0) >= 0.15
        );
    }
    return false;
}

export function useLearningEngine(levelId, lang) {
    const navigate = useNavigate();

    // Core state
    const [level, setLevel] = useState(null);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // Engine state
    const [attemptData, setAttemptData] = useState({});
    const [answers, setAnswers] = useState({});
    const [submitResults, setSubmitResults] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Timers & refs
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const startingQuestionsRef = useRef(new Set());
    const questionStartPromisesRef = useRef(new Map());
    const submittingQuestionsRef = useRef(new Set());
    const timeoutTriggeredRef = useRef(new Set());
    const timerStartTimesRef = useRef({});
    const remainingTimesRef = useRef({});

    // Fetch Level & Background Preload
    useEffect(() => {
        if (!levelId) {
            setErrorMessage(lang === 'id' ? "Level ID tidak ditemukan." : "Level ID not found.");
            setIsLoading(false);
            return;
        }

        const fetchLevel = async () => {
            setIsLoading(true);
            setErrorMessage("");
            try {
                const data = await getLevelDetail(levelId);
                setLevel(data);

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

                const mergedSteps = [...materialSteps, ...questionSteps];
                setSteps(mergedSteps);

                // BACKGROUND IMAGE PRELOADING
                setTimeout(() => {
                    mergedSteps.forEach(step => {
                        if (step.type === "material" && step.data.imageUrl) {
                            const img = new Image();
                            img.src = step.data.imageUrl;
                        }
                    });
                }, 1000);

            } catch (err) {
                setErrorMessage(err.message || (lang === 'id' ? "Gagal memuat detail level." : "Failed to load level details."));
            } finally {
                setIsLoading(false);
            }
        };

        fetchLevel();
    }, [levelId, lang]);

    // Start Question session
    const handleStartQuestion = useCallback(async (questionId) => {
        if (!levelId || !questionId) return;
        if (attemptData[questionId] || startingQuestionsRef.current.has(questionId)) return;

        startingQuestionsRef.current.add(questionId);
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
        }
    }, [levelId, attemptData]);

    // Auto-start quiz on step focus
    useEffect(() => {
        const currentItem = steps[currentStep];
        if (currentItem && currentItem.type === "quiz" && !attemptData[currentItem.data.id] && !submitResults[currentItem.data.id]) {
            handleStartQuestion(currentItem.data.id);
        }
    }, [currentStep, steps, attemptData, submitResults, handleStartQuestion]);

    // Submit Answer with client side evaluation
    const handleSubmitAnswer = useCallback(async (question, isTimeout = false, directPayload = null) => {
        const qId = question.id;
        const currentAns = directPayload || answers[qId];

        if (!isTimeout && !currentAns && question.type !== "camera_practice") return;
        if (submittingQuestionsRef.current.has(qId) || submitResults[qId]) return;

        submittingQuestionsRef.current.add(qId);

        // Freeze visual timer
        if (remainingTimesRef.current[qId] === undefined) {
            const limit = question.timeLimitSeconds || attemptData[qId]?.timeLimitSeconds || 30;
            const start = timerStartTimesRef.current[qId] || Date.now();
            remainingTimesRef.current[qId] = Math.max(0, limit - (Date.now() - start) / 1000);
        }

        // Wait for session start to finish if pending
        if (questionStartPromisesRef.current.has(qId)) {
            try { await questionStartPromisesRef.current.get(qId); } catch (e) { }
        }

        let payload = {};
        if (!isTimeout) {
            if (question.type === "multiple_choice" || question.type === "true_false") {
                payload = { answerKey: currentAns };
            } else if (question.type === "camera_practice") {
                const detected = currentAns?.detectedLetter || (typeof currentAns === "string" ? currentAns : null);
                payload = {
                    detectedLetter: detected,
                    spelledWord: currentAns?.spelledWord || detected,
                    confidence: parseFloat(currentAns?.confidence || 0.95),
                };
            }
        }

        // Client side evaluation (instant)
        const isCorrectLocal = isTimeout ? false : evaluateLocalAnswer(question, payload);
        const localResult = {
            isCorrect: isCorrectLocal,
            isTimeout,
            xpEarned: isCorrectLocal ? 10 : 0,
            correctAnswer: isCorrectLocal ? undefined : question.correctAnswer
        };

        // Update UI instantly
        setSubmitResults(prev => ({ ...prev, [qId]: localResult }));
        if (directPayload) {
            setAnswers(prev => ({ ...prev, [qId]: directPayload }));
        }

        // Fire and forget backend sync
        // Backend will still receive data to be recorded in the database, but the UI will not wait for its response
        submitQuestion(levelId, qId, payload).catch(err => {
            console.error("Background sync failed:", err);
        }).finally(() => {
            // we keep it locally resolved
        });

    }, [levelId, answers, submitResults, attemptData]);

    // Navigation (Next / Back)
    const handleNext = useCallback(async () => {
        const currentItem = steps[currentStep];

        if (currentItem && (currentItem.type === "quiz" || currentItem.type === "camera")) {
            const qId = currentItem.data.id;
            if (!submitResults[qId]) {
                await handleSubmitAnswer(currentItem.data);
                return;
            }
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleCompleteLevel();
        }
    }, [currentStep, steps, submitResults, handleSubmitAnswer]);

    const handleBack = useCallback(() => {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
    }, [currentStep]);

    const handleCompleteLevel = async () => {
        setIsSubmitting(true);
        try {
            const result = await completeLevel(levelId);
            navigate("/score", {
                state: { levelId, levelTitle: level?.title, ...result },
            });
        } catch (err) {
            console.error("Failed to complete level:", err);
            setErrorMessage(err.message || (lang === 'id' ? "Gagal menyelesaikan level." : "Failed to complete level."));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Timers
    const isQuestionStep = steps[currentStep] && (steps[currentStep].type === "quiz" || steps[currentStep].type === "camera");
    const currentQId = isQuestionStep ? steps[currentStep].data.id : null;
    const isCurrentSubmitted = currentQId ? !!submitResults[currentQId] : false;

    useEffect(() => {
        if (!isQuestionStep || !currentQId) {
            setTimeLeft(0);
            setTotalTime(0);
            return;
        }

        const limit = steps[currentStep].data.timeLimitSeconds || attemptData[currentQId]?.timeLimitSeconds || 30;
        setTotalTime(limit);

        const isSubmittingOrSubmitted = isCurrentSubmitted || submittingQuestionsRef.current.has(currentQId);
        if (isSubmittingOrSubmitted) {
            const saved = remainingTimesRef.current[currentQId] ?? timeLeft;
            setTimeLeft(saved);
            return;
        }

        if (!attemptData[currentQId]) {
            setTimeLeft(limit);
            return;
        }

        const backendStartedAt = attemptData[currentQId]?.startedAt;
        if (backendStartedAt) {
            timerStartTimesRef.current[currentQId] = new Date(backendStartedAt).getTime();
        } else if (!timerStartTimesRef.current[currentQId]) {
            timerStartTimesRef.current[currentQId] = Date.now();
        }

        const startTime = timerStartTimesRef.current[currentQId];

        const tick = () => {
            if (submittingQuestionsRef.current.has(currentQId) || submitResults[currentQId]) return;

            const elapsed = (Date.now() - startTime) / 1000;
            const remaining = Math.max(0, limit - elapsed);
            setTimeLeft(remaining);
            remainingTimesRef.current[currentQId] = remaining;

            if (remaining <= 0) {
                if (!timeoutTriggeredRef.current.has(currentQId) && !submitResults[currentQId]) {
                    timeoutTriggeredRef.current.add(currentQId);
                    handleSubmitAnswer(steps[currentStep].data, true);
                }
            }
        };

        tick();
        const intervalId = setInterval(tick, 100);
        return () => clearInterval(intervalId);
    }, [isQuestionStep, currentQId, isCurrentSubmitted, steps, currentStep, attemptData, submitResults, handleSubmitAnswer]);


    // Derived States
    const totalSteps = steps.length;
    const progressPercent = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;
    const timerPercentage = isQuestionStep && totalTime > 0 ? Math.min(100, Math.max(0, (timeLeft / totalTime) * 100)) : 0;

    let timerColorClass = "bg-neon shadow-[0_0_12px_#C2FF00]";
    if (timerPercentage <= 15) timerColorClass = "bg-red-500 shadow-[0_0_14px_rgba(239,68,68,1)] animate-pulse";
    else if (timerPercentage <= 30) timerColorClass = "bg-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]";

    const getNextButtonState = () => {
        const currentItem = steps[currentStep];
        if (!currentItem) return { canGoNext: false, label: lang === 'id' ? "Lanjut" : "Next" };

        if (currentItem.type === "material") {
            const isLastStep = currentStep === totalSteps - 1;
            return { canGoNext: true, label: isLastStep ? (lang === 'id' ? "Selesai" : "Finish") : (lang === 'id' ? "Lanjut" : "Next") };
        }

        const qId = currentItem.data.id;
        const hasAnswer = currentItem.type === "camera" ? !!answers[qId]?.detectedLetter : !!answers[qId];
        const hasResult = !!submitResults[qId];

        if (hasResult) {
            const isLastStep = currentStep === totalSteps - 1;
            return { canGoNext: true, label: isLastStep ? (lang === 'id' ? "Selesai" : "Finish") : (lang === 'id' ? "Lanjut" : "Next") };
        }

        return { canGoNext: hasAnswer, label: "Submit" };
    };

    const { canGoNext, label: nextLabel } = getNextButtonState();

    return {
        level,
        steps,
        currentStep,
        currentItem: steps[currentStep],
        isLoading,
        errorMessage,
        isSubmitting,
        answers,
        setAnswers,
        submitResults,
        handleStartQuestion,
        handleSubmitAnswer,
        handleNext,
        handleBack,
        totalSteps,
        progressPercent,
        isQuestionStep,
        timerPercentage,
        timerColorClass,
        canGoNext,
        nextLabel
    };
}
