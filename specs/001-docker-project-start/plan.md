# Plan: Docker Project Start

## Implementation target

Add a minimal Docker setup for running the existing static app locally.

Target structure after implementation:

```text
Dockerfile              # Static web server image for the project
docker-compose.yml      # Default local startup command
.dockerignore           # Prevent unnecessary files from entering image context
index.html              # Existing GitHub Pages entrypoint
app/                    # Existing static webapp
specs/                  # Specification source of truth
```

## Architecture decision

Use Docker only as a local static file server.

Reason:

- The app is already a static HTML, CSS, and JavaScript app.
- GitHub Pages compatibility must remain unchanged.
- A backend or frontend build tool would add unnecessary complexity.
- The container should help start and verify the app, not change the app architecture.

## Recommended container approach

Use a small static web server image, such as Nginx, to serve the repository root.

Expected behavior:

1. Container starts an HTTP server.
2. Server exposes the repository root.
3. Browser opens the root URL.
4. Existing root `index.html` redirects to `app/`.
5. App files load from `app/`.

## Compose approach

Use Docker Compose as the default developer command.

Expected commands to document:

```bash
docker compose up --build
```

```bash
docker compose down
```

Default local URL:

```text
http://localhost:8080
```

## File responsibilities

### `Dockerfile`

Should:

- use a static web server base image
- copy the repository files needed to serve the app
- expose the HTTP port used inside the container
- not run build commands
- not install Node.js or package managers

### `docker-compose.yml`

Should:

- define one app service
- build from the repository root
- expose the app on `localhost:8080`
- restart only when explicitly configured by the developer
- keep the setup simple and readable

### `.dockerignore`

Should exclude files that are not needed in the container image, such as:

- `.git/`
- `.github/`
- `specs/`
- local editor files
- OS metadata files
- temporary files

## Verification approach

After implementation, verify:

1. `docker compose up --build` starts successfully.
2. `http://localhost:8080` opens the app.
3. Root redirect still works.
4. `app/dashboard.html` loads.
5. CSS loads.
6. JavaScript modules load.
7. Existing task data loading behavior still works.
8. `docker compose down` stops the container.
9. GitHub Pages structure remains unchanged.

## Constraints

Do not move app files.

Do not introduce a build step.

Do not change task data format.

Do not change feature behavior unless required to make static file serving work correctly.

## GitHub Pages note

The Docker setup is not the production hosting solution.

GitHub Pages must continue to serve the project from the root `index.html` and existing `app/` folder.