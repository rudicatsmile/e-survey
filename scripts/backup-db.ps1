# Automated MySQL Backup Script for SurveiKepuasan
param (
    [string]$DbName = "esurvey",
    [string]$DbUser = "root",
    [string]$DbHost = "localhost",
    [string]$BackupDir = "./backups"
)

$dateStamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dumpFile = "$BackupDir/${DbName}_backup_$dateStamp.sql"

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

Write-Host "Memulai backup database MySQL '$DbName'..." -ForegroundColor Cyan

$mysqldump = "mysqldump"
if (Test-Path "C:\xampp\mysql\bin\mysqldump.exe") {
    $mysqldump = "C:\xampp\mysql\bin\mysqldump.exe"
}

& $mysqldump -h $DbHost -u $DbUser $DbName --result-file=$dumpFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup database berhasil disimpan ke: $dumpFile" -ForegroundColor Green
} else {
    Write-Host "Terjadi kegagalan saat menjalankan mysqldump. Exit code: $LASTEXITCODE" -ForegroundColor Red
}
