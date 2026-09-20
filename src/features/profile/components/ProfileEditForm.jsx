import FillRoundedButton from "../../../components/common/fillRoundedButton";
import ProfileField from "./ProfileField";

function ProfileEditForm({ formData, setFormData, onCancel, onSave }) {
  const genderOptions = [
    { value: "", label: "Pilih Gender" },
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
    { value: "other", label: "Lainnya" },
    {
      value: "prefer_not_to_say",
      label: "Tidak menjawab",
    },
  ];

  return (
    <>
      {/* Edit Profile Form */}
      <div className="space-y-5 max-w-[650px]">
        <ProfileField
          label="Name"
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
          label="Age"
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
          label="Gender"
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
      </div>

      {/* Edit Buttons */}
      <div className="grid grid-cols-2 gap-8 mt-10 max-w-[650px]">
        <FillRoundedButton
          text="Cancel"
          classes="bg-gray-300 text-white text-lg w-full"
          onClick={onCancel}
        />

        <FillRoundedButton
          text="Save"
          classes="bg-[#FE7236] text-white text-lg w-full"
          onClick={onSave}
        />
      </div>
    </>
  );
}

export default ProfileEditForm;
