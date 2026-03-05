# Coditas Badminton League - Project Memory

## Project Overview
A full-stack tournament management website for an internal Coditas company badminton league (CBL).
- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Shadcn UI
- **Backend**: Google Apps Script (Web App) + Google Sheets as DB
- **Deployment**: Frontend on Vercel; backend URL is env var `NEXT_PUBLIC_API_URL`

## Key Architecture
- All Google Sheets API calls are proxied through Next.js API routes to avoid CORS issues
- Registration is now a **single-page flow** — no multi-step redirect or sessionStorage draft handoff
- `isRegistrationClosed` flag drives nav visibility; fetched from `/api/teams` with in-memory + localStorage cache (key: `cbl:isRegistrationClosed:v2`, TTL 2min)
- Draft key `cbl:registration:draft:v2` is cleared on mount (legacy remnant, no longer used)

## Pages & Routes
| Path | Purpose |
|------|---------|
| `/` | Overview / Official Rule Book |
| `/registration` | Single-page registration: player details + payment (Team + Individual tabs) |
| `/registration/payment` | Legacy payment page (still exists but no longer the primary flow) |
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

## Registration Flow (Current — Single Page)
1. User selects tab: **Team registration** or **Individual registration**
2. User fills player details form (team: 4 players across Male Players / Female Players cards; individual: 1 player)
3. **Payment section is on the same page** — QR code switches automatically based on active tab (₹2000 team / ₹500 individual)
4. User uploads payment screenshot, enters Transaction ID + Refund UPI ID
5. User accepts CblDisclaimer (inline, below payment section)
6. Submit button triggers `onSubmit()` which:
   - Validates all three form instances (teamForm/individualForm + paymentForm) via `.trigger()`
   - Converts file to base64
   - Calls `registerTeam()` or `registerIndividual()` from `lib/api.ts`
   - On success: resets all forms, increments `formKey` (forces full re-render), shows `TeamRevealModal` with assigned team name

## Form Architecture (app/registration/page.tsx)
Three separate React Hook Form instances on one page:
- `teamForm` — `TeamDetailsFormData` (team_details_schema)
- `individualForm` — `IndividualDetailsFormData` (individual_details_schema)
- `paymentForm` — `PaymentFormData` (payment_schema)

### canProceed / canSubmit logic
```ts
const canProceed = activeTab === "team" ? teamForm.formState.isValid : individualForm.formState.isValid;
const canSubmit = canProceed && paymentForm.formState.isValid && hasAccepted && !isSubmitting;
```

### QR Code
Switches on `activeTab` change via `useEffect`:
```ts
setQrSrc(activeTab === "team" ? "/assets/Team-2000.JPG" : "/assets/Individual-500.JPG");
```
Fallback: `/assets/qr-code.png` on image error.
UPI ID displayed: `9971461729@goaxb`

## Form Field Sets

### Per Player (Team — `PlayerFields` component)
Fields in order (grid layout, 2-col):
1. Employee ID + Name
2. Email + Phone Number
3. Date of Birth + Address
4. Name on Jersey + Jersey Size (`<select>` dropdown)
5. Emergency Contact Number (full width)

**Removed** (vs older version): WhatsApp Number, Jersey Number

### Individual Player Form
Fields: Employee ID, Name, Email, Phone Number, Date of Birth, Address, Name on Jersey, Jersey Size (`<select>`), Emergency Contact Number, Gender (`<select>`: Male / Female / Other)

**Removed** (vs older version): WhatsApp Number, Jersey Number

### Payment Form
Fields: Transaction ID, Refund UPI ID, Payment Screenshot (file upload — PNG/JPG/JPEG, max 5MB)

**Removed** (vs older version): Emergency Contact Name, Emergency Contact Number (moved to player forms)

## Zod Schemas

### team_details_schema
Per-player fields (×4 players — malePlayer1, malePlayer2, femalePlayer1, femalePlayer2):
- `{prefix}EmployeeId` — min 2 chars
- `{prefix}Name` — min 2 chars
- `{prefix}Email` — coditas_email_schema (must end with `@coditas.com`)
- `{prefix}ContactNumber` — phone_schema (10 digits)
- `{prefix}Dob` — dob_schema (`YYYY-MM-DD`)
- `{prefix}Address` — min 2 chars
- `{prefix}JerseyName` — min 1 char ("Name on Jersey")
- `{prefix}JerseySize` — enum (XS | S | M | L | XL | XXL | XXXL)
- `{prefix}EmergencyContactNumber` — phone_schema (10 digits)

`.superRefine` checks duplicate emails across all 4 players (client-side uniqueness).

### individual_details_schema
- `playerEmployeeId`, `playerName`, `playerEmail`, `playerContactNumber`, `playerDob`, `playerAddress`, `playerJerseyName`, `playerJerseySize`, `playerEmergencyContactNumber`, `gender` (Male | Female | Other)

### payment_schema
```ts
z.object({
  transactionId: z.string().min(5),
  refundUpiId: z.string().min(3),
  paymentProof: z.any()  // validated: required, max 5MB, JPG/PNG only
})
```

## Layout
- **70/30 split** (lg breakpoint): main form column (70%) + sticky right sidebar (30%)
- Right sidebar: `<CblGuidelines />` only (sticky `top-24`)
- `<CblDisclaimer />` is inline in the main column, below the Payment Details card
- Tab switcher: centered pill-style toggle, active tab gets `bg-neon-blue text-white`
- `key={formKey}` on the outer form wrapper — increments on success to force full reset

## Validation (Zod)
- All player emails must end with `@coditas.com`
- Phone/Emergency numbers: 10-digit numeric (non-digit chars stripped via `onChange`)
- DOB: YYYY-MM-DD format
- Jersey size: enum (XS, S, M, L, XL, XXL, XXXL)
- Duplicate emails within a team are caught client-side via `.superRefine`

## API Payload Keys (sent to Google Apps Script)
### Team payload
`"Male Player 1 Employee ID"`, `"Male Player 1 Name"`, `"Male Player 1 Email"`, `"Male Player 1 DOB"`, `"Male Player 1 Contact Number"`, `"Male Player 1 Address"`, `"Male Player 1 Jersey Name"`, `"Male Player 1 Jersey Size"`, `"Male Player 1 Emergency Contact Number"` (×4 players), `"Transaction ID"`, `"Refund UPI ID"`, `paymentScreenshotBase64`

### Individual payload
`"Player Employee ID"`, `"Player Name"`, `"Player Email"`, `"Player DOB"`, `"Player Contact Number"`, `"Player Address"`, `"Player Jersey Name"`, `"Player Jersey Size"`, `"Player Gender"`, `"Emergency contact number"`, `"Transaction ID"`, `"Refund UPI ID"`, `paymentScreenshotBase64`

## Tournament Format
- 32 teams → 8 groups of 4 → round-robin → top team qualifies
- Super Eight → Semi-Finals → Grand Finale (6 Apr – 20 Apr 2026)
- Each tie: Best of 3 (Men's Singles, Women's Singles, Mixed Doubles)
- Scoring: standard BWF; tie-breaker = Point Difference

## Brand & UI Guidelines (Coditas)
- **Primary Violet**: `#9900E6` (mapped to `neon.blue` and `brand.violet` in Tailwind)
- **Turquoise**: `#11CAE6` (mapped to `neon.green` and `brand.turquoise`)
- **Torch Red**: `#FF174F` (`brand.red`)
- **Ham Purple**: `#5B0FFE` (`brand.purple`)
- **Primary Gradient**: `linear-gradient(135deg, #9900E6, #11CAE6)`
- **Typography**: Urbanist (headings, Bold/ExtraBold 700/800) + Inter (body)
- **Background**: subtle lavender-white (`hsl(270 25% 97%)`)
- `.neon-text` class: gradient text via `background-clip: text`
- `.glass` class: glassmorphism card style

## Key Files
- `lib/api.ts` — All API calls and registration-closed caching logic
- `app/registration/page.tsx` — **Single-page** player details + payment form (Team + Individual)
- `app/registration/payment/page.tsx` — Legacy payment page (no longer primary flow)
- `components/Navbar.tsx` — Dynamic nav (hides Registration when closed, shows Fixtures/Standings); Coditas logo left, nav links right
- `components/TeamCard.tsx` — Expandable team card with brand gradient icon badge
- `components/CblGuidelines.tsx` — Registration guidelines sidebar
- `components/CblDisclaimer.tsx` — T&C disclaimer with checkbox (inline on registration page)
- `components/TeamRevealModal.tsx` — Confetti modal shown on successful registration
- `app/api/fixtures/route.ts` and `standings/route.ts` — Both proxy to same Google Apps Script URL
- `tailwind.config.ts` — Custom brand color tokens and Urbanist font family
- `app/globals.css` — CSS variables, `neon-text` gradient utility, global `h1/h2` font
- `app/layout.tsx` — Inter + Urbanist fonts loaded via `next/font/google`
- `next.config.js` — Remote image patterns for Coditas brand assets CDN
- `tsconfig.json` — `"target": "ES2015"` (required for Set iteration in validate-emails route)
