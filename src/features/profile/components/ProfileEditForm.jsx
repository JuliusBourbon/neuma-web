import FillRoundedButton from "../../../components/common/fillRoundedButton";
import ProfileField from "./ProfileField";

function ProfileEditForm({ formData, setFormData, onCancel, onSave, lang = 'id' }) {
  const genderOptions = [
    { value: "", label: lang === 'id' ? "Pilih Gender" : "Choose Gender" },
    { value: "male", label: lang === 'id' ? "Laki-laki" : "Male" },
    { value: "female", label: lang === 'id' ? "Perempuan" : "Female" },
    { value: "other", label: lang === 'id' ? "Lainnya" : "Other" },
    {
      value: "prefer_not_to_say",
      label: lang === 'id' ? "Tidak menjawab" : "Prefer not to say",
    },
  ];

  const langOptions = [
    { value: "id", label: lang === 'id' ? "Indonesia (ID)" : "Indonesian (ID)" },
    { value: "en", label: lang === 'id' ? "Inggris (EN)" : "English (EN)" },
  ];

  return (
    <>
      {/* Edit Profile Form */}
      <div className="space-y-5 max-w-162.5">
        <ProfileField
          label={lang === 'id' ? "Nama" : "Name"}
          value={formData.name}
          editing={true}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <ProfileField
          label="Email"
          value={formData.email}
          editing={true}
          disabled={true}
        />

        <ProfileField
          label={lang === 'id' ? "Umur" : "Age"}
          type="number"
          value={formData.age}
          editing={true}
          onChange={(e) =>
            setFormData({
              ...formData,
              age: e.target.value,
            })
          }
        />

        <ProfileField
          label={lang === 'id' ? "Jenis Kelamin" : "Gender"}
          type="select"
          value={formData.gender}
          editing={true}
          options={genderOptions}
          onChange={(e) =>
            setFormData({
              ...formData,
              gender: e.target.value,
            })
          }
        />

        <ProfileField
          label={lang === 'id' ? "Bahasa Aplikasi" : "App Language"}
          type="select"
          value={formData.preferredLanguage}
          editing={true}
          options={langOptions}
          onChange={(e) =>
            setFormData({
              ...formData,
              preferredLanguage: e.target.value,
            })
          }
        />
      </div>

      {/* Edit Buttons */}
      <div className="grid grid-cols-2 gap-8 mt-10 max-w-162.5">
        <FillRoundedButton
          text={lang === 'id' ? "Batal" : "Cancel"}
          classes="bg-tertiary text-white md:text-lg w-full"
          onClick={onCancel}
        />

        <FillRoundedButton
          text={lang === 'id' ? "Simpan" : "Save"}
          classes="bg-secondary text-white md:text-lg w-full"
          onClick={onSave}
        />
      </div>
    </>
  );
}

export default ProfileEditForm;
