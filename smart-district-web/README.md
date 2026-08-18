# RDC FinSight AI Council Web App — Static Prototype

A static React + TypeScript + Vite prototype for the council-facing RDC FinSight AI / RDC SmartFinance AI system.

## Included screens

- Dashboard
- Revenue
- Payments
- Budgets
- Expenditure
- Residents
- AI Insights
- Reports
- Settings

All records are dummy/static data stored in `src/data/mockData.ts`.

## Run

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite (normally `http://localhost:5173`).

## Build

```bash
npm run build
```

## Design direction

The UI adapts the supplied Figma Community dashboard template: dark sidebar, bright central content surface, pale analytics panel, Poppins typography, minimal bar charts and progress bars.

## Next phase

Replace `mockData.ts` with the real backend and connect authentication, resident accounts, payments, council finance data, reports and the AI analysis layer.
