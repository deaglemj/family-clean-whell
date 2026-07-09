import { WEEK_COUNT } from './constants.js';
import { handleFile, loadExample } from './data.js';
import { renderAll } from './render.js';
import { state } from './state.js';
import { $, getIsoWeek } from './utils.js';

function init() {
  state.activeView = document.body.dataset.view || 'dashboard';

  populateWeekSelect();
  bindToolbar();
  loadExample();
}

function populateWeekSelect() {
  const select = $('weekSelect');
  if (!select) return;

  for (let week = 1; week <= WEEK_COUNT; week++) {
    select.append(new Option(`Uge ${week}`, String(week)));
  }

  select.value = localStorage.getItem('selectedWeek') || String(getIsoWeek(new Date()));
}

function bindToolbar() {
  $('fileInput')?.addEventListener('change', handleFile);
  $('loadExampleBtn')?.addEventListener('click', () => loadExample(true));
  $('printBtn')?.addEventListener('click', printSelectedWeek);
  $('weekSelect')?.addEventListener('change', () => {
    localStorage.setItem('selectedWeek', $('weekSelect').value);
    renderAll();
  });
  $('searchInput')?.addEventListener('input', renderAll);
  $('categoryFilter')?.addEventListener('change', renderAll);
}

function printSelectedWeek() {
  if (state.activeView === 'week') {
    window.print();
    return;
  }

  localStorage.setItem('selectedWeek', $('weekSelect')?.value || String(getIsoWeek(new Date())));
  window.location.href = 'currentWeek.html?print=1';
}

document.addEventListener('DOMContentLoaded', init);
