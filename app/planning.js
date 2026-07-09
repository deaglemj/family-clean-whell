import { LIGHT_WEEKS, SEASON_WEEKS } from './constants.js';
import { state } from './state.js';

export function buildPlan() {
  state.plan = new Map(Array.from({ length: 52 }, (_, i) => [i + 1, []]));
  const yearTasks = state.tasks.filter(t => isActive(t) && t.Opgavetype === 'Årshjul');
  const load = new Map(Array.from({ length: 52 }, (_, i) => [i + 1, 0]));

  yearTasks.forEach(task => {
    const count = Number(task['Antal pr. år']) || countFromFrequency(task.Frekvens);
    const candidates = weeksForSeason(task.Sæson).filter(w => !LIGHT_WEEKS.has(w));
    const selected = pickWeeks(candidates.length ? candidates : weeksForSeason('Hele året'), count, task, load);
    selected.forEach(week => {
      state.plan.get(week).push(task);
      load.set(week, load.get(week) + Number(task['Estimeret tid'] || 0));
    });
  });
}

export function pickWeeks(candidates, count, task, load) {
  const result = [];
  const spacing = Math.max(1, Math.floor(candidates.length / Math.max(1, count)));
  for (let i = 0; i < count; i++) {
    const targetIndex = Math.min(candidates.length - 1, i * spacing);
    const ranked = [...candidates].sort((a, b) => {
      const da = Math.abs(candidates.indexOf(a) - targetIndex);
      const db = Math.abs(candidates.indexOf(b) - targetIndex);
      const la = load.get(a) + Number(task['Estimeret tid'] || 0);
      const lb = load.get(b) + Number(task['Estimeret tid'] || 0);
      const heavyPenaltyA = task.Belastning === 'Stor' && state.plan.get(a).some(x => x.Belastning === 'Stor') ? 1000 : 0;
      const heavyPenaltyB = task.Belastning === 'Stor' && state.plan.get(b).some(x => x.Belastning === 'Stor') ? 1000 : 0;
      const overA = la > 60 ? 200 : 0;
      const overB = lb > 60 ? 200 : 0;
      return (da + la / 10 + heavyPenaltyA + overA) - (db + lb / 10 + heavyPenaltyB + overB);
    });
    const week = ranked.find(w => !result.includes(w)) ?? candidates[i % candidates.length];
    result.push(week);
  }
  return result;
}

export function weeksForSeason(season = 'Hele året') {
  const parts = String(season).split('/').map(s => s.trim()).filter(Boolean);
  const weeks = parts.flatMap(p => SEASON_WEEKS[p] || []);
  return [...new Set(weeks.length ? weeks : SEASON_WEEKS['Hele året'])].sort((a, b) => a - b);
}

export function countFromFrequency(freq) {
  return ({
    'Flere gange ugentligt': 52,
    'Ugentligt': 52,
    'Hver 14. dag': 26,
    'Månedligt': 12,
    'Kvartalsvist': 4,
    'Halvårligt': 2,
    'Årligt': 1
  })[freq] || 1;
}

export function isActive(task) {
  return String(task.Aktiv).toLowerCase() === 'ja';
}

export function visibleTasks(list) {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const c = document.getElementById('categoryFilter').value;
  return list.filter(t => (!c || t.Kategori === c) && (!q || JSON.stringify(t).toLowerCase().includes(q)));
}

export function loadForWeek(week) {
  return (state.plan.get(week) || []).reduce((sum, t) => sum + Number(t['Estimeret tid'] || 0), 0);
}

export function badgeClass(task) {
  if (task.Opgavetype === 'Bil') return 'car';
  if (task.Opgavetype === 'Rutine') return 'routine';
  if (task.Belastning === 'Stor') return 'heavy';
  if (task.Belastning === 'Mellem') return 'medium';
  return 'low';
}
