import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy, where,
} from "firebase/firestore";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  Truck, Package, FileText, LayoutDashboard, DollarSign, Plus,
  Search, X, Check, Minus, MapPin, Clock, CheckCircle,
  Download, Send, FileUp, Layers, Building2, RefreshCw, Trash2,
  Users, Hotel, UtensilsCrossed, Calendar, TrendingUp, Route,
  Zap, Globe, ArrowRight, Star, AlertCircle, ChevronDown,
  ChevronUp, BarChart2, Copy, Eye, Navigation, Printer,
  ChevronRight, Car, Map, PlusCircle, GripVertical,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   FIREBASE
═══════════════════════════════════════════════════════════════════════════ */
const firebaseConfig = {
  apiKey: "AIzaSyB7tuRYUEY471IPJdnOB69DI2yKLCU72T0",
  authDomain: "salesflow-crm-13c4a.firebaseapp.com",
  projectId: "salesflow-crm-13c4a",
  storageBucket: "salesflow-crm-13c4a.firebasestorage.app",
  messagingSenderId: "525995422237",
  appId: "1:525995422237:web:e69d7e7dd76ac9640c8cf4",
};
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const T = {
  bg: "#f2f5fb", surface: "#ffffff", card: "#ffffff",
  sidebar: "#0a1628", sidebarBorder: "#16253d",
  border: "#eaeff8", border2: "#d5def0",
  text: "#0c1829", muted: "#5d7082", mutedLight: "#93a8bc",
  accent: "#f97316", accentDim: "#fff7f0",
  blue: "#2563eb", blueDim: "#eff6ff",
  green: "#059669", greenDim: "#f0fdf4",
  violet: "#7c3aed", violetDim: "#f5f3ff",
  rose: "#e11d48", roseDim: "#fff1f2",
  amber: "#d97706", amberDim: "#fffbeb",
  teal: "#0891b2", tealDim: "#f0fdff",
  mono: "'JetBrains Mono',monospace",
  sans: "'Plus Jakarta Sans',sans-serif",
  display: "'Bricolage Grotesque',sans-serif",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800;12..96,900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f2f5fb;font-family:'Plus Jakarta Sans',sans-serif;color:#0c1829;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#d5def0;border-radius:8px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes popIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
.au{animation:fadeUp .35s cubic-bezier(.22,1,.36,1) both}
.au2{animation:fadeUp .35s .07s cubic-bezier(.22,1,.36,1) both}
.au3{animation:fadeUp .35s .14s cubic-bezier(.22,1,.36,1) both}
.ai{animation:fadeIn .25s ease both}
.si{animation:slideIn .25s ease both}
.pi{animation:popIn .2s cubic-bezier(.34,1.56,.64,1) both}
.spin{animation:spin 1s linear infinite}
.btn{transition:all .13s ease;cursor:pointer}
.btn:hover{filter:brightness(1.05);transform:translateY(-1px)}
.btn:active{transform:translateY(0);filter:brightness(.97)}
.card-h{transition:box-shadow .18s,transform .18s}
.card-h:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(12,24,41,.09)!important}
.fade-row{transition:background .1s}
.fade-row:hover{background:#f8faff!important}
input,textarea,select{font-family:'Plus Jakarta Sans',sans-serif;color:#0c1829}
input:focus,textarea:focus,select:focus{outline:2px solid #f97316;outline-offset:-1px;border-color:#f97316!important}
@media print{.no-print{display:none!important}body{background:white}}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   TARIFARIO 2026 OFICIAL
═══════════════════════════════════════════════════════════════════════════ */
const TARIFA = [
  {c:"Acapulco",km:395,eur:13310,cam:20086,kra:22082,rab:26741,mud:32561},
  {c:"Aguascalientes",km:513,eur:15178,cam:22215,kra:24437,rab:30356,mud:36566},
  {c:"Apizaco",km:145,eur:6899,cam:11540,kra:12858,rab:17399,mud:22103},
  {c:"Campeche",km:1155,eur:29667,cam:40241,kra:44657,rab:50678,mud:61817},
  {c:"Cancún",km:1649,eur:40204,cam:58455,kra:64476,rab:73571,mud:88059},
  {c:"Cd. Juárez",km:1863,eur:47542,cam:60437,kra:67612,rab:83418,mud:92449},
  {c:"Cd. Obregón",km:1671,eur:41119,cam:53952,kra:59347,rab:74511,mud:81912},
  {c:"Cd. Victoria",km:721,eur:20560,cam:28977,kra:31874,rab:37256,mud:43741},
  {c:"Celaya",km:263,eur:8279,cam:12695,kra:13964,rab:18628,mud:24147},
  {c:"Chetumal",km:1345,eur:30356,cam:46225,kra:50847,rab:55884,mud:64852},
  {c:"Chiapas",km:1015,eur:23206,cam:31485,kra:35123,rab:42022,mud:50051},
  {c:"Chihuahua",km:1487,eur:33806,cam:49674,kra:54642,rab:64852,mud:74511},
  {c:"Chilpancingo",km:278,eur:9659,cam:15178,kra:16696,rab:22077,mud:26907},
  {c:"Coatzacoalcos",km:601,eur:17938,cam:24561,kra:27017,rab:29391,mud:35876},
  {c:"Colima",km:744,eur:19732,cam:28839,kra:31723,rab:35876,mud:42775},
  {c:"Cozumel",km:1550,eur:48922,cam:69996,kra:77008,rab:83292,mud:101983},
  {c:"Cuernavaca",km:89,eur:3864,cam:6899,kra:7589,rab:10763,mud:15454},
  {c:"Culiacán",km:1262,eur:29805,cam:46225,kra:50847,rab:55884,mud:64602},
  {c:"Durango",km:915,eur:23043,cam:28977,kra:31874,rab:38636,mud:44845},
  {c:"Ensenada",km:2961,eur:59333,cam:75891,kra:83480,rab:89690,mud:107628},
  {c:"Gómez Palacio",km:985,eur:22767,cam:33116,kra:36428,rab:45535,mud:52434},
  {c:"Guadalajara",km:542,eur:15178,cam:22215,kra:24437,rab:30356,mud:36566},
  {c:"Hermosillo",km:1959,eur:48018,cam:63887,kra:70275,rab:74386,mud:84170},
  {c:"Iguala",km:203,eur:8279,cam:13108,kra:14419,rab:21388,mud:23871},
  {c:"Irapuato",km:323,eur:12419,cam:18628,kra:20491,rab:25527,mud:32313},
  {c:"Jalapa/Xalapa",km:322,eur:12419,cam:18628,kra:20491,rab:25527,mud:29805},
  {c:"La Paz BCS",km:4312,eur:77271,cam:104868,kra:115355,rab:124186,mud:135224},
  {c:"Laredo",km:1117,eur:26493,cam:37394,kra:41133,rab:49536,mud:59935},
  {c:"León",km:387,eur:13798,cam:20823,kra:22893,rab:27722,mud:33756},
  {c:"Los Mochis",km:1442,eur:33806,cam:48984,kra:53883,rab:59333,mud:68302},
  {c:"Matamoros",km:975,eur:23871,cam:34220,kra:37642,rab:46225,mud:53124},
  {c:"Mazatlán",km:1042,eur:26631,cam:37394,kra:41133,rab:50502,mud:60023},
  {c:"Mérida",km:1332,eur:32991,cam:47604,kra:52622,rab:62532,mud:71990},
  {c:"Mexicali",km:2661,eur:56573,cam:73132,kra:80445,rab:91069,mud:106248},
  {c:"Minatitlán",km:579,eur:17938,cam:24561,kra:27017,rab:29391,mud:35876},
  {c:"Monclova",km:1021,eur:26970,cam:38636,kra:42524,rab:50301,mud:58580},
  {c:"Monterrey",km:933,eur:21325,cam:28475,kra:31423,rab:43904,mud:54566},
  {c:"Morelia",km:302,eur:12419,cam:18628,kra:20491,rab:25527,mud:32313},
  {c:"Oaxaca",km:470,eur:12419,cam:18628,kra:20491,rab:25527,mud:32313},
  {c:"Orizaba",km:269,eur:11039,cam:18628,kra:20491,rab:24147,mud:28977},
  {c:"Pachuca",km:95,eur:4390,cam:7777,kra:8655,rab:12293,mud:16934},
  {c:"Piedras Negras",km:1286,eur:34621,cam:51807,kra:58204,rab:69556,mud:80633},
  {c:"Poza Rica",km:273,eur:12419,cam:17938,kra:19732,rab:25527,mud:32313},
  {c:"Puebla",km:123,eur:5080,cam:7727,kra:8718,rab:13610,mud:16809},
  {c:"Puerto Vallarta",km:875,eur:21450,cam:30218,kra:34496,rab:44218,mud:49737},
  {c:"Querétaro",km:211,eur:6899,cam:11917,kra:12143,rab:17800,mud:22767},
  {c:"Reynosa",km:1002,eur:25251,cam:35600,kra:39160,rab:43189,mud:51769},
  {c:"Río Blanco",km:279,eur:11039,cam:18628,kra:20491,rab:24147,mud:28977},
  {c:"Saltillo",km:849,eur:17938,cam:25527,kra:28080,rab:35600,mud:42085},
  {c:"San Juan del Río",km:162,eur:5519,cam:10211,kra:11232,rab:16006,mud:20284},
  {c:"San Luis Potosí",km:415,eur:13108,cam:18628,kra:20491,rab:25113,mud:30231},
  {c:"Tampico",km:486,eur:16558,cam:25251,kra:27776,rab:34220,mud:42085},
  {c:"Tapachula",km:1157,eur:29102,cam:42900,kra:47291,rab:56385,mud:67863},
  {c:"Taxco",km:187,eur:8279,cam:13108,kra:14419,rab:19732,mud:25251},
  {c:"Tepic",km:756,eur:21939,cam:28839,kra:31723,rab:39739,mud:50991},
  {c:"Tijuana",km:2848,eur:63347,cam:81787,kra:90066,rab:104993,mud:120548},
  {c:"Tlaxcala",km:118,eur:5381,cam:9659,kra:10625,rab:12419,mud:16420},
  {c:"Toluca",km:66,eur:3808,cam:6944,kra:7952,rab:11415,mud:16182},
  {c:"Torreón",km:1012,eur:22767,cam:31184,kra:34303,rab:43465,mud:51368},
  {c:"Tuxpan",km:324,eur:13108,cam:20284,kra:22312,rab:25665,mud:34822},
  {c:"Tuxtla Gutiérrez",km:1015,eur:25966,cam:35261,kra:39338,rab:48445,mud:62344},
  {c:"Veracruz",km:402,eur:14676,cam:22705,kra:25025,rab:29478,mud:37331},
  {c:"Villahermosa",km:768,eur:20698,cam:31874,kra:35062,rab:40843,mud:49147},
  {c:"Zacatecas",km:605,eur:19318,cam:26217,kra:28839,rab:36497,mud:45535},
  {c:"Zamora",km:430,eur:13108,cam:18628,kra:20491,rab:24561,mud:33116},
];

// TARIFARIO LOCAL OFICIAL 2026 — verificado con captura de pantalla
const LOCALES = {
  eur:{normal:2500, ayudante:3000, urgente:2500, urgente_ay:3000, resguardo:1800, renta_dia:1600, renta_chofer:3500, renta_mes:36000},
  cam:{normal:3200, ayudante:4300, urgente:3200, urgente_ay:4300, resguardo:3200, renta_dia:2800, renta_chofer:5800, renta_mes:63000},
  kra:{normal:3600, ayudante:5000, urgente:3600, urgente_ay:5000, resguardo:3600},
  rab:{normal:6000, ayudante:8000, urgente:6000, urgente_ay:8000, resguardo:6000},
  mud:{normal:8000, ayudante:10000,urgente:8000, urgente_ay:10000,resguardo:8000},
};

const VEHICULOS = [
  {k:"eur",label:"Eurovan 1T",     cap:"8 m³",  crew:1,icon:"🚐"},
  {k:"cam",label:"Camioneta 3.5T", cap:"16 m³", crew:1,icon:"🚛"},
  {k:"kra",label:"Krafter",        cap:"20 m³", crew:1,icon:"🚐"},
  {k:"rab",label:"Rabón 40 m³",    cap:"40 m³", crew:2,icon:"🚚"},
  {k:"mud",label:"Mudancero 70 m³",cap:"70 m³", crew:3,icon:"🏗️"},
];

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS & UTILS
═══════════════════════════════════════════════════════════════════════════ */
const KM_DIA = 550;
const COMIDA_DEF = 350;
const HOTEL_DEF = 900;
const ENTREGA_ADIC = 1200;
const AYUD_COSTO = 2800;

const fmt = n => `$${Math.round(n).toLocaleString("es-MX")}`;
const fmtK = n => n>=1e6?`$${(n/1e6).toFixed(2)}M`:n>=1e3?`$${(n/1e3).toFixed(1)}k`:`$${Math.round(n)}`;
const today = () => new Date().toLocaleDateString("es-MX",{year:"numeric",month:"long",day:"numeric"});
const uid = () => Math.random().toString(36).slice(2,9);

function calcDias(km){
  if(!km||km===0) return {camino:0,noches:0,total:0};
  const camino = Math.ceil(km/KM_DIA);
  const noches = km>300?camino:0;
  return {camino,noches,total:camino*2};
}

function calcViaticos(km,crew,comida=COMIDA_DEF,hotel=HOTEL_DEF){
  const {total,noches}=calcDias(km);
  const xComida = total>0?comida*crew*total:0;
  const xHotel  = noches>0?hotel*crew*noches:0;
  return {xComida,xHotel,total:xComida+xHotel,dias:total,noches};
}

function calcFlota(totalPDV,maxDia,plazo){
  const camionetas = Math.max(1,Math.ceil(totalPDV/(maxDia*plazo)));
  const dias = Math.ceil(totalPDV/(maxDia*camionetas));
  const capDia = maxDia*camionetas;
  return {camionetas,dias,capDia};
}

function buildMapsURL(stops){
  // stops = [{city:"Ciudad de México"}, {city:"Monterrey"}, ...]
  if(!stops||stops.length<2) return null;
  const parts = stops.map(s=>encodeURIComponent(s+(", México")));
  const origin = parts[0];
  const dest = parts[parts.length-1];
  const wps = parts.slice(1,-1);
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}`;
  if(wps.length>0) url += `&waypoints=${wps.join("|")}`;
  url += "&travelmode=driving";
  return url;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PDF GENERATOR
═══════════════════════════════════════════════════════════════════════════ */
function generateQuotePDF(q){
  const lineHTML = (label,value,bold=false,color="#0d1b2e")=>`
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eef2f8;font-size:13px;color:#5e7291;font-weight:${bold?"700":"400"}">${label}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eef2f8;text-align:right;font-size:${bold?"16":"13"}px;font-weight:700;color:${color};font-family:'JetBrains Mono',monospace">${value}</td>
    </tr>`;

  const html = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"/>
<title>Cotización DMvimiento - ${q.folio||"N/A"}</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#fff;color:#0d1b2e;padding:40px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #f97316}
  .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:28px;font-weight:800;color:#0d1b2e}
  .logo span{color:#f97316}
  .folio{font-family:'JetBrains Mono',monospace;font-size:11px;color:#5e7291;background:#f0f3fa;padding:6px 14px;border-radius:20px;margin-top:8px}
  .meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:32px}
  .meta-box label{font-size:10px;font-weight:700;color:#5e7291;text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:5px}
  .meta-box .val{font-size:15px;font-weight:700;color:#0d1b2e}
  .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#5e7291;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e2e8f4}
  table{width:100%;border-collapse:collapse;margin-bottom:28px}
  .total-row{background:#fff4ec;padding:16px;border-radius:12px;display:flex;justify-content:space-between;align-items:center;margin-top:16px}
  .total-row .label{font-size:14px;font-weight:600;color:#5e7291}
  .total-row .amount{font-size:28px;font-weight:800;color:#f97316;font-family:'JetBrains Mono',monospace}
  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f4;display:flex;justify-content:space-between;font-size:11px;color:#94a8bc}
  .badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid currentColor}
  .notes-box{background:#f8fafd;border:1px solid #e2e8f4;border-radius:10px;padding:14px;margin-bottom:28px;font-size:13px;color:#5e7291;line-height:1.6}
  .route-stop{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}
  .stop-dot{width:8px;height:8px;border-radius:50%;background:#f97316;flex-shrink:0}
  @media print{body{padding:20px}}
</style>
</head><body>
<div class="header">
  <div>
    <div class="logo">DM<span>vimiento</span></div>
    <div style="font-size:12px;color:#5e7291;margin-top:4px">Logística Especializada · México 2026</div>
    <div class="folio" style="display:inline-block;margin-top:8px">FOLIO: ${q.folio||uid().toUpperCase()}</div>
  </div>
  <div style="text-align:right">
    <div style="font-size:11px;color:#5e7291">Fecha de emisión</div>
    <div style="font-size:14px;font-weight:700;margin-top:4px">${today()}</div>
    <div style="margin-top:8px">
      <span class="badge" style="color:${q.modo==="local"?T.green:q.modo==="ruta"?T.violet:T.accent}">
        ${q.modo==="local"?"SERVICIO LOCAL":q.modo==="foraneo"?"FORÁNEO":q.modo==="masivo"?"DISTRIBUCIÓN MASIVA":"RUTA MULTI-DESTINO"}
      </span>
    </div>
  </div>
</div>

<div class="meta-grid">
  <div class="meta-box"><label>Cliente</label><div class="val">${q.cliente||"—"}</div></div>
  <div class="meta-box"><label>Contacto</label><div class="val">${q.contacto||"—"}</div></div>
  <div class="meta-box"><label>Destino principal</label><div class="val">${q.destino||"Ciudad de México"}</div></div>
  <div class="meta-box"><label>Vehículo</label><div class="val">${q.vehiculoLabel||"—"}</div></div>
</div>

${q.stops&&q.stops.length>0?`
<div class="section-title">Paradas de ruta</div>
${q.stops.map((s,i)=>`<div class="route-stop"><div class="stop-dot"></div><div><strong>${s.city}</strong>${s.pdv?` — ${s.pdv} PDVs`:""}</div></div>`).join("")}
<div style="margin-bottom:24px"></div>
`:""}

<div class="section-title">Desglose de costos</div>
<table>
<tbody>
${q.lines?q.lines.map(l=>lineHTML(l.label,l.value,l.bold||false,l.color||"#0d1b2e")).join(""):""}
</tbody>
</table>

<div class="total-row">
  <div class="label">TOTAL CON IVA</div>
  <div class="amount">${fmt(q.total||0)}</div>
</div>

${q.flota?`
<div style="margin-top:28px">
<div class="section-title">Plan de flota</div>
<table><tbody>
${lineHTML("Camionetas necesarias",q.flota.camionetas+" unidades")}
${lineHTML("Días de operación",q.flota.dias+" días")}
${lineHTML("Capacidad diaria",q.flota.capDia.toLocaleString()+" entregas/día")}
${lineHTML("PDV totales",(q.totalPDV||0).toLocaleString())}
${lineHTML("Plazo máximo",q.plazo+" días")}
</tbody></table></div>`:""}

${q.notas?`<div class="section-title">Notas y condiciones</div><div class="notes-box">${q.notas}</div>`:""}

<div class="notes-box">
<strong>Condiciones generales:</strong> Esta propuesta es válida por 15 días naturales. Los precios no incluyen IVA (16%) ya incluido en el total mostrado. El servicio incluye combustible, casetas y seguro básico de mercancía. Viáticos calculados sobre tarifas estándar ajustables. Sujeto a disponibilidad de unidades.
</div>

<div class="footer">
  <div>DMvimiento Logística Especializada · logistics@dmvimiento.com · +52 (55) XXXX-XXXX</div>
  <div>Generado el ${new Date().toLocaleString("es-MX")}</div>
</div>
</body></html>`;

  const w = window.open("","_blank","width=900,height=700");
  if(w){
    w.document.write(html);
    w.document.close();
    setTimeout(()=>w.print(),600);
  }
}


/* ═══════════════════════════════════════════════════════════════════════════
   UI ATOMS
═══════════════════════════════════════════════════════════════════════════ */
function Tag({color=T.accent,bg,children,sm}){
  return <span style={{background:bg||`${color}18`,color,border:`1px solid ${color}28`,borderRadius:20,padding:sm?"2px 8px":"3px 12px",fontSize:sm?10:11,fontWeight:700,letterSpacing:"0.04em",whiteSpace:"nowrap",fontFamily:T.sans}}>{children}</span>;
}

function Chip({color=T.accent,icon:Icon,children,onClick}){
  return(
    <button onClick={onClick} className="btn" style={{display:"flex",alignItems:"center",gap:5,background:`${color}14`,color,border:`1px solid ${color}24`,borderRadius:8,padding:"5px 11px",fontSize:12,fontWeight:600,fontFamily:T.sans,cursor:onClick?"pointer":"default"}}>
      {Icon&&<Icon size={11}/>}{children}
    </button>
  );
}

function KpiCard({icon:Icon,color,label,value,sub,trend,onClick}){
  return(
    <div onClick={onClick} className="card-h au" style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:18,padding:"22px 24px",cursor:onClick?"pointer":"default"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div style={{width:40,height:40,borderRadius:12,background:`${color}14`,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon size={18} color={color}/>
        </div>
        {trend!=null&&<div style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,color:trend>=0?T.green:T.rose}}>
          {trend>=0?<ChevronUp size={12}/>:<ChevronDown size={12}/>}{Math.abs(trend)}%
        </div>}
      </div>
      <div style={{fontFamily:T.mono,fontSize:26,fontWeight:700,color:T.text,lineHeight:1,marginBottom:5}}>{value}</div>
      <div style={{fontSize:12,fontWeight:600,color:T.muted,letterSpacing:"0.04em"}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:T.mutedLight,marginTop:3}}>{sub}</div>}
    </div>
  );
}

function Loader({text="Cargando..."}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14,height:200}}>
      <div style={{width:32,height:32,border:`3px solid ${T.border2}`,borderTop:`3px solid ${T.accent}`,borderRadius:"50%"}} className="spin"/>
      <span style={{fontFamily:T.sans,fontSize:13,color:T.muted}}>{text}</span>
    </div>
  );
}

function Toast({msg,type="ok",onClose}){
  useEffect(()=>{const t=setTimeout(()=>onClose&&onClose(),3500);return()=>clearTimeout(t);},[]);
  const c=type==="err"?T.rose:T.green;
  return(
    <div className="pi" style={{position:"fixed",top:20,right:24,zIndex:9999,background:"#ffffff",border:`1px solid ${c}40`,borderRadius:14,padding:"12px 20px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 40px rgba(0,0,0,.14)",fontFamily:T.sans,fontSize:13,color:T.text,minWidth:280,maxWidth:400}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:c,flexShrink:0,boxShadow:`0 0 8px ${c}`}}/>
      <span style={{flex:1}}>{msg}</span>
      <button onClick={onClose} style={{border:"none",background:"transparent",color:T.muted,cursor:"pointer",padding:0}}><X size={14}/></button>
    </div>
  );
}

function Modal({title,onClose,children,wide,icon:Icon,iconColor=T.accent}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(13,27,46,.45)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="pi" style={{background:T.card,borderRadius:22,width:"100%",maxWidth:wide?740:480,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 32px 100px rgba(0,0,0,.22)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"22px 26px",borderBottom:`1px solid ${T.border}`,position:"sticky",top:0,background:T.card,zIndex:10,borderRadius:"22px 22px 0 0"}}>
          {Icon&&<div style={{width:34,height:34,borderRadius:10,background:`${iconColor}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={16} color={iconColor}/></div>}
          <span style={{fontFamily:T.display,fontWeight:700,fontSize:17,color:T.text,flex:1}}>{title}</span>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",border:`1px solid ${T.border2}`,background:"transparent",cursor:"pointer",color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14}/></button>
        </div>
        <div style={{padding:"24px 26px"}}>{children}</div>
      </div>
    </div>
  );
}

function Input({label,hint,...props}){
  const [focused,setFocused]=useState(false);
  return(
    <div>
      {label&&<label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,marginBottom:5,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>}
      <input {...props}
        onFocus={e=>{setFocused(true);props.onFocus&&props.onFocus(e);}}
        onBlur={e=>{setFocused(false);props.onBlur&&props.onBlur(e);}}
        style={{width:"100%",background:"#ffffff",border:`1.5px solid ${focused?T.accent:T.border2}`,borderRadius:10,padding:"10px 14px",color:T.text,fontFamily:T.sans,fontSize:14,outline:"none",transition:"border-color .15s",boxShadow:focused?`0 0 0 3px ${T.accent}14`:"none",...props.style}}/>
      {hint&&<div style={{fontSize:11,color:T.mutedLight,marginTop:4}}>{hint}</div>}
    </div>
  );
}

function Textarea({label,...props}){
  return(
    <div>
      {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</label>}
      <textarea {...props} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:10,padding:"10px 14px",color:T.text,fontFamily:T.sans,fontSize:14,outline:"none",resize:"vertical",minHeight:80,...props.style}}/>
    </div>
  );
}

function Select({label,options,value,onChange,style}){
  return(
    <div style={style}>
      {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</label>}
      <select value={value} onChange={onChange} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:10,padding:"10px 14px",color:T.text,fontFamily:T.sans,fontSize:14,outline:"none",cursor:"pointer"}}>
        {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
      </select>
    </div>
  );
}

function Stepper({label,value,onChange,min=0,max=9999,step=1}){
  return(
    <div>
      {label&&<div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</div>}
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <button onClick={()=>onChange(Math.max(min,value-step))} className="btn" style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${T.border2}`,background:"transparent",color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}><Minus size={13}/></button>
        <input type="number" value={value} onChange={e=>onChange(Math.min(max,Math.max(min,Number(e.target.value)||min)))}
          style={{width:72,textAlign:"center",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:8,padding:"6px 4px",color:T.text,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
        <button onClick={()=>onChange(Math.min(max,value+step))} className="btn" style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${T.border2}`,background:"transparent",color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={13}/></button>
      </div>
    </div>
  );
}

function Toggle({checked,onChange,label,sub,accent=T.accent}){
  return(
    <button onClick={()=>onChange(!checked)} className="btn" style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,border:`1.5px solid ${checked?accent:T.border2}`,background:checked?`${accent}08`:"#ffffff",cursor:"pointer",width:"100%",textAlign:"left",transition:"all .15s",boxShadow:checked?`0 0 0 3px ${accent}12`:"none"}}>
      <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,border:`2px solid ${checked?accent:T.border2}`,background:checked?accent:"#fff",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s",boxShadow:checked?`0 2px 8px ${accent}40`:"none"}}>
        {checked&&<Check size={11} color="#fff"/>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text}}>{label}</div>
        {sub&&<div style={{fontFamily:T.sans,fontSize:11,color:T.muted,marginTop:1}}>{sub}</div>}
      </div>
    </button>
  );
}

function InfoBox({icon:Icon,color,title,value,sub,xs}){
  return(
    <div style={{background:`${color}0c`,border:`1px solid ${color}22`,borderRadius:12,padding:xs?"10px 12px":"14px 16px",display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:xs?30:36,height:xs?30:36,borderRadius:xs?8:10,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={xs?13:16} color={color}/></div>
      <div>
        <div style={{fontFamily:T.sans,fontSize:10,color:T.muted,fontWeight:600,letterSpacing:"0.04em"}}>{title}</div>
        <div style={{fontFamily:T.mono,fontWeight:700,fontSize:xs?14:17,color,lineHeight:1.1}}>{value}</div>
        {sub&&<div style={{fontFamily:T.sans,fontSize:10,color:T.muted,marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );
}

function CitySearch({placeholder,value,onChange,onSelect,vehiculo,exclude=[]}){
  const [open,setOpen]=useState(false);
  const filt=TARIFA.filter(t=>t.c.toLowerCase().includes(value.toLowerCase())&&!exclude.includes(t.c));
  return(
    <div style={{position:"relative"}}>
      <div style={{position:"relative"}}>
        <Search size={13} color={T.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
        <input value={value} onChange={e=>{onChange(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)}
          placeholder={placeholder||"Buscar ciudad..."}
          style={{width:"100%",paddingLeft:34,paddingRight:14,paddingTop:10,paddingBottom:10,background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:10,color:T.text,fontFamily:T.sans,fontSize:14,outline:"none"}}/>
      </div>
      {open&&value&&filt.length>0&&(
        <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:14,zIndex:200,maxHeight:260,overflowY:"auto",boxShadow:"0 16px 60px rgba(0,0,0,.15)"}}>
          {filt.slice(0,12).map(t=>(
            <button key={t.c} onClick={()=>{onSelect(t);setOpen(false);onChange("");}}
              className="btn fade-row" style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 16px",border:"none",borderBottom:`1px solid ${T.border}`,background:"transparent",cursor:"pointer"}}>
              <MapPin size={12} color={T.accent}/>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontFamily:T.sans,fontWeight:600,fontSize:13,color:T.text}}>{t.c}</div>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.muted}}>{t.km.toLocaleString()} km de CDMX · {Math.ceil(t.km/KM_DIA)} día{Math.ceil(t.km/KM_DIA)>1?"s":""}</div>
              </div>
              {vehiculo&&<span style={{fontFamily:T.mono,fontSize:12,color:T.accent,fontWeight:700}}>{fmt(t[vehiculo])}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════════════════ */
const NAV=[
  {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
  {id:"cotizador",label:"Cotizador Pro",icon:DollarSign,badge:"★"},
  {id:"rutas",label:"Planificador Rutas",icon:Route,badge:"NEW"},
  {id:"facturas",label:"Facturación",icon:FileText},
  {id:"cuentas",label:"Clientes",icon:Building2},
  {id:"entregas",label:"Entregas",icon:Package},
];

function Sidebar({view,setView,stats}){
  return(
    <aside className="no-print" style={{width:220,background:T.sidebar,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0}}>
      <div style={{padding:"22px 18px",borderBottom:`1px solid ${T.sidebarBorder}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,background:`linear-gradient(135deg,${T.accent},#fb923c)`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 20px ${T.accent}50`,flexShrink:0}}>
            <Truck size={18} color="#fff"/>
          </div>
          <div>
            <div style={{fontFamily:T.display,fontWeight:800,fontSize:17,color:"#fff",letterSpacing:"-0.02em"}}>DMvimiento</div>
            <div style={{fontFamily:T.sans,fontSize:10,color:"#4d6280",letterSpacing:"0.07em",textTransform:"uppercase"}}>Logistics OS</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
        {NAV.map(({id,label,icon:Icon,badge})=>{
          const a=view===id;
          return(
            <button key={id} onClick={()=>setView(id)} className="btn" style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:2,cursor:"pointer",border:"none",transition:"all .15s",background:a?`${T.accent}22`:"transparent"}}>
              <Icon size={15} color={a?T.accent:"#4d6280"}/>
              <span style={{fontFamily:T.sans,fontSize:13,fontWeight:a?700:500,color:a?"#fff":"#4d6280",flex:1,textAlign:"left"}}>{label}</span>
              {badge&&<span style={{fontSize:9,fontWeight:800,background:badge==="NEW"?T.blue:`${T.accent}30`,color:badge==="NEW"?"#fff":T.accent,borderRadius:6,padding:"2px 6px",letterSpacing:"0.04em"}}>{badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"14px 16px",borderTop:`1px solid ${T.sidebarBorder}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}`}}/>
          <span style={{fontFamily:T.mono,fontSize:9,color:"#4d6280",letterSpacing:"0.06em",textTransform:"uppercase"}}>Firebase · En vivo</span>
        </div>
        <div style={{fontFamily:T.mono,fontSize:10,color:"#4d6280",lineHeight:1.7}}>
          {stats.cotizaciones} cotizaciones<br/>
          {stats.facturas} facturas · {stats.rutas} rutas
        </div>
      </div>
    </aside>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
function Dashboard({setView,cotizaciones,facturas,rutas,entregas}){
  const totalFacturado=facturas.reduce((a,f)=>a+(f.total||0),0);
  const pendiente=facturas.filter(f=>f.status==="Pendiente").reduce((a,f)=>a+(f.total||0),0);
  const cobrado=facturas.filter(f=>f.status==="Pagada").reduce((a,f)=>a+(f.total||0),0);

  const meses=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const chartData=meses.slice(0,new Date().getMonth()+1).map((m,i)=>({
    mes:m,
    facturado:facturas.filter(f=>{const d=f.createdAt?.seconds;return d&&new Date(d*1000).getMonth()===i;}).reduce((a,f)=>a+(f.total||0),0),
    cotizaciones:cotizaciones.filter(c=>{const d=c.createdAt?.seconds;return d&&new Date(d*1000).getMonth()===i;}).length*8000,
  }));

  const recent=[...cotizaciones].sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,6);
  const modeColor={local:T.green,foraneo:T.accent,masivo:T.blue,ruta:T.violet};
  const modeLabel={local:"Local",foraneo:"Foráneo",masivo:"Masivo",ruta:"Ruta"};

  return(
    <div style={{flex:1,overflowY:"auto",padding:"32px 36px"}}>
      <div className="au" style={{marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:32,color:T.text,letterSpacing:"-0.03em"}}>Operations Center</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:5}}>{new Date().toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <button onClick={()=>setView("cotizador")} className="btn" style={{display:"flex",alignItems:"center",gap:9,background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",borderRadius:14,padding:"12px 22px",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,boxShadow:`0 6px 24px ${T.accent}40`}}>
          <DollarSign size={16}/>Nueva Cotización
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <KpiCard icon={DollarSign} color={T.accent} label="Cotizaciones" value={cotizaciones.length} sub="en sistema" onClick={()=>setView("cotizador")}/>
        <KpiCard icon={TrendingUp} color={T.green} label="Facturado" value={fmtK(totalFacturado)} sub="total emitido" onClick={()=>setView("facturas")}/>
        <KpiCard icon={Clock} color={T.amber} label="Por cobrar" value={fmtK(pendiente)} sub="pendiente" onClick={()=>setView("facturas")}/>
        <KpiCard icon={Route} color={T.violet} label="Rutas activas" value={rutas.filter(r=>r.status==="En curso").length} sub={`${rutas.length} totales`} onClick={()=>setView("rutas")}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16,marginBottom:16}}>
        <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:18,overflow:"hidden"}}>
          <div style={{padding:"18px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:T.display,fontWeight:700,fontSize:15,color:T.text}}>Facturación {new Date().getFullYear()}</span>
            <Tag color={T.green}>{fmtK(cobrado)} cobrado</Tag>
          </div>
          <div style={{padding:"16px 8px 8px"}}>
            {chartData.length>0?(
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData} margin={{top:4,right:16,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.accent} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={T.accent} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.blue} stopOpacity={0.18}/>
                      <stop offset="95%" stopColor={T.blue} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="mes" tick={{fontSize:11,fontFamily:T.sans,fill:T.muted}} axisLine={false} tickLine={false}/>
                  <YAxis hide/>
                  <Tooltip formatter={(v,n)=>[fmtK(v),n==="facturado"?"Facturado":"Cotizaciones"]} contentStyle={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:10,fontFamily:T.sans,fontSize:12}}/>
                  <Area type="monotone" dataKey="facturado" stroke={T.accent} strokeWidth={2} fill="url(#gA)"/>
                  <Area type="monotone" dataKey="cotizaciones" stroke={T.blue} strokeWidth={2} fill="url(#gB)"/>
                </AreaChart>
              </ResponsiveContainer>
            ):<div style={{height:160,display:"flex",alignItems:"center",justifyContent:"center",color:T.muted,fontSize:13}}>Sin datos aún</div>}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {label:"Cotizador Pro",sub:"Local · Foráneo · Masivo · Rutas",icon:DollarSign,color:T.accent,v:"cotizador"},
            {label:"Planificador Rutas",sub:"Multi-parada + Google Maps",icon:Route,color:T.violet,v:"rutas"},
            {label:"Facturación",sub:"PDFs · Mensual · Clientes",icon:FileText,color:T.blue,v:"facturas"},
            {label:"Tracking Entregas",sub:"Seguimiento en tiempo real",icon:Package,color:T.green,v:"entregas"},
          ].map(({label,sub,icon:Icon,color,v})=>(
            <button key={v} onClick={()=>setView(v)} className="btn card-h" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:13,border:`1px solid ${T.border}`,background:T.card,cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${color}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={15} color={color}/></div>
              <div style={{flex:1}}><div style={{fontFamily:T.sans,fontSize:13,fontWeight:700,color:T.text}}>{label}</div><div style={{fontFamily:T.sans,fontSize:11,color:T.muted}}>{sub}</div></div>
              <ChevronRight size={13} color={T.muted}/>
            </button>
          ))}
        </div>
      </div>

      <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:18,overflow:"hidden"}}>
        <div style={{padding:"18px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:T.display,fontWeight:700,fontSize:15,color:T.text}}>Últimas cotizaciones</span>
          <button onClick={()=>setView("cotizador")} className="btn" style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:T.sans,fontWeight:700}}>Nueva <Plus size={13}/></button>
        </div>
        {recent.length===0
          ?<div style={{padding:48,textAlign:"center",color:T.muted,fontFamily:T.sans,fontSize:13}}>Sin cotizaciones. <button onClick={()=>setView("cotizador")} style={{color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Crear →</button></div>
          :<table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["Folio","Cliente","Modo","Destino","Total","Fecha",""].map(h=><th key={h} style={{padding:"10px 18px",textAlign:"left",fontFamily:T.sans,fontSize:11,color:T.muted,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {recent.map((q,i)=>(
                <tr key={q.id||i} className="fade-row" style={{borderBottom:`1px solid ${T.border}`}}>
                  <td style={{padding:"12px 18px",fontFamily:T.mono,fontSize:11,color:T.muted}}>{q.folio||"—"}</td>
                  <td style={{padding:"12px 18px",fontFamily:T.sans,fontSize:13,fontWeight:700,color:T.text}}>{q.cliente||"—"}</td>
                  <td style={{padding:"12px 18px"}}><Tag color={modeColor[q.modo]||T.accent}>{modeLabel[q.modo]||q.modo}</Tag></td>
                  <td style={{padding:"12px 18px",fontFamily:T.sans,fontSize:12,color:T.muted}}>{q.destino||"—"}</td>
                  <td style={{padding:"12px 18px",fontFamily:T.mono,fontSize:13,fontWeight:700,color:T.text}}>{fmt(q.total||0)}</td>
                  <td style={{padding:"12px 18px",fontFamily:T.mono,fontSize:11,color:T.muted}}>{q.createdAt?.seconds?new Date(q.createdAt.seconds*1000).toLocaleDateString("es-MX"):"—"}</td>
                  <td style={{padding:"12px 18px"}}><button onClick={()=>generateQuotePDF(q)} className="btn" style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted}}><Printer size={13}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COTIZADOR PRO — EL MEJOR DE LA INDUSTRIA
═══════════════════════════════════════════════════════════════════════════ */
function Cotizador({onSaved}){
  const [modo,setModo]=useState("foraneo");
  const [step,setStep]=useState("form"); // form | preview
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const showToast=(msg,type="ok")=>{setToast({msg,type});};

  // ── DATOS GENERALES ──
  const [cliente,setCliente]=useState("");
  const [contacto,setContacto]=useState("");
  const [email,setEmail]=useState("");
  const [notas,setNotas]=useState("");
  const [plazo,setPlazo]=useState(3);

  // ── FORÁNEO ──
  const [forSearch,setForSearch]=useState("");
  const [forDest,setForDest]=useState(null);
  const [forVeh,setForVeh]=useState("cam");
  const [forUrgente,setForUrgente]=useState(false);
  const [forManiobra,setForManiobra]=useState(false);
  const [forNumAyud,setForNumAyud]=useState(1);
  const [forParadas,setForParadas]=useState(0);
  const [forResguardo,setForResguardo]=useState(false);
  const [forPersonasExtra,setForPersonasExtra]=useState(0);
  const [forComida,setForComida]=useState(COMIDA_DEF);
  const [forHotel,setForHotel]=useState(HOTEL_DEF);

  // ── LOCAL ──
  const [locVeh,setLocVeh]=useState("cam");
  const [locAyud,setLocAyud]=useState(false);
  const [locUrgente,setLocUrgente]=useState(false);
  const [locParadas,setLocParadas]=useState(0);
  const [locResguardo,setLocResguardo]=useState(false);

  // ── MASIVO ──
  const [masSearch,setMasSearch]=useState("");
  const [masDest,setMasDest]=useState(null);
  const [masLocal,setMasLocal]=useState(true);
  const [masVeh,setMasVeh]=useState("cam");
  const [masPDV,setMasPDV]=useState(500);
  const [masMaxDia,setMasMaxDia]=useState(20);
  const [masPersonasVan,setMasPersonasVan]=useState(1);
  const [masAyudante,setMasAyudante]=useState(false);
  const [masUrgente,setMasUrgente]=useState(false);
  const [masComida,setMasComida]=useState(COMIDA_DEF);
  const [masHotel,setMasHotel]=useState(HOTEL_DEF);
  const fileRef=useRef();

  /* ── CÁLCULOS FORÁNEO ── */
  const forVD=VEHICULOS.find(v=>v.k===forVeh);
  const forCrew=(forVD?.crew||1)+forPersonasExtra;
  const forBase=forDest?forDest[forVeh]:0;
  const {xComida:forXComida,xHotel:forXHotel,total:forXViatic,dias:forDias,noches:forNoches}=useMemo(()=>forDest?calcViaticos(forDest.km,forCrew,forComida,forHotel):{xComida:0,xHotel:0,total:0,dias:0,noches:0},[forDest,forCrew,forComida,forHotel]);
  const forXUrg=forUrgente?forBase*0.35:0;
  const forXMan=forManiobra?AYUD_COSTO*forNumAyud:0;
  const forXPar=forParadas*ENTREGA_ADIC;
  const forXRes=forResguardo?LOCALES[forVeh]?.resguardo||0:0;
  const forSub=forBase+forXUrg+forXMan+forXPar+forXRes+forXViatic;
  const forIva=forSub*.16;
  const forTotal=forSub+forIva;

  /* ── CÁLCULOS LOCAL ── */
  const locD=LOCALES[locVeh];
  let locBase=locD?.normal||0;
  if(locUrgente&&locAyud) locBase=locD?.urgente_ay||locD?.ayudante||0;
  else if(locAyud)        locBase=locD?.ayudante||0;
  else if(locUrgente)     locBase=locD?.urgente||0;
  const locXPar=locParadas*ENTREGA_ADIC;
  const locXRes=locResguardo?locD?.resguardo||0:0;
  const locSub=locBase+locXPar+locXRes;
  const locIva=locSub*.16;
  const locTotal=locSub+locIva;

  /* ── CÁLCULOS MASIVO ── */
  const {camionetas,dias:masDias,capDia}=useMemo(()=>calcFlota(masPDV,masMaxDia,plazo),[masPDV,masMaxDia,plazo]);
  const masTotalPersonas=camionetas*(masPersonasVan+(masAyudante?1:0));
  const masKm=!masLocal&&masDest?masDest.km:0;
  const {xComida:masXComida,xHotel:masXHotel,total:masXViatic,noches:masNoches}=useMemo(()=>calcViaticos(masKm,masTotalPersonas,masComida,masHotel),[masKm,masTotalPersonas,masComida,masHotel]);
  const masBase=(!masLocal&&masDest)?masDest[masVeh]*camionetas:0;
  const masXUrg=masUrgente?masBase*.35:0;
  const masSub=masBase+masXUrg+masXViatic;
  const masIva=masSub*.16;
  const masTotal=masSub+masIva;

  const total=modo==="foraneo"?forTotal:modo==="local"?locTotal:masTotal;
  const canQ=modo==="foraneo"?!!forDest:modo==="local"?true:masPDV>0;

  /* ── BUILD QUOTE OBJECT ── */
  const buildQuote=()=>{
    const folio="COT-"+Date.now().toString(36).slice(-6).toUpperCase();
    const base={cliente,contacto,email,notas,modo,folio,total,plazo};
    if(modo==="foraneo")return{...base,
      destino:forDest?.c,km:forDest?.km,vehiculoLabel:forVD?.label,
      stops:forDest?[{city:"Ciudad de México"},{city:forDest?.c}]:[],
      lines:[
        {label:`Tarifa base · ${forDest?.c}`,value:fmt(forBase)},
        forUrgente&&{label:"⚡ Urgente +35%",value:`+${fmt(forXUrg)}`,color:T.rose},
        forManiobra&&{label:`💪 Ayudantes (${forNumAyud})`,value:`+${fmt(forXMan)}`,color:T.violet},
        forParadas>0&&{label:`📦 Paradas extra (${forParadas})`,value:`+${fmt(forXPar)}`,color:T.blue},
        forResguardo&&{label:"🛡️ Resguardo 1 día",value:`+${fmt(forXRes)}`,color:T.green},
        forXComida>0&&{label:`🍽️ Comidas · ${forCrew}p × ${forDias}d`,value:`+${fmt(forXComida)}`,color:T.amber},
        forXHotel>0&&{label:`🏨 Hotel · ${forCrew}p × ${forNoches}n`,value:`+${fmt(forXHotel)}`,color:T.blue},
        {label:"Subtotal sin IVA",value:fmt(forSub)},
        {label:"IVA 16%",value:fmt(forIva),color:T.muted},
        {label:"TOTAL CON IVA",value:fmt(forTotal),bold:true,color:T.accent},
      ].filter(Boolean),
    };
    if(modo==="local")return{...base,
      destino:"Ciudad de México",vehiculoLabel:VEHICULOS.find(v=>v.k===locVeh)?.label,
      lines:[
        {label:`${VEHICULOS.find(v=>v.k===locVeh)?.label} · ${locUrgente?"Urgente":"Normal"}${locAyud?" + Ayudante":""}`,value:fmt(locBase)},
        locParadas>0&&{label:`Paradas extra (${locParadas})`,value:`+${fmt(locXPar)}`,color:T.blue},
        locResguardo&&{label:"Resguardo 1 día",value:`+${fmt(locXRes)}`,color:T.green},
        {label:"Subtotal sin IVA",value:fmt(locSub)},
        {label:"IVA 16%",value:fmt(locIva),color:T.muted},
        {label:"TOTAL CON IVA",value:fmt(locTotal),bold:true,color:T.accent},
      ].filter(Boolean),
    };
    return{...base,
      destino:masLocal?"Local":masDest?.c,vehiculoLabel:VEHICULOS.find(v=>v.k===masVeh)?.label,
      totalPDV:masPDV,flota:{camionetas,dias:masDias,capDia},
      lines:[
        masBase>0&&{label:`Tarifa transporte × ${camionetas}`,value:fmt(masBase)},
        masUrgente&&{label:"⚡ Urgente +35%",value:`+${fmt(masXUrg)}`,color:T.rose},
        masXComida>0&&{label:`🍽️ Comidas · ${masTotalPersonas} personas`,value:`+${fmt(masXComida)}`,color:T.amber},
        masXHotel>0&&{label:`🏨 Hotel personal`,value:`+${fmt(masXHotel)}`,color:T.blue},
        {label:"Subtotal sin IVA",value:fmt(masSub)},
        {label:"IVA 16%",value:fmt(masIva),color:T.muted},
        {label:"TOTAL CON IVA",value:fmt(masTotal),bold:true,color:T.accent},
      ].filter(Boolean),
    };
  };

  const handleSave=async()=>{
    setSaving(true);
    try{
      const q=buildQuote();
      await addDoc(collection(db,"cotizaciones"),{...q,createdAt:serverTimestamp()});
      onSaved&&onSaved();
      showToast("✓ Cotización guardada en Firebase");
    }catch(e){showToast(e.message,"err");}
    setSaving(false);
  };

  const handlePDF=()=>generateQuotePDF(buildQuote());

  /* ── RENDER ROWS ── */
  const Row=({l,v,c=T.text,bold,icon:Icon})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:`${bold?13:8}px 0`,borderBottom:bold?"none":`1px solid ${T.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        {Icon&&<Icon size={11} color={T.muted}/>}
        <span style={{fontFamily:T.sans,fontSize:bold?14:12,fontWeight:bold?800:400,color:bold?T.text:T.muted}}>{l}</span>
      </div>
      <span style={{fontFamily:T.mono,fontSize:bold?22:12,fontWeight:700,color:c}}>{v}</span>
    </div>
  );

  return(
    <div style={{flex:1,overflowY:"auto",background:"#ffffff",fontFamily:T.sans}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* TOP BAR */}
      <div style={{borderBottom:`1px solid ${T.border}`,padding:"20px 36px",background:"#ffffff",position:"sticky",top:0,zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:24,color:T.text,letterSpacing:"-0.02em"}}>Cotizador Pro</h1>
          <p style={{color:T.muted,fontSize:12,marginTop:2}}>Actualización automática · Viáticos incluidos · PDF instantáneo</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {step==="preview"&&<button onClick={()=>setStep("form")} className="btn" style={{display:"flex",alignItems:"center",gap:6,border:`1.5px solid ${T.border2}`,background:"transparent",color:T.muted,borderRadius:10,padding:"8px 16px",cursor:"pointer",fontFamily:T.sans,fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}><RefreshCw size={12}/>Nueva cotización</button>}
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",background:T.accentDim,borderRadius:20,border:`1px solid ${T.accent}20`}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 6px ${T.green}`}}/>
            <span style={{fontSize:11,fontWeight:600,color:T.accent,fontFamily:T.mono,letterSpacing:"0.03em"}}>EN VIVO</span>
          </div>
        </div>
      </div>

      <div style={{padding:"28px 36px"}}>
      </div>

      {/* MODO SELECTOR */}
      <div style={{display:"flex",background:"#ffffff",border:`1.5px solid ${T.border}`,borderRadius:14,padding:4,width:"fit-content",gap:2,marginBottom:22}}>
        {[
          {id:"local",label:"📍 Local CDMX",color:T.green},
          {id:"foraneo",label:"🚛 Foráneo",color:T.accent},
          {id:"masivo",label:"📦 Distribución Masiva",color:T.blue},
        ].map(({id,label,color})=>(
          <button key={id} onClick={()=>{setModo(id);setStep("form");}} className="btn" style={{display:"flex",alignItems:"center",gap:7,padding:"9px 18px",borderRadius:11,border:"none",cursor:"pointer",transition:"all .15s",background:modo===id?`${color}16`:"transparent",color:modo===id?color:T.muted,fontFamily:T.sans,fontSize:13,fontWeight:modo===id?700:500}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:18,alignItems:"start"}}>

        {/* ── LEFT COLUMN: FORM ── */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* CLIENT INFO */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
            <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Información del cliente</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Empresa / Cliente *" value={cliente} onChange={e=>setCliente(e.target.value)} placeholder="Ej: Walmart México"/>
              <Input label="Nombre de contacto" value={contacto} onChange={e=>setContacto(e.target.value)} placeholder="Ej: Luis Hernández"/>
              <Input label="Email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="contacto@empresa.com"/>
              <Stepper label="Plazo de entrega (días)" value={plazo} onChange={setPlazo} min={1} max={90}/>
            </div>
          </div>

          {/* ══ FORÁNEO ══ */}
          {modo==="foraneo"&&<>
            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>Destino <span style={{color:T.rose}}>*</span></div>
              {forDest?(
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:`${T.accent}0d`,border:`1.5px solid ${T.accent}28`,borderRadius:12}}>
                  <MapPin size={16} color={T.accent}/>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:T.display,fontWeight:700,fontSize:18,color:T.text}}>{forDest.c}</div>
                    <div style={{fontFamily:T.mono,fontSize:11,color:T.muted}}>{forDest.km.toLocaleString()} km · {calcDias(forDest.km).camino} días camino · {calcDias(forDest.km).noches} noches</div>
                  </div>
                  <button onClick={()=>setForDest(null)} className="btn" style={{width:26,height:26,borderRadius:"50%",border:`1px solid ${T.border2}`,background:"transparent",cursor:"pointer",color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={12}/></button>
                </div>
              ):(
                <CitySearch placeholder={`Busca entre ${TARIFA.length} destinos…`} value={forSearch} onChange={setForSearch} onSelect={t=>{setForDest(t);setForSearch("");}} vehiculo={forVeh}/>
              )}
            </div>

            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Vehículo</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {VEHICULOS.map(v=>{
                  const a=forVeh===v.k;
                  return(
                    <button key={v.k} onClick={()=>setForVeh(v.k)} className="btn" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:11,border:`1.5px solid ${a?T.accent:T.border2}`,background:a?`${T.accent}0d`:"transparent",cursor:"pointer",transition:"all .15s"}}>
                      <span style={{fontSize:18}}>{v.icon}</span>
                      <div style={{flex:1,textAlign:"left"}}>
                        <div style={{fontSize:13,fontWeight:700,color:a?T.text:T.muted}}>{v.label}</div>
                        <div style={{fontSize:11,color:T.muted}}>{v.cap} · {v.crew} persona{v.crew>1?"s":""} tripulación</div>
                      </div>
                      {forDest&&<span style={{fontFamily:T.mono,fontSize:12,fontWeight:700,color:a?T.accent:T.muted}}>{fmt(forDest[v.k])}</span>}
                      {a&&<Check size={13} color={T.accent}/>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Viáticos del personal</div>
                {forDias>0&&<Tag color={T.blue}>{forDias} días fuera · {forNoches} noches hotel</Tag>}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>Comidas / persona / día</div>
                  <input type="number" value={forComida} onChange={e=>setForComida(Number(e.target.value)||0)} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:9,padding:"9px 12px",color:T.text,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
                </div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>Hotel / persona / noche</div>
                  <input type="number" value={forHotel} onChange={e=>setForHotel(Number(e.target.value)||0)} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:9,padding:"9px 12px",color:T.text,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"#ffffff",borderRadius:10,border:`1px solid ${T.border}`,marginBottom:14}}>
                <Users size={14} color={T.blue}/>
                <span style={{flex:1,fontSize:12}}>Tripulación base: <strong>{forVD?.crew||1} persona{(forVD?.crew||1)>1?"s":""}</strong></span>
                <Stepper value={forPersonasExtra} onChange={setForPersonasExtra} min={0} max={8}/>
                <span style={{fontSize:12,color:T.muted,whiteSpace:"nowrap"}}>extras</span>
              </div>
              {forDias>0&&(
                <div style={{padding:"10px 14px",background:`${T.blue}0a`,borderRadius:10,border:`1px solid ${T.blue}20`}}>
                  <div style={{fontSize:11,color:T.blue,fontWeight:600}}>{forCrew} personas × {forDias} días × ${forComida}/comida + {forNoches} noches × ${forHotel}/hotel</div>
                  <div style={{fontFamily:T.mono,fontSize:15,fontWeight:700,color:T.blue,marginTop:4}}>Viáticos totales: {fmt(forXViatic)}</div>
                </div>
              )}
            </div>

            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Servicios adicionales</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <Toggle checked={forUrgente} onChange={setForUrgente} label="⚡ Viaje urgente" sub={forUrgente?`+35% → +${fmt(forXUrg)}`:"Sin cargo adicional"} accent={T.rose}/>
                <Toggle checked={forManiobra} onChange={setForManiobra} label="💪 Maniobras / Ayudantes en destino" sub="$2,800 por ayudante" accent={T.violet}/>
                {forManiobra&&<div style={{paddingLeft:32,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:12,color:T.muted}}>Cantidad:</span><Stepper value={forNumAyud} onChange={setForNumAyud} min={1} max={10}/><span style={{fontFamily:T.mono,fontSize:12,color:T.violet,fontWeight:700}}>{fmt(forXMan)}</span></div>}
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,border:`1.5px solid ${T.border2}`}}>
                  <Package size={15} color={T.blue}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>Paradas adicionales en ruta</div><div style={{fontSize:11,color:T.muted}}>$1,200 por entrega extra</div></div>
                  <Stepper value={forParadas} onChange={setForParadas} min={0} max={50}/>
                </div>
                <Toggle checked={forResguardo} onChange={setForResguardo} label="🛡️ Resguardo de materiales (1 día)" sub={fmt(LOCALES[forVeh]?.resguardo||0)} accent={T.green}/>
              </div>
            </div>
          </>}

          {/* ══ LOCAL ══ */}
          {modo==="local"&&<>
            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Vehículo</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {VEHICULOS.map(v=>{
                  const a=locVeh===v.k;const tar=LOCALES[v.k];
                  return(
                    <button key={v.k} onClick={()=>setLocVeh(v.k)} className="btn" style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:11,border:`1.5px solid ${a?T.accent:T.border2}`,background:a?`${T.accent}0d`:"transparent",cursor:"pointer"}}>
                      <span style={{fontSize:18}}>{v.icon}</span>
                      <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:a?T.text:T.muted}}>{v.label}</div><div style={{fontSize:11,color:T.muted}}>{v.cap}</div></div>
                      <span style={{fontFamily:T.mono,fontSize:12,fontWeight:700,color:a?T.accent:T.muted}}>{fmt(tar?.normal||0)}</span>
                      {a&&<Check size={13} color={T.accent}/>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Servicios</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <Toggle checked={locUrgente} onChange={setLocUrgente} label="⚡ Viaje urgente" sub={`${fmt(LOCALES[locVeh]?.urgente||0)} tarifa urgente`} accent={T.rose}/>
                <Toggle checked={locAyud} onChange={setLocAyud} label="💪 Con ayudante / maniobras" sub={`${fmt(LOCALES[locVeh]?.ayudante||0)} con ayudante`} accent={T.violet}/>
                <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:12,border:`1.5px solid ${T.border2}`}}>
                  <Package size={15} color={T.blue}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>Paradas adicionales</div><div style={{fontSize:11,color:T.muted}}>$1,200 por entrega</div></div>
                  <Stepper value={locParadas} onChange={setLocParadas} min={0} max={50}/>
                </div>
                <Toggle checked={locResguardo} onChange={setLocResguardo} label="🛡️ Resguardo 1 día" sub={fmt(LOCALES[locVeh]?.resguardo||0)} accent={T.green}/>
              </div>
            </div>
          </>}

          {/* ══ MASIVO ══ */}
          {modo==="masivo"&&<>
            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Puntos de Distribución</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>Total de PDVs</div>
                  <input type="number" value={masPDV} onChange={e=>setMasPDV(Math.max(1,parseInt(e.target.value)||1))} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:9,padding:"10px 12px",color:T.accent,fontFamily:T.mono,fontSize:22,fontWeight:700,outline:"none",textAlign:"center"}}/>
                </div>
                <Stepper label="Plazo máximo (días)" value={plazo} onChange={setPlazo} min={1} max={90}/>
              </div>
            </div>

            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Configuración de flota</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                <Stepper label="Entregas máx/camioneta/día" value={masMaxDia} onChange={setMasMaxDia} min={1} max={300}/>
                <Stepper label="Personas por camioneta" value={masPersonasVan} onChange={setMasPersonasVan} min={1} max={5}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
                <InfoBox icon={Truck} color={T.accent} title="Camionetas" value={camionetas} sub={`para cumplir ${plazo} días`} xs/>
                <InfoBox icon={Calendar} color={T.blue} title="Días operación" value={masDias} sub={`${capDia.toLocaleString()}/día`} xs/>
                <InfoBox icon={Users} color={T.violet} title="Personal" value={masTotalPersonas} sub={`${masPersonasVan+(masAyudante?1:0)}/van`} xs/>
              </div>
              <Toggle checked={masAyudante} onChange={setMasAyudante} label="💪 Ayudante por camioneta" sub="Personal de apoyo adicional" accent={T.violet}/>
              <div style={{marginTop:8}}/>
              <Toggle checked={masUrgente} onChange={setMasUrgente} label="⚡ Servicio urgente (+35%)" sub="Aplica sobre tarifa de transporte" accent={T.rose}/>
            </div>

            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Tipo de distribución</div>
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                <button onClick={()=>setMasLocal(true)} className="btn" style={{flex:1,padding:"10px 0",borderRadius:10,border:`2px solid ${masLocal?T.accent:T.border2}`,background:masLocal?`${T.accent}0d`:"transparent",color:masLocal?T.accent:T.muted,cursor:"pointer",fontFamily:T.sans,fontSize:13,fontWeight:masLocal?700:500}}>📍 Local / Una ciudad</button>
                <button onClick={()=>setMasLocal(false)} className="btn" style={{flex:1,padding:"10px 0",borderRadius:10,border:`2px solid ${!masLocal?T.accent:T.border2}`,background:!masLocal?`${T.accent}0d`:"transparent",color:!masLocal?T.accent:T.muted,cursor:"pointer",fontFamily:T.sans,fontSize:13,fontWeight:!masLocal?700:500}}>🗺️ Foráneo / Viaje</button>
              </div>
              {!masLocal&&<>
                {masDest?(
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:`${T.accent}0a`,borderRadius:10,border:`1.5px solid ${T.accent}20`,marginBottom:12}}>
                    <MapPin size={14} color={T.accent}/>
                    <span style={{flex:1,fontWeight:700}}>{masDest.c}</span>
                    <button onClick={()=>setMasDest(null)} className="btn" style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted}}><X size={12}/></button>
                  </div>
                ):(
                  <div style={{marginBottom:12}}>
                    <CitySearch placeholder="Buscar destino foráneo…" value={masSearch} onChange={setMasSearch} onSelect={t=>{setMasDest(t);setMasSearch("");}} vehiculo={masVeh}/>
                  </div>
                )}
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {VEHICULOS.map(v=>(
                    <button key={v.k} onClick={()=>setMasVeh(v.k)} className="btn" style={{flex:1,minWidth:70,padding:"7px 4px",borderRadius:9,border:`2px solid ${masVeh===v.k?T.accent:T.border2}`,background:masVeh===v.k?`${T.accent}0d`:"transparent",cursor:"pointer",fontSize:11,fontWeight:masVeh===v.k?700:500,color:masVeh===v.k?T.accent:T.muted,textAlign:"center"}}>{v.icon}<br/>{v.label.split(" ")[0]}</button>
                  ))}
                </div>
              </>}
            </div>

            <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
              <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Viáticos del personal</div>
              <div style={{display:"grid",gridTemplateColumns:masLocal?"1fr":"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>Comida/persona/día</div>
                  <input type="number" value={masComida} onChange={e=>setMasComida(Number(e.target.value)||0)} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:9,padding:"9px 12px",color:T.text,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
                </div>
                {!masLocal&&<div>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>Hotel/persona/noche</div>
                  <input type="number" value={masHotel} onChange={e=>setMasHotel(Number(e.target.value)||0)} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:9,padding:"9px 12px",color:T.text,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
                </div>}
              </div>
              {(masXComida>0||masXHotel>0)&&(
                <div style={{padding:"10px 14px",background:`${T.blue}0a`,borderRadius:10,border:`1px solid ${T.blue}20`}}>
                  <div style={{fontSize:11,color:T.blue,fontWeight:600}}>{masTotalPersonas} personas × {masDias} días × ${masComida}{!masLocal?` + ${masNoches} noches × $${masHotel}`:""}</div>
                  <div style={{fontFamily:T.mono,fontSize:14,fontWeight:700,color:T.blue,marginTop:4}}>Viáticos: {fmt(masXViatic)}</div>
                </div>
              )}
            </div>
          </>}

          {/* NOTAS */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
            <Textarea label="Notas / Condiciones especiales" value={notas} onChange={e=>setNotas(e.target.value)} placeholder="Condiciones de carga, tipo de mercancía, instrucciones especiales…"/>
          </div>

          {/* CTA BUTTON */}
          <button onClick={()=>{if(canQ)setStep("preview");}} className="btn" style={{padding:"15px 20px",borderRadius:14,border:"none",cursor:canQ?"pointer":"not-allowed",background:canQ?`linear-gradient(135deg,${T.accent},#fb923c)`:"#e2e8f4",color:canQ?"#fff":T.muted,fontFamily:T.display,fontWeight:700,fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:canQ?`0 6px 28px ${T.accent}40`:"none",transition:"all .2s"}}>
            <DollarSign size={20}/>
            {canQ?`Generar cotización ${modo==="foraneo"?`→ ${forDest?.c}`:modo==="local"?"local":"masiva"}`:"Completa los campos requeridos"}
          </button>
        </div>

        {/* ── RIGHT COLUMN: LIVE PREVIEW ── */}
        <div style={{position:"sticky",top:0,paddingTop:4}}>
          <div style={{background:"#ffffff",border:`1.5px solid ${T.border}`,borderRadius:18,overflow:"hidden",marginBottom:14,boxShadow:"0 4px 24px rgba(12,24,41,.06)"}}>
            <div style={{background:"#ffffff",padding:"20px 22px 16px",borderBottom:`2px solid ${T.accent}`,position:"relative"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${T.accent},#fb923c)`}}/>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8,marginTop:4}}>● Cotización en vivo</div>
              <div style={{fontFamily:T.mono,fontWeight:700,fontSize:36,color:T.text,letterSpacing:"-0.03em",lineHeight:1}}>{fmt(total)}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:5,fontWeight:500}}>MXN con IVA incluido</div>
            </div>
            <div style={{padding:"16px 20px"}}>
              {modo==="foraneo"&&<>
                <Row l={`Base · ${forDest?.c||"Sin destino"}`} v={fmt(forBase)}/>
                {forUrgente&&<Row l="⚡ Urgente +35%" v={`+${fmt(forXUrg)}`} c={T.rose}/>}
                {forManiobra&&<Row l={`💪 Ayudantes (${forNumAyud})`} v={`+${fmt(forXMan)}`} c={T.violet}/>}
                {forParadas>0&&<Row l={`📦 Paradas (${forParadas})`} v={`+${fmt(forXPar)}`} c={T.blue}/>}
                {forResguardo&&<Row l="🛡️ Resguardo" v={`+${fmt(forXRes)}`} c={T.green}/>}
                {forXComida>0&&<Row l={`🍽️ Comidas`} v={`+${fmt(forXComida)}`} c={T.amber}/>}
                {forXHotel>0&&<Row l={`🏨 Hotel`} v={`+${fmt(forXHotel)}`} c={T.blue}/>}
                <Row l="Subtotal" v={fmt(forSub)}/>
                <Row l="IVA 16%" v={fmt(forIva)} c={T.muted}/>
                <Row l="TOTAL" v={fmt(forTotal)} c={T.accent} bold/>
                {forDest&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`}}>
                  <div style={{fontSize:10,fontWeight:700,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:8}}>Comparar vehículos</div>
                  {VEHICULOS.map(v=>(
                    <button key={v.k} onClick={()=>setForVeh(v.k)} className="btn" style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",marginBottom:2,borderRadius:8,border:"none",cursor:"pointer",background:forVeh===v.k?`${T.accent}12`:"transparent"}}>
                      <span style={{fontSize:11,color:forVeh===v.k?T.text:T.muted}}>{v.icon} {v.label}</span>
                      <span style={{fontFamily:T.mono,fontSize:11,fontWeight:700,color:forVeh===v.k?T.accent:T.muted}}>{fmt(forDest[v.k])}</span>
                    </button>
                  ))}
                </div>}
              </>}
              {modo==="local"&&<>
                <Row l={`${VEHICULOS.find(v=>v.k===locVeh)?.label}`} v={fmt(locBase)}/>
                {locParadas>0&&<Row l={`Paradas (${locParadas})`} v={`+${fmt(locXPar)}`} c={T.blue}/>}
                {locResguardo&&<Row l="🛡️ Resguardo" v={`+${fmt(locXRes)}`} c={T.green}/>}
                <Row l="Subtotal" v={fmt(locSub)}/>
                <Row l="IVA 16%" v={fmt(locIva)} c={T.muted}/>
                <Row l="TOTAL" v={fmt(locTotal)} c={T.accent} bold/>
              </>}
              {modo==="masivo"&&<>
                <Row l={`${camionetas} camioneta${camionetas>1?"s":""} × ${masDias} días`} v={fmt(masBase||0)}/>
                {masUrgente&&<Row l="⚡ Urgente +35%" v={`+${fmt(masXUrg)}`} c={T.rose}/>}
                {masXComida>0&&<Row l="🍽️ Comidas personal" v={`+${fmt(masXComida)}`} c={T.amber}/>}
                {masXHotel>0&&<Row l="🏨 Hospedaje" v={`+${fmt(masXHotel)}`} c={T.blue}/>}
                <Row l="Subtotal" v={fmt(masSub)}/>
                <Row l="IVA 16%" v={fmt(masIva)} c={T.muted}/>
                <Row l="TOTAL" v={fmt(masTotal)} c={T.accent} bold/>
                {masDias<=plazo?(
                  <div style={{marginTop:10,padding:"8px 12px",background:T.greenDim,borderRadius:8,border:`1px solid ${T.green}28`,fontSize:11,color:T.green}}>✓ Listo en {masDias} días ({plazo-masDias} días de holgura)</div>
                ):(
                  <div style={{marginTop:10,padding:"8px 12px",background:T.amberDim,borderRadius:8,border:`1px solid ${T.amber}28`,fontSize:11,color:T.amber}}>⚠️ Necesitas más camionetas o ampliar el plazo</div>
                )}
              </>}
            </div>
          </div>

          {step==="preview"&&(
            <div style={{background:"#ffffff",border:`1.5px solid ${T.accent}28`,borderRadius:16,padding:18,display:"flex",flexDirection:"column",gap:10}}>
              <div style={{fontSize:12,fontWeight:700,color:T.accent,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Cotización lista</div>
              <button onClick={handleSave} disabled={saving} className="btn" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",borderRadius:11,padding:"11px 0",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,boxShadow:`0 4px 20px ${T.accent}30`,opacity:saving?.7:1}}>
                {saving?<><div style={{width:14,height:14,border:"2px solid #fff",borderTop:"2px solid transparent",borderRadius:"50%"}} className="spin"/>Guardando…</> : <><Send size={15}/>Guardar en Firebase</>}
              </button>
              <button onClick={handlePDF} className="btn" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"transparent",color:T.text,border:`1.5px solid ${T.border2}`,borderRadius:11,padding:"11px 0",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14}}>
                <Printer size={15}/>Exportar PDF
              </button>
              {forDest&&modo==="foraneo"&&(
                <a href={buildMapsURL(["Ciudad de México",forDest.c])} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:T.blueDim,color:T.blue,border:`1.5px solid ${T.blue}28`,borderRadius:11,padding:"11px 0",textDecoration:"none",fontFamily:T.sans,fontWeight:700,fontSize:14}}>
                  <Globe size={15}/>Abrir en Google Maps
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   PLANIFICADOR DE RUTAS — FLAGSHIP FEATURE
═══════════════════════════════════════════════════════════════════════════ */
function PlanificadorRutas({onSaved}){
  const [nombre,setNombre]=useState("");
  const [cliente,setCliente]=useState("");
  const [vehiculo,setVehiculo]=useState("cam");
  const [stops,setStops]=useState([{id:uid(),city:"Ciudad de México",pdv:0,addr:"",km:0,base:0,isOrigin:true}]);
  const [search,setSearch]=useState("");
  const [maxDia,setMaxDia]=useState(20);
  const [plazo,setPlazo]=useState(5);
  const [comida,setComida]=useState(COMIDA_DEF);
  const [hotel,setHotel]=useState(HOTEL_DEF);
  const [personasVan,setPersonasVan]=useState(1);
  const [ayudante,setAyudante]=useState(false);
  const [urgente,setUrgente]=useState(false);
  const [rutas,setRutas]=useState([]);
  const [loadingRutas,setLoadingRutas]=useState(true);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const [viewRuta,setViewRuta]=useState(null);
  const showToast=(m,t="ok")=>{setToast({msg:m,type:t});};

  useEffect(()=>{
    const u=onSnapshot(collection(db,"rutas"),s=>{
      setRutas(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      setLoadingRutas(false);
    });
    return u;
  },[]);

  /* ── CALCULATIONS ── */
  const totalPDV=useMemo(()=>stops.filter(s=>!s.isOrigin).reduce((a,s)=>a+(s.pdv||0),0),[stops]);
  const totalKm=useMemo(()=>{
    let km=0;
    for(let i=1;i<stops.length;i++){
      const a=stops[i-1].km||0;
      const b=stops[i].km||0;
      // Approximate inter-city distance using triangle inequality from CDMX
      km+=Math.abs(b-a)*0.8+Math.min(a,b)*0.2;
    }
    return Math.round(km);
  },[stops]);

  const {camionetas,dias:diasOp,capDia}=useMemo(()=>totalPDV>0?calcFlota(totalPDV,maxDia,plazo):{camionetas:1,dias:0,capDia:maxDia},[totalPDV,maxDia,plazo]);
  const vehD=VEHICULOS.find(v=>v.k===vehiculo);
  const crew=camionetas*((vehD?.crew||1)+personasVan-1+(ayudante?1:0));
  const {xComida,xHotel,total:xViatic,dias:diasFuera,noches}=useMemo(()=>calcViaticos(totalKm,crew,comida,hotel),[totalKm,crew,comida,hotel]);
  const tarifaTransp=useMemo(()=>stops.filter(s=>!s.isOrigin).reduce((a,s)=>a+(s.base||0),0)*camionetas,[stops,camionetas]);
  const xUrg=urgente?tarifaTransp*.35:0;
  const subtotal=tarifaTransp+xUrg+xViatic;
  const iva=subtotal*.16;
  const total=subtotal+iva;

  const mapsURL=useMemo(()=>buildMapsURL(stops.map(s=>s.city)),[stops]);

  /* ── STOP MANAGEMENT ── */
  const addStop=(tarifa)=>{
    setStops(prev=>[...prev,{id:uid(),city:tarifa.c,pdv:0,addr:"",km:tarifa.km,base:tarifa[vehiculo],isOrigin:false}]);
    setSearch("");
  };
  const removeStop=(id)=>setStops(prev=>prev.filter(s=>s.id!==id||s.isOrigin));
  const updateStop=(id,key,val)=>setStops(prev=>prev.map(s=>s.id===id?{...s,[key]:val,base:key==="city"?val:s.base}:s));
  const moveUp=(idx)=>{
    if(idx<=1)return;
    setStops(prev=>{const a=[...prev];[a[idx-1],a[idx]]=[a[idx],a[idx-1]];return a;});
  };
  const moveDown=(idx)=>{
    if(idx>=stops.length-1)return;
    setStops(prev=>{const a=[...prev];[a[idx],a[idx+1]]=[a[idx+1],a[idx]];return a;});
  };

  // Update base prices when vehicle changes
  useEffect(()=>{
    setStops(prev=>prev.map(s=>{
      if(s.isOrigin)return s;
      const t=TARIFA.find(t=>t.c===s.city);
      return t?{...s,base:t[vehiculo]}:s;
    }));
  },[vehiculo]);

  const handleSave=async()=>{
    if(!nombre.trim()||stops.length<2){showToast("Agrega nombre y al menos un destino","err");return;}
    setSaving(true);
    try{
      const data={
        nombre,cliente,vehiculo,vehiculoLabel:vehD?.label,
        stops:stops.map(s=>({city:s.city,pdv:s.pdv||0,km:s.km||0})),
        totalPDV,totalKm,camionetas,diasOp,capDia,crew,
        xViatic,tarifaTransp,subtotal,iva,total,plazo,maxDia,
        mapsURL,status:"Programada",progreso:0,
        createdAt:serverTimestamp(),
      };
      await addDoc(collection(db,"rutas"),data);
      showToast("✓ Ruta guardada en Firebase");
      onSaved&&onSaved();
    }catch(e){showToast(e.message,"err");}
    setSaving(false);
  };

  const handlePDF=()=>{
    const q={
      folio:"RUT-"+Date.now().toString(36).slice(-6).toUpperCase(),
      cliente,modo:"ruta",
      destino:stops.filter(s=>!s.isOrigin).map(s=>s.city).join(" → "),
      vehiculoLabel:vehD?.label,
      stops:stops.map(s=>({city:s.city,pdv:s.pdv})),
      lines:[
        {label:`Tarifa transporte (${stops.filter(s=>!s.isOrigin).length} destinos × ${camionetas} vans)`,value:fmt(tarifaTransp)},
        urgente&&{label:"⚡ Urgente +35%",value:`+${fmt(xUrg)}`,color:T.rose},
        xComida>0&&{label:`🍽️ Comidas · ${crew}p × ${diasFuera}d`,value:`+${fmt(xComida)}`,color:T.amber},
        xHotel>0&&{label:`🏨 Hotel · ${crew}p × ${noches}n`,value:`+${fmt(xHotel)}`,color:T.blue},
        {label:"Subtotal sin IVA",value:fmt(subtotal)},
        {label:"IVA 16%",value:fmt(iva),color:T.muted},
        {label:"TOTAL CON IVA",value:fmt(total),bold:true,color:T.accent},
      ].filter(Boolean),
      flota:{camionetas,dias:diasOp,capDia},
      totalPDV,plazo,total,
    };
    generateQuotePDF(q);
  };

  const statusColor={Programada:T.violet,"En curso":T.blue,Completada:T.green,Cancelada:T.rose};

  return(
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      <div className="au" style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Planificador de Rutas</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>Multi-parada · Asignación automática de flota · Google Maps integrado</p>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:18,alignItems:"start"}}>
        {/* ── BUILDER ── */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>

          {/* RUTA INFO */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
            <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Datos de la ruta</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Nombre de ruta *" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Ej: MTY Noreste Semana 12"/>
              <Input label="Cliente" value={cliente} onChange={e=>setCliente(e.target.value)} placeholder="Nombre del cliente"/>
            </div>
          </div>

          {/* STOP LIST */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"16px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:T.display,fontWeight:700,fontSize:15,color:T.text}}>Paradas de la ruta ({stops.length})</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <Tag color={T.violet}>{stops.filter(s=>!s.isOrigin).length} destinos</Tag>
                <Tag color={T.accent}>{totalPDV.toLocaleString()} PDVs</Tag>
              </div>
            </div>

            <div style={{padding:16,display:"flex",flexDirection:"column",gap:8}}>
              {stops.map((stop,idx)=>(
                <div key={stop.id} className="si" style={{display:"flex",alignItems:"flex-start",gap:10,background:stop.isOrigin?"#f8fafd":T.card,border:`1.5px solid ${stop.isOrigin?T.border2:T.accent+"28"}`,borderRadius:12,padding:"12px 14px",transition:"all .15s"}}>
                  {/* LINE INDICATOR */}
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:6,gap:0}}>
                    <div style={{width:12,height:12,borderRadius:"50%",background:stop.isOrigin?T.blue:T.accent,border:`2px solid ${stop.isOrigin?T.blue:T.accent}`,flexShrink:0}}/>
                    {idx<stops.length-1&&<div style={{width:2,height:20,background:`${T.border2}`,marginTop:4}}/>}
                  </div>

                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:stop.isOrigin?0:8}}>
                      <span style={{fontFamily:T.sans,fontWeight:700,fontSize:14,color:T.text}}>{stop.city}</span>
                      {stop.isOrigin&&<Tag color={T.blue} sm>ORIGEN</Tag>}
                      {!stop.isOrigin&&stop.km>0&&<span style={{fontFamily:T.mono,fontSize:10,color:T.muted}}>{stop.km.toLocaleString()} km</span>}
                    </div>
                    {!stop.isOrigin&&(
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>PDVs en esta parada</div>
                          <input type="number" value={stop.pdv||""} onChange={e=>updateStop(stop.id,"pdv",parseInt(e.target.value)||0)}
                            placeholder="0" style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:8,padding:"7px 10px",color:T.accent,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
                        </div>
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.04em"}}>Dirección / Zona</div>
                          <input type="text" value={stop.addr||""} onChange={e=>updateStop(stop.id,"addr",e.target.value)}
                            placeholder="Opcional…" style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:8,padding:"7px 10px",color:T.text,fontFamily:T.sans,fontSize:13,outline:"none"}}/>
                        </div>
                      </div>
                    )}
                  </div>

                  {!stop.isOrigin&&(
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      <button onClick={()=>moveUp(idx)} className="btn" style={{border:`1px solid ${T.border2}`,background:"transparent",cursor:"pointer",borderRadius:6,padding:"3px 6px",color:T.muted}}><ChevronUp size={11}/></button>
                      <button onClick={()=>moveDown(idx)} className="btn" style={{border:`1px solid ${T.border2}`,background:"transparent",cursor:"pointer",borderRadius:6,padding:"3px 6px",color:T.muted}}><ChevronDown size={11}/></button>
                      <button onClick={()=>removeStop(stop.id)} className="btn" style={{border:`1px solid ${T.roseDim}`,background:T.roseDim,cursor:"pointer",borderRadius:6,padding:"3px 6px",color:T.rose}}><X size={11}/></button>
                    </div>
                  )}
                </div>
              ))}

              {/* ADD STOP */}
              <div style={{padding:"12px 14px",background:`${T.accent}06`,border:`1.5px dashed ${T.accent}40`,borderRadius:12}}>
                <div style={{fontSize:11,fontWeight:700,color:T.accent,marginBottom:8,letterSpacing:"0.04em"}}>+ AGREGAR PARADA</div>
                <CitySearch
                  placeholder={`Busca entre ${TARIFA.length} destinos…`}
                  value={search} onChange={setSearch}
                  onSelect={addStop}
                  vehiculo={vehiculo}
                  exclude={stops.map(s=>s.city)}
                />
              </div>
            </div>
          </div>

          {/* VEHICLE & FLEET CONFIG */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
            <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>Vehículo y flota</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
              {VEHICULOS.map(v=>(
                <button key={v.k} onClick={()=>setVehiculo(v.k)} className="btn" style={{flex:1,minWidth:100,padding:"10px 8px",borderRadius:11,border:`2px solid ${vehiculo===v.k?T.accent:T.border2}`,background:vehiculo===v.k?`${T.accent}0d`:"transparent",cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
                  <div style={{fontSize:18,marginBottom:3}}>{v.icon}</div>
                  <div style={{fontSize:12,fontWeight:700,color:vehiculo===v.k?T.accent:T.muted}}>{v.label}</div>
                  <div style={{fontSize:10,color:T.muted}}>{v.cap}</div>
                </button>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
              <Stepper label="Entregas máx/día/van" value={maxDia} onChange={setMaxDia} min={1} max={300}/>
              <Stepper label="Plazo máximo (días)" value={plazo} onChange={setPlazo} min={1} max={90}/>
              <Stepper label="Personas por van" value={personasVan} onChange={setPersonasVan} min={1} max={5}/>
            </div>
            {totalPDV>0&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              <InfoBox icon={Truck} color={T.accent} title="Camionetas" value={camionetas} sub={`calculado auto`} xs/>
              <InfoBox icon={Calendar} color={T.blue} title="Días operación" value={diasOp} sub={`${capDia}/día`} xs/>
              <InfoBox icon={Users} color={T.violet} title="Personal total" value={crew} sub="en campo" xs/>
            </div>}
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1}}><Toggle checked={ayudante} onChange={setAyudante} label="💪 Ayudante por camioneta" sub="Personal adicional" accent={T.violet}/></div>
              <div style={{flex:1}}><Toggle checked={urgente} onChange={setUrgente} label="⚡ Urgente (+35%)" sub="Sobre tarifa base" accent={T.rose}/></div>
            </div>
          </div>

          {/* VIÁTICOS */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Viáticos del personal</div>
              {diasFuera>0&&<Tag color={T.blue}>{diasFuera} días fuera · {noches} noches</Tag>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>Comida/persona/día</div>
                <input type="number" value={comida} onChange={e=>setComida(Number(e.target.value)||0)} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:9,padding:"9px 12px",color:T.text,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
              </div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.04em"}}>Hotel/persona/noche</div>
                <input type="number" value={hotel} onChange={e=>setHotel(Number(e.target.value)||0)} style={{width:"100%",background:"#ffffff",border:`1.5px solid ${T.border2}`,borderRadius:9,padding:"9px 12px",color:T.text,fontFamily:T.mono,fontSize:15,fontWeight:700,outline:"none"}}/>
              </div>
            </div>
            {xViatic>0&&<div style={{padding:"10px 14px",background:`${T.blue}0a`,borderRadius:10,border:`1px solid ${T.blue}20`}}>
              <div style={{fontSize:11,color:T.blue,fontWeight:600}}>{crew} personas × {diasFuera} días × ${comida}/comida + {noches} noches × ${hotel}/hotel</div>
              <div style={{fontFamily:T.mono,fontSize:15,fontWeight:700,color:T.blue,marginTop:4}}>Total viáticos: {fmt(xViatic)}</div>
            </div>}
          </div>

          {/* ACTIONS */}
          <div style={{display:"flex",gap:10}}>
            <button onClick={handleSave} disabled={saving} className="btn" style={{flex:2,padding:"14px 0",borderRadius:13,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",fontFamily:T.display,fontWeight:700,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",gap:9,boxShadow:`0 6px 24px ${T.accent}38`,opacity:saving?.7:1}}>
              {saving?<><div style={{width:16,height:16,border:"2px solid #fff",borderTop:"2px solid transparent",borderRadius:"50%"}} className="spin"/>Guardando…</>:<><Route size={18}/>Guardar Ruta</>}
            </button>
            <button onClick={handlePDF} className="btn" style={{flex:1,padding:"14px 0",borderRadius:13,border:`1.5px solid ${T.border2}`,background:T.card,cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:T.text}}>
              <Printer size={15}/>PDF
            </button>
            {mapsURL&&<a href={mapsURL} target="_blank" rel="noopener noreferrer" className="btn" style={{flex:1,padding:"14px 0",borderRadius:13,border:`1.5px solid ${T.blue}28`,background:T.blueDim,cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:T.blue,textDecoration:"none"}}>
              <Globe size={15}/>Maps
            </a>}
          </div>
        </div>

        {/* ── RIGHT: SUMMARY + SAVED ROUTES ── */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {/* COST SUMMARY */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#fff7ed,#fef3c7)",padding:"18px 20px",borderBottom:`1px solid ${T.border}`}}>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Costo total de ruta</div>
              <div style={{fontFamily:T.mono,fontWeight:700,fontSize:34,color:T.text,lineHeight:1}}>{fmt(total)}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:4}}>MXN con IVA · {stops.filter(s=>!s.isOrigin).length} destinos</div>
            </div>
            <div style={{padding:"16px 20px"}}>
              {[
                {l:`Tarifa transporte (×${camionetas} vans)`,v:fmt(tarifaTransp)},
                urgente&&{l:"⚡ Urgente +35%",v:`+${fmt(xUrg)}`,c:T.rose},
                xComida>0&&{l:`🍽️ Comidas`,v:`+${fmt(xComida)}`,c:T.amber},
                xHotel>0&&{l:`🏨 Hotel`,v:`+${fmt(xHotel)}`,c:T.blue},
                {l:"Subtotal",v:fmt(subtotal)},
                {l:"IVA 16%",v:fmt(iva),c:T.muted},
              ].filter(Boolean).map(({l,v,c},i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                  <span style={{color:T.muted}}>{l}</span>
                  <span style={{fontFamily:T.mono,fontWeight:700,color:c||T.text}}>{v}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",fontSize:15,fontWeight:800}}>
                <span style={{color:T.text}}>TOTAL</span>
                <span style={{fontFamily:T.mono,color:T.accent,fontSize:20}}>{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* ROUTE STOPS SUMMARY */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:18}}>
            <div style={{fontSize:10,fontWeight:800,color:T.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>Resumen de ruta</div>
            {stops.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:s.isOrigin?`${T.blue}18`:`${T.accent}18`,border:`2px solid ${s.isOrigin?T.blue:T.accent}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,fontWeight:700,color:s.isOrigin?T.blue:T.accent}}>{i+1}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.city}</div>
                  {!s.isOrigin&&<div style={{fontSize:10,color:T.muted}}>{s.pdv>0?`${s.pdv} PDVs`:"Sin PDVs"} · {fmt(s.base||0)}</div>}
                </div>
                {i<stops.length-1&&<ArrowRight size={11} color={T.muted}/>}
              </div>
            ))}
            <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",fontSize:12}}>
              <span style={{color:T.muted}}>~{totalKm.toLocaleString()} km totales</span>
              <span style={{color:T.muted}}>{totalPDV.toLocaleString()} PDVs</span>
            </div>
          </div>

          {/* SAVED ROUTES */}
          <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontFamily:T.display,fontWeight:700,fontSize:14,color:T.text}}>Rutas guardadas ({rutas.length})</span>
            </div>
            <div style={{maxHeight:360,overflowY:"auto"}}>
              {loadingRutas?<Loader text="Cargando rutas…"/>:rutas.length===0?<div style={{padding:24,textAlign:"center",fontSize:13,color:T.muted}}>Sin rutas guardadas</div>
              :rutas.map(r=>(
                <div key={r.id} className="fade-row" style={{padding:"12px 18px",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}} onClick={()=>setViewRuta(r)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:13,color:T.text}}>{r.nombre}</div>
                    <Tag color={statusColor[r.status]||T.muted} sm>{r.status||"Programada"}</Tag>
                  </div>
                  <div style={{fontSize:11,color:T.muted,marginBottom:4}}>{r.cliente||"Sin cliente"} · {r.stops?.length||0} paradas</div>
                  <div style={{display:"flex",gap:8}}>
                    <Tag color={T.accent} sm>{fmt(r.total||0)}</Tag>
                    <Tag color={T.violet} sm>{r.camionetas||1} vans</Tag>
                    {r.totalPDV>0&&<Tag color={T.blue} sm>{(r.totalPDV||0).toLocaleString()} PDVs</Tag>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RUTA DETAIL MODAL */}
      {viewRuta&&<Modal title={viewRuta.nombre} onClose={()=>setViewRuta(null)} wide icon={Route} iconColor={T.violet}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
          <InfoBox icon={Truck} color={T.accent} title="Camionetas" value={`${viewRuta.camionetas||1} unidades`} sub={VEHICULOS.find(v=>v.k===viewRuta.vehiculo)?.label}/>
          <InfoBox icon={Calendar} color={T.blue} title="Días operación" value={`${viewRuta.diasOp||"—"} días`} sub={`Plazo: ${viewRuta.plazo||"—"} días`}/>
          <InfoBox icon={Package} color={T.violet} title="PDVs totales" value={(viewRuta.totalPDV||0).toLocaleString()} sub={`${viewRuta.capDia||0}/día`}/>
          <InfoBox icon={Globe} color={T.green} title="Kilómetros" value={`~${(viewRuta.totalKm||0).toLocaleString()} km`}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:10,letterSpacing:"0.05em",textTransform:"uppercase"}}>Paradas</div>
          {(viewRuta.stops||[]).map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:`${T.accent}14`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:T.accent,flexShrink:0}}>{i+1}</div>
              <div style={{flex:1,fontWeight:600,fontSize:13}}>{s.city}</div>
              {s.pdv>0&&<Tag color={T.accent} sm>{s.pdv} PDVs</Tag>}
              {s.km>0&&<span style={{fontFamily:T.mono,fontSize:10,color:T.muted}}>{s.km.toLocaleString()} km</span>}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10}}>
          {viewRuta.mapsURL&&<a href={viewRuta.mapsURL} target="_blank" rel="noopener noreferrer" className="btn" style={{flex:1,padding:"11px 0",borderRadius:11,background:T.blueDim,border:`1.5px solid ${T.blue}28`,color:T.blue,textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:T.sans,fontWeight:700,fontSize:14}}><Globe size={15}/>Google Maps</a>}
          <button onClick={()=>{generateQuotePDF({...viewRuta,lines:[{label:"Tarifa transporte",value:fmt(viewRuta.tarifaTransp||0)},{label:"Viáticos",value:fmt(viewRuta.xViatic||0)},{label:"Subtotal",value:fmt(viewRuta.subtotal||0)},{label:"IVA 16%",value:fmt(viewRuta.iva||0)},{label:"TOTAL",value:fmt(viewRuta.total||0),bold:true,color:T.accent}]});}} className="btn" style={{flex:1,padding:"11px 0",borderRadius:11,background:"#ffffff",border:`1.5px solid ${T.border2}`,cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,color:T.text,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Printer size={15}/>PDF</button>
          <button onClick={async()=>{await updateDoc(doc(db,"rutas",viewRuta.id),{status:viewRuta.status==="En curso"?"Completada":"En curso"});setViewRuta(null);}} className="btn" style={{flex:1,padding:"11px 0",borderRadius:11,background:`linear-gradient(135deg,${T.accent},#fb923c)`,border:"none",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{viewRuta.status==="En curso"?<><CheckCircle size={15}/>Completar</>:<><Navigation size={15}/>Iniciar</>}</button>
        </div>
      </Modal>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FACTURACIÓN — CON PDF PROFESIONAL
═══════════════════════════════════════════════════════════════════════════ */
function Facturas(){
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);const [toast,setToast]=useState(null);
  const [filtroMes,setFiltroMes]=useState("todos");
  const [form,setForm]=useState({cliente:"",servicio:"",concepto:"",monto:"",iva:true,status:"Pendiente",notas:""});
  const showToast=(m,t="ok")=>{setToast({msg:m,type:t});};
  useEffect(()=>{const u=onSnapshot(collection(db,"facturas"),s=>{setItems(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));setLoading(false);});return u;},[]);
  const save=async()=>{if(!form.cliente||!form.monto){showToast("Cliente y monto son requeridos","err");return;}
    const monto=parseFloat(form.monto)||0;const iva=form.iva?monto*.16:0;const total=monto+iva;
    const folio="FAC-"+Date.now().toString(36).slice(-6).toUpperCase();
    try{await addDoc(collection(db,"facturas"),{...form,monto,iva,total,folio,createdAt:serverTimestamp()});setModal(false);setForm({cliente:"",servicio:"",concepto:"",monto:"",iva:true,status:"Pendiente",notas:""});showToast("✓ Factura creada");}catch(e){showToast(e.message,"err");}};
  const del=async(id)=>{if(!window.confirm("¿Eliminar?"))return;await deleteDoc(doc(db,"facturas",id));showToast("Eliminada");};
  const updateStatus=async(id,status)=>updateDoc(doc(db,"facturas",id),{status});
  const meses=["todos","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const filtered=filtroMes==="todos"?items:items.filter(f=>{const d=f.createdAt?.seconds;return d&&new Date(d*1000).getMonth()===meses.indexOf(filtroMes)-1;});
  const total=filtered.reduce((a,f)=>a+(f.total||0),0);
  const cobrado=filtered.filter(f=>f.status==="Pagada").reduce((a,f)=>a+(f.total||0),0);
  const pendiente=filtered.filter(f=>f.status==="Pendiente").reduce((a,f)=>a+(f.total||0),0);
  const handlePDF=async(f)=>{
    generateQuotePDF({
      folio:f.folio||"FAC",cliente:f.cliente,modo:"factura",
      destino:f.servicio||"Servicio logístico",vehiculoLabel:f.concepto||"",
      lines:[
        {label:"Subtotal",value:fmt(f.monto||0)},
        f.iva>0&&{label:"IVA 16%",value:fmt(f.iva||0),color:T.muted},
        {label:"TOTAL",value:fmt(f.total||0),bold:true,color:T.accent},
      ].filter(Boolean),
      notas:f.notas||"Factura emitida conforme a los servicios prestados.",
      total:f.total||0,
    });
  };
  const statusColor={Pendiente:T.amber,Pagada:T.green,Vencida:T.rose};
  return(
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="au" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Facturación</h1><p style={{color:T.muted,fontSize:13,marginTop:4}}>Gestión de cobros y emisión de facturas en PDF</p></div>
        <button onClick={()=>setModal(true)} className="btn" style={{display:"flex",alignItems:"center",gap:8,background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",borderRadius:12,padding:"11px 20px",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,boxShadow:`0 4px 20px ${T.accent}30`}}><Plus size={15}/>Nueva factura</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <KpiCard icon={BarChart2} color={T.blue} label="Total emitido" value={fmtK(total)} sub={`${filtered.length} facturas`}/>
        <KpiCard icon={CheckCircle} color={T.green} label="Cobrado" value={fmtK(cobrado)} sub="facturas pagadas"/>
        <KpiCard icon={Clock} color={T.amber} label="Pendiente" value={fmtK(pendiente)} sub="por cobrar"/>
        <KpiCard icon={AlertCircle} color={T.rose} label="Vencido" value={fmtK(filtered.filter(f=>f.status==="Vencida").reduce((a,f)=>a+(f.total||0),0))} sub="facturas vencidas"/>
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {meses.map(m=>(
          <button key={m} onClick={()=>setFiltroMes(m)} className="btn" style={{padding:"6px 14px",borderRadius:8,border:`1.5px solid ${filtroMes===m?T.accent:T.border2}`,background:filtroMes===m?`${T.accent}12`:"transparent",color:filtroMes===m?T.accent:T.muted,fontFamily:T.sans,fontSize:12,fontWeight:filtroMes===m?700:500,cursor:"pointer"}}>{m==="todos"?"Todos":m}</button>
        ))}
      </div>

      {loading?<Loader/>:<div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
        {filtered.length===0?<div style={{padding:48,textAlign:"center",color:T.muted,fontSize:13}}>Sin facturas. <button onClick={()=>setModal(true)} style={{color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Crear →</button></div>
        :<table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
            {["Folio","Cliente","Servicio","Subtotal","IVA","Total","Fecha","Estado",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontFamily:T.sans,fontSize:11,color:T.muted,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((f,i)=>(
              <tr key={f.id||i} className="fade-row" style={{borderBottom:`1px solid ${T.border}`}}>
                <td style={{padding:"12px 14px",fontFamily:T.mono,fontSize:11,color:T.muted}}>{f.folio||"—"}</td>
                <td style={{padding:"12px 14px",fontFamily:T.sans,fontSize:13,fontWeight:700,color:T.text}}>{f.cliente}</td>
                <td style={{padding:"12px 14px",fontFamily:T.sans,fontSize:12,color:T.muted,maxWidth:160}}>{f.servicio||"—"}</td>
                <td style={{padding:"12px 14px",fontFamily:T.mono,fontSize:12,color:T.text}}>{fmt(f.monto||0)}</td>
                <td style={{padding:"12px 14px",fontFamily:T.mono,fontSize:12,color:T.muted}}>{fmt(f.iva||0)}</td>
                <td style={{padding:"12px 14px",fontFamily:T.mono,fontSize:13,fontWeight:700,color:T.text}}>{fmt(f.total||0)}</td>
                <td style={{padding:"12px 14px",fontFamily:T.mono,fontSize:11,color:T.muted}}>{f.createdAt?.seconds?new Date(f.createdAt.seconds*1000).toLocaleDateString("es-MX"):"—"}</td>
                <td style={{padding:"12px 14px"}}>
                  <select value={f.status||"Pendiente"} onChange={e=>updateStatus(f.id,e.target.value)} style={{background:"transparent",border:`1.5px solid ${statusColor[f.status]||T.muted}28`,borderRadius:8,padding:"3px 8px",color:statusColor[f.status]||T.muted,fontFamily:T.sans,fontSize:11,fontWeight:700,cursor:"pointer",outline:"none"}}>
                    {["Pendiente","Pagada","Vencida"].map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{padding:"12px 14px",display:"flex",gap:6}}>
                  <button onClick={()=>handlePDF(f)} className="btn" style={{border:"none",background:"transparent",cursor:"pointer",color:T.blue}}><Printer size={13}/></button>
                  <button onClick={()=>del(f.id)} className="btn" style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted}}><Trash2 size={13}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>}

      {modal&&<Modal title="Nueva factura" onClose={()=>setModal(false)} icon={FileText} iconColor={T.blue}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Input label="Cliente *" value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})} placeholder="Nombre de la empresa"/>
          <Input label="Servicio / Descripción" value={form.servicio} onChange={e=>setForm({...form,servicio:e.target.value})} placeholder="Ej: Distribución masiva MTY"/>
          <Input label="Concepto adicional" value={form.concepto} onChange={e=>setForm({...form,concepto:e.target.value})} placeholder="Referencia de ruta, folio, etc."/>
          <Input label="Monto sin IVA *" type="number" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} placeholder="0.00"/>
          <Toggle checked={form.iva} onChange={v=>setForm({...form,iva:v})} label="Incluir IVA 16%" sub={form.monto?`IVA: ${fmt((parseFloat(form.monto)||0)*.16)}`:"Cálculo automático"} accent={T.blue}/>
          <div style={{padding:"12px 14px",background:T.accentDim,borderRadius:10,border:`1px solid ${T.accent}28`}}>
            <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Total a facturar</div>
            <div style={{fontFamily:T.mono,fontSize:24,fontWeight:700,color:T.accent}}>
              {fmt((parseFloat(form.monto)||0)+(form.iva?(parseFloat(form.monto)||0)*.16:0))}
            </div>
          </div>
          <Select label="Estado" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} options={["Pendiente","Pagada"]}/>
          <Textarea label="Notas" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})} placeholder="Notas adicionales…"/>
          <button onClick={save} className="btn" style={{background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",borderRadius:12,padding:"13px 0",cursor:"pointer",fontFamily:T.display,fontWeight:700,fontSize:16}}>Crear factura</button>
        </div>
      </Modal>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CLIENTES
═══════════════════════════════════════════════════════════════════════════ */
function Clientes(){
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(false);const [toast,setToast]=useState(null);
  const [search,setSearch]=useState("");
  const [form,setForm]=useState({nombre:"",contacto:"",email:"",tel:"",rfc:"",plan:"Standard",notas:""});
  const showToast=(m,t="ok")=>{setToast({msg:m,type:t});};
  useEffect(()=>{const u=onSnapshot(collection(db,"cuentas"),s=>{setItems(s.docs.map(d=>({id:d.id,...d.data()})));setLoading(false);});return u;},[]);
  const save=async()=>{if(!form.nombre){showToast("Nombre requerido","err");return;}try{await addDoc(collection(db,"cuentas"),{...form,createdAt:serverTimestamp()});setModal(false);setForm({nombre:"",contacto:"",email:"",tel:"",rfc:"",plan:"Standard",notas:""});showToast("✓ Cliente creado");}catch(e){showToast(e.message,"err");}};
  const del=async(id)=>{if(!window.confirm("¿Eliminar?"))return;await deleteDoc(doc(db,"cuentas",id));showToast("Eliminado");};
  const filt=items.filter(c=>c.nombre?.toLowerCase().includes(search.toLowerCase())||c.contacto?.toLowerCase().includes(search.toLowerCase()));
  const planColor={Enterprise:T.accent,Premium:T.violet,Standard:T.blue,Básico:T.muted};
  return(
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="au" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Clientes</h1><p style={{color:T.muted,fontSize:13,marginTop:4}}>{items.length} cuentas activas</p></div>
        <button onClick={()=>setModal(true)} className="btn" style={{display:"flex",alignItems:"center",gap:8,background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",borderRadius:12,padding:"11px 20px",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,boxShadow:`0 4px 20px ${T.accent}30`}}><Plus size={15}/>Nuevo cliente</button>
      </div>
      <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,marginBottom:14}}><Search size={14} color={T.muted}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente…" style={{background:"none",border:"none",color:T.text,fontFamily:T.sans,fontSize:13,outline:"none",flex:1}}/></div>
      {loading?<Loader/>:<div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
        {filt.length===0?<div style={{padding:48,textAlign:"center",color:T.muted,fontSize:13}}>Sin clientes. <button onClick={()=>setModal(true)} style={{color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Agregar →</button></div>
        :<table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
            {["Empresa","Plan","Contacto","Email / Tel","RFC",""].map(h=><th key={h} style={{padding:"10px 18px",textAlign:"left",fontFamily:T.sans,fontSize:11,color:T.muted,fontWeight:700,letterSpacing:"0.04em",textTransform:"uppercase"}}>{h}</th>)}
          </tr></thead>
          <tbody>{filt.map((c,i)=>(
            <tr key={c.id||i} className="fade-row" style={{borderBottom:`1px solid ${T.border}`}}>
              <td style={{padding:"13px 18px",fontWeight:700,fontSize:13,color:T.text}}>{c.nombre}</td>
              <td style={{padding:"13px 18px"}}><Tag color={planColor[c.plan]||T.muted}>{c.plan}</Tag></td>
              <td style={{padding:"13px 18px",fontSize:12,color:T.muted}}>{c.contacto||"—"}</td>
              <td style={{padding:"13px 18px",fontSize:12,color:T.muted}}>{[c.email,c.tel].filter(Boolean).join(" · ")||"—"}</td>
              <td style={{padding:"13px 18px",fontFamily:T.mono,fontSize:11,color:T.muted}}>{c.rfc||"—"}</td>
              <td style={{padding:"13px 18px"}}><button onClick={()=>del(c.id)} className="btn" style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted}}><Trash2 size={13}/></button></td>
            </tr>
          ))}</tbody>
        </table>}
      </div>}
      {modal&&<Modal title="Nuevo cliente" onClose={()=>setModal(false)} icon={Building2} iconColor={T.blue}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Input label="Empresa / Nombre *" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Ej: Walmart de México"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Contacto" value={form.contacto} onChange={e=>setForm({...form,contacto:e.target.value})} placeholder="Nombre del contacto"/>
            <Input label="Teléfono" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="+52 55 0000 0000"/>
            <Input label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="correo@empresa.com"/>
            <Input label="RFC" value={form.rfc} onChange={e=>setForm({...form,rfc:e.target.value})} placeholder="XAXX010101000"/>
          </div>
          <div><div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:8,letterSpacing:"0.05em",textTransform:"uppercase"}}>Plan</div>
          <div style={{display:"flex",gap:8}}>{["Básico","Standard","Premium","Enterprise"].map(p=>(
            <button key={p} onClick={()=>setForm({...form,plan:p})} className="btn" style={{flex:1,padding:"9px 0",borderRadius:10,border:`2px solid ${form.plan===p?(planColor[p]||T.accent):T.border2}`,background:form.plan===p?`${planColor[p]||T.accent}10`:"transparent",color:form.plan===p?(planColor[p]||T.accent):T.muted,cursor:"pointer",fontSize:12,fontWeight:form.plan===p?700:500}}>{p}</button>
          ))}</div></div>
          <Textarea label="Notas" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})} placeholder="Notas internas…"/>
          <button onClick={save} className="btn" style={{background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",borderRadius:12,padding:"13px 0",cursor:"pointer",fontFamily:T.display,fontWeight:700,fontSize:16}}>Crear cliente</button>
        </div>
      </Modal>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENTREGAS
═══════════════════════════════════════════════════════════════════════════ */
function Entregas(){
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({pdv:"",dir:"",receptor:"",notas:"",status:"Entregado"});
  const [toast,setToast]=useState(null);const [search,setSearch]=useState("");
  const showToast=(m,t="ok")=>{setToast({msg:m,type:t});};
  useEffect(()=>{const u=onSnapshot(collection(db,"entregas"),s=>{setItems(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));setLoading(false);});return u;},[]);
  const save=async()=>{if(!form.pdv){showToast("PDV requerido","err");return;}try{await addDoc(collection(db,"entregas"),{...form,hora:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}),createdAt:serverTimestamp()});setForm({pdv:"",dir:"",receptor:"",notas:"",status:"Entregado"});showToast("✓ Entrega registrada");}catch(e){showToast(e.message,"err");}};
  const del=async(id)=>{await deleteDoc(doc(db,"entregas",id));showToast("Eliminada");};
  const filt=items.filter(e=>e.pdv?.toLowerCase().includes(search.toLowerCase())||e.dir?.toLowerCase().includes(search.toLowerCase()));
  const sc={Entregado:T.green,"En tránsito":T.blue,Pendiente:T.amber,Rechazado:T.rose};
  const entregadas=items.filter(e=>e.status==="Entregado").length;
  return(
    <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div className="au" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Entregas</h1><p style={{color:T.muted,fontSize:13,marginTop:4}}>{items.length} registradas · {entregadas} completadas</p></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["Entregado",T.green],["En tránsito",T.blue],["Pendiente",T.amber]].map(([s,c])=><Tag key={s} color={c}>{items.filter(e=>e.status===s).length} {s}</Tag>)}
        </div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:12,padding:"10px 16px",display:"flex",alignItems:"center",gap:10,flex:1}}><Search size={14} color={T.muted}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar PDV o dirección…" style={{background:"none",border:"none",color:T.text,fontFamily:T.sans,fontSize:13,outline:"none",flex:1}}/></div>
      </div>
      {loading?<Loader/>:(
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {filt.length===0&&<div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13,background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:14}}>Sin entregas registradas.</div>}
          {filt.map((e,i)=>{const col=sc[e.status]||T.muted;return(
            <div key={e.id||i} className="fade-row card-h" style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:13,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:40,height:40,borderRadius:11,background:`${col}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {e.status==="Entregado"?<CheckCircle size={17} color={col}/>:e.status==="En tránsito"?<Navigation size={17} color={col}/>:<Clock size={17} color={col}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:2}}>{e.pdv}</div>
                <div style={{fontSize:11,color:T.muted}}>{e.dir}</div>
                {e.receptor&&<div style={{fontSize:11,color:T.green,marginTop:2}}>✓ Recibió: {e.receptor}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
                <Tag color={col} sm>{e.status}</Tag>
                <span style={{fontFamily:T.mono,fontSize:10,color:T.muted}}>{e.hora} · {e.createdAt?.seconds?new Date(e.createdAt.seconds*1000).toLocaleDateString("es-MX"):"—"}</span>
              </div>
              <button onClick={()=>del(e.id)} className="btn" style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted,flexShrink:0}}><Trash2 size={13}/></button>
            </div>
          );})}
        </div>
      )}
      <div style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:16,padding:22}}>
        <div style={{fontFamily:T.display,fontWeight:700,fontSize:15,color:T.text,marginBottom:16}}>Registrar entrega</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Input label="PDV / Punto de venta *" value={form.pdv} onChange={e=>setForm({...form,pdv:e.target.value})} placeholder="Nombre del PDV"/>
          <Input label="Dirección" value={form.dir} onChange={e=>setForm({...form,dir:e.target.value})} placeholder="Dirección completa"/>
          <Input label="Receptor" value={form.receptor} onChange={e=>setForm({...form,receptor:e.target.value})} placeholder="¿Quién recibió?"/>
          <Select label="Estado" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} options={["Entregado","En tránsito","Pendiente","Rechazado"]}/>
        </div>
        <Textarea label="Notas / Incidencias" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})} placeholder="Observaciones, fotos pendientes, etc."/>
        <button onClick={save} className="btn" style={{display:"flex",alignItems:"center",gap:9,background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:14,marginTop:14,boxShadow:`0 4px 20px ${T.accent}28`}}><CheckCircle size={15}/>Confirmar entrega</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
export default function App(){
  const [view,setView]=useState("dashboard");
  const [cotizaciones,setCotizaciones]=useState([]);
  const [facturas,setFacturas]=useState([]);
  const [rutas,setRutas]=useState([]);
  const [entregas,setEntregas]=useState([]);

  useEffect(()=>{
    const u1=onSnapshot(collection(db,"cotizaciones"),s=>setCotizaciones(s.docs.map(d=>({id:d.id,...d.data()}))));
    const u2=onSnapshot(collection(db,"facturas"),s=>setFacturas(s.docs.map(d=>({id:d.id,...d.data()}))));
    const u3=onSnapshot(collection(db,"rutas"),s=>setRutas(s.docs.map(d=>({id:d.id,...d.data()}))));
    const u4=onSnapshot(collection(db,"entregas"),s=>setEntregas(s.docs.map(d=>({id:d.id,...d.data()}))));
    return()=>{u1();u2();u3();u4();};
  },[]);

  const stats={cotizaciones:cotizaciones.length,facturas:facturas.length,rutas:rutas.length};

  const VIEWS={
    dashboard:<Dashboard setView={setView} cotizaciones={cotizaciones} facturas={facturas} rutas={rutas} entregas={entregas}/>,
    cotizador:<Cotizador onSaved={()=>setView("dashboard")}/>,
    rutas:<PlanificadorRutas onSaved={()=>{}}/>,
    facturas:<Facturas/>,
    cuentas:<Clientes/>,
    entregas:<Entregas/>,
  };

  return(
    <>
      <style>{CSS}</style>
      <div style={{display:"flex",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:T.sans}}>
        <Sidebar view={view} setView={setView} stats={stats}/>
        <main style={{flex:1,overflowY:"auto",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
          {VIEWS[view]||VIEWS.dashboard}
        </main>
      </div>
    </>
  );
}
