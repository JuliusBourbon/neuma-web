import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Lesson from "../components/lesson";
import UnderSection from "../components/underSection";
import Quiz from "../components/quiz";
import Camera from "../components/camera";
import { getText } from "../../../utils/text";
import { useLearningEngine } from "../hooks/useLearningEngine";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

function extractTargetLetter(question) {
    if (!question) return "";
    if (question.correctAnswer) return String(question.correctAnswer).trim().toUpperCase();

    const text = getText(question?.questionText);
    const quotedMatch = text.match(/['"`]([A-Za-z])['"`]/);
    if (quotedMatch) return quotedMatch[1].toUpperCase();

    const match =
        text.match(/huruf\s+(?:isyarat\s+)?(?:bisindo\s+)?([A-Za-z])\b/i) ||
        text.match(/letter\s+([A-Za-z])\b/i) ||
        text.match(/\b([A-Z])\b/);
    return match ? match[1].toUpperCase() : "";
}

export default function LearningPage() {
    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    });
    const lang = user?.preferredLanguage || 'id';

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const levelId = searchParams.get("levelId");

    const engine = useLearningEngine(levelId, lang);

    // Loading state
    if (engine.isLoading) {
        return <LoadingOverlay message={lang === 'id' ? "Memuat materi pembelajaran..." : "Loading learning materials..."} />;
    }

    // Error state
    if (engine.errorMessage) {
        return (
            <div className="bg-primary min-h-screen flex flex-col items-center justify-center text-tertiary p-6">
                <div className="bg-white/90 backdrop-blur-md border border-red-300 text-red-700 px-8 py-6 rounded-3xl max-w-md text-center shadow-2xl">
                    <p className="text-base font-bold mb-3">{engine.errorMessage}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="text-sm text-secondary px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow transition cursor-pointer"
                    >
                        {lang === 'id' ? "Kembali ke Home" : "Back to Home"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary min-h-dvh flex flex-col text-tertiary">
            {/* Time Indicator */}
            {engine.isQuestionStep && (
                <div className="fixed top-0 left-0 right-0 w-full h-3 lg:h-2 z-50 bg-black/25 overflow-hidden">
                    <div
                        className={`h-full transition-[width] duration-100 ease-linear ${engine.timerColorClass}`}
                        style={{ width: `${engine.timerPercentage}%` }}
                    />
                </div>
            )}

            {/* Top Navigation Bar */}
            <header className="relative w-full max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4 rounded-full bg-tertiary hover:bg-black text-white font-semibold text-sm shadow-sm transition active:scale-95 cursor-pointer z-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 md:h-4 md:w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Progress Indicator */}
                <div className="absolute left-[55%] md:left-[53%] lg:left-1/2 -translate-x-1/2 w-[90%] md:w-full max-w-4xl px-14 md:px-10 lg:px-6">
                    <div className="flex justify-between text-xs md:text-sm font-semibold mb-1 text-tertiary">
                        <span className="text-xs opacity-60">
                            {engine.currentStep + 1} / {engine.totalSteps}
                        </span>
                        <span>{engine.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-tertiary/80 h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-secondary h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${engine.progressPercent}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center lg:justify-between p-2">
                {engine.currentItem?.type === "material" && <Lesson material={engine.currentItem.data} lang={lang} />}

                {engine.currentItem?.type === "quiz" && (
                    <Quiz
                        key={engine.currentItem.data.id}
                        question={engine.currentItem.data}
                        selectedAnswer={engine.answers[engine.currentItem.data.id] || null}
                        onSelectAnswer={(answerKey) =>
                            engine.setAnswers((prev) => ({
                                ...prev,
                                [engine.currentItem.data.id]: answerKey,
                            }))
                        }
                        isSubmitted={!!engine.submitResults[engine.currentItem.data.id]}
                        result={engine.submitResults[engine.currentItem.data.id] || null}
                        lang={lang}
                    />
                )}

                {engine.currentItem?.type === "camera" && (
                    <Camera
                        key={engine.currentItem.data.id}
                        question={engine.currentItem.data}
                        questionId={engine.currentItem.data.id}
                        targetLetter={extractTargetLetter(engine.currentItem.data)}
                        savedAnswer={engine.answers[engine.currentItem.data.id] || null}
                        onDetectedAnswer={(letter, confidence) =>
                            engine.setAnswers((prev) => ({
                                ...prev,
                                [engine.currentItem.data.id]: {
                                    detectedLetter: letter,
                                    confidence,
                                },
                            }))
                        }
                        onCompleteAnswer={(payload) => {
                            engine.handleSubmitAnswer(engine.currentItem.data, false, payload);
                        }}
                        onCameraReady={() => {
                            engine.handleStartQuestion(engine.currentItem.data.id);
                        }}
                        onResetAnswer={() =>
                            engine.setAnswers((prev) => {
                                const updated = { ...prev };
                                delete updated[engine.currentItem.data.id];
                                return updated;
                            })
                        }
                        isSubmitted={!!engine.submitResults[engine.currentItem.data.id]}
                        result={engine.submitResults[engine.currentItem.data.id] || null}
                        lang={lang}
                    />
                )}
            </main>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-center">
                <UnderSection
                    onBack={engine.handleBack}
                    onNext={engine.handleNext}
                    canGoBack={engine.currentStep > 0}
                    canGoNext={engine.canGoNext}
                    nextLabel={engine.nextLabel}
                    isLoading={engine.isSubmitting}
                    lang={lang}
                />
            </div>
        </div>
    );
}
