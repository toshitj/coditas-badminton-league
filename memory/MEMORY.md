# Coditas Badminton League - Project Memory

## Project Overview
A full-stack tournament management website for an internal Coditas company badminton league (CBL).
- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Shadcn UI
- **Backend**: Google Apps Script (Web App) + Google Sheets as DB
- **Deployment**: Frontend on Vercel; backend URL is env var `NEXT_PUBLIC_API_URL`

## Key Architecture
- All Google Sheets API calls are proxied through Next.js API routes to avoid CORS issues
- Registration state is held in `sessionStorage` (`cbl:registration:draft`) for the multi-step flow
- `isRegistrationClosed` flag drives nav visibility; fetched from `/api/teams` with in-memory + localStorage cache (key: `cbl:isRegistrationClosed:v2`, TTL 2min)

## Pages & Routes
| Path | Purpose |
|------|---------|
| `/` | Overview / Official Rule Book |
| `/registration` | Multi-step registration (Team + Individual tabs) |
| `/registration/payment` | Payment step (QR code, transaction ID, file upload) |
| `/teams` | View registered teams + individual players |
| `/fixtures` | Match fixtures grouped by date (only when registration closed) |
| `/standings` | Points table grouped by group (only when registration closed) |

## API Routes (Next.js, all in `/app/api/`)
| Route | Method | Description |
|-------|--------|-------------|
| `/api/proxy` | GET/POST | Generic proxy to Google Apps Script |
| `/api/register` | POST | Team registration |
| `/api/register-individual` | POST | Individual registration |
| `/api/teams` | GET | Fetch registered teams + `isRegistrationClosed` flag |
| `/api/individuals` | GET | Fetch individual players |
| `/api/validate-emails` | POST | Check if emails already registered (pre-payment) |
| `/api/fixtures` | GET | Fetch match fixtures (action=getFixtures) |
| `/api/standings` | GET | Fetch standings (action=getStandings) |

## Registration Flow
1. User fills `/registration` form (team: 4 players; individual: 1 player)
2. Email uniqueness checked against Google Sheets via `/api/validate-emails`
3. Draft saved to `sessionStorage` → redirect to `/registration/payment`
4. Payment page shows QR code (₹2000 team / ₹500 individual), collects Transaction ID + payment screenshot
5. Submit sends all data (base64 screenshot) to Google Apps Script
6. On success: `TeamRevealModal` with confetti shows assigned team name

## Validation (Zod)
- All player emails must end with `@coditas.com`
- Phone numbers: 10-digit numeric
- DOB: YYYY-MM-DD format
- Jersey size: enum (XS, S, M, L, XL, XXL, XXXL)
- Duplicate emails within a team are caught client-side

## Tournament Format
- 32 teams → 8 groups of 4 → round-robin → top team qualifies
- Super Eight → Semi-Finals → Grand Finale (6 Apr – 20 Apr 2026)
- Each tie: Best of 3 (Men's Singles, Women's Singles, Mixed Doubles)
- Scoring: standard BWF; tie-breaker = Point Difference

## Key Files
- `lib/api.ts` - All API calls and registration-closed caching logic
- `app/registration/page.tsx` - Player details form (Team + Individual)
- `app/registration/payment/page.tsx` - Payment form + submission
- `components/Navbar.tsx` - Dynamic nav (hides Registration when closed, shows Fixtures/Standings)
- `app/api/fixtures/route.ts` and `standings/route.ts` - Both proxy to same Google Apps Script URL
