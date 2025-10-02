/* =========================================================
   Seguimiento de Carrera – barra "videojuego" con animación
   - Solo barra de progreso (sin otros headers).
   - Modal estético para requisitos.
   - Layout por columnas, dimming, bloqueo y localStorage.
   - Progreso con animación, barberpole y popup +1.
   ========================================================= */

const data = {
  carrera: "Ingeniería Industrial",
  subjects: [
    // 1er año
    {id:1,  name:"Análisis Matemático I", year:1, cursar:[], rendir:[]},
    {id:2,  name:"Química General", year:1, cursar:[], rendir:[]},
    {id:3,  name:"Sistemas de Representación", year:1, cursar:[], rendir:[]},
    {id:4,  name:"Informática I", year:1, cursar:[], rendir:[]},
    {id:5,  name:"Pensamiento Sistémico", year:1, cursar:[], rendir:[]},
    {id:6,  name:"Física I", year:1, cursar:[], rendir:[]},
    {id:7,  name:"Álgebra y Geometría Analítica", year:1, cursar:[], rendir:[]},
    {id:8,  name:"Ingeniería y Sociedad", year:1, cursar:[], rendir:[]},

    // 2º año
    {id:9,  name:"Análisis Matemático II", year:2, cursar:[1,7], rendir:[1,7]},
    {id:10, name:"Administración General", year:2, cursar:[4,5,7,8], rendir:[4,5,7,8]},
    {id:11, name:"Probabilidad y Estadística", year:2, cursar:[1,7], rendir:[1,7]},
    {id:12, name:"Ciencia de los Materiales", year:2, cursar:[2,6], rendir:[2,6]},
    {id:13, name:"Física II", year:2, cursar:[1,6], rendir:[1,6]},
    {id:14, name:"Economía General", year:2, cursar:[1,5,8], rendir:[1,5,8]},
    {id:15, name:"Informática II", year:2, cursar:[4], rendir:[4]},
    {id:16, name:"Inglés I", year:2, cursar:[], rendir:[]},

    // 3º año
    {id:17, name:"Costos y Presupuestos", year:3, cursar:[10,14], rendir:[10,14]},
    {id:18, name:"Estudio del Trabajo", year:3, cursar:[10,11], rendir:[10,11]},
    {id:19, name:"Comercialización", year:3, cursar:[10,11,14], rendir:[10,11,14]},
    {id:20, name:"Termodinámica y Máquinas Térmicas", year:3, cursar:[2,13], rendir:[2,13]},
    {id:21, name:"Estática y Resistencia de los Materiales", year:3, cursar:[9,12], rendir:[9,12]},
    {id:22, name:"Mecánica de los Fluidos", year:3, cursar:[9], rendir:[9]},
    {id:23, name:"Economía de la Empresa", year:3, cursar:[10,14], rendir:[10,14]},
    {id:24, name:"Electrotecnia y Máquinas Eléctricas", year:3, cursar:[13], rendir:[13]},
    {id:25, name:"Análisis Numérico y Cálculo Avanzado", year:3, cursar:[9], rendir:[9]},

    // 4º año
    {id:26, name:"Seguridad, Higiene e Ing. Ambiental", year:4, cursar:[18], rendir:[18]},
    {id:27, name:"Investigación Operativa", year:4, cursar:[9,11], rendir:[9,11]},
    {id:28, name:"Procesos Industriales", year:4, cursar:[18,20,24], rendir:[18,20,24]},
    {id:29, name:"Mecánica y Mecanismos", year:4, cursar:[9], rendir:[9]},
    {id:30, name:"Evaluación de Proyectos", year:4, cursar:[18,19,23,16], rendir:[17,18,19,23]},
    {id:31, name:"Planificación y Control de la Producción", year:4, cursar:[18], rendir:[18]},
    {id:32, name:"Diseño de Producto", year:4, cursar:[15,19], rendir:[15,19]},
    {id:33, name:"Inglés II", year:4, cursar:[16], rendir:[16]},
    {id:34, name:"Instalaciones Industriales", year:4, cursar:[20,21,22,24], rendir:[20,21,22,24]},
    {id:35, name:"Legislación", year:4, cursar:[], rendir:[10]},

    // 5º año
    {id:36, name:"Mantenimiento", year:5, cursar:[34], rendir:[34]},
    {id:37, name:"Manejo de Materiales y Distribución de Plantas", year:5, cursar:[18,29], rendir:[18,29]},
    {id:38, name:"Comercio Exterior", year:5, cursar:[30], rendir:[30]},
    {id:39, name:"Relaciones Industriales", year:5, cursar:[18], rendir:[18]},
    {id:40, name:"Proyecto Final", year:5, cursar:[], rendir:[]}, // habilita cuando TODAS las demás están aprobadas
    {id:41, name:"Ingeniería en Calidad", year:5, cursar:[18], rendir:[18]},
    {id:42, name:"Control de Gestión", year:5, cursar:[17,23], rendir:[17,23]},
  ],
};

/* ====== Persistencia ====== */
const STORAGE_KEY = "correlativas_estado_v6";
const byId = id => document.getElementById(id);
const subjectMap = new Map(data.subjects.map(s=>[s.id,s]));

function loadState(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}"); }catch{ return {}; } }
function saveState(st){ localStorage.setItem(STORAGE_KEY, JSON.stringify(st)); }
let state = loadState(); // { [id]: 0 none | 1 regular | 2 aprobada }
function getState(id){ return state[id] ?? 0; }
function setState(id,val){ state[id]=val; saveState(state); }

/* ====== Reglas ====== */
function isPF(id){ return id===40; }
function allOthersApproved(){ return data.subjects.filter(s=>!isPF(s.id)).every(s=>getState(s.id)>=2); }
function canCursar(subject){
  if (isPF(subject.id)) return allOthersApproved();
  if (!subject.cursar || subject.cursar.length===0) return true;
  return subject.cursar.every(pid => getState(pid) >= 1); // regular/aprobada
}
function canRendir(subject){
  if (isPF(subject.id)) return allOthersApproved();
  if (!subject.rendir || subject.rendir.length===0) return true;
  return subject.rendir.every(pid => getState(pid) >= 2); // aprobada
}

/* ====== Estilos e UI (modal + progreso gamer) ====== */
function injectUXStyles(){
  if (document.getElementById("uxDynamicStyles")) return;
  const css = `
  /* Modal */
  .nice-modal-overlay{ position:fixed; inset:0; background:rgba(0,0,0,.48);
    display:flex; align-items:center; justify-content:center; z-index:9999; animation:fadeIn .15s }
  .nice-modal{ width:min(620px, 94vw); background:#0f1115; color:#e5e7eb;
    border:1px solid #2b2e37; border-radius:18px; box-shadow:0 24px 90px rgba(0,0,0,.55);
    overflow:hidden; transform:translateY(6px); animation:slideUp .18s ease-out forwards }
  .nice-modal header{ display:flex; align-items:center; justify-content:space-between; gap:8px;
    padding:16px 18px; border-bottom:1px solid #21242c; background:#0b0d12 }
  .nice-modal h3{ font-size:16px; margin:0; color:#d1d5db }
  .nice-modal .close{ background:#1f2430; border:1px solid #2b2f3a; color:#cbd5e1; border-radius:10px;
    padding:8px 12px; cursor:pointer; font-size:12px }
  .nice-modal .content{ padding:16px 18px; font-size:14px; line-height:1.5 }
  .nice-modal .content ul{ margin:.5em 0; padding-left:1.15em }
  .nice-modal .content li{ margin:.25em 0 }
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{transform:translateY(10px)}to{transform:translateY(0)}}

  /* Barra de progreso gamer */
  .progress-wrap{
    display:flex; align-items:center; gap:14px; padding:12px 14px; border:1px solid #2a2c31;
    border-radius:14px; background:#12141a; box-shadow:0 10px 32px rgba(0,0,0,.28)
  }
  .progress-title{ font-size:13px; color:#cbd5e1; font-weight:700; letter-spacing:.2px }
  .progress{
    position:relative; flex:1; height:20px; background:#1b1e26; border-radius:999px; overflow:hidden;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,.03);
  }
  .progress > span{
    position:absolute; left:0; top:0; bottom:0; width:0%;
    background:
      repeating-linear-gradient(135deg, rgba(255,255,255,.12) 0 10px, rgba(255,255,255,0) 10px 20px),
      linear-gradient(90deg, #16a34a, #22c55e, #34d399);
    background-size: 40px 40px, 100% 100%;
    background-position: 0 0, 0 0;
    transition: filter .2s;
  }
  .progress.loading > span{
    animation: barber 0.6s linear infinite;
    filter: drop-shadow(0 0 6px rgba(34,197,94,.45));
  }
  @keyframes barber { to { background-position: 40px 0, 0 0; } }
  .progress > span::after{
    content:""; position:absolute; inset:0;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.16) 50%, transparent 100%);
    mix-blend-mode: screen; transform: translateX(-100%);
  }
  .progress.loading > span::after{ animation: sheen 1.6s ease-in-out infinite; }
  @keyframes sheen { to { transform: translateX(100%); } }

  .progress-count{ font-size:13px; color:#e5e7eb; min-width:118px; text-align:right; font-variant-numeric:tabular-nums }

  /* Popup de ganancia */
  .gain-pop{
    position:fixed; z-index:9999; padding:6px 10px; border-radius:999px;
    background:rgba(34,197,94,.14); border:1px solid rgba(34,197,94,.5); color:#d1fae5; font-weight:700;
    pointer-events:none; transform:translateY(8px) scale(.98); opacity:0; 
    animation: popRise .9s ease-out forwards;
    text-shadow: 0 1px 0 rgba(0,0,0,.5);
  }
  @keyframes popRise{
    0% { opacity:0; transform:translateY(8px) scale(.94) }
    20%{ opacity:1; transform:translateY(0)   scale(1.02) }
    100%{ opacity:0; transform:translateY(-24px) scale(1) }
  }

  /* Topbar acomodo */
  .topbar{ gap:16px }
  `;
  const style = document.createElement("style");
  style.id = "uxDynamicStyles";
  style.textContent = css;
  document.head.appendChild(style);
}
function showNiceModal({title="Información", html=""}){
  injectUXStyles();
  const overlay = document.createElement("div");
  overlay.className = "nice-modal-overlay";
  overlay.addEventListener("click", (e)=>{ if(e.target===overlay) close(); });

  const modal = document.createElement("div");
  modal.className = "nice-modal";
  modal.innerHTML = `
    <header>
      <h3>${title}</h3>
      <button class="close" aria-label="Cerrar">Cerrar</button>
    </header>
    <div class="content">${html}</div>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function close(){ document.body.removeChild(overlay); }
  modal.querySelector(".close").addEventListener("click", close);
  document.addEventListener("keydown", function esc(ev){
    if(ev.key==="Escape"){ close(); document.removeEventListener("keydown", esc); }
  });
}

/* ====== Progreso (aprobadas) con animación ====== */
let prevCount = 0, prevPct = 0;

function ensureProgressOnly(){
  injectUXStyles();
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  const controls = topbar.querySelector(".controls");
  if (controls) controls.innerHTML = ""; // limpiamos cualquier cosa previa

  if (!document.getElementById("progressWrap")){
    const wrap = document.createElement("div");
    wrap.id = "progressWrap";
    wrap.className = "progress-wrap";

    const title = document.createElement("div");
    title.className = "progress-title";
    title.textContent = "Progreso de la carrera (aprobadas)";

    const bar = document.createElement("div");
    bar.id = "progressBar";
    bar.className = "progress";
    const fill = document.createElement("span");
    fill.id = "progressFill";
    bar.appendChild(fill);

    const count = document.createElement("div");
    count.id = "progressCount";
    count.className = "progress-count";

    wrap.appendChild(title);
    wrap.appendChild(bar);
    wrap.appendChild(count);

    (controls || topbar).appendChild(wrap);
  }
}

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function animateProgress(fromPct, toPct, fromCount, toCount, duration=800){
  ensureProgressOnly();
  const bar = document.getElementById("progressBar");
  const fill = document.getElementById("progressFill");
  const count = document.getElementById("progressCount");
  if (!bar || !fill || !count) return;

  const start = performance.now();
  bar.classList.add("loading");

  function frame(now){
    const t = Math.min(1, (now - start) / duration);
    const k = easeOutCubic(t);
    const currPct = Math.round(fromPct + (toPct - fromPct) * k);
    const currCount = Math.round(fromCount + (toCount - fromCount) * k);

    fill.style.width = currPct + "%";
    count.textContent = `${currCount}/${data.subjects.length} (${currPct}%)`;

    if (t < 1){
      requestAnimationFrame(frame);
    } else {
      fill.style.width = toPct + "%";
      count.textContent = `${toCount}/${data.subjects.length} (${toPct}%)`;
      bar.classList.remove("loading");
      if (toPct % 25 === 0 && toPct !== 0){
        fill.style.filter = "drop-shadow(0 0 10px rgba(34,197,94,.75))";
        setTimeout(()=>{ fill.style.filter=""; }, 450);
      }
    }
  }
  requestAnimationFrame(frame);
}

function spawnGainPopup(delta){
  if (!delta || delta < 0) return;
  const wrap = document.getElementById("progressWrap");
  if (!wrap) return;
  const rect = wrap.getBoundingClientRect();
  const pop = document.createElement("div");
  pop.className = "gain-pop";
  pop.textContent = `+${delta} Aprobada${delta>1?"s":""}`;
  document.body.appendChild(pop);
  const x = rect.left + rect.width/2 - pop.offsetWidth/2;
  const y = rect.top - 8;
  pop.style.left = Math.max(8, x) + "px";
  pop.style.top  = Math.max(8, y) + "px";
  setTimeout(()=>{ pop.remove(); }, 950);
}

function updateProgressBar(){
  ensureProgressOnly();
  const total = data.subjects.length;
  const aprobadas = data.subjects.filter(s => getState(s.id)===2).length;
  const pct = Math.round((aprobadas / total) * 100);

  const delta = Math.max(0, aprobadas - prevCount);
  if (delta > 0) spawnGainPopup(delta);

  animateProgress(prevPct, pct, prevCount, aprobadas, 800);

  prevPct = pct;
  prevCount = aprobadas;
}

/* ====== Texto del modal para requisitos ====== */
function missingForCursar(subject){
  if (isPF(subject.id)){
    const faltan = data.subjects.filter(s=>!isPF(s.id) && getState(s.id)<2).map(s=>s.name);
    return { regularizar: [], aprobar: faltan };
  }
  const regNeeded = (subject.cursar||[]).filter(pid => getState(pid) < 1).map(pid => subjectMap.get(pid).name);
  const aprNeeded = []; // para CURSAR no pedimos aprobar
  return { regularizar: regNeeded, aprobar: aprNeeded };
}

function htmlForBlocked(subject){
  const miss = missingForCursar(subject);
  const aprRendir = isPF(subject.id)
    ? data.subjects.filter(s=>!isPF(s.id) && getState(s.id)<2).map(s=>s.name)
    : (subject.rendir||[]).filter(pid => getState(pid)<2).map(pid => subjectMap.get(pid).name);

  const parts = [];
  parts.push(`<p>No podés cursar <strong>${subject.name}</strong> todavía.</p>`);

  if (miss.regularizar.length){
    parts.push(`<p>Para <strong>CURSAR</strong> necesitás <u>regularizar</u> (o aprobar):</p>`);
    parts.push(`<ul>${miss.regularizar.map(n=>`<li>${n}</li>`).join("")}</ul>`);
  }
  if (isPF(subject.id)){
    parts.push(`<p>Para <strong>Proyecto Final</strong> debés <u>aprobar todas</u> las demás materias. Te faltan aprobar:</p>`);
    const faltan = miss.aprobar.length ? miss.aprobar : aprRendir;
    parts.push(`<ul>${faltan.map(n=>`<li>${n}</li>`).join("")}</ul>`);
  } else if (aprRendir.length){
    parts.push(`<p>Para <strong>RENDIR</strong> luego vas a necesitar <u>aprobar</u>:</p>`);
    parts.push(`<ul>${aprRendir.map(n=>`<li>${n}</li>`).join("")}</ul>`);
  }

  return parts.join("");
}

/* ====== Layout y Render ====== */
const yearsContainer = byId("yearsContainer");

function applyColumnLayout(){
  yearsContainer.style.display = "grid";
  yearsContainer.style.gridAutoFlow = "column";
  yearsContainer.style.gridAutoColumns = "minmax(260px, 1fr)";
  yearsContainer.style.alignItems = "start";
  yearsContainer.style.columnGap = "24px";
  yearsContainer.style.rowGap = "16px";
}

function render(){
  yearsContainer.innerHTML = "";
  applyColumnLayout();
  ensureProgressOnly();

  const years = Array.from(new Set(data.subjects.map(s => s.year))).sort((a,b)=>a-b);

  years.forEach(year=>{
    const col = document.createElement("div");
    col.style.display = "grid";
    col.style.gridAutoRows = "max-content";
    col.style.rowGap = "12px";

    // Encabezado de columna
    const header = document.createElement("div");
    header.className = "year-title";
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "10px";
    header.style.marginBottom = "6px";

    const badge = document.createElement("div");
    badge.className = "year-badge";
    badge.textContent = year;

    const ht = document.createElement("div");
    ht.textContent = `Año ${year}`;
    ht.style.color = "#a1a1aa";

    header.appendChild(badge);
    header.appendChild(ht);
    col.appendChild(header);

    // Materias
    data.subjects.filter(s=>s.year===year).forEach(s=>{
      const card = document.createElement("div");
      card.className = "subject";
      card.dataset.id = s.id;

      const stVal = getState(s.id);
      const puedeCursar = canCursar(s);

      // Dimming si NO habilita cursar
      card.style.opacity = puedeCursar ? "1" : "0.45";
      card.style.filter = puedeCursar ? "none" : "grayscale(0.15)";

      // Iluminación por estado: azul Regular, verde Aprobada
      if (stVal === 2) {
        card.style.background = "rgba(52, 211, 153, 0.12)";
        card.style.boxShadow = "0 0 0 2px rgba(52,211,153,.25)";
        card.style.border = "1px solid rgba(52,211,153,.35)";
      } else if (stVal === 1) {
        card.style.background = "rgba(99, 179, 237, 0.10)";
        card.style.boxShadow = "0 0 0 2px rgba(99,179,237,.25)";
        card.style.border = "1px solid rgba(99,179,237,.35)";
      } else {
        card.style.background = "";
        card.style.boxShadow = "";
        card.style.border = "";
      }

      const code = document.createElement("div");
      code.className = "code";
      code.textContent = `#${s.id.toString().padStart(2,"0")}`;

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = s.name;

      const badges = document.createElement("div");
      badges.className = "badges";
      if (!isPF(s.id)) {
        if (s.cursar?.length){
          const b = document.createElement("span");
          b.className = "badge";
          b.textContent = `Cursar: ${s.cursar.join(", ")}`;
          badges.appendChild(b);
        }
        if (s.rendir?.length){
          const b = document.createElement("span");
          b.className = "badge";
          b.textContent = `Rendir: ${s.rendir.join(", ")}`;
          badges.appendChild(b);
        }
      } else {
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = "Habilita con TODAS aprobadas";
        badges.appendChild(b);
      }

      const st = document.createElement("div");
      st.className = "state " + (stVal===0?"state-none":stVal===1?"state-regular":"state-aprobada");
      st.textContent = stVal===0 ? "Estado: Sin cursar"
        : (stVal===1 ? "Estado: Regular" : "Estado: Aprobada");

      card.appendChild(code);
      card.appendChild(name);
      card.appendChild(badges);
      card.appendChild(st);

      // Click con bloqueo si no se puede cursar
      card.addEventListener("click", ()=>{
        const beforeCount = data.subjects.filter(x => getState(x.id)===2).length;

        const current = getState(s.id);
        if (current === 0){
          if (!canCursar(s)){
            showNiceModal({ title: "Requisitos pendientes", html: htmlForBlocked(s) });
            return;
          }
          setState(s.id, 1);
        } else if (current === 1){
          setState(s.id, 2);
        } else {
          setState(s.id, 0);
        }

        render();

        const afterCount = data.subjects.filter(x => getState(x.id)===2).length;
        const delta = Math.max(0, afterCount - beforeCount);
        if (delta > 0) spawnGainPopup(delta);
      });

      col.appendChild(card);
    });

    yearsContainer.appendChild(col);
  });

  updateProgressBar();
}

/* ====== Inicio ====== */
window.addEventListener("load", ()=>{
  // Inicializar prevCount/pct con lo actual para evitar animación falsa al abrir
  prevCount = data.subjects.filter(s => getState(s.id)===2).length;
  prevPct = Math.round((prevCount / data.subjects.length) * 100);
  render();
});
