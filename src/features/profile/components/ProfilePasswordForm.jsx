import FillRoundedButton from "../../../components/common/fillRoundedButton";

function ProfilePasswordForm({ onCancel, onChangePassword }) {
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

  return (
    <>
      {/* Change Password Form */}
      <div className="max-w-[650px] space-y-5">
        {/* Old Password */}
        <div>
          <label className="mb-2 block text-xl">Old Password</label>

          <input
            type="password"
            placeholder="Masukkan password lama"
            className={inputClasses}
          />
        </div>

        {/* New Password */}
        <div>
          <label className="mb-2 block text-xl">New Password</label>

          <input
            type="password"
            placeholder="Masukkan password baru"
            className={inputClasses}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-xl">Confirm Password</label>

          <input
            type="password"
            placeholder="Konfirmasi password baru"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Password Buttons */}
      <div className="mt-10 grid max-w-[650px] grid-cols-2 gap-8">
        <FillRoundedButton
          text="Cancel"
          classes="w-full bg-gray-300 text-lg text-white"
          onClick={onCancel}
        />

        <FillRoundedButton
          text="Change Password"
          classes="w-full bg-[#FE7236] text-lg text-white"
          onClick={onChangePassword}
        />
      </div>
    </>
  );
}

export default ProfilePasswordForm;
