# Fortsetzung dieser Codex-Sitzung im Verzeichnis des Skripts.
[CmdletBinding()]
param(
  [ValidateNotNullOrEmpty()]
  [string]$SessionId = '01a11f05-cceb-7ef3-bc0b-a834920c4c78'
)

$ErrorActionPreference = 'Stop'
if (-not (Get-Command codex -ErrorAction SilentlyContinue)) {
  throw 'Codex CLI wurde nicht im PATH gefunden. Bitte zuerst installieren.'
}

$resumePrompt = 'Dokumentiere alle Aktionen kurz in ACTIONS.md, einschliesslich ausgefuehrter Befehle, aufgerufener URLs und Ergebnisse. Lies zuerst AGENTS.md und ACTIONS.md.'
Push-Location -LiteralPath $PSScriptRoot
try {
  & codex resume $SessionId --cd $PSScriptRoot $resumePrompt
  $resumeExitCode = $LASTEXITCODE
} finally {
  Pop-Location
}
exit $resumeExitCode
