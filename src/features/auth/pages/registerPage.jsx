import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import ActionButton from "../../../components/common/actionButton";
import FillRoundedButton from "../../../components/common/fillRoundedButton";
import { register, loginWithGoogle } from "../../../services/api/authService";
import GoogleIcon from "../../../components/icons/googleIcon";

export default function RegisterPage({ onClose, onSwitchToLogin, lang = 'id' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSuccessRegister = (data) => {
    if (data?.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }

    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.onboardingCompleted) {
        navigate("/home");
      } else {
        navigate("/onboarding");
      }

      return;
    }

    navigate("/home");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const data = await register({
        email,
        password,
        username: username.trim() || undefined,
      });
      handleSuccessRegister(data);
    } catch (err) {
      setErrorMessage(err.message || (lang === 'id' ? "Pendaftaran gagal. Silakan coba lagi." : "Registration failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (!tokenResponse?.access_token) {
        throw new Error(lang === 'id' ? "Google access token tidak ditemukan." : "Google access token not found.");
      }
      const data = await loginWithGoogle({
        accessToken: tokenResponse.access_token,
      });
      handleSuccessRegister(data);
    } catch (err) {
      setErrorMessage(err.message || (lang === 'id' ? "Pendaftaran dengan Google gagal." : "Google registration failed."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (errorResponse) => {
    setErrorMessage(
      errorResponse?.error_description ||
      (lang === 'id' ? "Pendaftaran dengan Google dibatalkan atau terjadi kesalahan." : "Google registration cancelled or an error occurred.")
    );
  };

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
  });

  return (
    <div className="relative bg-primary min-h-screen w-full flex flex-col items-center justify-center px-8 md:px-16">
      {/* Close Button (X) */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-6 left-6 md:top-8 md:left-8 p-3 rounded-full hover:bg-tertiary/10 text-tertiary transition cursor-pointer"
        aria-label="Tutup"
        title="Tutup (Esc)"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex flex-col items-center gap-6 mb-16 md:mb-20 text-center">
        <h2 className="text-5xl font-medium text-tertiary">Neumá</h2>
        <h3 className="text-xl md:text-2xl font-semibold text-secondary">
          Break the Silence, Bridge the World.
        </h3>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <h3 className="text-2xl font-medium text-tertiary">
          {lang === 'id' ? "Buat profil Anda" : "Create your profile"}
        </h3>

        {errorMessage && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col gap-4 w-full"
        >
          <input
            type="text"
            placeholder={lang === 'id' ? "Nama Pengguna (opsional)" : "Username (optional)"}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-tertiary/30 text-tertiary placeholder-tertiary/60 px-4 py-2 text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-tertiary/30 text-tertiary placeholder-tertiary/60 px-4 py-2 text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            type="password"
            placeholder={lang === 'id' ? "Kata Sandi" : "Password"}
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-tertiary/30 text-tertiary placeholder-tertiary/60 px-4 py-2 text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <ActionButton
            type="submit"
            disabled={isLoading}
            text={isLoading ? (lang === 'id' ? "Memproses..." : "Processing...") : (lang === 'id' ? "Daftar" : "Sign Up")}
            classes="bg-secondary text-white px-6 py-3 rounded-lg w-full font-medium shadow-sm hover:opacity-90"
          />
        </form>

        <div className="flex items-center w-full">
          <div className="grow border-t border-tertiary"></div>
          <h3 className="px-3 text-lg font-medium text-tertiary">{lang === 'id' ? "Atau" : "Or"}</h3>
          <div className="grow border-t border-tertiary"></div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full flex justify-center">
            <ActionButton
              type="button"
              disabled={isLoading}
              onClick={() => triggerGoogleLogin()}
              classes="bg-white rounded-full w-full border border-tertiary hover:bg-gray-200 py-3 text-xl font-medium"
              svg={<GoogleIcon />}
              text={lang === 'id' ? "Daftar dengan Google" : "Sign up with Google"}
            />
          </div>
          <FillRoundedButton
            text={lang === 'id' ? "Sudah punya akun" : "Already have an account"}
            href="/login"
            onClick={onSwitchToLogin}
            classes="bg-tertiary text-white px-6 py-3 rounded-lg w-full text-center hover:opacity-90"
          />
        </div>
        <h3 className="text-sm font-medium text-tertiary text-center">
          {lang === 'id' ? (
            <>
              Dengan mendaftar ke Neumá, Anda menyetujui
              <Link to="/terms" className="font-bold underline cursor-pointer"> Syarat</Link> dan{" "}
              <Link to="/privacy" className="font-bold underline cursor-pointer"> Kebijakan Privasi</Link> kami
            </>
          ) : (
            <>
              By signing up to Neumá, you agree to our
              <Link to="/terms" className="font-bold underline cursor-pointer"> Terms</Link> and{" "}
              <Link to="/privacy" className="font-bold underline cursor-pointer"> Privacy Policy</Link>
            </>
          )}
        </h3>
      </div>
    </div>
  );
}
