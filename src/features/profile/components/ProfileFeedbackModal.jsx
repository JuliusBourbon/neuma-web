function ProfileFeedbackModal({
  isOpen,
  type = "error",
  title,
  message,
  onClose,
  onConfirm,
  isConfirming = false,
}) {
  if (!isOpen) {
    return null;
  }

  const isConfirmation = type === "confirmation";
  const isSuccess = type === "success";

  const defaultTitle = isConfirmation
    ? "Konfirmasi"
    : isSuccess
      ? "Berhasil"
      : "Terjadi Kesalahan";

  const defaultMessage = isConfirmation
    ? "Apakah kamu yakin ingin melanjutkan tindakan ini?"
    : isSuccess
      ? "Data berhasil disimpan."
      : "Terjadi kesalahan. Silakan coba lagi.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tertiary/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-primary p-6 text-center shadow-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-white">
          {isConfirmation ? "?" : isSuccess ? "✓" : "!"}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-tertiary">
          {title || defaultTitle}
        </h2>

        {/* Message */}
        <p className="mt-4 text-base leading-relaxed text-tertiary/80">
          {message || defaultMessage}
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
              {isConfirming ? "Memproses..." : "Konfirmasi"}
            </button>
          </div>
        ) : (
          /* Success and Error Button */
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

export default ProfileFeedbackModal;
