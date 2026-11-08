$ErrorActionPreference = 'Stop'
try {
  $nodePath='C:\Users\homer\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
  $ruleName='Mellow-Nail-LAN-3000'
  if(-not(Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue)){
    New-NetFirewallRule -Name $ruleName -DisplayName 'mellow nail LAN preview (TCP 3000)' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 -RemoteAddress LocalSubnet -Profile Private -Program $nodePath | Out-Null
  }
  'Phone access enabled for local subnet on Private networks.' | Set-Content (Join-Path $PSScriptRoot 'phone-access-result.txt')
} catch {
  $_.Exception.Message | Set-Content (Join-Path $PSScriptRoot 'phone-access-result.txt')
  throw
}
