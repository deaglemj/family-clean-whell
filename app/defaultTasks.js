const WEEKLY_TASKS = [
  'Rengør begge badeværelser grundigt',
  'Støvsug hvor robotten ikke tager',
  'Gulvvask efter behov',
  'Støv af på vandrette flader',
  'Tør dørgreb og lyskontakter af'
];

const FORTNIGHTLY_TASKS = [
  'Støvsug sofaer og madrasser',
  'Aftør køkkenfronter',
  'Rengør mikrobølgeovn',
  'Fjern kalk fra armaturer',
  'Skift sengetøj'
];

const EXTRA_TASKS_BY_WEEK = new Map([
  [1, 'Ovn'],
  [2, 'Emhættefilter'],
  [3, 'Køleskab indvendigt'],
  [4, 'Fryser og gamle madvarer'],
  [5, 'Vaskemaskine grundigt'],
  [6, 'Tørretumbler grundigt'],
  [7, 'Dørkarme'],
  [8, 'Paneler'],
  [9, 'Afløb i køkken'],
  [10, 'Afløb på badeværelser'],
  [11, 'Flyt lette møbler og rengør bagved'],
  [12, 'Rengør bag sofa'],
  [13, 'Robotstøvsuger grundigt'],
  [14, 'Vask dyner'],
  [15, 'Vask hovedpuder'],
  [16, 'Ventilationsrister'],
  [17, 'Oversiden af skabe'],
  [18, 'Gardiner'],
  [19, 'Loftslamper'],
  [20, 'Vægge for pletter'],
  [21, 'Træk komfur ud og rengør bagved'],
  [22, 'Træk køleskab ud og rengør bagved'],
  [23, 'Vandlåse'],
  [24, 'Rengør radiatorer'],
  [26, 'Gennemgå rengøringsudstyr'],
  [27, 'Ovn'],
  [28, 'Emhættefilter'],
  [29, 'Køleskab indvendigt'],
  [30, 'Fryser og gamle madvarer'],
  [31, 'Vaskemaskine grundigt'],
  [32, 'Tørretumbler grundigt'],
  [33, 'Dørkarme'],
  [34, 'Paneler'],
  [35, 'Afløb i køkken'],
  [36, 'Afløb på badeværelser'],
  [37, 'Flyt lette møbler og rengør bagved'],
  [38, 'Rengør bag sofa'],
  [39, 'Robotstøvsuger grundigt'],
  [40, 'Vask dyner'],
  [41, 'Vask hovedpuder'],
  [42, 'Vend madrasser'],
  [43, 'Ventilationsventiler'],
  [44, 'Oversiden af skabe'],
  [45, 'Gardiner'],
  [46, 'Loftslamper'],
  [47, 'Vægge for pletter og rengør bagved'],
  [48, 'Træk køleskab ud og rengør bagved'],
  [49, 'Vandlåse'],
  [50, 'Rengør radiatorer'],
  [52, 'Gennemgå rengøringsudstyr']
]);

export const DEFAULT_TASKS = [
  ...WEEKLY_TASKS.map((name, index) => createTask({
    id: `UGE-${index + 1}`,
    category: 'Ugentlige opgaver',
    task: name,
    frequency: 'Ugentligt',
    count: 52,
    type: 'Fast ugentlig',
    note: 'Fast opgave hver uge'
  })),
  ...FORTNIGHTLY_TASKS.map((name, index) => createTask({
    id: `14D-${index + 1}`,
    category: '14-dages opgaver',
    task: name,
    frequency: 'Hver 14. dag',
    count: 26,
    type: '14-dage',
    note: 'Vises kun i ulige uger'
  })),
  ...[...EXTRA_TASKS_BY_WEEK].map(([week, name]) => createTask({
    id: `EXT-${week}`,
    category: 'Ekstra ugeopgave',
    task: name,
    frequency: 'Årligt',
    count: 1,
    type: 'Ekstra',
    note: `Ekstraopgave for uge ${week}`,
    week
  }))
];

function createTask({ id, category, task, frequency, count, type, note, week }) {
  const minutes = type === 'Ekstra' ? 30 : 15;
  const item = {
    ID: id,
    Kategori: category,
    Rum: 'Hele huset',
    Opgave: task,
    Frekvens: frequency,
    'Antal pr. år': count,
    Opgavetype: type,
    'Estimeret tid': minutes,
    Belastning: type === 'Fast ugentlig' ? 'Lav' : 'Mellem',
    Sæson: 'Hele året',
    'Kan udsættes': 'Ja',
    Aktiv: 'Ja',
    'Årlig tid': minutes * count,
    Noter: note
  };

  if (week) item.Uge = week;
  return item;
}
