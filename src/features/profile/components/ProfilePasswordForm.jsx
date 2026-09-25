import { useState } from "react";
import FillRoundedButton from "../../../components/common/fillRoundedButton";

function ProfilePasswordForm({ hasPassword = false, onCancel, onSubmit, lang = 'id' }) {
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
      setError(lang === 'id' ? "Sandi lama wajib diisi." : "Old password is required.");
      return;
    }

    if (!newPassword.trim()) {
      setError(lang === 'id' ? "Sandi baru wajib diisi." : "New password is required.");
      return;
    }

    if (newPassword.length < 8) {
      setError(lang === 'id' ? "Sandi baru minimal 8 karakter." : "New password must be at least 8 characters.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError(lang === 'id' ? "Konfirmasi sandi wajib diisi." : "Password confirmation is required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(lang === 'id' ? "Konfirmasi sandi tidak cocok." : "Password confirmation does not match.");
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
            <label className="mb-2 block text-xl">{lang === 'id' ? "Sandi Lama" : "Old Password"}</label>

            <input
              type="password"
              placeholder={lang === 'id' ? "Masukkan sandi lama" : "Enter old password"}
              className={inputClasses}
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
            />
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="mb-2 block text-xl">{lang === 'id' ? "Sandi Baru" : "New Password"}</label>

          <input
            type="password"
            placeholder={lang === 'id' ? "Masukkan sandi baru" : "Enter new password"}
            className={inputClasses}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-xl">{lang === 'id' ? "Konfirmasi Sandi" : "Confirm Password"}</label>

          <input
            type="password"
            placeholder={lang === 'id' ? "Konfirmasi sandi baru" : "Confirm new password"}
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
          text={lang === 'id' ? "Batal" : "Cancel"}
          classes="w-full bg-tertiary md:text-lg text-white"
          onClick={onCancel}
        />

        <FillRoundedButton
          text={hasPassword ? (lang === 'id' ? "Ubah Sandi" : "Change Password") : (lang === 'id' ? "Buat Sandi" : "Set Password")}
          classes="w-full bg-secondary md:text-lg text-white"
          onClick={handleSubmit}
        />
      </div>
    </>
  );
}

export default ProfilePasswordForm;
