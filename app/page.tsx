"use client";

import { useState, FormEvent, MouseEvent } from "react";
import SurveyOverlay from "./components/SurveyOverlay";

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
      "Ist Sparr nur für Selbstständige – oder kann ich es auch im größeren Team einsetzen?",
    answer:
      "Sparr ist bewusst exklusiv für Selbstständige und Einzelkämpfer entwickelt – Freelancer, Berater, Marketer und Agentur-Inhaber. Wir bauen kein zweites Salesforce, sondern deinen persönlichen digitalen Sparringpartner. Für klassische Sales-Teams gibt es bessere Tools.",
  },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setSurveyOpen(true);
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
            className="flex items-center gap-2"
          >
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
            <span className="text-lg font-semibold tracking-tight">Sparr</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a
              href="#problem"
              onClick={handleScrollLink("problem")}
              className="transition hover:text-slate-900"
            >
              Problem
            </a>
            <a
              href="#workflow"
              onClick={handleScrollLink("workflow")}
              className="transition hover:text-slate-900"
            >
              So funktioniert&apos;s
            </a>
            <a
              href="#angebot"
              onClick={handleScrollLink("angebot")}
              className="transition hover:text-slate-900"
            >
              Angebot
            </a>
            <a
              href="#faq"
              onClick={handleScrollLink("faq")}
              className="transition hover:text-slate-900"
            >
              FAQ
            </a>
          </nav>
          <a
            href="#waitlist"
            onClick={handleScrollLink("waitlist")}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Auf Warteliste
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
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Geschlossene Beta – exklusive Plätze
            </span>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Dein KI-Coach für die{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                wirklich wichtigen
              </span>{" "}
              Entscheidungen.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Du hast nicht zu wenig Aufgaben – du hast zu wenig Klarheit. Sparr
              analysiert deine Deals, plant deinen Tag und schreibt mit dir die
              E-Mails, die heute Umsatz bringen.
            </p>

            <form
              id="waitlist"
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
                disabled={submitted}
              >
                {submitted ? "Du bist drin ✓" : "Platz sichern"}
              </button>
            </form>

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
              kein Commitment.
            </p>

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
          </div>

          {/* GLASSMORPHIC STACK */}
          <div className="relative h-[560px] w-full">
            {/* BG Layer 1: Kanban Board */}
            <div className="absolute left-0 top-0 w-[88%] rotate-[-3deg] rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">Deal Pipeline · Q2</span>
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
                <span className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M12 2l1.8 5.5H19l-4.4 3.2L16.2 16 12 12.8 7.8 16l1.6-5.3L5 7.5h5.2L12 2z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900">
                    Sparr KI
                  </div>
                  <div className="text-xs text-emerald-600">
                    schreibt gerade...
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  Welche Deals soll ich heute priorisieren?
                </div>
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600 to-indigo-600 px-3 py-2 text-sm text-white shadow-md">
                  Basierend auf deinen offenen Deals empfehle ich, zuerst{" "}
                  <span className="font-semibold">Müller GmbH (€ 8.400)</span>{" "}
                  nachzufassen – liegt seit 9 Tagen offen
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

      {/* BENTO: WARUM SETUP SCHEITERT */}
      <section id="problem" className="border-t border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
              Das eigentliche Problem
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Warum dein Setup scheitert
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Deine Tools verwalten Chaos. Sie räumen es nicht auf.
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
                Wartet darauf, dass du manuell Daten einträgst, während du
                eigentlich Kundenprojekte abarbeiten musst.
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
                Zeigt dir 40 Aufgaben, aber verrät dir nicht, welche davon heute
                den größten Umsatz bringt.
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
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2l1.8 5.5H19l-4.4 3.2L16.2 16 12 12.8 7.8 16l1.6-5.3L5 7.5h5.2L12 2z" />
                  </svg>
                </span>
                <h3 className="text-lg font-semibold">Sparr</h3>
                <span className="ml-auto rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-medium text-blue-300">
                  KI-Coach
                </span>
              </div>
              <p className="mt-5 text-base leading-relaxed text-slate-300">
                Dein vollwertiger KI-Coach. Analysiert Pipelines, schreibt
                E-Mails, trifft strategische Entscheidungen.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { label: "Pipeline", icon: "📊" },
                  { label: "E-Mails", icon: "✉️" },
                  { label: "Coaching", icon: "🧭" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
                  >
                    <div className="text-base">{f.icon}</div>
                    <div className="mt-1 text-xs font-medium text-slate-200">
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / FOUNDER STORY */}
      <section className="bg-[#fafafa]">
        <div className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
          <div className="grid items-center gap-12 md:grid-cols-[auto,1fr]">
            <div className="relative mx-auto h-32 w-32 shrink-0 md:h-40 md:w-40">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 to-indigo-200 blur-2xl" />
              <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-slate-200 to-slate-300 text-3xl font-semibold text-slate-700 shadow-xl">
                T
              </div>
            </div>
            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-blue-600">
                Wer baut Sparr?
              </span>
              <h2 className="mt-2 text-2xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-3xl">
                &ldquo;Ich saß vor 17 offenen To-Dos und hatte keine Ahnung,
                welches mich heute weiterbringt.&rdquo;
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Ich bin Thomas und führe selbst eine kleine Webdesign-Agentur.
                Mein Problem war nie, dass ich Aufgaben vergessen habe. Mein
                Problem war, dass ich vor 17 offenen To-Dos saß und absolut
                keine Ahnung hatte, welche davon mich heute geschäftlich
                weiterbringt und Umsatz generiert. Sparr ist genau dafür da: Ein
                digitaler COO, der den Lärm ausblendet und dir strategische
                Entscheidungen abnimmt.
              </p>
              <div className="mt-6 text-sm font-medium text-slate-900">
                Thomas
                <span className="font-normal text-slate-500">
                  {" "}
                  · Founder, Sparr
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 STEPS – DARK MODE */}
      <section id="workflow" className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-medium uppercase tracking-wider text-blue-400">
              So funktioniert es
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              In 4 Schritten zum Fokus
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Vom Onboarding zur Ausführung – ohne dass du dein Business neu
              aufbauen musst.
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
                  Kontext herstellen
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-400">
                  Trag in wenigen Minuten deine offenen Deals, deine Quartals-
                  Ziele und deine wichtigsten Kunden ein – ganz ohne langes
                  Setup oder Datenmigration. Sparr braucht nur die Basics (Name,
                  Wert, Status), um sofort zu verstehen, wo dein Business heute
                  steht und welche Hebel wirklich zählen.
                </p>
              </div>
              <div className="order-2 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  Onboarding
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Deal Name", value: "Müller GmbH – Website" },
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
                  Deal speichern
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
                      t: "Follow-up Müller GmbH",
                      d: "Hot · 9 Tage offen",
                      v: "€ 8.400",
                    },
                    {
                      n: 2,
                      t: "Angebot Bauer & Co finalisieren",
                      d: "Heute deadline",
                      v: "€ 12.000",
                    },
                    {
                      n: 3,
                      t: "Kaltakquise: 5 neue Leads",
                      d: "Pipeline füllen",
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
                  Jeden Morgen um 8:00 Uhr liegt dein persönliches Briefing
                  bereit: Die drei Aktionen mit dem größten Umsatz-Hebel,
                  sortiert nach Deal-Wert, Liegezeit und Abschluss­wahrscheinlichkeit.
                  Kein Rauschen, kein Scrollen durch 40 To-Dos – nur das, was
                  heute wirklich Geld bringt.
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
                  AI Coaching
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-400">
                  Steckst du bei einem Angebot fest oder bist unsicher in einem
                  Preis-Gespräch? Sparr ist dein strategischer Sparringspartner
                  – 24/7 erreichbar, kennt dein Business im Detail und gibt dir
                  Klartext-Antworten statt generischer Ratschläge aus dem
                  Internet. Engpässe und schwere Entscheidungen löst du nicht
                  mehr alleine.
                </p>
              </div>
              <div className="order-2 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="relative grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M12 2l1.8 5.5H19l-4.4 3.2L16.2 16 12 12.8 7.8 16l1.6-5.3L5 7.5h5.2L12 2z" />
                      </svg>
                    </span>
                    <span className="text-white">Sparr Coach</span>
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
                    Segment. Biete stattdessen Scope-Reduktion an – das schützt
                    deinen Preis und gibt ihm das Gefühl zu &bdquo;gewinnen&ldquo;.
                  </div>
                  <div className="ml-auto max-w-[60%] rounded-2xl rounded-tr-md bg-white/10 px-3 py-2 text-sm text-slate-200">
                    Welcher Scope?
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

            {/* Step 4 – reversed */}
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="ml-2">
                    Entwurf: Follow-up · Müller GmbH
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
                  <div className="text-slate-500">An: m.mueller@firma.de</div>
                  <div className="text-slate-500">
                    Betreff: Kurzes Update zum Website-Projekt
                  </div>
                  <p className="pt-3">Hallo Herr Müller,</p>
                  <p>
                    ich wollte mich kurz melden, da wir letzte Woche über den
                    nächsten Schritt für Ihr Website-Projekt gesprochen haben.
                  </p>
                  <p>
                    Falls es bei Ihnen aktuell Fragen zum Angebot gibt,
                    beantworte ich diese gerne in einem 15-min Call diese Woche.
                  </p>
                  <p className="text-slate-400">Beste Grüße, Thomas</p>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg bg-blue-500 py-2 text-xs font-medium text-white transition hover:bg-blue-400"
                  >
                    Senden ↗
                  </button>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    4
                  </span>
                  <span className="text-slate-300">Schritt 4</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold sm:text-3xl">
                  Aufgaben erledigen lassen
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-400">
                  Sparr greift dir beim Schreiben deiner Follow-up-E-Mails
                  aktiv unter die Arme, recherchiert passende Leads für deine
                  Kaltakquise und bereitet komplette Angebots­entwürfe vor. Du
                  gibst nur noch das finale Go – die Tipparbeit und die
                  Vorbereitung übernimmt dein Coach.
                </p>
              </div>
            </div>
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
              Für Alle auf der Warteliste
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Du sicherst dir nicht nur einen frühen Zugang – sondern einen
              dauerhaft besseren Preis.
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-xl">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-900/10 sm:p-10">
              {/* Badge */}
              <div className="absolute right-6 top-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Early-Bird Deal
                </span>
              </div>

              <div className="text-sm font-medium uppercase tracking-wider text-blue-600">
                Beta-Launch Preis
              </div>

              <div className="mt-5 flex items-end gap-3">
                <span className="text-6xl font-semibold tracking-tight text-slate-900">
                  €30
                </span>
                <span className="mb-2 text-base text-slate-500">/ Monat</span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-400 line-through">€60 / Monat</span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  50% Rabatt
                </span>
                <span className="text-slate-500">für die ersten 60 Tage</span>
              </div>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              <ul className="mt-8 space-y-3.5 text-sm text-slate-700">
                {[
                  "Voller Zugang zu allen Sparr-Features",
                  "Tägliches 8:00 Uhr Briefing mit Umsatz-Hebeln",
                  "Unbegrenztes AI-Strategie-Coaching",
                  "E-Mail-Drafting & automatische Lead-Recherche",
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
                    und nichts committen – sobald dein Zugang bereit ist,
                    entscheidest du in Ruhe, ob Sparr wirklich für dich passt.
                    Volles Risiko bei uns.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            Grid mit items-start + auto-rows-min, damit sich beim Öffnen
            einer Frage NUR die jeweilige Kachel vergrößert und die
            gegenüberliegende Spalte ihre Höhe behält.
          */}
          <div className="mt-14 grid auto-rows-min items-start gap-4 md:grid-cols-2">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`self-start rounded-2xl border transition ${
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
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-50">
          <div className="absolute -top-20 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center lg:px-10">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Bereit, das Rauschen abzustellen?
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Sichere dir einen der exklusiven Plätze – inklusive 50% Rabatt für
            die ersten 60 Tage.
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
              disabled={submitted}
              className="h-12 rounded-full bg-blue-500 px-6 text-sm font-medium text-white transition hover:bg-blue-400 disabled:opacity-60"
            >
              {submitted ? "Du bist drin ✓" : "Auf die Warteliste"}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-400">
            Kostenloses Eintragen für die Warteliste · kein Zahlungsmittel ·
            jederzeit kündbar.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row lg:px-10">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-slate-900 text-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3">
                <path
                  d="M5 12l4 4L19 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-semibold text-slate-900">Sparr</span>
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
              href="#waitlist"
              onClick={handleScrollLink("waitlist")}
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
        onClose={() => setSurveyOpen(false)}
      />
    </div>
  );
}
