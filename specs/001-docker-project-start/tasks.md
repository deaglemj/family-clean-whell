# Tasks: Docker Project Start

## Spec setup

- [x] Add Docker project start spec.
- [x] Add Docker project start implementation plan.
- [x] Add Docker project start task checklist.
- [ ] Align spec index with the new Docker feature.

## Docker files

- [ ] Add `Dockerfile` at repository root.
- [ ] Add `docker-compose.yml` at repository root.
- [ ] Add `.dockerignore` at repository root.

## Static server setup

- [ ] Configure the container to serve static files from the repository root.
- [ ] Ensure root `index.html` is served.
- [ ] Ensure the existing redirect to `app/` works.
- [ ] Ensure files under `app/` are reachable from the browser.
- [ ] Expose the app on a documented local port.

## Documentation

- [ ] Document how to start the app with Docker Compose.
- [ ] Document how to stop the app with Docker Compose.
- [ ] Document the local browser URL.
- [ ] Document that Docker is for local development and preview only.
- [ ] Document that GitHub Pages remains the production/static hosting target.

## Verification

- [ ] Verify `docker compose up --build` starts the container.
- [ ] Verify the documented local URL opens the app.
- [ ] Verify root `index.html` redirects to `app/`.
- [ ] Verify `app/dashboard.html` loads.
- [ ] Verify CSS loads.
- [ ] Verify JavaScript modules load.
- [ ] Verify existing task data loading behavior still works.
- [ ] Verify `docker compose down` stops the container.
- [ ] Verify no backend, database, server-side application code, package manager, or build tool was added.
- [ ] Verify GitHub Pages compatibility is unchanged.