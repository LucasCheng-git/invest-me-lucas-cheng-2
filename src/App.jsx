import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = "https://epijaunxfpptmjgaqdhl.supabase.co";
const SUPA_KEY = "sb_publishable_H6GIYL9hyREtqFJpSqi1-A_h7IVvexo";
const sb = createClient(SUPA_URL, SUPA_KEY);

const NEWS_KEY = "e426a9e6ff314c18859b1111a38f783a";
const FINNHUB_KEY = "d6molb9r01qir35hssq0d6molb9r01qir35hssqg";

const INDUSTRIES = [
  "FinTech","HealthTech","EdTech","CleanEnergy","AI & ML",
  "E-Commerce","SaaS","BioTech","AgriTech","PropTech",
  "Cybersecurity","Web3 & Crypto","Gaming","FoodTech","SpaceTech"
];
const ICONS = {
  "FinTech":"💳","HealthTech":"🏥","EdTech":"📚","CleanEnergy":"🌱","AI & ML":"🤖",
  "E-Commerce":"🛒","SaaS":"☁️","BioTech":"🧬","AgriTech":"🌾","PropTech":"🏢",
  "Cybersecurity":"🔒","Web3 & Crypto":"⛓️","Gaming":"🎮","FoodTech":"🍽️","SpaceTech":"🚀"
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S={
  app:{fontFamily:"'DM Sans',sans-serif",background:"#fafafa",minHeight:"100vh",maxWidth:480,margin:"0 auto"},
  splash:{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff"},
  logoRow:{display:"flex",alignItems:"center",gap:8},
  lm:{background:"#1a6cf5",color:"#fff",fontWeight:800,fontSize:20,width:38,height:38,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"},
  lt:{fontSize:26,fontWeight:800,color:"#0d1117",letterSpacing:"-0.5px"},
  aWrap:{minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-start",background:"#fafafa",padding:"32px 16px"},
  aCard:{background:"#fff",borderRadius:20,padding:"28px 24px",width:"100%",maxWidth:400,boxShadow:"0 4px 30px rgba(0,0,0,0.07)",display:"flex",flexDirection:"column",gap:11},
  aTitle:{margin:"4px 0 6px",fontSize:21,fontWeight:800,color:"#0d1117"},
  aSwitch:{textAlign:"center",color:"#aaa",fontSize:13,margin:0},
  inp:{border:"1.5px solid #e8edf5",borderRadius:12,padding:"11px 14px",fontSize:14,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif",color:"#0d1117"},
  btnP:{background:"#1a6cf5",color:"#fff",border:"none",borderRadius:12,padding:"13px 0",fontSize:15,fontWeight:700,cursor:"pointer",width:"100%",fontFamily:"'DM Sans',sans-serif"},
  btnG:{background:"#fff",color:"#1a6cf5",border:"1.5px solid #1a6cf5",borderRadius:12,padding:"12px 0",fontSize:15,fontWeight:600,cursor:"pointer",width:"100%",fontFamily:"'DM Sans',sans-serif"},
  lnk:{color:"#1a6cf5",cursor:"pointer",fontWeight:600},
  rCard:{flex:1,border:"2px solid #e8edf5",borderRadius:16,padding:"18px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"},
  rCardOn:{border:"2px solid #1a6cf5",background:"#f0f5ff"},
  indGrid:{display:"flex",flexWrap:"wrap",gap:7,maxHeight:220,overflowY:"auto"},
  iChip:{background:"#f5f7fa",border:"1.5px solid #eee",borderRadius:20,padding:"6px 11px",fontSize:12,cursor:"pointer",fontWeight:500,whiteSpace:"nowrap"},
  iChipOn:{background:"#f0f5ff",border:"1.5px solid #1a6cf5",color:"#1a6cf5"},
  vmCard:{flex:1,border:"2px solid #e8edf5",borderRadius:16,padding:"18px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer"},
  vBox:{border:"2px dashed #e8edf5",borderRadius:14,padding:24,display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer",minHeight:110,justifyContent:"center"},
  hdr:{position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px"},
  nBtn:{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",padding:"5px 6px",borderRadius:10,gap:2,position:"relative"},
  nBtnOn:{background:"#f0f5ff"},
  badge:{position:"absolute",top:-2,right:-4,background:"#ff3b30",color:"#fff",fontSize:9,fontWeight:700,width:15,height:15,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"},
  fBar:{display:"flex",gap:7,overflowX:"auto",padding:"10px 14px 8px",scrollbarWidth:"none"},
  fChip:{background:"#f5f7fa",border:"1.5px solid #eee",borderRadius:20,padding:"6px 12px",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontWeight:500,fontFamily:"'DM Sans',sans-serif",flexShrink:0},
  fChipOn:{background:"#1a6cf5",color:"#fff",border:"1.5px solid #1a6cf5"},
  hint:{margin:"0 14px 10px",padding:"9px 13px",background:"#f0f5ff",borderRadius:11,fontSize:12,color:"#1a6cf5"},
  card:{background:"#fff",borderRadius:18,boxShadow:"0 2px 14px rgba(0,0,0,0.06)",overflow:"hidden"},
  playBtn:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.18)",fontSize:40,color:"#fff"},
  indBadge:{position:"absolute",top:10,left:10,background:"rgba(0,0,0,0.55)",color:"#fff",borderRadius:20,padding:"4px 10px",fontSize:11,backdropFilter:"blur(4px)"},
  aBtn:{background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,color:"#555",padding:"4px 6px",borderRadius:8,fontFamily:"'DM Sans',sans-serif"},
  back:{background:"none",border:"none",cursor:"pointer",fontSize:15,fontWeight:700,color:"#1a6cf5",padding:"0 8px 0 0",display:"inline-block"},
  secT:{fontSize:15,fontWeight:700,color:"#0d1117",margin:"0 0 10px"},
  smBtn:{background:"#f0f5ff",color:"#1a6cf5",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0},
  toast:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",color:"#fff",padding:"12px 24px",borderRadius:24,fontSize:14,fontWeight:600,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,0.25)",whiteSpace:"nowrap",transition:"background .3s"},
};

// ─── DARK MODE OVERRIDES ──────────────────────────────────────────────────────
const DK={
  app:{background:"#0d1117"},
  hdr:{background:"#161b22",borderBottom:"1px solid #21262d"},
  nBtnOn:{background:"#1c2333"},
  card:{background:"#161b22",boxShadow:"0 2px 14px rgba(0,0,0,0.3)"},
  inp:{background:"#1c2333",border:"1.5px solid #30363d",color:"#e0e0e0"},
  text:{color:"#e0e0e0"},
  subText:{color:"#8b949e"},
  aCard:{background:"#161b22",boxShadow:"0 4px 30px rgba(0,0,0,0.4)"},
  secBg:{background:"#161b22"},
  fChip:{background:"#1c2333",border:"1.5px solid #30363d",color:"#8b949e"},
};

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;}body{margin:0;background:#fafafa;}
  ::-webkit-scrollbar{width:0;height:0;}
  .cp{cursor:pointer;}
  .card{transition:box-shadow .2s;}.card:hover{box-shadow:0 6px 28px rgba(0,0,0,0.1)!important;}
  .vmcard:hover{border-color:#1a6cf5!important;background:#f0f5ff;}
  input:focus,textarea:focus{border-color:#1a6cf5!important;box-shadow:0 0 0 3px rgba(26,108,245,0.12);}
  button:active{transform:scale(0.97);}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.2;}}
  .spinner{width:28px;height:28px;border:3px solid #e8edf5;border-top-color:#1a6cf5;border-radius:50%;animation:spin .7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  a{text-decoration:none;color:inherit;}
`;



function timeAgo(ts) {
  const d = Date.now() - new Date(ts).getTime();
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d/3600000)}h ago`;
  return `${Math.floor(d/86400000)}d ago`;
}
function countWords(s) { return s.trim()===""?0:s.trim().split(/\s+/).length; }

function Av({ src, name, size=40 }) {
  const fb = `https://ui-avatars.com/api/?name=${encodeURIComponent(name||"U")}&background=e8edf5&color=1a6cf5&size=${size*2}`;
  return (
    <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:"#e8edf5"}}>
      <img src={src||fb} alt={name} style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>e.target.src=fb}/>
    </div>
  );
}
function Spinner() {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:40}}><div className="spinner"/></div>;
}

export default function InvestMe() {
  const [me, setMe] = useState(null);
  const [screen, setScreen] = useState("splash");
  const [watchTarget, setWatchTarget] = useState(null);
  const [chatTarget, setChatTarget] = useState(null);
  const [filterInd, setFilterInd] = useState("All");
  const [notif, setNotif] = useState(null);
  const [notifType, setNotifType] = useState("info");
  const [booting, setBooting] = useState(true);
  const [dark, setDark] = useState(()=>{try{return localStorage.getItem("im_dark")==="1";}catch(e){return false;}});

  function toggleDark(){setDark(d=>{try{localStorage.setItem("im_dark",d?"0":"1");}catch(e){}return !d;});}

  function notify(msg, type="info") {
    setNotif(msg); setNotifType(type);
    setTimeout(()=>setNotif(null), 3200);
  }

  useEffect(() => {
    sb.auth.getSession().then(async ({data:{session}}) => {
      if (session?.user) {
        const {data:p} = await sb.from("profiles").select("*").eq("id",session.user.id).single();
        if (p) { setMe({...session.user,...p}); setScreen("feed"); }
      }
      setBooting(false);
    });
    const {data:{subscription}} = sb.auth.onAuthStateChange((e)=>{
      if(e==="SIGNED_OUT"){setMe(null);setScreen("splash");}
    });
    return ()=>subscription.unsubscribe();
  }, []);

  async function login(email,pw) {
    const {data,error} = await sb.auth.signInWithPassword({email,password:pw});
    if(error){notify("❌ "+error.message,"error");return;}
    const {data:p} = await sb.from("profiles").select("*").eq("id",data.user.id).single();
    if(!p){notify("Profile not found","error");return;}
    setMe({...data.user,...p}); setScreen("feed");
    notify("Welcome back, "+p.name+"! 👋","success");
  }

  async function logout() { await sb.auth.signOut(); setMe(null); setScreen("splash"); }

  const toastBg = notifType==="error"?"#ff3b30":notifType==="success"?"#34c759":"#0d1117";

  if (booting) return (
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:dark?"#0d1117":"#fff"}}>
      <style>{CSS}</style>
      <div style={{textAlign:"center"}}>
        <div style={{...S.lm,width:60,height:60,fontSize:30,margin:"0 auto 20px",borderRadius:16}}>I</div>
        <div className="spinner" style={{margin:"0 auto"}}/>
      </div>
    </div>
  );

  const D = dark ? DK : {};
  return (
    <div style={{...S.app,...D.app}}>
      <style>{CSS}</style>
      {notif && <div style={{...S.toast,background:toastBg}}>{notif}</div>}
      {screen==="splash"   && <Splash setScreen={setScreen} dark={dark}/>}
      {screen==="login"    && <Login login={login} setScreen={setScreen} dark={dark}/>}
      {screen==="register" && <Register sb={sb} onDone={p=>{setMe(m=>({...m,...p}));setScreen("feed");notify("Welcome to InvestMe 🎉","success");}} setScreen={setScreen} notify={notify} dark={dark}/>}
      {["feed","profile","messages","chat","watch","community","news","stocks","notifications","dashboard"].includes(screen) && me && (
        <Shell me={me} setMe={setMe} screen={screen} setScreen={setScreen} logout={logout}
          watchTarget={watchTarget} setWatchTarget={setWatchTarget}
          chatTarget={chatTarget} setChatTarget={setChatTarget}
          filterInd={filterInd} setFilterInd={setFilterInd} notify={notify}
          dark={dark} toggleDark={toggleDark}/>
      )}
    </div>
  );
}

function Splash({setScreen}) {
  return (
    <div style={S.splash}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"0 40px",width:"100%",gap:14}}>
        <div style={{...S.lm,width:72,height:72,fontSize:36,borderRadius:20,marginBottom:4}}>I</div>
        <div style={S.lt}>InvestMe</div>
        <p style={{color:"#999",fontSize:15,margin:"0 0 8px",textAlign:"center"}}>Where bold ideas meet bold capital.</p>
        <button style={{...S.btnP,marginBottom:2}} onClick={()=>setScreen("register")}>Get Started</button>
        <button style={S.btnG} onClick={()=>setScreen("login")}>Sign In</button>
      </div>
    </div>
  );
}

function Login({login,setScreen}) {
  const [email,setEmail]=useState(""); const [pw,setPw]=useState(""); const [loading,setLoading]=useState(false);
  async function handle(){setLoading(true);await login(email,pw);setLoading(false);}
  return (
    <div style={S.aWrap}>
      <div style={S.aCard}>
        <div style={S.logoRow}><div style={S.lm}>I</div><span style={S.lt}>InvestMe</span></div>
        <h2 style={S.aTitle}>Welcome back</h2>
        <input style={S.inp} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        <input style={S.inp} type="password" placeholder="Password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()}/>
        <button style={{...S.btnP,opacity:loading?0.7:1}} disabled={loading} onClick={handle}>{loading?"Signing in…":"Sign In"}</button>
        <p style={S.aSwitch}>No account? <span style={S.lnk} onClick={()=>setScreen("register")}>Register</span></p>
      </div>
    </div>
  );
}

function Register({sb,onDone,setScreen,notify}) {
  const [step,setStep]=useState(1); const [role,setRole]=useState(null);
  const [form,setForm]=useState({name:"",email:"",password:"",bio:"",industry:"",industries:[],firm:"",pitchTitle:""});
  const [videoBlob,setVideoBlob]=useState(null); const [videoMode,setVideoMode]=useState(null); const [loading,setLoading]=useState(false);
  function sf(k,v){setForm(f=>({...f,[k]:v}));}
  function togInd(i){sf("industries",form.industries.includes(i)?form.industries.filter(x=>x!==i):[...form.industries,i]);}
  const wc=countWords(form.bio); const wcOk=wc<=250;
  const totalSteps=role==="startup"?4:3;

  async function submit() {
    if(!form.name||!form.email||!form.password){notify("Fill all required fields","error");return;}
    if(role==="startup"&&!form.industry){notify("Select your industry","error");return;}
    if(role==="investor"&&!form.industries.length){notify("Select at least one industry","error");return;}
    if(!wcOk){notify("Bio exceeds 250 words","error");return;}
    setLoading(true);
    try {
      const {data:authData,error:authErr}=await sb.auth.signUp({email:form.email,password:form.password,options:{data:{name:form.name}}});
      if(authErr)throw authErr;
      const uid=authData.user.id;
      let videoUrl=null;
      if(videoBlob&&role==="startup"){
        const res=await fetch(videoBlob);const blob=await res.blob();
        const {error:upErr}=await sb.storage.from("pitch-videos").upload(`${uid}/pitch.webm`,blob,{contentType:"video/webm",upsert:true});
        if(!upErr){const {data:ud}=sb.storage.from("pitch-videos").getPublicUrl(`${uid}/pitch.webm`);videoUrl=ud.publicUrl;}
      }
      const payload={id:uid,role,name:form.name,bio:form.bio,
        industry:role==="startup"?form.industry:null,
        industries:role==="investor"?form.industries:[],
        firm:form.firm||null,pitch_title:form.pitchTitle||form.name+" Pitch",
        avatar_url:`https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=e8edf5&color=1a6cf5&size=150`,
        video_url:videoUrl,video_thumb:`https://picsum.photos/seed/${uid}/400/300`,likes:0,views:0};
      const {data:profile,error:profErr}=await sb.from("profiles").insert(payload).select().single();
      if(profErr)throw profErr;
      onDone(profile);
    } catch(e){notify("❌ "+(e.message||"Registration failed"),"error");}
    finally{setLoading(false);}
  }

  return (
    <div style={S.aWrap}>
      <div style={{...S.aCard,maxWidth:440}}>
        <div style={S.logoRow}><div style={S.lm}>I</div><span style={S.lt}>InvestMe</span></div>
        <div style={{display:"flex",gap:5,margin:"4px 0 12px",justifyContent:"center"}}>
          {Array.from({length:totalSteps},(_,i)=>(<div key={i} style={{width:step>i?32:20,height:4,borderRadius:2,background:step>i?"#1a6cf5":"#e8edf5",transition:"all .3s"}}/>))}
        </div>
        {step===1&&<><h2 style={S.aTitle}>Join as…</h2><div style={{display:"flex",gap:12,margin:"8px 0 16px"}}>{["startup","investor"].map(r=>(<div key={r} style={{...S.rCard,...(role===r?S.rCardOn:{})}} onClick={()=>setRole(r)}><span style={{fontSize:30}}>{r==="startup"?"🚀":"💼"}</span><span style={{fontWeight:700,marginTop:6,fontSize:14}}>{r==="startup"?"Startup":"Investor"}</span><span style={{color:"#bbb",fontSize:11,textAlign:"center"}}>{r==="startup"?"Pitch your idea":"Discover deals"}</span></div>))}</div><button style={{...S.btnP,opacity:role?1:0.4}} disabled={!role} onClick={()=>setStep(2)}>Continue</button><p style={S.aSwitch}>Have account? <span style={S.lnk} onClick={()=>setScreen("login")}>Sign In</span></p></>}
        {step===2&&<><h2 style={S.aTitle}>Your details</h2><input style={S.inp} placeholder="Full name *" value={form.name} onChange={e=>sf("name",e.target.value)}/><input style={S.inp} placeholder="Email *" value={form.email} onChange={e=>sf("email",e.target.value)}/><input style={S.inp} type="password" placeholder="Password *" value={form.password} onChange={e=>sf("password",e.target.value)}/><div style={{position:"relative"}}><textarea style={{...S.inp,height:84,resize:"none",paddingBottom:26,borderColor:!wcOk?"#ff3b30":undefined}} placeholder="Bio (max 250 words)" value={form.bio} onChange={e=>{if(countWords(e.target.value)<=255)sf("bio",e.target.value);}}/><span style={{position:"absolute",bottom:9,right:12,fontSize:11,color:!wcOk?"#ff3b30":wc>220?"#ff9500":"#bbb"}}>{wc}/250</span></div>{role==="investor"&&<input style={S.inp} placeholder="Firm / Fund name" value={form.firm} onChange={e=>sf("firm",e.target.value)}/>}<div style={{display:"flex",gap:10}}><button style={{...S.btnG,flex:1}} onClick={()=>setStep(1)}>Back</button><button style={{...S.btnP,flex:2}} onClick={()=>{if(!form.name||!form.email||!form.password){notify("Fill required fields","error");return;}if(!wcOk){notify("Bio too long","error");return;}setStep(3);}}>Next</button></div></>}
        {step===3&&role==="startup"&&<><h2 style={S.aTitle}>Your industry</h2><div style={S.indGrid}>{INDUSTRIES.map(ind=>(<div key={ind} style={{...S.iChip,...(form.industry===ind?S.iChipOn:{})}} onClick={()=>sf("industry",ind)}>{ICONS[ind]} {ind}</div>))}</div><div style={{display:"flex",gap:10,marginTop:10}}><button style={{...S.btnG,flex:1}} onClick={()=>setStep(2)}>Back</button><button style={{...S.btnP,flex:2,opacity:form.industry?1:0.4}} disabled={!form.industry} onClick={()=>setStep(4)}>Next</button></div></>}
        {step===3&&role==="investor"&&<><h2 style={S.aTitle}>Industries you love</h2><div style={S.indGrid}>{INDUSTRIES.map(ind=>(<div key={ind} style={{...S.iChip,...(form.industries.includes(ind)?S.iChipOn:{})}} onClick={()=>togInd(ind)}>{ICONS[ind]} {ind}</div>))}</div><div style={{display:"flex",gap:10,marginTop:10}}><button style={{...S.btnG,flex:1}} onClick={()=>setStep(2)}>Back</button><button style={{...S.btnP,flex:2,opacity:form.industries.length?1:0.4}} disabled={!form.industries.length||loading} onClick={submit}>{loading?"Creating…":"Create Account 🎉"}</button></div></>}
        {step===4&&role==="startup"&&<><h2 style={S.aTitle}>Pitch video</h2><input style={{...S.inp,marginBottom:2}} placeholder="Pitch title" value={form.pitchTitle} onChange={e=>sf("pitchTitle",e.target.value)}/><p style={{color:"#bbb",fontSize:11,margin:"0 0 14px",textAlign:"center"}}>⏱ Max 3 minutes</p>{!videoMode&&!videoBlob&&(<div style={{display:"flex",gap:12}}><div style={S.vmCard} className="vmcard" onClick={()=>setVideoMode("record")}><span style={{fontSize:32}}>📹</span><span style={{fontWeight:700,fontSize:13,marginTop:8}}>Record</span></div><div style={S.vmCard} className="vmcard" onClick={()=>setVideoMode("upload")}><span style={{fontSize:32}}>📁</span><span style={{fontWeight:700,fontSize:13,marginTop:8}}>Upload</span></div></div>)}{videoMode==="upload"&&!videoBlob&&<VideoUpload setVideoBlob={setVideoBlob} notify={notify}/>}{videoMode==="record"&&!videoBlob&&<WebcamRecorder setVideoBlob={setVideoBlob} notify={notify}/>}{videoBlob&&(<div style={{borderRadius:14,overflow:"hidden",border:"2px solid #1a6cf5",marginBottom:4}}><video src={videoBlob} controls style={{width:"100%",display:"block",maxHeight:200,background:"#000"}}/><button style={{width:"100%",background:"#fff8f8",color:"#ff3b30",border:"none",padding:10,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>{setVideoBlob(null);setVideoMode(null);}}>🗑 Remove</button></div>)}<div style={{display:"flex",gap:10,marginTop:10}}><button style={{...S.btnG,flex:1}} onClick={()=>{if(videoBlob){setVideoBlob(null);setVideoMode(null);}else if(videoMode)setVideoMode(null);else setStep(3);}}>Back</button><button style={{...S.btnP,flex:2,opacity:loading?0.7:1}} disabled={loading} onClick={submit}>{loading?"Uploading…":videoBlob?"Launch 🚀":"Skip →"}</button></div></>}
      </div>
    </div>
  );
}

function VideoUpload({setVideoBlob,notify}) {
  const fileRef=useRef(); const [checking,setChecking]=useState(false);
  function handleFile(e){const f=e.target.files[0];if(!f)return;setChecking(true);const url=URL.createObjectURL(f);const vid=document.createElement("video");vid.preload="metadata";vid.onloadedmetadata=()=>{setChecking(false);if(vid.duration>180){notify("Video exceeds 3 minutes","error");URL.revokeObjectURL(url);fileRef.current.value="";}else setVideoBlob(url);};vid.onerror=()=>{setChecking(false);notify("Could not read video","error");};vid.src=url;}
  return (<div><div style={S.vBox} onClick={()=>fileRef.current.click()}>{checking?<><span style={{fontSize:28}}>⏳</span><p style={{color:"#bbb",fontSize:13,margin:"8px 0 0"}}>Checking…</p></>:<><span style={{fontSize:36}}>🎬</span><p style={{color:"#bbb",fontSize:13,margin:"8px 0 4px"}}>Tap to select</p><p style={{color:"#ddd",fontSize:11,margin:0}}>MP4, MOV, WebM · max 3 min</p></>}</div><input ref={fileRef} type="file" accept="video/*" style={{display:"none"}} onChange={handleFile}/></div>);
}

function WebcamRecorder({setVideoBlob,notify}) {
  const vidRef=useRef();const streamRef=useRef();const recRef=useRef();const chunksRef=useRef([]);const timerRef=useRef();
  const [state,setState]=useState("idle");const [elapsed,setElapsed]=useState(0);const MAX=180;
  async function startPreview(){try{const s=await navigator.mediaDevices.getUserMedia({video:true,audio:true});streamRef.current=s;vidRef.current.srcObject=s;vidRef.current.muted=true;await vidRef.current.play();setState("preview");}catch{notify("Camera access denied","error");}}
  function startRec(){chunksRef.current=[];const rec=new MediaRecorder(streamRef.current,{mimeType:"video/webm"});recRef.current=rec;rec.ondataavailable=e=>{if(e.data.size>0)chunksRef.current.push(e.data);};rec.onstop=()=>{const blob=new Blob(chunksRef.current,{type:"video/webm"});const url=URL.createObjectURL(blob);setVideoBlob(url);vidRef.current.srcObject=null;vidRef.current.src=url;vidRef.current.muted=false;vidRef.current.controls=true;stopStream();setState("done");};rec.start(100);setElapsed(0);setState("recording");timerRef.current=setInterval(()=>setElapsed(p=>{if(p+1>=MAX){stopRec();return MAX;}return p+1;}),1000);}
  function stopRec(){clearInterval(timerRef.current);if(recRef.current?.state==="recording")recRef.current.stop();}
  function stopStream(){streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;}
  function reset(){stopStream();clearInterval(timerRef.current);setElapsed(0);setState("idle");if(vidRef.current){vidRef.current.srcObject=null;vidRef.current.src="";vidRef.current.controls=false;}}
  useEffect(()=>()=>{stopStream();clearInterval(timerRef.current);},[]);
  const pct=Math.min((elapsed/MAX)*100,100);const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  return (<div><div style={{borderRadius:14,overflow:"hidden",background:"#0d1117",position:"relative",aspectRatio:"4/3",maxHeight:220}}><video ref={vidRef} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} playsInline/>{state==="idle"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",pointerEvents:"none"}}><span style={{fontSize:32}}>📹</span></div>}{state==="recording"&&<div style={{position:"absolute",top:10,left:10,right:10,pointerEvents:"none"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{background:"rgba(255,59,48,0.9)",color:"#fff",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700}}>⏺ REC</span><span style={{background:"rgba(0,0,0,0.65)",color:"#fff",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:700}}>{fmt(elapsed)}/{fmt(MAX)}</span></div><div style={{height:3,background:"rgba(255,255,255,0.2)",borderRadius:2}}><div style={{height:"100%",width:`${pct}%`,background:pct>85?"#ff3b30":"#1a6cf5",borderRadius:2}}/></div></div>}</div><div style={{display:"flex",gap:10,marginTop:10}}>{state==="idle"&&<button style={S.btnP} onClick={startPreview}>Enable Camera</button>}{state==="preview"&&<button style={{...S.btnP,background:"#ff3b30"}} onClick={startRec}>⏺ Record</button>}{state==="recording"&&<button style={{...S.btnP,background:"#1a1a1a"}} onClick={stopRec}>⏹ Stop</button>}{state==="done"&&<button style={S.btnG} onClick={reset}>🔄 Re-record</button>}</div></div>);
}

// ─── SHELL ────────────────────────────────────────────────────────────────────
function Shell({me,setMe,screen,setScreen,logout,watchTarget,setWatchTarget,chatTarget,setChatTarget,filterInd,setFilterInd,notify,dark,toggleDark}) {
  const [allUsers,setAllUsers]=useState([]);
  const [messages,setMessages]=useState([]);
  const [loadingUsers,setLoadingUsers]=useState(true);
  const [notifications,setNotifications]=useState([]);
  const D = dark ? DK : {};

  useEffect(()=>{sb.from("profiles").select("*").then(({data})=>{setAllUsers(data||[]);setLoadingUsers(false);});},[]);
  useEffect(()=>{
    if(!me)return;
    sb.from("messages").select("*").or(`from_id.eq.${me.id},to_id.eq.${me.id}`).order("created_at",{ascending:true}).then(({data})=>setMessages(data||[]));
    const ch=sb.channel("msgs-"+me.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:`to_id=eq.${me.id}`},p=>{setMessages(prev=>[...prev,p.new]);setNotifications(prev=>[{id:Date.now(),type:"message",text:`New message from ${allUsers.find(u=>u.id===p.new.from_id)?.name||"someone"}`,ts:new Date().toISOString(),read:false},...prev]);}).subscribe();
    return()=>sb.removeChannel(ch);
  },[me?.id]);

  useEffect(()=>{
    if(!me||!allUsers.length)return;
    // Build notifications from follows
    sb.from("follows").select("*").eq("following_id",me.id).order("created_at",{ascending:false}).limit(20).then(({data})=>{
      const ns=(data||[]).map(f=>({id:f.id,type:"follow",text:`${allUsers.find(u=>u.id===f.follower_id)?.name||"Someone"} followed you`,ts:f.created_at,read:false}));
      setNotifications(prev=>{const existing=prev.filter(n=>n.type!=="follow");return [...ns,...existing].slice(0,50);});
    });
  },[allUsers.length,me?.id]);

  async function sendMsg(toId,text){const {data,error}=await sb.from("messages").insert({from_id:me.id,to_id:toId,text,read:false}).select().single();if(!error&&data)setMessages(p=>[...p,data]);else if(error)notify("Failed to send","error");}
  function getConvo(a,b){return messages.filter(m=>(m.from_id===a&&m.to_id===b)||(m.from_id===b&&m.to_id===a));}
  function peers(){const s=new Set();messages.forEach(m=>{if(m.from_id===me.id)s.add(m.to_id);if(m.to_id===me.id)s.add(m.from_id);});return[...s].map(id=>allUsers.find(u=>u.id===id)).filter(Boolean);}
  const unread=messages.filter(m=>m.to_id===me.id&&!m.read).length;
  const startups=allUsers.filter(u=>u.role==="startup");
  const relS=me.role==="investor"?startups.filter(s=>me.industries?.includes(s.industry)):startups;
  const displayS=filterInd==="All"?(me.role==="investor"?relS:startups):(me.role==="investor"?relS.filter(s=>s.industry===filterInd):startups.filter(s=>s.industry===filterInd));

  const unreadNotifs=notifications.filter(n=>!n.read).length;
  const navItems=[
    {icon:"🏠",lbl:"Feed",s:"feed"},
    {icon:"📰",lbl:"News",s:"news"},
    {icon:"📈",lbl:"Markets",s:"stocks"},
    {icon:"🌐",lbl:"Community",s:"community"},
    {icon:"💬",lbl:"DMs",s:"messages",badge:unread},
    {icon:"🔔",lbl:"Alerts",s:"notifications",badge:unreadNotifs},
    {icon:"👤",lbl:"Profile",s:"profile"},
  ];

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",...D.app}}>
      <header style={{...S.hdr,...D.hdr}}>
        <div style={S.logoRow} onClick={()=>setScreen("feed")} className="cp"><div style={S.lm}>I</div><span style={{...S.lt,fontSize:20,...D.text}}>InvestMe</span></div>
        <nav style={{display:"flex",gap:0,alignItems:"center"}}>
          {navItems.map(n=>(<button key={n.s} style={{...S.nBtn,...((screen===n.s||(screen==="chat"&&n.s==="messages")||(screen==="watch"&&n.s==="feed")||(screen==="dashboard"&&n.s==="profile"))?{...S.nBtnOn,...D.nBtnOn}:{})}} onClick={()=>setScreen(n.s)}><span style={{position:"relative",fontSize:18}}>{n.icon}{n.badge>0&&<span style={S.badge}>{n.badge}</span>}</span><span style={{fontSize:8,color:(screen===n.s)?"#1a6cf5":dark?"#888":"#aaa"}}>{n.lbl}</span></button>))}
          <button style={{...S.nBtn}} onClick={toggleDark}><span style={{fontSize:18}}>{dark?"☀️":"🌙"}</span><span style={{fontSize:8,color:dark?"#888":"#aaa"}}>{dark?"Light":"Dark"}</span></button>
          <button style={S.nBtn} onClick={logout}><span style={{fontSize:18}}>↩️</span><span style={{fontSize:8,color:dark?"#888":"#aaa"}}>Out</span></button>
        </nav>
      </header>
      <main style={{flex:1,overflowY:"auto"}}>
        {screen==="feed"&&(loadingUsers?<Spinner/>:<Feed me={me} displayS={displayS} filterInd={filterInd} setFilterInd={setFilterInd} setWatchTarget={setWatchTarget} setScreen={setScreen} setChatTarget={setChatTarget} notify={notify} dark={dark}/>)}
        {screen==="profile"&&<Profile me={me} setMe={setMe} setWatchTarget={setWatchTarget} setScreen={setScreen} setChatTarget={setChatTarget} allUsers={allUsers} notify={notify} dark={dark} setScreen2={setScreen}/>}
        {screen==="messages"&&<Inbox peers={peers()} me={me} messages={messages} setChatTarget={setChatTarget} setScreen={setScreen} allUsers={allUsers} dark={dark}/>}
        {screen==="chat"&&chatTarget&&<Chat me={me} peer={chatTarget} convo={getConvo(me.id,chatTarget.id)} sendMsg={sendMsg} setScreen={setScreen} dark={dark}/>}
        {screen==="watch"&&watchTarget&&<Watch startup={watchTarget} me={me} setChatTarget={setChatTarget} setScreen={setScreen} dark={dark}/>}
        {screen==="community"&&<Community me={me} allUsers={allUsers} notify={notify} dark={dark}/>}
        {screen==="news"&&<NewsPage dark={dark}/>}
        {screen==="stocks"&&<StocksPage dark={dark}/>}
        {screen==="notifications"&&<NotificationsPage notifications={notifications} setNotifications={setNotifications} allUsers={allUsers} dark={dark} setScreen={setScreen} setChatTarget={setChatTarget}/>}
        {screen==="dashboard"&&me.role==="investor"&&<InvestorDashboard me={me} allUsers={allUsers} messages={messages} dark={dark} setScreen={setScreen} setChatTarget={setChatTarget}/>}
        {screen==="dashboard"&&me.role==="startup"&&<Profile me={me} setMe={setMe} setWatchTarget={setWatchTarget} setScreen={setScreen} setChatTarget={setChatTarget} allUsers={allUsers} notify={notify} dark={dark}/>}
      </main>
    </div>
  );
}

// ─── FEED ─────────────────────────────────────────────────────────────────────
function FundraisingBar({raised,goal,dark}) {
  const pct = Math.min(Math.round((raised/goal)*100),100);
  const fmtM = v => v>=1000000?`$${(v/1000000).toFixed(1)}M`:v>=1000?`$${(v/1000).toFixed(0)}K`:`$${v}`;
  return (
    <div style={{marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:12,fontWeight:700,color:"#1a6cf5"}}>💰 Raising {fmtM(goal)}</span>
        <span style={{fontSize:12,fontWeight:700,color:pct>=100?"#34c759":"#ff9500"}}>{pct}% funded</span>
      </div>
      <div style={{height:8,borderRadius:8,background:dark?"#2a2a2a":"#e8edf5",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:8,background:pct>=100?"#34c759":pct>=50?"#1a6cf5":"#ff9500",transition:"width .6s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        <span style={{fontSize:11,color:dark?"#888":"#aaa"}}>Raised: {fmtM(raised)}</span>
        <span style={{fontSize:11,color:dark?"#888":"#aaa"}}>Goal: {fmtM(goal)}</span>
      </div>
    </div>
  );
}

function Feed({me,displayS,filterInd,setFilterInd,setWatchTarget,setScreen,setChatTarget,notify}) {
  const [likedMap,setLikedMap]=useState({});
  const [likeCounts,setLikeCounts]=useState({});
  const [followMap,setFollowMap]=useState({});
  const [search,setSearch]=useState("");

  useEffect(()=>{
    if(!me||!displayS.length)return;
    const ids=displayS.map(s=>s.id);
    sb.from("likes").select("startup_id").in("startup_id",ids).then(({data})=>{const c={};(data||[]).forEach(l=>{c[l.startup_id]=(c[l.startup_id]||0)+1;});setLikeCounts(c);});
    sb.from("likes").select("startup_id").eq("user_id",me.id).in("startup_id",ids).then(({data})=>{const m={};(data||[]).forEach(l=>{m[l.startup_id]=true;});setLikedMap(m);});
    sb.from("follows").select("following_id").eq("follower_id",me.id).then(({data})=>{const m={};(data||[]).forEach(f=>{m[f.following_id]=true;});setFollowMap(m);});
  },[displayS.length,me?.id]);

  async function toggleLike(sid){const isLiked=likedMap[sid];setLikedMap(m=>({...m,[sid]:!isLiked}));setLikeCounts(c=>({...c,[sid]:(c[sid]||0)+(isLiked?-1:1)}));if(isLiked)await sb.from("likes").delete().eq("user_id",me.id).eq("startup_id",sid);else await sb.from("likes").insert({user_id:me.id,startup_id:sid});}
  async function toggleFollow(uid){const isFollowing=followMap[uid];setFollowMap(m=>({...m,[uid]:!isFollowing}));if(isFollowing)await sb.from("follows").delete().eq("follower_id",me.id).eq("following_id",uid);else{await sb.from("follows").insert({follower_id:me.id,following_id:uid});notify("Following! 🎉","success");}}
  async function openWatch(s){await sb.from("profiles").update({views:(s.views||0)+1}).eq("id",s.id);setWatchTarget({...s,views:(s.views||0)+1});setScreen("watch");}

  const filtered=displayS.filter(s=>!search||s.name?.toLowerCase().includes(search.toLowerCase())||s.pitch_title?.toLowerCase().includes(search.toLowerCase())||s.bio?.toLowerCase().includes(search.toLowerCase())||s.industry?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{paddingBottom:40}}>
      <div style={{padding:"12px 14px 4px"}}><div style={{position:"relative"}}><span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none"}}>🔍</span><input style={{...S.inp,...(dark?DK.inp:{}),paddingLeft:38,borderRadius:24,background:dark?"#1c2333":"#f5f7fa",border:dark?"1.5px solid #30363d":"1.5px solid #eee"}} placeholder="Search pitches, industries…" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:15,color:"#aaa"}} onClick={()=>setSearch("")}>✕</button>}</div></div>
      <div style={S.fBar}>{["All",...INDUSTRIES].map(ind=>(<button key={ind} style={{...S.fChip,...(dark?DK.fChip:{}),...(filterInd===ind?S.fChipOn:{})}} onClick={()=>setFilterInd(ind)}>{ind!=="All"&&ICONS[ind]} {ind}</button>))}</div>
      {me.role==="investor"&&filterInd==="All"&&<div style={S.hint}>Showing: {me.industries?.map(i=>`${ICONS[i]} ${i}`).join(" · ")}</div>}
      <div style={{padding:"0 14px",display:"flex",flexDirection:"column",gap:16}}>
        {filtered.length===0&&<p style={{textAlign:"center",color:"#ccc",padding:"60px 0",fontSize:15}}>{search?"No results found 🔍":"No pitches here yet."}</p>}
        {filtered.map(s=>(
          <div key={s.id} style={{...S.card,...(dark?DK.card:{})}} className="card">
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>openWatch(s)}>
              <img src={s.video_thumb||`https://picsum.photos/seed/${s.id}/400/300`} alt={s.pitch_title} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block"}}/>
              <div style={S.playBtn}>▶</div>
              <div style={S.indBadge}>{ICONS[s.industry]} {s.industry}</div>
              {s.video_url&&<div style={{position:"absolute",top:10,right:10,background:"rgba(26,108,245,0.85)",color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700}}>📹 Live</div>}
            </div>
            <div style={{padding:"14px 16px 16px"}}>
              <div style={{display:"flex",alignItems:"center",marginBottom:10}}>
                <Av src={s.avatar_url} name={s.name} size={38}/>
                <div style={{marginLeft:10,flex:1}}><div style={{fontWeight:700,fontSize:14,color:dark?"#e0e0e0":"#0d1117"}}>{s.name}</div><div style={{color:dark?"#888":"#aaa",fontSize:12}}>{s.industry}</div></div>
                {me.id!==s.id&&<button style={{...S.smBtn,background:followMap[s.id]?"#e8f5e9":"#f0f5ff",color:followMap[s.id]?"#34c759":"#1a6cf5",border:followMap[s.id]?"1.5px solid #34c759":"1.5px solid transparent"}} onClick={()=>toggleFollow(s.id)}>{followMap[s.id]?"✓ Following":"+ Follow"}</button>}
              </div>
              <p style={{margin:"0 0 4px",fontWeight:700,fontSize:15,color:dark?"#e0e0e0":"#0d1117"}}>{s.pitch_title||s.name}</p>
              <p style={{margin:"0 0 8px",color:dark?"#888":"#666",fontSize:13,lineHeight:1.5}}>{s.bio}</p>
              {s.raise_goal>0&&<FundraisingBar raised={s.raise_raised||0} goal={s.raise_goal} dark={dark}/>}
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
                <button style={S.aBtn} onClick={()=>toggleLike(s.id)}>{likedMap[s.id]?"❤️":"🤍"} {likeCounts[s.id]||s.likes||0}</button>
                <button style={S.aBtn}>👁 {s.views||0}</button>
                {me.role==="investor"&&<button style={{...S.aBtn,marginLeft:"auto",background:"#f0f5ff",color:"#1a6cf5",padding:"6px 14px",borderRadius:20,fontWeight:700}} onClick={()=>{setChatTarget(s);setScreen("chat");}}>💬 Message</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Watch({startup,me,setChatTarget,setScreen}) {
  const [liked,setLiked]=useState(false);
  const src=startup.video_url||"https://www.w3schools.com/html/mov_bbb.mp4";
  return (
    <div style={{padding:16,paddingBottom:40}}>
      <button style={S.back} onClick={()=>setScreen("feed")}>← Back</button>
      <div style={S.card}>
        <video src={src} controls autoPlay style={{width:"100%",display:"block",background:"#000",maxHeight:280}}/>
        <div style={{padding:"16px 20px 20px"}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:12}}><Av src={startup.avatar_url} name={startup.name} size={50}/><div style={{marginLeft:12}}><div style={{fontWeight:700,fontSize:17}}>{startup.name}</div><div style={{color:"#1a6cf5",fontSize:13}}>{ICONS[startup.industry]} {startup.industry}</div></div></div>
          <h2 style={{margin:"0 0 8px",fontSize:19,fontWeight:800}}>{startup.pitch_title}</h2>
          <p style={{color:"#555",lineHeight:1.6,margin:"0 0 10px"}}>{startup.bio}</p>
          {startup.raise_goal>0&&<div style={{marginBottom:14}}><FundraisingBar raised={startup.raise_raised||0} goal={startup.raise_goal}/></div>}
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <button style={S.aBtn} onClick={()=>setLiked(!liked)}>{liked?"❤️":"🤍"} {(startup.likes||0)+(liked?1:0)}</button>
            <button style={S.aBtn}>👁 {startup.views||0}</button>
            {me.role==="investor"&&<button style={{...S.btnP,width:"auto",padding:"9px 20px",fontSize:14,marginLeft:"auto"}} onClick={()=>{setChatTarget(startup);setScreen("chat");}}>💬 Message</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Profile({me,setMe,setWatchTarget,setScreen,setChatTarget,allUsers,notify,dark}) {
  const [editing,setEditing]=useState(false);
  const [editBio,setEditBio]=useState(me.bio||"");
  const [editIndustry,setEditIndustry]=useState(me.industry||"");
  const [editIndustries,setEditIndustries]=useState(me.industries||[]);
  const [editName,setEditName]=useState(me.name||"");
  const [saving,setSaving]=useState(false);
  const [uploadingAvatar,setUploadingAvatar]=useState(false);
  const [editRaiseGoal,setEditRaiseGoal]=useState(me.raise_goal||0);
  const [editRaiseRaised,setEditRaiseRaised]=useState(me.raise_raised||0);
  const avatarRef=useRef();
  const isS=me.role==="startup";
  const investors=allUsers.filter(u=>u.role==="investor");
  function togInd(i){setEditIndustries(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);}
  const wc=countWords(editBio);const wcOk=wc<=250;

  async function saveProfile(){
    if(!editName.trim()){notify("Name required","error");return;}
    if(!wcOk){notify("Bio exceeds 250 words","error");return;}
    setSaving(true);
    const updates={name:editName,bio:editBio,industry:isS?editIndustry:null,industries:!isS?editIndustries:(me.industries||[]),raise_goal:isS?Number(editRaiseGoal)||0:0,raise_raised:isS?Number(editRaiseRaised)||0:0};
    const {error}=await sb.from("profiles").update(updates).eq("id",me.id);
    if(error)notify("❌ Save failed","error");
    else{setMe(m=>({...m,...updates}));notify("Profile updated ✅","success");setEditing(false);}
    setSaving(false);
  }

  async function uploadAvatar(e){
    const file=e.target.files[0];if(!file)return;
    setUploadingAvatar(true);
    const ext=file.name.split(".").pop();
    const path=`${me.id}/avatar.${ext}`;
    const {error:upErr}=await sb.storage.from("avatars").upload(path,file,{contentType:file.type,upsert:true});
    if(upErr){notify("❌ Upload failed","error");setUploadingAvatar(false);return;}
    const {data:urlData}=sb.storage.from("avatars").getPublicUrl(path);
    const newUrl=urlData.publicUrl+"?t="+Date.now();
    await sb.from("profiles").update({avatar_url:newUrl}).eq("id",me.id);
    setMe(m=>({...m,avatar_url:newUrl}));
    notify("Photo updated! 📸","success");
    setUploadingAvatar(false);
  }

  return (
    <div style={{padding:"20px 16px 80px",background:dark?"#0d1117":"#fafafa",minHeight:"100vh"}}>
      <div style={{background:dark?"#161b22":"#fff",borderRadius:18,padding:20,boxShadow:"0 2px 12px rgba(0,0,0,0.05)",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"flex-start",marginBottom:16}}>
          <div style={{position:"relative",flexShrink:0}}>
            <Av src={me.avatar_url} name={me.name} size={80}/>
            <button onClick={()=>avatarRef.current.click()} style={{position:"absolute",bottom:0,right:0,background:"#1a6cf5",border:"2.5px solid #fff",borderRadius:"50%",width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,padding:0}}>
              {uploadingAvatar?<div className="spinner" style={{width:12,height:12,borderWidth:2,borderColor:"rgba(255,255,255,0.3)",borderTopColor:"#fff"}}/>:"📷"}
            </button>
            <input ref={avatarRef} type="file" accept="image/*" style={{display:"none"}} onChange={uploadAvatar}/>
          </div>
          <div style={{marginLeft:14,flex:1}}>
            {!editing?<><h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800}}>{me.name}</h2>{me.firm&&<p style={{margin:"0 0 4px",color:"#1a6cf5",fontWeight:600,fontSize:14}}>{me.firm}</p>}<p style={{margin:"0 0 10px",color:"#666",fontSize:13,lineHeight:1.5}}>{me.bio||"No bio yet."}</p><div style={{display:"flex",flexWrap:"wrap",gap:6}}><span style={{background:"#f5f7fa",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600}}>{isS?"🚀 Startup":"💼 Investor"}</span>{isS&&me.industry&&<span style={{background:"#f0f5ff",color:"#1a6cf5",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600}}>{ICONS[me.industry]} {me.industry}</span>}</div>{isS&&me.raise_goal>0&&<div style={{marginTop:12}}><FundraisingBar raised={me.raise_raised||0} goal={me.raise_goal}/></div>}</>
            :<input style={{...S.inp,marginBottom:8,fontSize:15,fontWeight:700}} value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Your name"/>}
          </div>
        </div>
        {editing&&<><div style={{position:"relative",marginBottom:8}}><textarea style={{...S.inp,height:90,resize:"none",paddingBottom:24,borderColor:!wcOk?"#ff3b30":undefined}} placeholder="Bio (max 250 words)" value={editBio} onChange={e=>{if(countWords(e.target.value)<=255)setEditBio(e.target.value);}}/><span style={{position:"absolute",bottom:9,right:12,fontSize:11,color:!wcOk?"#ff3b30":wc>220?"#ff9500":"#bbb"}}>{wc}/250</span></div>{isS&&<><p style={{margin:"4px 0 8px",fontWeight:600,fontSize:13}}>Industry</p><div style={{...S.indGrid,maxHeight:160,marginBottom:12}}>{INDUSTRIES.map(ind=>(<div key={ind} style={{...S.iChip,...(editIndustry===ind?S.iChipOn:{})}} onClick={()=>setEditIndustry(ind)}>{ICONS[ind]} {ind}</div>))}</div></>}{!isS&&<><p style={{margin:"4px 0 8px",fontWeight:600,fontSize:13}}>Industries you invest in</p><div style={{...S.indGrid,maxHeight:160,marginBottom:12}}>{INDUSTRIES.map(ind=>(<div key={ind} style={{...S.iChip,...(editIndustries.includes(ind)?S.iChipOn:{})}} onClick={()=>togInd(ind)}>{ICONS[ind]} {ind}</div>))}</div></>}<div style={{display:"flex",gap:10}}><button style={{...S.btnG,flex:1}} onClick={()=>{setEditing(false);setEditName(me.name);setEditBio(me.bio||"");setEditIndustry(me.industry||"");setEditIndustries(me.industries||[]);}}>Cancel</button><button style={{...S.btnP,flex:2,opacity:saving?0.7:1}} disabled={saving} onClick={saveProfile}>{saving?"Saving…":"Save Changes ✅"}</button></div></>}
        {!editing&&<div style={{display:"flex",gap:10,marginTop:8}}><button style={{...S.btnG,flex:2,padding:"9px 0",fontSize:13}} onClick={()=>setEditing(true)}>✏️ Edit Profile</button>{!isS&&<button style={{...S.btnG,flex:1,padding:"9px 0",fontSize:13}} onClick={()=>setScreen("dashboard")}>📊 Dashboard</button>}</div>}
      </div>
      {isS&&<><h3 style={S.secT}>My Pitch</h3><div style={{...S.card,marginBottom:20,cursor:"pointer"}} onClick={()=>{setWatchTarget(me);setScreen("watch");}}><img src={me.video_thumb||`https://picsum.photos/seed/${me.id}/400/220`} alt="pitch" style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block"}}/><div style={{padding:"12px 16px"}}><p style={{margin:0,fontWeight:700}}>{me.pitch_title||"My Pitch"}</p></div></div><h3 style={S.secT}>Find Investors</h3>{investors.map(inv=>(<div key={inv.id} style={{...S.card,padding:"14px 16px",display:"flex",alignItems:"center",marginBottom:10}}><Av src={inv.avatar_url} name={inv.name} size={48}/><div style={{marginLeft:12,flex:1}}><div style={{fontWeight:700}}>{inv.name}</div>{inv.firm&&<div style={{color:"#1a6cf5",fontSize:13}}>{inv.firm}</div>}<div style={{color:"#aaa",fontSize:12,marginTop:2}}>{inv.industries?.map(i=>ICONS[i]).join(" ")}</div></div><button style={S.smBtn} onClick={()=>{setChatTarget(inv);setScreen("chat");}}>Message</button></div>))}</>}
      {!isS&&<><h3 style={S.secT}>Your focus areas</h3><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{me.industries?.map(ind=>(<span key={ind} style={{background:"#f0f5ff",color:"#1a6cf5",borderRadius:20,padding:"6px 14px",fontSize:13,fontWeight:600}}>{ICONS[ind]} {ind}</span>))}</div></>}
    </div>
  );
}

function Inbox({peers,me,messages,setChatTarget,setScreen,allUsers}) {
  function lastMsg(pid){return messages.filter(m=>(m.from_id===me.id&&m.to_id===pid)||(m.from_id===pid&&m.to_id===me.id)).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];}
  const suggestions=(me.role==="investor"?allUsers.filter(u=>u.role==="startup"):allUsers.filter(u=>u.role==="investor")).filter(u=>!peers.find(p=>p.id===u.id)).slice(0,3);
  return (
    <div style={{padding:"20px 16px 80px"}}>
      <h2 style={{margin:"0 0 16px",fontSize:22,fontWeight:800}}>Messages</h2>
      {peers.length===0&&<p style={{textAlign:"center",color:"#ccc",padding:"40px 0"}}>No conversations yet.</p>}
      {peers.map(peer=>{const lm=lastMsg(peer.id);const ur=messages.filter(m=>m.from_id===peer.id&&m.to_id===me.id&&!m.read).length;return(<div key={peer.id} style={{...S.card,padding:"14px 16px",display:"flex",alignItems:"center",marginBottom:10,cursor:"pointer"}} onClick={()=>{setChatTarget(peer);setScreen("chat");}}><Av src={peer.avatar_url} name={peer.name} size={48}/><div style={{marginLeft:12,flex:1,minWidth:0}}><div style={{fontWeight:ur?700:500}}>{peer.name}</div><div style={{color:"#aaa",fontSize:13,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{lm?lm.text:"Start chatting"}</div></div><div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0,marginLeft:8}}>{lm&&<span style={{fontSize:11,color:"#ccc"}}>{timeAgo(lm.created_at)}</span>}{ur>0&&<span style={{background:"#1a6cf5",color:"#fff",borderRadius:10,padding:"2px 7px",fontSize:11,fontWeight:700}}>{ur}</span>}</div></div>);})}
      {suggestions.length>0&&<><h3 style={{...S.secT,marginTop:24}}>{me.role==="investor"?"Startups to explore":"Investors to connect"}</h3>{suggestions.map(u=>(<div key={u.id} style={{...S.card,padding:"14px 16px",display:"flex",alignItems:"center",marginBottom:10,opacity:0.8}}><Av src={u.avatar_url} name={u.name} size={44}/><div style={{marginLeft:12,flex:1}}><div style={{fontWeight:600}}>{u.name}</div><div style={{color:"#aaa",fontSize:12}}>{u.industry||u.industries?.join(", ")}</div></div><button style={S.smBtn} onClick={()=>{setChatTarget(u);setScreen("chat");}}>Message</button></div>))}</>}
    </div>
  );
}

function Chat({me,peer,convo,sendMsg,setScreen}) {
  const [text,setText]=useState("");const [sending,setSending]=useState(false);const btm=useRef();
  useEffect(()=>{btm.current?.scrollIntoView({behavior:"smooth"});},[convo]);
  async function send(){if(!text.trim()||sending)return;setSending(true);await sendMsg(peer.id,text.trim());setText("");setSending(false);}
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 62px)"}}>
      <div style={{display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid #f0f0f0",background:"#fff"}}><button style={S.back} onClick={()=>setScreen("messages")}>←</button><Av src={peer.avatar_url} name={peer.name} size={38}/><div style={{marginLeft:10}}><div style={{fontWeight:700}}>{peer.name}</div><div style={{fontSize:12,color:"#aaa"}}>{peer.role==="startup"?peer.industry:peer.firm}</div></div></div>
      <div style={{flex:1,overflowY:"auto",padding:16,background:"#fafafa"}}>
        {convo.length===0&&<p style={{textAlign:"center",color:"#ccc",paddingTop:40}}>Say hello! 👋</p>}
        {convo.map(msg=>{const isMe=msg.from_id===me.id;return(<div key={msg.id} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start",marginBottom:10}}><div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:18,...(isMe?{background:"#1a6cf5",color:"#fff",borderBottomRightRadius:4}:{background:"#fff",color:"#0d1117",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",borderBottomLeftRadius:4})}}><p style={{margin:0,lineHeight:1.5,fontSize:14}}>{msg.text}</p><span style={{fontSize:10,opacity:0.6,display:"block",textAlign:"right",marginTop:4}}>{timeAgo(msg.created_at)}</span></div></div>);})}
        <div ref={btm}/>
      </div>
      <div style={{display:"flex",gap:10,padding:"12px 16px",background:"#fff",borderTop:"1px solid #f0f0f0"}}><input style={{...S.inp,borderRadius:24,flex:1}} placeholder={`Message ${peer.name}…`} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button style={{background:sending?"#aaa":"#1a6cf5",color:"#fff",border:"none",borderRadius:24,padding:"0 20px",fontSize:18,cursor:"pointer"}} onClick={send}>➤</button></div>
    </div>
  );
}

// ─── COMMUNITY ────────────────────────────────────────────────────────────────
function Community({me,allUsers,notify}) {
  const [tab,setTab]=useState(me.role==="investor"?"investors":"startups");
  const [posts,setPosts]=useState([]);const [loading,setLoading]=useState(true);const [showNew,setShowNew]=useState(false);const [newTitle,setNewTitle]=useState("");const [newBody,setNewBody]=useState("");const [posting,setPosting]=useState(false);const [upvotedMap,setUpvotedMap]=useState({});const [upvoteCounts,setUpvoteCounts]=useState({});const [openPost,setOpenPost]=useState(null);
  useEffect(()=>{loadPosts();},[tab]);
  async function loadPosts(){setLoading(true);const {data}=await sb.from("posts").select("*").eq("community",tab).order("created_at",{ascending:false});const ps=data||[];setPosts(ps);if(ps.length){const ids=ps.map(p=>p.id);sb.from("post_upvotes").select("post_id").in("post_id",ids).then(({data:uv})=>{const c={};(uv||[]).forEach(u=>{c[u.post_id]=(c[u.post_id]||0)+1;});setUpvoteCounts(c);});sb.from("post_upvotes").select("post_id").eq("user_id",me.id).in("post_id",ids).then(({data:uv})=>{const m={};(uv||[]).forEach(u=>{m[u.post_id]=true;});setUpvotedMap(m);});}setLoading(false);}
  async function submitPost(){if(!newTitle.trim()||!newBody.trim()){notify("Fill in title and body","error");return;}setPosting(true);const {error}=await sb.from("posts").insert({author_id:me.id,community:tab,title:newTitle,body:newBody});if(error)notify("❌ Post failed","error");else{notify("Posted! 🎉","success");setNewTitle("");setNewBody("");setShowNew(false);loadPosts();}setPosting(false);}
  async function toggleUpvote(postId){const isUp=upvotedMap[postId];setUpvotedMap(m=>({...m,[postId]:!isUp}));setUpvoteCounts(c=>({...c,[postId]:(c[postId]||0)+(isUp?-1:1)}));if(isUp)await sb.from("post_upvotes").delete().eq("user_id",me.id).eq("post_id",postId);else await sb.from("post_upvotes").insert({user_id:me.id,post_id:postId});}
  const getAuthor=(id)=>allUsers.find(u=>u.id===id);
  const canPost=(tab==="investors"&&me.role==="investor")||(tab==="startups"&&me.role==="startup");
  if(openPost) return <PostDetail post={openPost} me={me} allUsers={allUsers} onBack={()=>{setOpenPost(null);loadPosts();}} notify={notify} upvoted={upvotedMap[openPost.id]} upvoteCount={upvoteCounts[openPost.id]||0} toggleUpvote={toggleUpvote}/>;
  return (
    <div style={{paddingBottom:80}}>
      <div style={{background:"linear-gradient(135deg,#1a6cf5,#0d4fc4)",padding:"20px 16px 16px",color:"#fff"}}><h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800}}>🌐 Community</h2><p style={{margin:0,fontSize:13,opacity:0.8}}>Connect with your peers</p></div>
      <div style={{display:"flex",borderBottom:"2px solid #f0f0f0",background:"#fff"}}>{["investors","startups"].map(t=>(<button key={t} style={{flex:1,padding:"14px 0",border:"none",background:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,color:tab===t?"#1a6cf5":"#aaa",borderBottom:tab===t?"3px solid #1a6cf5":"3px solid transparent"}} onClick={()=>setTab(t)}>{t==="investors"?"💼 Investors":"🚀 Startups"}</button>))}</div>
      <div style={{padding:"16px 14px"}}>
        <div style={{background:"#f0f5ff",borderRadius:14,padding:"12px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:28}}>{tab==="investors"?"💼":"🚀"}</span><div><div style={{fontWeight:700,fontSize:14}}>{tab==="investors"?"Investor Hub":"Founder Space"}</div><div style={{color:"#666",fontSize:12}}>{tab==="investors"?"Share insights, ask questions, connect":"Share learnings, find co-founders, get support"}</div></div></div>
        {canPost&&!showNew&&<button style={{...S.btnP,marginBottom:16}} onClick={()=>setShowNew(true)}>✏️ Create Post</button>}
        {!canPost&&<div style={{background:"#fff8f0",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#ff9500",textAlign:"center"}}>👀 You can post in the {me.role==="investor"?"Investor":"Startup"} community tab.</div>}
        {showNew&&(<div style={{background:"#fff",borderRadius:16,padding:16,boxShadow:"0 2px 14px rgba(0,0,0,0.06)",marginBottom:16}}><h3 style={{margin:"0 0 12px",fontSize:16,fontWeight:800}}>New Post</h3><input style={{...S.inp,marginBottom:10}} placeholder="Title *" value={newTitle} onChange={e=>setNewTitle(e.target.value)}/><textarea style={{...S.inp,height:100,resize:"none",marginBottom:10}} placeholder="Share your thoughts…" value={newBody} onChange={e=>setNewBody(e.target.value)}/><div style={{display:"flex",gap:10}}><button style={{...S.btnG,flex:1}} onClick={()=>{setShowNew(false);setNewTitle("");setNewBody("");}}>Cancel</button><button style={{...S.btnP,flex:2,opacity:posting?0.7:1}} disabled={posting} onClick={submitPost}>{posting?"Posting…":"Post 🚀"}</button></div></div>)}
        {loading&&<Spinner/>}
        {!loading&&posts.length===0&&<p style={{textAlign:"center",color:"#ccc",padding:"40px 0"}}>No posts yet. Be the first! 🌟</p>}
        {!loading&&posts.map(post=>{const author=getAuthor(post.author_id);return(<div key={post.id} style={{background:dark?"#161b22":"#fff",borderRadius:16,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:12,overflow:"hidden"}}><div style={{padding:"14px 16px",cursor:"pointer"}} onClick={()=>setOpenPost(post)}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Av src={author?.avatar_url} name={author?.name||"?"} size={32}/><div><div style={{fontWeight:600,fontSize:13}}>{author?.name||"Unknown"}</div><div style={{color:"#bbb",fontSize:11}}>{timeAgo(post.created_at)}</div></div></div><h3 style={{margin:"0 0 6px",fontSize:15,fontWeight:700,color:dark?"#e0e0e0":"#0d1117"}}>{post.title}</h3><p style={{margin:0,color:dark?"#888":"#666",fontSize:13,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.body}</p></div><div style={{display:"flex",gap:8,padding:"8px 16px 12px",borderTop:"1px solid #f5f5f5"}}><button style={{display:"flex",alignItems:"center",gap:5,background:upvotedMap[post.id]?"#f0f5ff":"#f5f7fa",border:upvotedMap[post.id]?"1.5px solid #1a6cf5":"1.5px solid #eee",borderRadius:20,padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,color:upvotedMap[post.id]?"#1a6cf5":"#666"}} onClick={()=>toggleUpvote(post.id)}>▲ {upvoteCounts[post.id]||0}</button><button style={{display:"flex",alignItems:"center",gap:5,background:"#f5f7fa",border:"1.5px solid #eee",borderRadius:20,padding:"5px 12px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#666"}} onClick={()=>setOpenPost(post)}>💬 Comments</button></div></div>);})}
      </div>
    </div>
  );
}

function PostDetail({post,me,allUsers,onBack,notify,upvoted,upvoteCount,toggleUpvote}) {
  const [comments,setComments]=useState([]);const [newComment,setNewComment]=useState("");const [posting,setPosting]=useState(false);
  const author=allUsers.find(u=>u.id===post.author_id);
  useEffect(()=>{sb.from("comments").select("*").eq("post_id",post.id).order("created_at",{ascending:true}).then(({data})=>setComments(data||[]));},[post.id]);
  async function submitComment(){if(!newComment.trim())return;setPosting(true);const {data,error}=await sb.from("comments").insert({post_id:post.id,author_id:me.id,body:newComment}).select().single();if(error)notify("❌ Comment failed","error");else{setComments(p=>[...p,data]);setNewComment("");}setPosting(false);}
  return (
    <div style={{paddingBottom:80}}>
      <div style={{background:"#fff",borderBottom:"1px solid #f0f0f0",padding:"12px 16px",display:"flex",alignItems:"center",gap:8,position:"sticky",top:0,zIndex:10}}><button style={{...S.back,padding:0,marginRight:4}} onClick={onBack}>←</button><span style={{fontWeight:700,fontSize:15}}>Post</span></div>
      <div style={{padding:"16px 14px"}}>
        <div style={{background:"#fff",borderRadius:16,padding:16,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><Av src={author?.avatar_url} name={author?.name||"?"} size={36}/><div><div style={{fontWeight:700}}>{author?.name}</div><div style={{color:"#bbb",fontSize:11}}>{timeAgo(post.created_at)}</div></div></div><h2 style={{margin:"0 0 10px",fontSize:18,fontWeight:800,lineHeight:1.3}}>{post.title}</h2><p style={{margin:"0 0 14px",color:"#555",lineHeight:1.65,fontSize:14}}>{post.body}</p><button style={{display:"flex",alignItems:"center",gap:6,background:upvoted?"#f0f5ff":"#f5f7fa",border:upvoted?"1.5px solid #1a6cf5":"1.5px solid #eee",borderRadius:20,padding:"6px 14px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,color:upvoted?"#1a6cf5":"#666"}} onClick={()=>toggleUpvote(post.id)}>▲ {upvoteCount} Upvotes</button></div>
        <h3 style={{...S.secT,marginBottom:14}}>💬 {comments.length} Comments</h3>
        {comments.map(c=>{const ca=allUsers.find(u=>u.id===c.author_id);return(<div key={c.id} style={{display:"flex",gap:10,marginBottom:14}}><Av src={ca?.avatar_url} name={ca?.name||"?"} size={32}/><div style={{flex:1,background:"#fff",borderRadius:14,padding:"10px 14px",boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontWeight:700,fontSize:13}}>{ca?.name}</span><span style={{color:"#bbb",fontSize:11}}>{timeAgo(c.created_at)}</span></div><p style={{margin:0,fontSize:13,lineHeight:1.55,color:"#444"}}>{c.body}</p></div></div>);})}
        {comments.length===0&&<p style={{textAlign:"center",color:"#ccc",padding:"20px 0"}}>No comments yet. Start the discussion!</p>}
        <div style={{display:"flex",gap:10,marginTop:8}}><Av src={me.avatar_url} name={me.name} size={36}/><div style={{flex:1,display:"flex",gap:8}}><input style={{...S.inp,borderRadius:24,flex:1}} placeholder="Add a comment…" value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitComment()}/><button style={{background:posting?"#aaa":"#1a6cf5",color:"#fff",border:"none",borderRadius:24,padding:"0 16px",fontSize:16,cursor:"pointer"}} onClick={submitComment}>➤</button></div></div>
      </div>
    </div>
  );
}

// ─── NEWS PAGE ────────────────────────────────────────────────────────────────
function NewsPage({dark=false}) {
  const [tab, setTab] = useState("politics");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const tabs = [
    { id:"politics", label:"🌍 Politics", q:"international politics world" },
    { id:"tech",     label:"🤖 Tech & AI", q:"artificial intelligence technology" },
    { id:"finance",  label:"💰 Finance",   q:"financial markets economy stocks" },
    { id:"startup",  label:"🚀 Startups",  q:"startup venture capital funding" },
  ];

  useEffect(() => { fetchNews(); }, [tab]);

  async function fetchNews() {
    setLoading(true);
    const current = tabs.find(t=>t.id===tab);
    try {
      // GNews API — works from browser (no CORS issues)
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(current.q)}&lang=en&max=15&sortby=publishedAt&apikey=pub_65d14e2b8e3f4a1c9d7b2f0e8a3c6d4f`
      );
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles.filter(a=>a.title&&a.image));
        setLastUpdated(new Date());
      } else {
        // Fallback: use RSS via allorigins proxy
        await fetchRSS(current);
      }
    } catch(e) {
      await fetchRSS(current);
    }
    setLoading(false);
  }

  async function fetchRSS(current) {
    const feedMap = {
      politics: [
        "https://feeds.bbci.co.uk/news/world/rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
      ],
      tech: [
        "https://feeds.feedburner.com/TechCrunch",
        "https://www.wired.com/feed/rss",
      ],
      finance: [
        "https://feeds.marketwatch.com/marketwatch/topstories/",
        "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
        "https://www.cnbc.com/id/10000664/device/rss/rss.html",
      ],
      startup: [
        "https://techcrunch.com/category/startups/feed/",
        "https://feeds.feedburner.com/venturebeat/SZYF",
        "https://www.entrepreneur.com/latest.rss",
      ],
    };
    const feedList = feedMap[current.id] || feedMap.politics;
    for (const feed of feedList) {
      try {
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent(feed)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data.contents) continue;
        const parser = new window.DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const items = Array.from(xml.querySelectorAll("item")).slice(0,15);
        if (items.length === 0) continue;
        const sourceName = xml.querySelector("channel > title")?.textContent || "News";
        const parsed = items.map((item,idx) => {
          const encImg = item.querySelector("enclosure")?.getAttribute("url");
          const descHtml = item.querySelector("description")?.textContent || "";
          const imgMatch = descHtml.match(/<img[^>]+src=["'](https?:[^"\']+)["\']/);
          const descImg = imgMatch ? imgMatch[1] : null;
          return {
            title: item.querySelector("title")?.textContent?.replace(/<!\[CDATA\[|\]\]>/g,"").trim() || "",
            description: descHtml.replace(/<[^>]+>/g,"").trim(),
            url: item.querySelector("link")?.textContent?.trim() || "#",
            image: encImg || descImg || `https://picsum.photos/seed/${current.id}${idx}/400/220`,
            source: { name: sourceName },
            publishedAt: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
          };
        }).filter(a => a.title && a.title.length > 5);
        if (parsed.length > 0) {
          setArticles(parsed);
          setLastUpdated(new Date());
          return;
        }
      } catch(e) { continue; }
    }
    setArticles([]);
  }

  function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
  }

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0d1117,#1a2744)",padding:"20px 16px 16px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800}}>📰 News</h2>
            <p style={{margin:0,fontSize:12,opacity:0.6}}>
              {lastUpdated?"Updated "+lastUpdated.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}):"Loading…"}
            </p>
          </div>
          <button style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={fetchNews}>🔄 Refresh</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",overflowX:"auto",background:"#fff",borderBottom:"2px solid #f0f0f0",scrollbarWidth:"none"}}>
        {tabs.map(t=>(
          <button key={t.id} style={{flexShrink:0,padding:"12px 16px",border:"none",background:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,color:tab===t.id?"#1a6cf5":"#aaa",borderBottom:tab===t.id?"3px solid #1a6cf5":"3px solid transparent",whiteSpace:"nowrap"}} onClick={()=>setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div style={{padding:"14px 14px"}}>
        {loading && <Spinner/>}
        {!loading && articles.length===0 && (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <p style={{fontSize:32,margin:"0 0 12px"}}>📭</p>
            <p style={{color:"#aaa",fontSize:14}}>No articles found right now.</p>
            <button style={{...S.btnP,width:"auto",padding:"10px 24px",marginTop:8}} onClick={fetchNews}>Try Again</button>
          </div>
        )}
        {!loading && articles.length>0 && <>
          {/* Featured article */}
          <a href={articles[0].url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}>
            <div style={{...S.card,...(dark?DK.card:{}),marginBottom:14,cursor:"pointer"}} className="card">
              <div style={{position:"relative"}}>
                <img src={articles[0].image||articles[0].urlToImage} alt={articles[0].title} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover",display:"block"}} onError={e=>e.target.style.display="none"}/>
                <div style={{position:"absolute",top:10,left:10,background:"#1a6cf5",color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700}}>⭐ TOP STORY</div>
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <span style={{background:"#f0f5ff",color:"#1a6cf5",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700}}>{articles[0].source?.name}</span>
                  <span style={{color:"#bbb",fontSize:11}}>{formatDate(articles[0].publishedAt)}</span>
                </div>
                <h3 style={{margin:"0 0 8px",fontSize:16,fontWeight:800,lineHeight:1.4,color:dark?"#e0e0e0":"#0d1117"}}>{articles[0].title}</h3>
                <p style={{margin:0,color:dark?"#888":"#666",fontSize:13,lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{articles[0].description}</p>
              </div>
            </div>
          </a>
          {/* Rest of articles */}
          {articles.slice(1).map((article,i)=>(
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit"}}>
              <div style={{background:dark?"#161b22":"#fff",borderRadius:14,boxShadow:"0 1px 8px rgba(0,0,0,0.05)",marginBottom:10,display:"flex",gap:12,padding:12,cursor:"pointer",overflow:"hidden"}} className="card">
                {(article.image||article.urlToImage)&&<img src={article.image||article.urlToImage} alt={article.title} style={{width:80,height:80,objectFit:"cover",borderRadius:10,flexShrink:0}} onError={e=>e.target.style.display="none"}/>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <span style={{color:"#1a6cf5",fontSize:11,fontWeight:700}}>{article.source?.name}</span>
                    <span style={{color:"#ddd",fontSize:10}}>·</span>
                    <span style={{color:"#bbb",fontSize:11}}>{formatDate(article.publishedAt)}</span>
                  </div>
                  <p style={{margin:0,fontWeight:700,fontSize:13,lineHeight:1.4,color:dark?"#e0e0e0":"#0d1117",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{article.title}</p>
                </div>
              </div>
            </a>
          ))}
        </>}
      </div>
    </div>
  );
}

// ─── STOCKS PAGE ──────────────────────────────────────────────────────────────
function StocksPage({dark=false}) {
  const INDICES = [
    { symbol:"SPY",  name:"S&P 500",    icon:"🇺🇸", color:"#1a6cf5" },
    { symbol:"QQQ",  name:"Nasdaq 100", icon:"💻", color:"#7c3aed" },
    { symbol:"DIA",  name:"Dow Jones",  icon:"🏭", color:"#0891b2" },
  ];
  const WATCHLIST = [
    { symbol:"AAPL",  name:"Apple",       icon:"🍎" },
    { symbol:"MSFT",  name:"Microsoft",   icon:"🪟" },
    { symbol:"GOOGL", name:"Alphabet",    icon:"🔍" },
    { symbol:"AMZN",  name:"Amazon",      icon:"📦" },
    { symbol:"NVDA",  name:"NVIDIA",      icon:"🎮" },
    { symbol:"TSLA",  name:"Tesla",       icon:"🚗" },
    { symbol:"META",  name:"Meta",        icon:"👁️" },
    { symbol:"NFLX",  name:"Netflix",     icon:"🎬" },
  ];

  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [marketStatus, setMarketStatus] = useState(null);

  const allSymbols = [...INDICES.map(i=>i.symbol), ...WATCHLIST.map(w=>w.symbol)];

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    try {
      // Fetch market status
      const msRes = await fetch(`https://finnhub.io/api/v1/stock/market-status?exchange=US&token=${FINNHUB_KEY}`);
      const msData = await msRes.json();
      setMarketStatus(msData);

      // Fetch all quotes in parallel
      const results = await Promise.all(
        allSymbols.map(sym =>
          fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${FINNHUB_KEY}`)
            .then(r=>r.json())
            .then(d=>({symbol:sym, ...d}))
            .catch(()=>({symbol:sym}))
        )
      );
      const map = {};
      results.forEach(r => { map[r.symbol] = r; });
      setQuotes(map);
      setLastUpdated(new Date());
    } catch(e) {}
    setLoading(false);
  }

  function pct(q) {
    if(!q||!q.pc||!q.c) return 0;
    return ((q.c - q.pc) / q.pc * 100);
  }
  function isUp(q) { return pct(q) >= 0; }
  function fmtPct(q) { const p=pct(q); return (p>=0?"+":"")+p.toFixed(2)+"%"; }
  function fmtPrice(q) { return q?.c ? "$"+q.c.toFixed(2) : "—"; }

  return (
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0d1117,#0a2540)",padding:"20px 16px 16px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800}}>📈 Markets</h2>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {marketStatus&&<span style={{background:marketStatus.isOpen?"rgba(52,199,89,0.2)":"rgba(255,59,48,0.2)",color:marketStatus.isOpen?"#34c759":"#ff6b6b",borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:700}}>● {marketStatus.isOpen?"Market Open":"Market Closed"}</span>}
              {lastUpdated&&<span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>Updated {lastUpdated.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>}
            </div>
          </div>
          <button style={{background:"rgba(255,255,255,0.12)",border:"none",color:"#fff",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={fetchAll}>🔄 Refresh</button>
        </div>
      </div>

      <div style={{padding:"16px 14px"}}>
        {loading && <Spinner/>}
        {!loading && <>
          {/* Major Indices */}
          <h3 style={{...S.secT,marginBottom:12}}>Major Indices</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
            {INDICES.map(idx=>{
              const q=quotes[idx.symbol];
              const up=isUp(q);
              return (
                <div key={idx.symbol} style={{background:dark?"#161b22":"#fff",borderRadius:16,padding:"16px 18px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",display:"flex",alignItems:"center"}}>
                  <div style={{width:46,height:46,borderRadius:14,background:idx.color+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{idx.icon}</div>
                  <div style={{marginLeft:14,flex:1}}>
                    <div style={{fontWeight:800,fontSize:16,color:"#0d1117"}}>{idx.name}</div>
                    <div style={{color:"#aaa",fontSize:12,marginTop:2}}>{idx.symbol}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:800,fontSize:18,color:dark?"#e0e0e0":"#0d1117"}}>{fmtPrice(q)}</div>
                    <div style={{fontSize:13,fontWeight:700,color:up?"#34c759":"#ff3b30",marginTop:2}}>
                      {up?"▲":"▼"} {fmtPct(q)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Watchlist */}
          <h3 style={{...S.secT,marginBottom:12}}>Top Stocks</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {WATCHLIST.map(stock=>{
              const q=quotes[stock.symbol];
              const up=isUp(q);
              return (
                <div key={stock.symbol} style={{background:dark?"#161b22":"#fff",borderRadius:14,padding:"14px",boxShadow:"0 2px 10px rgba(0,0,0,0.05)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:20}}>{stock.icon}</span>
                    <div>
                      <div style={{fontWeight:800,fontSize:13,color:dark?"#e0e0e0":"#0d1117"}}>{stock.symbol}</div>
                      <div style={{color:dark?"#666":"#bbb",fontSize:10}}>{stock.name}</div>
                    </div>
                  </div>
                  <div style={{fontWeight:800,fontSize:17,color:dark?"#e0e0e0":"#0d1117",marginBottom:2}}>{fmtPrice(q)}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:4,background:up?"#e8f5e9":"#fff0f0",borderRadius:8,padding:"3px 8px"}}>
                    <span style={{fontSize:10,fontWeight:800,color:up?"#34c759":"#ff3b30"}}>{up?"▲":"▼"} {fmtPct(q)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div style={{marginTop:20,padding:"10px 14px",background:"#f5f7fa",borderRadius:12,fontSize:11,color:"#bbb",textAlign:"center",lineHeight:1.6}}>
            Data provided by Finnhub · Prices may be delayed 15 mins · Not financial advice
          </div>
        </>}
      </div>
    </div>
  );
}

// ─── FUNDRAISING BAR ─────────────────────────────────────────────────────────

) {
  const pct = Math.min(Math.round((raised/goal)*100),100);
  const fmtM = v => v>=1000000?`$${(v/1000000).toFixed(1)}M`:v>=1000?`$${(v/1000).toFixed(0)}K`:`$${v}`;
  return (
    <div style={{marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:12,fontWeight:700,color:"#1a6cf5"}}>💰 Raising {fmtM(goal)}</span>
        <span style={{fontSize:12,fontWeight:700,color:pct>=100?"#34c759":"#ff9500"}}>{pct}% funded</span>
      </div>
      <div style={{height:8,borderRadius:8,background:dark?"#2a2a2a":"#e8edf5",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:8,background:pct>=100?"#34c759":pct>=50?"#1a6cf5":"#ff9500",transition:"width .6s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        <span style={{fontSize:11,color:dark?"#888":"#aaa"}}>Raised: {fmtM(raised)}</span>
        <span style={{fontSize:11,color:dark?"#888":"#aaa"}}>Goal: {fmtM(goal)}</span>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({notifications,setNotifications,allUsers,dark,setScreen,setChatTarget}) {
  const D = dark ? DK : {};
  function markAllRead(){setNotifications(n=>n.map(x=>({...x,read:true})));}
  function getUser(id){return allUsers.find(u=>u.id===id);}
  const icons={follow:"👥",message:"💬",like:"❤️",system:"🔔"};
  return (
    <div style={{paddingBottom:80,...D.app}}>
      <div style={{background:"linear-gradient(135deg,#7c3aed,#4f1fa8)",padding:"20px 16px 16px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:800}}>🔔 Notifications</h2><p style={{margin:0,fontSize:12,opacity:0.7}}>{notifications.filter(n=>!n.read).length} unread</p></div>
          {notifications.length>0&&<button style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={markAllRead}>Mark all read</button>}
        </div>
      </div>
      <div style={{padding:"14px 14px"}}>
        {notifications.length===0&&(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <p style={{fontSize:40,margin:"0 0 12px"}}>🔕</p>
            <p style={{color:dark?"#666":"#aaa",fontSize:14}}>No notifications yet.</p>
            <p style={{color:dark?"#555":"#bbb",fontSize:12}}>When investors follow you or message you, you'll see it here.</p>
          </div>
        )}
        {notifications.map((n,i)=>(
          <div key={n.id||i} onClick={()=>{setNotifications(ns=>ns.map((x,j)=>j===i?{...x,read:true}:x));}} style={{background:n.read?(dark?"#1a1a1a":"#fafafa"):(dark?"#1e2340":"#f0f5ff"),borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12,cursor:"pointer",border:`1px solid ${n.read?(dark?"#2a2a2a":"#eee"):"#c7d9ff"}`,transition:"all .2s"}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:n.read?(dark?"#2a2a2a":"#e8edf5"):"#dce8ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
              {icons[n.type]||"🔔"}
            </div>
            <div style={{flex:1}}>
              <p style={{margin:"0 0 3px",fontSize:14,fontWeight:n.read?500:700,color:dark?"#e0e0e0":"#0d1117"}}>{n.text}</p>
              <p style={{margin:0,fontSize:11,color:dark?"#666":"#bbb"}}>{timeAgo(n.ts)}</p>
            </div>
            {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#1a6cf5",flexShrink:0}}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INVESTOR DASHBOARD ───────────────────────────────────────────────────────
function InvestorDashboard({me,allUsers,messages,dark,setScreen,setChatTarget}) {
  const D = dark ? DK : {};
  const startups = allUsers.filter(u=>u.role==="startup");
  const [followedIds,setFollowedIds] = useState([]);
  useEffect(()=>{sb.from("follows").select("following_id").eq("follower_id",me.id).then(({data})=>setFollowedIds((data||[]).map(f=>f.following_id)));},[me.id]);

  const myMsgPeers = [...new Set(messages.filter(m=>m.from_id===me.id||m.to_id===me.id).map(m=>m.from_id===me.id?m.to_id:m.from_id))];
  const contacted = myMsgPeers.filter(id=>startups.find(s=>s.id===id)).length;
  const followed = followedIds.length;
  const totalViews = startups.reduce((a,s)=>a+(s.views||0),0);
  const recentStartups = [...startups].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5);
  const followedStartups = startups.filter(s=>followedIds.includes(s.id));
  const industryMatch = startups.filter(s=>me.industries?.includes(s.industry));

  const statCards = [
    {icon:"👥",label:"Following",value:followed,color:"#1a6cf5"},
    {icon:"💬",label:"Contacted",value:contacted,color:"#7c3aed"},
    {icon:"🏭",label:"My Industries",value:me.industries?.length||0,color:"#0891b2"},
    {icon:"🔍",label:"Matches",value:industryMatch.length,color:"#34c759"},
  ];

  function fmtM(v){return v>=1000000?`$${(v/1000000).toFixed(1)}M`:v>=1000?`$${(v/1000).toFixed(0)}K`:`$${v}`;}

  return (
    <div style={{paddingBottom:80,...D.app}}>
      <div style={{background:"linear-gradient(135deg,#0d1117,#1a2744)",padding:"20px 16px 20px",color:"#fff"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{width:56,height:56,borderRadius:16,overflow:"hidden",border:"2px solid rgba(255,255,255,0.2)"}}><img src={me.avatar_url} alt={me.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
          <div>
            <h2 style={{margin:"0 0 2px",fontSize:19,fontWeight:800}}>{me.name}</h2>
            <p style={{margin:0,fontSize:12,opacity:0.7}}>💼 {me.firm||"Independent Investor"}</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {statCards.map(c=>(
            <div key={c.label} style={{background:"rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 16px",backdropFilter:"blur(8px)"}}>
              <div style={{fontSize:22,marginBottom:4}}>{c.icon}</div>
              <div style={{fontSize:24,fontWeight:800,color:"#fff"}}>{c.value}</div>
              <div style={{fontSize:12,opacity:0.7}}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 14px"}}>
        {/* Industry Focus */}
        <div style={{...D.card,background:dark?"#1a1a1a":"#fff",borderRadius:16,padding:"16px",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:16}}>
          <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:800,color:dark?"#e0e0e0":"#0d1117"}}>🎯 Your Investment Focus</h3>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {(me.industries||[]).map(ind=>(
              <span key={ind} style={{background:"#f0f5ff",color:"#1a6cf5",borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700}}>{ICONS[ind]} {ind}</span>
            ))}
            {(!me.industries||me.industries.length===0)&&<p style={{color:dark?"#555":"#bbb",fontSize:13}}>No industries set — update your profile.</p>}
          </div>
        </div>

        {/* Followed Startups */}
        {followedStartups.length>0&&<>
          <h3 style={{...S.secT,color:dark?"#e0e0e0":"#0d1117",marginBottom:12}}>⭐ Startups You Follow</h3>
          {followedStartups.map(s=>(
            <div key={s.id} style={{background:dark?"#1a1a1a":"#fff",borderRadius:14,padding:"14px 16px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:12,overflow:"hidden",flexShrink:0}}><img src={s.avatar_url} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14,color:dark?"#e0e0e0":"#0d1117"}}>{s.name}</div>
                <div style={{color:"#1a6cf5",fontSize:12}}>{ICONS[s.industry]} {s.industry}</div>
                {s.raise_goal>0&&<div style={{marginTop:6}}><FundraisingBar raised={s.raise_raised||0} goal={s.raise_goal} dark={dark}/></div>}
              </div>
              <button style={S.smBtn} onClick={()=>{setChatTarget(s);setScreen("chat");}}>💬</button>
            </div>
          ))}
        </>}

        {/* Top Trending Startups */}
        <h3 style={{...S.secT,color:dark?"#e0e0e0":"#0d1117",marginBottom:12,marginTop:8}}>🔥 Trending Startups</h3>
        {recentStartups.map((s,i)=>(
          <div key={s.id} style={{background:dark?"#1a1a1a":"#fff",borderRadius:14,padding:"14px 16px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,0.06)",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:28,height:28,borderRadius:8,background:i===0?"#ffd700":i===1?"#c0c0c0":i===2?"#cd7f32":"#f0f5ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:i<3?"#fff":"#1a6cf5",flexShrink:0}}>#{i+1}</div>
            <div style={{width:40,height:40,borderRadius:12,overflow:"hidden",flexShrink:0}}><img src={s.avatar_url} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13,color:dark?"#e0e0e0":"#0d1117"}}>{s.pitch_title||s.name}</div>
              <div style={{color:"#aaa",fontSize:11}}>{ICONS[s.industry]} {s.industry} · 👁 {s.views||0} views</div>
            </div>
            <button style={S.smBtn} onClick={()=>{setChatTarget(s);setScreen("chat");}}>💬</button>
          </div>
        ))}
      </div>
    </div>
  );
}
