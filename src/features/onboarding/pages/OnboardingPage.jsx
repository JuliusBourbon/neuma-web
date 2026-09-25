import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../../components/common/actionButton";
import DialogBubble from "../../../components/common/dialogBubble";
import OptionCard from "../components/OptionCard";
import fireflyMain from "../../../assets/onboarding/firefly-main.png";
import firefly1 from "../../../assets/onboarding/firefly-1.png";
import firefly2 from "../../../assets/onboarding/firefly-2.png";
import firefly3 from "../../../assets/onboarding/firefly-3.png";
import firefly4 from "../../../assets/onboarding/firefly-4.png";
import { completeOnboarding } from "../../../services/api/onboardingService";

function OnboardingPage() {
  const navigate = useNavigate();

  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("neuma_lang");

    return savedLang === "en" || savedLang === "id" ? savedLang : "id";
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [typedText, setTypedText] = useState("");

  const totalSteps = 5;

  const toggleLanguage = () => {
    const newLang = lang === "id" ? "en" : "id";

    setLang(newLang);
    localStorage.setItem("neuma_lang", newLang);
  };

  const handleLanguageSelect = (selectedLanguage) => {
    setLang(selectedLanguage);
    localStorage.setItem("neuma_lang", selectedLanguage);
  };

  const knowledgeOptions = [
    {
      value: "no-idea",
      label: lang === "id" ? "Belum tahu" : "No idea",
      image: firefly1,
    },
    {
      value: "basic",
      label: lang === "id" ? "Pemahaman dasar" : "Basic understanding",
      image: firefly2,
    },
    {
      value: "studied-before",
      label:
        lang === "id"
          ? "Pernah mempelajarinya sebelumnya"
          : "Have studied it before",
      image: firefly3,
    },
    {
      value: "knowledgeable",
      label: lang === "id" ? "Sudah menguasai" : "Knowledgeable",
      image: firefly4,
    },
  ];

  const reasonOptions = [
    {
      value: "communication",
      label:
        lang === "id"
          ? "Untuk berkomunikasi dengan teman Tuli"
          : "To communicate with Deaf people",
      image: firefly1,
    },
    {
      value: "family-friends",
      label:
        lang === "id"
          ? "Untuk keluarga atau teman"
          : "For my family or friends",
      image: firefly2,
    },
    {
      value: "work-school",
      label:
        lang === "id" ? "Untuk pekerjaan atau sekolah" : "For work or school",
      image: firefly3,
    },
    {
      value: "interest",
      label:
        lang === "id"
          ? "Saya tertarik dengan Bahasa Isyarat"
          : "I'm interested in Sign Language",
      image: firefly4,
    },
  ];

  const languageOptions = [
    {
      value: "id",
      label: "Bahasa Indonesia",
      description: "Gunakan Bahasa Indonesia",
    },
    {
      value: "en",
      label: "English",
      description: "Use English",
    },
  ];

  const dialogText =
    currentStep === 2
      ? lang === "id"
        ? "Seberapa banyak yang kamu ketahui tentang Bahasa Isyarat?"
        : "How much do you know about Sign Language?"
      : currentStep === 3
        ? lang === "id"
          ? "Mengapa kamu ingin belajar Bahasa Isyarat?"
          : "Why do you want to learn Sign Language?"
        : "";

  useEffect(() => {
    if (!dialogText) {
      return;
    }

    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex += 1;

      setTypedText(dialogText.slice(0, currentIndex));

      if (currentIndex >= dialogText.length) {
        clearInterval(intervalId);
      }
    }, 35);

    return () => {
      clearInterval(intervalId);
    };
  }, [dialogText]);

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    try {
      await completeOnboarding(lang);
      navigate("/home");
    } catch (error) {
      console.error("Gagal menyelesaikan onboarding:", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    console.log("Close onboarding");
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-primary">
      {/* Floating Language Toggle */}

      <button
        type="button"
        onClick={toggleLanguage}
        className="fixed right-8 top-8 z-50 hidden rounded-full border border-primary/20 bg-tertiary px-4 py-2 font-bold text-primary shadow-lg transition-transform hover:scale-105 active:scale-95 md:block"
        title={
          lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"
        }
        aria-label={
          lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"
        }
      >
        {lang === "id" ? "EN" : "ID"}
      </button>
      {/* Top Navigation */}
      <div className="relative flex items-center justify-center px-4 pt-5 sm:px-6 sm:pt-6 md:px-8 md:pt-8">
        {/* Progress Bar */}
        <div className="flex w-full max-w-130 justify-center gap-2 sm:gap-3 md:gap-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-2 w-14 rounded-full sm:h-2.5 sm:w-20 md:h-3 md:w-32 ${
                currentStep >= step ? "bg-tertiary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-3 text-3xl font-light leading-none text-primary sm:right-6 sm:top-4 sm:text-4xl md:right-8 md:top-5"
          aria-label="Close onboarding"
        >
          ×
        </button>
      </div>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div className="w-full max-w-2xl">
          {/* Step 1 - Language Selection */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center px-2 text-center sm:px-4">
              <img
                src={fireflyMain}
                alt="Neuma mascot"
                className="onboarding-fade-up h-24 w-24 object-contain sm:h-28 sm:w-28 md:h-32 md:w-32"
              />

              <h1 className="onboarding-fade-up-delay mt-5 text-2xl font-bold leading-tight text-tertiary sm:mt-8 sm:text-3xl">
                {lang === "id" ? "Pilih bahasa kamu" : "Choose your language"}
              </h1>

              <p className="onboarding-fade-up-delay-more mt-4 text-base leading-relaxed text-primary sm:mt-6 sm:text-lg">
                {lang === "id"
                  ? "Pilih bahasa yang ingin kamu gunakan di Neuma."
                  : "Choose the language you want to use in Neuma."}
              </p>

              <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:gap-4">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleLanguageSelect(option.value)}
                    className={`rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                      lang === option.value
                        ? "border-tertiary bg-tertiary text-primary"
                        : "border-secondary bg-white text-secondary hover:border-tertiary"
                    }`}
                  >
                    <p className="text-base font-bold sm:text-lg">
                      {option.label}
                    </p>

                    <p className="mt-1 text-sm opacity-80">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Step 2 */}
          {currentStep === 2 && (
            <>
              <DialogBubble image={fireflyMain} text={typedText} />

              {/* Options */}
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4">
                {knowledgeOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    text={option.label}
                    image={option.image}
                    selected={selectedKnowledge === option.value}
                    onClick={() => setSelectedKnowledge(option.value)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <>
              <DialogBubble image={fireflyMain} text={typedText} />

              {/* Options */}
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4">
                {reasonOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    text={option.label}
                    image={option.image}
                    selected={selectedReason === option.value}
                    onClick={() => setSelectedReason(option.value)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center px-2 text-center sm:px-4">
              <div className="onboarding-fade-up">
                <img
                  src={fireflyMain}
                  alt="Neuma mascot"
                  className="onboarding-float h-24 w-24 object-contain sm:h-28 sm:w-28 md:h-32 md:w-32"
                />
              </div>

              <h1 className="onboarding-fade-up-delay mt-5 text-2xl font-bold leading-tight text-tertiary sm:mt-8 sm:text-3xl">
                {lang === "id"
                  ? "Keren! Di Neuma, kita akan belajar Bahasa Isyarat bersama."
                  : "Cool! Here at Neuma, we will learn Sign Language together."}
              </h1>

              <p className="onboarding-fade-up-delay-more mt-4 text-base leading-relaxed text-primary sm:mt-6 sm:text-lg">
                {lang === "id"
                  ? "Kami akan membimbingmu langkah demi langkah untuk belajar dan berlatih Bahasa Isyarat."
                  : "We will guide you step by step to learn and practice Sign Language."}
              </p>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="flex flex-col items-center px-2 text-center sm:px-4">
              <div className="onboarding-fade-up">
                <img
                  src={fireflyMain}
                  alt="Neuma mascot"
                  className="onboarding-float h-24 w-24 object-contain sm:h-28 sm:w-28 md:h-32 md:w-32"
                />
              </div>

              <h1 className="onboarding-fade-up-delay mt-5 text-2xl font-bold leading-tight text-tertiary sm:mt-8 sm:text-3xl">
                {lang === "id" ? "Mari kita mulai!" : "Let's get started!"}
              </h1>

              <p className="onboarding-fade-up-delay-more mt-4 text-base leading-relaxed text-primary sm:mt-6 sm:text-lg">
                {lang === "id"
                  ? "Semuanya sudah siap! Mari mulai belajar Bahasa Isyarat bersama Neuma."
                  : "You're all set! Let's start learning Sign Language with Neuma."}
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Footer Button */}
      <footer className="border-t border-primary/30 px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="flex items-end justify-between gap-4">
          {/* Back */}
          <ActionButton
            text={lang === "id" ? "Kembali" : "Back"}
            onClick={handleBack}
            disabled={currentStep === 1}
            classes="rounded-full bg-secondary px-5 py-2.5 text-sm text-white sm:px-8 sm:py-3 sm:text-base"
          />

          {/* Mobile Language Toggle + Next */}
          <div className="flex flex-col items-end gap-2">
            {/* Mobile Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-primary/20 bg-tertiary px-4 py-2 text-sm font-bold text-primary shadow-md transition-transform hover:scale-105 active:scale-95 md:hidden"
              title={
                lang === "id"
                  ? "Switch to English"
                  : "Ganti ke Bahasa Indonesia"
              }
              aria-label={
                lang === "id"
                  ? "Switch to English"
                  : "Ganti ke Bahasa Indonesia"
              }
            >
              {lang === "id" ? "EN" : "ID"}
            </button>

            {/* Next */}
            <ActionButton
              text={lang === "id" ? "Lanjut" : "Next"}
              onClick={handleNext}
              disabled={
                (currentStep === 2 && !selectedKnowledge) ||
                (currentStep === 3 && !selectedReason)
              }
              classes="rounded-full bg-tertiary px-5 py-2.5 text-sm text-primary sm:px-8 sm:py-3 sm:text-base"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
export default OnboardingPage;
