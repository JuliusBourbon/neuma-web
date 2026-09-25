function ShopErrorModal({ isOpen, message, onClose, lang = 'id' }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tertiary/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-primary p-6 text-center shadow-2xl">
        {/* Icon Error */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-white">
          !
        </div>

        {/* Judul */}
        <h2 className="text-2xl font-bold text-tertiary">
          {lang === 'id' ? "Pembayaran Gagal" : "Payment Failed"}
        </h2>

        {/* Message */}
        <p className="mt-3 text-base leading-relaxed text-tertiary/80">
          {message}
        </p>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full bg-secondary px-8 py-3 font-medium text-white transition hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2"
        >
          {lang === 'id' ? "Tutup" : "Close"}
        </button>
      </div>
    </div>
  );
}

export default ShopErrorModal;
