# Plan: Husets Årshjul

## Implementation target

Build the app inside `app/` as a static GitHub Pages-compatible webapp.

Expected structure:

```text
app/
  index.html
  styles.css
  script.js
  data/
    tasks.json
```

## Approach

1. Create the static app shell.
2. Add a local task data file.
3. Load tasks in JavaScript.
4. Render the selected week overview.
5. Add week selection.
6. Add print styling for the weekly overview.
7. Verify that the app works without backend services.

## Data format

Use a simple JSON master list in `app/data/tasks.json`.

Each task should be represented once in the master list.

The implementation may calculate weekly visibility from task fields, but must not copy task definitions into separate week-specific lists.

## GitHub Pages note

GitHub Pages can serve the static files from the repository if configured to publish the relevant branch/folder.

If the project uses `app/` as the source folder, GitHub Pages setup must account for that folder structure.
