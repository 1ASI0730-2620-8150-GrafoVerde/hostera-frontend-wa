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

## Rooms resources

- `GET /room-types?propertyId=1`, `GET /rooms?propertyId=1`, and `GET /status-periods?propertyId=1`: property-scoped collections. Properties include the `currency` used for room rates.
- `POST`, `PUT /:id`, and `DELETE /:id` on `/room-types`: manage room types; the frontend removes only types that no room uses.
- `POST` and `PUT /:id` on `/rooms`: create and edit rooms. A room takes its capacity and beds from its room type.
- `POST`, `PUT /:id`, and `DELETE /:id` on `/status-periods`: setting or releasing a status may delete, trim, or split existing periods and create a new one, sent as separate requests.

- `GET /rate-plans?propertyId=1` and `GET /daily-rates?propertyId=1`: property-scoped rate plans and their daily rates. An empty `roomTypeIds` list means the plan sells every room type.
- `POST` and `PUT /:id` on `/rate-plans`: create and edit rate plans; plans are made inactive instead of deleted.
- `POST`, `PUT /:id`, and `DELETE /:id` on `/daily-rates`: setting rates sends one request per night; returning nights to the base nightly rate deletes their daily rates.

Status periods cover inclusive ISO date ranges (`startDate` to `endDate`); their seed dates, like the daily rates and bookings, fall around October 2026. Rooms derives its read-only room assignments from `/bookings`. The frontend keeps a room's status periods from overlapping each other or its bookings; direct API requests can bypass these rules, and a failed request in a multi-request status change can leave partial updates, which the SPA reloads. The same applies to the daily rates of a multi-night rate change.

## Bookings resources

- `GET /bookings?propertyId=1`: a property's bookings, with the guest's contact details, stay dates, room type, room, rate plan, and saved total. `checkInDate` is the first night and `checkOutDate` the departure day, so a stay covers each night before check-out.
- `GET /bookings?propertyId=1&_sort=code&_order=desc&_limit=1`: the property's booking with the highest code, used to number its next booking (`BKG-1071`, …). Each property numbers bookings in its own thousand.
- `POST` and `PUT /:id` on `/bookings`: create pending bookings, edit pending or confirmed ones, and change their status. Status changes record when and by whom a booking was confirmed, cancelled (with `cancellationReason` and `cancellationNote`), or marked as no-show; the operator is a demonstration value until account access exists. The frontend prices each night with the room type's nightly rate under the rate plan and saves the total with the booking.

Pending, confirmed, and checked-in bookings hold their room: the frontend rejects stays that share a night with them or with a Blocked or Out of service period, while Needs cleaning does not prevent booking. Cancelled, no-show, and checked-out bookings no longer hold their room. Direct API requests can bypass these rules, and booking codes are numbered without concurrency control.
