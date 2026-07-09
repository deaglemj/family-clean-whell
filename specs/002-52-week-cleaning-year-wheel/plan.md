# Plan: 52-Week Cleaning Year Wheel

## Implementation Approach

1. Keep the existing app layout.
2. Update the task data structure to support:
   - weekly recurring tasks
   - odd-week 14-day tasks
   - week-specific extra tasks
3. Update week filtering logic.
4. Update selected-week rendering.
5. Update print rendering only where needed.
6. Verify GitHub Pages compatibility.

## Expected Code Areas

Expected areas may include:

- `app/` static HTML/CSS/JavaScript files
- task data file
- week selection logic
- print styling

## Data Shape

Recommended logical model:

```js
{
  weeklyTasks: [
    { id: "weekly-bathrooms", title: "Rengør begge badeværelser grundigt", active: true }
  ],
  biweeklyOddTasks: [
    { id: "odd-sofas-mattresses", title: "Støvsug sofaer og madrasser", active: true }
  ],
  extraTasksByWeek: {
    "1": { id: "extra-week-1", title: "Ovn", active: true }
  }
}
```

## Week Rules

```js
const isOddWeek = weekNumber % 2 === 1;
```

For a selected week:

- Always include `weeklyTasks`
- Include `biweeklyOddTasks` only when `isOddWeek === true`
- Include `extraTasksByWeek[weekNumber]` only if it exists

## Layout Rule

Do not redesign the app.

Allowed UI changes:

- Add or rename labels needed for:
  - weekly tasks
  - 14-day tasks
  - extra task
  - week number
- Add task sections inside the existing layout
- Adjust print CSS only to support the feature

Not allowed:

- New full-page design
- New navigation model
- Backend-dependent features
