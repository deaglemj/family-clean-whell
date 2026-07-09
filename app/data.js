import { FREQUENCIES, REQUIRED_FIELDS } from './constants.js';
import { buildPlan } from './planning.js';
import { renderAll } from './render.js';
import { state } from './state.js';
import { $, esc } from './utils.js';

export async function loadExample() {
  try {
    const res = await fetch('tasks.json');
    if (!res.ok) throw new Error('Kunne ikke indlæse tasks.json');
    setTasks(await res.json(), 'Eksempeldata indlæst.');
  } catch (err) {
    setStatus('Åbn via GitHub Pages eller vælg tasks.json manuelt, hvis browseren blokerer lokal fetch.');
  }
}

export function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      setTasks(JSON.parse(reader.result), `${file.name} indlæst.`);
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
  $('status').textContent = text;
}

export function populateFilters() {
  const current = $('categoryFilter').value;
  const cats = [...new Set(state.tasks.map(t => t.Kategori))].sort();
  $('categoryFilter').innerHTML = '<option value="">Alle</option>' + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('categoryFilter').value = cats.includes(current) ? current : '';
}
