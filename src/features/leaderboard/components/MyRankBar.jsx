import firefly4 from "../../../assets/onboarding/firefly-4.png";

const getAvatarUrl = (avatar) => {
  if (!avatar || !avatar.imageUrl) return firefly4;
  return avatar.imageUrl.startsWith("http")
    ? avatar.imageUrl
    : `http://localhost:3000${avatar.imageUrl}`;
};

export default function MyRankBar({ myRank, lang }) {
  if (!myRank) return null;

  return (
    <div className="bg-primary backdrop-blur-sm border-t border-tertiary/20 p-4 shrink-0 absolute bottom-0 w-full z-20 text-white">
      <div className="flex justify-between w-full max-w-6xl mx-auto text-lg md:text-2xl bg-tertiary/40 rounded-xl gap-4 items-center py-3 px-4 md:px-6 shadow-lg ring-1 ring-tertiary/30">
        <div className="flex items-center gap-4 md:gap-6">
          <span className="font-bold w-6 md:w-8">#{myRank.rank}</span>
          <div className="bg-tertiary rounded-full p-1 shrink-0 shadow-md">
            <img
              src={getAvatarUrl(myRank.avatar)}
              alt="user-avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
          </div>
          <span
            className="truncate max-w-30 md:max-w-xs font-semibold"
            title={`${myRank.username || (lang === 'id' ? "Anonim" : "Anonymous")} ${lang === 'id' ? "(Anda)" : "(You)"}`}
          >
            {myRank.username || (lang === 'id' ? "Anonim" : "Anonymous")} {lang === 'id' ? "(Anda)" : "(You)"}
          </span>
        </div>
        <div className="flex items-center gap-4 md:gap-8 text-right">
          <span title="Total XP" className="font-bold whitespace-nowrap">
            {myRank.totalXp} xp
          </span>
          <span
            title={lang === 'id' ? "Abjad Terkumpul" : "Alphabet Collected"}
            className="font-bold whitespace-nowrap w-12 md:w-16 text-center"
          >
            {myRank.wordsCollected || 0}/26
          </span>
        </div>
      </div>
    </div>
  );
}
