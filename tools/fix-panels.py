# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "index.html"
t = p.read_text(encoding="utf-8")
tag = "di" + "v"


def stage_prefix() -> str:
    return (
        f'            <{tag} class="playground-stage">\n'
        f'              <{tag} class="playground-pane playground-pane--preview">\n'
        f'                <{tag} class="playground-pane__head"><span>Preview</span></{tag}>\n'
        f'                <{tag} class="playground-pane__body">\n'
        f"                  "
    )


old_b = f'<{tag} class="playground__panel active" role="tabpanel"                   <{tag} class="playground-demo">'
new_b = (
    f'<{tag} class="playground__panel active" role="tabpanel" id="demo-buttons" aria-labelledby="tab-buttons">\n'
    + stage_prefix()
    + f'<{tag} class="playground-demo">'
)

old_c = f'<{tag} class="playground__panel" role="tabpanel"                   <{tag} class="playground-demo">'
new_c = (
    f'<{tag} class="playground__panel" role="tabpanel" id="demo-cards" aria-labelledby="tab-cards" hidden>\n'
    + stage_prefix()
    + f'<{tag} class="playground-demo">'
)

if old_b not in t:
    raise SystemExit("buttons marker missing")
t = t.replace(old_b, new_b, 1)
if old_c not in t:
    raise SystemExit("cards marker missing")
t = t.replace(old_c, new_c, 1)
t = t.replace("...&lt;/motion&gt;&lt;/article&gt;", "...&lt;/div&gt;&lt;/article&gt;")

p.write_text(t, encoding="utf-8")
print("fixed wrappers")
