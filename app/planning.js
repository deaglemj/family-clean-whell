import { WEEK_COUNT } from './constants.js';
import { state } from './state.js';

export function buildPlan() {
  state.plan = createWeekMap([]);

  for (let week = 1; week <= WEEK_COUNT; week++) {
    state.plan.set(week, tasksForWeek(week));
  }
}

function createWeekMap(defaultValue) {
  return new Map(Array.from({ length: WEEK_COUNT }, (_, i) => {
    const value = Array.isArray(defaultValue) ? [] : defaultValue;
    return [i + 1, value];
  }));
}

export function tasksForWeek(week) {
  return [
    ...weeklyTasks(),
    ...fortnightlyTasks(week),
    ...extraTasksForWeek(week)
  ];
}

export function weeklyTasks() {
  return state.tasks.filter(task =>
    isActive(task) &&
    (task.Opgavetype === 'Fast ugentlig' || task.Frekvens === 'Ugentligt')
  );
}

export function fortnightlyTasks(week) {
  if (!isOddWeek(week)) return [];

  return state.tasks.filter(task =>
    isActive(task) &&
    (task.Opgavetype === '14-dage' || task.Frekvens === 'Hver 14. dag')
  );
}

export function extraTasksForWeek(week) {
  return state.tasks.filter(task =>
    isActive(task) &&
    task.Opgavetype === 'Ekstra' &&
    Number(task.Uge) === Number(week)
  );
}

export function isOddWeek(week) {
  return Number(week) % 2 === 1;
}

export function isActive(task) {
  return String(task.Aktiv).toLowerCase() === 'ja';
}

export function visibleTasks(list) {
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const q = (searchInput?.value || '').toLowerCase();
  const c = categoryFilter?.value || '';

  return list.filter(t => (!c || t.Kategori === c) && (!q || JSON.stringify(t).toLowerCase().includes(q)));
}

export function loadForWeek(week) {
  return (state.plan.get(week) || []).reduce((sum, t) => sum + Number(t['Estimeret tid'] || 0), 0);
}

export function badgeClass(task) {
  if (task.Opgavetype === 'Ekstra') return 'heavy';
  if (task.Opgavetype === '14-dage') return 'medium';
  if (task.Opgavetype === 'Fast ugentlig') return 'routine';
  if (task.Opgavetype === 'Bil') return 'car';
  if (task.Opgavetype === 'Rutine') return 'routine';
  if (task.Belastning === 'Stor') return 'heavy';
  if (task.Belastning === 'Mellem') return 'medium';
  return 'low';
}
