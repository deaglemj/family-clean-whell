# Spec: Husets Årshjul

## Status

Draft

## Purpose

Build a complete static webapp for “Husets Årshjul”.

The app must help manage recurring cleaning and house maintenance tasks using one master task list.

## Platform

The app must run directly on GitHub Pages.

## Technology constraints

- Use HTML.
- Use CSS.
- Use JavaScript.
- No backend.
- No database.
- No server-side code.
- Must be able to run as a static webapp.

## Functional requirements

The webapp must:

- load a local data file with tasks
- show tasks from one master list
- show an overview for a selected week
- print an overview for the selected week

## Data principle

All task views must be based on one master list.

The app must not duplicate task definitions across separate views.

## Print requirements

The selected week overview must be printable.

The print output should focus on the weekly overview and avoid unnecessary screen-only controls.

## Out of scope

The initial version must not add:

- backend storage
- login
- user accounts
- cloud sync
- database persistence
- unrelated task categories not defined by the data file

## Acceptance criteria

- The app can be opened from GitHub Pages.
- The app works without a backend.
- A local task data file can be loaded.
- The selected week can be changed.
- Tasks for the selected week are displayed.
- The selected week overview can be printed.
- The implementation stays within `app/` unless project-level docs/specs are being updated.
