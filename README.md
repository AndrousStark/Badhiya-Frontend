# Badhiya Frontend

### India's AI-Powered Business Dashboard for 63 Million MSMEs

> **"Business Ho Jayega Badhiya!"** — Your AI Business Partner

Next.js 16 web dashboard with a premium Indian-themed UI — warm white backgrounds with saffron and green accents. Real-time analytics, AI chat assistant, credit management, inventory tracking, and financial health scoring. Built for India, by India.

**Created by [Aniruddh Atrey](https://aniruddhatrey.com)**

---

## What is Badhiya?

**Badhiya** (Hindi: "Excellent") is India's first AI-powered business operating system for 63 million MSMEs. This is the web dashboard — a premium, responsive, fully functional business management interface that connects to the [Badhiya Backend](https://github.com/AndrousStark/Badhiya-Backend) via REST APIs.

Every page fetches real data. Every button works. Zero hardcoded mock data. Zero dead buttons.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16.2 (Turbopack) | Server components, streaming, fastest React framework |
| **Language** | TypeScript 5 + React 19 | Type safety + latest React features |
| **Styling** | Tailwind CSS v4 | Utility-first, custom Indian color tokens |
| **Components** | Base UI (shadcn-style) | Accessible, unstyled primitives |
| **Charts** | Recharts | Composable, responsive SVG charts |
| **State** | Zustand (auth) + React hooks | Minimal, persisted to localStorage |
| **Icons** | Lucide React | Consistent SVG icon set (240+ icons) |
| **Fonts** | Inter (body) + Poppins (headings) | Professional + warm, Google Fonts |

---

## Design System

A premium warm minimalist design inspired by CRED, Razorpay, and PhonePe — but warmer, more celebratory, and distinctly Indian.

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| **Saffron** | `#FF6B00` → `#FF8C38` | Primary CTA, gradients, active states |
| **Green** | `#1B8C3A` | Profit, success, positive trends |
| **Blue** | `#1A56DB` | Trust, links, financial features |
| **Red** | `#E53935` | Loss, overdue, urgent alerts |
| **Gold** | `#F9A825` | Achievements, warnings |
| **Warm White** | `#FFFBF5` | Main background |
| **Pure White** | `#FFFFFF` | Cards |
| **Warm Border** | `#F0EBE3` | All card/input borders |
| **Text Primary** | `#1A1A2E` | Headings, values |
| **Text Muted** | `#9CA3AF` | Labels, secondary text |

### Design Principles

1. **Maximum white space** with warm undertone (`#FFFBF5` not cold `#F8FAFC`)
2. **Saffron gradient buttons** with glow shadows (`shadow-[#FF6B00]/20`)
3. **Indian tricolor accents** (saffron-white-green) in sidebar, footer, CTA sections
4. **"Made for Bharat" badge** in sidebar navigation
5. **Rounded-xl everywhere** (12-16px border radius)
6. **Card hover lift** effect (translateY + shadow expansion on hover)
7. **Animated page sections** (fadeInUp with staggered delays)
8. **Custom warm scrollbar** (thin, warm-toned)
9. **No emojis as icons** — all Lucide SVGs
10. **cursor-pointer on every clickable element**

---

## Pages — 12 Routes, All Functional

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Hero with gradient text, stats bar (63M+ MSMEs, 500M+ WhatsApp users), pain points in bento grid, 3-step setup, 8 feature cards, 3-tier pricing, CTA with tricolor, "Proudly Made in India" footer |
| **Login** | `/login` | Split-screen — left: saffron branding wall (desktop), right: phone + OTP form. +91 prefix, 10-digit validation, auto-redirect if already logged in |
| **Onboarding** | `/onboarding` | 4-step wizard with gradient progress indicators. Business type (6 options with icons), name, location, GST. Registers via POST API. Auth guard prevents unauthenticated access. |

### Dashboard Pages (All Connected to Real Backend APIs)

| Page | Route | Data Source | Interactive Features |
|------|-------|-------------|---------------------|
| **Dashboard** | `/` (auth) | `/dashboard` + `/analytics/revenue/chart` + `/transactions` + `/inventory/alerts/low-stock` | Record Sale dialog, Record Expense dialog, revenue chart period switcher (Today/Week/Month), dynamic AI insight card, real low stock alerts |
| **Khata** | `/khata` | `/credit` + `/credit/summary` | Give Credit dialog (with customer name, phone, amount), Send Reminder per customer, Send All Reminders bulk, client-side search filtering |
| **Sales** | `/sales` | `/transactions` + `/transactions/pnl/today` | Tab filtering (All/Sales/Expenses), real-time P&L KPIs, transaction source badges (WhatsApp/web) |
| **Inventory** | `/inventory` | `/inventory/products` | Add Product dialog, product search, dynamic stock status calculation (ok/low/critical), stock value aggregation |
| **Finance** | `/finance` | `/analytics/health-score/breakdown` + `/schemes` | 6-component health score breakdown (SVG circular gauge), dynamic loan eligibility (score-based unlock), govt scheme matching from DB with Apply buttons linking to official portals |
| **Reports** | `/reports` | `/analytics/report/monthly` + `/analytics/pnl/monthly` + `/analytics/expenses/breakdown` | P&L bar chart (revenue vs expenses), expense pie chart + category breakdown with progress bars, top selling items list, GST summary (GSTR-1, GSTR-3B, ITC) |
| **Store** | `/store` | `/store/stats` | Product count, today's orders/revenue, recent sales list, copy WhatsApp store link |
| **Team** | `/team` | `/team` | Real team members from DB, role badges (Owner/Manager), upgrade CTA |
| **Settings** | `/settings` | `/businesses` + PATCH `/businesses/:id` | Business profile edit (name, city, area, GST), language selector (7 Indian languages), controlled notification toggles, inline save feedback, logout with auth state clear |

### Dashboard Layout (Topbar + Sidebar)

| Feature | Description |
|---------|-------------|
| **Sidebar** | Dynamic health score (real API), dynamic khata badge (real overdue count), 9 nav items with animated active states, "Made for Bharat" tricolor badge |
| **Search** | Global search across transactions, customers, products — 300ms debounce, dropdown results grouped by type, links to relevant pages |
| **Notifications** | Bell dropdown fetching real alerts (low stock, overdue credit, recent sales) — click-outside-to-close |
| **Ask AI** | Chat modal connected to 7-layer AI pipeline — suggestion chips that auto-submit, Enter key guard during loading, typing animation, warm-white response card |
| **Auth Guard** | Redirects to `/login` if no token — prevents unauthenticated dashboard access |

---

## Quick Start

### Prerequisites
- Node.js 20+
- [Badhiya Backend](https://github.com/AndrousStark/Badhiya-Backend) running on port 4000

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/AndrousStark/Badhiya-Frontend.git
cd Badhiya-Frontend

# 2. Install dependencies
npm install

# 3. Configure API endpoint
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1" > .env.local

# 4. Start development server
npm run dev
```

Dashboard at `http://localhost:3000`.

---

## Build & Deploy

```bash
npm run build    # Production build (Turbopack — compiles in ~4s)
npm run start    # Start production server
npm run lint     # ESLint check
```

All 12 routes compile with **0 TypeScript errors** and **0 build warnings**.

---

## Project Structure

```
src/
  app/
    globals.css                        # Badhiya Indian theme
    |                                  # - Warm-white (#FFFBF5) background
    |                                  # - Custom CSS variables for all brand colors
    |                                  # - fadeInUp, shimmer, pulse-saffron animations
    |                                  # - card-hover lift effect
    |                                  # - Indian tricolor gradient classes
    |                                  # - Premium warm scrollbar
    layout.tsx                         # Root layout (Inter + Poppins fonts, ThemeProvider)
    page.tsx                           # Landing page (marketing, pricing, CTA)
    (auth)/
      login/page.tsx                   # Split-screen OTP login
      onboarding/page.tsx              # 4-step business registration wizard
    (dashboard)/
      layout.tsx                       # Sidebar + topbar + search + AI modal + notifications
      page.tsx                         # Dashboard home (KPIs, chart, sale/expense dialogs)
      khata/page.tsx                   # Credit book (customers, reminders)
      sales/page.tsx                   # Transactions list with tab filtering
      inventory/page.tsx               # Product grid with add product dialog
      finance/page.tsx                 # Health score + loans + govt schemes
      reports/page.tsx                 # P&L chart + expenses + GST summary
      store/page.tsx                   # Store stats + recent orders
      team/page.tsx                    # Team members + upgrade CTA
      settings/page.tsx                # Business settings + language + notifications
  components/
    dashboard/
      kpi-card.tsx                     # Premium KPI card with pill badges + trend indicators
    ui/                                # 17 Base UI components (shadcn-style wrappers)
      avatar.tsx, badge.tsx, button.tsx, card.tsx, chart.tsx,
      dialog.tsx, dropdown-menu.tsx, input.tsx, label.tsx,
      select.tsx, separator.tsx, sheet.tsx, sidebar.tsx,
      skeleton.tsx, tabs.tsx, textarea.tsx, tooltip.tsx
  hooks/
    use-auth.ts                        # Zustand auth store (persisted to localStorage)
    use-mobile.ts                      # Mobile detection (768px breakpoint)
  lib/
    api.ts                             # API client (fetch wrapper, 15s timeout, network error handling, JSON parse safety)
    utils.ts                           # Tailwind merge utility (cn)
```

---

## Screenshots & Design Highlights

### Landing Page
- Warm gradient hero with animated "Badhiya!" text
- Stats bar: 63M+ MSMEs, 500M+ WhatsApp Users, 98.4% AI Cost Savings, 10+ Languages
- Pain points in bento grid with colored gradient cards
- 3-tier pricing (Free / Rs 299 / Rs 699)

### Dashboard
- Premium KPI cards with colored pill badges
- Revenue bar chart with Today/Week/Month period switcher
- Dynamic AI insight card (changes based on real data)
- Real low stock alerts from inventory API
- Record Sale/Expense dialogs with gradient buttons

### Sidebar
- Animated nav items with saffron-glow active states
- Dynamic Business Health Score card (real API data)
- Indian tricolor bar at bottom
- "Made for Bharat" badge with mini tricolor

### Finance Hub
- Hero health score card with SVG circular gauge
- 6-component breakdown (bookkeeping, revenue, digital, credit, compliance, engagement)
- Loan cards with score-based unlock (FlexiLoans, Kinara, Lendingkart)
- Govt schemes from DB with match percentages and Apply buttons

---

## Market Context

Badhiya targets the massive gap between digital payment adoption (90%) and digital maturity (12%) in India's MSME sector:

- **63 million MSMEs** generate 30% of India's GDP
- **500 million** Indians use WhatsApp daily
- **Rs 25-30 lakh crore** credit gap for MSMEs
- **Only 0.13%** of 12M+ kirana stores are fully digitized
- **200,000 kirana stores** closed last year due to quick commerce competition

Competitors (Vyapar, Khatabook, OkCredit) offer billing or ledger tools. **Badhiya is the only platform that combines AI intelligence + WhatsApp commerce + financial services + vernacular voice** in a single product.

---

## Related Repositories

| Repo | Description |
|------|-------------|
| [Badhiya-Backend](https://github.com/AndrousStark/Badhiya-Backend) | NestJS API — 7-layer AI pipeline, WhatsApp bot, credit management, health score |
| Badhiya-Frontend (this repo) | Next.js 16 dashboard — premium Indian-themed UI, real-time analytics, AI chat |

---

## Author

**Aniruddh Atrey**
- Website: [aniruddhatrey.com](https://aniruddhatrey.com)
- GitHub: [@AndrousStark](https://github.com/AndrousStark)

---

## License

Private. All rights reserved. Copyright 2026 Aniruddh Atrey.

---

**Badhiya** — Business Ho Jayega Badhiya!
