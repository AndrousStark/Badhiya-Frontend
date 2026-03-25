# Badhiya Frontend

**India's AI-Powered Business Dashboard for 63 Million MSMEs**

Next.js 16 web dashboard with premium Indian-themed UI — saffron and green on warm white. Real-time analytics, AI chat, credit management, inventory tracking, and financial health scoring.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (Turbopack) |
| Language | TypeScript 5 + React 19 |
| Styling | Tailwind CSS v4 |
| Components | Base UI (shadcn-style) |
| Charts | Recharts |
| State | Zustand (auth) + React hooks |
| Icons | Lucide React |
| Fonts | Inter + Poppins |

## Design System

```
Theme: Warm Minimalism + Indian Cultural Identity
Background: Warm White #FFFBF5
Primary: Saffron #FF6B00 (gradients to #FF8C38)
Success: Deep Green #1B8C3A
Trust: Royal Blue #1A56DB
Danger: Red #E53935
Cards: Pure White #FFFFFF with #F0EBE3 borders
Radius: 12-16px (rounded-xl)
Animations: fadeInUp, shimmer, card-hover lift
Identity: Indian tricolor accents, "Made for Bharat" badge
```

## Pages (12 routes, all functional)

| Page | Route | Features |
|------|-------|----------|
| **Landing** | `/` | Hero, stats, pain points, pricing, CTA |
| **Login** | `/login` | Phone + OTP, split-screen layout |
| **Onboarding** | `/onboarding` | 4-step wizard, business type selection |
| **Dashboard** | `/` (auth) | KPIs, revenue chart, AI insight, low stock |
| **Khata** | `/khata` | Customer list, give credit, send reminders |
| **Sales** | `/sales` | Transaction list, P&L, tab filtering |
| **Inventory** | `/inventory` | Product grid, add product, stock alerts |
| **Finance** | `/finance` | Health score, loans, govt schemes |
| **Reports** | `/reports` | P&L chart, expense breakdown, GST |
| **Store** | `/store` | Orders, revenue, share link |
| **Team** | `/team` | Members list, upgrade prompt |
| **Settings** | `/settings` | Profile, language, notifications, logout |

## Quick Start

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local
npm run dev
```

Dashboard at `http://localhost:3000`.

## Build

```bash
npm run build    # Production build
npm run start    # Production server
```

All 12 routes compile with 0 TypeScript errors.

## License

Private. All rights reserved.

---

**Badhiya** — Business Ho Jayega Badhiya!
