from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "docs"
SECTIONS = {
    "forms": "overview.html",
    "components": "accordion.html",
    "getting-started": "introduction.html",
    "customize": "overview.html",
    "layout": "breakpoints.html",
    "content": "reboot.html",
    "helpers": "clearfix.html",
    "utilities": "api.html",
    "animations": "overview.html",
    "extend": "approach.html",
    "about": "overview.html",
}

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Redirect…</title>
  <meta http-equiv="refresh" content="0;url={target}">
  <script>location.replace("{target}" + location.search + location.hash);</script>
</head>
<body>
  <p><a href="{target}">Continue to documentation</a></p>
</body>
</html>
"""

for section, target in SECTIONS.items():
    path = ROOT / section / "index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(TEMPLATE.format(target=target), encoding="utf-8")
    print("wrote", path)
