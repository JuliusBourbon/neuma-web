import { useState, useEffect } from "react";
import { getText } from "../../../utils/text";
import defaultMascot from "../../../assets/onboarding/firefly-main.png";
import PartyIcon from "../../../components/icons/partyIcon";

/**
 * Quiz component — renders a single question (multiple_choice or true_false).
 * @param {{
 *   question: object,
 *   selectedAnswer: string|null,
 *   onSelectAnswer: (answerKey: string) => void,
 *   isSubmitted: boolean,
 *   result: { isCorrect: boolean, isTimeout: boolean, xpEarned: number, correctAnswer?: string } | null,
 * }} props
 */
export default function Quiz({ question, selectedAnswer, onSelectAnswer, isSubmitted, result, lang = 'id' }) {
    const [showNotification, setShowNotification] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isSubmitted && result) {
            setShowNotification(true);
            const enterTimer = setTimeout(() => {
                setIsVisible(true);
            }, 10);

            // Auto-dismiss after 3.5 seconds
            const dismissTimer = setTimeout(() => {
                setIsVisible(false);
                const removeTimer = setTimeout(() => {
                    setShowNotification(false);
                }, 300);
                return () => clearTimeout(removeTimer);
            }, 3500);

            return () => {
                clearTimeout(enterTimer);
                clearTimeout(dismissTimer);
            };
        } else {
            setIsVisible(false);
            setShowNotification(false);
        }
    }, [isSubmitted, result]);

    if (!question) return null;

    const questionText = getText(question.questionText, lang);
    const isMultipleChoice = question.type === "multiple_choice";
    const isTrueFalse = question.type === "true_false";

    const hasMedia = !!question.mediaUrl;

    return (
        <div
            className={`w-full flex flex-col items-center px-4 md:px-0 ${
                isTrueFalse
                    ? "flex-1 my-auto justify-center gap-6 md:gap-8"
                    : `gap-6 ${hasMedia ? "lg:gap-2" : "lg:gap-16"}`
            }`}
        >
            <h1 className="text-xl md:text-2xl font-bold text-center max-w-4xl">{questionText}</h1>

            {/* If question has mediaUrl */}
            {hasMedia && (
                <div className="flex justify-center">
                    <img
                        className={`${isTrueFalse ? "h-[20vh] md:h-[24vh]" : "h-[18vh]"} rounded-2xl object-contain shadow-md`}
                        src={question.mediaUrl}
                        // src={defaultMascot}
                        alt={lang === 'id' ? "Visual soal" : "Question visual"}
                        loading="lazy"
                    />
                </div>
            )}

            {/* Multiple Choice Options */}
            {isMultipleChoice && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                    {(question.options?.choices || []).map((choice) => {
                        const isSelected = selectedAnswer === choice.key;
                        const isCorrectChoice =
                            isSubmitted &&
                            result &&
                            (result.isCorrect ? isSelected : choice.key === result.correctAnswer);
                        const isWrongSelected = isSubmitted && result && isSelected && !result.isCorrect;
                        let borderClass = "border-transparent";
                        let bgClass = "bg-tertiary";
                        let textColor = "text-white";

                        if (isSubmitted && result) {
                            if (isCorrectChoice) {
                                borderClass = "border-tertiary";
                                bgClass = "bg-neon";
                                textColor = "text-tertiary";
                            } else if (isWrongSelected) {
                                borderClass = "border-tertiary";
                                bgClass = "bg-red-500";
                                textColor = "text-white";
                            } else {
                                borderClass = "border-transparent";
                                bgClass = "bg-tertiary/20";
                                textColor = "text-white/20";
                            }
                        } else {
                            if (isSelected) {
                                borderClass = "border-secondary";
                                bgClass = "bg-black";
                                textColor = "text-white";
                            } else {
                                borderClass = "border-transparent";
                                bgClass = "bg-tertiary";
                                textColor = "text-white";
                            }
                        }

                        const choiceText = getText(choice, lang);

                        return (
                            <button
                                key={choice.key}
                                onClick={() => !isSubmitted && onSelectAnswer(choice.key)}
                                disabled={isSubmitted}
                                className={`w-full flex flex-col justify-center border-2 ${borderClass} ${bgClass} ${textColor} font-semibold min-h-40 py-4 px-4 rounded-xl hover:bg-black transition active:scale-95 cursor-pointer disabled:cursor-not-allowed flex flex-col items-center gap-2`}
                            >
                                {choice.image_url && (
                                    <img
                                        className="h-24 object-contain rounded-lg"
                                        src={choice.image_url}
                                        // src={defaultMascot}
                                        alt={choiceText || (lang === 'id' ? `Pilihan ${choice.key.toUpperCase()}` : `Choice ${choice.key.toUpperCase()}`)}
                                    />
                                )}
                                {choiceText && (
                                    <span className="text-sm">
                                        {choiceText}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* True / False Options */}
            {isTrueFalse && (
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    {["true", "false"].map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption =
                            isSubmitted &&
                            result &&
                            (result.isCorrect ? isSelected : option === result.correctAnswer);
                        const isWrongSelected = isSubmitted && result && isSelected && !result.isCorrect;

                        let borderClass = "border-transparent";
                        let bgClass = "bg-tertiary";
                        let textColor = "text-white";

                        if (isSubmitted && result) {
                            if (isCorrectOption) {
                                borderClass = "border-tertiary";
                                bgClass = "bg-neon";
                                textColor = "text-tertiary";
                            } else if (isWrongSelected) {
                                borderClass = "border-tertiary";
                                bgClass = "bg-red-500";
                                textColor = "text-white";
                            } else {
                                borderClass = "border-transparent";
                                bgClass = "bg-tertiary/20";
                                textColor = "text-white/20";
                            }
                        } else {
                            if (isSelected) {
                                borderClass = "border-secondary";
                                bgClass = "bg-black";
                                textColor = "text-white";
                            } else {
                                borderClass = "border-transparent";
                                bgClass = "bg-tertiary";
                                textColor = "text-white";
                            }
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => !isSubmitted && onSelectAnswer(option)}
                                disabled={isSubmitted}
                                className={`w-full border-2 ${borderClass} ${bgClass} ${textColor} font-semibold py-4 px-6 rounded-xl hover:bg-black transition active:scale-95 cursor-pointer disabled:cursor-not-allowed text-lg`}
                            >
                                {option === "true" ? (lang === 'id' ? "Benar" : "True") : (lang === 'id' ? "Salah" : "False")}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Result Feedback Toast */}
            {showNotification && result && (
                <div
                    className={`fixed top-6 left-[48%] md:left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xs md:max-w-md rounded-md p-4 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 ease-out ${isVisible
                        ? "translate-y-0 opacity-100 scale-100"
                        : "-translate-y-12 opacity-0 scale-95 pointer-events-none"
                        } ${result.isCorrect
                            ? "bg-neon text-secondary border border-tertiary shadow-[0_10px_30px_rgba(38,50,0,0.4)]"
                            : "bg-secondary text-primary border border-neon shadow-[0_10px_30px_rgba(153,27,27,0.4)]"
                        }`}
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        <span className="text-3xl shrink-0">
                            {result.isCorrect ? <PartyIcon /> : result.isTimeout ? "⏰" : "😔"}
                        </span>
                        <div className="min-w-0">
                            <p className="font-bold text-xl leading-tight">
                                {result.isCorrect
                                    ? (lang === 'id' ? "Jawaban Benar!!" : "Correct Answer!!")
                                    : result.isTimeout
                                        ? (lang === 'id' ? "Waktu Habis!" : "Time's Up!")
                                        : (lang === 'id' ? "Kurang Tepat!" : "Incorrect!")}
                            </p>
                            {result.isCorrect && (
                                <p className="text-sm text-secondary font-semibold mt-0.5">
                                    +{result.xpEarned} XP
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}