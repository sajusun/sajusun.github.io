const fs = require('fs');

const fontRules = `
@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:900;font-display:swap;src:url("assets/webfonts/fa-solid-900.woff2") format("woff2")}
@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:400;font-display:swap;src:url("assets/webfonts/fa-solid-900.woff2") format("woff2")}
@font-face{font-family:"Font Awesome 6 Brands";font-style:normal;font-weight:400;font-display:swap;src:url("assets/webfonts/fa-brands-400.woff2") format("woff2")}
.fa-solid,.fas{font-family:"Font Awesome 6 Free" !important;font-weight:900 !important}
.fa-brands,.fab{font-family:"Font Awesome 6 Brands" !important;font-weight:400 !important}
.fa-regular,.far{font-family:"Font Awesome 6 Free" !important;font-weight:400 !important}
`;

// Read fa-subset.min.css
let faContent = fs.readFileSync('fa-subset.min.css', 'utf8');

// Strip any existing font-face rules we added earlier
faContent = faContent.replace(/@font-face\{[^}]*fa-solid-900\.woff2[^}]*\}\s*/g, '');
faContent = faContent.replace(/@font-face\{[^}]*fa-regular-400\.woff2[^}]*\}\s*/g, '');
faContent = faContent.replace(/@font-face\{[^}]*fa-brands-400\.woff2[^}]*\}\s*/g, '');
faContent = faContent.replace(/\.fa-solid,\.fas\{font-family:[^}]*\}\s*/g, '');
faContent = faContent.replace(/\.fa-brands,\.fab\{font-family:[^}]*\}\s*/g, '');
faContent = faContent.replace(/\.fa-regular,\.far\{font-family:[^}]*\}\s*/g, '');

const missingIcons = fs.readFileSync('scripts/missing-icons.css', 'utf8');

const updatedFaContent = fontRules.trim() + '\n' + faContent.trim() + '\n' + missingIcons.trim();
fs.writeFileSync('fa-subset.min.css', updatedFaContent);
console.log('fa-subset.min.css successfully updated with all icons, correct font-weights, and @font-face');

// Now bundle styles.min.css
const tailwind = fs.readFileSync('tailwind.min.css', 'utf8');
const styles = fs.readFileSync('styles.css', 'utf8');
const combined = `${tailwind}\n${styles}\n${updatedFaContent}`;
fs.writeFileSync('styles.min.css', combined);
console.log('styles.min.css re-bundled with complete Tailwind + Styles + FontAwesome. Size:', (Buffer.byteLength(combined) / 1024).toFixed(2), 'KB');
