import { LIGHT_WEEKS, REQUIRED_FIELDS } from './constants.js';
import { isActive, visibleTasks, loadForWeek, badgeClass } from './planning.js';
import { state } from './state.js';
import { $, esc } from './utils.js';

export function renderAll() {
  if (!state.tasks.length) return;
  renderDashboard();
  renderWeek();
  renderWheel();
  renderPlanning();
  renderDatabase();
  renderHouse();
  renderCar();
  renderHelp();
}

export function renderDashboard() {
  const active = state.tasks.filter(isActive);
  $('dashboard').innerHTML = `<div class="grid">
    ${card('Aktive opgaver', active.length)}${card('Årshjul', active.filter(t => t.Opgavetype === 'Årshjul').length)}
    ${card('Rutiner', active.filter(t => t.Opgavetype === 'Rutine').length)}${card('Bil-opgaver', active.filter(t => t.Opgavetype === 'Bil').length)}
    ${card('Årlig tid', `${active.reduce((s, t) => s + Number(t['Årlig tid'] || 0), 0)} min`)}${card('Valgt uge', `Uge ${$('weekSelect').value}`)}
  </div>`;
}

export function card(label, value) {
  return `<article class="card"><span>${esc(label)}</span><strong>${esc(value)}</strong></article>`;
}

export function renderWeek() {
  const week = Number($('weekSelect').value);
  const weekTasks = visibleTasks(state.plan.get(week) || []);
  const routines = visibleTasks(state.tasks.filter(t => isActive(t) && t.Opgavetype === 'Rutine'));
  $('week').innerHTML = `<h2 class="print-title">Uge ${week}</h2><div class="panel"><h2>Denne uge</h2><p>Uge ${week} · Ekstraarbejde: ${loadForWeek(week)} minutter</p></div><h2>Årshjul-opgaver</h2>${table(weekTasks, ['Opgave', 'Rum', 'Kategori', 'Estimeret tid', 'Belastning', 'Noter'])}<h2>Rutiner</h2>${table(routines, ['Opgave', 'Rum', 'Kategori', 'Frekvens', 'Estimeret tid', 'Noter'])}`;
}

export function renderCar() {
  $('car').innerHTML = `<h2>Bil</h2>${table(visibleTasks(state.tasks.filter(t => isActive(t) && t.Opgavetype === 'Bil')), REQUIRED_FIELDS)}`;
}

export function renderHouse() {
  $('house').innerHTML = `<h2>Husets oplysninger</h2>${table(visibleTasks(state.tasks.filter(t => t.Kategori === 'Husets oplysninger' || /robot|pliss|badeforhæng|uldsofa|tæppe|vinduesfyldninger|terrasse/i.test(`${t.Rum} ${t.Opgave} ${t.Noter}`))), REQUIRED_FIELDS)}`;
}

export function renderDatabase() {
  $('database').innerHTML = `<h2>Opgavedatabase</h2>${table(visibleTasks(state.tasks), REQUIRED_FIELDS)}`;
}

export function renderWheel() {
  const html = Array.from({ length: 52 }, (_, i) => {
    const week = i + 1;
    const items = visibleTasks(state.plan.get(week) || []);
    return `<article class="week-card ${LIGHT_WEEKS.has(week) ? 'light' : ''}"><h3>Uge ${week}</h3><p>${loadForWeek(week)} min</p><ul class="clean">${items.map(t => `<li>${esc(t.Opgave)} <span class="badge ${badgeClass(t)}">${esc(t.Belastning)}</span></li>`).join('') || '<li>Bonus-/opsamlingsuge</li>'}</ul></article>`;
  }).join('');
  $('wheel').innerHTML = `<h2>Årshjul</h2><div class="week-grid">${html}</div>`;
}

export function renderPlanning() {
  const rows = Array.from({ length: 52 }, (_, i) => ({
    Uge: i + 1,
    Opgaver: (state.plan.get(i + 1) || []).length,
    Minutter: loadForWeek(i + 1),
    Note: LIGHT_WEEKS.has(i + 1) ? 'Let uge' : loadForWeek(i + 1) > 60 ? 'Over ca. 60 minutter' : ''
  }));
  $('planning').innerHTML = `<h2>Planlægning</h2>${objectTable(rows)}`;
}

export function renderHelp() {
  $('help').innerHTML = `<div class="panel"><h2>Hjælp</h2><p>Indlæs en lokal JSON-fil med samme felter som tasks.json. Vælg uge for at se og printe ugeoversigten. GitHub Pages kræver ingen backend, database eller build step.</p></div>`;
}

export function table(rows, fields) {
  return `<div class="table-wrap"><table><thead><tr>${fields.map(f => `<th>${esc(f)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${fields.map(f => `<td>${cell(r, f)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${fields.length}">Ingen opgaver</td></tr>`}</tbody></table></div>`;
}

export function objectTable(rows) {
  return table(rows, Object.keys(rows[0] || {}));
}

export function cell(row, field) {
  if (field === 'Belastning' || field === 'Opgavetype') {
    return `<span class="badge ${badgeClass(row)}">${esc(row[field] ?? '')}</span>`;
  }
  return esc(row[field] ?? '');
}
