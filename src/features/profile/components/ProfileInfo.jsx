import FillRoundedButton from "../../../components/common/fillRoundedButton";
import ProfileField from "./ProfileField";

function ProfileInfo({ profile, getGenderLabel, onEdit, onChangePassword }) {
  return (
    <>
      {/* Profile Information */}
      <div className="space-y-5 max-w-[650px]">
        <ProfileField label="Name" value={profile.name} />

        <ProfileField label="Email" value={profile.email} />

        <ProfileField label="Age" value={profile.age} />

        <ProfileField label="Gender" value={getGenderLabel(profile.gender)} />
      </div>

      {/* Profile Buttons */}
      <div className="grid grid-cols-2 gap-8 mt-10 max-w-[650px]">
        <FillRoundedButton
          text="Edit Profile"
          classes="bg-[#FE7236] text-white text-lg w-full"
          onClick={onEdit}
        />

        <FillRoundedButton
          text={profile.hasPassword ? "Change Password" : "Set Password"}
          classes="bg-[#FE7236] text-white text-lg w-full"
          onClick={onChangePassword}
        />
      </div>
    </>
  );
}

export default ProfileInfo;
