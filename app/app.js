const REQUIRED_FIELDS = [
  'ID','Kategori','Rum','Opgave','Frekvens','Antal pr. år','Opgavetype','Estimeret tid',
  'Belastning','Sæson','Kan udsættes','Aktiv','Årlig tid','Noter'
];
const FREQUENCIES = ['Flere gange ugentligt','Ugentligt','Hver 14. dag','Månedligt','Kvartalsvist','Halvårligt','Årligt'];
const LIGHT_WEEKS = new Set([28,29,30,31,51,52]);
const SEASON_WEEKS = {
  'Forår': [10,11,12,13,14,15,16,17,18,19,20,21],
  'Sommer': [22,23,24,25,26,27,32,33,34,35],
  'Efterår': [36,37,38,39,40,41,42,43,44,45,46,47],
  'Vinter': [1,2,3,4,5,6,7,8,9,48,49,50],
  'Hele året': Array.from({length: 52}, (_, i) => i + 1)
};

let tasks = [];
let plan = new Map();
let activeView = 'dashboard';

const $ = (id) => document.getElementById(id);

function init() {
  for (let i = 1; i <= 52; i++) $('weekSelect').append(new Option(`Uge ${i}`, String(i)));
  $('weekSelect').value = String(getIsoWeek(new Date()));
  document.querySelectorAll('.tabs button').forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
  $('fileInput').addEventListener('change', handleFile);
  $('loadExampleBtn').addEventListener('click', loadExample);
  $('printBtn').addEventListener('click', () => { setView('week'); window.print(); });
  $('weekSelect').addEventListener('change', renderAll);
  $('searchInput').addEventListener('input', renderAll);
  $('categoryFilter').addEventListener('change', renderAll);
  loadExample();
}

async function loadExample() {
  try {
    const res = await fetch('tasks.json');
    if (!res.ok) throw new Error('Kunne ikke indlæse tasks.json');
    setTasks(await res.json(), 'Eksempeldata indlæst.');
  } catch (err) {
    setStatus('Åbn via GitHub Pages eller vælg tasks.json manuelt, hvis browseren blokerer lokal fetch.');
  }
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { setTasks(JSON.parse(reader.result), `${file.name} indlæst.`); }
    catch { setStatus('JSON-filen kunne ikke læses.'); }
  };
  reader.readAsText(file);
}

function setTasks(data, message) {
  if (!Array.isArray(data)) return setStatus('Datafilen skal være en JSON-liste.');
  const invalid = data.find(t => REQUIRED_FIELDS.some(f => !(f in t)) || !FREQUENCIES.includes(t.Frekvens));
  if (invalid) return setStatus('Datafilen mangler krævede felter eller har en ikke-understøttet frekvens.');
  tasks = data;
  buildPlan();
  populateFilters();
  setStatus(message);
  renderAll();
}

function setStatus(text) { $('status').textContent = text; }
function setView(view) {
  activeView = view;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active-view', v.id === view));
  renderAll();
}

function populateFilters() {
  const current = $('categoryFilter').value;
  const cats = [...new Set(tasks.map(t => t.Kategori))].sort();
  $('categoryFilter').innerHTML = '<option value="">Alle</option>' + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('categoryFilter').value = cats.includes(current) ? current : '';
}

function buildPlan() {
  plan = new Map(Array.from({length: 52}, (_, i) => [i + 1, []]));
  const yearTasks = tasks.filter(t => isActive(t) && t.Opgavetype === 'Årshjul');
  const load = new Map(Array.from({length: 52}, (_, i) => [i + 1, 0]));

  yearTasks.forEach(task => {
    const count = Number(task['Antal pr. år']) || countFromFrequency(task.Frekvens);
    const candidates = weeksForSeason(task.Sæson).filter(w => !LIGHT_WEEKS.has(w));
    const selected = pickWeeks(candidates.length ? candidates : weeksForSeason('Hele året'), count, task, load);
    selected.forEach(week => {
      plan.get(week).push(task);
      load.set(week, load.get(week) + Number(task['Estimeret tid'] || 0));
    });
  });
}

function pickWeeks(candidates, count, task, load) {
  const result = [];
  const spacing = Math.max(1, Math.floor(candidates.length / Math.max(1, count)));
  for (let i = 0; i < count; i++) {
    const targetIndex = Math.min(candidates.length - 1, i * spacing);
    const ranked = [...candidates].sort((a, b) => {
      const da = Math.abs(candidates.indexOf(a) - targetIndex);
      const db = Math.abs(candidates.indexOf(b) - targetIndex);
      const la = load.get(a) + Number(task['Estimeret tid'] || 0);
      const lb = load.get(b) + Number(task['Estimeret tid'] || 0);
      const heavyPenaltyA = task.Belastning === 'Stor' && plan.get(a).some(x => x.Belastning === 'Stor') ? 1000 : 0;
      const heavyPenaltyB = task.Belastning === 'Stor' && plan.get(b).some(x => x.Belastning === 'Stor') ? 1000 : 0;
      const overA = la > 60 ? 200 : 0;
      const overB = lb > 60 ? 200 : 0;
      return (da + la / 10 + heavyPenaltyA + overA) - (db + lb / 10 + heavyPenaltyB + overB);
    });
    const week = ranked.find(w => !result.includes(w)) ?? candidates[i % candidates.length];
    result.push(week);
  }
  return result;
}

function weeksForSeason(season = 'Hele året') {
  const parts = String(season).split('/').map(s => s.trim()).filter(Boolean);
  const weeks = parts.flatMap(p => SEASON_WEEKS[p] || []);
  return [...new Set(weeks.length ? weeks : SEASON_WEEKS['Hele året'])].sort((a, b) => a - b);
}

function countFromFrequency(freq) {
  return ({'Flere gange ugentligt': 52, 'Ugentligt': 52, 'Hver 14. dag': 26, 'Månedligt': 12, 'Kvartalsvist': 4, 'Halvårligt': 2, 'Årligt': 1})[freq] || 1;
}
function isActive(t) { return String(t.Aktiv).toLowerCase() === 'ja'; }
function visibleTasks(list) {
  const q = $('searchInput').value.toLowerCase();
  const c = $('categoryFilter').value;
  return list.filter(t => (!c || t.Kategori === c) && (!q || JSON.stringify(t).toLowerCase().includes(q)));
}
function loadForWeek(w) { return (plan.get(w) || []).reduce((sum, t) => sum + Number(t['Estimeret tid'] || 0), 0); }
function badgeClass(t) { return t.Opgavetype === 'Bil' ? 'car' : t.Opgavetype === 'Rutine' ? 'routine' : t.Belastning === 'Stor' ? 'heavy' : t.Belastning === 'Mellem' ? 'medium' : 'low'; }

function renderAll() {
  if (!tasks.length) return;
  renderDashboard(); renderWeek(); renderRoutines(); renderWheel(); renderPlanning(); renderDatabase(); renderHouse(); renderCar(); renderHelp();
}

function renderDashboard() {
  const active = tasks.filter(isActive);
  $('dashboard').innerHTML = `<div class="grid">
    ${card('Aktive opgaver', active.length)}${card('Årshjul', active.filter(t => t.Opgavetype === 'Årshjul').length)}
    ${card('Rutiner', active.filter(t => t.Opgavetype === 'Rutine').length)}${card('Bil-opgaver', active.filter(t => t.Opgavetype === 'Bil').length)}
    ${card('Årlig tid', `${active.reduce((s,t)=>s+Number(t['Årlig tid']||0),0)} min`)}${card('Valgt uge', `Uge ${$('weekSelect').value}`)}
  </div>`;
}
function card(label, value) { return `<article class="card"><span>${esc(label)}</span><strong>${esc(value)}</strong></article>`; }

function renderWeek() {
  const week = Number($('weekSelect').value);
  const list = visibleTasks(plan.get(week) || []);
  $('week').innerHTML = `<h2 class="print-title">Uge ${week}</h2><div class="panel"><h2>Uge ${week}</h2><p>Ekstraarbejde: ${loadForWeek(week)} minutter</p></div>${table(list, ['Opgave','Rum','Kategori','Estimeret tid','Belastning','Noter'])}`;
}
function renderRoutines() { $('routines').innerHTML = `<h2>Rutiner</h2>${table(visibleTasks(tasks.filter(t => isActive(t) && t.Opgavetype === 'Rutine')), REQUIRED_FIELDS)}`; }
function renderCar() { $('car').innerHTML = `<h2>Bil</h2>${table(visibleTasks(tasks.filter(t => isActive(t) && t.Opgavetype === 'Bil')), REQUIRED_FIELDS)}`; }
function renderHouse() { $('house').innerHTML = `<h2>Husets oplysninger</h2>${table(visibleTasks(tasks.filter(t => t.Kategori === 'Husets oplysninger' || /robot|pliss|badeforhæng|uldsofa|tæppe|vinduesfyldninger|terrasse/i.test(`${t.Rum} ${t.Opgave} ${t.Noter}`))), REQUIRED_FIELDS)}`; }
function renderDatabase() { $('database').innerHTML = `<h2>Opgavedatabase</h2>${table(visibleTasks(tasks), REQUIRED_FIELDS)}`; }

function renderWheel() {
  const html = Array.from({length: 52}, (_, i) => {
    const week = i + 1;
    const items = visibleTasks(plan.get(week) || []);
    return `<article class="week-card ${LIGHT_WEEKS.has(week) ? 'light' : ''}"><h3>Uge ${week}</h3><p>${loadForWeek(week)} min</p><ul class="clean">${items.map(t => `<li>${esc(t.Opgave)} <span class="badge ${badgeClass(t)}">${esc(t.Belastning)}</span></li>`).join('') || '<li>Bonus-/opsamlingsuge</li>'}</ul></article>`;
  }).join('');
  $('wheel').innerHTML = `<h2>Årshjul</h2><div class="week-grid">${html}</div>`;
}
function renderPlanning() {
  const rows = Array.from({length: 52}, (_, i) => ({Uge: i + 1, Opgaver: (plan.get(i+1)||[]).length, Minutter: loadForWeek(i+1), Note: LIGHT_WEEKS.has(i+1) ? 'Let uge' : loadForWeek(i+1) > 60 ? 'Over ca. 60 minutter' : ''}));
  $('planning').innerHTML = `<h2>Planlægning</h2>${objectTable(rows)}`;
}
function renderHelp() {
  $('help').innerHTML = `<div class="panel"><h2>Hjælp</h2><p>Indlæs en lokal JSON-fil med samme felter som tasks.json. Vælg uge for at se og printe ugeoversigten. GitHub Pages kræver ingen backend, database eller build step.</p></div>`;
}

function table(rows, fields) {
  return `<div class="table-wrap"><table><thead><tr>${fields.map(f => `<th>${esc(f)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${fields.map(f => `<td>${cell(r, f)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${fields.length}">Ingen opgaver</td></tr>`}</tbody></table></div>`;
}
function objectTable(rows) { return table(rows, Object.keys(rows[0] || {})); }
function cell(row, f) {
  if (f === 'Belastning' || f === 'Opgavetype') return `<span class="badge ${badgeClass(row)}">${esc(row[f] ?? '')}</span>`;
  return esc(row[f] ?? '');
}
function esc(value) { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function getIsoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

document.addEventListener('DOMContentLoaded', init);
