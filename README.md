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

## Rooms workspace

Open `/rooms` to review each room's day status across a week, manage room types and rooms, and set or release operational statuses (Blocked, Out of service, Needs cleaning) from the weekly grid or a room's monthly calendar. On small screens the weekly grid becomes a one-day room list. Booked and Occupied days come from read-only room assignments until the Bookings context exists.

The Rates tab shows a rate plan's nightly rates for its active room types across a week. Create or edit rate plans (room types, included services, refundability, and cancellation policy), and set daily rates for a room type over a date range or return those nights to the room type's base nightly rate. Rate plans use the property's currency and are made inactive instead of deleted.

## Environment

The SPA connects directly to the API configured by `VITE_HOSTERA_API_URL`. `.env.development` and `.env.production` currently use the local mock at `http://localhost:3000`, with `VITE_PROPERTIES_ENDPOINT_PATH`, `VITE_INVENTORY_ITEMS_ENDPOINT_PATH`, `VITE_STORAGE_LOCATIONS_ENDPOINT_PATH`, `VITE_ROOM_TYPES_ENDPOINT_PATH`, `VITE_ROOMS_ENDPOINT_PATH`, `VITE_STATUS_PERIODS_ENDPOINT_PATH`, `VITE_ROOM_ASSIGNMENTS_ENDPOINT_PATH`, `VITE_RATE_PLANS_ENDPOINT_PATH`, and `VITE_DAILY_RATES_ENDPOINT_PATH` defining its resource paths. `vite-env.d.ts` declares these variables for editor type information and autocompletion; it does not assign or validate their runtime values.

Vite loads `.env.development` for `npm run dev` and `.env.production` for `npm run build`. Use the ignored `.env.development.local` or `.env.production.local` files to override API settings for a specific mode. Restart Vite after changing environment files. Before deployment, set `VITE_HOSTERA_API_URL` to the deployed backend URL; the mock API is not deployed with the SPA. See [Vite environment variables and modes](https://vite.dev/guide/env-and-mode).

PrimeVue 5 requires a valid PrimeUI license. Set `VITE_PRIMEVUE_LICENSE_KEY` in the ignored `.env.local` file and restart Vite. For deployed builds, configure the variable in the build environment.
