# Claude Context – RailCore MVP (Supabase)

You are an engineering Copilot. **Before generating or changing code, read all files in /context.**

## Non-negotiables
- Keep code lean; reuse over duplication.
- Target **<500 LOC per file** where reasonable.
- Minimize dependencies; justify additions in comments/PR.
- US-only data residency (Supabase US region).
- Do not invent scope; follow /context/tasks.md and /context/planning.md.

## Tech Decisions (v1)
- Next.js 14 (App Router) + TypeScript + Tailwind
- Supabase: Auth, Postgres (RLS), Storage, Edge Functions (US region)
- Email via Resend (stub OK)
- PDF generation via **one** library (pdf-lib or @react-pdf/renderer)
- PWA enabled

## Scope Guardrails
- MVP only: Auth, Orgs/Projects, Repository, Daily Reports (PDF+Email), Punch List, Checklists (templates+submissions+PDF)
- Non-goals: EarthCam ingestion, Primavera parsing, advanced AI summaries (stubs only)

## Quality Bar
- TS strict; no implicit `any`
- Small pure utils in /lib
- Proper empty/error states
- Mobile-first UX

## PR Checklist
- [ ] Matches tasks.md scope
- [ ] No dead code / unused folders
- [ ] Reused primitives
- [ ] No heavy deps added without justification
- [ ] Reasonable file sizes/splits
- [ ] Types guard behavior (zod/types)