import { useEffect, useState } from "react";
import FillRoundedButton from "../../../components/common/fillRoundedButton";
import fireflyMain from "../../../assets/profile/firefly-main.png";
import {
  getMyProfile,
  updateMyProfile,
} from "../../../services/api/userService";
function ProfilePage() {
  const [mode, setMode] = useState("profile");

  function getGenderLabel(gender) {
    const genderLabels = {
      male: "Laki-laki",
      female: "Perempuan",
      other: "Lainnya",
      prefer_not_to_say: "Memilih untuk tidak menjawab",
    };

    return genderLabels[gender] || "";
  }

  // Data sementara untuk tampilan
  const [profile, setProfile] = useState({
    name: "User",
    email: "user@email.com",
    age: "20",
    gender: "Male",
  });

  const [formData, setFormData] = useState(profile);

  // Ambil data profile dari API
  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getMyProfile();

        console.log("Profile dari API:", user);

        const profileData = {
          name: user.username || "User",
          email: user.email || "",
          age: user.age ?? "",
          gender: user.gender || "",
        };

        setProfile(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error("Gagal mengambil profile:", error);
      }
    }

    fetchProfile();
  }, []);

  // profile | edit | password

  const handleEditProfile = () => {
    setFormData(profile);
    setMode("edit");
  };

  const handleCancel = () => {
    setFormData(profile);
    setMode("profile");
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateMyProfile({
        username: formData.name,
        age: formData.age === "" ? null : Number(formData.age),
        gender: formData.gender === "" ? null : formData.gender,
      });

      setProfile({
        name: updatedUser.username || "User",
        email: updatedUser.email || "",
        age: updatedUser.age ?? "",
        gender: updatedUser.gender || "",
      });

      setFormData({
        name: updatedUser.username || "User",
        email: updatedUser.email || "",
        age: updatedUser.age ?? "",
        gender: updatedUser.gender || "",
      });

      setMode("profile");

      console.log("Profile berhasil diperbarui:", updatedUser);
    } catch (error) {
      console.error("Gagal memperbarui profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#263200] text-[#E5FE96] px-8 py-6">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-24">
        <button
          type="button"
          className="absolute left-0 text-5xl text-white cursor-pointer leading-none"
          onClick={() => setMode("profile")}
        >
          ‹
        </button>

        <h1 className="text-4xl font-normal">Profile</h1>
      </div>

      {/* Main Content */}
      {/* Main Content */}
      <div className="max-w-[1625px] mx-auto px-12 grid grid-cols-2 gap-[100px]">
        {" "}
        {/* LEFT SIDE */}
        <div>
          {/* Profile Mode */}
          {mode === "profile" && (
            <>
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
                  onClick={handleEditProfile}
                />

                <FillRoundedButton
                  text="Change Password"
                  classes="bg-[#FE7236] text-white text-lg w-full"
                  onClick={() => setMode("password")}
                />
              </div>
            </>
          )}

          {/* EDIT PROFILE MODE */}
          {mode === "edit" && (
            <>
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
                  onClick={handleCancel}
                />

                <FillRoundedButton
                  text="Save"
                  classes="bg-[#FE7236] text-white text-lg w-full"
                  onClick={handleSave}
                />
              </div>
            </>
          )}

          {/* CHANGE PASSWORD MODE */}
          {mode === "password" && (
            <>
              <div className="space-y-5 max-w-[650px]">
                <div>
                  <label className="block text-xl mb-2">Old Password</label>

                  <input
                    type="password"
                    className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xl mb-2">New Password</label>

                  <input
                    type="password"
                    className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xl mb-2">Confirm Password</label>

                  <input
                    type="password"
                    className="w-full rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] outline-none"
                  />
                </div>
              </div>

              {/* Password Buttons */}
              <div className="grid grid-cols-2 gap-8 mt-10 max-w-[650px]">
                <FillRoundedButton
                  text="Cancel"
                  classes="bg-gray-300 text-white text-lg w-full"
                  onClick={handleCancel}
                />

                <FillRoundedButton
                  text="Change Password"
                  classes="bg-[#FE7236] text-white text-lg w-full"
                  onClick={() => {}}
                />
              </div>
            </>
          )}

          {/* Sign Out */}
          <div className="flex justify-center mt-14 max-w-[650px]">
            <FillRoundedButton
              text="Sign Out"
              classes="bg-[#FE7236] text-white text-lg min-w-64"
              onClick={() => {}}
            />
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex items-start justify-center pt-4">
          <div className="w-full max-w-[480px] bg-[#B6FF00] rounded-md overflow-hidden">
            {/* Avatar */}
            <div className="h-[400px] border-8 border-[#B6FF00] flex items-center justify-center">
              <img
                src={fireflyMain}
                alt="Firefly avatar"
                className="w-[220px] h-[220px] object-contain"
              />
            </div>

            {/* Stats */}
            <div className="p-8 grid grid-cols-2 gap-8 text-[#263200]">
              <div className="text-xl">🔥 10 days</div>
              <div className="text-xl">📖 1/26</div>
              <div className="text-xl">🏆 #1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
