import firefly4 from "../../../assets/onboarding/firefly-4.png";

const getAvatarUrl = (avatar) => {
  if (!avatar || !avatar.imageUrl) return firefly4;
  return avatar.imageUrl.startsWith("http")
    ? avatar.imageUrl
    : `http://localhost:3000${avatar.imageUrl}`;
};

export default function LeaderboardItem({ user, isMe, lang }) {
  return (
    <div
      className={`flex justify-between text-base md:text-xl rounded-lg gap-4 items-center py-2 md:py-3 px-3 md:px-6 transition-colors ${
        isMe
          ? "bg-tertiary/40 text-white shadow-lg ring-1 ring-tertiary/30"
          : "bg-tertiary/10 hover:bg-tertiary/20"
      }`}
    >
      <div className="flex items-center gap-4 md:gap-6">
        <span className={`font-bold w-6 md:w-8 ${isMe ? "text-white" : ""}`}>
          #{user.rank}
        </span>
        <div
          className={`bg-tertiary rounded-full p-1 shrink-0 ${isMe ? "shadow-md" : ""}`}
        >
          <img
            src={getAvatarUrl(user.avatar)}
            alt="user-avatar"
            className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
          />
        </div>
        <span
          className={`truncate max-w-30 md:max-w-xs ${isMe ? "font-semibold" : ""}`}
          title={isMe ? `${user.username || (lang === 'id' ? "Anonim" : "Anonymous")} ${lang === 'id' ? "(Anda)" : "(You)"}` : (user.username || (lang === 'id' ? "Anonim" : "Anonymous"))}
        >
          {user.username || (lang === 'id' ? "Anonim" : "Anonymous")} {isMe ? (lang === 'id' ? "(Anda)" : "(You)") : ""}
        </span>
      </div>
      <div className="flex items-center gap-4 md:gap-8 text-right">
        <span
          title="Total XP"
          className={`whitespace-nowrap ${isMe ? "font-bold text-white" : "font-semibold"}`}
        >
          {user.totalXp} xp
        </span>
        <span
          title={lang === 'id' ? "Abjad Terkumpul" : "Alphabet Collected"}
          className={`whitespace-nowrap w-12 md:w-16 text-center ${isMe ? "font-bold text-white" : "font-semibold"}`}
        >
          {user.wordsCollected || 0}/26
        </span>
      </div>
    </div>
  );
}
