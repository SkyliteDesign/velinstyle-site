# Sitemaps (generated)

Run `npm run generate:sitemaps` or `python tools/generate-sitemaps.py` from the site repo root.

**SEO:** urlset contains **HTML pages only** (no `.md` — those 404 on nginx). Upload to the webroot:

- `sitemap.xml`
- `robots.txt`
- optional: entire `sitemaps/` folder for mirror TLDs

| Domain | Google Search Console — Sitemap-URL |
| --- | --- |
| velinstyle.info | `https://velinstyle.info/sitemap.xml` (250 URLs) |
| velinstyle.de | `https://velinstyle.de/sitemaps/velinstyle.de.xml` (after deploy) |
| velinstyle.eu | `https://velinstyle.eu/sitemaps/velinstyle.eu.xml` |
| velinstyle.org | `https://velinstyle.org/sitemaps/velinstyle.org.xml` |
| velinstyle.store | `https://velinstyle.store/sitemaps/velinstyle.store.xml` |

### Google Search Console (velinstyle.info)

1. Property must be **URL prefix** `https://velinstyle.info` (not `http://`, not `www` unless that host exists).
2. Submit **only** `https://velinstyle.info/sitemap.xml` (181 HTML URLs).
3. Do **not** submit `sitemap-index.xml` unless the whole `sitemaps/` folder is on the server (FTP).
4. After FTP upload, run `python tools/validate-sitemap.py --live`.
5. In GSC: remove old failed sitemap entries, wait 24h, re-submit.

Optional nginx MIME types: see `deploy/nginx-sitemap.conf`.
