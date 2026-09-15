import BookIcon from '../../../components/icons/bookIcon';
import CoinIcon from '../../../components/icons/coinIcon';
import RankIcon from '../../../components/icons/rankIcon';
import firefly2 from "../../../assets/onboarding/firefly-2.png";
import StreakIcon from '../../../components/icons/streakIcon';

export default function UserStats({
    alphabet = '01/26',
    coins = 10,
    rank = 1,
    streak = 1,
    avatar = null,
    className = '',
}) {
    return (
        <div
            className={`inline-flex items-center select-none ${className}`}
        >
            {/* Circle */}
            <div className="relative z-10 -mr-3 flex items-center justify-center w-20 h-20 rounded-full bg-neon p-1.5 shadow-sm">
                <div className="w-full h-full rounded-full bg-[#202D04] flex items-center justify-center overflow-hidden border border-[#263200]">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img src={firefly2} alt="" />
                    )}
                </div>
            </div>

            {/* Square */}
            <div className="flex items-center h-15 bg-neon pl-6 pr-6 py-2 rounded-r-2xl sm:rounded-r-3xl gap-10">
                {/* Alphabet / Words Collected */}
                <div className="flex flex-col items-center justify-center min-w-9">
                    <BookIcon size={24} color="#FE7236" />
                    <span className="text-xs sm:text-sm font-bold text-tertiary tracking-tight mt-0.5">
                        {alphabet}
                    </span>
                </div>

                {/* Coins */}
                <div className="flex flex-col items-center justify-center min-w-7">
                    <CoinIcon size={24} color="#FE7236" />
                    <span className="text-xs sm:text-sm font-bold text-tertiary tracking-tight mt-0.5">
                        {coins}
                    </span>
                </div>

                {/* Rank */}
                <div className="flex flex-col items-center justify-center min-w-6">
                    <RankIcon size={24} color="#FE7236" />
                    <span className="text-xs sm:text-sm font-bold text-tertiary tracking-tight mt-0.5">
                        {rank}
                    </span>
                </div>

                {/* Streak / Flame */}
                <div className="flex flex-col items-center justify-center min-w-6">
                    <StreakIcon size={24} color="#FE7236" active={streak > 0} />
                    <span className="text-xs sm:text-sm font-bold text-tertiary tracking-tight mt-0.5">
                        {streak}
                    </span>
                </div>
            </div>
        </div>
    );
}
