# Husets Årshjul

Static webapp for recurring cleaning and house maintenance tasks.

## Run locally

Open `index.html` or serve the repository with a static file server.

The root `index.html` redirects to `app/`, and `app/index.html` redirects to `app/dashboard.html`.

## Run locally with Docker

Docker is only for local development, preview and verification.

Start the app:

```bash
docker compose up --build
```

Open the app:

```text
http://localhost:8080
```

Stop the app:

```bash
docker compose down
```

The Docker setup serves the existing static files from the repository root. It does not add a backend, database, server-side application code, package manager or build step.

## GitHub Pages

The app is designed to run directly on GitHub Pages without backend, database or build step.

Recommended Pages setup:

- Source: `main`
- Folder: `/root`

## App pages

```text
app/dashboard.html     # Dashboard
app/currentWeek.html   # Selected week overview and print view
app/yearWheel.html     # Year wheel overview
app/taskList.html      # Full master task list
```

## Data file

The app loads `app/tasks.json` as example data.

A local JSON task file can also be loaded from the browser. The loaded task list is saved in browser local storage so it remains available when navigating between pages.

## Required task fields

Each task object must contain:

```text
ID
Kategori
Rum
Opgave
Frekvens
Antal pr. år
Opgavetype
Estimeret tid
Belastning
Sæson
Kan udsættes
Aktiv
Årlig tid
Noter
```

All views are based on one master task list.
