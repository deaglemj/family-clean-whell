# Plan: Dashboard Current Week Tasks

## Implementation Approach

1. Reuse the existing week/task planning logic.
2. Add or reuse a helper that resolves the current week number.
3. Build the dashboard task list from the current week only.
4. Remove or hide the dashboard filter row.
5. Remove or hide all dashboard content that is not the current week's task list.
6. Keep the app static and GitHub Pages-compatible.

## Expected Code Areas

Expected areas may include:

- `app/` static HTML/CSS/JavaScript files
- dashboard rendering logic
- shared week/task selection logic
- task list rendering
- dashboard-specific CSS

## Current Week Rule

Use the same week numbering logic as the existing week overview.

The dashboard must not introduce a separate or conflicting week calculation.

## Dashboard Rendering Rule

The dashboard must render only:

```text
This week's tasks
- Task 1
- Task 2
- Task 3
```

The exact heading text may follow the existing app language, but the dashboard content must stay limited to the task list.

## Task Source Rule

For the current week:

- Always include weekly recurring tasks.
- Include 14-day tasks only when the current week is odd.
- Include the configured extra task only if one exists for the current week.
- Do not create fallback or placeholder tasks.

## Not Allowed

The dashboard must not include:

- filter rows
- search fields
- category filters
- room filters
- frequency filters
- status filters
- summaries
- statistics
- counts
- charts
- metadata panels
- unrelated help text
- unrelated sections
