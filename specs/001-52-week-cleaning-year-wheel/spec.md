# Feature: 52-Week Cleaning Year Wheel

## Goal

Move the application toward the cleaning system shown in the reference picture:

- A 52-week cleaning year overview
- Fixed weekly tasks
- Extra 14-day tasks on odd weeks
- One rotating extra task per week
- Week-by-week printable/checkable overview

The existing application layout must remain as it is. This feature changes the planning model and displayed content, not the overall page structure.

## Source Reference

The uploaded image shows a printable Danish 52-week cleaning year wheel with:

- Title: `52-UGERS RENGØRINGSÅRSHJUL`
- A fixed weekly task section
- A 14-day task section for odd weeks
- A weekly extra task schedule
- Week rows from 1 to 52
- Checkboxes for completion
- Date field per week
- Print-friendly design

## Functional Requirements

### 1. Weekly recurring tasks

The app must support fixed tasks that apply every week.

Initial weekly tasks from the image:

- Rengør begge badeværelser grundigt
- Støvsug hvor robotten ikke tager
- Gulvvask efter behov
- Støv af på vandrette flader
- Tør dørgreb og lyskontakter af

### 2. 14-day tasks

The app must support tasks that occur every 14 days.

In this feature, 14-day tasks must appear on odd weeks only:

- Week 1, 3, 5, 7, etc.

Initial 14-day tasks from the image:

- Støvsug sofaer og madrasser
- Aftør køkkenfronter
- Rengør mikrobølgeovn
- Fjern kalk fra armaturer
- Skift sengetøj

### 3. Weekly extra task

The app must support exactly one extra task per week.

The extra task must be assigned by week number.

Initial extra task schedule:

| Week | Extra task |
|---:|---|
| 1 | Ovn |
| 2 | Emhættefilter |
| 3 | Køleskab indvendigt |
| 4 | Fryser og gamle madvarer |
| 5 | Vaskemaskine grundigt |
| 6 | Tørretumbler grundigt |
| 7 | Dørkarme |
| 8 | Paneler |
| 9 | Afløb i køkken |
| 10 | Afløb på badeværelser |
| 11 | Flyt lette møbler og rengør bagved |
| 12 | Rengør bag sofa |
| 13 | Robotstøvsuger grundigt |
| 14 | Vask dyner |
| 15 | Vask hovedpuder |
| 16 | Ventilationsrister |
| 17 | Oversiden af skabe |
| 18 | Gardiner |
| 19 | Loftslamper |
| 20 | Vægge for pletter |
| 21 | Træk komfur ud og rengør bagved |
| 22 | Træk køleskab ud og rengør bagved |
| 23 | Vandlåse |
| 24 | Rengør radiatorer |
| 26 | Gennemgå rengøringsudstyr |
| 27 | Ovn |
| 28 | Emhættefilter |
| 29 | Køleskab indvendigt |
| 30 | Fryser og gamle madvarer |
| 31 | Vaskemaskine grundigt |
| 32 | Tørretumbler grundigt |
| 33 | Dørkarme |
| 34 | Paneler |
| 35 | Afløb i køkken |
| 36 | Afløb på badeværelser |
| 37 | Flyt lette møbler og rengør bagved |
| 38 | Rengør bag sofa |
| 39 | Robotstøvsuger grundigt |
| 40 | Vask dyner |
| 41 | Vask hovedpuder |
| 42 | Vend madrasser |
| 43 | Ventilationsventiler |
| 44 | Oversiden af skabe |
| 45 | Gardiner |
| 46 | Loftslamper |
| 47 | Vægge for pletter og rengør bagved |
| 48 | Træk køleskab ud og rengør bagved |
| 49 | Vandlåse |
| 50 | Rengør radiatorer |
| 52 | Gennemgå rengøringsudstyr |

Weeks without a visible extra task in the image must stay empty unless later specified.

### 4. Week overview

For each week, the app must show:

- Week number
- Weekly tasks
- 14-day tasks, only if the week is odd
- Extra task for the selected week
- Completion checkbox/state per task
- Optional date range field or display

### 5. Print behavior

The existing print functionality must still work.

Printed output must include the selected week overview with:

- Weekly tasks
- 14-day tasks when relevant
- Extra task
- Checkboxes or clear completion markers

### 6. Data model

The app must keep using a data-driven model.

The data must allow:

- Weekly recurring tasks
- 14-day odd-week tasks
- Week-specific extra tasks
- Active/inactive task control if already supported

## Non-Goals

This feature must not:

- Replace the existing application layout
- Add backend/server/database
- Add login or users
- Add calendar synchronization
- Add notifications
- Add monthly or quarterly rules
- Add new task categories not visible in the image
- Add assumptions beyond the picture

## Acceptance Criteria

- User can select a week from 1 to 52.
- Weekly tasks appear for every selected week.
- 14-day tasks appear only for odd weeks.
- Exactly one extra task appears when the selected week has one.
- Weeks with no specified extra task do not invent a task.
- The existing layout remains recognizable and structurally unchanged.
- Print view includes all tasks for the selected week.
- App still runs as a static GitHub Pages-compatible webapp.
