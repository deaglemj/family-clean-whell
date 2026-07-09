import { WEEK_COUNT } from './constants.js';
import { handleFile, loadExample } from './data.js';
import { renderAll } from './render.js';
import { state } from './state.js';
import { $, getIsoWeek } from './utils.js';

function init() {
  populateWeekSelect();
  bindNavigation();
  bindToolbar();

  loadExample();
}

function setView(view) {
  state.activeView = view;

  document.querySelectorAll('.tabs button').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
  });

  document.querySelectorAll('.view').forEach(section => {
    section.classList.toggle('active-view', section.id === view);
  });

  renderAll();
}

function populateWeekSelect() {
  for (let week = 1; week <= WEEK_COUNT; week++) {
    $('weekSelect').append(new Option(`Uge ${week}`, String(week)));
  }

  $('weekSelect').value = String(getIsoWeek(new Date()));
}

function bindNavigation() {
  document.querySelectorAll('.tabs button').forEach(button => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });
}

function bindToolbar() {
  $('fileInput').addEventListener('change', handleFile);
  $('loadExampleBtn').addEventListener('click', loadExample);
  $('printBtn').addEventListener('click', printSelectedWeek);
  $('weekSelect').addEventListener('change', renderAll);
  $('searchInput').addEventListener('input', renderAll);
  $('categoryFilter').addEventListener('change', renderAll);
}

function printSelectedWeek() {
  setView('week');
  window.print();
}

document.addEventListener('DOMContentLoaded', init);
