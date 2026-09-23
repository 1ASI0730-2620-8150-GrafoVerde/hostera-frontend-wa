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
