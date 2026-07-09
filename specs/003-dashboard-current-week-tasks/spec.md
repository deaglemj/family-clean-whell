# Feature: Dashboard Current Week Tasks

## Goal

Simplify the dashboard so it only shows the tasks for the current week.

The dashboard must be a focused weekly task list. It must not show filters, filter rows, summaries, controls, or unrelated dashboard information.

## Functional Requirements

### 1. Dashboard content

The dashboard must show only this week's tasks.

The displayed tasks must come from the existing task planning model.

For the current week, the dashboard task list must include the same tasks that belong to that week according to the existing week rules:

- weekly recurring tasks
- 14-day tasks when the current week is an odd week
- the configured extra task for the current week, if one exists

### 2. Current week detection

The dashboard must determine the current week automatically.

The current week must use the same week numbering logic as the rest of the app.

### 3. Task list display

The dashboard must display the current week's tasks in the same table/list format as `currentWeek`.

The dashboard task list must use these columns, in this order:

| Column | Requirement |
|---|---|
| `✓` | Task completion checkbox/status column |
| `Opgave` | Task text |
| `Rum` | Room |
| `Kategori` | Category |
| `Estimeret tid` | Estimated time |
| `Belastning` | Load/effort |
| `Noter` | Notes |

The dashboard must reuse the same task list rendering behavior as `currentWeek` where possible.

If task completion checkboxes already exist in the app, the dashboard must reuse the existing checkbox/completion behavior for the listed tasks.

### 4. Remove dashboard filter row

The dashboard must not show a filter row.

This includes removing or hiding dashboard controls such as:

- week filter controls
- category filters
- room filters
- frequency filters
- status filters
- search/filter rows

### 5. Remove other dashboard information

The dashboard must not show other information besides this week's task list.

This includes removing or hiding dashboard content such as:

- summaries
- statistics
- counts
- charts
- help text
- metadata
- unrelated sections

## Non-Goals

This feature must not:

- change the underlying task data model unless required to read current week tasks
- change the existing week overview page beyond what is needed for shared logic
- add backend/server/database functionality
- add login or users
- add notifications
- add calendar synchronization
- add new tasks
- change task scheduling rules
- redesign the full application

## Acceptance Criteria

- Dashboard shows a task list for the current week.
- Dashboard task list is shown in the same table/list format as `currentWeek`.
- Dashboard task list uses exactly these visible columns in this order: `✓`, `Opgave`, `Rum`, `Kategori`, `Estimeret tid`, `Belastning`, `Noter`.
- Dashboard reuses existing task completion checkbox behavior where available.
- Dashboard does not show a filter row.
- Dashboard does not show category, room, frequency, status, or search filters.
- Dashboard does not show summaries, statistics, charts, metadata, help text, or unrelated sections.
- Dashboard task list uses the same task rules as the selected week overview.
- Weekly recurring tasks appear on the dashboard every week.
- 14-day tasks appear on the dashboard only when the current week is odd.
- The current week's extra task appears when configured.
- No task is invented when the current week has no configured extra task.
- App still runs as a static GitHub Pages-compatible webapp.
