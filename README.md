# OpenLCT 3.0 — Logistics Control Tower

OpenLCT is a self-contained logistics control tower MVP for a three-layer FMCG network.

## What changed in 3.0

- Live simulation mode with deterministic operational pulses
- Executive trend charts for health, queue and SLA
- Network topology view from supplier to customer
- Manual digital-twin controls for inbound, demand, traffic and courier capacity
- Operational action history
- Expanded incident explainability
- Network heat board for all 30 warehouses
- Persistent scenario and simulation settings via localStorage
- CI repaired so type-check and build actually execute

## Network model

Supplier → 30 regional warehouses → 3,900+ stores → last-mile delivery

The demo models:
- 19 dry and 11 cold warehouses
- approximately 10,000 inbound unload appointments per month
- 600 distribution vehicles
- 12,000 last-mile couriers
- cross-layer incident propagation
- scenario simulation and mitigation

All data is synthetic demo data.

## Free architecture

- Next.js
- React
- TypeScript
- Vazirmatn via Fontsource
- Pure CSS
- Browser localStorage
- Pure TypeScript simulation engine

No Supabase, Firebase, database, paid map, AI API or backend service is required.

## Run

    npm install
    npm run typecheck
    npm run dev

## Build

    npm run build

## Vercel

Import the repository and deploy the main branch. No environment variables are required.

## Recommended demo

1. Open the Command Center and enable Live mode.
2. Switch to Supplier Delay or Cold Chain Crisis.
3. Inspect Network Topology and the 30-warehouse risk board.
4. Open Simulation and change the sliders.
5. Apply the mitigation plan.
6. Watch network health, queue, distribution SLA and express SLA react.
7. Open Incidents to inspect root cause and action history.

This is a decision-support MVP, not a production WMS/TMS.
