import { REQUIRED_FIELDS, WEEK_COUNT } from './constants.js';
import {
  extraTasksForWeek,
  fortnightlyTasks,
  isActive,
  isOddWeek,
  loadForWeek,
  visibleTasks,
  weeklyTasks,
  badgeClass
} from './planning.js';
import { state } from './state.js';
import { $, esc } from './utils.js';

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
  const active = state.tasks.filter(isActive);
  const selectedWeek = Number($('weekSelect')?.value || 1);

  $('dashboard').innerHTML = `
    <div class="grid">
      ${card('Aktive opgaver', active.length)}
      ${card('Faste ugentlige', weeklyTasks().length)}
      ${card('14-dages opgaver', state.tasks.filter(t => isActive(t) && (t.Opgavetype === '14-dage' || t.Frekvens === 'Hver 14. dag')).length)}
      ${card('Ekstra ugeopgaver', state.tasks.filter(t => isActive(t) && t.Opgavetype === 'Ekstra').length)}
      ${card('Valgt uge', `Uge ${selectedWeek}`)}
      ${card('Ugens tid', `${loadForWeek(selectedWeek)} min`)}
    </div>
    <div class="panel intro-panel">
      <h2>52-ugers rengøringsårshjul</h2>
      <p>Hver uge viser faste opgaver, 14-dages opgaver i ulige uger og én planlagt ekstraopgave hvis ugen har en.</p>
    </div>
  `;
}

export function card(label, value) {
  return `<article class="card"><span>${esc(label)}</span><strong>${esc(value)}</strong></article>`;
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
    ${taskSection('Faste ugentlige opgaver', weekly)}
    ${isOddWeek(week) ? taskSection('14-dages opgaver', fortnightly) : ''}
    ${taskSection('Ekstra ugeopgave', extra)}
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

function taskSection(title, rows) {
  return `
    <section class="task-section">
      <h2>${esc(title)}</h2>
      ${table(rows, WEEK_TABLE_FIELDS)}
    </section>
  `;
}

export function table(rows, fields) {
  const headers = fields.map(field => `<th>${field === 'Done' ? '✓' : esc(field)}</th>`).join('');
  const body = rows.map(row => renderTableRow(row, fields)).join('');
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

function renderTableRow(row, fields) {
  return `<tr>${fields.map(field => `<td>${cell(row, field)}</td>`).join('')}</tr>`;
}

export function cell(row, field) {
  if (field === 'Done') {
    return `<input class="task-check" type="checkbox" data-task-id="${esc(row.ID)}" ${isCompleted(row.ID, currentWeek()) ? 'checked' : ''}>`;
  }

  if (field === 'Belastning' || field === 'Opgavetype') {
    return `<span class="badge ${badgeClass(row)}">${esc(row[field] ?? '')}</span>`;
  }

  return esc(row[field] ?? '');
}

function bindCompletionInputs() {
  document.querySelectorAll('.task-check').forEach(input => {
    input.addEventListener('change', () => {
      const completed = readCompleted();
      if (input.checked) {
        completed.add(completionKey(input.dataset.taskId, currentWeek()));
      } else {
        completed.delete(completionKey(input.dataset.taskId, currentWeek()));
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
  return Number($('weekSelect')?.value || 1);
}

function readCompleted() {
  try {
    return new Set(JSON.parse(localStorage.getItem(COMPLETION_STORAGE_KEY) || '[]'));
  } catch {
    return new Set();
  }
}
