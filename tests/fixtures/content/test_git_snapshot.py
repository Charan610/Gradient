import os
import subprocess
from pathlib import Path
from tempfile import TemporaryDirectory


with TemporaryDirectory(prefix="gradient-git-lesson-") as directory:
    root = Path(directory)
    repo = root / "repo"
    repo.mkdir()
    hooks = root / "empty-hooks"
    hooks.mkdir()
    env = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
    env.update(GIT_CONFIG_NOSYSTEM="1", GIT_CONFIG_GLOBAL=os.devnull, GIT_TEMPLATE_DIR=str(hooks))

    def git(*args):
        return subprocess.run(
            ["git", "-c", "user.name=Gradient Fixture", "-c", "user.email=fixture@example.test",
             "-c", "commit.gpgsign=false", "-c", f"core.hooksPath={hooks}", *args],
            cwd=repo, env=env, check=True, capture_output=True, text=True, timeout=5,
        ).stdout

    git("init", "-q")
    notes = repo / "notes.txt"
    notes.write_text("Draft\n", encoding="utf-8")
    git("add", "notes.txt")
    git("commit", "-qm", "Record draft")
    notes.write_text("Ready\n", encoding="utf-8")
    git("add", "notes.txt")
    notes.write_text("Ready for review\n", encoding="utf-8")
    assert "+Ready\n" in git("diff", "--cached", "--", "notes.txt")
    assert "+Ready for review\n" in git("diff", "--", "notes.txt")
    git("commit", "-qm", "Record ready note")
    assert git("show", "HEAD:notes.txt") == "Ready\n"
    assert notes.read_text(encoding="utf-8") == "Ready for review\n"
    assert git("status", "--short") == " M notes.txt\n"
