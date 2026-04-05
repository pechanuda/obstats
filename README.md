# KOBUL - výsledkový výcuc z ORISu

Jednoduchá Next.js aplikace nad ORIS API pro:

- listing závodů s publikovanými výsledky pro KOBUL
- výběr roku a měsíce
- zobrazení reportu pro KOBUL
- export reportu do PDF

## Co aplikace dělá

Aplikace načítá data přímo z ORIS API a pro KOBUL zobrazuje:

- vítěze v kategorii
- čas vítěze
- délku, počet kontrol a převýšení
- závodníky vybraného klubu
- pořadí, čas, ztrátu a procentuální ztrátu

V listingu jsou zobrazeny jen závody:

- se stavem `R`
- které nejsou `Dlouhodobé žebříčky`
- kde má KOBUL použitelné výsledky

## Lokální spuštění

```bash
npm install
npm run dev
```

Aplikace poběží na:

`http://127.0.0.1:3000`

## Produkční spuštění

```bash
npm run build
npm run start
```

Pro přihlášení je potřeba nastavit:

```bash
APP_PASSWORD=...
APP_SESSION_SECRET=...
```

## Nasazení na Vercel

Projekt je standardní Next.js aplikace a může být nasazen přímo z GitHubu na Vercel bez speciální konfigurace.

Na Vercelu je potřeba doplnit environment variables:

- `APP_PASSWORD`
- `APP_SESSION_SECRET`

## Poznámky

- aplikace nepoužívá databázi
- data se načítají přímo z ORIS API
- klub, sport i typ závodu jsou v aplikaci natvrdo nastavené na `KOBUL`, `OB` a `Všechny závody`
- PDF export používá samostatnou tiskovou route

## Zdroj dat

Data v aplikaci pocházejí z ORIS:

- ORIS: https://oris.ceskyorientak.cz/
- ORIS API: https://oris.ceskyorientak.cz/API?lang=cz
