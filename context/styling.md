# Styling & Code Standards

## UX
- Tailwind utility-first; clean and restrained
- Mobile-first forms; large tap targets; clear labels
- Consistent spacing/typography (Tailwind defaults)
- Accessibility: label inputs; visible focus states

## Components
- Small primitives only: Button, Input, Select, Modal, FileUploader, MapPinField
- Co-locate form schemas with forms
- Prefer server actions/API routes for side effects

## Code
- TypeScript strict; no implicit any
- Pure functions where possible; side effects in thin layers
- Aim **<500 LOC per file**; split by domain if needed
- Reuse utilities in /lib; no duplicate helpers

## Folders
- Only keep used components
- Group utils by domain: pdf.ts, email.ts, geo.ts, db.ts, supabase.ts

## Dependencies
- Baseline: Next, React, Tailwind, **@supabase/supabase-js**, (pdf lib), Resend, (Zod optional)
- Avoid heavy UI kits/state libs/date libs unless justified

.env.example (Supabase):
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=