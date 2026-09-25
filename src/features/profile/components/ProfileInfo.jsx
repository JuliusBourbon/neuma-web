import FillRoundedButton from "../../../components/common/fillRoundedButton";
import ProfileField from "./ProfileField";

function ProfileInfo({ profile, getGenderLabel, onEdit, onChangePassword, lang = 'id' }) {
  function getLangLabel(l) {
    if (l === 'en') return lang === 'id' ? "Inggris (EN)" : "English (EN)";
    return lang === 'id' ? "Indonesia (ID)" : "Indonesian (ID)";
  }

  return (
    <>
      {/* Profile Information */}
      <div className="space-y-5 max-w-162.5">
        <ProfileField label={lang === 'id' ? "Nama" : "Name"} value={profile.name} />

        <ProfileField label="Email" value={profile.email} />

        <ProfileField label={lang === 'id' ? "Umur" : "Age"} value={profile.age} />

        <ProfileField label={lang === 'id' ? "Jenis Kelamin" : "Gender"} value={getGenderLabel(profile.gender)} />

        <ProfileField label={lang === 'id' ? "Bahasa Aplikasi" : "App Language"} value={getLangLabel(profile.preferredLanguage)} />
      </div>

      {/* Profile Buttons */}
      <div className="grid grid-cols-2 gap-3 md:gap-8 mt-10 max-w-162.5">
        <FillRoundedButton
          text={lang === 'id' ? "Ubah Profil" : "Edit Profile"}
          classes="bg-secondary text-white text-md md:text-lg w-full"
          onClick={onEdit}
        />

        <FillRoundedButton
          text={profile.hasPassword ? (lang === 'id' ? "Ubah Sandi" : "Change Password") : (lang === 'id' ? "Buat Sandi" : "Set Password")}
          classes="bg-secondary text-white md:text-lg w-full"
          onClick={onChangePassword}
        />
      </div>
    </>
  );
}

export default ProfileInfo;
