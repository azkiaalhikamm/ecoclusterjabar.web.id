# run_backend.ps1 — Jalankan FastAPI backend dengan memory limit
# Usage: .\run_backend.ps1

$backendDir = Join-Path $PSScriptRoot "backend"
Set-Location $backendDir

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BI Dashboard Backend - FastAPI Server" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] Menjalankan server di http://localhost:8000" -ForegroundColor Green
Write-Host "[INFO] Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Yellow
Write-Host ""

# Jalankan uvicorn dengan 1 worker saja untuk hemat RAM
# reload=False agar tidak ada proses watcher tambahan
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1 --no-access-log
