# Spec: Docker Project Start

## Status

Draft

## Purpose

Add project-level Docker support so the static “Husets Årshjul” webapp can be started locally inside a Docker container.

The Docker setup must make it easy to run and verify the existing app without installing a local web server, backend runtime, database, or build tool on the host machine.

## Platform

The app must still run directly on GitHub Pages.

Docker is only for local development, preview, and verification.

## Technology constraints

- Use Docker for local container startup.
- Use Docker Compose for the default local startup command.
- Serve the existing static files from the repository root.
- Keep the runnable webapp in `app/`.
- Keep root `index.html` as the GitHub Pages entrypoint.
- Do not add a backend.
- Do not add a database.
- Do not add server-side application logic.
- Do not add a JavaScript build step.
- Do not require Node.js on the host machine.
- Do not require npm, pnpm, yarn, Vite, Parcel, or another frontend build tool.

## Functional requirements

The Docker setup must:

- start the existing static webapp in a container
- expose the app on a local host port
- serve `index.html` from the repository root
- allow the existing redirect from root `index.html` to `app/` to keep working
- allow all files in `app/` to be loaded by the browser
- allow local task data files to be used by the app in the browser
- support a simple start command documented for the user
- support a simple stop command documented for the user
- avoid changing the app behavior outside what is needed for container startup

## Required project files

The feature should add or update project-level Docker files only when needed:

- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- project documentation for starting and stopping the container

## Docker behavior

The container must serve static files over HTTP.

The default local URL must be documented.

The default port mapping should be simple and predictable, for example:

```text
http://localhost:8080
```

## Data principle

Task data must still be handled in the browser as a local/static data file.

Docker must not introduce persistent backend storage for tasks.

## Out of scope

The initial Docker feature must not add:

- backend API
- login
- user accounts
- cloud sync
- database persistence
- production deployment pipeline
- GitHub Actions deployment
- frontend framework migration
- package manager setup
- build tooling

## Acceptance criteria

- The project can be started with Docker Compose.
- The app is reachable in a browser from the documented local URL.
- Root `index.html` is served and redirects to `app/` as before.
- Existing app pages under `app/` load correctly.
- Existing JavaScript and CSS files load correctly.
- The app still works without backend, database, or server-side application code.
- The Docker setup does not break GitHub Pages compatibility.
- Start and stop commands are documented.
- The implementation stays at project level unless app changes are strictly required for Docker compatibility.