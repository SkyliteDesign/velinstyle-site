#!/usr/bin/env python3
"""Deprecated: use sync-sidebar.py instead."""
import subprocess
import sys

if __name__ == "__main__":
    subprocess.check_call([sys.executable, str(__file__).replace("patch-pinned-guides", "sync-sidebar")])
