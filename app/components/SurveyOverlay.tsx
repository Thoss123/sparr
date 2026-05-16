"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Option = {
  label: string;
  isOther?: boolean;
  otherPlaceholder?: string;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
};

const QUESTIONS: Question[] = [
  {
    id: "branche",
    question: "In welcher Branche bist du tätig?",
    options: [
      { label: "Webdesign / Web-Entwicklung" },
      { label: "Performance Marketing / Ads" },
      { label: "Consulting / Beratung" },
      { label: "Content Creation / Social Media" },
      { label: "Andere", isOther: true, otherPlaceholder: "Welche Branche?" },
    ],
  },
  {
    id: "zeitfresser",
    question: "Was raubt dir in deinem Business aktuell am meisten Zeit?",
    options: [
      { label: "Fulfillment / Kundenprojekte abarbeiten" },
      { label: "Manuelle Buchhaltung & Rechnungen" },
      { label: "Follow-ups bei Leads vergessen / nachfassen" },
      { label: "Projektmanagement & To-Dos pflegen" },
      { label: "Neue Leads & Kunden finden" },
      { label: "Andere", isOther: true, otherPlaceholder: "Was genau?" },
    ],
  },
  {
    id: "uebersicht",
    question: "Wie behältst du aktuell den Überblick über deine Aufträge?",
    options: [
      { label: "Notion / Airtable" },
      { label: "Trello / Asana / ClickUp" },
      { label: "Klassisches CRM (Pipedrive, Hubspot etc.)" },
      { label: "Chaos (Excel, Zettel, Kopf)" },
      { label: "Andere", isOther: true, otherPlaceholder: "Welches Tool?" },
    ],
  },
  {
    id: "feature",
    question: "Welches Sparr-Feature würdest du als Erstes nutzen?",
    options: [
      { label: "Das proaktive 8:00 Uhr Morgen-Briefing" },
      { label: "Den strategischen AI-Coach für Business-Entscheidungen" },
      { label: "Die lokale Lead-Suche für Kaltakquise" },
      { label: "Automatische E-Mail-Entwürfe für Kunden" },
      { label: "Die Weekly-Review für mehr Fokus" },
      {
        label: "Andere",
        isOther: true,
        otherPlaceholder: "Welches Feature fehlt dir?",
      },
    ],
  },
  {
    id: "tool-budget",
    question: "Wie viel gibst du aktuell mtl. für Orga- & CRM-Tools aus?",
    options: [
      { label: "0 € (Ich nutze nur kostenlose Versionen)" },
      { label: "1 € – 20 €" },
      { label: "21 € – 50 €" },
      { label: "Über 50 €" },
    ],
  },
  {
    id: "preis",
    question:
      "Wärst du bereit 30€-50€ im Monat für so eine Software auszugeben?",
    options: [
      {
        label:
          "Ja, wenn sie mir dabei hilft Zeit zu sparen und mehr Umsatz zu machen",
      },
      { label: "Nein, das ist viel zu viel für mich!" },
    ],
  },
];

type AnswerValue = { option: string; otherText?: string };

interface SurveyOverlayProps {
  open: boolean;
  onClose: () => void;
  email?: string;
  onComplete?: (data: { email?: string; answers: Record<string, AnswerValue> }) => void;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(6px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE_OUT },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    filter: "blur(6px)",
    transition: { duration: 0.3, ease: EASE_IN_OUT },
  }),
};

export default function SurveyOverlay({
  open,
  onClose,
  email,
  onComplete,
}: SurveyOverlayProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [direction, setDirection] = useState(1);
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [avatarOk, setAvatarOk] = useState(true);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setAnswers({});
    setDirection(1);
    setAvatarOk(true);
  }, [open]);

  useEffect(() => {
    if (!open || lottieData) return;
    let cancelled = false;
    fetch("/success.json")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setLottieData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, lottieData]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (step === QUESTIONS.length) {
      onComplete?.({ email, answers });
      const t = window.setTimeout(() => {
        onClose();
      }, 3000);
      return () => window.clearTimeout(t);
    }
  }, [step, onClose, onComplete, email, answers]);

  if (!open) return null;

  const isOutro = step === QUESTIONS.length;
  const current = isOutro ? null : QUESTIONS[step];
  const currentAnswer = current ? answers[current.id] : undefined;
  const selectedOption = currentAnswer?.option;
  const selectedOpt = current?.options.find((o) => o.label === selectedOption);
  const selectedIsOther = selectedOpt?.isOther ?? false;

  const canProceed = (() => {
    if (!current) return false;
    if (!selectedOption) return false;
    if (selectedIsOther && !currentAnswer?.otherText?.trim()) return false;
    return true;
  })();

  const handleSelect = (option: Option) => {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: {
        option: option.label,
        otherText:
          prev[current.id]?.option === option.label
            ? prev[current.id]?.otherText
            : undefined,
      },
    }));

    if (step === 0 && !option.isOther) {
      window.setTimeout(() => {
        setDirection(1);
        setStep((s) => s + 1);
      }, 280);
    }
  };

  const handleOtherChange = (text: string) => {
    if (!current) return;
    setAnswers((prev) => ({
      ...prev,
      [current.id]: {
        option: prev[current.id]?.option ?? "Andere",
        otherText: text,
      },
    }));
  };

  const handleNext = () => {
    if (!canProceed) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const progress = isOutro ? 100 : ((step + 1) / QUESTIONS.length) * 100;
  const showSuccessHeader = step === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="survey-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col bg-white text-slate-900 antialiased"
        >
          {/* Top bar with progress + close */}
          <div className="flex items-center justify-between px-6 pt-6 lg:px-10">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-white">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    d="M5 12l4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-semibold tracking-tight">
                Sparr
              </span>
            </div>

            <div className="hidden flex-1 px-10 sm:block">
              <div className="mx-auto h-1 max-w-md overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />
              </div>
              <div className="mx-auto mt-2 max-w-md text-center text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {isOutro
                  ? "Geschafft"
                  : `Frage ${step + 1} von ${QUESTIONS.length}`}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Umfrage schließen"
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* SUCCESS HEADER (Step 1 only) */}
          <AnimatePresence initial={false}>
            {showSuccessHeader && (
              <motion.div
                key="success-header"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
                className="mx-auto mt-2 w-full max-w-2xl px-6 lg:px-10"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative h-28 w-28">
                    {lottieData ? (
                      <Lottie
                        animationData={lottieData}
                        loop={false}
                        autoplay
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center rounded-full bg-emerald-50">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-10 w-10 text-emerald-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden
                        >
                          <path
                            d="M5 12l4 4L19 6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 blur-md" />
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg">
                        {avatarOk ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src="/Portrait.jpg"
                            alt="Thomas, Founder von Sparr"
                            className="h-full w-full object-cover"
                            onError={() => setAvatarOk(false)}
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-xl font-semibold text-slate-700">
                            T
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-medium uppercase tracking-wider text-blue-600">
                        Thomas · Founder
                      </div>
                      <div className="text-sm text-slate-500">
                        baut Sparr für dich
                      </div>
                    </div>
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Danke! Du bist jetzt auf der Warteliste.
                  </h2>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    Hilf uns bitte kurz, damit wir Sparr genau für deinen Alltag
                    entwickeln können.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* QUESTION AREA */}
          <div className="relative flex flex-1 items-start justify-center overflow-y-auto px-6 pb-10 pt-6 lg:px-10">
            <div className="w-full max-w-2xl">
              <AnimatePresence
                mode="wait"
                custom={direction}
                initial={false}
              >
                {!isOutro && current && (
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                  >
                    <div
                      className={`${
                        showSuccessHeader ? "mt-4" : "mt-12 sm:mt-20"
                      }`}
                    >
                      {!showSuccessHeader && (
                        <div className="text-center text-xs font-medium uppercase tracking-wider text-blue-600">
                          Frage {step + 1} von {QUESTIONS.length}
                        </div>
                      )}
                      <h3
                        className={`text-center font-semibold tracking-tight text-slate-900 ${
                          showSuccessHeader
                            ? "mt-2 text-xl sm:text-2xl"
                            : "mt-3 text-2xl sm:text-3xl lg:text-4xl"
                        }`}
                      >
                        {current.question}
                      </h3>

                      <div className="mx-auto mt-8 grid w-full max-w-xl gap-3">
                        {current.options.map((opt) => {
                          const isSelected = selectedOption === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => handleSelect(opt)}
                              className={`group relative flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left text-base transition ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50/70 shadow-sm ring-4 ring-blue-500/10"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                              }`}
                            >
                              <span
                                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-500 text-white"
                                    : "border-slate-300 bg-white"
                                }`}
                                aria-hidden
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  className={`h-3 w-3 transition ${
                                    isSelected ? "opacity-100" : "opacity-0"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path
                                    d="M5 12l4 4L19 6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <span
                                className={`flex-1 ${
                                  isSelected
                                    ? "font-medium text-slate-900"
                                    : "text-slate-700"
                                }`}
                              >
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* "Andere" Input */}
                      <AnimatePresence initial={false}>
                        {selectedIsOther && (
                          <motion.div
                            key="other-input"
                            initial={{ opacity: 0, height: 0, y: -8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -8 }}
                            transition={{
                              duration: 0.35,
                              ease: EASE_OUT,
                            }}
                            className="mx-auto mt-3 w-full max-w-xl overflow-hidden"
                          >
                            <label className="block text-xs font-medium uppercase tracking-wider text-slate-500">
                              {selectedOpt?.otherPlaceholder ??
                                "Bitte ergänzen"}
                            </label>
                            <input
                              type="text"
                              autoFocus
                              value={currentAnswer?.otherText ?? ""}
                              onChange={(e) =>
                                handleOtherChange(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && canProceed) {
                                  e.preventDefault();
                                  handleNext();
                                }
                              }}
                              placeholder={
                                selectedOpt?.otherPlaceholder ??
                                "Deine Antwort..."
                              }
                              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Weiter Button (hidden on Q1 for auto-advance options) */}
                      <AnimatePresence initial={false}>
                        {selectedOption &&
                          !(step === 0 && !selectedIsOther) && (
                            <motion.div
                              key="next-cta"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              transition={{ duration: 0.25 }}
                              className="mx-auto mt-7 flex w-full max-w-xl items-center justify-between gap-3"
                            >
                              <button
                                type="button"
                                onClick={handleBack}
                                disabled={step === 0}
                                className="text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-0"
                              >
                                ← Zurück
                              </button>
                              <button
                                type="button"
                                onClick={handleNext}
                                disabled={!canProceed}
                                className={`group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition ${
                                  canProceed
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-700"
                                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                                }`}
                              >
                                {step === QUESTIONS.length - 1
                                  ? "Absenden"
                                  : "Weiter"}
                                <svg
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 transition group-hover:translate-x-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  aria-hidden
                                >
                                  <path
                                    d="M5 12h14M13 5l7 7-7 7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </motion.div>
                          )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* FINAL OUTRO */}
                {isOutro && (
                  <motion.div
                    key="outro"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="mt-12 flex flex-col items-center text-center sm:mt-24"
                  >
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.1,
                          duration: 0.6,
                          ease: EASE_OUT,
                        }}
                        className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-blue-200/60 via-indigo-200/40 to-emerald-200/40 blur-3xl"
                      />
                      <motion.div
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 14,
                          delay: 0.1,
                        }}
                        className="text-7xl sm:text-8xl"
                        aria-hidden
                      >
                        🎉
                      </motion.div>
                    </div>
                    <h2 className="mt-6 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                      Perfekt, danke!
                    </h2>
                    <p className="mt-3 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
                      Wir melden uns, sobald du die Software testen kannst.
                    </p>

                    <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                      </span>
                      Schließt automatisch...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

