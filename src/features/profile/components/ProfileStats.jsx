function ProfileStats({ dayStreak, wordsCollected, totalXp, currencyBalance }) {
  return (
    <div className="p-8 grid grid-cols-2 gap-8 text-[#263200]">
      {/* Day Streak */}
      <div className="text-xl">🔥 {dayStreak} days</div>

      {/* Words Collected */}
      <div className="text-xl">📖 {wordsCollected}</div>

      {/* Total XP */}
      <div className="text-xl">⭐ {totalXp} XP</div>

      {/* Currency */}
      <div className="text-xl">🪙 {currencyBalance}</div>
    </div>
  );
}

export default ProfileStats;
