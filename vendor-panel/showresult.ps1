$c = Get-Content 'C:\Users\MohmR\AppData\Local\Temp\cust2.log'
foreach ($l in $c) {
  if ($l -match 'not ok|# pass|# fail|# tests') { Write-Host $l }
}
