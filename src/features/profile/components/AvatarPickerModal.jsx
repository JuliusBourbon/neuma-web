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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#263200]/70 px-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-[#E5FE96] p-6 shadow-2xl">
        {/* Header Modal */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#263200] sm:text-2xl">
            Choose Your Avatar
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl font-bold leading-none text-[#FE7236] transition hover:scale-110 hover:text-[#E85F28]"
            aria-label="Close avatar picker"
          >
            &times;
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-[#263200]">Loading avatars...</p>
          </div>
        ) : avatars.length === 0 ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-[#263200]">No avatars available.</p>
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
                  className={`relative flex flex-col items-center rounded-2xl border-2 p-3 transition duration-200 ${
                    isSelected
                      ? "border-[#263200] bg-[#B6FF00] shadow-md"
                      : isOwned
                        ? "border-[#D2DD8A] bg-[#F5F9D9] hover:border-[#FE7236] hover:shadow-md"
                        : "cursor-not-allowed border-[#D9DEB8] bg-[#D9DEB8] opacity-60"
                  }`}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#263200] text-xs font-bold text-[#E5FE96]">
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
                  <p className="mt-2 text-center text-sm font-medium text-[#263200]">
                    {avatar.name?.id || avatar.name?.en || "Avatar"}
                  </p>

                  {/* Ownership Status */}
                  {!isOwned && (
                    <span className="mt-1 text-xs font-medium text-[#6B7050]">
                      Locked
                    </span>
                  )}

                  {/* Selected Status */}
                  {isSelected && (
                    <span className="mt-1 text-xs font-bold text-[#263200]">
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
            className="rounded-full bg-[#FE7236] px-6 py-2 font-medium text-white shadow-sm transition hover:bg-[#E85F28] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#263200] focus:ring-offset-2 focus:ring-offset-[#E5FE96]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarPickerModal;
