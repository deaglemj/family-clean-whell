# Tasks: 52-Week Cleaning Year Wheel

## 1. Data

- [ ] Add weekly recurring task data.
- [ ] Add odd-week 14-day task data.
- [ ] Add week-specific extra task data for weeks visible in the image.
- [ ] Ensure weeks without a specified extra task stay empty.

## 2. Week Logic

- [ ] Add helper for detecting odd weeks.
- [ ] Build selected-week task list from weekly tasks.
- [ ] Add 14-day tasks only for odd weeks.
- [ ] Add extra task only when configured for the selected week.

## 3. UI

- [ ] Keep existing app layout.
- [ ] Show selected week number.
- [ ] Show weekly task section.
- [ ] Show 14-day task section only when relevant.
- [ ] Show extra task section.
- [ ] Preserve existing checkbox/completion behavior if present.

## 4. Print

- [ ] Ensure print output includes selected week tasks.
- [ ] Ensure print output is readable.
- [ ] Ensure no backend or dynamic server dependency is introduced.

## 5. Verification

- [ ] Week 1 shows weekly tasks, 14-day tasks, and `Ovn`.
- [ ] Week 2 shows weekly tasks, no 14-day tasks, and `Emhættefilter`.
- [ ] Week 3 shows weekly tasks, 14-day tasks, and `Køleskab indvendigt`.
- [ ] Week 25 does not invent an extra task.
- [ ] Week 52 shows weekly tasks and `Gennemgå rengøringsudstyr`.
- [ ] App still works as a static GitHub Pages app.
