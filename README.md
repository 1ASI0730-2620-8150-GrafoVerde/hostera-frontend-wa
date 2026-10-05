# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Linting

Run `npm run lint` to validate JavaScript and Vue files. The command fails on errors or warnings.

Run `npm run lint:fix` to apply automatic fixes, then review the changes.

## Formatting

Run `npm run format` to format supported files in `src/`, `server/` (when present), and `index.html` with Prettier.

Run `npm run format:check` to verify formatting without modifying files.

Prettier uses single quotes and semicolons for JavaScript. ESLint disables formatting rules that conflict with Prettier.

## Local Mock API

The mock API is for local development and runs separately from the SPA. It is not deployed with the frontend.

Run `npm run server:start` to start the JSON Server mock at `http://localhost:3000`.

See [server/README.md](server/README.md) for fixture structure, database generation, and reset commands.

## Inventory workspace

Start the mock API with `npm run server:start`, then start the SPA with `npm run dev`. Open `/inventory` to manage property-scoped storage locations, supplies, stock adjustments, and internal transfers. English and Spanish are available in the workspace language selector.

## Overview

The start page (`/`) summarizes the active property: room revenue and occupancy for the last 7 or 30 days or the next 30 days, compared with the previous period; the occupancy, rooms available tonight, and rooms needing attention of every property; today's arrivals with their status and actions; and today's rooms by day status. Search bookings by guest or code from the header (Ctrl+K or ⌘K). Each panel shows its own error and retry when its data cannot be loaded. Charts use PrimeVue Chart, which renders with the `chart.js` dependency.

## Bookings workspace

Open `/bookings` to list a property's bookings, filter them by guest, booking code, stay period, or status, and open a booking's detail. Create bookings with the guest's contact details, stay dates, guests, room type, room, and rate plan; rooms already booked or Blocked or Out of service for those nights cannot be chosen, and the estimated total adds each night's rate. New bookings start as Pending, and only pending or confirmed bookings can be edited. From a booking's detail, confirm a pending booking, cancel a pending or confirmed one with a reason, mark a confirmed booking as no-show from its check-in day, restore a cancelled booking as Pending before its stay starts while the room is free, or duplicate a cancelled or no-show booking into a new one. Cancelled and no-show bookings release their room. Record payments received outside Hostera up to the balance due, check in a confirmed booking on one of its nights after verifying the guest's identity document (a balance due does not block it), and check out a stay in progress once nothing is owed, reporting the room condition; leaving early releases the remaining nights. Check-in also encodes at least one RFID key card for the guest, and check-out ends the booking's key cards. The property selection is shared with the Rooms workspace.

## Access control workspace

Open `/access-control` to review a property's RFID credentials (guest key cards and staff credentials) with their status, holder, access, and access period. Issue a staff credential for a staff member without another usable credential, revoke an active or scheduled credential with a reason, or replace a card with a newly encoded one. The front desk RFID encoder is simulated in the browser. The access events page lists the day's granted and denied events, which are read-only demonstration data until door readers are connected.

## Rooms workspace

Open `/rooms` to review each room's day status across a week, manage room types and rooms, and set or release operational statuses (Blocked, Out of service, Needs cleaning) from the weekly grid or a room's monthly calendar. On small screens the weekly grid becomes a one-day room list. Booked and Occupied days come from the property's bookings and open them from the grid.

The Rates tab shows a rate plan's nightly rates for its active room types across a week. Create or edit rate plans (room types, included services, refundability, and cancellation policy), and set daily rates for a room type over a date range or return those nights to the room type's base nightly rate. Rate plans use the property's currency and are made inactive instead of deleted.

## Environment

The SPA connects directly to the API configured by `VITE_HOSTERA_API_URL`. `.env.development` and `.env.production` currently use the local mock at `http://localhost:3000`, with `VITE_PROPERTIES_ENDPOINT_PATH`, `VITE_INVENTORY_ITEMS_ENDPOINT_PATH`, `VITE_STORAGE_LOCATIONS_ENDPOINT_PATH`, `VITE_ROOM_TYPES_ENDPOINT_PATH`, `VITE_ROOMS_ENDPOINT_PATH`, `VITE_STATUS_PERIODS_ENDPOINT_PATH`, `VITE_RATE_PLANS_ENDPOINT_PATH`, `VITE_DAILY_RATES_ENDPOINT_PATH`, `VITE_BOOKINGS_ENDPOINT_PATH`, `VITE_PAYMENTS_ENDPOINT_PATH`, `VITE_CREDENTIALS_ENDPOINT_PATH`, `VITE_STAFF_MEMBERS_ENDPOINT_PATH`, and `VITE_ACCESS_EVENTS_ENDPOINT_PATH` defining its resource paths. `vite-env.d.ts` declares these variables for editor type information and autocompletion; it does not assign or validate their runtime values.

Vite loads `.env.development` for `npm run dev` and `.env.production` for `npm run build`. Use the ignored `.env.development.local` or `.env.production.local` files to override API settings for a specific mode. Restart Vite after changing environment files. Before deployment, set `VITE_HOSTERA_API_URL` to the deployed backend URL; the mock API is not deployed with the SPA. See [Vite environment variables and modes](https://vite.dev/guide/env-and-mode).

PrimeVue 5 requires a valid PrimeUI license. Set `VITE_PRIMEVUE_LICENSE_KEY` in the ignored `.env.local` file and restart Vite. For deployed builds, configure the variable in the build environment.
