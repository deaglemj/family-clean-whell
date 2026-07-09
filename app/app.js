import { handleFile, loadExample } from './data.js';
import { renderAll } from './render.js';
import { state } from './state.js';
import { $, getIsoWeek } from './utils.js';

function init() {
  for (let i = 1; i <= 52; i++) {
    $('weekSelect').append(new Option(`Uge ${i}`, String(i)));
  }

  $('weekSelect').value = String(getIsoWeek(new Date()));
  document.querySelectorAll('.tabs button').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });
  $('fileInput').addEventListener('change', handleFile);
  $('loadExampleBtn').addEventListener('click', loadExample);
  $('printBtn').addEventListener('click', () => {
    setView('week');
    window.print();
  });
  $('weekSelect').addEventListener('change', renderAll);
  $('searchInput').addEventListener('input', renderAll);
  $('categoryFilter').addEventListener('change', renderAll);
  loadExample();
}

function setView(view) {
  state.activeView = view;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active-view', v.id === view));
  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
