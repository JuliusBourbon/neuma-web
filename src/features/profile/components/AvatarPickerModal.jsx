function AvatarPickerModal({
  isOpen,
  avatars,
  selectedAvatarId,
  isLoading,
  onClose,
  onSelect,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header Modal */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary">
            Choose Your Avatar
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl font-bold text-secondary transition hover:opacity-70"
            aria-label="Close avatar picker"
          >
            &times;
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-secondary">Loading avatars...</p>
          </div>
        ) : avatars.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-secondary">No avatars available.</p>
          </div>
        ) : (
          /* Avatar List */
          <div className="grid max-h-[420px] grid-cols-2 gap-4 overflow-y-auto p-2 sm:grid-cols-3 md:grid-cols-4">
            {avatars.map((avatar) => {
              const isSelected = avatar.id === selectedAvatarId;
              const isOwned = avatar.isOwned;

              return (
                <button
                  key={avatar.id}
                  type="button"
                  disabled={!isOwned}
                  onClick={() => onSelect(avatar)}
                  className={`relative flex flex-col items-center rounded-xl border-2 p-3 transition ${
                    isSelected
                      ? "border-tertiary bg-tertiary/20"
                      : isOwned
                        ? "border-secondary/20 bg-white hover:border-tertiary"
                        : "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                  }`}
                >
                  {/* Avatar Image */}
                  <img
                    src={avatar.imageUrl}
                    alt={avatar.name?.id || "Avatar"}
                    className="h-20 w-20 object-contain"
                  />

                  {/* Avatar Name */}
                  <p className="mt-2 text-center text-sm font-medium text-secondary">
                    {avatar.name?.id || avatar.name?.en || "Avatar"}
                  </p>

                  {/* Ownership Status */}
                  {!isOwned && (
                    <span className="mt-1 text-xs text-gray-500">Locked</span>
                  )}

                  {isSelected && (
                    <span className="mt-1 text-xs font-bold text-tertiary">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-secondary px-6 py-2 font-medium text-white transition hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarPickerModal;
