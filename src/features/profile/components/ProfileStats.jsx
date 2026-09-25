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
  const statItemClasses =
    "flex items-center justify-center gap-3 text-lg whitespace-nowrap sm:text-xl";

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-6 py-7 text-tertiary sm:gap-x-8 sm:px-8">
      {/* Day Streak */}
      <div className={statItemClasses}>
        <StreakIcon color="#FE7236" />
        <span>{dayStreak} days</span>
      </div>

      {/* Rank */}
      <div className={statItemClasses}>
        <RankIcon color="#FE7236" />
        <span>Rank #{rank}</span>
      </div>

      {/* Total XP */}
      <div className={statItemClasses}>
        <StarIcon color="#FE7236" />
        <span>{totalXp} XP</span>
      </div>

      {/* Capaian Belajar Abjad */}
      <div className={statItemClasses}>
        <BookIcon color="#FE7236" />
        <span>{wordsCollected}/26</span>
      </div>

      {/* Currency */}
      <div className="col-span-2 flex items-center justify-center gap-3">
        <div className="scale-125">
          <CoinIcon color="#FE7236" />
        </div>

        <span className="text-2xl font-semibold">{currencyBalance} coins</span>
      </div>
    </div>
  );
}

export default ProfileStats;
