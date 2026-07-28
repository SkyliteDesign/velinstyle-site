#!/usr/bin/env python3
"""Rewrite entire branch: remove Co-authored-by: Cursor from every commit."""
import re
import subprocess

GIT = r"C:\Program Files\Git\bin\git.exe"
ROOT = r"D:\ideen\velinstyle-site"
TRAILER = re.compile(r"\n*Co-authored-by: Cursor <cursoragent@cursor\.com>\s*", re.I)


def run(*args: str) -> str:
    return subprocess.check_output([GIT, *args], cwd=ROOT, text=True).strip()


def clean_message(raw: str) -> str:
    return TRAILER.sub("\n", raw).strip() + "\n"


def main() -> None:
    commits = run("rev-list", "--reverse", "HEAD").splitlines()
    parent = ""
    for sha in commits:
        tree = run("cat-file", "-p", sha).splitlines()[0].split()[1]
        meta = run("log", "-1", "--format=%an%n%ae%n%at", sha).splitlines()
        author_name, author_email, author_date = meta[0], meta[1], meta[2]
        msg = run("log", "-1", "--format=%B", sha)
        msg = clean_message(msg)
        cmd = [GIT, "commit-tree", tree, "-m", msg]
        if parent:
            cmd.extend(["-p", parent])
        env = {
            "GIT_AUTHOR_NAME": author_name,
            "GIT_AUTHOR_EMAIL": author_email,
            "GIT_AUTHOR_DATE": f"{author_date} +0000",
            "GIT_COMMITTER_NAME": author_name,
            "GIT_COMMITTER_EMAIL": author_email,
            "GIT_COMMITTER_DATE": f"{author_date} +0000",
        }
        new_sha = subprocess.check_output(cmd, cwd=ROOT, env=env, text=True).strip()
        parent = new_sha
    subprocess.check_call([GIT, "reset", "--hard", parent], cwd=ROOT)
    for line in run("log", "--format=%h %s").splitlines():
        print(line)
    body = run("log", "-1", "--format=%B")
    if "cursoragent" in body.lower():
        raise SystemExit("co-author still present")


if __name__ == "__main__":
    main()
