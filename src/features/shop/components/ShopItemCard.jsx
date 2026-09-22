function ShopItemCard({ item, isPurchasing, onPurchase }) {
  const itemName = item.name?.id || item.name?.en || "Avatar";

  const isOwned = item.isOwned;

  return (
    <div className="flex w-full max-w-[230px] flex-col items-center rounded-lg bg-[#E5FE96] p-2">
      {/* Avatar Image */}
      <div className="flex h-[190px] w-full items-center justify-center rounded-md bg-[#263200]">
        <img
          src={item.imageUrl}
          alt={itemName}
          className="h-[160px] w-[160px] object-contain"
        />
      </div>

      {/* Avatar Information */}
      <div className="flex min-h-[100px] w-full flex-col items-center justify-center gap-1 px-2 text-center">
        <h3 className="text-lg font-medium text-[#263200]">{itemName}</h3>

        <p className="text-sm italic text-[#263200]/70">"Lorem Ipsum"</p>

        {/* Purchase Button */}
        <button
          type="button"
          disabled={isOwned || isPurchasing}
          onClick={() => onPurchase(item)}
          className={`mt-1 flex min-w-[108px] items-center justify-center gap-2 rounded-full border-2 px-4 py-1 text-base font-medium transition ${
            isOwned
              ? "border-[#263200] bg-white text-[#263200]"
              : "border-[#FE7236] bg-white text-[#FE7236] hover:bg-[#FE7236] hover:text-white"
          } ${
            isPurchasing
              ? "cursor-wait opacity-60"
              : isOwned
                ? "cursor-default"
                : "cursor-pointer"
          }`}
        >
          {isOwned ? (
            <>
              <span>✓</span>
              <span>Owned</span>
            </>
          ) : isPurchasing ? (
            "Buying..."
          ) : (
            <>
              <span>◉</span>
              <span>{item.price}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ShopItemCard;
