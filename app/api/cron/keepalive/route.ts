/**
 * Supabase Keep-Alive Cron
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase free-tier projects pause after **7 days** of zero API activity.
 * This endpoint runs every 3 days via Vercel Cron (see vercel.json) to keep
 * the project active. It performs a lightweight COUNT query — no data is
 * written or exposed.
 *
 * Security: Vercel automatically attaches `Authorization: Bearer <CRON_SECRET>`
 * to all cron invocations. Set CRON_SECRET in your Vercel project env vars.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Validate Vercel cron secret
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('[keepalive] Supabase error:', error.message)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    const result = {
      ok: true,
      waitlist_count: count ?? 0,
      pinged_at: new Date().toISOString(),
    }

    console.log('[keepalive]', result)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[keepalive] unexpected error:', err)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}
