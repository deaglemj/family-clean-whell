# Tasks: Docker Project Start

## Spec setup

- [x] Add Docker project start spec.
- [x] Add Docker project start implementation plan.
- [x] Add Docker project start task checklist.
- [x] Align spec index with the new Docker feature.

## Docker files

- [x] Add `Dockerfile` at repository root.
- [x] Add `docker-compose.yml` at repository root.
- [x] Add `.dockerignore` at repository root.

## Static server setup

- [x] Configure the container to serve static files from the repository root.
- [x] Ensure root `index.html` is served.
- [x] Ensure the existing redirect to `app/` works.
- [x] Ensure files under `app/` are reachable from the browser.
- [x] Expose the app on a documented local port.

## Documentation

- [x] Document how to start the app with Docker Compose.
- [x] Document how to stop the app with Docker Compose.
- [x] Document the local browser URL.
- [x] Document that Docker is for local development and preview only.
- [x] Document that GitHub Pages remains the production/static hosting target.

## Verification

- [ ] Verify `docker compose up --build` starts the container.
- [ ] Verify the documented local URL opens the app.
- [ ] Verify root `index.html` redirects to `app/`.
- [ ] Verify `app/dashboard.html` loads.
- [ ] Verify CSS loads.
- [ ] Verify JavaScript modules load.
- [ ] Verify existing task data loading behavior still works.
- [ ] Verify `docker compose down` stops the container.
- [x] Verify no backend, database, server-side application code, package manager, or build tool was added.
- [x] Verify GitHub Pages compatibility is unchanged.

## Verification note

Runtime Docker verification must be completed locally because the GitHub connector can update repository files but cannot execute `docker compose`.