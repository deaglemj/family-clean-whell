export const REQUIRED_FIELDS = [
  'ID', 'Kategori', 'Rum', 'Opgave', 'Frekvens', 'Antal pr. år', 'Opgavetype', 'Estimeret tid',
  'Belastning', 'Sæson', 'Kan udsættes', 'Aktiv', 'Årlig tid', 'Noter'
];

export const FREQUENCIES = [
  'Flere gange ugentligt',
  'Ugentligt',
  'Hver 14. dag',
  'Månedligt',
  'Kvartalsvist',
  'Halvårligt',
  'Årligt'
];

export const LIGHT_WEEKS = new Set([28, 29, 30, 31, 51, 52]);

export const SEASON_WEEKS = {
  'Forår': [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  'Sommer': [22, 23, 24, 25, 26, 27, 32, 33, 34, 35],
  'Efterår': [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  'Vinter': [1, 2, 3, 4, 5, 6, 7, 8, 9, 48, 49, 50],
  'Hele året': Array.from({ length: 52 }, (_, i) => i + 1)
};
