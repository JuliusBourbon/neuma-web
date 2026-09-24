import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FillRoundedButton from "../../../components/common/fillRoundedButton";
import fireflyMain from "../../../assets/profile/firefly-main.png";
import ProfileInfo from "../components/ProfileInfo";
import ProfileEditForm from "../components/ProfileEditForm";
import ProfilePasswordForm from "../components/ProfilePasswordForm";
import ProfileAvatarCard from "../components/ProfileAvatarCard";
import AvatarPickerModal from "../components/AvatarPickerModal";
import PageHeader from "../../../components/layout/PageHeader";

import {
  getMyProfile,
  updateMyProfile,
  getMyStats,
} from "../../../services/api/userService";
import { getShopItems } from "../../../services/api/shopService";
import { logout } from "../../../services/api/authService";

function ProfilePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("profile");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
    }
  };

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
    avatar: null,
    activeAvatarId: null,
    dayStreak: 0,
    rank: null,
    wordsCollected: 0,
    totalXp: 0,
    currencyBalance: 0,
  });

  const [avatars, setAvatars] = useState([]);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false);

  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  const handleOpenAvatarPicker = () => {
    setIsAvatarPickerOpen(true);
  };

  const handleCloseAvatarPicker = () => {
    setIsAvatarPickerOpen(false);
  };

  const handleSelectAvatar = async (avatar) => {
    try {
      console.log("Avatar dipilih:", avatar);

      const updatedUser = await updateMyProfile({
        activeAvatarId: avatar.id,
      });

      console.log("Avatar berhasil diperbarui:", updatedUser);

      setSelectedAvatarId(avatar.id);

      setStats((prevStats) => ({
        ...prevStats,
        activeAvatarId: avatar.id,
        avatar: updatedUser.activeAvatar?.imageUrl ?? avatar.imageUrl,
      }));

      setIsAvatarPickerOpen(false);
    } catch (error) {
      console.error("Gagal memperbarui avatar:", error);
    }
  };

  // Ambil daftar avatar dari API
  useEffect(() => {
    async function fetchAvatars() {
      setIsLoadingAvatars(true);

      try {
        const shopItems = await getShopItems();

        console.log("Avatar dari API:", shopItems);

        setAvatars(shopItems);
      } catch (error) {
        console.error("Gagal mengambil daftar avatar:", error);
      } finally {
        setIsLoadingAvatars(false);
      }
    }

    fetchAvatars();
  }, []);

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
          avatar: userStats?.avatar ?? null,
          activeAvatarId: userStats?.activeAvatarId ?? null,
          dayStreak: userStats?.dayStreak ?? 0,
          rank: userStats?.rank ?? null,
          wordsCollected: userStats?.wordsCollected ?? 0,
          totalXp: userStats?.totalXp ?? 0,
          currencyBalance: userStats?.currencyBalance ?? 0,
        });

        setSelectedAvatarId(userStats?.activeAvatarId ?? null);
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
    <div className="relative flex h-screen flex-col overflow-hidden bg-primary">
      {/* Header */}
      <PageHeader
        title="Profile"
        showBackButton={true}
        backButtonPath="/home"
      />

      {/* Scrollable Content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pb-24 pr-1 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="mx-auto grid w-full max-w-[1625px] grid-cols-1 gap-10 px-4 py-6 sm:px-8 md:py-8 lg:grid-cols-2 lg:gap-25 lg:px-12">
          {/* LEFT SIDE */}
          <div className="order-last lg:order-first">
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
            <div className="mt-14 flex max-w-162.5 justify-center">
              <FillRoundedButton
                text="Sign Out"
                classes="min-w-64 bg-[#FE7236] text-lg text-white"
                onClick={handleLogout}
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="order-first flex flex-col items-center justify-start pt-0 lg:order-last lg:pt-4">
            <ProfileAvatarCard
              avatar={stats.avatar || fireflyMain}
              dayStreak={stats.dayStreak}
              rank={stats.rank}
              wordsCollected={stats.wordsCollected}
              totalXp={stats.totalXp}
              currencyBalance={stats.currencyBalance}
              onChangeAvatar={handleOpenAvatarPicker}
            />
          </div>

          {/* AVATAR PICKER MODAL */}
          <AvatarPickerModal
            isOpen={isAvatarPickerOpen}
            avatars={avatars}
            selectedAvatarId={selectedAvatarId}
            isLoading={isLoadingAvatars}
            onClose={handleCloseAvatarPicker}
            onSelect={handleSelectAvatar}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
