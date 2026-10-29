const fs = require('fs');
const p = 'E:/Web Development Projects/Ecommerce-webiste/vendor-panel/src/Components/Header.jsx';
let c = fs.readFileSync(p, 'utf8');
// Remove notification block
c = c.replace(/          \/\* Notification \*\/\r?\n\r?\n          <CNavItem>\r?\n            <CNavLink[\s\S]*?<\/CNavLink>\r?\n          <\/CNavItem>\r?\n\r?\n/, '');
// Fix colors
c = c.replace('https://ui-avatars.com/api/?name=Vendor&background=6D28D9&color=fff', 'https://ui-avatars.com/api/?name=Vendor&background=173D35&color=D6B56D');
c = c.replace('!border-[#EDE9FE]', '!border-[#D6B56D]');
c = c.replace('hover:!bg-[#F3E8FF] hover:!text-[#6D28D9]', 'hover:!bg-[#F0F7F5] hover:!text-[#173D35]');
c = c.replace('!text-[#6D28D9]', '!text-[#173D35]');
fs.writeFileSync(p, c);
console.log('done');
