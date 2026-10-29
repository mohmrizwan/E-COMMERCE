$p = 'E:\Web Development Projects\Ecommerce-webiste\vendor-panel\src\Components\Header.jsx'
$c = [System.IO.File]::ReadAllText($p)
$c = $c.Replace('https://ui-avatars.com/api/?name=Vendor&background=6D28D9&color=fff', 'https://ui-avatars.com/api/?name=Vendor&background=173D35&color=D6B56D')
$c = $c.Replace('!border-[#EDE9FE]', '!border-[#D6B56D]')
$c = $c.Replace('hover:!bg-[#F3E8FF] hover:!text-[#6D28D9]', 'hover:!bg-[#F0F7F5] hover:!text-[#173D35]')
$c = $c.Replace('!text-[#6D28D9]', '!text-[#173D35]')
[System.IO.File]::WriteAllText($p, $c)
Write-Host 'done'
