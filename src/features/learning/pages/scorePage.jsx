import { useLocation, useNavigate } from "react-router-dom";
import { getText } from "../../../utils/text";
import firefly2 from "../../../assets/onboarding/firefly-2.png";
import firefly4 from "../../../assets/onboarding/firefly-4.png";

import { useState } from "react";

export default function ScorePage() {
    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
            return {};
        }
    });
    const lang = user?.preferredLanguage || 'id';

    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;

    // Redirect to home when there is no data
    if (!data) {
        return (
            <div className="bg-primary min-h-screen flex flex-col items-center justify-center text-tertiary p-6">
                <div className="bg-white/90 backdrop-blur-md border border-tertiary/20 px-8 py-6 rounded-3xl max-w-md text-center shadow-2xl">
                    <p className="text-base font-bold mb-3">{lang === 'id' ? "Data skor tidak ditemukan." : "Score data not found."}</p>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="text-sm bg-secondary text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow transition cursor-pointer"
                    >
                        {lang === 'id' ? "Kembali ke Home" : "Back to Home"}
                    </button>
                </div>
            </div>
        );
    }

    const {
        levelId,
        levelTitle,
        scorePercentage = 0,
        isPassed = false,
        correctCount = 0,
        totalQuestions = 0,
        stats,
        coinsEarned = 0,
    } = data;

    const title = getText(levelTitle, lang) || "Level";

    return (
        <div className="bg-primary min-h-screen flex flex-col items-center justify-center text-tertiary p-3 md:p-6">
            <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center">
                    {isPassed ? `${title} - ${lang === 'id' ? "Selesai!" : "Completed!"}` : `${title} - ${lang === 'id' ? "Belum Berhasil" : "Not Passed"}`}
                </h1>
                {/* Result Icon */}
                <div className="text-7xl">
                    {isPassed ?
                        <img src={firefly2} alt="firefly" className="w-40 h-40 object-contain" /> : <img src={firefly4} alt="firefly" className="w-40 h-40 object-contain" />
                    }
                </div>

                {/* Stats Cards */}
                <div className="w-full grid grid-cols-3 gap-3">
                    <div className="rounded-xl p-2 text-center bg-tertiary flex flex-col gap-1">
                        <p className="text-sm text-primary font-bold">XP</p>
                        <p className="text-2xl font-bold bg-primary text-tertiary py-8 rounded-md">
                            +{data.xpEarned ?? stats?.xpEarned ?? 0}
                        </p>
                    </div>
                    <div className="rounded-xl p-2 text-center bg-tertiary flex flex-col gap-1">
                        <p className="text-sm text-primary font-bold">Coin</p>
                        <p className="text-2xl font-bold bg-primary text-tertiary py-8 rounded-md">
                            +{coinsEarned}
                        </p>
                    </div>
                    <div className="rounded-xl p-2 text-center bg-tertiary flex flex-col gap-1">
                        <p className="text-sm text-primary font-bold">Accuracy</p>
                        <p className="text-2xl font-bold bg-primary text-tertiary py-8 rounded-md">
                            {scorePercentage}%
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => navigate(`/learning?levelId=${levelId}`)}
                        className="flex-1 bg-tertiary text-white py-3 px-6 rounded-xl font-semibold hover:bg-black transition cursor-pointer text-center"
                    >
                        {isPassed ? (lang === 'id' ? "Ulangi Level" : "Retry Level") : (lang === 'id' ? "Coba Lagi" : "Try Again")}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="flex-1 bg-secondary text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition cursor-pointer text-center"
                    >
                        {lang === 'id' ? "Kembali ke Home" : "Back to Home"}
                    </button>
                </div>
            </div>
        </div>
    );
}
