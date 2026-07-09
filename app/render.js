import { REQUIRED_FIELDS, WEEK_COUNT } from './constants.js';
import {
  extraTasksForWeek,
  fortnightlyTasks,
  isOddWeek,
  loadForWeek,
  tasksForWeek,
  visibleTasks,
  weeklyTasks,
  badgeClass
} from './planning.js';
import { state } from './state.js';
import { $, esc, getIsoWeek } from './utils.js';

const WEEK_TABLE_FIELDS = ['Done', 'Opgave', 'Rum', 'Kategori', 'Estimeret tid', 'Belastning', 'Noter'];
const DATABASE_FIELDS = [...REQUIRED_FIELDS, 'Uge'];
const COMPLETION_STORAGE_KEY = 'husets-aarshjul-completed';

export function renderAll() {
  if (!state.tasks.length) return;

  if ($('dashboard')) renderDashboard();
  if ($('week')) renderWeek();
  if ($('wheel')) renderWheel();
  if ($('database')) renderDatabase();

  bindCompletionInputs();

  if (state.activeView === 'week' && new URLSearchParams(window.location.search).get('print') === '1') {
    window.setTimeout(() => window.print(), 150);
  }
}

export function renderDashboard() {
  const week = getIsoWeek(new Date());
  const tasks = tasksForWeek(week);

  $('dashboard').innerHTML = table(tasks, WEEK_TABLE_FIELDS, week);
}

export function renderWeek() {
  const week = Number($('weekSelect')?.value || 1);
  const weekly = visibleTasks(weeklyTasks());
  const fortnightly = visibleTasks(fortnightlyTasks(week));
  const extra = visibleTasks(extraTasksForWeek(week));

  $('week').innerHTML = `
    <h2 class="print-title">52-UGERS RENGØRINGSÅRSHJUL · Uge ${week}</h2>
    <div class="panel week-summary">
      <h2>Denne uge</h2>
      <p>Uge ${week} · Dato: __________ · Samlet estimeret tid: ${loadForWeek(week)} minutter</p>
    </div>
    ${taskSection('Faste ugentlige opgaver', weekly, week)}
    ${isOddWeek(week) ? taskSection('14-dages opgaver', fortnightly, week) : ''}
    ${taskSection('Ekstra ugeopgave', extra, week)}
  `;
}

export function renderDatabase() {
  $('database').innerHTML = `<h2>Opgaveliste</h2>${table(visibleTasks(state.tasks), DATABASE_FIELDS)}`;
}

export function renderWheel() {
  const html = Array.from({ length: WEEK_COUNT }, (_, i) => {
    const week = i + 1;
    const extra = extraTasksForWeek(week)[0];

    return `
      <article class="week-card">
        <h3>Uge ${week}</h3>
        <p>Dato: __________</p>
        <ul class="clean">
          <li>☐ Faste ugentlige opgaver</li>
          ${isOddWeek(week) ? '<li>☐ 14-dages opgaver</li>' : ''}
          <li>☐ ${extra ? esc(extra.Opgave) : 'Ingen ekstraopgave'}</li>
        </ul>
      </article>
    `;
  }).join('');

  $('wheel').innerHTML = `<h2>52-ugers rengøringsårshjul</h2><div class="week-grid">${html}</div>`;
}

function taskSection(title, rows, week) {
  return `
    <section class="task-section">
      <h2>${esc(title)}</h2>
      ${table(rows, WEEK_TABLE_FIELDS, week)}
    </section>
  `;
}

export function table(rows, fields, completionWeek = currentWeek()) {
  const headers = fields.map(field => `<th>${field === 'Done' ? '✓' : esc(field)}</th>`).join('');
  const body = rows.map(row => renderTableRow(row, fields, completionWeek)).join('');
  const emptyRow = `<tr><td colspan="${fields.length}">Ingen opgaver</td></tr>`;

  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headers}</tr></thead>
        <tbody>${body || emptyRow}</tbody>
      </table>
    </div>
  `;
}

function renderTableRow(row, fields, completionWeek) {
  return `<tr>${fields.map(field => `<td>${cell(row, field, completionWeek)}</td>`).join('')}</tr>`;
}

export function cell(row, field, completionWeek = currentWeek()) {
  if (field === 'Done') {
    return `<input class="task-check" type="checkbox" data-task-id="${esc(row.ID)}" data-week="${esc(completionWeek)}" ${isCompleted(row.ID, completionWeek) ? 'checked' : ''}>`;
  }

  if (field === 'Belastning' || field === 'Opgavetype') {
    return `<span class="badge ${badgeClass(row)}">${esc(row[field] ?? '')}</span>`;
  }

  return esc(row[field] ?? '');
}

function bindCompletionInputs() {
  document.querySelectorAll('.task-check').forEach(input => {
    input.addEventListener('change', () => {
      const week = Number(input.dataset.week || currentWeek());
      const completed = readCompleted();

      if (input.checked) {
        completed.add(completionKey(input.dataset.taskId, week));
      } else {
        completed.delete(completionKey(input.dataset.taskId, week));
      }

      localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify([...completed]));
    });
  });
}

function isCompleted(taskId, week) {
  return readCompleted().has(completionKey(taskId, week));
}

function completionKey(taskId, week) {
  return `${week}:${taskId}`;
}

function currentWeek() {
  return Number($('weekSelect')?.value || getIsoWeek(new Date()));
}

function readCompleted() {
  try {
    return new Set(JSON.parse(localStorage.getItem(COMPLETION_STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}
