import BookIcon from "../../../components/icons/bookIcon";
import CoinIcon from "../../../components/icons/coinIcon";
import RankIcon from "../../../components/icons/rankIcon";
import StarIcon from "../../../components/icons/starIcon";
import StreakIcon from "../../../components/icons/streakIcon";

function ProfileStats({
  dayStreak,
  rank,
  wordsCollected,
  totalXp,
  currencyBalance,
}) {
  return (
    <div className="p-8 grid grid-cols-2 gap-8 text-[#263200]">
      {/* Day Streak */}
      <div className="text-xl flex items-center gap-2">
        <StreakIcon color="#FE7236" />
        {dayStreak} days
      </div>

      {/* Rank */}
      <div className="text-xl flex items-center gap-2">
        <RankIcon color="#FE7236" />#{rank}
      </div>

      {/* Total XP */}
      <div className="text-xl flex items-center gap-2">
        <StarIcon color="#FE7236" />
        {totalXp} XP
      </div>

      {/* Capaian Belajar */}
      <div className="text-xl flex items-center gap-2">
        <BookIcon color="#FE7236" />
        {wordsCollected}
      </div>

      {/* Currency */}
      <div className="text-xl flex items-center gap-2">
        <CoinIcon color="#FE7236" />
        {currencyBalance}
      </div>
    </div>
  );
}

export default ProfileStats;
