import FillRoundedButton from "../../../components/common/fillRoundedButton";

function ProfileInfo({ profile, getGenderLabel, onEdit, onChangePassword }) {
  return (
    <>
      {/* Profile Information */}
      <div className="space-y-5 max-w-[650px]">
        <div>
          <label className="block text-xl mb-2">Name</label>

          <input
            value={profile.name}
            disabled
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">Email</label>

          <input
            value={profile.email}
            disabled
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">Age</label>

          <input
            value={profile.age}
            disabled
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">Gender</label>

          <input
            value={getGenderLabel(profile.gender)}
            disabled
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>
      </div>

      {/* Profile Buttons */}
      <div className="grid grid-cols-2 gap-8 mt-10 max-w-[650px]">
        <FillRoundedButton
          text="Edit Profile"
          classes="bg-[#FE7236] text-white text-lg w-full"
          onClick={onEdit}
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

export default ProfileInfo;
