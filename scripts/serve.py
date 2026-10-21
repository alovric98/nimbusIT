#!/usr/bin/env python3
"""Local QA only: static files plus Cloudflare-style headers and redirects."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import argparse, fnmatch

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=8000)
args = parser.parse_args()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = urlsplit(self.path).path
        for line in (ROOT / "_redirects").read_text().splitlines():
            if line.strip():
                source, target, status = line.split()
                if path == source:
                    self.send_response(int(status))
                    self.send_header("Location", target)
                    self.end_headers()
                    return
        super().do_GET()

    def end_headers(self):
        pattern = None
        for line in (ROOT / "_headers").read_text().splitlines():
            if not line.strip():
                continue
            if not line.startswith(" "):
                pattern = line.strip()
            elif pattern and fnmatch.fnmatch(urlsplit(self.path).path, pattern):
                name, value = line.strip().split(":", 1)
                self.send_header(name, value.strip())
        super().end_headers()

    def log_message(self, *args):
        pass


print(f"Local static QA: http://127.0.0.1:{args.port}", flush=True)
ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()
