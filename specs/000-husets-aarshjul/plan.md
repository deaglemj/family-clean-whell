# Plan: Husets Årshjul

## Implementation target

Use the existing static app structure.

Current structure:

```text
index.html              # GitHub Pages entrypoint, redirects to app/
app/
  index.html            # Main app UI
  app.js                # App bootstrap
  constants.js
  data.js
  render.js
  state.js
  styles.css
  utils.js
```

## Architecture decision

Keep the runnable webapp in `app/` for now.

Reason:

- GitHub Pages can serve it directly without a build step.
- The root `index.html` already redirects to `app/`.
- Moving files to `src/` would normally imply a build step or another redirect layer.
- This project should stay simple: static HTML, CSS and JavaScript only.

A future `src/` folder only makes sense if the project later adds a build tool such as Vite, Parcel, or another bundler.

## Approach

1. Keep root `index.html` as the GitHub Pages entrypoint.
2. Keep implementation files in `app/`.
3. Use specs under `specs/` as the source of truth before changing code.
4. Implement feature work only when it is described in a spec.
5. Verify every change against the relevant acceptance criteria.

## Data format

Use one master task list.

The implementation may calculate weekly visibility from task fields, but must not copy task definitions into separate week-specific lists.

## GitHub Pages note

The current structure is compatible with GitHub Pages because the root `index.html` forwards users to `app/`.
