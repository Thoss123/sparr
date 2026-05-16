'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Lottie from 'lottie-react'

type Phase = 'email' | 'survey-1' | 'survey-2' | 'survey-3' | 'done'

const TOOLS = ['Notion', 'Trello', 'Excel', 'Gar keins', 'Anderes'] as const
const SPENDS = ['€0', '€1–20', '€21–50', '€50+'] as const

const CONFETTI_COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#1d4ed8', '#818cf8', '#6366f1']

// Minimal inline Lottie JSON — green circle + white checkmark, bounce scale-in
const checkmarkAnimationData = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: 'Success Checkmark',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Checkmark',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.2], y: [1.0] }, o: { x: [0.8], y: [0.0] }, t: 0,  s: [0,   0,   100] },
            { i: { x: [0.2], y: [1.0] }, o: { x: [0.8], y: [0.0] }, t: 20, s: [110, 110, 100] },
            { i: { x: [0.2], y: [1.0] }, o: { x: [0.8], y: [0.0] }, t: 30, s: [95,  95,  100] },
            {                                                          t: 40, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          nm: 'Circle Group',
          it: [
            {
              ty: 'el',
              nm: 'Circle',
              d: 1,
              s: { a: 0, k: [160, 160] },
              p: { a: 0, k: [0, 0] },
            },
            {
              ty: 'fl',
              nm: 'Fill',
              c: { a: 0, k: [0.133, 0.773, 0.369, 1] },
              o: { a: 0, k: 100 },
              r: 1,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
            },
          ],
        },
        {
          ty: 'gr',
          nm: 'Check Group',
          it: [
            {
              ty: 'sh',
              nm: 'Check Path',
              ks: {
                a: 0,
                k: {
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                  v: [[-38, 3], [-13, 28], [42, -27]],
                  c: false,
                },
              },
            },
            {
              ty: 'st',
              nm: 'Stroke',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 12 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
            },
          ],
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
  ],
}

function ConfettiBurst() {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360
    const distance = 60 + Math.random() * 40
    const cx = Math.cos((angle * Math.PI) / 180) * distance
    const cy = Math.sin((angle * Math.PI) / 180) * distance
    return {
      cx: `${cx}px`,
      cy: `${cy}px`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${0.3 + Math.random() * 0.3}s`,
      size: 5 + Math.random() * 6,
    }
  })

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {dots.map((d, i) => (
        <span
          key={i}
          className="confetti-dot"
          style={{
            ['--cx' as string]: d.cx,
            ['--cy' as string]: d.cy,
            backgroundColor: d.color,
            animationDelay: d.delay,
            width: d.size,
            height: d.size,
          }}
        />
      ))}
    </div>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-500 ${
            i <= current ? 'w-8 bg-blue-600' : 'w-4 bg-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function WaitlistForm({
  id,
  variant = 'inline',
}: {
  id?: string
  variant?: 'inline' | 'cta'
}) {
  const [phase, setPhase] = useState<Phase>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [waitlistId, setWaitlistId] = useState<string | null>(null)
  const [inputFocused, setInputFocused] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [problemText, setProblemText] = useState('')
  const [currentTool, setCurrentTool] = useState('')
  const [monthlySpend, setMonthlySpend] = useState('')
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [cameFromSurvey, setCameFromSurvey] = useState(false)

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const isSurveyPhase = phase === 'survey-1' || phase === 'survey-2' || phase === 'survey-3'
  const isOverlayVisible = isSurveyPhase || (phase === 'done' && cameFromSurvey)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (isOverlayVisible) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOverlayVisible])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(null)

    if (!isValidEmail(email)) {
      setEmailError('Bitte gib eine gültige Email-Adresse ein.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setEmailError(data.error || 'Etwas ist schiefgelaufen. Bitte versuch es nochmal.')
        return
      }

      setWaitlistId(data.id)
      setPhase('survey-1')
    } catch {
      setEmailError('Netzwerkfehler. Bitte versuch es nochmal.')
    } finally {
      setIsLoading(false)
    }
  }

  const submitSurvey = useCallback(async () => {
    setSurveyLoading(true)
    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waitlist_id: waitlistId,
          problem_text: problemText || null,
          current_tool: currentTool || null,
          monthly_spend: monthlySpend || null,
        }),
      })
    } finally {
      setSurveyLoading(false)
      setCameFromSurvey(true)
      setPhase('done')
    }
  }, [waitlistId, problemText, currentTool, monthlySpend])

  const skipSurvey = () => {
    setCameFromSurvey(true)
    setPhase('done')
  }

  // ── Done state (inline fallback, not reached via normal flow) ───────────────

  if (phase === 'done' && !cameFromSurvey) {
    return (
      <div className="text-center py-6 animate-scale-in">
        <div className="relative inline-block mb-4">
          <ConfettiBurst />
          <Lottie
            animationData={checkmarkAnimationData}
            loop={false}
            style={{ width: 80, height: 80 }}
          />
        </div>
        <p className={`text-lg font-bold mb-1 ${variant === 'cta' ? 'text-white' : 'text-slate-900'}`}>
          Du bist auf der Liste!
        </p>
        <p className={`text-sm ${variant === 'cta' ? 'text-slate-300' : 'text-slate-500'}`}>
          Wir melden uns bei dir.
        </p>
      </div>
    )
  }

  // ── Email form ─────────────────────────────────────────────────────────────

  const emailForm = (
    <form
      id={id}
      onSubmit={handleEmailSubmit}
      className={`w-full ${variant === 'cta' ? 'max-w-md mx-auto' : ''}`}
      noValidate
    >
      <div className={`relative ${variant === 'cta' ? 'mb-4' : ''}`}>
        {/* Ein Rahmen umschließt Input + Button (kein Überlappen, eine Pill) */}
        <div
          className={`flex w-full flex-col overflow-hidden p-1 transition-all duration-300 sm:flex-row sm:items-stretch sm:rounded-full rounded-2xl border shadow-sm ${
            variant === 'cta'
              ? `bg-white/10 backdrop-blur-sm ${emailError ? 'border-red-400/50' : inputFocused ? 'border-blue-400/60 ring-2 ring-blue-500/20' : 'border-white/25'}`
              : `${emailError ? 'border-red-400 ring-2 ring-red-500/15' : inputFocused ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-slate-200'} bg-white`
          }`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError(null)
            }}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Deine beste E-Mail-Adresse"
            required
            autoComplete="email"
            className={`min-h-[48px] min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-base outline-none sm:min-h-0 sm:py-2.5 placeholder:text-slate-400 ${
              variant === 'cta' ? 'text-white placeholder:text-slate-400' : 'text-slate-900'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="min-h-[48px] w-full shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:opacity-50 sm:min-h-0 sm:w-auto sm:rounded-full sm:px-7 hover:shadow-lg active:scale-[0.98] cursor-pointer"
          >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Wird eingetragen…
                </span>
              ) : (
                'Kostenlos auf die Warteliste'
              )}
            </button>
        </div>
        {emailError && (
          <p className="mt-3 text-sm text-red-500 text-center animate-fade-in-up" role="alert">
            {emailError}
          </p>
        )}
      </div>
      <p className={`text-xs text-center mt-3 ${variant === 'cta' ? 'text-slate-400' : 'text-slate-400'}`}>
        Kein Spam. Keine Kreditkarte. Nur ein Platz auf der Liste.
      </p>
    </form>
  )

  return (
    <>
      {emailForm}

      {/* ── Fullscreen survey overlay — rendered via portal to escape any ancestor
           stacking context created by backdrop-filter, transform, or will-change ── */}
      {mounted && isSurveyPhase && createPortal(
        <div
          className="fixed inset-0 z-[9999] fullscreen-overlay"
          style={{ backgroundColor: 'rgba(2,6,23,0.95)', backdropFilter: 'blur(8px)' }}
        >
          <div className="h-full flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
            <div className="w-full max-w-lg fullscreen-overlay-content">

              {/* Header */}
              <div className="text-center mb-2">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  Du bist auf der Liste!
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Hilf uns, Sparr für dich zu bauen.
                </h2>
                <p className="text-slate-400 text-sm">
                  3 kurze Fragen — dauert unter einer Minute.
                </p>
              </div>

              <StepIndicator
                current={phase === 'survey-1' ? 0 : phase === 'survey-2' ? 1 : 2}
                total={3}
              />

              {/* ── Step 1: Problem ────────────────────────────────────── */}
              {phase === 'survey-1' && (
                <div className="step-enter">
                  <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-slate-200 mb-4">
                      Was ist dein größtes Problem beim Managen deines Alltags?
                    </label>
                    <textarea
                      value={problemText}
                      onChange={(e) => setProblemText(e.target.value)}
                      rows={4}
                      placeholder="Z.B. ich verliere den Überblick über offene Angebote…"
                      className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] resize-none transition-all"
                    />
                    <div className="flex items-center justify-between mt-6">
                      <button
                        type="button"
                        onClick={skipSurvey}
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        Überspringen
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhase('survey-2')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Weiter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Tool ───────────────────────────────────────── */}
              {phase === 'survey-2' && (
                <div className="step-enter">
                  <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-slate-200 mb-4">
                      Welches Tool nutzt du aktuell?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TOOLS.map((tool) => (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => setCurrentTool(tool)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                            currentTool === tool
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/25'
                              : 'bg-white/[0.05] border-white/10 text-slate-300 hover:bg-white/[0.1] hover:border-white/20'
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setPhase('survey-1')}
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        Zurück
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhase('survey-3')}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Weiter
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Spend ──────────────────────────────────────── */}
              {phase === 'survey-3' && (
                <div className="step-enter">
                  <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <label className="block text-sm font-medium text-slate-200 mb-4">
                      Was zahlst du mtl. für Business-Tools?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SPENDS.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setMonthlySpend(amount)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                            monthlySpend === amount
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/25'
                              : 'bg-white/[0.05] border-white/10 text-slate-300 hover:bg-white/[0.1] hover:border-white/20'
                          }`}
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setPhase('survey-2')}
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      >
                        Zurück
                      </button>
                      <button
                        type="button"
                        onClick={submitSurvey}
                        disabled={surveyLoading}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-600/25 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {surveyLoading ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Wird gesendet…
                          </span>
                        ) : (
                          'Antworten absenden'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Fullscreen success overlay — also via portal ───────────────────── */}
      {mounted && phase === 'done' && cameFromSurvey && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center fullscreen-overlay"
          style={{ backgroundColor: 'rgba(2,6,23,0.95)' }}
        >
          <div className="text-center animate-scale-in px-6">
            <div className="relative inline-block mb-2">
              <ConfettiBurst />
            </div>
            <Lottie
              animationData={checkmarkAnimationData}
              loop={false}
              style={{ width: 160, height: 160, margin: '0 auto' }}
            />
            <h3 className="text-2xl font-bold text-white mb-2 mt-4">Du bist auf der Liste!</h3>
            <p className="text-slate-400 mb-8">Wir melden uns bei dir.</p>
            <button
              type="button"
              onClick={() => setCameFromSurvey(false)}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              Zurück zur Seite
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
