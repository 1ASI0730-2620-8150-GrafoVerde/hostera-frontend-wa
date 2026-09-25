# Local Mock API

This is a development-only mock API. It runs separately from the SPA and is not included in SPA deployments.

JSON Server `^0.17.4` serves the generated database at `http://localhost:3000`.

```text
server/
  data/          Seed fixtures, one JSON file per resource
  build-db.js    Combine fixtures into db.json
  start.sh       Build the database and start JSON Server
  db.json        Generated runtime data, excluded from Git
  routes.json    Route rewrites, initially empty
  README.md
```

## Commands

- `npm run server:start`: rebuild the database and start the API.
- `npm run server:build`: rebuild the database without starting the API.
- `npm run server:start -- --port 3001`: start on a different port.

Each build or startup replaces runtime changes with the seed fixtures. API writes affect `db.json`; edit files in `data/` for lasting changes. Startup stops if the build fails. Press Ctrl+C to stop the server.

`start.sh` requires a POSIX shell such as the one provided by Linux, macOS, WSL, or Git Bash. It runs the project's installed JSON Server. Both scripts resolve their paths from their own location.

## Fixtures

Place JSON files directly in `data/`. Each filename uses a plural kebab-case resource name and contains one matching array. For example, `example-resources.json`:

```json
{
  "example-resources": [{ "id": 1, "name": "Example" }]
}
```

Use unique, stable IDs and camelCase fields. Mock data values may be in Spanish. `.gitkeep` keeps the initially empty directory in Git and can be removed after adding the first fixture; the generator reads only `.json` files.

JSON Server provides native CRUD routes for each collection. Send write bodies as JSON with `Content-Type: application/json`. The mock does not implement authentication or business validation.

## Inventory resources

- `GET /properties`: demonstration establishments in one organization.
- `GET /storage-locations?propertyId=1` and `GET /inventory-items?propertyId=1`: property-scoped collections.
- `POST /storage-locations` and `POST /inventory-items`: create records with their `propertyId`.
- `PUT /storage-locations/:id` and `PUT /inventory-items/:id`: save an existing record.
- `DELETE /storage-locations/:id`: remove an unused location.

Each inventory item contains `stocks` (quantities by location) and an `adjustments` history. An adjustment updates both in one item write; a transfer appends linked outgoing and incoming records in the same write. A positive initial quantity also records an opening adjustment. There is no separate adjustment endpoint in this mock.

The frontend enforces unique codes, sufficient stock, fixed units after history exists, and location-removal restrictions. Audit entries use a demonstration operator until account access is implemented. Direct API requests can bypass these rules, and simultaneous clients can overwrite each other's changes; the production API must enforce authorization, validation, history preservation, and concurrency controls.
