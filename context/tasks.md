# Tasks – MVP v0.1 (2–3 weeks) with Supabase

## P0 — Must Ship
1) **Auth**: Supabase email/password; protected routes; seed admin
2) **Orgs & Projects**: CRUD; distribution_list (text[]); org membership link
3) **Repository**: Upload to Supabase Storage; insert FileMeta; search by tags/name; optional geotag (lat/lng columns)
4) **Daily Reports**: Mobile form → server PDF (Edge Function or API route) → store pdf_url → email via Resend to distribution_list
5) **Punch List**: CRUD; export PDF
6) **Checklists**: Template CRUD (jsonb fields); submission form; export PDF
7) **PWA**: manifest + SW; installable

## P1 — Nice to Have
8) CSV/Excel schedule artifact upload (store only)
9) Basic activity log (who/what/when)
10) Demo seed button (sample org/project/data)

## P2 — Stubs
11) EarthCam ingest stub (no-op)
12) AI summary stub endpoint: POST /api/ai/summary → { status: "todo" }

## RLS & Security
- Enable RLS on all tables
- Policies: user must belong to org that owns the project
- Signed URLs for storage downloads
- Service role key used **only** server-side

## Done = Acceptance
- End-to-end working flows for all P0
- PDFs generate and email (or log)
- US-region project configured; .env.example present
- No unused code/folders