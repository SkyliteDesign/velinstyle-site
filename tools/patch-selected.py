# -*- coding: utf-8 -*-
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("patch_playground", ROOT / "patch-playground.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

PANELS = ["demo-wc", "demo-icons"]
text = mod.INDEX.read_text(encoding="utf-8")
for name in PANELS:
    prev, code = mod.load_pair(name)
    text = mod.patch(text, name, prev, code)
    print("patched", name)
mod.INDEX.write_text(text, encoding="utf-8", newline="\n")
print("done")
