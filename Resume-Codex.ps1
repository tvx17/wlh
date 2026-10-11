<#
.SYNOPSIS
Nimmt die zu diesem Projekt gehoerende Codex-Sitzung wieder auf.
.EXAMPLE
.\Resume-Codex.ps1
.EXAMPLE
.\Resume-Codex.ps1 -PrintCommand
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$SessionId = '01a119bb-c107-7c32-9e30-ecc34681e46a',
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
    throw 'Codex CLI wurde nicht im PATH gefunden. Installation und Anmeldung siehe AENDERUNGEN.md.'
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
