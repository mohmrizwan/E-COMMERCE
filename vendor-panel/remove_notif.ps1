$p = 'E:\Web Development Projects\Ecommerce-webiste\vendor-panel\src\Components\Header.jsx'
$lines = [System.IO.File]::ReadAllLines($p)
$start = -1; $end = -1
for ($i=0; $i -lt $lines.Count; $i++) {
  if ($lines[$i] -match 'Notification') { $start = $i - 1 }
  if ($start -ge 0 -and $lines[$i] -match 'CIcon icon=\{cilBell\}') { $end = $i + 2 }
}
if ($start -ge 0 -and $end -ge 0) {
  $new = $lines[0..($start-1)] + $lines[($end+1)..($lines.Count-1)]
  [System.IO.File]::WriteAllLines($p, $new)
  Write-Host "removed lines $start to $end"
} else {
  Write-Host "not found"
}
