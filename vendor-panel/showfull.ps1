$c = Get-Content 'C:\Users\MohmR\AppData\Local\Temp\fulltest.log'
foreach ($l in $c) {
  if ($l -match 'tests |pass |fail |cancelled') { Write-Host $l }
}
