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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-tertiary/70 px-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-primary p-6 shadow-2xl">
        {/* Header Modal */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-tertiary sm:text-2xl">
            Choose Your Avatar
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl font-bold leading-none text-secondary transition hover:scale-110 hover:text-orange-600"
            aria-label="Close avatar picker"
          >
            &times;
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-50 items-center justify-center">
            <p className="text-tertiary">Loading avatars...</p>
          </div>
        ) : avatars.length === 0 ? (
          <div className="flex min-h-50 items-center justify-center">
            <p className="text-tertiary">No avatars available.</p>
          </div>
        ) : (
          /* Avatar List */
          <div className="grid max-h-105 grid-cols-2 gap-4 overflow-y-auto p-2 sm:grid-cols-3 md:grid-cols-4">
            {avatars.map((avatar) => {
              const isSelected = avatar.id === selectedAvatarId;
              const isOwned = avatar.isOwned;

              return (
                <button
                  key={avatar.id}
                  type="button"
                  disabled={!isOwned}
                  onClick={() => onSelect(avatar)}
                  className={`relative flex flex-col items-center rounded-2xl border-2 p-3 transition duration-200 ${
                    isSelected
                      ? "border-tertiary bg-lime-400 shadow-md"
                      : isOwned
                        ? "border-lime-200 bg-lime-50 hover:border-secondary hover:shadow-md"
                        : "cursor-not-allowed border-lime-200 bg-lime-200 opacity-60"
                  }`}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-xs font-bold text-primary">
                      ✓
                    </div>
                  )}

                  {/* Avatar Image */}
                  <div className="flex h-20 w-20 items-center justify-center">
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name?.id || avatar.name?.en || "Avatar"}
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Avatar Name */}
                  <p className="mt-2 text-center text-sm font-medium text-tertiary">
                    {avatar.name?.id || avatar.name?.en || "Avatar"}
                  </p>

                  {/* Ownership Status */}
                  {!isOwned && (
                    <span className="mt-1 text-xs font-medium text-stone-500">
                      Locked
                    </span>
                  )}

                  {/* Selected Status */}
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
            className="rounded-full bg-secondary px-6 py-2 font-medium text-white shadow-sm transition hover:bg-orange-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-tertiary focus:ring-offset-2 focus:ring-offset-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarPickerModal;
