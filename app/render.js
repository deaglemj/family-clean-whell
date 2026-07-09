import { LIGHT_WEEKS, REQUIRED_FIELDS, WEEK_COUNT } from './constants.js';
import { isActive, visibleTasks, loadForWeek, badgeClass } from './planning.js';
import { state } from './state.js';
import { $, esc } from './utils.js';

const WEEK_TABLE_FIELDS = ['Opgave', 'Rum', 'Kategori', 'Estimeret tid', 'Belastning', 'Noter'];
const ROUTINE_TABLE_FIELDS = ['Opgave', 'Rum', 'Kategori', 'Frekvens', 'Estimeret tid', 'Noter'];

export function renderAll() {
  if (!state.tasks.length) return;

  if ($('dashboard')) renderDashboard();
  if ($('week')) renderWeek();
  if ($('wheel')) renderWheel();
  if ($('database')) renderDatabase();

  if (state.activeView === 'week' && new URLSearchParams(window.location.search).get('print') === '1') {
    window.setTimeout(() => window.print(), 150);
  }
}

export function renderDashboard() {
  const active = state.tasks.filter(isActive);

  $('dashboard').innerHTML = `
    <div class="grid">
      ${card('Aktive opgaver', active.length)}
      ${card('Årshjul', countByType(active, 'Årshjul'))}
      ${card('Rutiner', countByType(active, 'Rutine'))}
      ${card('Bil-opgaver', countByType(active, 'Bil'))}
      ${card('Årlig tid', `${sumAnnualTime(active)} min`)}
      ${card('Valgt uge', `Uge ${$('weekSelect')?.value || '-'}`)}
    </div>
    <div class="panel intro-panel">
      <h2>Sådan bruges siden</h2>
      <p>Indlæs en lokal JSON-fil eller brug eksempeldata. Alle visninger bygger på samme masterliste.</p>
    </div>
  `;
}

export function card(label, value) {
  return `<article class="card"><span>${esc(label)}</span><strong>${esc(value)}</strong></article>`;
}

export function renderWeek() {
  const week = Number($('weekSelect')?.value || 1);
  const weekTasks = visibleTasks(state.plan.get(week) || []);
  const routines = visibleTasks(state.tasks.filter(t => isActive(t) && t.Opgavetype === 'Rutine'));

  $('week').innerHTML = `
    <h2 class="print-title">Husets Årshjul · Uge ${week}</h2>
    <div class="panel">
      <h2>Denne uge</h2>
      <p>Uge ${week} · Ekstraarbejde: ${loadForWeek(week)} minutter</p>
    </div>
    <h2>Årshjul-opgaver</h2>
    ${table(weekTasks, WEEK_TABLE_FIELDS)}
    <h2>Rutiner</h2>
    ${table(routines, ROUTINE_TABLE_FIELDS)}
  `;
}

export function renderDatabase() {
  $('database').innerHTML = `<h2>Opgaveliste</h2>${table(visibleTasks(state.tasks), REQUIRED_FIELDS)}`;
}

export function renderWheel() {
  const html = Array.from({ length: WEEK_COUNT }, (_, i) => {
    const week = i + 1;
    const items = visibleTasks(state.plan.get(week) || []);

    return `
      <article class="week-card ${LIGHT_WEEKS.has(week) ? 'light' : ''}">
        <h3>Uge ${week}</h3>
        <p>${loadForWeek(week)} min</p>
        <ul class="clean">${renderWheelTasks(items)}</ul>
      </article>
    `;
  }).join('');

  $('wheel').innerHTML = `<h2>Årshjul</h2><div class="week-grid">${html}</div>`;
}

export function table(rows, fields) {
  const headers = fields.map(field => `<th>${esc(field)}</th>`).join('');
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

function renderWheelTasks(items) {
  if (!items.length) return '<li>Bonus-/opsamlingsuge</li>';

  return items.map(task => `
    <li>
      ${esc(task.Opgave)}
      <span class="badge ${badgeClass(task)}">${esc(task.Belastning)}</span>
    </li>
  `).join('');
}

export function cell(row, field) {
  if (field === 'Belastning' || field === 'Opgavetype') {
    return `<span class="badge ${badgeClass(row)}">${esc(row[field] ?? '')}</span>`;
  }

  return esc(row[field] ?? '');
}

function countByType(tasks, type) {
  return tasks.filter(task => task.Opgavetype === type).length;
}

function sumAnnualTime(tasks) {
  return tasks.reduce((sum, task) => sum + Number(task['Årlig tid'] || 0), 0);
}
