import { useLocation, useNavigate } from "react-router-dom";
import { getText } from "../../../utils/text";
import firefly2 from "../../../assets/onboarding/firefly-2.png";
import firefly4 from "../../../assets/onboarding/firefly-4.png";

export default function ScorePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;

    // Redirect to home when there is no data
    if (!data) {
        return (
            <div className="bg-primary min-h-screen flex flex-col items-center justify-center text-tertiary p-6">
                <div className="bg-white/90 backdrop-blur-md border border-tertiary/20 px-8 py-6 rounded-3xl max-w-md text-center shadow-2xl">
                    <p className="text-base font-bold mb-3">Data skor tidak ditemukan.</p>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="text-sm bg-secondary text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow transition cursor-pointer"
                    >
                        Kembali ke Home
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
    } = data;

    const title = getText(levelTitle) || "Level";

    return (
        <div className="bg-primary min-h-screen flex flex-col items-center justify-center text-tertiary p-6">
            <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center">
                    {isPassed ? `${title} - Selesai!` : `${title} - Belum Berhasil`}
                </h1>
                {/* Result Icon */}
                <div className="text-7xl">
                    {isPassed ?
                        <img src={firefly2} alt="firefly" className="w-40 h-40 object-contain" /> : <img src={firefly4} alt="firefly" className="w-40 h-40 object-contain" />
                    }
                </div>

                {/* Stats Cards */}
                <div className="w-full grid grid-cols-3 gap-3">
                    <div className="rounded-xl p-2 text-center bg-neon">
                        <p className="text-sm text-secondary font-bold">XP</p>
                        <p className="text-2xl font-bold bg-secondary text-neon py-8 rounded-md">
                            {stats.totalXp ?? 0}
                        </p>
                    </div>
                    <div className="rounded-xl p-2 text-center bg-tertiary">
                        <p className="text-sm text-primary font-bold">Coin</p>
                        <p className="text-2xl font-bold bg-primary text-tertiary py-8 rounded-md">
                            {stats.currencyBalance ?? 0}
                        </p>
                    </div>
                    <div className="rounded-xl p-2 text-center bg-secondary">
                        <p className="text-sm text-neon font-bold">Accuracy</p>
                        <p className="text-2xl font-bold bg-neon text-secondary py-8 rounded-md">
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
                        {isPassed ? "Ulangi Level" : "Coba Lagi"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/home")}
                        className="flex-1 bg-secondary text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-600 transition cursor-pointer text-center"
                    >
                        Kembali ke Home
                    </button>
                </div>
            </div>
        </div>
    );
}
