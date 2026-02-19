# Local Web Server (Windows)

Serve this site locally using Python (already installed on your machine).

## Quick Start (VS Code)

1. Open this folder in VS Code.
2. Open Terminal: View → Terminal.
3. Run:
   ```powershell
   python -m http.server 8000
   ```
4. Visit http://localhost:8000 in your browser.

## One-Click (PowerShell script)

- Double-click `start-server.ps1` in Explorer, or run from Terminal:
  ```powershell
  ./start-server.ps1
  ```
  This opens your browser and serves from this folder on port 8000.

## Via VS Code Task

1. Press Ctrl+Shift+P → "Tasks: Run Task".
2. Choose "Serve: Python http.server (8000)".
3. Open http://localhost:8000.

## Notes

- Default file: the server will auto-serve [index.html](index.html) when you open the root URL.
- Stop the server anytime with Ctrl+C in the terminal where it is running.
- Change port by passing `-Port` to the script, e.g. `./start-server.ps1 -Port 8080` (then browse to http://localhost:8080).