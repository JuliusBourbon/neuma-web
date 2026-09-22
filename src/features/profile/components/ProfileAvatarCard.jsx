import ProfileStats from "./ProfileStats";

function ProfileAvatarCard({
  avatar,
  dayStreak,
  rank,
  wordsCollected,
  totalXp,
  currencyBalance,
  onChangeAvatar,
}) {
  return (
    <div className="relative w-full max-w-[480px] overflow-hidden rounded-[28px] shadow-xl">
      {/* Avatar Section */}
      <div className="relative h-[280px] sm:h-[320px] md:h-[350px] overflow-hidden bg-[#E5FE96]">
        {/* Decorative Circle - Top Right */}
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#B6FF00] sm:h-36 sm:w-36" />

        {/* Decorative Circle - Bottom Left */}
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#E8DD83] sm:h-44 sm:w-44" />

        {/* Edit Avatar Button */}
        <button
          type="button"
          onClick={onChangeAvatar}
          aria-label="Ubah avatar"
          title="Ubah avatar"
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#FE7236] text-white shadow-md transition duration-200 hover:scale-110 hover:bg-[#E85F28] focus:outline-none focus:ring-2 focus:ring-[#263200] focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>

        {/* Avatar Background */}
        <div className="absolute left-1/2 top-1/2 flex h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#F5F9D9] shadow-sm sm:h-[240px] sm:w-[240px]">
          <img
            src={avatar}
            alt="User avatar"
            className="h-[140px] w-[140px] object-contain sm:h-[170px] sm:w-[170px] md:h-[190px] md:w-[190px]"
          />
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-[#B6FF00]">
        <ProfileStats
          dayStreak={dayStreak}
          rank={rank}
          wordsCollected={wordsCollected}
          totalXp={totalXp}
          currencyBalance={currencyBalance}
        />
      </div>
    </div>
  );
}

export default ProfileAvatarCard;
