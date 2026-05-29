import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id:"situacion", pregunta:"¿Cómo describirías tu situación económica hoy?",
    sub:"Sé honesto/a. Nadie más lo verá.",
    opciones:[
      {emoji:"🔥",label:"Hendy total",  desc:"No llego a fin de mes",        value:"hendy_total"},
      {emoji:"😓",label:"Ajustado",     desc:"Llego pero sin ahorrar nada",  value:"ajustado"},
      {emoji:"😐",label:"Estable",      desc:"Cubro mis gastos, algo queda", value:"estable"},
      {emoji:"💪",label:"Creciendo",    desc:"Ahorro y quiero invertir",     value:"creciendo"},
    ],
  },
  {
    id:"deuda", pregunta:"¿Tenés deudas o préstamos activos?",
    sub:"Incluye cuotas, fiado, préstamos de amigos.",
    opciones:[
      {emoji:"🚨",label:"Sí, me asfixian",  desc:"No puedo con los pagos", value:"deudas_criticas"},
      {emoji:"⚠️",label:"Sí, manejables",   desc:"Pago pero me ajusta",    value:"deudas_manejables"},
      {emoji:"📋",label:"Solo una pequeña", desc:"Casi la cancelo",        value:"deuda_chica"},
      {emoji:"✅",label:"Sin deudas",        desc:"Estoy limpio/a",         value:"sin_deudas"},
    ],
  },
  {
    id:"meta", pregunta:"¿Cuál es tu mayor sueño financiero ahora mismo?",
    sub:"Lo que más querés lograr en los próximos 12 meses.",
    opciones:[
      {emoji:"🏠",label:"Tener casa propia",desc:"O mejorar donde vivo",         value:"casa"},
      {emoji:"💼",label:"Emprender",         desc:"Arrancar o crecer mi negocio", value:"emprender"},
      {emoji:"🧘",label:"Tranquilidad",      desc:"Solo quiero dejar de deber",   value:"tranquilidad"},
      {emoji:"✈️",label:"Libertad",          desc:"Viajar, estudiar, crecer",     value:"libertad"},
    ],
  },
];

const LECCIONES_BASE = [
  {id:1,emoji:"🪙",titulo:"El truco del sobre",           duracion:"60 seg",categoria:"Ahorro",  preview:"La técnica más antigua del mundo — y la más efectiva para el trabajador informal."},
  {id:2,emoji:"📊",titulo:"¿Qué es un presupuesto real?", duracion:"60 seg",categoria:"Básicos", preview:"No es una planilla de Excel. Es saber adónde va cada guaraní antes de gastarlo."},
  {id:3,emoji:"🚨",titulo:"La deuda que más duele",       duracion:"60 seg",categoria:"Deudas",  preview:"No es la más grande. Es la que pagás con intereses sin darte cuenta."},
  {id:4,emoji:"💸",titulo:"Remesas sin perder plata",     duracion:"60 seg",categoria:"Pagos",   preview:"Cada vez que mandás dinero al exterior, alguien se queda con parte. Así lo evitás."},
  {id:5,emoji:"🌱",titulo:"El fondo de emergencia mínimo",duracion:"60 seg",categoria:"Ahorro",  preview:"No necesitás millones. Con esto alcanza para no endeudarte ante cualquier imprevisto."},
  {id:6,emoji:"🧾",titulo:"Fiado: cuándo sí y cuándo no",duracion:"60 seg",categoria:"Básicos", preview:"El fiado puede ser tu mejor aliado o tu peor trampa. La diferencia está en una sola regla."},
  {id:7,emoji:"📱",titulo:"PIX y pagos digitales",        duracion:"60 seg",categoria:"Pagos",   preview:"El sistema que cambió Brasil y que llegó al Mercosur. Cómo usarlo a tu favor."},
];

const BADGES = [
  {id:"primera_leccion", emoji:"🌱", titulo:"Primera chispa",    desc:"Completaste tu primera lección",        req: c => c >= 1},
  {id:"racha_3",         emoji:"🔥", titulo:"Racha de 3",        desc:"3 días seguidos aprendiendo",           req: (_,s) => s >= 3},
  {id:"mitad",           emoji:"⚡", titulo:"A mitad de camino", desc:"Completaste más de la mitad del plan",  req: c => c >= 4},
  {id:"sin_deudas",      emoji:"💪", titulo:"Mente clara",       desc:"Respondiste sobre tus deudas",          req: (_,__,u) => !!u?.answers},
  {id:"racha_7",         emoji:"🏆", titulo:"Una semana seguida",desc:"7 días de racha — eso es disciplina",   req: (_,s) => s >= 7},
  {id:"completo",        emoji:"🎓", titulo:"Graduado Hendy",    desc:"Completaste todas las lecciones",       req: c => c >= 7},
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}

  @keyframes fadeUp      {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn      {from{opacity:0}to{opacity:1}}
  @keyframes flicker     {0%,100%{opacity:1}45%{opacity:1}50%{opacity:.3}55%{opacity:1}80%{opacity:1}83%{opacity:.5}86%{opacity:1}}
  @keyframes slideOutUp  {from{opacity:1;transform:scale(1) translateY(0)}to{opacity:0;transform:scale(1.03) translateY(-12px)}}
  @keyframes pulseBtn    {0%,100%{box-shadow:0 0 0 0 rgba(255,75,43,.4)}50%{box-shadow:0 0 0 14px rgba(255,75,43,0)}}
  @keyframes orbFloat    {0%,100%{transform:translateY(0) translateX(0)}33%{transform:translateY(-22px) translateX(12px)}66%{transform:translateY(12px) translateX(-18px)}}
  @keyframes grain       {0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(3%,2%)}40%{transform:translate(4%,-1%)}}
  @keyframes lineGrow    {from{width:0}to{width:60px}}
  @keyframes typingPulse {0%,80%,100%{opacity:0;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
  @keyframes resultSlide {from{opacity:0;transform:translateY(40px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes scoreCount  {from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
  @keyframes shimmer     {0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes streakPop   {0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}
  @keyframes progressFill{from{width:0%}to{width:var(--prog)}}
  @keyframes cardReveal  {from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes checkPop    {0%{transform:scale(0) rotate(-10deg)}60%{transform:scale(1.2) rotate(3deg)}100%{transform:scale(1) rotate(0deg)}}
  @keyframes lessonIn    {from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes badgePop    {0%{transform:scale(0) rotate(-15deg);opacity:0}60%{transform:scale(1.15) rotate(3deg)}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes toastSlide  {0%{transform:translateY(100px);opacity:0}15%{transform:translateY(0);opacity:1}80%{transform:translateY(0);opacity:1}100%{transform:translateY(100px);opacity:0}}
  @keyframes cursorBlink {0%,100%{opacity:1}50%{opacity:0}}

  .btn-primary{background:#FF4B2B;color:#fff;border:none;border-radius:16px;padding:18px 36px;font-family:'Syne',sans-serif;font-weight:700;font-size:16px;cursor:pointer;width:100%;transition:background .2s,transform .15s;animation:pulseBtn 2.5s ease-in-out infinite;}
  .btn-primary:hover{background:#e03d22;transform:scale(1.02);animation:none;}
  .btn-primary:disabled{background:#2a1510;color:#5a2a20;cursor:not-allowed;animation:none;}
  .btn-ghost{background:transparent;color:#555;border:1px solid #1e1e1e;border-radius:16px;padding:16px 36px;font-family:'DM Sans',sans-serif;font-size:14px;cursor:pointer;width:100%;transition:all .2s;margin-top:12px;}
  .btn-ghost:hover{border-color:#444;color:#ccc;}
  .opt-btn{background:#0e0e0e;border:1px solid #1e1e1e;border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:16px;cursor:pointer;transition:all .2s;text-align:left;width:100%;}
  .opt-btn:hover{border-color:#FF4B2B;background:#130a09;}
  .opt-btn.active{border-color:#FF4B2B;background:#1a0d09;}
  .stat-card{background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:16px 20px;flex:1;transition:border-color .2s;}
  .stat-card:hover{border-color:#333;}
  .tag{display:inline-flex;align-items:center;gap:6px;background:#141414;border:1px solid #222;border-radius:100px;padding:6px 14px;font-size:12px;color:#888;font-family:'DM Sans',sans-serif;}
  .dot-live{width:6px;height:6px;border-radius:50%;background:#FF4B2B;animation:typingPulse 1.5s ease infinite;}
  .typing-dot{width:8px;height:8px;border-radius:50%;background:#FF4B2B;display:inline-block;}
  .typing-dot:nth-child(1){animation:typingPulse 1.2s .0s infinite}
  .typing-dot:nth-child(2){animation:typingPulse 1.2s .2s infinite}
  .typing-dot:nth-child(3){animation:typingPulse 1.2s .4s infinite}
  .result-card{background:#111;border:1px solid #1e1e1e;border-radius:20px;padding:20px;animation:resultSlide .6s ease both;}
  .shimmer-line{height:14px;border-radius:8px;background:linear-gradient(90deg,#1a1a1a 25%,#252525 50%,#1a1a1a 75%);background-size:800px 100%;animation:shimmer 1.5s infinite;}
  .lesson-card{background:#0e0e0e;border:1px solid #1e1e1e;border-radius:20px;padding:20px;cursor:pointer;transition:all .25s;width:100%;text-align:left;animation:cardReveal .4s ease both;}
  .lesson-card:hover{border-color:#FF4B2B33;background:#130a09;transform:translateY(-2px);}
  .lesson-card.completed{border-color:#4ade8033;background:#0a130a;}
  .lesson-card.active-today{border-color:#FF4B2B;background:#130a09;}
  .streak-badge{display:inline-flex;align-items:center;gap:8px;background:#1a1208;border:1px solid #3a2810;border-radius:100px;padding:8px 16px;}
  .progress-bar-bg{background:#1a1a1a;border-radius:100px;height:6px;overflow:hidden;}
  .progress-bar-fill{height:100%;background:#FF4B2B;border-radius:100px;animation:progressFill .8s ease forwards;}
  .category-pill{display:inline-flex;align-items:center;padding:4px 10px;border-radius:100px;font-size:11px;font-family:'DM Sans',sans-serif;font-weight:500;letter-spacing:.5px;}
  .nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:12px 8px;transition:opacity .2s;}

  @keyframes proGlow { 0%,100%{box-shadow:0 0 20px rgba(250,204,21,.15)} 50%{box-shadow:0 0 40px rgba(250,204,21,.3)} }
  @keyframes lockShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
  .pro-banner{background:linear-gradient(135deg,#1a1208,#120a1a);border:1px solid #facc1544;border-radius:20px;padding:24px;}
  .pro-feature{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #1a1a1a;}
  .pro-feature:last-child{border-bottom:none;}
  .lock-overlay{position:absolute;inset:0;background:rgba(10,10,10,.85);border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;backdrop-filter:blur(2px);}
  .feature-row{display:flex;align-items:flex-start;gap:16px;padding:18px 0;border-bottom:1px solid #161616;}
  .feature-row:last-child{border-bottom:none;}
  .badge-card{background:#0e0e0e;border:1px solid #1e1e1e;border-radius:16px;padding:16px;display:flex;align-items:center;gap:14px;transition:all .2s;}
  .badge-card.earned{border-color:#facc1544;background:#141008;}
  .badge-card.locked{opacity:.35;}
  .name-input{background:#111;border:1px solid #2a2a2a;border-radius:14px;padding:16px 20px;font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#fff;width:100%;outline:none;transition:border-color .2s;text-align:center;letter-spacing:-.5px;}
  .name-input:focus{border-color:#FF4B2B;}
  .name-input::placeholder{color:#333;}
  .toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#1a1208;border:1px solid #FF4B2B44;border-radius:100px;padding:12px 24px;display:flex;align-items:center;gap:10px;z-index:200;animation:toastSlide 3.5s ease forwards;white-space:nowrap;}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const Ambient = () => (
  <>
    <div style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none",opacity:.035,
      backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      animation:"grain .5s steps(1) infinite"}}/>
    <div style={{position:"fixed",top:"-10%",right:"-10%",width:400,height:400,borderRadius:"50%",pointerEvents:"none",
      background:"radial-gradient(circle,rgba(255,75,43,.12) 0%,transparent 70%)",animation:"orbFloat 8s ease-in-out infinite"}}/>
    <div style={{position:"fixed",bottom:"-15%",left:"-10%",width:500,height:500,borderRadius:"50%",pointerEvents:"none",
      background:"radial-gradient(circle,rgba(255,75,43,.07) 0%,transparent 70%)",animation:"orbFloat 10s ease-in-out infinite reverse"}}/>
  </>
);

const catColor = {Ahorro:"#facc15",Básicos:"#60a5fa",Deudas:"#f87171",Pagos:"#4ade80"};

// ─── SPLASH ───────────────────────────────────────────────────────────────────
const Splash = ({done}) => (
  <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",
    justifyContent:"center",zIndex:100,background:"#0A0A0A",
    animation:done?"slideOutUp .5s ease forwards":"fadeIn .4s ease"}}>
    <div style={{textAlign:"center"}}>
      <div style={{fontSize:64,animation:"flicker 2s ease infinite",marginBottom:20,lineHeight:1}}>🔥</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:52,color:"#fff",letterSpacing:"-2px",lineHeight:1}}>hendy</div>
      <div style={{height:2,background:"#FF4B2B",borderRadius:2,marginTop:10,animation:"lineGrow 1.5s ease forwards",width:0}}/>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#555",marginTop:16,
        letterSpacing:"3px",textTransform:"uppercase",animation:"fadeIn 1s ease 1s both"}}>Dejá de estarlo.</div>
    </div>
  </div>
);

// ─── ONBOARDING — NOMBRE ──────────────────────────────────────────────────────
const NameScreen = ({onContinue}) => {
  const [name,setName] = useState("");
  const inputRef = useRef(null);
  useEffect(()=>{ setTimeout(()=>inputRef.current?.focus(),400); },[]);
  return (
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",
      justifyContent:"center",padding:"0 28px 60px",animation:"fadeIn .5s ease"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:56,animation:"flicker 2s ease infinite",marginBottom:16}}>🔥</div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:"#fff",
          letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:12}}>
          ¿Cómo te<br/><span style={{color:"#FF4B2B"}}>llamás?</span>
        </h1>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:15,color:"#555",lineHeight:1.7}}>
          Tu coach necesita saber<br/>con quién está hablando.
        </p>
      </div>
      <input
        ref={inputRef}
        className="name-input"
        placeholder="Tu nombre aquí..."
        value={name}
        onChange={e=>setName(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&name.trim()&&onContinue(name.trim())}
        maxLength={20}
      />
      {name.trim() && (
        <div style={{marginTop:12,textAlign:"center",fontFamily:"'DM Sans',sans-serif",
          fontSize:13,color:"#555",animation:"fadeIn .3s ease"}}>
          Hola, <span style={{color:"#FF4B2B",fontWeight:600}}>{name.trim()}</span> 👋
        </div>
      )}
      <div style={{marginTop:32}}>
        <button className="btn-primary" onClick={()=>name.trim()&&onContinue(name.trim())} disabled={!name.trim()}>
          Empezar mi diagnóstico →
        </button>
      </div>
      <div style={{textAlign:"center",marginTop:20,fontFamily:"'DM Sans',sans-serif",
        fontWeight:300,fontSize:12,color:"#333"}}>
        Solo tu nombre. Nada más. 🔒
      </div>
    </div>
  );
};

// ─── HOME ─────────────────────────────────────────────────────────────────────
const Home = ({onStart,userName}) => (
  <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"0 0 100px",animation:"fadeIn .6s ease"}}>
    <div style={{padding:"56px 28px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <span style={{fontSize:22}}>🔥</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:"#fff",letterSpacing:"-1px"}}>hendy</span>
        </div>
        <div className="tag"><span className="dot-live"/><span>Coach financiero IA · Paraguay</span></div>
      </div>
    </div>
    <div style={{padding:"36px 28px 0",animation:"fadeUp .6s ease .1s both"}}>
      {userName && (
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#555",marginBottom:8}}>
          Hola, <span style={{color:"#FF4B2B",fontWeight:600}}>{userName}</span> 👋
        </div>
      )}
      <h1 style={{fontWeight:800,fontSize:40,color:"#fff",lineHeight:1.05,letterSpacing:"-1.5px",marginBottom:8}}>
        "Hendy" es<br/><span style={{color:"#FF4B2B"}}>donde estás.</span>
      </h1>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:15,color:"#555",lineHeight:1.65,marginTop:14}}>
        La app que te entiende — y te ayuda a salir de ahí.
      </p>
    </div>
    <div style={{padding:"28px 28px 0",display:"flex",gap:12,animation:"fadeUp .6s ease .2s both"}}>
      {[{label:"Usuarios",val:"12K+",sub:"↑ creciendo",c:"#FF4B2B"},{label:"Lecciones",val:"60\"",sub:"por día",c:"#555"},{label:"Países",val:"5",sub:"Mercosur",c:"#555"}].map((s,i)=>(
        <div key={i} className="stat-card">
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#444",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#fff",letterSpacing:"-1px"}}>{s.val}</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:s.c,marginTop:2}}>{s.sub}</div>
        </div>
      ))}
    </div>
    <div style={{margin:"28px 28px 0",background:"#0e0e0e",border:"1px solid #181818",borderRadius:20,padding:"4px 20px",animation:"fadeUp .6s ease .3s both"}}>
      {[
        {icon:"🧠",bg:"#1a1208",label:"Diagnóstico personalizado",desc:"3 preguntas. Tu mapa financiero real."},
        {icon:"📅",bg:"#0d1a0d",label:"Micro-lecciones diarias",desc:"60 segundos. Lenguaje de la feria, no del banco."},
        {icon:"🏆",bg:"#1a1208",label:"Logros y badges",desc:"Ganá medallas por tu progreso y tu racha."},
        {icon:"💸",bg:"#1a0d0d",label:"Conectado a NXB",desc:"Mové tu plata sin comisiones cuando estés listo."},
      ].map((f,i)=>(
        <div key={i} className="feature-row">
          <div style={{width:44,height:44,borderRadius:12,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{f.icon}</div>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#ddd",marginBottom:3}}>{f.label}</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#555",lineHeight:1.5}}>{f.desc}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{padding:"28px 28px 0",animation:"fadeUp .6s ease .5s both"}}>
      <button className="btn-primary" onClick={onStart}>Empezar mi diagnóstico →</button>
    </div>
    <div style={{textAlign:"center",marginTop:20,fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#333"}}>
      Gratis. Sin tarjeta. Solo tu decisión. 🔥
    </div>
  </div>
);

// ─── QUIZ ─────────────────────────────────────────────────────────────────────
const Quiz = ({onFinish,onBack,userName}) => {
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [selected,setSelected]=useState(null);
  const [out,setOut]=useState(false);
  const q=QUESTIONS[step];
  const next=()=>{
    if(!selected)return;
    const na={...answers,[q.id]:selected};
    setOut(true);
    setTimeout(()=>{ if(step===QUESTIONS.length-1){onFinish(na);}else{setStep(s=>s+1);setSelected(null);setOut(false);} },320);
  };
  return (
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",
      padding:"56px 28px 32px",animation:out?"slideOutUp .32s ease forwards":"fadeIn .4s ease"}}>
      <button onClick={step===0?onBack:()=>{setStep(s=>s-1);setSelected(null);}}
        style={{background:"none",border:"none",color:"#555",cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif",fontSize:14,display:"flex",alignItems:"center",gap:8,marginBottom:40,padding:0}}>
        ← {step===0?"Volver":"Anterior"}
      </button>
      <div style={{display:"flex",gap:6,marginBottom:48}}>
        {QUESTIONS.map((_,i)=>(<div key={i} style={{height:3,flex:1,borderRadius:2,background:i<=step?"#FF4B2B":"#1e1e1e",transition:"background .3s"}}/>))}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        {userName&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#444",marginBottom:8}}>{userName},</div>}
        <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#444",letterSpacing:"2px",textTransform:"uppercase",marginBottom:14}}>Pregunta {step+1} de {QUESTIONS.length}</div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:28,color:"#fff",letterSpacing:"-1px",lineHeight:1.15,marginBottom:10}}>{q.pregunta}</h2>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#555",marginBottom:32,lineHeight:1.6}}>{q.sub}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opciones.map((opt,i)=>(
            <button key={opt.value} className={`opt-btn${selected===opt.value?" active":""}`}
              onClick={()=>setSelected(opt.value)} style={{animation:`fadeUp .35s ease ${i*.06}s both`}}>
              <span style={{fontSize:24,flexShrink:0}}>{opt.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#ddd",marginBottom:2}}>{opt.label}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#555"}}>{opt.desc}</div>
              </div>
              <div style={{color:selected===opt.value?"#FF4B2B":"#333",fontSize:18,transition:"color .2s"}}>{selected===opt.value?"●":"›"}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{marginTop:32}}>
        <button className="btn-primary" onClick={next} disabled={!selected}>
          {step===QUESTIONS.length-1?"Ver mi diagnóstico 🔥":"Siguiente →"}
        </button>
      </div>
      <div style={{textAlign:"center",marginTop:16,fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#333"}}>Tus respuestas son 100% privadas 🔒</div>
    </div>
  );
};

// ─── LOADING ──────────────────────────────────────────────────────────────────
const Loading = ({userName}) => (
  <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",padding:"0 28px",animation:"fadeIn .4s ease"}}>
    <div style={{fontSize:52,animation:"flicker 1.5s ease infinite",marginBottom:24}}>🔥</div>
    <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:24,color:"#fff",textAlign:"center",letterSpacing:"-1px",marginBottom:12}}>
      {userName?`Analizando tu situación,\n${userName}...`:"Analizando tu situación..."}
    </h2>
    <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#555",textAlign:"center",lineHeight:1.7,marginBottom:36}}>
      La IA está construyendo<br/>tu plan personalizado.
    </p>
    <div style={{display:"flex",gap:8}}><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div>
    <div style={{width:"100%",marginTop:48,display:"flex",flexDirection:"column",gap:12}}>
      {[100,80,65,90].map((w,i)=>(<div key={i} className="shimmer-line" style={{width:`${w}%`,animationDelay:`${i*.15}s`}}/>))}
    </div>
  </div>
);

// ─── RESULT ───────────────────────────────────────────────────────────────────
const Result = ({data,userName,onContinue}) => {
  const [copied,setCopied]=useState(false);
  const scoreColor=data.score>=70?"#4ade80":data.score>=40?"#facc15":"#FF4B2B";
  return (
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .5s ease"}}>
      <div style={{textAlign:"center",marginBottom:24,animation:"scoreCount .6s ease .1s both",opacity:0}}>
        <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:24,padding:"22px 40px"}}>
          <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#444",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>
            {userName?"Diagnóstico de "+userName:"Tu puntaje Hendy"}
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:60,color:scoreColor,lineHeight:1,letterSpacing:"-3px"}}>{data.score}</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#444",marginTop:2}}>de 100</div>
        </div>
      </div>
      <div style={{animation:"fadeUp .5s ease .2s both",opacity:0}}>
        <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#FF4B2B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>Tu diagnóstico</div>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px",lineHeight:1.15,marginBottom:14}}>{data.titulo}</h2>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#aaa",lineHeight:1.7}}>{data.resumen}</p>
      </div>
      <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
        <div className="result-card" style={{animationDelay:".3s"}}>
          <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#4ade80",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>💪 Tu fortaleza</div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#ccc",lineHeight:1.6}}>{data.fortaleza}</p>
        </div>
        <div className="result-card" style={{animationDelay:".4s"}}>
          <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#FF4B2B",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>⚠️ Tu mayor riesgo</div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#ccc",lineHeight:1.6}}>{data.riesgo}</p>
        </div>
        <div className="result-card" style={{animationDelay:".5s",borderColor:"#FF4B2B22"}}>
          <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#facc15",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>🎯 Tu primer paso</div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#ccc",lineHeight:1.6}}>{data.primer_paso}</p>
        </div>
      </div>
      <div style={{marginTop:20,animation:"resultSlide .5s ease .6s both",opacity:0}}>
        <button className="btn-primary" onClick={onContinue} style={{animation:"none"}}>
          Comenzar mis lecciones →
        </button>
        <button onClick={()=>{navigator.clipboard.writeText(`🔥 Mi diagnóstico Hendy${userName?" de "+userName:""}:\n"${data.titulo}"\n\nDescubrí el tuyo en hendy.app`).then(()=>setCopied(true));setTimeout(()=>setCopied(false),2000)}}
          className="btn-ghost" style={{borderColor:copied?"#4ade80":"#1e1e1e",color:copied?"#4ade80":"#555"}}>
          {copied?"✅ Copiado para compartir":"📤 Compartir mi diagnóstico"}
        </button>
      </div>
    </div>
  );
};

// ─── ACADEMY ──────────────────────────────────────────────────────────────────
const FREE_LESSONS = 2; // lecciones gratis antes del paywall

const Academy = ({userData,streak,completed,onComplete,userName,isPro,onUpgrade}) => {
  const [active,setActive]=useState(null);
  const [content,setContent]=useState(null);
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [timer,setTimer]=useState(60);
  const [timerOn,setTimerOn]=useState(false);

  useEffect(()=>{
    if(!timerOn||timer<=0)return;
    const t=setInterval(()=>setTimer(s=>s-1),1000);
    return()=>clearInterval(t);
  },[timerOn,timer]);

  const LESSON_CONTENT = {
    1:{
      gancho:"¿Sabías que el 80% gasta antes de ahorrar — y por eso nunca ahorra?",
      cuerpo:"El truco del sobre es una de las técnicas más simples y efectivas para manejar la plata en el día a día. La idea es sencilla: dividís tu ingreso apenas lo recibís en partes físicas o mentales — una para comida, una para transporte, una para servicios, y una para lo que queda.\n\nCuando el sobre de comida se vacía, terminó la comida por esa semana. No hay debate, no hay tarjeta que salve. Eso te fuerza a ser creativo y consciente con lo que tenés.\n\nEn Paraguay, esto funciona especialmente bien para feriantes, remeseros y trabajadores independientes, porque el ingreso no es fijo y necesitás estructura sin complicaciones.\n\nNo necesitás app ni planilla. Un sobre de papel o cuatro bolsillos ya es suficiente para empezar hoy mismo.",
      dato_clave:"Las personas que usan el método del sobre ahorran hasta un 30% más en su primer mes — sin ganar más plata.",
      accion:"Hoy mismo separás tu plata en 4 partes apenas la recibas. Solo eso."
    },
    2:{
      gancho:"Un presupuesto no es para ricos — es para los que no quieren seguir siendo pobres.",
      cuerpo:"La palabra 'presupuesto' asusta a mucha gente. Parece algo del banco, de los ricos, de los que tienen contador. Pero en realidad es lo más simple del mundo: saber cuánto entra y cuánto sale antes de que salga.\n\nEl presupuesto más básico que existe tiene solo dos columnas: ENTRA y SALE. Cada semana o cada quincena anotás todo. Si lo que sale es más que lo que entra, tenés un problema que se puede arreglar. Si es menos, tenés una oportunidad de ahorrar.\n\nLa mayoría de las personas en Paraguay no tiene presupuesto porque creen que es complicado. Pero la realidad es que sin uno, la plata simplemente desaparece sin que sepas adónde fue.\n\nEmpezá con papel y lápiz. Nada digital, nada de apps por ahora. Solo el papel que no miente.",
      dato_clave:"El 76% de las personas que llevan registro de sus gastos logran ahorrar algo al mes, aunque sea poco.",
      accion:"Esta semana anotás en papel todo lo que gastás, sin juzgarte. Solo registrás."
    },
    3:{
      gancho:"No es la deuda más grande la que te hunde — es la que no ves.",
      cuerpo:"Hay un tipo de deuda que casi nadie calcula bien: los intereses. Cuando pedís fiado en el almacén, cuando comprás en cuotas sin preguntar el total, cuando usás una tarjeta sin leer la letra chica — ahí está la deuda que más duele.\n\nEn Paraguay es muy común el 'préstamo de amigo' o la financiera del barrio. Parecen fáciles pero muchas veces tienen tasas de interés que duplican lo que pediste en menos de un año.\n\nLa regla de oro es simple: antes de aceptar cualquier préstamo o crédito, preguntá siempre cuánto vas a terminar pagando en total. No cuánto por mes — en total. Ese número te dice la verdad.\n\nSi no podés calcular el total, no firmés. Si te apuran para que decidas rápido, es señal de que algo no está bien.",
      dato_clave:"Una deuda con 30% de interés anual duplica su valor en menos de 3 años aunque pagues las cuotas mínimas.",
      accion:"Agarrás una deuda que tenés y calculás cuánto pagaste ya vs cuánto pediste. La diferencia es lo que te costó."
    },
    4:{
      gancho:"Cada vez que mandás dinero al exterior, alguien se queda con parte — ¿ya sabés cuánto?",
      cuerpo:"Las remesas son una fuente enorme de dinero para Paraguay y el Mercosur. Pero el sistema tradicional está lleno de intermediarios que se quedan con entre el 5% y el 15% de cada transferencia. Eso significa que de cada $100 que mandás, pueden llegar solo $85.\n\nEl problema no es solo la comisión visible. También están los tipos de cambio manipulados, las tarifas ocultas y los tiempos de espera. Todo eso es dinero que sale de tu bolsillo o del bolsillo de tu familia.\n\nLas nuevas fintechs como NXB están cambiando esto para el Mercosur — comisiones mínimas, tipo de cambio justo y transferencias en minutos. El modelo tradicional no puede competir con eso.\n\nMientras tanto, siempre compará al menos 3 opciones antes de mandar dinero. La diferencia entre la mejor y la peor opción puede ser de miles de guaraníes en cada envío.",
      dato_clave:"Se estima que los trabajadores del Mercosur pierden más de $2.000 millones al año en comisiones de remesas evitables.",
      accion:"La próxima vez que mandés o recibas dinero, comparás el tipo de cambio en al menos 2 lugares antes de elegir."
    },
    5:{
      gancho:"No necesitás millones para un fondo de emergencia — necesitás exactamente 3 números.",
      cuerpo:"Un fondo de emergencia es plata guardada para cuando algo inesperado pasa: te enfermás, se rompe algo importante, perdés un cliente. Sin ese fondo, cualquier imprevisto te manda directo a la deuda.\n\nLa regla clásica dice que necesitás 3 a 6 meses de gastos guardados. Pero para empezar, con un solo mes ya cambia todo. ¿Cuánto gastás en un mes básico? Esa es tu primera meta.\n\nLo importante es que esa plata esté separada — no mezclada con la plata del día a día. Puede ser en otra cuenta, en un sobre guardado, donde sea. Pero separada. Si está mezclada, la gastás sin darte cuenta.\n\nY cuando la usés en una emergencia real, la primera tarea es volver a llenarla. El fondo se recarga siempre.",
      dato_clave:"Las personas con un fondo de emergencia tienen 3 veces menos probabilidad de caer en deudas de alto interés.",
      accion:"Calculás cuánto son tus gastos básicos de un mes y anotás esa cifra. Eso es tu primera meta de ahorro."
    },
    6:{
      gancho:"El fiado puede ser tu mejor aliado o tu peor trampa — depende de una sola regla.",
      cuerpo:"En Paraguay y todo el Mercosur, el fiado es parte de la cultura. El almacén de la esquina, el proveedor de materiales, el negocio del barrio — todos manejan crédito informal. Y bien usado, puede ser una herramienta poderosa.\n\nLa regla de oro del fiado es simple: solo fidás lo que ya sabés cómo vas a pagar. No lo que esperás poder pagar — lo que ya tenés calculado cómo pagás. Esa diferencia es todo.\n\nEl problema viene cuando el fiado se usa para cubrir gastos que no podés pagar de otra forma. Ahí empieza el espiral: debés al almacén, debés al vecino, debés en la financiera. Y cada uno te cobra a su modo.\n\nUsado bien, el fiado es liquidez gratuita. Usado mal, es la deuda más cara del mercado porque daña relaciones y no tiene contrato claro.",
      dato_clave:"El 40% de las deudas informales en Paraguay empezaron como fiados pequeños que se fueron acumulando sin registro.",
      accion:"Esta semana revisás si tenés fiados pendientes y los anotás todos en un papel con el monto exacto."
    },
    7:{
      gancho:"PIX cambió Brasil de la noche a la mañana — y lo mismo está pasando en el Mercosur.",
      cuerpo:"PIX es el sistema de pagos instantáneos de Brasil lanzado en 2020. En menos de 2 años se convirtió en el método de pago más usado del país, superando al efectivo y las tarjetas. ¿La razón? Es gratis, instantáneo y funciona 24/7.\n\nEl Mercosur está adoptando sistemas similares. Paraguay tiene SIPAP, Argentina tiene Transferencias 3.0, Uruguay tiene sus propios sistemas. La idea es la misma: mover dinero entre personas y negocios sin comisiones y al instante.\n\nPara el trabajador informal, esto es revolucionario. Ya no necesitás cuenta bancaria tradicional para recibir pagos digitales. Un alias o un QR es suficiente. Tus clientes pueden pagarte desde el celular en segundos.\n\nNXB está construyendo sobre esta infraestructura para conectar todo el Mercosur. El objetivo es que mover plata entre Paraguay, Brasil y Argentina sea tan fácil como mandar un mensaje de WhatsApp.",
      dato_clave:"PIX procesa más de 150 millones de transacciones por día en Brasil — más que todas las tarjetas de crédito juntas.",
      accion:"Esta semana preguntás en tu banco o billetera digital si podés recibir pagos por QR o transferencia instantánea."
    },
  };

  const openLesson=async(l)=>{
    if(completed.includes(l.id))return;
    setActive(l);setLoading(true);setDone(false);setTimer(60);setTimerOn(false);
    // Usar contenido pre-cargado instantáneamente
    setTimeout(()=>{
      setContent(LESSON_CONTENT[l.id]);
      setLoading(false);
      setTimerOn(true);
    }, 800);
  };

  const finish=()=>{
    setDone(true);setTimerOn(false);
    setTimeout(()=>{onComplete(active.id);setActive(null);setContent(null);setDone(false);},1800);
  };

  if(active){
    return(
      <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 40px",animation:"fadeIn .4s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <button onClick={()=>setActive(null)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,padding:0}}>← Volver</button>
          {timerOn&&<div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:timer>20?"#FF4B2B":"#4ade80",background:"#111",border:"1px solid #1e1e1e",borderRadius:100,padding:"6px 14px"}}>{timer>0?`⏱ ${timer}s`:"✅ Listo"}</div>}
        </div>
        {loading?(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:48,animation:"flicker 1.5s ease infinite",marginBottom:20}}>{active.emoji}</div>
            <div style={{display:"flex",gap:8}}><span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/></div>
          </div>
        ):content?(
          <div style={{flex:1,animation:"lessonIn .5s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <span style={{fontSize:36}}>{active.emoji}</span>
              <div>
                <span className="category-pill" style={{background:`${catColor[active.categoria]}20`,color:catColor[active.categoria]}}>{active.categoria}</span>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#fff",letterSpacing:"-.5px",marginTop:6}}>{active.titulo}</div>
              </div>
            </div>
            <div style={{background:"#130a09",border:"1px solid #FF4B2B33",borderRadius:16,padding:"16px 20px",marginBottom:20}}>
              <p style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#FF4B2B",lineHeight:1.5}}>"{content.gancho}"</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
              {(content.cuerpo||"").split("\n\n").filter(Boolean).map((p,i)=>(
                <p key={i} style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:15,color:"#bbb",lineHeight:1.75}}>{p}</p>
              ))}
            </div>
            {content.dato_clave&&(
              <div style={{background:"#0d1a0d",border:"1px solid #4ade8033",borderRadius:16,padding:"16px 20px",marginBottom:16}}>
                <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#4ade80",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>📊 Dato clave</div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:400,fontSize:14,color:"#ccc",lineHeight:1.6}}>{content.dato_clave}</p>
              </div>
            )}
            {content.accion&&(
              <div style={{background:"#1a1208",border:"1px solid #facc1533",borderRadius:16,padding:"16px 20px",marginBottom:28}}>
                <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#facc15",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>🎯 Tu acción de hoy</div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:500,fontSize:15,color:"#fff",lineHeight:1.5}}>{content.accion}</p>
              </div>
            )}
            {done?(
              <div style={{textAlign:"center",animation:"checkPop .5s ease"}}>
                <div style={{fontSize:64,marginBottom:12}}>✅</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#4ade80"}}>¡Lección completada!</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#555",marginTop:8}}>Tu racha sigue creciendo 🔥</div>
              </div>
            ):(
              <button className="btn-primary" onClick={finish} style={{animation:"none"}}>Marcar como completada ✓</button>
            )}
          </div>
        ):null}
      </div>
    );
  }

  const todayL=LECCIONES_BASE.find(l=>!completed.includes(l.id));
  const prog=Math.round((completed.length/LECCIONES_BASE.length)*100);
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px"}}>Academia</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#555",marginTop:4}}>Aprendé un poco cada día</div>
        </div>
        <div className="streak-badge"><span style={{fontSize:20}}>🔥</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:"#FF4B2B"}}>{streak}</span><span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#666"}}>días</span></div>
      </div>
      <div style={{background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:20,padding:"18px 20px",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#ddd"}}>Tu progreso</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#FF4B2B",fontWeight:500}}>{completed.length}/{LECCIONES_BASE.length}</div>
        </div>
        <div className="progress-bar-bg"><div className="progress-bar-fill" style={{"--prog":`${prog}%`}}/></div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#444",marginTop:10}}>
          {prog===0?"Empezá hoy — una lección cambia todo.":prog<50?"¡Vas bien!":prog<100?"Ya más de la mitad 💪":"¡Completaste todo! 🏆"}
        </div>
      </div>
      {todayL&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#FF4B2B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>📅 Lección de hoy</div>
          <button className="lesson-card active-today" onClick={()=>openLesson(todayL)}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <span style={{fontSize:32,flexShrink:0}}>{todayL.emoji}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span className="category-pill" style={{background:`${catColor[todayL.categoria]}20`,color:catColor[todayL.categoria]}}>{todayL.categoria}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#555"}}>⏱ {todayL.duracion}</span>
                </div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"#fff",marginBottom:6}}>{todayL.titulo}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#666",lineHeight:1.5}}>{todayL.preview}</div>
              </div>
            </div>
            <div style={{marginTop:12,padding:"10px 0 0",borderTop:"1px solid #1e1e1e",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#FF4B2B",fontWeight:500}}>Empezar →</span>
            </div>
          </button>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#444",letterSpacing:"2px",textTransform:"uppercase"}}>Todas las lecciones</div>
        {!isPro&&<div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#1a1208",border:"1px solid #facc1533",borderRadius:100,padding:"4px 10px"}}>
          <span style={{fontSize:10}}>⭐</span>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#facc15"}}>{FREE_LESSONS} gratis · Pro ilimitado</span>
        </div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {LECCIONES_BASE.map((l,i)=>{
          const isDone=completed.includes(l.id);
          const isLocked=!isPro && i>=FREE_LESSONS && !isDone;
          const handleClick=()=>{
            if(isLocked){onUpgrade();return;}
            if(!isDone) openLesson(l);
          };
          return(
            <button key={l.id} className={`lesson-card${isDone?" completed":""}`}
              onClick={handleClick}
              style={{opacity:isDone?.65:1,animationDelay:`${i*.05}s`,cursor:isDone?"default":"pointer",position:"relative",overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,filter:isLocked?"blur(1px)":"none"}}>
                <span style={{fontSize:26,flexShrink:0}}>{isDone?"✅":l.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:isDone?"#555":"#ddd",marginBottom:3}}>{l.titulo}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span className="category-pill" style={{background:`${catColor[l.categoria]}15`,color:isDone?"#444":catColor[l.categoria]}}>{l.categoria}</span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#444"}}>⏱ {l.duracion}</span>
                  </div>
                </div>
                {isDone?<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#4ade80"}}>Lista</span>:<span style={{color:"#333",fontSize:16}}>›</span>}
              </div>
              {isLocked&&(
                <div className="lock-overlay">
                  <span style={{fontSize:22}}>🔒</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:"#facc15"}}>Hendy Pro</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {!isPro&&(
        <div style={{marginTop:20,background:"linear-gradient(135deg,#1a1208,#120a1a)",border:"1px solid #facc1544",borderRadius:20,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <span style={{fontSize:22}}>⭐</span>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#facc15"}}>Desbloqueá todo con Pro</div>
          </div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#666",lineHeight:1.6,marginBottom:14}}>
            Por solo $2/mes tenés todas las lecciones, plan personalizado y seguimiento de metas.
          </p>
          <button onClick={onUpgrade} style={{background:"linear-gradient(135deg,#facc15,#f59e0b)",color:"#000",border:"none",borderRadius:14,padding:"14px 20px",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,cursor:"pointer",width:"100%"}}>
            Ver Hendy Pro →
          </button>
        </div>
      )}
    </div>
  );
};

// ─── LOGROS ───────────────────────────────────────────────────────────────────
const Logros = ({completed,streak,userData}) => {
  const earned = BADGES.filter(b=>b.req(completed.length,streak,userData));
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px"}}>Tus logros</div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#555",marginTop:4}}>{earned.length} de {BADGES.length} ganados</div>
      </div>
      <div style={{background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:20,padding:"18px 20px",marginBottom:24}}>
        <div className="progress-bar-bg" style={{marginBottom:10}}>
          <div className="progress-bar-fill" style={{"--prog":`${Math.round(earned.length/BADGES.length*100)}%`,background:"#facc15"}}/>
        </div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#444"}}>
          {earned.length===0?"Completá tu primera lección para desbloquear logros.":earned.length===BADGES.length?"¡Colección completa! Sos un crack. 🏆":`${BADGES.length-earned.length} logros por desbloquear.`}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {BADGES.map((b,i)=>{
          const isEarned=b.req(completed.length,streak,userData);
          return(
            <div key={b.id} className={`badge-card${isEarned?" earned":" locked"}`}
              style={{animation:isEarned?`badgePop .5s ease ${i*.07}s both`:`fadeIn .3s ease ${i*.05}s both`}}>
              <div style={{width:52,height:52,borderRadius:14,background:isEarned?"#1a1208":"#111",
                border:`1px solid ${isEarned?"#facc1544":"#1e1e1e"}`,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:26,flexShrink:0,filter:isEarned?"none":"grayscale(1)"}}>
                {b.emoji}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:isEarned?"#fff":"#333",marginBottom:3}}>{b.titulo}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:isEarned?"#666":"#2a2a2a"}}>{b.desc}</div>
              </div>
              {isEarned&&<div style={{fontSize:16}}>✨</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ─── PRO SCREEN ───────────────────────────────────────────────────────────────
const ProScreen = ({userName, onActivate, onBack}) => (
  <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 40px",animation:"fadeIn .4s ease"}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:14,display:"flex",alignItems:"center",gap:8,marginBottom:36,padding:0}}>← Volver</button>
    <div style={{textAlign:"center",marginBottom:32}}>
      <div style={{fontSize:52,marginBottom:16,animation:"proGlow 2s ease infinite"}}>🔥</div>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#1a1208",border:"1px solid #facc1544",borderRadius:100,padding:"6px 16px",marginBottom:16}}>
        <span style={{fontSize:14}}>⭐</span>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#facc15"}}>HENDY PRO</span>
      </div>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:34,color:"#fff",letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:12}}>
        Aprendé sin<br/><span style={{color:"#facc15"}}>límites.</span>
      </h1>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:15,color:"#555",lineHeight:1.7}}>
        {userName?`${userName}, desbloqueá`:"Desbloqueá"} todas las lecciones y salí de Hendy más rápido.
      </p>
    </div>
    <div className="pro-banner" style={{marginBottom:24,animation:"proGlow 3s ease infinite"}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:40,color:"#facc15",letterSpacing:"-2px",textAlign:"center",lineHeight:1}}>$2<span style={{fontSize:16,color:"#666",fontWeight:300}}>/mes</span></div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#555",textAlign:"center",marginTop:4}}>Menos que un tereré en el centro 🧉</div>
      <div style={{marginTop:20,display:"flex",flexDirection:"column"}}>
        {[
          {icon:"📚",label:"Lecciones ilimitadas todos los días"},
          {icon:"🧠",label:"Plan financiero personalizado con IA"},
          {icon:"🎯",label:"Seguimiento de metas y gastos"},
          {icon:"🏆",label:"Todos los logros desbloqueados"},
          {icon:"🔕",label:"Sin límites ni interrupciones"},
        ].map((f,i)=>(
          <div key={i} className="pro-feature">
            <span style={{fontSize:20,flexShrink:0}}>{f.icon}</span>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:400,fontSize:14,color:"#ccc"}}>{f.label}</span>
            <span style={{marginLeft:"auto",color:"#facc15",fontSize:14}}>✓</span>
          </div>
        ))}
      </div>
    </div>
    <button onClick={onActivate} style={{background:"linear-gradient(135deg,#facc15,#f59e0b)",color:"#000",border:"none",borderRadius:16,padding:"18px 36px",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,cursor:"pointer",width:"100%",marginBottom:12,animation:"proGlow 2s ease infinite"}}>
      Activar Hendy Pro — $2/mes →
    </button>
    <div style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#333",lineHeight:1.8}}>
      Cancelá cuando quieras · Sin compromisos<br/>Pago seguro · Próximamente MercadoPago 🔒
    </div>
  </div>
);

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSfAYTrxA5l0YYArp8fCUInihQpBtBDqQjD_xKcAESM66m-SKQ/viewform?usp=sharing";

const Dashboard = ({userData,streak,completed,onNav,userName,showToast}) => {
  const [waitlistDone, setWaitlistDone] = useState(false);
  const handleWaitlist = () => {
    if(FORM_LINK !== "TU_LINK_AQUI") window.open(FORM_LINK, "_blank");
    setWaitlistDone(true);
    showToast({emoji:"🔥", titulo:"¡Anotado!", desc:"Te avisamos cuando NXB esté listo."});
  };
  const prog=Math.round((completed.length/LECCIONES_BASE.length)*100);
  const scoreColor=(userData?.diagnostico?.score||0)>=70?"#4ade80":(userData?.diagnostico?.score||0)>=40?"#facc15":"#FF4B2B";
  const todayL=LECCIONES_BASE.find(l=>!completed.includes(l.id));
  const earnedCount=BADGES.filter(b=>b.req(completed.length,streak,userData)).length;
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .5s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#555",marginBottom:4}}>
            {userName?`Bienvenido/a, ${userName} 👋`:"Bienvenido/a de vuelta"}
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px"}}>Tu panel Hendy 🔥</div>
        </div>
        <div className="streak-badge"><span style={{fontSize:18}}>🔥</span><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:"#FF4B2B"}}>{streak}</span><span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#666"}}>días</span></div>
      </div>
      <div style={{background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:20,padding:"20px",marginBottom:14,animation:"fadeUp .5s ease .1s both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#444",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>Tu puntaje</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:48,color:scoreColor,letterSpacing:"-2px",lineHeight:1}}>{userData?.diagnostico?.score||"—"}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#555",lineHeight:1.6,maxWidth:150}}>{userData?.diagnostico?.titulo||"Completá tu diagnóstico"}</div>
          </div>
        </div>
        <div className="progress-bar-bg"><div className="progress-bar-fill" style={{"--prog":`${userData?.diagnostico?.score||0}%`,background:scoreColor}}/></div>
      </div>
      <div style={{display:"flex",gap:12,marginBottom:14,animation:"fadeUp .5s ease .2s both"}}>
        {[
          {label:"Lecciones",val:completed.length,sub:"completadas"},
          {label:"Progreso", val:`${prog}%`,sub:"del plan",c:"#FF4B2B"},
          {label:"Logros",   val:`${earnedCount}🏆`,sub:"ganados"},
        ].map((s,i)=>(
          <div key={i} className="stat-card">
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#444",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:s.c||"#fff",letterSpacing:"-1px"}}>{s.val}</div>
            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#555",marginTop:2}}>{s.sub}</div>
          </div>
        ))}
      </div>
      {todayL&&(
        <div style={{animation:"fadeUp .5s ease .3s both",marginBottom:14}}>
          <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#FF4B2B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>📅 Lección de hoy</div>
          <button className="lesson-card active-today" onClick={()=>onNav("academy")} style={{width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28}}>{todayL.emoji}</span>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#fff"}}>{todayL.titulo}</div>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#FF4B2B",marginTop:3}}>Empezar ahora →</div>
              </div>
            </div>
          </button>
        </div>
      )}
      <div style={{background:"linear-gradient(135deg,#1a0a08,#0d0d1a)",border:"1px solid #2a1520",borderRadius:20,padding:20,animation:"fadeUp .5s ease .4s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>💸</span>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#ddd"}}>NXB · Pagos internacionales</div>
          </div>
          <div style={{background:"#1a1208",border:"1px solid #facc1533",borderRadius:100,padding:"4px 10px",
            fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#facc15",letterSpacing:"1px",textTransform:"uppercase",flexShrink:0}}>
            🚧 En desarrollo
          </div>
        </div>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#666",lineHeight:1.6,marginBottom:14}}>
          Muy pronto podrás mover tu plata sin comisiones en todo el Mercosur. Anotate ahora y sé el primero en acceder.
        </p>
        {waitlistDone ? (
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",
            background:"#0a130a",border:"1px solid #4ade8033",borderRadius:16,
            animation:"fadeIn .4s ease"}}>
            <span style={{fontSize:24}}>✅</span>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#4ade80"}}>¡Anotado!</div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#555",marginTop:2}}>
                Te avisamos cuando NXB esté listo 🔥
              </div>
            </div>
          </div>
        ) : (
          <button onClick={handleWaitlist} className="btn-primary"
            style={{animation:"none",padding:"13px 20px",fontSize:13,background:"#1a1208",color:"#facc15",border:"1px solid #facc1533"}}>
            Anotarme en la lista de espera →
          </button>
        )}
      </div>
    </div>
  );
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────
const Profile = ({userData,streak,completed,onReset,userName,notifEnabled,onToggleNotif,isPro}) => (
  <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px",marginBottom:24}}>Tu perfil</div>
    <div style={{background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:20,padding:20,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
        <div style={{width:56,height:56,borderRadius:16,background:"#1a0d09",border:"2px solid #FF4B2B",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🔥</div>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:"#fff"}}>{userName||"Usuario Hendy"}</div>
            {isPro&&<div style={{background:"#1a1208",border:"1px solid #facc1544",borderRadius:100,padding:"2px 8px",fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#facc15",fontWeight:600}}>⭐ PRO</div>}
          </div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#555",marginTop:3}}>{isPro?"Plan Pro activo 🔥":"En camino de salir 💪"}</div>
        </div>
      </div>
      {[
        {label:"Racha actual",val:`${streak} días 🔥`},
        {label:"Lecciones completadas",val:`${completed.length} de ${LECCIONES_BASE.length}`},
        {label:"Puntaje Hendy",val:userData?.diagnostico?.score||"—"},
      ].map((s,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<2?"1px solid #161616":"none"}}>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#555"}}>{s.label}</span>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:14,color:"#ddd"}}>{s.val}</span>
        </div>
      ))}
    </div>

    {/* Notificaciones */}
    <div style={{background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:20,padding:20,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"#ddd",marginBottom:4}}>🔔 Recordatorio diario</div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#555"}}>
            {notifEnabled?"Recibirás un recordatorio a las 8:00 AM":"Te recordamos tu lección del día"}
          </div>
        </div>
        <button onClick={onToggleNotif} style={{
          width:52,height:28,borderRadius:100,border:"none",cursor:"pointer",
          background:notifEnabled?"#FF4B2B":"#2a2a2a",position:"relative",transition:"background .3s",flexShrink:0,
        }}>
          <div style={{
            width:20,height:20,borderRadius:50,background:"#fff",position:"absolute",
            top:4,transition:"left .3s",left:notifEnabled?28:4,
          }}/>
        </button>
      </div>
      {notifEnabled&&(
        <div style={{marginTop:14,padding:"10px 14px",background:"#130a09",border:"1px solid #FF4B2B22",borderRadius:12,
          fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#666",lineHeight:1.6,animation:"fadeIn .3s ease"}}>
          📱 Activá las notificaciones del navegador cuando lo instales como app para recibir el recordatorio.
        </div>
      )}
    </div>

    {userData?.diagnostico?.primer_paso&&(
      <div style={{background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:20,padding:20,marginBottom:14}}>
        <div style={{fontSize:11,fontFamily:"'DM Sans',sans-serif",color:"#444",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>Tu diagnóstico</div>
        <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:14,color:"#888",lineHeight:1.7,marginBottom:14}}>{userData.diagnostico.titulo}</p>
        <div style={{padding:"12px 16px",background:"#1a1208",border:"1px solid #facc1522",borderRadius:12}}>
          <div style={{fontSize:11,color:"#facc15",fontFamily:"'DM Sans',sans-serif",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>🎯 Tu próximo paso</div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:13,color:"#ccc",lineHeight:1.6}}>{userData.diagnostico.primer_paso}</p>
        </div>
      </div>
    )}
    <button onClick={onReset} className="btn-ghost" style={{marginTop:0}}>🔄 Repetir diagnóstico</button>
    <div style={{textAlign:"center",marginTop:24,fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:12,color:"#222"}}>hendy · Paraguay 🔥 v1.0</div>
  </div>
);

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
const BottomNav = ({active,onNav}) => (
  <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:390,
    background:"rgba(10,10,10,.95)",backdropFilter:"blur(20px)",borderTop:"1px solid #161616",
    display:"flex",zIndex:50,paddingBottom:"env(safe-area-inset-bottom)"}}>
    {[{id:"dashboard",icon:"🏠",label:"Inicio"},{id:"academy",icon:"📚",label:"Academia"},
      {id:"logros",icon:"🏆",label:"Logros"},{id:"profile",icon:"👤",label:"Perfil"}].map(n=>(
      <button key={n.id} className="nav-btn" onClick={()=>onNav(n.id)}>
        <span style={{fontSize:20,filter:active===n.id?"none":"grayscale(1)",opacity:active===n.id?1:.35,transition:"all .2s"}}>{n.icon}</span>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:active===n.id?"#FF4B2B":"#444",fontWeight:active===n.id?500:300,transition:"color .2s"}}>{n.label}</span>
      </button>
    ))}
  </div>
);

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({msg}) => (
  <div className="toast">
    <span style={{fontSize:20}}>{msg.emoji}</span>
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:"#fff"}}>{msg.titulo}</div>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,fontSize:11,color:"#666"}}>{msg.desc}</div>
    </div>
  </div>
);

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function HendyApp() {
  const [screen,setScreen]         = useState("splash");
  const [splashDone,setSplash]     = useState(false);
  const [userName,setUserName]     = useState("");
  const [userData,setUserData]     = useState(null);
  const [streak,setStreak]         = useState(3);
  const [completed,setCompleted]   = useState([]);
  const [navTab,setNavTab]         = useState("dashboard");
  const [notifEnabled,setNotif]    = useState(false);
  const [isPro,setIsPro]           = useState(false);
  const [toast,setToast]           = useState(null);

  useEffect(()=>{
    setTimeout(()=>setSplash(true),2800);
    setTimeout(()=>setScreen("name"),3300);
  },[]);

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const DIAGNOSTICOS = {
    hendy_total:{
      deudas_criticas:{ meta_casa:{score:18,titulo:"En el punto más difícil — pero no el final.",resumen:"Tu situación es dura y lo sabés. Las deudas pesan y llegar a fin de mes parece una carrera imposible. Pero el hecho de que estés acá buscando respuestas ya dice mucho de vos.",fortaleza:"Reconocés tu realidad sin escaparte de ella. Esa honestidad brutal es el primer ingrediente para cambiar.",riesgo:"Con deudas que asfixian y sin llegar a fin de mes, cualquier imprevisto puede empeorar todo. La urgencia es real.",primer_paso:"Esta semana anotá en papel todas tus deudas con el monto exacto. Solo verlas juntas ya es el primer paso."},
        meta_emprender:{score:22,titulo:"Sueño grande, momento difícil — se puede.",resumen:"Querés emprender pero las deudas y la situación actual frenan todo. No es imposible, pero necesitás un plan que arranque desde donde estás.",fortaleza:"Tener el sueño de emprender en el momento más difícil dice que tenés visión. Eso no lo tiene cualquiera.",riesgo:"Emprender sin estabilidad básica puede sumar más presión. Primero la base, después el vuelo.",primer_paso:"Anotá una sola idea de negocio simple que puedas arrancar con menos de 100.000 guaraníes. Solo una."},
        meta_tranquilidad:{score:20,titulo:"Querés paz — y es posible conseguirla.",resumen:"Tu meta más urgente es salir de las deudas y tener tranquilidad. Es la meta más honesta y más poderosa que podés tener ahora mismo.",fortaleza:"Saber que lo que más querés es tranquilidad te pone en el camino correcto. No es resignación — es sabiduría.",riesgo:"Sin un plan concreto de pago, las deudas crecen solas y la tranquilidad se aleja.",primer_paso:"Hablá esta semana con uno de tus acreedores y pedí un plan de pago. Muchos prefieren cobrar poco a no cobrar nada."},
        meta_libertad:{score:19,titulo:"La libertad empieza por ordenar lo de adentro.",resumen:"Soñás con viajar o crecer, pero las deudas y la situación actual son el primer obstáculo real. La libertad financiera empieza por dentro.",fortaleza:"Tener metas grandes en el peor momento significa que no te rendiste. Eso es más raro de lo que pensás.",riesgo:"Ignorar la situación actual para enfocarse solo en el sueño grande puede hacer que todo empeore.",primer_paso:"Esta semana calculás exactamente cuánto debés en total. Un número concreto, no una sensación."},
      },
      deudas_manejables:{meta_casa:{score:30,titulo:"Ajustado pero con rumbo — eso cambia todo.",resumen:"No llegar a fin de mes con deudas manejables es una combinación difícil pero solucionable. El problema no es tu ingreso — es cómo se distribuye.",fortaleza:"Que las deudas sean manejables significa que todavía tenés control. No lo perdiste.",riesgo:"Sin cambiar el patrón de gasto, el mes que viene va a ser igual. El ciclo se rompe con un plan, no con la esperanza.",primer_paso:"Anotá los 3 gastos más grandes de tu mes. Mirá cuál podés reducir aunque sea un 10% esta semana."},meta_emprender:{score:28,titulo:"El negocio puede ser tu salida — con orden.",resumen:"Querés emprender y tenés deudas manejables. La combinación puede funcionar si el negocio ayuda a mejorar el ingreso sin sumar riesgo.",fortaleza:"Ver el emprendimiento como salida financiera es pensar como empresario. Eso es una ventaja.",riesgo:"Un negocio nuevo suma gastos antes de generar ingresos. Necesitás un colchón mínimo antes de arrancar.",primer_paso:"Calculás cuánto necesitás para vivir un mes básico. Ese número es tu red de seguridad mínima antes de emprender."},meta_tranquilidad:{score:32,titulo:"La tranquilidad está más cerca de lo que creés.",resumen:"Con deudas manejables y el objetivo de tranquilizarte, tenés una combinación que puede resolverse con un plan de 90 días.",fortaleza:"Reconocer que querés tranquilidad antes que crecimiento es una decisión madura y estratégica.",riesgo:"La tranquilidad sin un fondo de emergencia dura poco. El próximo imprevisto puede volver a desestabilizarte.",primer_paso:"Calculás cuánto pagarías de más si cancelás una deuda pequeña antes. Empezás por la más chica."},meta_libertad:{score:29,titulo:"Libertad con base sólida — ese es el camino.",resumen:"Soñás en grande con una situación difícil. La clave es construir la base sin abandonar el sueño.",fortaleza:"Combinar ambición con conciencia de tu situación actual es exactamente lo que hace falta.",riesgo:"Moverse hacia la libertad sin resolver lo urgente puede terminar en más deudas y menos libertad.",primer_paso:"Esta semana definís una meta financiera concreta para los próximos 3 meses. Un número, una fecha."},},
      deuda_chica:{meta_casa:{score:38,titulo:"Casi limpio — y con una meta clara.",resumen:"Llegás justo pero tenés solo una deuda pequeña y una meta concreta. Estás más cerca de lo que sentís.",fortaleza:"Tener una sola deuda pequeña cuando la situación es difícil es un logro real. Lo hiciste sin darte cuenta.",riesgo:"Sin cancelar esa deuda chica pronto, puede crecer o distraerte de ahorrar para la casa.",primer_paso:"Calculás cuándo podés cancelar esa deuda chica de una vez. Si podés en menos de 3 meses, hacelo primero."},meta_emprender:{score:40,titulo:"Un paso de empezar — literal.",resumen:"Con una sola deuda pequeña y ganas de emprender, estás en un punto de arranque real. La ventana existe.",fortaleza:"Casi no tener deudas mientras pensás en emprender es una posición envidiable. Muchos quisieran estar donde estás.",riesgo:"Emprender con ingresos ajustados requiere que el negocio genere retorno rápido. Necesitás claridad en eso.",primer_paso:"Cancelás la deuda chica primero — aunque tarde un mes más. Emprender sin deudas cambia todo psicológicamente."},meta_tranquilidad:{score:42,titulo:"La tranquilidad está a un paso.",resumen:"Casi sin deudas y buscando tranquilidad, tu situación es mejor de lo que parece. El siguiente paso es simple.",fortaleza:"Haber reducido tus deudas a una sola pequeña es disciplina real. Eso no pasa solo.",riesgo:"Sin un fondo de emergencia, la tranquilidad que buscás puede irse al primer problema inesperado.",primer_paso:"Cuando canceles la deuda chica, destinás ese mismo monto mensual a un sobre de emergencias."},meta_libertad:{score:39,titulo:"Casi libre — y lo sabés.",resumen:"Una deuda chica no te frena. Con orden y claridad, la libertad que buscás está más cerca que el promedio.",fortaleza:"Soñar en grande con casi cero deudas es una combinación poderosa. Tenés el punto de partida correcto.",riesgo:"Sin ingresos estables, la libertad financiera es difícil de mantener aunque se consiga momentáneamente.",primer_paso:"Esta semana definís exactamente qué significa libertad financiera para vos en números concretos."},},
      sin_deudas:{meta_casa:{score:48,titulo:"Sin deudas y con meta — vas bien.",resumen:"No llegar a fin de mes pero estar libre de deudas es una situación especial. El problema es el gasto, no el pasado.",fortaleza:"Vivir sin deudas cuando el dinero ajusta requiere disciplina real. Eso ya lo tenés.",riesgo:"Sin deudas pero sin ahorro, cualquier gasto grande obliga a endeudarse. El círculo puede volver.",primer_paso:"Esta semana calculás exactamente cuánto necesitás ahorrar por mes para la cuota inicial de una casa en 2 años."},meta_emprender:{score:50,titulo:"Sin deudas y con visión — la base está.",resumen:"Libre de deudas y con ganas de emprender es uno de los mejores puntos de partida posibles. Solo falta el plan.",fortaleza:"Emprender sin deudas significa que el negocio no nace con carga. Eso multiplica las chances de éxito.",riesgo:"Sin capital inicial ni ahorro, emprender puede requerir endeudarse. Hay que calcular bien antes de arrancar.",primer_paso:"Esta semana anotás el costo total de arrancar tu negocio. Ese número te dice cuánto necesitás ahorrar primero."},meta_tranquilidad:{score:52,titulo:"La tranquilidad está más cerca de lo que creés.",resumen:"Sin deudas y buscando tranquilidad, tu situación financiera tiene una base sólida. Solo falta construir sobre ella.",fortaleza:"Cero deudas es el activo más valioso que podés tener en este momento. Protegelo.",riesgo:"Sin ahorro de emergencia, la tranquilidad es frágil. Un mes malo puede cambiar todo.",primer_paso:"Esta semana abrís un sobre o una cuenta separada y ponés aunque sea el 5% de tu ingreso. Solo eso."},meta_libertad:{score:51,titulo:"Sin deudas y soñando en grande — perfecto.",resumen:"La libertad financiera sin deudas de por medio es un camino más corto. Estás en el punto de partida correcto.",fortaleza:"Cero deudas con metas grandes es la combinación ideal para construir algo real.",riesgo:"La libertad financiera requiere ingresos crecientes o activos. Sin uno de los dos, el sueño se aleja.",primer_paso:"Esta semana investigás una fuente de ingreso adicional pequeña que puedas empezar sin inversión."},},
    },
    ajustado:{
      deudas_criticas:{meta_casa:{score:35,titulo:"Ajustado con peso encima — pero hay salida.",resumen:"Llegás pero las deudas te comen el margen. La buena noticia es que llegás — eso ya es algo.",fortaleza:"Llegar a fin de mes con deudas encima requiere habilidad real para manejar lo que hay.",riesgo:"Con deudas que asfixian y sin margen, cualquier mes malo puede romper el equilibrio.",primer_paso:"Listás todas tus deudas con el monto y la tasa. La más cara en intereses va primero."},meta_emprender:{score:33,titulo:"El emprendimiento puede ser la salida — con plan.",resumen:"Ajustado con deudas pero queriendo emprender. El camino es posible si el negocio genera flujo rápido.",fortaleza:"Ver el emprendimiento como solución y no solo como sueño es pensar estratégicamente.",riesgo:"Un negocio que no genera ingresos en los primeros 3 meses puede hundir una situación ya ajustada.",primer_paso:"Pensás en un servicio que podés ofrecer esta semana con lo que ya sabés hacer. Sin inversión."},meta_tranquilidad:{score:36,titulo:"La tranquilidad es posible — en 90 días.",resumen:"Ajustado con deudas pero con el objetivo claro de tranquilizarte. Un plan de 90 días puede cambiarlo.",fortaleza:"Priorizar la tranquilidad sobre el crecimiento cuando estás ajustado es una decisión inteligente.",riesgo:"Sin atacar las deudas activamente, la tranquilidad que buscás se va a seguir alejando.",primer_paso:"Llamás a uno de tus acreedores y pedís renegociar la cuota. El 70% acepta si se lo pedís directamente."},meta_libertad:{score:34,titulo:"Libertad grande, base por construir.",resumen:"Soñás con libertad financiera desde un punto ajustado con deudas. El sueño es válido — la base necesita trabajo.",fortaleza:"Mantener la visión de libertad cuando la situación aprieta es lo que separa a los que progresan.",riesgo:"Sin resolver lo urgente primero, la libertad que buscás puede tardar mucho más de lo necesario.",primer_paso:"Esta semana separás lo urgente de lo importante. Las deudas son urgentes. La libertad es importante."},},
      sin_deudas:{meta_casa:{score:55,titulo:"Ajustado y limpio — muy buen punto.",resumen:"Llegás a fin de mes sin deudas. Eso es más de lo que tiene la mitad de la gente. Ahora se trata de optimizar.",fortaleza:"Vivir ajustado sin endeudarse es disciplina financiera real. Mucha gente no puede hacer eso.",riesgo:"Sin ahorro activo, la casa propia puede sentirse siempre lejana. El tiempo juega en contra.",primer_paso:"Calculás cuánto necesitás para la cuota inicial de una propiedad básica en tu zona y dividís entre 24 meses."},meta_emprender:{score:57,titulo:"Base limpia para empezar algo propio.",resumen:"Ajustado pero sin deudas y con visión de emprender. La combinación correcta para arrancar algo real.",fortaleza:"Sin deudas tenés libertad de movimiento. Podés asumir un riesgo calculado sin que todo se derrumbe.",riesgo:"Emprender con ingresos ajustados requiere que el negocio sea lean desde el día uno. Sin gastos innecesarios.",primer_paso:"Esta semana validás tu idea de negocio con 5 personas reales. Si 3 pagarían por ello, tenés algo."},meta_tranquilidad:{score:58,titulo:"Tranquilidad al alcance — un fondo es todo.",resumen:"Sin deudas y llegando a fin de mes, la tranquilidad que buscás depende de un solo paso: el fondo de emergencia.",fortaleza:"Llegar sin deudas ya es tranquilidad parcial. Estás a medio camino sin saberlo.",riesgo:"Un mes de emergencias sin fondo puede obligarte a endeudarte y volver al punto de partida.",primer_paso:"Esta semana empezás a guardar el 5% de tu ingreso en un lugar separado. Aunque sea 50.000 guaraníes."},meta_libertad:{score:56,titulo:"Sin deudas y soñando — la base está.",resumen:"Ajustado pero limpio con metas de libertad. Estás construyendo sobre terreno firme.",fortaleza:"La libertad financiera sin deudas de base es más alcanzable que la mayoría cree.",riesgo:"Los ingresos ajustados limitan la velocidad de crecimiento. Hay que pensar en cómo aumentarlos.",primer_paso:"Esta semana investigás una habilidad tuya que podría generar un ingreso extra aunque sea pequeño."},},
      deudas_manejables:{meta_casa:{score:44,titulo:"Manejable y con meta concreta — bien.",resumen:"Ajustado con deudas controladas y la meta de tener casa propia. El camino existe y no es tan largo.",fortaleza:"Tener las deudas manejables mientras llegás a fin de mes muestra que sabés administrarte.",riesgo:"Sin cancelar las deudas primero, ahorrar para la casa va a costar el doble de tiempo.",primer_paso:"Calculás en cuántos meses podés cancelar todas tus deudas. Ese plazo es tu primera meta."},meta_emprender:{score:42,titulo:"Casi listo para arrancar — falta la base.",resumen:"Ajustado con deudas manejables y ganas de emprender. Con un plan de 6 meses, el escenario puede cambiar.",fortaleza:"Querer emprender con las deudas bajo control muestra que entendés que necesitás una base.",riesgo:"Emprender antes de cancelar las deudas divide tu energía y tu capital. Primero el orden.",primer_paso:"Hacés una lista de todo lo que necesitarías para emprender y el costo de cada cosa."},meta_tranquilidad:{score:46,titulo:"Tranquilidad en construcción — va bien.",resumen:"Con deudas manejables y el objetivo de tranquilizarte, el camino es claro. Solo necesitás ejecutarlo.",fortaleza:"Priorizar la tranquilidad antes que el crecimiento cuando tenés deudas es la decisión correcta.",riesgo:"Sin un plan de pago activo, las deudas 'manejables' pueden volverse problemáticas con el tiempo.",primer_paso:"Esta semana destinás un monto fijo extra a la deuda más pequeña para cancelarla antes de tiempo."},meta_libertad:{score:43,titulo:"Libertad con plan — es posible.",resumen:"Ajustado, con deudas controladas y soñando con libertad. El camino existe si se construye con orden.",fortaleza:"Ver la libertad como meta mientras gestionás deudas muestra madurez financiera.",riesgo:"La libertad financiera requiere primero estabilidad. Sin ella, el sueño se aleja en lugar de acercarse.",primer_paso:"Esta semana definís qué significa exactamente libertad financiera para vos. Un número concreto."},},
      deuda_chica:{meta_casa:{score:50,titulo:"Casi listo para el gran paso.",resumen:"Ajustado con una deuda chica y la meta de casa propia. Cancelás esa deuda y empezás a ahorrar para la cuota inicial.",fortaleza:"Reducir las deudas a una sola pequeña mientras llegás a fin de mes es un logro real.",riesgo:"Sin acelerar el ahorro después de cancelar la deuda, el objetivo de la casa puede dilatarse años.",primer_paso:"Calculás cuánto antes podés cancelar la deuda chica si le ponés un monto extra este mes."},meta_emprender:{score:52,titulo:"A un paso del arranque.",resumen:"Una deuda chica y ganas de emprender. Cancelás eso primero y tenés el escenario ideal para arrancar.",fortaleza:"Casi sin deudas queriendo emprender — estás en la posición que muchos emprendedores quisieran tener.",riesgo:"La impaciencia de emprender antes de cerrar esa deuda puede complicar el arranque.",primer_paso:"Ponés una fecha concreta para cancelar la deuda y otra fecha para arrancar el negocio. Las dos en papel."},meta_tranquilidad:{score:54,titulo:"La tranquilidad está a la vuelta.",resumen:"Con una deuda chica y buscando tranquilidad, estás muy cerca. Un par de meses de disciplina y llegás.",fortaleza:"Haber reducido todo a una deuda pequeña es el resultado de trabajo real. No pasó solo.",riesgo:"Celebrar antes de tener el fondo de emergencia puede dejarte expuesto al primer imprevisto.",primer_paso:"Cuando canceles la deuda, ese mismo monto mensual pasa automáticamente al fondo de emergencia."},meta_libertad:{score:51,titulo:"Libre de deudas, libre en la vida — casi.",resumen:"Una deuda chica y la meta de libertad financiera. El escenario es muy bueno. Solo falta ejecutar.",fortaleza:"Ver la libertad como meta con casi cero deudas es exactamente el estado mental correcto.",riesgo:"La libertad financiera real requiere ingresos crecientes además de deudas cero. Los dos a la vez.",primer_paso:"Esta semana investigás cómo aumentar tus ingresos actuales aunque sea un 10% en los próximos 3 meses."},},
    },
    estable:{
      sin_deudas:{meta_casa:{score:68,titulo:"Estable y limpio — el momento es ahora.",resumen:"Cubrís gastos sin deudas y con meta de casa propia. Estás en el mejor punto para empezar a ahorrar con fuerza.",fortaleza:"La estabilidad sin deudas es la plataforma perfecta para construir patrimonio. Pocos llegan acá.",riesgo:"Sin acelerar el ahorro ahora que la situación es favorable, el tiempo puede jugarte en contra.",primer_paso:"Esta semana abrís una cuenta o sobre exclusivo para la casa y hacés el primer depósito, aunque sea simbólico."},meta_emprender:{score:70,titulo:"El momento ideal para arrancar.",resumen:"Estable, sin deudas y queriendo emprender. Difícilmente vas a tener un escenario mejor que este.",fortaleza:"Emprender desde la estabilidad y sin deudas multiplica las chances de éxito. Es la combinación ganadora.",riesgo:"La comodidad de la estabilidad puede frenar el primer paso. No dejes que lo posible espere lo perfecto.",primer_paso:"Esta semana definís la fecha de lanzamiento de tu negocio. Una fecha real en el calendario."},meta_tranquilidad:{score:72,titulo:"La tranquilidad ya es tuya — solo falta asegurarla.",resumen:"Estable y sin deudas buscando tranquilidad. Estás muy cerca — solo falta el fondo de emergencia y ya llegaste.",fortaleza:"Alcanzar estabilidad sin deudas con consciencia de que querés tranquilidad es sabiduría financiera real.",riesgo:"La tranquilidad sin fondo de emergencia depende de que nada salga mal. Y algo siempre sale mal.",primer_paso:"Esta semana calculás 3 meses de tus gastos básicos. Ese número es tu meta del fondo de emergencia."},meta_libertad:{score:69,titulo:"Estable hoy, libre mañana — el camino está.",resumen:"Estabilidad sin deudas con metas de libertad. La base está construida. Ahora se trata de acelerar.",fortaleza:"Alcanzar estabilidad sin deudas ya es libertad parcial. Estás construyendo sobre terreno sólido.",riesgo:"La libertad financiera total requiere activos que generen ingresos. La estabilidad sola no alcanza.",primer_paso:"Esta semana investigás una inversión simple disponible en Paraguay con bajo riesgo para empezar."},},
      deudas_manejables:{meta_casa:{score:58,titulo:"Bien encaminado — con un ajuste final.",resumen:"Estable con deudas manejables y meta de casa. Cancelás las deudas y el ahorro para la casa se vuelve real.",fortaleza:"Manejar deudas mientras cubrís gastos y mantenés estabilidad es una habilidad financiera concreta.",riesgo:"Ahorrar para la casa mientras pagás deudas divide el esfuerzo. Es más eficiente atacar primero las deudas.",primer_paso:"Calculás en cuánto tiempo cancelás todas las deudas si las priorizás sobre el ahorro para la casa."},meta_emprender:{score:60,titulo:"Estable con plan — casi listo.",resumen:"Estabilidad con deudas manejables y visión de emprender. Cancelás las deudas y tenés el escenario ideal.",fortaleza:"Querer emprender desde la estabilidad y con las deudas bajo control es la posición correcta.",riesgo:"Emprender mientras pagás deudas divide el capital disponible. Uno de los dos va a sufrir.",primer_paso:"Esta semana hacés el cálculo: ¿cuánto antes emprendés si cancelás las deudas primero vs ahora?"},meta_tranquilidad:{score:62,titulo:"La tranquilidad está cerca — último paso.",resumen:"Estable, con deudas manejables y buscando tranquilidad. Un plan de 6 meses puede cambiar todo.",fortaleza:"Buscar tranquilidad cuando la situación ya es estable es construir sobre lo que funciona.",riesgo:"Las deudas manejables de hoy pueden volverse difíciles si la situación cambia. Hay que cerrarlas.",primer_paso:"Esta semana acelerás el pago de la deuda más pequeña. Cancelarla da un impulso psicológico enorme."},meta_libertad:{score:59,titulo:"Estable y con visión — bien posicionado.",resumen:"Estabilidad con deudas controladas y metas de libertad. El camino está trazado — solo hay que caminarlo.",fortaleza:"La libertad financiera desde la estabilidad es mucho más alcanzable que desde el caos.",riesgo:"Las deudas, aunque manejables, frenan la acumulación de capital necesaria para la libertad.",primer_paso:"Esta semana definís en qué orden atacás las deudas y cuándo quedás libre de ellas."},},
      deuda_chica:{meta_casa:{score:63,titulo:"Muy cerca del siguiente nivel.",resumen:"Estable, casi sin deudas y con meta de casa. Cancelás la deuda chica y empezás a ahorrar con toda la fuerza.",fortaleza:"Llegar a una sola deuda pequeña desde la estabilidad es un recorrido exitoso. Ya hiciste lo difícil.",riesgo:"Sin cancelar esa deuda chica pronto, puede postergarse indefinidamente y robar margen para el ahorro.",primer_paso:"Esta semana calculás cuánto antes podés cancelar esa deuda si le ponés un extra este mes."},meta_emprender:{score:65,titulo:"Listo para el siguiente capítulo.",resumen:"Estable, con deuda mínima y ganas de emprender. Estás a un paso del escenario ideal para arrancar.",fortaleza:"Una sola deuda pequeña con estabilidad financiera es el punto de partida perfecto para emprender.",riesgo:"La impaciencia puede llevar a emprender antes de cerrar esa deuda. Ese mes de espera vale la pena.",primer_paso:"Cerrás la deuda chica primero. Después de eso, la próxima semana definís la fecha de lanzamiento."},meta_tranquilidad:{score:66,titulo:"La tranquilidad está a días de distancia.",resumen:"Estable, casi sin deudas y buscando tranquilidad. Literalmente estás a semanas de conseguirla.",fortaleza:"Haber llegado a este punto desde una situación más difícil demuestra que podés ejecutar un plan.",riesgo:"Relajarse antes de tener el fondo de emergencia completo puede dejar una vulnerabilidad oculta.",primer_paso:"Cerrás la deuda chica y el mes siguiente arrancás el fondo de emergencia con el mismo monto."},meta_libertad:{score:64,titulo:"Un paso de ser completamente libre.",resumen:"Estable, casi sin deudas y con metas de libertad. El escenario es excelente. Solo falta el último paso.",fortaleza:"Llegar a casi cero deudas con visión de libertad financiera es exactamente el estado mental ganador.",riesgo:"La libertad real requiere ingresos que crezcan además de deudas que desaparezcan.",primer_paso:"Esta semana investigás cómo invertir el monto que hoy pagás de deuda una vez que la cierres."},},
      deudas_criticas:{meta_casa:{score:45,titulo:"Estable pero con una carga que liberar.",resumen:"Cubrís gastos pero las deudas pesan. La estabilidad es un punto de apoyo real para resolver esto.",fortaleza:"Ser estable con deudas que asfixian es resistencia real. Usás esa base para atacar las deudas.",riesgo:"La estabilidad puede dar falsa tranquilidad mientras las deudas con intereses crecen solas.",primer_paso:"Esta semana identificás la deuda con mayor interés y calculás cuánto te cuesta por mes no pagarla."},meta_emprender:{score:43,titulo:"Estabilidad más deudas más sueño — hay orden.",resumen:"Querés emprender desde la estabilidad pero con deudas pesadas. El orden importa: primero las deudas.",fortaleza:"Mantener estabilidad con deudas fuertes ya es un logro. Esa capacidad te va a servir para emprender.",riesgo:"Emprender con deudas que asfixian puede colapsar tanto el negocio como la estabilidad actual.",primer_paso:"Calculás cuánto tiempo necesitás para dejar las deudas en 'manejables'. Ese es tu primer plazo."},meta_tranquilidad:{score:46,titulo:"La tranquilidad requiere atacar las deudas.",resumen:"Estable pero con deudas que asfixian buscando tranquilidad. La única forma de conseguirla es atacar las deudas.",fortaleza:"Reconocer que las deudas son el obstáculo principal para tu tranquilidad es el diagnóstico correcto.",riesgo:"Ignorar las deudas esperando que mejoren solas solo aumenta la distancia a la tranquilidad.",primer_paso:"Esta semana llamás a tus acreedores y renegociás las condiciones. Muchos prefieren cobrar menos a no cobrar."},meta_libertad:{score:44,titulo:"La libertad pasa primero por las deudas.",resumen:"Estable con deudas que pesan y soñando con libertad. El camino existe pero requiere un orden claro.",fortaleza:"Tener visión de libertad con deudas fuertes pero estabilidad muestra que no perdiste el norte.",riesgo:"Sin atacar las deudas directamente, la libertad financiera puede tardar décadas en llegar.",primer_paso:"Esta semana armás un plan de ataque de deudas: de la más cara a la más barata en intereses."},},
    },
    creciendo:{
      sin_deudas:{meta_casa:{score:82,titulo:"Creciendo y limpio — el momento es ahora.",resumen:"Ahorrás, no tenés deudas y querés casa propia. Estás en el mejor escenario posible. Solo falta ejecutar.",fortaleza:"Crecer financieramente sin deudas es el resultado de decisiones consistentes. Ya sabés lo que funciona.",riesgo:"Sin un plan específico para la casa, el ahorro puede irse a otras cosas. Necesitás un objetivo fijo.",primer_paso:"Esta semana abrís una cuenta exclusiva para la casa y calculás la fecha en que podés comprar."},meta_emprender:{score:85,titulo:"Listo para el siguiente nivel.",resumen:"Creciendo sin deudas y con ganas de emprender. Este es el escenario ideal. La pregunta es cuándo, no si.",fortaleza:"Emprender desde el crecimiento y sin deudas multiplica exponencialmente las probabilidades de éxito.",riesgo:"La sobreconfianza en un buen momento puede llevar a no planificar bien. El plan siempre importa.",primer_paso:"Esta semana definís la fecha de lanzamiento, el producto mínimo y el primer cliente objetivo."},meta_tranquilidad:{score:84,titulo:"Creciendo y en paz — el objetivo está cumplido.",resumen:"Ahorrás, no tenés deudas y buscás tranquilidad. Probablemente ya la tenés más de lo que creés.",fortaleza:"Crecer sin deudas buscando tranquilidad es la combinación más sólida que existe en finanzas personales.",riesgo:"La tranquilidad real requiere un fondo de emergencia sólido además del ahorro regular.",primer_paso:"Esta semana verificás que tenés al menos 3 meses de gastos guardados en un lugar separado."},meta_libertad:{score:83,titulo:"En camino directo a la libertad financiera.",resumen:"Creciendo, sin deudas y con meta de libertad. Estás exactamente donde tenés que estar para lograrlo.",fortaleza:"La libertad financiera desde el crecimiento y sin deudas no es un sueño — es un plan con fecha.",riesgo:"La libertad requiere ingresos pasivos o activos que trabajen por vos. El ahorro solo no alcanza.",primer_paso:"Esta semana investigás la primera inversión concreta que podés hacer con tu ahorro actual."},},
      deudas_manejables:{meta_casa:{score:68,titulo:"Creciendo con deudas — casi perfecto.",resumen:"Ahorrás e invertís con deudas manejables y meta de casa. Cancelando las deudas, el escenario se vuelve excelente.",fortaleza:"Crecer financieramente mientras gestionás deudas demuestra una capacidad real de administración.",riesgo:"Las deudas, aunque manejables, frenan la velocidad de acumulación para la casa propia.",primer_paso:"Calculás si conviene más acelerar el pago de deudas o aumentar el ahorro para la casa. Hacés los números."},meta_emprender:{score:70,titulo:"Creciendo y listo para emprender — casi.",resumen:"La combinación de crecimiento con deudas manejables y visión emprendedora es muy fuerte. Un ajuste y listo.",fortaleza:"Emprender desde el crecimiento financiero con deudas bajo control es un punto de partida privilegiado.",riesgo:"Las deudas consumen capital que podría ir al negocio. Calculás bien cuánto podés destinar a cada cosa.",primer_paso:"Esta semana hacés el plan financiero del negocio incluyendo cómo afectan las deudas al capital disponible."},meta_tranquilidad:{score:72,titulo:"Creciendo hacia la tranquilidad total.",resumen:"Crecimiento financiero con deudas controladas buscando tranquilidad. Estás muy cerca del objetivo.",fortaleza:"Crecer mientras gestionás deudas y apuntás a la tranquilidad es ejecutar las tres cosas a la vez.",riesgo:"La tranquilidad real llega cuando las deudas desaparecen. Son el último paso que falta.",primer_paso:"Esta semana calculás la fecha exacta en que quedás libre de deudas si priorizás el pago."},meta_libertad:{score:69,titulo:"Creciendo hacia la libertad — muy bien posicionado.",resumen:"Crecimiento con deudas manejables y visión de libertad. El mapa está claro y el camino también.",fortaleza:"Crecer financieramente mientras apuntás a la libertad total es exactamente la actitud correcta.",riesgo:"Las deudas frenan la libertad aunque sean manejables. Cerrarlas acelera todo.",primer_paso:"Esta semana armás un calendario: fecha de cero deudas y fecha de primera inversión en activos."},},
      deuda_chica:{meta_casa:{score:74,titulo:"A un cierre de estar en el nivel ideal.",resumen:"Creciendo, con deuda mínima y meta de casa. Cerrás esa deuda y el escenario es prácticamente perfecto.",fortaleza:"Llegar a crecer financieramente con solo una deuda chica es el resultado de un trabajo muy bien hecho.",riesgo:"Esa deuda chica puede esperar — pero cuanto antes la cierres, antes el 100% del ahorro va a la casa.",primer_paso:"Esta semana calculás si conviene cancelar la deuda de una vez o seguir el plan de cuotas."},meta_emprender:{score:76,titulo:"Casi en el punto ideal para arrancar.",resumen:"Creciendo con deuda mínima y ganas de emprender. Cerrás esa deuda y tenés el escenario perfecto.",fortaleza:"Una sola deuda pequeña con crecimiento financiero y visión emprendedora es la combinación ganadora.",riesgo:"La impaciencia de emprender puede hacer que pases por alto esa deuda. No lo hagas.",primer_paso:"Ponés una fecha: en X semanas cancelo la deuda, en Y semanas lanzo el negocio."},meta_tranquilidad:{score:77,titulo:"La tranquilidad ya es casi tuya.",resumen:"Creciendo con una deuda mínima buscando tranquilidad. Estás a semanas de tener exactamente lo que buscás.",fortaleza:"Haber llegado a este punto desde una situación más difícil demuestra que ejecutás bien los planes.",riesgo:"Relajarse antes de cerrar esa deuda chica y tener el fondo completo sería el único error posible.",primer_paso:"Esta semana cerrás la deuda de una vez si podés, y el mes siguiente arrancás el fondo de emergencia."},meta_libertad:{score:75,titulo:"Un paso de la libertad financiera total.",resumen:"Creciendo, casi sin deudas y con meta de libertad. Estás literalmente a un paso del escenario ideal.",fortaleza:"Crecer financieramente con casi cero deudas y visión de libertad es exactamente el estado mental ganador.",riesgo:"El único riesgo es no capitalizar este momento privilegiado con una inversión concreta.",primer_paso:"Esta semana investigás la primera inversión en un activo que puedas hacer con tu ahorro actual."},},
      deudas_criticas:{meta_casa:{score:52,titulo:"Creciendo a pesar de todo — respeto.",resumen:"Ahorrás e invertís con deudas que asfixian. Eso es contradictorio pero muestra una fuerza real.",fortaleza:"Crecer financieramente con deudas pesadas encima es algo que muy poca gente logra. Es una habilidad.",riesgo:"Las deudas con altos intereses pueden crecer más rápido de lo que crecen tus ahorros. Hay que mirar los números.",primer_paso:"Esta semana comparás la tasa de tus deudas vs el rendimiento de tus ahorros. El resultado te dice qué atacar primero."},meta_emprender:{score:50,titulo:"Capacidad de crecer — ahora con orden.",resumen:"Si crecés con deudas pesadas, imaginá lo que podés hacer sin ellas. El potencial es real.",fortaleza:"Crecer financieramente con deudas que asfixian demuestra una capacidad empresarial concreta.",riesgo:"Emprender con deudas fuertes puede desestabilizar hasta el crecimiento que ya lograste.",primer_paso:"Esta semana calculás cuánto capital liberarías por mes si resolvieras las deudas. Ese número define tu prioridad."},meta_tranquilidad:{score:53,titulo:"Crecés pero las deudas frenan la paz.",resumen:"Crecimiento financiero con deudas que asfixian buscando tranquilidad. La solución es concentrarse en las deudas.",fortaleza:"Buscar tranquilidad cuando crecés financieramente pero tenés deudas pesadas es sabiduría pura.",riesgo:"Crecer e ignorar las deudas pesadas es como correr con una mochila llena. Tarde o temprano pesa.",primer_paso:"Esta semana destinás toda la capacidad de ahorro extra a atacar la deuda con mayor tasa de interés."},meta_libertad:{score:51,titulo:"Potencial de libertad — primero orden.",resumen:"Crecés financieramente con deudas fuertes y visión de libertad. El potencial es enorme — el orden es clave.",fortaleza:"Crecer con deudas pesadas y visión de libertad financiera demuestra resiliencia y ambición. Poderoso.",riesgo:"La libertad financiera con deudas de altos intereses requiere primero vencer esas deudas. Son el enemigo número uno.",primer_paso:"Esta semana armás un plan de ataque de deudas de 6 meses. Con fecha de inicio y fecha de deuda cero."},},
    },
  };

  const callAI=async(answers)=>{
    setScreen("loading");
    setTimeout(()=>{
      const situacion = answers.situacion || "ajustado";
      const deuda = answers.deuda || "deudas_manejables";
      const meta = answers.meta || "tranquilidad";
      const deudaKey = deuda === "sin_deudas" ? "sin_deudas" : deuda === "deudas_criticas" ? "deudas_criticas" : deuda === "deuda_chica" ? "deuda_chica" : "deudas_manejables";
      const metaKey = meta === "casa" ? "meta_casa" : meta === "emprender" ? "meta_emprender" : meta === "tranquilidad" ? "meta_tranquilidad" : "meta_libertad";
      const sitKey = situacion === "hendy_total" ? "hendy_total" : situacion === "estable" ? "estable" : situacion === "creciendo" ? "creciendo" : "ajustado";
      const diag = DIAGNOSTICOS[sitKey]?.[deudaKey]?.[metaKey] || {
        score:40, titulo:"Tu camino empieza acá.",
        resumen:"Cada situación es única. Lo importante es que diste el primer paso.",
        fortaleza:"Buscar ayuda cuando la necesitás es una fortaleza, no una debilidad.",
        riesgo:"Sin un plan concreto, la situación tiende a mantenerse igual.",
        primer_paso:"Esta semana anotás cuánto entra y cuánto sale. Solo eso ya cambia todo."
      };
      setUserData({answers, diagnostico:diag});
      setScreen("result");
    }, 2200);
  };

  const completeLesson=(id)=>{
    const newCompleted=[...completed,id];
    setCompleted(newCompleted);
    setStreak(s=>s+1);
    // Check badge unlock
    const prev=BADGES.filter(b=>b.req(completed.length,streak,userData));
    const next=BADGES.filter(b=>b.req(newCompleted.length,streak+1,userData));
    const newBadge=next.find(b=>!prev.find(p=>p.id===b.id));
    if(newBadge) setTimeout(()=>showToast({emoji:newBadge.emoji,titulo:"¡Nuevo logro! "+newBadge.titulo,desc:newBadge.desc}),1500);
  };

  const toggleNotif=()=>{
    const next=!notifEnabled;
    setNotif(next);
    if(next) showToast({emoji:"🔔",titulo:"Recordatorio activado",desc:"Te avisamos todos los días a las 8:00 AM"});
    else showToast({emoji:"🔕",titulo:"Recordatorio desactivado",desc:"Podés activarlo cuando quieras"});
  };

  const renderApp=()=>(
    <>
      {navTab==="dashboard"&&<Dashboard userData={userData} streak={streak} completed={completed} onNav={setNavTab} userName={userName} showToast={showToast}/>}
      {navTab==="academy"  &&<Academy   userData={userData} streak={streak} completed={completed} onComplete={completeLesson} userName={userName} isPro={isPro} onUpgrade={()=>setNavTab('pro')}/>}
      {navTab==="logros"   &&<Logros    completed={completed} streak={streak} userData={userData}/>}
      {navTab==="profile"  &&<Profile   userData={userData} streak={streak} completed={completed} userName={userName}
        notifEnabled={notifEnabled} onToggleNotif={toggleNotif} isPro={isPro}
        onReset={()=>{setUserData(null);setCompleted([]);setScreen("name");setNavTab("dashboard");setUserName("");}}/>}
      {navTab==="pro"      &&<ProScreen userName={userName} onActivate={()=>{setIsPro(true);setNavTab("academy");showToast({emoji:"🔥",titulo:"¡Bienvenido a Hendy Pro!",desc:"Acceso ilimitado activado."});}} onBack={()=>setNavTab("academy")}/>}
      <BottomNav active={navTab} onNav={setNavTab}/>
    </>
  );

  return(
    <div style={{fontFamily:"'Syne',sans-serif",background:"#0A0A0A",minHeight:"100vh",
      display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
      <style>{CSS}</style>
      <Ambient/>
      {toast&&<Toast msg={toast}/>}
      {screen==="splash" &&<Splash done={splashDone}/>}
      {screen==="name"   &&<NameScreen onContinue={(n)=>{setUserName(n);setScreen("home");}}/>}
      {screen==="home"   &&<Home onStart={()=>setScreen("quiz")} userName={userName}/>}
      {screen==="quiz"   &&<Quiz onFinish={callAI} onBack={()=>setScreen("home")} userName={userName}/>}
      {screen==="loading"&&<Loading userName={userName}/>}
      {screen==="result" &&userData&&<Result data={userData.diagnostico} userName={userName} onContinue={()=>{setScreen("app");setNavTab("dashboard");}}/>}
      {screen==="app"    &&renderApp()}
    </div>
  );
}
