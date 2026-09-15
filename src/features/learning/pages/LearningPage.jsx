import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LearningPage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const materials = [
        {
            type: "material",
            letter: "A",
            title: "Huruf A",
            description:
                "Huruf A dalam BISINDO diperagakan dengan mengepalkan satu tangan dan posisi ibu jari tegak lurus di samping jari telunjuk.",
            tips: "Pastikan ibu jari tidak menekuk ke dalam telapak tangan.",
            visualSymbol: "✊👍",
        },
        {
            type: "material",
            letter: "B",
            title: "Huruf B",
            description:
                "Huruf B diperagakan dengan membuka kedua tangan tegak lurus ke atas dengan telapak tangan menghadap ke depan dan jari-jari rapat.",
            tips: "Posisikan keempat jari tegak lurus sejajar tanpa celah.",
            visualSymbol: "✋",
        },
        {
            type: "material",
            letter: "C",
            title: "Huruf C",
            description:
                "Huruf C diperagakan dengan melengkungkan seluruh jari membentuk setengah lingkaran menyerupai bentuk huruf C.",
            tips: "Bentuk cekungan tangan menghadap ke samping agar lekukan huruf C terlihat jelas oleh lawan bicara.",
            visualSymbol: "🫳",
        },
        {
            type: "quiz",
            title: "Kuis Cepat: Huruf A",
            question: "Manakah bentuk tangan yang benar untuk memperagakan huruf 'A' dalam BISINDO?",
            options: [
                {
                    id: "a",
                    text: "Mengepalkan tangan dengan ibu jari tegak di samping telunjuk",
                    correct: true,
                },
                {
                    id: "b",
                    text: "Membuka seluruh telapak tangan menghadap ke depan",
                    correct: false,
                },
                {
                    id: "c",
                    text: "Melengkungkan seluruh jari membentuk setengah lingkaran C",
                    correct: false,
                },
            ],
        },
    ];

    const totalSteps = materials.length;
    const currentItem = materials[currentStep];

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
            setSelectedAnswer(null);
            setIsAnswerSubmitted(false);
        } else {
            setIsFinished(true);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
            setSelectedAnswer(null);
            setIsAnswerSubmitted(false);
        }
    };

    const handleSelectOption = (option) => {
        if (isAnswerSubmitted) return;
        setSelectedAnswer(option);
        setIsAnswerSubmitted(true);
    };

    const handleRestart = () => {
        setCurrentStep(0);
        setSelectedAnswer(null);
        setIsAnswerSubmitted(false);
        setIsFinished(false);
    };

    return (
        <div className="bg-primary min-h-screen flex flex-col text-tertiary">
            {/* Top Navigation Bar */}
            <header className="w-full max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white text-tertiary font-semibold text-sm shadow-sm transition active:scale-95 cursor-pointer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Kembali
                </button>

                {/* Progress Indicator */}
                <div className="flex-1 max-w-xs mx-6">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-tertiary/70">
                        <span>Langkah {currentStep + 1} dari {totalSteps}</span>
                        <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
                    </div>
                    <div className="w-full bg-tertiary/20 h-3 rounded-full overflow-hidden">
                        <div
                            className="bg-secondary h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-tertiary text-white text-xs font-bold uppercase tracking-wider">
                    Level 1
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-xl">
                    {!isFinished ? (
                        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-tertiary/10 transition-all">
                            {currentItem.type === "material" ? (
                                <div className="flex flex-col items-center text-center">
                                    {/* Letter badge / visual representation */}
                                    <div className="w-32 h-32 rounded-3xl bg-primary/40 border-2 border-secondary/30 flex flex-col items-center justify-center mb-6 shadow-inner">
                                        <span className="text-5xl font-black text-secondary tracking-tight">
                                            {currentItem.letter}
                                        </span>
                                        <span className="text-2xl mt-1">{currentItem.visualSymbol}</span>
                                    </div>

                                    <h2 className="text-3xl font-extrabold text-tertiary mb-3">
                                        {currentItem.title}
                                    </h2>

                                    <p className="text-base sm:text-lg text-tertiary/80 leading-relaxed max-w-md mb-6">
                                        {currentItem.description}
                                    </p>

                                    {/* Tips Card */}
                                    <div className="w-full bg-primary/25 rounded-2xl p-4 border border-tertiary/10 text-left flex items-start gap-3">
                                        <div className="p-1.5 rounded-full bg-secondary text-white shrink-0 mt-0.5">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-tertiary uppercase tracking-wider block">
                                                Tips Praktik:
                                            </span>
                                            <span className="text-sm text-tertiary/80">
                                                {currentItem.tips}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Quiz Question */
                                <div className="flex flex-col text-left">
                                    <span className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                                        Kuis Penguatan
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-tertiary mb-6">
                                        {currentItem.question}
                                    </h3>

                                    <div className="flex flex-col gap-3">
                                        {currentItem.options.map((opt) => {
                                            const isSelected = selectedAnswer?.id === opt.id;
                                            let btnClasses =
                                                "w-full text-left p-4 rounded-2xl border-2 font-medium transition cursor-pointer flex items-center justify-between ";

                                            if (!isAnswerSubmitted) {
                                                btnClasses +=
                                                    "border-tertiary/15 hover:border-secondary hover:bg-primary/20 bg-white text-tertiary";
                                            } else if (opt.correct) {
                                                btnClasses +=
                                                    "border-green-500 bg-green-50 text-green-800";
                                            } else if (isSelected && !opt.correct) {
                                                btnClasses +=
                                                    "border-red-500 bg-red-50 text-red-800";
                                            } else {
                                                btnClasses +=
                                                    "border-tertiary/10 bg-gray-50 text-tertiary/50 opacity-60";
                                            }

                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => handleSelectOption(opt)}
                                                    className={btnClasses}
                                                >
                                                    <span className="text-sm sm:text-base">{opt.text}</span>
                                                    {isAnswerSubmitted && opt.correct && (
                                                        <span className="text-green-600 font-bold ml-2">✓</span>
                                                    )}
                                                    {isAnswerSubmitted && isSelected && !opt.correct && (
                                                        <span className="text-red-600 font-bold ml-2">✕</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Feedback message */}
                                    {isAnswerSubmitted && (
                                        <div
                                            className={`mt-4 p-3 rounded-xl text-sm font-semibold text-center ${
                                                selectedAnswer?.correct
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {selectedAnswer?.correct
                                                ? "Benar sekali! Jawaban kamu tepat."
                                                : "Kurang tepat, tapi jangan menyerah!"}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Bottom Step Actions */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-tertiary/10">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                    className="px-6 py-2.5 rounded-full border border-tertiary/20 text-tertiary font-semibold text-sm hover:bg-tertiary/5 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                                >
                                    Sebelumnya
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={
                                        currentItem.type === "quiz" && !isAnswerSubmitted
                                    }
                                    className="px-8 py-2.5 rounded-full bg-secondary text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {currentStep === totalSteps - 1 ? "Selesaikan" : "Selanjutnya"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Selesai / Completed Screen */
                        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-tertiary/10 text-center animate-in fade-in zoom-in-95">
                            <div className="w-24 h-24 mx-auto rounded-full bg-primary/50 flex items-center justify-center text-4xl mb-6 shadow-inner">
                                🎉
                            </div>

                            <h2 className="text-3xl font-extrabold text-tertiary mb-2">
                                Hebat! Level 1 Selesai
                            </h2>
                            <p className="text-tertiary/75 text-base max-w-sm mx-auto mb-6">
                                Kamu telah berhasil mempelajari dasar alfabet isyarat BISINDO untuk huruf A, B, dan C!
                            </p>

                            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-bold text-sm mb-8">
                                <span>⭐</span>
                                <span>+20 Poin XP Diperoleh</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    type="button"
                                    onClick={handleRestart}
                                    className="px-6 py-3 rounded-xl border border-tertiary/20 text-tertiary font-bold text-sm hover:bg-tertiary/5 transition cursor-pointer"
                                >
                                    Ulangi Materi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate("/home")}
                                    className="px-8 py-3 rounded-xl bg-secondary text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
                                >
                                    Kembali ke Beranda
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
