# Planning – RailCore MVP (Supabase)

## Milestones
**Week 1**
- Auth, Orgs/Projects, base layout, Repository upload/search
- Pick ONE PDF lib; implement Daily Report PDF
- Email pipeline via Resend (fallback to console)

**Week 2**
- Daily Report full flow (PDF+Email)
- Punch List CRUD + PDF
- Checklist templates + submissions + PDF
- PWA (manifest, SW)

**Week 3 (buffer)**
- Activity log (P1), demo seed, QA, perf pass, docs

## Key Decisions
- Hosting: Vercel + Supabase (US region) → meets UP security/data-residency needs
- Web-first now; mobile app (Expo or Flutter) later reusing the same APIs
- Keep dependencies minimal; primitives over megakits

## Risks & Mitigations
- **Timeline**: Keep to P0; defer non-essentials
- **PDF complexity**: Use a fixed layout; avoid theme over-engineering
- **Email deliverability**: Start with Resend dev/log mode; warm domains later

## Demo Script (Thursday)
1) Login → Create Project → Add distribution list  
2) Upload photos/docs (+tags, optional pin)  
3) Fill Daily Report → generate PDF → send (toast + db record)  
4) Create 2 punch items → export PDF  
5) Create checklist template → submit → export PDF