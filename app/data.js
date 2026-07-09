import { FREQUENCIES, REQUIRED_FIELDS } from './constants.js';
import { DEFAULT_TASKS } from './defaultTasks.js';
import { buildPlan } from './planning.js';
import { renderAll } from './render.js';
import { state } from './state.js';
import { $, esc } from './utils.js';

const TASK_STORAGE_KEY = 'husets-aarshjul-tasks';

export async function loadExample(forceDefault = false) {
  const stored = forceDefault ? null : readStoredTasks();
  if (stored) {
    setTasks(stored, 'Gemte opgaver indlæst.');
    return;
  }

  if (forceDefault) localStorage.removeItem(TASK_STORAGE_KEY);
  setTasks(DEFAULT_TASKS, 'Eksempeldata indlæst.');
}

export function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(data));
      setTasks(data, `${file.name} indlæst.`);
    } catch {
      setStatus('JSON-filen kunne ikke læses.');
    }
  };
  reader.readAsText(file);
}

export function setTasks(data, message) {
  if (!Array.isArray(data)) return setStatus('Datafilen skal være en JSON-liste.');

  const invalid = data.find(t => REQUIRED_FIELDS.some(f => !(f in t)) || !FREQUENCIES.includes(t.Frekvens));
  if (invalid) return setStatus('Datafilen mangler krævede felter eller har en ikke-understøttet frekvens.');

  state.tasks = data;
  buildPlan();
  populateFilters();
  setStatus(message);
  renderAll();
}

export function setStatus(text) {
  if ($('status')) $('status').textContent = text;
}

export function populateFilters() {
  if (!$('categoryFilter')) return;

  const current = $('categoryFilter').value;
  const cats = [...new Set(state.tasks.map(t => t.Kategori))].sort();
  $('categoryFilter').innerHTML = '<option value="">Alle</option>' + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('categoryFilter').value = cats.includes(current) ? current : '';
}

function readStoredTasks() {
  try {
    const raw = localStorage.getItem(TASK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
