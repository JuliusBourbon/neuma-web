import CoinIcon from "../../../components/icons/coinIcon";

function ShopItemCard({ item, isPurchasing, onPurchase }) {
  const itemName = item.name?.id || item.name?.en || "Avatar";
  const isOwned = item.isOwned;

  return (
    <div className="flex w-full max-w-56 flex-col items-center rounded-lg bg-primary p-2">
      {/* Avatar Image */}
      <div className="flex h-48 w-full items-center justify-center rounded-md bg-tertiary">
        <img
          src={item.imageUrl}
          alt={itemName}
          className="h-40 w-40 object-contain"
        />
      </div>

      {/* Avatar Information */}
      <div className="flex min-h-24 w-full flex-col items-center justify-center gap-1 px-2 text-center">
        <h3 className="text-lg font-medium text-tertiary">{itemName}</h3>

        <p className="text-sm italic text-tertiary/70">"Lorem Ipsum"</p>

        {/* Purchase Button */}
        <button
          type="button"
          disabled={isOwned || isPurchasing}
          onClick={() => onPurchase(item)}
          className={`mt-1 flex min-w-28 items-center justify-center gap-2 rounded-full border-2 px-4 py-1 text-base font-medium transition ${
            isOwned
              ? "border-tertiary bg-white text-tertiary"
              : "border-secondary bg-white text-secondary hover:bg-secondary hover:text-white"
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
            "Membeli..."
          ) : (
            <>
              <CoinIcon size={18} color="currentColor" />
              <span>{item.price}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ShopItemCard;
