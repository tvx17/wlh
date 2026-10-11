<#
.SYNOPSIS
Setzt die beim Erstellen festgelegte Codex-Sitzung dieses Projekts fort.
.EXAMPLE
.\resume-session.ps1
.EXAMPLE
.\resume-session.ps1 -PrintCommand
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$SessionId = '01a12b59-ab25-7dc0-9f00-2c670367c578',
    [switch]$PrintCommand
)

$ErrorActionPreference = 'Stop'
$projectDirectory = $PSScriptRoot

if ($PrintCommand) {
    $quotedDirectory = $projectDirectory.Replace("'", "''")
    $quotedSession = $SessionId.Replace("'", "''")
    Write-Output "codex resume '$quotedSession' --cd '$quotedDirectory'"
    return
}

$codexCommand = Get-Command codex -ErrorAction SilentlyContinue
if (-not $codexCommand) {
    throw 'Codex CLI wurde nicht im PATH gefunden. Voraussetzungen siehe AENDERUNGEN.md.'
}

Push-Location -LiteralPath $projectDirectory
try {
    & $codexCommand resume $SessionId --cd $projectDirectory
    if ($LASTEXITCODE -ne 0) {
        throw "Codex wurde mit Exitcode $LASTEXITCODE beendet. Die Sitzung muss im lokalen Codex-Verlauf vorhanden sein."
    }
}
finally {
    Pop-Location
}
