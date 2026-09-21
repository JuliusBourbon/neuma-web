import { useState, useEffect, useRef } from "react";
import { bisindoClassifier } from "../../../services/ml/bisindoClassifier";
import { Loader2, CameraOff, RefreshCw, CheckCircle2, Send } from "lucide-react";
import { getText } from "../../../utils/text";
import PartyIcon from "../../../components/icons/partyIcon";

const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],        // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],        // Index
    [5, 9], [9, 10], [10, 11], [11, 12],   // Middle
    [9, 13], [13, 14], [14, 15], [15, 16], // Ring
    [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
    [0, 17],                                // Palm base
];

// Load all hint images from src/assets/hint/*.png
const hintImages = import.meta.glob("../../../assets/hint/*.png", { eager: true, import: "default" });

function getHintImage(letter) {
    if (!letter) return null;
    const key = `../../../assets/hint/${letter.toLowerCase()}.png`;
    return hintImages[key] || null;
}

export default function Camera({
    question = null,
    questionId = "",
    targetLetter = "",
    savedAnswer = null,
    onDetectedAnswer,
    onCompleteAnswer,
    onResetAnswer,
    onCameraReady,
    isSubmitted = false,
    result = null,
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const isMountedRef = useRef(true);
    const animationFrameId = useRef(null);
    const lastPredictionTime = useRef(0);
    const holdStartTime = useRef(null);
    const accumulatedHoldMsRef = useRef(0);
    const lastEvalTimeRef = useRef(null);

    // Mode evaluation
    const isSpellingMode =
        question?.options?.mode === "spelling" ||
        (Array.isArray(question?.options?.letters) && question.options.letters.length > 0);

    const spellingLetters = isSpellingMode
        ? question.options.letters.map((l) => String(l).trim().toUpperCase())
        : [];

    // Spelling state
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [completedCards, setCompletedCards] = useState([]);
    const currentCardIndexRef = useRef(0);
    currentCardIndexRef.current = currentCardIndex;
    const cardConfidencesRef = useRef([]);
    const isTransitioningCardRef = useRef(false);

    // Active target letter depending on mode
    const activeTargetLetter = isSpellingMode
        ? spellingLetters[currentCardIndex] || ""
        : (targetLetter ? targetLetter.trim().toUpperCase() : "");

    const activeTargetLetterRef = useRef(activeTargetLetter);
    activeTargetLetterRef.current = activeTargetLetter;

    // Hint Image resolution based on question options
    const isHintEnabled = Boolean(question?.options?.showHint);
    const hintImageSrc = isHintEnabled ? getHintImage(activeTargetLetter) : null;

    // States
    const [statusText, setStatusText] = useState("Inisialisasi Model ML & Kamera...");
    const [isLoadingModel, setIsLoadingModel] = useState(true);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    // Toast notification states & effect
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

    // Prediction states
    const [currentPrediction, setCurrentPrediction] = useState({
        label: "-",
        confidence: 0,
        handDetected: false,
        handsCount: 0,
        detectedHands: [],
        topPredictions: [],
    });
    const [holdProgress, setHoldProgress] = useState(0);
    const [isMatching, setIsMatching] = useState(false);
    const [lockedAnswer, setLockedAnswer] = useState(null);

    // Refs to eliminate stale closures in requestAnimationFrame loop
    const isMatchingRef = useRef(false);
    const lockedAnswerRef = useRef(null);
    const onDetectedAnswerRef = useRef(onDetectedAnswer);
    onDetectedAnswerRef.current = onDetectedAnswer;
    const onCompleteAnswerRef = useRef(onCompleteAnswer);
    onCompleteAnswerRef.current = onCompleteAnswer;
    const onResetAnswerRef = useRef(onResetAnswer);
    onResetAnswerRef.current = onResetAnswer;
    const onCameraReadyRef = useRef(onCameraReady);
    onCameraReadyRef.current = onCameraReady;
    const isSubmittedRef = useRef(isSubmitted);
    isSubmittedRef.current = isSubmitted;

    // Reset or sync locked answer whenever questionId changes
    useEffect(() => {
        if (!isSubmitted) {
            setCurrentCardIndex(0);
            currentCardIndexRef.current = 0;
            setCompletedCards([]);
            cardConfidencesRef.current = [];
            isTransitioningCardRef.current = false;
        }

        if (savedAnswer?.detectedLetter) {
            const locked = {
                label: savedAnswer.detectedLetter,
                confidence: savedAnswer.confidence ?? 0.95,
            };
            setLockedAnswer(locked);
            lockedAnswerRef.current = locked;
            if (isSpellingMode) {
                setCompletedCards(spellingLetters.map((_, i) => i));
                setCurrentCardIndex(spellingLetters.length);
            }
        } else if (!isSubmitted) {
            setLockedAnswer(null);
            lockedAnswerRef.current = null;
        }

        setHoldProgress(0);
        accumulatedHoldMsRef.current = 0;
        setCurrentPrediction({
            label: "-",
            confidence: 0,
            handDetected: false,
            handsCount: 0,
            detectedHands: [],
            topPredictions: [],
        });
    }, [questionId]);

    // Keep all cards marked completed in neon when isSubmitted is true
    useEffect(() => {
        if (isSubmitted && isSpellingMode) {
            setCompletedCards(spellingLetters.map((_, i) => i));
            setCurrentCardIndex(spellingLetters.length);
        }
    }, [isSubmitted, isSpellingMode, spellingLetters.length]);

    // L/R swap TRUE by default
    const swapHandsRef = useRef(true);

    // Initialize ML Models
    useEffect(() => {
        isMountedRef.current = true;

        const initML = async () => {
            try {
                setIsLoadingModel(true);
                await bisindoClassifier.initialize((msg) => {
                    if (isMountedRef.current) setStatusText(msg);
                });
                if (isMountedRef.current) {
                    setIsLoadingModel(false);
                    setStatusText("Model siap! Menghubungkan ke kamera...");
                    startCamera();
                }
            } catch (err) {
                if (isMountedRef.current) {
                    setIsLoadingModel(false);
                    setCameraError("Gagal memuat model: " + (err.message || "Error WebAssembly/WASM"));
                }
            }
        };

        initML();

        return () => {
            isMountedRef.current = false;
            stopCamera();
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    // Stop ML prediction loop when answer has been submitted
    useEffect(() => {
        if (isSubmitted) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
    }, [isSubmitted]);

    // Start Camera
    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user",
                },
                audio: false,
            });

            // If component was unmounted while waiting for userMedia, stop tracks immediately
            if (!isMountedRef.current) {
                stream.getTracks().forEach((t) => t.stop());
                return;
            }

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    if (!isMountedRef.current) return;
                    videoRef.current.play().catch(() => {});
                    setCameraActive(true);
                    setStatusText("Kamera aktif. Tunjukkan tangan Anda.");
                    startPredictionLoop();
                    // Signal parent that ML model + camera are both ready to use
                    onCameraReadyRef.current?.();
                };
            }
        } catch (err) {
            if (!isMountedRef.current) return;
            setCameraError(
                err.name === "NotAllowedError"
                    ? "Izin akses kamera ditolak. Berikan izin di browser untuk melanjutkan."
                    : "Tidak dapat mengakses kamera: " + err.message
            );
        }
    };

    // Stop Camera
    const stopCamera = () => {
        if (streamRef.current) {
            try {
                const tracks = streamRef.current.getTracks() || [];
                tracks.forEach((t) => t.stop());
            } catch (e) {
                console.warn("Error stopping stream tracks:", e);
            }
            streamRef.current = null;
        }
        if (videoRef.current) {
            try {
                if (videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks?.() || [];
                    tracks.forEach((t) => t.stop());
                }
            } catch (e) {
                console.warn("Error stopping video srcObject tracks:", e);
            }
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    // Main Prediction Loop
    const startPredictionLoop = () => {
        const detectFrame = async () => {
            if (!isMountedRef.current || isSubmittedRef.current) return;
            if (!videoRef.current || !canvasRef.current) {
                animationFrameId.current = requestAnimationFrame(detectFrame);
                return;
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (video.readyState >= 2) {
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const now = performance.now();
                const landmarksResult = bisindoClassifier.detectHands(video, now);

                if (landmarksResult && landmarksResult.landmarks && landmarksResult.landmarks.length > 0) {
                    // drawHandLandmarks(ctx, landmarksResult.landmarks, canvas.width, canvas.height);

                    // Throttle ONNX prediction to ~15-20 FPS
                    if (now - lastPredictionTime.current > 50) {
                        lastPredictionTime.current = now;
                        try {
                            const pred = await bisindoClassifier.predictFromLandmarks(landmarksResult, {
                                swapHands: swapHandsRef.current,
                            });
                            if (pred) {
                                setCurrentPrediction(pred);
                                evaluateHoldProgress(pred);
                            }
                        } catch (err) {
                            console.warn("Prediction frame error:", err);
                        }
                    }
                } else {
                    setCurrentPrediction(prev => {
                        if (!prev.handDetected) return prev;
                        return {
                            label: "-",
                            confidence: 0,
                            handDetected: false,
                        };
                    });
                    accumulatedHoldMsRef.current = 0;
                    setHoldProgress(0);
                }
            }

            animationFrameId.current = requestAnimationFrame(detectFrame);
        };

        animationFrameId.current = requestAnimationFrame(detectFrame);
    };

    // Hand Skeleton
    const drawHandLandmarks = (ctx, allHands, width, height) => {
        ctx.save();

        allHands.forEach((handLandmarks) => {
            // Draw connections (bones)
            ctx.strokeStyle = "#FE7236";
            ctx.lineWidth = 3;
            HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
                const p1 = handLandmarks[startIdx];
                const p2 = handLandmarks[endIdx];
                if (p1 && p2) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x * width, p1.y * height);
                    ctx.lineTo(p2.x * width, p2.y * height);
                    ctx.stroke();
                }
            });

            // Draw landmark points
            handLandmarks.forEach((pt, index) => {
                const isTip = [4, 8, 12, 16, 20].includes(index);
                ctx.beginPath();
                ctx.arc(pt.x * width, pt.y * height, isTip ? 6 : 4, 0, 2 * Math.PI);
                ctx.fillStyle = isTip ? "#C2FF00" : "#FE7236";
                ctx.fill();
                ctx.strokeStyle = "#263200";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });
        });

        ctx.restore();
    };

    // Hold Meter Evaluation
    const evaluateHoldProgress = (pred) => {
        if (isSubmittedRef.current || lockedAnswerRef.current || isTransitioningCardRef.current) return;

        if (!pred || !pred.label) {
            lastEvalTimeRef.current = null;
            return;
        }

        const cleanTarget = (activeTargetLetterRef.current || "").trim().toUpperCase();
        let isMatch = false;
        let meetsConfidence = false;

        if (cleanTarget && pred.topPredictions && pred.topPredictions.length > 0) {
            // Top 3 Matching & Lowered Threshold
            const top3 = pred.topPredictions.slice(0, 3);
            const matchInTop3 = top3.find(p => (p.label || "").trim().toUpperCase() === cleanTarget);

            if (matchInTop3) {
                const isRank1 = matchInTop3.label === top3[0].label;
                if ((isRank1 && matchInTop3.confidence >= 0.40) || (!isRank1 && matchInTop3.confidence >= 0.20)) {
                    isMatch = true;
                    meetsConfidence = true;
                }
            }
        } else {
            isMatch = true;
            meetsConfidence = pred.confidence >= 0.85;
        }

        const now = Date.now();

        if (isMatch && meetsConfidence) {
            if (lastEvalTimeRef.current) {
                accumulatedHoldMsRef.current += (now - lastEvalTimeRef.current);
            }
        }

        const currentMatch = isMatch && meetsConfidence;
        if (isMatchingRef.current !== currentMatch) {
            isMatchingRef.current = currentMatch;
            setIsMatching(currentMatch);
        }

        lastEvalTimeRef.current = now;

        const REQUIRED_HOLD_MS = isSpellingMode ? 2000 : 3000;
        const progress = Math.min(100, Math.round((accumulatedHoldMsRef.current / REQUIRED_HOLD_MS) * 100));
        setHoldProgress(progress);

        if (progress >= 100 && !lockedAnswerRef.current && !isTransitioningCardRef.current) {
            if (isSpellingMode) {
                isTransitioningCardRef.current = true;
                const cardIdx = currentCardIndexRef.current;
                cardConfidencesRef.current[cardIdx] = pred.confidence;
                setCompletedCards((prev) => [...new Set([...prev, cardIdx])]);

                const nextIndex = cardIdx + 1;
                if (nextIndex < spellingLetters.length) {
                    // Brief transition delay so completion of this card is visually confirmed
                    setTimeout(() => {
                        currentCardIndexRef.current = nextIndex;
                        setCurrentCardIndex(nextIndex);
                        accumulatedHoldMsRef.current = 0;
                        setHoldProgress(0);
                        isTransitioningCardRef.current = false;
                    }, 400);
                } else {
                    // Auto submit word when all cards completed
                    const fullWord = spellingLetters.join("");
                    const avgConf =
                        cardConfidencesRef.current.reduce((a, b) => a + b, 0) /
                        (cardConfidencesRef.current.length || 1);
                    const locked = {
                        label: fullWord,
                        confidence: avgConf,
                    };
                    setLockedAnswer(locked);
                    lockedAnswerRef.current = locked;
                    onDetectedAnswerRef.current?.(fullWord, avgConf);
                    onCompleteAnswerRef.current?.({
                        detectedLetter: fullWord,
                        spelledWord: fullWord,
                        confidence: avgConf,
                    });
                    isTransitioningCardRef.current = false;
                }
            } else {
                // Auto submit single letter when hold completed
                const locked = {
                    label: pred.label,
                    confidence: pred.confidence,
                };
                setLockedAnswer(locked);
                lockedAnswerRef.current = locked;
                onDetectedAnswerRef.current?.(pred.label, pred.confidence);
                onCompleteAnswerRef.current?.({
                    detectedLetter: pred.label,
                    spelledWord: pred.label,
                    confidence: pred.confidence,
                });
            }
        }
    };

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {isSpellingMode ? (
                <div className="w-full flex flex-col items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-center max-w-2xl text-tertiary">
                        {question?.questionText
                            ? getText(question.questionText)
                            : `Eja kata '${spellingLetters.join("")}'`}
                    </h1>

                    {/* Spelling Cards */}
                    <div className="flex items-center gap-3 sm:gap-4 justify-center my-1 flex-wrap">
                        {spellingLetters.map((letter, idx) => {
                            const isCompleted = isSubmitted
                                ? (result ? result.isCorrect : true) || completedCards.includes(idx)
                                : completedCards.includes(idx);
                            const isActive = !isSubmitted && idx === currentCardIndex && !isCompleted;

                            if (isCompleted) {
                                return (
                                    <div
                                        key={idx}
                                        className="relative flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-20 bg-neon text-tertiary font-extrabold text-2xl sm:text-3xl rounded-xl border-2 border-tertiary shadow-[0_0_15px_rgba(194,255,0,0.6)] transition-all duration-300 scale-100"
                                    >
                                        <span>{letter}</span>
                                        <span className="absolute -top-2 -right-2 bg-tertiary text-neon rounded-full p-0.5 shadow">
                                            <CheckCircle2 size={16} />
                                        </span>
                                    </div>
                                );
                            }

                            if (isActive) {
                                return (
                                    <div
                                        key={idx}
                                        className="relative flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-20 bg-black text-white font-extrabold text-2xl sm:text-3xl rounded-xl border-2 border-secondary ring-4 ring-secondary/40 shadow-2xl transition-all duration-300 scale-105"
                                    >
                                        <span>{letter}</span>
                                        {/* Progress bar */}
                                        <div className="absolute bottom-1.5 left-2 right-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-secondary transition-all duration-75"
                                                style={{ width: `${holdProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-20 bg-secondary/20 text-tertiary/40 font-bold text-2xl sm:text-3xl rounded-xl border border-secondary/30 transition-all duration-300"
                                >
                                    <span>{letter}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <h1 className="text-2xl font-bold text-center max-w-2xl text-tertiary">
                    {question?.questionText
                        ? getText(question.questionText)
                        : `Let's try to make the letter `}
                    {!question?.questionText && (
                        <span className="text-secondary">{activeTargetLetter || "Bebas"}</span>
                    )}
                </h1>
            )}

            {/* Camera View */}
            <div className={`relative w-full max-w-3xl h-[60vh] ${isSpellingMode ? 'lg:max-h-[50vh]' : 'lg:max-h-[60vh]'} rounded-xl overflow-hidden shadow-xl border-2 border-tertiary/20 bg-black aspect-4/3`}>
                {cameraError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-tertiary/90 text-white p-6 text-center">
                        <CameraOff size={48} className="text-red-400 mb-3" />
                        <h4 className="font-bold text-lg mb-2">Kamera Tidak Dapat Digunakan</h4>
                        <p className="text-sm text-white/70 max-w-sm mb-4">{cameraError}</p>
                        <button
                            type="button"
                            onClick={startCamera}
                            className="bg-secondary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:brightness-110 transition cursor-pointer flex items-center gap-2"
                        >
                            <RefreshCw size={14} />
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Video (mirrored) & Canvas overlay */}
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ transform: "scaleX(-1)" }}
                            playsInline
                            muted
                            autoPlay
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                            style={{ transform: "scaleX(-1)" }}
                        />

                        {/* HUD Overlay for Prediction info */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
                            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white">
                                <div className="text-xs opacity-70">Huruf Terdeteksi</div>
                                <div className="text-2xl font-black leading-tight">{currentPrediction.label}</div>
                                {currentPrediction.topPredictions && currentPrediction.topPredictions.length > 1 && (
                                    <div className="mt-1 pt-1 border-t border-white/20 space-y-0.5">
                                        {currentPrediction.topPredictions.slice(0, 3).map((tp) => (
                                            <div
                                                key={tp.label}
                                                className={`text-[10px] flex justify-between gap-3 ${tp.label === activeTargetLetter ? "text-neon font-bold" : "text-white/60"
                                                    }`}
                                            >
                                                <span>{tp.label}</span>
                                                <span>{(tp.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hint & Hold Progress Bar */}
                        {activeTargetLetter && !lockedAnswer && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none flex flex-col items-center gap-3">
                                {/* Hint Image */}
                                {hintImageSrc && (
                                    <img
                                        src={hintImageSrc}
                                        alt={`Hint Isyarat ${activeTargetLetter}`}
                                        className={`w-80 h-80 object-contain drop-shadow-xl pointer-events-none mix-blend-multiply transition-opacity duration-300 ${isMatching ? "opacity-10" : "opacity-70"}`}
                                    />
                                )}

                                <div className="bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 w-full">
                                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-100 ease-out"
                                            style={{
                                                width: `${holdProgress}%`,
                                                backgroundColor: holdProgress >= 100 ? "#22c55e" : "#C2FF00",
                                            }}
                                        />
                                    </div>
                                    <p className="text-white text-xs mt-1 text-center font-medium">
                                        {isSpellingMode ? (
                                            holdProgress > 0 ? (
                                                `Tahan kartu ${currentCardIndex + 1}/${spellingLetters.length} (Huruf ${activeTargetLetter})... ${holdProgress}%`
                                            ) : (
                                                `Peragakan huruf ke-${currentCardIndex + 1}: ${activeTargetLetter} (Tahan 2 detik)`
                                            )
                                        ) : (
                                            holdProgress > 0 ? (
                                                `Tahan gestur huruf ${activeTargetLetter}... (${holdProgress}%)`
                                            ) : (
                                                `Bentuk isyarat huruf ${activeTargetLetter} dan tahan posisi (3 detik)`
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Result Toast */}
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
                            {result.isCorrect ? <PartyIcon /> : "⏰"}
                        </span>
                        <div className="min-w-0">
                            <p className="font-bold text-xl leading-tight">
                                {result.isCorrect ? "Jawaban Benar!!" : "Waktu Habis!"}
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