#!/usr/bin/env python3
"""
STRUCT // Hyperlocal Construction Marketplace
Local Runner Script

Usage:
    python run_local.py
"""

import os
import sys
import time
import signal
import subprocess
import webbrowser
import urllib.request
import urllib.error

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
FRONTEND_DIST = os.path.join(FRONTEND_DIR, "dist")
SERVER_URL = "http://localhost:5000"
HEALTH_URL = f"{SERVER_URL}/api/health"

def check_command(cmd, name):
    try:
        subprocess.run(
            [cmd, "--version"],
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=True,
        )
    except Exception:
        print(f"[ERROR] {name} is not installed or not in PATH.")
        sys.exit(1)

def ensure_frontend_build():
    if not os.path.exists(FRONTEND_DIST) or not os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
        print("[INFO] Frontend dist not found. Building frontend...")
        result = subprocess.run("npm run build", cwd=FRONTEND_DIR, shell=True)
        if result.returncode != 0:
            print("[ERROR] Failed to build frontend.")
            sys.exit(1)
        print("[OK] Frontend built successfully.")
    else:
        print("[OK] Production frontend assets detected in frontend/dist.")

def wait_for_server(timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(HEALTH_URL, timeout=2) as res:
                if res.status == 200:
                    return True
        except (urllib.error.URLError, ConnectionRefusedError, TimeoutError):
            pass
        time.sleep(0.5)
    return False

def main():
    print("=" * 60)
    print("  STRUCT // Hyperlocal Construction Marketplace (Chhattisgarh)")
    print("  Local Host Launcher")
    print("=" * 60)

    # 1. Environment check
    check_command("node", "Node.js")
    
    # 2. Build check
    ensure_frontend_build()

    # 3. Start backend server
    print(f"\n[STARTING] Launching backend server on {SERVER_URL}...")
    server_process = subprocess.Popen(
        "node src/server.js",
        cwd=BACKEND_DIR,
        shell=True,
    )

    def handle_exit(signum, frame):
        print("\n[STOPPING] Shutting down local server...")
        if sys.platform == "win32":
            subprocess.call(f"taskkill /F /T /PID {server_process.pid}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            server_process.terminate()
        sys.exit(0)

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    # 4. Wait for server to become responsive
    print("[WAITING] Connecting to database and warming up...")
    if wait_for_server(timeout=25):
        print("\n" + "=" * 60)
        print(f"  [SUCCESS] Application is LIVE at: {SERVER_URL}")
        print("  - Unified SPA & API running on port 5000")
        print("  - Demo Supplier Email: bhilai.steel@example.com")
        print("  - Demo Supplier Password: password123")
        print("  - Press Ctrl + C to stop the server")
        print("=" * 60 + "\n")

        # 5. Open in default browser
        try:
            webbrowser.open(SERVER_URL)
        except Exception:
            pass
    else:
        print(f"[WARN] Server did not respond within timeout, but process is running.")
        print(f"Check your browser at {SERVER_URL}")

    # 6. Keep alive
    try:
        server_process.wait()
    except KeyboardInterrupt:
        handle_exit(None, None)

if __name__ == "__main__":
    main()
