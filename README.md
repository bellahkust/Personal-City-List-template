# Bella's List

A personal city-guide website template for collecting favorite restaurants, drinks, and places to spend time alone. It is a static site: each owner publishes their own Google Sheet as CSV, and visitors open a place card in Google Maps.

## Make a copy

Choose **Use this template** on GitHub to create your own repository. Then update the personal configuration, images, and place lists below. Bella's profile, photos, illustrations, notes, ratings, and live Sheet links are sample personal content; they are not licensed for reuse. Replace them with your own before publishing. See [TEMPLATE-CONTENT.md](TEMPLATE-CONTENT.md).

## Personalize the site

Most personal settings are in [`data/site-config.mjs`](data/site-config.mjs):

- `site.title`, `site.home`, and `site.about` set the site name, homepage text/photo, introduction, slogan, and education heading.
- `site.education` is the ordered education timeline. Each entry can include a photo and alternative text; set `photo` to an empty string to omit it.
- `categories` contains the category keys, visible names, Sheet category values, and icons. Keep the keys `food`, `drinks`, and `alone` so existing routes continue to work.
- `cities` controls each city name, landing page, illustration, published Sheet CSV URL, local fallback CSV, and optional display-name overrides.

Replace the sample files under `assets/` with your own images, and update their paths and descriptions in the configuration. Keep the three category icon files or change the `icon` paths.

## Add places with Google Sheets

Create one worksheet per city. Include these columns in this order:

```text
category,title,area,rating,note,url
```

Use `Eat Well`, `Drink Well`, or `Stay Alone` in the `category` column. Put a number from 1 to 5 in `rating`; leave it blank for an unrated place. The website always displays five star positions. `url` should be the place's Google Maps link.

Publish each worksheet to the web as CSV and paste its URL into that city's `sheetCsv` field in `data/site-config.mjs`. A published Sheet is public. The site checks it first and uses that city's `fallbackCsv` when the online sheet is unavailable.

You can maintain the CSV fallback files (`data/places.csv`, `data/shenzhen.csv`, and `data/guangzhou.csv`) in a spreadsheet editor or text editor. CSV updates in the repository take effect when GitHub Pages redeploys; published Sheet updates appear on page reload after the Sheet publishes the changes.

## Preview locally

From the project folder, start a local static server, for example:

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/index.html`. Opening HTML files directly with `file://` blocks the dynamic category pages in many browsers.

## Publish with GitHub Pages

1. Push your copy to the `main` branch.
2. Open **Settings → Pages** in your repository.
3. Select **Deploy from a branch**, choose `main` and `/(root)`, then save.
4. Open the Pages URL shown in Settings → Pages after deployment completes.

This website does not include visitor accounts, a database, or an editing interface. Each owner updates their own sheet or repository.
