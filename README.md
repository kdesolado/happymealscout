# Happy Toy Scout

A responsive, interaction-rich rebuild inspired by [happytoyscout.com](https://happytoyscout.com/en). It includes a ZIP-code finder, toy filtering, an illustrative community map, collection cards, responsive navigation, and accessible interaction states.

## Run locally

No build step is required:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Cloudflare deployment

This project is configured for Cloudflare Workers Static Assets, which serves the site without invoking a Worker for normal asset requests.

```bash
npm install
npm run build
npm run deploy
```

The deploy command publishes the contents of `dist/` using `wrangler.jsonc`. Unknown routes fall back to `index.html`, so shared ZIP and toy-filter URLs continue to work.

## Project structure

- `index.html` — page structure and content
- `styles.css` — responsive visual system
- `script.js` — search, filtering, map controls, sharing, and feedback interactions
- `assets/` — visual assets used with attribution to the source site

## Notes

This is a front-end demonstration. The map and store counts are illustrative and do not represent live inventory. Brand names and trademarks belong to their respective owners.
