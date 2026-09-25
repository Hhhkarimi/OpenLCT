# OpenLCT — Logistics Control Tower MVP

OpenLCT is a free, self-contained logistics control tower prototype for a three-layer FMCG logistics network.

## Demo scope

- Supplier → 30 regional warehouses
- 30 warehouses → 3,900+ stores with a 600-vehicle fleet
- Store → customer last-mile orchestration with a 12,000-courier pool
- Cross-layer incident propagation
- Scenario simulation and mitigation actions

All operational records are synthetic demo data. No Supabase, Firebase, paid API, external database, or AI API is required.

## Stack

- Next.js 16
- React 19
- TypeScript 7
- Vazirmatn self-hosted with Fontsource
- localStorage for scenario state
- Pure TypeScript simulation engine

## Run

    npm install
    npm run typecheck
    npm run dev

## Deploy

Import this repository into Vercel and deploy main. No environment variables are required.

## Demo flow

1. Open Command Center.
2. Select Peak Sales, Supplier Delay, or Cold Chain Crisis.
3. Inspect Inbound, Distribution, Last Mile, and Incidents.
4. Open Simulation.
5. Apply the mitigation plan and see KPI changes.

This is an MVP decision-support simulator, not a production WMS/TMS.
