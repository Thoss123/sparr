<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Sparr and related marketing surfaces should stay German-only—avoid English UI or marketing copy on those pages.
- When two adjacent sections describe the same three pillars, use different headings for each (outcome/teaser language vs concrete feature names)—do not repeat identical titles in both places.
- Landing visuals should remain readable: lay out illustrative cards so labels are not obscured or overly stacked; use cohesive motion (scroll reveals, staggered entrances) across the page when iterating on polish.
- The hero/CTA email capture should read as one pill: a single outer border wraps both the input and submit button with no visual gap or floating button.
- After successful waitlist signup, prefer a real Lottie success animation rather than only a hand-rolled SVG checkmark.

## Learned Workspace Facts

- Sparr marketing landing lives mainly in `app/page.tsx`, `app/layout.tsx`, `app/components/WaitlistForm.tsx`, with shared styling in `app/globals.css`.
- Frontend stack is Next.js 16 App Router, React 19, and Tailwind CSS v4 using `@tailwindcss/postcss`.
- Sparr is positioned as a proactive AI business coach for solopreneurs/Einzelkämpfer—daily deal-aware priorities plus waitlist and multi-step survey flows in `WaitlistForm`.
- Recent landing design direction uses glass-style surfaces, light `#fafafa` backgrounds with blue accent, scroll-triggered reveals, and illustrative “tool chaos” versus Sparr-centered visuals.
