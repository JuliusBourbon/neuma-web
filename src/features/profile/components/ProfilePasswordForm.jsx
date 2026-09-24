import { useState } from "react";
import FillRoundedButton from "../../../components/common/fillRoundedButton";

function ProfilePasswordForm({ hasPassword = false, onCancel, onSubmit }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const inputClasses = `
    box-border
    h-12
    w-full
    rounded-md
    border
    border-[#D6D6D6]
    bg-white
    px-4
    py-3
    text-base
    leading-normal
    text-[#263200]
    placeholder:text-[#8C9A54]
    outline-none
    transition
    duration-200
    hover:border-[#FE7236]/60
    focus:border-[#FE7236]
    focus:ring-2
    focus:ring-[#FE7236]/25
  `;

  const handleSubmit = () => {
    setError("");

    if (hasPassword && !oldPassword.trim()) {
      setError("Password lama wajib diisi.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Password baru wajib diisi.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Konfirmasi password wajib diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    onSubmit?.({
      oldPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <>
      <div className="max-w-162.5 space-y-5">
        {/* Old Password */}
        {hasPassword && (
          <div>
            <label className="mb-2 block text-xl">Old Password</label>

            <input
              type="password"
              placeholder="Masukkan password lama"
              className={inputClasses}
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
            />
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="mb-2 block text-xl">New Password</label>

          <input
            type="password"
            placeholder="Masukkan password baru"
            className={inputClasses}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-xl">Confirm Password</label>

          <input
            type="password"
            placeholder="Konfirmasi password baru"
            className={inputClasses}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Action Buttons */}
      <div className="mt-10 grid max-w-162.5 grid-cols-2 gap-8">
        <FillRoundedButton
          text="Cancel"
          classes="w-full bg-gray-300 text-lg text-white"
          onClick={onCancel}
        />

        <FillRoundedButton
          text={hasPassword ? "Change Password" : "Set Password"}
          classes="w-full bg-[#FE7236] text-lg text-white"
          onClick={handleSubmit}
        />
      </div>
    </>
  );
}

export default ProfilePasswordForm;
