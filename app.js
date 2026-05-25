/* MedTrace v1.8 DEMO */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
return new (P || (P = Promise))(function (resolve, reject) {
function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
step((generator = generator.apply(thisArg, _arguments || [])).next());
});
};
var __rest = (this && this.__rest) || function (s, e) {
var t = {};
for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
t[p] = s[p];
if (s != null && typeof Object.getOwnPropertySymbols === "function")
for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
t[p[i]] = s[p[i]];
}
return t;
};
/* ═══ CONSTANTS ═══════════════════════════════════════════════ */
const STATUS_COLOR = { "operativo": "#22c55e", "in manutenzione": "#f59e0b", "fuori servizio": "#ef4444", "aperto": "#2DD4BF", "in corso": "#f59e0b", "chiuso": "#22c55e", "in attesa": "#94a3b8", "confermato": "#2DD4BF", "spedito": "#a855f7", "ricevuto": "#22c55e", "annullato": "#ef4444", "emessa": "#2DD4BF", "pagata": "#22c55e", "scaduta": "#ef4444", "bozza": "#94a3b8" };
const PRI_COLOR = { "urgente": "#ef4444", "alta": "#f97316", "normale": "#6366f1", "bassa": "#94a3b8" };
const TIMELINE_ICON = { "diagnosi": "", "intervento": "", "ordine_parti": "", "attesa_parti": "·", "test": "✓", "sopralluogo": "·", "contatto": "", "nota": "·" };
const TIMELINE_LABEL = { "diagnosi": "Diagnosi", "intervento": "Intervento", "ordine_parti": "Ordine parti", "attesa_parti": "Attesa parti", "test": "Test/Verifica", "sopralluogo": "Sopralluogo", "contatto": "Contatto cliente", "nota": "Nota generica" };
const STORAGE_KEY = "medtrace-demo-v1";
const DEMO_MODE = true;
const DEMO_LIMITS = { assets: 3, jobs: 5, customers: 3, parts: 10, instruments: 2, procedures: 2 };
const IVA_DEFAULT = 22;
/* ═══ PERSISTENCE ═════════════════════════════════════════════ */
function loadData() { try {
const r = localStorage.getItem(STORAGE_KEY);
return r ? JSON.parse(r) : null;
}
catch (_a) {
return null;
} }
function saveData(d) {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
return true;
}
catch (e) {
if (e.name === "QuotaExceededError") {
alert("⚠ Memoria piena! Esporta un backup e cancella alcune foto pesanti.");
}
return false;
}
}
/* ═══ HOOKS ═══════════════════════════════════════════════════ */
function useMedia(q) {
const [m, setM] = React.useState(() => window.matchMedia(q).matches);
React.useEffect(() => {
const mq = window.matchMedia(q);
const h = e => setM(e.matches);
mq.addEventListener("change", h);
return () => mq.removeEventListener("change", h);
}, [q]);
return m;
}
/* ═══ IMAGE COMPRESSION ═══════════════════════════════════════ */
function compressImage(file, maxWidth = 1024, quality = 0.7) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = e => {
const img = new Image();
img.onload = () => {
const canvas = document.createElement("canvas");
let w = img.width, h = img.height;
if (w > maxWidth) {
h = h * (maxWidth / w);
w = maxWidth;
}
canvas.width = w;
canvas.height = h;
const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, w, h);
resolve(canvas.toDataURL("image/jpeg", quality));
};
img.onerror = reject;
img.src = e.target.result;
};
reader.onerror = reject;
reader.readAsDataURL(file);
});
}
/* ═══ ATTACHMENT HELPERS (Base64 in localStorage) ═══════════════════════════ */
function fileToAttachment(file) {
return __awaiter(this, void 0, void 0, function* () {
// Read file as Data URL
const dataUrl = yield new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = () => resolve(reader.result);
reader.onerror = reject;
reader.readAsDataURL(file);
});
// If image, compress (max 1200x1200, jpeg quality 0.8) to save space
let finalDataUrl = dataUrl;
if (file.type.startsWith('image/') && file.type !== 'image/gif') {
try {
finalDataUrl = yield compressImage(dataUrl, 1200, 0.8);
}
catch (e) {
finalDataUrl = dataUrl;
}
}
return {
id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
name: file.name,
type: file.type,
size: file.size,
finalSize: Math.round(finalDataUrl.length * 0.75), // base64 to bytes estimate
dataUrl: finalDataUrl,
uploadedAt: new Date().toISOString(),
};
});
}
function downloadAttachment(attachment) {
const a = document.createElement('a');
a.href = attachment.dataUrl;
a.download = attachment.name;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
}
function getStorageUsage() {
let total = 0;
for (let key in localStorage) {
if (localStorage.hasOwnProperty(key)) {
total += (localStorage[key].length + key.length) * 2; // UTF-16 = 2 bytes/char
}
}
return { bytes: total, mb: (total / 1024 / 1024).toFixed(2) };
}
function formatBytes(bytes) {
if (bytes < 1024)
return bytes + ' B';
if (bytes < 1024 * 1024)
return (bytes / 1024).toFixed(1) + ' KB';
return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}
/* ═══ EXPORTS ═════════════════════════════════════════════════ */
function buildCSV(rows, cols) {
var keys = cols.map(function (c) { return typeof c === "string" ? c : c.key; });
var hdrs = cols.map(function (c) { return typeof c === "string" ? c : (c.label || c.key); });
function esc(v) {
var s = (v === null || v === undefined) ? "" : v;
if (Array.isArray(s))
s = s.join(", ");
if (typeof s === "object")
s = JSON.stringify(s);
s = String(s).split('"').join('""');
return '"' + s + '"';
}
var lines = [hdrs.map(esc).join(";")].concat(rows.map(function (r) {
return keys.map(function (k) { return esc(r[k]); }).join(";");
}));
return lines.join("\r\n");
}
function downloadXLSX(filename, rows, cols) {
// Generate REAL Excel-compatible CSV with BOM (so Excel opens it correctly with UTF-8)
// Excel opens .csv with semicolons in Italian locale, but commas in EN locale
// Best approach: use TSV-like CSV with semicolons + BOM for UTF-8
const escapeCSV = (val) => {
if (val === null || val === undefined)
return "";
const s = String(val).replace(/"/g, '""');
if (s.includes(';') || s.includes('"') || s.includes('\n') || s.includes(',')) {
return '"' + s + '"';
}
return s;
};
// Build CSV with semicolons (Excel Italian default)
const headers = cols.map(c => escapeCSV(c.label || c.key)).join(';');
const dataRows = rows.map(row => cols.map(c => {
const v = typeof c.value === 'function' ? c.value(row) : row[c.key];
return escapeCSV(v);
}).join(';'));
const csvContent = '\ufeff' + headers + '\n' + dataRows.join('\n'); // BOM for UTF-8
// Trigger direct download
try {
const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename.replace(/\.json$/, '.csv').replace(/\.csv$/, '') + '.csv';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(() => URL.revokeObjectURL(url), 5000);
}
catch (e) {
// Fallback to modal (artifact context)
window.dispatchEvent(new CustomEvent("show-csv", { detail: { filename: filename, data: csvContent } }));
}
}
// Also add Excel XLSX export using SheetJS (loaded on demand from CDN)
function downloadXLSX(filename, rows, cols) {
return __awaiter(this, void 0, void 0, function* () {
if (typeof DEMO_MODE !== "undefined" && DEMO_MODE) {
alert("⚡ DEMO — Export Excel disponibile nella versione completa.");
return;
}
const ensureScript = (src) => new Promise((resolve, reject) => {
if (document.querySelector(`script[src="${src}"]`)) {
resolve();
return;
}
const s = document.createElement('script');
s.src = src;
s.onload = resolve;
s.onerror = reject;
document.head.appendChild(s);
});
try {
yield ensureScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
if (!window.XLSX)
throw new Error('XLSX not loaded');
// Prepare data as array of arrays
const headers = cols.map(c => c.label || c.key);
const data = [headers];
rows.forEach(row => {
data.push(cols.map(c => {
const v = typeof c.value === 'function' ? c.value(row) : row[c.key];
return v !== null && v !== void 0 ? v : '';
}));
});
const ws = window.XLSX.utils.aoa_to_sheet(data);
// Auto-size columns
const colWidths = cols.map((c, i) => {
let maxLen = (c.label || c.key).length;
rows.forEach(row => {
const v = typeof c.value === 'function' ? c.value(row) : row[c.key];
const l = String(v !== null && v !== void 0 ? v : '').length;
if (l > maxLen)
maxLen = l;
});
return { wch: Math.min(maxLen + 2, 50) };
});
ws['!cols'] = colWidths;
// Style header row (bold)
headers.forEach((_, i) => {
const cellRef = window.XLSX.utils.encode_cell({ r: 0, c: i });
if (ws[cellRef]) {
ws[cellRef].s = { font: { bold: true } };
}
});
const wb = window.XLSX.utils.book_new();
window.XLSX.utils.book_append_sheet(wb, ws, 'Dati');
const xlsxFilename = filename.replace(/\.(csv|json)$/, '') + '.xlsx';
window.XLSX.writeFile(wb, xlsxFilename);
return true;
}
catch (e) {
console.error('XLSX export failed:', e);
// Fallback to CSV
downloadCSV(filename, rows, cols);
return false;
}
});
}
function downloadJSON(filename, data) {
// Add backup metadata
var backup = Object.assign({ _meta: {
app: "MedTrace",
version: "1.0",
exportedAt: new Date().toISOString(),
stats: {
assets: (data.assets || []).length,
jobs: (data.jobs || []).length,
parts: (data.parts || []).length,
customers: (data.customers || []).length,
iecReports: (data.iecReports || []).length,
funcReports: (data.funcReports || []).length,
invoices: (data.invoices || []).length,
orders: (data.orders || []).length,
instruments: (data.instruments || []).length,
procedures: (data.procedures || []).length,
quotes: (data.quotes || []).length,
}
} }, data);
var jsonData = JSON.stringify(backup, null, 2);
// Try direct download first (works on most browsers)
try {
var blob = new Blob([jsonData], { type: "application/json;charset=utf-8" });
var url = URL.createObjectURL(blob);
var a = document.createElement("a");
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
return true;
}
catch (e) {
// Fallback: show in modal for manual copy (artifact context)
window.dispatchEvent(new CustomEvent("show-csv", {
detail: { filename: filename, data: jsonData, isJson: true }
}));
return false;
}
}
/* ═══ PDF GENERATION ══════════════════════════════════════════ */
/* ═══ PDF VIA PRINT (no external libs) ═══════════════════════ */
// PDF display via custom event (window.open blocked in artifact)
function openPrintWindow(htmlContent) {
// Most reliable cross-platform approach: inject into a full-screen overlay
// and use window.print() which works on iOS Safari, Android Chrome, and Desktop
window.dispatchEvent(new CustomEvent('show-pdf', { detail: htmlContent }));
}
const PDF_STYLE = `
@page { size: A4; margin: 15mm 15mm 15mm 15mm; }
@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a202c; background: #fff; }
.header { background: #2DD4BF; color: #fff; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-radius: 4px; }
.header-left { flex: 1; min-width: 0; }
.logo-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.header h1 { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-logo { height: 28px !important; width: 36px !important; max-height: 28px !important; max-width: 36px !important; object-fit: contain; display: block; flex-shrink: 0; }
.header .sub { font-size: 9.5px; opacity: .85; line-height: 1.4; margin-top: 2px; }
.header .right { text-align: right; }
.header .docnum { font-size: 18px; font-weight: 800; }
.section { margin-bottom: 16px; }
.section-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 6px; }
.kv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; }
.kv { display: flex; gap: 6px; padding: 3px 0; border-bottom: 1px solid #f1f5f9; }
.kv-label { color: #94a3b8; min-width: 110px; font-size: 10px; }
.kv-value { font-weight: 600; font-size: 11px; }
table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11px; }
th { background: #f8fafc; color: #64748b; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; padding: 6px 8px; text-align: left; border-bottom: 2px solid #e2e8f0; }
td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
.total-box { background: #0D9488; color: #fff; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; margin-top: 8px; }
.total-box .label { font-size: 11px; font-weight: 700; }
.total-box .amount { font-size: 18px; font-weight: 900; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .3px; }
.pass { color: #0D9488; background: #CCFBF1; }
.fail { color: #dc2626; background: #fee2e2; }
.nd { color: #6b7280; background: #f3f4f6; }
.footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }
.desc-box { background: #f8fafc; border-left: 3px solid #2563eb; padding: 8px 12px; margin: 8px 0; font-size: 11px; line-height: 1.5; color: #374151; }
.vis-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #f1f5f9; font-size: 11px; }
`;
function generateJobPDF(job, assets, parts, customers, company) {
const asset = assets.find(a => a.id === job.assetId) || {};
const customer = customers.find(c => c.id === (job.customerId || asset.customerId)) || {};
const partsTotal = job.parts.reduce((s, p) => {
const pt = parts.find(x => x.id === p.partId);
return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0);
}, 0);
const laborTotal = job.laborHours * job.laborRate;
const total = partsTotal + laborTotal;
const PRI = { urgente: '#dc2626', alta: '#ea580c', normale: '#7c3aed', bassa: '#6b7280' };
const STA = { aperto: '#2563eb', 'in corso': '#d97706', chiuso: '#059669', 'fuori servizio': '#dc2626' };
const partsRows = job.parts.map(p => {
const pt = parts.find(x => x.id === p.partId) || {};
const price = pt.sellPrice || pt.unitPrice || 0;
return `<tr>
<td style="font-family:monospace;font-size:10px">${pt.code || p.partId}</td>
<td>${pt.name || '—'}</td>
<td style="text-align:right">${p.qty}</td>
<td style="text-align:right">€${price.toFixed(2)}</td>
<td style="text-align:right;font-weight:700">€${(price * p.qty).toFixed(2)}</td>
</tr>`;
}).join('');
const tlRows = (job.timeline || []).map(t => `
<tr>
<td>${t.date}</td>
<td>${t.type}</td>
<td>${t.note || '—'}</td>
<td style="text-align:right">${t.hours ? t.hours + 'h' : '—'}</td>
</tr>`).join('');
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Rapporto ${job.id}</title>
<style>${PDF_STYLE}</style></head><body>
<div class="header">
<div><img src=\"data:image/svg+xml,%3Csvg viewBox='0 0 50 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M8 20 Q12 12 16 20 Q20 28 24 20'/%3E%3Cpath d='M4 20 Q10 8 16 20 Q22 32 28 20'/%3E%3Cpath d='M0 20 Q8 4 16 20 Q24 36 32 20'/%3E%3Ccircle cx='38' cy='20' r='4' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E\" class=\"header-logo\" width=\"36\" height=\"28\" alt=\"MedTrace\"/><h1>${company.name || 'MedTrace SRL'}</h1><div class="sub">${company.subtitle || ''}</div></div>
<div class="right">
<div style="font-size:9px;opacity:.7;margin-bottom:4px">RAPPORTO DI INTERVENTO</div>
<div class="docnum">${job.id}</div>
<div style="font-size:10px;margin-top:4px">
<span class="badge" style="background:${PRI[job.priority] || '#6b7280'}22;color:${PRI[job.priority] || '#6b7280'};border:1px solid ${PRI[job.priority] || '#6b7280'}44">${job.priority.toUpperCase()}</span>
&nbsp;<span class="badge" style="background:${STA[job.status] || '#6b7280'}22;color:${STA[job.status] || '#6b7280'};border:1px solid ${STA[job.status] || '#6b7280'}44">${job.status.toUpperCase()}</span>
</div>
</div>
</div>
${customer.name ? `<div class="section">
<div class="section-title">Cliente</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Ragione sociale</span><span class="kv-value">${customer.name}</span></div>
${customer.vat ? `<div class="kv"><span class="kv-label">P.IVA</span><span class="kv-value">${customer.vat}</span></div>` : ''}
${customer.address ? `<div class="kv"><span class="kv-label">Indirizzo</span><span class="kv-value">${customer.address}</span></div>` : ''}
</div>
</div>` : ''}
<div class="section">
<div class="section-title">Apparecchio</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Nome</span><span class="kv-value">${asset.name || job.assetId}</span></div>
<div class="kv"><span class="kv-label">Marca / Modello</span><span class="kv-value">${asset.brand || ''} ${asset.model || ''}</span></div>
<div class="kv"><span class="kv-label">N° Serie</span><span class="kv-value" style="font-family:monospace">${asset.serial || '—'}</span></div>
<div class="kv"><span class="kv-label">Ubicazione</span><span class="kv-value">${asset.location || '—'}</span></div>
</div>
</div>
<div class="section">
<div class="section-title">Dettagli Intervento</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Tipo</span><span class="kv-value" style="text-transform:capitalize">${job.type}</span></div>
<div class="kv"><span class="kv-label">Tecnico</span><span class="kv-value">${job.assignee || '—'}</span></div>
<div class="kv"><span class="kv-label">Data apertura</span><span class="kv-value">${job.openDate}</span></div>
<div class="kv"><span class="kv-label">Data chiusura</span><span class="kv-value">${job.closeDate || '—'}</span></div>
</div>
${job.description ? `<div class="desc-box" style="margin-top:8px">${job.description}</div>` : ''}
${job.notes ? `<div style="margin-top:6px;font-size:10px;color:#64748b"><strong>Note:</strong> ${job.notes}</div>` : ''}
</div>
<div class="section">
<div class="section-title">Parti Utilizzate</div>
<table>
<thead><tr><th>Codice</th><th>Parte</th><th style="text-align:right">Qtà</th><th style="text-align:right">P. Unit.</th><th style="text-align:right">Totale</th></tr></thead>
<tbody>${partsRows || '<tr><td colspan="5" style="text-align:center;color:#94a3b8">Nessuna parte utilizzata</td></tr>'}</tbody>
</table>
</div>
${tlRows ? `<div class="section">
<div class="section-title">Cronologia Intervento</div>
<table>
<thead><tr><th>Data</th><th>Tipo</th><th>Descrizione</th><th style="text-align:right">Ore</th></tr></thead>
<tbody>${tlRows}</tbody>
</table>
</div>` : ''}
<div style="display:flex;justify-content:flex-end;flex-direction:column;align-items:flex-end;gap:4px;margin-top:4px">
<div style="display:flex;justify-content:space-between;width:260px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">Parti</span><span style="font-weight:700">€${partsTotal.toFixed(2)}</span></div>
<div style="display:flex;justify-content:space-between;width:260px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">Manodopera (${job.laborHours}h × €${job.laborRate}/h)</span><span style="font-weight:700">€${laborTotal.toFixed(2)}</span></div>
<div class="total-box" style="width:260px"><span class="label">TOTALE INTERVENTO</span><span class="amount">€${total.toFixed(2)}</span></div>
</div>
<div style="margin-top:32px;display:flex">
<div style="width:200px;border-top:1px solid #94a3b8;padding-top:6px;text-align:center;font-size:10px;color:#64748b">Firma Tecnico Verificatore<br><br>${job.assignee || ''}</div>
</div>
<div class="footer">
<span>${company.name || 'MedTrace SRL'} — Generato il ${new Date().toLocaleDateString('it-IT')}</span>
<span>${job.id} · ${asset.serial || ''}</span>
</div>
</body></html>`;
openPrintWindow(html);
}
function generateInvoicePDF(invoice, customer, jobs, assets, parts, company) {
const subtotal = invoice.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
const totalVAT = invoice.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0);
const grandTotal = subtotal + totalVAT;
const STA = { bozza: '#6b7280', emessa: '#2563eb', pagata: '#059669', scaduta: '#dc2626', annullato: '#dc2626' };
const itemRows = invoice.items.map(it => `<tr>
<td>${it.description}</td>
<td style="text-align:right">${it.qty}</td>
<td style="text-align:right">€${it.unitPrice.toFixed(2)}</td>
<td style="text-align:right">${it.vat}%</td>
<td style="text-align:right;font-weight:700">€${(it.qty * it.unitPrice).toFixed(2)}</td>
</tr>`).join('');
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Fattura ${invoice.number}</title>
<style>${PDF_STYLE}</style></head><body>
<div class="header">
<div>
<img src=\"data:image/svg+xml,%3Csvg viewBox='0 0 50 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M8 20 Q12 12 16 20 Q20 28 24 20'/%3E%3Cpath d='M4 20 Q10 8 16 20 Q22 32 28 20'/%3E%3Cpath d='M0 20 Q8 4 16 20 Q24 36 32 20'/%3E%3Ccircle cx='38' cy='20' r='4' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E\" class=\"header-logo\" width=\"36\" height=\"28\" alt=\"MedTrace\"/><h1>${company.name || 'MedTrace SRL'}</h1>
<div class="sub">${company.address || ''}</div>
${company.vat ? `<div class="sub">P.IVA: ${company.vat}</div>` : ''}
</div>
<div class="right">
<div style="font-size:9px;opacity:.7;margin-bottom:4px">FATTURA</div>
<div class="docnum">${invoice.number}</div>
<div style="font-size:10px;margin-top:4px">
<span class="badge" style="background:${STA[invoice.status] || '#6b7280'}22;color:${STA[invoice.status] || '#6b7280'};border:1px solid ${STA[invoice.status] || '#6b7280'}44">${invoice.status.toUpperCase()}</span>
</div>
<div style="font-size:10px;margin-top:4px;opacity:.8">Data: ${invoice.date}${invoice.dueDate ? ' · Scad: ' + invoice.dueDate : ''}</div>
</div>
</div>
<div class="section">
<div class="section-title">Cliente</div>
<div style="font-size:14px;font-weight:700;margin-bottom:4px">${(customer === null || customer === void 0 ? void 0 : customer.name) || '—'}</div>
${(customer === null || customer === void 0 ? void 0 : customer.address) ? `<div style="font-size:11px;color:#64748b">${customer.address}</div>` : ''}
${(customer === null || customer === void 0 ? void 0 : customer.vat) ? `<div style="font-size:11px;color:#64748b">P.IVA: ${customer.vat}</div>` : ''}
${(customer === null || customer === void 0 ? void 0 : customer.fiscalCode) ? `<div style="font-size:11px;color:#64748b">C.F.: ${customer.fiscalCode}</div>` : ''}
</div>
<div class="section">
<div class="section-title">Voci Fattura</div>
<table>
<thead><tr><th>Descrizione</th><th style="text-align:right">Q.tà</th><th style="text-align:right">Prezzo Unit.</th><th style="text-align:right">IVA</th><th style="text-align:right">Importo</th></tr></thead>
<tbody>${itemRows}</tbody>
</table>
</div>
<div style="display:flex;justify-content:flex-end;flex-direction:column;align-items:flex-end;gap:4px">
<div style="display:flex;justify-content:space-between;width:280px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">Imponibile</span><span style="font-weight:700">€${subtotal.toFixed(2)}</span></div>
<div style="display:flex;justify-content:space-between;width:280px;padding:4px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">IVA</span><span style="font-weight:700">€${totalVAT.toFixed(2)}</span></div>
<div class="total-box" style="width:280px"><span class="label">TOTALE FATTURA</span><span class="amount">€${grandTotal.toFixed(2)}</span></div>
</div>
${invoice.paymentTerms ? `<div style="margin-top:16px;padding:10px;background:#f8fafc;border-radius:4px;font-size:10px"><strong>Modalità di pagamento:</strong> ${invoice.paymentTerms}${company.iban ? '<br><strong>IBAN:</strong> ' + company.iban : ''}</div>` : ''}
${invoice.notes ? `<div style="margin-top:8px;font-size:10px;color:#64748b"><strong>Note:</strong> ${invoice.notes}</div>` : ''}
<div class="footer">
<span>${company.name || 'MedTrace SRL'} — Generato il ${new Date().toLocaleDateString('it-IT')}</span>
<span>${invoice.number}</span>
</div>
</body></html>`;
openPrintWindow(html);
}
function generateIECPDF(rep, asset, customer, company) {
const normL = rep.norm === '61010' ? 'IEC 61010-1 — Strumentazione Lab.' : 'IEC 62353 — Elettromedicale';
const ptLabel = rep.norm !== '61010' ? (' · Tipo ' + (rep.patientType || 'BF')) : '';
const vi = rep.visual || {};
const visItems = [
['Involucro integro', vi.housing],
['Cavo di rete e spina integri', vi.cable],
['Connettori in buono stato', vi.connectors],
['Etichette e marcatura CE leggibili', vi.labels],
['Documentazione tecnica presente', vi.docs],
];
const visRows = visItems.map(([label, val]) => `
<div class="vis-row">
<span>${label}</span>
<span class="badge ${val === true ? 'pass' : val === false ? 'fail' : 'nd'}">${val === true ? '✓ OK' : val === false ? '✗ NO' : 'N/D'}</span>
</div>`).join('');
const measRows = (rep.measures || []).map(m => {
const v = parseFloat(m.value);
const lv = parseFloat(m.limitVal);
const measured = m.value !== '' && m.value !== undefined && !isNaN(v);
const pass = measured ? (m.invertPass ? v >= lv : v <= lv) : null;
return `<tr>
<td>${m.name}</td>
<td style="text-align:center;font-family:monospace">${m.limit}</td>
<td style="text-align:center;font-family:monospace;font-weight:700">${measured ? m.value : '—'}</td>
<td style="text-align:center">${m.unit}</td>
<td style="text-align:center"><span class="badge ${pass === null ? 'nd' : pass ? 'pass' : 'fail'}">${pass === null ? 'N/D' : pass ? '✓ PASS' : '✗ FAIL'}</span></td>
</tr>`;
}).join('');
const esitoColor = rep.overallPass ? '#059669' : '#dc2626';
const esitoLabel = rep.overallPass ? 'CONFORME' : 'NON CONFORME';
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Verifica ${rep.reportNumber || rep.id}</title>
<style>${PDF_STYLE}</style></head><body>
<div class="header">
<div>
<img src=\"data:image/svg+xml,%3Csvg viewBox='0 0 50 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M8 20 Q12 12 16 20 Q20 28 24 20'/%3E%3Cpath d='M4 20 Q10 8 16 20 Q22 32 28 20'/%3E%3Cpath d='M0 20 Q8 4 16 20 Q24 36 32 20'/%3E%3Ccircle cx='38' cy='20' r='4' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E\" class=\"header-logo\" width=\"36\" height=\"28\" alt=\"MedTrace\"/><h1>${company.name || 'MedTrace SRL'}</h1>
<div class="sub">Rapporto di Verifica Sicurezza Elettrica</div>
<div class="sub">${normL}${ptLabel}</div>
</div>
<div class="right">
<div style="font-size:9px;opacity:.7;margin-bottom:4px">N° RAPPORTO</div>
<div class="docnum">${rep.reportNumber || rep.id}</div>
<div style="margin-top:6px;background:${esitoColor};color:#fff;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:800">${esitoLabel}</div>
<div style="font-size:10px;margin-top:4px;opacity:.8">Data: ${rep.date || '—'}</div>
</div>
</div>
<div class="section">
<div class="section-title">Apparecchio</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Nome</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.name) || '—'}</span></div>
<div class="kv"><span class="kv-label">Marca / Modello</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.brand) || ''} ${(asset === null || asset === void 0 ? void 0 : asset.model) || ''}</span></div>
<div class="kv"><span class="kv-label">N° Serie</span><span class="kv-value" style="font-family:monospace">${(asset === null || asset === void 0 ? void 0 : asset.serial) || '—'}</span></div>
<div class="kv"><span class="kv-label">Ubicazione</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.location) || '—'}</span></div>
${(customer === null || customer === void 0 ? void 0 : customer.name) ? `<div class="kv"><span class="kv-label">Cliente</span><span class="kv-value">${customer.name}</span></div>` : ''}
</div>
</div>
<div class="section">
<div class="section-title">Dati Verifica</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Tecnico verificatore</span><span class="kv-value">${rep.technician || '—'}</span></div>
<div class="kv"><span class="kv-label">Strumento di misura</span><span class="kv-value">${rep.instrument || '—'}</span></div>
<div class="kv"><span class="kv-label">N° calibrazione</span><span class="kv-value" style="font-family:monospace">${rep.calNumber || '—'}</span></div>
<div class="kv"><span class="kv-label">Tipo verifica</span><span class="kv-value" style="text-transform:capitalize">${rep.verifyType || '—'}</span></div>
<div class="kv"><span class="kv-label">Classe apparecchio</span><span class="kv-value">Classe ${rep.equipClass || '—'}</span></div>
${rep.norm !== '61010' ? `<div class="kv"><span class="kv-label">Tipo parte paziente</span><span class="kv-value">Tipo ${rep.patientType || 'BF'}</span></div>` : ''}
</div>
</div>
<div class="section">
<div class="section-title">Ispezione Visiva</div>
${visRows}
</div>
<div class="section">
<div class="section-title">Misure Elettriche</div>
<table>
<thead><tr><th>Parametro</th><th style="text-align:center">Limite (norma)</th><th style="text-align:center">Valore misurato</th><th style="text-align:center">Unità</th><th style="text-align:center">Esito</th></tr></thead>
<tbody>${measRows || '<tr><td colspan="5" style="text-align:center;color:#94a3b8">Nessuna misura inserita</td></tr>'}</tbody>
</table>
</div>
<div class="total-box" style="margin-top:12px">
<span class="label">ESITO FINALE VERIFICA</span>
<span class="amount">${esitoLabel}</span>
</div>
${rep.notes ? `<div style="margin-top:12px;padding:8px 12px;background:#f8fafc;border-left:3px solid #64748b;font-size:11px"><strong>Note:</strong> ${rep.notes}</div>` : ''}
<div style="margin-top:32px;display:flex">
<div style="width:200px;border-top:1px solid #94a3b8;padding-top:6px;text-align:center;font-size:10px;color:#64748b">Firma Tecnico Verificatore<br><br>${rep.technician || ''}</div>
</div>
<div class="footer">
<span>${company.name || 'MedTrace SRL'} — Generato il ${new Date().toLocaleDateString('it-IT')} — ${normL}</span>
<span>${rep.reportNumber || rep.id} · ${(asset === null || asset === void 0 ? void 0 : asset.serial) || ''}</span>
</div>
</body></html>`;
openPrintWindow(html);
}
function generateFuncPDF(rep, asset, customer, company) {
const tpl = (typeof FUNC_TEMPLATES !== "undefined" ? FUNC_TEMPLATES : {})[rep.templateId] || { label: "Verifica Funzionale", icon: "›", norm: "IEC 60601-1", sections: [] };
const esitoColor = rep.overallPass ? "#0D9488" : "#dc2626";
const esitoLabel = rep.overallPass ? "CONFORME" : "NON CONFORME";
// Build sections HTML
const sectionsHtml = (tpl.sections || []).map(sec => {
const sd = (rep.sections || {})[sec.id] || { items: {}, measures: {} };
const itemsHtml = (sec.items || []).map(item => {
const val = sd.items[item.id];
const icon = val === true ? "✓" : val === false ? "✗" : "—";
const color = val === true ? "#0D9488" : val === false ? "#dc2626" : "#9ca3af";
return `<div class="check-row">
<span class="check-text">${item.text}</span>
<span class="check-result" style="color:${color};background:${color}18;border-color:${color}44">${icon}</span>
</div>`;
}).join("");
const measHtml = (sec.measures || []).map(m => {
const val = sd.measures[m.id] || "";
const vNum = parseFloat(val);
let pass = null;
if (!isNaN(vNum) && val !== "") {
pass = true;
if (m.limitMin !== undefined && vNum < m.limitMin)
pass = false;
if (m.limitVal !== undefined) {
if (m.invertPass) {
if (vNum < m.limitVal)
pass = false;
}
else {
if (vNum > m.limitVal)
pass = false;
}
}
}
const pc = pass === null ? "#9ca3af" : pass ? "#0D9488" : "#dc2626";
return `<tr>
<td>${m.name}</td>
<td style="text-align:center;font-family:monospace;font-size:10px;color:#6b7280">${m.expected || ""}</td>
<td style="text-align:center;font-family:monospace;font-weight:700">${val || "—"}</td>
<td style="text-align:center;color:#6b7280">${m.unit}</td>
<td style="text-align:center"><span style="background:${pc}18;color:${pc};border:1px solid ${pc}44;border-radius:4px;padding:2px 8px;font-size:9px;font-weight:700">${pass === null ? "N/D" : pass ? "✓ PASS" : "✗ FAIL"}</span></td>
</tr>`;
}).join("");
// Section pass/fail summary
const allItems = (sec.items || []);
const anyFail = allItems.some(it => sd.items[it.id] === false);
const allOk = allItems.length > 0 && allItems.every(it => sd.items[it.id] === true);
const secColor = anyFail ? "#dc2626" : allOk ? "#0D9488" : "#6b7280";
return `<div class="section">
<div class="section-header" style="border-left:3px solid ${secColor}">
<span class="section-title">${sec.title}</span>
</div>
${sec.note ? `<div class="section-note">${sec.note}</div>` : ""}
${itemsHtml}
${measHtml ? `<table style="margin-top:${(sec.items || []).length > 0 ? 8 : 0}px">
<thead><tr><th>Misura</th><th style="text-align:center">Atteso</th><th style="text-align:center">Valore</th><th style="text-align:center">U.M.</th><th style="text-align:center">Esito</th></tr></thead>
<tbody>${measHtml}</tbody>
</table>` : ""}
</div>`;
}).join("");
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Verifica Funzionale ${rep.reportNumber || rep.id}</title>
<style>
@page { size: A4; margin: 14mm 14mm 14mm 14mm; }
@media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
body { font-family:'Segoe UI',Arial,sans-serif; font-size:11px; color:#1a202c; background:#fff; }
.header { background:#2DD4BF; color:#fff; padding:14px 18px; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }
.header h1 { font-size:18px; font-weight:900; letter-spacing:-.3px; }
.header .sub { font-size:9px; opacity:.8; margin-top:2px; }
.header .right { text-align:right; }
.header .docnum { font-size:16px; font-weight:800; }
.esito-badge { margin-top:6px; padding:4px 12px; border-radius:4px; font-size:10px; font-weight:800; display:inline-block; background:${esitoColor}; color:#fff; }
.kv-grid { display:grid; grid-template-columns:1fr 1fr; gap:3px 20px; margin-bottom:12px; }
.kv { display:flex; gap:6px; padding:3px 0; border-bottom:1px solid #f1f5f9; }
.kv-label { color:#94a3b8; min-width:100px; font-size:9px; text-transform:uppercase; letter-spacing:.5px; }
.kv-value { font-weight:600; font-size:11px; }
.section { margin-bottom:12px; break-inside:avoid; }
.section-header { background:#f8fafc; padding:6px 10px; margin-bottom:4px; border-radius:0 4px 4px 0; }
.section-title { font-size:9px; font-weight:800; text-transform:uppercase; letter-spacing:.8px; color:#374151; }
.section-note { font-size:9px; color:#6b7280; font-style:italic; margin:0 0 6px 2px; padding:4px 8px; background:#fffbeb; border-left:2px solid #f59e0b; }
.check-row { display:flex; justify-content:space-between; align-items:center; padding:4px 2px; border-bottom:1px solid #f9fafb; gap:8px; }
.check-text { font-size:10px; color:#374151; flex:1; }
.check-result { font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; border:1px solid; white-space:nowrap; }
table { width:100%; border-collapse:collapse; font-size:10px; }
th { background:#f1f5f9; color:#64748b; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; padding:5px 7px; border-bottom:1px solid #e2e8f0; text-align:left; }
td { padding:5px 7px; border-bottom:1px solid #f1f5f9; }
.total-box { background:#0F766E; color:#fff; padding:9px 14px; display:flex; justify-content:space-between; align-items:center; border-radius:4px; margin-top:10px; }
.total-box .label { font-size:10px; font-weight:700; }
.total-box .amount { font-size:14px; font-weight:900; }
.footer { margin-top:16px; padding-top:8px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; font-size:8px; color:#94a3b8; }
.sig-row { display:flex; gap:32px; margin-top:24px; }
.sig-box { flex:1; border-top:1px solid #94a3b8; padding-top:5px; text-align:center; font-size:9px; color:#64748b; }
</style></head><body>
<div class="header">
<div>
<img src=\"data:image/svg+xml,%3Csvg viewBox='0 0 50 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M8 20 Q12 12 16 20 Q20 28 24 20'/%3E%3Cpath d='M4 20 Q10 8 16 20 Q22 32 28 20'/%3E%3Cpath d='M0 20 Q8 4 16 20 Q24 36 32 20'/%3E%3Ccircle cx='38' cy='20' r='4' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E\" class=\"header-logo\" width=\"36\" height=\"28\" alt=\"MedTrace\"/><h1>${company.name || "MedTrace SRL"}</h1>
<div class="sub">${company.subtitle || ""}</div>
<div class="sub" style="margin-top:3px">RAPPORTO DI VERIFICA FUNZIONALE</div>
<div class="sub">${tpl.norm}</div>
</div>
<div class="right">
<div style="font-size:8px;opacity:.7;margin-bottom:3px">N° RAPPORTO</div>
<div class="docnum">${rep.reportNumber || rep.id}</div>
<div class="esito-badge">${esitoLabel}</div>
<div style="font-size:9px;margin-top:4px;opacity:.8">Data: ${rep.date || "—"}</div>
</div>
</div>
<div class="kv-grid">
<div class="kv"><span class="kv-label">Tipo apparecchio</span><span class="kv-value">${tpl.icon} ${tpl.label}</span></div>
<div class="kv"><span class="kv-label">Apparecchio</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.name) || "—"}</span></div>
<div class="kv"><span class="kv-label">Marca / Modello</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.brand) || ""} ${(asset === null || asset === void 0 ? void 0 : asset.model) || ""}</span></div>
<div class="kv"><span class="kv-label">N° Serie</span><span class="kv-value" style="font-family:monospace">${(asset === null || asset === void 0 ? void 0 : asset.serial) || "—"}</span></div>
<div class="kv"><span class="kv-label">Ubicazione</span><span class="kv-value">${(asset === null || asset === void 0 ? void 0 : asset.location) || "—"}</span></div>
${(customer === null || customer === void 0 ? void 0 : customer.name) ? `<div class="kv"><span class="kv-label">Cliente</span><span class="kv-value">${customer.name}</span></div>` : ""}
<div class="kv"><span class="kv-label">Tecnico verificatore</span><span class="kv-value">${rep.technician || "—"}</span></div>
<div class="kv"><span class="kv-label">Strumento/tester</span><span class="kv-value">${rep.instrument || "—"}</span></div>
</div>
${sectionsHtml}
${rep.notes ? `<div style="margin-top:8px;padding:8px 10px;background:#f8fafc;border-left:3px solid #64748b;font-size:10px"><strong>Note:</strong> ${rep.notes}</div>` : ""}
<div class="total-box">
<span class="label">ESITO FINALE VERIFICA FUNZIONALE</span>
<span class="amount">${esitoLabel}</span>
</div>
<div class="sig-row">
<div class="sig-box">Firma Tecnico Verificatore<br><br>${rep.technician || ""}</div>
</div>
<div class="footer">
<span>${company.name || "MedTrace SRL"} — Generato il ${new Date().toLocaleDateString("it-IT")} — ${tpl.norm}</span>
<span>${rep.reportNumber || rep.id} · ${(asset === null || asset === void 0 ? void 0 : asset.serial) || ""}</span>
</div>
</body></html>`;
openPrintWindow(html);
}
/* ═══ IEC REPORT FORM ════════════════════════════════════════ */
/* ═══ VERIFICA FUNZIONALE FORM ══════════════════════════════ */
function FuncVerifyForm({ initial, assetId: propAssetId, assets, customers, instruments, onSave, onClose }) {
const asset = assets.find(a => a.id === propAssetId) || null;
const [selectedAssetId, setSelectedAssetId] = React.useState(propAssetId || (initial === null || initial === void 0 ? void 0 : initial.assetId) || "");
const effectiveAsset = asset || assets.find(a => a.id === selectedAssetId) || null;
// Auto-detect template from asset name
const suggestedTpl = guessTemplate((effectiveAsset === null || effectiveAsset === void 0 ? void 0 : effectiveAsset.name) || "");
const [templateId, setTemplateId] = React.useState((initial === null || initial === void 0 ? void 0 : initial.templateId) || suggestedTpl || "generico");
const tpl = FUNC_TEMPLATES[templateId] || FUNC_TEMPLATES["generico"];
const blank = {
id: "FV" + Date.now().toString().slice(-6),
reportNumber: "",
assetId: propAssetId || "",
date: new Date().toISOString().slice(0, 10),
technician: "",
instrument: "",
templateId: templateId,
verifyType: "periodica",
sections: {}, // {sectionId: {items:{itemId:bool|null}, measures:{mId:string}}}
notes: "",
overallPass: false,
};
const [f, setF] = React.useState(() => {
const init = initial || blank;
if (!init.sections)
return Object.assign(Object.assign({}, init), { sections: {} });
return init;
});
const sv = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
// Initialize section data when template changes
React.useEffect(() => {
setF(x => (Object.assign(Object.assign({}, x), { templateId })));
}, [templateId]);
const getSectionData = (secId) => f.sections[secId] || { items: {}, measures: {} };
const setItem = (secId, itemId, val) => setF(x => (Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, getSectionData(secId)), { items: Object.assign(Object.assign({}, getSectionData(secId).items), { [itemId]: val }) }) }) })));
const setMeasure = (secId, mId, val) => setF(x => (Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, getSectionData(secId)), { measures: Object.assign(Object.assign({}, getSectionData(secId).measures), { [mId]: val }) }) }) })));
const setMeasureUnit = (secId, mId, unit) => setF(x => (Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, getSectionData(secId)), { measureUnits: Object.assign(Object.assign({}, (getSectionData(secId).measureUnits || {})), { [mId]: unit }) }) }) })));
// Compute overall pass
const computePass = () => {
for (const sec of tpl.sections) {
const sd = getSectionData(sec.id);
// Any item explicitly failed → fail
for (const item of (sec.items || [])) {
if (sd.items[item.id] === false)
return false;
}
// Any measure out of range → fail
for (const m of (sec.measures || [])) {
const v = parseFloat(sd.measures[m.id] || "");
if (isNaN(v))
continue;
if (m.limitMin !== undefined && v < m.limitMin)
return false;
if (m.limitVal !== undefined) {
if (m.invertPass) {
if (v < m.limitVal)
return false;
}
else {
if (v > m.limitVal)
return false;
}
}
}
}
return true;
};
const pass = computePass();
const FLD = { display: "flex", flexDirection: "column", gap: 5 };
const LBL = { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 };
const INP = { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };
const isMobile = useMedia("(max-width:600px)");
const renderItemRow = ({ secId, item }) => {
const val = getSectionData(secId).items[item.id];
return (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a2030", gap: 10 } },
React.createElement("span", { style: { fontSize: 12, color: "#94a3b8", flex: 1 } }, item.text),
React.createElement("div", { style: { display: "flex", gap: 5, flexShrink: 0 } }, [true, false, null].map((v, i) => (React.createElement("button", { key: i, onClick: () => setItem(secId, item.id, v), style: {
background: val === v ? (v === true ? "#22c55e22" : v === false ? "#ef444422" : "#2A2A38") : "#141418",
border: `1px solid ${val === v ? (v === true ? "#22c55e44" : v === false ? "#ef444433" : "#32323F") : "#202028"}`,
color: val === v ? (v === true ? "#22c55e" : v === false ? "#ef4444" : "#64748b") : "#475569",
borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap"
} }, v === true ? "✓" : v === false ? "✗" : "N/D"))))));
};
// Pressure conversion factors to kPa (base unit for pressure)
const PRESSURE_TO_KPA = {
"kPa": 1, "mmHg": 0.133322, "cmH2O": 0.0980665, "mbar": 0.1, "Pa": 0.001,
"bar": 100, "psi": 6.89476, "inHg": 3.38639,
};
const convertToBase = (val, fromUnit, baseUnit) => {
if (!PRESSURE_TO_KPA[fromUnit] || !PRESSURE_TO_KPA[baseUnit])
return val;
return val * PRESSURE_TO_KPA[fromUnit] / PRESSURE_TO_KPA[baseUnit];
};
const renderMeasureRow = ({ secId, m }) => {
const sectionData = getSectionData(secId);
const val = sectionData.measures[m.id] || "";
const currentUnit = (sectionData.measureUnits || {})[m.id] || m.unit;
const vNum = parseFloat(val);
let pass = null;
if (!isNaN(vNum)) {
pass = true;
// Convert input value to base unit for limit comparison
const vBase = (m.units && currentUnit !== m.unit) ? convertToBase(vNum, currentUnit, m.unit) : vNum;
if (m.limitMin !== undefined && vBase < m.limitMin)
pass = false;
if (m.limitVal !== undefined) {
if (m.invertPass) {
if (vBase < m.limitVal)
pass = false;
}
else {
if (vBase > m.limitVal)
pass = false;
}
}
}
const hasUnitChoice = m.units && m.units.length > 1;
return (React.createElement("div", { style: { display: "grid", gridTemplateColumns: hasUnitChoice ? "1fr 80px 55px 65px" : "1fr 90px 60px 40px", gap: 6, alignItems: "center", marginBottom: 6, background: "#0D0D12", borderRadius: 6, padding: "6px 8px" } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8" } }, m.name),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontFamily: "monospace" } }, m.expected || ""),
React.createElement("input", { type: "number", step: "any", value: val, onChange: e => setMeasure(secId, m.id, e.target.value), placeholder: "\u2014", style: { background: "#16161C", border: "1px solid #2a3040", borderRadius: 5, padding: "4px 7px", color: "#e2e8f0", fontSize: 12, outline: "none", fontFamily: "monospace" } }),
hasUnitChoice ? (React.createElement("select", { value: currentUnit, onChange: e => setMeasureUnit(secId, m.id, e.target.value), style: { background: "#16161C", border: "1px solid #2a3040", borderRadius: 5, padding: "3px 4px", color: pass === null ? "#94a3b8" : pass ? "#22c55e" : "#ef4444", fontSize: 11, fontWeight: 700, outline: "none", cursor: "pointer" } }, m.units.map(u => React.createElement("option", { key: u, value: u }, u)))) : (React.createElement("span", { style: { fontWeight: 700, fontSize: 13, textAlign: "center", color: pass === null ? "#475569" : pass ? "#22c55e" : "#ef4444" } }, m.unit))));
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { background: pass ? "#22c55e15" : "#ef444415", border: `1px solid ${pass ? "#22c55e44" : "#ef444433"}`, borderRadius: 8, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8" } },
"Template: ",
React.createElement("strong", { style: { color: "#e2e8f0" } },
tpl.icon,
" ",
tpl.label),
" \u2014 ",
tpl.norm),
React.createElement("span", { style: { fontWeight: 800, fontSize: 14, color: pass ? "#22c55e" : "#ef4444" } }, pass ? "CONFORME" : "NON CONFORME")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 13 } },
!propAssetId && (React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Apparecchio"),
React.createElement("select", { value: selectedAssetId, onChange: e => { setSelectedAssetId(e.target.value); setF(x => (Object.assign(Object.assign({}, x), { assetId: e.target.value }))); const a = assets.find(x => x.id === e.target.value); if (a) {
const t = guessTemplate(a.name);
setTemplateId(t);
} }, style: INP },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
assets.map(a => React.createElement("option", { key: a.id, value: a.id },
a.name,
" \u2014 ",
a.serial || "—"))))),
effectiveAsset && React.createElement("div", { style: Object.assign(Object.assign({}, FLD), { justifyContent: "flex-end" }) },
React.createElement("label", { style: LBL }, "Apparecchio selezionato"),
React.createElement("div", { style: { background: "#141418", borderRadius: 8, padding: "8px 14px", border: "1px solid #1e2a3a", fontSize: 12, color: "#94a3b8" } },
React.createElement("strong", { style: { color: "#e2e8f0" } }, effectiveAsset.name),
" \u00B7 ",
effectiveAsset.brand,
" ",
effectiveAsset.model,
" \u00B7 S/N: ",
effectiveAsset.serial || "—")),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Template verifica funzionale"),
React.createElement("select", { value: templateId, onChange: e => setTemplateId(e.target.value), style: INP }, Object.entries(FUNC_TEMPLATES).map(([id, t]) => React.createElement("option", { key: id, value: id },
t.icon,
" ",
t.label)))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 Rapporto"),
React.createElement("input", { value: f.reportNumber, onChange: sv("reportNumber"), placeholder: "VF-2026-001", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Data verifica"),
React.createElement("input", { type: "date", value: f.date, onChange: sv("date"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tecnico"),
React.createElement("input", { value: f.technician, onChange: sv("technician"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tipo verifica"),
React.createElement("select", { value: f.verifyType || "periodica", onChange: sv("verifyType"), style: INP },
React.createElement("option", { value: "periodica" }, "Periodica programmata"),
React.createElement("option", { value: "dopo riparazione" }, "Dopo riparazione"),
React.createElement("option", { value: "prima messa in servizio" }, "Prima messa in servizio"),
React.createElement("option", { value: "straordinaria" }, "Straordinaria")),
(f.verifyType === "straordinaria") && React.createElement("span", { style: { fontSize: 10, color: "#f59e0b", marginTop: 3 } }, "\u26A0 Straordinaria: non aggiorna la pianificazione annuale")),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Strumento/tester utilizzato"),
(instruments || []).length > 0 && (React.createElement("select", { onChange: e => { const inst = (instruments || []).find(i => i.id === e.target.value); if (inst)
sv('instrument')({ target: { value: inst.brand + ' ' + inst.model + (inst.serial ? ' S/N ' + inst.serial : '') } }); }, style: Object.assign(Object.assign({}, INP), { marginBottom: 6, color: '#5A5A70' }) },
React.createElement("option", { value: "" }, "\u2014 Seleziona da strumenti registrati \u2014"),
(instruments || []).map(i => React.createElement("option", { key: i.id, value: i.id },
i.brand,
" ",
i.model,
i.serial ? ' S/N ' + i.serial : '')))),
React.createElement("input", { value: f.instrument, onChange: sv("instrument"), placeholder: "Es. Fluke Impulse 6000D S/N 12345", style: INP }))),
tpl.sections.map(sec => (React.createElement("div", { key: sec.id, style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 11, color: "#5EEAD4", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: sec.note ? 4 : 10 } }, sec.title),
sec.note && React.createElement("div", { style: { fontSize: 10, color: "#64748b", marginBottom: 10, fontStyle: "italic" } }, sec.note),
(sec.items || []).map(item => renderItemRow({ secId: sec.id, item })),
(sec.measures || []).length > 0 && (React.createElement("div", { style: { marginTop: (sec.items || []).length > 0 ? 10 : 0 } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 90px 60px 40px", gap: 6, marginBottom: 6 } }, ["Misura", "Atteso", "Valore", "U.M."].map(h => React.createElement("div", { key: h, style: { fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase" } }, h))),
(sec.measures || []).map(m => renderMeasureRow({ secId: sec.id, m }))))))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Note e osservazioni"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 3, style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" } })),
React.createElement("div", { style: { padding: '10px 0', borderTop: '1px solid #2A2A38', marginTop: 10 } },
React.createElement("div", { style: { fontSize: 11, color: '#2DD4BF', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 } }, "Allegati (test report esterno, certificato calibrazione)"),
React.createElement(AttachmentsList, { attachments: f.attachments || [], onAdd: (att) => setF(x => (Object.assign(Object.assign({}, x), { attachments: [...(x.attachments || []), att] }))), onDelete: (id) => setF(x => (Object.assign(Object.assign({}, x), { attachments: (x.attachments || []).filter(a => a.id !== id) }))) })),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { assetId: f.assetId || selectedAssetId, overallPass: pass, templateId })) }, "Salva rapporto"))));
}
function IECReportForm({ initial, assetId: propAssetId, assets, customers, instruments, onSave, onClose }) {
const getMeasures = React.useCallback((norm, cls, patientType, method) => {
// ── IEC 61010-1 (Strumentazione da laboratorio) ──────────────
if (norm === "61010")
return [
{ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.1", limitVal: 0.1, value: "" },
{ id: "ins", name: "Resistenza di isolamento (500 Vdc)", unit: "MΩ", limit: "≥ 1", limitVal: 1, value: "", invertPass: true },
{ id: "id1", name: "Corrente di dispersione — carcassa", unit: "mA", limit: "≤ 3.5", limitVal: 3.5, value: "" },
{ id: "id2", name: "Corrente di dispersione — circuito prova", unit: "mA", limit: "≤ 0.5", limitVal: 0.5, value: "" },
];
// ── IEC 62353 — Limiti ufficiali dalla Tabella 2 della norma ──
// Equipment Leakage limite dipende da Classe E metodo
// Applied Part Leakage limite dipende SOLO dal tipo parte (BF=5000, CF=50)
const pt = patientType || "BF";
const met = method || "direct"; // direct | differential | alternative
// Limiti Equipment Leakage in funzione di Classe e Metodo
// Direct & Differential: Cl.I = 500µA, Cl.II = 100µA
// Alternative:           Cl.I = 1000µA, Cl.II = 500µA
const eqLimits = {
"I": { direct: 500, differential: 500, alternative: 1000 },
"II": { direct: 100, differential: 100, alternative: 500 },
};
// ── Classe III — SELV (alimentazione interna / sicura ≤ 25Vac / 60Vdc) ──
if (cls === "III")
return [
{ id: "ins", name: "Resistenza di isolamento (250 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
...(pt === "BF" ? [
{ id: "ap", name: "Corrente dispersione parte applicata BF (" + met + ")", unit: "µA", limit: "≤ 5000", limitVal: 5000, value: "" },
] : pt === "CF" ? [
{ id: "ap", name: "Corrente dispersione parte applicata CF (" + met + ")", unit: "µA", limit: "≤ 50", limitVal: 50, value: "" },
] : []),
];
// ── Classe II — doppio isolamento (no PE) ─────────────────────
if (cls === "II") {
const eqLim = eqLimits["II"][met];
const measures = [
{ id: "ins", name: "Resistenza di isolamento (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "eq", name: "Corrente dispersione apparecchiatura (" + met + ")", unit: "µA", limit: "≤ " + eqLim, limitVal: eqLim, value: "" },
];
if (pt === "BF")
measures.push({ id: "ap", name: "Corrente dispersione parte applicata BF (" + met + ")", unit: "µA", limit: "≤ 5000", limitVal: 5000, value: "" });
else if (pt === "CF")
measures.push({ id: "ap", name: "Corrente dispersione parte applicata CF (" + met + ")", unit: "µA", limit: "≤ 50", limitVal: 50, value: "" });
return measures;
}
// ── Classe I — con conduttore di protezione (PE) ──────────────
const eqLim = eqLimits["I"][met];
const measures = [
{ id: "pe", name: "Resistenza conduttore PE (cavo ≤ 5m: ≤ 0.3Ω; oltre +0.1Ω/7.5m)", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "" },
{ id: "ins", name: "Resistenza di isolamento (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "eq", name: "Corrente dispersione apparecchiatura (" + met + ")", unit: "µA", limit: "≤ " + eqLim, limitVal: eqLim, value: "" },
];
if (pt === "BF")
measures.push({ id: "ap", name: "Corrente dispersione parte applicata BF (" + met + ")", unit: "µA", limit: "≤ 5000", limitVal: 5000, value: "" });
else if (pt === "CF")
measures.push({ id: "ap", name: "Corrente dispersione parte applicata CF (" + met + ")", unit: "µA", limit: "≤ 50", limitVal: 50, value: "" });
return measures;
}, []);
const blank = { id: "R" + Date.now().toString().slice(-6), reportNumber: "", norm: "62353", date: new Date().toISOString().slice(0, 10),
technician: "", instrument: "", calNumber: "", verifyType: "periodica",
equipClass: "I", equipType: "", assetId: propAssetId || "",
method: "direct", // direct | differential | alternative
visual: { housing: null, cable: null, connectors: null, labels: null, docs: null },
measures: [], notes: "", overallPass: false };
const [f, setF] = React.useState(() => {
var _a;
const init = initial || blank;
if (!((_a = init.measures) === null || _a === void 0 ? void 0 : _a.length))
return Object.assign(Object.assign({}, init), { measures: getMeasures(init.norm || "62353", init.equipClass || "I", init.patientType || "BF", init.method || "direct") });
return init;
});
const sv = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const setVis = (k, v) => setF(x => (Object.assign(Object.assign({}, x), { visual: Object.assign(Object.assign({}, x.visual), { [k]: v }) })));
const setMeas = (id, val) => setF(x => (Object.assign(Object.assign({}, x), { measures: x.measures.map(m => m.id === id ? Object.assign(Object.assign({}, m), { value: val }) : m) })));
React.useEffect(() => { setF(x => (Object.assign(Object.assign({}, x), { measures: getMeasures(x.norm, x.equipClass, x.patientType, x.method) }))); }, [f.norm, f.equipClass, f.patientType, f.method]);
const computePass = React.useCallback((measures, visual) => {
const mf = measures.some(m => { if (m.value === "" || m.value === undefined)
return false; const v = parseFloat(m.value); const lv = parseFloat(m.limitVal); if (isNaN(v) || isNaN(lv))
return false; return m.invertPass ? v < lv : v > lv; });
const vf = Object.values(visual).some(v => v === false);
return !mf && !vf;
}, []);
React.useEffect(() => { setF(x => (Object.assign(Object.assign({}, x), { overallPass: computePass(x.measures, x.visual) }))); }, [f.measures, f.visual]);
const asset = assets.find(a => a.id === (f.assetId || propAssetId));
const FLD = { display: "flex", flexDirection: "column", gap: 5 };
const LBL = { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 };
const INP = { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" };
const isMobile = useMedia("(max-width:600px)");
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { background: f.overallPass ? "#22c55e15" : "#ef444415", border: `1px solid ${f.overallPass ? "#22c55e44" : "#ef444433"}`, borderRadius: 8, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8" } },
"Norma: ",
React.createElement("strong", { style: { color: "#e2e8f0" } }, f.norm === "61010" ? "IEC 61010-1 (Lab)" : "IEC 62353 (Elettromedicale)")),
React.createElement("span", { style: { fontWeight: 800, fontSize: 14, color: f.overallPass ? "#22c55e" : "#ef4444" } }, f.overallPass ? "CONFORME" : "NON CONFORME")),
!propAssetId && (React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Apparecchio"),
React.createElement("select", { value: f.assetId, onChange: sv("assetId"), style: INP },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
assets.map(a => React.createElement("option", { key: a.id, value: a.id },
a.name,
" \u2014 ",
a.serial || "—"))))),
asset && React.createElement("div", { style: { background: "#141418", borderRadius: 8, padding: "8px 14px", border: "1px solid #1e2a3a", fontSize: 12, color: "#94a3b8" } },
React.createElement("strong", { style: { color: "#e2e8f0" } }, asset.name),
" \u00B7 ",
asset.brand,
" ",
asset.model,
" \u00B7 S/N: ",
asset.serial || "—"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 13 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 Rapporto"),
React.createElement("input", { value: f.reportNumber, onChange: sv("reportNumber"), placeholder: "VSE-2026-001", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Data"),
React.createElement("input", { type: "date", value: f.date, onChange: sv("date"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Norma"),
React.createElement("select", { value: f.norm, onChange: sv("norm"), style: INP },
React.createElement("option", { value: "62353" }, "IEC 62353 \u2014 Elettromedicale"),
React.createElement("option", { value: "61010" }, "IEC 61010-1 \u2014 Laboratorio"))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Classe apparecchio"),
React.createElement("select", { value: f.equipClass, onChange: sv("equipClass"), style: INP },
React.createElement("option", { value: "I" }, "Classe I \u2014 Con PE (messa a terra)"),
React.createElement("option", { value: "II" }, "Classe II \u2014 Doppio isolamento (no PE)"),
React.createElement("option", { value: "III" }, "Classe III \u2014 SELV (alimentazione interna/sicura)")),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", marginTop: 3 } },
f.equipClass === "I" && "Misure: PE + isolamento + dispersione terra + dispersione paziente",
f.equipClass === "II" && "Misure: isolamento + dispersione carcassa + dispersione paziente (NO PE)",
f.equipClass === "III" && "Misure: isolamento + dispersione paziente soltanto (circuito SELV, NO terra)")),
f.norm !== "61010" && (React.createElement(React.Fragment, null,
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tipo parte applicata (paziente)"),
React.createElement("select", { value: f.patientType || "BF", onChange: sv("patientType"), style: INP },
React.createElement("option", { value: "B" }, "Tipo B \u2014 Contatto corpo (no test parte applicata)"),
React.createElement("option", { value: "BF" }, "Tipo BF \u2014 Parte isolata (limite parte applicata \u2264 5000\u00B5A)"),
React.createElement("option", { value: "CF" }, "Tipo CF \u2014 Applicazione cardiaca (limite parte applicata \u2264 50\u00B5A)")),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", marginTop: 3 } },
(f.patientType || "BF") === "B" && "Tipo B: contatto corpo non isolato — no test applied part leakage",
(f.patientType || "BF") === "BF" && "Tipo BF: parte applicata isolata floating (es. ECG, SpO2, defib paddle)",
(f.patientType || "BF") === "CF" && "Tipo CF: applicazione cardiaca diretta — limiti molto severi")),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Metodo di misura"),
React.createElement("select", { value: f.method || "direct", onChange: sv("method"), style: INP },
React.createElement("option", { value: "direct" }, "Direct method (Diretto) \u2014 Cl.I 500\u00B5A / Cl.II 100\u00B5A"),
React.createElement("option", { value: "differential" }, "Differential method (Differenziale) \u2014 Cl.I 500\u00B5A / Cl.II 100\u00B5A"),
React.createElement("option", { value: "alternative" }, "Alternative method (Alternativo) \u2014 Cl.I 1000\u00B5A / Cl.II 500\u00B5A")),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", marginTop: 3 } },
(f.method || "direct") === "direct" && "Diretto: misura reale a terra tramite body model. Ideale stanze standard/protette.",
(f.method || "direct") === "differential" && "Differenziale: misura sbilanciamento L/N. Sicuro su tutte le stanze, anche ambulatori isolati IT.",
(f.method || "direct") === "alternative" && "Alternativo: simile a prova dielettrica, DUT spento. Limiti più alti perché non c'è caduta su resistore.")))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tecnico verificatore"),
React.createElement("input", { value: f.technician, onChange: sv("technician"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Strumento di misura"),
(instruments || []).length > 0 && (React.createElement("select", { onChange: e => { const inst = (instruments || []).find(i => i.id === e.target.value); if (inst)
sv('instrument')({ target: { value: inst.brand + ' ' + inst.model + (inst.serial ? ' S/N ' + inst.serial : '') } }); }, style: Object.assign(Object.assign({}, INP), { marginBottom: 6, color: '#5A5A70' }) },
React.createElement("option", { value: "" }, "\u2014 Seleziona da strumenti registrati \u2014"),
(instruments || []).map(i => React.createElement("option", { key: i.id, value: i.id },
i.brand,
" ",
i.model,
i.serial ? ' S/N ' + i.serial : '')))),
React.createElement("input", { value: f.instrument, onChange: sv("instrument"), placeholder: "Es. Fluke ProSim 4, S/N ...", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 calibrazione"),
React.createElement("input", { value: f.calNumber, onChange: sv("calNumber"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tipo verifica"),
React.createElement("select", { value: f.verifyType, onChange: sv("verifyType"), style: INP }, ["periodica", "dopo riparazione", "prima messa in servizio", "straordinaria"].map(v => React.createElement("option", { key: v }, v))),
f.verifyType === "straordinaria" && React.createElement("span", { style: { fontSize: 10, color: "#f59e0b", marginTop: 3 } }, "\u26A0 Straordinaria: non aggiorna la pianificazione annuale"))),
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, "Ispezione visiva"),
[["housing", "Involucro integro e privo di danni"], ["cable", "Cavo di rete e spina integri"], ["connectors", "Connettori e prese in buono stato"], ["labels", "Etichette e marcatura CE leggibili"], ["docs", "Documentazione tecnica presente"]].map(([k, label]) => (React.createElement("div", { key: k, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a2030" } },
React.createElement("span", { style: { fontSize: 12, color: "#94a3b8" } }, label),
React.createElement("div", { style: { display: "flex", gap: 6 } }, [true, false, null].map((v, i) => (React.createElement("button", { key: i, onClick: () => setVis(k, v), style: {
background: f.visual[k] === v ? (v === true ? "#22c55e22" : v === false ? "#ef444422" : "#202028") : "#141418",
border: `1px solid ${f.visual[k] === v ? (v === true ? "#22c55e44" : v === false ? "#ef444433" : "#32323F") : "#202028"}`,
color: f.visual[k] === v ? (v === true ? "#22c55e" : v === false ? "#ef4444" : "#64748b") : "#475569",
borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontWeight: 700
} }, v === true ? "✓ OK" : v === false ? "✗ NO" : "N/D")))))))),
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, "Misure elettriche"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 80px 80px 50px 50px", gap: 6, marginBottom: 6 } }, ["Parametro", "Limite", "Valore", "Unità", "Esito"].map(h => React.createElement("div", { key: h, style: { fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase" } }, h))),
f.measures.map(m => {
const v = parseFloat(m.value);
const lv = parseFloat(m.limitVal);
const ok = m.value !== "" && m.value !== undefined ? (m.invertPass ? v >= lv : v <= lv) : null;
return (React.createElement("div", { key: m.id, style: { display: "grid", gridTemplateColumns: "1fr 80px 80px 50px 50px", gap: 6, alignItems: "center", marginBottom: 6, background: "#0D0D12", borderRadius: 6, padding: "6px 8px" } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8" } }, m.name),
React.createElement("span", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace" } }, m.limit),
React.createElement("input", { type: "number", step: "0.001", value: m.value, onChange: e => setMeas(m.id, e.target.value), placeholder: "\u2014", style: { background: "#16161C", border: "1px solid #2a3040", borderRadius: 5, padding: "4px 7px", color: "#e2e8f0", fontSize: 12, outline: "none", fontFamily: "monospace" } }),
React.createElement("span", { style: { fontSize: 11, color: "#64748b" } }, m.unit),
React.createElement("span", { style: { fontWeight: 700, fontSize: 13, color: ok === null ? "#475569" : ok ? "#22c55e" : "#ef4444" } }, ok === null ? "—" : ok ? "✓" : "✗")));
})),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
React.createElement("label", { style: LBL }, "Note e osservazioni"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 3, style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" } })),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { assetId: f.assetId || propAssetId || "" })) }, "Salva rapporto"))));
}
/* ═══ VERIFICA FUNZIONALE — TEMPLATE PER TIPO APPARECCHIO ══════
* Basato su: IEC 60601-1, IEC 60601-2-4 (defibrillatori),
*            CEI 62-13, CEI EN 62353 Allegato F,
*            Linee guida CEI 62-148, normativa italiana D.L. 169/2013
* ═══════════════════════════════════════════════════════════════ */
const FUNC_TEMPLATES = {
// ─── DEFIBRILLATORE MANUALE (IEC 60601-2-4:2010+AMD1:2021) ──────────────
"defibrillatore": {
label: "Defibrillatore manuale", icon: "›", norm: "IEC 60601-2-4:2010+AMD1:2021",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri, nessun danno visibile" },
{ id: "involucro", text: "Involucro e display: privi di crepe, bruciature o danni meccanici" },
{ id: "piastre", text: "Palette/piastre manuali: superficie conduttiva integra, impugnatura isolata" },
{ id: "pad_adesivi", text: "Pad adesivi (se presenti): non scaduti, gel integro, connettori OK" },
{ id: "cavo_ecg", text: "Cavo ECG paziente e connettori: integrità isolamento, funzionanti" },
{ id: "stampante", text: "Stampante termica (se presente): carta presente, funzionante" },
{ id: "etichette", text: "Etichette di sicurezza e numero serie: leggibili e presenti" },
]
},
{
id: "batteria", title: "Batteria e alimentazione",
items: [
{ id: "batt_scad", text: "Data scadenza batteria: non superata" },
{ id: "batt_carica", text: "Indicatore carica: livello adeguato per utilizzo" },
{ id: "batt_autotest", text: "Autotest batteria (se previsto dal costruttore): superato" },
{ id: "rete_ok", text: "Funzionamento da rete: corretto, indicatore carica attivo" },
],
measures: [
{ id: "batt_perc", name: "Carica residua batteria", unit: "%", expected: "≥ 80%", limitVal: 100, limitMin: 80, invertPass: true, value: "" },
]
},
{
id: "funz_base", title: "Funzionalità di base",
items: [
{ id: "accensione", text: "Accensione: nessun messaggio di errore o allarme anomalo" },
{ id: "display", text: "Display: leggibile, nessun pixel morto o artefatto" },
{ id: "sel_energia", text: "Selettore energia: funzionante da minimo a massimo" },
{ id: "puls_carica", text: "Tasto CARICA: funzionante, tempo carica entro specifiche" },
{ id: "puls_scarica", text: "Tasto SCARICA: funzionante su analizzatore/carico resistivo" },
{ id: "beep_carica", text: "Segnale acustico carica completata: presente e udibile" },
{ id: "annullamento", text: "Annullamento carica (tasto o timeout): funzionante" },
]
},
{
id: "energia", title: "Energia erogata (IEC 60601-2-4 cl.201.12.4.101)",
note: "Misurare con analizzatore certificato su carico 50 Ω. Tolleranza ±15% o ±3J (si applica il maggiore). Compilare i livelli applicabili al modello in uso — non è necessario misurare tutti i livelli fissi sotto.",
items: [
{ id: "carico_50", text: "Analizzatore collegato su carico 50 Ω" },
{ id: "forma_onda", text: "Forma d'onda di scarica (bifasica/monofasica): conforme alle specifiche" },
],
measures: [
{ id: "e_min", name: "Energia — selezione minima del modello", unit: "J", expected: "sel. ±15% o ±3J", value: "" },
{ id: "e_mid1", name: "Energia — livello intermedio 1 (es. 100J)", unit: "J", expected: "sel. ±15% o ±3J", value: "" },
{ id: "e_mid2", name: "Energia — livello intermedio 2 (es. 200J)", unit: "J", expected: "sel. ±15% o ±3J", value: "" },
{ id: "e_max", name: "Energia — selezione massima del modello", unit: "J", expected: "sel. ±15% o ±3J", value: "" },
{ id: "t_carica", name: "Tempo di carica a energia max", unit: "s", expected: "≤ 15 s (IEC 60601-2-4)", limitVal: 15, value: "" },
]
},
{
id: "ecg_mon", title: "Monitoraggio ECG (IEC 60601-2-27)",
items: [
{ id: "ecg_tracciato", text: "Tracciato ECG su simulatore: morfologia corretta, no artefatti" },
{ id: "ecg_derivazioni", text: "Selezione derivazioni (I, II, III + precordiali se disponibili): funzionante" },
{ id: "ecg_allarmi", text: "Allarmi FC alta/bassa: attivazione nei range impostati" },
],
measures: [
{ id: "fc_sim60", name: "FC — simulatore a 60 bpm", unit: "bpm", expected: "60 ±1%", limitVal: 61, limitMin: 59, value: "" },
{ id: "fc_sim120", name: "FC — simulatore a 120 bpm", unit: "bpm", expected: "120 ±1%", limitVal: 122, limitMin: 118, value: "" },
]
},
{
id: "sync", title: "Cardioversione sincronizzata (se disponibile)",
note: "OPZIONALE se presente — ritardo R → scarica < 60 ms (IEC 60601-2-4 cl.201.12.4.4).",
items: [
{ id: "sync_attiva", text: "Modalità SYNC: attivabile, indicatore visivo presente" },
{ id: "sync_marker", text: "Marker sincronismo sull'onda R: visibile sul tracciato" },
{ id: "sync_auto_off", text: "Disattivazione automatica SYNC dopo scarica: confermata" },
],
measures: [
{ id: "sync_delay", name: "Ritardo scarica dal picco R", unit: "ms", expected: "< 60 ms", limitVal: 60, value: "" },
]
},
{
id: "pacing", title: "Pacing esterno transcutaneo (se presente)",
note: "OPZIONALE — compilare solo se il dispositivo dispone di funzione pacing.",
items: [
{ id: "pacing_attiva", text: "Modalità pacing: attivabile" },
{ id: "pacing_freq", text: "Frequenza pacing: selezionabile nel range indicato" },
{ id: "pacing_corrente", text: "Corrente stimolazione: selezionabile da min a max" },
{ id: "pacing_cattura", text: "Cattura ventricolare verificabile su simulatore ECG" },
]
},
]
},
// ─── DAE (IEC 60601-2-4 + D.Lgs. 53/2021 + Circ. Min. Salute 2021) ──────
"dae": {
label: "DAE — Defibrillatore Automatico Esterno", icon: "DAE", norm: "IEC 60601-2-4 / D.Lgs. 53/2021",
sections: [
{
id: "ispezione", title: "Ispezione visiva e stato operativo",
items: [
{ id: "contenitore", text: "Contenitore/zaino: integrità, chiusura funzionante" },
{ id: "segnalatore", text: "Segnalatore di pronto intervento (luce/LED verde): attivo e visibile" },
{ id: "involucro", text: "Involucro DAE: privo di danni, sporco o umidità" },
{ id: "display", text: "Display/segnalazioni vocali: funzionanti" },
{ id: "pad_adulti", text: "Pad adulti: non scaduti, confezionamento integro, connettore OK" },
{ id: "pad_pediatrici", text: "Pad pediatrici/riduttore (se presenti): non scaduti, integri" },
{ id: "accessori", text: "Accessori kit (forbici, rasoio, guanti, garze, maschera RCP): presenti" },
]
},
{
id: "batteria", title: "Batteria e self-test",
note: "La maggior parte dei DAE moderni esegue un self-test giornaliero/settimanale automatico. Verificare il log del self-test è sufficiente per il controllo periodico — NON è necessario eseguire una scarica di test (spreca batteria e non è richiesta dalla norma per la verifica ordinaria).",
items: [
{ id: "batt_scad", text: "Data scadenza batteria: non superata" },
{ id: "batt_status", text: "Indicatore stato batteria: OK / pronto" },
{ id: "autotest_ok", text: "Risultato ultimo self-test automatico (log di sistema): PASS — nessun allarme" },
{ id: "data_autotest", text: "Data ultimo self-test: recente (entro i cicli del costruttore)" },
],
measures: [
{ id: "batt_perc", name: "Carica residua batteria (se leggibile dal display)", unit: "%", expected: "≥ 80% (se indicato)", value: "" },
]
},
{
id: "funz_dae", title: "Verifica funzionale con simulatore ECG (OPZIONALE)",
note: "OPZIONALE — Eseguire solo se si dispone di un simulatore ECG compatibile (es. Fluke Impulse, Rigel 322, ecc.). NON eseguire scarica reale senza carico resistivo certificato: spreca batteria. Il self-test del costruttore sostituisce questo controllo nella manutenzione ordinaria.",
items: [
{ id: "analisi_fv", text: "Analisi ritmo FV/TV: DAE consiglia scarica correttamente (su simulatore)" },
{ id: "analisi_rns", text: "Analisi ritmo sinusale normale: DAE NON consiglia scarica (su simulatore)" },
{ id: "guida_vocale", text: "Guida vocale durante procedura: chiara e nella lingua corretta" },
{ id: "segnale_cpr", text: "Guida RCP post-scarica: presente (se previsto dal modello)" },
]
},
{
id: "energia_dae", title: "Verifica energia erogata (OPZIONALE — solo manutenzione straordinaria)",
note: "OPZIONALE — Richiede analizzatore su carico 50 Ω certificato. Tolleranza ±15% o ±3J. Eseguire solo in caso di dubbio sull'erogazione, post-riparazione, o se richiesto dal cliente. NON necessario nella PPM ordinaria se il self-test è OK.",
items: [
{ id: "scarica_ok", text: "Scarica su carico resistivo 50 Ω: eseguita correttamente" },
],
measures: [
{ id: "e_scarica1", name: "Energia 1ª scarica", unit: "J", expected: "secondo costruttore ±15% o ±3J", value: "" },
{ id: "e_scarica2", name: "Energia 2ª scarica (se escalation)", unit: "J", expected: "secondo costruttore ±15%", value: "" },
]
},
{
id: "registro", title: "Registro e documentazione",
items: [
{ id: "log_ok", text: "Log eventi/self-test scaricato e verificato: nessun allarme anomalo" },
{ id: "posizione", text: "Segnaletica posizione DAE: visibile, corretta, non ostruita" },
{ id: "registro_aggiornato", text: "Registro manutenzioni aggiornato con data e firma tecnico" },
]
},
]
},
// ─── ASPIRATORE CHIRURGICO (ISO 10079-1:2015) ────────────────────────────
"aspiratore_chirurgico": {
label: "Aspiratore chirurgico / da secreti", icon: "ASP", norm: "ISO 10079-1:2015",
note: "Test minimi richiesti dalla norma. Spunta solo quelli applicabili al modello in uso.",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro, spina OK" },
{ id: "involucro", text: "Involucro e carrello (se presente): integrità strutturale" },
{ id: "tubazioni", text: "Tubazioni, raccordi e connettori: integri, senza cricche o occlusioni" },
{ id: "filtro_batt", text: "Filtro batterico/idrofobico: presente, non scaduto, non otturato" },
{ id: "contenitore", text: "Contenitore liquidi: integro, guarnizioni OK" },
{ id: "overflow", text: "Dispositivo protezione overflow (se presente): funzionante" },
{ id: "valvola_sic", text: "Valvola di sicurezza/limitatore di pressione (se presente)" },
]
},
{
id: "vuoto", title: "Verifica del vuoto (ISO 10079-1 cl.5.2)",
note: "Misurare a uscita paziente otturata. Limite dipende dalla classe del dispositivo (vedi etichetta/manuale).",
items: [
{ id: "otturazione", text: "Occlusione dell'uscita paziente: corretta per test" },
],
measures: [
{ id: "vuoto_max", name: "Vuoto massimo (contenitore chiuso)", unit: "kPa", units: ["kPa", "mmHg", "cmH2O", "mbar"], expected: "come da specifiche costruttore", value: "" },
{ id: "t_vuoto", name: "Tempo raggiungimento vuoto max (opzionale)", unit: "s", expected: "come specifiche", value: "" },
{ id: "regolazione", name: "Regolazione depressione (verifica scala)", unit: "kPa", units: ["kPa", "mmHg", "cmH2O", "mbar"], expected: "regolabile su tutta la scala", value: "" },
]
},
{
id: "portata", title: "Portata (solo aspiratori chirurgici alta portata)",
note: "OPZIONALE — eseguire solo se richiesto dal costruttore o se il dispositivo è aspiratore chirurgico alta portata. Aspiratori da secreti/cliniche standard: saltare questa sezione.",
measures: [
{ id: "portata_lib", name: "Portata libera a 0 kPa", unit: "L/min", expected: "come specifiche costruttore", value: "" },
]
},
{
id: "batteria_asp", title: "Batteria (solo dispositivi portatili)",
note: "OPZIONALE — solo per dispositivi portatili con batteria interna.",
items: [
{ id: "batt_scad", text: "Batteria: non scaduta, carica adeguata" },
{ id: "autonomia", text: "Autonomia su batteria: sufficiente per uso previsto" },
],
measures: [
{ id: "batt_perc", name: "Carica residua", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
]
},
]
},
// ─── ELETTROBISTURI HF (IEC 60601-2-2:2017) ─────────────────────────────
"elettrobisturi": {
label: "Elettrobisturi / Unità HF chirurgica", icon: "ESU", norm: "IEC 60601-2-2:2017",
sections: [
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integrità isolamento" },
{ id: "involucro", text: "Involucro: privo di danni, ventilazione libera" },
{ id: "cavi_att", text: "Cavi elettrodi attivi (monopolare/bipolare): isolamento integro, connettori OK" },
{ id: "elettrodo_n", text: "Elettrodo neutro (piastra): integrità, connettore, cavo" },
{ id: "pedale", text: "Pedale di comando (se presente): funzionante, cavo integro" },
{ id: "etichette", text: "Etichette potenza, avvertenze e classe: leggibili" },
]
},
{
id: "funz_hf", title: "Verifica funzionale",
items: [
{ id: "accensione", text: "Accensione: nessun allarme anomalo" },
{ id: "display", text: "Display potenza e modalità: corretto" },
{ id: "sel_modo", text: "Selezione modalità (CUT/COAG/BLEND): funzionante" },
{ id: "attivazione", text: "Attivazione manuale e pedale: funzionanti" },
{ id: "allarme_en", text: "Allarme elettrodo neutro disconnesso: attivo (IEC 60601-2-2 cl.201.8.4)" },
]
},
{
id: "potenza", title: "Verifica potenza erogata (IEC 60601-2-2 cl.201.12.4.101)",
note: "Misurare con analizzatore HF certificato su carico resistivo 300 Ω (monopolare standard). Tolleranza: ±20% della potenza selezionata. Annotare il valore impostato nel nome della misura. Verificare almeno un livello basso e uno alto per CUT e un livello per COAG.",
items: [
{ id: "carico_300", text: "Analizzatore su carico resistivo 300 Ω (monopolare standard)" },
],
measures: [
{ id: "p_cut_low", name: "Potenza CUT — livello basso (impostato: ___ W)", unit: "W", expected: "±20% del valore selezionato", value: "" },
{ id: "p_cut_high", name: "Potenza CUT — livello alto (impostato: ___ W)", unit: "W", expected: "±20% del valore selezionato", value: "" },
{ id: "p_coag", name: "Potenza COAG — livello rappresentativo", unit: "W", expected: "±20% del valore selezionato", value: "" },
{ id: "p_bip", name: "Potenza BIPOLARE (se presente)", unit: "W", expected: "secondo costruttore ±20%", value: "" },
{ id: "i_hf_leak", name: "Corrente di perdita HF (IEC 60601-2-2 cl.202.8.4)", unit: "mA", expected: "< 150 mA", limitVal: 150, value: "" },
]
},
]
},
// ─── MONITOR MULTIPARAMETRICO (IEC 60601-2-27/30/49, ISO 80601-2-61) ────
"monitor_multipar": {
label: "Monitor multiparametrico", icon: "MON", norm: "IEC 60601-2-27/30/49 · ISO 80601-2-61",
sections: [
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro" },
{ id: "involucro", text: "Involucro e schermo: privi di danni, schermo leggibile" },
{ id: "cavi_paz", text: "Cavi paziente (ECG, SpO2, NIBP, temperatura): integrità e connettori" },
{ id: "manicotti", text: "Manicotti NIBP: integrità, assenza perdite d'aria" },
{ id: "sensori", text: "Sensori SpO2 e temperatura: condizioni operative OK" },
]
},
{
id: "ecg_mon", title: "ECG (IEC 60601-2-27)",
note: "Tolleranza FC: ±1% del valore visualizzato oppure ±1 bpm (il maggiore dei due).",
items: [
{ id: "tracciato", text: "Tracciato ECG con simulatore: morfologia corretta, assenza artefatti" },
{ id: "derivazioni", text: "Selezione derivazioni: tutte funzionanti (almeno I, II, III)" },
{ id: "allarmi_fc", text: "Allarmi FC alta/bassa: attivazione nei limiti impostati" },
{ id: "st_analisi", text: "Analisi del tratto ST (se presente): visualizzazione corretta" },
],
measures: [
{ id: "fc_30", name: "FC — simulatore 30 bpm", unit: "bpm", expected: "30 ±1 bpm", limitVal: 31, limitMin: 29, value: "" },
{ id: "fc_60", name: "FC — simulatore 60 bpm", unit: "bpm", expected: "60 ±1 bpm", limitVal: 61, limitMin: 59, value: "" },
{ id: "fc_120", name: "FC — simulatore 120 bpm", unit: "bpm", expected: "120 ±1 bpm", limitVal: 121, limitMin: 119, value: "" },
{ id: "fc_200", name: "FC — simulatore 200 bpm", unit: "bpm", expected: "200 ±1% o ±1 bpm", limitVal: 202, limitMin: 198, value: "" },
]
},
{
id: "spo2", title: "SpO₂ (ISO 80601-2-61)",
note: "Accuratezza richiesta: ±3% ARMS nel range 70–100% SaO2.",
items: [
{ id: "spo2_display", text: "Visualizzazione SpO2 e curva pletismografica: corretta" },
{ id: "spo2_allarmi", text: "Allarmi SpO2 bassa: attivazione corretta" },
],
measures: [
{ id: "spo2_98", name: "SpO2 — simulatore 98%", unit: "%", expected: "98 ±3% (95–100)", limitVal: 100, limitMin: 95, value: "" },
{ id: "spo2_90", name: "SpO2 — simulatore 90%", unit: "%", expected: "90 ±3% (87–93)", limitVal: 93, limitMin: 87, value: "" },
{ id: "spo2_80", name: "SpO2 — simulatore 80%", unit: "%", expected: "80 ±3% (77–83)", limitVal: 83, limitMin: 77, value: "" },
{ id: "fc_spo2", name: "FC da SpO2 — simulatore 60 bpm", unit: "bpm", expected: "60 ±3 bpm", limitVal: 63, limitMin: 57, value: "" },
]
},
{
id: "nibp", title: "NIBP — PA non invasiva (IEC 60601-2-30)",
note: "Errore medio ≤ 5 mmHg, deviazione standard ≤ 8 mmHg (IEC 60601-2-30 cl.201.12.1.101).",
items: [
{ id: "gonfiaggio", text: "Gonfiaggio e sgonfiaggio automatico: corretto" },
{ id: "allarmi_pa", text: "Allarmi PA alta/bassa: attivazione corretta" },
{ id: "modalita", text: "Modalità manuale, automatica e STAT: funzionanti" },
],
measures: [
{ id: "pa_sis_120", name: "PA sistolica — riferimento 120 mmHg", unit: "mmHg", units: ["mmHg", "kPa"], expected: "120 ±5 mmHg (115–125)", limitVal: 125, limitMin: 115, value: "" },
{ id: "pa_dias_80", name: "PA diastolica — riferimento 80 mmHg", unit: "mmHg", units: ["mmHg", "kPa"], expected: "80 ±5 mmHg (75–85)", limitVal: 85, limitMin: 75, value: "" },
{ id: "pa_map_93", name: "PA media (MAP) — riferimento 93 mmHg", unit: "mmHg", units: ["mmHg", "kPa"], expected: "93 ±5 mmHg", limitVal: 98, limitMin: 88, value: "" },
]
},
{
id: "temp", title: "Temperatura (IEC 60601-2-56)",
note: "Accuratezza richiesta: ±0.3°C nel range clinico 35–42°C.",
measures: [
{ id: "temp_37", name: "Temperatura — riferimento 37.0°C", unit: "°C", expected: "37.0 ±0.3°C (36.7–37.3)", limitVal: 37.3, limitMin: 36.7, value: "" },
{ id: "temp_39", name: "Temperatura — riferimento 39.0°C", unit: "°C", expected: "39.0 ±0.3°C (38.7–39.3)", limitVal: 39.3, limitMin: 38.7, value: "" },
]
},
{
id: "allarmi_mon", title: "Sistema allarmi (IEC 60601-1-8)",
note: "IEC 60601-1-8 impone che tutti gli allarmi di priorità alta siano visivi E acustici.",
items: [
{ id: "allarme_vis", text: "Allarmi alta priorità: segnalazione visiva (lampeggio rosso) presente" },
{ id: "allarme_ac", text: "Allarmi alta priorità: segnalazione acustica presente e udibile" },
{ id: "allarme_sil", text: "Silenziamento allarmi: funzionante con ripristino automatico" },
{ id: "allarme_tecn", text: "Allarmi tecnici (guasto tecnico, batteria scarica): attivazione corretta" },
]
},
{
id: "etco2", title: "etCO₂ (ISO 80601-2-55) — se presente",
measures: [
{ id: "etco2_val", name: "etCO2 — gas di riferimento (es. 38 mmHg)", unit: "mmHg", units: ["mmHg", "kPa"], expected: "±2 mmHg o ±8%", value: "" },
{ id: "fr_etco2", name: "FR da capnografia", unit: "atti/min", expected: "±1 atto/min", value: "" },
]
},
]
},
// ─── VENTILATORE POLMONARE (ISO 80601-2-12:2020) ─────────────────────────
"ventilatore": {
label: "Ventilatore polmonare (terapia intensiva)", icon: "VEN", norm: "ISO 80601-2-12:2020",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri" },
{ id: "involucro", text: "Involucro: privo di danni, ventilazione libera" },
{ id: "circuito", text: "Circuito paziente: integrità tubi, raccordi, valvole espiratoria/inspiratoria" },
{ id: "filtri", text: "Filtri (antibatterico, HMEF): presenti e non scaduti" },
{ id: "sensori_fl", name: "Sensori di flusso e pressione: puliti, non otturati" },
{ id: "umidif", text: "Umidificatore (se presente): livello acqua corretto, integro" },
{ id: "polmone_test", text: "Polmone test per calibrazione: disponibile" },
{ id: "o2_supply", text: "Alimentazione O2 e aria compressa: pressione corretta (3.5–6 bar)" },
]
},
{
id: "calibrazione", title: "Calibrazione e autotest",
items: [
{ id: "autotest", text: "Autotest all'accensione: superato senza errori" },
{ id: "calib_fluido", text: "Calibrazione sensori di flusso: eseguita secondo costruttore" },
{ id: "test_tenuta", text: "Test tenuta circuito (leak test): perdita entro specifiche costruttore" },
{ id: "calib_o2", text: "Calibrazione cella O2 (se applicabile): eseguita" },
]
},
{
id: "parametri", title: "Verifica accuratezza parametri erogati (ISO 80601-2-12 cl.201.12.4)",
note: "ISO 80601-2-12: VT ±10% o ±10 mL; FR ±1 atto/min; PEEP ±2 cmH2O; FiO2 ±3%; Ppeak ±4% o ±2 cmH2O.",
items: [
{ id: "connessione", text: "Ventilatore connesso al polmone test" },
],
measures: [
{ id: "vt_500", name: "Volume corrente erogato (impostato 500 mL)", unit: "mL", expected: "500 ±10% (450–550)", limitVal: 550, limitMin: 450, value: "" },
{ id: "fr_15", name: "Frequenza respiratoria (impostata 15 a/min)", unit: "atti/min", expected: "15 ±1 (14–16)", limitVal: 16, limitMin: 14, value: "" },
{ id: "peep_5", name: "PEEP (impostata 5 cmH2O)", unit: "cmH2O", units: ["cmH2O", "mbar", "mmHg", "kPa", "hPa"], expected: "5 ±2 (3–7)", limitVal: 7, limitMin: 3, value: "" },
{ id: "peep_10", name: "PEEP (impostata 10 cmH2O)", unit: "cmH2O", units: ["cmH2O", "mbar", "mmHg", "kPa", "hPa"], expected: "10 ±2 (8–12)", limitVal: 12, limitMin: 8, value: "" },
{ id: "fio2_40", name: "FiO2 (impostata 40%)", unit: "%", expected: "40 ±3% (37–43)", limitVal: 43, limitMin: 37, value: "" },
{ id: "fio2_100", name: "FiO2 (impostata 100%)", unit: "%", expected: "100 ±3% (97–100)", limitVal: 100, limitMin: 97, value: "" },
{ id: "ppeak", name: "Pressione di picco inspiratoria", unit: "cmH2O", units: ["cmH2O", "mbar", "mmHg", "kPa", "hPa"], expected: "±4% o ±2 cmH2O del valore misurato", value: "" },
]
},
{
id: "allarmi_vent", title: "Allarmi (ISO 80601-2-12 + IEC 60601-1-8)",
note: "Allarmi obbligatori per ventilatori TI: disconnessione, alta pressione, apnea, alimentazione gas, O2.",
items: [
{ id: "alarm_disc", text: "Allarme DISCONNESSIONE paziente: attivazione < 15 s" },
{ id: "alarm_press", text: "Allarme ALTA PRESSIONE: attivazione al superamento del limite impostato" },
{ id: "alarm_apnea", text: "Allarme APNEA: attivazione entro il tempo impostato (default 20 s)" },
{ id: "alarm_o2", text: "Allarme MANCANZA O2/ARIA: attivazione corretta" },
{ id: "alarm_power", text: "Allarme MANCANZA ALIMENTAZIONE elettrica: attivazione" },
{ id: "batt_vent", text: "Autonomia su batteria interna: sufficiente (≥ 30 min o secondo costruttore)" },
{ id: "alarm_fio2", text: "Allarme FiO2 bassa/alta: attivazione corretta (se presente)" },
]
},
]
},
// ─── POMPA INFUSIONALE (IEC 60601-2-24:2012) ─────────────────────────────
"pompa_infusionale": {
label: "Pompa infusionale / siringa elettrica", icon: "POM", norm: "IEC 60601-2-24:2012",
sections: [
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro" },
{ id: "involucro", text: "Involucro: privo di danni, slot siringa/sacca funzionante" },
{ id: "display", text: "Display e tastiera: leggibili e funzionanti" },
{ id: "porta_set", text: "Porta set infusionale / sede siringa: pulizia, usura meccanismo" },
{ id: "sensori", text: "Sensori aria in linea e occlusione: presenti e attivi" },
]
},
{
id: "accuratezza", title: "Accuratezza portata (IEC 60601-2-24 cl.201.12.4.101)",
note: "IEC 60601-2-24: errore portata ≤ ±5% dopo periodo di stabilizzazione (almeno 1h a portata nominale — non misurare nelle prime fasi di avvio). Misurare con metodo gravimetrico (bilancia ±0.01g) o contagocce calibrato.",
items: [
{ id: "metodo_grav", text: "Metodo di misura: gravimetrico (bilancia ±0.01 g) o contagocce calibrato" },
],
measures: [
{ id: "q_5", name: "Portata — impostata 5 mL/h", unit: "mL/h", expected: "5 ±5% (4.75–5.25)", limitVal: 5.25, limitMin: 4.75, value: "" },
{ id: "q_25", name: "Portata — impostata 25 mL/h", unit: "mL/h", expected: "25 ±5% (23.75–26.25)", limitVal: 26.25, limitMin: 23.75, value: "" },
{ id: "q_100", name: "Portata — impostata 100 mL/h", unit: "mL/h", expected: "100 ±5% (95–105)", limitVal: 105, limitMin: 95, value: "" },
{ id: "q_kvo", name: "Portata KVO (Keep Vein Open)", unit: "mL/h", expected: "1–5 mL/h (secondo costruttore)", value: "" },
]
},
{
id: "allarmi_pompa", title: "Allarmi (IEC 60601-2-24 + IEC 60601-1-8)",
items: [
{ id: "alarm_occ", text: "Allarme OCCLUSIONE a valle: attivazione entro pressione specificata dal costruttore" },
{ id: "alarm_aria", text: "Allarme ARIA IN LINEA: attivazione con bolla ≥ 50 µL (se presente sensore)" },
{ id: "alarm_fine", text: "Allarme FINE INFUSIONE / SIRINGA QUASI VUOTA: attivazione corretta" },
{ id: "alarm_batt", text: "Allarme BATTERIA SCARICA: attivazione con preavviso adeguato" },
{ id: "alarm_porta", text: "Allarme PORTA APERTA / SIRINGA RIMOSSA: attivazione immediata" },
]
},
{
id: "batteria_pompa", title: "Batteria",
items: [
{ id: "batt_scad", text: "Batteria: non scaduta" },
],
measures: [
{ id: "batt_perc", name: "Carica residua", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
{ id: "autonomia_h", name: "Autonomia su batteria", unit: "h", expected: "≥ 4 h (o secondo costruttore)", limitVal: 4, invertPass: true, value: "" },
]
},
]
},
// ─── ECOGRAFO (IEC 60601-2-37:2007+AMD1:2015) ────────────────────────────
"ecografo": {
label: "Ecografo", icon: "ECO", norm: "IEC 60601-2-37:2007+AMD1:2015",
sections: [
{
id: "ispezione", title: "Ispezione visiva",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro" },
{ id: "involucro", text: "Carrello/console: integrità strutturale, stabilità" },
{ id: "sonde", text: "Sonde: nessuna cricca, scheggia o delaminazione del trasduttore" },
{ id: "cavi_sonde", text: "Cavi sonde: isolamento integro, connettori puliti e funzionanti" },
{ id: "monitor", text: "Monitor: nessun pixel morto, luminosità adeguata" },
{ id: "gel", text: "Gel ecografico: disponibile e adeguato" },
]
},
{
id: "funz_eco", title: "Verifica funzionale",
note: "Usare fantoccio ecografico (phantom) per verifica accuratezza. Se non disponibile, documentare verifica su soggetto/mano.",
items: [
{ id: "accensione", text: "Accensione: nessun errore, autotest OK" },
{ id: "b_mode", text: "Modalità B-mode: immagine acquisita, risoluzione adeguata" },
{ id: "m_mode", text: "Modalità M-mode (se presente): tracciato tempo/movimento corretto" },
{ id: "doppler_col", text: "Color Doppler (se presente): flusso visualizzato correttamente" },
{ id: "doppler_pw", text: "PW/CW Doppler (se presente): spettro Doppler corretto" },
{ id: "misure", text: "Misure caliper (distanza/area): funzionanti" },
{ id: "stampa_arch", text: "Stampa/archiviazione immagini: funzionante" },
{ id: "selezione_sonde", text: "Selezione sonde (se multiple): tutte riconosciute" },
]
},
{
id: "phantom", title: "Verifica con fantoccio — OPZIONALE",
note: "OPZIONALE — Eseguire solo se disponibile fantoccio calibrato. In assenza di fantoccio, documentare verifica su soggetto/mano nella sezione funzionale. Risoluzione assiale/laterale e accuratezza distanze.",
measures: [
{ id: "dist_10mm", name: "Distanza misurata — target 10 mm", unit: "mm", expected: "10 ±1 mm (±10%)", limitVal: 11, limitMin: 9, value: "" },
{ id: "dist_50mm", name: "Distanza misurata — target 50 mm", unit: "mm", expected: "50 ±5 mm (±10%)", limitVal: 55, limitMin: 45, value: "" },
{ id: "profondita", name: "Profondità massima immagine", unit: "cm", expected: "secondo costruttore", value: "" },
]
},
]
},
// ─── LETTO ELETTRICO / BARELLA MOTORIZZATA (IEC 60601-2-38:2014) ─────────
"letto_elettrico": {
label: "Letto elettrico / barella motorizzata", icon: "LET", norm: "IEC 60601-2-38:2014",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri, nessun danno" },
{ id: "struttura", text: "Struttura, sponde e materasso: integrità, nessun spigolo tagliente" },
{ id: "freni", text: "Freni ruote: funzionanti su tutti i punti di frenatura" },
{ id: "comandi", text: "Comandi paziente e infermiere: tutti funzionanti, etichettati" },
{ id: "cavo_comandi", text: "Cavo telecomando: integro, connettore OK" },
{ id: "fine_corsa", text: "Fine corsa meccanici e elettrici: presenti e funzionanti" },
{ id: "giunti", text: "Giunti, snodi e meccanismi di articolazione: lubrificati, nessun gioco anomalo" },
]
},
{
id: "movimenti", title: "Verifica movimenti (IEC 60601-2-38 cl.201.15)",
note: "Verificare assenza di movimenti inattesi, vibrazioni, rumori anomali. Velocità massima limitata da norma.",
items: [
{ id: "schienale_su", text: "Alzata schienale: movimento fluido, senza scatti, fine corsa funzionante" },
{ id: "schienale_giu", text: "Abbassamento schienale: corretto" },
{ id: "trendelenburg", text: "Trendelenburg (se presente): movimento fluido, fine corsa OK" },
{ id: "antitrendel", text: "Anti-Trendelenburg (se presente): corretto" },
{ id: "alzata_letto", text: "Alzata/abbassamento altezza letto: fluido, nessun bloccaggio" },
{ id: "sponde_el", text: "Sponde elettriche (se presenti): alzata/abbassamento corretti" },
{ id: "posizione_card", text: "Posizione cardiaca/sedia (se presente): funzionante" },
{ id: "posizione_prone", text: "Posizione prona (se presente): corretta" },
],
measures: [
{ id: "altezza_min", name: "Altezza minima dal suolo", unit: "cm", expected: "≤ 40 cm (accessibilità)", value: "" },
{ id: "altezza_max", name: "Altezza massima dal suolo", unit: "cm", expected: "secondo costruttore", value: "" },
{ id: "angolo_schienale", name: "Angolo massimo schienale", unit: "°", expected: "≥ 75°", limitVal: 75, invertPass: true, value: "" },
]
},
{
id: "sicurezza_letto", title: "Sicurezza e carichi",
items: [
{ id: "carico_max", text: "Carico massimo: etichetta presente e leggibile" },
{ id: "arresto_emerg", text: "Tasto di arresto emergenza (se presente): funzionante" },
{ id: "sovraccarico", text: "Protezione da sovraccarico: attiva" },
{ id: "cpe", text: "Sistema CPR/RCP (tasto emergenza schienale piatto): funzionante e raggiungibile" },
]
},
]
},
// ─── APPARECCHIO GENERICO ─────────────────────────────────────────────────
"generico": {
label: "Apparecchio generico", icon: "›", norm: "IEC 60601-1 generale",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione e spina: integri" },
{ id: "involucro", text: "Involucro: privo di danni meccanici visibili" },
{ id: "acc", text: "Accessori e cavi paziente: integrità isolamento e connettori" },
{ id: "etichette", text: "Etichette identificazione, classe, tensione: presenti e leggibili" },
{ id: "ventilazione", text: "Aperture di ventilazione: libere, non ostruite" },
]
},
{
id: "funz_gen", title: "Verifica funzionale generale",
items: [
{ id: "accensione", text: "Accensione regolare: nessun messaggio di errore" },
{ id: "autotest", text: "Autotest (se previsto): superato" },
{ id: "funzione_1", text: "Funzione principale 1: operativa e conforme alle specifiche" },
{ id: "funzione_2", text: "Funzione principale 2: operativa" },
{ id: "allarmi", text: "Sistema allarmi: funzionante (visivo e acustico)" },
{ id: "display", text: "Display e interfaccia: leggibili e funzionanti" },
]
},
{
id: "misure_gen", title: "Misure (compilare secondo tipo apparecchio)",
measures: [
{ id: "misura_1", name: "Misura 1 (specificare)", unit: "", expected: "secondo costruttore", value: "" },
{ id: "misura_2", name: "Misura 2 (specificare)", unit: "", expected: "secondo costruttore", value: "" },
{ id: "misura_3", name: "Misura 3 (specificare)", unit: "", expected: "secondo costruttore", value: "" },
]
},
]
},
};
const FUNC_TEMPLATE_MAP = [
{ keys: ["defibrillatore manuale", "defib manual", "cardioversore"], id: "defibrillatore" },
{ keys: ["dae", "aed", "defibrillatore automatico", "defibrillatore semiautomatico"], id: "dae" },
{ keys: ["aspiratore chirurgico", "aspiratore mucosità", "aspiratore secreti", "aspiratore"], id: "aspiratore_chirurgico" },
{ keys: ["elettrobisturi", "bisturi elettrico", "hf chirurgico", "chirurgia hf"], id: "elettrobisturi" },
{ keys: ["monitor multipar", "monitor paziente", "multiparametrico", "bedside monitor"], id: "monitor_multipar" },
{ keys: ["ventilatore", "respiratore", "polmonare"], id: "ventilatore" },
{ keys: ["pompa infus", "siringa infus", "infusore", "syringe pump"], id: "pompa_infusionale" },
{ keys: ["ecografo", "ecografia", "ultrasound"], id: "ecografo" },
{ keys: ["letto elettr", "barella motor"], id: "letto_elettrico" },
];
function guessTemplate(assetName) {
if (!assetName)
return "generico";
const n = assetName.toLowerCase();
for (const { keys, id } of FUNC_TEMPLATE_MAP) {
if (keys.some(k => n.includes(k)))
return id;
}
return "generico";
}
/* ═══ HELP TAB COMPONENT ════════════════════════════════════════ */
const HELP_SECTIONS = [
{
icon: "◈", title: "Dashboard", color: "#2DD4BF",
steps: [
"La dashboard mostra i KPI principali: apparecchi, job aperti, urgenti, fatture, verifiche, stock basso, strumenti in scadenza.",
"TUTTE le card sono cliccabili — tocca una card per andare alla sezione corrispondente.",
"Il grafico a barre mostra i ricavi mensili dell'anno selezionato.",
]
},
{
icon: "›", title: "Apparecchi", color: "#2DD4BF",
steps: [
"Ogni riga ha 3 bottoni: SCHEDA (dettaglio completo), SIC.EL. (verifica sicurezza elettrica), FUNZ. (verifica funzionale).",
"Doppio click su una riga apre la Scheda Dettaglio con tabs: dati tecnici, job, verifiche.",
"Compila: Classe di rischio, Norma IEC, Data acquisto, Scadenza garanzia, Prossimo servizio, Intervallo manutenzione.",
"Il badge colorato mostra i giorni alla prossima manutenzione (verde/arancione/rosso).",
]
},
{
icon: "›", title: "Job / Interventi", color: "#f59e0b",
steps: [
"Un Job è qualsiasi intervento: correttivo, preventivo, verifica, calibrazione.",
"Aggiungi step datati nella Timeline (arrivo, diagnosi, riparazione, collaudo).",
"Aggiungi parti usate — il totale viene calcolato automaticamente.",
"Clicca PDF per scaricare il rapporto dell'intervento.",
]
},
{
icon: "›", title: "Verifiche di Sicurezza Elettrica", color: "#2DD4BF",
steps: [
"Scegli norma (IEC 62353 per elettromedicali, IEC 61010 per laboratorio), classe (I/II/III) e tipo paziente (B/BF/CF).",
"I limiti seguono la Tabella 2 della IEC 62353:2014 e cambiano automaticamente in base a Classe, tipo paziente e METODO scelto.",
"METODO DI MISURA: Direct (diretto, misura reale a terra — ideale stanze standard), Differential (differenziale, misura sbilanciamento L/N — usabile su tutte le stanze inclusi ambulatori IT isolati), Alternative (alternativo, simile a prova dielettrica con DUT spento).",
"EQUIPMENT LEAKAGE Classe I: ≤ 500 µA (Direct/Differential), ≤ 1000 µA (Alternative). Classe II: ≤ 100 µA (Direct/Differential), ≤ 500 µA (Alternative).",
"APPLIED PART LEAKAGE (corrente dispersione parte applicata, solo F-type): BF ≤ 5000 µA, CF ≤ 50 µA. Type B non ha questo test (parte non isolata).",
"Per Classe I si misura anche resistenza PE (≤ 0.3 Ω) e isolamento (≥ 2 MΩ). Classe III: solo isolamento + dispersione parte applicata se F-type.",
"Ogni misura mostra PASS ✓ o FAIL ✗ in tempo reale mentre inserisci il valore.",
"Se hai strumenti registrati in Strumenti Misura, puoi selezionarli dal dropdown — si auto-compila il campo tester.",
"Salvando si crea un Job collegato e si aggiorna il Prossimo Servizio a +1 anno.",
"Scarica PDF direttamente sul dispositivo.",
]
},
{
icon: "›", title: "Verifiche Funzionali", color: "#0D9488",
steps: [
"Template disponibili (normativa in parentesi): Defibrillatore (IEC 60601-2-4), DAE (D.Lgs.53/2021), Aspiratore (ISO 10079-1), Elettrobisturi (IEC 60601-2-2), Monitor (IEC 60601-2-27/30/49), Ventilatore (ISO 80601-2-12), Pompa infusionale (IEC 60601-2-24), Ecografo (IEC 60601-2-37), Letto elettrico (IEC 60601-2-38), Generico.",
"Il template viene auto-rilevato dal nome dell'apparecchio selezionato.",
"Se hai strumenti registrati puoi selezionarli dal dropdown per auto-compilare il campo tester.",
"UNITÀ DI MISURA INTERCAMBIABILI: per le misure di pressione (vuoto, PEEP, Ppeak, PNI, ecc.) puoi cliccare sull'unità mostrata a fianco del valore e cambiarla — kPa, mmHg, cmH2O, mbar, hPa sono interconvertibili e il pass/fail viene ricalcolato in automatico.",
"SEZIONI OPZIONALI: alcuni test (es. portata aspiratore, batteria per dispositivi non portatili) sono marcati come opzionali nella nota della sezione. Spunta solo i test applicabili al modello specifico.",
"L'esito CONFORME/NON CONFORME si aggiorna automaticamente mentre compili.",
]
},
{
icon: "›", title: "Agenda & Scheduling", color: "#f59e0b",
steps: [
"Unifica in un unico posto: manutenzioni apparecchi, calibrazioni strumenti, job aperti.",
"Vista MESE: calendario con eventi colorati (teal=manutenzione, viola=calibrazione, grigio=job). Clicca un evento per andare alla sezione.",
"Vista LISTA: tutti gli eventi nei prossimi 60 giorni ordinati per data.",
"PIANO AUTOMATICO: 12 mesi con manutenzioni basate sul nextService (scadenza tecnica).",
"PIANO MANUALE: 12 mesi con la TUA pianificazione organizzativa — assegni ogni apparecchio al mese che vuoi, indipendentemente dalla scadenza tecnica.",
"Nel Piano Manuale puoi filtrare per categoria/ubicazione/cliente e fare bulk-assign (es. 'tutti i defibrillatori a marzo', 'tutta la rianimazione a maggio').",
"Filtra per tipo (Tutto / Manutenzioni / Calibrazioni / Job aperti) con i chip in cima.",
]
},
{
icon: "›", title: "Strumenti di Misura", color: "#a855f7",
steps: [
"Registra i tuoi strumenti di test: tester IEC, multimetri, simulatori paziente, analizzatori defibrillatori, ecc.",
"Per ogni strumento: marca, modello, seriale, matricola interna, categoria.",
"Gestione calibrazione: data ultima cal., laboratorio (ACCREDIA/SIT/interno), n° certificato, intervallo (6/12/24/36 mesi) — la scadenza si calcola automaticamente.",
"Semaforo automatico: verde (valido), arancione (scade entro 60gg), rosso (scaduto).",
"Bottone ↻ Rinnova: aggiorna data e certificato dopo la calibrazione annuale in pochi secondi.",
"Gli strumenti registrati appaiono come dropdown nelle verifiche IEC e funzionali per auto-compilare il campo tester.",
"Dashboard KPI: card 'Strumenti scaduti/in scad.' cliccabile.",
]
},
{
icon: "›", title: "Magazzino (Stock, Ordini, Scarichi)", color: "#a855f7",
steps: [
"Stock Parti: tieni traccia delle parti con quantità, costo acquisto e prezzo vendita.",
"Imposta la Quantità minima — le righe sotto soglia diventano gialle come alert.",
"Ordini Fornitori: crea un ordine e quando arriva clicca ✓ Ricevuto per aggiornare lo stock.",
"Scarichi: registra l'uscita manuale di parti collegandole a un apparecchio.",
]
},
{
icon: "›", title: "Fatture & Analytics", color: "#2DD4BF",
steps: [
"Crea fatture manualmente o importa le righe da un job esistente.",
"Stati: bozza → emessa → pagata. Clicca PDF per il documento professionale scaricabile.",
"Analytics: filtra per anno/mese per vedere ricavi, IVA, costo parti e margine lordo con grafico mensile.",
]
},
{
icon: "›", title: "Procedure Tecniche", color: "#2DD4BF",
steps: [
"Knowledge base interna stile iFixit: ogni procedura è una guida passo-passo per modello specifico.",
"Per ogni procedura definisci: marca/modello, categoria, tipo (PPM annuale, calibrazione, troubleshooting, ecc.), tempo stimato, strumenti necessari, ricambi tipici.",
"Passi numerati: ogni step ha titolo, descrizione dettagliata, valore atteso, avvertenza opzionale, 1 foto opzionale (max 3MB).",
"Riordina i passi con le frecce ↑↓, duplica una procedura intera per crearne una simile (es. variazione tra modelli simili).",
"Search rapido per modello/marca/categoria. Esempio: cerca 'Philips MRx' per vedere tutte le procedure su quel defibrillatore.",
"Le procedure sono il tuo know-how cristallizzato — invece di consultare ogni volta il service manual cartaceo, hai i tuoi appunti passo-passo sempre disponibili.",
"⚠ Limite localStorage: ~10MB totali. Tieni le foto leggere; per i manuali completi PDF, allega all'apparecchio o al job.",
]
},
{
icon: "›", title: "Backup e Ripristino", color: "#64748b",
steps: [
"Vai in Impostazioni (ingranaggio in fondo alla sidebar).",
"INDICATORE SPAZIO: vedi quanti MB stai usando del limite ~10 MB del browser. Sotto al 50% verde, sotto all'80% giallo, oltre rosso.",
"ESPORTA: scarica direttamente medtrace-backup-YYYY-MM-DD.json con TUTTI i dati (apparecchi, job, parti, clienti, fatture, verifiche, strumenti, allegati).",
"IMPORTA (sovrascrive): carica un .json — mostra preview statistiche e chiede conferma prima di sovrascrivere tutto.",
"UNISCI (aggiunge): aggiunge solo i record NUOVI dal file senza toccare i dati esistenti — utile per sincronizzare con un collega.",
"Esegui backup regolari — i dati sono nel browser e potrebbero perdersi svuotando la cache.",
]
},
{
icon: "›", title: "Allegati (PDF, foto, certificati)", color: "#a855f7",
steps: [
"Puoi caricare allegati in: Job (DDT esterno, foto riparazione), Strumenti (certificato calibrazione ACCREDIA/SIT), Verifiche IEC e Funzionali (test report esterno).",
"Tipi supportati: PDF, immagini (JPG/PNG), Word (.doc/.docx), Excel (.xls/.xlsx). Max 5MB per file.",
"Le immagini vengono compresse automaticamente (max 1200x1200) per risparmiare spazio.",
"Per ogni allegato puoi: scaricare ⬇, visualizzare (se immagine) 👁, eliminare ✕.",
"⚠ LIMITE: il browser permette ~10MB totali (vedi indicatore in Impostazioni). Quando ti avvicini al limite, esporta backup e considera di rimuovere allegati vecchi e pesanti.",
"Gli allegati sono inclusi nei backup JSON — non perderai nulla quando esporti/importi.",
]
},
{
icon: "›", title: "Export Excel", color: "#22c55e",
steps: [
"Da ogni sezione trovi il bottone ⬇ Excel in alto a destra.",
"Scarica direttamente un file .xlsx vero — niente copia-incolla.",
"Il file si apre in Excel, LibreOffice o Google Sheets con intestazioni in grassetto e colonne auto-dimensionate.",
]
},
{
icon: "›", title: "Legale & Privacy (GDPR)", color: "#94a3b8",
steps: [
"In Sistema → Legale & Privacy: informativa privacy, GDPR, termini di servizio, DMCA, note sul software.",
"Privacy-by-design: dati SOLO nel browser, nessun tracking, nessun server esterno.",
"Sei il titolare del trattamento dei dati dei tuoi clienti — rispetta il GDPR verso di loro.",
]
},
{
icon: "›", title: "Anteprima Portale Cliente", color: "#2DD4BF",
steps: [
"Vai in Impostazioni → 'Apri anteprima portale' per vedere l'app come la vedrebbe un tuo cliente.",
"Il portale è SOLO LETTURA — il cliente vede i suoi apparecchi, job in corso con timeline, rapporti IEC/funzionali, allegati scaricabili.",
"In modalità anteprima puoi switchare tra clienti diversi dal dropdown in alto per vedere la prospettiva di ognuno.",
"QUESTO È UNO SKELETON: per ora funziona offline con i tuoi dati locali. Quando attiveremo Supabase, ogni cliente avrà un link unico (es. medtrace.app/portale/abc123) per accedere da remoto in tempo reale.",
"Funzioni future con cloud: richieste intervento dal cliente con notifica email, dati live aggiornati al volo, multi-utente.",
]
},
{
icon: "›", title: "PWA — Installa come app", color: "#0D9488",
steps: [
"Android Chrome: banner 'Installa MedTrace' → tocca e installa.",
"iPhone Safari: tasto Condividi → Aggiungi a schermata Home.",
"Funziona offline dopo la prima apertura grazie al service worker.",
"Icona delle 3 onde teal sulla home come una vera app.",
]
},
];
function HelpTab({ helpOpen, setHelpOpen }) {
return (React.createElement("div", { style: { maxWidth: 860, margin: "0 auto" } },
React.createElement("div", { style: { marginBottom: 24 } },
React.createElement("h1", { style: { margin: "0 0 4px", fontSize: 22, fontWeight: 900, color: "#F0F0F5" } }, " Guida all'uso"),
React.createElement("p", { style: { color: "#5A5A70", margin: 0, fontSize: 13 } }, "Tutorial completo per usare MedTrace \u2014 clicca una sezione per espanderla")),
HELP_SECTIONS.map((section, si) => {
const isOpen = helpOpen[si] !== false && (helpOpen[si] === true || si === 0);
return (React.createElement("div", { key: si, style: { marginBottom: 10, background: "#141418", border: "1px solid #2A2A38", borderRadius: 12, overflow: "hidden" } },
React.createElement("button", { onClick: () => setHelpOpen(o => (Object.assign(Object.assign({}, o), { [si]: !isOpen }))), style: { width: "100%", background: "none", border: "none", padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, textAlign: "left" } },
React.createElement("span", { style: { fontSize: 20 } }, section.icon),
React.createElement("span", { style: { flex: 1, fontSize: 14, fontWeight: 700, color: "#F0F0F5" } }, section.title),
React.createElement("span", { style: { color: "#5A5A70", fontSize: 16, transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "none" } }, "\u25BE")),
isOpen && (React.createElement("div", { style: { padding: "0 18px 16px 18px", borderTop: "1px solid #2A2A38" } },
React.createElement("ol", { style: { margin: "12px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 } }, section.steps.map((step, i) => (React.createElement("li", { key: i, style: { fontSize: 13, color: "#9090A8", lineHeight: 1.6, paddingLeft: 4 } },
React.createElement("span", { style: { color: "#F0F0F5" } }, step)))))))));
}),
React.createElement("div", { style: { marginTop: 20, background: "#0D948818", border: "1px solid #0D948844", borderRadius: 10, padding: "14px 18px" } },
React.createElement("div", { style: { fontWeight: 700, color: "#2DD4BF", marginBottom: 6, fontSize: 13 } }, "Nota"),
React.createElement("p", { style: { color: "#9090A8", fontSize: 12, margin: 0, lineHeight: 1.7 } },
"Per ogni apparecchio il flusso ideale \u00E8: ",
React.createElement("strong", { style: { color: "#F0F0F5" } }, "1. Crea apparecchio"),
" \u2192 ",
React.createElement("strong", { style: { color: "#F0F0F5" } }, "2. Esegui Verifica Sicurezza Elettrica"),
" \u2192 ",
React.createElement("strong", { style: { color: "#F0F0F5" } }, "3. Esegui Verifica Funzionale"),
" \u2192 il sistema crea automaticamente i job e pianifica la manutenzione dell'anno successivo."))));
}
/* ═══ EXCEL TABLE + ALERT CHIP ═══════════════════════════════ */
const TH_S = { background: "#0F0F14", color: "#64748b", padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: .7, borderBottom: "2px solid #1e2a3a", borderRight: "1px solid #141e2e", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", position: "sticky", top: 0, zIndex: 2 };
const TD_S = { padding: "7px 10px", borderBottom: "1px solid #1A1A24", borderRight: "1px solid #1A1A24", fontSize: 12, color: "#C8C8D8", whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle" };
/* ═══ LEGAL / PRIVACY / GDPR TAB ════════════════════════════════════════════ */
function LegalTab() {
const [section, setSection] = React.useState('privacy');
const sections = [
{ id: 'privacy', label: 'Informativa Privacy' },
{ id: 'gdpr', label: 'GDPR' },
{ id: 'terms', label: 'Termini di Servizio' },
{ id: 'dmca', label: 'DMCA / Copyright' },
{ id: 'about', label: 'Note sul Software' },
];
const today = new Date().toLocaleDateString('it-IT');
const SECTION_STYLE = {
background: '#141418', border: '1px solid #2A2A38', borderRadius: 12, padding: '20px 24px',
color: '#9090A8', fontSize: 13, lineHeight: 1.7, marginBottom: 14,
};
const H = { color: '#F0F0F5', fontSize: 15, fontWeight: 800, margin: '18px 0 8px', letterSpacing: .2 };
const H1 = { color: '#2DD4BF', fontSize: 20, fontWeight: 900, marginBottom: 6, letterSpacing: -.3 };
const SMALL = { fontSize: 11, color: '#5A5A70', marginBottom: 14 };
return (React.createElement("div", { style: { maxWidth: 860, margin: '0 auto' } },
React.createElement("div", { style: { marginBottom: 20 } },
React.createElement("h1", { style: { fontSize: 22, fontWeight: 900, color: '#F0F0F5', marginBottom: 4 } }, "Legale & Privacy"),
React.createElement("p", { style: { color: '#5A5A70', fontSize: 13 } }, "Informazioni legali, privacy, GDPR e termini di utilizzo")),
React.createElement("div", { style: { display: 'flex', gap: 2, marginBottom: 16, borderBottom: '2px solid #2A2A38', overflowX: 'auto' } }, sections.map(s => (React.createElement("button", { key: s.id, onClick: () => setSection(s.id), style: {
background: 'none', border: 'none',
borderBottom: section === s.id ? '2px solid #2DD4BF' : '2px solid transparent',
color: section === s.id ? '#2DD4BF' : '#6A6A80',
padding: '10px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
marginBottom: -2, whiteSpace: 'nowrap', flexShrink: 0,
} }, s.label)))),
section === 'privacy' && (React.createElement("div", { style: SECTION_STYLE },
React.createElement("h2", { style: H1 }, "Informativa sulla Privacy"),
React.createElement("div", { style: SMALL },
"Ultimo aggiornamento: ",
today),
React.createElement("h3", { style: H }, "1. Titolare del trattamento"),
React.createElement("p", null, "Il titolare del trattamento dei dati personali raccolti tramite questo software \u00E8 l'utente stesso che lo utilizza per la propria attivit\u00E0 professionale di gestione apparecchiature elettromedicali. Il software MedTrace \u00E8 uno strumento self-hosted: i dati non vengono raccolti n\u00E9 trasmessi a server di MedTrace Medical o terzi."),
React.createElement("h3", { style: H }, "2. Dati raccolti"),
React.createElement("p", null, "Il software memorizza localmente nel browser dell'utente (localStorage) i seguenti dati funzionali al servizio:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 6 } },
React.createElement("li", null, "Anagrafica clienti (ragione sociale, indirizzo, P.IVA, contatti)"),
React.createElement("li", null, "Anagrafica apparecchiature (modello, matricola, ubicazione)"),
React.createElement("li", null, "Storico interventi e verifiche tecniche"),
React.createElement("li", null, "Documenti e immagini caricati dall'utente")),
React.createElement("h3", { style: H }, "3. Finalit\u00E0 del trattamento"),
React.createElement("p", null, "I dati sono trattati per finalit\u00E0 di gestione tecnico-amministrativa delle apparecchiature elettromedicali, conformemente al D.Lgs. 81/08, IEC 62353, IEC 61010 e normative collegate."),
React.createElement("h3", { style: H }, "4. Modalit\u00E0 di conservazione"),
React.createElement("p", null, "I dati sono memorizzati esclusivamente nel browser dell'utente. Nessun dato \u00E8 trasmesso a server esterni. L'utente \u00E8 responsabile dei backup dei propri dati tramite la funzione \"Esporta backup\" presente in Impostazioni."),
React.createElement("h3", { style: H }, "5. Diritti dell'interessato"),
React.createElement("p", null, "L'utente pu\u00F2 in qualsiasi momento accedere, modificare, esportare o cancellare i propri dati tramite le funzioni del software. Per i dati di terzi (clienti, ecc.) l'utente agisce in qualit\u00E0 di titolare del trattamento e deve garantire il rispetto del GDPR verso i propri interessati."),
React.createElement("h3", { style: H }, "6. Sicurezza"),
React.createElement("p", null, "I dati sono memorizzati nel localStorage del browser. Si raccomanda di:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 6 } },
React.createElement("li", null, "Proteggere il dispositivo con password/PIN"),
React.createElement("li", null, "Non condividere il dispositivo con persone non autorizzate"),
React.createElement("li", null, "Esportare regolarmente backup dei dati"),
React.createElement("li", null, "Non utilizzare il software su reti pubbliche non sicure")))),
section === 'gdpr' && (React.createElement("div", { style: SECTION_STYLE },
React.createElement("h2", { style: H1 }, "Conformit\u00E0 GDPR (Reg. UE 2016/679)"),
React.createElement("div", { style: SMALL }, "Riferimento normativo: Regolamento UE 2016/679 (GDPR)"),
React.createElement("h3", { style: H }, "Architettura privacy-by-design"),
React.createElement("p", null,
"MedTrace \u00E8 progettato secondo il principio di ",
React.createElement("strong", { style: { color: '#F0F0F5' } }, "privacy by design"),
" previsto dall'art. 25 GDPR:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 6 } },
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Nessuna trasmissione dati a server esterni"),
" \u2014 l'app \u00E8 completamente client-side"),
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Nessun tracking, analytics o cookie di terze parti")),
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Dati cifrati a riposo"),
" nel dispositivo dell'utente (tramite sistemi di sicurezza del browser/OS)"),
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Minimizzazione"),
": vengono raccolti solo i dati necessari per la finalit\u00E0 del servizio")),
React.createElement("h3", { style: H }, "Base giuridica del trattamento"),
React.createElement("p", null, "Il trattamento dei dati anagrafici dei clienti e dei loro apparecchi \u00E8 necessario per l'esecuzione del contratto di servizio tra l'utente del software (tecnico/azienda) e i propri clienti (art. 6.1.b GDPR)."),
React.createElement("h3", { style: H }, "Diritti garantiti"),
React.createElement("ul", { style: { paddingLeft: 20 } },
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Accesso (art. 15)"),
": tramite l'interfaccia del software"),
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Rettifica (art. 16)"),
": modifica diretta dei record"),
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Cancellazione (art. 17)"),
": eliminazione singola o totale"),
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Portabilit\u00E0 (art. 20)"),
": export JSON completo dei dati"),
React.createElement("li", null,
React.createElement("strong", { style: { color: '#F0F0F5' } }, "Limitazione (art. 18)"),
": tramite controllo accessi al dispositivo")),
React.createElement("h3", { style: H }, "Responsabilit\u00E0 dell'utente"),
React.createElement("p", null,
"L'utente che utilizza il software per gestire dati di terzi (clienti, pazienti) agisce come ",
React.createElement("strong", { style: { color: '#F0F0F5' } }, "titolare del trattamento"),
" e deve:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 6 } },
React.createElement("li", null, "Informare i propri interessati con apposita informativa privacy"),
React.createElement("li", null, "Garantire la sicurezza dei dispositivi su cui \u00E8 installato il software"),
React.createElement("li", null, "Eseguire valutazioni d'impatto (DPIA) se gestisce dati sensibili"),
React.createElement("li", null, "Notificare eventuali data breach all'autorit\u00E0 competente entro 72 ore"),
React.createElement("li", null, "Tenere il registro dei trattamenti (art. 30 GDPR)")),
React.createElement("h3", { style: H }, "Categorie particolari di dati (art. 9)"),
React.createElement("p", { style: { background: '#f59e0b18', border: '1px solid #f59e0b44', borderRadius: 8, padding: 12 } },
"\u26A0 Il software ",
React.createElement("strong", { style: { color: '#F0F0F5' } }, "NON \u00E8 progettato"),
" per il trattamento di dati sanitari di pazienti (art. 9 GDPR). Inserire solo dati relativi agli apparecchi e all'attivit\u00E0 tecnica. Per il trattamento di dati sanitari sono richiesti requisiti aggiuntivi (DPO, DPIA, MDR, certificazioni)."))),
section === 'terms' && (React.createElement("div", { style: SECTION_STYLE },
React.createElement("h2", { style: H1 }, "Termini di Servizio"),
React.createElement("div", { style: SMALL },
"Ultimo aggiornamento: ",
today),
React.createElement("h3", { style: H }, "1. Accettazione"),
React.createElement("p", null, "L'utilizzo di MedTrace implica l'accettazione integrale dei presenti Termini di Servizio. In caso di disaccordo, l'utente \u00E8 invitato a cessare l'utilizzo del software."),
React.createElement("h3", { style: H }, "2. Licenza d'uso"),
React.createElement("p", null, "Il software \u00E8 fornito in licenza d'uso personale, non esclusiva e non trasferibile. \u00C8 vietato:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 6 } },
React.createElement("li", null, "Decompilare, disassemblare o effettuare reverse engineering"),
React.createElement("li", null, "Rimuovere o modificare informazioni di copyright"),
React.createElement("li", null, "Rivendere o distribuire il software senza autorizzazione"),
React.createElement("li", null, "Utilizzare il software per finalit\u00E0 illecite")),
React.createElement("h3", { style: H }, "3. Limitazione di responsabilit\u00E0"),
React.createElement("p", { style: { background: '#ef444418', border: '1px solid #ef444444', borderRadius: 8, padding: 12 } }, "Il software \u00E8 fornito \"AS IS\" senza garanzie esplicite o implicite. Lo sviluppatore non \u00E8 responsabile per:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 10 } },
React.createElement("li", null, "Perdita di dati causata da malfunzionamenti del browser/dispositivo"),
React.createElement("li", null, "Errori nelle misure o nei calcoli effettuati dal tecnico"),
React.createElement("li", null, "Mancata conformit\u00E0 alle normative dovuta a uso improprio del software"),
React.createElement("li", null, "Danni diretti o indiretti derivanti dall'uso o dall'impossibilit\u00E0 d'uso")),
React.createElement("h3", { style: H }, "4. Conformit\u00E0 normativa"),
React.createElement("p", null,
"Le verifiche e i template inclusi nel software seguono le normative IEC 62353, IEC 61010-1, IEC 60601-X e ISO 80601-X applicabili. \u00C8 ",
React.createElement("strong", { style: { color: '#F0F0F5' } }, "responsabilit\u00E0 del tecnico"),
" verificare l'aggiornamento normativo e la correttezza dell'applicazione ai propri apparecchi."),
React.createElement("h3", { style: H }, "5. Backup e perdita dati"),
React.createElement("p", null, "L'utente \u00E8 esclusivamente responsabile del backup dei propri dati. Si raccomanda di esportare periodicamente backup tramite la funzione apposita in Impostazioni."))),
section === 'dmca' && (React.createElement("div", { style: SECTION_STYLE },
React.createElement("h2", { style: H1 }, "DMCA e Copyright Policy"),
React.createElement("div", { style: SMALL }, "Riferimento: Digital Millennium Copyright Act (USA) e Direttiva UE 2019/790"),
React.createElement("h3", { style: H }, "Diritti di propriet\u00E0 intellettuale"),
React.createElement("p", null, "Tutti i contenuti del software MedTrace (codice sorgente, interfaccia, template di verifica, documentazione) sono protetti da copyright e propriet\u00E0 intellettuale."),
React.createElement("h3", { style: H }, "Service manual e documentazione di terzi"),
React.createElement("p", null, "Il software permette all'utente di caricare service manual e documenti tecnici dei costruttori. L'utente dichiara e garantisce di:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 6 } },
React.createElement("li", null, "Essere autorizzato all'uso e archiviazione di tale materiale"),
React.createElement("li", null, "Non distribuire pubblicamente documenti coperti da copyright"),
React.createElement("li", null, "Rispettare le clausole di confidenzialit\u00E0 contrattuali con i costruttori")),
React.createElement("h3", { style: H }, "Procedura di notifica DMCA"),
React.createElement("p", null, "Qualora si ritenga che contenuti caricati o presenti nel software violino diritti di propriet\u00E0 intellettuale, \u00E8 possibile inviare una notifica DMCA contenente:"),
React.createElement("ul", { style: { paddingLeft: 20, marginTop: 6 } },
React.createElement("li", null, "Identificazione dell'opera protetta"),
React.createElement("li", null, "Identificazione del materiale ritenuto violativo"),
React.createElement("li", null, "Informazioni di contatto del segnalante"),
React.createElement("li", null, "Dichiarazione di buona fede"),
React.createElement("li", null, "Dichiarazione di accuratezza sotto giuramento"),
React.createElement("li", null, "Firma fisica o elettronica del titolare dei diritti")),
React.createElement("h3", { style: H }, "Marchi registrati"),
React.createElement("p", null, "I marchi commerciali (Philips, Dr\u00E4gerwerk, Mindray, Fluke ecc.) menzionati nei template sono di propriet\u00E0 dei rispettivi titolari e sono citati esclusivamente a fini identificativi e tecnici. Nessuna affiliazione con tali aziende \u00E8 implicata."))),
section === 'about' && (React.createElement("div", { style: SECTION_STYLE },
React.createElement("h2", { style: H1 }, "Note sul Software"),
React.createElement("div", { style: SMALL }, "MedTrace \u00B7 v1.0"),
React.createElement("h3", { style: H }, "Scopo del software"),
React.createElement("p", null, "MedTrace \u00E8 un software di gestione (CMMS) per apparecchiature elettromedicali destinato a tecnici biomedicali e service provider. Permette la gestione di parco macchine, interventi di manutenzione e verifiche tecniche secondo normative vigenti."),
React.createElement("h3", { style: H }, "Normative implementate nei template"),
React.createElement("ul", { style: { paddingLeft: 20 } },
React.createElement("li", null, "IEC 62353:2014 \u2014 Verifiche di sicurezza elettrica"),
React.createElement("li", null, "IEC 61010-1 \u2014 Apparecchiature da laboratorio"),
React.createElement("li", null, "IEC 60601-1 \u2014 Apparecchiature elettromedicali generali"),
React.createElement("li", null, "IEC 60601-2-4 \u2014 Defibrillatori cardiaci"),
React.createElement("li", null, "IEC 60601-2-2 \u2014 Apparecchiature HF chirurgiche"),
React.createElement("li", null, "IEC 60601-2-24 \u2014 Pompe infusionali"),
React.createElement("li", null, "IEC 60601-2-27/30/49 \u2014 Monitor multiparametrici"),
React.createElement("li", null, "IEC 60601-2-37 \u2014 Ecografi"),
React.createElement("li", null, "IEC 60601-2-38 \u2014 Letti motorizzati"),
React.createElement("li", null, "ISO 80601-2-12 \u2014 Ventilatori polmonari"),
React.createElement("li", null, "ISO 80601-2-55 \u2014 Capnografia"),
React.createElement("li", null, "ISO 80601-2-61 \u2014 Pulsossimetri"),
React.createElement("li", null, "ISO 10079-1 \u2014 Aspiratori medicali"),
React.createElement("li", null, "D.Lgs. 81/08 \u2014 Sicurezza luoghi di lavoro"),
React.createElement("li", null, "D.Lgs. 46/97 e MDR (UE) 2017/745 \u2014 Dispositivi medici")),
React.createElement("h3", { style: H }, "Avvertenza importante"),
React.createElement("p", { style: { background: '#f59e0b18', border: '1px solid #f59e0b44', borderRadius: 8, padding: 12, marginTop: 10 } }, "\u26A0 Il software MedTrace \u00E8 uno strumento di supporto al lavoro del tecnico biomedicale qualificato. Non sostituisce la competenza professionale, il giudizio tecnico, n\u00E9 le procedure ufficiali del costruttore. \u00C8 responsabilit\u00E0 del tecnico verificare l'accuratezza delle misure, l'aggiornamento delle norme e l'idoneit\u00E0 delle procedure applicate al singolo apparecchio."),
React.createElement("h3", { style: H }, "Contatti"),
React.createElement("p", null, "Per segnalazioni, richieste di supporto o questioni legali contattare lo sviluppatore attraverso i canali ufficiali indicati al momento della distribuzione."))),
React.createElement("div", { style: { textAlign: 'center', color: '#3A3A50', fontSize: 10, marginTop: 24, padding: '12px 0' } },
"MedTrace \u00B7 Documentazione legale \u00B7 Aggiornata al ",
today)));
}
/* ═══ INSTRUMENTS PAGE (Strumenti di Misura) ════════════════════════════════ */
function InstrumentsPage({ instruments, setInstruments, showToast }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const TODAY = new Date();
const getStatus = (inst) => {
if (!inst.calExpiry)
return { label: 'Non impostata', color: '#64748b', days: null };
const expiry = new Date(inst.calExpiry);
const days = Math.round((expiry - TODAY) / 86400000);
if (days < 0)
return { label: 'SCADUTA', color: '#ef4444', days };
if (days <= 30)
return { label: `Scade in ${days}g`, color: '#ef4444', days };
if (days <= 60)
return { label: `Scade in ${days}g`, color: '#f59e0b', days };
return { label: `Valida (${days}g)`, color: '#22c55e', days };
};
const saveInstrument = (data) => {
if (data.id) {
setInstruments(prev => prev.map(x => x.id === data.id ? data : x));
}
else {
const newInst = Object.assign(Object.assign({}, data), { id: 'I' + Date.now() });
setInstruments(prev => [...prev, newInst]);
}
setModal(null);
showToast('✓ Strumento salvato');
};
const deleteInstrument = (id) => {
if (!confirm('Eliminare questo strumento?'))
return;
setInstruments(prev => prev.filter(x => x.id !== id));
showToast('Strumento eliminato');
};
const filtered = instruments.filter(i => !search || [i.brand, i.model, i.serial, i.internalCode, i.category]
.some(v => v && v.toLowerCase().includes(search.toLowerCase())));
// Stats
const expired = instruments.filter(i => getStatus(i).days !== null && getStatus(i).days < 0).length;
const expiring = instruments.filter(i => { const s = getStatus(i); return s.days !== null && s.days >= 0 && s.days <= 60; }).length;
const valid = instruments.filter(i => { const s = getStatus(i); return s.days !== null && s.days > 60; }).length;
const BADGE = ({ status }) => (React.createElement("span", { style: { background: status.color + '22', color: status.color, border: `1px solid ${status.color}44`,
borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' } }, status.label));
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 1100, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, "Strumenti di Misura"),
React.createElement("p", { style: { color: '#64748b', margin: '3px 0 0', fontSize: 12 } }, "Gestione calibrazioni e scadenze")),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none',
borderRadius: 8, padding: '9px 18px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, "+ Nuovo strumento")),
React.createElement("div", { style: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 } }, [
{ label: 'Totale', value: instruments.length, color: '#2DD4BF' },
{ label: 'Validi', value: valid, color: '#22c55e' },
{ label: 'In scadenza (60gg)', value: expiring, color: '#f59e0b' },
{ label: 'Scaduti', value: expired, color: '#ef4444' },
].map(k => (React.createElement("div", { key: k.label, style: { background: '#141418', border: '1px solid #2A2A38',
borderTop: `3px solid ${k.color}`, borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 100 } },
React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: k.color, fontFamily: 'monospace' } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', marginTop: 3, textTransform: 'uppercase', letterSpacing: .7 } }, k.label))))),
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Cerca per marca, modello, seriale, categoria\u2026", style: { width: '100%', background: '#141418', border: '1px solid #2A2A38', borderRadius: 8,
padding: '9px 14px', color: '#F0F0F5', fontSize: 13, outline: 'none', marginBottom: 12 } }),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 60, color: '#5A5A70', background: '#141418',
borderRadius: 12, border: '1px solid #2A2A38' } }, instruments.length === 0
? 'Nessuno strumento registrato. Clicca "+ Nuovo strumento" per aggiungerne uno.'
: 'Nessun risultato per la ricerca.')) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.map(inst => {
const status = getStatus(inst);
return (React.createElement("div", { key: inst.id, style: { background: '#141418', border: `1px solid ${status.days !== null && status.days < 0 ? '#ef444433' : status.days !== null && status.days <= 60 ? '#f59e0b33' : '#2A2A38'}`,
borderRadius: 10, padding: '12px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 } },
React.createElement("span", { style: { fontSize: 15, fontWeight: 800, color: '#F0F0F5' } },
inst.brand,
" ",
inst.model),
inst.internalCode && (React.createElement("span", { style: { fontFamily: 'monospace', fontSize: 11, color: '#5A5A70',
background: '#0D0D12', borderRadius: 4, padding: '1px 6px' } }, inst.internalCode)),
inst.category && (React.createElement("span", { style: { fontSize: 11, color: '#9090A8', background: '#2A2A38',
borderRadius: 4, padding: '1px 8px' } }, inst.category)),
React.createElement(BADGE, { status: status })),
React.createElement("div", { style: { fontSize: 12, color: '#5A5A70', display: 'flex', gap: 16, flexWrap: 'wrap' } },
inst.serial && React.createElement("span", null,
"S/N: ",
inst.serial),
inst.calDate && React.createElement("span", null,
"Ultima cal.: ",
React.createElement("span", { style: { color: '#9090A8' } }, inst.calDate)),
inst.calExpiry && React.createElement("span", null,
"Scadenza: ",
React.createElement("span", { style: { color: status.color, fontWeight: 700 } }, inst.calExpiry)),
inst.calLab && React.createElement("span", null,
"Lab.: ",
React.createElement("span", { style: { color: '#9090A8' } }, inst.calLab)),
inst.certNumber && React.createElement("span", null,
"Cert. n\u00B0: ",
React.createElement("span", { style: { color: '#9090A8' } }, inst.certNumber))),
inst.notes && (React.createElement("div", { style: { fontSize: 11, color: '#6A6A80', marginTop: 6,
background: '#0D0D12', borderRadius: 6, padding: '4px 10px' } }, inst.notes))),
React.createElement("div", { style: { display: 'flex', gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: () => setModal({ type: 'form', data: inst }), style: { background: '#202028', border: '1px solid #2a3040', borderRadius: 6,
color: '#94a3b8', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: () => setModal({ type: 'renew', data: inst }), style: { background: '#202028', border: '1px solid #2DD4BF44', borderRadius: 6,
color: '#2DD4BF', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u21BB Rinnova"),
React.createElement("button", { onClick: () => deleteInstrument(inst.id), style: { background: '#202028', border: '1px solid #ef444433', borderRadius: 6,
color: '#ef4444', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2715")))));
}))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? 'Modifica Strumento' : 'Nuovo Strumento', onClose: () => setModal(null) },
React.createElement(InstrumentForm, { initial: modal.data, onSave: saveInstrument, onClose: () => setModal(null) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'renew' && (React.createElement(Modal, { title: "Rinnova Calibrazione", onClose: () => setModal(null) },
React.createElement(RenewCalibrationForm, { instrument: modal.data, onSave: (data) => { saveInstrument(data); showToast('✓ Calibrazione rinnovata'); }, onClose: () => setModal(null) })))));
}
function InstrumentForm({ initial, onSave, onClose }) {
const CATEGORIES = ['Tester IEC/Sicurezza elettrica', 'Multimetro', 'Oscilloscopio',
'Analizzatore defibrillatori', 'Analizzatore infusionali', 'Simulatore paziente',
'Misuratore pressione', 'Termometro di riferimento', 'Calibratore', 'Altro'];
const [form, setForm] = React.useState(initial || {
brand: '', model: '', serial: '', internalCode: '', category: '',
calDate: '', calExpiry: '', calLab: '', certNumber: '', calInterval: 12, notes: ''
});
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
// Auto-calculate expiry from calDate + calInterval
const calcExpiry = (date, months) => {
if (!date || !months)
return '';
const d = new Date(date);
d.setMonth(d.getMonth() + parseInt(months));
return d.toISOString().slice(0, 10);
};
const INP = { width: '100%', background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 7,
padding: '9px 12px', color: '#F0F0F5', fontSize: 13, outline: 'none', fontFamily: 'inherit' };
const LBL = { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8,
fontWeight: 700, display: 'block', marginBottom: 4 };
const ROW = { display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' };
const COL = { flex: 1, minWidth: 140 };
return (React.createElement("div", null,
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Marca *"),
React.createElement("input", { style: INP, value: form.brand, onChange: e => set('brand', e.target.value), placeholder: "es. Fluke, Rigel, Metrolab" })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Modello *"),
React.createElement("input", { style: INP, value: form.model, onChange: e => set('model', e.target.value), placeholder: "es. 435-II, 288+" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "N\u00B0 Serie"),
React.createElement("input", { style: INP, value: form.serial, onChange: e => set('serial', e.target.value), placeholder: "Seriale costruttore" })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Matricola interna"),
React.createElement("input", { style: INP, value: form.internalCode, onChange: e => set('internalCode', e.target.value), placeholder: "es. STR-001" }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, "Categoria"),
React.createElement("select", { style: INP, value: form.category, onChange: e => set('category', e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c)))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', margin: '14px 0 12px', paddingTop: 14 } },
React.createElement("div", { style: { fontSize: 11, color: '#2DD4BF', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 } }, "Dati Calibrazione"),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Data ultima calibrazione"),
React.createElement("input", { type: "date", style: INP, value: form.calDate, onChange: e => { set('calDate', e.target.value); set('calExpiry', calcExpiry(e.target.value, form.calInterval)); } })),
React.createElement("div", { style: { width: 120 } },
React.createElement("label", { style: LBL }, "Intervallo (mesi)"),
React.createElement("select", { style: INP, value: form.calInterval, onChange: e => { set('calInterval', e.target.value); set('calExpiry', calcExpiry(form.calDate, e.target.value)); } }, [6, 12, 24, 36].map(m => React.createElement("option", { key: m, value: m },
m,
" mesi"))))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Scadenza calibrazione"),
React.createElement("input", { type: "date", style: Object.assign(Object.assign({}, INP), { color: form.calExpiry && new Date(form.calExpiry) < new Date() ? '#ef4444' : '#F0F0F5' }), value: form.calExpiry, onChange: e => set('calExpiry', e.target.value) })),
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "Laboratorio calibrazione"),
React.createElement("input", { style: INP, value: form.calLab, onChange: e => set('calLab', e.target.value), placeholder: "es. ACCREDIA, SIT, interno" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: COL },
React.createElement("label", { style: LBL }, "N\u00B0 Certificato calibrazione"),
React.createElement("input", { style: INP, value: form.certNumber, onChange: e => set('certNumber', e.target.value), placeholder: "es. CAL-2025-0123" })))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', margin: '14px 0 12px', paddingTop: 14 } },
React.createElement("div", { style: { fontSize: 11, color: '#2DD4BF', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 } }, "Certificati e Allegati"),
React.createElement(AttachmentsList, { attachments: form.attachments || [], onAdd: (att) => set('attachments', [...(form.attachments || []), att]), onDelete: (id) => set('attachments', (form.attachments || []).filter(a => a.id !== id)) })),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, "Note"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical' }), value: form.notes, onChange: e => set('notes', e.target.value), placeholder: "Note aggiuntive\u2026" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: onClose, style: { background: '#202028', border: '1px solid #2a3040', borderRadius: 7,
color: '#94a3b8', padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 } }, "Annulla"),
React.createElement("button", { onClick: () => { if (!form.brand || !form.model) {
alert('Marca e modello obbligatori');
return;
} onSave(form); }, style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none',
borderRadius: 7, padding: '9px 18px', cursor: 'pointer', fontWeight: 800, fontSize: 13 } }, initial ? 'Salva modifiche' : 'Aggiungi strumento'))));
}
function RenewCalibrationForm({ instrument, onSave, onClose }) {
const today = new Date().toISOString().slice(0, 10);
const [form, setForm] = React.useState(Object.assign(Object.assign({}, instrument), { calDate: today, calExpiry: (() => { const d = new Date(today); d.setMonth(d.getMonth() + (instrument.calInterval || 12)); return d.toISOString().slice(0, 10); })(), certNumber: '', calLab: instrument.calLab || '' }));
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const INP = { width: '100%', background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 7,
padding: '9px 12px', color: '#F0F0F5', fontSize: 13, outline: 'none', fontFamily: 'inherit' };
const LBL = { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, display: 'block', marginBottom: 4 };
return (React.createElement("div", null,
React.createElement("div", { style: { background: '#141418', borderRadius: 8, padding: '10px 14px', marginBottom: 14,
border: '1px solid #2A2A38', fontSize: 13, color: '#9090A8' } },
React.createElement("strong", { style: { color: '#F0F0F5' } },
instrument.brand,
" ",
instrument.model),
instrument.serial && React.createElement("span", { style: { marginLeft: 8, fontFamily: 'monospace', fontSize: 11 } },
"S/N: ",
instrument.serial)),
React.createElement("div", { style: { display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Data calibrazione *"),
React.createElement("input", { type: "date", style: INP, value: form.calDate, onChange: e => { set('calDate', e.target.value); const d = new Date(e.target.value); d.setMonth(d.getMonth() + (form.calInterval || 12)); set('calExpiry', d.toISOString().slice(0, 10)); } })),
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Nuova scadenza"),
React.createElement("input", { type: "date", style: Object.assign(Object.assign({}, INP), { color: '#22c55e' }), value: form.calExpiry, onChange: e => set('calExpiry', e.target.value) }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, "Laboratorio calibrazione"),
React.createElement("input", { style: INP, value: form.calLab, onChange: e => set('calLab', e.target.value), placeholder: "es. ACCREDIA lab 0123" })),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, "N\u00B0 Nuovo certificato"),
React.createElement("input", { style: INP, value: form.certNumber, onChange: e => set('certNumber', e.target.value), placeholder: "es. CAL-2026-0456" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: onClose, style: { background: '#202028', border: '1px solid #2a3040', borderRadius: 7,
color: '#94a3b8', padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 } }, "Annulla"),
React.createElement("button", { onClick: () => onSave(form), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none',
borderRadius: 7, padding: '9px 18px', cursor: 'pointer', fontWeight: 800, fontSize: 13 } }, "\u21BB Salva rinnovo"))));
}
/* ═══ AGENDA & SCHEDULING ════════════════════════════════════════════════════ */
function AgendaPage({ assets, setAssets, jobs, instruments, iecReports, funcReports, customers, setTab: goTab, setModal, showToast }) {
const [view, setView] = React.useState('month'); // month | list
const [filterType, setFilterType] = React.useState('all'); // all | maintenance | jobs | calibrations | verifications
const [currentDate, setCurrentDate] = React.useState(new Date());
const [schedYear, setSchedYear] = React.useState(new Date().getFullYear());
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
// ── Build unified events list ─────────────────────────────────────────────
const allEvents = React.useMemo(() => {
const events = [];
// 1. Asset maintenance (nextService)
assets.forEach(a => {
if (!a.nextService)
return;
const date = new Date(a.nextService);
const days = Math.round((date - TODAY) / 86400000);
const customer = customers.find(c => c.id === a.customerId);
events.push({
id: 'maint-' + a.id,
type: 'maintenance',
color: days < 0 ? '#ef4444' : days <= 30 ? '#f59e0b' : '#2DD4BF',
date: a.nextService,
dateObj: date,
title: a.name,
subtitle: (a.brand ? a.brand + ' · ' : '') + (customer ? customer.name : ''),
days,
assetId: a.id,
status: days < 0 ? 'scaduto' : days === 0 ? 'oggi' : `tra ${days}gg`,
actionLabel: 'Verifica',
onAction: () => goTab('iec'),
});
});
// 2. Instrument calibrations
instruments.forEach(i => {
if (!i.calExpiry)
return;
const date = new Date(i.calExpiry);
const days = Math.round((date - TODAY) / 86400000);
events.push({
id: 'cal-' + i.id,
type: 'calibration',
color: days < 0 ? '#ef4444' : days <= 60 ? '#f59e0b' : '#a855f7',
date: i.calExpiry,
dateObj: date,
title: i.brand + ' ' + i.model,
subtitle: i.category || 'Strumento di misura',
days,
status: days < 0 ? 'scaduta' : `tra ${days}gg`,
actionLabel: 'Rinnova',
onAction: () => goTab('instruments'),
});
});
// 3. Open jobs (by open date)
jobs.filter(j => j.status !== 'chiuso').forEach(j => {
var _a;
const asset = assets.find(a => a.id === j.assetId);
const date = new Date(j.openDate || j.open_date || TODAY);
events.push({
id: 'job-' + j.id,
type: 'job',
color: j.priority === 'urgente' ? '#ef4444' : j.priority === 'alta' ? '#f97316' : '#64748b',
date: (j.openDate || j.open_date || TODAY.toISOString().slice(0, 10)),
dateObj: date,
title: j.description || 'Job #' + (j.jobNumber || ((_a = j.id) === null || _a === void 0 ? void 0 : _a.slice(0, 6))),
subtitle: asset ? asset.name : '',
status: j.status,
priority: j.priority,
actionLabel: 'Apri',
onAction: () => goTab('jobs'),
});
});
return events.sort((a, b) => a.dateObj - b.dateObj);
}, [assets, instruments, jobs, customers]);
const filtered = filterType === 'all' ? allEvents :
allEvents.filter(e => e.type === { maintenance: 'maintenance', jobs: 'job', calibrations: 'calibration', verifications: 'maintenance' }[filterType] || e.type === filterType);
// ── Month view helpers ────────────────────────────────────────────────────
const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
const startPad = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1; // Mon-first
const daysInMonth = monthEnd.getDate();
const eventsByDay = React.useMemo(() => {
const map = {};
filtered.forEach(e => {
var _a, _b;
const key = ((_a = e.date) === null || _a === void 0 ? void 0 : _a.slice(0, 7)) === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}` ? parseInt((_b = e.date) === null || _b === void 0 ? void 0 : _b.slice(8, 10)) : null;
if (key) {
if (!map[key])
map[key] = [];
map[key].push(e);
}
});
return map;
}, [filtered, currentDate]);
const TYPE_ICON = { maintenance: '🔧', calibration: '📐', job: '⚙' };
const TYPE_LABEL = { maintenance: 'Manutenzione', calibration: 'Calibrazione', job: 'Job' };
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
// ── Upcoming (next 60 days) ───────────────────────────────────────────────
const upcoming = filtered.filter(e => e.days !== undefined && e.days >= -7 && e.days <= 60)
.sort((a, b) => a.days - b.days);
// ── Annual schedule (like old schedule page) ─────────────────────────────
const annualEvents = React.useMemo(() => {
return allEvents.filter(e => { var _a; return ((_a = e.date) === null || _a === void 0 ? void 0 : _a.startsWith(String(schedYear))) && e.type === 'maintenance'; });
}, [allEvents, schedYear]);
const byMonth = Array.from({ length: 12 }, (_, m) => ({
month: m,
label: MONTHS_IT[m],
events: annualEvents.filter(e => { var _a; return parseInt((_a = e.date) === null || _a === void 0 ? void 0 : _a.slice(5, 7)) - 1 === m; }),
}));
const BTN = ({ active, onClick, children }) => (React.createElement("button", { onClick: onClick, style: {
background: active ? '#2DD4BF' : '#1E1E28',
color: active ? '#000' : '#94a3b8',
border: active ? 'none' : '1px solid #2a3040',
borderRadius: 7, padding: '6px 14px', cursor: 'pointer',
fontSize: 12, fontWeight: 700,
} }, children));
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 1100, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, "Agenda & Scheduling"),
React.createElement("p", { style: { color: '#64748b', margin: '3px 0 0', fontSize: 12 } }, "Manutenzioni \u00B7 Calibrazioni strumenti \u00B7 Job aperti")),
React.createElement("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap' } },
React.createElement(BTN, { active: view === 'month', onClick: () => setView('month') }, "Vista mese"),
React.createElement(BTN, { active: view === 'list', onClick: () => setView('list') }, "Lista prossimi"),
React.createElement(BTN, { active: view === 'annual', onClick: () => setView('annual') }, "Piano automatico"),
React.createElement(BTN, { active: view === 'plan', onClick: () => setView('plan') }, "Piano manuale"))),
React.createElement("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 } },
[
{ id: 'all', label: 'Tutto', color: '#2DD4BF' },
{ id: 'maintenance', label: '🔧 Manutenzioni', color: '#2DD4BF' },
{ id: 'calibration', label: '📐 Calibrazioni', color: '#a855f7' },
{ id: 'job', label: '⚙ Job aperti', color: '#64748b' },
].map(f => (React.createElement("button", { key: f.id, onClick: () => setFilterType(f.id), style: {
background: filterType === f.id ? f.color + '22' : '#141418',
color: filterType === f.id ? f.color : '#5A5A70',
border: `1px solid ${filterType === f.id ? f.color + '66' : '#2A2A38'}`,
borderRadius: 20, padding: '4px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
} }, f.label))),
React.createElement("span", { style: { marginLeft: 'auto', color: '#5A5A70', fontSize: 12, alignSelf: 'center' } },
filtered.length,
" eventi totali")),
view === 'month' && (React.createElement("div", null,
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 } },
React.createElement("button", { onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)), style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 6, color: '#94a3b8', padding: '5px 12px', cursor: 'pointer', fontSize: 16 } }, "\u2039"),
React.createElement("span", { style: { fontWeight: 800, fontSize: 16, color: '#F0F0F5', minWidth: 160, textAlign: 'center' } },
MONTHS_IT[currentDate.getMonth()],
" ",
currentDate.getFullYear()),
React.createElement("button", { onClick: () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)), style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 6, color: '#94a3b8', padding: '5px 12px', cursor: 'pointer', fontSize: 16 } }, "\u203A"),
React.createElement("button", { onClick: () => setCurrentDate(new Date()), style: { background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 6, color: '#2DD4BF', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "Oggi")),
React.createElement("div", { style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 12, overflow: 'hidden' } },
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid #2A2A38' } }, DAYS_IT.map(d => (React.createElement("div", { key: d, style: { padding: '8px 4px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8 } }, d)))),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' } },
Array.from({ length: startPad }).map((_, i) => (React.createElement("div", { key: 'pad' + i, style: { minHeight: 80, borderRight: '1px solid #1a1a24', borderBottom: '1px solid #1a1a24' } }))),
Array.from({ length: daysInMonth }).map((_, i) => {
const day = i + 1;
const isToday = currentDate.getFullYear() === TODAY.getFullYear() && currentDate.getMonth() === TODAY.getMonth() && day === TODAY.getDate();
const dayEvents = eventsByDay[day] || [];
return (React.createElement("div", { key: day, style: { minHeight: 80, padding: '4px', borderRight: '1px solid #1a1a24', borderBottom: '1px solid #1a1a24', background: isToday ? '#2DD4BF08' : 'transparent' } },
React.createElement("div", { style: { fontSize: 11, fontWeight: isToday ? 900 : 500, color: isToday ? '#2DD4BF' : '#6A6A80',
background: isToday ? '#2DD4BF22' : 'transparent', borderRadius: 4, width: 22, height: 22,
display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 3 } }, day),
dayEvents.slice(0, 3).map(e => (React.createElement("div", { key: e.id, title: e.title, onClick: e.onAction, style: {
background: e.color + '22', border: `1px solid ${e.color}44`,
borderLeft: `3px solid ${e.color}`, borderRadius: 3,
padding: '1px 4px', marginBottom: 2, fontSize: 9, fontWeight: 600,
color: e.color, cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
} }, e.title))),
dayEvents.length > 3 && (React.createElement("div", { style: { fontSize: 9, color: '#5A5A70', padding: '1px 4px' } },
"+",
dayEvents.length - 3,
" altri"))));
}))),
React.createElement("div", { style: { display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' } }, [{ color: '#2DD4BF', label: 'Manutenzione' }, { color: '#a855f7', label: 'Calibrazione' }, { color: '#64748b', label: 'Job' }, { color: '#ef4444', label: 'Scaduto/Urgente' }].map(l => (React.createElement("div", { key: l.label, style: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#5A5A70' } },
React.createElement("div", { style: { width: 10, height: 10, background: l.color, borderRadius: 2 } }),
l.label)))))),
view === 'list' && (React.createElement("div", null,
React.createElement("h3", { style: { fontSize: 13, color: '#5A5A70', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: .8 } },
"Prossimi 60 giorni \u2014 ",
upcoming.length,
" eventi"),
upcoming.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#5A5A70', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38' } }, "Nessun evento nei prossimi 60 giorni")) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, upcoming.map(e => (React.createElement("div", { key: e.id, style: { background: '#141418', border: `1px solid ${e.days < 0 ? e.color + '44' : '#2A2A38'}`,
borderLeft: `4px solid ${e.color}`, borderRadius: 10, padding: '12px 16px',
display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' } },
React.createElement("span", { style: { fontSize: 14, fontWeight: 700, color: '#F0F0F5' } }, e.title),
React.createElement("span", { style: { fontSize: 10, background: e.color + '22', color: e.color, border: `1px solid ${e.color}44`,
borderRadius: 20, padding: '1px 8px', fontWeight: 700 } }, TYPE_LABEL[e.type]),
React.createElement("span", { style: { fontSize: 11, color: e.color, fontWeight: 700 } }, e.status)),
e.subtitle && React.createElement("div", { style: { fontSize: 12, color: '#5A5A70' } }, e.subtitle),
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70', marginTop: 3 } },
"\uD83D\uDCC5 ",
e.date)),
React.createElement("button", { onClick: e.onAction, style: { background: '#202028', border: `1px solid ${e.color}44`,
borderRadius: 6, color: e.color, padding: '6px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' } },
e.actionLabel,
" \u2192")))))))),
view === 'plan' && (React.createElement(PianoManuale, { assets: assets, setAssets: setAssets, customers: customers, year: schedYear, setYear: setSchedYear, showToast: showToast, goTab: goTab })),
view === 'annual' && (React.createElement("div", null,
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' } },
React.createElement("span", { style: { color: '#5A5A70', fontSize: 13 } }, "Anno:"),
React.createElement("select", { value: schedYear, onChange: e => setSchedYear(+e.target.value), style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 7, padding: '6px 11px', color: '#e2e8f0', fontSize: 13 } }, [schedYear - 1, schedYear, schedYear + 1].map(y => React.createElement("option", { key: y, value: y }, y))),
React.createElement("span", { style: { color: '#5A5A70', fontSize: 12, marginLeft: 8 } },
annualEvents.length,
" manutenzioni programmate")),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 } }, byMonth.map(({ month, label, events: mEvents }) => (React.createElement("div", { key: month, style: { background: '#141418', border: `1px solid ${mEvents.length > 0 ? '#2DD4BF33' : '#2A2A38'}`,
borderRadius: 10, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '8px 14px', background: mEvents.length > 0 ? '#2DD4BF15' : '#1a1a22',
borderBottom: `1px solid ${mEvents.length > 0 ? '#2DD4BF33' : '#2A2A38'}`,
display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: mEvents.length > 0 ? '#F0F0F5' : '#5A5A70' } }, label),
mEvents.length > 0 && (React.createElement("span", { style: { background: '#2DD4BF', color: '#000', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 900 } }, mEvents.length))),
mEvents.length === 0 ? (React.createElement("div", { style: { padding: '12px 14px', color: '#3A3A50', fontSize: 12 } }, "Nessuna manutenzione")) : (React.createElement("div", { style: { padding: '8px' } }, mEvents.map(e => (React.createElement("div", { key: e.id, style: { padding: '6px 8px', borderRadius: 6, marginBottom: 4,
background: '#0D0D12', border: `1px solid ${e.color}33`,
display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 12, fontWeight: 700, color: '#F0F0F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, e.title),
e.subtitle && React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, e.subtitle)),
React.createElement("button", { onClick: e.onAction, style: { background: 'none', border: `1px solid ${e.color}44`,
borderRadius: 5, color: e.color, padding: '3px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 } }, "Verifica"))))))))))))));
}
/* ═══ PIANO MANUALE ══════════════════════════════════════════════════════════ */
function PianoManuale({ assets, setAssets, customers, year, setYear, showToast, goTab }) {
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const [filterType, setFilterType] = React.useState('all'); // all | <category name>
const [filterLocation, setFilterLocation] = React.useState('all'); // all | <location name>
const [filterCustomer, setFilterCustomer] = React.useState('all');
const [selectedIds, setSelectedIds] = React.useState([]);
const [bulkMonth, setBulkMonth] = React.useState('');
// ── Extract unique categories/locations from assets ─────────────────────
const categories = Array.from(new Set(assets.map(a => detectCategory(a.name || '')).filter(Boolean)));
const locations = Array.from(new Set(assets.map(a => a.location || '').filter(Boolean)));
// ── Filtered assets ─────────────────────────────────────────────────────
const filtered = assets.filter(a => {
if (filterType !== 'all' && detectCategory(a.name || '') !== filterType)
return false;
if (filterLocation !== 'all' && a.location !== filterLocation)
return false;
if (filterCustomer !== 'all' && a.customerId !== filterCustomer)
return false;
return true;
});
// ── Get planned month for asset/year ────────────────────────────────────
const getPlanned = (asset) => {
if (!asset.plannedMonths)
return null;
return asset.plannedMonths[year] || null;
};
// ── Set planned month for an asset ──────────────────────────────────────
const setPlanned = (assetId, month) => {
setAssets(prev => prev.map(a => {
if (a.id !== assetId)
return a;
const planned = Object.assign({}, (a.plannedMonths || {}));
if (month === null || month === '') {
delete planned[year];
}
else {
planned[year] = parseInt(month);
}
return Object.assign(Object.assign({}, a), { plannedMonths: planned });
}));
};
// ── Bulk assign ─────────────────────────────────────────────────────────
const applyBulk = () => {
if (!bulkMonth) {
alert('Seleziona un mese');
return;
}
if (selectedIds.length === 0) {
alert('Seleziona almeno un apparecchio');
return;
}
const month = bulkMonth === 'none' ? null : parseInt(bulkMonth);
setAssets(prev => prev.map(a => {
if (!selectedIds.includes(a.id))
return a;
const planned = Object.assign({}, (a.plannedMonths || {}));
if (month === null)
delete planned[year];
else
planned[year] = month;
return Object.assign(Object.assign({}, a), { plannedMonths: planned });
}));
showToast(`✓ ${selectedIds.length} apparecchi ${month === null ? 'rimossi dal piano' : 'pianificati per ' + MONTHS_IT[month - 1]}`);
setSelectedIds([]);
setBulkMonth('');
};
// ── Group by month ──────────────────────────────────────────────────────
const byMonth = {};
for (let m = 1; m <= 12; m++)
byMonth[m] = [];
const unplanned = [];
filtered.forEach(a => {
const p = getPlanned(a);
if (p)
byMonth[p].push(a);
else
unplanned.push(a);
});
const toggleSelect = (id) => {
setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
};
const selectAllFiltered = () => {
if (selectedIds.length === filtered.length)
setSelectedIds([]);
else
setSelectedIds(filtered.map(a => a.id));
};
// ── Asset card ──────────────────────────────────────────────────────────
const AssetCard = ({ asset, showSelect, compact }) => {
const customer = customers.find(c => c.id === asset.customerId);
const isSelected = selectedIds.includes(asset.id);
const category = detectCategory(asset.name || '') || 'Generico';
return (React.createElement("div", { style: {
background: isSelected ? '#2DD4BF15' : '#0D0D12',
border: `1px solid ${isSelected ? '#2DD4BF66' : '#2A2A38'}`,
borderRadius: 6, padding: compact ? '5px 8px' : '8px 10px', marginBottom: 4,
cursor: showSelect ? 'pointer' : 'default',
display: 'flex', alignItems: 'center', gap: 8,
}, onClick: showSelect ? () => toggleSelect(asset.id) : undefined },
showSelect && (React.createElement("input", { type: "checkbox", checked: isSelected, readOnly: true, style: { accentColor: '#2DD4BF', cursor: 'pointer', flexShrink: 0 } })),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: compact ? 11 : 12, fontWeight: 700, color: '#F0F0F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, asset.name),
!compact && (React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, [category, asset.location, customer === null || customer === void 0 ? void 0 : customer.name].filter(Boolean).join(' · ')))),
!showSelect && (React.createElement("select", { value: getPlanned(asset) || '', onChange: e => setPlanned(asset.id, e.target.value), onClick: e => e.stopPropagation(), style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 4, color: '#9090A8', fontSize: 10, padding: '2px 4px', flexShrink: 0 } },
React.createElement("option", { value: "" }, "\u2014"),
MONTHS_IT.map((m, i) => React.createElement("option", { key: i, value: i + 1 }, m.slice(0, 3)))))));
};
return (React.createElement("div", null,
React.createElement("div", { style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px', marginBottom: 14 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 10 } },
React.createElement("div", null,
React.createElement("h3", { style: { margin: 0, fontSize: 15, fontWeight: 800, color: '#F0F0F5' } }, "Piano Manutenzione Manuale"),
React.createElement("p", { style: { margin: '2px 0 0', fontSize: 11, color: '#5A5A70' } }, "Pianifica manualmente quando fare ogni apparecchio, indipendentemente dalla scadenza tecnica")),
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
React.createElement("span", { style: { color: '#5A5A70', fontSize: 12 } }, "Anno:"),
React.createElement("select", { value: year, onChange: e => setYear(+e.target.value), style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 6, padding: '5px 10px', color: '#e2e8f0', fontSize: 12 } }, [year - 1, year, year + 1, year + 2].map(y => React.createElement("option", { key: y, value: y }, y))))),
React.createElement("div", { style: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 0 } },
React.createElement("select", { value: filterType, onChange: e => setFilterType(e.target.value), style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: '#9090A8', fontSize: 11 } },
React.createElement("option", { value: "all" }, "Tutte le categorie"),
categories.map(c => React.createElement("option", { key: c, value: c }, c))),
React.createElement("select", { value: filterLocation, onChange: e => setFilterLocation(e.target.value), style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: '#9090A8', fontSize: 11 } },
React.createElement("option", { value: "all" }, "Tutte le ubicazioni"),
locations.map(l => React.createElement("option", { key: l, value: l }, l))),
React.createElement("select", { value: filterCustomer, onChange: e => setFilterCustomer(e.target.value), style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: '#9090A8', fontSize: 11 } },
React.createElement("option", { value: "all" }, "Tutti i clienti"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement("span", { style: { marginLeft: 'auto', color: '#5A5A70', fontSize: 11, alignSelf: 'center' } },
filtered.length,
" apparecchi \u00B7 ",
unplanned.length,
" non pianificati"))),
React.createElement("div", { style: { background: '#141418', border: `1px solid ${selectedIds.length > 0 ? '#2DD4BF44' : '#2A2A38'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 14,
display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
React.createElement("button", { onClick: selectAllFiltered, style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 6, color: '#94a3b8', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, selectedIds.length === filtered.length && filtered.length > 0 ? 'Deseleziona tutti' : 'Seleziona tutti i filtrati'),
React.createElement("span", { style: { color: '#5A5A70', fontSize: 12 } },
selectedIds.length,
" selezionat",
selectedIds.length === 1 ? 'o' : 'i'),
selectedIds.length > 0 && (React.createElement(React.Fragment, null,
React.createElement("span", { style: { color: '#5A5A70', fontSize: 12, marginLeft: 'auto' } }, "Assegna a:"),
React.createElement("select", { value: bulkMonth, onChange: e => setBulkMonth(e.target.value), style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 10px', color: '#F0F0F5', fontSize: 12 } },
React.createElement("option", { value: "" }, "\u2014 Mese \u2014"),
MONTHS_IT.map((m, i) => React.createElement("option", { key: i, value: i + 1 }, m)),
React.createElement("option", { value: "none" }, "Rimuovi pianificazione")),
React.createElement("button", { onClick: applyBulk, style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 800 } }, "Applica")))),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 14 } }, Array.from({ length: 12 }, (_, m) => m + 1).map(month => {
const items = byMonth[month];
return (React.createElement("div", { key: month, style: { background: '#141418', border: `1px solid ${items.length > 0 ? '#2DD4BF33' : '#2A2A38'}`, borderRadius: 10, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '8px 12px', background: items.length > 0 ? '#2DD4BF15' : '#1a1a22',
borderBottom: `1px solid ${items.length > 0 ? '#2DD4BF33' : '#2A2A38'}`,
display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 12, color: items.length > 0 ? '#F0F0F5' : '#5A5A70' } }, MONTHS_IT[month - 1]),
items.length > 0 && (React.createElement("span", { style: { background: '#2DD4BF', color: '#000', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 900 } }, items.length))),
React.createElement("div", { style: { padding: 6, minHeight: 60 } }, items.length === 0 ? (React.createElement("div", { style: { padding: '10px 6px', color: '#3A3A50', fontSize: 11, textAlign: 'center' } }, "Nessuno")) : items.map(asset => React.createElement(AssetCard, { key: asset.id, asset: asset, compact: true })))));
})),
unplanned.length > 0 && (React.createElement("div", { style: { background: '#141418', border: '1px solid #f59e0b33', borderRadius: 10, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '10px 14px', background: '#f59e0b15', borderBottom: '1px solid #f59e0b33',
display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: '#f59e0b' } },
"\u26A0 Non pianificati (",
unplanned.length,
")"),
React.createElement("span", { style: { fontSize: 10, color: '#5A5A70' } }, "Spunta gli apparecchi e usa \"Assegna a\" sopra, oppure scegli il mese dal menu su ogni riga")),
React.createElement("div", { style: { padding: 8, maxHeight: 300, overflowY: 'auto' } }, unplanned.map(asset => React.createElement(AssetCard, { key: asset.id, asset: asset, showSelect: true }))))),
React.createElement("div", { style: { textAlign: 'center', marginTop: 14, fontSize: 10, color: '#3A3A50' } }, "Suggerimento: assegna gli apparecchi ai mesi per bilanciare il carico di lavoro nell'anno. Il piano manuale \u00E8 indipendente dalla scadenza tecnica (Prossimo servizio).")));
}
// Helper: detect category from asset name
function detectCategory(name) {
const n = (name || '').toLowerCase();
if (n.includes('defibrillatore') || n.includes('defib') || n.includes('dae'))
return 'Defibrillatore';
if (n.includes('monitor') || n.includes('saturim'))
return 'Monitor multiparametrico';
if (n.includes('ventilatore') || n.includes('respiratore'))
return 'Ventilatore';
if (n.includes('aspirat'))
return 'Aspiratore';
if (n.includes('pompa') || n.includes('infusion'))
return 'Pompa infusionale';
if (n.includes('elettrobistur') || n.includes('esu'))
return 'Elettrobisturi';
if (n.includes('ecograf') || n.includes('ultrasuon'))
return 'Ecografo';
if (n.includes('letto'))
return 'Letto elettrico';
if (n.includes('termometro'))
return 'Termometro';
if (n.includes('elettrocardiograf') || n.includes('ecg'))
return 'ECG';
return 'Altro';
}
/* ═══ ATTACHMENTS UI COMPONENT ═══════════════════════════════════════════════ */
function AttachmentsList({ attachments, onAdd, onDelete, showToast, compact }) {
const inputRef = React.useRef(null);
const [uploading, setUploading] = React.useState(false);
const handleFiles = (e) => __awaiter(this, void 0, void 0, function* () {
const files = Array.from(e.target.files || []);
if (!files.length)
return;
setUploading(true);
try {
for (const file of files) {
if (file.size > 5 * 1024 * 1024) {
alert(`File "${file.name}" è troppo grande (>5MB). Usa file più piccoli o comprimi prima.`);
continue;
}
const att = yield fileToAttachment(file);
// Check storage before saving
const usage = getStorageUsage();
if (usage.bytes + att.dataUrl.length > 9 * 1024 * 1024) {
alert(`⚠ Spazio quasi esaurito (${usage.mb} MB di ~10 MB).\nEsporta backup e libera spazio prima di continuare.`);
break;
}
onAdd(att);
}
showToast && showToast(`✓ ${files.length} file caricat${files.length === 1 ? 'o' : 'i'}`);
}
catch (err) {
alert('Errore caricamento: ' + err.message);
}
finally {
setUploading(false);
if (inputRef.current)
inputRef.current.value = '';
}
});
const getIcon = (type) => {
if (type === null || type === void 0 ? void 0 : type.startsWith('image/'))
return '🖼';
if (type === 'application/pdf')
return '📄';
if (type === null || type === void 0 ? void 0 : type.includes('word'))
return '📝';
if ((type === null || type === void 0 ? void 0 : type.includes('excel')) || (type === null || type === void 0 ? void 0 : type.includes('sheet')))
return '📊';
return '📎';
};
return (React.createElement("div", { style: { marginTop: compact ? 6 : 10 } },
!compact && (React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, marginBottom: 6 } },
"Allegati (",
(attachments || []).length,
")")),
React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 } }, (attachments || []).length === 0 ? (React.createElement("div", { style: { fontSize: 11, color: '#5A5A70', padding: '6px 0', fontStyle: 'italic' } }, "Nessun allegato")) : (attachments || []).map(att => {
var _a;
return (React.createElement("div", { key: att.id, style: {
background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 6,
padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8,
} },
React.createElement("span", { style: { fontSize: 14 } }, getIcon(att.type)),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 12, fontWeight: 600, color: '#F0F0F5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, att.name),
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70' } },
formatBytes(att.finalSize || att.size),
" \u00B7 ",
(att.uploadedAt || '').slice(0, 10))),
React.createElement("button", { onClick: () => downloadAttachment(att), title: "Scarica", style: { background: '#202028', border: '1px solid #2DD4BF44', borderRadius: 4, color: '#2DD4BF', padding: '3px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, "\u2B07"),
((_a = att.type) === null || _a === void 0 ? void 0 : _a.startsWith('image/')) && (React.createElement("button", { onClick: () => window.open(att.dataUrl, '_blank'), title: "Visualizza", style: { background: '#202028', border: '1px solid #2a3040', borderRadius: 4, color: '#94a3b8', padding: '3px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, "\uD83D\uDC41")),
React.createElement("button", { onClick: () => { if (confirm('Eliminare "' + att.name + '"?'))
onDelete(att.id); }, title: "Elimina", style: { background: '#202028', border: '1px solid #ef444433', borderRadius: 4, color: '#ef4444', padding: '3px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, "\u2715")));
})),
React.createElement("label", { style: {
display: 'inline-flex', alignItems: 'center', gap: 6, cursor: uploading ? 'wait' : 'pointer',
background: '#1E1E28', border: '1px dashed #2DD4BF44', borderRadius: 6, padding: '6px 14px',
color: '#2DD4BF', fontSize: 11, fontWeight: 700, opacity: uploading ? .5 : 1,
} },
React.createElement("input", { ref: inputRef, type: "file", multiple: true, accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx", onChange: handleFiles, disabled: uploading, style: { display: 'none' } }),
uploading ? '⏳ Caricamento...' : '+ Carica allegato (PDF, immagine, doc)')));
}
/* ═══ CUSTOMER PORTAL (read-only view) ═══════════════════════════════════════
* Modalità anteprima del portale cliente.
* Skeleton offline: usa gli stessi dati localStorage filtrati per cliente.
* Quando ci sarà Supabase: portal_token nell'URL → dati da cloud
* ═══════════════════════════════════════════════════════════════════════════ */
const STATUS_COLOR_PORTAL = {
'aperto': '#ef4444',
'in corso': '#f59e0b',
'in attesa parti': '#f59e0b',
'attesa parti': '#f59e0b',
'chiuso': '#22c55e',
'sospeso': '#94a3b8',
'operativo': '#22c55e',
'fuori servizio': '#ef4444',
'in manutenzione': '#f59e0b',
};
function PortalClient({ assets, jobs, iecReports, funcReports, instruments, customers, company, onExit, customerId: initialCustomerId }) {
var _a, _b;
const [selectedCustomerId, setSelectedCustomerId] = React.useState(initialCustomerId || ((_a = customers[0]) === null || _a === void 0 ? void 0 : _a.id) || '');
const [tab, setTab] = React.useState('jobs');
const customer = customers.find(c => c.id === selectedCustomerId);
// Filtered data for this customer
const customerAssets = assets.filter(a => a.customerId === selectedCustomerId);
const customerAssetIds = customerAssets.map(a => a.id);
const customerJobs = jobs.filter(j => customerAssetIds.includes(j.assetId));
const customerIec = iecReports.filter(r => customerAssetIds.includes(r.assetId));
const customerFunc = funcReports.filter(r => customerAssetIds.includes(r.assetId));
const openJobs = customerJobs.filter(j => j.status !== 'chiuso');
const Badge = ({ text, color }) => (React.createElement("span", { style: {
background: (color || '#64748b') + '22', color: color || '#64748b',
border: `1px solid ${color || '#64748b'}44`,
borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700,
textTransform: 'capitalize', whiteSpace: 'nowrap',
} }, text));
if (!customer && customers.length === 0) {
return (React.createElement("div", { style: { minHeight: '100vh', background: '#0D0D12', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, flexDirection: 'column', gap: 16 } },
React.createElement("div", { style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 14, padding: '32px 40px', textAlign: 'center', maxWidth: 400 } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 12 } }, "\uD83D\uDC65"),
React.createElement("h2", { style: { color: '#F0F0F5', fontSize: 18, marginBottom: 8 } }, "Nessun cliente"),
React.createElement("p", { style: { color: '#5A5A70', fontSize: 13, marginBottom: 20 } }, "Per provare la modalit\u00E0 portale cliente, prima crea almeno un cliente nella sezione Clienti."),
React.createElement("button", { onClick: onExit, style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, "\u2190 Torna all'app"))));
}
return (React.createElement("div", { style: { minHeight: '100vh', background: '#0D0D12', fontFamily: "'Segoe UI',system-ui,sans-serif" } },
React.createElement("div", { style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', padding: '7px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 700, flexWrap: 'wrap', gap: 6 } },
React.createElement("span", null, "\uD83D\uDC41 ANTEPRIMA PORTALE CLIENTE (read-only) \u2014 questo \u00E8 quello che vedr\u00E0 il tuo cliente"),
React.createElement("button", { onClick: onExit, style: { background: 'rgba(0,0,0,.2)', color: '#000', border: '1px solid rgba(0,0,0,.3)', borderRadius: 5, padding: '3px 10px', fontWeight: 700, fontSize: 11, cursor: 'pointer' } }, "\u2715 Esci anteprima")),
React.createElement("div", { style: { background: '#141418', borderBottom: '1px solid #2A2A38', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' } },
React.createElement("span", { style: { color: '#5A5A70', fontSize: 12, fontWeight: 700 } }, "Anteprima come cliente:"),
React.createElement("select", { value: selectedCustomerId, onChange: e => setSelectedCustomerId(e.target.value), style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 6, padding: '5px 12px', color: '#F0F0F5', fontSize: 13, fontWeight: 700 } }, customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement("span", { style: { marginLeft: 'auto', color: '#3A3A50', fontSize: 10 } },
"URL futuro: medtrace.app/portale/",
((_b = customer === null || customer === void 0 ? void 0 : customer.id) === null || _b === void 0 ? void 0 : _b.slice(-8)) || '...')),
React.createElement("div", { style: { background: '#141418', borderBottom: '1px solid #2A2A38', padding: '16px 20px' } },
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 16, maxWidth: 900, margin: '0 auto', flexWrap: 'wrap' } },
React.createElement("svg", { viewBox: "0 0 50 40", xmlns: "http://www.w3.org/2000/svg", style: { width: 50, height: 32, flexShrink: 0 } },
React.createElement("g", { fill: "none", stroke: "#2DD4BF", strokeWidth: "2.5", strokeLinecap: "round" },
React.createElement("path", { d: "M8 20 Q12 12 16 20 Q20 28 24 20" }),
React.createElement("path", { d: "M4 20 Q10 8 16 20 Q22 32 28 20" }),
React.createElement("path", { d: "M0 20 Q8 4 16 20 Q24 36 32 20" }),
React.createElement("circle", { cx: "38", cy: "20", r: "4", fill: "#2DD4BF" }))),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: '#F0F0F5', marginBottom: 2 } },
"Portale ",
(customer === null || customer === void 0 ? void 0 : customer.name) || 'Cliente'),
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70' } },
"Servizio assistenza tecnica di ",
company.name)),
React.createElement("div", { style: { background: '#2DD4BF18', border: '1px solid #2DD4BF33', borderRadius: 20, padding: '4px 12px', fontSize: 10, color: '#2DD4BF', fontWeight: 700 } }, "\u25CF ONLINE"))),
React.createElement("div", { style: { padding: '20px 16px', maxWidth: 900, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' } }, [
{ label: 'Apparecchi', value: customerAssets.length, color: '#2DD4BF' },
{ label: 'Job aperti', value: openJobs.length, color: openJobs.length > 0 ? '#f59e0b' : '#22c55e' },
{ label: 'Verifiche IEC', value: customerIec.length, color: '#9955ff' },
{ label: 'Verifiche funz.', value: customerFunc.length, color: '#0D9488' },
].map(k => (React.createElement("div", { key: k.label, style: { background: '#141418', border: '1px solid #2A2A38', borderTop: `3px solid ${k.color}`, borderRadius: 10, padding: '12px 18px', flex: 1, minWidth: 120 } },
React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: k.color, fontFamily: 'monospace' } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', marginTop: 4, textTransform: 'uppercase', letterSpacing: .7, fontWeight: 600 } }, k.label))))),
React.createElement("div", { style: { background: '#141418', border: '1px dashed #2DD4BF44', borderRadius: 10, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: '#F0F0F5' } }, "Richiedi intervento"),
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70' } }, "Segnala un guasto o richiedi una verifica programmata")),
React.createElement("button", { onClick: () => alert('Funzione disponibile nella versione cloud — richiede integrazione email'), style: { background: '#1E1E28', border: '1px solid #2DD4BF66', borderRadius: 6, color: '#2DD4BF', padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 700 } }, "+ Nuova richiesta")),
React.createElement("div", { style: { display: 'flex', gap: 2, marginBottom: 16, borderBottom: '2px solid #2A2A38', overflowX: 'auto' } }, [
{ id: 'jobs', label: `Interventi (${customerJobs.length})` },
{ id: 'assets', label: `Apparecchi (${customerAssets.length})` },
{ id: 'iec', label: `Sic. Elettrica (${customerIec.length})` },
{ id: 'func', label: `Funzionali (${customerFunc.length})` },
].map(t => (React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: {
background: 'none', border: 'none',
borderBottom: tab === t.id ? '2px solid #2DD4BF' : '2px solid transparent',
color: tab === t.id ? '#2DD4BF' : '#6A6A80',
padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
marginBottom: -2, whiteSpace: 'nowrap', flexShrink: 0,
} }, t.label)))),
tab === 'jobs' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, customerJobs.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#5A5A70', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38' } }, "Nessun intervento registrato")) : customerJobs.slice().sort((a, b) => (b.openDate || '').localeCompare(a.openDate || '')).map(j => {
const asset = assets.find(a => a.id === j.assetId);
const hasReport = j.iecReportId || j.funcReportId;
return (React.createElement("div", { key: j.id, style: { background: '#141418', border: `1px solid ${j.status === 'chiuso' ? '#22c55e22' : j.status === 'aperto' ? '#ef444422' : '#2A2A38'}`, borderRadius: 10, padding: '14px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 8 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 } },
React.createElement("span", { style: { fontFamily: 'monospace', fontSize: 11, color: '#5A5A70' } }, j.id),
React.createElement(Badge, { text: j.status, color: STATUS_COLOR_PORTAL[j.status] }),
React.createElement(Badge, { text: j.priority, color: j.priority === 'urgente' ? '#ef4444' : j.priority === 'alta' ? '#f97316' : '#94a3b8' }),
React.createElement("span", { style: { fontSize: 11, color: '#5A5A70', textTransform: 'capitalize' } }, j.type)),
React.createElement("div", { style: { fontSize: 13, color: '#F0F0F5', fontWeight: 600, marginBottom: 3 } }, j.description || '—'),
asset && (React.createElement("div", { style: { fontSize: 11, color: '#5A5A70' } },
"\uD83D\uDCE6 ",
asset.name,
asset.brand ? ` · ${asset.brand}` : '',
asset.serial ? ` · S/N: ${asset.serial}` : ''))),
React.createElement("div", { style: { textAlign: 'right', flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70' } }, j.openDate),
j.closeDate && React.createElement("div", { style: { fontSize: 11, color: '#22c55e', fontWeight: 700 } },
"Chiuso: ",
j.closeDate))),
j.timeline && j.timeline.length > 0 && (React.createElement("div", { style: { marginTop: 8, padding: '8px 12px', background: '#0D0D12', borderRadius: 6, borderLeft: '3px solid #2DD4BF' } },
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: .5 } },
"Timeline (",
j.timeline.length,
" step)"),
j.timeline.slice(-3).map((t, i) => (React.createElement("div", { key: i, style: { fontSize: 11, color: '#9090A8', marginBottom: 2 } },
React.createElement("span", { style: { color: '#5A5A70', fontFamily: 'monospace', marginRight: 6 } }, t.date),
t.note))))),
j.attachments && j.attachments.length > 0 && (React.createElement("div", { style: { marginTop: 8, padding: '8px 12px', background: '#0D0D12', borderRadius: 6, borderLeft: '3px solid #a855f7' } },
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: .5 } },
"Documenti allegati (",
j.attachments.length,
")"),
j.attachments.map(att => {
var _a;
return (React.createElement("div", { key: att.id, style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 } },
React.createElement("span", { style: { fontSize: 13 } }, ((_a = att.type) === null || _a === void 0 ? void 0 : _a.startsWith('image/')) ? '🖼' : att.type === 'application/pdf' ? '📄' : '📎'),
React.createElement("span", { style: { fontSize: 11, color: '#9090A8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, att.name),
React.createElement("button", { onClick: () => downloadAttachment(att), style: { background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 4, color: '#2DD4BF', padding: '2px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, "\u2B07 Scarica")));
}))),
hasReport && (React.createElement("div", { style: { marginTop: 8, fontSize: 11, color: '#2DD4BF' } }, "\u2713 Rapporto tecnico collegato (visibile nelle tab dedicate)"))));
}))),
tab === 'assets' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, customerAssets.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#5A5A70', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38' } }, "Nessun apparecchio registrato")) : customerAssets.map(a => (React.createElement("div", { key: a.id, style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: '#F0F0F5', marginBottom: 4 } }, a.name),
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70' } }, [a.brand, a.model, a.serial && `S/N: ${a.serial}`, a.location].filter(Boolean).join(' · ')),
a.iecNorm && (React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', marginTop: 4 } },
"Norma: ",
React.createElement("span", { style: { color: '#9090A8' } }, a.iecNorm),
a.riskClass && ` · Classe rischio: ${a.riskClass}`))),
React.createElement(Badge, { text: a.status, color: STATUS_COLOR_PORTAL[a.status] })),
a.nextService && (React.createElement("div", { style: { marginTop: 8, padding: '6px 10px', background: '#0D0D12', borderRadius: 6, fontSize: 11, color: '#5A5A70', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 } },
React.createElement("span", null, "Prossima manutenzione:"),
React.createElement("span", { style: { color: '#F0F0F5', fontWeight: 700 } }, a.nextService)))))))),
tab === 'iec' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, customerIec.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#5A5A70', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38' } }, "Nessuna verifica di sicurezza elettrica")) : customerIec.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(r => {
const asset = assets.find(a => a.id === r.assetId);
return (React.createElement("div", { key: r.id, style: { background: '#141418', border: `1px solid ${r.overallPass ? '#22c55e33' : '#ef444433'}`, borderRadius: 10, padding: '14px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 } },
React.createElement("span", { style: { fontFamily: 'monospace', fontWeight: 700, color: '#F0F0F5' } }, r.reportNumber || r.id),
React.createElement("span", { style: { fontSize: 10, color: '#5A5A70' } },
"IEC ",
r.norm,
" \u00B7 Cl.",
r.equipClass,
" \u00B7 ",
r.patientType || 'BF')),
React.createElement("div", { style: { fontSize: 11, color: '#9090A8' } },
r.date,
asset ? ` · ${asset.name}` : '',
r.technician ? ` · ${r.technician}` : '')),
React.createElement("div", { style: { display: 'flex', gap: 8, alignItems: 'center' } },
React.createElement(Badge, { text: r.overallPass ? 'CONFORME' : 'NON CONFORME', color: r.overallPass ? '#22c55e' : '#ef4444' }))),
r.attachments && r.attachments.length > 0 && (React.createElement("div", { style: { marginTop: 8, padding: '8px 12px', background: '#0D0D12', borderRadius: 6, borderLeft: '3px solid #a855f7' } },
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase' } }, "Documenti"),
r.attachments.map(att => {
var _a;
return (React.createElement("div", { key: att.id, style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 } },
React.createElement("span", { style: { fontSize: 12 } }, ((_a = att.type) === null || _a === void 0 ? void 0 : _a.startsWith('image/')) ? '🖼' : att.type === 'application/pdf' ? '📄' : '📎'),
React.createElement("span", { style: { fontSize: 11, color: '#9090A8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, att.name),
React.createElement("button", { onClick: () => downloadAttachment(att), style: { background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 4, color: '#2DD4BF', padding: '2px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, "\u2B07")));
}))),
React.createElement("button", { onClick: () => generateIECPDF(r, asset, customer, company), style: { marginTop: 10, background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 6, color: '#2DD4BF', padding: '5px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2B07 Scarica rapporto PDF")));
}))),
tab === 'func' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 } }, customerFunc.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#5A5A70', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38' } }, "Nessuna verifica funzionale")) : customerFunc.slice().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(r => {
const asset = assets.find(a => a.id === r.assetId);
return (React.createElement("div", { key: r.id, style: { background: '#141418', border: `1px solid ${r.overallPass ? '#22c55e33' : '#ef444433'}`, borderRadius: 10, padding: '14px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 } },
React.createElement("span", { style: { fontFamily: 'monospace', fontWeight: 700, color: '#F0F0F5' } }, r.reportNumber || r.id)),
React.createElement("div", { style: { fontSize: 11, color: '#9090A8' } },
r.date,
asset ? ` · ${asset.name}` : '',
r.technician ? ` · ${r.technician}` : '')),
React.createElement(Badge, { text: r.overallPass ? 'CONFORME' : 'NON CONFORME', color: r.overallPass ? '#22c55e' : '#ef4444' })),
r.attachments && r.attachments.length > 0 && (React.createElement("div", { style: { marginTop: 8, padding: '8px 12px', background: '#0D0D12', borderRadius: 6, borderLeft: '3px solid #a855f7' } },
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', fontWeight: 700, marginBottom: 5, textTransform: 'uppercase' } }, "Documenti"),
r.attachments.map(att => {
var _a;
return (React.createElement("div", { key: att.id, style: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 } },
React.createElement("span", { style: { fontSize: 12 } }, ((_a = att.type) === null || _a === void 0 ? void 0 : _a.startsWith('image/')) ? '🖼' : att.type === 'application/pdf' ? '📄' : '📎'),
React.createElement("span", { style: { fontSize: 11, color: '#9090A8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, att.name),
React.createElement("button", { onClick: () => downloadAttachment(att), style: { background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 4, color: '#2DD4BF', padding: '2px 8px', cursor: 'pointer', fontSize: 10, fontWeight: 700 } }, "\u2B07")));
}))),
React.createElement("button", { onClick: () => generateFuncPDF(r, asset, customer, company), style: { marginTop: 10, background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 6, color: '#2DD4BF', padding: '5px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2B07 Scarica rapporto PDF")));
}))),
React.createElement("div", { style: { textAlign: 'center', marginTop: 32, padding: '16px 0', fontSize: 11, color: '#3A3A50', borderTop: '1px solid #1a1a22' } },
company.name,
" \u00B7 Portale Cliente \u2014 Solo visualizzazione",
React.createElement("br", null),
"Per assistenza tecnica contatta il tuo referente"))));
}
/* ═══ PROCEDURES (Test Procedures / Knowledge Base) ══════════════════════════
* iFixit-style: ogni procedura ha modello target + passi numerati con
* descrizione, valore atteso, 1 foto opzionale.
* ═══════════════════════════════════════════════════════════════════════════ */
const PROC_CATEGORIES = [
'Defibrillatore', 'Monitor multiparametrico', 'Ventilatore', 'Aspiratore',
'Pompa infusionale', 'Elettrobisturi', 'Ecografo', 'Letto elettrico', 'ECG',
'Termometro', 'DAE', 'Generico/Altro',
];
const PROC_TYPES = [
'PPM annuale', 'PPM semestrale', 'PPM trimestrale',
'Calibrazione', 'Verifica sicurezza elettrica', 'Troubleshooting',
'Sostituzione componente', 'Aggiornamento firmware', 'Cleaning/Disinfezione', 'Altro',
];
function ProceduresPage({ procedures, setProcedures, instruments, parts, assets, showToast, setTab }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterCat, setFilterCat] = React.useState('all');
const [filterType, setFilterType] = React.useState('all');
const [viewProcId, setViewProcId] = React.useState(null);
const filtered = procedures.filter(p => {
if (search) {
const q = search.toLowerCase();
const hit = [p.modelName, p.brand, p.category, p.type, p.notes]
.filter(Boolean).some(s => s.toLowerCase().includes(q));
if (!hit)
return false;
}
if (filterCat !== 'all' && p.category !== filterCat)
return false;
if (filterType !== 'all' && p.type !== filterType)
return false;
return true;
});
const saveProc = (proc) => {
if (proc.id) {
setProcedures(prev => prev.map(p => p.id === proc.id ? proc : p));
}
else {
const newP = Object.assign(Object.assign({}, proc), { id: 'P' + Date.now(), createdAt: new Date().toISOString() });
setProcedures(prev => [...prev, newP]);
}
setModal(null);
showToast('✓ Procedura salvata');
};
const delProc = (id) => {
if (!confirm('Eliminare questa procedura?'))
return;
setProcedures(prev => prev.filter(p => p.id !== id));
setViewProcId(null);
showToast('Procedura eliminata');
};
const duplicateProc = (proc) => {
const copy = Object.assign(Object.assign({}, proc), { id: 'P' + Date.now(), modelName: proc.modelName + ' (copia)', createdAt: new Date().toISOString() });
setProcedures(prev => [...prev, copy]);
showToast('✓ Duplicata');
};
// Detail view
if (viewProcId) {
const proc = procedures.find(p => p.id === viewProcId);
if (!proc) {
setViewProcId(null);
return null;
}
return (React.createElement(React.Fragment, null,
React.createElement(ProcedureDetail, { proc: proc, onEdit: () => setModal({ type: 'form', data: proc }), onDuplicate: () => duplicateProc(proc), onDelete: () => delProc(proc.id), onBack: () => setViewProcId(null), showToast: showToast }),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? 'Modifica Procedura' : 'Nuova Procedura', wide: true, onClose: () => setModal(null) },
React.createElement(ProcedureForm, { initial: modal.data, instruments: instruments, parts: parts, onSave: saveProc, onClose: () => setModal(null) })))));
}
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 1100, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, "Procedure Tecniche"),
React.createElement("p", { style: { color: '#64748b', margin: '3px 0 0', fontSize: 12 } }, "Guide passo-passo per modello specifico (knowledge base interna)")),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, "+ Nuova procedura")),
React.createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' } },
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Cerca per modello, marca, categoria\u2026", style: { flex: 1, minWidth: 200, background: '#141418', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: '#F0F0F5', fontSize: 13, outline: 'none' } }),
React.createElement("select", { value: filterCat, onChange: e => setFilterCat(e.target.value), style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: '#9090A8', fontSize: 12 } },
React.createElement("option", { value: "all" }, "Tutte le categorie"),
PROC_CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c))),
React.createElement("select", { value: filterType, onChange: e => setFilterType(e.target.value), style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: '#9090A8', fontSize: 12 } },
React.createElement("option", { value: "all" }, "Tutti i tipi"),
PROC_TYPES.map(t => React.createElement("option", { key: t, value: t }, t)))),
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70', marginBottom: 12 } },
filtered.length,
" di ",
procedures.length,
" procedure"),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#5A5A70', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38' } }, procedures.length === 0 ? (React.createElement(React.Fragment, null,
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCDA"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 6 } }, "Nessuna procedura ancora"),
React.createElement("div", { style: { fontSize: 12, marginBottom: 14 } }, "Crea la tua prima guida tecnica passo-passo"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, "+ Crea procedura"))) : 'Nessun risultato')) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.map(p => (React.createElement("div", { key: p.id, onClick: () => setViewProcId(p.id), style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all .15s' }, onMouseEnter: e => e.currentTarget.style.borderColor = '#2DD4BF66', onMouseLeave: e => e.currentTarget.style.borderColor = '#2A2A38' },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 5 } },
p.category && React.createElement("span", { style: { fontSize: 10, background: '#2DD4BF18', color: '#2DD4BF', border: '1px solid #2DD4BF33', borderRadius: 20, padding: '1px 8px', fontWeight: 700 } }, p.category),
p.type && React.createElement("span", { style: { fontSize: 10, background: '#a855f718', color: '#a855f7', border: '1px solid #a855f733', borderRadius: 20, padding: '1px 8px', fontWeight: 700 } }, p.type)),
React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: '#F0F0F5', marginBottom: 3 } },
p.brand && React.createElement("span", { style: { color: '#9090A8' } }, p.brand),
" ",
p.modelName),
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70', display: 'flex', gap: 14, flexWrap: 'wrap' } },
p.steps && React.createElement("span", null,
"\uD83D\uDCCB ",
p.steps.length,
" step"),
p.estimatedMinutes && React.createElement("span", null,
"\u23F1 ~",
p.estimatedMinutes,
" min"),
p.toolsRequired && p.toolsRequired.length > 0 && React.createElement("span", null,
"\uD83D\uDD27 ",
p.toolsRequired.length,
" strumenti"))),
React.createElement("div", { style: { flexShrink: 0, fontSize: 18, color: '#5A5A70' } }, "\u203A"))))))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? 'Modifica Procedura' : 'Nuova Procedura', wide: true, onClose: () => setModal(null) },
React.createElement(ProcedureForm, { initial: modal.data, instruments: instruments, parts: parts, onSave: saveProc, onClose: () => setModal(null) })))));
}
/* ─── Procedure Detail (read view) ─────────────────────────────────────────── */
function ProcedureDetail({ proc, onEdit, onDuplicate, onDelete, onBack, showToast }) {
var _a;
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 900, margin: '0 auto' } },
React.createElement("button", { onClick: onBack, style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 6, color: '#94a3b8', padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700, marginBottom: 12 } }, "\u2190 Procedure"),
React.createElement("div", { style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 12, padding: '18px 20px', marginBottom: 14 } },
React.createElement("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: onEdit, style: { background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 6, color: '#2DD4BF', padding: '6px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: onDuplicate, style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 6, color: '#94a3b8', padding: '6px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2398 Duplica"),
React.createElement("button", { onClick: onDelete, style: { background: '#1E1E28', border: '1px solid #ef444433', borderRadius: 6, color: '#ef4444', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2715 Elimina")),
React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("div", { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 } },
proc.category && React.createElement("span", { style: { fontSize: 10, background: '#2DD4BF18', color: '#2DD4BF', border: '1px solid #2DD4BF33', borderRadius: 20, padding: '2px 10px', fontWeight: 700 } }, proc.category),
proc.type && React.createElement("span", { style: { fontSize: 10, background: '#a855f718', color: '#a855f7', border: '1px solid #a855f733', borderRadius: 20, padding: '2px 10px', fontWeight: 700 } }, proc.type)),
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900, color: '#F0F0F5', wordBreak: 'break-word' } },
proc.brand,
" ",
proc.modelName),
proc.description && React.createElement("p", { style: { margin: '6px 0 0', fontSize: 13, color: '#9090A8', lineHeight: 1.5 } }, proc.description)),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, marginTop: 10, padding: '10px 0', borderTop: '1px solid #2A2A38' } },
proc.estimatedMinutes && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .7, fontWeight: 700 } }, "Tempo stimato"),
React.createElement("div", { style: { fontSize: 13, color: '#F0F0F5', fontWeight: 700, marginTop: 2 } },
"\u23F1 ",
proc.estimatedMinutes,
" min"))),
proc.toolsRequired && proc.toolsRequired.length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .7, fontWeight: 700 } }, "Strumenti"),
React.createElement("div", { style: { fontSize: 12, color: '#F0F0F5', marginTop: 2 } }, proc.toolsRequired.join(', ')))),
proc.partsTypical && proc.partsTypical.length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .7, fontWeight: 700 } }, "Ricambi tipici"),
React.createElement("div", { style: { fontSize: 12, color: '#F0F0F5', marginTop: 2 } }, proc.partsTypical.join(', ')))))),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, marginBottom: 8 } },
"Procedura \u2014 ",
((_a = proc.steps) === null || _a === void 0 ? void 0 : _a.length) || 0,
" passi"),
!proc.steps || proc.steps.length === 0 ? (React.createElement("div", { style: { padding: 20, color: '#5A5A70', fontStyle: 'italic', textAlign: 'center' } }, "Nessun passo definito")) : proc.steps.map((step, i) => (React.createElement("div", { key: i, style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px', marginBottom: 8 } },
React.createElement("div", { style: { display: 'flex', gap: 12, alignItems: 'flex-start' } },
React.createElement("div", { style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, flexShrink: 0 } }, i + 1),
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
step.title && React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: '#F0F0F5', marginBottom: 5 } }, step.title),
step.description && React.createElement("div", { style: { fontSize: 13, color: '#c0c0d0', lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: 8 } }, step.description),
step.expectedValue && (React.createElement("div", { style: { background: '#0D0D12', border: '1px solid #2DD4BF33', borderRadius: 6, padding: '6px 12px', marginTop: 6, fontSize: 12 } },
React.createElement("span", { style: { color: '#5A5A70', fontWeight: 700, marginRight: 6, fontSize: 10, textTransform: 'uppercase' } }, "Atteso:"),
React.createElement("span", { style: { color: '#2DD4BF', fontWeight: 700 } }, step.expectedValue))),
step.warning && (React.createElement("div", { style: { background: '#f59e0b15', border: '1px solid #f59e0b44', borderRadius: 6, padding: '6px 12px', marginTop: 6, fontSize: 12, color: '#f59e0b' } },
"\u26A0 ",
step.warning)),
step.image && (React.createElement("div", { style: { marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid #2A2A38', maxWidth: 400 } },
React.createElement("img", { src: step.image, alt: `Step ${i + 1}`, style: { width: '100%', height: 'auto', display: 'block', cursor: 'pointer' }, onClick: () => window.open(step.image, '_blank') }))))))))),
proc.notes && (React.createElement("div", { style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 18px', marginBottom: 14, borderLeft: '4px solid #2DD4BF' } },
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, marginBottom: 6 } }, "Note e tips"),
React.createElement("div", { style: { fontSize: 13, color: '#c0c0d0', whiteSpace: 'pre-wrap', lineHeight: 1.6 } }, proc.notes))),
React.createElement("div", { style: { textAlign: 'center', fontSize: 10, color: '#3A3A50', marginTop: 20 } },
"Creata il ",
(proc.createdAt || '').slice(0, 10))));
}
/* ─── Procedure Form (edit) ────────────────────────────────────────────────── */
function ProcedureForm({ initial, instruments, parts, onSave, onClose }) {
const [form, setForm] = React.useState(initial || {
brand: '', modelName: '', category: '', type: '',
description: '', estimatedMinutes: '',
toolsRequired: [], partsTypical: [],
steps: [], notes: '',
});
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const addStep = () => {
setForm(f => (Object.assign(Object.assign({}, f), { steps: [...(f.steps || []), { title: '', description: '', expectedValue: '', warning: '', image: '' }] })));
};
const updStep = (i, key, val) => {
setForm(f => (Object.assign(Object.assign({}, f), { steps: f.steps.map((s, idx) => idx === i ? Object.assign(Object.assign({}, s), { [key]: val }) : s) })));
};
const moveStep = (i, dir) => {
setForm(f => {
const ns = [...f.steps];
const target = i + dir;
if (target < 0 || target >= ns.length)
return f;
[ns[i], ns[target]] = [ns[target], ns[i]];
return Object.assign(Object.assign({}, f), { steps: ns });
});
};
const delStep = (i) => {
if (!confirm('Eliminare questo passo?'))
return;
setForm(f => (Object.assign(Object.assign({}, f), { steps: f.steps.filter((_, idx) => idx !== i) })));
};
const uploadStepImage = (i, file) => __awaiter(this, void 0, void 0, function* () {
if (!file)
return;
if (file.size > 3 * 1024 * 1024) {
alert('Immagine troppo grande (>3MB). Comprimi prima.');
return;
}
try {
const att = yield fileToAttachment(file);
updStep(i, 'image', att.dataUrl);
}
catch (e) {
alert('Errore: ' + e.message);
}
});
const INP = { width: '100%', background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 7, padding: '9px 12px', color: '#F0F0F5', fontSize: 13, outline: 'none', fontFamily: 'inherit' };
const LBL = { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, display: 'block', marginBottom: 4 };
const ROW = { display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' };
return (React.createElement("div", { style: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 6 } },
React.createElement("div", { style: ROW },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Marca"),
React.createElement("input", { style: INP, value: form.brand, onChange: e => set('brand', e.target.value), placeholder: "es. Philips" })),
React.createElement("div", { style: { flex: 2, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Modello *"),
React.createElement("input", { style: INP, value: form.modelName, onChange: e => set('modelName', e.target.value), placeholder: "es. HeartStart MRx" }))),
React.createElement("div", { style: ROW },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Categoria"),
React.createElement("select", { style: INP, value: form.category, onChange: e => set('category', e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
PROC_CATEGORIES.map(c => React.createElement("option", { key: c, value: c }, c)))),
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Tipo procedura"),
React.createElement("select", { style: INP, value: form.type, onChange: e => set('type', e.target.value) },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
PROC_TYPES.map(t => React.createElement("option", { key: t, value: t }, t)))),
React.createElement("div", { style: { width: 140 } },
React.createElement("label", { style: LBL }, "Tempo (min)"),
React.createElement("input", { type: "number", style: INP, value: form.estimatedMinutes, onChange: e => set('estimatedMinutes', e.target.value), placeholder: "60" }))),
React.createElement("div", { style: { marginBottom: 12 } },
React.createElement("label", { style: LBL }, "Descrizione breve"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 50, resize: 'vertical' }), value: form.description, onChange: e => set('description', e.target.value), placeholder: "A cosa serve, contesto, frequenza consigliata\u2026" })),
React.createElement("div", { style: ROW },
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Strumenti necessari (separati da virgola)"),
React.createElement("input", { style: INP, value: (form.toolsRequired || []).join(', '), onChange: e => set('toolsRequired', e.target.value.split(',').map(s => s.trim()).filter(Boolean)), placeholder: "es. Fluke Impulse 7000, Multimetro" })),
React.createElement("div", { style: { flex: 1, minWidth: 140 } },
React.createElement("label", { style: LBL }, "Ricambi tipici"),
React.createElement("input", { style: INP, value: (form.partsTypical || []).join(', '), onChange: e => set('partsTypical', e.target.value.split(',').map(s => s.trim()).filter(Boolean)), placeholder: "es. Batteria, elettrodi" }))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', margin: '18px 0 12px', paddingTop: 14 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 12, color: '#2DD4BF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 } },
"Passi della procedura (",
(form.steps || []).length,
")"),
React.createElement("button", { type: "button", onClick: addStep, style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 11, fontWeight: 800 } }, "+ Aggiungi passo")),
(form.steps || []).length === 0 ? (React.createElement("div", { style: { padding: 20, background: '#0D0D12', border: '1px dashed #2A2A38', borderRadius: 8, color: '#5A5A70', textAlign: 'center', fontSize: 12 } }, "Nessun passo. Clicca \"+ Aggiungi passo\" per iniziare.")) : form.steps.map((step, i) => (React.createElement("div", { key: i, style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 8, padding: 12, marginBottom: 8 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
React.createElement("div", { style: { background: '#2DD4BF', color: '#000', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11 } }, i + 1),
React.createElement("span", { style: { color: '#5A5A70', fontSize: 11 } },
"Passo ",
i + 1)),
React.createElement("div", { style: { display: 'flex', gap: 4 } },
React.createElement("button", { type: "button", onClick: () => moveStep(i, -1), disabled: i === 0, style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 4, color: '#94a3b8', padding: '2px 7px', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: i === 0 ? .3 : 1 } }, "\u2191"),
React.createElement("button", { type: "button", onClick: () => moveStep(i, 1), disabled: i === form.steps.length - 1, style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 4, color: '#94a3b8', padding: '2px 7px', cursor: i === form.steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 11, opacity: i === form.steps.length - 1 ? .3 : 1 } }, "\u2193"),
React.createElement("button", { type: "button", onClick: () => delStep(i), style: { background: '#1E1E28', border: '1px solid #ef444433', borderRadius: 4, color: '#ef4444', padding: '2px 7px', cursor: 'pointer', fontSize: 11 } }, "\u2715"))),
React.createElement("input", { style: Object.assign(Object.assign({}, INP), { marginBottom: 6 }), value: step.title || '', onChange: e => updStep(i, 'title', e.target.value), placeholder: "Titolo del passo (es. Test scarica 200J)" }),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical', marginBottom: 6 }), value: step.description || '', onChange: e => updStep(i, 'description', e.target.value), placeholder: "Descrizione dettagliata. Cosa fare, come collegarlo, dove guardare\u2026" }),
React.createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' } },
React.createElement("input", { style: Object.assign(Object.assign({}, INP), { flex: 1, minWidth: 120 }), value: step.expectedValue || '', onChange: e => updStep(i, 'expectedValue', e.target.value), placeholder: "Valore atteso (es. 195-205 J)" }),
React.createElement("input", { style: Object.assign(Object.assign({}, INP), { flex: 1, minWidth: 120 }), value: step.warning || '', onChange: e => updStep(i, 'warning', e.target.value), placeholder: "\u26A0 Avvertenza (opzionale)" })),
step.image ? (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8, padding: 6, background: '#141418', borderRadius: 6, border: '1px solid #2A2A38' } },
React.createElement("img", { src: step.image, style: { width: 60, height: 60, objectFit: 'cover', borderRadius: 4 } }),
React.createElement("span", { style: { fontSize: 11, color: '#5A5A70', flex: 1 } }, "Immagine caricata"),
React.createElement("button", { type: "button", onClick: () => updStep(i, 'image', ''), style: { background: '#1E1E28', border: '1px solid #ef444433', borderRadius: 4, color: '#ef4444', padding: '3px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "Rimuovi"))) : (React.createElement("label", { style: { display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', background: '#141418', border: '1px dashed #2DD4BF44', borderRadius: 6, padding: '5px 12px', color: '#2DD4BF', fontSize: 11, fontWeight: 700 } },
React.createElement("input", { type: "file", accept: "image/*", onChange: e => { var _a; return uploadStepImage(i, (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]); }, style: { display: 'none' } }),
"\uD83D\uDDBC + Aggiungi 1 foto (max 3MB)")))))),
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, "Note e tips appresi sul campo"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 70, resize: 'vertical' }), value: form.notes, onChange: e => set('notes', e.target.value), placeholder: "Errori comuni, accorgimenti, esperienze utili\u2026" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #2A2A38', position: 'sticky', bottom: 0, background: '#1a1a22', margin: '0 -6px', padding: '12px 6px' } },
React.createElement("button", { onClick: onClose, style: { background: '#202028', border: '1px solid #2a3040', borderRadius: 7, color: '#94a3b8', padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 } }, "Annulla"),
React.createElement("button", { onClick: () => { if (!form.modelName) {
alert('Modello obbligatorio');
return;
} onSave(form); }, style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 7, padding: '9px 18px', cursor: 'pointer', fontWeight: 800, fontSize: 13 } }, initial ? 'Salva modifiche' : 'Crea procedura'))));
}
function ExcelTable({ cols, rows, onEdit, onDelete, actions, defaultSort, rowBg, onRowClick }) {
var _a;
const [sort, setSort] = React.useState({ key: defaultSort || ((_a = cols[0]) === null || _a === void 0 ? void 0 : _a.key), dir: "asc" });
const [filters, setFilters] = React.useState({});
const [gs, setGs] = React.useState("");
const setF = (k, v) => setFilters(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const clearF = () => { setFilters({}); setGs(""); };
const hasF = Object.values(filters).some(v => v) || gs;
const filtered = React.useMemo(() => {
let r = rows;
if (gs) {
const q = gs.toLowerCase();
r = r.filter(row => cols.some(c => String(row[c.key] || "").toLowerCase().includes(q)));
}
Object.entries(filters).forEach(([k, v]) => { if (!v)
return; r = r.filter(row => String(row[k] || "").toLowerCase().includes(v.toLowerCase())); });
return [...r].sort((a, b) => {
let av = a[sort.key] || "", bv = b[sort.key] || "";
if (!isNaN(av) && !isNaN(bv)) {
av = +av;
bv = +bv;
}
if (av < bv)
return sort.dir === "asc" ? -1 : 1;
if (av > bv)
return sort.dir === "asc" ? 1 : -1;
return 0;
});
}, [rows, filters, gs, sort]);
const toggleSort = k => setSort(s => s.key === k ? Object.assign(Object.assign({}, s), { dir: s.dir === "asc" ? "desc" : "asc" }) : { key: k, dir: "asc" });
return (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", background: "#0F0F14", border: "1px solid #1e2a3a", borderBottom: "none", borderRadius: "10px 10px 0 0", flexWrap: "wrap" } },
React.createElement("input", { placeholder: " Cerca\u2026", value: gs, onChange: e => setGs(e.target.value), style: { background: "#16161C", border: "1px solid #1e2a3a", borderRadius: 6, padding: "5px 10px", color: "#e2e8f0", fontSize: 12, outline: "none", width: 200 } }),
hasF && React.createElement("button", { onClick: clearF, style: { background: "none", border: "1px solid #ef444433", borderRadius: 5, color: "#ef4444", padding: "4px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2715 Azzera"),
React.createElement("span", { style: { marginLeft: "auto", fontSize: 11, color: "#475569", fontFamily: "monospace" } },
filtered.length,
"/",
rows.length)),
React.createElement("div", { style: { overflow: "auto", border: "1px solid #1e2a3a", borderRadius: "0 0 10px 10px", background: "#111116", maxHeight: "65vh" } },
React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" } },
React.createElement("thead", null,
React.createElement("tr", null,
cols.map(c => (React.createElement("th", { key: c.key, style: Object.assign(Object.assign({}, TH_S), { color: sort.key === c.key ? "#5EEAD4" : "#64748b" }), onClick: () => toggleSort(c.key) },
c.label,
" ",
React.createElement("span", { style: { fontSize: 9, opacity: .6 } }, sort.key === c.key ? (sort.dir === "asc" ? "▲" : "▼") : "⇅")))),
(onEdit || onDelete || actions) && React.createElement("th", { style: Object.assign(Object.assign({}, TH_S), { cursor: "default" }) }, "Azioni")),
React.createElement("tr", null,
cols.map(c => (React.createElement("td", { key: c.key, style: { padding: "3px 5px", background: "#090910", borderBottom: "2px solid #2563eb" } }, c.opts ? (React.createElement("select", { value: filters[c.key] || "", onChange: e => setF(c.key, e.target.value), style: { background: "#16161C", border: "1px solid #1e2a3a", borderRadius: 4, padding: "3px 6px", color: "#e2e8f0", fontSize: 11, width: "100%", outline: "none" } },
React.createElement("option", { value: "" }, "Tutti"),
c.opts.map(o => React.createElement("option", { key: o, value: o }, o)))) : (React.createElement("input", { placeholder: "\u2026", value: filters[c.key] || "", onChange: e => setF(c.key, e.target.value), style: { background: "#16161C", border: "1px solid #1e2a3a", borderRadius: 4, padding: "3px 6px", color: "#e2e8f0", fontSize: 11, width: "100%", outline: "none" } }))))),
(onEdit || onDelete || actions) && React.createElement("td", { style: { padding: "3px 5px", background: "#090910", borderBottom: "2px solid #2563eb" } }))),
React.createElement("tbody", null, filtered.length === 0 ? (React.createElement("tr", null,
React.createElement("td", { colSpan: cols.length + (onEdit || onDelete || actions ? 1 : 0), style: { textAlign: "center", padding: 32, color: "#475569" } }, "Nessun risultato"))) : filtered.map((row, i) => {
const bg = rowBg ? rowBg(row) : "";
return (React.createElement("tr", { key: row.id || i, style: { background: bg, cursor: onRowClick ? "pointer" : undefined }, onDoubleClick: onRowClick ? () => onRowClick(row) : undefined },
cols.map(c => (React.createElement("td", { key: c.key, style: Object.assign({}, TD_S), title: String(row[c.key] || "") }, c.render ? c.render(row[c.key], row) : String(row[c.key] || "—")))),
(onEdit || onDelete || actions) && (React.createElement("td", { style: Object.assign(Object.assign({}, TD_S), { whiteSpace: "nowrap" }) },
React.createElement("div", { style: { display: "flex", gap: 4 } },
actions && actions(row),
onEdit && React.createElement("button", { onClick: () => onEdit(row), style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u270F"),
onDelete && React.createElement("button", { onClick: () => { if (confirm("Eliminare questa riga? L'azione non si può annullare."))
onDelete(row.id); }, style: { background: "#ef444415", border: "1px solid #ef444430", borderRadius: 5, color: "#ef4444", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2715"))))));
}))))));
}
function AlertChip({ days }) {
if (days === null || days === undefined)
return React.createElement("span", { style: { color: "#475569", fontSize: 11 } }, "\u2014");
const [bg, col, label] = days < 0 ? ["#ef444420", "#ef4444", "SCAD." + (Math.abs(days)) + "gg"] : days === 0 ? ["#ef444420", "#ef4444", "OGGI"] : days <= 7 ? ["#f9730020", "#f97316", "⚠" + (days) + "gg"] : days <= 30 ? ["#f59e0b20", "#f59e0b", (days) + "gg"] : ["#22c55e20", "#22c55e", (days) + "gg"];
return React.createElement("span", { style: { background: bg, color: col, border: "1px solid " + (col) + "44", borderRadius: 5, padding: "2px 7px", fontSize: 10, fontWeight: 700, fontFamily: "monospace", whiteSpace: "nowrap" } }, label);
}
/* ═══ UI COMPONENTS ═══════════════════════════════════════════ */
const Badge = ({ text, color }) => (React.createElement("span", { style: { background: color + "18", color, border: "1px solid " + (color) + "40", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", whiteSpace: "nowrap" } }, text));
const Pill = ({ label, value, color, sub, onClick }) => (React.createElement("div", { onClick: onClick, style: { background: "#141418", border: "1px solid #2A2A38", borderTop: "3px solid " + (color || "#2DD4BF"), borderRadius: 10, padding: "12px 16px", flex: 1, minWidth: 110, boxShadow: "0 2px 8px #0006", cursor: onClick ? "pointer" : "default", transition: "transform .15s, box-shadow .15s, border-color .15s" }, onMouseOver: onClick ? e => { e.currentTarget.style.borderColor = "#2DD4BF66"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px #0008"; } : undefined, onMouseOut: onClick ? e => { e.currentTarget.style.borderColor = "#2A2A38"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px #0006"; } : undefined },
React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: color || "#F0F0F5", lineHeight: 1, fontFamily: "monospace" } }, value),
React.createElement("div", { style: { fontSize: 10, color: "#5A5A70", marginTop: 5, textTransform: "uppercase", letterSpacing: .7, fontWeight: 600 } }, label),
sub && React.createElement("div", { style: { fontSize: 9, color: "#3A3A50", marginTop: 2 } }, sub)));
function Btn(_a) {
var { children, variant = "primary", sm } = _a, props = __rest(_a, ["children", "variant", "sm"]);
const base = { borderRadius: 8, cursor: "pointer", fontWeight: 700, transition: "all .15s", border: "none", display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: .2 };
const vars = {
primary: { background: "linear-gradient(135deg,#2DD4BF,#0D9488)", color: "#fff", boxShadow: "0 2px 8px #2DD4BF44" },
success: { background: "#15803d22", color: "#22c55e", border: "1px solid #22c55e44" },
danger: { background: "#ef444422", color: "#ef4444", border: "1px solid #ef444433" },
ghost: { background: "transparent", color: "#9090A8", border: "1px solid #32323F" },
warning: { background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b44" },
};
return (React.createElement("button", Object.assign({}, props, { style: Object.assign(Object.assign(Object.assign(Object.assign({}, base), vars[variant]), { padding: sm ? "6px 12px" : "9px 18px", fontSize: sm ? 12 : 13 }), props.style) }), children));
}
function Inp(_a) {
var { label } = _a, p = __rest(_a, ["label"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, label),
React.createElement("input", Object.assign({}, p, { style: Object.assign({ background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", outline: "none", width: "100%", boxSizing: "border-box" }, (p.style || {})) }))));
}
function Sel(_a) {
var { label, children } = _a, p = __rest(_a, ["label", "children"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, label),
React.createElement("select", Object.assign({}, p, { style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", outline: "none", width: "100%", boxSizing: "border-box" } }), children)));
}
function Txt(_a) {
var { label } = _a, p = __rest(_a, ["label"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, label),
React.createElement("textarea", Object.assign({}, p, { style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 64 } }))));
}
function Modal({ title, onClose, wide, children }) {
return (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000c", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }, onClick: e => e.target === e.currentTarget && onClose() },
React.createElement("div", { style: { background: "#18181F", border: "1px solid #2a3040", borderRadius: 16, width: wide ? "min(820px,97vw)" : "min(640px,97vw)", maxHeight: "93vh", overflowY: "auto", padding: "22px 22px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 16 } }, title),
React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "#64748b", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 0 } }, "\u00D7")),
children)));
}
function Grid({ cols, gap = 14, children }) {
const isMobile = useMedia("(max-width:600px)");
return React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : cols, gap } }, children);
}
function Span2({ children }) {
const isMobile = useMedia("(max-width:600px)");
return React.createElement("div", { style: { gridColumn: isMobile ? "span 1" : "span 2" } }, children);
}
function EmptyState({ icon, title, message, action }) {
return (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 42, marginBottom: 12, opacity: .55 } }, icon),
React.createElement("div", { style: { fontSize: 15, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, title),
React.createElement("div", { style: { fontSize: 12, color: "#475569", marginBottom: 18 } }, message),
action));
}
/* ═══ SIMPLE BAR CHART ═══════════════════════════════════════ */
function BarChart({ data, height = 160, color = "#2DD4BF" }) {
if (!data.length)
return null;
const max = Math.max(...data.map(d => d.value), 1);
return (React.createElement("div", { style: { display: "flex", alignItems: "flex-end", gap: 6, height, padding: "10px 0" } }, data.map((d, i) => (React.createElement("div", { key: i, style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 10, color: "#94a3b8", fontWeight: 700 } }, d.value > 0 ? "€" + (d.value.toFixed(0)) : ""),
React.createElement("div", { style: { width: "100%", maxWidth: 40, background: color, opacity: .7, height: ((d.value / max) * 100) + "%", minHeight: 2, borderRadius: "4px 4px 0 0", transition: "height .3s" } }),
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" } }, d.label))))));
}
/* ═══ CARDS ═══════════════════════════════════════════════════ */
function AssetCard({ a, customer, onEdit, onDelete, onHistory }) {
return (React.createElement("div", { style: { background: "#1E1E28", borderRadius: 12, padding: "14px 16px", border: "1px solid #2a3040", marginBottom: 8 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, a.name),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } },
a.id,
" \u00B7 ",
a.brand,
" ",
a.model)),
React.createElement(Badge, { text: a.status, color: STATUS_COLOR[a.status] || "#64748b" })),
React.createElement("div", { style: { display: "flex", gap: 14, fontSize: 12, color: "#94a3b8", flexWrap: "wrap", marginBottom: 12 } },
(customer === null || customer === void 0 ? void 0 : customer.name) && React.createElement("span", null,
" ",
customer.name),
a.location && React.createElement("span", null,
"\u00B7 ",
a.location),
a.nextService && React.createElement("span", null,
" ",
a.nextService)),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onHistory(a) }, " Storico"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onEdit(a) }, "\u270F Modifica"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => onDelete(a.id) }, "\u2715"))));
}
function JobCard({ j, assets, parts, customers, onEdit, onDelete, onPDF, onTimeline }) {
var _a, _b;
const asset = assets.find(a => a.id === j.assetId) || {};
const customer = customers.find(c => c.id === (j.customerId || asset.customerId));
const total = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0) + j.laborHours * j.laborRate;
const tlCount = ((_a = j.timeline) === null || _a === void 0 ? void 0 : _a.length) || 0;
const photoCount = ((_b = j.photos) === null || _b === void 0 ? void 0 : _b.length) || 0;
return (React.createElement("div", { style: { background: "#1E1E28", borderRadius: 12, padding: "14px 16px", border: "1px solid " + (PRI_COLOR[j.priority]) + "33", marginBottom: 8 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 } },
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
React.createElement("span", { style: { fontSize: 11, color: "#64748b" } }, j.id),
React.createElement(Badge, { text: j.status, color: STATUS_COLOR[j.status] || "#64748b" }),
React.createElement(Badge, { text: j.priority, color: PRI_COLOR[j.priority] || "#64748b" })),
React.createElement("div", { style: { fontWeight: 700, fontSize: 14, marginTop: 4 } }, asset.name || j.assetId),
(customer === null || customer === void 0 ? void 0 : customer.name) && React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } },
" ",
customer.name)),
total > 0 && React.createElement("span", { style: { color: "#a855f7", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" } },
"\u20AC",
total.toFixed(0))),
React.createElement("div", { style: { fontSize: 12, color: "#94a3b8", marginBottom: 12, lineHeight: 1.4 } },
j.description.slice(0, 90),
j.description.length > 90 ? "…" : ""),
(tlCount > 0 || photoCount > 0) && (React.createElement("div", { style: { display: "flex", gap: 10, fontSize: 11, color: "#64748b", marginBottom: 10 } },
tlCount > 0 && React.createElement("span", null,
"\u00B7 ",
tlCount,
" step"),
photoCount > 0 && React.createElement("span", null,
" ",
photoCount,
" foto"))),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onTimeline(j) }, "\u00B7 Timeline"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onPDF(j) }, " PDF"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onEdit(j) }, "\u270F Modifica"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => onDelete(j.id) }, "\u2715"))));
}
function PartCard({ p, onEdit, onDelete }) {
const low = p.qty <= p.minQty;
const sellPrice = p.sellPrice || p.unitPrice;
const margin = sellPrice - p.unitPrice;
return (React.createElement("div", { style: { background: "#1E1E28", borderRadius: 12, padding: "14px 16px", border: "1px solid " + (low ? "#f59e0b33" : "#32323F"), marginBottom: 8 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, gap: 10 } },
React.createElement("div", { style: { minWidth: 0 } },
React.createElement("div", { style: { fontWeight: 700, fontSize: 14 } }, p.name),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } },
p.code,
" \u00B7 ",
p.brand)),
React.createElement("span", { style: { fontWeight: 800, fontSize: 20, color: p.qty === 0 ? "#ef4444" : low ? "#f59e0b" : "#22c55e" } }, p.qty)),
React.createElement("div", { style: { display: "flex", gap: 14, fontSize: 12, color: "#94a3b8", marginBottom: 10, flexWrap: "wrap" } },
React.createElement("span", null,
"Costo: \u20AC",
p.unitPrice.toFixed(2)),
React.createElement("span", { style: { color: "#a855f7" } },
"Vendita: \u20AC",
sellPrice.toFixed(2)),
margin > 0 && React.createElement("span", { style: { color: "#22c55e" } },
"+\u20AC",
margin.toFixed(2)),
p.location && React.createElement("span", null, p.location)),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onEdit(p) }, "\u270F"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => onDelete(p.id) }, "\u2715"))));
}
function CustomerCard({ c, assets, onEdit, onDelete }) {
const count = assets.filter(a => a.customerId === c.id).length;
return (React.createElement("div", { style: { background: "#1E1E28", borderRadius: 12, padding: "14px 16px", border: "1px solid #2a3040", marginBottom: 8 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 10 } },
React.createElement("div", null,
React.createElement("div", { style: { fontWeight: 700, fontSize: 15 } }, c.name),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } },
c.id,
" ",
c.vat && "· P.IVA " + (c.vat))),
React.createElement(Badge, { text: (count) + " apparec.", color: "#2DD4BF" })),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#94a3b8", marginBottom: 10 } },
c.address && React.createElement("span", null,
"\u00B7 ",
c.address),
c.contact && React.createElement("span", null, c.contact),
c.email && React.createElement("span", null, c.email),
c.phone && React.createElement("span", null,
" ",
c.phone)),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => onEdit(c) }, "\u270F Modifica"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => onDelete(c.id) }, "\u2715"))));
}
/* ═══ FORMS ═══════════════════════════════════════════════════ */
function CustomerForm({ initial, onSave, onClose }) {
const blank = { name: "", vat: "", fiscalCode: "", address: "", contact: "", email: "", phone: "", notes: "" };
const [f, setF] = React.useState(initial || blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Span2, null,
React.createElement(Inp, { label: "Ragione sociale", value: f.name, onChange: s("name") })),
React.createElement(Inp, { label: "Partita IVA", value: f.vat, onChange: s("vat") }),
React.createElement(Inp, { label: "Codice fiscale", value: f.fiscalCode, onChange: s("fiscalCode") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Indirizzo", value: f.address, onChange: s("address") })),
React.createElement(Inp, { label: "Referente", value: f.contact, onChange: s("contact") }),
React.createElement(Inp, { label: "Email", value: f.email, onChange: s("email") }),
React.createElement(Inp, { label: "Telefono", value: f.phone, onChange: s("phone") }),
React.createElement("div", null),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(f) }, "Salva"))));
}
function AssetForm({ initial, customers, onSave, onClose }) {
const blank = { name: "", brand: "", model: "", serial: "", location: "", customerId: "", status: "operativo", lastService: "", nextService: "", serviceInterval: 6, notes: "" };
const [f, setF] = React.useState(initial || blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Nome apparecchio", value: f.name, onChange: s("name") }),
React.createElement(Inp, { label: "Marca", value: f.brand, onChange: s("brand") }),
React.createElement(Inp, { label: "Modello", value: f.model, onChange: s("model") }),
React.createElement(Inp, { label: "Numero di serie", value: f.serial, onChange: s("serial") }),
React.createElement(Sel, { label: "Cliente / Struttura", value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Nessuno \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement(Inp, { label: "Ubicazione", value: f.location, onChange: s("location") }),
React.createElement(Sel, { label: "Stato", value: f.status, onChange: s("status") }, ["operativo", "in manutenzione", "fuori servizio"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Inp, { label: "Intervallo manutenz. (mesi)", type: "number", value: f.serviceInterval, onChange: s("serviceInterval") }),
React.createElement(Inp, { label: "Ultimo servizio", type: "date", value: f.lastService, onChange: s("lastService") }),
React.createElement(Inp, { label: "Prossimo servizio", type: "date", value: f.nextService, onChange: s("nextService") }),
React.createElement(Sel, { label: "Norma sicurezza", value: f.iecNorm || "62353", onChange: e => setF(x => (Object.assign(Object.assign({}, x), { iecNorm: e.target.value }))) },
React.createElement("option", { value: "62353" }, "IEC 62353 \u2014 Elettromedicale"),
React.createElement("option", { value: "61010" }, "IEC 61010-1 \u2014 Laboratorio"),
React.createElement("option", { value: "" }, "Non applicabile")),
React.createElement(Sel, { label: "Classe di rischio", value: f.riskClass || "", onChange: s("riskClass") },
React.createElement("option", { value: "" }, "\u2014"),
React.createElement("option", { value: "A" }, "Classe A \u2014 Basso rischio"),
React.createElement("option", { value: "B" }, "Classe B \u2014 Medio rischio"),
React.createElement("option", { value: "C" }, "Classe C \u2014 Alto rischio")),
React.createElement(Inp, { label: "Data acquisto", type: "date", value: f.purchaseDate || "", onChange: s("purchaseDate") }),
React.createElement(Inp, { label: "Scadenza garanzia", type: "date", value: f.warrantyExpiry || "", onChange: s("warrantyExpiry") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Contratto assistenza / Fornitore servizio", value: f.serviceContract || "", onChange: s("serviceContract") })),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { serviceInterval: +f.serviceInterval })) }, "Salva"))));
}
function PartForm({ initial, assets, onSave, onClose }) {
const blank = { code: "", name: "", brand: "", compatible: [], qty: 0, minQty: 0, unitPrice: 0, sellPrice: 0, markupPct: 30, location: "", notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign({}, initial), { sellPrice: initial.sellPrice || initial.unitPrice, markupPct: initial.markupPct || 0 }) : blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const toggle = id => setF(x => (Object.assign(Object.assign({}, x), { compatible: x.compatible.includes(id) ? x.compatible.filter(c => c !== id) : [...x.compatible, id] })));
const applyMarkup = () => {
const cost = +f.unitPrice;
const pct = +f.markupPct;
setF(x => (Object.assign(Object.assign({}, x), { sellPrice: +(cost * (1 + pct / 100)).toFixed(2) })));
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Codice parte", value: f.code, onChange: s("code") }),
React.createElement(Inp, { label: "Nome", value: f.name, onChange: s("name") }),
React.createElement(Inp, { label: "Marca", value: f.brand, onChange: s("brand") }),
React.createElement(Inp, { label: "Ubicazione magazzino", value: f.location, onChange: s("location") }),
React.createElement(Inp, { label: "Quantit\u00E0", type: "number", value: f.qty, onChange: s("qty") }),
React.createElement(Inp, { label: "Quantit\u00E0 minima", type: "number", value: f.minQty, onChange: s("minQty") }),
React.createElement(Inp, { label: "Prezzo di acquisto (\u20AC)", type: "number", step: "0.01", value: f.unitPrice, onChange: s("unitPrice") }),
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "end" } },
React.createElement("div", { style: { flex: 1 } },
React.createElement(Inp, { label: "Markup %", type: "number", value: f.markupPct, onChange: s("markupPct") })),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: applyMarkup, style: { padding: "10px 12px" } }, "Applica")),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Prezzo di vendita (\u20AC)", type: "number", step: "0.01", value: f.sellPrice, onChange: s("sellPrice") })),
assets.length > 0 && (React.createElement(Span2, null,
React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, display: "block", marginBottom: 8 } }, "Apparecchi compatibili"),
React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, assets.map(a => (React.createElement("button", { key: a.id, onClick: () => toggle(a.id), style: { background: f.compatible.includes(a.id) ? "#2DD4BF22" : "#1E1E28", border: "1px solid " + (f.compatible.includes(a.id) ? "#2DD4BF" : "#32323F"), color: f.compatible.includes(a.id) ? "#5EEAD4" : "#64748b", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12 } },
a.id,
" \u2014 ",
a.name)))))),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { qty: +f.qty, minQty: +f.minQty, unitPrice: +f.unitPrice, sellPrice: +f.sellPrice, markupPct: +f.markupPct })) }, "Salva"))));
}
function JobForm({ initial, assets, parts, customers, onSave, onClose }) {
var _a;
const blank = { assetId: ((_a = assets[0]) === null || _a === void 0 ? void 0 : _a.id) || "", customerId: "", type: "correttiva", priority: "normale", status: "aperto", assignee: "", openDate: new Date().toISOString().slice(0, 10), closeDate: "", description: "", parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign({}, initial), { timeline: initial.timeline || [], photos: initial.photos || [] }) : blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const addPart = () => setF(x => { var _a; return (Object.assign(Object.assign({}, x), { parts: [...x.parts, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }] })); });
const remPart = i => setF(x => (Object.assign(Object.assign({}, x), { parts: x.parts.filter((_, idx) => idx !== i) })));
const setPart = (i, k, v) => setF(x => { const a = [...x.parts]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "qty" ? +v : v }); return Object.assign(Object.assign({}, x), { parts: a }); });
const partsTot = f.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
const laborTot = +f.laborHours * +f.laborRate;
if (assets.length === 0) {
return (React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "#94a3b8" } },
"Devi prima registrare almeno un apparecchio.",
React.createElement("div", { style: { marginTop: 14 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"))));
}
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Sel, { label: "Apparecchio", value: f.assetId, onChange: s("assetId") }, assets.map(a => React.createElement("option", { key: a.id, value: a.id },
a.id,
" \u2014 ",
a.name))),
React.createElement(Sel, { label: "Cliente (opzionale)", value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Auto da apparecchio \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement(Sel, { label: "Tipo", value: f.type, onChange: s("type") }, ["correttiva", "preventiva", "verifica", "calibrazione"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Sel, { label: "Priorit\u00E0", value: f.priority, onChange: s("priority") }, ["urgente", "alta", "normale", "bassa"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Sel, { label: "Stato", value: f.status, onChange: s("status") }, ["aperto", "in corso", "chiuso"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Inp, { label: "Tecnico", value: f.assignee, onChange: s("assignee") }),
React.createElement(Inp, { label: "Data apertura", type: "date", value: f.openDate, onChange: s("openDate") }),
React.createElement(Inp, { label: "Data chiusura", type: "date", value: f.closeDate, onChange: s("closeDate") }),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Descrizione", value: f.description, onChange: s("description") }))),
parts.length > 0 && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Parti"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addPart }, "+ Aggiungi")),
f.parts.map((p, i) => (React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr 80px auto", gap: 8, marginBottom: 8 } },
React.createElement("select", { value: p.partId, onChange: e => setPart(i, "partId", e.target.value), style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 10px", color: "#e2e8f0" } }, parts.map(pt => React.createElement("option", { key: pt.id, value: pt.id },
pt.code,
" \u2014 ",
pt.name,
" (\u20AC",
pt.sellPrice || pt.unitPrice,
")"))),
React.createElement("input", { type: "number", min: 1, value: p.qty, onChange: e => setPart(i, "qty", e.target.value), style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 10px", color: "#e2e8f0" } }),
React.createElement(Btn, { variant: "danger", sm: true, onClick: () => remPart(i) }, "\u2715")))))),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Ore manodopera", type: "number", step: "0.5", value: f.laborHours, onChange: s("laborHours") }),
React.createElement(Inp, { label: "Tariffa oraria (\u20AC)", type: "number", value: f.laborRate, onChange: s("laborRate") })),
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 10, padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 20 } },
React.createElement("span", { style: { color: "#64748b", fontSize: 12 } },
"Parti: ",
React.createElement("strong", { style: { color: "#e2e8f0" } },
"\u20AC",
partsTot.toFixed(2))),
React.createElement("span", { style: { color: "#64748b", fontSize: 12 } },
"Manodopera: ",
React.createElement("strong", { style: { color: "#e2e8f0" } },
"\u20AC",
laborTot.toFixed(2))),
React.createElement("span", { style: { color: "#64748b", fontSize: 12 } },
"Totale: ",
React.createElement("strong", { style: { color: "#22c55e", fontSize: 15 } },
"\u20AC",
(partsTot + laborTot).toFixed(2)))),
React.createElement("div", { style: { margin: '10px 0', paddingTop: 10, borderTop: '1px solid #2A2A38' } },
React.createElement("div", { style: { fontSize: 11, color: '#2DD4BF', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 } }, "Allegati (DDT, foto, rapporti esterni)"),
React.createElement(AttachmentsList, { attachments: f.attachments || [], onAdd: (att) => setF(x => (Object.assign(Object.assign({}, x), { attachments: [...(x.attachments || []), att] }))), onDelete: (id) => setF(x => (Object.assign(Object.assign({}, x), { attachments: (x.attachments || []).filter(a => a.id !== id) }))) })),
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { laborHours: +f.laborHours, laborRate: +f.laborRate })) }, "Salva"))));
}
function OrderForm({ initial, parts, onSave, onClose }) {
var _a;
const blank = { supplier: "", partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1, unitPrice: 0, status: "in attesa", orderDate: new Date().toISOString().slice(0, 10), expectedDate: "", notes: "" };
const [f, setF] = React.useState(initial || blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
React.useEffect(() => { if (!initial) {
const pt = parts.find(x => x.id === f.partId);
if (pt)
setF(x => (Object.assign(Object.assign({}, x), { unitPrice: pt.unitPrice })));
} }, [f.partId]);
if (parts.length === 0) {
return (React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "#94a3b8" } },
"Devi prima registrare almeno una parte.",
React.createElement("div", { style: { marginTop: 14 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi"))));
}
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Fornitore", value: f.supplier, onChange: s("supplier") }),
React.createElement(Sel, { label: "Parte", value: f.partId, onChange: s("partId") }, parts.map(p => React.createElement("option", { key: p.id, value: p.id },
p.code,
" \u2014 ",
p.name))),
React.createElement(Inp, { label: "Quantit\u00E0", type: "number", value: f.qty, onChange: s("qty") }),
React.createElement(Inp, { label: "Prezzo unitario (\u20AC)", type: "number", step: "0.01", value: f.unitPrice, onChange: s("unitPrice") }),
React.createElement(Sel, { label: "Stato ordine", value: f.status, onChange: s("status") }, ["in attesa", "confermato", "spedito", "ricevuto", "annullato"].map(v => React.createElement("option", { key: v }, v))),
React.createElement("div", null),
React.createElement(Inp, { label: "Data ordine", type: "date", value: f.orderDate, onChange: s("orderDate") }),
React.createElement(Inp, { label: "Data prevista consegna", type: "date", value: f.expectedDate, onChange: s("expectedDate") }),
React.createElement(Span2, null,
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }))),
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 10, padding: "12px 16px" } },
React.createElement("span", { style: { color: "#64748b", fontSize: 12 } },
"Valore ordine: ",
React.createElement("strong", { style: { color: "#a855f7", fontSize: 15 } },
"\u20AC",
(+f.qty * (+f.unitPrice)).toFixed(2)))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(Object.assign(Object.assign({}, f), { qty: +f.qty, unitPrice: +f.unitPrice })) }, "Salva"))));
}
/* ═══ PREVENTIVI (Quote) — sostituisce Fatture ═══════════════════════════════
* Job → Preventivo: bottone nel job crea una quotazione pre-compilata
* Righe miste: parti da magazzino + righe libere
* Più voci manodopera con etichetta + ore × tariffa
* Stati: bozza → inviato → accettato → rifiutato → scaduto
* ═══════════════════════════════════════════════════════════════════════════ */
const QUOTE_STATUS_COLOR = {
'bozza': '#64748b',
'inviato': '#3b82f6',
'accettato': '#22c55e',
'rifiutato': '#ef4444',
'scaduto': '#f59e0b',
};
const IVA_RATES = [0, 4, 5, 10, 22];
const IVA_DEFAULT_Q = 22;
function newQuoteNumber(quotes) {
const y = new Date().getFullYear().toString().slice(-2);
const max = (quotes || []).reduce((m, q) => {
const n = parseInt((q.number || '').replace(/\D/g, '')) || 0;
return Math.max(m, n);
}, 0);
return `QT${y}-${String(max + 1).padStart(3, '0')}`;
}
/* ─── QuoteForm ─────────────────────────────────────────────────────────── */
function QuoteForm({ initial, customers, jobs, assets, parts, quotes, onSave, onClose }) {
const blank = {
number: newQuoteNumber(quotes),
customerId: '',
jobId: '',
date: new Date().toISOString().slice(0, 10),
validUntil: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10); })(),
status: 'bozza',
laborLines: [], // [{id, label, hours, rate}]
partLines: [], // [{id, type:'warehouse'|'free', partId?, description, qty, unitPrice, vat}]
notes: '',
paymentTerms: 'Bonifico bancario a 30 giorni',
vatExempt: false,
};
const [f, setF] = React.useState(() => {
if (initial)
return initial;
return blank;
});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const sCheck = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.checked })));
// ── Labor lines ──────────────────────────────────────────────────────────
const addLabor = () => setF(x => (Object.assign(Object.assign({}, x), { laborLines: [...x.laborLines, {
id: Date.now() + Math.random(),
label: 'Manodopera',
hours: 1,
rate: 55,
}] })));
const updLabor = (id, k, v) => setF(x => (Object.assign(Object.assign({}, x), { laborLines: x.laborLines.map(l => l.id === id ? Object.assign(Object.assign({}, l), { [k]: k === 'hours' || k === 'rate' ? +v : v }) : l) })));
const delLabor = id => setF(x => (Object.assign(Object.assign({}, x), { laborLines: x.laborLines.filter(l => l.id !== id) })));
// ── Part lines ───────────────────────────────────────────────────────────
const addPartFree = () => setF(x => (Object.assign(Object.assign({}, x), { partLines: [...x.partLines, {
id: Date.now() + Math.random(),
type: 'free',
description: '', qty: 1, unitPrice: 0,
vat: f.vatExempt ? 0 : IVA_DEFAULT_Q,
}] })));
const addPartWarehouse = (part) => {
setF(x => (Object.assign(Object.assign({}, x), { partLines: [...x.partLines, {
id: Date.now() + Math.random(),
type: 'warehouse',
partId: part.id,
description: part.name + (part.code ? ` (${part.code})` : ''),
qty: 1,
unitPrice: part.sellPrice || part.unitPrice || 0,
vat: f.vatExempt ? 0 : IVA_DEFAULT_Q,
}] })));
};
const updPart = (id, k, v) => setF(x => (Object.assign(Object.assign({}, x), { partLines: x.partLines.map(l => l.id === id ? Object.assign(Object.assign({}, l), { [k]: k === 'qty' || k === 'unitPrice' || k === 'vat' ? +v : v }) : l) })));
const delPart = id => setF(x => (Object.assign(Object.assign({}, x), { partLines: x.partLines.filter(l => l.id !== id) })));
// ── Import from job ───────────────────────────────────────────────────────
const importFromJob = (jobId) => {
const job = jobs.find(j => j.id === jobId);
if (!job)
return;
const asset = assets.find(a => a.id === job.assetId);
const newParts = [];
(job.parts || []).forEach(p => {
const pt = parts.find(x => x.id === p.partId);
if (pt)
newParts.push({
id: Date.now() + Math.random(),
type: 'warehouse',
partId: pt.id,
description: pt.name + (pt.code ? ` (${pt.code})` : ''),
qty: p.qty,
unitPrice: pt.sellPrice || pt.unitPrice || 0,
vat: f.vatExempt ? 0 : IVA_DEFAULT_Q,
});
});
const newLabor = [];
if (job.laborHours > 0) {
newLabor.push({
id: Date.now() + Math.random(),
label: `Manodopera — ${(asset === null || asset === void 0 ? void 0 : asset.name) || 'intervento'} (rif. ${job.id})`,
hours: job.laborHours,
rate: job.laborRate || 55,
});
}
setF(x => (Object.assign(Object.assign({}, x), { jobId: jobId, customerId: x.customerId || job.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId) || '', laborLines: [...x.laborLines, ...newLabor], partLines: [...x.partLines, ...newParts] })));
};
// ── Totals ────────────────────────────────────────────────────────────────
const laborTotal = f.laborLines.reduce((s, l) => s + (l.hours * l.rate), 0);
const partsSubtotal = f.partLines.reduce((s, l) => s + (l.qty * l.unitPrice), 0);
const subtotal = laborTotal + partsSubtotal;
const vatTotal = f.vatExempt ? 0 : f.partLines.reduce((s, l) => s + (l.qty * l.unitPrice * l.vat / 100), 0)
+ (f.vatExempt ? 0 : f.laborLines.reduce((s, l) => s + (l.hours * l.rate * IVA_DEFAULT_Q / 100), 0));
const grandTotal = subtotal + vatTotal;
const customer = customers.find(c => c.id === f.customerId);
const customerJobs = jobs.filter(j => {
const a = assets.find(a => a.id === j.assetId);
return (j.customerId || (a === null || a === void 0 ? void 0 : a.customerId)) === f.customerId;
});
const INP = { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 7, padding: '8px 10px', color: '#F0F0F5', fontSize: 12, outline: 'none', width: '100%', fontFamily: 'inherit' };
const LBL = { fontSize: 10, color: '#5A5A70', textTransform: 'uppercase', letterSpacing: .8, fontWeight: 700, display: 'block', marginBottom: 3 };
return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '72vh', overflowY: 'auto', paddingRight: 4 } },
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 } },
React.createElement("div", null,
React.createElement("label", { style: LBL }, "N\u00B0 Preventivo"),
React.createElement("input", { style: INP, value: f.number, onChange: s('number') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Stato"),
React.createElement("select", { style: INP, value: f.status, onChange: s('status') }, Object.keys(QUOTE_STATUS_COLOR).map(v => React.createElement("option", { key: v, value: v }, v.charAt(0).toUpperCase() + v.slice(1))))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Cliente"),
React.createElement("select", { style: INP, value: f.customerId, onChange: s('customerId') },
React.createElement("option", { value: "" }, "\u2014 Seleziona cliente \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name)))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Job collegato"),
React.createElement("select", { style: INP, value: f.jobId, onChange: e => { s('jobId')(e); if (e.target.value)
importFromJob(e.target.value); } },
React.createElement("option", { value: "" }, "\u2014 Nessuno / importa manuale \u2014"),
customerJobs.map(j => {
const a = assets.find(a => a.id === j.assetId);
return React.createElement("option", { key: j.id, value: j.id },
j.id,
" \u2014 ",
(a === null || a === void 0 ? void 0 : a.name) || '?',
" (",
j.status,
")");
}))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Data preventivo"),
React.createElement("input", { type: "date", style: INP, value: f.date, onChange: s('date') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Valido fino al"),
React.createElement("input", { type: "date", style: INP, value: f.validUntil, onChange: s('validUntil') }))),
React.createElement("label", { style: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12, color: '#9090A8' } },
React.createElement("input", { type: "checkbox", checked: f.vatExempt, onChange: sCheck('vatExempt') }),
"Esente IVA (art. 10, regime forfettario, ecc.)"),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', paddingTop: 12 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 11, color: '#2DD4BF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8 } },
"\uD83D\uDD27 Manodopera (",
f.laborLines.length,
" voci)"),
React.createElement("button", { onClick: addLabor, style: { background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 6, color: '#2DD4BF', padding: '4px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "+ Voce")),
f.laborLines.length === 0 && (React.createElement("div", { style: { textAlign: 'center', color: '#3A3A50', padding: '10px 0', fontSize: 12 } }, "Nessuna voce manodopera")),
f.laborLines.map(l => (React.createElement("div", { key: l.id, style: { display: 'grid', gridTemplateColumns: '1fr 70px 70px auto', gap: 6, marginBottom: 6, alignItems: 'center' } },
React.createElement("input", { style: INP, value: l.label, onChange: e => updLabor(l.id, 'label', e.target.value), placeholder: "Descrizione (es. Trasferta, Ore lavoro, Installazione\u2026)" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.hours, onChange: e => updLabor(l.id, 'hours', e.target.value), placeholder: "ore", step: "0.5" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.rate, onChange: e => updLabor(l.id, 'rate', e.target.value), placeholder: "\u20AC/h" }),
React.createElement("button", { onClick: () => delLabor(l.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 5, color: '#ef4444', padding: '6px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715")))),
f.laborLines.length > 0 && (React.createElement("div", { style: { textAlign: 'right', fontSize: 12, color: '#9090A8', marginTop: 4 } },
"Subtotale manodopera: ",
React.createElement("strong", { style: { color: '#F0F0F5' } },
"\u20AC",
laborTotal.toFixed(2))))),
React.createElement("div", { style: { borderTop: '1px solid #2A2A38', paddingTop: 12 } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 6 } },
React.createElement("span", { style: { fontSize: 11, color: '#a855f7', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .8 } },
"\uD83D\uDCE6 Parti / Materiali (",
f.partLines.length,
" righe)"),
React.createElement("div", { style: { display: 'flex', gap: 6 } },
React.createElement("button", { onClick: addPartFree, style: { background: '#1E1E28', border: '1px solid #a855f744', borderRadius: 6, color: '#a855f7', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "+ Riga libera"))),
parts.length > 0 && (React.createElement("div", { style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 10px', marginBottom: 8 } },
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .7 } }, "Aggiungi dal magazzino (senza scalare stock)"),
React.createElement("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 5 } }, parts.filter(p => p.qty > 0 || true).map(p => (React.createElement("button", { key: p.id, onClick: () => addPartWarehouse(p), style: { background: '#1E1E28', border: '1px solid #2A2A38', borderRadius: 6, color: '#9090A8', padding: '3px 9px', cursor: 'pointer', fontSize: 10 } },
"+ ",
p.name,
p.code ? ` (${p.code})` : '',
" \u2014 \u20AC",
(p.sellPrice || p.unitPrice || 0).toFixed(2))))))),
f.partLines.length === 0 && (React.createElement("div", { style: { textAlign: 'center', color: '#3A3A50', padding: '10px 0', fontSize: 12 } }, "Nessun materiale")),
f.partLines.map(l => (React.createElement("div", { key: l.id, style: { display: 'grid', gridTemplateColumns: '1fr 55px 70px 55px auto', gap: 6, marginBottom: 6, alignItems: 'center' } },
React.createElement("div", null,
l.type === 'warehouse' && (React.createElement("div", { style: { fontSize: 9, color: '#a855f7', fontWeight: 700, marginBottom: 2 } }, "\uD83D\uDCE6 MAGAZZINO")),
React.createElement("input", { style: INP, value: l.description, onChange: e => updPart(l.id, 'description', e.target.value), placeholder: "Descrizione ricambio / materiale" })),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.qty, onChange: e => updPart(l.id, 'qty', e.target.value), placeholder: "Q.t\u00E0", step: "1" }),
React.createElement("input", { type: "number", style: Object.assign(Object.assign({}, INP), { textAlign: 'center' }), value: l.unitPrice, onChange: e => updPart(l.id, 'unitPrice', e.target.value), placeholder: "\u20AC cad.", step: "0.01" }),
React.createElement("select", { style: Object.assign(Object.assign({}, INP), { padding: '8px 4px', textAlign: 'center' }), value: l.vat, onChange: e => updPart(l.id, 'vat', e.target.value) }, IVA_RATES.map(r => React.createElement("option", { key: r, value: r },
r,
"%"))),
React.createElement("button", { onClick: () => delPart(l.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 5, color: '#ef4444', padding: '6px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715")))),
f.partLines.length > 0 && (React.createElement("div", { style: { textAlign: 'right', fontSize: 12, color: '#9090A8', marginTop: 4 } },
"Subtotale materiali: ",
React.createElement("strong", { style: { color: '#F0F0F5' } },
"\u20AC",
partsSubtotal.toFixed(2))))),
React.createElement("div", { style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 } },
React.createElement("span", { style: { color: '#5A5A70' } }, "Manodopera"),
React.createElement("span", { style: { color: '#F0F0F5', fontWeight: 700 } },
"\u20AC",
laborTotal.toFixed(2))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 } },
React.createElement("span", { style: { color: '#5A5A70' } }, "Materiali"),
React.createElement("span", { style: { color: '#F0F0F5', fontWeight: 700 } },
"\u20AC",
partsSubtotal.toFixed(2))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid #2A2A38' } },
React.createElement("span", { style: { color: '#5A5A70' } }, "Imponibile"),
React.createElement("span", { style: { color: '#F0F0F5', fontWeight: 700 } },
"\u20AC",
subtotal.toFixed(2))),
!f.vatExempt && (React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 } },
React.createElement("span", { style: { color: '#5A5A70' } }, "IVA"),
React.createElement("span", { style: { color: '#F0F0F5', fontWeight: 700 } },
"\u20AC",
vatTotal.toFixed(2)))),
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 16 } },
React.createElement("span", { style: { color: '#94a3b8', fontWeight: 700 } }, "TOTALE"),
React.createElement("span", { style: { color: '#22c55e', fontWeight: 900 } },
"\u20AC",
grandTotal.toFixed(2)))),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Condizioni di pagamento"),
React.createElement("input", { style: INP, value: f.paymentTerms, onChange: s('paymentTerms') })),
React.createElement("div", null,
React.createElement("label", { style: LBL }, "Note / condizioni speciali"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical' }), value: f.notes, onChange: s('notes'), placeholder: "Note aggiuntive, esclusioni, condizioni speciali\u2026" })),
React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 10, borderTop: '1px solid #2A2A38', position: 'sticky', bottom: 0, background: '#1a1a22', margin: '0 -4px', padding: '12px 4px' } },
React.createElement("button", { onClick: onClose, style: { background: '#202028', border: '1px solid #2a3040', borderRadius: 7, color: '#94a3b8', padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13 } }, "Annulla"),
React.createElement("button", { onClick: () => onSave(Object.assign(Object.assign({}, f), { _totals: { labor: laborTotal, parts: partsSubtotal, subtotal, vat: vatTotal, grand: grandTotal } })), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 7, padding: '9px 18px', cursor: 'pointer', fontWeight: 800, fontSize: 13 } }, initial ? 'Salva modifiche' : 'Crea preventivo'))));
}
/* ─── QuotesPage ─────────────────────────────────────────────────────────── */
function QuotesPage({ quotes, setQuotes, customers, jobs, assets, parts, company, showToast }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterStatus, setFilterStatus] = React.useState('all');
const saveQuote = (q) => {
const exists = quotes.some(x => x.id === q.id);
if (exists) {
setQuotes(qs => qs.map(x => x.id === q.id ? q : x));
showToast('Preventivo aggiornato');
}
else {
const newQ = Object.assign(Object.assign({}, q), { id: 'QT' + Date.now(), createdAt: new Date().toISOString() });
setQuotes(qs => [...qs, newQ]);
showToast('✓ Preventivo ' + newQ.number + ' creato');
}
setModal(null);
};
const delQuote = (id) => {
if (!confirm('Eliminare questo preventivo?'))
return;
setQuotes(qs => qs.filter(q => q.id !== id));
showToast('Preventivo eliminato', '#ef4444');
};
const filtered = quotes.filter(q => {
if (filterStatus !== 'all' && q.status !== filterStatus)
return false;
if (search) {
const c = customers.find(x => x.id === q.customerId);
const hay = [q.number, q.status, c === null || c === void 0 ? void 0 : c.name, q.notes].filter(Boolean).join(' ').toLowerCase();
if (!hay.includes(search.toLowerCase()))
return false;
}
return true;
});
// Stats
const totalOpen = quotes.filter(q => ['bozza', 'inviato'].includes(q.status)).length;
const totalAccepted = quotes.filter(q => q.status === 'accettato').length;
const valueOpen = quotes.filter(q => q.status === 'inviato').reduce((s, q) => { var _a; return s + (((_a = q._totals) === null || _a === void 0 ? void 0 : _a.grand) || 0); }, 0);
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 1100, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, "Preventivi"),
React.createElement("p", { style: { color: '#64748b', margin: '3px 0 0', fontSize: 12 } }, "Quotazioni da job \u2192 PDF professionale")),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, "+ Nuovo preventivo")),
React.createElement("div", { style: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' } }, [
{ label: 'In corso (bozza+inviati)', value: totalOpen, color: '#3b82f6' },
{ label: 'Accettati', value: totalAccepted, color: '#22c55e' },
{ label: 'Valore inviati', value: `€${valueOpen.toFixed(0)}`, color: '#2DD4BF' },
{ label: 'Totale', value: quotes.length, color: '#64748b' },
].map(k => (React.createElement("div", { key: k.label, style: { background: '#141418', border: '1px solid #2A2A38', borderTop: `3px solid ${k.color}`, borderRadius: 10, padding: '10px 16px', flex: 1, minWidth: 110 } },
React.createElement("div", { style: { fontSize: 20, fontWeight: 900, color: k.color, fontFamily: 'monospace' } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: '#5A5A70', marginTop: 3, textTransform: 'uppercase', letterSpacing: .7, fontWeight: 600 } }, k.label))))),
React.createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' } },
React.createElement("input", { value: search, onChange: e => setSearch(e.target.value), placeholder: "Cerca numero, cliente\u2026", style: { flex: 1, minWidth: 180, background: '#141418', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: '#F0F0F5', fontSize: 13, outline: 'none' } }),
React.createElement("select", { value: filterStatus, onChange: e => setFilterStatus(e.target.value), style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 8, padding: '8px 12px', color: '#9090A8', fontSize: 12 } },
React.createElement("option", { value: "all" }, "Tutti gli stati"),
Object.keys(QUOTE_STATUS_COLOR).map(s => React.createElement("option", { key: s, value: s }, s.charAt(0).toUpperCase() + s.slice(1))))),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#5A5A70', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38' } }, quotes.length === 0 ? (React.createElement(React.Fragment, null,
React.createElement("div", { style: { fontSize: 36, marginBottom: 10, opacity: .4 } }, "\uD83D\uDCCB"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: '#94a3b8', marginBottom: 6 } }, "Nessun preventivo ancora"),
React.createElement("div", { style: { fontSize: 12, marginBottom: 14 } }, "Apri un job, usa il bottone \"Crea preventivo\" oppure creane uno da qui"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 800, fontSize: 13, cursor: 'pointer' } }, "+ Nuovo preventivo"))) : 'Nessun risultato')) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).map(q => {
var _a, _b, _c;
const customer = customers.find(c => c.id === q.customerId);
const job = jobs.find(j => j.id === q.jobId);
const asset = job ? assets.find(a => a.id === job.assetId) : null;
const sc = QUOTE_STATUS_COLOR[q.status] || '#64748b';
const grand = ((_a = q._totals) === null || _a === void 0 ? void 0 : _a.grand) || 0;
return (React.createElement("div", { key: q.id, style: { background: '#141418', border: `1px solid ${sc}33`, borderLeft: `4px solid ${sc}`, borderRadius: 10, padding: '12px 16px' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 } },
React.createElement("span", { style: { fontFamily: 'monospace', fontWeight: 900, fontSize: 14, color: '#F0F0F5' } }, q.number),
React.createElement("span", { style: { fontSize: 10, background: sc + '20', color: sc, border: `1px solid ${sc}44`, borderRadius: 20, padding: '1px 9px', fontWeight: 700, textTransform: 'capitalize' } }, q.status),
q.jobId && React.createElement("span", { style: { fontSize: 10, color: '#5A5A70' } },
"rif. ",
q.jobId)),
React.createElement("div", { style: { fontSize: 13, color: '#9090A8' } },
(customer === null || customer === void 0 ? void 0 : customer.name) || '—',
asset ? ` · ${asset.name}` : ''),
React.createElement("div", { style: { fontSize: 11, color: '#5A5A70', marginTop: 3 } },
q.date,
q.validUntil ? ` · valido fino al ${q.validUntil}` : '',
((_b = q.laborLines) === null || _b === void 0 ? void 0 : _b.length) > 0 && ` · ${q.laborLines.length} voci manodopera`,
((_c = q.partLines) === null || _c === void 0 ? void 0 : _c.length) > 0 && ` · ${q.partLines.length} righe materiali`)),
React.createElement("div", { style: { textAlign: 'right', flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900, color: '#22c55e', fontFamily: 'monospace' } },
"\u20AC",
grand.toFixed(2)),
React.createElement("div", { style: { display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: () => generateQuotePDF(q, customer, company, assets, jobs), style: { background: '#141418', border: '1px solid #2DD4BF44', borderRadius: 6, color: '#2DD4BF', padding: '4px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "PDF"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: q }), style: { background: '#202028', border: '1px solid #2a3040', borderRadius: 6, color: '#94a3b8', padding: '4px 10px', cursor: 'pointer', fontSize: 11 } }, "\u270F"),
React.createElement("button", { onClick: () => delQuote(q.id), style: { background: '#ef444415', border: '1px solid #ef444430', borderRadius: 6, color: '#ef4444', padding: '4px 8px', cursor: 'pointer', fontSize: 11 } }, "\u2715"))))));
}))),
(modal === null || modal === void 0 ? void 0 : modal.type) === 'form' && (React.createElement(Modal, { title: modal.data ? 'Modifica Preventivo' : 'Nuovo Preventivo', wide: true, onClose: () => setModal(null) },
React.createElement(QuoteForm, { initial: modal.data, customers: customers, jobs: jobs, assets: assets, parts: parts, quotes: quotes, onSave: saveQuote, onClose: () => setModal(null) })))));
}
/* ─── generateQuotePDF ────────────────────────────────────────────────────── */
function generateQuotePDF(quote, customer, company, assets, jobs) {
var _a, _b, _c, _d, _e;
const job = jobs === null || jobs === void 0 ? void 0 : jobs.find(j => j.id === quote.jobId);
const asset = job ? assets === null || assets === void 0 ? void 0 : assets.find(a => a.id === job.assetId) : null;
const sc = QUOTE_STATUS_COLOR[quote.status] || '#64748b';
const grand = ((_a = quote._totals) === null || _a === void 0 ? void 0 : _a.grand) || 0;
const subtotal = ((_b = quote._totals) === null || _b === void 0 ? void 0 : _b.subtotal) || 0;
const vatAmt = ((_c = quote._totals) === null || _c === void 0 ? void 0 : _c.vat) || 0;
const laborRows = (quote.laborLines || []).map(l => `<tr><td>${l.label}</td><td style="text-align:center">${l.hours}h × €${l.rate}/h</td><td style="text-align:right;font-weight:700">€${(l.hours * l.rate).toFixed(2)}</td></tr>`).join('');
const partRows = (quote.partLines || []).map(l => `<tr><td>${l.type === 'warehouse' ? '📦 ' : ''}${l.description}</td><td style="text-align:center">${l.qty} × €${Number(l.unitPrice).toFixed(2)}${!quote.vatExempt ? ` (+${l.vat}% IVA)` : ''}</td><td style="text-align:right;font-weight:700">€${(l.qty * l.unitPrice).toFixed(2)}</td></tr>`).join('');
const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a2e; background: #fff; }
.header { background: linear-gradient(135deg, #2DD4BF, #0D9488); color: white; padding: 28px 32px; display: flex; justify-content: space-between; align-items: flex-start; }
.header h1 { font-size: 22px; font-weight: 900; margin-bottom: 4px; }
.header .sub { font-size: 10px; opacity: .85; line-height: 1.5; }
.header-logo { height: 28px !important; width: 36px !important; max-height:28px !important; max-width:36px !important; object-fit:contain; display:block; margin-bottom:8px; }
.badge { display:inline-block; background:rgba(255,255,255,0.25); border:1px solid rgba(255,255,255,0.4); border-radius:6px; padding:4px 12px; font-size:13px; font-weight:800; margin-top:6px; }
.body { padding: 24px 32px; }
.meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; }
.meta-box { background:#f8fafc; border-radius:8px; padding:12px 14px; }
.meta-label { font-size:9px; color:#64748b; text-transform:uppercase; letter-spacing:.7px; font-weight:700; margin-bottom:4px; }
.meta-value { font-size:13px; font-weight:700; color:#1a1a2e; }
.section-title { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:#64748b; margin-bottom:8px; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin-top:18px; }
table { width:100%; border-collapse:collapse; font-size:11px; }
th { background:#f1f5f9; text-align:left; padding:7px 10px; font-size:9px; text-transform:uppercase; letter-spacing:.5px; color:#64748b; font-weight:700; }
td { padding:7px 10px; border-bottom:1px solid #f1f5f9; vertical-align:top; }
tr:last-child td { border-bottom:none; }
.totals { margin-top:16px; background:#f8fafc; border-radius:8px; padding:14px 16px; }
.total-row { display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px; color:#475569; }
.total-grand { display:flex; justify-content:space-between; font-size:16px; font-weight:900; color:#0D9488; padding-top:8px; border-top:2px solid #2DD4BF; margin-top:8px; }
.notes { margin-top:16px; background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px 14px; font-size:11px; color:#92400e; }
.footer { margin-top:24px; padding-top:10px; border-top:1px solid #e2e8f0; text-align:center; font-size:9px; color:#94a3b8; }
.validity { font-size:10px; opacity:.8; margin-top:4px; }
</style></head><body>
<div class="header">
<div>
<img src="data:image/svg+xml,%3Csvg viewBox='0 0 50 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M8 20 Q12 12 16 20 Q20 28 24 20'/%3E%3Cpath d='M4 20 Q10 8 16 20 Q22 32 28 20'/%3E%3Cpath d='M0 20 Q8 4 16 20 Q24 36 32 20'/%3E%3Ccircle cx='38' cy='20' r='4' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E" class="header-logo" width="36" height="28" alt="MedTrace"/>
<h1>${company.name || 'MedTrace SRL'}</h1>
<div class="sub">${company.subtitle || 'Gestione Apparecchiature Elettromedicali'}</div>
${company.address ? `<div class="sub">${company.address}</div>` : ''}
${company.vat ? `<div class="sub">P.IVA: ${company.vat}</div>` : ''}
</div>
<div style="text-align:right">
<div style="font-size:11px;opacity:.8;margin-bottom:4px">PREVENTIVO</div>
<div style="font-size:26px;font-weight:900;letter-spacing:-1px">${quote.number}</div>
<div class="validity">Data: ${quote.date}</div>
${quote.validUntil ? `<div class="validity">Valido fino al: ${quote.validUntil}</div>` : ''}
<div class="badge">${(quote.status || '').toUpperCase()}</div>
</div>
</div>
<div class="body">
<div class="meta-grid">
<div class="meta-box">
<div class="meta-label">Cliente</div>
<div class="meta-value">${(customer === null || customer === void 0 ? void 0 : customer.name) || '—'}</div>
${(customer === null || customer === void 0 ? void 0 : customer.address) ? `<div style="font-size:11px;color:#475569;margin-top:3px">${customer.address}</div>` : ''}
${(customer === null || customer === void 0 ? void 0 : customer.vat) ? `<div style="font-size:11px;color:#475569">P.IVA: ${customer.vat}</div>` : ''}
</div>
<div class="meta-box">
<div class="meta-label">Oggetto</div>
<div class="meta-value">${asset ? asset.name : (job ? `Rif. job ${job.id}` : 'Intervento tecnico')}</div>
${(asset === null || asset === void 0 ? void 0 : asset.brand) || (asset === null || asset === void 0 ? void 0 : asset.model) ? `<div style="font-size:11px;color:#475569;margin-top:2px">${[asset.brand, asset.model].filter(Boolean).join(' ')}</div>` : ''}
${(asset === null || asset === void 0 ? void 0 : asset.serial) ? `<div style="font-size:11px;color:#475569">S/N: ${asset.serial}</div>` : ''}
${job ? `<div style="font-size:10px;color:#94a3b8;margin-top:2px">Rif. job: ${job.id}</div>` : ''}
</div>
</div>
${(quote.laborLines || []).length > 0 ? `
<div class="section-title">Manodopera</div>
<table>
<thead><tr><th style="width:60%">Descrizione</th><th style="width:25%">Dettaglio</th><th style="width:15%">Importo</th></tr></thead>
<tbody>${laborRows}</tbody>
</table>` : ''}
${(quote.partLines || []).length > 0 ? `
<div class="section-title">Materiali e Ricambi</div>
<table>
<thead><tr><th style="width:55%">Descrizione</th><th style="width:30%">Q.tà × Prezzo</th><th style="width:15%">Importo</th></tr></thead>
<tbody>${partRows}</tbody>
</table>` : ''}
<div class="totals">
<div class="total-row"><span>Manodopera</span><span>€${(((_d = quote._totals) === null || _d === void 0 ? void 0 : _d.labor) || 0).toFixed(2)}</span></div>
<div class="total-row"><span>Materiali</span><span>€${(((_e = quote._totals) === null || _e === void 0 ? void 0 : _e.parts) || 0).toFixed(2)}</span></div>
<div class="total-row"><span>Imponibile</span><span>€${subtotal.toFixed(2)}</span></div>
${!quote.vatExempt ? `<div class="total-row"><span>IVA</span><span>€${vatAmt.toFixed(2)}</span></div>` : '<div class="total-row"><span>Esente IVA</span><span>—</span></div>'}
<div class="total-grand"><span>TOTALE</span><span>€${grand.toFixed(2)}</span></div>
</div>
${quote.paymentTerms ? `<div style="margin-top:14px;font-size:11px;color:#475569"><strong>Condizioni di pagamento:</strong> ${quote.paymentTerms}</div>` : ''}
${quote.notes ? `<div class="notes"><strong>Note:</strong> ${quote.notes}</div>` : ''}
<div class="footer">
${company.name || 'MedTrace'} — Preventivo generato il ${new Date().toLocaleDateString('it-IT')}<br>
Questo documento non ha valore fiscale — per la fatturazione utilizzare il software di fatturazione elettronica
</div>
</div>
</body></html>`;
showPDFPreview(html, `preventivo-${quote.number}.pdf`);
}
/* ═══ TIMELINE MODAL ══════════════════════════════════════════ */
function TimelineModal({ job, parts, onSave, onClose }) {
const [steps, setSteps] = React.useState(job.timeline || []);
const [photos, setPhotos] = React.useState(job.photos || []);
const [newStep, setNewStep] = React.useState({ date: new Date().toISOString().slice(0, 10), type: "intervento", note: "", hours: 0 });
const [uploading, setUploading] = React.useState(false);
const fileInputRef = React.useRef();
const addStep = () => {
if (!newStep.note.trim()) { /* skip empty step */
return;
}
setSteps(s => [...s, Object.assign(Object.assign({}, newStep), { id: Date.now(), hours: +newStep.hours })]);
setNewStep({ date: new Date().toISOString().slice(0, 10), type: newStep.type, note: "", hours: 0 });
};
const removeStep = id => setSteps(s => s.filter(x => x.id !== id));
const uploadPhotos = (e) => __awaiter(this, void 0, void 0, function* () {
const files = Array.from(e.target.files || []);
if (!files.length)
return;
setUploading(true);
try {
const newPhotos = [];
for (const file of files) {
if (!file.type.startsWith("image/")) {
continue;
}
try {
const dataUrl = yield compressImage(file);
newPhotos.push({ id: Date.now() + Math.random(), name: file.name, data: dataUrl, date: new Date().toISOString().slice(0, 10) });
}
catch (err) {
console.error("Errore compressione", err);
}
}
setPhotos(p => [...p, ...newPhotos]);
}
finally {
setUploading(false);
if (fileInputRef.current)
fileInputRef.current.value = "";
}
});
const removePhoto = id => setPhotos(p => p.filter(x => x.id !== id));
const sortedSteps = [...steps].sort((a, b) => a.date.localeCompare(b.date));
return (React.createElement(Modal, { title: "Timeline & Foto — " + (job.id), wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 18 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, "\u00B7 Cronologia Intervento"),
sortedSteps.length === 0 && React.createElement("div", { style: { textAlign: "center", color: "#475569", padding: "16px 0", fontSize: 12 } }, "Nessuno step ancora."),
sortedSteps.map((step, i) => (React.createElement("div", { key: step.id, style: { display: "flex", gap: 14, marginBottom: 14, position: "relative" } },
React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" } },
React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#2DD4BF22", border: "1px solid #2563eb44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 } }, TIMELINE_ICON[step.type] || "·"),
i < sortedSteps.length - 1 && React.createElement("div", { style: { width: 2, flex: 1, background: "#32323F", marginTop: 4 } })),
React.createElement("div", { style: { flex: 1, background: "#141418", borderRadius: 8, padding: "10px 14px", border: "1px solid #2a3040" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8, flexWrap: "wrap" } },
React.createElement("div", null,
React.createElement("span", { style: { color: "#5EEAD4", fontWeight: 700, fontSize: 13 } }, TIMELINE_LABEL[step.type] || step.type),
React.createElement("span", { style: { color: "#64748b", fontSize: 11, marginLeft: 8 } }, step.date)),
React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } },
step.hours > 0 && React.createElement("span", { style: { color: "#a855f7", fontSize: 11, fontWeight: 700 } },
step.hours,
"h"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => removeStep(step.id), style: { padding: "2px 8px", fontSize: 11 } }, "\u2715"))),
React.createElement("div", { style: { color: "#e2e8f0", fontSize: 13, lineHeight: 1.4 } }, step.note))))),
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 10, padding: 14, border: "1px dashed #2a3040", marginTop: 12 } },
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginBottom: 10, fontWeight: 700 } }, "+ Nuovo step"),
React.createElement(Grid, { cols: "1fr 1fr 80px" },
React.createElement(Sel, { label: "Tipo evento", value: newStep.type, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { type: e.target.value }))) }, Object.entries(TIMELINE_LABEL).map(([k, v]) => React.createElement("option", { key: k, value: k },
TIMELINE_ICON[k],
" ",
v))),
React.createElement(Inp, { label: "Data", type: "date", value: newStep.date, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { date: e.target.value }))) }),
React.createElement(Inp, { label: "Ore", type: "number", step: "0.5", value: newStep.hours, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { hours: e.target.value }))) })),
React.createElement("div", { style: { marginTop: 10 } },
React.createElement(Txt, { label: "Descrizione", value: newStep.note, onChange: e => setNewStep(x => (Object.assign(Object.assign({}, x), { note: e.target.value }))) })),
React.createElement("div", { style: { marginTop: 10, textAlign: "right" } },
React.createElement(Btn, { sm: true, onClick: addStep }, "+ Aggiungi step")))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } },
" Foto Allegate (",
photos.length,
")"),
React.createElement("label", null,
React.createElement("input", { ref: fileInputRef, type: "file", accept: "image/*", multiple: true, onChange: uploadPhotos, style: { display: "none" } }),
React.createElement("span", { style: { background: "#1E1E28", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "inline-block" } }, uploading ? "Caricamento..." : "+ Aggiungi foto"))),
photos.length === 0 ? (React.createElement("div", { style: { textAlign: "center", color: "#475569", padding: "16px 0", fontSize: 12 } }, "Nessuna foto. Le foto vengono compresse automaticamente per risparmiare memoria.")) : (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8 } }, photos.map(photo => (React.createElement("div", { key: photo.id, style: { position: "relative", aspectRatio: "1", borderRadius: 8, overflow: "hidden", border: "1px solid #2a3040" } },
React.createElement("img", { src: photo.data, alt: photo.name, style: { width: "100%", height: "100%", objectFit: "cover", cursor: "pointer" }, onClick: () => window.open(photo.data, "_blank") }),
React.createElement("button", { onClick: () => removePhoto(photo.id), style: { position: "absolute", top: 4, right: 4, background: "#ef4444", border: "none", color: "#fff", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 14, fontWeight: 700 } }, "\u00D7"))))))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { variant: "success", onClick: () => onSave({ timeline: steps, photos }) }, "\u2713 Salva tutto")))));
}
function WithdrawalModal({ parts, assets, onWithdraw, onClose }) {
var _a, _b;
const [items, setItems] = React.useState([{ partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }]);
const [reason, setReason] = React.useState("");
const [assetId, setAssetId] = React.useState(((_b = assets[0]) === null || _b === void 0 ? void 0 : _b.id) || "");
const [tech, setTech] = React.useState("");
const addRow = () => setItems(i => { var _a; return [...i, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }]; });
const remRow = i => setItems(a => a.filter((_, idx) => idx !== i));
const setRow = (i, k, v) => setItems(a => { const r = [...a]; r[i] = Object.assign(Object.assign({}, r[i]), { [k]: k === "qty" ? +v : v }); return r; });
const total = items.reduce((s, r) => { const p = parts.find(x => x.id === r.partId); return s + (p ? p.unitPrice * r.qty : 0); }, 0);
const submit = () => {
const err = items.some(r => { const p = parts.find(x => x.id === r.partId); return !p || r.qty < 1 || r.qty > p.qty; });
if (err) { /* qty check failed */
return;
}
onWithdraw({ items, reason, assetId, tech, date: new Date().toISOString().slice(0, 10), total });
};
if (parts.length === 0 || assets.length === 0) {
return (React.createElement(Modal, { title: " Scarico Stock", onClose: onClose },
React.createElement("div", { style: { textAlign: "center", padding: "20px 0", color: "#94a3b8" } },
"Servono almeno un apparecchio e una parte.",
React.createElement("div", { style: { marginTop: 14 } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi")))));
}
return (React.createElement(Modal, { title: " Scarico Stock", wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Sel, { label: "Apparecchio", value: assetId, onChange: e => setAssetId(e.target.value) }, assets.map(a => React.createElement("option", { key: a.id, value: a.id },
a.id,
" \u2014 ",
a.name))),
React.createElement(Inp, { label: "Tecnico", value: tech, onChange: e => setTech(e.target.value) }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Motivo / Riferimento", value: reason, onChange: e => setReason(e.target.value) }))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Parti"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addRow }, "+ Aggiungi")),
items.map((row, i) => {
const p = parts.find(x => x.id === row.partId);
return (React.createElement("div", { key: i, style: { display: "grid", gridTemplateColumns: "1fr 70px 80px auto", gap: 6, marginBottom: 8, alignItems: "center" } },
React.createElement("select", { value: row.partId, onChange: e => setRow(i, "partId", e.target.value), style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 10px", color: "#e2e8f0", minWidth: 0 } }, parts.map(pt => React.createElement("option", { key: pt.id, value: pt.id },
pt.code,
" \u2014 ",
pt.name))),
React.createElement("input", { type: "number", value: row.qty, min: 1, max: p === null || p === void 0 ? void 0 : p.qty, onChange: e => setRow(i, "qty", e.target.value), style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 10px", color: "#e2e8f0" } }),
React.createElement("span", { style: { color: "#a855f7", fontWeight: 700, fontSize: 12 } },
"\u20AC",
p ? (p.unitPrice * row.qty).toFixed(2) : "0"),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => remRow(i) }, "\u2715")));
}),
React.createElement("div", { style: { textAlign: "right", marginTop: 8 } },
React.createElement("span", { style: { color: "#64748b", fontSize: 12 } }, "Totale: "),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 800, fontSize: 16 } },
"\u20AC",
total.toFixed(2)))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { variant: "success", onClick: submit }, "\u2713 Conferma")))));
}
function AssetDetailModal({ asset, jobs, parts, iecReports, funcReports, customers, onClose, onEditAsset, onNewJob, onNewIec, onNewFunc, onOpenJob, company, generateJobPDF, generateIECPDF, generateFuncPDF, procedures, onGotoProcedures, onNewQuote }) {
const [tab, setTab] = React.useState("overview");
const customer = customers.find(c => c.id === asset.customerId) || null;
const assetJobs = jobs
.filter(j => j.assetId === asset.id)
.sort((a, b) => b.openDate.localeCompare(a.openDate));
const assetIec = iecReports
.filter(r => r.assetId === asset.id)
.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
const assetFunc = funcReports
.filter(r => r.assetId === asset.id)
.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
const totalCost = assetJobs.reduce((s, j) => {
const p = j.parts.reduce((s2, p) => { const pt = parts.find(x => x.id === p.partId); return s2 + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
return s + p + j.laborHours * j.laborRate;
}, 0);
const openJobs = assetJobs.filter(j => j.status !== "chiuso");
const lastIec = assetIec[0] || null;
const lastFunc = assetFunc[0] || null;
const warrantyDays = asset.warrantyExpiry ? Math.round((new Date(asset.warrantyExpiry) - new Date()) / 86400000) : null;
const serviceDays = asset.nextService ? Math.round((new Date(asset.nextService) - new Date()) / 86400000) : null;
const S = { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 10, padding: "14px 16px" };
const LBL = { fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 3 };
const VAL = { fontSize: 13, color: "#e2e8f0", fontWeight: 600 };
const assetProcedures = (procedures || []).filter(p => (p.modelName && asset.model && p.modelName.toLowerCase().includes(asset.model.toLowerCase())) ||
(p.brand && asset.brand && p.brand.toLowerCase() === asset.brand.toLowerCase()) ||
(p.category && asset.name && asset.name.toLowerCase().includes((p.category || '').toLowerCase().split(' ')[0])));
const TABS = [
{ id: "overview", label: "Scheda" },
{ id: "jobs", label: "Job (" + assetJobs.length + ")" },
{ id: "iec", label: "Sic. Elettrica (" + assetIec.length + ")" },
{ id: "func", label: "Funzionale (" + assetFunc.length + ")" },
{ id: "procs", label: "Procedure (" + assetProcedures.length + ")" }
];
const riskColor = { A: "#22c55e", B: "#f59e0b", C: "#ef4444" };
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0, minHeight: 0 } },
React.createElement("div", { style: { background: "linear-gradient(135deg,#1e3a8a,#1e2a5a)", borderRadius: 10, padding: "16px 18px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 } },
React.createElement("span", { style: { fontSize: 20, fontWeight: 900, color: "#fff" } }, asset.name),
asset.riskClass && React.createElement("span", { style: { background: riskColor[asset.riskClass] + "33", color: riskColor[asset.riskClass], border: "1px solid " + riskColor[asset.riskClass] + "55", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 } },
"Cl. ",
asset.riskClass),
React.createElement(Badge, { text: asset.status, color: STATUS_COLOR[asset.status] || "#64748b" })),
React.createElement("div", { style: { fontSize: 12, color: "#99F6E4", marginBottom: 2 } },
asset.brand,
" ",
asset.model),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace" } },
"S/N: ",
asset.serial || "—",
" \u00B7 ID: ",
asset.id),
customer && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 4 } },
" ",
customer.name)),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 } },
React.createElement("button", { onClick: onEditAsset, style: { background: "#ffffff18", color: "#fff", border: "1px solid #ffffff30", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: onNewJob, style: { background: "#2DD4BF", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "+ Job"),
React.createElement("button", { onClick: onNewIec, style: { background: "#7c3aed", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u26A1 IEC"),
React.createElement("button", { onClick: onNewFunc, style: { background: "#0891b2", color: "#fff", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "Funzionale"))),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } }, [
{ label: "Job aperti", value: openJobs.length, color: openJobs.length > 0 ? "#f59e0b" : "#22c55e" },
{ label: "Job totali", value: assetJobs.length, color: "#2DD4BF" },
{ label: "Costo totale", value: "€" + totalCost.toFixed(0), color: "#a855f7" },
{ label: "Ultimo IEC", value: lastIec ? lastIec.date : "mai", color: (lastIec === null || lastIec === void 0 ? void 0 : lastIec.overallPass) ? "#22c55e" : "#ef4444" },
{ label: "Ultima verif.", value: lastFunc ? lastFunc.date : "mai", color: "#64748b" },
].map(k => (React.createElement("div", { key: k.label, style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 8, padding: "8px 14px", flex: 1, minWidth: 100 } },
React.createElement("div", { style: { fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: .7, fontWeight: 700 } }, k.label),
React.createElement("div", { style: { fontSize: 15, fontWeight: 800, color: k.color, marginTop: 2 } }, k.value))))),
React.createElement("div", { style: { display: "flex", gap: 4, marginBottom: 12, borderBottom: "2px solid #1e2a3a", paddingBottom: 0 } }, TABS.map(t => (React.createElement("button", { key: t.id, onClick: () => setTab(t.id), style: {
background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #3b82f6" : "2px solid transparent",
color: tab === t.id ? "#5EEAD4" : "#64748b", padding: "7px 12px", cursor: "pointer",
fontSize: 12, fontWeight: tab === t.id ? 700 : 400, marginBottom: -2, whiteSpace: "nowrap"
} }, t.label)))),
tab === "overview" && (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, overflow: "auto", maxHeight: "55vh" } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } },
React.createElement("div", { style: S },
React.createElement("div", { style: LBL }, "Identificazione"),
[["Marca", asset.brand], ["Modello", asset.model], ["N° Serie", asset.serial], ["Ubicazione", asset.location], ["Norma IEC", asset.iecNorm]].map(([l, v]) => v ? (React.createElement("div", { key: l, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1a2030" } },
React.createElement("span", { style: { fontSize: 11, color: "#64748b" } }, l),
React.createElement("span", { style: { fontSize: 11, color: "#e2e8f0", fontFamily: l === "N° Serie" ? "monospace" : "inherit" } }, v))) : null)),
React.createElement("div", { style: S },
React.createElement("div", { style: LBL }, "Date e contratti"),
[
["Acquisto", asset.purchaseDate],
["Scad. garanzia", asset.warrantyExpiry],
["Ultimo servizio", asset.lastService],
["Prossimo servizio", asset.nextService],
["Interv. (mesi)", asset.serviceInterval],
].map(([l, v]) => v ? (React.createElement("div", { key: l, style: { display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1a2030" } },
React.createElement("span", { style: { fontSize: 11, color: "#64748b" } }, l),
React.createElement("span", { style: { fontSize: 11, color: l === "Scad. garanzia" && warrantyDays !== null && warrantyDays < 90 ? "#f59e0b" : "#e2e8f0" } }, v))) : null),
asset.serviceContract && (React.createElement("div", { style: { marginTop: 6, padding: "6px 8px", background: "#0D0D12", borderRadius: 6, fontSize: 10, color: "#94a3b8" } },
React.createElement("span", { style: { color: "#64748b", fontWeight: 700 } }, "Contratto: "),
asset.serviceContract)))),
serviceDays !== null && (React.createElement("div", { style: { background: serviceDays < 0 ? "#ef444415" : serviceDays <= 30 ? "#f59e0b15" : "#22c55e15", border: "1px solid " + (serviceDays < 0 ? "#ef444433" : serviceDays <= 30 ? "#f59e0b33" : "#22c55e33"), borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 12, color: "#94a3b8" } },
"Prossima manutenzione programmata: ",
React.createElement("strong", { style: { color: "#e2e8f0" } }, asset.nextService)),
React.createElement(AlertChip, { days: serviceDays }))),
asset.notes && React.createElement("div", { style: Object.assign(Object.assign({}, S), { fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }) },
React.createElement("div", { style: LBL }, "Note"),
asset.notes))),
tab === "jobs" && (React.createElement("div", { style: { overflow: "auto", maxHeight: "55vh", display: "flex", flexDirection: "column", gap: 8 } }, assetJobs.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "#475569" } }, "Nessun job per questo apparecchio")) : assetJobs.map(j => {
var _a;
const pCost = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
const tot = pCost + j.laborHours * j.laborRate;
return (React.createElement("div", { key: j.id, style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 8, padding: "10px 14px", cursor: "pointer" }, onClick: () => onOpenJob(j) },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 4 } },
React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11, color: "#64748b" } }, j.id),
React.createElement(Badge, { text: j.status, color: STATUS_COLOR[j.status] || "#64748b" }),
React.createElement(Badge, { text: j.priority, color: PRI_COLOR[j.priority] || "#64748b" }),
React.createElement("span", { style: { fontSize: 11, color: "#64748b", textTransform: "capitalize" } }, j.type)),
React.createElement("div", { style: { fontSize: 12, color: "#94a3b8", marginBottom: 2 } }, j.description || "—"),
React.createElement("div", { style: { fontSize: 10, color: "#475569" } },
j.openDate,
j.closeDate ? " → " + j.closeDate : "",
" \u00B7 ",
j.assignee || "—")),
React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 14, fontWeight: 800, color: "#a855f7", fontFamily: "monospace" } },
"\u20AC",
tot.toFixed(0)),
((_a = j.timeline) === null || _a === void 0 ? void 0 : _a.length) > 0 && React.createElement("div", { style: { fontSize: 10, color: "#475569" } },
"\u00B7 ",
j.timeline.length,
" step"),
(j.iecReportId || j.funcReportId) && React.createElement("div", { style: { fontSize: 10, color: "#5EEAD4" } }, j.iecReportId ? "SIC.EL." : "")))));
}))),
tab === "iec" && (React.createElement("div", { style: { overflow: "auto", maxHeight: "55vh", display: "flex", flexDirection: "column", gap: 8 } }, assetIec.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "#475569" } }, "Nessuna verifica IEC per questo apparecchio")) : assetIec.map(r => (React.createElement("div", { key: r.id, style: { background: "#141418", border: "1px solid " + (r.overallPass ? "#22c55e33" : "#ef444433"), borderRadius: 8, padding: "10px 14px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 3 } },
React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700, color: "#e2e8f0" } }, r.reportNumber || r.id),
React.createElement("span", { style: { fontSize: 10, color: "#64748b" } },
"IEC ",
r.norm,
" \u00B7 Cl.",
r.equipClass,
" \u00B7 ",
r.patientType || "BF")),
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8" } },
r.date,
" \u00B7 ",
r.technician || "—",
" \u00B7 ",
r.verifyType),
r.notes && React.createElement("div", { style: { fontSize: 10, color: "#475569", marginTop: 3 } }, r.notes)),
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: r.overallPass ? "#22c55e" : "#ef4444" } }, r.overallPass ? "✓ OK" : "✗ NO"),
React.createElement("button", { onClick: () => generateIECPDF(r, asset, customer, company), title: "Scarica PDF", style: { background: "#202028", border: "1px solid #5EEAD444", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700 } }, "PDF")))))))),
tab === "func" && (React.createElement("div", { style: { overflow: "auto", maxHeight: "55vh", display: "flex", flexDirection: "column", gap: 8 } }, assetFunc.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "#475569" } }, "Nessuna verifica funzionale per questo apparecchio")) : assetFunc.map(r => {
const tpl = (FUNC_TEMPLATES || {})[r.templateId] || { label: "Generico", icon: "›" };
return (React.createElement("div", { key: r.id, style: { background: "#141418", border: "1px solid " + (r.overallPass ? "#22c55e33" : "#ef444433"), borderRadius: 8, padding: "10px 14px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 } },
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", marginBottom: 3 } },
React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700, color: "#e2e8f0" } }, r.reportNumber || r.id),
React.createElement("span", { style: { fontSize: 11, color: "#64748b" } },
tpl.icon,
" ",
tpl.label)),
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8" } },
r.date,
" \u00B7 ",
r.technician || "—"),
r.notes && React.createElement("div", { style: { fontSize: 10, color: "#475569", marginTop: 3 } }, r.notes)),
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: r.overallPass ? "#22c55e" : "#ef4444" } }, r.overallPass ? "✓ OK" : "✗ NO"),
React.createElement("button", { onClick: () => generateFuncPDF(r, asset, customer, company), title: "Scarica PDF", style: { background: "#202028", border: "1px solid #5EEAD444", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700 } }, "PDF")))));
}))),
tab === "procs" && (React.createElement("div", { style: { overflow: "auto", maxHeight: "55vh", display: "flex", flexDirection: "column", gap: 8 } },
React.createElement("div", { style: { background: "#0D0D12", border: "1px solid #2DD4BF33", borderRadius: 8, padding: "10px 14px", marginBottom: 6 } },
React.createElement("div", { style: { fontSize: 11, color: "#9090A8", marginBottom: 6 } },
"Procedure trovate per ",
React.createElement("strong", { style: { color: "#F0F0F5" } },
asset.brand,
" ",
asset.model)),
React.createElement("button", { onClick: () => onGotoProcedures && onGotoProcedures(), style: { background: "#1E1E28", border: "1px solid #2DD4BF44", borderRadius: 6, color: "#2DD4BF", padding: "4px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2192 Vai a tutte le Procedure")),
assetProcedures.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "#5A5A70" } },
"Nessuna procedura per questo modello.",
React.createElement("br", null),
React.createElement("button", { onClick: () => onGotoProcedures && onGotoProcedures(), style: { marginTop: 10, background: "linear-gradient(135deg,#2DD4BF,#0D9488)", color: "#000", border: "none", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontSize: 11, fontWeight: 800 } },
"+ Crea procedura per ",
asset.brand,
" ",
asset.model))) : assetProcedures.map(p => {
var _a;
return (React.createElement("div", { key: p.id, style: { background: "#141418", border: "1px solid #2A2A38", borderRadius: 8, padding: "10px 14px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 3 } },
p.category && React.createElement("span", { style: { fontSize: 10, background: "#2DD4BF18", color: "#2DD4BF", border: "1px solid #2DD4BF33", borderRadius: 20, padding: "1px 8px", fontWeight: 700 } }, p.category),
p.type && React.createElement("span", { style: { fontSize: 10, background: "#a855f718", color: "#a855f7", border: "1px solid #a855f733", borderRadius: 20, padding: "1px 8px", fontWeight: 700 } }, p.type)),
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#F0F0F5" } },
p.brand,
" ",
p.modelName),
React.createElement("div", { style: { fontSize: 11, color: "#5A5A70", marginTop: 2 } },
"\uD83D\uDCCB ",
((_a = p.steps) === null || _a === void 0 ? void 0 : _a.length) || 0,
" passi",
p.estimatedMinutes ? ` · ⏱ ~${p.estimatedMinutes} min` : "")),
React.createElement("button", { onClick: () => onGotoProcedures && onGotoProcedures(), style: { background: "#202028", border: "1px solid #2DD4BF44", borderRadius: 5, color: "#2DD4BF", padding: "4px 10px", cursor: "pointer", fontSize: 10, fontWeight: 700, flexShrink: 0 } }, "Apri \u2192"))));
})))));
}
// Keep HistoryModal as alias for backward compat
function HistoryModal({ asset, jobs, parts, onClose }) {
return null; // replaced by AssetDetailModal
}
function SettingsModal({ data, company, onUpdateCompany, onImport, onMerge, onReset, onClose, setPortalMode }) {
const [comp, setComp] = React.useState(company);
const s = k => e => setComp(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const fileRef = e => {
var _a;
const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file)
return;
const reader = new FileReader();
reader.onload = ev => {
try {
const imported = JSON.parse(ev.target.result);
if (!imported.assets || !imported.parts) { /* invalid file */
return;
}
onImport(imported);
}
catch ( /* read error */_a) { /* read error */ }
};
reader.readAsText(file);
};
return (React.createElement(Modal, { title: "\u2699 Impostazioni", wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, " Dati Azienda (per fatture e rapporti)"),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Nome / Ragione sociale", value: comp.name, onChange: s("name") }),
React.createElement(Inp, { label: "Sottotitolo", value: comp.subtitle, onChange: s("subtitle") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Indirizzo", value: comp.address, onChange: s("address") })),
React.createElement(Inp, { label: "P.IVA", value: comp.vat, onChange: s("vat") }),
React.createElement(Inp, { label: "IBAN", value: comp.iban, onChange: s("iban") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Prefisso numerazione fatture", value: comp.invoicePrefix, onChange: s("invoicePrefix"), placeholder: "es: F" }))),
React.createElement("div", { style: { textAlign: "right", marginTop: 10 } },
React.createElement(Btn, { sm: true, onClick: () => { onUpdateCompany(comp); alert("Salvato!"); } }, "Salva dati azienda"))),
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "14px 16px", border: "1px solid #2a3040" } },
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 6 } }, " Dove sono i dati?"),
React.createElement("div", { style: { color: "#64748b", fontSize: 12, lineHeight: 1.5 } },
"Tutto ",
React.createElement("strong", { style: { color: "#94a3b8" } }, "localmente nel browser"),
". Nulla viene mandato online. Esporta backup periodici.")),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Anteprima Portale Cliente"),
React.createElement("div", { style: { background: '#0D0D12', border: '1px solid #2DD4BF33', borderRadius: 8, padding: '10px 14px', marginBottom: 14 } },
React.createElement("div", { style: { fontSize: 12, color: '#9090A8', marginBottom: 8 } }, "Visualizza l'app come la vedrebbe un cliente (read-only): apparecchi, job, rapporti, allegati."),
React.createElement("button", { onClick: () => { onClose(); setPortalMode(true); }, style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 800 } }, "\uD83D\uDC41 Apri anteprima portale"),
React.createElement("div", { style: { fontSize: 10, color: '#3A3A50', marginTop: 8 } }, "\u24D8 Skeleton offline. Con Supabase: link unico per cliente con accesso reale via URL.")),
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Spazio utilizzato"),
React.createElement("div", { style: { background: '#0D0D12', border: '1px solid #2A2A38', borderRadius: 8, padding: '10px 14px', marginBottom: 14 } }, (() => {
const u = getStorageUsage();
const pct = Math.min(100, (u.bytes / (10 * 1024 * 1024)) * 100);
const color = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#22c55e';
return (React.createElement(React.Fragment, null,
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 } },
React.createElement("span", { style: { color: '#9090A8' } },
u.mb,
" MB di ~10 MB (localStorage browser)"),
React.createElement("span", { style: { color, fontWeight: 700, fontFamily: 'monospace' } },
pct.toFixed(0),
"%")),
React.createElement("div", { style: { height: 6, background: '#1a1a22', borderRadius: 3, overflow: 'hidden' } },
React.createElement("div", { style: { height: '100%', width: pct + '%', background: color, transition: 'width .3s' } })),
pct > 70 && (React.createElement("div", { style: { marginTop: 8, fontSize: 11, color: '#f59e0b' } }, "\u26A0 Spazio in esaurimento. Esporta backup e considera l'eliminazione di vecchi allegati pesanti."))));
})()),
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Backup"),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement(Btn, { variant: "ghost", onClick: () => downloadJSON("medtrace-backup-" + (new Date().toISOString().slice(0, 10)) + ".json", data) }, "\u2B07 Esporta backup"),
React.createElement("label", null,
React.createElement("input", { type: "file", accept: ".json", onChange: fileRef, style: { display: "none" } }),
React.createElement("span", { style: { background: "#1E1E28", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "inline-block" } }, "\u2B06 Importa backup")),
React.createElement("label", { title: "Aggiunge i record del file JSON ai tuoi senza cancellare niente" },
React.createElement("input", { type: "file", accept: ".json", onChange: e => {
var _a;
const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file)
return;
const reader = new FileReader();
reader.onload = ev => {
try {
const d = JSON.parse(ev.target.result);
onMerge(d);
}
catch (_a) { }
};
reader.readAsText(file);
e.target.value = '';
}, style: { display: "none" } }),
React.createElement("span", { style: { background: "#2DD4BF18", color: "#2DD4BF", border: "1px solid #2DD4BF44", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "inline-block" } }, " Unisci backup")))),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "#ef4444", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "\u26A0 Zona pericolosa"),
React.createElement(Btn, { variant: "danger", onClick: onReset }, " Reset completo")),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi")))));
}
/* ═══ MAIN APP ══════════════════════════════════════════════════════════════ */
function App() {
var _a, _b, _c, _d, _e, _f;
const isMobile = useMedia("(max-width:768px)");
const initialData = loadData() || {
assets: [], parts: [], jobs: [], orders: [], withdrawals: [],
customers: [], invoices: [], instruments: [], procedures: [], quotes: [],
company: { name: "MedTrace", subtitle: "Gestione Apparecchiature Elettromedicali", address: "", vat: "", iban: "", invoicePrefix: "F" }
};
const [tab, setTab] = React.useState("dashboard");
const [portalMode, setPortalMode] = React.useState(false);
const [assets, setAssets] = React.useState(initialData.assets);
const [instruments, setInstruments] = React.useState(initialData.instruments || []);
const [procedures, setProcedures] = React.useState(initialData.procedures || []);
const [quotes, setQuotes] = React.useState(initialData.quotes || []);
const [parts, setParts] = React.useState(initialData.parts);
const [jobs, setJobs] = React.useState(initialData.jobs);
const [orders, setOrders] = React.useState(initialData.orders);
const [withdrawals, setWDs] = React.useState(initialData.withdrawals);
const [customers, setCustomers] = React.useState(initialData.customers || []);
const [invoices, setInvoices] = React.useState(initialData.invoices || []);
const [iecReports, setIecReports] = React.useState(initialData.iecReports || []);
const [funcReports, setFuncReports] = React.useState(initialData.funcReports || []);
const [company, setCompany] = React.useState(initialData.company || { name: "MedTrace SRL", subtitle: "Service & Manutenzione", invoicePrefix: "F" });
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState("");
const [toast, setToast] = React.useState(null);
const [navOpen, setNavOpen] = React.useState(false);
const [pdfHtml, setPdfHtml] = React.useState(null);
const [csvModal, setCsvModal] = React.useState(null);
const [helpOpen, setHelpOpen] = React.useState({});
// Filters
const [filterStatus, setFilterStatus] = React.useState("");
const [filterPriority, setFilterPriority] = React.useState("");
const [filterCustomer, setFilterCustomer] = React.useState("");
const [filterYear, setFilterYear] = React.useState(new Date().getFullYear());
const [filterMonth, setFilterMonth] = React.useState("");
const [scheduleYear, setScheduleYear] = React.useState(new Date().getFullYear());
// Listen for PDF and CSV display requests
React.useEffect(() => {
const pdfHandler = (e) => setPdfHtml(e.detail);
const csvHandler = (e) => setCsvModal(e.detail);
window.addEventListener('show-pdf', pdfHandler);
window.addEventListener('show-csv', csvHandler);
return () => {
window.removeEventListener('show-pdf', pdfHandler);
window.removeEventListener('show-csv', csvHandler);
};
}, []);
React.useEffect(() => { saveData({ assets, parts, jobs, orders, withdrawals, customers, invoices, instruments, procedures, quotes, iecReports, funcReports, company }); }, [assets, parts, jobs, orders, withdrawals, customers, invoices, iecReports, company]);
const showToast = React.useCallback((msg, color = "#22c55e") => {
setToast({ msg, color });
setTimeout(() => setToast(null), 3000);
}, []);
// Stats
const stats = React.useMemo(() => {
const stockValue = parts.reduce((s, p) => s + p.qty * p.unitPrice, 0);
const stockSellValue = parts.reduce((s, p) => s + p.qty * (p.sellPrice || p.unitPrice), 0);
return {
totalAssets: assets.length,
operative: assets.filter(a => a.status === "operativo").length,
maintenance: assets.filter(a => a.status === "in manutenzione").length,
outOfService: assets.filter(a => a.status === "fuori servizio").length,
openJobs: jobs.filter(j => j.status !== "chiuso").length,
urgentJobs: jobs.filter(j => j.priority === "urgente" && j.status !== "chiuso").length,
lowStock: parts.filter(p => p.qty <= p.minQty).length,
stockValue, stockSellValue,
pendingOrders: orders.filter(o => o.status !== "ricevuto" && o.status !== "annullato").length,
customers: customers.length,
pendingInvoices: invoices.filter(i => i.status === "emessa" || i.status === "bozza").length,
};
}, [assets, parts, jobs, orders, customers, invoices]);
// Financial calculations
const financials = React.useMemo(() => {
const yr = +filterYear;
const matchPeriod = dateStr => {
if (!dateStr)
return false;
const d = new Date(dateStr);
if (d.getFullYear() !== yr)
return false;
if (filterMonth !== "" && d.getMonth() !== +filterMonth)
return false;
return true;
};
const periodInvoices = invoices.filter(i => matchPeriod(i.date));
const periodOrders = orders.filter(o => matchPeriod(o.orderDate) && o.status === "ricevuto");
const periodJobs = jobs.filter(j => matchPeriod(j.closeDate || j.openDate));
let revenue = 0, vatCollected = 0;
periodInvoices.forEach(inv => {
if (inv.status === "annullato")
return;
const subtotal = inv.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
const vat = inv.items.reduce((s, it) => s + (it.qty * it.unitPrice * it.vat / 100), 0);
revenue += subtotal;
vatCollected += vat;
});
let costsPartsBought = 0;
periodOrders.forEach(o => { costsPartsBought += o.qty * o.unitPrice; });
// Cost of parts used in jobs (at cost price)
let costsPartsUsed = 0;
periodJobs.forEach(j => {
j.parts.forEach(p => { const pt = parts.find(x => x.id === p.partId); if (pt)
costsPartsUsed += pt.unitPrice * p.qty; });
});
const margin = revenue - costsPartsUsed;
const monthlyData = [];
for (let m = 0; m < 12; m++) {
let rev = 0;
invoices.forEach(inv => {
if (inv.status === "annullato")
return;
const d = new Date(inv.date);
if (d.getFullYear() === yr && d.getMonth() === m) {
rev += inv.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
}
});
monthlyData.push({ label: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][m], value: rev });
}
return { revenue, vatCollected, costsPartsBought, costsPartsUsed, margin, periodInvoices, monthlyData };
}, [invoices, orders, jobs, parts, filterYear, filterMonth]);
// Annual scheduling - group assets by nextService month/year
const scheduleRows = React.useMemo(() => {
const today = new Date();
today.setHours(0, 0, 0, 0);
return assets
.filter(a => a.nextService)
.map(a => {
const d = new Date(a.nextService);
const c = customers.find(x => x.id === a.customerId) || {};
const days = Math.round((d - today) / 86400000);
// Get most recent IEC report for this asset
const lastIec = iecReports
.filter(r => r.assetId === a.id)
.sort((a, b) => { var _a; return (_a = b.date) === null || _a === void 0 ? void 0 : _a.localeCompare(a.date || ""); })[0];
const normMap = { "62353": "IEC 62353", "61010": "IEC 61010-1" };
return {
assetId: a.id,
assetName: a.name,
brand: a.brand,
serial: a.serial,
location: a.location,
customer: c.name || "",
norm: lastIec ? (normMap[lastIec.norm] || "IEC 62353") : (a.iecNorm ? (normMap[a.iecNorm] || a.iecNorm) : "—"),
lastService: (lastIec === null || lastIec === void 0 ? void 0 : lastIec.date) || a.lastService || "",
nextService: a.nextService,
status: a.status,
month: d.getMonth(),
year: d.getFullYear(),
_days: days,
};
})
.filter(r => r.year === scheduleYear);
}, [assets, iecReports, customers, scheduleYear]);
const MONTHS_IT = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
const scheduleMonths = React.useMemo(() => MONTHS_IT.map((monthLabel, month) => ({
month, monthLabel,
items: scheduleRows.filter(r => r.month === month)
})), [scheduleRows]);
// Maintenance calendar - upcoming
const upcomingMaintenance = React.useMemo(() => {
const today = new Date();
today.setHours(0, 0, 0, 0);
const in30days = new Date(today);
in30days.setDate(in30days.getDate() + 30);
return assets
.filter(a => a.nextService)
.map(a => (Object.assign(Object.assign({}, a), { daysToService: Math.round((new Date(a.nextService) - today) / (1000 * 60 * 60 * 24)) })))
.filter(a => a.daysToService <= 30)
.sort((a, b) => a.daysToService - b.daysToService);
}, [assets]);
// IDs
const newId = (prefix, list) => {
const nums = list.map(x => parseInt((x.id || "").replace(/\D/g, ""), 10)).filter(n => !isNaN(n));
const next = (nums.length ? Math.max(...nums) : 0) + 1;
return prefix + String(next).padStart(3, "0");
};
const generateInvoiceNumber = () => {
const year = new Date().getFullYear();
const existing = invoices.filter(i => { var _a; return (_a = i.number) === null || _a === void 0 ? void 0 : _a.includes("/" + (year)); }).length;
return (company.invoicePrefix || "F") + "-" + (String(existing + 1).padStart(4, "0")) + "/" + (year);
};
// CRUD
const saveAsset = f => {
if (DEMO_MODE && !modal.data && assets.length >= DEMO_LIMITS.assets) {
alert("⚡ DEMO — Limite " + DEMO_LIMITS.assets + " apparecchi raggiunto.");
return;
}
if (modal.data) {
setAssets(a => a.map(x => x.id === modal.data.id ? Object.assign(Object.assign({}, f), { id: modal.data.id }) : x));
}
else {
setAssets(a => [...a, Object.assign(Object.assign({}, f), { id: newId("A", a) })]);
}
setModal(null);
showToast("Apparecchio salvato");
};
const delAsset = id => {
const linkedJobs = jobs.filter(j => j.assetId === id).length;
const linkedIec = iecReports.filter(r => r.assetId === id).length;
const linkedFunc = funcReports.filter(r => r.assetId === id).length;
if (linkedJobs + linkedIec + linkedFunc > 0) {
if (!confirm("⚠ Questo apparecchio ha " + linkedJobs + " job, " + linkedIec + " verifiche sicurezza, " + linkedFunc + " verifiche funzionali collegati.\n\nI record collegati resteranno (orfani). Procedere?"))
return;
}
setAssets(a => a.filter(x => x.id !== id));
showToast("Apparecchio eliminato", "#ef4444");
};
const savePart = f => {
if (modal.data) {
setParts(p => p.map(x => x.id === modal.data.id ? Object.assign(Object.assign({}, f), { id: modal.data.id }) : x));
}
else {
setParts(p => [...p, Object.assign(Object.assign({}, f), { id: newId("P", p) })]);
}
setModal(null);
showToast("Parte salvata");
};
const delPart = id => { setParts(p => p.filter(x => x.id !== id)); showToast("Eliminata", "#ef4444"); };
const saveJob = f => {
if (DEMO_MODE && !modal.data && jobs.length >= DEMO_LIMITS.jobs) {
alert("⚡ DEMO — Limite " + DEMO_LIMITS.jobs + " job raggiunto.");
return;
}
if (modal.data) {
setJobs(j => j.map(x => x.id === modal.data.id ? Object.assign(Object.assign({}, f), { id: modal.data.id }) : x));
}
else {
setJobs(j => [...j, Object.assign(Object.assign({}, f), { id: newId("J", j), timeline: [], photos: [] })]);
}
setModal(null);
showToast("Job salvato");
};
const delJob = id => {
const job = jobs.find(j => j.id === id);
if ((job === null || job === void 0 ? void 0 : job.iecReportId) || (job === null || job === void 0 ? void 0 : job.funcReportId)) {
if (!confirm("Questo job è collegato a una verifica. Eliminandolo, la verifica resterà orfana. Procedere?"))
return;
}
setJobs(j => j.filter(x => x.id !== id));
showToast("Job eliminato", "#ef4444");
};
const saveTimeline = (jobId, data) => {
setJobs(js => js.map(j => j.id === jobId ? Object.assign(Object.assign({}, j), { timeline: data.timeline, photos: data.photos }) : j));
setModal(null);
showToast("Timeline salvata");
};
const saveCustomer = f => {
if (DEMO_MODE && !modal.data && customers.length >= DEMO_LIMITS.customers) {
alert("⚡ DEMO — Limite " + DEMO_LIMITS.customers + " clienti raggiunto.");
return;
}
if (modal.data) {
setCustomers(c => c.map(x => x.id === modal.data.id ? Object.assign(Object.assign({}, f), { id: modal.data.id }) : x));
}
else {
setCustomers(c => [...c, Object.assign(Object.assign({}, f), { id: newId("C", c) })]);
}
setModal(null);
showToast("Cliente salvato");
};
const delCustomer = id => {
if (assets.some(a => a.customerId === id)) {
alert("Non puoi eliminare: ci sono apparecchi associati.");
return;
}
setCustomers(c => c.filter(x => x.id !== id));
showToast("Eliminato", "#ef4444");
};
const saveInvoice = f => {
if (modal.data) {
setInvoices(i => i.map(x => x.id === modal.data.id ? Object.assign(Object.assign({}, f), { id: modal.data.id }) : x));
}
else {
setInvoices(i => [...i, Object.assign(Object.assign({}, f), { id: newId("I", i) })]);
}
setModal(null);
showToast("Fattura salvata");
};
const delInvoice = id => { setInvoices(i => i.filter(x => x.id !== id)); showToast("Eliminata", "#ef4444"); };
const markInvoicePaid = inv => {
setInvoices(is => is.map(i => i.id === inv.id ? Object.assign(Object.assign({}, i), { status: "pagata" }) : i));
showToast("Fattura pagata");
};
const saveOrder = f => {
var _a;
const isReceivedNow = f.status === "ricevuto" && ((_a = modal === null || modal === void 0 ? void 0 : modal.data) === null || _a === void 0 ? void 0 : _a.status) !== "ricevuto";
if (modal === null || modal === void 0 ? void 0 : modal.data) {
setOrders(o => o.map(x => x.id === modal.data.id ? Object.assign(Object.assign({}, f), { id: modal.data.id }) : x));
}
else {
setOrders(o => [...o, Object.assign(Object.assign({}, f), { id: newId("O", o) })]);
}
if (isReceivedNow) {
setParts(ps => ps.map(p => p.id === f.partId ? Object.assign(Object.assign({}, p), { qty: p.qty + f.qty }) : p));
showToast("Ordine ricevuto — stock +" + (f.qty) + " pz.");
}
else
showToast("Ordine salvato");
setModal(null);
};
const delOrder = id => { setOrders(o => o.filter(x => x.id !== id)); showToast("Eliminato", "#ef4444"); };
const quickReceive = o => {
setOrders(os => os.map(x => x.id === o.id ? Object.assign(Object.assign({}, x), { status: "ricevuto" }) : x));
setParts(ps => ps.map(p => p.id === o.partId ? Object.assign(Object.assign({}, p), { qty: p.qty + o.qty }) : p));
showToast("Ordine ricevuto — stock +" + (o.qty) + " pz.");
};
const saveIecReport = f => {
// f.id is set by the form (existing id when editing, new id when creating)
// Simply check if this id already exists in iecReports
const exists = iecReports.some(r => r.id === f.id);
if (exists) {
// EDIT — just update, no new job, no nextService change
setIecReports(rs => rs.map(r => r.id === f.id ? Object.assign({}, f) : r));
showToast("Verifica aggiornata");
setModal(null);
return;
}
// NEW — create job + update nextService
const asset = assets.find(a => a.id === f.assetId) || {};
const normLabel = f.norm === "61010" ? "IEC 61010-1" : "IEC 62353";
const ptLabel = f.norm !== "61010" ? (" — Tipo " + (f.patientType || "BF")) : "";
const esitoLabel = f.overallPass ? "CONFORME" : "NON CONFORME";
const newJobId = newId("J", jobs);
setJobs(js => [...js, {
id: newJobId, assetId: f.assetId,
customerId: f.customerId || asset.customerId || "",
type: "verifica", priority: "normale", status: "chiuso",
assignee: f.technician || "",
openDate: f.date || new Date().toISOString().slice(0, 10),
closeDate: f.date || new Date().toISOString().slice(0, 10),
description: "Verifica Sicurezza Elettrica " + normLabel + ptLabel + " — " + esitoLabel,
notes: (f.reportNumber ? "Rif. rapporto: " + f.reportNumber + " " : "") + (f.notes || ""),
parts: [], laborHours: 0, laborRate: 55, timeline: [], photos: [],
iecReportId: f.id,
}]);
const isExtraordinary = f.verifyType === "straordinaria";
const verDate = new Date(f.date || new Date());
const nextYear = new Date(verDate);
nextYear.setFullYear(nextYear.getFullYear() + 1);
const nextServiceDate = nextYear.toISOString().slice(0, 10);
if (!isExtraordinary) {
setAssets(as => as.map(a => a.id === f.assetId ? Object.assign(Object.assign({}, a), { lastService: f.date || new Date().toISOString().slice(0, 10), nextService: nextServiceDate }) : a));
showToast("Verifica salvata + Job " + newJobId + " · Prossima: " + nextServiceDate);
}
else {
setAssets(as => as.map(a => a.id === f.assetId ? Object.assign(Object.assign({}, a), { lastService: f.date || new Date().toISOString().slice(0, 10) }) : a));
showToast("Verifica straordinaria salvata + Job " + newJobId + " creato");
}
setIecReports(rs => [...rs, Object.assign(Object.assign({}, f), { jobId: newJobId })]);
setModal(null);
};
const delIecReport = id => {
const rep = iecReports.find(r => r.id === id);
if (rep === null || rep === void 0 ? void 0 : rep.jobId) {
// Also clear iecReportId from linked job
setJobs(js => js.map(j => j.id === rep.jobId ? Object.assign(Object.assign({}, j), { iecReportId: null }) : j));
}
setIecReports(rs => rs.filter(r => r.id !== id));
showToast("Verifica IEC eliminata", "#ef4444");
};
const saveFuncReport = f => {
const exists = funcReports.some(r => r.id === f.id);
if (exists) {
setFuncReports(rs => rs.map(r => r.id === f.id ? Object.assign({}, f) : r));
showToast("Verifica funzionale aggiornata");
setModal(null);
return;
}
const asset = assets.find(a => a.id === f.assetId) || {};
const tpl = FUNC_TEMPLATES[f.templateId] || FUNC_TEMPLATES["generico"];
const esitoLabel = f.overallPass ? "CONFORME" : "NON CONFORME";
const jid = newId("J", jobs);
setJobs(js => [...js, {
id: jid, assetId: f.assetId,
customerId: f.customerId || asset.customerId || "",
type: "verifica", priority: "normale", status: "chiuso",
assignee: f.technician || "",
openDate: f.date || new Date().toISOString().slice(0, 10),
closeDate: f.date || new Date().toISOString().slice(0, 10),
description: "Verifica Funzionale — " + tpl.label + " — " + esitoLabel,
notes: (f.reportNumber ? "Rif.: " + f.reportNumber + " " : "") + (f.notes || ""),
parts: [], laborHours: 0, laborRate: 55, timeline: [], photos: [],
funcReportId: f.id,
}]);
setFuncReports(rs => [...rs, Object.assign(Object.assign({}, f), { jobId: jid })]);
showToast("Verifica funzionale salvata + Job " + jid + " creato");
setModal(null);
};
const delFuncReport = id => {
const rep = funcReports.find(r => r.id === id);
if (rep === null || rep === void 0 ? void 0 : rep.jobId) {
setJobs(js => js.map(j => j.id === rep.jobId ? Object.assign(Object.assign({}, j), { funcReportId: null }) : j));
}
setFuncReports(rs => rs.filter(r => r.id !== id));
showToast("Verifica funzionale eliminata", "#ef4444");
};
const handleWithdraw = data => {
setParts(ps => ps.map(p => { const r = data.items.find(x => x.partId === p.id); return r ? Object.assign(Object.assign({}, p), { qty: p.qty - r.qty }) : p; }));
setWDs(w => { const id = newId("W", w); return [Object.assign(Object.assign({}, data), { id }), ...w]; });
setModal(null);
showToast("Scarico — €" + (data.total.toFixed(2)));
};
const handleImport = data => {
var _a, _b;
// Show confirmation with stats before overwriting
const stats = ((_a = data._meta) === null || _a === void 0 ? void 0 : _a.stats) || {
assets: (data.assets || []).length,
jobs: (data.jobs || []).length,
parts: (data.parts || []).length,
customers: (data.customers || []).length,
iecReports: (data.iecReports || []).length,
funcReports: (data.funcReports || []).length,
instruments: (data.instruments || []).length,
procedures: (data.procedures || []).length,
quotes: (data.quotes || []).length,
};
const exportDate = ((_b = data._meta) === null || _b === void 0 ? void 0 : _b.exportedAt) ? new Date(data._meta.exportedAt).toLocaleString('it-IT') : "data sconosciuta";
const msg = "⚠ ATTENZIONE: SOVRASCRITTURA TOTALE\n\n" +
"Backup creato il: " + exportDate + "\n\n" +
"Contenuto del backup:\n" +
"• " + stats.assets + " apparecchi\n" +
"• " + stats.jobs + " job/interventi\n" +
"• " + stats.parts + " parti magazzino\n" +
"• " + stats.customers + " clienti\n" +
"• " + stats.iecReports + " verifiche sicurezza elettrica\n" +
"• " + stats.funcReports + " verifiche funzionali\n" +
"• " + (stats.instruments || 0) + " strumenti di misura\n" +
"• " + (stats.procedures || 0) + " procedure tecniche\n\n" +
"I tuoi dati attuali verranno SOSTITUITI completamente.\n" +
"Consigliato: esporta prima un backup dei dati attuali.\n\n" +
"Procedere?";
if (!confirm(msg))
return;
setAssets(data.assets || []);
setParts(data.parts || []);
setJobs(data.jobs || []);
setOrders(data.orders || []);
setWDs(data.withdrawals || []);
setCustomers(data.customers || []);
setInvoices(data.invoices || []);
setIecReports(data.iecReports || []);
setFuncReports(data.funcReports || []);
setInstruments(data.instruments || []);
setProcedures(data.procedures || []);
setQuotes(data.quotes || []);
if (data.company)
setCompany(data.company);
setModal(null);
showToast("✓ Backup importato — " + stats.assets + " apparecchi, " + stats.jobs + " job ripristinati");
};
// Merge: unisce i dati del backup con quelli esistenti senza sovrascrivere
const handleMerge = data => {
var _a;
// Pre-compute what will be merged (new records only)
const countNew = (existing, incoming) => {
if (!incoming || !incoming.length)
return 0;
const existingIds = new Set(existing.map(x => x.id));
return incoming.filter(x => !existingIds.has(x.id)).length;
};
const newCounts = {
assets: countNew(assets, data.assets),
jobs: countNew(jobs, data.jobs),
parts: countNew(parts, data.parts),
customers: countNew(customers, data.customers),
iecReports: countNew(iecReports, data.iecReports),
funcReports: countNew(funcReports, data.funcReports),
invoices: countNew(invoices, data.invoices),
orders: countNew(orders, data.orders),
instruments: countNew(instruments, data.instruments),
procedures: countNew(procedures, data.procedures),
};
const totalNew = Object.values(newCounts).reduce((a, b) => a + b, 0);
if (totalNew === 0) {
alert("Nessun nuovo record da unire — tutti gli ID esistono già nei tuoi dati.");
return;
}
const exportDate = ((_a = data._meta) === null || _a === void 0 ? void 0 : _a.exportedAt) ? new Date(data._meta.exportedAt).toLocaleString('it-IT') : "data sconosciuta";
const msg = "🔀 UNIONE BACKUP (aggiunta record)\n\n" +
"Backup creato il: " + exportDate + "\n\n" +
"Verranno AGGIUNTI " + totalNew + " nuovi record:\n" +
(newCounts.assets ? "• " + newCounts.assets + " nuovi apparecchi\n" : "") +
(newCounts.jobs ? "• " + newCounts.jobs + " nuovi job\n" : "") +
(newCounts.parts ? "• " + newCounts.parts + " nuove parti\n" : "") +
(newCounts.customers ? "• " + newCounts.customers + " nuovi clienti\n" : "") +
(newCounts.iecReports ? "• " + newCounts.iecReports + " nuove verifiche sicurezza\n" : "") +
(newCounts.funcReports ? "• " + newCounts.funcReports + " nuove verifiche funzionali\n" : "") +
(newCounts.invoices ? "• " + newCounts.invoices + " nuove fatture\n" : "") +
(newCounts.orders ? "• " + newCounts.orders + " nuovi ordini\n" : "") +
(newCounts.instruments ? "• " + newCounts.instruments + " nuovi strumenti\n" : "") +
(newCounts.procedures ? "• " + newCounts.procedures + " nuove procedure\n" : "") +
"\nI tuoi dati attuali NON verranno modificati.\n" +
"I record con ID già esistente verranno ignorati.\n\n" +
"Procedere?";
if (!confirm(msg))
return;
const mergeArr = (existing, incoming, idField = 'id') => {
if (!incoming || !incoming.length)
return existing;
const existingIds = new Set(existing.map(x => x[idField]));
const newItems = incoming.filter(x => !existingIds.has(x[idField]));
return [...existing, ...newItems];
};
setAssets(prev => mergeArr(prev, data.assets));
setParts(prev => mergeArr(prev, data.parts));
setJobs(prev => mergeArr(prev, data.jobs));
setOrders(prev => mergeArr(prev, data.orders));
setWDs(prev => mergeArr(prev, data.withdrawals));
setCustomers(prev => mergeArr(prev, data.customers));
setInvoices(prev => mergeArr(prev, data.invoices));
setIecReports(prev => mergeArr(prev, data.iecReports));
setFuncReports(prev => mergeArr(prev, data.funcReports));
setInstruments(prev => mergeArr(prev, data.instruments));
setProcedures(prev => mergeArr(prev, data.procedures));
setQuotes(prev => mergeArr(prev, data.quotes));
setModal(null);
showToast("✓ Unione completata — " + totalNew + " nuovi record aggiunti");
};
const handleReset = () => {
if (true) {
if (true) {
setAssets([]);
setParts([]);
setJobs([]);
setOrders([]);
setWDs([]);
setCustomers([]);
setInvoices([]);
setModal(null);
showToast("Sistema azzerato", "#ef4444");
}
}
};
// CSV exports
const exportAssets = () => downloadXLSX("medtrace_apparecchi.xlsx", assets.map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "" })); }), [{ key: "id", label: "ID" }, { key: "name", label: "Nome" }, { key: "brand", label: "Marca" }, { key: "model", label: "Modello" }, { key: "serial", label: "N.Serie" }, { key: "location", label: "Ubicazione" }, { key: "cliente", label: "Cliente" }, { key: "status", label: "Stato" }, { key: "lastService", label: "Ultimo Serv." }, { key: "nextService", label: "Prossimo Serv." }, { key: "iecNorm", label: "Norma IEC" }, { key: "notes", label: "Note" }]);
const exportParts = () => downloadXLSX("medtrace_parti.xlsx", parts.map(p => (Object.assign(Object.assign({}, p), { compatibile: (p.compatible || []).map(id => { var _a; return ((_a = assets.find(a => a.id === id)) === null || _a === void 0 ? void 0 : _a.name) || id; }).join(", ") }))), [{ key: "id", label: "ID" }, { key: "code", label: "Codice" }, { key: "name", label: "Nome" }, { key: "brand", label: "Marca" }, { key: "qty", label: "Q.tà" }, { key: "minQty", label: "Q.Min" }, { key: "unitPrice", label: "Costo" }, { key: "sellPrice", label: "Vendita" }, { key: "location", label: "Ubicazione" }, { key: "compatibile", label: "Compatibile con" }, { key: "notes", label: "Note" }]);
const exportJobs = () => downloadXLSX("medtrace_job.xlsx", jobs.map(j => {
const a = assets.find(x => x.id === j.assetId) || {};
const c = customers.find(x => x.id === (j.customerId || a.customerId)) || {};
const cp = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
return Object.assign(Object.assign({}, j), { apparecchio: a.name || j.assetId, cliente: c.name || "", partiUsate: j.parts.map(p => { const pt = parts.find(x => x.id === p.partId); return ((pt === null || pt === void 0 ? void 0 : pt.name) || p.partId) + " x" + p.qty; }).join(", "), costoParti: cp.toFixed(2), costoManodopera: (j.laborHours * j.laborRate).toFixed(2), totale: (cp + j.laborHours * j.laborRate).toFixed(2), parts: undefined, timeline: undefined, photos: undefined });
}), [{ key: "id", label: "ID" }, { key: "apparecchio", label: "Apparecchio" }, { key: "cliente", label: "Cliente" }, { key: "type", label: "Tipo" }, { key: "priority", label: "Priorità" }, { key: "status", label: "Stato" }, { key: "assignee", label: "Tecnico" }, { key: "openDate", label: "Apertura" }, { key: "closeDate", label: "Chiusura" }, { key: "description", label: "Descrizione" }, { key: "partiUsate", label: "Parti" }, { key: "laborHours", label: "Ore" }, { key: "laborRate", label: "Tariffa €/h" }, { key: "costoParti", label: "Costo Parti" }, { key: "costoManodopera", label: "Manodopera" }, { key: "totale", label: "Totale" }]);
const exportOrders = () => downloadXLSX("medtrace_ordini.xlsx", orders.map(o => { var _a; return (Object.assign(Object.assign({}, o), { nomeParte: ((_a = parts.find(p => p.id === o.partId)) === null || _a === void 0 ? void 0 : _a.name) || o.partId, totale: (o.qty * o.unitPrice).toFixed(2) })); }), [{ key: "id", label: "ID" }, { key: "supplier", label: "Fornitore" }, { key: "nomeParte", label: "Parte" }, { key: "qty", label: "Q.tà" }, { key: "unitPrice", label: "Prezzo Unit." }, { key: "totale", label: "Totale" }, { key: "status", label: "Stato" }, { key: "orderDate", label: "Data Ordine" }, { key: "expectedDate", label: "Consegna Prev." }, { key: "notes", label: "Note" }]);
const exportInvoices = () => downloadXLSX("medtrace_fatture.xlsx", invoices.map(i => { var _a; const sub = i.items.reduce((s, it) => s + it.qty * it.unitPrice, 0); const vat = i.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0); return Object.assign(Object.assign({}, i), { cliente: ((_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "", imponibile: sub.toFixed(2), iva: vat.toFixed(2), totale: (sub + vat).toFixed(2), items: undefined, jobIds: undefined }); }), [{ key: "number", label: "N.Fattura" }, { key: "cliente", label: "Cliente" }, { key: "date", label: "Data" }, { key: "dueDate", label: "Scadenza" }, { key: "status", label: "Stato" }, { key: "imponibile", label: "Imponibile" }, { key: "iva", label: "IVA" }, { key: "totale", label: "Totale" }, { key: "paymentTerms", label: "Pagamento" }, { key: "notes", label: "Note" }]);
const exportIecReports = () => downloadXLSX("medtrace_verifiche_IEC.csv", iecReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; return Object.assign(Object.assign({}, r), { apparecchio: a.name || r.assetId || "", nSerie: a.serial || "", cliente: c.name || "", misure: ((_a = r.measures) === null || _a === void 0 ? void 0 : _a.map(m => m.name + ": " + m.value + m.unit + " (lim." + m.limit + ")").join("; ")) || "", measures: undefined, visual: undefined }); }), [{ key: "reportNumber", label: "N.Rapporto" }, { key: "date", label: "Data" }, { key: "norm", label: "Norma" }, { key: "apparecchio", label: "Apparecchio" }, { key: "nSerie", label: "N.Serie" }, { key: "cliente", label: "Cliente" }, { key: "technician", label: "Tecnico" }, { key: "instrument", label: "Strumento" }, { key: "equipClass", label: "Classe" }, { key: "patientType", label: "Tipo Paziente" }, { key: "verifyType", label: "Tipo Verifica" }, { key: "overallPass", label: "Esito" }, { key: "misure", label: "Misure" }, { key: "notes", label: "Note" }]);
const NAV_GROUPS = [
{
id: "g_dash", label: null,
items: [
{ id: "dashboard", label: "Dashboard", icon: "◈" },
]
},
{
id: "g_maint", label: "MANUTENZIONE",
groupIcon: React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#2DD4BF", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" })),
items: [
{ id: "jobs", label: "Job / Interventi", icon: "›", badge: stats.urgentJobs > 0 ? stats.urgentJobs : null, bColor: "#ef4444" },
{ id: "iec", label: "Sicurezza Elettrica", icon: "›" },
{ id: "func", label: "Verif. Funzionale", icon: "›" },
{ id: "agenda", label: "Agenda & Scheduling", icon: "›", badge: upcomingMaintenance.filter(a => a.daysToService <= 7).length || null, bColor: "#f59e0b" },
{ id: "instruments", label: "Strumenti Misura", icon: "›", badge: instruments.filter(i => { const exp = i.calExpiry && new Date(i.calExpiry); return exp && Math.round((exp - new Date()) / 86400000) <= 60; }).length || null, bColor: "#f59e0b" },
{ id: "procedures", label: "Procedure", icon: "›" },
]
},
{
id: "g_assets", label: "PARCO MACCHINE",
groupIcon: React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#2DD4BF", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16M3 21h18M9 7h6M9 11h6M9 15h6" })),
items: [
{ id: "assets", label: "Apparecchi", icon: "›", badge: stats.outOfService > 0 ? stats.outOfService : null, bColor: "#ef4444" },
{ id: "customers", label: "Clienti", icon: "›" },
]
},
{
id: "g_stock", label: "MAGAZZINO",
groupIcon: React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#2DD4BF", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
React.createElement("path", { d: "m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" })),
items: [
{ id: "parts", label: "Magazzino", icon: "›", badge: (stats.lowStock > 0 || stats.pendingOrders > 0) ? (stats.lowStock + stats.pendingOrders) : null, bColor: "#f59e0b" },
]
},
{
id: "g_admin", label: "AMMINISTRAZIONE",
groupIcon: React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#2DD4BF", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("line", { x1: "12", y1: "1", x2: "12", y2: "23" }),
React.createElement("path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })),
items: [
{ id: "invoices", label: "Preventivi", icon: "›", badge: stats.pendingInvoices > 0 ? stats.pendingInvoices : null, bColor: "#2DD4BF" },
]
},
{
id: "g_sys", label: "SISTEMA",
groupIcon: React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#2DD4BF", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("circle", { cx: "12", cy: "12", r: "3" }),
React.createElement("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })),
items: [
{ id: "help", label: "Guida / Help", icon: "›" },
{ id: "legal", label: "Legale & Privacy", icon: "›" },
]
},
];
const NAV = NAV_GROUPS.flatMap(g => g.items);
const filteredJobs = React.useMemo(() => {
return jobs.filter(j => {
if (filterStatus && j.status !== filterStatus)
return false;
if (filterPriority && j.priority !== filterPriority)
return false;
if (filterCustomer) {
const asset = assets.find(a => a.id === j.assetId);
if ((j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId)) !== filterCustomer)
return false;
}
if (search) {
const q = search.toLowerCase();
return [j.id, j.assignee, j.description].join(" ").toLowerCase().includes(q);
}
return true;
});
}, [jobs, assets, search, filterStatus, filterPriority, filterCustomer]);
const filteredAssets = React.useMemo(() => assets.filter(a => !search || [a.name, a.brand, a.model, a.serial, a.location].join(" ").toLowerCase().includes(search.toLowerCase())), [assets, search]);
const filteredParts = React.useMemo(() => parts.filter(p => !search || [p.code, p.name, p.brand, p.location].join(" ").toLowerCase().includes(search.toLowerCase())), [parts, search]);
const filteredOrders = React.useMemo(() => orders.filter(o => !search || [o.id, o.supplier, o.notes].join(" ").toLowerCase().includes(search.toLowerCase())), [orders, search]);
const filteredCustomers = React.useMemo(() => customers.filter(c => !search || [c.name, c.vat, c.email, c.contact].join(" ").toLowerCase().includes(search.toLowerCase())), [customers, search]);
const filteredInvoices = React.useMemo(() => invoices.filter(i => {
if (!search)
return true;
const customer = customers.find(c => c.id === i.customerId);
return [i.number, customer === null || customer === void 0 ? void 0 : customer.name, i.status].join(" ").toLowerCase().includes(search.toLowerCase());
}), [invoices, customers, search]);
const sideW = 200;
const isEmpty = assets.length === 0 && parts.length === 0 && jobs.length === 0 && customers.length === 0;
if (portalMode) {
return (React.createElement(PortalClient, { assets: assets, jobs: jobs, iecReports: iecReports, funcReports: funcReports, instruments: instruments, customers: customers, company: company, onExit: () => setPortalMode(false) }));
}
return (React.createElement("div", { style: { minHeight: "100vh", background: "#0D0D12" } },
typeof DEMO_MODE !== "undefined" && DEMO_MODE && (React.createElement("div", { style: { background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#000", padding: "7px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, fontWeight: 700, flexWrap: "wrap", gap: 6 } },
React.createElement("span", null,
"\u26A1 VERSIONE DEMO \u2014 Max ",
DEMO_LIMITS.assets,
" apparecchi \u00B7 ",
DEMO_LIMITS.jobs,
" job \u00B7 ",
DEMO_LIMITS.customers,
" clienti \u00B7 No export \u00B7 No PDF"),
React.createElement("span", { style: { fontWeight: 400, opacity: .8 } }, "Versione completa: contatta il referente MedTrace"))),
toast && React.createElement("div", { style: { position: "fixed", top: 16, right: 16, background: toast.color + "22", border: "1px solid " + (toast.color) + "55", color: toast.color, borderRadius: 10, padding: "11px 18px", zIndex: 2000, fontSize: 13, fontWeight: 700, maxWidth: "90vw" } }, toast.msg),
isMobile && navOpen && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000a", zIndex: 800 }, onClick: () => setNavOpen(false) },
React.createElement("div", { style: { position: "absolute", left: 0, top: 0, bottom: 0, width: 240, background: "#0D0D12", borderRight: "1px solid #1a2030", padding: "20px 0", display: "flex", flexDirection: "column", overflowY: "auto" }, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { padding: "0 18px 18px", borderBottom: "1px solid #1a2030", marginBottom: 8 } },
React.createElement("div", { style: { marginBottom: 4 } },
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", maxWidth: 200, height: 36 } },
React.createElement("g", { fill: "none", stroke: "#2DD4BF", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2DD4BF", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "20", fontWeight: "800", fill: "#FFFFFF", letterSpacing: "-0.5" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#5A5A70", letterSpacing: "1.5" }, "MEDICAL"))),
React.createElement("div", { style: { fontSize: 9, color: "#5A5A70", letterSpacing: 1, textTransform: "uppercase" } }, company.subtitle)),
NAV_GROUPS.map(group => (React.createElement("div", { key: group.id },
group.label && (React.createElement("div", { style: { padding: "14px 18px 6px", fontSize: 9, color: "#5A5A70", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 6, display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #1a2030" } },
group.groupIcon,
React.createElement("span", null, group.label))),
group.items.map(n => (React.createElement("button", { key: n.id, onClick: () => { setTab(n.id); setSearch(""); setNavOpen(false); }, style: {
width: "100%", textAlign: "left", background: tab === n.id ? "#2DD4BF18" : "transparent",
borderLeft: "3px solid " + (tab === n.id ? "#2DD4BF" : "transparent"), border: "none", borderRight: "none",
color: tab === n.id ? "#F0F0F5" : "#6A6A80", padding: "9px 18px 9px 22px", fontSize: 12, cursor: "pointer",
display: "flex", alignItems: "center", gap: 9, transition: "all .15s"
} },
React.createElement("span", { style: { fontSize: 14 } }, n.icon),
React.createElement("span", { style: { flex: 1 } }, n.label),
n.badge && React.createElement("span", { style: { background: n.bColor, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700 } }, n.badge))))))),
React.createElement("div", { style: { marginTop: "auto", padding: "12px 18px", borderTop: "1px solid #1A1A24" } },
React.createElement("button", { onClick: () => { setModal({ type: "settings" }); setNavOpen(false); }, style: { background: "none", border: "none", color: "#64748b", fontSize: 12, cursor: "pointer", padding: 0 } }, "\u2699 Impostazioni"))))),
!isMobile && (React.createElement("div", { style: { position: "fixed", left: 0, top: 0, bottom: 0, width: sideW, background: "#06090f", borderRight: "1px solid #1a2030", zIndex: 100, display: "flex", flexDirection: "column" } },
React.createElement("div", { style: { padding: "22px 18px 18px", borderBottom: "1px solid #1a2030" } },
React.createElement("div", { style: { fontSize: 10, color: "#2DD4BF", letterSpacing: 3, textTransform: "uppercase", marginBottom: 3 } },
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", maxWidth: 200, height: 36 } },
React.createElement("g", { fill: "none", stroke: "#2DD4BF", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2DD4BF", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "20", fontWeight: "800", fill: "#FFFFFF", letterSpacing: "-0.5" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#5A5A70", letterSpacing: "1.5" }, "MEDICAL"))),
React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: "#5A5A70" } }, company.subtitle)),
React.createElement("nav", { style: { flex: 1, padding: "12px 0", overflowY: "auto" } }, NAV_GROUPS.map(group => (React.createElement("div", { key: group.id },
group.label && (React.createElement("div", { style: { padding: "8px 18px 2px", fontSize: 9, color: "#5A5A70", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 2 } }, group.label)),
group.items.map(n => (React.createElement("button", { key: n.id, onClick: () => { setTab(n.id); setSearch(""); }, style: {
width: "100%", textAlign: "left", background: tab === n.id ? "#2DD4BF18" : "transparent",
borderLeft: "3px solid " + (tab === n.id ? "#2DD4BF" : "transparent"), border: "none", borderRight: "none",
color: tab === n.id ? "#F0F0F5" : "#6A6A80", padding: "8px 18px 8px 22px", fontSize: 12, cursor: "pointer",
display: "flex", alignItems: "center", gap: 9
} },
React.createElement("span", { style: { fontSize: 13 } }, n.icon),
React.createElement("span", { style: { flex: 1 } }, n.label),
n.badge && React.createElement("span", { style: { background: n.bColor, color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 } }, n.badge)))))))),
React.createElement("div", { style: { padding: "12px 18px", borderTop: "1px solid #1a2030", display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 10, color: "#1e293b" } }, "v5.0"),
React.createElement("button", { onClick: () => setModal({ type: "settings" }), style: { background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer" } }, "\u2699")))),
React.createElement("div", { style: { marginLeft: isMobile ? 0 : sideW, padding: isMobile ? "16px 14px" : "26px 28px", minHeight: "100vh" } },
isMobile && (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, background: "#06090f", borderRadius: 12, padding: "10px 14px", border: "1px solid #1a2030" } },
React.createElement("button", { onClick: () => setNavOpen(true), style: { background: "none", border: "none", color: "#e2e8f0", fontSize: 20, cursor: "pointer" } }, "\u2261"),
React.createElement("div", null,
React.createElement("span", { style: { fontSize: 10, color: "#2DD4BF", letterSpacing: 2, textTransform: "uppercase" } },
company.name,
" \u00B7 "),
React.createElement("span", { style: { fontSize: 13, fontWeight: 700 } }, (_a = NAV.find(n => n.id === tab)) === null || _a === void 0 ? void 0 : _a.label)),
React.createElement("button", { onClick: () => setModal({ type: "settings" }), style: { background: "none", border: "none", color: "#64748b", fontSize: 18, cursor: "pointer" } }, "\u2699"))),
tab === "dashboard" && (React.createElement("div", null,
!isMobile && React.createElement("h1", { style: { margin: "0 0 20px", fontSize: 20, fontWeight: 900 } }, "Dashboard"),
isEmpty ? (React.createElement(EmptyState, { icon: "", title: "Benvenuto in " + (company.name), message: "Inizia registrando il primo cliente o apparecchio. Tutti i dati restano sul tuo dispositivo.", action: React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } },
React.createElement(Btn, { onClick: () => { setTab("customers"); setModal({ type: "customer", data: null }); } }, "+ Primo cliente"),
React.createElement(Btn, { variant: "ghost", onClick: () => { setTab("assets"); setModal({ type: "asset", data: null }); } }, "+ Primo apparecchio")) })) : (React.createElement(React.Fragment, null,
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } },
React.createElement(Pill, { label: "Apparecchi", value: stats.totalAssets, onClick: () => setTab("assets") }),
React.createElement(Pill, { label: "Operativi", value: stats.operative, color: "#22c55e", onClick: () => setTab("assets") }),
React.createElement(Pill, { label: "Manut.", value: stats.maintenance, color: "#f59e0b", onClick: () => setTab("assets") }),
React.createElement(Pill, { label: "Fuori serv.", value: stats.outOfService, color: "#ef4444", onClick: () => setTab("assets") })),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } },
React.createElement(Pill, { label: "Job aperti", value: stats.openJobs, color: "#2DD4BF", onClick: () => setTab("jobs") }),
React.createElement(Pill, { label: "Urgenti", value: stats.urgentJobs, color: "#ef4444", onClick: () => setTab("jobs") }),
React.createElement(Pill, { label: "Fatture in sospeso", value: stats.pendingInvoices, color: "#2DD4BF", onClick: () => setTab('invoices') }),
React.createElement(Pill, { label: "Clienti", value: stats.customers, color: "#a855f7", onClick: () => setTab("customers") })),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } },
React.createElement(Pill, { label: "Ricavi anno", value: "€" + (financials.revenue / 1000).toFixed(1) + "k", color: "#22c55e", sub: String(filterYear), onClick: () => setTab("finance") }),
React.createElement(Pill, { label: "Margine lordo", value: "€" + (financials.margin / 1000).toFixed(1) + "k", color: "#22c55e", onClick: () => setTab("finance") }),
React.createElement(Pill, { label: "Verifiche Sicurezza Elettrica", value: iecReports.length, color: "#9955ff", onClick: () => setTab("iec") }),
React.createElement(Pill, { label: "Stock basso", value: stats.lowStock, color: "#f59e0b", onClick: () => setTab('parts') }),
React.createElement(Pill, { label: "Strumenti scaduti/in scad.", value: instruments.filter(i => { const exp = i.calExpiry && new Date(i.calExpiry); return exp && Math.round((exp - new Date()) / 86400000) <= 60; }).length, color: "#f59e0b", onClick: () => setTab("instruments") })),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 } },
React.createElement(Pill, { label: "% Job chiusi", value: jobs.length > 0 ? Math.round(jobs.filter(j => j.status === "chiuso").length / jobs.length * 100) + "%" : "—", color: "#22c55e", sub: "completion rate", onClick: () => setTab("jobs") }),
React.createElement(Pill, { label: "Fuori servizio", value: stats.outOfService, color: "#ef4444", sub: "apparecchi", onClick: () => setTab("assets") }),
React.createElement(Pill, { label: "Garanzie in scad.", value: assets.filter(a => a.warrantyExpiry && Math.round((new Date(a.warrantyExpiry) - new Date()) / 86400000) < 90 && Math.round((new Date(a.warrantyExpiry) - new Date()) / 86400000) >= 0).length, color: "#f59e0b", sub: "entro 90gg", onClick: () => setTab("assets") }),
React.createElement(Pill, { label: "In pianificaz.", value: scheduleRows.filter(r => r.year === new Date().getFullYear()).length, color: "#2DD4BF", sub: "anno " + new Date().getFullYear() })),
(stats.urgentJobs > 0 || stats.lowStock > 0 || upcomingMaintenance.length > 0) && (React.createElement("div", { style: { marginBottom: 22 } },
React.createElement("div", { style: { fontSize: 10, color: "#334155", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 700 } }, "\u26A0 Avvisi"),
jobs.filter(j => j.priority === "urgente" && j.status !== "chiuso").map(j => {
const a = assets.find(x => x.id === j.assetId);
return (React.createElement("div", { key: j.id, style: { background: "#1E1E28", borderLeft: "3px solid #ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("div", null,
React.createElement("span", { style: { color: "#ef4444", fontSize: 12, fontWeight: 700 } },
j.id,
" URGENTE"),
React.createElement("div", { style: { color: "#94a3b8", fontSize: 12, marginTop: 2 } }, a === null || a === void 0 ? void 0 :
a.name,
" \u2014 ",
j.description.slice(0, 50),
"\u2026")),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => setTab("jobs") }, "\u2192")));
}),
upcomingMaintenance.slice(0, 3).map(a => (React.createElement("div", { key: a.id, style: { background: "#1E1E28", borderLeft: "3px solid " + (a.daysToService < 0 ? "#ef4444" : a.daysToService < 7 ? "#f59e0b" : "#2DD4BF"), borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("div", null,
React.createElement("span", { style: { color: a.daysToService < 0 ? "#ef4444" : "#f59e0b", fontSize: 12, fontWeight: 700 } }, a.daysToService < 0 ? "SCADUTA da " + (Math.abs(a.daysToService)) + "gg" : a.daysToService === 0 ? "OGGI" : "tra " + (a.daysToService) + "gg"),
React.createElement("div", { style: { color: "#94a3b8", fontSize: 12, marginTop: 2 } },
a.name,
" \u2014 manut. il ",
a.nextService)),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => setTab("agenda") }, "\u2192")))),
parts.filter(p => p.qty <= p.minQty).slice(0, 3).map(p => (React.createElement("div", { key: p.id, style: { background: "#1E1E28", borderLeft: "3px solid #f59e0b", borderRadius: 8, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 } },
React.createElement("div", null,
React.createElement("span", { style: { color: "#f59e0b", fontSize: 12, fontWeight: 700 } }, "STOCK BASSO"),
React.createElement("div", { style: { color: "#94a3b8", fontSize: 12, marginTop: 2 } },
p.name,
" \u2014 ",
p.qty,
" pz. (min ",
p.minQty,
")")),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => setTab('parts') }, "\u2192")))))))))),
tab === "assets" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Apparecchi Medicali"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
assets.length,
" totali \u00B7 ",
assets.filter(a => a.status === "fuori servizio").length,
" fuori servizio")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportAssets }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "asset", data: null }) }, "+ Nuovo"))),
React.createElement("div", { style: { fontSize: 11, color: "#475569", marginBottom: 8, fontStyle: "italic" } }, "\u2192 Doppio click su una riga per aprire la scheda dettaglio dell'apparecchio"),
assets.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessun apparecchio"),
React.createElement(Btn, { onClick: () => setModal({ type: "asset", data: null }) }, "Nuovo apparecchio"))) : (React.createElement(ExcelTable, { defaultSort: "name", onRowClick: row => setModal({ type: "assetDetail", data: assets.find(a => a.id === row.id) }), rowBg: row => row.status === "fuori servizio" ? "#ef333308" : row.status === "in manutenzione" ? "#f59e0b08" : "", cols: [
{ key: "id", label: "ID", render: v => React.createElement("span", { style: { color: "#64748b", fontFamily: "monospace", fontSize: 11 } }, v) },
{ key: "name", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "brand", label: "Marca" },
{ key: "model", label: "Modello" },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "location", label: "Ubicazione", opts: [...new Set(assets.map(a => a.location).filter(Boolean))] },
{ key: "cliente", label: "Cliente", opts: [...new Set(assets.map(a => { var _a; return ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "status", label: "Stato", opts: ["operativo", "in manutenzione", "fuori servizio"],
render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "#64748b" }) },
{ key: "nextService", label: "Prossimo Serv.", render: (v) => {
const d = v ? Math.round((new Date(v) - new Date()) / 86400000) : null;
return React.createElement(AlertChip, { days: d });
} },
{ key: "riskClass", label: "Classe R.", render: v => v ? React.createElement("span", { style: { fontWeight: 700, color: v === "C" ? "#ef4444" : v === "B" ? "#f59e0b" : "#22c55e" } }, "Cl." + v) : React.createElement("span", { style: { color: "#475569" } }, "\u2014") },
{ key: "warrantyExpiry", label: "Scad. Garanzia", render: (v) => {
if (!v)
return React.createElement("span", { style: { color: "#475569" } }, "\u2014");
const d = Math.round((new Date(v) - new Date()) / 86400000);
return React.createElement("span", { style: { color: d < 0 ? "#ef4444" : d < 90 ? "#f59e0b" : "#22c55e", fontFamily: "monospace", fontSize: 11 } }, v);
} },
{ key: "iecNorm", label: "Norma IEC", render: v => React.createElement("span", { style: { fontSize: 10, color: "#64748b" } }, v || "—") },
], rows: assets.map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "" })); }), onEdit: row => setModal({ type: "asset", data: assets.find(a => a.id === row.id) }), onDelete: id => delAsset(id), actions: row => (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => setModal({ type: "assetDetail", data: assets.find(a => a.id === row.id) }), title: "Scheda dettaglio", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700 } }, "SCHEDA"),
React.createElement("button", { onClick: () => setModal({ type: "iec", assetId: row.id, data: null }), title: "Verifica Sicurezza Elettrica", style: { background: "#202028", border: "1px solid #5EEAD444", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700 } }, "SIC.EL."),
React.createElement("button", { onClick: () => setModal({ type: "func", assetId: row.id, data: null }), title: "Verifica funzionale", style: { background: "#202028", border: "1px solid #a855f744", borderRadius: 5, color: "#a855f7", padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700 } }, "FUNZ."))) })))),
tab === "jobs" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Job / Interventi"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
jobs.filter(j => j.status !== "chiuso").length,
" aperti \u00B7 ",
jobs.length,
" totali")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportJobs }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "job", data: null }) }, "+ Nuovo"))),
jobs.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessun job"),
React.createElement("div", { style: { fontSize: 12, color: "#475569", marginBottom: 18 } }, assets.length === 0 ? "Prima registra un apparecchio." : "Apri il primo job."),
React.createElement(Btn, { onClick: () => setModal({ type: "job", data: null }) }, "Nuovo job"))) : (React.createElement(ExcelTable, { defaultSort: "openDate", rowBg: row => row.priority === "urgente" && row.status !== "chiuso" ? "#ef333308" : row.priority === "alta" && row.status !== "chiuso" ? "#f9730008" : "", cols: [
{ key: "id", label: "ID", render: v => React.createElement("span", { style: { color: "#64748b", fontFamily: "monospace", fontSize: 11 } }, v) },
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "cliente", label: "Cliente", opts: [...new Set(jobs.map(j => { var _a; const a = assets.find(x => x.id === j.assetId); return ((_a = customers.find(c => c.id === (j.customerId || (a === null || a === void 0 ? void 0 : a.customerId)))) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "type", label: "Tipo", opts: ["correttiva", "preventiva", "verifica", "calibrazione"] },
{ key: "priority", label: "Priorità", opts: ["urgente", "alta", "normale", "bassa"],
render: v => React.createElement(Badge, { text: v, color: PRI_COLOR[v] || "#64748b" }) },
{ key: "status", label: "Stato", opts: ["aperto", "in corso", "chiuso"],
render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "#64748b" }) },
{ key: "assignee", label: "Tecnico" },
{ key: "openDate", label: "Apertura" },
{ key: "closeDate", label: "Chiusura", render: v => v || "—" },
{ key: "totale", label: "Costo", render: v => React.createElement("span", { style: { color: "#a855f7", fontWeight: 700, fontFamily: "monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(0)) },
{ key: "steps", label: "Timeline", render: (v, row) => React.createElement("span", { style: { color: "#64748b", fontSize: 11, display: "flex", gap: 4 } },
row.hasIec && React.createElement("span", { title: "Verifica Sicurezza Elettrica collegata" }, "\u26A1"),
v > 0 && React.createElement("span", null,
"\u00B7",
v)) },
], rows: jobs.map(j => {
var _a;
const a = assets.find(x => x.id === j.assetId) || {};
const c = customers.find(x => x.id === (j.customerId || a.customerId)) || {};
const tot = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0) + j.laborHours * j.laborRate;
return Object.assign(Object.assign({}, j), { apparecchio: a.name || j.assetId, cliente: c.name || "", totale: tot.toFixed(2), steps: ((_a = j.timeline) === null || _a === void 0 ? void 0 : _a.length) || 0, hasIec: !!j.iecReportId });
}), onEdit: row => setModal({ type: "job", data: jobs.find(j => j.id === row.id) }), onDelete: id => delJob(id), actions: row => (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => { var _a; const j = jobs.find(x => x.id === row.id); if (!j)
return; setModal({ type: "invoice", data: { _fromJob: true, jobId: j.id, customerId: j.customerId || ((_a = assets.find(a => a.id === j.assetId)) === null || _a === void 0 ? void 0 : _a.customerId) || "" } }); }, title: "Crea preventivo da job", style: { background: "#22c55e22", border: "1px solid #22c55e44", borderRadius: 5, color: "#22c55e", padding: "3px 7px", cursor: "pointer", fontSize: 10, fontWeight: 700 } }, "\u20AC"),
React.createElement("button", { onClick: () => setModal({ type: "timeline", data: jobs.find(j => j.id === row.id) }), title: "Timeline", style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u23F1"),
React.createElement("button", { onClick: () => generateJobPDF(jobs.find(j => j.id === row.id), assets, parts, customers, company), title: "PDF rapporto", style: { background: "#202028", border: "1px solid #5EEAD444", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700 } }, "PDF"))) })))),
tab === "parts" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Magazzino"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
"Costo: \u20AC",
stats.stockValue.toFixed(2),
"         \u00B7 Vendita: \u20AC",
stats.stockSellValue.toFixed(2),
" \u00B7 ",
stats.lowStock,
" sotto min.")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportParts }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, variant: "success", onClick: () => setModal({ type: "withdrawal" }) }, "\u2193 Scarica"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "part", data: null }) }, "+ Nuova"))),
parts.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Magazzino vuoto"),
React.createElement(Btn, { onClick: () => setModal({ type: "part", data: null }) }, "Nuova parte"))) : (React.createElement(ExcelTable, { defaultSort: "name", rowBg: row => row.qty === 0 ? "#ef333308" : row.qty <= row.minQty ? "#f59e0b08" : "", cols: [
{ key: "id", label: "ID", render: v => React.createElement("span", { style: { color: "#64748b", fontFamily: "monospace", fontSize: 11 } }, v) },
{ key: "code", label: "Codice", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v) },
{ key: "name", label: "Nome", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "brand", label: "Marca", opts: [...new Set(parts.map(p => p.brand).filter(Boolean))] },
{ key: "location", label: "Ubicazione", opts: [...new Set(parts.map(p => p.location).filter(Boolean))] },
{ key: "qty", label: "Q.tà", render: (v, row) => React.createElement("span", { style: { fontWeight: 800, color: v === 0 ? "#ef4444" : v <= row.minQty ? "#f59e0b" : "#22c55e" } }, v) },
{ key: "minQty", label: "Min.", render: v => React.createElement("span", { style: { color: "#64748b" } }, v) },
{ key: "unitPrice", label: "Acquisto", render: v => React.createElement("span", { style: { fontFamily: "monospace" } },
"\u20AC",
parseFloat(v).toFixed(2)) },
{ key: "sellPrice", label: "Vendita", render: v => React.createElement("span", { style: { color: "#a855f7", fontFamily: "monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(2)) },
{ key: "margine", label: "Margine", render: v => React.createElement("span", { style: { color: "#22c55e", fontFamily: "monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(2)) },
{ key: "valoreStock", label: "Val. Stock", render: v => React.createElement("span", { style: { fontFamily: "monospace" } },
"\u20AC",
parseFloat(v || 0).toFixed(2)) },
], rows: parts.map(p => (Object.assign(Object.assign({}, p), { sellPrice: p.sellPrice || p.unitPrice, margine: ((p.sellPrice || p.unitPrice) - p.unitPrice).toFixed(2), valoreStock: (p.qty * p.unitPrice).toFixed(2) }))), onEdit: row => setModal({ type: "part", data: parts.find(p => p.id === row.id) }), onDelete: id => delPart(id) })))),
tab === "customers" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Clienti"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
customers.length,
" totali")),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "customer", data: null }) }, "+ Nuovo")),
customers.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessun cliente"),
React.createElement(Btn, { onClick: () => setModal({ type: "customer", data: null }) }, "Nuovo cliente"))) : (React.createElement(ExcelTable, { defaultSort: "name", cols: [
{ key: "id", label: "ID", render: v => React.createElement("span", { style: { color: "#64748b", fontFamily: "monospace", fontSize: 11 } }, v) },
{ key: "name", label: "Ragione Sociale", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "vat", label: "P.IVA", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "contact", label: "Referente" },
{ key: "email", label: "Email" },
{ key: "phone", label: "Telefono", render: v => React.createElement("span", { style: { fontFamily: "monospace" } }, v || "—") },
{ key: "address", label: "Indirizzo" },
{ key: "nApparecchi", label: "Apparecchi", render: v => React.createElement("span", { style: { color: "#2DD4BF", fontWeight: 700 } }, v) },
], rows: customers.map(c => (Object.assign(Object.assign({}, c), { nApparecchi: assets.filter(a => a.customerId === c.id).length }))), onEdit: row => setModal({ type: "customer", data: customers.find(c => c.id === row.id) }), onDelete: id => delCustomer(id) })))),
tab === "invoices" && (React.createElement(QuotesPage, { quotes: quotes, setQuotes: setQuotes, customers: customers, jobs: jobs, assets: assets, parts: parts, company: company, showToast: showToast })),
tab === "agenda" && (React.createElement(AgendaPage, { assets: assets, setAssets: setAssets, jobs: jobs, instruments: instruments, iecReports: iecReports, funcReports: funcReports, customers: customers, setTab: setTab, setModal: setModal, showToast: showToast })),
tab === "finance" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Analytics"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12 } }, "Ricavi e margini per periodo")),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" } },
React.createElement("select", { value: filterYear, onChange: e => setFilterYear(+e.target.value), style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 7, padding: "6px 11px", color: "#e2e8f0", fontSize: 12 } }, [new Date().getFullYear() - 2, new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => React.createElement("option", { key: y, value: y }, y))),
React.createElement("select", { value: filterMonth, onChange: e => setFilterMonth(e.target.value), style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 7, padding: "6px 11px", color: "#e2e8f0", fontSize: 12 } },
React.createElement("option", { value: "" }, "Anno intero"),
["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"].map((m, i) => React.createElement("option", { key: i, value: i }, m))))),
React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } },
React.createElement(Pill, { label: "Ricavi (imponibile)", value: "€" + financials.revenue.toFixed(2), color: "#22c55e" }),
React.createElement(Pill, { label: "IVA da versare", value: "€" + financials.vatCollected.toFixed(2), color: "#f59e0b" }),
React.createElement(Pill, { label: "Costo parti acquistate", value: "€" + financials.costsPartsBought.toFixed(2), color: "#ef4444" }),
React.createElement(Pill, { label: "Costo parti usate", value: "€" + financials.costsPartsUsed.toFixed(2), color: "#f97316" })),
React.createElement("div", { style: { background: "#141418", borderRadius: 12, padding: "16px", border: "1px solid #1e2a3a", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 4 } }, " Margine Lordo Stimato"),
React.createElement("div", { style: { fontSize: 11, color: "#475569" } }, "Ricavi \u2212 costo parti usate nei job")),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 800, fontSize: 22, fontFamily: "monospace" } },
"\u20AC",
financials.margin.toFixed(2))),
React.createElement("div", { style: { background: "#141418", borderRadius: 12, padding: "16px", border: "1px solid #1e2a3a", marginBottom: 14 } },
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } },
"Ricavi mensili \u2014 ",
filterYear),
React.createElement(BarChart, { data: financials.monthlyData, color: "#22c55e" })),
financials.periodInvoices.length > 0 && (React.createElement("div", { style: { background: "#141418", borderRadius: 12, padding: "16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } },
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } },
"Fatture del periodo (",
financials.periodInvoices.length,
")"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportInvoices }, "\u2B07 Excel")),
financials.periodInvoices.map(inv => {
const cust = customers.find(c => c.id === inv.customerId);
const tot = inv.items.reduce((s, it) => s + it.qty * it.unitPrice * (1 + it.vat / 100), 0);
return (React.createElement("div", { key: inv.id, style: { display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1a2030", gap: 10, flexWrap: "wrap", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 12, color: "#64748b", fontFamily: "monospace" } }, inv.number),
React.createElement(Badge, { text: inv.status, color: STATUS_COLOR[inv.status] || "#94a3b8" }),
React.createElement("span", { style: { fontSize: 12, color: "#94a3b8", flex: 1, minWidth: 100 } }, (cust === null || cust === void 0 ? void 0 : cust.name) || "—"),
React.createElement("span", { style: { fontSize: 11, color: "#64748b" } }, inv.date),
React.createElement("span", { style: { fontSize: 13, fontWeight: 800, color: "#22c55e", fontFamily: "monospace" } },
"\u20AC",
tot.toFixed(2))));
}))))),
tab === "func" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, " Verifiche Funzionali"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
"IEC 60601-1/2 \u2014 ",
funcReports.length,
" rapporti \u00B7 ",
Object.keys(FUNC_TEMPLATES).length - 1,
" template disponibili")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "func", data: null, assetId: null }) }, "+ Nuova verifica"))),
funcReports.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessuna verifica funzionale"),
React.createElement("div", { style: { fontSize: 12, color: "#475569", marginBottom: 18 } },
"Template disponibili: ",
Object.values(FUNC_TEMPLATES).map(t => t.icon + " " + t.label).join(" · ")),
React.createElement(Btn, { onClick: () => setModal({ type: "func", data: null, assetId: null }) }, "+ Nuova verifica"))) : (React.createElement(ExcelTable, { defaultSort: "date", rowBg: row => row.overallPass === false || row.overallPass === "false" ? "#ef333308" : "", cols: [
{ key: "reportNumber", label: "N. Rapporto", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700 } }, v || "—") },
{ key: "date", label: "Data" },
{ key: "tplLabel", label: "Tipo apparecchio", render: v => React.createElement("span", { style: { fontWeight: 700, color: "#e2e8f0" } }, v) },
{ key: "assetName", label: "Apparecchio", render: v => React.createElement("span", { style: { color: "#94a3b8" } }, v) },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "cliente", label: "Cliente", opts: [...new Set(funcReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId); return ((_a = customers.find(c => c.id === (a === null || a === void 0 ? void 0 : a.customerId))) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "verifyType", label: "Tipo", render: v => React.createElement("span", { style: { fontSize: 11, color: v === "straordinaria" ? "#f59e0b" : "#64748b" } }, v || "periodica") },
{ key: "technician", label: "Tecnico" },
{ key: "overallPass", label: "Esito", render: v => React.createElement("span", { style: { fontWeight: 800, color: v === true || v === "true" ? "#22c55e" : "#ef4444" } }, v === true || v === "true" ? "✓ OK" : "✗ NO") },
{ key: "jobId", label: "Job", render: v => v ? React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11, color: "#5EEAD4" } }, v) : React.createElement("span", { style: { color: "#475569" } }, "\u2014") },
], rows: funcReports.map(r => {
const a = assets.find(x => x.id === r.assetId) || {};
const c = customers.find(x => x.id === a.customerId) || {};
const tpl = FUNC_TEMPLATES[r.templateId] || FUNC_TEMPLATES["generico"];
return Object.assign(Object.assign({}, r), { tplLabel: tpl.icon + " " + tpl.label, assetName: a.name || r.assetId || "—", serial: a.serial || "", cliente: c.name || "" });
}), onEdit: row => setModal({ type: "func", data: funcReports.find(r => r.id === row.id), assetId: row.assetId }), onDelete: id => delFuncReport(id), actions: row => {
const rep = funcReports.find(r => r.id === row.id);
const a = assets.find(x => x.id === (rep === null || rep === void 0 ? void 0 : rep.assetId)) || {};
const c = customers.find(x => x.id === a.customerId) || {};
return React.createElement("button", { onClick: () => generateFuncPDF(rep, a, c, company), title: "PDF", style: { background: "#2DD4BF15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, " PDF");
} })))),
tab === "iec" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "\u26A1 Verifiche Sicurezza Elettrica"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
"IEC 62353 \u00B7 IEC 61010-1 \u00B7 ",
iecReports.length,
" rapporti")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportIecReports }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "iec", data: null, assetId: null }) }, "+ Nuova verifica"))),
iecReports.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\u26A1"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessuna verifica registrata"),
React.createElement("div", { style: { fontSize: 12, color: "#475569", marginBottom: 18 } }, "Rapporti di verifica sicurezza elettrica IEC 62353 / 61010"),
React.createElement(Btn, { onClick: () => setModal({ type: "iec", data: null, assetId: null }) }, "+ Nuova verifica"))) : (React.createElement(ExcelTable, { defaultSort: "date", rowBg: row => row.overallPass === false || row.overallPass === "false" ? "#ef333308" : "", cols: [
{ key: "reportNumber", label: "N. Rapporto", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700 } }, v || "—") },
{ key: "date", label: "Data" },
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "cliente", label: "Cliente", opts: [...new Set(iecReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId); return ((_a = customers.find(c => c.id === (a === null || a === void 0 ? void 0 : a.customerId))) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "norm", label: "Norma", opts: ["62353", "61010"], render: v => React.createElement("span", { style: { fontSize: 11, color: "#64748b" } },
"IEC ",
v) },
{ key: "equipClass", label: "Classe" },
{ key: "verifyType", label: "Tipo" },
{ key: "verifyType", label: "Tipo", render: v => React.createElement("span", { style: { fontSize: 11, color: v === "straordinaria" ? "#f59e0b" : "#64748b" } }, v || "periodica") },
{ key: "technician", label: "Tecnico" },
{ key: "overallPass", label: "Esito", render: v => React.createElement("span", { style: { fontWeight: 800, color: v === true || v === "true" ? "#22c55e" : "#ef4444" } }, v === true || v === "true" ? "✓ OK" : "✗ NO") },
{ key: "jobId", label: "Job", render: v => v ? React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11, color: "#5EEAD4" } }, v) : React.createElement("span", { style: { color: "#475569" } }, "\u2014") },
], rows: iecReports.map(r => { const a = assets.find(x => x.id === r.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; return Object.assign(Object.assign({}, r), { apparecchio: a.name || r.assetId || "—", serial: a.serial || "", cliente: c.name || "" }); }), onEdit: row => setModal({ type: "iec", data: iecReports.find(r => r.id === row.id), assetId: row.assetId }), onDelete: id => delIecReport(id), actions: row => {
const rep = iecReports.find(r => r.id === row.id);
const a = assets.find(x => x.id === (rep === null || rep === void 0 ? void 0 : rep.assetId)) || {};
const c = customers.find(x => x.id === a.customerId) || {};
return React.createElement("button", { onClick: () => generateIECPDF(rep, a, c, company), title: "PDF", style: { background: "#2DD4BF15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, " PDF");
} })))),
tab === "schedule" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Pianificazione Annuale"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12 } }, "Attivit\u00E0 programmate per anno")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" } },
React.createElement("select", { value: scheduleYear, onChange: e => setScheduleYear(+e.target.value), style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 7, padding: "7px 11px", color: "#e2e8f0", fontSize: 13 } }, [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map(y => React.createElement("option", { key: y, value: y }, y))),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => {
const rows = scheduleRows;
downloadXLSX("pianificazione-" + scheduleYear + ".csv", rows, [{ key: "month", label: "Mese" }, { key: "assetName", label: "Apparecchio" }, { key: "brand", label: "Marca" }, { key: "serial", label: "N.Serie" }, { key: "location", label: "Ubicazione" }, { key: "customer", label: "Cliente" }, { key: "norm", label: "Norma IEC" }, { key: "lastService", label: "Ultima verifica" }, { key: "nextService", label: "Data pianificata" }, { key: "status", label: "Stato apparecchio" }]);
} }, "\u2B07 Excel Pianificazione"))),
scheduleMonths.every(m => m.items.length === 0) ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } },
"Nessuna attivit\u00E0 pianificata per ",
scheduleYear),
React.createElement("div", { style: { fontSize: 12, color: "#475569" } }, "Le attivit\u00E0 compaiono automaticamente quando salvi una Verifica Sicurezza Elettrica o imposti una data \"Prossimo Servizio\" negli apparecchi."))) : scheduleMonths.map(({ month, monthLabel, items }) => items.length === 0 ? null : (React.createElement("div", { key: month, style: { marginBottom: 20 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "8px 14px", background: "#141418", borderRadius: "8px 8px 0 0", border: "1px solid #2a3040", borderBottom: "none" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 15, color: "#e2e8f0" } },
monthLabel,
" ",
scheduleYear),
React.createElement("span", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace" } },
items.length,
" apparecch",
items.length === 1 ? "io" : "i")),
React.createElement(ExcelTable, { defaultSort: "nextService", rowBg: row => {
const d = row._days;
return d < 0 ? "#ef333308" : d <= 30 ? "#f59e0b08" : "";
}, cols: [
{ key: "assetName", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "brand", label: "Marca" },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "location", label: "Ubicazione", opts: [...new Set(items.map(i => i.location).filter(Boolean))] },
{ key: "customer", label: "Cliente", opts: [...new Set(items.map(i => i.customer).filter(Boolean))] },
{ key: "norm", label: "Norma IEC", opts: ["IEC 62353", "IEC 61010-1", "—"], render: v => React.createElement("span", { style: { fontSize: 11, color: "#64748b" } }, v) },
{ key: "lastService", label: "Ultima verifica", render: v => v || React.createElement("span", { style: { color: "#475569" } }, "mai") },
{ key: "nextService", label: "Data pianificata", render: (v, row) => React.createElement(AlertChip, { days: row._days }) },
{ key: "status", label: "Stato", opts: ["operativo", "in manutenzione", "fuori servizio"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "#64748b" }) },
], rows: items, actions: row => (React.createElement("button", { onClick: () => setModal({ type: "iec", data: null, assetId: row.assetId }), style: { background: "#2DD4BF15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "Verifica")) })))))),
tab === "help" && React.createElement(HelpTab, { helpOpen: helpOpen, setHelpOpen: setHelpOpen }),
tab === "procedures" && (React.createElement(ProceduresPage, { procedures: procedures, setProcedures: setProcedures, instruments: instruments, parts: parts, assets: assets, showToast: showToast, setTab: setTab })),
tab === "instruments" && (React.createElement(InstrumentsPage, { instruments: instruments, setInstruments: setInstruments, showToast: showToast })),
tab === "legal" && React.createElement(LegalTab, null),
tab === "orders" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Ordini Fornitori"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12 } },
stats.pendingOrders,
" in corso")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportOrders }, "\u2B07 Excel"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "order", data: null }) }, "+ Nuovo"))),
orders.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessun ordine"),
React.createElement(Btn, { onClick: () => setModal({ type: "order", data: null }) }, "Nuovo ordine"))) : (React.createElement(ExcelTable, { defaultSort: "orderDate", rowBg: row => row.status === "in attesa" ? "#f59e0b08" : "", cols: [
{ key: "id", label: "ID", render: v => React.createElement("span", { style: { color: "#64748b", fontFamily: "monospace", fontSize: 11 } }, v) },
{ key: "supplier", label: "Fornitore", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "nomeParte", label: "Parte" },
{ key: "qty", label: "Q.tà", render: v => React.createElement("span", { style: { fontFamily: "monospace" } }, v) },
{ key: "unitPrice", label: "Prezzo Unit.", render: v => React.createElement("span", { style: { fontFamily: "monospace" } },
"\u20AC",
parseFloat(v).toFixed(2)) },
{ key: "totale", label: "Totale", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700, color: "#a855f7" } },
"\u20AC",
v) },
{ key: "status", label: "Stato", opts: ["in attesa", "confermato", "spedito", "ricevuto", "annullato"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "#94a3b8" }) },
{ key: "orderDate", label: "Data ordine" },
{ key: "expectedDate", label: "Consegna", render: v => v || "—" },
], rows: orders.map(o => { var _a; return (Object.assign(Object.assign({}, o), { nomeParte: ((_a = parts.find(p => p.id === o.partId)) === null || _a === void 0 ? void 0 : _a.name) || o.partId, totale: (o.qty * o.unitPrice).toFixed(2) })); }), onEdit: row => setModal({ type: "order", data: orders.find(o => o.id === row.id) }), onDelete: id => delOrder(id), actions: row => {
const o = orders.find(x => x.id === row.id);
return (o === null || o === void 0 ? void 0 : o.status) !== "ricevuto" && (o === null || o === void 0 ? void 0 : o.status) !== "annullato"
? React.createElement("button", { onClick: () => quickReceive(o), style: { background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 5, color: "#22c55e", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "\u2713 Ricevuto")
: null;
} })))),
tab === "withdrawals" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Scarichi Magazzino"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12 } },
withdrawals.length,
" totali")),
parts.length > 0 && assets.length > 0 && React.createElement(Btn, { sm: true, variant: "success", onClick: () => setModal({ type: "withdrawal" }) }, " Nuovo")),
withdrawals.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCE6"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessuno scarico"),
React.createElement("div", { style: { fontSize: 12, color: "#475569" } }, "Le uscite di magazzino verranno registrate qui."))) : (React.createElement(ExcelTable, { defaultSort: "date", cols: [
{ key: "id", label: "ID", render: v => React.createElement("span", { style: { color: "#64748b", fontFamily: "monospace", fontSize: 11 } }, v) },
{ key: "date", label: "Data" },
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "tech", label: "Tecnico", render: v => v || "—" },
{ key: "reason", label: "Motivo", render: v => React.createElement("span", { style: { color: "#94a3b8", fontSize: 11 } }, v || "—") },
{ key: "partiDesc", label: "Parti", render: v => React.createElement("span", { style: { color: "#64748b", fontSize: 11 } }, v) },
{ key: "total", label: "Totale", render: v => React.createElement("span", { style: { color: "#22c55e", fontWeight: 800, fontFamily: "monospace" } },
"\u20AC",
parseFloat(v).toFixed(2)) },
], rows: withdrawals.map(w => { var _a; return (Object.assign(Object.assign({}, w), { apparecchio: ((_a = assets.find(a => a.id === w.assetId)) === null || _a === void 0 ? void 0 : _a.name) || w.assetId || "—", partiDesc: w.items.map(r => { const p = parts.find(x => x.id === r.partId); return ((p === null || p === void 0 ? void 0 : p.name) || r.partId) + " x" + r.qty; }).join(", ") })); }) })))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "asset" && React.createElement(Modal, { title: modal.data ? "Modifica Apparecchio" : "Nuovo Apparecchio", onClose: () => setModal(null) },
React.createElement(AssetForm, { initial: modal.data, customers: customers, onSave: saveAsset, onClose: () => setModal(null) })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "part" && React.createElement(Modal, { title: modal.data ? "Modifica Parte" : "Nuova Parte", wide: true, onClose: () => setModal(null) },
React.createElement(PartForm, { initial: modal.data, assets: assets, onSave: savePart, onClose: () => setModal(null) })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "job" && React.createElement(Modal, { title: ((_b = modal.data) === null || _b === void 0 ? void 0 : _b.id) ? "Modifica Job" : "Nuovo Job", wide: true, onClose: () => setModal(null) },
React.createElement(JobForm, { initial: ((_c = modal.data) === null || _c === void 0 ? void 0 : _c.id) ? modal.data : null, assets: assets, parts: parts, customers: customers, onSave: saveJob, onClose: () => setModal(null) })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "order" && React.createElement(Modal, { title: modal.data ? "Modifica Ordine" : "Nuovo Ordine", onClose: () => setModal(null) },
React.createElement(OrderForm, { initial: modal.data, parts: parts, onSave: saveOrder, onClose: () => setModal(null) })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "customer" && React.createElement(Modal, { title: modal.data ? "Modifica Cliente" : "Nuovo Cliente", onClose: () => setModal(null) },
React.createElement(CustomerForm, { initial: modal.data, onSave: saveCustomer, onClose: () => setModal(null) })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "invoice" && React.createElement(Modal, { title: modal.data ? "Modifica Fattura" : "Nuova Fattura", wide: true, onClose: () => setModal(null) },
React.createElement(InvoiceForm, { initial: modal.data, customers: customers, jobs: jobs, assets: assets, parts: parts, generateNumber: generateInvoiceNumber, onSave: saveInvoice, onClose: () => setModal(null) })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "withdrawal" && React.createElement(WithdrawalModal, { parts: parts, assets: assets, onWithdraw: handleWithdraw, onClose: () => setModal(null) }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "assetDetail" && false /* handled by modal block above */,
(modal === null || modal === void 0 ? void 0 : modal.type) === "invoice" && (React.createElement(Modal, { title: ((_d = modal.data) === null || _d === void 0 ? void 0 : _d.id) && quotes.some(q => q.id === modal.data.id) ? "Modifica Preventivo" : "Nuovo Preventivo", wide: true, onClose: () => setModal(null) },
React.createElement(QuoteForm, { initial: (() => {
var _a, _b, _c;
if (((_a = modal.data) === null || _a === void 0 ? void 0 : _a.id) && quotes.some(q => q.id === modal.data.id))
return modal.data;
const j = jobs.find(x => { var _a; return x.id === ((_a = modal.data) === null || _a === void 0 ? void 0 : _a.jobId); });
const a = j ? assets.find(x => x.id === j.assetId) : null;
const lns = [];
if ((j === null || j === void 0 ? void 0 : j.laborHours) > 0)
lns.push({ id: Date.now(), label: `Manodopera${a ? ` — ${a.name}` : ""} (rif. ${j.id})`, hours: j.laborHours, rate: j.laborRate || 55 });
const pns = ((j === null || j === void 0 ? void 0 : j.parts) || []).map(p => { const pt = parts.find(x => x.id === p.partId); return pt ? { id: Date.now() + Math.random(), type: "warehouse", partId: pt.id, description: pt.name + (pt.code ? ` (${pt.code})` : ""), qty: p.qty, unitPrice: pt.sellPrice || pt.unitPrice || 0, vat: 22 } : null; }).filter(Boolean);
return { number: newQuoteNumber(quotes), customerId: ((_b = modal.data) === null || _b === void 0 ? void 0 : _b.customerId) || (j === null || j === void 0 ? void 0 : j.customerId) || (a === null || a === void 0 ? void 0 : a.customerId) || "", jobId: ((_c = modal.data) === null || _c === void 0 ? void 0 : _c.jobId) || "", date: new Date().toISOString().slice(0, 10), validUntil: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10); })(), status: "bozza", laborLines: lns, partLines: pns, paymentTerms: "Bonifico bancario a 30 giorni", notes: "", vatExempt: false };
})(), customers: customers, jobs: jobs, assets: assets, parts: parts, quotes: quotes, onSave: q => {
const exists = quotes.some(x => x.id === q.id);
if (exists) {
setQuotes(qs => qs.map(x => x.id === q.id ? q : x));
showToast("Preventivo aggiornato");
}
else {
const nq = Object.assign(Object.assign({}, q), { id: "QT" + Date.now(), createdAt: new Date().toISOString() });
setQuotes(qs => [...qs, nq]);
showToast("✓ Preventivo " + nq.number + " creato");
}
setModal(null);
}, onClose: () => setModal(null) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "timeline" && React.createElement(TimelineModal, { job: modal.data, parts: parts, onSave: (data) => saveTimeline(modal.data.id, data), onClose: () => setModal(null) }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "settings" && React.createElement(SettingsModal, { data: { assets, parts, jobs, orders, withdrawals, customers, invoices, iecReports, funcReports, instruments, procedures, company }, company: company, onUpdateCompany: setCompany, onImport: handleImport, onMerge: handleMerge, onReset: handleReset, onClose: () => setModal(null), setPortalMode: setPortalMode }),
csvModal && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000d", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } },
React.createElement("div", { style: { background: "#18181F", border: "1px solid #2a3040", borderRadius: 14, width: "min(640px,97vw)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" } },
React.createElement("div", { style: { padding: "16px 20px", borderBottom: "1px solid #2a3040", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 } },
React.createElement("div", null,
React.createElement("div", { style: { fontWeight: 800, fontSize: 15, color: "#e2e8f0" } }, csvModal.isJson ? "Backup JSON" : "Esporta dati"),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "monospace" } }, csvModal.filename)),
React.createElement("button", { onClick: () => setCsvModal(null), style: { background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "\u00D7")),
React.createElement("div", { style: { padding: "14px 20px", flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 12 } },
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 8, padding: "10px 14px", border: "1px solid #1e2a3a", fontSize: 11, color: "#64748b", lineHeight: 1.5 } }, csvModal.isJson
? React.createElement(React.Fragment, null,
React.createElement("strong", { style: { color: "#e2e8f0" } },
"Backup (",
csvModal.filename,
"):"),
" Sul telefono/PC reale il file viene scaricato direttamente. Qui in modalit\u00E0 preview, copia il contenuto e salvalo come ",
React.createElement("strong", { style: { color: "#22c55e" } }, ".json"),
".")
: React.createElement(React.Fragment, null,
React.createElement("strong", { style: { color: "#e2e8f0" } },
"Export (",
csvModal.filename,
"):"),
" Sul telefono/PC reale il file viene scaricato direttamente. Qui in modalit\u00E0 preview, copia e incolla in Excel/Google Sheets.")),
React.createElement("textarea", { readOnly: true, value: csvModal.isJson ? csvModal.data : ("\uFEFF" + csvModal.data), id: "csv-textarea", style: { flex: 1, minHeight: 280, background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 11, fontFamily: "monospace", resize: "none", outline: "none" }, onClick: e => { e.target.select(); e.target.setSelectionRange(0, 999999); } })),
React.createElement("div", { style: { padding: "12px 20px", borderTop: "1px solid #2a3040", display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", flexShrink: 0 } },
React.createElement("button", { onClick: () => {
const text = csvModal.isJson ? csvModal.data : ("\uFEFF" + csvModal.data);
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(() => showToast("Copiato!")).catch(() => { });
}
}, style: { background: "#2DD4BF", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Copia negli appunti"),
React.createElement("button", { onClick: () => {
const text = csvModal.isJson ? csvModal.data : ("\uFEFF" + csvModal.data);
const ta = document.querySelector("#csv-textarea");
if (ta) {
ta.select();
ta.setSelectionRange(0, 999999);
}
if (navigator.clipboard) {
navigator.clipboard.writeText(text).then(() => showToast("✓ Copiato! Incolla in Notepad e salva come ." + (csvModal.isJson ? "json" : "csv"))).catch(() => showToast("Seleziona il testo e copia con Ctrl+C", "#f59e0b"));
}
else {
showToast("Seleziona il testo e copia con Ctrl+C", "#f59e0b");
}
}, style: { background: "#22c55e", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Copia testo"),
React.createElement("button", { onClick: () => setCsvModal(null), style: { background: "#1E1E28", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Chiudi"))))),
pdfHtml && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000e", zIndex: 1000, display: "flex", flexDirection: "column" } },
React.createElement("div", { style: { background: "#0D0D12", borderBottom: "1px solid #2a3040", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexShrink: 0 } },
React.createElement("span", { style: { color: "#e2e8f0", fontWeight: 700, fontSize: 14 } }, " Anteprima documento"),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement("button", { onClick: () => __awaiter(this, void 0, void 0, function* () {
// REAL PDF generation using html2canvas + jsPDF (loaded from CDN)
const ensureScript = (src) => new Promise((resolve, reject) => {
if (document.querySelector(`script[src="${src}"]`)) {
resolve();
return;
}
const s = document.createElement('script');
s.src = src;
s.onload = resolve;
s.onerror = reject;
document.head.appendChild(s);
});
if (typeof DEMO_MODE !== "undefined" && DEMO_MODE) {
showToast("⚡ PDF disponibile nella versione completa", "#f59e0b");
return;
}
showToast("Generazione PDF in corso…", "#2DD4BF");
try {
yield ensureScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
yield ensureScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
// Find the preview div
const preview = document.querySelector('[data-pdf-preview="1"]');
if (!preview)
throw new Error('Preview non trovato');
const canvas = yield window.html2canvas(preview, { scale: 2, useCORS: true, backgroundColor: '#fff' });
const imgData = canvas.toDataURL('image/jpeg', 0.92);
const { jsPDF } = window.jspdf;
const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
const pdfW = pdf.internal.pageSize.getWidth();
const pdfH = pdf.internal.pageSize.getHeight();
const imgW = pdfW;
const imgH = (canvas.height * pdfW) / canvas.width;
let heightLeft = imgH;
let position = 0;
pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
heightLeft -= pdfH;
while (heightLeft > 0) {
position = heightLeft - imgH;
pdf.addPage();
pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
heightLeft -= pdfH;
}
const filename = "medtrace-rapporto-" + new Date().toISOString().slice(0, 10) + ".pdf";
pdf.save(filename);
showToast("✓ PDF scaricato", "#22c55e");
}
catch (e) {
showToast("Errore generazione PDF — usa Stampa", "#ef4444");
console.error(e);
}
}), style: { background: "linear-gradient(135deg,#2DD4BF,#0D9488)", color: "#000", border: "none", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 } }, "\u2B07 Scarica PDF"),
React.createElement("button", { onClick: () => {
const w = window.open('', '_blank');
if (w) {
w.document.open();
w.document.write(pdfHtml);
w.document.close();
setTimeout(() => { try {
w.focus();
w.print();
}
catch (e) { } }, 500);
}
}, style: { background: "#1E1E28", color: "#2DD4BF", border: "1px solid #2DD4BF44", borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "\uD83D\uDDA8 Stampa"),
React.createElement("button", { onClick: () => setPdfHtml(null), style: { background: "#1E1E28", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 } }, "\u2715 Chiudi"))),
React.createElement("div", { style: { flex: 1, overflow: "auto", background: "#f0f0f0", padding: "20px", display: "flex", justifyContent: "center" } },
React.createElement("div", { style: { background: "#fff", width: "210mm", minHeight: "297mm", boxShadow: "0 4px 24px #0004", padding: "15mm" }, "data-pdf-preview": "1", dangerouslySetInnerHTML: { __html: (() => {
const styleMatch = pdfHtml.match(/<style>([\s\S]*?)<\/style>/i);
const bodyMatch = pdfHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const style = styleMatch ? '<style>' + styleMatch[1] + '</style>' : '';
const body = bodyMatch ? bodyMatch[1] : pdfHtml;
return style + body;
})() } })))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "iec" && (React.createElement(Modal, { title: modal.data ? "Modifica Rapporto IEC" : "Nuova Verifica Sicurezza Elettrica", wide: true, onClose: () => setModal(null) },
React.createElement(IECReportForm, { initial: modal.data || null, assetId: ((_e = modal.data) === null || _e === void 0 ? void 0 : _e.assetId) || modal.assetId || null, assets: assets, customers: customers, instruments: instruments, onSave: saveIecReport, onClose: () => setModal(null) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "assetDetail" && modal.data && (React.createElement(Modal, { title: " ", wide: true, onClose: () => setModal(null) },
React.createElement(AssetDetailModal, { asset: modal.data, jobs: jobs, parts: parts, iecReports: iecReports, funcReports: funcReports, customers: customers, company: company, generateIECPDF: generateIECPDF, generateFuncPDF: generateFuncPDF, onClose: () => setModal(null), onEditAsset: () => setModal({ type: "asset", data: modal.data }), onNewJob: () => setModal({ type: "job", data: { assetId: modal.data.id, type: "correttiva", priority: "normale", status: "aperto", description: "", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }), onNewIec: () => setModal({ type: "iec", assetId: modal.data.id, data: null }), onNewFunc: () => setModal({ type: "func", assetId: modal.data.id, data: null }), onOpenJob: j => setModal({ type: "job", data: j }) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "func" && (React.createElement(Modal, { title: modal.data ? "Modifica Verifica Funzionale" : "Nuova Verifica Funzionale", wide: true, onClose: () => setModal(null) },
React.createElement(FuncVerifyForm, { initial: modal.data || null, assetId: ((_f = modal.data) === null || _f === void 0 ? void 0 : _f.assetId) || modal.assetId || null, assets: assets, customers: customers, instruments: instruments, onSave: saveFuncReport, onClose: () => setModal(null) }))))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
