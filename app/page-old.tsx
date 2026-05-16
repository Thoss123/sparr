'use client'

import { useEffect, useRef } from 'react'
import WaitlistForm from './components/WaitlistForm'

// ── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left'
}) {
  const ref = useReveal()
  const cls = direction === 'left' ? 'reveal-left' : 'reveal'
  return (
    <div ref={ref} className={`${cls} ${className}`} style={{ transitionDelay: delay > 0 ? `${delay}s` : undefined }}>
      {children}
    </div>
  )
}

// ── KI-Partikel ──────────────────────────────────────────────────────────────

function AIParticles() {
  const particles = [
    { top: '10%', left: '-8%', dx: '-30px', dy: '-50px', delay: '0s', dur: '3.5s' },
    { top: '30%', right: '-10%', dx: '40px', dy: '-30px', delay: '0.8s', dur: '4s' },
    { bottom: '20%', left: '-6%', dx: '-20px', dy: '40px', delay: '1.5s', dur: '3s' },
    { top: '60%', right: '-5%', dx: '30px', dy: '20px', delay: '2.2s', dur: '4.5s' },
    { top: '5%', right: '20%', dx: '15px', dy: '-40px', delay: '0.5s', dur: '3.8s' },
    { bottom: '10%', right: '-8%', dx: '25px', dy: '30px', delay: '1s', dur: '3.2s' },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            ...p,
            ['--dx' as string]: p.dx,
            ['--dy' as string]: p.dy,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </>
  )
}

// ── Simuliertes KI-Briefing ──────────────────────────────────────────────────

function AIBriefingCard() {
  const items = [
    {
      emoji: '1️⃣',
      text: 'Ruf Herr Müller an – ',
      highlight: 'Angebot verfällt morgen',
      sub: '.',
    },
    {
      emoji: '2️⃣',
      text: 'Nachfassen bei Meier – ',
      highlight: 'Interesse bestätigt',
      sub: ', nächster Schritt offen.',
    },
    {
      emoji: '3️⃣',
      text: 'Vertrag für Schulze vorbereiten – ',
      highlight: '€12k Potenzial',
      sub: '.',
    },
  ]

  return (
    <div className="relative animate-float">
      <AIParticles />
      <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-auto shadow-xl shadow-slate-900/5">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs text-slate-400 font-medium">Morgen-Briefing, 8:00</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-linear-to-r from-blue-600/6 to-transparent"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <span className="text-base shrink-0 mt-0.5">{item.emoji}</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {item.text}
                <span className="text-blue-600 font-medium">{item.highlight}</span>
                {item.sub}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">S</span>
            </div>
            <span className="text-xs text-slate-400">Sparr KI • gerade aktualisiert</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Visuell: Tool-Chaos → Sparr-Ordnung ──────────────────────────────────────

function ClutteredDesktop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.chaos-card').forEach((card) => card.classList.add('visible'))
          observer.unobserve(el)
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Positioned via top/left (% of container), not translate(%) which is relative to own size
  const chaosCards = [
    {
      tool: 'Trello',
      text: '3 überfällige Karten',
      color: 'bg-orange-50 border-orange-200',
      badge: '3', badgeColor: 'bg-orange-500',
      top: '4%', left: '1%', rot: '-5deg', delay: '0s',
    },
    {
      tool: 'Notion',
      text: 'Wiki — zuletzt bearbeitet: vor 14 Tagen',
      color: 'bg-slate-50 border-slate-200',
      badge: '', badgeColor: '',
      top: '2%', right: '1%', rot: '4deg', delay: '0.1s',
    },
    {
      tool: 'Excel',
      text: 'Lead-Liste.xlsx — Version 3 (final final)',
      color: 'bg-green-50 border-green-200',
      badge: '', badgeColor: '',
      top: '44%', left: '2%', rot: '-3deg', delay: '0.2s',
    },
    {
      tool: 'E-Mail',
      text: '12 ungelesene von Kunden',
      color: 'bg-red-50 border-red-200',
      badge: '12', badgeColor: 'bg-red-500',
      top: '40%', right: '2%', rot: '5deg', delay: '0.3s',
    },
    {
      tool: 'Kalender',
      text: 'Herr Müller — Termin verpasst (gestern)',
      color: 'bg-yellow-50 border-yellow-200',
      badge: '!', badgeColor: 'bg-yellow-500',
      bottom: '4%', left: '28%', rot: '-2deg', delay: '0.4s',
    },
  ]

  return (
    <div ref={ref} className="relative h-80 md:h-96 max-w-2xl mx-auto">
      {chaosCards.map((card, i) => {
        const pos: React.CSSProperties = {
          top: card.top,
          left: card.left,
          right: card.right,
          bottom: card.bottom,
          ['--rot' as string]: card.rot,
          animationDelay: card.delay,
        }
        return (
          <div
            key={i}
            className={`chaos-card absolute w-44 px-4 py-3 rounded-xl border ${card.color} shadow-md backdrop-blur-sm`}
            style={pos}
          >
            {card.badge && (
              <span className={`absolute -top-2 -right-2 w-5 h-5 ${card.badgeColor} text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm`}>
                {card.badge}
              </span>
            )}
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{card.tool}</p>
            <p className="text-xs text-slate-600 leading-snug">{card.text}</p>
          </div>
        )
      })}

      {/* Sparr centred */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-xl shadow-blue-600/30 ring-4 ring-white animate-float">
          <span className="text-white text-xl font-bold">S</span>
        </div>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 whitespace-nowrap">
          Ordnung schaffen
        </span>
      </div>
    </div>
  )
}

// ── Bento-Karten: Visuelle Simulationen ──────────────────────────────────────

function MiniCalendar() {
  const blocks = [
    { time: '08:00', label: 'Cold-Calls (Lücke erkannt)', active: true },
    { time: '09:30', label: 'Kundenprojekt Weber', active: false },
    { time: '11:00', label: 'Angebot Herr Müller nachfassen', active: true },
    { time: '12:00', label: 'Mittagspause', active: false },
  ]
  return (
    <div className="mt-5 space-y-1.5">
      {blocks.map((b) => (
        <div key={b.time} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-10 text-right font-mono">{b.time}</span>
          <div className={`flex-1 h-8 rounded-lg flex items-center px-2.5 ${b.active ? 'bg-linear-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-600/20' : 'bg-slate-50 border border-slate-100'}`}>
            <span className={`text-[10px] font-medium ${b.active ? 'text-white' : 'text-slate-400'}`}>{b.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ChatSnippet() {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex justify-end">
        <div className="bg-slate-100 rounded-2xl rounded-br-sm px-3.5 py-2.5 max-w-[90%]">
          <p className="text-[11px] text-slate-600">Was soll ich machen, um mein Business maximal voranzubringen?</p>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="bg-linear-to-r from-blue-600/8 to-blue-600/3 border border-blue-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[92%] shadow-sm">
          <p className="text-[11px] text-slate-700 leading-relaxed">
            <span className="text-blue-600 font-semibold">Sparr:</span> &quot;Fokussiere dich am
            Vormittag auf Cold-Calls. Ich habe dir 200 Leads in deiner Nähe gesucht.&quot;
          </p>
        </div>
      </div>
    </div>
  )
}

function ActionList() {
  const actions = [
    { label: '3 Nachfass-Mails versendet', done: true },
    { label: '200 Leads in deiner Region gefunden', done: true },
    { label: 'Instagram-Post vorgeschlagen', done: false },
  ]
  return (
    <div className="mt-5 space-y-2">
      {actions.map((a, i) => (
        <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${a.done ? 'bg-blue-50/50 border border-blue-100/50' : 'bg-slate-50 border border-slate-100'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${a.done ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30' : 'border-2 border-slate-200 text-transparent'}`}>
            {a.done ? '✓' : ''}
          </span>
          <span className={`text-[11px] font-medium ${a.done ? 'text-slate-700' : 'text-slate-400'}`}>{a.label}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5 pt-1 px-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
        <span className="text-[10px] text-blue-600 font-medium">Sparr arbeitet im Hintergrund</span>
      </div>
    </div>
  )
}

// ── Icons ────────────────────────────────────────────────────────────────────

function IconSun() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function IconMessageCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function IconBarChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconZap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

// ── Seite ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const bentoCards = [
    {
      icon: <IconSun />,
      title: 'Plant deinen Tag',
      text: 'Sparr kennt deine Arbeitszeiten, deine Termine und deine offenen Deals. Jeden Morgen bekommst du einen fertigen Tagesplan: Lücken zwischen Meetings werden mit umsatzrelevanten Aufgaben gefüllt, Prioritäten nach Potenzial sortiert — nicht nach Dringlichkeit.',
      visual: <MiniCalendar />,
    },
    {
      icon: <IconMessageCircle />,
      title: 'Kennt dein Business',
      text: 'Sparr versteht, wie dein Geschäft funktioniert — deine Kunden, deine Branche, deine Ziele. Frag "Was soll ich tun?" und bekomm eine konkrete Strategie, die auf deiner aktuellen Situation basiert. Keine generischen Tipps, sondern Antworten, die nur für dein Business passen.',
      visual: <ChatSnippet />,
    },
    {
      icon: <IconBarChart />,
      title: 'Arbeitet für dich mit',
      text: 'Sparr ist nicht nur ein Coach, der redet — er handelt. Er schreibt Nachfass-Mails in deinem Tonfall, findet kalte Leads in deiner Region, schlägt Marketing-Maßnahmen vor und bereitet Angebote vor. Du entscheidest, was rausgeht — Sparr erledigt die Vorarbeit.',
      visual: <ActionList />,
    },
  ]

  const paradigmCards = [
    {
      icon: <IconTarget />,
      title: 'Dein CRM',
      text: 'Wartet darauf, dass du manuell Daten einträgst, während du eigentlich Kundenprojekte abarbeiten musst.',
    },
    {
      icon: <IconZap />,
      title: 'Deine To-Do-Liste',
      text: 'Zeigt dir 40 Aufgaben, aber verrät dir nicht, welche davon heute den größten Umsatz bringt.',
    },
    {
      icon: <IconShield />,
      title: 'Sparr',
      text: 'Du trägst nichts ein. Sparr analysiert deinen Kontext und spuckt dir jeden Morgen nur die 3 Hebel aus, die heute zählen.',
    },
  ]

  return (
    <main>
      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-slate-900">Sparr</span>
          <a
            href="#waitlist-bottom"
            className="border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/60 transition-colors"
          >
            Warteliste
          </a>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-24 md:pt-28 md:pb-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-medium text-blue-600 mb-4 tracking-wide animate-fade-in-up" style={{ animationDelay: '0s' }}>
              Für Webdesigner, Marketer & Solopreneure
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
              Hör auf, To-Dos abzuarbeiten.{' '}
              <span className="text-blue-600">Fang an, Deals zu closen.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg animate-fade-in-up" style={{ animationDelay: '0.22s', opacity: 0, animationFillMode: 'forwards' }}>
              Sparr ist kein weiteres CRM, das du pflegen musst. Es ist dein proaktiver KI-Coach,
              der täglich deine Deals analysiert und dir morgens um 8:00 Uhr exakt die 3 Aktionen
              nennt, die heute Umsatz bringen.
            </p>
            <div className="max-w-lg animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards' }}>
              <WaitlistForm id="waitlist-hero" />
            </div>
          </div>

          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <AIBriefingCard />
          </div>
        </div>
      </section>

      {/* ── Schmerz-Sektion ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
                Du arbeitest 10 Stunden am Tag – und hast trotzdem das Gefühl, nichts geschafft zu
                haben.
              </h2>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-4">
                Du kennst das: 3 überfällige Karten in Trello. 12 unbeantwortete Kunden-Mails.
                Eine Excel-Liste, die &quot;final final&quot; heißt. Und der Termin mit Herr Müller?
                Den hast du gestern verpasst.
              </p>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Deine Tools sammeln Daten — aber keines davon sagt dir:{' '}
                <span className="font-semibold text-slate-800">&quot;Ruf jetzt Herr Müller an. Sein Angebot läuft morgen ab, und er hat letzte Woche zweimal nachgefragt.&quot;</span>
              </p>
            </div>
          </Reveal>
          <Reveal>
            <ClutteredDesktop />
          </Reveal>
        </div>
      </section>

      {/* ── Paradigmenwechsel ───────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-6">
              <p className="text-sm font-medium text-blue-600 mb-3">Warum dein Setup scheitert</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-6">
                Deine Tools sammeln Arbeit. Sparr macht daraus Fokus.
              </h2>
            </div>
          </Reveal>
          <Reveal>
            <div className="max-w-2xl mx-auto mb-16">
              <p className="text-base md:text-lg text-slate-600 leading-relaxed text-center">
                Die meisten Systeme sind Ablagen: Sie speichern Kontakte, Aufgaben und Notizen.
                Als Solopreneur brauchst du aber kein weiteres Archiv, sondern eine klare
                Entscheidung, was du heute tun musst.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {paradigmCards.map((item, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="group bg-white border border-slate-200/80 rounded-2xl p-6 h-full hover:shadow-lg hover:shadow-blue-600/[0.04] hover:border-blue-200/50 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── So funktioniert's – Bento ───────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-sm font-medium text-blue-600 mb-3">So sieht das in der Praxis aus</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                So funktioniert das jeden Tag
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bentoCards.map((card, i) => (
              <Reveal key={i} delay={i * 0.13}>
                <div className="group bg-[#fafafa] border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-300/30 hover:border-slate-200 transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 mb-4 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:scale-110 transition-all">
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base mb-1.5">{card.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.text}</p>
                  {card.visual}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder-Story ───────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50">
              <div className="flex flex-col md:flex-row gap-8 md:items-start">
                <div className="shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gray-200 border border-slate-200 shadow-inner" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-3">Gründer-Story</p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-5">
                    Gebaut aus eigenem Schmerz.
                  </h2>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    Ich bin Thomas und führe selbst eine kleine Webdesign-Agentur. Ich habe
                    Stunden damit verschwendet, Systeme aktuell zu halten und To-Do-Karten zu
                    schieben – nur um am Ende des Tages das wichtigste Kunden-Follow-up zu
                    vergessen. Sparr ist das Tool, das ich mir selbst immer gewünscht habe. Keine
                    Datenbank, die man pflegen muss, sondern ein echter Mitdenker.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Fullscreen CTA ──────────────────────────────────────────────── */}
      <section
        id="waitlist-bottom"
        className="relative py-28 md:py-36 px-6 overflow-hidden grain"
        style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e293b 100%)' }}
      >
        {/* Glow orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Warteliste – Plätze limitiert
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                Bereit für den Fokus-Modus?
              </h2>
              <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
                Sichere dir deinen Platz auf der Warteliste. Wir benachrichtigen dich, sobald Sparr startet.
              </p>
            </div>

            {/* Glassmorphism form card */}
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl shadow-black/30">
              <WaitlistForm id="waitlist-bottom-form" variant="cta" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-400">
          © 2026 Sparr – KI-Business-Coach.
        </div>
      </footer>
    </main>
  )
}
