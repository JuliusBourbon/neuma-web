import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../../components/common/actionButton";
import OptionCard from "../components/OptionCard";
import fireflyMain from "../../../assets/onboarding/firefly-main.png";
import firefly1 from "../../../assets/onboarding/firefly-1.png";
import firefly2 from "../../../assets/onboarding/firefly-2.png";
import firefly3 from "../../../assets/onboarding/firefly-3.png";
import firefly4 from "../../../assets/onboarding/firefly-4.png";
import { completeOnboarding } from "../../../services/api/onboardingService";

function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedKnowledge, setSelectedKnowledge] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);

  const totalSteps = 4;

  const knowledgeOptions = [
    {
      value: "no-idea",
      label: "No idea",
      image: firefly1,
    },
    {
      value: "basic",
      label: "Basic understanding",
      image: firefly2,
    },
    {
      value: "studied-before",
      label: "Have studied it before",
      image: firefly3,
    },
    {
      value: "knowledgeable",
      label: "Knowledgeable",
      image: firefly4,
    },
  ];

  const reasonOptions = [
    {
      value: "communication",
      label: "To communicate with Deaf people",
    },
    {
      value: "family-friends",
      label: "For my family or friends",
    },
    {
      value: "work-school",
      label: "For work or school",
    },
    {
      value: "interest",
      label: "I'm interested in Sign Language",
    },
  ];

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    try {
      await completeOnboarding();

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
    // Untuk sementara belum diarahkan ke halaman lain.
    console.log("Close onboarding");
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* =========================
          TOP NAVIGATION
      ========================== */}
      <div className="relative flex items-center justify-center px-8 pt-8">
        {/* Progress Bar */}
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-3 w-32 rounded-full ${
                currentStep >= step ? "bg-tertiary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-8 top-5 text-4xl font-light leading-none text-primary"
          aria-label="Close onboarding"
        >
          ×
        </button>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          {/* =========================
              STEP 1
          ========================== */}
          {currentStep === 1 && (
            <>
              {/* Firefly + Speech Bubble */}
              <div className="mb-10 flex items-center justify-center gap-8">
                <img
                  src={fireflyMain}
                  alt="Neuma mascot"
                  className="h-28 w-28 object-contain"
                />

                <div className="relative rounded-xl border-2 border-tertiary bg-primary px-8 py-5">
                  {/* Speech bubble tail */}
                  <div className="absolute -left-3 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-tertiary bg-primary" />

                  <p className="relative text-2xl text-tertiary">
                    How much do you know about Sign Language?
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-4">
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

          {/* =========================
              STEP 2
          ========================== */}
          {currentStep === 2 && (
            <>
              {/* Firefly + Speech Bubble */}
              <div className="mb-10 flex items-center justify-center gap-8">
                <img
                  src={fireflyMain}
                  alt="Neuma mascot"
                  className="h-28 w-28 object-contain"
                />

                <div className="relative rounded-xl border-2 border-tertiary bg-primary px-8 py-5">
                  {/* Speech bubble tail */}
                  <div className="absolute -left-3 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-tertiary bg-primary" />

                  <p className="relative text-2xl text-tertiary">
                    Why do you want to learn Sign Language?
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-4">
                {reasonOptions.map((option) => (
                  <OptionCard
                    key={option.value}
                    text={option.label}
                    selected={selectedReason === option.value}
                    onClick={() => setSelectedReason(option.value)}
                  />
                ))}
              </div>
            </>
          )}

          {/* =========================
              STEP 3
          ========================== */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center text-center">
              <img
                src={fireflyMain}
                alt="Neuma mascot"
                className="h-32 w-32 object-contain"
              />

              <h1 className="mt-8 text-3xl font-bold text-tertiary">
                Cool! Here at Neuma, we will learn Sign Language together.
              </h1>

              <p className="mt-6 text-lg text-primary">
                We will guide you step by step to learn and practice Sign
                Language.
              </p>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center text-center">
              <img
                src={fireflyMain}
                alt="Neuma mascot"
                className="h-32 w-32 object-contain"
              />

              <h1 className="mt-8 text-3xl font-bold text-tertiary">
                Let's get started!
              </h1>

              <p className="mt-6 text-lg text-primary">
                You're all set! Let's start learning Sign Language with Neuma.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="border-t border-primary/30 px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Back */}
          <ActionButton
            text="Back"
            onClick={handleBack}
            disabled={currentStep === 1}
            classes="rounded-full bg-secondary px-8 py-3 text-white"
          />

          {/* Next */}
          <ActionButton
            text="Next"
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !selectedKnowledge) ||
              (currentStep === 2 && !selectedReason)
            }
            classes="rounded-full bg-tertiary px-8 py-3 text-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
