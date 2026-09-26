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
import ProfileFeedbackModal from "../components/ProfileFeedbackModal";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

import {
  getMyProfile,
  updateMyProfile,
  getMyStats,
} from "../../../services/api/userService";
import { getShopItems } from "../../../services/api/shopService";
import {
  logout,
  setPassword,
  changePassword,
} from "../../../services/api/authService";

function ProfilePage() {
  const navigate = useNavigate();
  const [userStore, setUserStore] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });
  const lang = userStore?.preferredLanguage || 'id';

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
      male: lang === 'id' ? "Laki-laki" : "Male",
      female: lang === 'id' ? "Perempuan" : "Female",
      other: lang === 'id' ? "Lainnya" : "Other",
      prefer_not_to_say: lang === 'id' ? "Memilih untuk tidak menjawab" : "Prefer not to say",
    };

    return genderLabels[gender] || "";
  }

  // Data dari cache (localStorage) jika ada
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem("profileData");
      if (cached) return JSON.parse(cached);
    } catch { }
    return {
      name: "",
      email: "",
      age: "",
      gender: "",
      preferredLanguage: "id",
      hasPassword: false,
    };
  });

  const [formData, setFormData] = useState(profile);

  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem("statsData");
      if (cached) return JSON.parse(cached);
    } catch { }
    return {
      avatar: null,
      activeAvatarId: null,
      dayStreak: 0,
      rank: null,
      wordsCollected: 0,
      totalXp: 0,
      currencyBalance: 0,
    };
  });

  // State untuk menahan render jika sama sekali tidak ada data di cache (first load)
  const [isInitializing, setIsInitializing] = useState(() => {
    return !localStorage.getItem("profileData") || !localStorage.getItem("statsData");
  });

  const [avatars, setAvatars] = useState([]);
  const [isLoadingAvatars, setIsLoadingAvatars] = useState(false);

  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState(null);

  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });

  const [pendingAction, setPendingAction] = useState(null);
  const [pendingPasswordData, setPendingPasswordData] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const showFeedbackModal = ({ type, title = "", message = "" }) => {
    setFeedbackModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeFeedbackModal = () => {
    if (isProcessingAction) {
      return;
    }

    setFeedbackModal((prevModal) => ({
      ...prevModal,
      isOpen: false,
    }));

    setPendingAction(null);
    setPendingPasswordData(null);
  };

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

  // Ambil data profile dan stats dari API (SWR Pattern)
  useEffect(() => {
    async function fetchProfileAndStats() {
      try {
        const [user, userStats] = await Promise.all([
          getMyProfile(),
          getMyStats()
        ]);

        const profileData = {
          name: user.username || "Anonymous",
          email: user.email || "",
          age: user.age ?? "",
          gender: user.gender || "",
          preferredLanguage: user.preferredLanguage || "id",
          hasPassword: Boolean(user.hasPassword),
        };

        const statsData = {
          avatar: userStats?.avatar ?? null,
          activeAvatarId: userStats?.activeAvatarId ?? null,
          dayStreak: userStats?.dayStreak ?? 0,
          rank: userStats?.rank ?? null,
          wordsCollected: userStats?.wordsCollected ?? 0,
          totalXp: userStats?.totalXp ?? 0,
          currencyBalance: userStats?.currencyBalance ?? 0,
        };

        setProfile(profileData);
        // Only override formData if we are not editing
        setFormData((prev) => (mode === "profile" ? profileData : prev));

        setStats(statsData);
        setSelectedAvatarId(userStats?.activeAvatarId ?? null);

        // Update Cache
        localStorage.setItem("profileData", JSON.stringify(profileData));
        localStorage.setItem("statsData", JSON.stringify(statsData));

      } catch (error) {
        console.error("Gagal mengambil data profile/stats:", error);
      } finally {
        setIsInitializing(false);
      }
    }

    fetchProfileAndStats();
  }, [mode]);

  // profile | edit | password

  const handleEditProfile = () => {
    setFormData(profile);
    setMode("edit");
  };

  const handleCancel = () => {
    setFormData(profile);
    setMode("profile");
  };

  const handleSave = () => {
    setPendingAction("profile");

    showFeedbackModal({
      type: "confirmation",
      title: lang === 'id' ? "Konfirmasi Perubahan Profil" : "Confirm Profile Changes",
      message: lang === 'id' ? "Apakah kamu yakin ingin menyimpan perubahan profil?" : "Are you sure you want to save profile changes?",
    });
  };

  const confirmSaveProfile = async () => {
    if (isProcessingAction) {
      return;
    }

    setIsProcessingAction(true);

    try {
      const updatedUser = await updateMyProfile({
        username: formData.name,
        age: formData.age === "" ? null : Number(formData.age),
        gender: formData.gender === "" ? null : formData.gender,
        preferredLanguage: formData.preferredLanguage,
      });

      const updatedProfile = {
        name: updatedUser.username || "User",
        email: updatedUser.email || "",
        age: updatedUser.age ?? "",
        gender: updatedUser.gender || "",
        preferredLanguage: updatedUser.preferredLanguage || "id",
        hasPassword: Boolean(updatedUser.hasPassword),
      };

      setProfile(updatedProfile);
      setFormData(updatedProfile);
      setUserStore(prev => ({ ...prev, preferredLanguage: updatedUser.preferredLanguage || "id" }));

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...currentUser, ...updatedUser }));
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));

      setMode("profile");

      setPendingAction(null);

      showFeedbackModal({
        type: "success",
        title: lang === 'id' ? "Profil Berhasil Diperbarui" : "Profile Successfully Updated",
        message: lang === 'id' ? "Perubahan profil kamu berhasil disimpan." : "Your profile changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Gagal memperbarui profil:", error);

      showFeedbackModal({
        type: "error",
        title: lang === 'id' ? "Gagal Memperbarui Profil" : "Failed to Update Profile",
        message:
          error?.response?.data?.message ||
          error?.message ||
          (lang === 'id' ? "Terjadi kesalahan saat memperbarui profil." : "An error occurred while updating the profile."),
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const confirmPasswordChange = async () => {
    if (isProcessingAction || !pendingPasswordData) {
      return;
    }

    setIsProcessingAction(true);

    try {
      const { oldPassword, newPassword, confirmPassword } = pendingPasswordData;

      if (profile.hasPassword) {
        await changePassword({
          oldPassword,
          newPassword,
          confirmPassword,
        });
      } else {
        await setPassword({
          newPassword,
          confirmPassword,
        });
      }

      setProfile((prevProfile) => ({
        ...prevProfile,
        hasPassword: true,
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        hasPassword: true,
      }));

      setMode("profile");
      setPendingAction(null);
      setPendingPasswordData(null);

      showFeedbackModal({
        type: "success",
        title: profile.hasPassword
          ? (lang === 'id' ? "Sandi Berhasil Diubah" : "Password Successfully Changed")
          : (lang === 'id' ? "Sandi Berhasil Dibuat" : "Password Successfully Created"),
        message: profile.hasPassword
          ? (lang === 'id' ? "Sandi kamu berhasil diperbarui." : "Your password has been successfully updated.")
          : (lang === 'id' ? "Sandi kamu berhasil dibuat." : "Your password has been successfully created."),
      });
    } catch (error) {
      console.error("Gagal memproses sandi:", error);

      showFeedbackModal({
        type: "error",
        title: lang === 'id' ? "Gagal Memproses Sandi" : "Failed to Process Password",
        message:
          error?.response?.data?.message ||
          error?.message ||
          (lang === 'id' ? "Terjadi kesalahan saat memproses sandi." : "An error occurred while processing the password."),
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction === "profile") {
      return confirmSaveProfile();
    }

    if (pendingAction === "password") {
      return confirmPasswordChange();
    }
  };

  const handlePasswordSubmit = (passwordData) => {
    setPendingPasswordData(passwordData);
    setPendingAction("password");

    showFeedbackModal({
      type: "confirmation",
      title: profile.hasPassword
        ? (lang === 'id' ? "Konfirmasi Perubahan Sandi" : "Confirm Password Change")
        : (lang === 'id' ? "Konfirmasi Pembuatan Sandi" : "Confirm Password Creation"),
      message: profile.hasPassword
        ? (lang === 'id' ? "Apakah kamu yakin ingin mengubah sandi?" : "Are you sure you want to change your password?")
        : (lang === 'id' ? "Apakah kamu yakin ingin membuat sandi?" : "Are you sure you want to set your password?"),
    });
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-primary">
      {/* Header */}
      <PageHeader
        title={lang === 'id' ? "Profil" : "Profile"}
        showBackButton={true}
        backButtonPath="/home"
      />

      {isInitializing ? (
        <LoadingOverlay message={lang === 'id' ? "Memuat profil..." : "Loading profile..."} />
      ) : (
        /* Scrollable Content */
        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pr-1 sm:px-6 lg:px-8">
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
                  lang={lang}
                />
              )}

              {/* EDIT PROFILE MODE */}
              {mode === "edit" && (
                <ProfileEditForm
                  formData={formData}
                  setFormData={setFormData}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  lang={lang}
                />
              )}

              {/* CHANGE PASSWORD MODE */}
              {mode === "password" && (
                <ProfilePasswordForm
                  hasPassword={profile.hasPassword}
                  onCancel={handleCancel}
                  onSubmit={handlePasswordSubmit}
                  lang={lang}
                />
              )}

              {/* Sign Out */}
              <div className="mt-8 flex max-w-162.5 justify-center">
                <FillRoundedButton
                  text={lang === 'id' ? "Keluar" : "Sign Out"}
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
                lang={lang}
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
              lang={lang}
            />

            {/* PROFILE FEEDBACK MODAL */}
            <ProfileFeedbackModal
              isOpen={feedbackModal.isOpen}
              type={feedbackModal.type}
              title={feedbackModal.title}
              message={feedbackModal.message}
              onClose={closeFeedbackModal}
              onConfirm={handleConfirmAction}
              isConfirming={isProcessingAction}
              lang={lang}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
