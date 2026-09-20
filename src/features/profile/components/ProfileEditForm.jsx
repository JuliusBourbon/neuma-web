import FillRoundedButton from "../../../components/common/fillRoundedButton";

function ProfileEditForm({ formData, setFormData, onCancel, onSave }) {
  return (
    <>
      {/* Edit Profile Form */}
      <div className="space-y-5 max-w-[650px]">
        <div>
          <label className="block text-xl mb-2">Name</label>

          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">Email</label>

          <input
            value={formData.email}
            disabled
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">Age</label>

          <input
            type="number"
            min="5"
            max="100"
            value={formData.age}
            onChange={(e) =>
              setFormData({
                ...formData,
                age: e.target.value,
              })
            }
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          />
        </div>

        <div>
          <label className="block text-xl mb-2">Gender</label>

          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({
                ...formData,
                gender: e.target.value,
              })
            }
            className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
          >
            <option value="">Pilih Gender</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
            <option value="other">Lainnya</option>
            <option value="prefer_not_to_say">
              Memilih untuk tidak menjawab
            </option>
          </select>
        </div>
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
