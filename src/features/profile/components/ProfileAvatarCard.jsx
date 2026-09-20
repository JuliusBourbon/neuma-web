import ProfileStats from "./ProfileStats";

function ProfileAvatarCard({
  avatar,
  dayStreak,
  wordsCollected,
  totalXp,
  currencyBalance,
}) {
  return (
    <div className="w-full max-w-[480px] bg-[#B6FF00] rounded-md overflow-hidden">
      {/* Avatar */}
      <div className="h-[400px] border-8 border-[#B6FF00] flex items-center justify-center">
        <img
          src={avatar}
          alt="User avatar"
          className="w-[220px] h-[220px] object-contain"
        />
      </div>

      {/* Statistics */}
      <ProfileStats
        dayStreak={dayStreak}
        wordsCollected={wordsCollected}
        totalXp={totalXp}
        currencyBalance={currencyBalance}
      />
    </div>
  );
}

export default ProfileAvatarCard;
