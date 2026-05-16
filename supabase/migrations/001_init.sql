-- ─────────────────────────────────────────────────────────────────────────────
-- Sparr — Initial Schema
-- Run this in your Supabase project: SQL Editor > New Query > Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Survey responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id  UUID        REFERENCES waitlist (id) ON DELETE CASCADE,
  problem_text TEXT,
  current_tool TEXT,
  monthly_spend TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at          ON waitlist (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_responses_waitlist_id ON survey_responses (waitlist_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE waitlist          ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses  ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT (sign up to waitlist)
CREATE POLICY "anon can insert waitlist"
  ON waitlist FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous users to INSERT survey responses
CREATE POLICY "anon can insert survey_responses"
  ON survey_responses FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous SELECT on waitlist (needed for COUNT in keepalive + duplicate check)
CREATE POLICY "anon can select waitlist"
  ON waitlist FOR SELECT TO anon
  USING (true);

-- Authenticated / service role has full access by default (no policy needed)
