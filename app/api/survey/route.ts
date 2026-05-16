import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function POST(request: Request) {
  let body: {
    waitlist_id?: string
    problem_text?: string | null
    current_tool?: string | null
    monthly_spend?: string | null
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const { waitlist_id, problem_text, current_tool, monthly_spend } = body

  if (!waitlist_id) {
    return NextResponse.json({ error: 'Fehlende waitlist_id.' }, { status: 400 })
  }

  const supabase = getSupabase()

  const { error } = await supabase.from('survey_responses').insert({
    waitlist_id,
    problem_text: problem_text ?? null,
    current_tool: current_tool ?? null,
    monthly_spend: monthly_spend ?? null,
  })

  if (error) {
    console.error('[survey] insert error:', error)
    return NextResponse.json({ error: 'Etwas ist schiefgelaufen.' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
