import { useState, useRef, useCallback, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy
} from "firebase/firestore";
import {
  Truck, Package, FileText, LayoutDashboard, DollarSign, BarChart3,
  Plus, Search, X, ChevronRight, Check, Minus, MapPin, Clock,
  CheckCircle, Download, Send,  Globe,
  FileUp, Layers, Target, Camera, Navigation, Building2,
  RefreshCw, MoreHorizontal, Edit2, Trash2, AlertCircle
} from "lucide-react";

/* ─── FIREBASE ───────────────────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyB7tuRYUEY471IPJdnOB69DI2yKLCU72T0",
  authDomain: "salesflow-crm-13c4a.firebaseapp.com",
  projectId: "salesflow-crm-13c4a",
  storageBucket: "salesflow-crm-13c4a.firebasestorage.app",
  messagingSenderId: "525995422237",
  appId: "1:525995422237:web:e69d7e7dd76ac9640c8cf4"
};
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ─── FONTS ──────────────────────────────────────────────────────────────── */
const FONT_INJECT = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #0d0f14; }
::-webkit-scrollbar-thumb { background: #2a2f3e; border-radius: 4px; }
@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
.fade-up  { animation: fadeUp .3s ease both; }
.fade-up2 { animation: fadeUp .3s .07s ease both; }
.fade-up3 { animation: fadeUp .3s .14s ease both; }
.card-hover { transition: all .2s ease; }
.card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,.45); }
.btn-p { transition: all .15s ease; }
.btn-p:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-p:active { transform: translateY(0); }
.spin { animation: spin 1s linear infinite; }
`;

/* ─── THEME ──────────────────────────────────────────────────────────────── */
const T = {
  bg:"#080a10", surface:"#0d1017", card:"#111520", border:"#1c2235",
  border2:"#242a3a", text:"#e8eaf2", muted:"#5a6280",
  accent:"#f97316", blue:"#3b82f6", green:"#10b981",
  violet:"#8b5cf6", rose:"#f43f5e", amber:"#f59e0b",
  mono:"'Space Mono',monospace", sans:"'DM Sans',sans-serif",
  display:"'Syne',sans-serif",
};

/* ─── TARIFARIO 2026 ─────────────────────────────────────────────────────── */
const TARIFA = [
  {c:"Acapulco",km:395,eur:13310,cam:20086,rab:22083,mud:26741,xl:32561},
  {c:"Aguascalientes",km:513,eur:15178,cam:22215,rab:24437,mud:30356,xl:36566},
  {c:"Apizaco",km:145,eur:6899,cam:11540,rab:12858,mud:17399,xl:22103},
  {c:"Campeche",km:1155,eur:29667,cam:40241,rab:44657,mud:50678,xl:61817},
  {c:"Cancún",km:1649,eur:40204,cam:58455,rab:64476,mud:73571,xl:88059},
  {c:"CDMX / Local",km:0,eur:3500,cam:5500,rab:7000,mud:9500,xl:13000},
  {c:"Cd. Juárez",km:1863,eur:47542,cam:60437,rab:67612,mud:83418,xl:92449},
  {c:"Cd. Victoria",km:721,eur:20560,cam:28977,rab:31874,mud:37256,xl:43741},
  {c:"Celaya",km:263,eur:8279,cam:12695,rab:13964,mud:18628,xl:24147},
  {c:"Chetumal",km:1345,eur:30356,cam:46225,rab:50847,mud:55884,xl:64852},
  {c:"Chihuahua",km:1487,eur:23206,cam:31485,rab:35123,mud:42022,xl:50051},
  {c:"Chilpancingo",km:310,eur:9659,cam:15178,rab:16696,mud:22077,xl:26907},
  {c:"Coatzacoalcos",km:601,eur:17938,cam:24561,rab:27017,mud:29391,xl:35876},
  {c:"Colima",km:744,eur:19732,cam:28839,rab:31723,mud:35876,xl:42775},
  {c:"Cuernavaca",km:89,eur:3864,cam:6899,rab:7589,mud:10763,xl:15454},
  {c:"Culiacán",km:1262,eur:29805,cam:46225,rab:50847,mud:55884,xl:64602},
  {c:"Durango",km:915,eur:23043,cam:28977,rab:31874,mud:38636,xl:44845},
  {c:"Ensenada",km:2961,eur:59333,cam:75891,rab:83480,mud:89690,xl:107628},
  {c:"Gómez Palacio",km:985,eur:22767,cam:33116,rab:36428,mud:45535,xl:52434},
  {c:"Guadalajara",km:542,eur:15178,cam:22215,rab:24437,mud:30356,xl:36566},
  {c:"Hermosillo",km:1959,eur:48018,cam:63887,rab:70275,mud:74386,xl:84170},
  {c:"Iguala",km:203,eur:8279,cam:13108,rab:14419,mud:21388,xl:23871},
  {c:"Irapuato",km:323,eur:12419,cam:18628,rab:20491,mud:25527,xl:32313},
  {c:"Jalapa / Xalapa",km:323,eur:12419,cam:18628,rab:20491,mud:25527,xl:29805},
  {c:"La Paz BCS",km:2200,eur:77271,cam:104868,rab:115355,mud:124186,xl:135224},
  {c:"Laredo",km:1117,eur:26493,cam:37394,rab:41133,mud:49536,xl:59935},
  {c:"León",km:392,eur:13108,cam:20284,rab:22312,mud:25665,xl:34822},
  {c:"Los Mochis",km:1442,eur:33806,cam:48984,rab:53883,mud:59333,xl:68302},
  {c:"Matamoros",km:975,eur:23871,cam:34220,rab:37642,mud:46225,xl:53124},
  {c:"Mazatlán",km:1042,eur:26631,cam:37394,rab:41133,mud:50502,xl:60023},
  {c:"Mérida",km:1332,eur:32991,cam:47604,rab:52622,mud:62532,xl:71990},
  {c:"Mexicali",km:2580,eur:55000,cam:72000,rab:79000,mud:88000,xl:103000},
  {c:"Minatitlán",km:1021,eur:26970,cam:38636,rab:42524,mud:50301,xl:58580},
  {c:"Monclova",km:933,eur:21325,cam:28475,rab:31423,mud:43904,xl:54566},
  {c:"Monterrey",km:942,eur:22000,cam:32000,rab:35200,mud:41000,xl:49000},
  {c:"Morelia",km:302,eur:12419,cam:18628,rab:20491,mud:25527,xl:32313},
  {c:"Oaxaca",km:470,eur:12419,cam:18628,rab:20491,mud:25527,xl:32313},
  {c:"Orizaba",km:269,eur:11039,cam:18628,rab:20491,mud:24147,xl:28977},
  {c:"Pachuca",km:95,eur:4390,cam:7777,rab:8655,mud:12293,xl:16934},
  {c:"Puebla",km:123,eur:5080,cam:7727,rab:8718,mud:13610,xl:16809},
  {c:"Puerto Vallarta",km:849,eur:17938,cam:25527,rab:28080,mud:35600,xl:42085},
  {c:"Querétaro",km:187,eur:8279,cam:13108,rab:14419,mud:19732,xl:25251},
  {c:"Reynosa",km:1286,eur:34621,cam:51807,rab:58204,mud:69556,xl:80633},
  {c:"Saltillo",km:279,eur:11039,cam:18628,rab:20491,mud:24147,xl:28977},
  {c:"San Luis Potosí",km:424,eur:13108,cam:20491,rab:22490,mud:26000,xl:33000},
  {c:"Tampico",km:415,eur:13108,cam:18628,rab:20491,mud:25113,xl:30231},
  {c:"Tapachula",km:1157,eur:29102,cam:42900,rab:47291,mud:56385,xl:67863},
  {c:"Tepic",km:756,eur:21939,cam:28839,rab:31723,mud:39739,xl:50991},
  {c:"Tijuana",km:2848,eur:63347,cam:81787,rab:90066,mud:104993,xl:120548},
  {c:"Tlaxcala",km:118,eur:5381,cam:9659,rab:10625,mud:12419,xl:16420},
  {c:"Toluca",km:66,eur:4290,cam:7700,rab:8470,mud:11415,xl:16182},
  {c:"Torreón",km:1020,eur:22767,cam:33116,rab:36428,mud:45535,xl:52434},
  {c:"Tuxtla Gutiérrez",km:1015,eur:25966,cam:35261,rab:39338,mud:48445,xl:62344},
  {c:"Veracruz",km:402,eur:14676,cam:22705,rab:25025,mud:29478,xl:37331},
  {c:"Villahermosa",km:768,eur:20698,cam:31874,rab:35062,mud:40843,xl:49147},
  {c:"Zacatecas",km:605,eur:17248,cam:26217,rab:28839,mud:36497,xl:45535},
  {c:"Zamora",km:430,eur:13108,cam:20491,rab:22490,mud:26000,xl:33000},
];

const VEHICULOS = [
  {k:"eur",label:"Eurovan 1T",cap:"8 m³",icon:"🚐"},
  {k:"cam",label:"Camioneta 3.5T",cap:"16 m³",icon:"🚛"},
  {k:"rab",label:"Rabón 40 m³",cap:"40 m³",icon:"🚚"},
  {k:"mud",label:"Mudancero 70 m³",cap:"70 m³",icon:"🏗️"},
  {k:"xl",label:"Torton XL",cap:"100 m³",icon:"🚢"},
];

const fmt  = n => `$${Math.round(n).toLocaleString("es-MX")}`;
const fmtK = n => n>=1e6?`$${(n/1e6).toFixed(2)}M`:n>=1e3?`$${(n/1e3).toFixed(0)}k`:`$${Math.round(n)}`;

/* ─── SHARED UI ──────────────────────────────────────────────────────────── */
function Tag({ color = T.accent, children }) {
  return <span style={{background:`${color}18`,color,border:`1px solid ${color}28`,
    borderRadius:6,padding:"2px 10px",fontSize:11,fontWeight:700,
    fontFamily:T.sans,letterSpacing:"0.04em",whiteSpace:"nowrap"}}>{children}</span>;
}

function Loader({ text = "Cargando..." }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      height:"100%",minHeight:300,flexDirection:"column",gap:16}}>
      <div style={{width:36,height:36,border:`3px solid ${T.border2}`,
        borderTop:`3px solid ${T.accent}`,borderRadius:"50%"}} className="spin"/>
      <span style={{fontFamily:T.sans,fontSize:13,color:T.muted}}>{text}</span>
    </div>
  );
}

function Toast({ msg, type = "ok" }) {
  const c = type === "ok" ? T.green : T.rose;
  return (
    <div style={{position:"fixed",top:20,right:24,zIndex:9999,
      background:T.card,border:`1px solid ${c}40`,borderRadius:12,
      padding:"10px 18px",display:"flex",alignItems:"center",gap:10,
      boxShadow:`0 4px 24px #0009`,fontFamily:T.sans,fontSize:13,color:T.text}}>
      <div style={{width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}}/>
      {msg}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label style={{display:"block",fontFamily:T.sans,fontSize:11,
        fontWeight:600,color:T.muted,marginBottom:6,
        letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</label>}
      <input {...props} style={{width:"100%",background:"#161c2a",
        border:`1px solid ${T.border2}`,borderRadius:10,padding:"10px 14px",
        color:T.text,fontFamily:T.sans,fontSize:14,outline:"none",
        transition:"border-color .15s",...props.style}}
        onFocus={e=>e.target.style.borderColor=T.accent}
        onBlur={e=>e.target.style.borderColor=T.border2}/>
    </div>
  );
}

function Stepper({ value, onChange, min = 0, max = 99999 }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <button onClick={() => onChange(Math.max(min, value-1))}
        style={{width:30,height:30,borderRadius:8,border:`1px solid ${T.border2}`,
          background:"transparent",cursor:"pointer",color:T.muted,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Minus size={12}/>
      </button>
      <input type="number" value={value}
        onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value)||min)))}
        style={{width:64,textAlign:"center",background:"#161c2a",border:`1px solid ${T.border2}`,
          borderRadius:8,padding:"6px 4px",color:T.text,fontFamily:T.mono,
          fontSize:14,fontWeight:700,outline:"none"}}/>
      <button onClick={() => onChange(Math.min(max, value+1))}
        style={{width:30,height:30,borderRadius:8,border:`1px solid ${T.border2}`,
          background:"transparent",cursor:"pointer",color:T.muted,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Plus size={12}/>
      </button>
    </div>
  );
}

function Toggle({ checked, onChange, label, sub, accent = T.accent }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
        borderRadius:11,border:`1px solid ${checked?accent:T.border2}`,
        background:checked?`${accent}0e`:"transparent",cursor:"pointer",
        transition:"all .15s",width:"100%",textAlign:"left"}}>
      <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,
        border:`2px solid ${checked?accent:T.border2}`,
        background:checked?accent:"transparent",
        display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>
        {checked && <Check size={11} color="#fff"/>}
      </div>
      <div>
        <div style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text}}>{label}</div>
        {sub && <div style={{fontFamily:T.sans,fontSize:11,color:T.muted,marginTop:1}}>{sub}</div>}
      </div>
    </button>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",
      zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",
      padding:16,backdropFilter:"blur(4px)"}}>
      <div style={{background:T.card,border:`1px solid ${T.border}`,
        borderRadius:20,width:"100%",maxWidth:wide?640:460,
        maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 80px #000c"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"20px 24px",borderBottom:`1px solid ${T.border}`,
          position:"sticky",top:0,background:T.card,zIndex:10}}>
          <span style={{fontFamily:T.display,fontWeight:700,fontSize:16,color:T.text}}>{title}</span>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:"50%",
            border:`1px solid ${T.border2}`,background:"transparent",
            cursor:"pointer",color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <X size={15}/>
          </button>
        </div>
        <div style={{padding:24}}>{children}</div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
const NAV = [
  {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
  {id:"cotizador",label:"Cotizador",icon:DollarSign},
  {id:"cuentas",label:"Cuentas",icon:Building2},
  {id:"facturas",label:"Facturación",icon:FileText},
  {id:"rutas", label:"Rutas", icon:MapPin
  {id:"entregas",label:"Entregas",icon:Package},
];

function Sidebar({ view, setView, stats }) {
  return (
    <aside style={{width:214,background:T.surface,borderRight:`1px solid ${T.border}`,
      display:"flex",flexDirection:"column",height:"100vh",
      position:"sticky",top:0,flexShrink:0}}>
      <div style={{padding:"22px 18px 18px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,background:`linear-gradient(135deg,${T.accent},#fb923c)`,
            borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 4px 16px ${T.accent}40`,flexShrink:0}}>
            <Truck size={18} color="#fff"/>
          </div>
          <div>
            <div style={{fontFamily:T.display,fontWeight:800,fontSize:16,color:T.text,letterSpacing:"-0.02em"}}>DMvimiento</div>
            <div style={{fontFamily:T.sans,fontSize:10,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase"}}>Logistics OS</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
        {NAV.map(({id,label,icon:Icon}) => {
          const a = view===id;
          return (
            <button key={id} onClick={() => setView(id)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,
                padding:"9px 12px",borderRadius:10,marginBottom:2,
                cursor:"pointer",border:"none",transition:"all .15s",
                background:a?`${T.accent}14`:"transparent",color:a?T.accent:T.muted}}>
              <Icon size={16}/>
              <span style={{fontFamily:T.sans,fontSize:13,fontWeight:a?700:500,color:a?T.text:T.muted}}>{label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{padding:"14px 18px",borderTop:`1px solid ${T.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}`}}/>
          <span style={{fontFamily:T.mono,fontSize:10,color:T.muted}}>Firebase · Tiempo real</span>
        </div>
        <div style={{fontFamily:T.mono,fontSize:10,color:T.muted,lineHeight:1.6}}>
          {stats.cotizaciones} cotizaciones · {stats.facturas} facturas
        </div>
      </div>
    </aside>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */
function Dashboard({ setView, cotizaciones, facturas, entregas }) {
  const totalFacturado = facturas.reduce((a,f) => a+(f.total||0), 0);
  const pendiente = facturas.filter(f=>f.status==="Pendiente").reduce((a,f)=>a+(f.total||0),0);
  const recientes = [...cotizaciones].sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)).slice(0,4);

  return (
    <div style={{padding:"32px 36px",flex:1,overflowY:"auto"}}>
      <div className="fade-up" style={{marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Operations Center</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:5}}>
            {new Date().toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
          </p>
        </div>
        <button onClick={()=>setView("cotizador")} className="btn-p"
          style={{display:"flex",alignItems:"center",gap:8,
            background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",
            border:"none",borderRadius:12,padding:"11px 20px",cursor:"pointer",
            fontFamily:T.sans,fontWeight:700,fontSize:13,boxShadow:`0 4px 20px ${T.accent}38`}}>
          <DollarSign size={16}/> Nueva Cotización
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {[
          {label:"Cotizaciones",value:cotizaciones.length,sub:"en sistema",icon:DollarSign,color:T.accent},
          {label:"Facturado",value:fmtK(totalFacturado),sub:"total emitido",icon:FileText,color:T.green},
          {label:"Por cobrar",value:fmtK(pendiente),sub:"pendiente",icon:Target,color:T.amber},
          {label:"Entregas",value:entregas.length,sub:"registradas",icon:Package,color:T.blue},
        ].map(({label,value,sub,icon:Icon,color},i) => (
          <div key={label} className={`fade-up card-hover`} style={{animationDelay:`${i*0.06}s`,
            background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontFamily:T.sans,fontSize:11,color:T.muted,fontWeight:600,
                letterSpacing:"0.05em",textTransform:"uppercase"}}>{label}</span>
              <div style={{width:34,height:34,borderRadius:10,background:`${color}16`,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon size={15} color={color}/>
              </div>
            </div>
            <div style={{fontFamily:T.mono,fontSize:24,fontWeight:700,color:T.text,lineHeight:1}}>{value}</div>
            <div style={{fontFamily:T.sans,fontSize:12,color:T.muted,marginTop:5}}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16}}>
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
          <div style={{padding:"18px 22px",borderBottom:`1px solid ${T.border}`,
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:T.display,fontWeight:700,fontSize:14,color:T.text}}>Cotizaciones recientes</span>
            <button onClick={()=>setView("cotizador")} style={{fontFamily:T.sans,fontSize:12,
              color:T.accent,background:"none",border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",gap:4}}>
              Nueva <Plus size={13}/>
            </button>
          </div>
          {recientes.length === 0
            ? <div style={{padding:40,textAlign:"center",color:T.muted,fontFamily:T.sans,fontSize:13}}>
                Aún no hay cotizaciones. <br/>
                <button onClick={()=>setView("cotizador")} style={{color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700,marginTop:8}}>Crear la primera →</button>
              </div>
            : <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{borderBottom:`1px solid ${T.border}`}}>
                    {["Cliente","Tipo","Monto","Fecha",""].map(h=>(
                      <th key={h} style={{padding:"10px 20px",textAlign:"left",fontFamily:T.sans,
                        fontSize:11,color:T.muted,fontWeight:600,
                        letterSpacing:"0.05em",textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recientes.map((q,i)=>(
                    <tr key={q.id||i} style={{borderBottom:`1px solid ${T.border}`,transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#161e30"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"13px 20px",fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text}}>
                        {q.cliente||"—"}
                      </td>
                      <td style={{padding:"13px 20px"}}>
                        <Tag color={q.modo==="masivo"?T.blue:T.accent}>{q.modo==="masivo"?"PDV Masivo":"Servicio"}</Tag>
                      </td>
                      <td style={{padding:"13px 20px",fontFamily:T.mono,fontSize:12,fontWeight:700,color:T.text}}>
                        {fmt(q.total||0)}
                      </td>
                      <td style={{padding:"13px 20px",fontFamily:T.mono,fontSize:11,color:T.muted}}>
                        {q.createdAt?.seconds ? new Date(q.createdAt.seconds*1000).toLocaleDateString("es-MX") : "—"}
                      </td>
                      <td style={{padding:"13px 20px"}}>
                        <Tag color={T.green}>Cotizada</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:20}}>
            <div style={{fontFamily:T.display,fontWeight:700,fontSize:14,color:T.text,marginBottom:14}}>Módulos</div>
            {[
              {label:"Cotizador inteligente",sub:"1 servicio ó 10,000 PDV",icon:DollarSign,color:T.accent,v:"cotizador"},
              {label:"Cuentas & clientes",sub:"Gestión de contratos",icon:Building2,color:T.blue,v:"cuentas"},
              {label:"Rutas nacionales",sub:"Planificador por célula",icon:Route,color:T.violet,v:"rutas"},
              {label:"Seguimiento entregas",sub:"Evidencia fotográfica",icon:Package,color:T.green,v:"entregas"},
            ].map(({label,sub,icon:Icon,color,v})=>(
              <button key={v} onClick={()=>setView(v)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:11,
                  padding:"9px 10px",borderRadius:10,border:`1px solid ${T.border}`,
                  background:"transparent",cursor:"pointer",marginBottom:5,transition:"all .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="#161e30"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:32,height:32,borderRadius:9,background:`${color}16`,
                  display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon size={14} color={color}/>
                </div>
                <div style={{textAlign:"left",flex:1}}>
                  <div style={{fontFamily:T.sans,fontSize:12,fontWeight:600,color:T.text}}>{label}</div>
                  <div style={{fontFamily:T.sans,fontSize:11,color:T.muted}}>{sub}</div>
                </div>
                <ChevronRight size={13} color={T.muted}/>
              </button>
            ))}
          </div>
          <div style={{background:`linear-gradient(135deg,#0a1628,#0d1e38)`,
            border:`1px solid ${T.blue}28`,borderRadius:16,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}`}}/>
              <span style={{fontFamily:T.mono,fontSize:10,color:T.blue,letterSpacing:"0.06em",textTransform:"uppercase"}}>En vivo</span>
            </div>
            <div style={{fontFamily:T.display,fontWeight:800,fontSize:20,color:T.text,marginBottom:4}}>Datos compartidos</div>
            <div style={{fontFamily:T.sans,fontSize:12,color:T.muted}}>
              Toda tu operación sincronizada en tiempo real. Cotizaciones, cuentas, facturas y rutas — siempre actualizados para todo el equipo.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── COTIZADOR ──────────────────────────────────────────────────────────── */
function Cotizador({ onSave }) {
  const [modo, setModo]       = useState("simple");
  const [cliente, setCliente] = useState("");
  const [quoted, setQuoted]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  // Simple
  const [search, setSearch]     = useState("");
  const [showDD, setShowDD]     = useState(false);
  const [destino, setDestino]   = useState(null);
  const [vehiculo, setVehiculo] = useState("cam");
  const [urgente, setUrgente]   = useState(false);
  const [maniobra, setManiobra] = useState(false);
  const [numAyud, setNumAyud]   = useState(1);
  const [paradas, setParadas]   = useState(0);
  const [resguardo, setResguardo] = useState(false);

  // Masivo
  const [totalPDV, setTotalPDV]   = useState(1000);
  const [costoPDV, setCostoPDV]   = useState(975);
  const [entDia, setEntDia]       = useState(7);
  const [celulas, setCelulas]     = useState(5);
  const [usarHubs, setUsarHubs]   = useState(false);
  const [hubMTY, setHubMTY]       = useState(false);
  const [hubCDMX, setHubCDMX]     = useState(false);
  const [hubMID, setHubMID]       = useState(false);
  const [trailer, setTrailer]     = useState(false);
  const [costoTrailer, setCostoTrailer] = useState(45000);
  const [pdvFile, setPdvFile]     = useState("");
  const fileRef = useRef();

  // Calcs simple
  const base  = destino ? destino[vehiculo] : 0;
  const xUrg  = urgente ? base*0.35 : 0;
  const xMan  = maniobra ? 2800*numAyud : 0;
  const xPar  = paradas*1200;
  const xRes  = resguardo ? 1800 : 0;
  const subS  = base+xUrg+xMan+xPar+xRes;
  const ivaS  = subS*0.16;
  const totS  = subS+ivaS;

  // Calcs masivo
  const diasR = celulas>0&&entDia>0 ? Math.ceil(totalPDV/(celulas*entDia)) : 0;
  const semR  = Math.ceil(diasR/5);
  const xEnt  = totalPDV*costoPDV;
  const xTrl  = trailer ? costoTrailer : 0;
  const subM  = xEnt+xTrl;
  const ivaM  = subM*0.16;
  const totM  = subM+ivaM;

  const total = modo==="simple" ? totS : totM;
  const canQ  = modo==="simple" ? !!destino : totalPDV>0;
  const veh   = VEHICULOS.find(v=>v.k===vehiculo);
  const filt  = TARIFA.filter(t=>t.c.toLowerCase().includes(search.toLowerCase()));

  const handleFile = useCallback((file)=>{
    setPdvFile(file.name);
    const r = new FileReader();
    r.onload = e => {
      const s = new TextDecoder("utf-8","replace").decode(new Uint8Array(e.target.result));
      const map={"NL,":"NL","MEX,":"CDMX","DF,":"CDMX","COA,":"Coah","JAL,":"Jal"};
      let tot=0; for(const p of Object.keys(map)){const m=s.match(new RegExp(p,"g"));if(m)tot+=m.length;}
      if(tot>0) setTotalPDV(tot);
    };
    r.readAsArrayBuffer(file);
  },[]);

  const showToast = (msg,type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        cliente, modo, total,
        ...(modo==="simple"
          ? {destino:destino?.c,km:destino?.km,vehiculo:veh?.label,urgente,maniobra,ayudantes:numAyud,paradas,resguardo,subtotal:subS,iva:ivaS}
          : {totalPDV,costoPDV,celulas,entDia,diasReq:diasR,semanas:semR,usarHubs,hubs:[hubMTY&&"MTY",hubCDMX&&"CDMX",hubMID&&"MID"].filter(Boolean),trailer,costoTrailer:xTrl,subtotal:subM,iva:ivaM}
        ),
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db,"cotizaciones"), data);
      onSave && onSave(data);
      showToast("Cotización guardada en Firebase ✓");
    } catch(e) { showToast("Error: "+e.message,"err"); }
    setSaving(false);
  };

  const Row = ({l,v,c=T.text,bold=false}) => (
    <div style={{display:"flex",justifyContent:"space-between",
      padding:`${bold?14:9}px 0`,borderBottom:bold?"none":`1px solid ${T.border}`}}>
      <span style={{fontFamily:T.sans,fontSize:bold?14:12,fontWeight:bold?700:400,color:bold?T.text:T.muted}}>{l}</span>
      <span style={{fontFamily:T.mono,fontSize:bold?20:12,fontWeight:700,color:c||T.text}}>{v}</span>
    </div>
  );

  return (
    <div style={{flex:1,overflowY:"auto",padding:"32px 36px",fontFamily:T.sans}}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      <div className="fade-up" style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Cotizador</h1>
            <p style={{color:T.muted,fontSize:13,marginTop:4}}>Un servicio o 10,000 PDV — misma velocidad</p>
          </div>
          {quoted && (
            <button onClick={()=>{setQuoted(false);setCliente("");setDestino(null);}}
              style={{display:"flex",alignItems:"center",gap:6,border:`1px solid ${T.border2}`,
                background:"transparent",color:T.muted,borderRadius:10,
                padding:"8px 16px",cursor:"pointer",fontFamily:T.sans,fontSize:13}}>
              <RefreshCw size={13}/> Nueva
            </button>
          )}
        </div>
        {!quoted && (
          <div style={{display:"flex",marginTop:18,background:T.card,
            border:`1px solid ${T.border}`,borderRadius:12,padding:4,width:"fit-content",gap:2}}>
            {[{id:"simple",label:"Servicio simple",icon:MapPin},{id:"masivo",label:"Distribución PDV masiva",icon:Layers}].map(({id,label,icon:Icon})=>(
              <button key={id} onClick={()=>{setModo(id);setQuoted(false);}}
                style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",
                  borderRadius:9,border:"none",cursor:"pointer",transition:"all .15s",
                  background:modo===id?`${T.accent}18`:"transparent",
                  color:modo===id?T.accent:T.muted,fontFamily:T.sans,fontSize:13,fontWeight:modo===id?700:500}}>
                <Icon size={14}/>{label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!quoted ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:18}}>
          {/* CONFIG */}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
              <Input label="Cliente / Proyecto" value={cliente} onChange={e=>setCliente(e.target.value)} placeholder="Nombre del cliente o proyecto..."/>
            </div>

            {modo==="simple" ? (<>
              {/* Destino */}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <div style={{fontSize:11,fontWeight:600,color:T.muted,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:10}}>Destino <span style={{color:T.rose}}>*</span></div>
                {destino ? (
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                    background:`${T.accent}0e`,border:`1px solid ${T.accent}28`,borderRadius:12}}>
                    <MapPin size={16} color={T.accent}/>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:T.display,fontWeight:700,fontSize:17,color:T.text}}>{destino.c}</div>
                      <div style={{fontFamily:T.mono,fontSize:11,color:T.muted}}>{destino.km.toLocaleString()} km · {fmt(destino[vehiculo])}</div>
                    </div>
                    <button onClick={()=>{setDestino(null);setSearch("");}}
                      style={{width:26,height:26,borderRadius:"50%",border:`1px solid ${T.border2}`,
                        background:"transparent",cursor:"pointer",color:T.muted,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <X size={12}/>
                    </button>
                  </div>
                ) : (
                  <div style={{position:"relative"}}>
                    <Search size={13} color={T.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
                    <input value={search} onChange={e=>{setSearch(e.target.value);setShowDD(true);}}
                      onFocus={()=>setShowDD(true)}
                      placeholder={`Busca entre ${TARIFA.length} destinos...`}
                      style={{width:"100%",paddingLeft:34,paddingRight:14,paddingTop:10,paddingBottom:10,
                        background:"#161c2a",border:`1px solid ${T.border2}`,borderRadius:10,
                        color:T.text,fontFamily:T.sans,fontSize:14,outline:"none"}}/>
                    {showDD && search && filt.length > 0 && (
                      <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,right:0,
                        background:"#161c2a",border:`1px solid ${T.border2}`,borderRadius:12,
                        zIndex:100,maxHeight:260,overflowY:"auto",boxShadow:"0 12px 40px #000b"}}>
                        {filt.map(t=>(
                          <button key={t.c} onClick={()=>{setDestino(t);setShowDD(false);setSearch("");}}
                            style={{width:"100%",display:"flex",alignItems:"center",gap:12,
                              padding:"10px 16px",border:"none",borderBottom:`1px solid ${T.border}`,
                              background:"transparent",cursor:"pointer",transition:"background .1s"}}
                            onMouseEnter={e=>e.currentTarget.style.background=`${T.accent}0e`}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <MapPin size={12} color={T.accent}/>
                            <div style={{flex:1,textAlign:"left"}}>
                              <div style={{fontFamily:T.sans,fontWeight:600,fontSize:13,color:T.text}}>{t.c}</div>
                              <div style={{fontFamily:T.mono,fontSize:10,color:T.muted}}>{t.km.toLocaleString()} km</div>
                            </div>
                            <span style={{fontFamily:T.mono,fontSize:12,color:T.accent,fontWeight:700}}>{fmt(t[vehiculo])}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Vehículo */}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <div style={{fontSize:11,fontWeight:600,color:T.muted,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:10}}>Vehículo</div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {VEHICULOS.map(v=>{
                    const a=vehiculo===v.k;
                    return (
                      <button key={v.k} onClick={()=>setVehiculo(v.k)}
                        style={{display:"flex",alignItems:"center",gap:12,padding:"9px 13px",
                          borderRadius:10,border:`1px solid ${a?T.accent:T.border2}`,
                          background:a?`${T.accent}0e`:"transparent",cursor:"pointer",transition:"all .15s"}}>
                        <span style={{fontSize:17}}>{v.icon}</span>
                        <div style={{flex:1,textAlign:"left"}}>
                          <div style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:a?T.text:T.muted}}>{v.label}</div>
                          <div style={{fontFamily:T.sans,fontSize:11,color:T.muted}}>{v.cap}</div>
                        </div>
                        {destino && <span style={{fontFamily:T.mono,fontSize:12,fontWeight:700,color:a?T.accent:T.muted}}>{fmt(destino[v.k])}</span>}
                        {a && <Check size={13} color={T.accent}/>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extras */}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <div style={{fontSize:11,fontWeight:600,color:T.muted,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:12}}>Servicios adicionales <span style={{color:T.muted,fontWeight:400}}>(opcional)</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  <Toggle checked={urgente} onChange={setUrgente} label="Viaje urgente" sub={urgente?`+35% = ${fmt(xUrg)}`:"Sin cargo adicional"} accent={T.rose}/>
                  <Toggle checked={maniobra} onChange={setManiobra} label="Maniobras / Ayudantes" sub="$2,800 por ayudante" accent={T.violet}/>
                  {maniobra && (
                    <div style={{paddingLeft:32,display:"flex",alignItems:"center",gap:10,marginTop:-2,marginBottom:2}}>
                      <span style={{fontFamily:T.sans,fontSize:12,color:T.muted}}>Ayudantes:</span>
                      <Stepper value={numAyud} onChange={setNumAyud} min={1} max={10}/>
                      <span style={{fontFamily:T.mono,fontSize:12,color:T.violet}}>{fmt(xMan)}</span>
                    </div>
                  )}
                  <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 13px",
                    borderRadius:11,border:`1px solid ${T.border2}`}}>
                    <Package size={15} color={T.blue}/>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:T.sans,fontSize:13,fontWeight:600,color:T.text}}>Paradas adicionales en ruta</div>
                      <div style={{fontFamily:T.sans,fontSize:11,color:T.muted}}>$1,200 por entrega extra</div>
                    </div>
                    <Stepper value={paradas} onChange={setParadas} min={0} max={50}/>
                  </div>
                  <Toggle checked={resguardo} onChange={setResguardo} label="Resguardo de materiales (1 día)" sub="$1,800" accent={T.green}/>
                </div>
              </div>
            </>) : (<>
              {/* PDV */}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <div style={{fontSize:11,fontWeight:600,color:T.muted,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:12}}>Puntos de Venta (PDV)</div>
                <div style={{border:`2px dashed ${pdvFile?T.accent:T.border2}`,borderRadius:12,
                  padding:18,textAlign:"center",cursor:"pointer",
                  background:pdvFile?`${T.accent}06`:"transparent",transition:"all .2s",marginBottom:12}}
                  onClick={()=>fileRef.current?.click()}
                  onDragOver={e=>e.preventDefault()}
                  onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
                  {pdvFile
                    ? <><CheckCircle size={22} color={T.accent} style={{margin:"0 auto 6px"}}/><div style={{fontFamily:T.sans,fontWeight:700,color:T.accent,fontSize:13}}>{pdvFile}</div><div style={{fontFamily:T.mono,fontSize:11,color:T.muted,marginTop:3}}>{totalPDV.toLocaleString()} PDV detectados</div></>
                    : <><FileUp size={22} color={T.muted} style={{margin:"0 auto 6px"}}/><div style={{fontFamily:T.sans,fontWeight:600,color:T.muted,fontSize:13}}>Sube tu Excel (opcional)</div><div style={{fontFamily:T.sans,fontSize:11,color:T.muted,marginTop:2}}>O ingresa el total manualmente</div></>
                  }
                  <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:"none"}} onChange={e=>{if(e.target.files[0])handleFile(e.target.files[0]);}}/>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontFamily:T.sans,fontSize:13,color:T.muted,flexShrink:0}}>Total PDV:</span>
                  <input type="number" value={totalPDV} onChange={e=>setTotalPDV(parseInt(e.target.value)||1)}
                    style={{flex:1,background:"#161c2a",border:`1px solid ${T.border2}`,borderRadius:10,
                      padding:"10px 14px",color:T.accent,fontFamily:T.mono,fontSize:22,fontWeight:700,
                      outline:"none",textAlign:"center"}}/>
                </div>
              </div>

              {/* Params */}
              <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:20}}>
                <div style={{fontSize:11,fontWeight:600,color:T.muted,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:14}}>Parámetros operativos</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  {[
                    {l:"Costo por PDV (MXN)",v:costoPDV,s:setCostoPDV,step:25,min:100},
                    {l:"Entregas/célula/día",v:entDia,s:setEntDia,step:1,min:1},
                    {l:"Células operativas",v:celulas,s:setCelulas,step:1,min:1},
                  ].map(({l,v,s,step,min})=>(
                    <div key={l}>
                      <div style={{fontSize:10,color:T.muted,fontWeight:600,marginBottom:5,letterSpacing:"0.04em",textTransform:"uppercase"}}>{l}</div>
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <button onClick={()=>s(Math.max(min,v-step))} style={{width:28,height:28,borderRadius:7,border:`1px solid ${T.border2}`,background:"transparent",cursor:"pointer",color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}><Minus size={11}/></button>
                        <input type="number" value={v} onChange={e=>s(parseInt(e.target.value)||min)} style={{flex:1,background:"#161c2a",border:`1px solid ${T.border2}`,borderRadius:7,padding:"7px 4px",color:T.text,fontFamily:T.mono,fontSize:13,fontWeight:700,outline:"none",textAlign:"center"}}/>
                        <button onClick={()=>s(v+step)} style={{width:28,height:28,borderRadius:7,border:`1px solid ${T.border2}`,background:"transparent",cursor:"pointer",color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={11}/></button>
                      </div>
                    </div>
                  ))}
                  <div/>
                </div>
                <Toggle checked={usarHubs} onChange={setUsarHubs} label="Hubs de distribución" sub="Opcional — centros de redistribución" accent={T.blue}/>
                {usarHubs && (
                  <div style={{marginTop:8,paddingLeft:8,display:"flex",flexDirection:"column",gap:5}}>
                    <Toggle checked={hubMTY} onChange={setHubMTY} label="Hub Monterrey" sub="Noreste, Norte y Frontera" accent={T.blue}/>
                    <Toggle checked={hubCDMX} onChange={setHubCDMX} label="Hub CDMX" sub="Centro, Bajío y Occidente" accent={T.blue}/>
                    <Toggle checked={hubMID} onChange={setHubMID} label="Hub Mérida" sub="Península de Yucatán" accent={T.blue}/>
                  </div>
                )}
                <div style={{marginTop:8}}>
                  <Toggle checked={trailer} onChange={setTrailer} label="Tráiler maestro MTY → Hubs" sub="Traslado previo de inventario" accent={T.amber}/>
                  {trailer && (
                    <div style={{paddingLeft:32,marginTop:5,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:T.sans,fontSize:12,color:T.muted}}>Costo:</span>
                      <input type="number" value={costoTrailer} onChange={e=>setCostoTrailer(parseInt(e.target.value)||0)}
                        style={{width:110,background:"#161c2a",border:`1px solid ${T.border2}`,borderRadius:8,
                          padding:"6px 10px",color:T.amber,fontFamily:T.mono,fontSize:13,fontWeight:700,outline:"none"}}/>
                    </div>
                  )}
                </div>
              </div>
            </>)}

            <button onClick={()=>{if(canQ)setQuoted(true);}} className="btn-p"
              style={{padding:"14px 20px",borderRadius:14,border:"none",
                cursor:canQ?"pointer":"not-allowed",
                background:canQ?`linear-gradient(135deg,${T.accent},#fb923c)`:"#1a1f2e",
                color:canQ?"#fff":T.muted,fontFamily:T.display,fontWeight:700,fontSize:16,
                display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                boxShadow:canQ?`0 4px 24px ${T.accent}38`:"none",transition:"all .2s"}}>
              <DollarSign size={19}/>
              {canQ ? (modo==="simple" ? `Cotizar → ${destino?.c}` : `Generar propuesta · ${totalPDV.toLocaleString()} PDV`) : "Completa los campos requeridos"}
            </button>
          </div>

          {/* PREVIEW */}
          <div style={{position:"sticky",top:0}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:"hidden"}}>
              <div style={{background:"linear-gradient(135deg,#0f1720,#0a1218)",padding:"20px 22px",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontFamily:T.mono,fontSize:10,color:T.accent,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>
                  {modo==="simple"?"Servicio simple":"Distribución masiva"}
                </div>
                <div style={{fontFamily:T.mono,fontWeight:700,fontSize:30,color:T.text}}>{fmt(total)}</div>
                <div style={{fontFamily:T.sans,fontSize:12,color:T.muted,marginTop:4}}>MXN con IVA incluido</div>
              </div>
              <div style={{padding:"18px 22px"}}>
                {modo==="simple" ? (<>
                  <Row l={`Base · ${veh?.label||"—"}`} v={fmt(base)}/>
                  {urgente && <Row l="⚡ Urgente +35%" v={`+${fmt(xUrg)}`} c={T.rose}/>}
                  {maniobra && <Row l={`👷 Ayudantes (${numAyud})`} v={`+${fmt(xMan)}`} c={T.violet}/>}
                  {paradas>0 && <Row l={`📦 Paradas extra (${paradas})`} v={`+${fmt(xPar)}`} c={T.blue}/>}
                  {resguardo && <Row l="🛡️ Resguardo" v={`+${fmt(xRes)}`} c={T.green}/>}
                  <Row l="Subtotal" v={fmt(subS)}/>
                  <Row l="IVA 16%" v={fmt(ivaS)}/>
                  <Row l="TOTAL" v={fmt(totS)} c={T.accent} bold/>
                  {destino && (
                    <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
                      <div style={{fontFamily:T.mono,fontSize:10,color:T.muted,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:7}}>Comparar vehículos</div>
                      {VEHICULOS.map(v=>(
                        <button key={v.k} onClick={()=>setVehiculo(v.k)}
                          style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",
                            padding:"6px 9px",marginBottom:2,borderRadius:8,border:"none",cursor:"pointer",
                            background:vehiculo===v.k?`${T.accent}12`:"transparent",transition:"all .15s"}}>
                          <span style={{fontFamily:T.sans,fontSize:12,color:vehiculo===v.k?T.text:T.muted}}>{v.icon} {v.label}</span>
                          <span style={{fontFamily:T.mono,fontSize:11,fontWeight:700,color:vehiculo===v.k?T.accent:T.muted}}>{fmt(destino[v.k])}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>) : (<>
                  <Row l="PDV" v={totalPDV.toLocaleString()} c={T.accent}/>
                  <Row l="Días requeridos" v={`${diasR} días`}/>
                  <Row l="Semanas" v={`${semR} sem`} c={T.muted}/>
                  <Row l="Entregas / día" v={(celulas*entDia).toLocaleString()} c={T.green}/>
                  <Row l={`${totalPDV.toLocaleString()} × ${fmt(costoPDV)}`} v={fmt(xEnt)}/>
                  {trailer && <Row l="Tráiler maestro" v={fmt(xTrl)} c={T.amber}/>}
                  <Row l="IVA 16%" v={fmt(ivaM)} c={T.muted}/>
                  <Row l="TOTAL" v={fmt(totM)} c={T.accent} bold/>
                  {usarHubs && [hubMTY&&"MTY",hubCDMX&&"CDMX",hubMID&&"MID"].filter(Boolean).length>0 && (
                    <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`,display:"flex",gap:6,flexWrap:"wrap"}}>
                      {[hubMTY&&"MTY",hubCDMX&&"CDMX",hubMID&&"MID"].filter(Boolean).map(h=><Tag key={h} color={T.blue}>{h}</Tag>)}
                    </div>
                  )}
                </>)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── PROPUESTA ── */
        <div className="fade-up" style={{maxWidth:820}}>
          <div style={{background:"linear-gradient(135deg,#08101e,#0d1828)",
            border:`1px solid ${T.border}`,borderRadius:20,padding:"38px 44px",marginBottom:16,
            position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-50,right:-50,width:250,height:250,
              borderRadius:"50%",background:`${T.accent}05`,border:`1px solid ${T.accent}12`}}/>
            <div style={{position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
                <div style={{width:42,height:42,background:`linear-gradient(135deg,${T.accent},#fb923c)`,
                  borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:`0 4px 16px ${T.accent}38`}}>
                  <Truck size={19} color="#fff"/>
                </div>
                <div>
                  <div style={{fontFamily:T.display,fontWeight:800,fontSize:17,color:T.text}}>DMvimiento</div>
                  <div style={{fontFamily:T.sans,fontSize:11,color:T.muted,letterSpacing:"0.05em",textTransform:"uppercase"}}>Logística Especializada México</div>
                </div>
                <div style={{marginLeft:"auto"}}><Tag color={T.accent}>PROPUESTA {new Date().getFullYear()}</Tag></div>
              </div>
              <div style={{fontFamily:T.mono,fontSize:10,color:T.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Plan de distribución</div>
              <h2 style={{fontFamily:T.display,fontWeight:800,fontSize:34,color:T.text,
                letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:22}}>
                {cliente||"Propuesta de Servicio"}<br/>
                <span style={{color:T.accent}}>{modo==="simple"?destino?.c:`${totalPDV.toLocaleString()} PDV Nacionales`}</span>
              </h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {(modo==="simple"
                  ? [{l:"Destino",v:destino?.c},{l:"Vehículo",v:veh?.label},{l:"Sin IVA",v:fmt(subS)},{l:"Total c/IVA",v:fmt(totS)}]
                  : [{l:"PDV totales",v:totalPDV.toLocaleString()},{l:"Plazo",v:`${diasR} días`},{l:"Células",v:celulas},{l:"Total c/IVA",v:fmt(totM)}]
                ).map(({l,v})=>(
                  <div key={l} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"13px 15px"}}>
                    <div style={{fontFamily:T.sans,fontSize:10,color:T.muted,marginBottom:4,letterSpacing:"0.04em",textTransform:"uppercase"}}>{l}</div>
                    <div style={{fontFamily:T.mono,fontSize:17,fontWeight:700,color:T.accent}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13,marginBottom:13}}>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 22px"}}>
              <div style={{fontFamily:T.display,fontWeight:700,fontSize:14,color:T.text,marginBottom:14}}>Desglose</div>
              {modo==="simple" ? (<>
                <Row l={`Tarifa base · ${destino?.c}`} v={fmt(base)}/>
                {urgente&&<Row l="Urgente +35%" v={`+${fmt(xUrg)}`} c={T.rose}/>}
                {maniobra&&<Row l={`Ayudantes (${numAyud})`} v={`+${fmt(xMan)}`} c={T.violet}/>}
                {paradas>0&&<Row l={`Paradas extra (${paradas})`} v={`+${fmt(xPar)}`} c={T.blue}/>}
                {resguardo&&<Row l="Resguardo 1 día" v={`+${fmt(xRes)}`} c={T.green}/>}
                <Row l="Subtotal" v={fmt(subS)}/>
                <Row l="IVA 16%" v={fmt(ivaS)}/>
                <Row l="TOTAL" v={fmt(totS)} c={T.accent} bold/>
              </>) : (<>
                <Row l={`${totalPDV.toLocaleString()} PDV × ${fmt(costoPDV)}`} v={fmt(xEnt)}/>
                {trailer&&<Row l="Tráiler maestro" v={fmt(xTrl)} c={T.amber}/>}
                <Row l="Subtotal" v={fmt(subM)}/>
                <Row l="IVA 16%" v={fmt(ivaM)}/>
                <Row l="TOTAL" v={fmt(totM)} c={T.accent} bold/>
              </>)}
            </div>
            <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"20px 22px"}}>
              <div style={{fontFamily:T.display,fontWeight:700,fontSize:14,color:T.text,marginBottom:14}}>Servicios incluidos</div>
              {["⛽ Combustibles, casetas y peajes","💪 Maniobras de carga y descarga",
                "🏨 Viáticos y hospedaje del personal","🛡️ Seguro de mercancía en tránsito",
                "📸 Evidencias digitales en tiempo real","🔄 Plan de contingencia ante imprevistos",
                ...(modo==="masivo"&&usarHubs?[`🏭 Gestión de Hubs: ${[hubMTY&&"MTY",hubCDMX&&"CDMX",hubMID&&"MID"].filter(Boolean).join(", ")||"—"}`]:[]),
                ...(modo==="masivo"&&trailer?["🚛 Enlace Tráiler Maestro MTY→Hubs"]:[]),
              ].map(s=>(
                <div key={s} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontFamily:T.sans,fontSize:12,color:T.muted}}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,
            padding:"22px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:T.display,fontWeight:800,fontSize:17,color:T.text,marginBottom:3}}>¿Iniciamos la operación?</div>
              <div style={{fontFamily:T.sans,fontSize:12,color:T.muted}}>Propuesta válida 15 días · Sujeto a disponibilidad</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={handleSave} className="btn-p" disabled={saving}
                style={{display:"flex",alignItems:"center",gap:8,
                  background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",
                  border:"none",borderRadius:10,padding:"11px 20px",cursor:"pointer",
                  fontFamily:T.sans,fontWeight:700,fontSize:13,boxShadow:`0 4px 16px ${T.accent}28`,
                  opacity:saving?0.7:1}}>
                {saving ? <><div style={{width:14,height:14,border:"2px solid #fff",borderTop:"2px solid transparent",borderRadius:"50%"}} className="spin"/>Guardando...</> : <><Send size={14}/> Guardar en sistema</>}
              </button>
              <button style={{display:"flex",alignItems:"center",gap:8,background:"transparent",
                color:T.muted,border:`1px solid ${T.border2}`,borderRadius:10,
                padding:"11px 18px",cursor:"pointer",fontFamily:T.sans,fontWeight:600,fontSize:13}}>
                <Download size={14}/> PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CUENTAS ────────────────────────────────────────────────────────────── */
function Cuentas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({nombre:"",contacto:"",email:"",plan:"Basic",notas:""});
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const showToast = (msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"cuentas"), snap=>{
      setItems(snap.docs.map(d=>({id:d.id,...d.data()})));
      setLoading(false);
    });
    return unsub;
  },[]);

  const save = async()=>{
    if(!form.nombre.trim()){showToast("El nombre es requerido","err");return;}
    try{await addDoc(collection(db,"cuentas"),{...form,createdAt:serverTimestamp()});setModal(false);setForm({nombre:"",contacto:"",email:"",plan:"Basic",notas:""});showToast("Cuenta creada ✓");}
    catch(e){showToast(e.message,"err");}
  };
  const del = async(id)=>{if(!window.confirm("¿Eliminar esta cuenta?"))return;await deleteDoc(doc(db,"cuentas",id));showToast("Eliminada");};
  const filt = items.filter(c=>c.nombre?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{flex:1,overflowY:"auto",padding:"32px 36px"}}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
      <div className="fade-up" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:26}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Cuentas</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>{items.length} clientes · datos en Firebase</p>
        </div>
        <button onClick={()=>setModal(true)} className="btn-p"
          style={{display:"flex",alignItems:"center",gap:8,background:`linear-gradient(135deg,${T.accent},#fb923c)`,
            color:"#fff",border:"none",borderRadius:12,padding:"10px 18px",cursor:"pointer",
            fontFamily:T.sans,fontWeight:700,fontSize:13,boxShadow:`0 4px 16px ${T.accent}30`}}>
          <Plus size={15}/> Nueva cuenta
        </button>
      </div>

      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,
        padding:"12px 18px",display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <Search size={14} color={T.muted}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cuenta..."
          style={{background:"none",border:"none",color:T.text,fontFamily:T.sans,fontSize:13,outline:"none",flex:1}}/>
      </div>

      {loading ? <Loader/> : (
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
          {filt.length===0
            ? <div style={{padding:48,textAlign:"center",color:T.muted,fontFamily:T.sans,fontSize:13}}>
                Sin cuentas. <button onClick={()=>setModal(true)} style={{color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Crear la primera →</button>
              </div>
            : <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                  {["Cliente","Plan","Contacto","Notas",""].map(h=>(
                    <th key={h} style={{padding:"10px 20px",textAlign:"left",fontFamily:T.sans,fontSize:11,color:T.muted,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filt.map((c,i)=>(
                    <tr key={c.id||i} style={{borderBottom:`1px solid ${T.border}`,transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#161e30"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"13px 20px",fontFamily:T.sans,fontSize:13,fontWeight:700,color:T.text}}>{c.nombre}</td>
                      <td style={{padding:"13px 20px"}}><Tag color={{Enterprise:T.accent,Pro:T.blue,Basic:T.muted}[c.plan]||T.muted}>{c.plan}</Tag></td>
                      <td style={{padding:"13px 20px",fontFamily:T.sans,fontSize:12,color:T.muted}}>{c.contacto}{c.email&&<><br/><span style={{color:T.muted,fontSize:11}}>{c.email}</span></>}</td>
                      <td style={{padding:"13px 20px",fontFamily:T.sans,fontSize:12,color:T.muted,maxWidth:200}}>{c.notas||"—"}</td>
                      <td style={{padding:"13px 20px"}}><button onClick={()=>del(c.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted}}><Trash2 size={14}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {modal && (
        <Modal title="Nueva cuenta" onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Input label="Nombre / Empresa *" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Walmart México"/>
            <Input label="Contacto" value={form.contacto} onChange={e=>setForm({...form,contacto:e.target.value})} placeholder="Nombre del contacto"/>
            <Input label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="contacto@empresa.com"/>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>Plan</div>
              <div style={{display:"flex",gap:8}}>
                {["Basic","Pro","Enterprise"].map(p=>(
                  <button key={p} onClick={()=>setForm({...form,plan:p})}
                    style={{flex:1,padding:"9px 0",borderRadius:10,border:`2px solid ${form.plan===p?T.accent:T.border2}`,
                      background:form.plan===p?`${T.accent}0e`:"transparent",color:form.plan===p?T.accent:T.muted,
                      cursor:"pointer",fontFamily:T.sans,fontSize:13,fontWeight:form.plan===p?700:500}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>Notas</div>
              <textarea value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})}
                style={{width:"100%",background:"#161c2a",border:`1px solid ${T.border2}`,borderRadius:10,
                  padding:"10px 14px",color:T.text,fontFamily:T.sans,fontSize:14,outline:"none",
                  resize:"none",height:80}}/>
            </div>
            <button onClick={save} className="btn-p"
              style={{background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",
                borderRadius:12,padding:"12px 0",cursor:"pointer",fontFamily:T.display,fontWeight:700,fontSize:15}}>
              Crear cuenta
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── FACTURAS ───────────────────────────────────────────────────────────── */
function Facturas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({cliente:"",servicio:"",monto:"",status:"Pendiente"});
  const [toast, setToast] = useState(null);
  const showToast=(m,t="ok")=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    const unsub=onSnapshot(collection(db,"facturas"),snap=>{
      setItems(snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      setLoading(false);
    });
    return unsub;
  },[]);

  const save=async()=>{
    if(!form.cliente.trim()||!form.monto){showToast("Completa los campos","err");return;}
    try{await addDoc(collection(db,"facturas"),{...form,total:parseFloat(form.monto)||0,createdAt:serverTimestamp()});setModal(false);setForm({cliente:"",servicio:"",monto:"",status:"Pendiente"});showToast("Factura creada ✓");}
    catch(e){showToast(e.message,"err");}
  };
  const updateStatus=async(id,status)=>{await updateDoc(doc(db,"facturas",id),{status});};
  const del=async(id)=>{if(!window.confirm("¿Eliminar?"))return;await deleteDoc(doc(db,"facturas",id));showToast("Eliminada");};

  const total=(s)=>items.filter(i=>i.status===s).reduce((a,i)=>a+(i.total||0),0);

  return (
    <div style={{flex:1,overflowY:"auto",padding:"32px 36px"}}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
      <div className="fade-up" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Facturación</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>{items.length} facturas en Firebase</p>
        </div>
        <button onClick={()=>setModal(true)} className="btn-p"
          style={{display:"flex",alignItems:"center",gap:8,background:`linear-gradient(135deg,${T.accent},#fb923c)`,
            color:"#fff",border:"none",borderRadius:12,padding:"10px 18px",cursor:"pointer",
            fontFamily:T.sans,fontWeight:700,fontSize:13,boxShadow:`0 4px 16px ${T.accent}28`}}>
          <Plus size={15}/> Nueva factura
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
        {[{l:"Cobrado",v:fmt(total("Pagada")),c:T.green},{l:"Pendiente",v:fmt(total("Pendiente")),c:T.amber},{l:"Vencido",v:fmt(total("Vencida")),c:T.rose}].map(({l,v,c})=>(
          <div key={l} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"16px 20px"}}>
            <div style={{fontFamily:T.sans,fontSize:11,color:T.muted,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>{l}</div>
            <div style={{fontFamily:T.mono,fontSize:22,fontWeight:700,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {loading ? <Loader/> : (
        <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,overflow:"hidden"}}>
          {items.length===0
            ? <div style={{padding:48,textAlign:"center",color:T.muted,fontFamily:T.sans,fontSize:13}}>Sin facturas. <button onClick={()=>setModal(true)} style={{color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Crear →</button></div>
            : <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                  {["Cliente","Servicio","Monto","Fecha","Status",""].map(h=>(
                    <th key={h} style={{padding:"10px 20px",textAlign:"left",fontFamily:T.sans,fontSize:11,color:T.muted,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {items.map((f,i)=>(
                    <tr key={f.id||i} style={{borderBottom:`1px solid ${T.border}`,transition:"background .15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#161e30"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"13px 20px",fontFamily:T.sans,fontSize:13,fontWeight:700,color:T.text}}>{f.cliente}</td>
                      <td style={{padding:"13px 20px",fontFamily:T.sans,fontSize:12,color:T.muted,maxWidth:180}}>{f.servicio||"—"}</td>
                      <td style={{padding:"13px 20px",fontFamily:T.mono,fontSize:13,fontWeight:700,color:T.text}}>{fmt(f.total||0)}</td>
                      <td style={{padding:"13px 20px",fontFamily:T.mono,fontSize:11,color:T.muted}}>{f.createdAt?.seconds?new Date(f.createdAt.seconds*1000).toLocaleDateString("es-MX"):"—"}</td>
                      <td style={{padding:"13px 20px"}}>
                        <select value={f.status||"Pendiente"} onChange={e=>updateStatus(f.id,e.target.value)}
                          style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:8,
                            padding:"4px 8px",color:T.text,fontFamily:T.sans,fontSize:12,cursor:"pointer",outline:"none"}}>
                          {["Pendiente","Pagada","Vencida"].map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{padding:"13px 20px"}}><button onClick={()=>del(f.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted}}><Trash2 size={14}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
          }
        </div>
      )}

      {modal && (
        <Modal title="Nueva factura" onClose={()=>setModal(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Input label="Cliente *" value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})} placeholder="Nombre del cliente"/>
            <Input label="Servicio" value={form.servicio} onChange={e=>setForm({...form,servicio:e.target.value})} placeholder="Descripción del servicio"/>
            <Input label="Monto (sin IVA) *" type="number" value={form.monto} onChange={e=>setForm({...form,monto:e.target.value})} placeholder="0"/>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:T.muted,marginBottom:6,letterSpacing:"0.05em",textTransform:"uppercase"}}>Status inicial</div>
              <div style={{display:"flex",gap:8}}>
                {["Pendiente","Pagada"].map(s=>(
                  <button key={s} onClick={()=>setForm({...form,status:s})}
                    style={{flex:1,padding:"9px 0",borderRadius:10,
                      border:`2px solid ${form.status===s?T.accent:T.border2}`,
                      background:form.status===s?`${T.accent}0e`:"transparent",
                      color:form.status===s?T.accent:T.muted,
                      cursor:"pointer",fontFamily:T.sans,fontSize:13,fontWeight:form.status===s?700:500}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={save} className="btn-p"
              style={{background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",
                borderRadius:12,padding:"12px 0",cursor:"pointer",fontFamily:T.display,fontWeight:700,fontSize:15}}>
              Crear factura
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── RUTAS ──────────────────────────────────────────────────────────────── */
function Rutas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({nombre:"",cuenta:"",estado:"",pdv:0,chofer:"",status:"Programada"});
  const [toast, setToast] = useState(null);
  const showToast=(m,t="ok")=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    const unsub=onSnapshot(collection(db,"rutas"),snap=>{setItems(snap.docs.map(d=>({id:d.id,...d.data()})));setLoading(false);});
    return unsub;
  },[]);

  const save=async()=>{
    if(!form.nombre.trim()){showToast("El nombre es requerido","err");return;}
    try{await addDoc(collection(db,"rutas"),{...form,pdv:parseInt(form.pdv)||0,progreso:0,createdAt:serverTimestamp()});setModal(false);setForm({nombre:"",cuenta:"",estado:"",pdv:0,chofer:"",status:"Programada"});showToast("Ruta creada ✓");}
    catch(e){showToast(e.message,"err");}
  };
  const updateStatus=async(id,status)=>updateDoc(doc(db,"rutas",id),{status});
  const del=async(id)=>{if(!window.confirm("¿Eliminar?"))return;await deleteDoc(doc(db,"rutas",id));showToast("Eliminada");};

  const sc={Completada:T.green,"En curso":T.blue,Programada:T.violet};

  return (
    <div style={{flex:1,overflowY:"auto",padding:"32px 36px"}}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
      <div className="fade-up" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Rutas</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>Planificador de distribución por célula</p>
        </div>
        <button onClick={()=>setModal(true)} className="btn-p"
          style={{display:"flex",alignItems:"center",gap:8,background:`linear-gradient(135deg,${T.accent},#fb923c)`,
            color:"#fff",border:"none",borderRadius:12,padding:"10px 18px",cursor:"pointer",
            fontFamily:T.sans,fontWeight:700,fontSize:13,boxShadow:`0 4px 16px ${T.accent}28`}}>
          <Plus size={15}/> Nueva ruta
        </button>
      </div>
      {loading ? <Loader/> : (
        items.length===0
          ? <div style={{padding:48,textAlign:"center",color:T.muted,fontFamily:T.sans,fontSize:13}}>Sin rutas. <button onClick={()=>setModal(true)} style={{color:T.accent,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>Crear →</button></div>
          : <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {items.map((r,i)=>{
                const col=sc[r.status]||T.muted;
                return (
                  <div key={r.id||i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,
                    padding:"18px 22px",display:"flex",alignItems:"center",gap:18,transition:"background .15s",cursor:"default"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#131921"}
                    onMouseLeave={e=>e.currentTarget.style.background=T.card}>
                    <div style={{width:44,height:44,borderRadius:12,background:`${col}14`,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Route size={19} color={col}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:T.sans,fontWeight:700,fontSize:14,color:T.text,marginBottom:2}}>{r.nombre}</div>
                      <div style={{fontFamily:T.sans,fontSize:12,color:T.muted}}>{[r.cuenta,r.estado,r.chofer].filter(Boolean).join(" · ")}</div>
                      <div style={{marginTop:8,height:3,background:T.border,borderRadius:3,maxWidth:260}}>
                        <div style={{height:3,borderRadius:3,background:`linear-gradient(90deg,${col},${col}80)`,width:`${r.progreso||0}%`,transition:"width .5s"}}/>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                      <div style={{fontFamily:T.mono,fontSize:20,fontWeight:700,color:T.accent}}>{r.pdv||0}</div>
                      <div style={{fontFamily:T.sans,fontSize:11,color:T.muted}}>PDV</div>
                      <select value={r.status||"Programada"} onChange={e=>updateStatus(r.id,e.target.value)}
                        style={{background:T.surface,border:`1px solid ${T.border2}`,borderRadius:8,
                          padding:"4px 8px",color:T.text,fontFamily:T.sans,fontSize:11,cursor:"pointer",outline:"none"}}>
                        {["Programada","En curso","Completada"].map(s=><option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <button onClick={()=>del(r.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted,flexShrink:0}}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                );
              })}
            </div>
      )}

      {modal && (
        <Modal title="Nueva ruta" onClose={()=>setModal(false)} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{gridColumn:"1/-1"}}><Input label="Nombre de la ruta *" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="MTY Noreste Semana 1"/></div>
            <Input label="Cuenta / Cliente" value={form.cuenta} onChange={e=>setForm({...form,cuenta:e.target.value})} placeholder="Nombre del cliente"/>
            <Input label="Estado / Región" value={form.estado} onChange={e=>setForm({...form,estado:e.target.value})} placeholder="Nuevo León"/>
            <Input label="PDV a entregar" type="number" value={form.pdv} onChange={e=>setForm({...form,pdv:e.target.value})} placeholder="0"/>
            <Input label="Chofer / Responsable" value={form.chofer} onChange={e=>setForm({...form,chofer:e.target.value})} placeholder="Nombre del chofer"/>
          </div>
          <button onClick={save} className="btn-p"
            style={{width:"100%",marginTop:18,background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",
              border:"none",borderRadius:12,padding:"12px 0",cursor:"pointer",fontFamily:T.display,fontWeight:700,fontSize:15}}>
            Crear ruta
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ─── ENTREGAS ───────────────────────────────────────────────────────────── */
function Entregas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({pdv:"",dir:"",receptor:"",notas:""});
  const [toast, setToast] = useState(null);
  const showToast=(m,t="ok")=>{setToast({msg:m,type:t});setTimeout(()=>setToast(null),3000);};

  useEffect(()=>{
    const unsub=onSnapshot(collection(db,"entregas"),snap=>{
      setItems(snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0)));
      setLoading(false);
    });
    return unsub;
  },[]);

  const registrar=async()=>{
    if(!form.pdv.trim()){showToast("El PDV es requerido","err");return;}
    try{
      await addDoc(collection(db,"entregas"),{...form,status:"Entregado",hora:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"}),createdAt:serverTimestamp()});
      setForm({pdv:"",dir:"",receptor:"",notas:""});showToast("Entrega registrada ✓");
    }catch(e){showToast(e.message,"err");}
  };
  const del=async(id)=>{await deleteDoc(doc(db,"entregas",id));showToast("Eliminada");};

  const sc={Entregado:T.green,"En tránsito":T.blue,Pendiente:T.amber};

  return (
    <div style={{flex:1,overflowY:"auto",padding:"32px 36px"}}>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
      <div className="fade-up" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h1 style={{fontFamily:T.display,fontWeight:800,fontSize:30,color:T.text,letterSpacing:"-0.03em"}}>Entregas</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>Seguimiento con evidencia · {items.length} registradas</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{l:`${items.filter(e=>e.status==="Entregado").length} Entregadas`,c:T.green},{l:`${items.filter(e=>e.status==="En tránsito").length} En tránsito`,c:T.blue},{l:`${items.filter(e=>e.status==="Pendiente").length} Pendientes`,c:T.amber}].map(({l,c})=>(
            <Tag key={l} color={c}>{l}</Tag>
          ))}
        </div>
      </div>

      {loading ? <Loader/> : (
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
          {items.length===0
            ? <div style={{padding:40,textAlign:"center",color:T.muted,fontFamily:T.sans,fontSize:13,background:T.card,border:`1px solid ${T.border}`,borderRadius:14}}>Sin entregas. Registra la primera abajo.</div>
            : items.map((e,i)=>{
                const col=sc[e.status]||T.muted;
                return (
                  <div key={e.id||i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:13,
                    padding:"16px 20px",display:"flex",alignItems:"center",gap:14,transition:"background .15s"}}
                    onMouseEnter={el=>el.currentTarget.style.background="#131921"}
                    onMouseLeave={el=>el.currentTarget.style.background=T.card}>
                    <div style={{width:40,height:40,borderRadius:11,background:`${col}14`,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {e.status==="Entregado"?<CheckCircle size={17} color={col}/>:e.status==="En tránsito"?<Navigation size={17} color={col}/>:<Clock size={17} color={col}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:T.sans,fontWeight:700,fontSize:13,color:T.text,marginBottom:2}}>{e.pdv}</div>
                      <div style={{fontFamily:T.sans,fontSize:11,color:T.muted}}>{e.dir}</div>
                      {e.receptor&&<div style={{fontFamily:T.sans,fontSize:11,color:T.green,marginTop:2}}>✓ Recibió: {e.receptor}</div>}
                      {e.notas&&<div style={{fontFamily:T.sans,fontSize:11,color:T.muted,marginTop:2}}>{e.notas}</div>}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,flexShrink:0}}>
                      <Tag color={col}>{e.status}</Tag>
                      <span style={{fontFamily:T.mono,fontSize:11,color:T.muted}}>{e.hora||"—"}</span>
                      {e.createdAt?.seconds && <span style={{fontFamily:T.mono,fontSize:10,color:T.muted}}>{new Date(e.createdAt.seconds*1000).toLocaleDateString("es-MX")}</span>}
                    </div>
                    <button onClick={()=>del(e.id)} style={{border:"none",background:"transparent",cursor:"pointer",color:T.muted,flexShrink:0}}><Trash2 size={13}/></button>
                  </div>
                );
              })
          }
        </div>
      )}

      {/* Registro rápido */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 22px"}}>
        <div style={{fontFamily:T.display,fontWeight:700,fontSize:14,color:T.text,marginBottom:14}}>Registrar entrega</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Input label="PDV / Punto de venta *" value={form.pdv} onChange={e=>setForm({...form,pdv:e.target.value})} placeholder="Nombre del PDV"/>
          <Input label="Dirección" value={form.dir} onChange={e=>setForm({...form,dir:e.target.value})} placeholder="Dirección completa"/>
          <Input label="Receptor" value={form.receptor} onChange={e=>setForm({...form,receptor:e.target.value})} placeholder="Quien recibió"/>
          <Input label="Notas / Incidencias" value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})} placeholder="Observaciones..."/>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${T.border2}`,
            background:"transparent",color:T.muted,borderRadius:10,padding:"9px 16px",
            cursor:"pointer",fontFamily:T.sans,fontSize:13,fontWeight:600}}>
            <Camera size={14}/> Evidencia
          </button>
          <button onClick={registrar} className="btn-p"
            style={{display:"flex",alignItems:"center",gap:8,
              background:`linear-gradient(135deg,${T.accent},#fb923c)`,color:"#fff",border:"none",
              borderRadius:10,padding:"9px 20px",cursor:"pointer",fontFamily:T.sans,fontWeight:700,fontSize:13,
              boxShadow:`0 4px 16px ${T.accent}28`}}>
            <Check size={14}/> Confirmar entrega
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
export default function App() {
  const [view, setView] = useState("dashboard");
  const [cotizaciones, setCotizaciones] = useState([]);
  const [facturas, setFacturas]         = useState([]);
  const [entregas, setEntregas]         = useState([]);

  useEffect(()=>{
    const u1=onSnapshot(collection(db,"cotizaciones"),s=>{setCotizaciones(s.docs.map(d=>({id:d.id,...d.data()})));});
    const u2=onSnapshot(collection(db,"facturas"),s=>{setFacturas(s.docs.map(d=>({id:d.id,...d.data()})));});
    const u3=onSnapshot(collection(db,"entregas"),s=>{setEntregas(s.docs.map(d=>({id:d.id,...d.data()})));});
    return ()=>{u1();u2();u3();};
  },[]);

  const stats = { cotizaciones:cotizaciones.length, facturas:facturas.length };

  const VIEWS = {
    dashboard: <Dashboard setView={setView} cotizaciones={cotizaciones} facturas={facturas} entregas={entregas}/>,
    cotizador: <Cotizador onSave={()=>setView("dashboard")}/>,
    cuentas:   <Cuentas/>,
    facturas:  <Facturas/>,
    rutas:     <Rutas/>,
    entregas:  <Entregas/>,
  };

  return (
    <>
      <style>{FONT_INJECT}</style>
      <div style={{display:"flex",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:T.sans}}>
        <Sidebar view={view} setView={setView} stats={stats}/>
        <main style={{flex:1,overflowY:"auto",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
          {VIEWS[view] || VIEWS.dashboard}
        </main>
      </div>
    </>
  );
}
