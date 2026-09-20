import FillRoundedButton from "../../../components/common/fillRoundedButton";

function ProfilePasswordForm({ onCancel, onChangePassword }) {
  return (
    <>
      {/* Change Password Form */}
      <div className="space-y-5 max-w-[650px]">
        <div>
          <label className="block text-xl mb-2">Old Password</label>

          <input
            type="password"
            placeholder="Masukkan password lama"
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">New Password</label>

          <input
            type="password"
            placeholder="Masukkan password baru"
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">Confirm Password</label>

          <input
            type="password"
            placeholder="Konfirmasi password baru"
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>
      </div>

      {/* Password Buttons */}
      <div className="grid grid-cols-2 gap-8 mt-10 max-w-[650px]">
        <FillRoundedButton
          text="Cancel"
          classes="bg-gray-300 text-white text-lg w-full"
          onClick={onCancel}
        />

        <FillRoundedButton
          text="Change Password"
          classes="bg-[#FE7236] text-white text-lg w-full"
          onClick={onChangePassword}
        />
      </div>
    </>
  );
}

export default ProfilePasswordForm;
