import CoinIcon from "../../../components/icons/coinIcon";

function ShopModal({
  isOpen,
  type = "error",
  message,
  item,
  onClose,
  onConfirm,
  isConfirming = false,
}) {
  if (!isOpen) {
    return null;
  }

  const isConfirmation = type === "confirmation";
  const isSuccess = type === "success";

  const itemName = item?.name?.id || item?.name?.en || "Avatar";

  const title = isConfirmation
    ? "Konfirmasi Pembelian"
    : isSuccess
      ? "Pembelian Berhasil"
      : "Pembayaran Gagal";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tertiary/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-primary p-6 text-center shadow-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-white">
          {isConfirmation ? "?" : isSuccess ? "✓" : "!"}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-tertiary">{title}</h2>

        {/* Confirmation Item */}
        {isConfirmation && item && (
          <div className="mt-5 rounded-2xl bg-tertiary p-4">
            {/* Item Image */}
            <img
              src={item.imageUrl}
              alt={itemName}
              className="mx-auto h-32 w-32 object-contain"
            />

            {/* Item Name */}
            <h3 className="mt-3 text-lg font-bold text-primary">{itemName}</h3>

            {/* Item Price */}
            <div className="mt-2 flex items-center justify-center gap-2 text-primary">
              <CoinIcon size={20} color="currentColor" />

              <span className="font-semibold">{item.price} Coins</span>
            </div>
          </div>
        )}

        {/* Message */}
        <p className="mt-4 text-base leading-relaxed text-tertiary/80">
          {message ||
            (isConfirmation
              ? "Apakah kamu yakin ingin membeli item ini?"
              : isSuccess
                ? "Item berhasil dibeli dan ditambahkan ke koleksimu."
                : "Pembelian gagal. Silakan coba lagi.")}
        </p>

        {/* Actions */}
        {isConfirmation ? (
          <div className="mt-6 flex justify-center gap-3">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isConfirming}
              className="rounded-full border-2 border-secondary px-6 py-3 font-medium text-secondary transition hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>

            {/* Confirm Button */}
            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirming}
              className="rounded-full bg-secondary px-6 py-3 font-medium text-white transition hover:bg-secondary/80 disabled:cursor-wait disabled:opacity-60"
            >
              {isConfirming ? "Membeli..." : "Beli"}
            </button>
          </div>
        ) : (
          /* Error and Success Button */
          <button
            type="button"
            onClick={onClose}
            className="mt-6 rounded-full bg-secondary px-8 py-3 font-medium text-white transition hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
          >
            {isSuccess ? "Lanjutkan" : "Tutup"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ShopModal;
