import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export async function POST(request: Request) {
  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Bitte gib eine gültige Email-Adresse ein.' }, { status: 400 })
  }

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('waitlist')
    .insert({ email })
    .select('id')
    .single()

  if (error) {
    // Postgres unique violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Diese Email ist bereits eingetragen. Du bist schon auf der Liste!' },
        { status: 409 },
      )
    }
    console.error('[waitlist] insert error:', error)
    return NextResponse.json({ error: 'Etwas ist schiefgelaufen.' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id }, { status: 201 })
}
