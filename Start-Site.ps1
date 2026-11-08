$ErrorActionPreference = 'Stop'
$siteRoot = $PSScriptRoot
$siteUrl = 'http://127.0.0.1:3000/'
$bundledNode = 'C:\Users\homer\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$nodePath = if (Test-Path -LiteralPath $bundledNode) { $bundledNode } else { (Get-Command node -ErrorAction Stop).Source }
$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  $owner = Get-CimInstance Win32_Process -Filter "ProcessId = $($listener[0].OwningProcess)"
  if ($owner.CommandLine -notlike "*$siteRoot\serve.cjs*") { throw 'Port 3000 is used by another program. It has not been stopped.' }
} else {
  $serverFile = Join-Path $siteRoot 'serve.cjs'
  $server = Start-Process -FilePath $nodePath -ArgumentList @(('"' + $serverFile + '"')) -WorkingDirectory $siteRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $siteRoot 'server.log') -RedirectStandardError (Join-Path $siteRoot 'server-error.log') -PassThru
  $server.Id | Set-Content -LiteralPath (Join-Path $siteRoot 'server.pid')
}
$ready = $false
for ($attempt=0; $attempt -lt 20; $attempt++) {
  try { $response=Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 2; if($response.StatusCode -eq 200){$ready=$true;break} } catch {}
  Start-Sleep -Milliseconds 300
}
if(-not $ready){throw 'Site did not start. See server-error.log.'}
Write-Host "Site is running: $siteUrl"
Start-Process $siteUrl

