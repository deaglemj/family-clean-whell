# Husets Årshjul

Statisk webapp til GitHub Pages.

## Filer

- `index.html`
- `styles.css`
- `app.js`
- `tasks.json`

## Lokal brug

Åbn `index.html` i en moderne browser.

Hvis browseren blokerer automatisk indlæsning af `tasks.json`, vælg filen manuelt via **Indlæs tasks.json**.

## GitHub Pages

1. Opret et GitHub repository.
2. Upload filerne til roden af repository.
3. Gå til **Settings → Pages**.
4. Vælg branch `main` og folder `/root`.
5. Åbn den viste GitHub Pages URL.

## Dataformat

Datafilen skal hedde `tasks.json` og være en JSON-liste med felterne:

`ID`, `Kategori`, `Rum`, `Opgave`, `Frekvens`, `Antal pr. år`, `Opgavetype`, `Estimeret tid`, `Belastning`, `Sæson`, `Kan udsættes`, `Aktiv`, `Årlig tid`, `Noter`.
