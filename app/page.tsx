"use client";

import { useState, useRef, FormEvent, MouseEvent } from "react";
import Image from "next/image";
import {
  LuCompass,
  LuCalendarCheck,
  LuMail,
  LuTarget,
  LuPhone,
  LuGlobe,
} from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import SurveyOverlay from "./components/SurveyOverlay";

function SparrLogo({
  variant = "light",
  size = "md",
}: {
  variant?: "light" | "dark" | "footer";
  size?: "sm" | "md" | "lg";
}) {
  const boxSize =
    size === "lg" ? "h-9 w-9" : size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const iconSize =
    size === "lg" ? "h-5 w-5" : size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const textSize =
    size === "lg" ? "text-xl" : size === "sm" ? "text-sm" : "text-lg";
  const boxBg =
    variant === "dark"
      ? "bg-white text-slate-900"
      : "bg-slate-900 text-white";
  const textColor =
    variant === "dark" ? "text-white" : "text-slate-900";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`grid place-items-center rounded-lg ${boxSize} ${boxBg}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={iconSize}
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
      <span
        className={`font-semibold tracking-tight ${textSize} ${textColor}`}
      >
        Sparr.
      </span>
    </span>
  );
}

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question:
      "Was wird Sparr alles können – welche Aufgaben übernimmt mein KI-Coach konkret?",
    answer:
      "Sparr deckt drei Kernbereiche ab: Tägliche Planung mit Fokus auf die umsatzrelevantesten Hebel, strategisches AI-Coaching für schwere Entscheidungen sowie aktive Mitarbeit im Tagesgeschäft – er schreibt deine Follow-up-E-Mails vor, recherchiert passende Leads für deine Kaltakquise und bereitet Angebotsentwürfe vor.",
  },
  {
    question:
      "Wie lernt die KI mein Business und meine Arbeitsweise konkret kennen?",
    answer:
      "Über einen kurzen Onboarding-Chat und durch jede Interaktion mit dir. Sparr merkt sich deinen Tone of Voice, deine Ziele, deine typischen Deal-Strukturen und welche Argumente bei deinen Kunden funktionieren. Je länger du ihn nutzt, desto präziser werden seine Vorschläge.",
  },
  {
    question:
      "Was passiert, sobald ich mich kostenlos auf der Warteliste eingetragen habe?",
    answer:
      "Du sicherst dir einen Platz für den schrittweisen Rollout der Beta. Sobald dein Account bereit ist, bekommst du eine E-Mail mit dem Zugangslink und kannst in Ruhe entscheiden, ob du wirklich starten möchtest. Bis dahin: null Verpflichtung und keine Zahlungsdaten nötig.",
  },
  {
    question:
      "Sind meine Deal-Daten und Kundeninformationen bei Sparr wirklich sicher?",
    answer:
      "Ja. Deine Daten werden isoliert verarbeitet, niemals für das Training öffentlicher KI-Modelle verwendet und liegen DSGVO-konform auf europäischen Servern. Nur du hast Zugriff auf deinen Workspace.",
  },
  {
    question:
      "Ist Sparr nur für selbstständige Webdesigner gedacht — oder lässt es sich auch in größeren Teams einsetzen?",
    answer:
      "Sparr ist bewusst für selbstständige Webdesigner im DACH-Raum gebaut — nicht für generische Freelancer-, Berater- oder Enterprise-Sales-Teams. Wir fokussieren uns auf Websites, Angebote, Nachfassen und operative Kundenprojekte zwischen Briefing und Launch. Für klassische Groß-Team-Sales-Stacks gibt es passendere Tools.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [waitlistId, setWaitlistId] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  const scrollToSection = (targetId: string) => {
    const target =
      targetId === "top" ? document.documentElement : document.getElementById(targetId);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const headerOffset = targetId === "top" ? 0 : 88;
    const start = window.scrollY;
    const targetTop =
      targetId === "top"
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const distance = Math.max(0, targetTop) - start;
    const duration = prefersReducedMotion
      ? 0
      : Math.min(950, Math.max(520, Math.abs(distance) * 0.55));

    if (duration === 0) {
      window.scrollTo(0, Math.max(0, targetTop));
      return;
    }

    const startedAt = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animateScroll = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeOutCubic(progress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleScrollLink =
    (targetId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      scrollToSection(targetId);
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSignupError(null);
    setSignupLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        id?: string;
      };
      if (!res.ok || !data.id) {
        setSignupError(
          data.error ||
            "Etwas ist schiefgelaufen. Bitte versuch es noch einmal.",
        );
        setSignupLoading(false);
        return;
      }
      setWaitlistId(data.id);
      setSubmitted(true);
      setSurveyOpen(true);
    } catch {
      setSignupError("Netzwerkfehler. Bitte versuch es noch einmal.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div
      id="top"
      className="min-h-screen w-full bg-[#fafafa] text-slate-900 antialiased"
    >
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <a
            href="#top"
            onClick={handleScrollLink("top")}
            className="flex items-center"
          >
            <SparrLogo />
          </a>
          <a
            href="#waitlist"
            onClick={handleScrollLink("waitlist")}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Jetzt Platz sichern
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 via-indigo-50 to-transparent blur-3xl" />
          <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-blue-200/40 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:pt-24">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Du sitzt vor sieben Kundenprojekten.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Womit fängst du an?
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Sparr liest deine Projekte und schickt dir jeden Morgen um 8:00
              Uhr die drei Schritte, die heute am meisten Geld bringen.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-slate-900 px-6 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
                disabled={submitted || signupLoading}
              >
                {submitted
                  ? "Du bist drin ✓"
                  : signupLoading
                    ? "Ein Moment …"
                    : "Platz sichern"}
              </button>
            </form>
            {signupError ? (
              <p className="mt-3 max-w-lg text-xs text-red-600" role="alert">
                {signupError}
              </p>
            ) : null}

            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 text-emerald-500"
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
              Kostenloses Eintragen für die Warteliste – kein Zahlungsmittel,
              keine Verpflichtung.
            </p>

            {/*
              Social-proof line vorerst ausgeblendet, bis die Zahl ehrlich ist.
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {["#60a5fa", "#a78bfa", "#34d399", "#fb7185"].map((c) => (
                  <span
                    key={c}
                    className="h-7 w-7 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <span>Bereits 240+ Selbstständige auf der Warteliste</span>
            </div>
            */}
          </div>

          {/* GLASSMORPHIC STACK */}
          <div className="relative h-[560px] w-full">
            {/* BG Layer 1: Kanban Board */}
            <div className="absolute left-0 top-0 w-[88%] rotate-[-3deg] rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">Offene Aufträge · Q2</span>
                <span>€ 142.500</span>
              </div>
              <div className="grid grid-cols-3 gap-2 opacity-90">
                {[
                  { label: "Lead", color: "bg-slate-200", count: 4 },
                  { label: "Angebot", color: "bg-blue-200", count: 3 },
                  { label: "Won", color: "bg-emerald-200", count: 2 },
                ].map((col) => (
                  <div key={col.label} className="rounded-lg bg-slate-50 p-2">
                    <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-slate-500">
                      <span>{col.label}</span>
                      <span>{col.count}</span>
                    </div>
                    <div className="space-y-1.5">
                      {Array.from({ length: col.count > 2 ? 2 : col.count }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="rounded-md bg-white p-1.5 shadow-sm"
                          >
                            <div className={`mb-1 h-1 w-8 rounded ${col.color}`} />
                            <div className="h-1.5 w-full rounded bg-slate-100" />
                            <div className="mt-1 h-1.5 w-3/4 rounded bg-slate-100" />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Tiny chart */}
              <div className="mt-3 flex items-end gap-1 rounded-lg bg-slate-50 p-2">
                {[40, 55, 35, 70, 50, 80, 65, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-blue-400 to-indigo-300"
                    style={{ height: `${h * 0.25}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Layer 2: Chat (Sparr KI) */}
            <div className="absolute bottom-4 right-0 w-[78%] rotate-[2deg] rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
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
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    Sparr.
                  </div>
                  <div className="text-xs text-emerald-600">
                    schreibt gerade...
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  Welches Kundenprojekt soll ich heute pushen?
                </div>
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600 to-indigo-600 px-3 py-2 text-sm text-white shadow-md">
                  Geh zuerst auf{" "}
                  <span className="font-semibold">Müller GmbH (€ 8.400)</span>{" "}
                  – das Angebot liegt seit 9 Tagen ohne Antwort
                  <span className="inline-flex gap-0.5 pl-1 align-middle">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-white/80" />
                    <span className="h-1 w-1 animate-pulse rounded-full bg-white/80 [animation-delay:120ms]" />
                    <span className="h-1 w-1 animate-pulse rounded-full bg-white/80 [animation-delay:240ms]" />
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
                <span className="text-xs text-slate-400">
                  Frag deinen Coach...
                </span>
                <span className="ml-auto h-6 w-6 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* Layer 3: Briefing card (top right floating) */}
            <div className="absolute right-2 top-8 w-[58%] rotate-[4deg] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium uppercase tracking-wide">
                  8:00 Uhr · Briefing
                </span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                  Heute
                </span>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Deine 3 Prioritäten
              </div>
              <ul className="mt-3 space-y-2 text-xs text-slate-700">
                {[
                  { t: "Follow-up Müller GmbH", v: "€ 8.400" },
                  { t: "Angebot Bauer & Co", v: "€ 12.000" },
                  { t: "Kaltakquise: 5 Leads", v: "Potenzial" },
                ].map((it, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-2"
                  >
                    <span className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-md bg-blue-600 text-[10px] font-semibold text-white">
                        {i + 1}
                      </span>
                      {it.t}
                    </span>
                    <span className="font-medium text-slate-500">{it.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PITCH VIDEO */}
      <section
        aria-label="Sparr kurz erklärt"
        className="border-t border-slate-200/60 bg-white"
      >
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
              Sparr kurz erklärt
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              So bringt Sparr Ordnung in deinen Alltag
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Schau dir kurz an, wie Sparr deine Kundenprojekte, Angebote und
              Nachfass-Mails auf den Punkt bringt.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-slate-200 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5">
            {!videoPlaying ? (
              <button
                type="button"
                aria-label="Video abspielen"
                onClick={() => {
                  setVideoPlaying(true);
                  setTimeout(() => {
                    videoRef.current?.play();
                  }, 50);
                }}
                className="group relative block w-full"
              >
                {/* Thumbnail */}
                <Image
                  src="/video-thumbnail.png"
                  alt="Sparr Chat-Vorschau"
                  width={1280}
                  height={720}
                  className="block w-full"
                  priority
                />
                {/* Dark overlay on hover */}
                <span className="absolute inset-0 bg-black/10 transition-colors duration-200 group-hover:bg-black/20" />
                {/* Play button */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-2xl shadow-black/30 transition-transform duration-200 group-hover:scale-110 sm:h-24 sm:w-24">
                    <svg
                      viewBox="0 0 24 24"
                      className="ml-1.5 h-9 w-9 text-slate-900 sm:h-10 sm:w-10"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </span>
                </span>
              </button>
            ) : (
              <video
                ref={videoRef}
                className="block w-full bg-slate-950"
                controls
                playsInline
                preload="auto"
                aria-label="Sparr kurz erklärt – Pitch-Video"
              >
                <source src="/pitch.mp4" type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </section>

      {/* BENTO: WARUM SETUP SCHEITERT */}
      <section id="problem" className="border-t border-slate-200/60 bg-white">
        <div className="mx-auto max-w-5xl px-6 pt-24 lg:px-10">
          <div className="grid items-center gap-12 md:grid-cols-[auto,1fr]">
            <div className="relative mx-auto h-32 w-32 shrink-0 md:h-40 md:w-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 blur-2xl" />
              <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-slate-200 to-slate-300 shadow-xl">
                <Image
                  src="/Portrait.png"
                  alt="Thomas Hruby, Gründer von Sparr"
                  fill
                  sizes="(min-width: 768px) 160px, 128px"
                  className="object-cover object-[50%_42.5%]"
                />
              </div>
            </div>
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
                Wer baut Sparr?
              </span>
              <h2 className="mt-2 text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-3xl">
                &ldquo;Ich saß vor sieben offenen Kundenprojekten und wusste
                nicht, welches heute den nächsten Schritt braucht.&rdquo;
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Ich bin Thomas und führe selbst eine kleine Webdesign-Agentur.
                Mein Problem war nie, dass ich Tasks vergessen habe. Mein
                Problem war, dass ich vor sieben laufenden Kundenprojekten
                saß, drei Angeboten, die auf Antwort warteten, einer fast
                fertigen Website, die auf Abnahme wartete – und keine Ahnung
                hatte, womit ich heute beginne, damit am Monatsende ein neuer
                Auftrag, ein abgenommener Launch oder ein verlängerter Retainer
                steht. Sparr ist genau dafür gebaut – von einem Webdesigner
                für Webdesigner. Deine digitale rechte Hand, die zwischen
                Briefing, Nachfassen und Launch den Lärm ausblendet.
              </p>
              <div className="mt-6 text-sm font-medium text-slate-900">
                Thomas
                <span className="font-normal text-slate-500">
                  {" "}· Webdesigner & Gründer, Sparr.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
              Das eigentliche Problem
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Warum dein Setup als Webdesigner scheitert
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Deine Tools verwalten das Chaos zwischen drei laufenden
              Kundenprojekten. Sie räumen es nicht auf.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="group relative rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-slate-300">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M3 6h18M3 12h18M3 18h12" strokeLinecap="round" />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  Dein CRM
                </h3>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Wartet darauf, dass du Anfragen, Angebote und Kontakte manuell
                pflegst – während die fast fertige Website schon auf
                Kunden-Feedback wartet.
              </p>
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  Letzter Eintrag · vor 11 Tagen
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                  <div className="h-full w-1/5 rounded-full bg-slate-300" />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-3xl border border-slate-200 bg-slate-50 p-8 transition hover:border-slate-300">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold text-slate-900">
                  Deine To-Do-Liste
                </h3>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-600">
                Zeigt dir 40 Aufgaben aus drei Kundenprojekten – verrät dir
                aber nicht, welche heute wirklich einen Launch, eine Abnahme
                oder ein neues Angebot näher bringt.
              </p>
              <div className="mt-6 space-y-1.5">
                {[
                  "Rechnung schreiben",
                  "Slack Notifications",
                  "Steuerberater Email",
                  "Newsletter planen",
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-slate-500"
                  >
                    <span className="h-3 w-3 rounded border border-slate-300" />
                    {t}
                  </div>
                ))}
                <div className="pt-1 text-right text-xs text-slate-400">
                  + 36 weitere
                </div>
              </div>
            </div>

            {/* Card 3 – HIGHLIGHTED */}
            <div className="relative rounded-3xl border-2 border-blue-500/80 bg-slate-900 p-8 text-white shadow-[0_0_40px_-5px_rgba(59,130,246,0.5)] ring-1 ring-blue-400/40">
              <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-blue-500/30 via-transparent to-indigo-500/20 blur-xl" />
              <div className="flex items-center gap-3">
                <SparrLogo variant="dark" size="md" />
                <span className="ml-auto rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
                  KI-Coach
                </span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-300">
                Dein KI-Coach hilft dir bei schwierigen Projekt-Entscheidungen
                und plant jeden Morgen deinen Tag. Du weißt sofort, welches
                Kundenprojekt heute den nächsten Schritt braucht – statt
                zwischen 40 To-Dos und drei Vorschau-Versionen zu raten. Sparr
                bringt Klarheit zwischen Briefing, Abnahme und Launch und
                nimmt dir die Tipparbeit ab.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { label: "Klarheit", Icon: LuTarget },
                  { label: "E-Mails", Icon: LuMail },
                  { label: "Coaching", Icon: LuCompass },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                  >
                    <f.Icon className="mx-auto h-5 w-5 text-blue-300" />
                    <div className="mt-1.5 text-xs font-medium text-slate-200">
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 STEPS – DARK MODE */}
      <section id="workflow" className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-400">
              So funktioniert es
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              In 3 Schritten zum Fokus
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Vom Onboarding bis zur Abnahme – ohne dass du deinen
              Projekt-Alltag neu aufbauen musst.
            </p>
          </div>

          <div className="mt-20 space-y-24">
            {/* Step 1 */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-1">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    1
                  </span>
                  <span className="text-slate-300">Schritt 1</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Trag deine offenen Website-Projekte ein
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-400">
                  Kein nerviges Setup, keine Datenmigration, kein
                  &bdquo;erst mal alles eintragen&ldquo;. Du beantwortest ein
                  paar einfache Fragen im Chat und nennst deine offenen
                  Kundenprojekte – und dein Coach versteht sofort, welches
                  Angebot raus ist, welche fast fertige Website auf Abnahme
                  wartet und welcher Retainer-Kunde wieder Aufmerksamkeit
                  braucht. So
                  einfach, dass du heute noch loslegen kannst.
                </p>
              </div>
              <div className="order-2 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Neues Kundenprojekt
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Projekt", value: "Müller GmbH – Website" },
                    { label: "Wert", value: "€ 8.400" },
                    { label: "Status", value: "Angebot raus" },
                    { label: "Letzter Kontakt", value: "vor 9 Tagen" },
                  ].map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-xs uppercase tracking-wide text-slate-500">
                        {f.label}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-5 w-full rounded-lg bg-blue-500 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
                >
                  Projekt speichern
                </button>
              </div>
            </div>

            {/* Step 2 – reversed */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-500">
                  <span>Morgen-Briefing · 8:00</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                    Live
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    {
                      n: 1,
                      t: "Nachfassen Müller GmbH",
                      d: "Heißes Angebot · 9 Tage offen",
                      v: "€ 8.400",
                    },
                    {
                      n: 2,
                      t: "Angebot Bauer & Co finalisieren",
                      d: "Erstgespräch nächste Woche",
                      v: "€ 12.000",
                    },
                    {
                      n: 3,
                      t: "Lead-Recherche: 5 neue Anfragen",
                      d: "Neue Projekte für Q3",
                      v: "Pot.",
                    },
                  ].map((it) => (
                    <div
                      key={it.n}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-500 text-sm font-bold">
                        {it.n}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {it.t}
                        </div>
                        <div className="text-xs text-slate-400">{it.d}</div>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-blue-400">
                        {it.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    2
                  </span>
                  <span className="text-slate-300">Schritt 2</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Tägliche Planung
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-400">
                  Jeden Morgen um 8:00 Uhr liegt dein Briefing bereit: die
                  drei Aktionen mit dem größten Hebel für deine
                  Kundenprojekte – sortiert nach Projektwert, Liegezeit und
                  Abnahme-Wahrscheinlichkeit. Kein Rauschen, kein Scrollen
                  durch 40 To-Dos aus fünf Projekten – nur das, was heute
                  einen Launch, ein Angebot oder einen neuen Retainer näher
                  bringt.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-1">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    3
                  </span>
                  <span className="text-slate-300">Schritt 3</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Coaching & erledigen lassen
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-400">
                  Steckst du beim Webdesign-Angebot fest oder verhandelst
                  gerade einen Retainer? Sparr ist dein strategischer
                  Sparringspartner – 24/7 erreichbar, kennt deine
                  Kundenprojekte im Detail und gibt dir Klartext statt
                  generischer Ratschläge. Und wo es konkret wird, packt er
                  mit an: Er schreibt deine Nachfass-Mails vor, recherchiert
                  passende Leads und bereitet Angebote vor – du gibst nur
                  noch das finale Go.
                </p>
              </div>
              <div className="order-2 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <SparrLogo variant="dark" size="sm" />
                  </div>
                  <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] text-blue-300">
                    Strategie
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-white/10 px-3 py-2 text-sm text-slate-200">
                    Müller will plötzlich 20% Rabatt. Geben oder Stand halten?
                  </div>
                  <div className="max-w-[90%] rounded-2xl rounded-tl-md bg-gradient-to-br from-blue-600 to-indigo-600 px-3 py-2 text-sm leading-relaxed text-white shadow-md">
                    Stand halten. Du hast 3 weitere Hot Leads im gleichen
                    Segment. Biete stattdessen weniger Leistung zu einem
                    günstigeren Preis an – das schützt deinen Wert und gibt
                    ihm das Gefühl zu &bdquo;gewinnen&ldquo;.
                  </div>
                  <div className="ml-auto max-w-[70%] rounded-2xl rounded-tr-md bg-white/10 px-3 py-2 text-sm text-slate-200">
                    Was soll ich konkret streichen?
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <span className="text-xs text-slate-500">
                    Frag deinen Coach...
                  </span>
                  <span className="ml-auto h-6 w-6 rounded-full bg-blue-500" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DREI EBENEN – LEISTUNG */}
      <section
        id="features"
        className="border-t border-slate-200/60 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-medium tracking-wide text-blue-600">
              Drei Ebenen. Jeden Tag.
            </span>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Sparr sagt dir nicht nur, was du tun sollst — er erledigt einen
              Teil davon selbst.
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-1 lg:grid-cols-3">
            <div className="group relative rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-[box-shadow] duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/35">
                <LuCalendarCheck className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-900">
                1 · Zeigt dir, was heute zählt
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Jeden Morgen um 8:00 Uhr: die zwei bis drei Schritte aus deinen
                Kundenprojekten, sortiert nach Projektwert, Liegezeit und
                Abnahme-Wahrscheinlichkeit. Kein Scrollen durch 40 To-Dos.
              </p>
            </div>

            <div className="group relative rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-[box-shadow] duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/35">
                <LuMail className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-900">
                2 · Hilft dir, es umzusetzen
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Die Follow-up-Mail liegt fertig vor dir, in deinem Ton.
                Steckst du in einer Preisverhandlung? Sparr kennt deine
                Projekte und gibt Klartext — keine generischen Tipps.
              </p>
            </div>

            <div className="group relative rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-[box-shadow] duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/35">
                <LuCompass className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-900">
                3 · Macht einen Teil der Arbeit selbst
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Während du baust, recherchiert Sparr neue Leads und bereitet
                Angebotsentwürfe vor — inklusive realistischer Preise,
                Hosting und Wartung. Du gibst nur das finale Go.
              </p>
            </div>
          </div>

          <p className="mx-auto mt-14 max-w-2xl text-center text-lg font-medium text-slate-800">
            Kein weiteres Tool zum Verwalten. Sparr arbeitet — während du
            arbeitest.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-200/60 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Häufig gestellte Fragen
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Alles, was du vor dem Eintragen in die Warteliste wissen solltest.
            </p>
          </div>

          {/*
            Zwei unabhängige Flex-Spalten statt CSS-Grid: So beeinflusst
            das Öffnen einer Karte nur die eigene Spalte – die
            gegenüberliegende Spalte rutscht nicht mit nach unten.
          */}
          <div className="mt-14 grid items-start gap-4 md:grid-cols-2">
            {[0, 1].map((colIndex) => (
              <div key={colIndex} className="flex flex-col gap-4">
                {faqs
                  .map((item, i) => ({ item, i }))
                  .filter(({ i }) => i % 2 === colIndex)
                  .map(({ item, i }) => {
                    const isOpen = openFaq === i;
                    return (
                      <div
                        key={i}
                        className={`rounded-2xl border transition ${
                          isOpen
                            ? "border-slate-300 bg-white shadow-lg shadow-slate-900/5"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                        >
                          <span className="text-base font-medium text-slate-900">
                            {item.question}
                          </span>
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition ${
                              isOpen ? "rotate-45" : ""
                            }`}
                            aria-hidden
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d="M12 5v14M5 12h14"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </button>
                        <div
                          className={`grid overflow-hidden px-5 transition-all duration-300 ${
                            isOpen
                              ? "grid-rows-[1fr] pb-5 opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="min-h-0">
                            <p className="text-base leading-relaxed text-slate-600">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANGEBOT */}
      <section
        id="angebot"
        className="relative overflow-hidden border-t border-slate-200/60 bg-[#fafafa]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100/60 via-indigo-50 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
              Angebot
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Für alle Webdesigner auf der Warteliste
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Du sicherst dir nicht nur frühen Zugang – sondern den
              niedrigsten Preis, zu dem Sparr je erhältlich sein wird.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-xl">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10 sm:p-10">
              {/* Badge */}
              <div className="absolute right-6 top-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Geschlossene Beta
                </span>
              </div>

              <div className="text-sm font-medium uppercase tracking-wider text-blue-600">
                Was du als Beta-Teilnehmer bekommst
              </div>

              <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-3xl">
                Der komplette Sparr-Zugang – zum günstigsten Preis, den es je geben wird.
              </h3>

              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Wer jetzt dabei ist, zahlt später weniger als alle, die nach
                dem Launch kommen.
              </p>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <ul className="mt-8 space-y-3.5 text-sm text-slate-700">
                {[
                  "Voller Zugang zu allen Sparr-Features",
                  "Tägliches 8:00 Uhr Briefing zu deinen Kundenprojekten",
                  "Unbegrenztes Strategie-Coaching – von Preisfrage bis Leistungsumfang",
                  "Nachfass-Mails & Lead-Recherche für neue Website-Projekte",
                  "Persönlicher Support während der gesamten Beta",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-700">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden
                      >
                        <path
                          d="M5 12l4 4L19 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                onClick={handleScrollLink("waitlist")}
                className="mt-10 flex h-12 w-full items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-700"
              >
                Platz auf der Warteliste sichern
              </a>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden
                    >
                      <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" />
                    </svg>
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600">
                    <span className="font-semibold text-slate-900">
                      100% unverbindlich.
                    </span>{" "}
                    Die Warteliste ist kostenlos. Du musst jetzt nichts zahlen
                    und dich auf nichts festlegen – sobald dein Zugang bereit
                    ist, entscheidest du in Ruhe, ob Sparr wirklich in deinen
                    Projekt-Alltag passt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSÖNLICHER KONTAKT */}
      <section
        id="kontakt"
        className="border-t border-slate-200/60 bg-[#fafafa]"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
              Noch nicht überzeugt?
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Vereinbare ein Meeting mit mir.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Stell mir alle deine Fragen direkt – von Webdesigner zu
              Webdesigner. Kein Sales-Pitch, kein Druck. Einfach 20 Minuten
              Klartext zu Sparr, deinen offenen Projekten und ob das Ganze in
              deinen Alltag passt.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl items-center gap-10 md:grid-cols-2">
            {/* Photo */}
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl shadow-slate-900/10 md:max-w-none">
              <Image
                src="/Portrait.png"
                alt="Thomas Hruby"
                fill
                sizes="(min-width: 768px) 480px, 320px"
                className="object-cover object-[50%_42.5%]"
              />
            </div>

            {/* Contact cards */}
            <div className="space-y-3">
              <a
                href="https://wa.me/4367762821420"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white shadow-md">
                  <FaWhatsapp className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    WhatsApp
                  </div>
                  <div className="mt-0.5 truncate text-base font-semibold text-slate-900">
                    +43 677 6282 1420
                  </div>
                </div>
                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
                  →
                </span>
              </a>

              <a
                href="tel:+4367762853686"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-md">
                  <LuPhone className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Telefon
                  </div>
                  <div className="mt-0.5 truncate text-base font-semibold text-slate-900">
                    +43 677 6285 3686
                  </div>
                </div>
                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
                  →
                </span>
              </a>

              <a
                href="mailto:hruby@thomashruby.at"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white shadow-md">
                  <LuMail className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    E-Mail
                  </div>
                  <div className="mt-0.5 truncate text-base font-semibold text-slate-900">
                    hruby@thomashruby.at
                  </div>
                </div>
                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
                  →
                </span>
              </a>

              <a
                href="https://www.thomashruby.at"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-500/10"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-900 text-white shadow-md">
                  <LuGlobe className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Website
                  </div>
                  <div className="mt-0.5 truncate text-base font-semibold text-slate-900">
                    www.thomashruby.at
                  </div>
                </div>
                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-500">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA — Haupt-Anker für Warteliste (Navbar, Angebot-Link) */}
      <section
        id="waitlist"
        className="relative scroll-mt-[5.5rem] overflow-hidden bg-slate-900 text-white"
      >
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -top-20 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Bereit, Ordnung in deine Kundenprojekte zu bringen?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Kostenlos eintragen. Kein Zahlungsmittel. Kein Druck.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              className="h-12 flex-1 rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-slate-500 backdrop-blur focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              disabled={submitted || signupLoading}
              className="h-12 rounded-full bg-blue-500 px-6 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-60"
            >
              {submitted
                ? "Du bist drin ✓"
                : signupLoading
                  ? "Ein Moment …"
                  : "Auf die Warteliste"}
            </button>
          </form>
          {signupError ? (
            <p
              className="mx-auto mt-3 max-w-lg text-xs text-red-300"
              role="alert"
            >
              {signupError}
            </p>
          ) : null}
          <p className="mt-4 text-xs text-slate-400">
            Kostenloses Eintragen für die Warteliste · kein Zahlungsmittel ·
            jederzeit kündbar.
          </p>

          {/* Trust card */}
          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden
                >
                  <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" />
                </svg>
              </span>
              <p className="text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-white">
                  100% unverbindlich.
                </span>{" "}
                Die Warteliste ist kostenlos. Du musst jetzt nichts zahlen und
                dich auf nichts festlegen – sobald dein Zugang bereit ist,
                entscheidest du in Ruhe, ob Sparr wirklich in deinen
                Projekt-Alltag passt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row lg:px-10">
          <div className="flex items-center gap-3">
            <SparrLogo size="sm" />
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#top"
              onClick={handleScrollLink("top")}
              className="transition hover:text-slate-900"
            >
              Impressum
            </a>
            <a
              href="#top"
              onClick={handleScrollLink("top")}
              className="transition hover:text-slate-900"
            >
              Datenschutz
            </a>
            <a
              href="#kontakt"
              onClick={handleScrollLink("kontakt")}
              className="transition hover:text-slate-900"
            >
              Kontakt
            </a>
          </div>
        </div>
      </footer>

      <SurveyOverlay
        open={surveyOpen}
        email={email}
        waitlistId={waitlistId}
        onClose={() => setSurveyOpen(false)}
      />
    </div>
  );
}
