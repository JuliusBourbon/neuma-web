import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FillRoundedButton from "../../../components/common/fillRoundedButton";
import fireflyMain from "../../../assets/profile/firefly-main.png";
import ProfileInfo from "../components/ProfileInfo";
import ProfileEditForm from "../components/ProfileEditForm";
import ProfilePasswordForm from "../components/ProfilePasswordForm";
import ProfileAvatarCard from "../components/ProfileAvatarCard";

import {
  getMyProfile,
  updateMyProfile,
  getMyStats,
} from "../../../services/api/userService";

function ProfilePage() {
  const navigate = useNavigate();
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
    name: "",
    email: "",
    age: "",
    gender: "",
  });

  const [formData, setFormData] = useState(profile);

  const [stats, setStats] = useState({
    dayStreak: 0,
    wordsCollected: 0,
    totalXp: 0,
    currencyBalance: 0,
  });

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

  // Ambil data stats dari API
  useEffect(() => {
    async function fetchStats() {
      try {
        const userStats = await getMyStats();

        console.log("Stats dari API:", userStats);

        setStats({
          dayStreak: userStats?.dayStreak ?? 0,
          wordsCollected: userStats?.wordsCollected ?? 0,
          totalXp: userStats?.totalXp ?? 0,
          currencyBalance: userStats?.currencyBalance ?? 0,
        });
      } catch (error) {
        console.error("Gagal mengambil statistik:", error);
      }
    }

    fetchStats();
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
      <div className="relative flex items-center justify-center mb-12 md:mb-24">
        {" "}
        <button
          type="button"
          className="absolute left-0 text-4xl md:text-5xl text-white cursor-pointer leading-none"
          onClick={() => navigate("/home")}
        >
          ‹
        </button>
        <h1 className="text-3xl md:text-4xl font-normal">Profile</h1>{" "}
      </div>

      {/* Main Content */}
      <div className="max-w-[1625px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[100px]">
        {/* LEFT SIDE */}
        <div className="order-last lg:order-first">
          {" "}
          {/* Profile Mode */}
          {mode === "profile" && (
            <ProfileInfo
              profile={profile}
              getGenderLabel={getGenderLabel}
              onEdit={handleEditProfile}
              onChangePassword={() => setMode("password")}
            />
          )}
          {/* EDIT PROFILE MODE */}
          {mode === "edit" && (
            <ProfileEditForm
              formData={formData}
              setFormData={setFormData}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          )}
          {/* CHANGE PASSWORD MODE */}
          {mode === "password" && (
            <ProfilePasswordForm
              onCancel={handleCancel}
              onChangePassword={() => {
                console.log("Fitur change password belum tersedia.");
              }}
            />
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
        <div className="order-first lg:order-last flex items-start justify-center pt-0 lg:pt-4">
          <ProfileAvatarCard
            avatar={fireflyMain}
            dayStreak={stats.dayStreak}
            wordsCollected={stats.wordsCollected}
            totalXp={stats.totalXp}
            currencyBalance={stats.currencyBalance}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
