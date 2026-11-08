$ErrorActionPreference = 'Stop'
$siteRoot = $PSScriptRoot
$listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if($listener){
  $owner=Get-CimInstance Win32_Process -Filter "ProcessId = $($listener[0].OwningProcess)"
  if($owner.CommandLine -like "*$siteRoot\serve.cjs*"){Stop-Process -Id $owner.ProcessId; Write-Host 'Site stopped.'}else{throw 'Port 3000 belongs to another program. Nothing was stopped.'}
}else{Write-Host 'Site is already stopped.'}
