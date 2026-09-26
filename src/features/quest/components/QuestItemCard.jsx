import CoinIcon from "../../../components/icons/coinIcon";
import { getText } from "../../../utils/text";

export default function QuestItemCard({ quest, claimingQuestId, handleClaim, lang }) {
    const isClaimed = quest.status === 'claimed';
    const isAchieved = quest.status === 'achieved';
    const title = getText(quest.title, lang);
    const description = getText(quest.description, lang);

    return (
        <div
            className={`flex items-center w-full justify-between px-5 py-4 rounded-2xl shadow-sm border ${isClaimed ? 'bg-yellow-100 border-secondary opacity-80' :
                isAchieved ? 'bg-yellow-100 border-yellow-200 ring ring-secondary' : 'bg-white border-transparent'
                }`}
        >
            <div className="flex flex-col max-w-[70%]">
                <span className={`font-bold text-base md:text-lg ${isClaimed ? 'text-gray-500' : 'text-tertiary'}`}>
                    {title}
                </span>
                <span className={`text-sm mt-1 leading-snug ${isClaimed ? 'text-gray-400' : 'text-gray-600'}`}>
                    {description}
                </span>
                {!isClaimed && !isAchieved && (
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
                        <div
                            className="bg-secondary h-full transition-all duration-500"
                            style={{ width: `${Math.min((quest.currentProgress / quest.targetValue) * 100, 100)}%` }}
                        ></div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-end justify-center shrink-0">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 mb-2">
                    <CoinIcon />
                    <span className="font-bold text-tertiary">{quest.rewardCurrency}</span>
                </div>

                {isClaimed ? (
                    <span className="text-xs font-bold text-secondary px-2 uppercase tracking-wide">{lang === 'id' ? "Selesai" : "Done"}</span>
                ) : isAchieved ? (
                    claimingQuestId === quest.id ? (
                        <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin my-1 mx-4"></div>
                    ) : (
                        <button
                            onClick={() => handleClaim(quest.id)}
                            className="bg-secondary hover:brightness-110 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-secondary/30 cursor-pointer"
                        >
                            {lang === 'id' ? "Klaim!" : "Claim!"}
                        </button>
                    )
                ) : (
                    <span className="text-xs font-bold text-gray-500 px-2">
                        {quest.currentProgress} / {quest.targetValue}
                    </span>
                )}
            </div>
        </div>
    );
}
