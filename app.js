/* MedTrace v0.76 DEMO */
"use strict";
/* ═══ SUPABASE CLIENT ═══════════════════════════════════════════════════════
* Loaded via CDN — no npm needed
* ═══════════════════════════════════════════════════════════════════════════ */
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
const SUPA_URL = 'https://mrljyxrafaoirnbkzcwd.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybGp5eHJhZmFvaXJuYmt6Y3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNTU1NTUsImV4cCI6MjA5NDkzMTU1NX0.MaUWjcNjNp-fFjs47d9oqSHj8asToU_JTyDNQ0RwuAg';
// Supabase client — initialized after CDN loads
let _supa = null;
function getSupa() {
if (!_supa && window.supabase) {
_supa = window.supabase.createClient(SUPA_URL, SUPA_KEY, {
auth: { autoRefreshToken: true, persistSession: true },
});
}
return _supa;
}
// Auth helpers
const supaSignUp = (email, pw) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signUp({ email, password: pw }); };
const supaSignIn = (email, pw) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signInWithPassword({ email, password: pw }); };
const supaSignOut = () => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.signOut(); };
const supaGetUser = () => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.getUser(); };
const supaOnAuth = (cb) => { var _a; return (_a = getSupa()) === null || _a === void 0 ? void 0 : _a.auth.onAuthStateChange(cb); };
// DB helpers
const supaDB = {
getAll(table) {
return __awaiter(this, void 0, void 0, function* () {
const { data, error } = yield getSupa().from(table).select('*').order('created_at', { ascending: false });
if (error)
throw error;
return data || [];
});
},
insert(table, record) {
return __awaiter(this, void 0, void 0, function* () {
const { data, error } = yield getSupa().from(table).insert(record).select().single();
if (error)
throw error;
return data;
});
},
update(table, id, updates) {
return __awaiter(this, void 0, void 0, function* () {
const { data, error } = yield getSupa().from(table).update(updates).eq('id', id).select().single();
if (error)
throw error;
return data;
});
},
delete(table, id) {
return __awaiter(this, void 0, void 0, function* () {
const { error } = yield getSupa().from(table).delete().eq('id', id);
if (error)
throw error;
});
},
};
/* ═══ CONSTANTS ═══════════════════════════════════════════════ */
const STATUS_COLOR = { "operativo": "#22c55e", "in manutenzione": "#f59e0b", "fuori servizio": "#ef4444", "aperto": "#2DD4BF", "in corso": "#f59e0b", "chiuso": "#22c55e", "in attesa": "#94a3b8", "confermato": "#2DD4BF", "spedito": "#a855f7", "ricevuto": "#22c55e", "annullato": "#ef4444", "emessa": "#2DD4BF", "pagata": "#22c55e", "scaduta": "#ef4444", "bozza": "#94a3b8" };
const PRI_COLOR = { "urgente": "#ef4444", "alta": "#f97316", "normale": "#6366f1", "bassa": "#94a3b8" };
const TIMELINE_ICON = { "diagnosi": "", "intervento": "", "ordine_parti": "", "attesa_parti": "·", "test": "✓", "sopralluogo": "·", "contatto": "", "nota": "·" };
const TIMELINE_LABEL = { "diagnosi": "Diagnosi", "intervento": "Intervento", "ordine_parti": "Ordine parti", "attesa_parti": "Attesa parti", "test": "Test/Verifica", "sopralluogo": "Sopralluogo", "contatto": "Contatto cliente", "nota": "Nota generica" };
const STORAGE_KEY = "medtrace-demo-v3";
const DEMO_DATA = {
company: {
name: "Studio Tecnico Bianchi SRL",
subtitle: "Manutenzione Apparecchiature Elettromedicali",
address: "Via Roma 42, 20121 Milano (MI)",
vat: "IT01234567890",
iban: "IT60 X054 2811 1010 0000 0123 456",
invoicePrefix: "F",
phone: "+39 02 1234567",
email: "info@studiotecnicobianchi.it"
},
customers: [
{ id: "C001", name: "Ospedale San Raffaele", contact: "Dott. Marco Rossi", email: "manutenzione@hsr.it", phone: "+39 02 26431", vat: "IT05000540963", address: "Via Olgettina 60, Milano" },
{ id: "C002", name: "Clinica Veterinaria San Marco", contact: "Dr.ssa Laura Bianchi", email: "info@vetsanmarco.it", phone: "+39 02 5552233", vat: "IT09876543210", address: "Via Padova 88, Milano" },
{ id: "C003", name: "Studio Dentistico Dr. Verdi", contact: "Dr. Paolo Verdi", email: "studio@drverdi.it", phone: "+39 02 7771122", vat: "IT12345678901", address: "Corso Italia 15, Milano" },
{ id: "C004", name: "Centro Diagnostico Lombardia", contact: "Sig. Andrea Galli", email: "acquisti@cdlombardia.it", phone: "+39 02 4445566", vat: "IT11122233344", address: "Via Washington 70, Milano" },
{ id: "C005", name: "RSA Villa Serena", contact: "Ing. Sara Conti", email: "tecnico@villaserena.it", phone: "+39 02 3334455", vat: "IT55566677788", address: "Via dei Pini 23, Sesto San Giovanni" },
],
assets: [
{ id: "A001", name: "Defibrillatore Sala Rianimazione", brand: "Philips", model: "HeartStart MRx", serial: "DE3456-789", customerId: "C001", status: "operativo", location: "Reparto Rianimazione - Stanza 12", riskClass: "IIb", iecNorm: "62353", iecClass: "I", patientType: "BF", buyDate: "2022-03-15", warrantyExpiry: "2027-03-15", lastService: "2025-11-20", nextService: "2026-05-20", serviceInterval: 6, notes: "Apparecchio critico - manutenzione semestrale obbligatoria" },
{ id: "A002", name: "Monitor Multiparametrico Box 3", brand: "GE Healthcare", model: "CARESCAPE B650", serial: "GE-MP-12389", customerId: "C001", status: "operativo", location: "Pronto Soccorso - Box 3", riskClass: "IIb", iecNorm: "62353", iecClass: "I", patientType: "CF", buyDate: "2023-06-10", warrantyExpiry: "2025-06-10", lastService: "2026-02-15", nextService: "2026-08-15", serviceInterval: 6, notes: "ECG, NIBP, SpO2, temperatura, capnografia" },
{ id: "A003", name: "Ecografo portatile Veterinario", brand: "SonoSite", model: "Edge II", serial: "SS-ED2-7842", customerId: "C002", status: "operativo", location: "Sala visite 1", riskClass: "IIa", iecNorm: "62353", iecClass: "I", patientType: "B", buyDate: "2024-01-20", warrantyExpiry: "2026-01-20", lastService: "2025-12-10", nextService: "2026-06-10", serviceInterval: 6, notes: "Sonde lineare e convex" },
{ id: "A004", name: "Riunito Odontoiatrico Studio 1", brand: "Castellini", model: "Skema 8", serial: "CAST-S8-2245", customerId: "C003", status: "operativo", location: "Studio 1", riskClass: "IIa", iecNorm: "62353", iecClass: "I", patientType: "B", buyDate: "2021-09-12", warrantyExpiry: "2024-09-12", lastService: "2025-09-15", nextService: "2026-05-30", serviceInterval: 8, notes: "Compressore + aspirazione + lampada polimerizzazione" },
{ id: "A005", name: "Mammografo Digitale", brand: "Siemens", model: "Mammomat Inspiration", serial: "SIE-MI-99012", customerId: "C004", status: "in manutenzione", location: "Reparto Senologia", riskClass: "IIb", iecNorm: "62353", iecClass: "I", patientType: "B", buyDate: "2020-04-05", warrantyExpiry: "2023-04-05", lastService: "2026-01-10", nextService: "2026-06-05", serviceInterval: 6, notes: "Generatore in attesa pezzo ricambio" },
{ id: "A006", name: "Aspiratore chirurgico portatile", brand: "Medela", model: "Vario 18", serial: "MED-V18-3456", customerId: "C005", status: "operativo", location: "Carrello emergenza P1", riskClass: "IIa", iecNorm: "62353", iecClass: "II", patientType: "B", buyDate: "2023-11-18", warrantyExpiry: "2025-11-18", lastService: "2025-11-25", nextService: "2026-05-25", serviceInterval: 6, notes: "" },
{ id: "A007", name: "Letto degenza elettrico 14", brand: "Hill-Rom", model: "Centrella", serial: "HR-CEN-78901", customerId: "C005", status: "operativo", location: "Camera 14 - letto A", riskClass: "I", iecNorm: "62353", iecClass: "I", patientType: "B", buyDate: "2022-07-22", warrantyExpiry: "2027-07-22", lastService: "2025-07-25", nextService: "2026-07-25", serviceInterval: 12, notes: "4 ruote bloccabili, alzata Trendelenburg" },
{ id: "A008", name: "Pompa infusionale Box ICU", brand: "B.Braun", model: "Infusomat Space", serial: "BB-IS-44521", customerId: "C001", status: "operativo", location: "ICU - Box 5", riskClass: "IIb", iecNorm: "62353", iecClass: "II", patientType: "CF", buyDate: "2023-02-14", warrantyExpiry: "2026-02-14", lastService: "2026-02-20", nextService: "2026-05-30", serviceInterval: 3, notes: "Verifica trimestrale di accuratezza" },
{ id: "A009", name: "Elettrobisturi Sala Operatoria 2", brand: "ERBE", model: "VIO 3", serial: "ERBE-V3-66789", customerId: "C001", status: "fuori servizio", location: "Sala Operatoria 2 - magazzino", riskClass: "IIb", iecNorm: "62353", iecClass: "I", patientType: "CF", buyDate: "2019-05-30", warrantyExpiry: "2022-05-30", lastService: "2025-08-10", nextService: "2026-04-15", serviceInterval: 6, notes: "Pedaliera difettosa - in attesa preventivo riparazione" },
{ id: "A010", name: "Saturimetro da dito x6", brand: "Nonin", model: "PalmSAT 2500", serial: "NON-PS-multi", customerId: "C005", status: "operativo", location: "Carrelli reparto", riskClass: "IIa", iecNorm: "62353", iecClass: "II", patientType: "BF", buyDate: "2024-06-01", warrantyExpiry: "2026-06-01", lastService: "2025-06-15", nextService: "2026-06-15", serviceInterval: 12, notes: "Lotto da 6 unità" },
],
parts: [
{ id: "P001", code: "BAT-LI-12V", name: "Batteria Li-Ion 12V 2200mAh", brand: "Generica", location: "Scaffale A1", qty: 8, minQty: 5, unitPrice: 35.00, sellPrice: 65.00, supplier: "Elettroforniture SRL", notes: "Compatibile con monitor e pompe" },
{ id: "P002", code: "FILT-ASP-001", name: "Filtro antibatterico aspiratore", brand: "Medela", location: "Scaffale B2", qty: 24, minQty: 10, unitPrice: 8.50, sellPrice: 18.00, supplier: "Medela Italia", notes: "Monouso, sostituire ogni paziente" },
{ id: "P003", code: "CAVO-ECG-3D", name: "Cavo ECG 3 derivazioni", brand: "GE", location: "Scaffale C1", qty: 3, minQty: 5, unitPrice: 78.00, sellPrice: 140.00, supplier: "GE Healthcare", notes: "Sotto scorta - da riordinare" },
{ id: "P004", code: "SENS-SPO2-A", name: "Sensore SpO2 adulto riutilizzabile", brand: "Nellcor", location: "Scaffale C2", qty: 6, minQty: 3, unitPrice: 120.00, sellPrice: 210.00, supplier: "Medtronic", notes: "" },
{ id: "P005", code: "FUSE-T2A", name: "Fusibile T2A 250V 5x20mm", brand: "Schurter", location: "Cassetto piccolo materiale", qty: 50, minQty: 20, unitPrice: 0.80, sellPrice: 2.50, supplier: "RS Components", notes: "" },
{ id: "P006", code: "BRACC-NIBP-AD", name: "Bracciale NIBP adulto", brand: "GE", location: "Scaffale C3", qty: 0, minQty: 2, unitPrice: 45.00, sellPrice: 85.00, supplier: "GE Healthcare", notes: "ESAURITO — ordine già fatto" },
{ id: "P007", code: "GEL-ECG-250", name: "Gel ECG 250ml", brand: "Tensive", location: "Scaffale B3", qty: 15, minQty: 5, unitPrice: 3.50, sellPrice: 8.00, supplier: "Farmacia Centrale", notes: "" },
{ id: "P008", code: "LAMP-POL-LED", name: "Lampada polimerizzazione LED", brand: "3M", location: "Scaffale A3", qty: 2, minQty: 1, unitPrice: 280.00, sellPrice: 450.00, supplier: "3M Italia", notes: "Per riuniti odontoiatrici" },
],
jobs: [
{ id: "J001", assetId: "A009", customerId: "C001", openDate: "2026-05-18", closeDate: "", status: "in corso", priority: "urgente", type: "correttiva", assignee: "Mario Bianchi", description: "Elettrobisturi VIO 3 non eroga corrente in modalità coag. Verificare pedaliera e generatore.", parts: [], laborHours: 0, laborRate: 60, notes: "Cliente segnala problema critico - sala operatoria ferma" },
{ id: "J002", assetId: "A005", customerId: "C004", openDate: "2026-05-22", closeDate: "", status: "aperto", priority: "alta", type: "correttiva", assignee: "Luca Verdi", description: "Mammografo - errore generatore E-204. Sostituire scheda alimentazione.", parts: [], laborHours: 0, laborRate: 60, notes: "Pezzo ricambio in arrivo settimana prossima" },
{ id: "J003", assetId: "A002", customerId: "C001", openDate: "2026-04-15", closeDate: "2026-04-15", status: "chiuso", priority: "normale", type: "preventiva", assignee: "Mario Bianchi", description: "Manutenzione semestrale monitor multiparametrico - taratura sensori, verifica allarmi, pulizia.", parts: [{ partId: "P005", qty: 2 }], laborHours: 1.5, laborRate: 60, notes: "Manutenzione regolare OK" },
{ id: "J004", assetId: "A006", customerId: "C005", openDate: "2026-05-10", closeDate: "2026-05-10", status: "chiuso", priority: "normale", type: "preventiva", assignee: "Luca Verdi", description: "Sostituzione filtro antibatterico aspiratore + verifica pressione vuoto.", parts: [{ partId: "P002", qty: 1 }], laborHours: 0.5, laborRate: 60, notes: "" },
{ id: "J005", assetId: "A001", customerId: "C001", openDate: "2026-05-25", closeDate: "", status: "aperto", priority: "normale", type: "preventiva", assignee: "Mario Bianchi", description: "Verifica semestrale defibrillatore - test scarica, batteria, accessori.", parts: [], laborHours: 0, laborRate: 60, notes: "Programmata per fine mese" },
{ id: "J006", assetId: "A008", customerId: "C001", openDate: "2026-05-20", closeDate: "", status: "in attesa", priority: "alta", type: "taratura", assignee: "Mario Bianchi", description: "Verifica accuratezza erogazione pompa B.Braun (test ±5% su 4 volumi).", parts: [], laborHours: 0, laborRate: 60, notes: "Attesa strumento prestato dal collega" },
],
iecReports: [
{ id: "R001", reportNumber: "VSE-2026-001", date: "2026-04-15", assetId: "A002", apparecchio: "Monitor Multiparametrico Box 3", serial: "GE-MP-12389", cliente: "Ospedale San Raffaele", norm: "62353", equipClass: "I", patientType: "CF", verifyType: "periodica", technician: "Mario Bianchi", instrument: "FLUKE ESA612", instrumentCal: "CAL-2026-001", visual: { enclosure: true, powerCable: true, connectors: true, labels: true, documentation: true }, measures: [{ id: "pe", name: "Resistenza PE", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "0.12" }, { id: "ins_main", name: "Resistenza isolamento rete vs PE", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "45", invertPass: true }, { id: "ins_pa", name: "Resistenza isolamento PA vs rete", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "38", invertPass: true }, { id: "id_eq_dir", name: "Equipment Leakage Cl.I - diretto", unit: "µA", limit: "≤ 500", limitVal: 500, value: "42" }, { id: "id_eq_alt", name: "Equipment Leakage Cl.I - alternativo", unit: "µA", limit: "≤ 1000", limitVal: 1000, value: "85" }, { id: "id_pa_dir", name: "Dispersione PA CF - diretto", unit: "µA", limit: "≤ 50", limitVal: 50, value: "12" }], overallPass: true, notes: "" },
{ id: "R002", reportNumber: "VSE-2026-002", date: "2026-05-10", assetId: "A006", apparecchio: "Aspiratore chirurgico portatile", serial: "MED-V18-3456", cliente: "RSA Villa Serena", norm: "62353", equipClass: "II", patientType: "B", verifyType: "periodica", technician: "Luca Verdi", instrument: "FLUKE ESA612", instrumentCal: "CAL-2026-001", visual: { enclosure: true, powerCable: true, connectors: true, labels: true, documentation: true }, measures: [{ id: "ins_main", name: "Resistenza isolamento rete vs accessibili", unit: "MΩ", limit: "≥ 7", limitVal: 7, value: "55", invertPass: true }, { id: "ins_pa", name: "Resistenza isolamento PA vs rete", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "42", invertPass: true }, { id: "id_eq_dir", name: "Equipment Leakage Cl.II - diretto", unit: "µA", limit: "≤ 100", limitVal: 100, value: "18" }, { id: "id_eq_alt", name: "Equipment Leakage Cl.II - alternativo", unit: "µA", limit: "≤ 500", limitVal: 500, value: "45" }], overallPass: true, notes: "" },
{ id: "R003", reportNumber: "VSE-2026-003", date: "2026-05-18", assetId: "A009", apparecchio: "Elettrobisturi Sala Operatoria 2", serial: "ERBE-V3-66789", cliente: "Ospedale San Raffaele", norm: "62353", equipClass: "I", patientType: "CF", verifyType: "straordinaria", technician: "Mario Bianchi", instrument: "FLUKE ESA612", instrumentCal: "CAL-2026-001", visual: { enclosure: true, powerCable: true, connectors: false, labels: true, documentation: true }, measures: [{ id: "pe", name: "Resistenza PE", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "0.18" }, { id: "ins_main", name: "Resistenza isolamento rete vs PE", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "32", invertPass: true }, { id: "id_eq_dir", name: "Equipment Leakage Cl.I - diretto", unit: "µA", limit: "≤ 500", limitVal: 500, value: "680" }], overallPass: false, notes: "Equipment leakage fuori limite - probabile guasto a isolamento generatore. Pedaliera connettore allentato. Apparecchio FUORI SERVIZIO fino a riparazione." },
],
funcReports: [
{ id: "F001", reportNumber: "VF-2026-001", date: "2026-04-15", assetId: "A001", assetName: "Defibrillatore Sala Rianimazione", serial: "DE3456-789", cliente: "Ospedale San Raffaele", templateId: "defibrillatore", tplLabel: "Defibrillatore manuale", verifyType: "periodica", technician: "Mario Bianchi", sections: { visual: { items: { enclosure: true, electrodes: true, battery: true, cables: true } }, function: { items: { powerOn: true, selfTest: true, charge200J: true, discharge: true, monitor: true } }, measure: { measures: { energy200J: "198", energy360J: "354", hr_simulated: "75", chargeTime: "4.2" } } }, overallPass: true, notes: "" },
{ id: "F002", reportNumber: "VF-2026-002", date: "2026-05-10", assetId: "A010", assetName: "Saturimetro da dito x6", serial: "NON-PS-multi", cliente: "RSA Villa Serena", templateId: "pulsossimetro", tplLabel: "Pulsossimetro / SpO2 monitor", verifyType: "periodica", technician: "Luca Verdi", sections: { visual: { items: { enclosure: true, display: true, sensor: true, cables: true } }, spo2: { items: { powerOn: true, selfTest: true, sensorDetect: true }, measures: { spo2_97: "97", spo2_90: "90", hr_60: "60", hr_120: "120" } } }, overallPass: true, notes: "Tutti i 6 saturimetri verificati - OK" },
],
invoices: [
{ id: "I001", number: "F-2026-001", date: "2026-04-20", dueDate: "2026-05-20", customerId: "C001", status: "pagata", items: [{ description: "Manutenzione semestrale Monitor Multiparametrico GE B650", qty: 1, unitPrice: 180, vat: 22 }, { description: "Cavo ECG 3 derivazioni - sostituzione", qty: 1, unitPrice: 140, vat: 22 }, { description: "Verifica di Sicurezza Elettrica IEC 62353", qty: 1, unitPrice: 90, vat: 22 }], notes: "Pagato il 28/04/2026 - bonifico" },
{ id: "I002", number: "F-2026-002", date: "2026-05-15", dueDate: "2026-06-15", customerId: "C005", status: "emessa", items: [{ description: "Manutenzione preventiva aspiratore Medela Vario 18", qty: 1, unitPrice: 120, vat: 22 }, { description: "Filtri antibatterici - 10 pezzi", qty: 10, unitPrice: 18, vat: 22 }, { description: "Verifica VSE periodica", qty: 1, unitPrice: 90, vat: 22 }], notes: "" },
{ id: "I003", number: "F-2026-003", date: "2026-05-22", dueDate: "2026-06-22", customerId: "C001", status: "bozza", items: [{ description: "Preventivo riparazione elettrobisturi ERBE VIO 3 - sostituzione scheda generatore", qty: 1, unitPrice: 1850, vat: 22 }, { description: "Pedaliera ERBE - sostituzione", qty: 1, unitPrice: 380, vat: 22 }, { description: "Mano d'opera diagnostica + riparazione", qty: 4, unitPrice: 60, vat: 22 }, { description: "Verifica VSE straordinaria post-riparazione", qty: 1, unitPrice: 120, vat: 22 }], notes: "Preventivo per riparazione completa post fail VSE-2026-003" },
{ id: "I004", number: "F-2026-004", date: "2026-05-25", dueDate: "2026-06-25", customerId: "C002", status: "bozza", items: [{ description: "Verifica semestrale ecografo SonoSite Edge II", qty: 1, unitPrice: 150, vat: 22 }, { description: "Manutenzione sonde", qty: 2, unitPrice: 40, vat: 22 }], notes: "" },
],
instruments: [
{ id: "I001", brand: "FLUKE", model: "ESA612 Electrical Safety Analyzer", serial: "ESA612-456789", internalCode: "STR-001", calibrationDate: "2026-01-15", calibrationExpiry: "2027-01-15", calibrationCert: "ACCREDIA-CC-2026-456", calibrationLab: "Centro Taratura ACCREDIA 042", notes: "Analizzatore IEC 62353/60601 — utilizzo quotidiano" },
{ id: "I002", brand: "FLUKE", model: "ProSim 8 Vital Signs Simulator", serial: "PROSIM8-78901", internalCode: "STR-002", calibrationDate: "2025-12-10", calibrationExpiry: "2026-12-10", calibrationCert: "ACCREDIA-CC-2025-789", calibrationLab: "Centro Taratura ACCREDIA 042", notes: "Simulatore ECG, NIBP, SpO2, temperatura, IBP" },
{ id: "I003", brand: "Fluke Biomedical", model: "Impulse 7000DP Defibrillator Analyzer", serial: "IMP7000-3344", internalCode: "STR-003", calibrationDate: "2025-09-20", calibrationExpiry: "2026-09-20", calibrationCert: "ACCREDIA-CC-2025-512", calibrationLab: "Centro Taratura ACCREDIA 042", notes: "Analizzatore defibrillatori e pacemaker" },
],
procedures: [
{ id: "PR001", title: "Verifica funzionale defibrillatore manuale", category: "Defibrillatore", description: "Procedura standard per verifica funzionale defibrillatore manuale secondo IEC 60601-2-4. Tempo stimato 30 minuti.", steps: [{ n: 1, title: "Ispezione visiva", description: "Verificare integrità involucro, cavi, elettrodi, display e batteria.", expected: "Nessun danno visibile", photo: "" }, { n: 2, title: "Test di accensione e auto-diagnosi", description: "Accendere l'apparecchio e verificare che superi tutti i test interni.", expected: "Auto-diagnosi OK senza errori", photo: "" }, { n: 3, title: "Verifica energia 200J", description: "Caricare e scaricare a 200J su analizzatore. Misurare energia erogata.", expected: "200J ±15% (170-230J)", photo: "" }, { n: 4, title: "Verifica energia 360J", description: "Caricare e scaricare a 360J su analizzatore.", expected: "360J ±15% (306-414J)", photo: "" }, { n: 5, title: "Tempo di carica", description: "Misurare tempo di carica da 0 a 200J.", expected: "< 10 secondi", photo: "" }], notes: "Esempio Knowledge Base — completare con i tuoi procedure standard" },
{ id: "PR002", title: "Sostituzione filtro aspiratore Medela", category: "Aspiratore", description: "Procedura rapida sostituzione filtro antibatterico aspiratore Medela Vario 18.", steps: [{ n: 1, title: "Spegnere apparecchio", description: "Spegnere e scollegare dalla rete.", expected: "Apparecchio in stato sicuro", photo: "" }, { n: 2, title: "Rimuovere vecchio filtro", description: "Svitare attacco e rimuovere il filtro esausto.", expected: "Filtro rimosso", photo: "" }, { n: 3, title: "Installare nuovo filtro", description: "Inserire filtro nuovo verificando direzione del flusso (freccia).", expected: "Filtro installato in direzione corretta", photo: "" }, { n: 4, title: "Test di tenuta", description: "Accendere e verificare livello vuoto raggiunto.", expected: "-80 kPa entro 10 secondi", photo: "" }], notes: "" },
],
quotes: [],
orders: [],
withdrawals: [],
};
const DEMO_LOCKED = true; // true nella build demo per disabilitare modifiche
const IVA_DEFAULT = 22;
/* ═══ STILI FORM UNIFICATI ════════════════════════════════════════════
Un unico set di stili per TUTTI i form, così desktop e mobile sono
coerenti ovunque (apparecchi, job, verifiche, strumenti, procedure). */
const FORM_INP = { width: "100%", background: "#0F0F14", border: "1px solid #2a3040", borderRadius: 9, padding: "11px 13px", color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color .15s" };
const FORM_LBL = { fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .7, fontWeight: 700, display: "block", marginBottom: 6 };
const FORM_FLD = { display: "flex", flexDirection: "column", marginBottom: 0 };
const FORM_ROW = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 };
const FORM_COL = { display: "flex", flexDirection: "column", minWidth: 0 };
const FORM_SECTION = { fontSize: 11, color: "#2DD4BF", fontWeight: 800, marginBottom: 12, marginTop: 4, textTransform: "uppercase", letterSpacing: .8, display: "flex", alignItems: "center", gap: 6 };
const FORM_BTN_PRIMARY = { background: "linear-gradient(135deg,#2DD4BF,#0D9488)", color: "#06251f", border: "none", borderRadius: 9, padding: "11px 22px", cursor: "pointer", fontWeight: 800, fontSize: 14, boxShadow: "0 2px 10px #2DD4BF33" };
const FORM_BTN_GHOST = { background: "#1a1a22", border: "1px solid #2a3040", borderRadius: 9, color: "#94a3b8", padding: "11px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14 };
const FORM_FOOTER = { display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 16, marginTop: 16, borderTop: "1px solid #1e2a3a" };
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
/* ═══ DATA ACCESS LAYER (Supabase-ready) ══════════════════════════
Questo strato disaccoppia la logica dati dai componenti.
Oggi usa gli array in memoria + localStorage (via saveData).
Domani basterà sostituire l'implementazione di queste funzioni
con chiamate Supabase, SENZA toccare i componenti che le usano.
Convenzioni allineate a Postgres/Supabase:
- id: UUID v4 (string) — compatibile con colonna uuid di Supabase
- createdAt / updatedAt: ISO 8601 timestamp (string) — mappano su timestamptz
──────────────────────────────────────────────────────────────── */
/* genUUID — UUID v4 conforme RFC 4122.
Usa crypto.randomUUID se disponibile (tutti i browser moderni),
altrimenti fallback manuale per browser molto vecchi. */
function genUUID() {
try {
if (typeof crypto !== "undefined" && crypto.randomUUID)
return crypto.randomUUID();
}
catch (e) { }
return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
const r = Math.random() * 16 | 0;
const v = c === "x" ? r : (r & 0x3 | 0x8);
return v.toString(16);
});
}
/* withCreateMeta — prepara un record nuovo: id UUID se mancante + timestamp.
Preserva id esistenti (retrocompatibilità con vecchi ID tipo "A123"). */
function withCreateMeta(record) {
const now = new Date().toISOString();
return Object.assign(Object.assign({}, record), { id: record.id || genUUID(), createdAt: record.createdAt || now, updatedAt: now });
}
/* withUpdateMeta — aggiorna solo updatedAt (mantiene createdAt e id) */
function withUpdateMeta(record) {
return Object.assign(Object.assign({}, record), { updatedAt: new Date().toISOString() });
}
/* upsertInList — inserisce o aggiorna per id (immutabile, React-friendly) */
function upsertInList(list, record) {
const exists = list.some(x => x.id === record.id);
if (exists)
return list.map(x => x.id === record.id ? record : x);
return [...list, record];
}
/* removeFromList — rimuove per id (nuovo array) */
function removeFromList(list, id) {
return list.filter(x => x.id !== id);
}
/* ═══ SUPABASE ADAPTER (opt-in, disattivato di default) ═══════════════
L'app funziona su localStorage finché SUPABASE_CONFIG resta vuoto.
Per attivare Supabase:
1. Crea il progetto su supabase.com e lancia supabase-schema.sql
2. Inserisci url e anonKey qui sotto (o via localStorage, vedi sotto)
3. Ricarica l'app → potrai fare Login, Sync Up e Sync Down dalle Impostazioni
SICUREZZA: la anon key è pubblica per design; la sicurezza vera è garantita
dalle policy RLS lato database. Non inserire MAI qui la service_role key.
──────────────────────────────────────────────────────────────────── */
// Config: lasciata vuota = Supabase disattivato. Può anche essere impostata
// runtime dall'utente e salvata in localStorage (chiave "medtrace-supabase-config").
function getSupabaseConfig() {
try {
const raw = localStorage.getItem("medtrace-supabase-config");
if (raw) {
const c = JSON.parse(raw);
if (c.url && c.anonKey)
return c;
}
}
catch (e) { }
return { url: "", anonKey: "" }; // ← vuoto = usa localStorage
}
const SUPABASE_ENABLED = () => {
const c = getSupabaseConfig();
return !!(c.url && c.anonKey);
};
// Carica la libreria supabase-js da CDN on-demand (solo se serve)
let _supabaseClient = null;
let _supabaseLibPromise = null;
function getSupabaseClient() {
return __awaiter(this, void 0, void 0, function* () {
const cfg = getSupabaseConfig();
if (!cfg.url || !cfg.anonKey)
return null;
if (_supabaseClient)
return _supabaseClient;
// Carica la lib UMD da CDN una volta sola
if (!window.supabase) {
if (!_supabaseLibPromise) {
_supabaseLibPromise = new Promise((resolve, reject) => {
const s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
s.onload = resolve;
s.onerror = () => reject(new Error("Impossibile caricare la libreria Supabase (sei online?)"));
document.head.appendChild(s);
});
}
yield _supabaseLibPromise;
}
_supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
return _supabaseClient;
});
}
// Mappa: nome stato app (camelCase) → nome tabella Supabase (snake_case)
const SUPABASE_TABLES = {
customers: "customers",
assets: "assets",
parts: "parts",
jobs: "jobs",
iecReports: "iec_reports",
funcReports: "func_reports",
invoices: "invoices",
quotes: "quotes",
orders: "orders",
withdrawals: "withdrawals",
instruments: "instruments",
procedures: "procedures",
};
// Converte camelCase ↔ snake_case sui campi dei record (best-effort)
function toSnakeRecord(obj) {
const out = {};
for (const k in obj) {
const sk = k.replace(/[A-Z]/g, m => "_" + m.toLowerCase());
out[sk] = obj[k];
}
return out;
}
function toCamelRecord(obj) {
const out = {};
for (const k in obj) {
const ck = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
out[ck] = obj[k];
}
return out;
}
/* supabaseSyncUp — carica tutti i dati locali su Supabase (upsert).
Usato per la prima migrazione o per pushare modifiche offline. */
function supabaseSyncUp(localData) {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
throw new Error("Supabase non configurato");
const results = {};
for (const [stateKey, table] of Object.entries(SUPABASE_TABLES)) {
const rows = (localData[stateKey] || []).map(toSnakeRecord);
if (rows.length === 0) {
results[table] = 0;
continue;
}
const { error } = yield client.from(table).upsert(rows, { onConflict: "id" });
if (error)
throw new Error("Errore sync " + table + ": " + error.message);
results[table] = rows.length;
}
return results;
});
}
/* supabaseSyncDown — scarica tutti i dati da Supabase (rispetta RLS).
Ritorna un oggetto con gli array per ogni entità, in camelCase. */
function supabaseSyncDown() {
return __awaiter(this, void 0, void 0, function* () {
const client = yield getSupabaseClient();
if (!client)
throw new Error("Supabase non configurato");
const out = {};
for (const [stateKey, table] of Object.entries(SUPABASE_TABLES)) {
const { data, error } = yield client.from(table).select("*");
if (error)
throw new Error("Errore lettura " + table + ": " + error.message);
out[stateKey] = (data || []).map(toCamelRecord);
}
return out;
});
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
function downloadCSV(filename, rows, cols) {
var csvData = buildCSV(rows, cols);
try {
// BOM UTF-8 per Excel italiano
var blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8' });
var url = URL.createObjectURL(blob);
var a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "CSV scaricato: " + filename, color: "#22c55e" } }));
}
catch (err) {
// Fallback: mostra il modal con CSV da copiare
window.dispatchEvent(new CustomEvent("show-csv", { detail: { filename: filename, data: csvData } }));
}
}
function downloadJSON(filename, data) {
var jsonData = JSON.stringify(data, null, 2);
try {
var blob = new Blob([jsonData], { type: 'application/json' });
var url = URL.createObjectURL(blob);
var a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
window.dispatchEvent(new CustomEvent("toast", { detail: { msg: "Backup scaricato: " + filename, color: "#22c55e" } }));
}
catch (err) {
// Fallback: mostra il modal con JSON da copiare
window.dispatchEvent(new CustomEvent("show-csv", {
detail: { filename: filename, data: jsonData, isJson: true }
}));
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
.header { background: #2DD4BF; color: #fff; padding: 16px 20px; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.header h1 { font-size: 18px; font-weight: 900; letter-spacing: -0.5px; margin-top:4px; }
.header-logo { height: 36px; object-fit: contain; filter: brightness(0) invert(1); margin-bottom: 4px; display: block; }
.header .sub { font-size: 10px; opacity: .8; margin-top: 3px; }
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
/* Genera il prossimo numero rapporto in formato PREFIX-YYYY-NNN.
Trova l'ultimo numero usato nell'anno corrente e lo incrementa.
Esempi: VSE-2026-001 → VSE-2026-002 ; se nessuno esiste, parte da NNN=001 */
const getNextReportNumber = (reports, prefix) => {
const year = new Date().getFullYear();
const pattern = new RegExp("^" + prefix + "-" + year + "-(\\d+)$");
let maxNum = 0;
(reports || []).forEach(r => {
const m = (r.reportNumber || "").match(pattern);
if (m)
maxNum = Math.max(maxNum, parseInt(m[1], 10));
});
const next = String(maxNum + 1).padStart(3, "0");
return prefix + "-" + year + "-" + next;
};
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
<div><h1>${(company.name || 'Documento')}</h1><div class="sub">${company.subtitle || ''}</div></div>
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
${(job.timeline && job.timeline.length > 0) ? `
<div style="margin-top:14px;padding-top:10px;border-top:1px solid #e5e7eb">
<div style="font-size:11px;font-weight:700;color:#1e293b;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px">Timeline interventi</div>
<table style="width:100%;font-size:10px;border-collapse:collapse">
<thead><tr style="background:#f1f5f9;color:#64748b">
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1;width:90px">Data / Ora</th>
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1;width:140px">Tipo</th>
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1">Descrizione</th>
<th style="padding:5px 6px;text-align:right;border:1px solid #cbd5e1;width:50px">Min.</th>
<th style="padding:5px 6px;text-align:left;border:1px solid #cbd5e1;width:100px">Tecnico</th>
</tr></thead>
<tbody>
${job.timeline.map(t => `
<tr>
<td style="padding:5px 6px;border:1px solid #e5e7eb;font-family:monospace">${t.date || ''} ${t.time || ''}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb">${(t.type || '').replace(/_/g, ' ')}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb">${t.description || ''}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:right;font-family:monospace">${t.durationMin || 0}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb">${t.technician || ''}</td>
</tr>
`).join('')}
</tbody>
<tfoot><tr style="background:#f8fafc;font-weight:700">
<td colspan="3" style="padding:5px 6px;border:1px solid #e5e7eb;text-align:right">Tempo totale lavorato:</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb;text-align:right;font-family:monospace">${job.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0)}</td>
<td style="padding:5px 6px;border:1px solid #e5e7eb;font-family:monospace">${(job.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0) / 60).toFixed(1)}h</td>
</tr></tfoot>
</table>
</div>` : ''}
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
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString('it-IT')}</span>
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
<title>Preventivo ${invoice.number}</title>
<style>${PDF_STYLE}</style></head><body>
<div class="header">
<div>
<h1>${(company.name || 'Documento')}</h1>
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
<div class="section-title">Voci Preventivo</div>
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
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString('it-IT')}</span>
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
const isNotAvail = rep.verifyStatus === "non_disponibile";
const esitoColor = isNotAvail ? '#f59e0b' : (rep.overallPass ? '#059669' : '#dc2626');
const esitoLabel = isNotAvail ? 'NON ESEGUITA' : (rep.overallPass ? 'CONFORME' : 'NON CONFORME');
const reasonLabel = {
in_uso: "Apparecchio in uso su paziente",
non_trovato: "Apparecchio non reperibile in reparto",
trasferito: "Apparecchio trasferito ad altro reparto",
riparazione_esterna: "In riparazione esterna",
dismesso: "Dismesso / non più in uso",
rifiuto_reparto: "Reparto non autorizza intervento ora",
altro: "Altro motivo"
}[rep.notAvailableReason] || rep.notAvailableReason || "Non specificato";
const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
<title>Verifica ${rep.reportNumber || rep.id}</title>
<style>${PDF_STYLE}</style></head><body>
<div class="header">
<div>
<h1>${(company.name || 'Documento')}</h1>
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
${rep.norm !== '61010' && rep.equipClass !== 'III' ? `<div class="kv"><span class="kv-label">Metodo misura dispersione</span><span class="kv-value" style="text-transform:capitalize">${rep.leakageMethod || 'diretto'}</span></div>` : ''}
<div class="kv"><span class="kv-label">Classe apparecchio</span><span class="kv-value">Classe ${rep.equipClass || '—'}</span></div>
${rep.norm !== '61010' ? `<div class="kv"><span class="kv-label">Tipo parte paziente</span><span class="kv-value">Tipo ${rep.patientType || 'BF'}</span></div>` : ''}
</div>
</div>
${isNotAvail ? `
<div class="section">
<div class="section-title" style="color:#d97706">⚠ Verifica Non Eseguita</div>
<table style="width:100%;border-collapse:collapse;font-size:11px">
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7;width:35%"><strong>Motivo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${reasonLabel}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Reparto / Unità</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentName || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Referente reparto</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentContact || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Data tentativo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.date}</td></tr>
</table>
<p style="margin-top:10px;font-size:11px;color:#64748b;font-style:italic">Il presente rapporto documenta l'impossibilità di eseguire la verifica programmata. La verifica sarà ripianificata e l'apparecchio resterà in stato "verifica scaduta" fino al completamento.</p>
</div>` : `
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
</div>`}
<div class="total-box" style="margin-top:12px">
<span class="label">ESITO FINALE VERIFICA</span>
<span class="amount">${esitoLabel}</span>
</div>
${rep.notes ? `<div style="margin-top:12px;padding:8px 12px;background:#f8fafc;border-left:3px solid #64748b;font-size:11px"><strong>Note:</strong> ${rep.notes}</div>` : ''}
<div style="margin-top:32px;display:flex">
<div style="display:flex;justify-content:space-around;gap:30px;margin-top:30px;flex-wrap:wrap">
<div style="flex:1;min-width:200px;text-align:center">
${rep.technicianSignature ? `<img src="${rep.technicianSignature}" style="max-height:60px;max-width:200px;display:block;margin:0 auto 4px"/>` : '<div style="height:60px"></div>'}
<div style="border-top:1px solid #94a3b8;padding-top:6px;font-size:10px;color:#64748b">Firma Tecnico Verificatore<br><strong style="color:#1e293b">${rep.technician || '—'}</strong></div>
</div>
${(rep.verifyStatus === "non_disponibile" || rep.departmentSignature || rep.departmentName) ? `
<div style="flex:1;min-width:200px;text-align:center">
${rep.departmentSignature ? `<img src="${rep.departmentSignature}" style="max-height:60px;max-width:200px;display:block;margin:0 auto 4px"/>` : '<div style="height:60px"></div>'}
<div style="border-top:1px solid #94a3b8;padding-top:6px;font-size:10px;color:#64748b">Firma Referente Reparto<br><strong style="color:#1e293b">${rep.departmentContact || rep.departmentName || '—'}</strong>${rep.departmentName && rep.departmentContact ? `<br><span style="font-size:9px">${rep.departmentName}</span>` : ''}</div>
</div>` : ''}
</div>
</div>
<div class="footer">
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString('it-IT')} — ${normL}</span>
<span>${rep.reportNumber || rep.id} · ${(asset === null || asset === void 0 ? void 0 : asset.serial) || ''}</span>
</div>
</body></html>`;
openPrintWindow(html);
}
function generateFuncPDF(rep, asset, customer, company) {
const tpl = (typeof FUNC_TEMPLATES !== "undefined" ? FUNC_TEMPLATES : {})[rep.templateId] || { label: "Verifica Funzionale", icon: "›", norm: "IEC 60601-1", sections: [] };
const isNotAvail = rep.verifyStatus === "non_disponibile";
const esitoColor = isNotAvail ? "#f59e0b" : (rep.overallPass ? "#0D9488" : "#dc2626");
const esitoLabel = isNotAvail ? "NON ESEGUITA" : (rep.overallPass ? "CONFORME" : "NON CONFORME");
const reasonLabel = {
in_uso: "Apparecchio in uso su paziente",
non_trovato: "Apparecchio non reperibile in reparto",
trasferito: "Apparecchio trasferito ad altro reparto",
riparazione_esterna: "In riparazione esterna",
dismesso: "Dismesso / non più in uso",
rifiuto_reparto: "Reparto non autorizza intervento ora",
altro: "Altro motivo"
}[rep.notAvailableReason] || rep.notAvailableReason || "Non specificato";
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
<h1>${(company.name || 'Documento')}</h1>
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
${isNotAvail ? `
<div class="section">
<div class="section-title" style="color:#d97706">⚠ Verifica Non Eseguita</div>
<table style="width:100%;border-collapse:collapse;font-size:11px">
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7;width:35%"><strong>Motivo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${reasonLabel}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Reparto / Unità</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentName || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Referente reparto</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.departmentContact || '—'}</td></tr>
<tr><td style="padding:6px;border:1px solid #cbd5e1;background:#fef3c7"><strong>Data tentativo</strong></td><td style="padding:6px;border:1px solid #e5e7eb">${rep.date}</td></tr>
</table>
<p style="margin-top:10px;font-size:11px;color:#64748b;font-style:italic">Il presente rapporto documenta l'impossibilità di eseguire la verifica funzionale programmata. La verifica sarà ripianificata.</p>
</div>` : sectionsHtml}
${rep.notes ? `<div style="margin-top:8px;padding:8px 10px;background:#f8fafc;border-left:3px solid #64748b;font-size:10px"><strong>Note:</strong> ${rep.notes}</div>` : ""}
<div class="total-box">
<span class="label">ESITO FINALE VERIFICA FUNZIONALE</span>
<span class="amount">${esitoLabel}</span>
</div>
<div style="display:flex;justify-content:space-around;gap:30px;margin-top:30px;flex-wrap:wrap">
<div style="flex:1;min-width:200px;text-align:center">
${rep.technicianSignature ? `<img src="${rep.technicianSignature}" style="max-height:60px;max-width:200px;display:block;margin:0 auto 4px"/>` : '<div style="height:60px"></div>'}
<div style="border-top:1px solid #94a3b8;padding-top:6px;font-size:10px;color:#64748b">Firma Tecnico Verificatore<br><strong style="color:#1e293b">${rep.technician || '—'}</strong></div>
</div>
${(isNotAvail || rep.departmentSignature || rep.departmentName) ? `
<div style="flex:1;min-width:200px;text-align:center">
${rep.departmentSignature ? `<img src="${rep.departmentSignature}" style="max-height:60px;max-width:200px;display:block;margin:0 auto 4px"/>` : '<div style="height:60px"></div>'}
<div style="border-top:1px solid #94a3b8;padding-top:6px;font-size:10px;color:#64748b">Firma Referente Reparto<br><strong style="color:#1e293b">${rep.departmentContact || rep.departmentName || '—'}</strong>${rep.departmentName && rep.departmentContact ? `<br><span style="font-size:9px">${rep.departmentName}</span>` : ''}</div>
</div>` : ''}
</div>
<div class="footer">
<span>${(company.name || 'Documento')} — Generato il ${new Date().toLocaleDateString("it-IT")} — ${tpl.norm}</span>
<span>${rep.reportNumber || rep.id} · ${(asset === null || asset === void 0 ? void 0 : asset.serial) || ""}</span>
</div>
</body></html>`;
openPrintWindow(html);
}
/* ═══ IEC REPORT FORM ════════════════════════════════════════ */
/* ═══ VERIFICA FUNZIONALE FORM ══════════════════════════════ */
function FuncVerifyForm({ initial, assetId: propAssetId, assets, customers, existingReports, onSave, onClose }) {
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
verifyStatus: "completata", // "completata" | "non_disponibile"
notAvailableReason: "", departmentName: "", departmentContact: "",
technicianSignature: "", departmentSignature: ""
};
const [f, setF] = React.useState(() => {
const init = initial || blank;
if (!initial && !init.reportNumber) {
init.reportNumber = getNextReportNumber(existingReports || [], "VF");
}
if (!init.sections)
return Object.assign(Object.assign({}, init), { sections: {} });
return init;
});
const [errors, setErrors] = React.useState({});
const sv = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
// Initialize section data when template changes
React.useEffect(() => {
setF(x => (Object.assign(Object.assign({}, x), { templateId })));
}, [templateId]);
const getSectionData = (secId) => f.sections[secId] || { items: {}, measures: {} };
const setItem = (secId, itemId, val) => setF(x => (Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, getSectionData(secId)), { items: Object.assign(Object.assign({}, getSectionData(secId).items), { [itemId]: val }) }) }) })));
const setMeasure = (secId, mId, val) => setF(x => (Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, getSectionData(secId)), { measures: Object.assign(Object.assign({}, getSectionData(secId).measures), { [mId]: val }) }) }) })));
// Compute overall pass
const computePass = () => {
for (const sec of tpl.sections) {
// If section is marked N/A entirely, skip it
if (sd_isNA(sec.id))
continue;
const sd = getSectionData(sec.id);
// Any item explicitly failed (and not N/A) → fail
for (const item of (sec.items || [])) {
if (sd.items[item.id] === false)
return false;
}
// Any measure out of range → fail (N/A measures stored as "na" string, skip them)
for (const m of (sec.measures || [])) {
const raw = sd.measures[m.id];
if (raw === "na")
continue;
const v = parseFloat(raw || "");
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
// Section is entirely N/A?
const sd_isNA = (secId) => {
const sd = getSectionData(secId);
return sd._sectionNA === true;
};
// Mark entire section as N/A or restore
const setSectionNA = (secId, isNA) => {
setF(x => {
const old = x.sections[secId] || { items: {}, measures: {} };
return Object.assign(Object.assign({}, x), { sections: Object.assign(Object.assign({}, x.sections), { [secId]: Object.assign(Object.assign({}, old), { _sectionNA: isNA }) }) });
});
};
const pass = computePass();
const FLD = FORM_FLD;
const LBL = FORM_LBL;
const INP = FORM_INP;
const isMobile = useMedia("(max-width:600px)");
const renderItemRow = ({ secId, item }) => {
const val = getSectionData(secId).items[item.id];
const STATES = [
{ v: true, lbl: "✓", col: "#22c55e", title: "Conforme" },
{ v: false, lbl: "✗", col: "#ef4444", title: "Non conforme" },
{ v: "na", lbl: "N/A", col: "#64748b", title: "Non applicabile a questa macchina" },
{ v: null, lbl: "—", col: "#475569", title: "Non verificato" },
];
const isOpt = item.optional || /opzionale|optional/i.test(item.text || "");
return (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1a2030", gap: 10 } },
React.createElement("span", { style: { fontSize: 12, color: val === "na" ? "#475569" : "#94a3b8", flex: 1, textDecoration: val === "na" ? "line-through" : "none" } },
item.text,
isOpt && React.createElement("span", { style: { fontSize: 9, color: "#64748b", marginLeft: 6, padding: "1px 5px", border: "1px solid #2a3040", borderRadius: 3 } }, "opz.")),
React.createElement("div", { style: { display: "flex", gap: 4, flexShrink: 0 } }, STATES.map((s, i) => (React.createElement("button", { key: i, title: s.title, onClick: () => setItem(secId, item.id, s.v), style: {
background: val === s.v ? s.col + "22" : "#141418",
border: "1px solid " + (val === s.v ? s.col + "66" : "#202028"),
color: val === s.v ? s.col : "#475569",
borderRadius: 5, padding: "4px 8px", cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, s.lbl))))));
};
const renderMeasureRow = ({ secId, m }) => {
const raw = getSectionData(secId).measures[m.id] || "";
const isNA = raw === "na";
const vNum = isNA ? NaN : parseFloat(raw);
let pass = null;
if (!isNA && !isNaN(vNum)) {
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
return (React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 90px 60px 38px 30px", gap: 6, alignItems: "center", marginBottom: 6, background: "#0D0D12", borderRadius: 6, padding: "6px 8px", opacity: isNA ? 0.55 : 1 } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8", textDecoration: isNA ? "line-through" : "none" } }, m.name),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontFamily: "monospace" } }, m.expected || ""),
isNA ? (React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontStyle: "italic", textAlign: "center" } }, "N/A")) : (React.createElement("input", { type: "number", step: "any", value: raw, onChange: e => setMeasure(secId, m.id, e.target.value), placeholder: "\u2014", style: { background: "#16161C", border: "1px solid #2a3040", borderRadius: 5, padding: "4px 7px", color: "#e2e8f0", fontSize: 12, outline: "none", fontFamily: "monospace" } })),
React.createElement("span", { style: { fontWeight: 700, fontSize: 13, textAlign: "center", color: pass === null ? "#475569" : pass ? "#22c55e" : "#ef4444" } }, m.unit),
React.createElement("button", { title: isNA ? "Ripristina misura" : "Marca come Non Applicabile", onClick: () => setMeasure(secId, m.id, isNA ? "" : "na"), style: {
background: isNA ? "#64748b22" : "#141418",
border: "1px solid " + (isNA ? "#64748b66" : "#202028"),
color: isNA ? "#94a3b8" : "#475569",
borderRadius: 5, padding: "3px 4px", cursor: "pointer", fontSize: 9, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "N/A")));
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
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
React.createElement(AssetCombobox, { value: selectedAssetId, onChange: id => {
setSelectedAssetId(id);
setF(x => (Object.assign(Object.assign({}, x), { assetId: id })));
const a = assets.find(x => x.id === id);
if (a) {
const t = guessTemplate(a.name);
setTemplateId(t);
}
}, assets: assets, customers: customers, placeholder: "Cerca apparecchio\u2026" }))),
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
React.createElement("input", { value: f.instrument, onChange: sv("instrument"), placeholder: "es. Fluke Impulse 6000D", style: INP }))),
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 8, padding: "10px 14px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Stato verifica"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "completata" }))), style: {
background: (f.verifyStatus || "completata") === "completata" ? "#22c55e22" : "#141418",
border: "1px solid " + ((f.verifyStatus || "completata") === "completata" ? "#22c55e66" : "#2a3040"),
color: (f.verifyStatus || "completata") === "completata" ? "#22c55e" : "#94a3b8",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u2713 Verifica completata"),
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "non_disponibile" }))), style: {
background: f.verifyStatus === "non_disponibile" ? "#f59e0b22" : "#141418",
border: "1px solid " + (f.verifyStatus === "non_disponibile" ? "#f59e0b66" : "#2a3040"),
color: f.verifyStatus === "non_disponibile" ? "#f59e0b" : "#94a3b8",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u26A0 Apparecchio non disponibile")),
f.verifyStatus === "non_disponibile" && (React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "#f59e0b08", border: "1px solid #f59e0b33", borderRadius: 6, fontSize: 11, color: "#fbbf24" } }, "La verifica non sar\u00E0 eseguita. Sar\u00E0 generato un report di mancata esecuzione da far firmare al reparto."))),
f.verifyStatus === "non_disponibile" ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { background: "#f59e0b08", border: "1px solid #f59e0b44", borderRadius: 10, padding: "14px 16px" } },
React.createElement("div", { style: { fontSize: 11, color: "#f59e0b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "\u26A0 Apparecchio non disponibile per verifica"),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Motivo mancata esecuzione *"),
React.createElement("select", { value: f.notAvailableReason || "", onChange: sv("notAvailableReason"), style: INP },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
React.createElement("option", { value: "in_uso" }, "Apparecchio in uso su paziente"),
React.createElement("option", { value: "non_trovato" }, "Apparecchio non reperibile in reparto"),
React.createElement("option", { value: "trasferito" }, "Apparecchio trasferito ad altro reparto"),
React.createElement("option", { value: "riparazione_esterna" }, "In riparazione esterna"),
React.createElement("option", { value: "dismesso" }, "Dismesso / non pi\u00F9 in uso"),
React.createElement("option", { value: "rifiuto_reparto" }, "Reparto non autorizza intervento ora"),
React.createElement("option", { value: "altro" }, "Altro (specificare nelle note)"))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 operativa *"),
React.createElement("input", { value: f.departmentName || "", onChange: sv("departmentName"), placeholder: "es. UO Cardiologia", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente reparto"),
React.createElement("input", { value: f.departmentContact || "", onChange: sv("departmentContact"), placeholder: "es. Caposala Mario Rossi", style: INP }))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Note aggiuntive"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 2, style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" } })))),
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (presa visione)", value: f.departmentSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 }))))) : (React.createElement(React.Fragment, null,
tpl.sections.map(sec => {
const isNA = sd_isNA(sec.id);
return (React.createElement("div", { key: sec.id, style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid " + (isNA ? "#475569" : "#1e2a3a"), opacity: isNA ? 0.6 : 1 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: sec.note ? 4 : 10 } },
React.createElement("div", { style: { fontSize: 11, color: isNA ? "#64748b" : "#5EEAD4", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, textDecoration: isNA ? "line-through" : "none" } },
sec.title,
isNA && " (N/A)"),
React.createElement("button", { title: isNA ? "Riabilita sezione" : "Marca tutta la sezione come Non Applicabile", onClick: () => setSectionNA(sec.id, !isNA), style: {
background: isNA ? "#64748b22" : "#141418",
border: "1px solid " + (isNA ? "#64748b66" : "#2a3040"),
color: isNA ? "#94a3b8" : "#64748b",
borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, isNA ? "↻ Riabilita" : "N/A sez.")),
sec.note && React.createElement("div", { style: { fontSize: 10, color: "#64748b", marginBottom: 10, fontStyle: "italic" } }, sec.note),
!isNA && (sec.items || []).map(item => renderItemRow({ secId: sec.id, item })),
!isNA && (sec.measures || []).length > 0 && (React.createElement("div", { style: { marginTop: (sec.items || []).length > 0 ? 10 : 0 } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 90px 60px 38px 30px", gap: 6, marginBottom: 6 } }, ["Misura", "Atteso", "Valore", "U.M.", ""].map((h, i) => React.createElement("div", { key: i, style: { fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase" } }, h))),
(sec.measures || []).map(m => renderMeasureRow({ secId: sec.id, m }))))));
}),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Note e osservazioni"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 3, style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical" } })),
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature || "", onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 })),
React.createElement("div", { style: { marginTop: 8, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 (opzionale)"),
React.createElement("input", { value: f.departmentName || "", onChange: sv("departmentName"), placeholder: "es. UO Cardiologia", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente (opzionale)"),
React.createElement("input", { value: f.departmentContact || "", onChange: sv("departmentContact"), placeholder: "es. Caposala Rossi", style: INP })))))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => {
const errs = {};
if (!f.assetId && !selectedAssetId)
errs.assetId = "Seleziona un apparecchio";
if (!f.date)
errs.date = "Inserisci la data";
if (!f.technician)
errs.technician = "Inserisci il nome del tecnico";
if (f.verifyStatus === "non_disponibile") {
if (!f.notAvailableReason)
errs.notAvailableReason = "Seleziona il motivo della mancata esecuzione";
if (!f.departmentName)
errs.departmentName = "Inserisci il nome del reparto";
}
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(Object.assign(Object.assign({}, f), { assetId: f.assetId || selectedAssetId, overallPass: f.verifyStatus === "non_disponibile" ? null : pass, templateId }));
} }, "Salva rapporto"))));
}
function IECReportForm({ initial, assetId: propAssetId, assets, customers, existingReports, onSave, onClose }) {
const getMeasures = React.useCallback((norm, cls, patientType, method) => {
// ── IEC 61010-1 (Strumentazione da laboratorio) ──────────────
if (norm === "61010")
return [
{ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.1", limitVal: 0.1, value: "" },
{ id: "ins", name: "Resistenza di isolamento (500 Vdc)", unit: "MΩ", limit: "≥ 1", limitVal: 1, value: "", invertPass: true },
{ id: "id1", name: "Corrente di dispersione — carcassa", unit: "mA", limit: "≤ 3.5", limitVal: 3.5, value: "" },
{ id: "id2", name: "Corrente di dispersione — circuito prova", unit: "mA", limit: "≤ 0.5", limitVal: 0.5, value: "" },
];
// ── IEC 62353:2014 — limiti corretti per test periodico in servizio ──
// Metodi: Direct (D), Differential (DIFF), Alternative/Substitution (ALT)
// Il metodo si sceglie in base alla configurazione del sito (es. presenza di RCD, isolamento, ecc.)
const pt = patientType || "BF";
const m = method || "diretto"; // diretto | differenziale | alternativo
// Label e limiti Equipment Leakage in base a classe + metodo (IEC 62353:2014 Tab.4)
// Cl.I diretto/differenziale ≤500µA, alternativo ≤1000µA
// Cl.II diretto/differenziale ≤100µA, alternativo ≤500µA
const eqLim = {
"I": { diretto: 500, differenziale: 500, alternativo: 1000 },
"II": { diretto: 100, differenziale: 100, alternativo: 500 },
};
const eqVal = eqLim[cls] ? eqLim[cls][m] : 500;
const methodLabel = m === "diretto" ? "metodo diretto" : m === "differenziale" ? "metodo differenziale" : "metodo alternativo";
const methodShort = m === "diretto" ? "D" : m === "differenziale" ? "DIFF" : "ALT";
// Applied Part Leakage limits (µA) — Tab.5 IEC 62353:2014 (limite identico per i tre metodi)
const apLim = {
"B": null, // tipo B: no parte applicata isolata, non si misura
"BF": { lim: "≤ 5000", val: 5000 },
"CF": { lim: "≤ 50", val: 50 },
};
const ap = apLim[pt];
// ── Classe III — SELV (alimentazione interna / sicura ≤ 25Vac / 60Vdc) ──
if (cls === "III")
return [
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
// Nota: in Cl.III no PE, no Equipment Leakage (tensione SELV)
];
// ── Classe II — doppio isolamento (no PE) ─────────────────────
if (cls === "II")
return [
{ id: "ins_main", name: "Resistenza isolamento — rete vs accessibili (500 Vdc)", unit: "MΩ", limit: "≥ 7", limitVal: 7, value: "", invertPass: true },
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "id_eq", name: "Equipment Leakage Cl.II (" + methodLabel + ")", unit: "µA", limit: "≤ " + eqVal, limitVal: eqVal, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
// ── Classe I — con PE (default) ───────────────────────────────
return [
{ id: "pe", name: "Resistenza conduttore di protezione (PE)", unit: "Ω", limit: "≤ 0.3", limitVal: 0.3, value: "" },
{ id: "ins_main", name: "Resistenza isolamento — rete vs PE (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "ins_pa", name: "Resistenza isolamento parte applicata — rete (500 Vdc)", unit: "MΩ", limit: "≥ 2", limitVal: 2, value: "", invertPass: true },
{ id: "id_eq", name: "Equipment Leakage Cl.I (" + methodLabel + ")", unit: "µA", limit: "≤ " + eqVal, limitVal: eqVal, value: "" },
...(ap ? [{ id: "id_pa", name: "Dispersione parte applicata " + pt + " (" + methodLabel + ")", unit: "µA", limit: ap.lim, limitVal: ap.val, value: "" }] : []),
];
}, []);
const blank = { id: "R" + Date.now().toString().slice(-6), reportNumber: "", norm: "62353", date: new Date().toISOString().slice(0, 10),
technician: "", instrument: "", calNumber: "", verifyType: "periodica",
equipClass: "I", equipType: "", assetId: propAssetId || "",
leakageMethod: "diretto",
visual: { housing: null, cable: null, connectors: null, labels: null, docs: null },
measures: [], notes: "", overallPass: false,
verifyStatus: "completata", // "completata" | "non_disponibile"
notAvailableReason: "", departmentName: "", departmentContact: "",
technicianSignature: "", departmentSignature: "" };
const [f, setF] = React.useState(() => {
var _a;
const init = initial || blank;
// Auto-genera reportNumber se nuovo e vuoto
if (!initial && !init.reportNumber) {
init.reportNumber = getNextReportNumber(existingReports || [], "VSE");
}
if (!((_a = init.measures) === null || _a === void 0 ? void 0 : _a.length))
return Object.assign(Object.assign({}, init), { measures: getMeasures(init.norm || "62353", "I", init.patientType || "BF", init.leakageMethod || "diretto") });
return init;
});
const [errors, setErrors] = React.useState({});
const sv = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const setVis = (k, v) => setF(x => (Object.assign(Object.assign({}, x), { visual: Object.assign(Object.assign({}, x.visual), { [k]: v }) })));
const setMeas = (id, val) => setF(x => (Object.assign(Object.assign({}, x), { measures: x.measures.map(m => m.id === id ? Object.assign(Object.assign({}, m), { value: val }) : m) })));
React.useEffect(() => { setF(x => (Object.assign(Object.assign({}, x), { measures: getMeasures(x.norm, x.equipClass, x.patientType, x.leakageMethod) }))); }, [f.norm, f.equipClass, f.patientType, f.leakageMethod]);
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
React.createElement(ErrorSummary, { errors: errors }),
React.createElement("div", { style: { background: f.overallPass ? "#22c55e15" : "#ef444415", border: `1px solid ${f.overallPass ? "#22c55e44" : "#ef444433"}`, borderRadius: 8, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8" } },
"Norma: ",
React.createElement("strong", { style: { color: "#e2e8f0" } }, f.norm === "61010" ? "IEC 61010-1 (Lab)" : "IEC 62353 (Elettromedicale)")),
React.createElement("span", { style: { fontWeight: 800, fontSize: 14, color: f.overallPass ? "#22c55e" : "#ef4444" } }, f.overallPass ? "CONFORME" : "NON CONFORME")),
f.norm !== "61010" && (React.createElement("div", { style: { background: "#0D0D12", border: "1px solid #2DD4BF44", borderRadius: 8, padding: "10px 14px", fontSize: 11, color: "#9090A8", lineHeight: 1.5 } },
React.createElement("div", { style: { color: "#2DD4BF", fontWeight: 700, marginBottom: 4, fontSize: 11 } }, "\u2139 IEC 62353:2014 \u2014 Limiti test periodico"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "#cbd5e1" } }, "Equipment Leakage:"),
" Cl.I \u2264500\u00B5A (D/DIFF) / \u22641000\u00B5A (ALT) \u00B7 Cl.II \u2264100\u00B5A / \u2264500\u00B5A"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "#cbd5e1" } }, "Applied Part Leakage:"),
" BF \u22645000\u00B5A \u00B7 CF \u226450\u00B5A (limite identico per i 3 metodi)"),
React.createElement("div", { style: { marginTop: 4, paddingTop: 4, borderTop: "1px solid #2DD4BF22", color: "#94a3b8" } },
React.createElement("strong", { style: { color: "#cbd5e1" } }, "Metodi:"),
" Diretto (apparecchio alimentato) \u00B7 Differenziale (somma vett. L-N) \u00B7 Alternativo (apparecchio scollegato)"),
React.createElement("div", null,
React.createElement("strong", { style: { color: "#cbd5e1" } }, "PE Resistance:"),
" \u22640.3 \u03A9 \u00B7 ",
React.createElement("strong", { style: { color: "#cbd5e1" } }, "Isolamento:"),
" \u22652 M\u03A9"))),
!propAssetId && (React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Apparecchio"),
React.createElement(AssetCombobox, { value: f.assetId, onChange: id => setF(x => (Object.assign(Object.assign({}, x), { assetId: id }))), assets: assets, customers: customers, placeholder: "Cerca apparecchio\u2026" }))),
asset && React.createElement("div", { style: { background: "#141418", borderRadius: 8, padding: "8px 14px", border: "1px solid #1e2a3a", fontSize: 12, color: "#94a3b8" } },
React.createElement("strong", { style: { color: "#e2e8f0" } }, asset.name),
" \u00B7 ",
asset.brand,
" ",
asset.model,
" \u00B7 S/N: ",
asset.serial || "—"),
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 8, padding: "10px 14px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Stato verifica"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "completata" }))), style: {
background: f.verifyStatus === "completata" ? "#22c55e22" : "#141418",
border: "1px solid " + (f.verifyStatus === "completata" ? "#22c55e66" : "#2a3040"),
color: f.verifyStatus === "completata" ? "#22c55e" : "#94a3b8",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u2713 Verifica completata"),
React.createElement("button", { type: "button", onClick: () => setF(x => (Object.assign(Object.assign({}, x), { verifyStatus: "non_disponibile" }))), style: {
background: f.verifyStatus === "non_disponibile" ? "#f59e0b22" : "#141418",
border: "1px solid " + (f.verifyStatus === "non_disponibile" ? "#f59e0b66" : "#2a3040"),
color: f.verifyStatus === "non_disponibile" ? "#f59e0b" : "#94a3b8",
borderRadius: 7, padding: "10px", cursor: "pointer", fontSize: 12, fontWeight: 700,
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "\u26A0 Apparecchio non disponibile")),
f.verifyStatus === "non_disponibile" && (React.createElement("div", { style: { marginTop: 10, padding: "10px 12px", background: "#f59e0b08", border: "1px solid #f59e0b33", borderRadius: 6, fontSize: 11, color: "#fbbf24" } }, "La verifica non sar\u00E0 eseguita. Sar\u00E0 generato un report di mancata esecuzione da far firmare al reparto."))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 13 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 Rapporto"),
React.createElement("input", { value: f.reportNumber, onChange: sv("reportNumber"), placeholder: "VSE-2026-001", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Data"),
React.createElement("input", { type: "date", value: f.date, onChange: sv("date"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Norma",
React.createElement(Hint, { text: "IEC 62353: verifiche periodiche e dopo riparazione su apparecchiature elettromedicali. IEC 61010-1: strumenti elettrici da misura, controllo e laboratorio. La scelta determina i parametri da misurare e i limiti di accettabilit\u00E0." })),
React.createElement("select", { value: f.norm, onChange: sv("norm"), style: INP },
React.createElement("option", { value: "62353" }, "IEC 62353 \u2014 Elettromedicale"),
React.createElement("option", { value: "61010" }, "IEC 61010-1 \u2014 Laboratorio"))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Classe apparecchio",
React.createElement(Hint, { text: "Classe di sicurezza elettrica (IEC 60601-1). Classe I: ha conduttore di protezione (PE/terra) \u2014 la carcassa \u00E8 collegata a terra (es. monitor, ventilatori). Classe II: doppio isolamento, niente PE, simbolo del quadrato dentro quadrato (es. piccoli apparecchi portatili). Classe III: alimentazione SELV a bassissima tensione di sicurezza, niente PE (es. apparecchi a batteria interna). La classe determina quali misure di sicurezza eseguire." })),
React.createElement("select", { value: f.equipClass, onChange: sv("equipClass"), style: INP },
React.createElement("option", { value: "I" }, "Classe I \u2014 Con PE (messa a terra)"),
React.createElement("option", { value: "II" }, "Classe II \u2014 Doppio isolamento (no PE)"),
React.createElement("option", { value: "III" }, "Classe III \u2014 SELV (alimentazione interna/sicura)")),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", marginTop: 3 } },
f.equipClass === "I" && "Misure: PE + isolamento + dispersione terra + dispersione paziente",
f.equipClass === "II" && "Misure: isolamento + dispersione carcassa + dispersione paziente (NO PE)",
f.equipClass === "III" && "Misure: isolamento + dispersione paziente soltanto (circuito SELV, NO terra)")),
f.norm !== "61010" && (React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Tipo parte applicata (paziente)",
React.createElement(Hint, { text: "Definito dalla norma IEC 60601-1. B = contatto corpo non cardiaco, senza isolamento speciale (es. monitor temperatura cute). BF = parte applicata isolata floating, tipica di ECG, SpO2, ventilatori \u2014 soglia dispersione paziente 5000\u00B5A in condizioni di guasto. CF = applicazione cardiaca diretta (cateteri intracardiaci, cardiostimolatori) \u2014 limiti molto severi, dispersione paziente max 50\u00B5A. Il tipo \u00E8 indicato dal simbolo sulla targhetta dell'apparecchio." })),
React.createElement("select", { value: f.patientType || "BF", onChange: sv("patientType"), style: INP },
React.createElement("option", { value: "B" }, "Tipo B \u2014 Contatto corpo (no PA isolata)"),
React.createElement("option", { value: "BF" }, "Tipo BF \u2014 Parte isolata floating (PA \u2264 5000\u00B5A alt.)"),
React.createElement("option", { value: "CF" }, "Tipo CF \u2014 Applicazione cardiaca (PA \u2264 50\u00B5A)")),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", marginTop: 3 } },
(f.patientType || "BF") === "B" && "Tipo B: contatto diretto con paziente, non cardiaco",
(f.patientType || "BF") === "BF" && "Tipo BF: parte applicata isolata (es. ECG, SpO2)",
(f.patientType || "BF") === "CF" && "Tipo CF: applicazione cardiaca diretta — limiti più severi"))),
f.norm !== "61010" && f.equipClass !== "III" && (React.createElement("div", { style: FLD },
React.createElement("label", { style: Object.assign(Object.assign({}, LBL), { display: "flex", alignItems: "center" }) },
"Metodo di misura dispersione",
React.createElement(Hint, { text: "Metodi previsti da IEC 62353. DIRETTO: misurato tra le parti accessibili e la terra (pi\u00F9 rapido, classico). DIFFERENZIALE: misurato come differenza tra corrente in fase e neutro (limiti uguali al diretto). ALTERNATIVO: misurato con sorgente isolata 100-120V, separato dalla rete (sicuro per il tecnico, limiti pi\u00F9 alti \u2014 fino a 1000\u00B5A per Cl.I). Scegli in base allo strumento e alla situazione clinica." })),
React.createElement("select", { value: f.leakageMethod || "diretto", onChange: sv("leakageMethod"), style: INP },
React.createElement("option", { value: "diretto" }, "Diretto \u2014 misura corrente da PE verso terra"),
React.createElement("option", { value: "differenziale" }, "Differenziale \u2014 somma vettoriale L-N"),
React.createElement("option", { value: "alternativo" }, "Alternativo (sostituzione) \u2014 apparecchio scollegato")),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", marginTop: 3 } },
(f.leakageMethod || "diretto") === "diretto" && "Diretto: apparecchio alimentato, sonda tra carcassa e terra. Adatto a stanze con presa standard.",
(f.leakageMethod || "diretto") === "differenziale" && "Differenziale: misura la differenza tra L e N. Adatto a circuiti con isolamento o trasformatore.",
(f.leakageMethod || "diretto") === "alternativo" && "Alternativo: apparecchio scollegato, simula la corrente di guasto. Adatto a sale operatorie con RCD/IT."))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tecnico verificatore"),
React.createElement("input", { value: f.technician, onChange: sv("technician"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Strumento di misura"),
React.createElement("input", { value: f.instrument, onChange: sv("instrument"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "N\u00B0 calibrazione"),
React.createElement("input", { value: f.calNumber, onChange: sv("calNumber"), style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Tipo verifica"),
React.createElement("select", { value: f.verifyType, onChange: sv("verifyType"), style: INP }, ["periodica", "dopo riparazione", "prima messa in servizio", "straordinaria"].map(v => React.createElement("option", { key: v }, v))),
f.verifyType === "straordinaria" && React.createElement("span", { style: { fontSize: 10, color: "#f59e0b", marginTop: 3 } }, "\u26A0 Straordinaria: non aggiorna la pianificazione annuale"))),
f.verifyStatus === "non_disponibile" ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement("div", { style: { background: "#f59e0b08", border: "1px solid #f59e0b44", borderRadius: 10, padding: "14px 16px" } },
React.createElement("div", { style: { fontSize: 11, color: "#f59e0b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "\u26A0 Apparecchio non disponibile per verifica"),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Motivo mancata esecuzione *"),
React.createElement("select", { value: f.notAvailableReason, onChange: sv("notAvailableReason"), style: INP },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
React.createElement("option", { value: "in_uso" }, "Apparecchio in uso su paziente"),
React.createElement("option", { value: "non_trovato" }, "Apparecchio non reperibile in reparto"),
React.createElement("option", { value: "trasferito" }, "Apparecchio trasferito ad altro reparto"),
React.createElement("option", { value: "riparazione_esterna" }, "In riparazione esterna"),
React.createElement("option", { value: "dismesso" }, "Dismesso / non pi\u00F9 in uso"),
React.createElement("option", { value: "rifiuto_reparto" }, "Reparto non autorizza intervento ora"),
React.createElement("option", { value: "altro" }, "Altro (specificare nelle note)"))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 operativa *"),
React.createElement("input", { value: f.departmentName, onChange: sv("departmentName"), placeholder: "es. UO Cardiologia, Sala Operatoria 2", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente reparto (nome e qualifica)"),
React.createElement("input", { value: f.departmentContact, onChange: sv("departmentContact"), placeholder: "es. Caposala Mario Rossi", style: INP }))),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Note aggiuntive"),
React.createElement("textarea", { value: f.notes, onChange: sv("notes"), rows: 2, placeholder: "Dettagli, riprogrammare per data, ecc.", style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 11px", color: "#e2e8f0", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" } })))),
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (per presa visione)", value: f.departmentSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 }))))) : (React.createElement(React.Fragment, null,
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
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "12px 16px", border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 800, marginBottom: 10 } }, "Firme"),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement(SignaturePad, { label: "Firma Tecnico verificatore", value: f.technicianSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { technicianSignature: v }))), height: 120 }),
React.createElement(SignaturePad, { label: "Firma Referente reparto (opzionale)", value: f.departmentSignature, onChange: v => setF(x => (Object.assign(Object.assign({}, x), { departmentSignature: v }))), height: 120 })),
React.createElement("div", { style: { marginTop: 8, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 } },
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Reparto / Unit\u00E0 (opzionale)"),
React.createElement("input", { value: f.departmentName || "", onChange: sv("departmentName"), placeholder: "es. UO Cardiologia", style: INP })),
React.createElement("div", { style: FLD },
React.createElement("label", { style: LBL }, "Referente (opzionale)"),
React.createElement("input", { value: f.departmentContact || "", onChange: sv("departmentContact"), placeholder: "es. Caposala Rossi", style: INP })))))),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => {
const errs = {};
if (!f.assetId && !propAssetId)
errs.assetId = "Seleziona un apparecchio";
if (!f.date)
errs.date = "Inserisci la data";
if (!f.technician)
errs.technician = "Inserisci il nome del tecnico";
if (f.verifyStatus === "non_disponibile") {
if (!f.notAvailableReason)
errs.notAvailableReason = "Seleziona il motivo della mancata esecuzione";
if (!f.departmentName)
errs.departmentName = "Inserisci il nome del reparto";
}
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(Object.assign(Object.assign({}, f), { assetId: f.assetId || propAssetId || "", overallPass: f.verifyStatus === "non_disponibile" ? null : f.overallPass }));
} }, "Salva rapporto"))));
}
/* ═══ VERIFICA FUNZIONALE — TEMPLATE PER TIPO APPARECCHIO ══════
* Basato su: IEC 60601-1, IEC 60601-2-4 (defibrillatori),
*            CEI 62-13, CEI EN 62353 Allegato F,
*            Linee guida CEI 62-148, normativa italiana D.L. 169/2013
* ═══════════════════════════════════════════════════════════════ */
const FUNC_TEMPLATES = {
"pulsossimetro": {
label: "Pulsossimetro / SpO2 monitor", icon: "›", norm: "ISO 80601-2-61:2017",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "involucro", text: "Involucro/display: integro, privo di crepe o danni" },
{ id: "cavo_paz", text: "Cavo paziente e sensore: integri, isolamento OK" },
{ id: "sensore", text: "Sensore SpO2: clip/finger pulita, LED visibili e funzionanti" },
{ id: "alimentaz", text: "Cavo alimentazione / alimentatore: integro (se da rete)" },
{ id: "batteria", text: "Batteria interna (se presente): non gonfia, contatti puliti" },
{ id: "etichette", text: "Etichette CE, n° serie, classificazione: leggibili" },
]
},
{
id: "alimentazione", title: "Alimentazione e batteria",
note: "ISO 80601-2-61: i pulsossimetri portatili devono funzionare almeno 8 ore con batteria carica (manutenzione tipica).",
items: [
{ id: "acc_rete", text: "Accensione da rete: corretta, indicatori luminosi normali" },
{ id: "acc_batteria", text: "Accensione da batteria: corretta, indicatore stato carica visibile" },
{ id: "low_batt", text: "Allarme batteria scarica: attivo (test con tensione bassa o storia clinica)" },
],
measures: [
{ id: "batt_perc", name: "Carica residua batteria", unit: "%", expected: "≥ 80% dopo ricarica completa", limitVal: 100, limitMin: 80, invertPass: true, value: "" },
{ id: "auton", name: "Autonomia (se misurata)", unit: "h", expected: "≥ 8 h (portatili)", limitMin: 8, invertPass: true, value: "" },
]
},
{
id: "accuratezza_spo2", title: "Accuratezza SpO2 (ISO 80601-2-61)",
note: "Verificare con simulatore SpO2 certificato (es. Fluke ProSim 8, Index 2 SpO2, Rigel UNI-SiM). Tolleranza tipica ±2% nel range 70-100%. Test su almeno 3 punti: 90%, 80%, 70%.",
items: [
{ id: "simulatore", text: "Simulatore SpO2 collegato e calibrato" },
{ id: "morf_pleth", text: "Forma d'onda pletismografica: presente e stabile sul display" },
],
measures: [
{ id: "spo2_97", name: "SpO2 simulato 97% — lettura", unit: "%", expected: "97 ±2 (95-99)", limitVal: 99, limitMin: 95, value: "" },
{ id: "spo2_90", name: "SpO2 simulato 90% — lettura", unit: "%", expected: "90 ±2 (88-92)", limitVal: 92, limitMin: 88, value: "" },
{ id: "spo2_80", name: "SpO2 simulato 80% — lettura", unit: "%", expected: "80 ±2 (78-82)", limitVal: 82, limitMin: 78, value: "" },
{ id: "spo2_70", name: "SpO2 simulato 70% — lettura", unit: "%", expected: "70 ±3 (67-73)", limitVal: 73, limitMin: 67, value: "" },
]
},
{
id: "accuratezza_fc", title: "Accuratezza frequenza cardiaca",
note: "Verificare con simulatore impostato a diverse frequenze. Tolleranza tipica ±2% o ±2 bpm (il valore maggiore).",
items: [
{ id: "fc_traccia", text: "Tracciato FC stabile, senza artefatti" },
],
measures: [
{ id: "fc_30", name: "FC simulato 30 bpm — lettura", unit: "bpm", expected: "30 ±2 (28-32)", limitVal: 32, limitMin: 28, value: "" },
{ id: "fc_60", name: "FC simulato 60 bpm — lettura", unit: "bpm", expected: "60 ±2 (58-62)", limitVal: 62, limitMin: 58, value: "" },
{ id: "fc_120", name: "FC simulato 120 bpm — lettura", unit: "bpm", expected: "120 ±3 (117-123)", limitVal: 123, limitMin: 117, value: "" },
{ id: "fc_200", name: "FC simulato 200 bpm — lettura", unit: "bpm", expected: "200 ±4 (196-204)", limitVal: 204, limitMin: 196, value: "" },
]
},
{
id: "allarmi", title: "Allarmi (IEC 60601-1-8)",
note: "Verificare attivazione allarmi acustici e visivi al superamento delle soglie impostate.",
items: [
{ id: "all_spo2_low", text: "Allarme SpO2 basso: si attiva entro 10s dal superamento soglia" },
{ id: "all_spo2_high", text: "Allarme SpO2 alto: si attiva entro 10s (se previsto)" },
{ id: "all_fc_low", text: "Allarme FC bassa: si attiva entro 10s" },
{ id: "all_fc_high", text: "Allarme FC alta: si attiva entro 10s" },
{ id: "all_sensore", text: "Allarme sensore scollegato/no segnale: si attiva entro 10s" },
{ id: "all_audio", text: "Segnale acustico udibile a 1m (>= 45 dB)" },
{ id: "all_visivo", text: "Segnale visivo (icona/LED): chiaramente visibile" },
{ id: "all_pausa", text: "Funzione pausa/silenziamento allarme: funzionante, ripristino automatico <= 120s" },
]
},
{
id: "perfusione", title: "Indice di perfusione (PI) - OPZIONALE",
note: "OPZIONALE - solo se il dispositivo riporta l'indice di perfusione (PI). Verifica del comportamento a basso segnale.",
items: [
{ id: "pi_basso", text: "Lettura PI bassa (< 1%): dispositivo riconosce condizione e segnala bassa perfusione" },
{ id: "pi_norm", text: "Lettura PI normale (3-10%): valore stabile su simulatore" },
]
},
{
id: "registro", title: "Registro e documentazione",
items: [
{ id: "data_ora", text: "Data/ora di sistema corrette" },
{ id: "memorizzazione", text: "Memorizzazione trend (se presente): funzionante" },
{ id: "trasferimento", text: "Trasferimento dati / interfaccia (USB/Bluetooth, se prevista): funzionante" },
{ id: "registro_aggiornato", text: "Registro manutenzioni aggiornato con data e firma tecnico" },
]
},
]
},
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
{ id: "cavo_ecg", text: "Cavo ECG paziente e connettori: integrità isolamento, clip/elettrodi funzionanti" },
{ id: "stampante", text: "Stampante termica: carta presente, funzionante" },
{ id: "etichette", text: "Etichette di sicurezza, classe e numero serie: leggibili e presenti" },
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
{ id: "batt_perc", name: "Carica residua batteria", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
]
},
{
id: "funz_base", title: "Funzionalità di base",
items: [
{ id: "accensione", text: "Accensione: nessun messaggio di errore o allarme anomalo" },
{ id: "display", text: "Display: leggibile, nessun pixel morto o artefatto" },
{ id: "sel_energia", text: "Selettore energia: funzionante a tutti i livelli (da minimo a massimo)" },
{ id: "puls_carica", text: "Tasto CARICA: funzionante, tempo carica entro specifiche costruttore" },
{ id: "puls_scarica", text: "Tasto SCARICA: funzionante (test su analizzatore/carico resistivo)" },
{ id: "beep_carica", text: "Segnale acustico carica completata: presente e udibile" },
{ id: "annullamento", text: "Annullamento carica (tasto o timeout): funzionante" },
]
},
{
id: "energia", title: "Energia erogata (IEC 60601-2-4 cl.201.12.4.101)",
note: "Misurare con analizzatore certificato su carico resistivo 50 Ω. Tolleranza ammessa: ±15% del valore selezionato oppure ±3 J (si applica il maggiore dei due). Eseguire anche a 25 Ω e 175 Ω se richiesto dal costruttore.",
items: [
{ id: "carico_50", text: "Analizzatore collegato: carico 50 Ω" },
{ id: "forma_onda", text: "Forma d'onda di scarica (bifasica/monofasica): conforme alle specifiche costruttore" },
],
measures: [
{ id: "e_low", name: "Energia — selezione minima", unit: "J", expected: "sel. ±15% o ±3J", value: "" },
{ id: "e_50j", name: "Energia — selezione 50 J", unit: "J", expected: "50 ±15% (42.5–57.5) o ±3J", limitVal: 57.5, limitMin: 42.5, value: "" },
{ id: "e_100j", name: "Energia — selezione 100 J", unit: "J", expected: "100 ±15% (85–115)", limitVal: 115, limitMin: 85, value: "" },
{ id: "e_150j", name: "Energia — selezione 150 J", unit: "J", expected: "150 ±15% (127.5–172.5)", limitVal: 172.5, limitMin: 127.5, value: "" },
{ id: "e_200j", name: "Energia — selezione 200 J", unit: "J", expected: "200 ±15% (170–230)", limitVal: 230, limitMin: 170, value: "" },
{ id: "e_max", name: "Energia — selezione massima", unit: "J", expected: "max ±15% o ±3J", value: "" },
{ id: "t_carica", name: "Tempo di carica a energia max", unit: "s", expected: "≤ 15 s (IEC 60601-2-4)", limitVal: 15, value: "" },
]
},
{
id: "sync", title: "Cardioversione sincronizzata (IEC 60601-2-4 cl.201.12.4.4)",
note: "Il ritardo tra picco R e inizio scarica deve essere < 60 ms (IEC 60601-2-4).",
items: [
{ id: "sync_attiva", text: "Modalità SYNC: attivabile, indicatore visivo presente" },
{ id: "sync_marker", text: "Marker di sincronismo sull'onda R del tracciato ECG: visibile" },
{ id: "sync_auto_off", text: "Disattivazione automatica SYNC dopo scarica: confermata" },
],
measures: [
{ id: "sync_delay", name: "Ritardo scarica dal picco R (sync delay)", unit: "ms", expected: "< 60 ms", limitVal: 60, value: "" },
]
},
{
id: "ecg_mon", title: "Monitoraggio ECG (IEC 60601-2-27)",
items: [
{ id: "ecg_tracciato", text: "Tracciato ECG su simulatore: morfologia corretta, no artefatti" },
{ id: "ecg_derivazioni", text: "Selezione derivazioni (I, II, III, aVR, aVL, aVF, V): funzionante" },
{ id: "ecg_allarmi", text: "Allarmi FC alta/bassa: attivazione nei range impostati" },
{ id: "ecg_vf", text: "Rilevazione FV (se previsto): segnale di allarme presente" },
],
measures: [
{ id: "fc_sim60", name: "FC visualizzata — simulatore a 60 bpm", unit: "bpm", expected: "60 ±1% o ±1 bpm", limitVal: 61, limitMin: 59, value: "" },
{ id: "fc_sim120", name: "FC visualizzata — simulatore a 120 bpm", unit: "bpm", expected: "120 ±1% o ±1 bpm", limitVal: 122, limitMin: 118, value: "" },
]
},
{
id: "pacing", title: "Pacing esterno transcutaneo (se presente)",
items: [
{ id: "pacing_attiva", text: "Modalità pacing: attivabile" },
{ id: "pacing_freq", text: "Frequenza pacing: selezionabile nel range indicato" },
{ id: "pacing_corrente", text: "Corrente stimolazione: selezionabile da min a max" },
{ id: "pacing_cattura", text: "Cattura ventricolare verificabile su simulatore ECG" },
{ id: "pacing_spike", text: "Spike di pacing visibile sul tracciato" },
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
{ id: "segnalatore", text: "Segnalatore di pronto intervento (luce verde/LED): attivo" },
{ id: "involucro", text: "Involucro DAE: privo di danni, sporco o umidità" },
{ id: "display", text: "Display/segnalazioni vocali: funzionanti" },
{ id: "pad_adulti", text: "Pad adulti: non scaduti, confezionamento integro" },
{ id: "pad_pediatrici", text: "Pad pediatrici (se presenti): non scaduti, integri" },
{ id: "accessori", text: "Accessori kit (forbici, rasoio, guanti, garze): presenti e integri" },
]
},
{
id: "batteria", title: "Batteria (IEC 60601-2-4)",
items: [
{ id: "batt_scad", text: "Data scadenza batteria: non superata" },
{ id: "batt_status", text: "Indicatore stato batteria: OK / pronto" },
{ id: "batt_autotest", text: "Autotest automatico superato (log di sistema)" },
],
measures: [
{ id: "batt_perc", name: "Carica residua batteria", unit: "%", expected: "≥ 80%", limitVal: 80, invertPass: true, value: "" },
{ id: "n_scariche", name: "Numero scariche residue stimate", unit: "n", expected: "≥ 100 scariche", limitVal: 100, invertPass: true, value: "" },
]
},
{
id: "funz_dae", title: "Verifica funzionale (con analizzatore/simulatore)",
note: "Usare simulatore ECG con pattern FV/TV. NON eseguire scarica su persona.",
items: [
{ id: "analisi_fv", text: "Analisi ritmo FV: DAE consiglia scarica correttamente" },
{ id: "analisi_rns", text: "Analisi ritmo sinusale normale: DAE NON consiglia scarica" },
{ id: "guida_vocale", text: "Guida vocale durante procedura: chiara e corretta" },
{ id: "segnale_cpr", text: "Segnale guida RCP post-scarica: presente (se previsto)" },
]
},
{
id: "energia_dae", title: "Verifica energia erogata",
note: "Misurare con analizzatore su carico 50 Ω. Tolleranza ±15% o ±3J.",
items: [
{ id: "scarica_ok", text: "Scarica su carico 50 Ω: eseguita correttamente" },
],
measures: [
{ id: "e_scarica1", name: "Energia 1ª scarica", unit: "J", expected: "secondo costruttore ±15%", value: "" },
{ id: "e_scarica2", name: "Energia 2ª scarica (se escalation)", unit: "J", expected: "secondo costruttore ±15%", value: "" },
]
},
{
id: "registro", title: "Registro e documentazione",
items: [
{ id: "log_ok", text: "Log eventi scaricato e verificato (nessun allarme anomalo)" },
{ id: "data_manut", text: "Data prossima manutenzione/scadenza aggiornata" },
{ id: "posizione", text: "Segnaletica posizione DAE: visibile e corretta" },
{ id: "registro_aggiornato", text: "Registro manutenzioni aggiornato" },
]
},
]
},
// ─── ASPIRATORE CHIRURGICO (ISO 10079-1:2015) ────────────────────────────
"aspiratore_chirurgico": {
label: "Aspiratore chirurgico / da secreti", icon: "ASP", norm: "ISO 10079-1:2015",
sections: [
{
id: "ispezione", title: "Ispezione visiva e meccanica",
items: [
{ id: "cavo_al", text: "Cavo alimentazione: integro, spina OK" },
{ id: "involucro", text: "Involucro e carrello (se presente): integrità strutturale" },
{ id: "tubazioni", text: "Tubazioni, raccordi e connettori: integri, senza cricche o occlusioni" },
{ id: "filtro_batt", text: "Filtro batterico: presente, non scaduto, non otturato" },
{ id: "filtro_idr", text: "Filtro idrofobico (protezione pompa): presente e integro" },
{ id: "contenitore", text: "Contenitore liquidi: integro, guarnizioni OK, sistema di smaltimento funzionante" },
{ id: "overflow", text: "Dispositivo di protezione overflow: presente e funzionante" },
{ id: "valvola_sic", text: "Valvola di sicurezza/limitatore di pressione: presente" },
]
},
{
id: "vuoto", title: "Verifica del vuoto (ISO 10079-1 cl.5.2)",
note: "Aspiratore chirurgico: vuoto max ≥ 80 kPa. Aspiratore da secreti: ≥ 60 kPa. Misurare a contenitore chiuso.",
items: [
{ id: "otturazione", text: "Occlusione dell'uscita paziente: corretta per test" },
],
measures: [
{ id: "vuoto_max", name: "Vuoto massimo (contenitore chiuso)", unit: "kPa", expected: "≥ 80 kPa (chirurgico) / ≥ 60 kPa (secreti)", limitVal: 80, invertPass: true, value: "" },
{ id: "t_vuoto", name: "Tempo raggiungimento vuoto max", unit: "s", expected: "< 20 s (chirurgico)", limitVal: 20, value: "" },
]
},
{
id: "portata", title: "Verifica portata (ISO 10079-1 cl.5.3)",
note: "Portata libera misurata a pressione atmosferica. Chirurgico: ≥ 25 L/min. Da secreti: ≥ 15 L/min.",
measures: [
{ id: "portata_lib", name: "Portata libera (max, a 0 kPa)", unit: "L/min", expected: "≥ 25 L/min (chir.)", limitVal: 25, invertPass: true, value: "" },
{ id: "portata_50", name: "Portata a 50 kPa di depressione", unit: "L/min", expected: "≥ 15 L/min", limitVal: 15, invertPass: true, value: "" },
{ id: "regolazione", name: "Depressione regolabile (valore max impostato)", unit: "kPa", expected: "regolabile", value: "" },
]
},
{
id: "batteria_asp", title: "Batteria (se dispositivo portatile)",
items: [
{ id: "batt_scad", text: "Batteria: non scaduta, carica adeguata" },
{ id: "autonomia", text: "Autonomia su batteria: sufficiente per l'uso previsto" },
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
note: "Misurare con analizzatore HF certificato su carico resistivo. Tolleranza: ±20% della potenza nominale per ciascuna modalità.",
items: [
{ id: "carico_300", text: "Analizzatore su carico resistivo 300 Ω (monopolare standard)" },
],
measures: [
{ id: "p_cut_low", name: "Potenza CUT — selezione bassa (es. 30W)", unit: "W", expected: "30 ±20% (24–36 W)", limitVal: 36, limitMin: 24, value: "" },
{ id: "p_cut_med", name: "Potenza CUT — selezione media (es. 60W)", unit: "W", expected: "60 ±20% (48–72 W)", limitVal: 72, limitMin: 48, value: "" },
{ id: "p_cut_high", name: "Potenza CUT — selezione alta (es. 100W)", unit: "W", expected: "100 ±20% (80–120 W)", limitVal: 120, limitMin: 80, value: "" },
{ id: "p_coag_low", name: "Potenza COAG — selezione bassa", unit: "W", expected: "secondo costruttore ±20%", value: "" },
{ id: "p_coag_high", name: "Potenza COAG — selezione alta", unit: "W", expected: "secondo costruttore ±20%", value: "" },
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
{ id: "pa_sis_120", name: "PA sistolica — riferimento 120 mmHg", unit: "mmHg", expected: "120 ±5 mmHg (115–125)", limitVal: 125, limitMin: 115, value: "" },
{ id: "pa_dias_80", name: "PA diastolica — riferimento 80 mmHg", unit: "mmHg", expected: "80 ±5 mmHg (75–85)", limitVal: 85, limitMin: 75, value: "" },
{ id: "pa_map_93", name: "PA media (MAP) — riferimento 93 mmHg", unit: "mmHg", expected: "93 ±5 mmHg", limitVal: 98, limitMin: 88, value: "" },
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
{ id: "etco2_val", name: "etCO2 — gas di riferimento (es. 38 mmHg)", unit: "mmHg", expected: "±2 mmHg o ±8%", value: "" },
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
{ id: "peep_5", name: "PEEP (impostata 5 cmH2O)", unit: "cmH2O", expected: "5 ±2 (3–7)", limitVal: 7, limitMin: 3, value: "" },
{ id: "peep_10", name: "PEEP (impostata 10 cmH2O)", unit: "cmH2O", expected: "10 ±2 (8–12)", limitVal: 12, limitMin: 8, value: "" },
{ id: "fio2_40", name: "FiO2 (impostata 40%)", unit: "%", expected: "40 ±3% (37–43)", limitVal: 43, limitMin: 37, value: "" },
{ id: "fio2_100", name: "FiO2 (impostata 100%)", unit: "%", expected: "100 ±3% (97–100)", limitVal: 100, limitMin: 97, value: "" },
{ id: "ppeak", name: "Pressione di picco inspiratoria", unit: "cmH2O", expected: "±4% o ±2 cmH2O del valore misurato", value: "" },
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
note: "IEC 60601-2-24: errore portata ≤ ±5% dopo periodo di stabilizzazione (almeno 1h a portata nominale). Misurare con metodo gravimetrico o contagocce calibrato.",
items: [
{ id: "stabilizz", text: "Periodo di stabilizzazione ≥ 1 ora prima della misurazione" },
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
id: "phantom", title: "Verifica con fantoccio (phantom test)",
note: "Se disponibile fantoccio calibrato, verificare risoluzione assiale/laterale e accuratezza distanze.",
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
{ keys: ["pulsossimetro", "pulsossimetria", "saturimetro", "spo2", "ossimetro", "pulse ox"], id: "pulsossimetro" },
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
"Quando apri l'app vedi 4 pillole con i numeri principali: apparecchi totali, job aperti, verifiche eseguite, clienti. Clicca una pillola per andare alla sezione.",
"Sotto le pillole c'è la sezione 'DA FARE' con tutte le cose da prendere in carico: job urgenti, manutenzioni scadute, scadenze entro 7 giorni, parti sotto scorta. Ogni voce è cliccabile e ti porta dritto al filtro giusto.",
"Più in basso 'CRITICO' mostra le emergenze (job urgenti aperti + manutenzioni scadute), e 'PROSSIMI 30 GIORNI' è il calendario delle manutenzioni imminenti ordinate per data.",
"La riga finale è il riepilogo discreto: operativi, in manutenzione, fuori servizio, garanzie in scadenza, preventivi aperti — tutto cliccabile."
]
},
{
icon: "›", title: "Apparecchi (Parco Macchine)", color: "#2DD4BF",
steps: [
"Premi '+ Nuovo' in alto a destra per aggiungere un apparecchio. Compila: nome, marca, modello, S/N, cliente, ubicazione, classe di rischio, norma IEC, classe elettrica (I/II/III), tipo parte applicata (B/BF/CF), date acquisto/garanzia/prossimo servizio.",
"Mobile: tocca una card per aprire la scheda dettaglio. I 4 pulsanti in basso sono: ⚡ Sicur. (verifica sicurezza elettrica), ✓ Funz. (verifica funzionale), ✏ Mod. (modifica), ✕ (elimina con conferma).",
"Sopra le card hai la ricerca testuale e il pulsante 'Filtri' (collassabile) per filtrare per marca, modello, ubicazione, stato, cliente o classe di rischio.",
"GESTI MOBILE: swipe a sinistra su una card per eliminare; swipe da bordo sinistro verso destra per aprire il menu; tira giù dall'alto per aggiornare la lista.",
"Desktop: doppio clic su una riga per aprire la scheda dettaglio. La tabella ha filtri colonna e ricerca globale."
]
},
{
icon: "›", title: "Job / Interventi", color: "#f59e0b",
steps: [
"Un Job è qualsiasi intervento su un apparecchio: correttivo, preventivo, taratura, ecc. Crealo con '+ Nuovo' oppure dalla scheda apparecchio.",
"Sopra la lista hai 3 tab: APERTI (default, mostra solo job non chiusi), TUTTI, CHIUSI. Ogni tab ha un contatore live.",
"TIMELINE INTERVENTI: dentro il job, sezione 'Timeline interventi' con pulsante '+ Nuovo passaggio'. Per ogni passaggio scegli tipo (sopralluogo, attesa preventivo, attesa parti, riparazione, test, consegna, chiamata, email, altro), data, ora, durata in minuti, tecnico e descrizione. Il tempo totale lavorato si calcola automaticamente.",
"Aggiungi le parti usate dal magazzino — costo manodopera (ore × tariffa) + parti calcolato in tempo reale.",
"Esempio uso timeline: 'Lunedì 30min sopralluogo' → 'Martedì 0min attesa preventivo' → 'Giovedì 90min riparazione' → 'Giovedì 15min test funzionale' → 'Giovedì 10min consegna'. Tutto questo appare nel PDF del job."
]
},
{
icon: "›", title: "Verifiche di Sicurezza Elettrica", color: "#a855f7",
steps: [
"Apri da menu 'Sicurezza Elettrica' oppure dalla scheda apparecchio (pulsante ⚡ Sicur.).",
"Normative supportate: IEC 62353:2014 (test periodico elettromedicali) e IEC 61010-1 (strumenti laboratorio).",
"STATO VERIFICA — nuovo: in cima al form ci sono due pulsanti: '✓ Verifica completata' oppure '⚠ Apparecchio non disponibile'. Se l'apparecchio è in uso, non si trova o il reparto non autorizza, scegli 'Non disponibile' e compili motivo + reparto + referente + 2 firme. Il sistema genera un report di mancata esecuzione invece della verifica.",
"Classe apparecchio: I (con PE), II (doppio isolamento, no PE), III (SELV, alimentazione interna).",
"Tipo parte applicata: B (contatto corpo, no PA isolata), BF (parte isolata, PA ≤5000µA alt.), CF (cardiaco, PA ≤50µA).",
"Limiti IEC 62353:2014: Equipment Leakage Cl.I ≤500µA (diretto/differenziale) / ≤1000µA (alternativo); Cl.II ≤100µA / ≤500µA. Applied Part Leakage BF ≤5000µA, CF ≤50µA. PE Resistance ≤0.3Ω. Resistenza isolamento ≥2 MΩ.",
"Tre metodi di misura selezionabili: DIRETTO (apparecchio alimentato, misura corrente da PE verso terra — adatto a stanze standard), DIFFERENZIALE (somma vettoriale L-N — adatto a circuiti con isolamento o trasformatore), ALTERNATIVO (apparecchio scollegato, simula corrente di guasto — adatto a sale operatorie con RCD/sistema IT). Il metodo si sceglie in base alla configurazione della stanza, NON del costruttore.",
"N° rapporto auto-generato (es. VSE-2026-001) — puoi modificarlo manualmente se serve. Poi data, tecnico, strumento usato e suo N° calibrazione.",
"Ispezione visiva: per ogni voce ✓ OK / ✗ NO / N/D. Poi inserisci i valori misurati nelle caselle — PASS/FAIL si calcola automaticamente.",
"FIRMA DIGITALE: in fondo al form ci sono due aree firma. Usa la S-Pen del Galaxy o il dito per firmare. È sensibile alla pressione — premi più forte per linea più spessa.",
"Tipo: 'periodica' (aggiorna prossimo servizio a +1 anno) oppure 'straordinaria' (non aggiorna pianificazione).",
"Il PDF include intestazione con nome azienda, dati apparecchio, dati cliente, ispezione visiva, tabella misure con limiti/valori/esito, e DOPPIA FIRMA (tecnico + referente reparto) come immagini scansionate."
]
},
{
icon: "›", title: "Verifiche Funzionali", color: "#0D9488",
steps: [
"Apri dalla scheda apparecchio (pulsante ✓ Funz.) oppure dal menu 'Verifiche Funzionali'.",
"N° rapporto auto-generato (es. VF-2026-001) — modificabile se serve.",
"Il template viene auto-rilevato dal nome dell'apparecchio. Template disponibili: Pulsossimetro, Defibrillatore manuale, DAE, Aspiratore chirurgico, Elettrobisturi, Monitor multiparametrico, Ventilatore polmonare, Pompa infusionale, Ecografo, Letto elettrico, Generico.",
"Sicurezza Elettrica e Funzionale sono INDIPENDENTI. Ogni apparecchio può richiedere solo IEC, solo Funzionale, entrambe o nessuna — scegli tu di volta in volta quale eseguire dai pulsanti dedicati.",
"Per ogni sezione: ✓ OK / ✗ NO / N/A (non applicabile) / — (non testato). Inserisci i valori numerici delle misure dove richiesti.",
"Anche qui hai lo stato 'Apparecchio non disponibile' e le DUE FIRME DIGITALI (tecnico + referente reparto).",
"L'esito CONFORME/NON CONFORME/NON ESEGUITA si aggiorna man mano che compili.",
"Il PDF segue lo stesso formato della sicurezza elettrica, con le sezioni specifiche del template scelto."
]
},
{
icon: "›", title: "Magazzino, Ordini, Scarichi", color: "#a855f7",
steps: [
"Stock Parti: ogni parte ha codice, nome, marca, ubicazione, quantità attuale, quantità minima, prezzo acquisto, prezzo vendita.",
"Il bordo della card mobile è colorato: verde (stock OK), giallo (sotto soglia minima), rosso (esaurita).",
"Filtri mobile: pulsante 'Filtri' per filtrare per marca o ubicazione.",
"Pulsante '↓ Scarica' sulla card mobile apre il modulo scarico veloce: collega la parte a un apparecchio e registra l'uscita.",
"Ordini Fornitori: crea ordine → al ricevimento clicca '✓ Ricevuto' per aggiornare automaticamente lo stock.",
"Scarichi: storico di tutte le uscite con apparecchio, data, quantità."
]
},
{
icon: "›", title: "Preventivi", color: "#2DD4BF",
steps: [
"Crea un preventivo con '+ Nuova' oppure importa righe da un job esistente.",
"Ogni voce: descrizione, quantità, prezzo unitario, aliquota IVA. Totali calcolati in tempo reale.",
"Stati: bozza → emessa → pagata → scaduta → annullato.",
"Filtri mobile per stato o cliente. Card colorate per stato.",
"Pulsante PDF genera il preventivo formato A4 con intestazione azienda, dati cliente, tabella voci, imponibile/IVA/totale, IBAN per pagamento."
]
},
{
icon: "›", title: "Strumenti di Misura", color: "#2DD4BF",
steps: [
"Registra i tuoi analizzatori/simulatori/multimetri: marca, modello, n° serie, codice interno, certificato calibrazione, data e scadenza calibrazione.",
"Stato calibrazione: verde (valida), giallo (in scadenza <30gg), rosso (scaduta).",
"Quando esegui una Verifica di Sicurezza Elettrica indica nel campo 'Strumento' quale hai usato — garantisce la rintracciabilità."
]
},
{
icon: "›", title: "Procedure / Knowledge Base", color: "#2DD4BF",
steps: [
"Repository delle tue procedure di test, riparazione e manutenzione stile iFixit.",
"Ogni procedura ha categoria, descrizione, lista passi numerati con descrizione + valore atteso + foto.",
"Crea le procedure standard una volta sola, poi le usi come check-list quando lavori."
]
},
{
icon: "›", title: "Agenda & Pianificazione Annuale", color: "#f59e0b",
steps: [
"Agenda: vista unificata di tutte le attività future (manutenzioni programmate, job aperti, verifiche).",
"Pianificazione Annuale: tutti gli apparecchi con prossimo servizio nell'anno selezionato, raggruppati per mese.",
"Si popola automaticamente quando salvi una Verifica di Sicurezza Elettrica completata (nextService = +1 anno).",
"Esporta il CSV per avere il piano annuale in Excel."
]
},
{
icon: "›", title: "Gesti Mobile e PWA", color: "#2DD4BF",
steps: [
"L'app è installabile come PWA: su Chrome Android tocca menu ⋮ → 'Installa app'. Su iPhone Safari → Condividi → 'Aggiungi a schermata Home'.",
"Una volta installata funziona offline e si comporta come un'app nativa.",
"Gesto: swipe da bordo sinistro verso destra apre il menu laterale (non devi premere ≡).",
"Gesto: tira giù dall'alto per ricaricare i dati (pull-to-refresh).",
"Gesto: swipe a sinistra su una card per eliminarla (con conferma).",
"Tasto BACK Android: chiude prima il modal aperto, poi il menu, poi torna alla Dashboard, poi esce dall'app."
]
},
{
icon: "›", title: "Impostazioni Azienda", color: "#64748b",
steps: [
"Apri Impostazioni dal pulsante ⚙ in alto a destra (mobile) o in fondo alla sidebar (desktop).",
"Compila Nome azienda, Sottotitolo, Indirizzo, P.IVA, IBAN, prefisso preventivi — questi dati appaiono in TUTTI i PDF generati.",
"IMPORTANTE: se il campo 'Nome azienda' è vuoto, i PDF mostreranno 'Documento' come placeholder."
]
},
{
icon: "›", title: "Backup, Importazione, Reset", color: "#64748b",
steps: [
"Impostazioni → 'Esporta backup' scarica direttamente un file .json con tutti i tuoi dati (apparecchi, job, parti, clienti, preventivi, verifiche, strumenti, procedure).",
"Importa backup: seleziona il file .json salvato — sostituisce TUTTI i dati attuali.",
"Unisci backup: aggiunge i dati del file ai tuoi senza sostituirli (utile per importare un altro archivio).",
"Reset totale: cancella tutti i dati. Triplice conferma con parola 'CANCELLA' da digitare per sicurezza.",
"I dati sono salvati nel localStorage del browser. Fai backup regolari — se svuoti la cache i dati spariscono."
]
},
{
icon: "›", title: "Filtri e Ricerca", color: "#2DD4BF",
steps: [
"Ogni lista mobile ha sopra una BARRA DI RICERCA testuale con contatore X/Y a destra.",
"Sotto la ricerca trovi il pulsante ' Filtri': cliccalo per espandere il pannello con tutti i filtri disponibili per quella sezione (marca, modello, stato, cliente, ecc.).",
"Il badge color teal accanto al pulsante Filtri mostra quanti filtri sono attivi.",
"Ricerca e filtri si combinano: vedi solo gli elementi che soddisfano TUTTI i criteri.",
"Pulsante '✕ Pulisci tutti i filtri' in fondo al pannello per resettare."
]
}
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
React.createElement("strong", { style: { color: "#F0F0F5" } }, "2. Esegui Verifica di Sicurezza Elettrica"),
" \u2192 ",
React.createElement("strong", { style: { color: "#F0F0F5" } }, "3. Esegui Verifica Funzionale"),
" \u2192 il sistema crea automaticamente i job e pianifica la manutenzione dell'anno successivo."))));
}
/* ═══ EXCEL TABLE + ALERT CHIP ═══════════════════════════════ */
const TH_S = { background: "#0F0F14", color: "#64748b", padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: .7, borderBottom: "2px solid #1e2a3a", borderRight: "1px solid #141e2e", whiteSpace: "nowrap", cursor: "pointer", userSelect: "none", position: "sticky", top: 0, zIndex: 2 };
const TD_S = { padding: "7px 10px", borderBottom: "1px solid #1A1A24", borderRight: "1px solid #1A1A24", fontSize: 12, color: "#C8C8D8", whiteSpace: "nowrap", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", verticalAlign: "middle" };
function ExcelTable({ cols, rows, onEdit, onDelete, actions, defaultSort, rowBg, onRowClick }) {
var _a;
const isMobile = useMedia("(max-width:900px)");
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
React.createElement("div", { style: { overflowX: isMobile ? "auto" : "visible", overflowY: "auto", border: "1px solid #1e2a3a", borderRadius: "0 0 10px 10px", background: "#111116", maxHeight: "68vh" } },
React.createElement("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: isMobile ? 12 : 12.5, fontFamily: "inherit" } },
React.createElement("thead", null,
React.createElement("tr", null,
cols.map(c => (React.createElement("th", { key: c.key, style: Object.assign(Object.assign({}, TH_S), { color: sort.key === c.key ? "#5EEAD4" : "#64748b", whiteSpace: isMobile ? "nowrap" : "normal" }), onClick: () => toggleSort(c.key) },
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
const bg = rowBg ? rowBg(row) : (i % 2 === 1 ? "#0d0d13" : "transparent");
return (React.createElement("tr", { key: row.id || i, className: "mt-table-row", style: { background: bg, cursor: onRowClick ? "pointer" : undefined }, onDoubleClick: onRowClick ? () => onRowClick(row) : undefined },
cols.map(c => (React.createElement("td", { key: c.key, style: Object.assign(Object.assign({}, TD_S), { whiteSpace: isMobile ? "nowrap" : "normal", maxWidth: isMobile ? 200 : 280, wordBreak: "normal", overflowWrap: "anywhere" }), title: String(row[c.key] || "") }, c.render ? c.render(row[c.key], row) : String(row[c.key] || "—")))),
(onEdit || onDelete || actions) && (React.createElement("td", { style: Object.assign(Object.assign({}, TD_S), { whiteSpace: "nowrap" }) },
React.createElement("div", { style: { display: "flex", gap: 4 } },
actions && actions(row),
onEdit && React.createElement("button", { onClick: () => onEdit(row), style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u270F"),
onDelete && React.createElement("button", { onClick: () => onDelete(row.id), style: { background: "#ef444415", border: "1px solid #ef444430", borderRadius: 5, color: "#ef4444", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2715"))))));
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
/* Mobile-only search bar above card lists */
/* Field error — messaggio rosso sotto un campo invalido */
const FieldError = ({ error }) => {
if (!error)
return null;
return (React.createElement("div", { style: {
fontSize: 11,
color: "#ef4444",
marginTop: 4,
display: "flex",
alignItems: "center",
gap: 4,
lineHeight: 1.3
} },
React.createElement("span", { style: { fontSize: 10 } }, "\u26A0"),
React.createElement("span", null, error)));
};
/* errorBorderStyle — fonde lo stile base con bordo rosso se c'è errore.
Usa: style={errorBorderStyle(INP, errors.fieldName)} */
const errorBorderStyle = (baseStyle, hasError) => {
if (!hasError)
return baseStyle;
return Object.assign(Object.assign({}, baseStyle), { borderColor: "#ef4444", background: "#ef444408" });
};
/* ErrorSummary — banner riepilogo errori in cima al form
Auto-scrolla quando appare e fa una shake animation per attirare l'attenzione */
const ErrorSummary = ({ errors }) => {
const ref = React.useRef(null);
const [shake, setShake] = React.useState(0);
const errorList = Object.entries(errors).filter(([k, v]) => v);
React.useEffect(() => {
if (errorList.length > 0 && ref.current) {
// Scrolla al banner con animazione smooth
try {
ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
}
catch (e) {
ref.current.scrollIntoView(true);
}
// Trigger shake animation re-render
setShake(s => s + 1);
// Vibrazione tattile leggera (Android/S-Pen)
if (navigator.vibrate)
try {
navigator.vibrate([30, 50, 30]);
}
catch (e) { }
}
// eslint-disable-next-line
}, [Object.keys(errors).join(",")]);
if (errorList.length === 0)
return null;
return (React.createElement("div", { ref: ref, key: shake, style: {
background: "#ef444415",
border: "1px solid #ef4444aa",
borderRadius: 8,
padding: "12px 16px",
marginBottom: 8,
fontSize: 12,
color: "#ef4444",
boxShadow: "0 0 0 3px #ef444422",
animation: "mtShake .45s cubic-bezier(.36,.07,.19,.97) both"
} },
React.createElement("div", { style: { fontWeight: 800, marginBottom: 6, fontSize: 13, display: "flex", alignItems: "center", gap: 6 } },
React.createElement("span", { style: { fontSize: 16 } }, "\u26A0"),
React.createElement("span", null, errorList.length === 1 ? "Un campo da completare prima di salvare" : errorList.length + " campi da completare prima di salvare")),
React.createElement("ul", { style: { margin: 0, paddingLeft: 22, fontSize: 12, lineHeight: 1.7, color: "#fca5a5" } }, errorList.map(([k, v]) => React.createElement("li", { key: k }, v)))));
};
/* Spinner — indicatore di caricamento circolare */
const Spinner = ({ size = 18, color = "#2DD4BF" }) => (React.createElement("span", { style: {
display: "inline-block",
width: size,
height: size,
border: `2px solid ${color}33`,
borderTopColor: color,
borderRadius: "50%",
animation: "mtSpin .7s linear infinite",
verticalAlign: "middle"
} }));
/* LoadingOverlay — overlay a tutto schermo con spinner e messaggio.
Usato durante operazioni lunghe (generazione PDF multipli, import grossi) */
const LoadingOverlay = ({ message = "Caricamento…" }) => (React.createElement("div", { style: {
position: "fixed",
inset: 0,
background: "rgba(10,10,14,0.75)",
backdropFilter: "blur(2px)",
zIndex: 5000,
display: "flex",
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: 16
} },
React.createElement(Spinner, { size: 40 }),
React.createElement("div", { style: { color: "#e2e8f0", fontSize: 14, fontWeight: 600 } }, message)));
/* Hint — tooltip "?" cliccabile accanto a un'etichetta di campo tecnico
props: text (contenuto del tooltip). Posizionato relative al genitore.
Click apre/chiude, click esterno chiude */
const Hint = ({ text }) => {
const [open, setOpen] = React.useState(false);
const ref = React.useRef(null);
React.useEffect(() => {
if (!open)
return;
const handler = (e) => { if (ref.current && !ref.current.contains(e.target))
setOpen(false); };
document.addEventListener("mousedown", handler);
document.addEventListener("touchstart", handler);
return () => {
document.removeEventListener("mousedown", handler);
document.removeEventListener("touchstart", handler);
};
}, [open]);
return (React.createElement("span", { ref: ref, style: { position: "relative", display: "inline-flex", alignItems: "center" } },
React.createElement("button", { type: "button", onClick: (e) => { e.stopPropagation(); e.preventDefault(); setOpen(o => !o); }, style: {
marginLeft: 5, width: 14, height: 14, borderRadius: "50%",
background: open ? "#2DD4BF" : "transparent",
border: "1px solid " + (open ? "#2DD4BF" : "#475569"),
color: open ? "#0a0a0e" : "#94a3b8",
fontSize: 9, fontWeight: 800, lineHeight: 1, padding: 0,
cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} }, "?"),
open && (React.createElement("span", { style: {
position: "absolute",
top: "100%",
left: 0,
marginTop: 6,
background: "#0F0F14",
border: "1px solid #2DD4BF66",
borderRadius: 8,
padding: "10px 12px",
fontSize: 11,
color: "#e2e8f0",
lineHeight: 1.5,
width: 280,
maxWidth: "calc(100vw - 40px)",
zIndex: 2000,
boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
fontWeight: 400,
textTransform: "none",
letterSpacing: "normal",
whiteSpace: "normal"
} }, text))));
};
/* EmptyState — placeholder elegante per liste vuote
props: icon (string emoji o SVG), title, subtitle, actions=[{label, onClick, primary}]
Usato in ogni sezione quando non ci sono ancora dati. */
const EmptyState = ({ icon, title, subtitle, actions = [], compact = false }) => {
return (React.createElement("div", { style: {
textAlign: "center",
padding: compact ? "30px 18px" : "48px 24px",
background: "#0F0F14",
borderRadius: 14,
border: "1px dashed #2a3040",
maxWidth: 460,
margin: "12px auto"
} },
icon && (React.createElement("div", { style: {
fontSize: compact ? 36 : 48,
marginBottom: 14,
opacity: 0.4,
filter: "grayscale(0.3)"
} }, icon)),
title && (React.createElement("div", { style: {
fontSize: compact ? 14 : 16,
fontWeight: 700,
color: "#e2e8f0",
marginBottom: subtitle ? 6 : 16
} }, title)),
subtitle && (React.createElement("div", { style: {
fontSize: 12,
color: "#64748b",
lineHeight: 1.6,
marginBottom: actions.length > 0 ? 20 : 0,
maxWidth: 360,
marginLeft: "auto",
marginRight: "auto"
} }, subtitle)),
actions.length > 0 && (React.createElement("div", { style: {
display: "flex",
gap: 10,
justifyContent: "center",
flexWrap: "wrap"
} }, actions.map((a, i) => (React.createElement("button", { key: i, onClick: a.onClick, style: {
background: a.primary ? "#2DD4BF" : "transparent",
color: a.primary ? "#0a0a0e" : "#94a3b8",
border: a.primary ? "none" : "1px solid #2a3040",
borderRadius: 8,
padding: "9px 18px",
fontSize: 13,
fontWeight: 700,
cursor: "pointer",
touchAction: "manipulation",
WebkitTapHighlightColor: "transparent",
transition: "all .15s"
} }, a.label)))))));
};
/* Signature Pad — digitale con touch / S-Pen
props: value (base64 string), onChange (b64=>void), label, height */
const SignaturePad = ({ value, onChange, label, height = 140 }) => {
const canvasRef = React.useRef(null);
const isDrawing = React.useRef(false);
const lastPoint = React.useRef(null);
const [hasContent, setHasContent] = React.useState(!!value);
React.useEffect(() => {
const canvas = canvasRef.current;
if (!canvas)
return;
// Dimensiona per HiDPI / S-Pen pressure
const rect = canvas.getBoundingClientRect();
const dpr = window.devicePixelRatio || 1;
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
const ctx = canvas.getContext("2d");
ctx.scale(dpr, dpr);
ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = "#000";
ctx.lineWidth = 2;
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, rect.width, rect.height);
// Se c'è un valore salvato, lo ridisegno
if (value) {
const img = new Image();
img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
img.src = value;
}
}, [height]);
const getXY = (e) => {
const canvas = canvasRef.current;
const rect = canvas.getBoundingClientRect();
if (e.touches && e.touches.length > 0) {
return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
}
return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};
const start = (e) => {
e.preventDefault();
isDrawing.current = true;
lastPoint.current = getXY(e);
};
const draw = (e) => {
if (!isDrawing.current)
return;
e.preventDefault();
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const p = getXY(e);
// Pressure-sensitive con S-Pen / pointer events
let pressure = 0.5;
if (e.pointerType === "pen" && e.pressure)
pressure = e.pressure;
else if (e.touches && e.touches[0] && e.touches[0].force)
pressure = e.touches[0].force;
ctx.lineWidth = 1 + pressure * 2.5;
ctx.beginPath();
ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
ctx.lineTo(p.x, p.y);
ctx.stroke();
lastPoint.current = p;
setHasContent(true);
};
const end = (e) => {
if (!isDrawing.current)
return;
isDrawing.current = false;
const canvas = canvasRef.current;
const b64 = canvas.toDataURL("image/png");
onChange && onChange(b64);
};
const clear = () => {
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, rect.width, rect.height);
setHasContent(false);
onChange && onChange("");
};
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
label && React.createElement("label", { style: { fontSize: 11, color: "#94a3b8", fontWeight: 600 } }, label),
React.createElement("div", { style: { position: "relative", border: "1px solid #2a3040", borderRadius: 8, background: "#fff", overflow: "hidden" } },
React.createElement("canvas", { ref: canvasRef, style: { display: "block", width: "100%", height: height + "px", touchAction: "none", cursor: "crosshair" }, onMouseDown: start, onMouseMove: draw, onMouseUp: end, onMouseLeave: end, onTouchStart: start, onTouchMove: draw, onTouchEnd: end, onPointerDown: start, onPointerMove: draw, onPointerUp: end }),
!hasContent && (React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", color: "#94a3b8", fontSize: 13, fontStyle: "italic" } }, "Firma qui (usa S-Pen o dito)"))),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 } },
React.createElement("button", { type: "button", onClick: clear, style: { background: "transparent", border: "1px solid #2a3040", color: "#94a3b8", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", touchAction: "manipulation" } }, "Cancella firma"))));
};
const MobileSearch = ({ value, onChange, count, total, placeholder }) => (React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#0F0F14", border: "1px solid #1e2a3a", borderRadius: 10, padding: "8px 12px", marginBottom: 10 } },
React.createElement("span", { style: { fontSize: 14, color: "#64748b" } }, "\uD83D\uDD0D"),
React.createElement("input", { "data-mt-search": "1", value: value, onChange: e => onChange(e.target.value), placeholder: placeholder || "Cerca…", style: { flex: 1, background: "transparent", border: "none", color: "#e2e8f0", fontSize: 14, outline: "none", minWidth: 0 } }),
value && (React.createElement("button", { onClick: () => onChange(""), style: { background: "none", border: "none", color: "#64748b", fontSize: 16, cursor: "pointer", padding: "0 4px", touchAction: "manipulation" } }, "\u2715")),
React.createElement("span", { style: { fontSize: 10, color: "#475569", fontFamily: "monospace", whiteSpace: "nowrap" } },
count,
"/",
total)));
/* Swipeable card wrapper: swipe-left reveals a delete action */
const SwipeableCard = ({ children, onDelete, threshold = 80 }) => {
const [dx, setDx] = React.useState(0);
const [startX, setStartX] = React.useState(null);
const [startY, setStartY] = React.useState(null);
const [locked, setLocked] = React.useState(false); // horizontal-only after lock
const onTouchStart = (e) => {
const t = e.touches[0];
setStartX(t.clientX);
setStartY(t.clientY);
setLocked(false);
};
const onTouchMove = (e) => {
if (startX === null)
return;
const t = e.touches[0];
const deltaX = t.clientX - startX;
const deltaY = t.clientY - startY;
if (!locked) {
// Lock dopo 8px se è chiaramente orizzontale
if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
setLocked(true);
}
else if (Math.abs(deltaY) > 8) {
// Verticale → cancella swipe
setStartX(null);
setStartY(null);
setDx(0);
return;
}
}
if (locked) {
// Solo swipe verso SX consentito (deltaX negativo)
if (deltaX < 0)
setDx(Math.max(deltaX, -140));
else
setDx(0);
}
};
const onTouchEnd = () => {
if (dx < -threshold) {
// Conferma swipe → apri delete
setDx(-100);
setTimeout(() => { onDelete && onDelete(); setDx(0); }, 80);
}
else {
setDx(0);
}
setStartX(null);
setStartY(null);
setLocked(false);
};
return (React.createElement("div", { style: { position: "relative", overflow: "hidden", borderRadius: 12 } },
React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, #ef4444 60%)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 20px", pointerEvents: "none" } },
React.createElement("span", { style: { color: "#fff", fontSize: 14, fontWeight: 800, opacity: dx < -30 ? 1 : 0, transition: "opacity .15s" } }, "\u2715 Elimina")),
React.createElement("div", { onTouchStart: onTouchStart, onTouchMove: onTouchMove, onTouchEnd: onTouchEnd, style: {
transform: `translateX(${dx}px)`,
transition: startX === null ? "transform .2s ease" : "none",
position: "relative",
background: "transparent",
} }, children)));
};
/* Filter dropdown con multiple categorie.
filters = { categoryKey: { label, options: string[], value: string } }
onChange = (categoryKey, newValue) => void
activeCount = numero filtri attivi (per badge) */
const FilterDropdown = ({ filters, onChange, onClearAll }) => {
const [open, setOpen] = React.useState(false);
const activeCount = Object.values(filters).filter(f => f.value).length;
return (React.createElement("div", { style: { marginBottom: 10 } },
React.createElement("button", { onClick: () => setOpen(o => !o), style: {
width: "100%",
display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
background: activeCount > 0 ? "#2DD4BF15" : "#0F0F14",
border: "1px solid " + (activeCount > 0 ? "#2DD4BF55" : "#1e2a3a"),
borderRadius: 10, padding: "9px 14px",
color: activeCount > 0 ? "#2DD4BF" : "#94a3b8", fontSize: 13, fontWeight: 700,
cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent"
} },
React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 8 } },
"Filtri ",
activeCount > 0 && React.createElement("span", { style: { background: "#2DD4BF", color: "#000", borderRadius: 10, padding: "1px 8px", fontSize: 11, fontWeight: 800 } }, activeCount)),
React.createElement("span", { style: { fontSize: 11, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" } }, "\u25BC")),
open && (React.createElement("div", { style: { marginTop: 8, background: "#0D0D12", border: "1px solid #1e2a3a", borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 } },
Object.entries(filters).map(([key, fdef]) => (React.createElement("div", { key: key },
React.createElement("div", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 5 } }, fdef.label),
React.createElement("select", { value: fdef.value, onChange: e => onChange(key, e.target.value), style: {
width: "100%", background: "#16161C", border: "1px solid #2a3040", borderRadius: 6,
padding: "7px 10px", color: "#e2e8f0", fontSize: 13, outline: "none",
fontFamily: "inherit", appearance: "none", paddingRight: 30,
} },
React.createElement("option", { value: "" }, "\u2014 Tutti \u2014"),
fdef.options.map(opt => (React.createElement("option", { key: opt, value: opt }, opt))))))),
activeCount > 0 && (React.createElement("button", { onClick: onClearAll, style: { background: "transparent", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 6, padding: "7px 10px", cursor: "pointer", fontSize: 12, fontWeight: 700, marginTop: 4, touchAction: "manipulation" } }, "\u2715 Pulisci tutti i filtri"))))));
};
/* AssetCombobox — selettore apparecchio con ricerca live.
Sostituisce un dropdown nativo per liste grandi (1000+ apparecchi).
props:
value      — id apparecchio attualmente selezionato
onChange   — (newId) => void
assets     — array completo di apparecchi
customers  — array clienti (per mostrare nome cliente nel risultato)
placeholder, required, error
*/
const AssetCombobox = ({ value, onChange, assets, customers, placeholder = "Cerca apparecchio…", error, autoFocus = false }) => {
const [open, setOpen] = React.useState(false);
const [query, setQuery] = React.useState("");
const [highlighted, setHighlighted] = React.useState(0);
const wrapperRef = React.useRef(null);
const inputRef = React.useRef(null);
const selected = assets.find(a => a.id === value);
// Filtra apparecchi in base alla query
const filtered = React.useMemo(() => {
if (!query.trim())
return assets.slice(0, 50); // Mostra primi 50 se nessuna query
const q = query.toLowerCase();
return assets.filter(a => {
var _a;
const cust = ((_a = customers === null || customers === void 0 ? void 0 : customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "";
return [a.name, a.brand, a.model, a.serial, a.location, a.id, cust]
.filter(Boolean)
.some(f => String(f).toLowerCase().includes(q));
}).slice(0, 100); // Limite a 100 risultati per perf
}, [query, assets, customers]);
// Click esterno chiude il dropdown
React.useEffect(() => {
if (!open)
return;
const handler = (e) => {
if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
setOpen(false);
setQuery("");
}
};
document.addEventListener("mousedown", handler);
document.addEventListener("touchstart", handler);
return () => {
document.removeEventListener("mousedown", handler);
document.removeEventListener("touchstart", handler);
};
}, [open]);
// Autofocus quando apre
React.useEffect(() => {
if (open && inputRef.current)
inputRef.current.focus();
}, [open]);
// Reset highlight quando cambia filter
React.useEffect(() => { setHighlighted(0); }, [query]);
const handleSelect = (asset) => {
onChange(asset.id);
setOpen(false);
setQuery("");
};
const handleKey = (e) => {
if (e.key === "ArrowDown") {
e.preventDefault();
setHighlighted(h => Math.min(h + 1, filtered.length - 1));
}
else if (e.key === "ArrowUp") {
e.preventDefault();
setHighlighted(h => Math.max(h - 1, 0));
}
else if (e.key === "Enter") {
e.preventDefault();
if (filtered[highlighted])
handleSelect(filtered[highlighted]);
}
else if (e.key === "Escape") {
setOpen(false);
setQuery("");
}
};
const INP_BASE = {
background: "#141418",
border: "1px solid " + (error ? "#ef4444" : "#2a3040"),
borderRadius: 8,
padding: "9px 11px",
color: "#e2e8f0",
fontSize: 13,
outline: "none",
width: "100%",
boxSizing: "border-box",
cursor: "pointer"
};
return (React.createElement("div", { ref: wrapperRef, style: { position: "relative", width: "100%" } }, !open ? (React.createElement("div", { onClick: () => setOpen(true), style: Object.assign(Object.assign({}, INP_BASE), { display: "flex", alignItems: "center", gap: 8, minHeight: 38 }) }, selected ? (React.createElement(React.Fragment, null,
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { color: "#e2e8f0", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, selected.name),
React.createElement("div", { style: { color: "#64748b", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },
[selected.brand, selected.model].filter(Boolean).join(" "),
selected.serial && React.createElement("span", { style: { fontFamily: "monospace", marginLeft: 6 } },
"\u00B7 S/N: ",
selected.serial))),
React.createElement("button", { type: "button", onClick: (e) => { e.stopPropagation(); onChange(""); }, title: "Rimuovi selezione", style: { background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", padding: "2px 6px", touchAction: "manipulation" } }, "\u2715"),
React.createElement("span", { style: { color: "#64748b", fontSize: 11 } }, "\u25BE"))) : (React.createElement(React.Fragment, null,
React.createElement("span", { style: { flex: 1, color: "#64748b", fontSize: 13 } }, placeholder),
React.createElement("span", { style: { color: "#64748b", fontSize: 11 } }, "\u25BE"))))) : (React.createElement(React.Fragment, null,
React.createElement("input", { ref: inputRef, type: "text", value: query, onChange: e => setQuery(e.target.value), onKeyDown: handleKey, placeholder: "Cerca per nome, marca, modello, S/N, ubicazione\u2026", style: Object.assign(Object.assign({}, INP_BASE), { cursor: "text" }) }),
React.createElement("div", { style: {
position: "absolute",
top: "calc(100% + 4px)",
left: 0,
right: 0,
background: "#0F0F14",
border: "1px solid #2a3040",
borderRadius: 8,
maxHeight: 320,
overflowY: "auto",
zIndex: 1000,
boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
} }, filtered.length === 0 ? (React.createElement("div", { style: { padding: "16px", textAlign: "center", color: "#64748b", fontSize: 12 } }, assets.length === 0 ? "Nessun apparecchio registrato" : "Nessun risultato per \"" + query + "\"")) : (React.createElement(React.Fragment, null,
!query.trim() && assets.length > 50 && (React.createElement("div", { style: { padding: "6px 12px", fontSize: 10, color: "#64748b", borderBottom: "1px solid #1e2a3a", background: "#0a0a0e", fontStyle: "italic" } },
"Mostro primi 50 \u00B7 digita per cercare tra tutti i ",
assets.length)),
filtered.map((a, i) => {
var _a;
const cust = (_a = customers === null || customers === void 0 ? void 0 : customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name;
const isHigh = i === highlighted;
const isSel = a.id === value;
return (React.createElement("div", { key: a.id, onClick: () => handleSelect(a), onMouseEnter: () => setHighlighted(i), style: {
padding: "9px 12px",
cursor: "pointer",
borderBottom: "1px solid #14182a",
background: isHigh ? "#2DD4BF11" : (isSel ? "#1e2a3a" : "transparent"),
borderLeft: isSel ? "3px solid #2DD4BF" : "3px solid transparent",
transition: "all .1s"
} },
React.createElement("div", { style: { color: "#e2e8f0", fontSize: 13, fontWeight: 600, lineHeight: 1.3 } }, a.name),
React.createElement("div", { style: { color: "#64748b", fontSize: 11, marginTop: 2, lineHeight: 1.4 } },
[a.brand, a.model].filter(Boolean).join(" "),
a.serial && React.createElement("span", { style: { fontFamily: "monospace", marginLeft: 6 } },
"\u00B7 S/N: ",
a.serial),
a.location && React.createElement("span", { style: { marginLeft: 6 } },
"\u00B7 ",
a.location)),
cust && React.createElement("div", { style: { color: "#94a3b8", fontSize: 10, marginTop: 2 } }, cust)));
}),
filtered.length === 100 && (React.createElement("div", { style: { padding: "6px 12px", fontSize: 10, color: "#64748b", textAlign: "center", borderTop: "1px solid #1e2a3a", fontStyle: "italic" } }, "Solo primi 100 risultati \u00B7 affina la ricerca per vedere pi\u00F9 specifico")))))))));
};
const Pill = ({ label, value, color, sub, onClick }) => {
const c = color || "#2DD4BF";
const clickable = !!onClick;
return (React.createElement("div", { onClick: onClick, style: {
background: "linear-gradient(135deg, #16161D 0%, #121218 100%)",
border: "1px solid #2A2A38",
borderLeft: "3px solid " + c,
borderRadius: 10,
padding: "13px 16px",
flex: 1,
minWidth: 120,
boxShadow: "0 2px 10px #0007, inset 0 1px 0 #ffffff05",
position: "relative",
overflow: "hidden",
cursor: clickable ? "pointer" : "default",
transition: "transform .15s ease, border-color .15s ease, box-shadow .15s ease",
WebkitTapHighlightColor: "transparent",
touchAction: "manipulation",
}, onMouseEnter: clickable ? (e) => { e.currentTarget.style.borderColor = c + "66"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 14px #0009, 0 0 0 1px " + c + "22, inset 0 1px 0 #ffffff08"; } : undefined, onMouseLeave: clickable ? (e) => { e.currentTarget.style.borderColor = "#2A2A38"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 10px #0007, inset 0 1px 0 #ffffff05"; } : undefined },
React.createElement("div", { style: {
position: "absolute", top: 0, right: 0, width: 60, height: 60,
background: "radial-gradient(circle at top right, " + c + "15, transparent 70%)",
pointerEvents: "none"
} }),
React.createElement("div", { style: { fontSize: 22, fontWeight: 900, color: c, lineHeight: 1, fontFamily: "monospace", letterSpacing: -0.5 } }, value),
React.createElement("div", { style: { fontSize: 10, color: "#7A7A8E", marginTop: 6, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, label),
sub && React.createElement("div", { style: { fontSize: 9, color: "#4A4A60", marginTop: 2 } }, sub),
clickable && React.createElement("div", { style: { position: "absolute", bottom: 6, right: 9, fontSize: 11, color: c + "99", fontWeight: 600 } }, "\u203A")));
};
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
var { label, hint } = _a, p = __rest(_a, ["label", "hint"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, display: "flex", alignItems: "center" } },
label,
hint && React.createElement(Hint, { text: hint })),
React.createElement("input", Object.assign({}, p, { style: Object.assign({ background: "#141418", border: "1px solid #2a3040", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", outline: "none", width: "100%", boxSizing: "border-box" }, (p.style || {})) }))));
}
function Sel(_a) {
var { label, hint, children } = _a, p = __rest(_a, ["label", "hint", "children"]);
return (React.createElement("label", { style: { display: "flex", flexDirection: "column", gap: 5 } },
label && React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, display: "flex", alignItems: "center" } },
label,
hint && React.createElement(Hint, { text: hint })),
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
React.createElement("div", { style: { background: "#16161D", border: "1px solid #2a3040", borderRadius: 16, width: wide ? "min(820px,97vw)" : "min(620px,97vw)", maxHeight: "93vh", overflowY: "auto", padding: 0, boxSizing: "border-box", animation: "mtFadeIn .2s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #1e2a3a", position: "sticky", top: 0, background: "#16161D", zIndex: 5, borderRadius: "16px 16px 0 0" } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 16 } }, title),
React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: "#64748b", fontSize: 24, cursor: "pointer", lineHeight: 1, padding: 0 } }, "\u00D7")),
React.createElement("div", { style: { padding: 24 } }, children))));
}
function Grid({ cols, gap = 14, children }) {
const isMobile = useMedia("(max-width:600px)");
return React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : cols, gap } }, children);
}
function Span2({ children }) {
const isMobile = useMedia("(max-width:600px)");
return React.createElement("div", { style: { gridColumn: isMobile ? "span 1" : "span 2" } }, children);
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
/* ═══ FORMS ═══════════════════════════════════════════════════ */
function CustomerForm({ initial, onSave, onClose }) {
const blank = { name: "", vat: "", fiscalCode: "", address: "", contact: "", email: "", phone: "", notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign({}, blank), initial) : blank);
const [errors, setErrors] = React.useState({});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
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
React.createElement(Btn, { onClick: () => {
var _a;
const errs = {};
if (!((_a = f.name) === null || _a === void 0 ? void 0 : _a.trim()))
errs.name = "La ragione sociale è obbligatoria";
if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
errs.email = "Email non valida";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(f);
} }, "Salva"))));
}
function AssetForm({ initial, customers, onSave, onClose }) {
const blank = { name: "", brand: "", model: "", serial: "", location: "", customerId: "", status: "operativo", lastService: "", nextService: "", serviceInterval: 6, notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign({}, blank), initial) : blank);
const [errors, setErrors] = React.useState({});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(ErrorSummary, { errors: errors }),
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
React.createElement(Sel, { label: "Norma sicurezza", hint: "IEC 62353: apparecchiature elettromedicali (defibrillatori, monitor, ventilatori). IEC 61010-1: strumenti da laboratorio e misura (oscilloscopi, alimentatori, sonde). Definisce i limiti delle dispersioni e i test da effettuare.", value: f.iecNorm || "62353", onChange: e => setF(x => (Object.assign(Object.assign({}, x), { iecNorm: e.target.value }))) },
React.createElement("option", { value: "62353" }, "IEC 62353 \u2014 Elettromedicale"),
React.createElement("option", { value: "61010" }, "IEC 61010-1 \u2014 Laboratorio"),
React.createElement("option", { value: "" }, "Non applicabile")),
React.createElement(Sel, { label: "Classe di rischio", hint: "Classificazione MDR (Reg. UE 2017/745): A = basso rischio (es. termometri non invasivi), B = medio (monitor, pompe), C = alto (defibrillatori, ventilatori vita-critici), D = altissimo (impiantabili). Determina la frequenza delle verifiche e la severit\u00E0.", value: f.riskClass || "", onChange: s("riskClass") },
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
React.createElement(Btn, { onClick: () => {
var _a;
const errs = {};
if (!((_a = f.name) === null || _a === void 0 ? void 0 : _a.trim()))
errs.name = "Il nome dell'apparecchio è obbligatorio";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(Object.assign(Object.assign({}, f), { serviceInterval: +f.serviceInterval }));
} }, "Salva"))));
}
function PartForm({ initial, assets, onSave, onClose }) {
const blank = { code: "", name: "", brand: "", compatible: [], qty: 0, minQty: 0, unitPrice: 0, sellPrice: 0, markupPct: 30, location: "", notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign(Object.assign({}, blank), initial), { sellPrice: initial.sellPrice || initial.unitPrice, markupPct: initial.markupPct || 0, compatible: initial.compatible || [] }) : blank);
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
const [f, setF] = React.useState(initial ? Object.assign(Object.assign(Object.assign({}, blank), initial), { timeline: initial.timeline || [], photos: initial.photos || [], parts: initial.parts || [] }) : blank);
const [errors, setErrors] = React.useState({});
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
// Pre-popolazione contestuale: quando si seleziona un apparecchio, eredita il cliente
React.useEffect(() => {
if (f.assetId && !f.customerId) {
const a = assets.find(x => x.id === f.assetId);
if (a === null || a === void 0 ? void 0 : a.customerId)
setF(x => (Object.assign(Object.assign({}, x), { customerId: a.customerId })));
}
}, [f.assetId]);
const addPart = () => setF(x => { var _a; return (Object.assign(Object.assign({}, x), { parts: [...x.parts, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }] })); });
const remPart = i => setF(x => (Object.assign(Object.assign({}, x), { parts: x.parts.filter((_, idx) => idx !== i) })));
const setPart = (i, k, v) => setF(x => { const a = [...x.parts]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "qty" ? +v : v }); return Object.assign(Object.assign({}, x), { parts: a }); });
// Timeline interventi
const addStep = () => setF(x => (Object.assign(Object.assign({}, x), { timeline: [...(x.timeline || []), {
id: "T" + Date.now(),
date: new Date().toISOString().slice(0, 10),
time: new Date().toTimeString().slice(0, 5),
type: "sopralluogo",
description: "",
durationMin: 30,
technician: x.assignee || ""
}] })));
const remStep = i => setF(x => (Object.assign(Object.assign({}, x), { timeline: (x.timeline || []).filter((_, idx) => idx !== i) })));
const setStep = (i, k, v) => setF(x => { const a = [...(x.timeline || [])]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "durationMin" ? +v : v }); return Object.assign(Object.assign({}, x), { timeline: a }); });
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
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
React.createElement("label", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Apparecchio"),
React.createElement(AssetCombobox, { value: f.assetId, onChange: id => setF(x => (Object.assign(Object.assign({}, x), { assetId: id }))), assets: assets, customers: customers, placeholder: "Seleziona apparecchio" })),
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
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, " Timeline interventi"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addStep }, "+ Nuovo passaggio")),
(f.timeline || []).length === 0 ? (React.createElement("div", { style: { padding: "14px 16px", background: "#0D0D12", border: "1px dashed #2a3040", borderRadius: 8, fontSize: 12, color: "#64748b", textAlign: "center" } }, "Nessun passaggio registrato. Aggiungi sopralluogo, attesa parti, riparazione, test finale...")) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
f.timeline.map((step, i) => (React.createElement("div", { key: step.id || i, style: { background: "#0D0D12", border: "1px solid #1e2a3a", borderLeft: "3px solid #2DD4BF", borderRadius: 8, padding: "10px 12px" } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 } },
React.createElement("input", { type: "date", value: step.date, onChange: e => setStep(i, "date", e.target.value), style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 6, padding: "6px 9px", color: "#e2e8f0", fontSize: 12 } }),
React.createElement("input", { type: "time", value: step.time, onChange: e => setStep(i, "time", e.target.value), style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 6, padding: "6px 9px", color: "#e2e8f0", fontSize: 12 } })),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 90px", gap: 8, marginBottom: 8 } },
React.createElement("select", { value: step.type, onChange: e => setStep(i, "type", e.target.value), style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 6, padding: "6px 9px", color: "#e2e8f0", fontSize: 12 } },
React.createElement("option", { value: "sopralluogo" }, "Sopralluogo / Diagnosi"),
React.createElement("option", { value: "attesa_preventivo" }, "Attesa preventivo"),
React.createElement("option", { value: "attesa_parti" }, "Attesa parti / ricambi"),
React.createElement("option", { value: "attesa_autorizzazione" }, "Attesa autorizzazione cliente"),
React.createElement("option", { value: "riparazione" }, "Riparazione / Intervento"),
React.createElement("option", { value: "test" }, "Test funzionale"),
React.createElement("option", { value: "verifica_sicurezza" }, "Verifica sicurezza elettrica"),
React.createElement("option", { value: "consegna" }, "Consegna / Riconsegna"),
React.createElement("option", { value: "chiamata" }, "Chiamata cliente"),
React.createElement("option", { value: "email" }, "Email / Comunicazione"),
React.createElement("option", { value: "altro" }, "Altro")),
React.createElement("input", { type: "number", min: 0, step: 5, value: step.durationMin, onChange: e => setStep(i, "durationMin", e.target.value), placeholder: "min", style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 6, padding: "6px 9px", color: "#e2e8f0", fontSize: 12, fontFamily: "monospace" } })),
React.createElement("input", { type: "text", value: step.description, onChange: e => setStep(i, "description", e.target.value), placeholder: "Descrizione (cosa \u00E8 stato fatto / cosa si attende)", style: { width: "100%", background: "#141418", border: "1px solid #2a3040", borderRadius: 6, padding: "6px 9px", color: "#e2e8f0", fontSize: 12, marginBottom: 8 } }),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, alignItems: "center" } },
React.createElement("input", { type: "text", value: step.technician || "", onChange: e => setStep(i, "technician", e.target.value), placeholder: "Tecnico", style: { background: "#141418", border: "1px solid #2a3040", borderRadius: 6, padding: "6px 9px", color: "#e2e8f0", fontSize: 12 } }),
React.createElement(Btn, { variant: "danger", sm: true, onClick: () => remStep(i) }, "\u2715"))))),
f.timeline.length > 0 && (React.createElement("div", { style: { padding: "8px 12px", background: "#141418", borderRadius: 6, fontSize: 11, color: "#64748b", textAlign: "right" } },
"Tempo totale lavorato: ",
React.createElement("strong", { style: { color: "#22c55e", fontFamily: "monospace" } },
(f.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0) / 60).toFixed(1),
"h"),
" (",
f.timeline.reduce((s, t) => s + (+t.durationMin || 0), 0),
" min)"))))),
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => {
var _a;
const errs = {};
if (!f.assetId)
errs.assetId = "Seleziona un apparecchio";
if (!((_a = f.description) === null || _a === void 0 ? void 0 : _a.trim()))
errs.description = "Descrizione del lavoro obbligatoria";
if (!f.openDate)
errs.openDate = "Inserisci la data di apertura";
if (f.status === "chiuso" && !f.closeDate)
errs.closeDate = "Data chiusura obbligatoria se lo stato è chiuso";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(Object.assign(Object.assign({}, f), { laborHours: +f.laborHours, laborRate: +f.laborRate }));
} }, "Salva"))));
}
function OrderForm({ initial, parts, onSave, onClose }) {
var _a;
const blank = { supplier: "", partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1, unitPrice: 0, status: "in attesa", orderDate: new Date().toISOString().slice(0, 10), expectedDate: "", notes: "" };
const [f, setF] = React.useState(initial ? Object.assign(Object.assign({}, blank), initial) : blank);
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
function InvoiceForm({ initial, customers, jobs, assets, parts, generateNumber, onSave, onClose }) {
var _a;
const blank = {
number: generateNumber(),
customerId: ((_a = customers[0]) === null || _a === void 0 ? void 0 : _a.id) || "",
date: new Date().toISOString().slice(0, 10),
dueDate: "",
status: "bozza",
items: [],
jobIds: [],
paymentTerms: "Bonifico bancario a 30gg data preventivo",
notes: ""
};
const [f, setF] = React.useState(initial ? Object.assign(Object.assign(Object.assign({}, blank), initial), { items: initial.items || [], jobIds: initial.jobIds || [] }) : blank);
const s = k => e => setF(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
const addItem = () => setF(x => (Object.assign(Object.assign({}, x), { items: [...x.items, { description: "", qty: 1, unitPrice: 0, vat: IVA_DEFAULT }] })));
const remItem = i => setF(x => (Object.assign(Object.assign({}, x), { items: x.items.filter((_, idx) => idx !== i) })));
const setItem = (i, k, v) => setF(x => { const a = [...x.items]; a[i] = Object.assign(Object.assign({}, a[i]), { [k]: k === "qty" || k === "unitPrice" || k === "vat" ? +v : v }); return Object.assign(Object.assign({}, x), { items: a }); });
// Import from a job
const importFromJob = (jobId) => {
const job = jobs.find(j => j.id === jobId);
if (!job)
return;
const asset = assets.find(a => a.id === job.assetId);
const newItems = [];
job.parts.forEach(p => {
const pt = parts.find(x => x.id === p.partId);
if (pt)
newItems.push({
description: (pt.name) + " (" + (pt.code) + ")",
qty: p.qty, unitPrice: pt.sellPrice || pt.unitPrice, vat: IVA_DEFAULT
});
});
if (job.laborHours > 0) {
newItems.push({
description: "Manodopera - " + ((asset === null || asset === void 0 ? void 0 : asset.name) || "intervento") + " (rif. " + (job.id) + ")",
qty: job.laborHours, unitPrice: job.laborRate, vat: IVA_DEFAULT
});
}
setF(x => (Object.assign(Object.assign({}, x), { items: [...x.items, ...newItems], jobIds: x.jobIds.includes(jobId) ? x.jobIds : [...x.jobIds, jobId], customerId: x.customerId || job.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId) || x.customerId })));
};
const subtotal = f.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
const totalVAT = f.items.reduce((s, it) => s + (it.qty * it.unitPrice * it.vat / 100), 0);
const grandTotal = subtotal + totalVAT;
// Jobs for this customer not yet invoiced
const customerJobs = jobs.filter(j => {
if (j.status !== "chiuso")
return false;
const asset = assets.find(a => a.id === j.assetId);
return (j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId)) === f.customerId;
});
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } },
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Numero preventivo", value: f.number, onChange: s("number") }),
React.createElement(Sel, { label: "Stato", value: f.status, onChange: s("status") }, ["bozza", "emessa", "pagata", "scaduta", "annullato"].map(v => React.createElement("option", { key: v }, v))),
React.createElement(Sel, { label: "Cliente", value: f.customerId, onChange: s("customerId") },
React.createElement("option", { value: "" }, "\u2014 Seleziona \u2014"),
customers.map(c => React.createElement("option", { key: c.id, value: c.id }, c.name))),
React.createElement("div", null),
React.createElement(Inp, { label: "Data preventivo", type: "date", value: f.date, onChange: s("date") }),
React.createElement(Inp, { label: "Data scadenza", type: "date", value: f.dueDate, onChange: s("dueDate") })),
f.customerId && customerJobs.length > 0 && (React.createElement("div", { style: { background: "#0D0D12", borderRadius: 10, padding: "10px 14px", border: "1px solid #2a3040" } },
React.createElement("div", { style: { fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Job chiusi del cliente"),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, customerJobs.map(j => {
const used = f.jobIds.includes(j.id);
return (React.createElement("button", { key: j.id, onClick: () => !used && importFromJob(j.id), disabled: used, style: {
background: used ? "#22c55e22" : "#1E1E28",
border: "1px solid " + (used ? "#22c55e44" : "#32323F"),
color: used ? "#22c55e" : "#94a3b8", borderRadius: 8, padding: "5px 10px", cursor: used ? "default" : "pointer", fontSize: 11
} },
used ? "✓ " : "+ ",
j.id));
})))),
React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
React.createElement("span", { style: { fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, "Righe preventivo"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: addItem }, "+ Riga")),
f.items.map((it, i) => (React.createElement("div", { key: i, style: { background: "#141418", borderRadius: 8, padding: 10, marginBottom: 8, display: "grid", gridTemplateColumns: "1fr 70px 90px 60px auto", gap: 6, alignItems: "center" } },
React.createElement("input", { value: it.description, onChange: e => setItem(i, "description", e.target.value), placeholder: "Descrizione", style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 6, padding: "7px 9px", color: "#e2e8f0", outline: "none", minWidth: 0 } }),
React.createElement("input", { type: "number", value: it.qty, onChange: e => setItem(i, "qty", e.target.value), placeholder: "Q.t\u00E0", step: "0.5", style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 6, padding: "7px 9px", color: "#e2e8f0", outline: "none" } }),
React.createElement("input", { type: "number", value: it.unitPrice, onChange: e => setItem(i, "unitPrice", e.target.value), placeholder: "\u20AC", step: "0.01", style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 6, padding: "7px 9px", color: "#e2e8f0", outline: "none" } }),
React.createElement("input", { type: "number", value: it.vat, onChange: e => setItem(i, "vat", e.target.value), placeholder: "IVA%", style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 6, padding: "7px 9px", color: "#e2e8f0", outline: "none" } }),
React.createElement(Btn, { sm: true, variant: "danger", onClick: () => remItem(i) }, "\u2715")))),
f.items.length === 0 && React.createElement("div", { style: { textAlign: "center", color: "#475569", padding: "16px 0", fontSize: 12 } }, "Nessuna riga. Aggiungi a mano o importa da un job.")),
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 10, padding: "14px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 } },
React.createElement("span", { style: { color: "#94a3b8" } }, "Imponibile"),
React.createElement("span", { style: { color: "#e2e8f0", fontWeight: 700 } },
"\u20AC",
subtotal.toFixed(2))),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 } },
React.createElement("span", { style: { color: "#94a3b8" } }, "IVA"),
React.createElement("span", { style: { color: "#e2e8f0", fontWeight: 700 } },
"\u20AC",
totalVAT.toFixed(2))),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontSize: 16, paddingTop: 8, borderTop: "1px solid #2a3040" } },
React.createElement("span", { style: { color: "#94a3b8", fontWeight: 700 } }, "TOTALE"),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 800 } },
"\u20AC",
grandTotal.toFixed(2)))),
React.createElement(Inp, { label: "Modalit\u00E0 di pagamento", value: f.paymentTerms, onChange: s("paymentTerms") }),
React.createElement(Txt, { label: "Note", value: f.notes, onChange: s("notes") }),
React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Annulla"),
React.createElement(Btn, { onClick: () => onSave(f) }, "Salva"))));
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
function WithdrawalModal({ parts, assets, preselectPartId, onWithdraw, onClose }) {
var _a, _b;
const [items, setItems] = React.useState([{ partId: preselectPartId || ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }]);
const [errors, setErrors] = React.useState({});
const [reason, setReason] = React.useState("");
const [assetId, setAssetId] = React.useState(((_b = assets[0]) === null || _b === void 0 ? void 0 : _b.id) || "");
const [tech, setTech] = React.useState("");
const addRow = () => setItems(i => { var _a; return [...i, { partId: ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.id) || "", qty: 1 }]; });
const remRow = i => setItems(a => a.filter((_, idx) => idx !== i));
const setRow = (i, k, v) => setItems(a => { const r = [...a]; r[i] = Object.assign(Object.assign({}, r[i]), { [k]: k === "qty" ? +v : v }); return r; });
const total = items.reduce((s, r) => { const p = parts.find(x => x.id === r.partId); return s + (p ? p.unitPrice * r.qty : 0); }, 0);
const submit = () => {
const errs = {};
if (!assetId)
errs.assetId = "Seleziona l'apparecchio";
items.forEach((r, idx) => {
const p = parts.find(x => x.id === r.partId);
if (!p) {
errs["item_" + idx] = "Parte non trovata alla riga " + (idx + 1);
return;
}
if (r.qty < 1)
errs["item_" + idx] = "Quantità deve essere ≥1 alla riga " + (idx + 1) + " (" + p.name + ")";
else if (r.qty > p.qty)
errs["item_" + idx] = "Quantità " + r.qty + " > disponibili " + p.qty + " (" + p.name + ")";
});
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
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
React.createElement(ErrorSummary, { errors: errors }),
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
function AssetDetailModal({ asset, jobs, parts, iecReports, funcReports, customers, onClose, onEditAsset, onNewJob, onNewIec, onNewFunc, onOpenJob, company, generateJobPDF, generateIECPDF, generateFuncPDF }) {
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
const TABS = [{ id: "overview", label: " Scheda" }, { id: "jobs", label: " Job (" + assetJobs.length + ")" }, { id: "iec", label: "⚡ Sicurezza (" + assetIec.length + ")" }, { id: "func", label: "Funzionale (" + assetFunc.length + ")" }];
const riskColor = { A: "#22c55e", B: "#f59e0b", C: "#ef4444" };
return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0, minHeight: 0 } },
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 10, padding: "14px 16px", marginBottom: 14, border: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 } },
asset.riskClass && React.createElement("span", { style: { background: riskColor[asset.riskClass] + "22", color: riskColor[asset.riskClass], border: "1px solid " + riskColor[asset.riskClass] + "55", borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700 } },
"Cl. ",
asset.riskClass),
React.createElement(Badge, { text: asset.status, color: STATUS_COLOR[asset.status] || "#64748b" })),
React.createElement("div", { style: { fontSize: 14, color: "#94a3b8", marginBottom: 3, fontWeight: 600 } },
asset.brand,
" ",
asset.model),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: customer ? 4 : 10 } },
"S/N: ",
asset.serial || "—",
" \u00B7 ID: ",
asset.id),
customer && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginBottom: 10 } },
"\uD83C\uDFE2 ",
customer.name),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 6 } },
React.createElement("button", { onClick: onEditAsset, style: { background: "#1E1E28", color: "#e2e8f0", border: "1px solid #2a3040", borderRadius: 7, padding: "8px 6px", cursor: "pointer", fontSize: 12, fontWeight: 700, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "\u270F Modifica"),
React.createElement("button", { onClick: onNewJob, style: { background: "#2DD4BF", color: "#0a0a0f", border: "none", borderRadius: 7, padding: "8px 6px", cursor: "pointer", fontSize: 12, fontWeight: 800, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "+ Job"),
React.createElement("button", { onClick: onNewIec, style: { background: "#a855f7", color: "#fff", border: "none", borderRadius: 7, padding: "8px 6px", cursor: "pointer", fontSize: 12, fontWeight: 800, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "\u26A1 Sicurezza"),
React.createElement("button", { onClick: onNewFunc, style: { background: "#0891b2", color: "#fff", border: "none", borderRadius: 7, padding: "8px 6px", cursor: "pointer", fontSize: 12, fontWeight: 800, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "\u2713 Funzionale"))),
React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" } }, [
{ label: "Job aperti", value: openJobs.length, color: openJobs.length > 0 ? "#f59e0b" : "#22c55e" },
{ label: "Job totali", value: assetJobs.length, color: "#2DD4BF" },
{ label: "Costo totale", value: "€" + totalCost.toFixed(0), color: "#a855f7" },
{ label: "Ultima Sicurezza", value: lastIec ? lastIec.date : "mai", color: (lastIec === null || lastIec === void 0 ? void 0 : lastIec.overallPass) ? "#22c55e" : "#ef4444" },
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
(j.iecReportId || j.funcReportId) && React.createElement("div", { style: { fontSize: 10, color: "#5EEAD4" } }, j.iecReportId ? "⚡" : "")))));
}))),
tab === "iec" && (React.createElement("div", { style: { overflow: "auto", maxHeight: "55vh", display: "flex", flexDirection: "column", gap: 8 } }, assetIec.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: 32, color: "#475569" } }, "Nessuna verifica di sicurezza elettrica per questo apparecchio")) : assetIec.map(r => (React.createElement("div", { key: r.id, style: { background: "#141418", border: "1px solid " + (r.overallPass ? "#22c55e33" : "#ef444433"), borderRadius: 8, padding: "10px 14px" } },
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
React.createElement("button", { onClick: () => generateIECPDF(r, asset, customer, company), style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } })))))))),
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
React.createElement("button", { onClick: () => generateFuncPDF(r, asset, customer, company), style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } })))));
})))));
}
// Keep HistoryModal as alias for backward compat
function HistoryModal({ asset, jobs, parts, onClose }) {
return null; // replaced by AssetDetailModal
}
function SettingsModal({ data, company, onUpdateCompany, onImport, onMerge, onReset, onClose, onCloudPull }) {
const [comp, setComp] = React.useState(company);
const s = k => e => setComp(x => (Object.assign(Object.assign({}, x), { [k]: e.target.value })));
// ─── Cloud Sync (Supabase) ───
const [cloudCfg, setCloudCfg] = React.useState(() => getSupabaseConfig());
const [cloudStatus, setCloudStatus] = React.useState("");
const [cloudBusy, setCloudBusy] = React.useState(false);
const saveCloudCfg = () => {
try {
if (cloudCfg.url && cloudCfg.anonKey) {
localStorage.setItem("medtrace-supabase-config", JSON.stringify({ url: cloudCfg.url.trim(), anonKey: cloudCfg.anonKey.trim() }));
setCloudStatus("✓ Configurazione salvata. Puoi ora sincronizzare.");
}
else {
localStorage.removeItem("medtrace-supabase-config");
setCloudStatus("Configurazione rimossa — torno a solo-locale.");
}
}
catch (e) {
setCloudStatus("Errore salvataggio config: " + e.message);
}
};
const doSyncUp = () => __awaiter(this, void 0, void 0, function* () {
setCloudBusy(true);
setCloudStatus("Caricamento dati su Supabase…");
try {
const res = yield supabaseSyncUp(data);
const tot = Object.values(res).reduce((a, b) => a + b, 0);
setCloudStatus("✓ Caricati " + tot + " record su Supabase.");
}
catch (e) {
setCloudStatus("✗ " + e.message);
}
setCloudBusy(false);
});
const doSyncDown = () => __awaiter(this, void 0, void 0, function* () {
setCloudBusy(true);
setCloudStatus("Scaricamento dati da Supabase…");
try {
const remote = yield supabaseSyncDown();
onCloudPull(remote);
const tot = Object.values(remote).reduce((a, arr) => a + ((arr === null || arr === void 0 ? void 0 : arr.length) || 0), 0);
setCloudStatus("✓ Scaricati " + tot + " record. Dati aggiornati.");
}
catch (e) {
setCloudStatus("✗ " + e.message);
}
setCloudBusy(false);
});
const fileRef = e => {
var _a;
const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file) {
e.target.value = '';
return;
}
const reader = new FileReader();
reader.onload = ev => {
try {
const imported = JSON.parse(ev.target.result);
const hasData = ['assets', 'parts', 'jobs', 'customers', 'invoices', 'iecReports', 'funcReports', 'instruments', 'procedures', 'quotes'].some(k => Array.isArray(imported[k]));
if (!hasData) {
alert('File backup non valido: nessun dato MedTrace riconosciuto.');
return;
}
onImport(imported);
}
catch (err) {
alert('Errore lettura file: ' + ((err === null || err === void 0 ? void 0 : err.message) || 'JSON non valido'));
}
};
reader.onerror = () => alert('Impossibile leggere il file');
reader.readAsText(file);
e.target.value = ''; // permetti reimport stesso file
};
const fileRefMerge = e => {
var _a;
const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
if (!file) {
e.target.value = '';
return;
}
const reader = new FileReader();
reader.onload = ev => {
try {
const imported = JSON.parse(ev.target.result);
const hasData = ['assets', 'parts', 'jobs', 'customers', 'invoices', 'iecReports', 'funcReports', 'instruments', 'procedures', 'quotes'].some(k => Array.isArray(imported[k]));
if (!hasData) {
alert('File backup non valido.');
return;
}
onMerge(imported);
}
catch (err) {
alert('Errore lettura file: ' + ((err === null || err === void 0 ? void 0 : err.message) || 'JSON non valido'));
}
};
reader.onerror = () => alert('Impossibile leggere il file');
reader.readAsText(file);
e.target.value = '';
};
return (React.createElement(Modal, { title: "\u2699 Impostazioni", wide: true, onClose: onClose },
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 10 } }, " Dati Azienda (per preventivi e rapporti)"),
!comp.name && (React.createElement("div", { style: { background: "#f59e0b15", border: "1px solid #f59e0b66", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 12, color: "#fbbf24", lineHeight: 1.5 } }, "\u26A0 Inserisci il nome della tua azienda \u2014 apparir\u00E0 nei PDF (rapporti job, verifiche, preventivi). Senza nome, i documenti useranno solo \"Documento\" come placeholder.")),
React.createElement(Grid, { cols: "1fr 1fr" },
React.createElement(Inp, { label: "Nome / Ragione sociale", value: comp.name, onChange: s("name") }),
React.createElement(Inp, { label: "Sottotitolo", value: comp.subtitle, onChange: s("subtitle") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Indirizzo", value: comp.address, onChange: s("address") })),
React.createElement(Inp, { label: "P.IVA", value: comp.vat, onChange: s("vat") }),
React.createElement(Inp, { label: "IBAN", value: comp.iban, onChange: s("iban") }),
React.createElement(Span2, null,
React.createElement(Inp, { label: "Prefisso numerazione preventivi", value: comp.invoicePrefix, onChange: s("invoicePrefix"), placeholder: "es: F" }))),
React.createElement("div", { style: { textAlign: "right", marginTop: 10 } },
React.createElement(Btn, { sm: true, onClick: () => { onUpdateCompany(comp); alert("Salvato!"); } }, "Salva dati azienda"))),
React.createElement("div", { style: { background: "#141418", borderRadius: 10, padding: "14px 16px", border: "1px solid #2a3040" } },
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 6 } }, " Dove sono i dati?"),
React.createElement("div", { style: { color: "#64748b", fontSize: 12, lineHeight: 1.5 } },
"Di default tutto ",
React.createElement("strong", { style: { color: "#94a3b8" } }, "localmente nel browser"),
". Puoi attivare il sync cloud opzionale qui sotto. Esporta comunque backup periodici.")),
React.createElement("div", { style: { background: "#0F0F14", borderRadius: 10, padding: "16px", border: "1px solid #2DD4BF33" } },
React.createElement("div", { style: { fontSize: 11, color: "#2DD4BF", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 } },
"\u2601 Sincronizzazione Cloud (Supabase)",
React.createElement("span", { style: { fontSize: 9, color: "#64748b", background: "#1e2a3a", borderRadius: 4, padding: "1px 6px", letterSpacing: 0 } }, "OPZIONALE \u00B7 BETA")),
React.createElement("div", { style: { color: "#64748b", fontSize: 11.5, lineHeight: 1.5, marginBottom: 12 } }, "Collega un progetto Supabase per sincronizzare i dati nel cloud e abilitare il portale clienti. Lascia vuoto per restare 100% locale. La sicurezza dei dati \u00E8 garantita dalle policy del database (RLS)."),
React.createElement(Grid, { cols: "1fr" },
React.createElement(Inp, { label: "Supabase URL", value: cloudCfg.url, onChange: e => setCloudCfg(c => (Object.assign(Object.assign({}, c), { url: e.target.value }))), placeholder: "https://xxxxx.supabase.co" }),
React.createElement(Inp, { label: "Supabase anon key (pubblica)", value: cloudCfg.anonKey, onChange: e => setCloudCfg(c => (Object.assign(Object.assign({}, c), { anonKey: e.target.value }))), placeholder: "eyJhbGc..." })),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 } },
React.createElement(Btn, { sm: true, onClick: saveCloudCfg }, "Salva configurazione"),
React.createElement(Btn, { sm: true, variant: "ghost", disabled: cloudBusy || !cloudCfg.url, onClick: doSyncUp }, cloudBusy ? "…" : "⬆ Carica su cloud"),
React.createElement(Btn, { sm: true, variant: "ghost", disabled: cloudBusy || !cloudCfg.url, onClick: doSyncDown }, cloudBusy ? "…" : "⬇ Scarica da cloud")),
cloudStatus && (React.createElement("div", { style: { marginTop: 10, fontSize: 11.5, color: cloudStatus.startsWith("✗") ? "#ef4444" : "#2DD4BF", lineHeight: 1.5 } }, cloudStatus)),
React.createElement("div", { style: { marginTop: 12, padding: "10px 12px", background: "#1e2a3a44", borderRadius: 8, fontSize: 10.5, color: "#64748b", lineHeight: 1.6 } },
React.createElement("strong", { style: { color: "#94a3b8" } }, "Primo setup:"),
" crea un progetto su supabase.com, apri SQL Editor, incolla il file ",
React.createElement("strong", null, "supabase-schema.sql"),
" e premi Run. Poi copia qui URL e anon key (Settings \u2192 API). Infine premi \"Carica su cloud\" per migrare i dati locali.")),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "Backup"),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement(Btn, { variant: "ghost", onClick: () => downloadJSON("medtrace-backup-" + (new Date().toISOString().slice(0, 10)) + ".json", data) }, "\u2B07 Esporta backup"),
React.createElement("label", null,
React.createElement("input", { type: "file", accept: ".json", onChange: fileRef, style: { display: "none" } }),
React.createElement("span", { style: { background: "#1E1E28", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "inline-block" } }, "\u2B06 Importa backup")),
React.createElement("label", { title: "Aggiunge i record del file JSON ai tuoi senza cancellare niente" },
React.createElement("input", { type: "file", accept: ".json", onChange: fileRefMerge, style: { display: "none" } }),
React.createElement("span", { style: { background: "#2DD4BF18", color: "#2DD4BF", border: "1px solid #2DD4BF44", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "inline-block" } }, " Unisci backup")))),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 11, color: "#ef4444", textTransform: "uppercase", letterSpacing: .8, fontWeight: 700, marginBottom: 8 } }, "\u26A0 Zona pericolosa"),
React.createElement(Btn, { variant: "danger", onClick: onReset }, " Reset completo")),
React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } },
React.createElement(Btn, { variant: "ghost", onClick: onClose }, "Chiudi")))));
}
/* ═══ MAIN APP ════════════════════════════════════════════════ */
/* ═══ LOGIN SCREEN ══════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin }) {
const [mode, setMode] = React.useState('login');
const [email, setEmail] = React.useState('');
const [password, setPassword] = React.useState('');
const [loading, setLoading] = React.useState(false);
const [error, setError] = React.useState('');
const handle = () => __awaiter(this, void 0, void 0, function* () {
if (!email || !password) {
setError('Inserisci email e password');
return;
}
setLoading(true);
setError('');
try {
if (mode === 'register') {
const result = yield supaSignUp(email, password);
if (!result)
throw new Error('Supabase non disponibile');
if (result.error)
throw result.error;
setError('Controlla la tua email per confermare la registrazione');
setMode('login');
}
else {
const result = yield supaSignIn(email, password);
if (!result)
throw new Error('Supabase non disponibile');
if (result.error)
throw result.error;
onLogin(result.data.user);
}
}
catch (e) {
setError(e.message || 'Errore di autenticazione');
}
finally {
setLoading(false);
}
});
const INP = FORM_INP;
const LBL = FORM_LBL;
return (React.createElement("div", { style: { minHeight: '100vh', background: '#0D0D12', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 } },
React.createElement("div", { style: { width: '100%', maxWidth: 400 } },
React.createElement("div", { style: { textAlign: 'center', marginBottom: 40 } },
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: 200, height: 44 } },
React.createElement("g", { fill: "none", stroke: "#2DD4BF", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2DD4BF", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "20", fontWeight: "800", fill: "#FFFFFF", letterSpacing: "-0.5" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "'Segoe UI',Arial,sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#5A5A70", letterSpacing: "1.5" }, "MEDICAL")),
React.createElement("p", { style: { color: '#5A5A70', fontSize: 11, marginTop: 10, letterSpacing: 1.5, textTransform: 'uppercase' } }, "Gestione Apparecchiature Elettromedicali")),
React.createElement("div", { style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 14, padding: 32 } },
React.createElement("h2", { style: { fontSize: 18, fontWeight: 800, marginBottom: 24, color: '#F0F0F5' } }, mode === 'login' ? 'Accedi' : 'Crea account'),
React.createElement("div", { style: { marginBottom: 16 } },
React.createElement("label", { style: LBL }, "Email"),
React.createElement("input", { type: "email", value: email, onChange: e => setEmail(e.target.value), onKeyDown: e => e.key === 'Enter' && handle(), placeholder: "tuaemail@esempio.com", style: INP })),
React.createElement("div", { style: { marginBottom: 24 } },
React.createElement("label", { style: LBL }, "Password"),
React.createElement("input", { type: "password", value: password, onChange: e => setPassword(e.target.value), onKeyDown: e => e.key === 'Enter' && handle(), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", style: INP })),
error && React.createElement("div", { style: { background: error.includes('email') ? '#2DD4BF18' : '#ef444418', border: `1px solid ${error.includes('email') ? '#2DD4BF44' : '#ef444444'}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: error.includes('email') ? '#2DD4BF' : '#ef4444', marginBottom: 16 } }, error),
React.createElement("button", { onClick: handle, disabled: loading, style: { width: '100%', background: 'linear-gradient(135deg,#2DD4BF,#0D9488)', color: '#000', border: 'none', borderRadius: 8, padding: 13, fontSize: 14, fontWeight: 800, cursor: loading ? 'wait' : 'pointer', opacity: loading ? .7 : 1, fontFamily: 'inherit' } }, loading ? 'Caricamento…' : mode === 'login' ? 'Accedi' : 'Crea account'),
React.createElement("div", { style: { textAlign: 'center', marginTop: 18 } },
React.createElement("button", { onClick: () => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }, style: { background: 'none', border: 'none', color: '#5A5A70', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' } }, mode === 'login' ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'))),
React.createElement("p", { style: { textAlign: 'center', color: '#3A3A50', fontSize: 11, marginTop: 20 } }, "MedTrace \u00B7 Software gestione elettromedicali"))));
}
/* ═══════════════════════════════════════════════════════════════════════════
COMPONENTI MERGED IN v3.1 — Strumenti / Procedure / Preventivi / Agenda / Piano
═══════════════════════════════════════════════════════════════════════════ */
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
/* ═══ INSTRUMENTS PAGE (Strumenti di Misura) ════════════════════════════════ */
function InstrumentsPage({ instruments, setInstruments, showToast }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterStatus, setFilterStatus] = React.useState("");
const [filterCategory, setFilterCategory] = React.useState("");
const [filterOpen, setFilterOpen] = React.useState(false);
const isMobile = useMedia("(max-width:600px)");
const TODAY = new Date();
const getStatus = (inst) => {
if (!inst.calExpiry)
return { label: 'Non impostata', color: '#64748b', days: null, key: 'none' };
const expiry = new Date(inst.calExpiry);
const days = Math.round((expiry - TODAY) / 86400000);
if (days < 0)
return { label: 'SCADUTA', color: '#ef4444', days, key: 'expired' };
if (days <= 30)
return { label: `Scade in ${days}gg`, color: '#ef4444', days, key: 'expiring' };
if (days <= 60)
return { label: `Scade in ${days}gg`, color: '#f59e0b', days, key: 'soon' };
return { label: `Valida (${days}gg)`, color: '#22c55e', days, key: 'valid' };
};
const saveInstrument = (data) => {
if (checkLocked())
return;
if (data.id) {
const upd = withUpdateMeta(data);
setInstruments(prev => prev.map(x => x.id === data.id ? upd : x));
}
else {
const newInst = withCreateMeta(data);
setInstruments(prev => [...prev, newInst]);
}
setModal(null);
showToast('✓ Strumento salvato');
};
const deleteInstrument = (id) => {
if (checkLocked())
return;
if (!confirm('Eliminare questo strumento?'))
return;
setInstruments(prev => prev.filter(x => x.id !== id));
showToast('Strumento eliminato');
};
const filtered = instruments.filter(i => {
if (search) {
const q = search.toLowerCase();
if (![i.brand, i.model, i.serial, i.internalCode, i.category, i.calLab, i.certNumber]
.some(v => v && v.toLowerCase().includes(q)))
return false;
}
if (filterCategory && i.category !== filterCategory)
return false;
if (filterStatus) {
const s = getStatus(i);
if (filterStatus === "valid" && s.key !== "valid")
return false;
if (filterStatus === "expiring" && s.key !== "soon" && s.key !== "expiring")
return false;
if (filterStatus === "expired" && s.key !== "expired")
return false;
if (filterStatus === "none" && s.key !== "none")
return false;
}
return true;
});
// Stats
const expired = instruments.filter(i => getStatus(i).key === 'expired').length;
const expiring = instruments.filter(i => { const k = getStatus(i).key; return k === 'soon' || k === 'expiring'; }).length;
const valid = instruments.filter(i => getStatus(i).key === 'valid').length;
const categories = [...new Set(instruments.map(i => i.category).filter(Boolean))].sort();
const activeFilterCount = (filterStatus ? 1 : 0) + (filterCategory ? 1 : 0);
return (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Strumenti di Misura"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
instruments.length,
" strumenti \u00B7 ",
valid,
" validi \u00B7 ",
expiring,
" in scadenza \u00B7 ",
expired,
" scaduti")),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: 'form', data: null }) }, "+ Nuovo strumento")),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 10, marginBottom: 16 } }, [
{ label: 'Totale', value: instruments.length, color: '#2DD4BF' },
{ label: 'Validi', value: valid, color: '#22c55e' },
{ label: 'In scadenza', value: expiring, color: '#f59e0b' },
{ label: 'Scaduti', value: expired, color: '#ef4444' },
].map(k => (React.createElement("div", { key: k.label, style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 10, padding: "12px 14px" } },
React.createElement("div", { style: { fontSize: 24, fontWeight: 900, color: k.color, fontFamily: "monospace", lineHeight: 1 } }, k.value),
React.createElement("div", { style: { fontSize: 10, color: "#64748b", marginTop: 5, textTransform: "uppercase", letterSpacing: .8, fontWeight: 700 } }, k.label))))),
instruments.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDD2C", title: "Nessuno strumento di misura", subtitle: "Registra i tuoi analizzatori, simulatori e multimetri: marca, modello, n\u00B0 serie, certificato di calibrazione e scadenza. Garantisce la rintracciabilit\u00E0 delle tue verifiche.", actions: [
{ label: "+ Nuovo strumento", onClick: () => setModal({ type: 'form', data: null }), primary: true }
] })) : (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: search, onChange: setSearch, placeholder: "Cerca per marca, modello, seriale, categoria\u2026", count: filtered.length, total: instruments.length }),
React.createElement(FilterDropdown, { filters: {
status: { label: "Stato calibrazione", options: ["valid", "expiring", "expired", "none"].map(v => ({ valid: "Valida", expiring: "In scadenza", expired: "Scaduta", none: "Non impostata" }[v])), value: filterStatus ? ({ valid: "Valida", expiring: "In scadenza", expired: "Scaduta", none: "Non impostata" }[filterStatus]) : "" },
category: { label: "Categoria", options: categories, value: filterCategory },
}, onChange: (k, v) => {
if (k === "status") {
const map = { "Valida": "valid", "In scadenza": "expiring", "Scaduta": "expired", "Non impostata": "none" };
setFilterStatus(map[v] || "");
}
else if (k === "category") {
setFilterCategory(v);
}
}, onClearAll: () => { setFilterStatus(""); setFilterCategory(""); } }),
filtered.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessuno strumento corrisponde alla ricerca o ai filtri")) : isMobile ? (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, filtered.map(inst => {
const status = getStatus(inst);
return (React.createElement(SwipeableCard, { key: inst.id, onDelete: () => deleteInstrument(inst.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + status.color } },
React.createElement("div", { onClick: () => setModal({ type: 'form', data: inst }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } },
inst.brand,
" ",
inst.model),
React.createElement("span", { style: { padding: "2px 8px", background: status.color + "22", color: status.color, borderRadius: 5, fontSize: 10, fontWeight: 800, whiteSpace: "nowrap" } }, status.label)),
inst.internalCode && React.createElement("div", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace", marginBottom: 3 } },
"Codice: ",
inst.internalCode),
inst.serial && React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginBottom: 3 } },
"S/N: ",
inst.serial),
inst.category && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginBottom: 3 } }, inst.category),
inst.calExpiry && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 4 } },
"Scadenza: ",
React.createElement("span", { style: { color: status.color, fontWeight: 700, fontFamily: "monospace" } }, inst.calExpiry)),
inst.calLab && React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 3 } },
"Lab: ",
inst.calLab)),
React.createElement("div", { style: { display: "flex", justifyContent: "space-around", background: "#0F0F14" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: 'renew', data: inst }); }, style: { flex: 1, background: "transparent", color: "#2DD4BF", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u21BB Rinnova"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: 'form', data: inst }); }, style: { flex: 1, background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); deleteInstrument(inst.id); }, style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 14px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, filtered.map(inst => {
const status = getStatus(inst);
return (React.createElement("div", { key: inst.id, style: { background: "#141418", border: "1px solid #1e2a3a", borderLeft: "3px solid " + status.color, borderRadius: 10, padding: "12px 16px" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 } },
React.createElement("span", { style: { fontSize: 14, fontWeight: 800, color: "#e2e8f0" } },
inst.brand,
" ",
inst.model),
inst.internalCode && React.createElement("span", { style: { fontFamily: "monospace", fontSize: 10, color: "#64748b", background: "#0D0D12", borderRadius: 4, padding: "1px 6px", border: "1px solid #1e2a3a" } }, inst.internalCode),
inst.category && React.createElement("span", { style: { fontSize: 10, color: "#94a3b8", background: "#1e2a3a", borderRadius: 4, padding: "1px 8px" } }, inst.category),
React.createElement("span", { style: { padding: "2px 10px", background: status.color + "22", color: status.color, border: `1px solid ${status.color}44`, borderRadius: 20, fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" } }, status.label)),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", display: "flex", gap: 14, flexWrap: "wrap" } },
inst.serial && React.createElement("span", null,
"S/N: ",
React.createElement("span", { style: { color: "#94a3b8", fontFamily: "monospace" } }, inst.serial)),
inst.calDate && React.createElement("span", null,
"Ultima cal.: ",
React.createElement("span", { style: { color: "#94a3b8", fontFamily: "monospace" } }, inst.calDate)),
inst.calExpiry && React.createElement("span", null,
"Scadenza: ",
React.createElement("span", { style: { color: status.color, fontWeight: 700, fontFamily: "monospace" } }, inst.calExpiry)),
inst.calLab && React.createElement("span", null,
"Lab: ",
React.createElement("span", { style: { color: "#94a3b8" } }, inst.calLab)),
inst.certNumber && React.createElement("span", null,
"Cert.: ",
React.createElement("span", { style: { color: "#94a3b8", fontFamily: "monospace" } }, inst.certNumber))),
inst.notes && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 6, background: "#0D0D12", borderRadius: 6, padding: "6px 10px", border: "1px solid #1e2a3a" } }, inst.notes)),
React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: () => setModal({ type: 'renew', data: inst }), style: { background: "transparent", color: "#2DD4BF", border: "1px solid #2DD4BF44", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u21BB Rinnova"),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: inst }), style: { background: "transparent", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: () => deleteInstrument(inst.id), style: { background: "transparent", color: "#ef4444", border: "1px solid #ef444433", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2715")))));
}))))),
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
const [errors, setErrors] = React.useState({});
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
// Auto-calculate expiry from calDate + calInterval
const calcExpiry = (date, months) => {
if (!date || !months)
return '';
const d = new Date(date);
d.setMonth(d.getMonth() + parseInt(months));
return d.toISOString().slice(0, 10);
};
const INP = FORM_INP;
const LBL = FORM_LBL;
const ROW = FORM_ROW;
const COL = FORM_COL;
return (React.createElement("div", null,
React.createElement(ErrorSummary, { errors: errors }),
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
React.createElement("div", { style: { marginBottom: 14 } },
React.createElement("label", { style: LBL }, "Note"),
React.createElement("textarea", { style: Object.assign(Object.assign({}, INP), { minHeight: 60, resize: 'vertical' }), value: form.notes, onChange: e => set('notes', e.target.value), placeholder: "Note aggiuntive\u2026" })),
React.createElement("div", { style: FORM_FOOTER },
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => {
var _a, _b;
const errs = {};
if (!((_a = form.brand) === null || _a === void 0 ? void 0 : _a.trim()))
errs.brand = "La marca è obbligatoria";
if (!((_b = form.model) === null || _b === void 0 ? void 0 : _b.trim()))
errs.model = "Il modello è obbligatorio";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(form);
}, style: FORM_BTN_PRIMARY }, initial ? 'Salva modifiche' : 'Aggiungi strumento'))));
}
function RenewCalibrationForm({ instrument, onSave, onClose }) {
const today = new Date().toISOString().slice(0, 10);
const [form, setForm] = React.useState(Object.assign(Object.assign({}, instrument), { calDate: today, calExpiry: (() => { const d = new Date(today); d.setMonth(d.getMonth() + (instrument.calInterval || 12)); return d.toISOString().slice(0, 10); })(), certNumber: '', calLab: instrument.calLab || '' }));
const set = (k, v) => setForm(f => (Object.assign(Object.assign({}, f), { [k]: v })));
const INP = FORM_INP;
const LBL = FORM_LBL;
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
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => onSave(form), style: FORM_BTN_PRIMARY }, "\u21BB Salva rinnovo"))));
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
const upd = withUpdateMeta(proc);
setProcedures(prev => prev.map(p => p.id === proc.id ? upd : p));
}
else {
const newP = withCreateMeta(proc);
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
return React.createElement(ProcedureDetail, { proc: proc, onEdit: () => setModal({ type: 'form', data: proc }), onDuplicate: () => duplicateProc(proc), onDelete: () => delProc(proc.id), onBack: () => setViewProcId(null), showToast: showToast });
}
return (React.createElement("div", { style: { padding: '16px 20px', maxWidth: 1100, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900 } }, "Procedure Tecniche"),
React.createElement("p", { style: { color: '#64748b', margin: '3px 0 0', fontSize: 12 } }, "Guide passo-passo per modello specifico (knowledge base interna)")),
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuova procedura")),
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
filtered.length === 0 ? (React.createElement("div", null, procedures.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDCDA", title: "Nessuna procedura ancora", subtitle: "Crea procedure tecniche passo-passo come una knowledge base in stile iFixit. Aggiungi passi numerati, valori attesi, foto e checklist.", actions: [
{ label: "+ Crea procedura", onClick: () => setModal({ type: 'form', data: null }), primary: true }
] })) : (React.createElement("div", { style: { textAlign: 'center', padding: 48, color: '#64748b', background: '#141418', borderRadius: 12, border: '1px solid #2A2A38', fontSize: 13 } }, "Nessuna procedura corrisponde ai filtri")))) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.map(p => (React.createElement("div", { key: p.id, onClick: () => setViewProcId(p.id), style: { background: '#141418', border: '1px solid #2A2A38', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all .15s' }, onMouseEnter: e => e.currentTarget.style.borderColor = '#2DD4BF66', onMouseLeave: e => e.currentTarget.style.borderColor = '#2A2A38' },
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
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap', marginBottom: 10 } },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 } },
proc.category && React.createElement("span", { style: { fontSize: 10, background: '#2DD4BF18', color: '#2DD4BF', border: '1px solid #2DD4BF33', borderRadius: 20, padding: '2px 10px', fontWeight: 700 } }, proc.category),
proc.type && React.createElement("span", { style: { fontSize: 10, background: '#a855f718', color: '#a855f7', border: '1px solid #a855f733', borderRadius: 20, padding: '2px 10px', fontWeight: 700 } }, proc.type)),
React.createElement("h1", { style: { margin: 0, fontSize: 20, fontWeight: 900, color: '#F0F0F5' } },
proc.brand,
" ",
proc.modelName),
proc.description && React.createElement("p", { style: { margin: '6px 0 0', fontSize: 13, color: '#9090A8', lineHeight: 1.5 } }, proc.description)),
React.createElement("div", { style: { display: 'flex', gap: 6, flexShrink: 0 } },
React.createElement("button", { onClick: onEdit, style: { background: '#1E1E28', border: '1px solid #2DD4BF44', borderRadius: 6, color: '#2DD4BF', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u270F Modifica"),
React.createElement("button", { onClick: onDuplicate, style: { background: '#1E1E28', border: '1px solid #2a3040', borderRadius: 6, color: '#94a3b8', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2398 Duplica"),
React.createElement("button", { onClick: onDelete, style: { background: '#1E1E28', border: '1px solid #ef444433', borderRadius: 6, color: '#ef4444', padding: '6px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 700 } }, "\u2715"))),
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
const [errors, setErrors] = React.useState({});
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
const INP = FORM_INP;
const LBL = FORM_LBL;
const ROW = FORM_ROW;
return (React.createElement("div", { style: { maxHeight: '70vh', overflowY: 'auto', paddingRight: 6 } },
React.createElement(ErrorSummary, { errors: errors }),
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
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => {
var _a;
const errs = {};
if (!((_a = form.modelName) === null || _a === void 0 ? void 0 : _a.trim()))
errs.modelName = "Il modello/titolo è obbligatorio";
setErrors(errs);
if (Object.keys(errs).length > 0)
return;
onSave(form);
}, style: FORM_BTN_PRIMARY }, initial ? 'Salva modifiche' : 'Crea procedura'))));
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
const INP = FORM_INP;
const LBL = FORM_LBL;
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
React.createElement("button", { onClick: onClose, style: FORM_BTN_GHOST }, "Annulla"),
React.createElement("button", { onClick: () => onSave(Object.assign(Object.assign({}, f), { _totals: { labor: laborTotal, parts: partsSubtotal, subtotal, vat: vatTotal, grand: grandTotal } })), style: FORM_BTN_PRIMARY }, initial ? 'Salva modifiche' : 'Crea preventivo'))));
}
/* ─── QuotesPage ─────────────────────────────────────────────────────────── */
function QuotesPage({ quotes, setQuotes, customers, jobs, assets, parts, company, showToast }) {
const [modal, setModal] = React.useState(null);
const [search, setSearch] = React.useState('');
const [filterStatus, setFilterStatus] = React.useState('all');
const saveQuote = (q) => {
const exists = quotes.some(x => x.id === q.id);
if (exists) {
const upd = withUpdateMeta(q);
setQuotes(qs => qs.map(x => x.id === q.id ? upd : x));
showToast('Preventivo aggiornato');
}
else {
const newQ = withCreateMeta(q);
setQuotes(qs => [...qs, newQ]);
showToast('✓ Preventivo ' + newQ.number + ' creato');
}
setModal(null);
};
const delQuote = (id) => {
if (checkLocked())
return;
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
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo preventivo")),
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
React.createElement("button", { onClick: () => setModal({ type: 'form', data: null }), style: FORM_BTN_PRIMARY }, "+ Nuovo preventivo"))) : 'Nessun risultato')) : (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 } }, filtered.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).map(q => {
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
<h1>${(company.name || 'Documento')}</h1>
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
${(company.name || 'Documento')} — Preventivo generato il ${new Date().toLocaleDateString('it-IT')}<br>
Questo documento non ha valore fiscale — per la fatturazione utilizzare il software di fatturazione elettronica
</div>
</div>
</body></html>`;
showPDFPreview(html, `preventivo-${quote.number}.pdf`);
}
/* ═══ AGENDA & SCHEDULING ════════════════════════════════════════════════════ */
function AgendaPage({ assets, jobs, instruments, iecReports, funcReports, customers, setTab: goTab, setModal, showToast }) {
const [view, setView] = React.useState('overview'); // overview | byClient | byWeek | calendar
const [filterType, setFilterType] = React.useState('all');
const [monthOffset, setMonthOffset] = React.useState(0); // 0 = mese corrente, navigabile
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
const DAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
// Mese visualizzato (in base all'offset)
const viewDate = new Date(TODAY.getFullYear(), TODAY.getMonth() + monthOffset, 1);
const viewYear = viewDate.getFullYear();
const viewMonth = viewDate.getMonth();
// ── Costruisce la lista unificata di eventi ──
const allEvents = React.useMemo(() => {
const events = [];
assets.forEach(a => {
if (!a.nextService)
return;
const date = new Date(a.nextService);
const days = Math.round((date - TODAY) / 86400000);
const customer = customers.find(c => c.id === a.customerId);
events.push({
id: 'maint-' + a.id, type: 'maintenance',
color: days < 0 ? '#ef4444' : days <= 30 ? '#f59e0b' : '#2DD4BF',
date: a.nextService, dateObj: date,
title: a.name,
customerName: customer ? customer.name : 'Senza cliente',
customerId: a.customerId || '',
location: a.location || '',
subtitle: (a.brand ? a.brand + ' ' : '') + (a.model || ''),
days, assetId: a.id,
status: days < 0 ? ('scaduta da ' + Math.abs(days) + 'gg') : days === 0 ? 'oggi' : ('tra ' + days + 'gg'),
onAction: () => setModal({ type: 'iec', assetId: a.id, data: null }),
});
});
instruments.forEach(i => {
if (!i.calExpiry)
return;
const date = new Date(i.calExpiry);
const days = Math.round((date - TODAY) / 86400000);
events.push({
id: 'cal-' + i.id, type: 'calibration',
color: days < 0 ? '#ef4444' : days <= 60 ? '#f59e0b' : '#a855f7',
date: i.calExpiry, dateObj: date,
title: (i.brand || '') + ' ' + (i.model || ''),
customerName: 'Strumenti interni', customerId: '__instruments__',
location: '', subtitle: i.category || 'Strumento di misura',
days,
status: days < 0 ? ('scaduta da ' + Math.abs(days) + 'gg') : ('tra ' + days + 'gg'),
onAction: () => goTab('instruments'),
});
});
jobs.filter(j => j.status !== 'chiuso').forEach(j => {
const asset = assets.find(a => a.id === j.assetId);
const customer = customers.find(c => c.id === (j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId)));
const date = new Date(j.openDate || TODAY);
const days = Math.round((date - TODAY) / 86400000);
events.push({
id: 'job-' + j.id, type: 'job',
color: j.priority === 'urgente' ? '#ef4444' : j.priority === 'alta' ? '#f97316' : '#64748b',
date: (j.openDate || TODAY.toISOString().slice(0, 10)), dateObj: date,
title: j.description || 'Intervento',
customerName: customer ? customer.name : 'Senza cliente',
customerId: (j.customerId || (asset === null || asset === void 0 ? void 0 : asset.customerId) || ''),
location: (asset === null || asset === void 0 ? void 0 : asset.location) || '',
subtitle: asset ? asset.name : '',
days, status: j.status,
onAction: () => setModal({ type: 'job', data: j }),
});
});
return events.sort((a, b) => a.dateObj - b.dateObj);
}, [assets, instruments, jobs, customers]);
// Eventi del mese visualizzato
const monthEvents = React.useMemo(() => {
return allEvents.filter(e => {
const d = e.dateObj;
return d.getFullYear() === viewYear && d.getMonth() === viewMonth &&
(filterType === 'all' || e.type === filterType);
});
}, [allEvents, viewYear, viewMonth, filterType]);
// Statistiche del mese
const stats = React.useMemo(() => {
const overdue = monthEvents.filter(e => e.days < 0).length;
const thisWeek = monthEvents.filter(e => e.days >= 0 && e.days <= 7).length;
const maint = monthEvents.filter(e => e.type === 'maintenance').length;
const cal = monthEvents.filter(e => e.type === 'calibration').length;
const job = monthEvents.filter(e => e.type === 'job').length;
return { total: monthEvents.length, overdue, thisWeek, maint, cal, job };
}, [monthEvents]);
// Raggruppamento per cliente
const byClient = React.useMemo(() => {
const groups = {};
monthEvents.forEach(e => {
const key = e.customerId || '__none__';
if (!groups[key])
groups[key] = { name: e.customerName, events: [], overdue: 0 };
groups[key].events.push(e);
if (e.days < 0)
groups[key].overdue++;
});
// Ordina: clienti con più scadute prima, poi per numero eventi
return Object.values(groups).sort((a, b) => b.overdue - a.overdue || b.events.length - a.events.length);
}, [monthEvents]);
// Raggruppamento per settimana
const byWeek = React.useMemo(() => {
const weeks = {};
monthEvents.forEach(e => {
const d = e.dateObj;
const weekNum = Math.ceil(d.getDate() / 7);
if (!weeks[weekNum])
weeks[weekNum] = [];
weeks[weekNum].push(e);
});
return Object.entries(weeks).map(([w, events]) => ({
week: parseInt(w),
label: 'Settimana ' + w + ' (' + ((parseInt(w) - 1) * 7 + 1) + '–' + Math.min(parseInt(w) * 7, 31) + ')',
events: events.sort((a, b) => a.dateObj - b.dateObj),
})).sort((a, b) => a.week - b.week);
}, [monthEvents]);
const TYPE_LABEL = { maintenance: 'Verifica', calibration: 'Calibrazione', job: 'Intervento' };
const Tab = ({ id, label }) => (React.createElement("button", { onClick: () => setView(id), style: {
background: view === id ? '#2DD4BF' : 'transparent',
color: view === id ? '#06251f' : '#94a3b8',
border: view === id ? 'none' : '1px solid #2a3040',
borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap',
} }, label));
// Riga evento compatta riutilizzabile
const EventRow = ({ e, showClient }) => (React.createElement("div", { onClick: e.onAction, style: {
display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
background: '#0F0F14', borderRadius: 8, border: '1px solid #1e2a3a',
borderLeft: '3px solid ' + e.color, cursor: 'pointer', marginBottom: 6,
} },
React.createElement("div", { style: { flex: 1, minWidth: 0 } },
React.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, e.title),
React.createElement("div", { style: { fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, showClient && e.customerName !== 'Strumenti interni' ? e.customerName + (e.location ? ' · ' + e.location : '') : e.subtitle)),
React.createElement("div", { style: { textAlign: 'right', flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: e.color, whiteSpace: 'nowrap' } }, e.status),
React.createElement("div", { style: { fontSize: 10, color: '#475569' } }, e.date))));
return (React.createElement("div", null,
React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900 } }, "Agenda & Pianificazione"),
React.createElement("p", { style: { color: '#64748b', margin: '2px 0 0', fontSize: 12 } }, "Cosa c'\u00E8 da fare, organizzato per non perdere niente"))),
React.createElement("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 } },
React.createElement("button", { onClick: () => setMonthOffset(monthOffset - 1), style: { background: '#141418', border: '1px solid #2a3040', borderRadius: 8, color: '#94a3b8', padding: '7px 14px', cursor: 'pointer', fontSize: 16 } }, "\u2039"),
React.createElement("div", { style: { textAlign: 'center', minWidth: 170 } },
React.createElement("div", { style: { fontWeight: 800, fontSize: 16, color: '#e2e8f0' } },
MONTHS_IT[viewMonth],
" ",
viewYear),
monthOffset !== 0 && React.createElement("button", { onClick: () => setMonthOffset(0), style: { background: 'none', border: 'none', color: '#2DD4BF', fontSize: 10, cursor: 'pointer', padding: 0, marginTop: 2 } }, "\u21A9 Torna a oggi")),
React.createElement("button", { onClick: () => setMonthOffset(monthOffset + 1), style: { background: '#141418', border: '1px solid #2a3040', borderRadius: 8, color: '#94a3b8', padding: '7px 14px', cursor: 'pointer', fontSize: 16 } }, "\u203A")),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 10, marginBottom: 16 } },
React.createElement("div", { style: { background: '#141418', border: '1px solid #1e2a3a', borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: '#2DD4BF', fontFamily: 'monospace', lineHeight: 1 } }, stats.total),
React.createElement("div", { style: { fontSize: 10, color: '#64748b', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Da fare")),
React.createElement("div", { style: { background: '#141418', border: '1px solid ' + (stats.overdue > 0 ? '#ef444444' : '#1e2a3a'), borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: '#ef4444', fontFamily: 'monospace', lineHeight: 1 } }, stats.overdue),
React.createElement("div", { style: { fontSize: 10, color: '#64748b', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Scadute")),
React.createElement("div", { style: { background: '#141418', border: '1px solid #1e2a3a', borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: '#f59e0b', fontFamily: 'monospace', lineHeight: 1 } }, stats.thisWeek),
React.createElement("div", { style: { fontSize: 10, color: '#64748b', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Entro 7gg")),
React.createElement("div", { style: { background: '#141418', border: '1px solid #1e2a3a', borderRadius: 10, padding: '12px 14px' } },
React.createElement("div", { style: { fontSize: 26, fontWeight: 900, color: '#94a3b8', fontFamily: 'monospace', lineHeight: 1 } }, byClient.length),
React.createElement("div", { style: { fontSize: 10, color: '#64748b', marginTop: 5, textTransform: 'uppercase', letterSpacing: .6, fontWeight: 700 } }, "Clienti"))),
React.createElement("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 } }, [
{ id: 'all', label: 'Tutto (' + stats.total + ')' },
{ id: 'maintenance', label: 'Verifiche (' + stats.maint + ')' },
{ id: 'calibration', label: 'Calibrazioni (' + stats.cal + ')' },
{ id: 'job', label: 'Interventi (' + stats.job + ')' },
].map(f => (React.createElement("button", { key: f.id, onClick: () => setFilterType(f.id), style: {
background: filterType === f.id ? '#2DD4BF22' : '#141418',
color: filterType === f.id ? '#2DD4BF' : '#64748b',
border: '1px solid ' + (filterType === f.id ? '#2DD4BF66' : '#2a3040'),
borderRadius: 20, padding: '4px 13px', cursor: 'pointer', fontSize: 11.5, fontWeight: 700,
} }, f.label)))),
React.createElement("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16, overflowX: 'auto', paddingBottom: 2 } },
React.createElement(Tab, { id: "overview", label: "Priorit\u00E0" }),
React.createElement(Tab, { id: "byClient", label: "Per cliente" }),
React.createElement(Tab, { id: "byWeek", label: "Per settimana" }),
React.createElement(Tab, { id: "calendar", label: "Calendario" })),
stats.total === 0 && (React.createElement(EmptyState, { icon: "\uD83D\uDCC5", title: "Niente in programma per " + MONTHS_IT[viewMonth], subtitle: "Nessuna verifica, calibrazione o intervento in scadenza questo mese. Usa le frecce sopra per controllare gli altri mesi." })),
stats.total > 0 && view === 'overview' && (React.createElement("div", null,
stats.overdue > 0 && (React.createElement("div", { style: { marginBottom: 18 } },
React.createElement("div", { style: { fontSize: 12, fontWeight: 800, color: '#ef4444', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .6, display: 'flex', alignItems: 'center', gap: 6 } },
"\u26A0 Scadute \u2014 da recuperare (",
stats.overdue,
")"),
monthEvents.filter(e => e.days < 0).map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: true })))),
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 12, fontWeight: 800, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .6 } }, "In programma (per scadenza)"),
monthEvents.filter(e => e.days >= 0).map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: true })),
monthEvents.filter(e => e.days >= 0).length === 0 && (React.createElement("div", { style: { color: '#64748b', fontSize: 12, padding: '12px', textAlign: 'center' } }, "Tutto il resto \u00E8 gi\u00E0 scaduto \u2014 recupera quelle sopra."))))),
stats.total > 0 && view === 'byClient' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, byClient.map((g, gi) => (React.createElement("div", { key: gi, style: { background: '#141418', border: '1px solid ' + (g.overdue > 0 ? '#ef444433' : '#1e2a3a'), borderRadius: 12, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '10px 14px', background: '#0F0F14', borderBottom: '1px solid #1e2a3a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 } },
React.createElement("div", { style: { fontWeight: 800, fontSize: 14, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, g.name),
React.createElement("div", { style: { display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 } },
g.overdue > 0 && React.createElement("span", { style: { background: '#ef444422', color: '#ef4444', border: '1px solid #ef444444', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 800 } },
g.overdue,
" scadute"),
React.createElement("span", { style: { background: '#2DD4BF22', color: '#2DD4BF', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 800 } },
g.events.length,
" totali"))),
React.createElement("div", { style: { padding: '10px 12px' } }, g.events.map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: false })))))))),
stats.total > 0 && view === 'byWeek' && (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, byWeek.map(w => (React.createElement("div", { key: w.week, style: { background: '#141418', border: '1px solid #1e2a3a', borderRadius: 12, overflow: 'hidden' } },
React.createElement("div", { style: { padding: '10px 14px', background: '#0F0F14', borderBottom: '1px solid #1e2a3a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
React.createElement("span", { style: { fontWeight: 800, fontSize: 13, color: '#e2e8f0' } }, w.label),
React.createElement("span", { style: { background: '#2DD4BF22', color: '#2DD4BF', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 800 } }, w.events.length)),
React.createElement("div", { style: { padding: '10px 12px' } }, w.events.map(e => React.createElement(EventRow, { key: e.id, e: e, showClient: true })))))))),
stats.total > 0 && view === 'calendar' && (React.createElement("div", { style: { background: '#141418', border: '1px solid #1e2a3a', borderRadius: 12, overflow: 'hidden' } },
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid #1e2a3a' } }, DAYS_IT.map(d => (React.createElement("div", { key: d, style: { padding: '8px 4px', textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' } }, d)))),
React.createElement("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' } }, (() => {
const monthStart = new Date(viewYear, viewMonth, 1);
const startPad = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
const cells = [];
for (let i = 0; i < startPad; i++)
cells.push(React.createElement("div", { key: 'p' + i, style: { minHeight: 64, borderRight: '1px solid #14182a', borderBottom: '1px solid #14182a' } }));
for (let day = 1; day <= daysInMonth; day++) {
const dayEvents = monthEvents.filter(e => e.dateObj.getDate() === day);
const isToday = monthOffset === 0 && day === TODAY.getDate();
const hasOverdue = dayEvents.some(e => e.days < 0);
cells.push(React.createElement("div", { key: day, style: { minHeight: 64, padding: '5px', borderRight: '1px solid #14182a', borderBottom: '1px solid #14182a', background: isToday ? '#2DD4BF0a' : 'transparent' } },
React.createElement("div", { style: { fontSize: 11, fontWeight: isToday ? 900 : 500, color: isToday ? '#2DD4BF' : '#64748b', marginBottom: 4 } }, day),
dayEvents.length > 0 && (React.createElement("div", { onClick: () => { setView('byWeek'); }, style: {
background: hasOverdue ? '#ef444422' : '#2DD4BF22',
color: hasOverdue ? '#ef4444' : '#2DD4BF',
border: '1px solid ' + (hasOverdue ? '#ef444444' : '#2DD4BF44'),
borderRadius: 6, padding: '3px', textAlign: 'center', cursor: 'pointer',
fontSize: 13, fontWeight: 900, lineHeight: 1.2,
} },
dayEvents.length,
React.createElement("div", { style: { fontSize: 8, fontWeight: 600, opacity: .8 } }, dayEvents.length === 1 ? 'cosa' : 'cose')))));
}
return cells;
})()),
React.createElement("div", { style: { padding: '10px 14px', borderTop: '1px solid #1e2a3a', fontSize: 11, color: '#64748b', textAlign: 'center' } }, "Tocca un giorno per vedere i dettagli \u00B7 Il numero indica quante attivit\u00E0 ci sono")))));
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
"Servizio assistenza tecnica",
company.name ? " di " + company.name : "")),
React.createElement("div", { style: { background: '#2DD4BF18', border: '1px solid #2DD4BF33', borderRadius: 20, padding: '4px 12px', fontSize: 10, color: '#2DD4BF', fontWeight: 700 } }, "\u25CF ONLINE"))),
React.createElement("div", { style: { padding: '20px 16px', maxWidth: 900, margin: '0 auto' } },
React.createElement("div", { style: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' } }, [
{ label: 'Apparecchi', value: customerAssets.length, color: '#2DD4BF' },
{ label: 'Job aperti', value: openJobs.length, color: openJobs.length > 0 ? '#f59e0b' : '#22c55e' },
{ label: 'Verifiche di Sicurezza Elettrica', value: customerIec.length, color: '#9955ff' },
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
company.name || "Portale",
" \u00B7 Portale Cliente \u2014 Solo visualizzazione",
React.createElement("br", null),
"Per assistenza tecnica contatta il tuo referente"))));
}
function AppMain() {
var _a, _b, _c, _d, _e;
const isMobile = useMedia("(max-width:768px)");
// Inietta keyframes CSS globali (una volta sola)
React.useEffect(() => {
if (document.getElementById("mt-global-keyframes"))
return;
const style = document.createElement("style");
style.id = "mt-global-keyframes";
style.textContent = `
@keyframes mtShake {
10%, 90% { transform: translateX(-2px); }
20%, 80% { transform: translateX(4px); }
30%, 50%, 70% { transform: translateX(-6px); }
40%, 60% { transform: translateX(6px); }
}
@keyframes mtFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mtSpin { to { transform: rotate(360deg); } }
/* Focus eleganti sui campi form */
input:focus, select:focus, textarea:focus {
border-color: #2DD4BF !important;
box-shadow: 0 0 0 3px #2DD4BF22 !important;
}
/* Placeholder più leggibili */
input::placeholder, textarea::placeholder { color: #475569; }
/* Hover leggero sui pulsanti */
button { transition: filter .15s, transform .05s; }
button:active { transform: translateY(1px); }
/* Hover righe tabella */
.mt-table-row:hover { background: #16202e !important; }
`;
document.head.appendChild(style);
}, []);
const initialData = loadData() || DEMO_DATA;
const [quotes, setQuotes] = React.useState(initialData.quotes || []);
const [instruments, setInstruments] = React.useState(initialData.instruments || []);
const [procedures, setProcedures] = React.useState(initialData.procedures || []);
const [portalMode, setPortalMode] = React.useState(false);
const [tab, setTab] = React.useState("dashboard");
const [assets, setAssets] = React.useState(initialData.assets);
const [parts, setParts] = React.useState(initialData.parts);
const [jobs, setJobs] = React.useState(initialData.jobs);
const [orders, setOrders] = React.useState(initialData.orders);
const [withdrawals, setWDs] = React.useState(initialData.withdrawals);
const [customers, setCustomers] = React.useState(initialData.customers || []);
const [invoices, setInvoices] = React.useState(initialData.invoices || []);
const [iecReports, setIecReports] = React.useState(initialData.iecReports || []);
const [funcReports, setFuncReports] = React.useState(initialData.funcReports || []);
const [company, setCompany] = React.useState(() => {
const stored = initialData.company || { name: "", subtitle: "", invoicePrefix: "F" };
// Migrazione automatica: se vecchio nome 4Service è ancora salvato, aggiorna a MedTrace
if (stored.name && /4[sS]ervice/.test(stored.name)) {
return Object.assign(Object.assign({}, stored), { name: "", subtitle: "" });
}
// Migra anche da "MedTrace" hardcoded (v3.x) a blank (l'utente metterà il suo)
if (stored.name === "MedTrace" && /Gestione Apparecchiature/i.test(stored.subtitle || "")) {
return Object.assign(Object.assign({}, stored), { name: "", subtitle: "" });
}
return stored;
});
// Helper per caricare/salvare filtri da localStorage
const loadFilterState = (key, fallback) => {
try {
const raw = localStorage.getItem("medtrace-filters-" + key);
return raw ? JSON.parse(raw) : fallback;
}
catch (e) {
return fallback;
}
};
const [mobileSearch, setMobileSearch] = React.useState(() => loadFilterState("search", { assets: "", jobs: "", customers: "", parts: "", invoices: "", iec: "", func: "" }));
const [jobFilter, setJobFilter] = React.useState(() => loadFilterState("jobFilter", "open")); // "open" | "all" | "closed"
// Filtri avanzati per ogni lista: {category: value}
const DEFAULT_FILTERS = {
assets: { brand: "", model: "", serial: "", name: "", location: "", status: "", customer: "", riskClass: "", iecNorm: "", iecClass: "", patientType: "" },
jobs: { assetName: "", priority: "", type: "", assignee: "", customer: "", status: "" },
customers: { city: "", vat: "" },
parts: { brand: "", code: "", name: "", location: "", supplier: "", stockStatus: "" },
invoices: { status: "", customer: "", number: "" },
iec: { norm: "", equipClass: "", patientType: "", verifyType: "", customer: "", outcome: "", technician: "", assetBrand: "", assetModel: "", leakageMethod: "" },
func: { templateId: "", verifyType: "", customer: "", outcome: "", technician: "", assetBrand: "", assetModel: "" },
};
const [activeFilters, setActiveFilters] = React.useState(() => {
const stored = loadFilterState("activeFilters", null);
// Merge con DEFAULT_FILTERS per garantire che nuovi filtri aggiunti in futuro non rompano lo stored
if (!stored)
return DEFAULT_FILTERS;
const merged = {};
Object.keys(DEFAULT_FILTERS).forEach(page => {
merged[page] = Object.assign(Object.assign({}, DEFAULT_FILTERS[page]), (stored[page] || {}));
});
return merged;
});
// Persisti filtri in localStorage quando cambiano
React.useEffect(() => { try {
localStorage.setItem("medtrace-filters-search", JSON.stringify(mobileSearch));
}
catch (e) { } }, [mobileSearch]);
React.useEffect(() => { try {
localStorage.setItem("medtrace-filters-jobFilter", JSON.stringify(jobFilter));
}
catch (e) { } }, [jobFilter]);
React.useEffect(() => { try {
localStorage.setItem("medtrace-filters-activeFilters", JSON.stringify(activeFilters));
}
catch (e) { } }, [activeFilters]);
const setFilter = (page, key, value) => setActiveFilters(f => (Object.assign(Object.assign({}, f), { [page]: Object.assign(Object.assign({}, f[page]), { [key]: value }) })));
const clearFilters = (page) => setActiveFilters(f => (Object.assign(Object.assign({}, f), { [page]: Object.keys(f[page]).reduce((o, k) => (Object.assign(Object.assign({}, o), { [k]: "" })), {}) })));
const matchFilters = (item, page, mappers) => {
const f = activeFilters[page];
if (!f)
return true;
for (const key in f) {
if (!f[key])
continue;
const fn = mappers[key];
if (!fn)
continue;
if (String(fn(item)) !== String(f[key]))
return false;
}
return true;
};
const updMS = (key, val) => setMobileSearch(s => (Object.assign(Object.assign({}, s), { [key]: val })));
const [modal, setModal] = React.useState(null);
const [modalHistory, setModalHistory] = React.useState([]);
const [loadingMsg, setLoadingMsg] = React.useState(null); // null = nessun overlay
const pushModal = (m) => {
setModalHistory(h => modal ? [...h, modal] : h);
setModal(m);
};
const popModal = () => {
setModalHistory(h => {
if (h.length > 0) {
const prev = h[h.length - 1];
setModal(prev);
return h.slice(0, -1);
}
setModal(null);
return h;
});
};
const [search, setSearch] = React.useState("");
const [toast, setToast] = React.useState(null);
const [navOpen, setNavOpen] = React.useState(false);
// ─── Shortcut tastiera (uso desktop) ────────────────────────────────
// N = nuovo elemento (contestuale al tab corrente)
// / = focus sulla barra di ricerca
// Esc = chiudi modal o sidebar
React.useEffect(() => {
const onKey = (e) => {
const tag = (e.target.tagName || "").toLowerCase();
const isTyping = tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable;
if (e.key === "Escape") {
if (modal) {
popModal();
}
else if (navOpen) {
setNavOpen(false);
}
return;
}
if (isTyping)
return;
if (e.key === "/") {
const searchInput = document.querySelector('input[data-mt-search="1"]');
if (searchInput) {
e.preventDefault();
searchInput.focus();
}
return;
}
if (e.key === "n" || e.key === "N") {
if (modal)
return;
const map = {
assets: () => setModal({ type: "asset", data: null }),
jobs: () => setModal({ type: "job", data: null }),
customers: () => setModal({ type: "customer", data: null }),
parts: () => setModal({ type: "part", data: null }),
orders: () => setModal({ type: "order", data: null }),
invoices: () => setModal({ type: "invoice", data: null }),
iec: () => setModal({ type: "iec", data: null }),
func: () => setModal({ type: "func", data: null }),
};
if (map[tab]) {
e.preventDefault();
map[tab]();
}
return;
}
};
window.addEventListener("keydown", onKey);
return () => window.removeEventListener("keydown", onKey);
}, [modal, navOpen, tab]);
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
// ─── Swipe edge-right per aprire sidebar (solo mobile) ─────────────────
React.useEffect(() => {
if (!isMobile)
return;
let startX = null, startY = null, startT = 0, locked = false;
const onStart = (e) => {
const t = e.touches[0];
// Solo se inizia molto vicino al bordo sinistro (entro 24px)
if (t.clientX > 24) {
startX = null;
return;
}
startX = t.clientX;
startY = t.clientY;
startT = Date.now();
locked = false;
};
const onMove = (e) => {
if (startX === null)
return;
const t = e.touches[0];
const dx = t.clientX - startX;
const dy = Math.abs(t.clientY - startY);
// Lock orizzontale se chiaramente verso destra
if (!locked) {
if (dx > 10 && dx > dy * 1.5)
locked = true;
else if (dy > 10) {
startX = null;
return;
}
}
// Se swipe orizzontale chiaro e modal/sidebar non già aperti → apri sidebar
if (locked && dx > 50 && !navOpen && !modal) {
setNavOpen(true);
startX = null;
}
};
const onEnd = () => { startX = null; locked = false; };
document.addEventListener('touchstart', onStart, { passive: true });
document.addEventListener('touchmove', onMove, { passive: true });
document.addEventListener('touchend', onEnd, { passive: true });
return () => {
document.removeEventListener('touchstart', onStart);
document.removeEventListener('touchmove', onMove);
document.removeEventListener('touchend', onEnd);
};
}, [isMobile, navOpen, modal]);
// ─── Pull-to-refresh sulla top of page ─────────────────────────────────
const [ptrPull, setPtrPull] = React.useState(0);
const [ptrRefreshing, setPtrRefreshing] = React.useState(false);
React.useEffect(() => {
if (!isMobile)
return;
let startY = null;
let pulling = false;
const onStart = (e) => {
if (window.scrollY > 0) {
startY = null;
return;
}
startY = e.touches[0].clientY;
pulling = false;
};
const onMove = (e) => {
if (startY === null)
return;
const dy = e.touches[0].clientY - startY;
if (dy > 0 && window.scrollY <= 0) {
pulling = true;
setPtrPull(Math.min(dy * 0.5, 100));
}
};
const onEnd = () => {
if (pulling && ptrPull > 60) {
// Trigger refresh: forza reload dei dati da localStorage
setPtrRefreshing(true);
setTimeout(() => {
// Simulo refresh ricaricando lo stato da localStorage
try {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) {
const data = JSON.parse(raw);
if (data.assets)
setAssets(data.assets);
if (data.jobs)
setJobs(data.jobs);
if (data.parts)
setParts(data.parts);
if (data.customers)
setCustomers(data.customers);
if (data.invoices)
setInvoices(data.invoices);
if (data.iecReports)
setIecReports(data.iecReports);
if (data.funcReports)
setFuncReports(data.funcReports);
}
}
catch (e) { }
setPtrRefreshing(false);
setPtrPull(0);
showToast("Aggiornato", "#22c55e");
}, 600);
}
else {
setPtrPull(0);
}
startY = null;
pulling = false;
};
document.addEventListener('touchstart', onStart, { passive: true });
document.addEventListener('touchmove', onMove, { passive: true });
document.addEventListener('touchend', onEnd, { passive: true });
return () => {
document.removeEventListener('touchstart', onStart);
document.removeEventListener('touchmove', onMove);
document.removeEventListener('touchend', onEnd);
};
}, [isMobile, ptrPull]);
// ─── Mobile back button (Android, gesture-back) ──────────────────────────
// Quando l'utente preme back: 1) chiudi modal aperto, 2) chiudi sidebar, 3) torna a dashboard
React.useEffect(() => {
// Inietta un history state iniziale
if (!window.history.state || window.history.state.medtrace !== true) {
window.history.replaceState({ medtrace: true, tab: 'dashboard' }, '');
}
const onPopState = (e) => {
// Se c'è un modal aperto, chiudilo (o torna al precedente se c'è uno stack)
if (modal) {
popModal();
// Re-inietta uno state per evitare di uscire dall'app
window.history.pushState({ medtrace: true, tab }, '');
return;
}
// Se la sidebar mobile è aperta, chiudila
if (navOpen) {
setNavOpen(false);
window.history.pushState({ medtrace: true, tab }, '');
return;
}
// Se non sei in dashboard, torna in dashboard
if (tab !== 'dashboard') {
setTab('dashboard');
window.history.pushState({ medtrace: true, tab: 'dashboard' }, '');
return;
}
// Altrimenti lascia che il browser gestisca (chiusura PWA / pagina precedente)
};
window.addEventListener('popstate', onPopState);
return () => window.removeEventListener('popstate', onPopState);
}, [modal, navOpen, tab]);
// Quando cambia tab o si apre modal/sidebar, pusha uno state nuovo
React.useEffect(() => {
if (modal || navOpen || tab !== 'dashboard') {
window.history.pushState({ medtrace: true, tab, modal: !!modal, navOpen }, '');
}
}, [modal, navOpen, tab]);
React.useEffect(() => {
const pdfHandler = (e) => setPdfHtml(e.detail);
const csvHandler = (e) => setCsvModal(e.detail);
const toastHandler = (e) => { setToast({ msg: e.detail.msg, color: e.detail.color || "#22c55e" }); setTimeout(() => setToast(null), 3000); };
window.addEventListener('show-pdf', pdfHandler);
window.addEventListener('show-csv', csvHandler);
window.addEventListener('toast', toastHandler);
return () => {
window.removeEventListener('show-pdf', pdfHandler);
window.removeEventListener('show-csv', csvHandler);
window.removeEventListener('toast', toastHandler);
};
}, []);
// Autosave con debounce: scrive su localStorage max 1 volta ogni 600ms invece che
// a ogni singola modifica. Riduce drasticamente il carico con dataset grandi e foto pesanti.
// (Nota: funcReports ora incluso nelle dipendenze — prima mancava e poteva non salvare)
React.useEffect(() => {
const t = setTimeout(() => {
saveData({ assets, parts, jobs, orders, withdrawals, customers, invoices, quotes, instruments, procedures, iecReports, funcReports, company });
}, 600);
return () => clearTimeout(t);
}, [assets, parts, jobs, orders, withdrawals, customers, invoices, quotes, instruments, procedures, iecReports, funcReports, company]);
const showToast = React.useCallback((msg, color = "#22c55e") => {
setToast({ msg, color });
setTimeout(() => setToast(null), 3000);
}, []);
const checkLocked = React.useCallback(() => {
if (typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED) {
setToast({ msg: "Modalità DEMO: modifiche disabilitate. Scarica la versione completa per personalizzare.", color: "#f59e0b" });
setTimeout(() => setToast(null), 3500);
return true;
}
return false;
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
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setAssets(a => upsertInList(a, rec));
}
else {
setAssets(a => upsertInList(a, withCreateMeta(f)));
}
setModal(null);
showToast("Apparecchio salvato");
};
const delAsset = id => { if (checkLocked())
return; appConfirm("Eliminare questo apparecchio?", () => { setAssets(a => a.filter(x => x.id !== id)); showToast("Eliminato", "#ef4444"); }); };
const savePart = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setParts(p => upsertInList(p, rec));
}
else {
setParts(p => upsertInList(p, withCreateMeta(f)));
}
setModal(null);
showToast("Parte salvata");
};
const delPart = id => { if (checkLocked())
return; appConfirm("Eliminare questo ricambio?", () => { setParts(p => p.filter(x => x.id !== id)); showToast("Eliminata", "#ef4444"); }); };
const saveJob = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setJobs(j => upsertInList(j, rec));
}
else {
setJobs(j => upsertInList(j, withCreateMeta(Object.assign(Object.assign({}, f), { timeline: f.timeline || [], photos: f.photos || [] }))));
}
setModal(null);
showToast("Job salvato");
};
const delJob = id => { if (checkLocked())
return; appConfirm("Eliminare questo job?", () => { setJobs(j => j.filter(x => x.id !== id)); showToast("Eliminato", "#ef4444"); }); };
const saveTimeline = (jobId, data) => {
setJobs(js => js.map(j => j.id === jobId ? Object.assign(Object.assign({}, j), { timeline: data.timeline, photos: data.photos }) : j));
setModal(null);
showToast("Timeline salvata");
};
const saveCustomer = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setCustomers(c => upsertInList(c, rec));
}
else {
setCustomers(c => upsertInList(c, withCreateMeta(f)));
}
setModal(null);
showToast("Cliente salvato");
};
const delCustomer = id => {
if (checkLocked())
return;
if (assets.some(a => a.customerId === id)) {
alert("Non puoi eliminare: ci sono apparecchi associati.");
return;
}
appConfirm("Eliminare questo cliente?", () => {
setCustomers(c => c.filter(x => x.id !== id));
showToast("Eliminato", "#ef4444");
});
};
const saveInvoice = f => {
if (checkLocked())
return;
if (modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setInvoices(i => upsertInList(i, rec));
}
else {
setInvoices(i => upsertInList(i, withCreateMeta(f)));
}
setModal(null);
showToast("Preventivo salvato");
};
const delInvoice = id => { if (checkLocked())
return; appConfirm("Eliminare questo preventivo?", () => { setInvoices(i => i.filter(x => x.id !== id)); showToast("Eliminata", "#ef4444"); }); };
const markInvoicePaid = inv => {
setInvoices(is => is.map(i => i.id === inv.id ? Object.assign(Object.assign({}, i), { status: "pagata" }) : i));
showToast("Preventivo pagato");
};
const saveOrder = f => {
var _a;
if (checkLocked())
return;
const isReceivedNow = f.status === "ricevuto" && ((_a = modal === null || modal === void 0 ? void 0 : modal.data) === null || _a === void 0 ? void 0 : _a.status) !== "ricevuto";
if (modal === null || modal === void 0 ? void 0 : modal.data) {
const rec = withUpdateMeta(Object.assign(Object.assign({}, f), { id: modal.data.id, createdAt: modal.data.createdAt }));
setOrders(o => upsertInList(o, rec));
}
else {
setOrders(o => upsertInList(o, withCreateMeta(f)));
}
if (isReceivedNow) {
setParts(ps => ps.map(p => p.id === f.partId ? Object.assign(Object.assign({}, p), { qty: p.qty + f.qty }) : p));
showToast("Ordine ricevuto — stock +" + (f.qty) + " pz.");
}
else
showToast("Ordine salvato");
setModal(null);
};
const delOrder = id => { if (checkLocked())
return; appConfirm("Eliminare questo ordine?", () => { setOrders(o => o.filter(x => x.id !== id)); showToast("Eliminato", "#ef4444"); }); };
const quickReceive = o => {
setOrders(os => os.map(x => x.id === o.id ? Object.assign(Object.assign({}, x), { status: "ricevuto" }) : x));
setParts(ps => ps.map(p => p.id === o.partId ? Object.assign(Object.assign({}, p), { qty: p.qty + o.qty }) : p));
showToast("Ordine ricevuto — stock +" + (o.qty) + " pz.");
};
const saveIecReport = f => {
if (checkLocked())
return; // Use f.id as source of truth: if record has id AND exists in store → update
const isNew = !(f.id && iecReports.some(r => r.id === f.id));
const savedReport = isNew ? withCreateMeta(f) : withUpdateMeta(f);
const reportId = savedReport.id;
if (isNew) {
// Create a linked Job "Verifica di Sicurezza Elettrica"
const asset = assets.find(a => a.id === f.assetId) || {};
const normLabel = f.norm === "61010" ? "IEC 61010-1" : "IEC 62353";
const ptLabel = f.norm !== "61010" ? (" — Tipo " + (f.patientType || "BF")) : "";
const esitoLabel = f.overallPass ? "CONFORME" : "NON CONFORME";
const newJobId = genUUID();
const linkedJob = withCreateMeta({
id: newJobId,
assetId: f.assetId,
customerId: f.customerId || asset.customerId || "",
type: "verifica",
priority: "normale",
status: "chiuso",
assignee: f.technician || "",
openDate: f.date || new Date().toISOString().slice(0, 10),
closeDate: f.date || new Date().toISOString().slice(0, 10),
description: "Verifica di Sicurezza Elettrica " + normLabel + ptLabel + " — " + esitoLabel,
notes: (f.reportNumber ? "Rif. rapporto: " + f.reportNumber + " " : "") + (f.notes || ""),
parts: [],
laborHours: 0,
laborRate: 55,
timeline: [],
photos: [],
iecReportId: reportId,
});
setJobs(js => [...js, linkedJob]);
savedReport.jobId = newJobId;
// Update asset nextService only for periodic/standard verifications
const isExtraordinary = f.verifyType === "straordinaria";
const verDate = new Date(f.date || new Date());
const nextYear = new Date(verDate);
nextYear.setFullYear(nextYear.getFullYear() + 1);
const nextServiceDate = nextYear.toISOString().slice(0, 10);
if (!isExtraordinary) {
setAssets(as => as.map(a => a.id === f.assetId ? Object.assign(Object.assign({}, a), { lastService: f.date || new Date().toISOString().slice(0, 10), nextService: nextServiceDate }) : a));
showToast("Verifica di Sicurezza Elettrica salvata + Job " + newJobId + " creato · Prossima: " + nextServiceDate);
}
else {
setAssets(as => as.map(a => a.id === f.assetId ? Object.assign(Object.assign({}, a), { lastService: f.date || new Date().toISOString().slice(0, 10) }) : a));
showToast("Verifica di Sicurezza Elettrica straordinaria salvata + Job " + newJobId + " creato (pianificazione invariata)");
}
}
else {
showToast("Rapporto di sicurezza elettrica aggiornato");
}
if (isNew) {
setIecReports(rs => [...rs, savedReport]);
}
else {
setIecReports(rs => rs.map(r => r.id === reportId ? savedReport : r));
}
setModal(null);
};
const delIecReport = id => { if (checkLocked())
return; appConfirm("Eliminare questa verifica di sicurezza elettrica?", () => { setIecReports(rs => rs.filter(r => r.id !== id)); showToast("Eliminato", "#ef4444"); }); };
const saveFuncReport = f => {
if (checkLocked())
return;
const isNew = !(f.id && funcReports.some(r => r.id === f.id));
if (!isNew) {
const upd = withUpdateMeta(f);
setFuncReports(rs => rs.map(r => r.id === f.id ? upd : r));
}
else {
const saved = withCreateMeta(f);
const rid = saved.id;
// Create linked job
const asset = assets.find(a => a.id === f.assetId) || {};
const tpl = FUNC_TEMPLATES[f.templateId] || FUNC_TEMPLATES["generico"];
const esitoLabel = f.overallPass ? "CONFORME" : "NON CONFORME";
const jid = genUUID();
setJobs(js => [...js, withCreateMeta({
id: jid, assetId: f.assetId,
customerId: f.customerId || asset.customerId || "",
type: "verifica", priority: "normale", status: "chiuso",
assignee: f.technician || "",
openDate: f.date || new Date().toISOString().slice(0, 10),
closeDate: f.date || new Date().toISOString().slice(0, 10),
description: "Verifica Funzionale — " + tpl.label + " — " + esitoLabel,
notes: (f.reportNumber ? "Rif.: " + f.reportNumber + " " : "") + (f.notes || ""),
parts: [], laborHours: 0, laborRate: 55, timeline: [], photos: [],
funcReportId: rid,
})]);
saved.jobId = jid;
setFuncReports(rs => [...rs, saved]);
showToast("Verifica funzionale salvata + Job " + jid + " creato");
setModal(null);
return;
}
setModal(null);
showToast("Rapporto funzionale aggiornato");
};
// ─── Duplica record ────────────────────────────────────────────────
// Apre il modal del rispettivo tipo pre-popolato con i dati del record originale
// (senza id, senza data, senza numero rapporto → verranno rigenerati al save)
const duplicateAsset = a => {
const clone = Object.assign({}, a);
delete clone.id;
clone.name = (a.name || "") + " (copia)";
pushModal({ type: "asset", data: clone });
};
const duplicatePart = p => {
const clone = Object.assign({}, p);
delete clone.id;
clone.code = (p.code || "") + "-COPIA";
clone.qty = 0; // Lo stock copiato parte da zero
pushModal({ type: "part", data: clone });
};
const duplicateJob = j => {
const clone = Object.assign({}, j);
delete clone.id;
clone.openDate = new Date().toISOString().slice(0, 10);
clone.closeDate = "";
clone.status = "aperto";
clone.timeline = []; // Timeline ripartono da zero
clone.photos = []; // Le foto non si duplicano
pushModal({ type: "job", data: clone });
};
const duplicateIec = r => {
const clone = Object.assign({}, r);
delete clone.id;
delete clone.reportNumber; // Lo auto-genera
clone.date = new Date().toISOString().slice(0, 10);
// Reset misure (mantengo struttura ma valori vuoti)
if (clone.measures)
clone.measures = clone.measures.map(m => (Object.assign(Object.assign({}, m), { value: "" })));
clone.overallPass = null;
clone.techSignature = "";
clone.deptSignature = "";
pushModal({ type: "iec", data: clone, assetId: clone.assetId });
};
const duplicateFunc = r => {
const clone = Object.assign({}, r);
delete clone.id;
delete clone.reportNumber;
clone.date = new Date().toISOString().slice(0, 10);
// Reset items/measures dentro sections ma mantengo struttura
if (clone.sections) {
const newSections = {};
Object.entries(clone.sections).forEach(([secId, sec]) => {
newSections[secId] = {
items: {}, // reset item checks
measures: {}, // reset measure values
};
});
clone.sections = newSections;
}
clone.techSignature = "";
clone.deptSignature = "";
pushModal({ type: "func", data: clone, assetId: clone.assetId });
};
const duplicateCustomer = c => {
const clone = Object.assign({}, c);
delete clone.id;
clone.name = (c.name || "") + " (copia)";
pushModal({ type: "customer", data: clone });
};
const delFuncReport = id => { if (checkLocked())
return; appConfirm("Eliminare questa verifica funzionale?", () => { setFuncReports(rs => rs.filter(r => r.id !== id)); showToast("Eliminato", "#ef4444"); }); };
const handleWithdraw = data => {
if (checkLocked())
return;
setParts(ps => ps.map(p => { const r = data.items.find(x => x.partId === p.id); return r ? Object.assign(Object.assign({}, p), { qty: p.qty - r.qty }) : p; }));
setWDs(w => { const rec = withCreateMeta(data); return [rec, ...w]; });
setModal(null);
showToast("Scarico — €" + (data.total.toFixed(2)));
};
// Cloud pull: sostituisce lo stato locale con i dati scaricati da Supabase
const handleCloudPull = remote => {
if (checkLocked())
return;
if (remote.assets)
setAssets(remote.assets);
if (remote.parts)
setParts(remote.parts);
if (remote.jobs)
setJobs(remote.jobs);
if (remote.orders)
setOrders(remote.orders);
if (remote.withdrawals)
setWDs(remote.withdrawals);
if (remote.customers)
setCustomers(remote.customers);
if (remote.invoices)
setInvoices(remote.invoices);
if (remote.quotes)
setQuotes(remote.quotes);
if (remote.instruments)
setInstruments(remote.instruments);
if (remote.procedures)
setProcedures(remote.procedures);
if (remote.iecReports)
setIecReports(remote.iecReports);
if (remote.funcReports)
setFuncReports(remote.funcReports);
showToast("☁ Dati sincronizzati dal cloud");
};
const handleImport = data => {
var _a;
if (checkLocked())
return;
setAssets(data.assets || []);
setParts(data.parts || []);
setJobs(data.jobs || []);
setOrders(data.orders || []);
setWDs(data.withdrawals || []);
setCustomers(data.customers || []);
setInvoices(data.invoices || []);
setQuotes(data.quotes || []);
setInstruments(data.instruments || []);
setProcedures(data.procedures || []);
setIecReports(data.iecReports || []);
setFuncReports(data.funcReports || []);
if (data.company)
setCompany(data.company);
setModal(null);
showToast("Backup importato (" + (((_a = data._meta) === null || _a === void 0 ? void 0 : _a.version) || "legacy") + ")");
};
// Merge: unisce i dati del backup con quelli esistenti senza sovrascrivere
const handleMerge = data => {
if (checkLocked())
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
setQuotes(prev => mergeArr(prev, data.quotes));
setInstruments(prev => mergeArr(prev, data.instruments));
setProcedures(prev => mergeArr(prev, data.procedures));
setIecReports(prev => mergeArr(prev, data.iecReports));
setFuncReports(prev => mergeArr(prev, data.funcReports));
setModal(null);
showToast("✓ Backup unito — nuovi record aggiunti senza sovrascrivere");
};
const handleReset = () => {
if (checkLocked())
return;
appConfirm("⚠ ATTENZIONE — Stai per cancellare TUTTI i dati:\n\n• Apparecchi, Clienti, Job\n• Verifiche di sicurezza elettrica e funzionali\n• Strumenti, Procedure\n• Magazzino, Ordini, Scarichi\n• Preventivi\n\nL'operazione è IRREVERSIBILE.\n\nProcedere?", () => {
appConfirm("Confermi davvero? Tutti i dati saranno persi.", () => {
appPromptCb('Per confermare, scrivi la parola: CANCELLA', (val) => {
if (val !== 'CANCELLA') {
showToast("Reset annullato", "#94a3b8");
return;
}
setAssets([]);
setParts([]);
setJobs([]);
setOrders([]);
setWDs([]);
setCustomers([]);
setInvoices([]);
setQuotes([]);
setInstruments([]);
setProcedures([]);
setIecReports([]);
setFuncReports([]);
setModal(null);
showToast("Sistema completamente azzerato", "#ef4444");
});
});
});
};
// CSV exports
const exportAssets = () => downloadCSV("medtrace_apparecchi.csv", assets.map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "" })); }), [{ key: "id", label: "ID" }, { key: "name", label: "Nome" }, { key: "brand", label: "Marca" }, { key: "model", label: "Modello" }, { key: "serial", label: "N.Serie" }, { key: "location", label: "Ubicazione" }, { key: "cliente", label: "Cliente" }, { key: "status", label: "Stato" }, { key: "lastService", label: "Ultimo Serv." }, { key: "nextService", label: "Prossimo Serv." }, { key: "iecNorm", label: "Norma IEC" }, { key: "notes", label: "Note" }]);
const exportParts = () => downloadCSV("medtrace_parti.csv", parts.map(p => (Object.assign(Object.assign({}, p), { compatibile: (p.compatible || []).map(id => { var _a; return ((_a = assets.find(a => a.id === id)) === null || _a === void 0 ? void 0 : _a.name) || id; }).join(", ") }))), [{ key: "id", label: "ID" }, { key: "code", label: "Codice" }, { key: "name", label: "Nome" }, { key: "brand", label: "Marca" }, { key: "qty", label: "Q.tà" }, { key: "minQty", label: "Q.Min" }, { key: "unitPrice", label: "Costo" }, { key: "sellPrice", label: "Vendita" }, { key: "location", label: "Ubicazione" }, { key: "compatibile", label: "Compatibile con" }, { key: "notes", label: "Note" }]);
const exportJobs = () => downloadCSV("medtrace_job.csv", jobs.map(j => {
const a = assets.find(x => x.id === j.assetId) || {};
const c = customers.find(x => x.id === (j.customerId || a.customerId)) || {};
const cp = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0);
return Object.assign(Object.assign({}, j), { apparecchio: a.name || j.assetId, cliente: c.name || "", partiUsate: j.parts.map(p => { const pt = parts.find(x => x.id === p.partId); return ((pt === null || pt === void 0 ? void 0 : pt.name) || p.partId) + " x" + p.qty; }).join(", "), costoParti: cp.toFixed(2), costoManodopera: (j.laborHours * j.laborRate).toFixed(2), totale: (cp + j.laborHours * j.laborRate).toFixed(2), parts: undefined, timeline: undefined, photos: undefined });
}), [{ key: "id", label: "ID" }, { key: "apparecchio", label: "Apparecchio" }, { key: "cliente", label: "Cliente" }, { key: "type", label: "Tipo" }, { key: "priority", label: "Priorità" }, { key: "status", label: "Stato" }, { key: "assignee", label: "Tecnico" }, { key: "openDate", label: "Apertura" }, { key: "closeDate", label: "Chiusura" }, { key: "description", label: "Descrizione" }, { key: "partiUsate", label: "Parti" }, { key: "laborHours", label: "Ore" }, { key: "laborRate", label: "Tariffa €/h" }, { key: "costoParti", label: "Costo Parti" }, { key: "costoManodopera", label: "Manodopera" }, { key: "totale", label: "Totale" }]);
const exportOrders = () => downloadCSV("medtrace_ordini.csv", orders.map(o => { var _a; return (Object.assign(Object.assign({}, o), { nomeParte: ((_a = parts.find(p => p.id === o.partId)) === null || _a === void 0 ? void 0 : _a.name) || o.partId, totale: (o.qty * o.unitPrice).toFixed(2) })); }), [{ key: "id", label: "ID" }, { key: "supplier", label: "Fornitore" }, { key: "nomeParte", label: "Parte" }, { key: "qty", label: "Q.tà" }, { key: "unitPrice", label: "Prezzo Unit." }, { key: "totale", label: "Totale" }, { key: "status", label: "Stato" }, { key: "orderDate", label: "Data Ordine" }, { key: "expectedDate", label: "Consegna Prev." }, { key: "notes", label: "Note" }]);
const exportInvoices = () => downloadCSV("medtrace_preventivi.csv", invoices.map(i => { var _a; const sub = i.items.reduce((s, it) => s + it.qty * it.unitPrice, 0); const vat = i.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0); return Object.assign(Object.assign({}, i), { cliente: ((_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "", imponibile: sub.toFixed(2), iva: vat.toFixed(2), totale: (sub + vat).toFixed(2), items: undefined, jobIds: undefined }); }), [{ key: "number", label: "N.Preventivo" }, { key: "cliente", label: "Cliente" }, { key: "date", label: "Data" }, { key: "dueDate", label: "Scadenza" }, { key: "status", label: "Stato" }, { key: "imponibile", label: "Imponibile" }, { key: "iva", label: "IVA" }, { key: "totale", label: "Totale" }, { key: "paymentTerms", label: "Pagamento" }, { key: "notes", label: "Note" }]);
const exportIecReports = () => downloadCSV("medtrace_verifiche_sicurezza.csv", iecReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; return Object.assign(Object.assign({}, r), { apparecchio: a.name || r.assetId || "", nSerie: a.serial || "", cliente: c.name || "", misure: ((_a = r.measures) === null || _a === void 0 ? void 0 : _a.map(m => m.name + ": " + m.value + m.unit + " (lim." + m.limit + ")").join("; ")) || "", measures: undefined, visual: undefined }); }), [{ key: "reportNumber", label: "N.Rapporto" }, { key: "date", label: "Data" }, { key: "norm", label: "Norma" }, { key: "apparecchio", label: "Apparecchio" }, { key: "nSerie", label: "N.Serie" }, { key: "cliente", label: "Cliente" }, { key: "technician", label: "Tecnico" }, { key: "instrument", label: "Strumento" }, { key: "equipClass", label: "Classe" }, { key: "patientType", label: "Tipo Paziente" }, { key: "verifyType", label: "Tipo Verifica" }, { key: "overallPass", label: "Esito" }, { key: "misure", label: "Misure" }, { key: "notes", label: "Note" }]);
const NAV_GROUPS = [
{
id: "g_dash", label: null,
items: [
{ id: "dashboard", label: "Dashboard", icon: "◈" },
]
},
{
id: "g_maint", label: "MANUTENZIONE",
items: [
{ id: "jobs", label: "Job / Interventi", icon: "›", badge: stats.urgentJobs > 0 ? stats.urgentJobs : null, bColor: "#ef4444" },
{ id: "iec", label: "Sicurezza Elettrica", icon: "›" },
{ id: "func", label: "Verif. Funzionale", icon: "›" },
{ id: "agenda", label: "Agenda & Pianific.", icon: "›", badge: upcomingMaintenance.length > 0 ? upcomingMaintenance.length : null, bColor: "#f59e0b" },
]
},
{
id: "g_assets", label: "APPARECCHIATURE",
items: [
{ id: "assets", label: "Apparecchi", icon: "›", badge: stats.outOfService > 0 ? stats.outOfService : null, bColor: "#ef4444" },
{ id: "instruments", label: "Strumenti", icon: "›" },
{ id: "customers", label: "Clienti", icon: "›" },
]
},
{
id: "g_stock", label: "GESTIONE",
items: [
{ id: "parts", label: "Magazzino", icon: "›", badge: stats.lowStock > 0 ? stats.lowStock : null, bColor: "#f59e0b" },
{ id: "invoices", label: "Preventivi", icon: "›", badge: stats.pendingInvoices > 0 ? stats.pendingInvoices : null, bColor: "#2DD4BF" },
]
},
{
id: "g_sys", label: "DOCUMENTAZIONE & AIUTO",
items: [
{ id: "procedures", label: "Procedure", icon: "›" },
{ id: "help", label: "Guida / Help", icon: "›" },
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
const sideW = 230;
const isEmpty = assets.length === 0 && parts.length === 0 && jobs.length === 0 && customers.length === 0;
return (React.createElement("div", { style: { minHeight: "100vh", background: "#0D0D12" } },
loadingMsg && React.createElement(LoadingOverlay, { message: loadingMsg }),
toast && React.createElement("div", { style: { position: "fixed", top: 16, right: 16, background: toast.color + "22", border: "1px solid " + (toast.color) + "55", color: toast.color, borderRadius: 10, padding: "11px 18px", zIndex: 2000, fontSize: 13, fontWeight: 700, maxWidth: "90vw" } }, toast.msg),
isMobile && navOpen && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000b", zIndex: 800, backdropFilter: "blur(4px)" }, onClick: () => setNavOpen(false) },
React.createElement("aside", { style: {
position: "absolute", left: 0, top: 0, bottom: 0, width: 260,
background: "linear-gradient(180deg, #0a0a12 0%, #06080d 100%)",
borderRight: "1px solid #14182a",
display: "flex", flexDirection: "column", overflowY: "auto",
boxShadow: "4px 0 24px rgba(0,0,0,0.6)"
}, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { padding: "22px 20px 16px", borderBottom: "1px solid #14182a", position: "relative" } },
React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #2DD4BF44, transparent)" } }),
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", maxWidth: 200, height: 38, display: "block", marginBottom: 6 } },
React.createElement("defs", null,
React.createElement("linearGradient", { id: "logoGradM", x1: "0", y1: "0", x2: "1", y2: "0" },
React.createElement("stop", { offset: "0%", stopColor: "#2DD4BF" }),
React.createElement("stop", { offset: "100%", stopColor: "#0d9488" }))),
React.createElement("g", { fill: "none", stroke: "url(#logoGradM)", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2DD4BF", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", fontSize: "20", fontWeight: "800", fill: "#F8FAFC", letterSpacing: "-0.3" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#475569", letterSpacing: "2" }, "MEDICAL \u00B7 CMMS")),
company.name && React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: "#64748b", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, company.name)),
React.createElement("nav", { style: { flex: 1, padding: "14px 8px" } }, NAV_GROUPS.map((group, gi) => (React.createElement("div", { key: group.id, style: { marginBottom: gi < NAV_GROUPS.length - 1 ? 10 : 0 } },
group.label && (React.createElement("div", { style: { padding: "8px 12px 4px", fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 } }, group.label)),
group.items.map(n => {
const active = tab === n.id;
return (React.createElement("button", { key: n.id, onClick: () => { setTab(n.id); setSearch(""); setNavOpen(false); }, style: {
width: "100%", textAlign: "left",
background: active ? "linear-gradient(90deg, #2DD4BF22, #2DD4BF08)" : "transparent",
border: "none", borderRadius: 8, margin: "1px 0",
color: active ? "#F8FAFC" : "#94a3b8",
padding: "11px 14px", fontSize: 13, cursor: "pointer",
display: "flex", alignItems: "center", gap: 10,
fontWeight: active ? 600 : 500,
position: "relative",
touchAction: "manipulation",
WebkitTapHighlightColor: "transparent"
} },
active && React.createElement("span", { style: { position: "absolute", left: -8, top: 9, bottom: 9, width: 3, background: "#2DD4BF", borderRadius: "0 3px 3px 0" } }),
React.createElement("span", { style: { fontSize: 15, minWidth: 20, textAlign: "center", color: active ? "#2DD4BF" : "#64748b" } }, n.icon),
React.createElement("span", { style: { flex: 1 } }, n.label),
n.badge && React.createElement("span", { style: { background: n.bColor, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700, letterSpacing: .3 } }, n.badge)));
}))))),
React.createElement("div", { style: { padding: "12px 14px", borderTop: "1px solid #14182a", display: "flex", flexDirection: "column", gap: 10 } },
React.createElement("button", { onClick: () => { setModal({ type: "settings" }); setNavOpen(false); }, style: {
background: "transparent", border: "1px solid #1e2a3a", borderRadius: 6,
color: "#94a3b8", fontSize: 12, fontWeight: 600, padding: "8px",
cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
touchAction: "manipulation"
} }, "\u2699 Impostazioni"))))),
!isMobile && (React.createElement("aside", { style: {
position: "fixed", left: 0, top: 0, bottom: 0, width: sideW, zIndex: 100,
background: "linear-gradient(180deg, #0a0a12 0%, #06080d 100%)",
borderRight: "1px solid #14182a",
display: "flex", flexDirection: "column",
boxShadow: "4px 0 24px rgba(0,0,0,0.4)"
} },
React.createElement("div", { style: { padding: "22px 20px 18px", borderBottom: "1px solid #14182a", position: "relative" } },
React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #2DD4BF44, transparent)" } }),
React.createElement("svg", { viewBox: "0 0 220 48", xmlns: "http://www.w3.org/2000/svg", style: { width: "100%", maxWidth: 200, height: 38, display: "block", marginBottom: 6 } },
React.createElement("defs", null,
React.createElement("linearGradient", { id: "logoGrad", x1: "0", y1: "0", x2: "1", y2: "0" },
React.createElement("stop", { offset: "0%", stopColor: "#2DD4BF" }),
React.createElement("stop", { offset: "100%", stopColor: "#0d9488" }))),
React.createElement("g", { fill: "none", stroke: "url(#logoGrad)", strokeLinecap: "round", strokeLinejoin: "round" },
React.createElement("path", { d: "M6 24 Q11 14 16 24 Q21 34 26 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M1 24 Q9 10 16 24 Q23 38 31 24", strokeWidth: "2.5" }),
React.createElement("path", { d: "M-4 24 Q7 6 16 24 Q25 42 36 24", strokeWidth: "2.5" }),
React.createElement("circle", { cx: "42", cy: "24", r: "3.5", fill: "#2DD4BF", stroke: "none" })),
React.createElement("text", { x: "54", y: "28", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif", fontSize: "20", fontWeight: "800", fill: "#F8FAFC", letterSpacing: "-0.3" }, "MedTrace"),
React.createElement("text", { x: "54", y: "40", fontFamily: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif", fontSize: "8.5", fontWeight: "600", fill: "#475569", letterSpacing: "2" }, "MEDICAL \u00B7 CMMS")),
company.name && React.createElement("div", { style: { fontSize: 10, fontWeight: 600, color: "#64748b", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, company.name)),
React.createElement("nav", { style: { flex: 1, padding: "14px 8px", overflowY: "auto" } }, NAV_GROUPS.map((group, gi) => (React.createElement("div", { key: group.id, style: { marginBottom: gi < NAV_GROUPS.length - 1 ? 8 : 0 } },
group.label && (React.createElement("div", { style: { padding: "8px 12px 4px", fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 } }, group.label)),
group.items.map(n => {
const active = tab === n.id;
return (React.createElement("button", { key: n.id, onClick: () => { setTab(n.id); setSearch(""); }, onMouseEnter: e => { if (!active)
e.currentTarget.style.background = "#14182a"; }, onMouseLeave: e => { if (!active)
e.currentTarget.style.background = "transparent"; }, style: {
width: "100%", textAlign: "left",
background: active ? "linear-gradient(90deg, #2DD4BF22, #2DD4BF08)" : "transparent",
border: "none",
borderRadius: 8,
margin: "1px 0",
color: active ? "#F8FAFC" : "#94a3b8",
padding: "9px 14px",
fontSize: 12.5,
cursor: "pointer",
display: "flex", alignItems: "center", gap: 10,
fontWeight: active ? 600 : 500,
position: "relative",
transition: "all .15s ease"
} },
active && React.createElement("span", { style: { position: "absolute", left: -8, top: 7, bottom: 7, width: 3, background: "#2DD4BF", borderRadius: "0 3px 3px 0" } }),
React.createElement("span", { style: { fontSize: 14, minWidth: 18, textAlign: "center", color: active ? "#2DD4BF" : "#64748b" } }, n.icon),
React.createElement("span", { style: { flex: 1 } }, n.label),
n.badge && React.createElement("span", { style: { background: n.bColor, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 10, fontWeight: 700, letterSpacing: .3 } }, n.badge)));
}))))),
React.createElement("div", { style: { padding: "12px 14px", borderTop: "1px solid #14182a", display: "flex", flexDirection: "column", gap: 8 } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { fontSize: 10, color: "#334155", fontFamily: "monospace", letterSpacing: .5 } }, "v0.76"),
React.createElement("button", { onClick: () => setModal({ type: "settings" }), onMouseEnter: e => e.currentTarget.style.color = "#2DD4BF", onMouseLeave: e => e.currentTarget.style.color = "#64748b", style: { background: "none", border: "none", color: "#64748b", fontSize: 14, cursor: "pointer", transition: "color .15s" } }, "\u2699 Impostazioni"))))),
React.createElement("div", { style: { marginLeft: isMobile ? 0 : sideW, padding: isMobile ? "16px 14px" : "26px 28px", minHeight: "100vh" } },
typeof DEMO_LOCKED !== "undefined" && DEMO_LOCKED && (React.createElement("div", { style: {
background: "linear-gradient(90deg, #f59e0b22, #f59e0b08)",
border: "1px solid #f59e0b66",
borderRadius: 8,
padding: "8px 14px",
marginBottom: 12,
fontSize: 12,
color: "#fbbf24",
display: "flex",
alignItems: "center",
gap: 8,
fontWeight: 600
} },
React.createElement("span", { style: { fontSize: 14 } }, "\uD83D\uDC41"),
React.createElement("span", null, "Modalit\u00E0 DEMO \u2014 sola lettura. Esplora liberamente: le modifiche non sono salvate."))),
isMobile && (ptrPull > 0 || ptrRefreshing) && (React.createElement("div", { style: { position: "fixed", top: 8, left: "50%", transform: `translateX(-50%) translateY(${Math.min(ptrPull, 50) - 50}px)`, zIndex: 500, background: "#0D0D12", border: "1px solid #2DD4BF66", borderRadius: 24, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px #000a", opacity: ptrRefreshing ? 1 : Math.min(ptrPull / 60, 1), transition: ptrRefreshing ? "none" : "transform .15s" } },
React.createElement("span", { style: { display: "inline-block", width: 14, height: 14, border: "2px solid #2A2A38", borderTopColor: "#2DD4BF", borderRadius: "50%", animation: ptrRefreshing ? "ptr-spin .6s linear infinite" : "none", transform: ptrRefreshing ? "none" : `rotate(${ptrPull * 4}deg)` } }),
React.createElement("span", { style: { fontSize: 12, color: "#2DD4BF", fontWeight: 700 } }, ptrRefreshing ? "Aggiornamento…" : ptrPull > 60 ? "Rilascia per aggiornare" : "Tira per aggiornare"))),
React.createElement("style", null, `@keyframes ptr-spin { to { transform: rotate(360deg); } }`),
isMobile && (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, background: "#06090f", borderRadius: 12, padding: "10px 12px", border: "1px solid #1a2030", gap: 8 } },
React.createElement("button", { onClick: () => setNavOpen(true), style: { background: "none", border: "none", color: "#e2e8f0", fontSize: 22, cursor: "pointer", padding: "4px 8px", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "\u2261"),
React.createElement("div", { style: { flex: 1, textAlign: "center", minWidth: 0 } },
company.name && React.createElement("div", { style: { fontSize: 9, color: "#2DD4BF", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, company.name),
React.createElement("div", { style: { fontSize: 15, fontWeight: 900, color: "#F0F0F5", textTransform: "uppercase", letterSpacing: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, ((_a = NAV.find(n => n.id === tab)) === null || _a === void 0 ? void 0 : _a.label) || "MedTrace")),
React.createElement("button", { onClick: () => setModal({ type: "settings" }), style: { background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer", padding: "4px 8px", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } }, "\u2699"))),
tab === "dashboard" && (React.createElement("div", null,
!isMobile && React.createElement("h1", { style: { margin: "0 0 20px", fontSize: 20, fontWeight: 900 } }, "Dashboard"),
isEmpty ? (React.createElement(EmptyState, { icon: "", title: "Benvenuto" + (company.name ? " in " + company.name : ""), message: "Inizia registrando il primo cliente o apparecchio. Tutti i dati restano sul tuo dispositivo.", action: React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } },
React.createElement(Btn, { onClick: () => { setTab("customers"); setModal({ type: "customer", data: null }); } }, "+ Primo cliente"),
React.createElement(Btn, { variant: "ghost", onClick: () => { setTab("assets"); setModal({ type: "asset", data: null }); } }, "+ Primo apparecchio")) })) : (() => {
// ─── Computed: cose da fare e urgenze ──────────────────────
const today = new Date();
today.setHours(0, 0, 0, 0);
const in7days = new Date(today);
in7days.setDate(in7days.getDate() + 7);
const in30days = new Date(today);
in30days.setDate(in30days.getDate() + 30);
const openJobs = jobs.filter(j => j.status !== "chiuso");
const urgentJobs = openJobs.filter(j => j.priority === "urgente");
const dueThisWeek = assets.filter(a => {
if (!a.nextService)
return false;
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
return d <= in7days;
}).map(a => (Object.assign(Object.assign({}, a), { daysToService: Math.round((new Date(a.nextService) - today) / 86400000) }))).sort((a, b) => a.daysToService - b.daysToService);
const expiredService = assets.filter(a => {
if (!a.nextService)
return false;
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
return d < today;
});
const warrantyExpiring = assets.filter(a => {
if (!a.warrantyExpiry)
return false;
const d = new Date(a.warrantyExpiry);
d.setHours(0, 0, 0, 0);
return d >= today && d <= in30days;
});
const lowStock = parts.filter(p => p.qty <= p.minQty);
const upcoming30 = assets.filter(a => {
if (!a.nextService)
return false;
const d = new Date(a.nextService);
d.setHours(0, 0, 0, 0);
return d >= today && d <= in30days;
}).map(a => (Object.assign(Object.assign({}, a), { daysToService: Math.round((new Date(a.nextService) - today) / 86400000) }))).sort((a, b) => a.daysToService - b.daysToService).slice(0, 5);
const totalTodo = urgentJobs.length + expiredService.length + dueThisWeek.length + lowStock.length;
return (React.createElement(React.Fragment, null,
React.createElement("div", { style: { marginBottom: 28 } },
React.createElement("div", { style: { display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(auto-fit,minmax(160px,1fr))", gap: 10 } },
React.createElement(Pill, { label: "Apparecchi", value: stats.totalAssets, color: "#2DD4BF", onClick: () => setTab("assets") }),
React.createElement(Pill, { label: "Job aperti", value: stats.openJobs, color: "#2DD4BF", sub: stats.urgentJobs > 0 ? stats.urgentJobs + " urgenti" : "", onClick: () => setTab("jobs") }),
React.createElement(Pill, { label: "Verifiche", value: iecReports.length + funcReports.length, color: "#2DD4BF", sub: "sicurezza + funz.", onClick: () => setTab("iec") }),
React.createElement(Pill, { label: "Clienti", value: stats.customers, color: "#2DD4BF", onClick: () => setTab("customers") }))),
React.createElement("div", { style: { marginBottom: 28 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #1e2a3a" } },
React.createElement("h2", { style: { margin: 0, fontSize: 13, fontWeight: 800, color: "#e2e8f0", letterSpacing: .5, textTransform: "uppercase" } }, "Da fare"),
React.createElement("span", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace" } }, totalTodo === 0 ? "tutto in ordine" : totalTodo + " attività")),
totalTodo === 0 ? (React.createElement("div", { style: { padding: "20px 16px", textAlign: "center", color: "#64748b", fontSize: 12, background: "#0D0D12", borderRadius: 8, border: "1px dashed #1e2a3a" } }, "Nessuna scadenza imminente. Tutto sotto controllo.")) : (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
urgentJobs.length > 0 && (React.createElement("div", { onClick: () => setTab("jobs"), style: { padding: "10px 14px", background: "#0D0D12", border: "1px solid #1e2a3a", borderLeft: "3px solid #ef4444", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" } },
urgentJobs.length,
" ",
urgentJobs.length === 1 ? "job urgente" : "job urgenti"),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } }, "Da prendere in carico subito")),
React.createElement("span", { style: { color: "#ef4444", fontSize: 14 } }, "\u203A"))),
expiredService.length > 0 && (React.createElement("div", { onClick: () => setTab("agenda"), style: { padding: "10px 14px", background: "#0D0D12", border: "1px solid #1e2a3a", borderLeft: "3px solid #ef4444", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" } },
expiredService.length,
" ",
expiredService.length === 1 ? "manutenzione scaduta" : "manutenzioni scadute"),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } }, "Da pianificare con priorit\u00E0")),
React.createElement("span", { style: { color: "#ef4444", fontSize: 14 } }, "\u203A"))),
dueThisWeek.filter(a => a.daysToService >= 0).length > 0 && (React.createElement("div", { onClick: () => setTab("agenda"), style: { padding: "10px 14px", background: "#0D0D12", border: "1px solid #1e2a3a", borderLeft: "3px solid #f59e0b", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" } },
dueThisWeek.filter(a => a.daysToService >= 0).length,
" manutenzioni questa settimana"),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } }, "Scadenza entro 7 giorni")),
React.createElement("span", { style: { color: "#f59e0b", fontSize: 14 } }, "\u203A"))),
lowStock.length > 0 && (React.createElement("div", { onClick: () => setTab("parts"), style: { padding: "10px 14px", background: "#0D0D12", border: "1px solid #1e2a3a", borderLeft: "3px solid #f59e0b", borderRadius: 8, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", null,
React.createElement("div", { style: { fontSize: 13, fontWeight: 700, color: "#e2e8f0" } },
lowStock.length,
" ",
lowStock.length === 1 ? "parte sotto scorta" : "parti sotto scorta"),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2 } }, "Da riordinare")),
React.createElement("span", { style: { color: "#f59e0b", fontSize: 14 } }, "\u203A")))))),
(urgentJobs.length > 0 || expiredService.length > 0) && (React.createElement("div", { style: { marginBottom: 28 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #1e2a3a" } },
React.createElement("h2", { style: { margin: 0, fontSize: 13, fontWeight: 800, color: "#ef4444", letterSpacing: .5, textTransform: "uppercase" } }, "Critico"),
React.createElement("span", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace" } },
urgentJobs.length + expiredService.length,
" elementi")),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
urgentJobs.slice(0, 3).map(j => {
const a = assets.find(x => x.id === j.assetId) || {};
return (React.createElement("div", { key: j.id, onClick: () => setModal({ type: "job", data: j }), style: { padding: "10px 14px", background: "#141418", border: "1px solid #ef444433", borderRadius: 8, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } },
React.createElement("span", { style: { fontSize: 10, color: "#ef4444", fontWeight: 800, letterSpacing: .5, textTransform: "uppercase" } },
"Job urgente \u00B7 ",
j.id),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontFamily: "monospace" } }, j.openDate)),
React.createElement("div", { style: { fontSize: 13, color: "#e2e8f0", fontWeight: 600 } }, a.name || "(apparecchio sconosciuto)"),
j.description && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, j.description)));
}),
expiredService.slice(0, 3).map(a => {
const c = customers.find(x => x.id === a.customerId) || {};
const days = Math.round((today - new Date(a.nextService)) / 86400000);
return (React.createElement("div", { key: a.id, onClick: () => setModal({ type: "assetDetail", data: a }), style: { padding: "10px 14px", background: "#141418", border: "1px solid #ef444433", borderRadius: 8, cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 } },
React.createElement("span", { style: { fontSize: 10, color: "#ef4444", fontWeight: 800, letterSpacing: .5, textTransform: "uppercase" } },
"Manut. scaduta da ",
days,
"gg"),
React.createElement("span", { style: { fontSize: 10, color: "#64748b", fontFamily: "monospace" } }, a.nextService)),
React.createElement("div", { style: { fontSize: 13, color: "#e2e8f0", fontWeight: 600 } }, a.name),
c.name && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 2 } }, c.name)));
}),
(urgentJobs.length + expiredService.length > 6) && (React.createElement("div", { onClick: () => setTab("jobs"), style: { padding: "8px 14px", textAlign: "center", fontSize: 11, color: "#64748b", cursor: "pointer", touchAction: "manipulation" } },
"+ altri ",
urgentJobs.length + expiredService.length - 6,
" elementi critici \u203A"))))),
upcoming30.length > 0 && (React.createElement("div", { style: { marginBottom: 28 } },
React.createElement("div", { style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid #1e2a3a" } },
React.createElement("h2", { style: { margin: 0, fontSize: 13, fontWeight: 800, color: "#e2e8f0", letterSpacing: .5, textTransform: "uppercase" } }, "Prossimi 30 giorni"),
React.createElement("span", { onClick: () => setTab("agenda"), style: { fontSize: 11, color: "#2DD4BF", cursor: "pointer", fontWeight: 600 } }, "vedi agenda \u203A")),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } }, upcoming30.map(a => {
const c = customers.find(x => x.id === a.customerId) || {};
const col = a.daysToService <= 7 ? "#f59e0b" : "#64748b";
return (React.createElement("div", { key: a.id, onClick: () => setModal({ type: "assetDetail", data: a }), style: { padding: "8px 14px", background: "#0D0D12", borderRadius: 6, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, touchAction: "manipulation", WebkitTapHighlightColor: "transparent" } },
React.createElement("div", { style: { minWidth: 0, flex: 1 } },
React.createElement("div", { style: { fontSize: 12, color: "#e2e8f0", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, a.name),
c.name && React.createElement("div", { style: { fontSize: 10, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, c.name)),
React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
React.createElement("div", { style: { fontSize: 11, color: col, fontWeight: 700, fontFamily: "monospace" } }, a.daysToService === 0 ? "oggi" : a.daysToService === 1 ? "domani" : "tra " + a.daysToService + "gg"),
React.createElement("div", { style: { fontSize: 9, color: "#475569", fontFamily: "monospace" } }, a.nextService))));
})))),
React.createElement("div", { style: { padding: "12px 14px", background: "#0D0D12", border: "1px solid #1e2a3a", borderRadius: 8, marginBottom: 18, display: "flex", flexWrap: "wrap", gap: isMobile ? 12 : 20, fontSize: 11, color: "#64748b", alignItems: "center", justifyContent: "space-around" } },
React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "#e2e8f0", fontFamily: "monospace" } }, stats.operative),
" operativi"),
React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "#94a3b8", fontFamily: "monospace" } }, stats.maintenance),
" in manut."),
React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: stats.outOfService > 0 ? "#ef4444" : "#94a3b8", fontFamily: "monospace" } }, stats.outOfService),
" fuori serv."),
warrantyExpiring.length > 0 && React.createElement("span", { onClick: () => setTab("assets"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "#f59e0b", fontFamily: "monospace" } }, warrantyExpiring.length),
" garanzie in scad."),
stats.pendingInvoices > 0 && React.createElement("span", { onClick: () => setTab("invoices"), style: { cursor: "pointer" } },
React.createElement("strong", { style: { color: "#94a3b8", fontFamily: "monospace" } }, stats.pendingInvoices),
" preventivi aperti"))));
})())),
tab === "assets" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: isMobile ? 14 : 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Apparecchi Medicali"),
React.createElement("p", { style: { color: "#64748b", margin: isMobile ? 0 : "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
assets.length,
" totali \u00B7 ",
assets.filter(a => a.status === "fuori servizio").length,
" fuori servizio")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportAssets }, "\u2B07 CSV"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "asset", data: null }) }, "+ Nuovo"))),
!isMobile && React.createElement("div", { style: { fontSize: 11, color: "#475569", marginBottom: 8, fontStyle: "italic" } }, "\u2192 Doppio click su una riga per aprire la scheda dettaglio dell'apparecchio"),
assets.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83C\uDFE5", title: "Nessun apparecchio ancora", subtitle: "Inizia aggiungendo il primo apparecchio del tuo parco macchine. Potrai poi gestirne verifiche di sicurezza, interventi e manutenzioni programmate.", actions: [
{ label: "+ Nuovo apparecchio", onClick: () => setModal({ type: "asset", data: null }), primary: true },
{ label: "Importa backup", onClick: () => setModal({ type: "settings" }) }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredAssets = assets.filter(a => {
const q = mobileSearch.assets.toLowerCase();
if (q && ![a.name, a.brand, a.model, a.serial, a.location, a.id].some(f => String(f || "").toLowerCase().includes(q)))
return false;
return matchFilters(a, "assets", {
name: x => x.name || "",
brand: x => x.brand || "", model: x => x.model || "", serial: x => x.serial || "",
location: x => x.location || "", status: x => x.status || "",
customer: x => { var _a; return ((_a = customers.find(c => c.id === x.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; },
riskClass: x => x.riskClass || "",
iecNorm: x => x.iecNorm || "", iecClass: x => x.iecClass || "",
patientType: x => x.patientType || ""
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.assets, onChange: v => updMS("assets", v), placeholder: "Cerca apparecchio, marca, S/N\u2026", count: filteredAssets.length, total: assets.length }),
React.createElement(FilterDropdown, { filters: {
name: { label: "Nome apparecchio", options: [...new Set(assets.map(a => a.name).filter(Boolean))].sort(), value: activeFilters.assets.name },
brand: { label: "Marca", options: [...new Set(assets.map(a => a.brand).filter(Boolean))].sort(), value: activeFilters.assets.brand },
model: { label: "Modello", options: [...new Set(assets.map(a => a.model).filter(Boolean))].sort(), value: activeFilters.assets.model },
serial: { label: "Numero di serie", options: [...new Set(assets.map(a => a.serial).filter(Boolean))].sort(), value: activeFilters.assets.serial },
location: { label: "Ubicazione", options: [...new Set(assets.map(a => a.location).filter(Boolean))].sort(), value: activeFilters.assets.location },
status: { label: "Stato", options: ["operativo", "in manutenzione", "fuori servizio"], value: activeFilters.assets.status },
customer: { label: "Cliente", options: [...new Set(assets.map(a => { var _a; return (_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.assets.customer },
riskClass: { label: "Classe rischio (MDR)", options: ["I", "IIa", "IIb", "III"], value: activeFilters.assets.riskClass },
iecNorm: { label: "Norma IEC", options: [...new Set(assets.map(a => a.iecNorm).filter(Boolean))].sort(), value: activeFilters.assets.iecNorm },
iecClass: { label: "Classe elettrica", options: ["I", "II", "III"], value: activeFilters.assets.iecClass },
patientType: { label: "Tipo parte applicata", options: ["B", "BF", "CF"], value: activeFilters.assets.patientType },
}, onChange: (k, v) => setFilter("assets", k, v), onClearAll: () => clearFilters("assets") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredAssets.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessun apparecchio corrisponde ai filtri")),
filteredAssets.map(a => {
const cust = customers.find(c => c.id === a.customerId);
const days = a.nextService ? Math.round((new Date(a.nextService) - new Date()) / 86400000) : null;
const statusColor = STATUS_COLOR[a.status] || "#64748b";
const displayName = a.name || a.brand || a.model || ("Apparecchio " + a.id);
const brandModel = [a.brand, a.model].filter(Boolean).join(" ");
return (React.createElement(SwipeableCard, { key: a.id, onDelete: () => delAsset(a.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden" } },
React.createElement("div", { onClick: () => setModal({ type: "assetDetail", data: a }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 15, flex: 1, minWidth: 0, wordBreak: "break-word", lineHeight: 1.3 } }, displayName),
React.createElement(Badge, { text: a.status, color: statusColor })),
brandModel && React.createElement("div", { style: { fontSize: 12, color: "#94a3b8", marginBottom: 3 } }, brandModel),
React.createElement("div", { style: { fontSize: 10, color: "#64748b", fontFamily: "monospace" } },
"S/N: ",
a.serial || "—",
" \u00B7 ID: ",
a.id),
cust && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 6 } },
"\uD83C\uDFE2 ",
cust.name),
(a.riskClass || a.location || days !== null) && (React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 8 } },
React.createElement("div", { style: { display: "flex", gap: 5, fontSize: 10, color: "#64748b", alignItems: "center", flexWrap: "wrap" } },
a.riskClass && React.createElement("span", { style: { padding: "1px 6px", border: "1px solid #2a3040", borderRadius: 4 } },
"Cl.",
a.riskClass),
a.location && React.createElement("span", null,
"\uD83D\uDCCD ",
a.location)),
days !== null && React.createElement(AlertChip, { days: days })))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 36px", gap: 0, background: "#0D0D12" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "iec", assetId: a.id, data: null }); }, style: { background: "transparent", color: "#a855f7", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u26A1 Sicur."),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "func", assetId: a.id, data: null }); }, style: { background: "transparent", color: "#06b6d4", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2713 Funz."),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "asset", data: a }); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Mod."),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delAsset(a.id); }, title: "Elimina apparecchio", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { defaultSort: "name", onRowClick: row => setModal({ type: "assetDetail", data: assets.find(a => a.id === row.id) }), rowBg: row => row.status === "fuori servizio" ? "#ef333308" : row.status === "in manutenzione" ? "#f59e0b08" : "", cols: [
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
React.createElement("button", { onClick: () => setModal({ type: "assetDetail", data: assets.find(a => a.id === row.id) }), title: "Scheda apparecchio", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDCCB"),
React.createElement("button", { onClick: () => setModal({ type: "iec", assetId: row.id, data: null }), title: "Verifica di Sicurezza Elettrica", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u26A1"),
React.createElement("button", { onClick: () => setModal({ type: "func", assetId: row.id, data: null }), title: "Verifica funzionale", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#a855f7", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2713"))) })))),
tab === "jobs" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Job / Interventi"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
jobs.filter(j => j.status !== "chiuso").length,
" aperti \u00B7 ",
jobs.length,
" totali")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportJobs }, "\u2B07 CSV"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "job", data: null }) }, "+ Nuovo"))),
jobs.length > 0 && (React.createElement("div", { style: { display: "flex", gap: 0, marginBottom: 14, background: "#0D0D12", borderRadius: 8, padding: 3, border: "1px solid #1e2a3a", width: "fit-content", maxWidth: "100%", overflow: "auto" } }, [
{ id: "open", label: "Aperti", count: jobs.filter(j => j.status !== "chiuso").length, color: "#2DD4BF" },
{ id: "all", label: "Tutti", count: jobs.length, color: "#94a3b8" },
{ id: "closed", label: "Chiusi", count: jobs.filter(j => j.status === "chiuso").length, color: "#64748b" },
].map(f => (React.createElement("button", { key: f.id, onClick: () => setJobFilter(f.id), style: {
background: jobFilter === f.id ? f.color + "22" : "transparent",
color: jobFilter === f.id ? f.color : "#94a3b8",
border: "none",
borderRadius: 6,
padding: "6px 14px",
cursor: "pointer",
fontSize: 12,
fontWeight: 700,
touchAction: "manipulation",
WebkitTapHighlightColor: "transparent",
whiteSpace: "nowrap",
display: "flex",
alignItems: "center",
gap: 6,
} },
f.label,
React.createElement("span", { style: { fontSize: 10, opacity: .7, fontFamily: "monospace" } }, f.count)))))),
jobs.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDD27", title: "Nessun intervento registrato", subtitle: assets.length === 0 ? "Prima registra un apparecchio dal menu Apparecchi, poi potrai aprire job di intervento (correttivi, preventivi, tarature)." : "Apri il primo job per tracciare un intervento sui tuoi apparecchi. Puoi gestire timeline, parti utilizzate, ore di manodopera e generare PDF.", actions: assets.length === 0 ? [
{ label: "+ Nuovo apparecchio", onClick: () => setModal({ type: "asset", data: null }), primary: true }
] : [
{ label: "+ Nuovo intervento", onClick: () => setModal({ type: "job", data: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredJobs = jobs.filter(j => {
if (jobFilter === "open" && j.status === "chiuso")
return false;
if (jobFilter === "closed" && j.status !== "chiuso")
return false;
const q = mobileSearch.jobs.toLowerCase();
if (q) {
const a = assets.find(x => x.id === j.assetId) || {};
if (![j.id, a.name, a.brand, j.assignee, j.type, j.status, j.priority].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(j, "jobs", {
assetName: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.name) || ""; },
priority: x => x.priority || "", type: x => x.type || "",
status: x => x.status || "",
assignee: x => x.assignee || "",
customer: x => { var _a; return ((_a = customers.find(c => { var _a; return c.id === (x.customerId || ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.customerId)); })) === null || _a === void 0 ? void 0 : _a.name) || ""; }
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.jobs, onChange: v => updMS("jobs", v), placeholder: "Cerca job, apparecchio, tecnico\u2026", count: filteredJobs.length, total: jobs.length }),
React.createElement(FilterDropdown, { filters: {
assetName: { label: "Apparecchio", options: [...new Set(jobs.map(j => { var _a; return (_a = assets.find(a => a.id === j.assetId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.jobs.assetName },
priority: { label: "Priorità", options: ["urgente", "alta", "normale", "bassa"], value: activeFilters.jobs.priority },
type: { label: "Tipo", options: [...new Set(jobs.map(j => j.type).filter(Boolean))].sort(), value: activeFilters.jobs.type },
status: { label: "Stato", options: [...new Set(jobs.map(j => j.status).filter(Boolean))].sort(), value: activeFilters.jobs.status },
assignee: { label: "Tecnico", options: [...new Set(jobs.map(j => j.assignee).filter(Boolean))].sort(), value: activeFilters.jobs.assignee },
customer: { label: "Cliente", options: [...new Set(jobs.map(j => { var _a; return (_a = customers.find(c => { var _a; return c.id === (j.customerId || ((_a = assets.find(a => a.id === j.assetId)) === null || _a === void 0 ? void 0 : _a.customerId)); })) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.jobs.customer },
}, onChange: (k, v) => setFilter("jobs", k, v), onClearAll: () => clearFilters("jobs") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredJobs.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessun job corrisponde ai filtri")),
filteredJobs.map(j => {
const a = assets.find(x => x.id === j.assetId) || {};
const c = customers.find(x => x.id === (j.customerId || a.customerId)) || {};
const total = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0) + j.laborHours * j.laborRate;
const priColor = PRI_COLOR[j.priority] || "#64748b";
const statColor = STATUS_COLOR[j.status] || "#64748b";
return (React.createElement(SwipeableCard, { key: j.id, onDelete: () => delJob(j.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + priColor } },
React.createElement("div", { onClick: () => setModal({ type: "job", data: j }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } }, a.name || ("Job " + j.id)),
React.createElement(Badge, { text: j.status, color: statColor })),
React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 11, color: "#94a3b8" } },
React.createElement("span", { style: { padding: "1px 6px", background: priColor + "22", color: priColor, borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase" } }, j.priority),
React.createElement("span", { style: { padding: "1px 6px", background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 4, fontSize: 10 } }, j.type)),
c.name && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginBottom: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { fontSize: 10, color: "#64748b", fontFamily: "monospace" } },
"Aperto: ",
j.openDate,
j.closeDate ? " · Chiuso: " + j.closeDate : ""),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 } },
React.createElement("span", { style: { fontSize: 11, color: "#94a3b8" } }, j.assignee || "Tecnico non assegnato"),
React.createElement("span", { style: { fontSize: 13, color: "#a855f7", fontWeight: 800, fontFamily: "monospace" } },
"\u20AC",
total.toFixed(0)))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "#0D0D12" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateJobPDF(j, assets, parts, customers, company); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "job", data: j }); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delJob(j.id); }, title: "Elimina job", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { defaultSort: "openDate", rowBg: row => row.priority === "urgente" && row.status !== "chiuso" ? "#ef333308" : row.priority === "alta" && row.status !== "chiuso" ? "#f9730008" : "", cols: [
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
row.hasIec && React.createElement("span", { title: "Verifica di Sicurezza Elettrica collegata" }, "\u26A1"),
v > 0 && React.createElement("span", null,
"\u00B7",
v)) },
], rows: jobs.filter(j => { if (jobFilter === "open" && j.status === "chiuso")
return false; if (jobFilter === "closed" && j.status !== "chiuso")
return false; return true; }).map(j => {
var _a;
const a = assets.find(x => x.id === j.assetId) || {};
const c = customers.find(x => x.id === (j.customerId || a.customerId)) || {};
const tot = j.parts.reduce((s, p) => { const pt = parts.find(x => x.id === p.partId); return s + (pt ? (pt.sellPrice || pt.unitPrice) * p.qty : 0); }, 0) + j.laborHours * j.laborRate;
return Object.assign(Object.assign({}, j), { apparecchio: a.name || j.assetId, cliente: c.name || "", totale: tot.toFixed(2), steps: ((_a = j.timeline) === null || _a === void 0 ? void 0 : _a.length) || 0, hasIec: !!j.iecReportId });
}), onEdit: row => setModal({ type: "job", data: jobs.find(j => j.id === row.id) }), onDelete: id => delJob(id), actions: row => (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => setModal({ type: "timeline", data: jobs.find(j => j.id === row.id) }), title: "Timeline", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u00B7"),
React.createElement("button", { onClick: () => generateJobPDF(jobs.find(j => j.id === row.id), assets, parts, customers, company), title: "PDF rapporto", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\uD83D\uDCC4"))) })))),
(tab === "parts" || tab === "withdrawals" || tab === "orders") && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14, borderBottom: "1px solid #2a3040", paddingBottom: 0, flexWrap: "wrap" } },
React.createElement("button", { onClick: () => setTab("parts"), style: { background: tab === "parts" ? "#2DD4BF18" : "transparent", color: tab === "parts" ? "#2DD4BF" : "#94a3b8", border: "none", borderBottom: tab === "parts" ? "2px solid #2DD4BF" : "2px solid transparent", padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: -1, touchAction: "manipulation" } },
" Stock parti",
stats.lowStock > 0 ? ` (${stats.lowStock}⚠)` : ""),
React.createElement("button", { onClick: () => setTab("withdrawals"), style: { background: tab === "withdrawals" ? "#2DD4BF18" : "transparent", color: tab === "withdrawals" ? "#2DD4BF" : "#94a3b8", border: "none", borderBottom: tab === "withdrawals" ? "2px solid #2DD4BF" : "2px solid transparent", padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: -1, touchAction: "manipulation" } },
" Scarichi (",
withdrawals.length,
")"),
React.createElement("button", { onClick: () => setTab("orders"), style: { background: tab === "orders" ? "#2DD4BF18" : "transparent", color: tab === "orders" ? "#2DD4BF" : "#94a3b8", border: "none", borderBottom: tab === "orders" ? "2px solid #2DD4BF" : "2px solid transparent", padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: -1, touchAction: "manipulation" } },
" Ordini (",
orders.length,
")")))),
tab === "parts" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Stock Parti"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
"Costo: \u20AC",
stats.stockValue.toFixed(2),
" \u00B7 Vendita: \u20AC",
stats.stockSellValue.toFixed(2),
" \u00B7 ",
stats.lowStock,
" sotto min.")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportParts }, "\u2B07 CSV"),
React.createElement(Btn, { sm: true, variant: "success", onClick: () => setModal({ type: "withdrawal" }) }, " Scarica"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "part", data: null }) }, "+ Nuova"))),
parts.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDCE6", title: "Magazzino vuoto", subtitle: "Aggiungi le parti di ricambio del tuo magazzino: avrai sotto controllo stock minimo, alert sotto-scorta, costo e prezzo vendita per ogni codice.", actions: [
{ label: "+ Nuova parte", onClick: () => setModal({ type: "part", data: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredParts = parts.filter(p => {
const q = mobileSearch.parts.toLowerCase();
if (q && ![p.code, p.name, p.brand, p.location, p.id].some(f => String(f || "").toLowerCase().includes(q)))
return false;
return matchFilters(p, "parts", {
code: x => x.code || "", name: x => x.name || "",
brand: x => x.brand || "", location: x => x.location || "",
supplier: x => x.supplier || "",
stockStatus: x => x.qty === 0 ? "esaurita" : (x.qty <= x.minQty ? "sotto scorta" : "disponibile")
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.parts, onChange: v => updMS("parts", v), placeholder: "Cerca codice, nome, marca\u2026", count: filteredParts.length, total: parts.length }),
React.createElement(FilterDropdown, { filters: {
code: { label: "Codice", options: [...new Set(parts.map(p => p.code).filter(Boolean))].sort(), value: activeFilters.parts.code },
name: { label: "Nome parte", options: [...new Set(parts.map(p => p.name).filter(Boolean))].sort(), value: activeFilters.parts.name },
brand: { label: "Marca", options: [...new Set(parts.map(p => p.brand).filter(Boolean))].sort(), value: activeFilters.parts.brand },
location: { label: "Ubicazione", options: [...new Set(parts.map(p => p.location).filter(Boolean))].sort(), value: activeFilters.parts.location },
supplier: { label: "Fornitore", options: [...new Set(parts.map(p => p.supplier).filter(Boolean))].sort(), value: activeFilters.parts.supplier },
stockStatus: { label: "Stato stock", options: ["disponibile", "sotto scorta", "esaurita"], value: activeFilters.parts.stockStatus },
}, onChange: (k, v) => setFilter("parts", k, v), onClearAll: () => clearFilters("parts") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredParts.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessuna parte corrisponde ai filtri")),
filteredParts.map(p => {
const low = p.qty <= p.minQty;
const zero = p.qty === 0;
const borderC = zero ? "#ef4444" : low ? "#f59e0b" : "#22c55e";
return (React.createElement(SwipeableCard, { key: p.id, onDelete: () => delPart(p.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + borderC } },
React.createElement("div", { onClick: () => setModal({ type: "part", data: p }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } }, p.name || p.code || ("Parte " + p.id)),
React.createElement("span", { style: { padding: "2px 8px", background: borderC + "22", color: borderC, borderRadius: 5, fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", fontFamily: "monospace" } }, p.qty)),
p.code && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", fontFamily: "monospace", marginBottom: 3 } }, p.code),
p.brand && React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginBottom: 3 } }, p.brand),
p.location && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 3 } },
"\uD83D\uDCCD ",
p.location),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid #1e2a3a", fontSize: 11 } },
React.createElement("span", { style: { color: "#64748b" } },
"Min: ",
React.createElement("span", { style: { color: "#94a3b8", fontFamily: "monospace" } }, p.minQty)),
React.createElement("span", { style: { color: "#64748b" } },
"Acquisto: ",
React.createElement("span", { style: { color: "#94a3b8", fontFamily: "monospace" } },
"\u20AC",
parseFloat(p.unitPrice || 0).toFixed(2))),
React.createElement("span", { style: { color: "#22c55e", fontWeight: 700, fontFamily: "monospace" } },
"\u20AC",
parseFloat(p.sellPrice || p.unitPrice || 0).toFixed(2)))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "#0D0D12" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "withdrawal", partId: p.id }); }, style: { background: "transparent", color: "#22c55e", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2193 Scarica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "part", data: p }); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delPart(p.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { defaultSort: "name", rowBg: row => row.qty === 0 ? "#ef333308" : row.qty <= row.minQty ? "#f59e0b08" : "", cols: [
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
], rows: parts.map(p => (Object.assign(Object.assign({}, p), { sellPrice: p.sellPrice || p.unitPrice, margine: ((p.sellPrice || p.unitPrice) - p.unitPrice).toFixed(2), valoreStock: (p.qty * p.unitPrice).toFixed(2) }))), onEdit: row => setModal({ type: "part", data: parts.find(p => p.id === row.id) }), onDelete: id => delPart(id), actions: row => (React.createElement("button", { onClick: () => duplicatePart(parts.find(p => p.id === row.id)), title: "Duplica parte", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2398")) })))),
tab === "customers" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Clienti"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
customers.length,
" totali")),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "customer", data: null }) }, "+ Nuovo")),
customers.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83C\uDFE2", title: "Nessun cliente registrato", subtitle: "Aggiungi i tuoi clienti (cliniche, ospedali, studi medici, RSA) per associare apparecchi, preventivi e interventi.", actions: [
{ label: "+ Nuovo cliente", onClick: () => setModal({ type: "customer", data: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredCust = customers.filter(c => {
const q = mobileSearch.customers.toLowerCase();
if (q && ![c.name, c.contact, c.email, c.phone, c.vat, c.address].some(f => String(f || "").toLowerCase().includes(q)))
return false;
return matchFilters(c, "customers", {
city: x => { const addr = x.address || ""; const parts = addr.split(","); return (parts[parts.length - 1] || "").trim(); },
vat: x => x.vat || ""
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.customers, onChange: v => updMS("customers", v), placeholder: "Cerca cliente, contatto, email\u2026", count: filteredCust.length, total: customers.length }),
React.createElement(FilterDropdown, { filters: {
city: { label: "Città / Località", options: [...new Set(customers.map(c => { const addr = c.address || ""; const parts = addr.split(","); return (parts[parts.length - 1] || "").trim(); }).filter(Boolean))].sort(), value: activeFilters.customers.city },
vat: { label: "P.IVA", options: [...new Set(customers.map(c => c.vat).filter(Boolean))].sort(), value: activeFilters.customers.vat },
}, onChange: (k, v) => setFilter("customers", k, v), onClearAll: () => clearFilters("customers") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredCust.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessun cliente corrisponde ai filtri")),
filteredCust.map(c => {
const nApp = assets.filter(a => a.customerId === c.id).length;
return (React.createElement(SwipeableCard, { key: c.id, onDelete: () => delCustomer(c.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden" } },
React.createElement("div", { onClick: () => setModal({ type: "customer", data: c }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 14, flex: 1, minWidth: 0, wordBreak: "break-word" } }, c.name || ("Cliente " + c.id)),
nApp > 0 && React.createElement("span", { style: { padding: "2px 8px", background: "#2DD4BF22", color: "#2DD4BF", borderRadius: 5, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" } },
nApp,
" app.")),
c.contact && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginBottom: 3 } },
" ",
c.contact),
c.email && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginBottom: 3, wordBreak: "break-all" } },
" ",
c.email),
c.phone && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginBottom: 3, fontFamily: "monospace" } },
" ",
c.phone),
c.vat && React.createElement("div", { style: { fontSize: 10, color: "#64748b", fontFamily: "monospace", marginTop: 4 } },
"P.IVA: ",
c.vat),
c.address && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 4 } },
"\uD83D\uDCCD ",
c.address)),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 36px", gap: 0, background: "#0D0D12" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "customer", data: c }); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delCustomer(c.id); }, title: "Elimina cliente", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { defaultSort: "name", cols: [
{ key: "name", label: "Ragione Sociale", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "vat", label: "P.IVA", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "contact", label: "Referente" },
{ key: "email", label: "Email" },
{ key: "phone", label: "Telefono", render: v => React.createElement("span", { style: { fontFamily: "monospace" } }, v || "—") },
{ key: "address", label: "Indirizzo" },
{ key: "nApparecchi", label: "Apparecchi", render: v => React.createElement("span", { style: { color: "#2DD4BF", fontWeight: 700 } }, v) },
], rows: customers.map(c => (Object.assign(Object.assign({}, c), { nApparecchi: assets.filter(a => a.customerId === c.id).length }))), onEdit: row => setModal({ type: "customer", data: customers.find(c => c.id === row.id) }), onDelete: id => delCustomer(id), actions: row => (React.createElement("button", { onClick: () => duplicateCustomer(customers.find(c => c.id === row.id)), title: "Duplica cliente", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 7px", cursor: "pointer", fontSize: 11, fontWeight: 700 } }, "\u2398")) })))),
tab === "invoices" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Preventivi"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
stats.pendingInvoices,
" in sospeso \u00B7 ",
invoices.length,
" totali")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportInvoices }, "\u2B07 CSV"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "invoice", data: null }) }, "+ Nuova"))),
invoices.length === 0 ? (React.createElement(EmptyState, { icon: "\uD83D\uDCC4", title: "Nessun preventivo emesso", subtitle: "Crea preventivi professionali per i tuoi clienti. Puoi importare manodopera e parti direttamente da un job esistente.", actions: [
{ label: "+ Nuovo preventivo", onClick: () => setModal({ type: "invoice", data: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredInvoices = invoices.filter(i => {
const q = mobileSearch.invoices.toLowerCase();
if (q) {
const c = customers.find(x => x.id === i.customerId) || {};
if (![i.number, i.date, i.status, c.name].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(i, "invoices", {
number: x => x.number || "",
status: x => x.status || "",
customer: x => { var _a; return ((_a = customers.find(c => c.id === x.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.invoices, onChange: v => updMS("invoices", v), placeholder: "Cerca preventivo, cliente\u2026", count: filteredInvoices.length, total: invoices.length }),
React.createElement(FilterDropdown, { filters: {
number: { label: "Numero preventivo", options: [...new Set(invoices.map(i => i.number).filter(Boolean))].sort(), value: activeFilters.invoices.number },
status: { label: "Stato", options: ["bozza", "emessa", "pagata", "scaduta", "annullato"], value: activeFilters.invoices.status },
customer: { label: "Cliente", options: [...new Set(invoices.map(i => { var _a; return (_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.invoices.customer },
}, onChange: (k, v) => setFilter("invoices", k, v), onClearAll: () => clearFilters("invoices") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredInvoices.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessun preventivo corrisponde ai filtri")),
filteredInvoices.map(i => {
const c = customers.find(x => x.id === i.customerId) || {};
const sub = i.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
const vat = i.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0);
const tot = sub + vat;
const statColor = STATUS_COLOR[i.status] || "#94a3b8";
return (React.createElement(SwipeableCard, { key: i.id, onDelete: () => delInvoice(i.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden" } },
React.createElement("div", { onClick: () => setModal({ type: "invoice", data: i }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 14, fontFamily: "monospace", flex: 1, minWidth: 0, wordBreak: "break-word" } }, i.number),
React.createElement(Badge, { text: i.status, color: statColor })),
c.name && React.createElement("div", { style: { fontSize: 12, color: "#94a3b8", marginBottom: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", fontFamily: "monospace" } },
"Data: ",
i.date,
i.dueDate ? " · Scad: " + i.dueDate : ""),
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid #1e2a3a" } },
React.createElement("div", { style: { fontSize: 10, color: "#64748b" } },
i.items.length,
" ",
i.items.length === 1 ? "voce" : "voci",
" \u00B7 IVA \u20AC",
vat.toFixed(0)),
React.createElement("span", { style: { fontSize: 16, color: "#22c55e", fontWeight: 900, fontFamily: "monospace" } },
"\u20AC",
tot.toFixed(2)))),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "#0D0D12" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateInvoicePDF(i, c, jobs, assets, parts, company); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "invoice", data: i }); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delInvoice(i.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { defaultSort: "date", cols: [
{ key: "number", label: "N. Preventivo", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700, color: "#e2e8f0" } }, v) },
{ key: "cliente", label: "Cliente", opts: [...new Set(invoices.map(i => { var _a; return ((_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "date", label: "Data" },
{ key: "dueDate", label: "Scadenza", render: v => v || "—" },
{ key: "status", label: "Stato", opts: ["bozza", "emessa", "pagata", "scaduta", "annullato"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "#94a3b8" }) },
{ key: "imponibile", label: "Imponibile", render: v => React.createElement("span", { style: { fontFamily: "monospace" } },
"\u20AC",
v) },
{ key: "iva", label: "IVA", render: v => React.createElement("span", { style: { fontFamily: "monospace", color: "#64748b" } },
"\u20AC",
v) },
{ key: "totale", label: "Totale", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 800, color: "#22c55e" } },
"\u20AC",
v) },
], rows: invoices.map(i => { var _a; const sub = i.items.reduce((s, it) => s + it.qty * it.unitPrice, 0); const vat = i.items.reduce((s, it) => s + it.qty * it.unitPrice * it.vat / 100, 0); return Object.assign(Object.assign({}, i), { cliente: ((_a = customers.find(c => c.id === i.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "—", imponibile: sub.toFixed(2), iva: vat.toFixed(2), totale: (sub + vat).toFixed(2) }); }), onEdit: row => setModal({ type: "invoice", data: invoices.find(i => i.id === row.id) }), onDelete: id => delInvoice(id), actions: row => {
const inv = invoices.find(i => i.id === row.id);
const cust = customers.find(c => c.id === (inv === null || inv === void 0 ? void 0 : inv.customerId));
return (React.createElement(React.Fragment, null,
React.createElement("button", { onClick: () => generateInvoicePDF(inv, cust, jobs, assets, parts, company), title: "PDF", style: { background: "#202028", border: "1px solid #2a3040", borderRadius: 5, color: "#94a3b8", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }),
(inv === null || inv === void 0 ? void 0 : inv.status) !== "pagata" && (inv === null || inv === void 0 ? void 0 : inv.status) !== "annullato" && React.createElement("button", { onClick: () => markInvoicePaid(inv), title: "Segna pagata", style: { background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 5, color: "#22c55e", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, "\u2713")));
} })))),
tab === "calendar" && (React.createElement("div", null,
React.createElement("h1", { style: { margin: "0 0 16px", fontSize: 18, fontWeight: 900 } }, "Calendario Manutenzioni"),
upcomingMaintenance.filter(a => a.daysToService < 0).length > 0 && (React.createElement("div", { style: { background: "#ef444415", border: "1px solid #ef444433", borderLeft: "4px solid #ef4444", borderRadius: 8, padding: "10px 16px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" } },
React.createElement("span", { style: { color: "#ef4444", fontWeight: 700, fontSize: 13 } },
"! ",
upcomingMaintenance.filter(a => a.daysToService < 0).length,
" manutenzioni SCADUTE \u2014 intervenire subito"))),
upcomingMaintenance.filter(a => a.daysToService >= 0 && a.daysToService <= 7).length > 0 && (React.createElement("div", { style: { background: "#f9730015", border: "1px solid #f9730033", borderLeft: "4px solid #f97316", borderRadius: 8, padding: "10px 16px", marginBottom: 10 } },
React.createElement("span", { style: { color: "#f97316", fontWeight: 700, fontSize: 13 } },
"\u26A0 ",
upcomingMaintenance.filter(a => a.daysToService >= 0 && a.daysToService <= 7).length,
" manutenzioni entro 7 giorni"))),
React.createElement(ExcelTable, { defaultSort: "daysToService", rowBg: row => row.daysToService < 0 ? "#ef333308" : row.daysToService <= 7 ? "#f9730008" : row.daysToService <= 30 ? "#f59e0b08" : "", cols: [
{ key: "name", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "brand", label: "Marca" },
{ key: "location", label: "Ubicazione", opts: [...new Set(assets.map(a => a.location).filter(Boolean))] },
{ key: "cliente", label: "Cliente", opts: [...new Set(assets.map(a => { var _a; return ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "status", label: "Stato", opts: ["operativo", "in manutenzione", "fuori servizio"], render: v => React.createElement(Badge, { text: v, color: STATUS_COLOR[v] || "#64748b" }) },
{ key: "nextService", label: "Data manut." },
{ key: "daysToService", label: "Scadenza", render: v => React.createElement(AlertChip, { days: v }) },
{ key: "serviceInterval", label: "Intervallo (mesi)" },
], rows: assets.filter(a => a.nextService).map(a => { var _a; return (Object.assign(Object.assign({}, a), { cliente: ((_a = customers.find(c => c.id === a.customerId)) === null || _a === void 0 ? void 0 : _a.name) || "", daysToService: Math.round((new Date(a.nextService) - new Date()) / 86400000) })); }), actions: row => (React.createElement("button", { onClick: () => setModal({ type: "job", data: { assetId: row.id, type: "preventiva", priority: "normale", status: "aperto", description: "Manutenzione programmata", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }), style: { background: "#2DD4BF15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap" } }, "+ Job")) }))),
tab === "finance" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", { style: { fontSize: 18, fontWeight: 900 } }, "Analytics & Report"),
React.createElement("div", { style: { display: "flex", gap: 6 } },
React.createElement("select", { value: filterYear, onChange: e => setFilterYear(e.target.value), style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 7, padding: "6px 11px", color: "#e2e8f0", fontSize: 12 } }, [new Date().getFullYear() - 2, new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map(y => React.createElement("option", { key: y, value: y }, y))),
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
"Preventivi del periodo (",
financials.periodInvoices.length,
")"),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportInvoices }, "\u2B07 CSV")),
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
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, " Verifiche Funzionali"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
"IEC 60601-1/2 \u2014 ",
funcReports.length,
" rapporti \u00B7 ",
Object.keys(FUNC_TEMPLATES).length - 1,
" template disponibili")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "func", data: null, assetId: null }) }, "+ Nuova verifica"))),
funcReports.length === 0 ? (React.createElement(EmptyState, { icon: "\u2713", title: "Nessuna verifica funzionale", subtitle: "Esegui test di funzionalità periodici sui tuoi apparecchi. Template auto-rilevati per: " + Object.values(FUNC_TEMPLATES).map(t => t.label).join(", ") + ".", actions: [
{ label: "+ Nuova verifica funzionale", onClick: () => setModal({ type: "func", data: null, assetId: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredFunc = funcReports.filter(r => {
const q = mobileSearch.func.toLowerCase();
if (q) {
const a = assets.find(x => x.id === r.assetId) || {};
const tpl = FUNC_TEMPLATES[r.templateId] || {};
if (![r.reportNumber, r.date, a.name, a.serial, r.technician, tpl.label].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(r, "func", {
templateId: x => { var _a; return ((_a = FUNC_TEMPLATES[x.templateId]) === null || _a === void 0 ? void 0 : _a.label) || ""; },
verifyType: x => x.verifyType || "",
assetBrand: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.brand) || ""; },
assetModel: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.model) || ""; },
technician: x => x.technician || "",
customer: x => { var _a; return ((_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name) || ""; },
outcome: x => x.verifyStatus === "non_disponibile" ? "non eseguita" : ((x.overallPass === true || x.overallPass === "true") ? "conforme" : "non conforme")
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.func, onChange: v => updMS("func", v), placeholder: "Cerca verifica funzionale\u2026", count: filteredFunc.length, total: funcReports.length }),
React.createElement(FilterDropdown, { filters: {
templateId: { label: "Tipo apparecchio", options: Object.values(FUNC_TEMPLATES).map(t => t.label).sort(), value: activeFilters.func.templateId },
verifyType: { label: "Tipo verifica", options: ["periodica", "dopo riparazione", "prima messa in servizio", "straordinaria"], value: activeFilters.func.verifyType },
assetBrand: { label: "Marca apparecchio", options: [...new Set(funcReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.brand; }).filter(Boolean))].sort(), value: activeFilters.func.assetBrand },
assetModel: { label: "Modello apparecchio", options: [...new Set(funcReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.model; }).filter(Boolean))].sort(), value: activeFilters.func.assetModel },
technician: { label: "Tecnico", options: [...new Set(funcReports.map(r => r.technician).filter(Boolean))].sort(), value: activeFilters.func.technician },
customer: { label: "Cliente", options: [...new Set(funcReports.map(r => { var _a; return (_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.func.customer },
outcome: { label: "Esito", options: ["conforme", "non conforme", "non eseguita"], value: activeFilters.func.outcome },
}, onChange: (k, v) => setFilter("func", k, v), onClearAll: () => clearFilters("func") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredFunc.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessuna verifica corrisponde ai filtri")),
filteredFunc.map(r => {
const a = assets.find(x => x.id === r.assetId) || {};
const c = customers.find(x => x.id === a.customerId) || {};
const tpl = FUNC_TEMPLATES[r.templateId] || { label: "Generico" };
const isNA = r.verifyStatus === "non_disponibile";
const pass = r.overallPass === true || r.overallPass === "true";
const borderC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeLabel = isNA ? "⚠ N/E" : (pass ? "✓ OK" : "✗ FAIL");
return (React.createElement(SwipeableCard, { key: r.id, onDelete: () => delFuncReport(r.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + borderC } },
React.createElement("div", { onClick: () => setModal({ type: "func", data: r }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 14, fontFamily: "monospace", flex: 1, minWidth: 0, wordBreak: "break-word" } }, r.reportNumber || r.id),
React.createElement("span", { style: { padding: "2px 8px", background: badgeC + "22", color: badgeC, borderRadius: 5, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" } }, badgeLabel)),
React.createElement("div", { style: { fontSize: 12, color: "#06b6d4", fontWeight: 700, marginBottom: 3 } }, tpl.label),
React.createElement("div", { style: { fontSize: 12, color: "#94a3b8", marginBottom: 3 } }, a.name || "(apparecchio eliminato)"),
a.brand && React.createElement("div", { style: { fontSize: 11, color: "#64748b" } },
a.brand,
" ",
a.model),
c.name && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", fontSize: 10 } },
React.createElement("span", { style: { padding: "2px 6px", background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 4, color: r.verifyType === "straordinaria" ? "#f59e0b" : "#64748b" } }, r.verifyType || "periodica"),
React.createElement("span", { style: { padding: "2px 6px", color: "#64748b", fontFamily: "monospace" } }, r.date)),
r.technician && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 6 } },
" ",
r.technician)),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "#0D0D12" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateFuncPDF(r, a, c, company); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "func", data: r }); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delFuncReport(r.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { defaultSort: "date", rowBg: row => row.overallPass === false || row.overallPass === "false" ? "#ef333308" : "", cols: [
{ key: "reportNumber", label: "N. Rapporto", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700 } }, v || "—") },
{ key: "date", label: "Data" },
{ key: "tplLabel", label: "Tipo apparecchio", render: v => React.createElement("span", { style: { fontWeight: 700, color: "#e2e8f0" } }, v) },
{ key: "assetName", label: "Apparecchio", render: v => React.createElement("span", { style: { color: "#94a3b8" } }, v) },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "cliente", label: "Cliente", opts: [...new Set(funcReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId); return ((_a = customers.find(c => c.id === (a === null || a === void 0 ? void 0 : a.customerId))) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "verifyType", label: "Tipo", render: v => React.createElement("span", { style: { fontSize: 11, color: v === "straordinaria" ? "#f59e0b" : "#64748b" } }, v || "periodica") },
{ key: "technician", label: "Tecnico" },
{ key: "overallPass", label: "Esito", render: v => React.createElement("span", { style: { fontWeight: 800, color: v === true || v === "true" ? "#22c55e" : "#ef4444" } }, v === true || v === "true" ? "✓ OK" : "✗ NO") },
{ key: "jobId", label: "Job", render: v => v ? React.createElement("span", { style: { fontSize: 11, color: "#5EEAD4", background: "#2DD4BF15", border: "1px solid #2DD4BF33", borderRadius: 5, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" } }, "\u2713 collegato") : React.createElement("span", { style: { color: "#475569" } }, "\u2014") },
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
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "\u26A1 Verifiche di Sicurezza Elettrica"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
"IEC 62353 \u00B7 IEC 61010-1 \u00B7 ",
iecReports.length,
" rapporti")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportIecReports }, "\u2B07 CSV"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "iec", data: null, assetId: null }) }, "+ Nuova verifica"))),
iecReports.length === 0 ? (React.createElement(EmptyState, { icon: "\u26A1", title: "Nessuna verifica di sicurezza elettrica", subtitle: "Esegui verifiche periodiche IEC 62353 (elettromedicali) o IEC 61010-1 (laboratorio): misure di PE, isolamento, dispersioni Equipment Leakage e Applied Part. Metodi supportati: diretto, differenziale, alternativo.", actions: [
{ label: "+ Nuova verifica IEC", onClick: () => setModal({ type: "iec", data: null, assetId: null }), primary: true }
] })) : isMobile ? (React.createElement(React.Fragment, null, (() => {
const filteredIec = iecReports.filter(r => {
const q = mobileSearch.iec.toLowerCase();
if (q) {
const a = assets.find(x => x.id === r.assetId) || {};
if (![r.reportNumber, r.date, a.name, a.serial, r.technician, r.norm].some(f => String(f || "").toLowerCase().includes(q)))
return false;
}
return matchFilters(r, "iec", {
norm: x => x.norm || "", equipClass: x => x.equipClass || "",
patientType: x => x.patientType || "",
leakageMethod: x => x.leakageMethod || "diretto",
verifyType: x => x.verifyType || "",
assetBrand: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.brand) || ""; },
assetModel: x => { var _a; return ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.model) || ""; },
technician: x => x.technician || "",
customer: x => { var _a; return ((_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === x.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name) || ""; },
outcome: x => x.verifyStatus === "non_disponibile" ? "non eseguita" : ((x.overallPass === true || x.overallPass === "true") ? "conforme" : "non conforme")
});
});
return (React.createElement(React.Fragment, null,
React.createElement(MobileSearch, { value: mobileSearch.iec, onChange: v => updMS("iec", v), placeholder: "Cerca rapporto, apparecchio, tecnico\u2026", count: filteredIec.length, total: iecReports.length }),
React.createElement(FilterDropdown, { filters: {
norm: { label: "Norma", options: ["62353", "61010"], value: activeFilters.iec.norm },
equipClass: { label: "Classe elettrica", options: ["I", "II", "III"], value: activeFilters.iec.equipClass },
patientType: { label: "Tipo parte applicata", options: ["B", "BF", "CF"], value: activeFilters.iec.patientType },
leakageMethod: { label: "Metodo misura", options: ["diretto", "differenziale", "alternativo"], value: activeFilters.iec.leakageMethod },
verifyType: { label: "Tipo verifica", options: ["periodica", "dopo riparazione", "prima messa in servizio", "straordinaria"], value: activeFilters.iec.verifyType },
assetBrand: { label: "Marca apparecchio", options: [...new Set(iecReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.brand; }).filter(Boolean))].sort(), value: activeFilters.iec.assetBrand },
assetModel: { label: "Modello apparecchio", options: [...new Set(iecReports.map(r => { var _a; return (_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.model; }).filter(Boolean))].sort(), value: activeFilters.iec.assetModel },
technician: { label: "Tecnico", options: [...new Set(iecReports.map(r => r.technician).filter(Boolean))].sort(), value: activeFilters.iec.technician },
customer: { label: "Cliente", options: [...new Set(iecReports.map(r => { var _a; return (_a = customers.find(c => { var _a; return c.id === ((_a = assets.find(a => a.id === r.assetId)) === null || _a === void 0 ? void 0 : _a.customerId); })) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean))].sort(), value: activeFilters.iec.customer },
outcome: { label: "Esito", options: ["conforme", "non conforme", "non eseguita"], value: activeFilters.iec.outcome },
}, onChange: (k, v) => setFilter("iec", k, v), onClearAll: () => clearFilters("iec") }),
React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
filteredIec.length === 0 && (React.createElement("div", { style: { textAlign: "center", padding: "30px 20px", background: "#141418", borderRadius: 10, border: "1px dashed #2a3040", fontSize: 13, color: "#64748b" } }, "Nessuna verifica corrisponde ai filtri")),
filteredIec.map(r => {
const a = assets.find(x => x.id === r.assetId) || {};
const c = customers.find(x => x.id === a.customerId) || {};
const isNA = r.verifyStatus === "non_disponibile";
const pass = r.overallPass === true || r.overallPass === "true";
const borderC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeC = isNA ? "#f59e0b" : (pass ? "#22c55e" : "#ef4444");
const badgeLabel = isNA ? "⚠ N/E" : (pass ? "✓ OK" : "✗ FAIL");
return (React.createElement(SwipeableCard, { key: r.id, onDelete: () => delIecReport(r.id) },
React.createElement("div", { style: { background: "#141418", border: "1px solid #1e2a3a", borderRadius: 12, overflow: "hidden", borderLeft: "3px solid " + borderC } },
React.createElement("div", { onClick: () => setModal({ type: "iec", data: r }), style: { padding: "12px 14px 10px", cursor: "pointer", touchAction: "manipulation", WebkitTapHighlightColor: "transparent", borderBottom: "1px solid #1e2a3a" } },
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 } },
React.createElement("strong", { style: { color: "#e2e8f0", fontSize: 14, fontFamily: "monospace", flex: 1, minWidth: 0, wordBreak: "break-word" } }, r.reportNumber || r.id),
React.createElement("span", { style: { padding: "2px 8px", background: badgeC + "22", color: badgeC, borderRadius: 5, fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" } }, badgeLabel)),
React.createElement("div", { style: { fontSize: 12, color: "#94a3b8", marginBottom: 3 } }, a.name || "(apparecchio eliminato)"),
a.brand && React.createElement("div", { style: { fontSize: 11, color: "#64748b" } },
a.brand,
" ",
a.model),
c.name && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 3 } },
"\uD83C\uDFE2 ",
c.name),
React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap", fontSize: 10 } },
React.createElement("span", { style: { padding: "2px 6px", background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 4, color: "#94a3b8" } },
"IEC ",
r.norm),
r.equipClass && React.createElement("span", { style: { padding: "2px 6px", background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 4, color: "#94a3b8" } },
"Cl. ",
r.equipClass),
React.createElement("span", { style: { padding: "2px 6px", background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 4, color: r.verifyType === "straordinaria" ? "#f59e0b" : "#64748b" } }, r.verifyType || "periodica"),
React.createElement("span", { style: { padding: "2px 6px", color: "#64748b", fontFamily: "monospace" } }, r.date)),
r.technician && React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginTop: 6 } },
" ",
r.technician)),
React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 36px", gap: 0, background: "#0D0D12" } },
React.createElement("button", { onClick: (e) => { e.stopPropagation(); generateIECPDF(r, a, c, company); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\uD83D\uDCC4 PDF"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); setModal({ type: "iec", data: r }); }, style: { background: "transparent", color: "#94a3b8", border: "none", borderRight: "1px solid #1e2a3a", padding: "10px 4px", fontSize: 11, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u270F Modifica"),
React.createElement("button", { onClick: (e) => { e.stopPropagation(); delIecReport(r.id); }, title: "Elimina", style: { background: "transparent", color: "#ef4444", border: "none", padding: "10px 4px", fontSize: 14, fontWeight: 700, cursor: "pointer", touchAction: "manipulation" } }, "\u2715")))));
}))));
})())) : (React.createElement(ExcelTable, { defaultSort: "date", rowBg: row => row.overallPass === false || row.overallPass === "false" ? "#ef333308" : "", cols: [
{ key: "reportNumber", label: "N. Rapporto", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontWeight: 700 } }, v || "—") },
{ key: "date", label: "Data" },
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "serial", label: "N. Serie", render: v => React.createElement("span", { style: { fontFamily: "monospace", fontSize: 11 } }, v || "—") },
{ key: "cliente", label: "Cliente", opts: [...new Set(iecReports.map(r => { var _a; const a = assets.find(x => x.id === r.assetId); return ((_a = customers.find(c => c.id === (a === null || a === void 0 ? void 0 : a.customerId))) === null || _a === void 0 ? void 0 : _a.name) || ""; }).filter(Boolean))] },
{ key: "norm", label: "Norma", opts: ["62353", "61010"], render: v => React.createElement("span", { style: { fontSize: 11, color: "#64748b" } },
"IEC ",
v) },
{ key: "equipClass", label: "Classe" },
{ key: "verifyType", label: "Tipo", render: v => React.createElement("span", { style: { fontSize: 11, color: v === "straordinaria" ? "#f59e0b" : "#64748b" } }, v || "periodica") },
{ key: "technician", label: "Tecnico" },
{ key: "overallPass", label: "Esito", render: v => React.createElement("span", { style: { fontWeight: 800, color: v === true || v === "true" ? "#22c55e" : "#ef4444" } }, v === true || v === "true" ? "✓ OK" : "✗ NO") },
{ key: "jobId", label: "Job", render: v => v ? React.createElement("span", { style: { fontSize: 11, color: "#5EEAD4", background: "#2DD4BF15", border: "1px solid #2DD4BF33", borderRadius: 5, padding: "2px 8px", fontWeight: 700, whiteSpace: "nowrap" } }, "\u2713 collegato") : React.createElement("span", { style: { color: "#475569" } }, "\u2014") },
], rows: iecReports.map(r => { const a = assets.find(x => x.id === r.assetId) || {}; const c = customers.find(x => x.id === a.customerId) || {}; return Object.assign(Object.assign({}, r), { apparecchio: a.name || r.assetId || "—", serial: a.serial || "", cliente: c.name || "" }); }), onEdit: row => setModal({ type: "iec", data: iecReports.find(r => r.id === row.id), assetId: row.assetId }), onDelete: id => delIecReport(id), actions: row => {
const rep = iecReports.find(r => r.id === row.id);
const a = assets.find(x => x.id === (rep === null || rep === void 0 ? void 0 : rep.assetId)) || {};
const c = customers.find(x => x.id === a.customerId) || {};
return React.createElement("button", { onClick: () => generateIECPDF(rep, a, c, company), title: "PDF", style: { background: "#2DD4BF15", border: "1px solid #2563eb33", borderRadius: 5, color: "#5EEAD4", padding: "3px 8px", cursor: "pointer", fontSize: 11 } }, " PDF");
} })))),
tab === "schedule" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Pianificazione Annuale"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } }, "Attivit\u00E0 programmate per anno \u2014 basato su nextService degli apparecchi")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement("select", { value: scheduleYear, onChange: e => setScheduleYear(+e.target.value), style: { background: "#1E1E28", border: "1px solid #2a3040", borderRadius: 7, padding: "7px 11px", color: "#e2e8f0", fontSize: 13 } }, [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map(y => React.createElement("option", { key: y, value: y }, y))),
React.createElement(Btn, { sm: true, variant: "ghost", onClick: () => {
const rows = scheduleRows;
downloadCSV("pianificazione-" + scheduleYear + ".csv", rows, [{ key: "month", label: "Mese" }, { key: "assetName", label: "Apparecchio" }, { key: "brand", label: "Marca" }, { key: "serial", label: "N.Serie" }, { key: "location", label: "Ubicazione" }, { key: "customer", label: "Cliente" }, { key: "norm", label: "Norma IEC" }, { key: "lastService", label: "Ultima verifica" }, { key: "nextService", label: "Data pianificata" }, { key: "status", label: "Stato apparecchio" }]);
} }, "\u2B07 CSV Pianificazione"))),
scheduleMonths.every(m => m.items.length === 0) ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCC5"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } },
"Nessuna attivit\u00E0 pianificata per ",
scheduleYear),
React.createElement("div", { style: { fontSize: 12, color: "#475569" } }, "Le attivit\u00E0 compaiono automaticamente quando salvi una Verifica di Sicurezza Elettrica o imposti una data \"Prossimo Servizio\" negli apparecchi."))) : scheduleMonths.map(({ month, monthLabel, items }) => items.length === 0 ? null : (React.createElement("div", { key: month, style: { marginBottom: 20 } },
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
tab === "instruments" && (React.createElement(InstrumentsPage, { instruments: instruments, setInstruments: setInstruments, showToast: showToast })),
tab === "procedures" && (React.createElement(ProceduresPage, { procedures: procedures, setProcedures: setProcedures, assets: assets, showToast: showToast })),
tab === "quotes" && (React.createElement(QuotesPage, { quotes: quotes, setQuotes: setQuotes, customers: customers, jobs: jobs, parts: parts, company: company, showToast: showToast })),
tab === "agenda" && (React.createElement(AgendaPage, { assets: assets, jobs: jobs, instruments: instruments, iecReports: iecReports, funcReports: funcReports, customers: customers, setTab: setTab, setModal: setModal, showToast: showToast })),
tab === "piano" && (React.createElement(PianoManuale, { assets: assets, setAssets: setAssets, customers: customers, year: scheduleYear || new Date().getFullYear(), setYear: (y) => { }, showToast: showToast, goTab: setTab })),
tab === "orders" && (React.createElement("div", null,
React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 } },
React.createElement("div", null,
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Ordini Fornitori"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
stats.pendingOrders,
" in corso \u00B7 ",
orders.length,
" totali")),
React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
React.createElement(Btn, { sm: true, variant: "ghost", onClick: exportOrders }, "\u2B07 CSV"),
React.createElement(Btn, { sm: true, onClick: () => setModal({ type: "order", data: null }) }, "+ Nuovo"))),
orders.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\uD83D\uDCCB"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessun ordine"),
React.createElement(Btn, { onClick: () => setModal({ type: "order", data: null }) }, "Nuovo ordine"))) : (React.createElement(ExcelTable, { defaultSort: "orderDate", rowBg: row => row.status === "in attesa" ? "#f59e0b08" : "", cols: [
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
React.createElement("h1", { style: { margin: 0, fontSize: 18, fontWeight: 900, display: isMobile ? "none" : "block" } }, "Scarichi Magazzino"),
React.createElement("p", { style: { color: "#64748b", margin: "2px 0 0", fontSize: 12, fontFamily: "monospace" } },
"\u20AC",
withdrawals.reduce((s, w) => s + w.total, 0).toFixed(2),
" totali")),
parts.length > 0 && assets.length > 0 && React.createElement(Btn, { sm: true, variant: "success", onClick: () => setModal({ type: "withdrawal" }) }, " Nuovo")),
withdrawals.length === 0 ? (React.createElement("div", { style: { textAlign: "center", padding: "40px 18px", background: "#141418", borderRadius: 12, border: "1px dashed #2a3040" } },
React.createElement("div", { style: { fontSize: 40, marginBottom: 10, opacity: .5 } }, "\u2193"),
React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 6 } }, "Nessuno scarico"),
React.createElement("div", { style: { fontSize: 12, color: "#475569" } }, "Le uscite di magazzino verranno registrate qui."))) : (React.createElement(ExcelTable, { defaultSort: "date", cols: [
{ key: "date", label: "Data" },
{ key: "apparecchio", label: "Apparecchio", render: v => React.createElement("strong", { style: { color: "#e2e8f0" } }, v) },
{ key: "tech", label: "Tecnico", render: v => v || "—" },
{ key: "reason", label: "Motivo", render: v => React.createElement("span", { style: { color: "#94a3b8", fontSize: 11 } }, v || "—") },
{ key: "partiDesc", label: "Parti", render: v => React.createElement("span", { style: { color: "#64748b", fontSize: 11 } }, v) },
{ key: "total", label: "Totale", render: v => React.createElement("span", { style: { color: "#22c55e", fontWeight: 800, fontFamily: "monospace" } },
"\u20AC",
parseFloat(v).toFixed(2)) },
], rows: withdrawals.map(w => { var _a; return (Object.assign(Object.assign({}, w), { apparecchio: ((_a = assets.find(a => a.id === w.assetId)) === null || _a === void 0 ? void 0 : _a.name) || w.assetId || "—", partiDesc: w.items.map(r => { const p = parts.find(x => x.id === r.partId); return ((p === null || p === void 0 ? void 0 : p.name) || r.partId) + " x" + r.qty; }).join(", ") })); }) })))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "asset" && React.createElement(Modal, { title: modal.data ? "Modifica Apparecchio" : "Nuovo Apparecchio", onClose: popModal },
React.createElement(AssetForm, { initial: modal.data, customers: customers, onSave: saveAsset, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "part" && React.createElement(Modal, { title: modal.data ? "Modifica Parte" : "Nuova Parte", wide: true, onClose: popModal },
React.createElement(PartForm, { initial: modal.data, assets: assets, onSave: savePart, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "job" && React.createElement(Modal, { title: ((_b = modal.data) === null || _b === void 0 ? void 0 : _b.id) ? "Modifica Job" : "Nuovo Job", wide: true, onClose: popModal },
React.createElement(JobForm, { initial: ((_c = modal.data) === null || _c === void 0 ? void 0 : _c.id) ? modal.data : null, assets: assets, parts: parts, customers: customers, onSave: saveJob, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "order" && React.createElement(Modal, { title: modal.data ? "Modifica Ordine" : "Nuovo Ordine", onClose: popModal },
React.createElement(OrderForm, { initial: modal.data, parts: parts, onSave: saveOrder, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "customer" && React.createElement(Modal, { title: modal.data ? "Modifica Cliente" : "Nuovo Cliente", onClose: popModal },
React.createElement(CustomerForm, { initial: modal.data, onSave: saveCustomer, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "invoice" && React.createElement(Modal, { title: modal.data ? "Modifica Preventivo" : "Nuovo Preventivo", wide: true, onClose: popModal },
React.createElement(InvoiceForm, { initial: modal.data, customers: customers, jobs: jobs, assets: assets, parts: parts, generateNumber: generateInvoiceNumber, onSave: saveInvoice, onClose: popModal })),
(modal === null || modal === void 0 ? void 0 : modal.type) === "withdrawal" && React.createElement(WithdrawalModal, { parts: parts, assets: assets, preselectPartId: modal.partId, onWithdraw: handleWithdraw, onClose: popModal }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "assetDetail" && false /* handled by modal block above */,
(modal === null || modal === void 0 ? void 0 : modal.type) === "timeline" && React.createElement(TimelineModal, { job: modal.data, parts: parts, onSave: (data) => saveTimeline(modal.data.id, data), onClose: popModal }),
(modal === null || modal === void 0 ? void 0 : modal.type) === "settings" && React.createElement(SettingsModal, { data: { assets, parts, jobs, orders, withdrawals, customers, invoices, quotes, instruments, procedures, iecReports, funcReports, company, _meta: { version: "3.4", exportedAt: new Date().toISOString(), app: "MedTrace" } }, company: company, onUpdateCompany: setCompany, onImport: handleImport, onMerge: handleMerge, onReset: handleReset, onCloudPull: handleCloudPull, onClose: popModal }),
csvModal && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000d", zIndex: 1001, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 } },
React.createElement("div", { style: { background: "#18181F", border: "1px solid #2a3040", borderRadius: 14, width: "min(640px,97vw)", maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden" } },
React.createElement("div", { style: { padding: "16px 20px", borderBottom: "1px solid #2a3040", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 } },
React.createElement("div", null,
React.createElement("div", { style: { fontWeight: 800, fontSize: 15, color: "#e2e8f0" } }, csvModal.isJson ? " Backup JSON" : " Esporta CSV"),
React.createElement("div", { style: { fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "monospace" } }, csvModal.filename)),
React.createElement("button", { onClick: () => setCsvModal(null), style: { background: "none", border: "none", color: "#64748b", fontSize: 22, cursor: "pointer", lineHeight: 1 } }, "\u00D7")),
React.createElement("div", { style: { padding: "14px 20px", flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 12 } },
React.createElement("div", { style: { background: "#0D0D12", borderRadius: 8, padding: "10px 14px", border: "1px solid #1e2a3a", fontSize: 11, color: "#64748b", lineHeight: 1.5 } }, csvModal.isJson
? React.createElement(React.Fragment, null,
React.createElement("strong", { style: { color: "#e2e8f0" } },
"Backup completo (",
csvModal.filename,
"):"),
" Clicca \"Copia tutto\", poi apri Blocco Note, incolla e salva come ",
React.createElement("strong", { style: { color: "#22c55e" } }, ".json"),
". Per ripristinare: Impostazioni \u2192 Importa backup.")
: React.createElement(React.Fragment, null,
React.createElement("strong", { style: { color: "#e2e8f0" } }, "Export CSV:"),
" Clicca \"Copia tutto\", poi incolla in Excel/Google Sheets. Oppure apri Blocco Note, incolla e salva come ",
React.createElement("strong", { style: { color: "#22c55e" } }, ".csv"),
".")),
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
}, style: { background: "#22c55e", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Copia tutto"),
React.createElement("button", { onClick: () => setCsvModal(null), style: { background: "#1E1E28", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 } }, "Chiudi"))))),
pdfHtml && (React.createElement("div", { style: { position: "fixed", inset: 0, background: "#000e", zIndex: 1000, display: "flex", flexDirection: "column" } },
React.createElement("div", { style: { background: "#0D0D12", borderBottom: "1px solid #2a3040", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" } },
React.createElement("span", { style: { color: "#e2e8f0", fontWeight: 700, fontSize: 14 } }, " Anteprima documento"),
React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
React.createElement("button", { onClick: () => {
// Print direttamente dall'iframe → dialog stampa nativo → utente sceglie "Salva PDF" come destinazione
const iframe = document.getElementById('pdf-print-iframe');
if (!iframe || !iframe.contentWindow) {
alert('Anteprima non pronta. Riprova fra un secondo.');
return;
}
try {
iframe.contentWindow.focus();
iframe.contentWindow.print();
}
catch (err) {
alert('Stampa non disponibile su questo dispositivo: ' + ((err === null || err === void 0 ? void 0 : err.message) || 'errore sconosciuto'));
}
}, style: { background: "#2DD4BF", color: "#000", border: "none", borderRadius: 7, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, touchAction: "manipulation" } }, "\uD83D\uDDA8 Salva PDF"),
React.createElement("button", { onClick: () => setPdfHtml(null), style: { background: "#1E1E28", color: "#94a3b8", border: "1px solid #2a3040", borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700, touchAction: "manipulation" } }, "\u2715 Chiudi"))),
React.createElement("div", { style: { flex: 1, overflow: "auto", background: "#f0f0f0", display: "flex", justifyContent: "center" } },
React.createElement("iframe", { id: "pdf-print-iframe", srcDoc: pdfHtml, style: { background: "#fff", width: "100%", maxWidth: "210mm", height: "100%", border: "none", boxShadow: "0 4px 24px #0004" }, title: "Anteprima documento" })),
React.createElement("div", { style: { background: "#0D0D12", borderTop: "1px solid #2a3040", padding: "8px 16px", fontSize: 11, color: "#64748b", flexShrink: 0, textAlign: "center" } },
"Clicca \"Salva PDF\" \u2192 nel dialogo di stampa scegli ",
React.createElement("strong", { style: { color: "#94a3b8" } }, "\"Salva come PDF\""),
" come destinazione (su Android: \"Salva come PDF\" / su iOS: \"Salva su File\")"))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "iec" && (React.createElement(Modal, { title: modal.data ? "Modifica Verifica di Sicurezza Elettrica" : "Nuova Verifica di Sicurezza Elettrica", wide: true, onClose: popModal },
React.createElement(IECReportForm, { initial: modal.data || null, assetId: ((_d = modal.data) === null || _d === void 0 ? void 0 : _d.assetId) || modal.assetId || null, assets: assets, customers: customers, existingReports: iecReports, onSave: saveIecReport, onClose: popModal }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "assetDetail" && modal.data && (React.createElement(Modal, { title: modal.data.name || "Apparecchio", wide: true, onClose: popModal },
React.createElement(AssetDetailModal, { asset: modal.data, jobs: jobs, parts: parts, iecReports: iecReports, funcReports: funcReports, customers: customers, company: company, generateIECPDF: generateIECPDF, generateFuncPDF: generateFuncPDF, onClose: popModal, onEditAsset: () => pushModal({ type: "asset", data: modal.data }), onNewJob: () => pushModal({ type: "job", data: { assetId: modal.data.id, type: "correttiva", priority: "normale", status: "aperto", description: "", openDate: new Date().toISOString().slice(0, 10), parts: [], laborHours: 0, laborRate: 55, notes: "", timeline: [], photos: [] } }), onNewIec: () => pushModal({ type: "iec", assetId: modal.data.id, data: null }), onNewFunc: () => pushModal({ type: "func", assetId: modal.data.id, data: null }), onOpenJob: j => pushModal({ type: "job", data: j }) }))),
(modal === null || modal === void 0 ? void 0 : modal.type) === "func" && (React.createElement(Modal, { title: modal.data ? "Modifica Verifica Funzionale" : "Nuova Verifica Funzionale", wide: true, onClose: popModal },
React.createElement(FuncVerifyForm, { initial: modal.data || null, assetId: ((_e = modal.data) === null || _e === void 0 ? void 0 : _e.assetId) || modal.assetId || null, assets: assets, customers: customers, existingReports: funcReports, onSave: saveFuncReport, onClose: popModal }))),
React.createElement(ConfirmDialog, null),
React.createElement(PromptDialog, null))));
}
/* ═══ APP WRAPPER (handles auth) ════════════════════════════════════════════ */
/* ── Custom Confirm Dialog — replaces window.confirm() for Android/iOS PWA ── */
var _confirmCallback = null;
var _setConfirmState = null;
var _setPromptState = null;
function appConfirm(msg, onYes) {
_confirmCallback = onYes;
if (_setConfirmState)
_setConfirmState({ open: true, msg: msg });
}
function appPromptCb(msg, onOk) {
if (_setPromptState)
_setPromptState({ open: true, msg: msg, value: '', cb: onOk });
}
function ConfirmDialog() {
const [state, setState] = React.useState({ open: false, msg: '' });
React.useEffect(() => { _setConfirmState = setState; }, []);
if (!state.open)
return null;
const answer = ok => {
setState({ open: false, msg: '' });
if (ok && _confirmCallback)
_confirmCallback();
_confirmCallback = null;
};
return (React.createElement("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999,
display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }, onClick: () => answer(false) },
React.createElement("div", { style: { background: '#1E1E28', border: '1px solid #2A2A38', borderRadius: 14,
padding: '24px 22px', maxWidth: 340, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,.7)' }, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { fontSize: 14, color: '#E2E8F0', lineHeight: 1.6, marginBottom: 20,
whiteSpace: 'pre-line' } }, state.msg),
React.createElement("div", { style: { display: 'flex', gap: 10, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: () => answer(false), style: { background: '#2A2A38',
border: '1px solid #3A3A4A', borderRadius: 8, color: '#94a3b8', padding: '9px 18px',
cursor: 'pointer', fontSize: 13, fontWeight: 600, touchAction: 'manipulation',
WebkitTapHighlightColor: 'transparent' } }, "Annulla"),
React.createElement("button", { onClick: () => answer(true), style: { background: 'linear-gradient(135deg,#ef4444,#dc2626)',
border: 'none', borderRadius: 8, color: '#fff', padding: '9px 18px', cursor: 'pointer',
fontSize: 13, fontWeight: 700, touchAction: 'manipulation',
WebkitTapHighlightColor: 'transparent' } }, "Conferma")))));
}
function PromptDialog() {
const [state, setState] = React.useState({ open: false, msg: '', value: '', cb: null });
React.useEffect(() => { _setPromptState = setState; }, []);
if (!state.open)
return null;
const answer = ok => {
const val = ok ? state.value : null;
const cb = state.cb;
setState({ open: false, msg: '', value: '', cb: null });
if (cb)
cb(val);
};
return (React.createElement("div", { style: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999,
display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }, onClick: () => answer(false) },
React.createElement("div", { style: { background: '#1E1E28', border: '1px solid #2A2A38', borderRadius: 14,
padding: '24px 22px', maxWidth: 340, width: '100%' }, onClick: e => e.stopPropagation() },
React.createElement("div", { style: { fontSize: 14, color: '#E2E8F0', lineHeight: 1.6, marginBottom: 14,
whiteSpace: 'pre-line' } }, state.msg),
React.createElement("input", { autoFocus: true, value: state.value, onChange: e => setState(s => (Object.assign(Object.assign({}, s), { value: e.target.value }))), onKeyDown: e => { if (e.key === 'Enter')
answer(true); }, style: { width: '100%', background: '#0D0D12', border: '1px solid #2A2A38',
borderRadius: 8, color: '#F0F0F5', padding: '9px 12px', fontSize: 14,
marginBottom: 16, boxSizing: 'border-box' } }),
React.createElement("div", { style: { display: 'flex', gap: 10, justifyContent: 'flex-end' } },
React.createElement("button", { onClick: () => answer(false), style: { background: '#2A2A38',
border: '1px solid #3A3A4A', borderRadius: 8, color: '#94a3b8', padding: '9px 18px',
cursor: 'pointer', fontSize: 13, fontWeight: 600, touchAction: 'manipulation' } }, "Annulla"),
React.createElement("button", { onClick: () => answer(true), style: { background: 'linear-gradient(135deg,#2DD4BF,#0D9488)',
border: 'none', borderRadius: 8, color: '#000', padding: '9px 18px', cursor: 'pointer',
fontSize: 13, fontWeight: 700, touchAction: 'manipulation' } }, "OK")))));
}
function App() {
const [currentUser, setCurrentUser] = React.useState(undefined);
const [authReady, setAuthReady] = React.useState(false);
React.useEffect(() => {
if (!window.supabase) {
setCurrentUser({ id: 'offline-user', email: 'offline@local' });
setAuthReady(true);
return;
}
const supa = getSupa();
if (!supa) {
setCurrentUser({ id: 'offline-user', email: 'offline@local' });
setAuthReady(true);
return;
}
supa.auth.getUser().then(({ data }) => { setCurrentUser(data.user || null); setAuthReady(true); });
const { data: { subscription } } = supa.auth.onAuthStateChange((_, session) => { setCurrentUser((session === null || session === void 0 ? void 0 : session.user) || null); });
return () => subscription.unsubscribe();
}, []);
if (!authReady)
return (React.createElement("div", { style: { minHeight: '100vh', background: '#0D0D12', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
React.createElement("div", { style: { width: 32, height: 32, border: '3px solid #2A2A38', borderTopColor: '#2DD4BF', borderRadius: '50%', animation: 'spin .6s linear infinite' } }),
React.createElement("style", null, "@keyframes spin{to{transform:rotate(360deg)}}")));
if (!currentUser)
return React.createElement(LoginScreen, { onLogin: setCurrentUser });
return React.createElement(AppMain, null);
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
