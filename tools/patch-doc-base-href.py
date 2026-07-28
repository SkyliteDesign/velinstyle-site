"""Fix <base href> so #anchors resolve to the current .html file, not the directory."""
from pathlib import Path

OLD = (
    "(function(){var p=location.pathname;if(/\\.html?$/i.test(p))p=p.replace(/[^\\/]+$/,\"\");"
    "else if(!/\\/$/.test(p))p+=\"/\";if(!p.startsWith(\"/\"))p=\"/\"+p;"
    "document.write('<base href=\"'+p+'\">');})();"
)
NEW = (
    "(function(){var p=location.pathname;if(!/\\/$/.test(p)&&!/\\.html?$/i.test(p))p+=\"/\";"
    "if(!p.startsWith(\"/\"))p=\"/\"+p;document.write('<base href=\"'+p+'\">');})();"
)

ROOT = Path(__file__).resolve().parents[1] / "docs"
changed = 0
for path in ROOT.rglob("*.html"):
    text = path.read_text(encoding="utf-8")
    if OLD not in text:
        continue
    path.write_text(text.replace(OLD, NEW, 1), encoding="utf-8")
    changed += 1
    print(path.relative_to(ROOT.parent))

print(f"Patched {changed} file(s)")
