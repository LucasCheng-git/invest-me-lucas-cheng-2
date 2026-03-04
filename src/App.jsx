import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client ──────────────────────────────────────────────────────────
const SUPA_URL = "https://epijaunxfpptmjgaqdhl.supabase.co";
const SUPA_KEY = "sb_publishable_H6GIYL9hyREtqFJpSqi1-A_h7IVvexo";
const sb = createClient(SUPA_URL, SUPA_KEY);

// ─── Constants ────────────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const d = Date.now() - new Date(ts).getTime();
  if (d < 60000) return "just now";
  if (d < 3600000) return `${Math.floor(d/60000)}m ago`;
  if (d < 86400000) return `${Math.floor(d/3600000)}h ago`;
  return `${Math.floor(d/86400000)}d ago`;
}
function countWords(s) { return s.trim() === "" ? 0 : s.trim().split(/\s+/).length; }

function Av({ src, name, size = 40 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", overflow:"hidden", flexShrink:0, background:"#e8edf5" }}>
      <img src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name||"U")}&background=e8edf5&color=1a6cf5&size=${size*2}`}
        alt={name} style={{ width:"100%", height:"100%", objectFit:"cover" }}
        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name||"U")}&background=e8edf5&color=1a6cf5`; }} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
      <div className="spinner"/>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function InvestMe() {
  const [me, setMe] = useState(null);           // auth user + profile
  const [screen, setScreen] = useState("splash");
  const [watchTarget, setWatchTarget] = useState(null);
  const [chatTarget, setChatTarget] = useState(null);
  const [filterInd, setFilterInd] = useState("All");
  const [notif, setNotif] = useState(null);
  const [notifType, setNotifType] = useState("info"); // info | error | success
  const [booting, setBooting] = useState(true);

  function notify(msg, type = "info") {
    setNotif(msg); setNotifType(type);
    setTimeout(() => setNotif(null), 3000);
  }

  // ── Restore session on load ────────────────────────────────────────────────
  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) { setMe({ ...session.user, ...profile }); setScreen("feed"); }
      }
      setBooting(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") { setMe(null); setScreen("splash"); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await sb.from("profiles").select("*").eq("id", userId).single();
    return data;
  }

  async function login(email, pw) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password: pw });
    if (error) { notify("❌ " + error.message, "error"); return; }
    const profile = await fetchProfile(data.user.id);
    if (!profile) { notify("Profile not found. Please register.", "error"); return; }
    setMe({ ...data.user, ...profile });
    setScreen("feed");
    notify("Welcome back, " + profile.name + "! 👋", "success");
  }

  async function logout() {
    await sb.auth.signOut();
    setMe(null); setScreen("splash");
  }

  function handleProfileCreated(profile) {
    setMe(m => ({ ...m, ...profile }));
    setScreen("feed");
    notify("Account created! Welcome to InvestMe 🎉", "success");
  }

  if (booting) {
    return (
      <div style={{ ...S.app, display:"flex", alignItems:"center", justifyContent:"center", height:"100vh" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ ...S.lm, width:56, height:56, fontSize:28, margin:"0 auto 16px", borderRadius:16 }}>I</div>
          <div className="spinner" style={{ margin:"0 auto" }}/>
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      {notif && (
        <div style={{ ...S.toast, background: notifType==="error"?"#ff3b30":notifType==="success"?"#34c759":"#0d1117" }}>
          {notif}
        </div>
      )}
      {screen === "splash"    && <Splash setScreen={setScreen} />}
      {screen === "login"     && <Login login={login} setScreen={setScreen} />}
      {screen === "register"  && <Register sb={sb} onDone={handleProfileCreated} setScreen={setScreen} notify={notify} />}
      {["feed","profile","messages","chat","watch"].includes(screen) && me && (
        <Shell
          me={me} setMe={setMe} screen={screen} setScreen={setScreen} logout={logout}
          watchTarget={watchTarget} setWatchTarget={setWatchTarget}
          chatTarget={chatTarget} setChatTarget={setChatTarget}
          filterInd={filterInd} setFilterInd={setFilterInd}
          notify={notify}
        />
      )}
    </div>
  );
}

// ─── SPLASH ───────────────────────────────────────────────────────────────────
function Splash({ setScreen }) {
  return (
    <div style={S.splash}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"0 40px", width:"100%", gap:12 }}>
        <div style={S.logoRow}><div style={S.lm}>I</div><span style={S.lt}>InvestMe</span></div>
        <p style={{ color:"#999", fontSize:15, margin:"4px 0 20px", textAlign:"center" }}>Where bold ideas meet bold capital.</p>
        <button style={{ ...S.btnP, marginBottom:4 }} onClick={() => setScreen("register")}>Get Started</button>
        <button style={S.btnG} onClick={() => setScreen("login")}>Sign In</button>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ login, setScreen }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    await login(email, pw);
    setLoading(false);
  }

  return (
    <div style={S.aWrap}>
      <div style={S.aCard}>
        <div style={S.logoRow}><div style={S.lm}>I</div><span style={S.lt}>InvestMe</span></div>
        <h2 style={S.aTitle}>Welcome back</h2>
        <input style={S.inp} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter"&&handle()} />
        <input style={S.inp} type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==="Enter"&&handle()} />
        <button style={{ ...S.btnP, opacity: loading?0.7:1 }} disabled={loading} onClick={handle}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <p style={S.aSwitch}>No account? <span style={S.lnk} onClick={() => setScreen("register")}>Register</span></p>
      </div>
    </div>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
function Register({ sb, onDone, setScreen, notify }) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({ name:"", email:"", password:"", bio:"", industry:"", industries:[], firm:"", pitchTitle:"" });
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoMode, setVideoMode] = useState(null);
  const [loading, setLoading] = useState(false);

  function sf(k, v) { setForm(f => ({ ...f, [k]:v })); }
  function togInd(i) { sf("industries", form.industries.includes(i) ? form.industries.filter(x=>x!==i) : [...form.industries,i]); }
  const wc = countWords(form.bio);
  const wcOk = wc <= 250;

  async function submit() {
    if (!form.name || !form.email || !form.password) { notify("Fill all required fields","error"); return; }
    if (role==="startup" && !form.industry) { notify("Select your industry","error"); return; }
    if (role==="investor" && !form.industries.length) { notify("Select at least one industry","error"); return; }
    if (!wcOk) { notify("Bio exceeds 250 words","error"); return; }
    setLoading(true);
    try {
      // 1. Create auth user
      const { data: authData, error: authErr } = await sb.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { name: form.name } }
      });
      if (authErr) throw authErr;
      const uid = authData.user.id;

      // 2. Upload video to Storage if we have one
      let videoUrl = null;
      let videoThumb = `https://picsum.photos/seed/${uid}/400/300`;
      if (videoBlob && role === "startup") {
        const ext = "webm";
        const path = `${uid}/pitch.${ext}`;
        const res = await fetch(videoBlob);
        const blob = await res.blob();
        const { error: uploadErr } = await sb.storage.from("pitch-videos").upload(path, blob, {
          contentType: "video/webm", upsert: true
        });
        if (uploadErr) console.warn("Video upload error:", uploadErr.message);
        else {
          const { data: urlData } = sb.storage.from("pitch-videos").getPublicUrl(path);
          videoUrl = urlData.publicUrl;
        }
      }

      // 3. Insert profile
      const profilePayload = {
        id: uid,
        role,
        name: form.name,
        bio: form.bio,
        industry: role==="startup" ? form.industry : null,
        industries: role==="investor" ? form.industries : [],
        firm: form.firm || null,
        pitch_title: form.pitchTitle || (form.name + " Pitch"),
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=e8edf5&color=1a6cf5&size=150`,
        video_url: videoUrl,
        video_thumb: videoThumb,
        likes: 0,
        views: 0
      };
      const { data: profile, error: profErr } = await sb.from("profiles").insert(profilePayload).select().single();
      if (profErr) throw profErr;

      onDone(profile);
    } catch (e) {
      notify("❌ " + (e.message || "Registration failed"), "error");
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = role==="startup" ? 4 : 3;

  return (
    <div style={S.aWrap}>
      <div style={{ ...S.aCard, maxWidth:440 }}>
        <div style={S.logoRow}><div style={S.lm}>I</div><span style={S.lt}>InvestMe</span></div>
        <div style={{ display:"flex", gap:5, margin:"4px 0 12px", justifyContent:"center" }}>
          {Array.from({ length:totalSteps }, (_, i) => (
            <div key={i} style={{ width:step>i?32:20, height:4, borderRadius:2, background:step>i?"#1a6cf5":"#e8edf5", transition:"all .3s" }} />
          ))}
        </div>

        {step===1 && <>
          <h2 style={S.aTitle}>Join as…</h2>
          <div style={{ display:"flex", gap:12, margin:"8px 0 16px" }}>
            {["startup","investor"].map(r => (
              <div key={r} style={{ ...S.rCard, ...(role===r?S.rCardOn:{}) }} onClick={() => setRole(r)}>
                <span style={{ fontSize:30 }}>{r==="startup"?"🚀":"💼"}</span>
                <span style={{ fontWeight:700, marginTop:6, fontSize:14 }}>{r==="startup"?"Startup":"Investor"}</span>
                <span style={{ color:"#bbb", fontSize:11, textAlign:"center" }}>{r==="startup"?"Pitch your idea":"Discover deals"}</span>
              </div>
            ))}
          </div>
          <button style={{ ...S.btnP, opacity:role?1:0.4 }} disabled={!role} onClick={() => setStep(2)}>Continue</button>
          <p style={S.aSwitch}>Have account? <span style={S.lnk} onClick={() => setScreen("login")}>Sign In</span></p>
        </>}

        {step===2 && <>
          <h2 style={S.aTitle}>Your details</h2>
          <input style={S.inp} placeholder="Full name *" value={form.name} onChange={e => sf("name",e.target.value)} />
          <input style={S.inp} placeholder="Email *" value={form.email} onChange={e => sf("email",e.target.value)} />
          <input style={S.inp} type="password" placeholder="Password *" value={form.password} onChange={e => sf("password",e.target.value)} />
          <div style={{ position:"relative" }}>
            <textarea
              style={{ ...S.inp, height:84, resize:"none", paddingBottom:26, borderColor:!wcOk?"#ff3b30":undefined }}
              placeholder="Describe your startup (max 250 words)"
              value={form.bio}
              onChange={e => { if(countWords(e.target.value)<=255) sf("bio",e.target.value); }}
            />
            <span style={{ position:"absolute", bottom:9, right:12, fontSize:11, fontWeight:!wcOk?700:400, color:!wcOk?"#ff3b30":wc>220?"#ff9500":"#bbb" }}>
              {wc}/250 words
            </span>
          </div>
          {!wcOk && <p style={{ margin:"-4px 0 0", color:"#ff3b30", fontSize:12 }}>⚠️ Reduce to 250 words or fewer</p>}
          {role==="investor" && <input style={S.inp} placeholder="Firm / Fund name" value={form.firm} onChange={e => sf("firm",e.target.value)} />}
          <div style={{ display:"flex", gap:10 }}>
            <button style={{ ...S.btnG, flex:1 }} onClick={() => setStep(1)}>Back</button>
            <button style={{ ...S.btnP, flex:2 }} onClick={() => {
              if(!form.name||!form.email||!form.password){notify("Fill required fields","error");return;}
              if(!wcOk){notify("Bio exceeds 250 words","error");return;}
              setStep(3);
            }}>Next</button>
          </div>
        </>}

        {step===3 && role==="startup" && <>
          <h2 style={S.aTitle}>Your industry</h2>
          <div style={S.indGrid}>
            {INDUSTRIES.map(ind => (
              <div key={ind} style={{ ...S.iChip, ...(form.industry===ind?S.iChipOn:{}) }} onClick={() => sf("industry",ind)}>
                {ICONS[ind]} {ind}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:10 }}>
            <button style={{ ...S.btnG, flex:1 }} onClick={() => setStep(2)}>Back</button>
            <button style={{ ...S.btnP, flex:2, opacity:form.industry?1:0.4 }} disabled={!form.industry} onClick={() => setStep(4)}>Next</button>
          </div>
        </>}

        {step===3 && role==="investor" && <>
          <h2 style={S.aTitle}>Industries you love</h2>
          <p style={{ color:"#aaa", fontSize:12, margin:"0 0 10px" }}>Select all that apply</p>
          <div style={S.indGrid}>
            {INDUSTRIES.map(ind => (
              <div key={ind} style={{ ...S.iChip, ...(form.industries.includes(ind)?S.iChipOn:{}) }} onClick={() => togInd(ind)}>
                {ICONS[ind]} {ind}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginTop:10 }}>
            <button style={{ ...S.btnG, flex:1 }} onClick={() => setStep(2)}>Back</button>
            <button style={{ ...S.btnP, flex:2, opacity:form.industries.length?1:0.4 }} disabled={!form.industries.length||loading} onClick={submit}>
              {loading ? "Creating…" : "Create Account 🎉"}
            </button>
          </div>
        </>}

        {step===4 && role==="startup" && <>
          <h2 style={S.aTitle}>Your pitch video</h2>
          <input style={{ ...S.inp, marginBottom:2 }} placeholder="Pitch title" value={form.pitchTitle} onChange={e => sf("pitchTitle",e.target.value)} />
          <p style={{ color:"#bbb", fontSize:11, margin:"0 0 14px", textAlign:"center" }}>⏱ Maximum 3 minutes · uploaded to Supabase Storage</p>

          {!videoMode && !videoBlob && (
            <div style={{ display:"flex", gap:12, margin:"0 0 4px" }}>
              <div style={S.vmCard} className="vmcard" onClick={() => setVideoMode("record")}>
                <span style={{ fontSize:32 }}>📹</span>
                <span style={{ fontWeight:700, fontSize:13, marginTop:8 }}>Record Now</span>
                <span style={{ color:"#aaa", fontSize:11, textAlign:"center", marginTop:2 }}>Use your webcam</span>
              </div>
              <div style={S.vmCard} className="vmcard" onClick={() => setVideoMode("upload")}>
                <span style={{ fontSize:32 }}>📁</span>
                <span style={{ fontWeight:700, fontSize:13, marginTop:8 }}>Upload File</span>
                <span style={{ color:"#aaa", fontSize:11, textAlign:"center", marginTop:2 }}>From your device</span>
              </div>
            </div>
          )}

          {videoMode==="upload" && !videoBlob && <VideoUpload setVideoBlob={setVideoBlob} notify={notify} />}
          {videoMode==="record" && !videoBlob && <WebcamRecorder setVideoBlob={setVideoBlob} notify={notify} />}

          {videoBlob && (
            <div style={{ borderRadius:14, overflow:"hidden", border:"2px solid #1a6cf5", marginBottom:4 }}>
              <video src={videoBlob} controls style={{ width:"100%", display:"block", maxHeight:200, background:"#000" }} />
              <button style={{ width:"100%", background:"#fff8f8", color:"#ff3b30", border:"none", padding:10, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
                onClick={() => { setVideoBlob(null); setVideoMode(null); }}>🗑 Remove & redo</button>
            </div>
          )}

          <div style={{ display:"flex", gap:10, marginTop:10 }}>
            <button style={{ ...S.btnG, flex:1 }} onClick={() => { if(videoBlob){setVideoBlob(null);setVideoMode(null);}else if(videoMode)setVideoMode(null);else setStep(3); }}>Back</button>
            <button style={{ ...S.btnP, flex:2, opacity:loading?0.7:1 }} disabled={loading} onClick={submit}>
              {loading ? (videoBlob?"Uploading video…":"Creating account…") : (videoBlob?"Launch Pitch 🚀":"Skip & Launch →")}
            </button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ─── VIDEO UPLOAD ─────────────────────────────────────────────────────────────
function VideoUpload({ setVideoBlob, notify }) {
  const fileRef = useRef();
  const [checking, setChecking] = useState(false);
  function handleFile(e) {
    const f = e.target.files[0]; if (!f) return;
    setChecking(true);
    const url = URL.createObjectURL(f);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.onloadedmetadata = () => {
      setChecking(false);
      if (vid.duration > 180) { notify("⚠️ Video exceeds 3 minutes","error"); URL.revokeObjectURL(url); fileRef.current.value=""; }
      else setVideoBlob(url);
    };
    vid.onerror = () => { setChecking(false); notify("Could not read video","error"); };
    vid.src = url;
  }
  return (
    <div>
      <div style={S.vBox} onClick={() => fileRef.current.click()}>
        {checking
          ? <><span style={{ fontSize:28 }}>⏳</span><p style={{ color:"#bbb", fontSize:13, margin:"8px 0 0" }}>Checking duration…</p></>
          : <><span style={{ fontSize:36 }}>🎬</span><p style={{ color:"#bbb", fontSize:13, margin:"8px 0 4px" }}>Tap to select a video</p><p style={{ color:"#ddd", fontSize:11, margin:0 }}>MP4, MOV, WebM · max 3 min</p></>
        }
      </div>
      <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={handleFile} />
    </div>
  );
}

// ─── WEBCAM RECORDER ──────────────────────────────────────────────────────────
function WebcamRecorder({ setVideoBlob, notify }) {
  const vidRef = useRef(); const streamRef = useRef(); const recRef = useRef();
  const chunksRef = useRef([]); const timerRef = useRef();
  const [state, setState] = useState("idle");
  const [elapsed, setElapsed] = useState(0);
  const MAX = 180;

  async function startPreview() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
      streamRef.current = stream;
      vidRef.current.srcObject = stream; vidRef.current.muted = true;
      await vidRef.current.play(); setState("preview");
    } catch { notify("⚠️ Camera access denied","error"); }
  }
  function startRec() {
    chunksRef.current = [];
    const mt = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
    const rec = new MediaRecorder(streamRef.current, { mimeType:mt });
    recRef.current = rec;
    rec.ondataavailable = e => { if(e.data.size>0) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type:"video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoBlob(url);
      vidRef.current.srcObject = null; vidRef.current.src = url;
      vidRef.current.muted = false; vidRef.current.controls = true;
      stopStream(); setState("done");
    };
    rec.start(100); setElapsed(0); setState("recording");
    timerRef.current = setInterval(() => {
      setElapsed(p => { if(p+1>=MAX){stopRec();return MAX;} return p+1; });
    }, 1000);
  }
  function stopRec() { clearInterval(timerRef.current); if(recRef.current?.state==="recording") recRef.current.stop(); }
  function stopStream() { streamRef.current?.getTracks().forEach(t=>t.stop()); streamRef.current=null; }
  function reset() { stopStream(); clearInterval(timerRef.current); setElapsed(0); setState("idle"); if(vidRef.current){vidRef.current.srcObject=null;vidRef.current.src="";vidRef.current.controls=false;} }
  useEffect(() => () => { stopStream(); clearInterval(timerRef.current); }, []);

  const pct = Math.min((elapsed/MAX)*100,100);
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div>
      <div style={{ borderRadius:14, overflow:"hidden", background:"#0d1117", position:"relative", aspectRatio:"4/3", maxHeight:260 }}>
        <video ref={vidRef} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} playsInline />
        {state==="idle" && <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, color:"#fff", pointerEvents:"none" }}><span style={{ fontSize:36 }}>📹</span><p style={{ margin:0, fontSize:13, opacity:0.5 }}>Camera preview here</p></div>}
        {state==="recording" && (
          <div style={{ position:"absolute", top:10, left:10, right:10, pointerEvents:"none" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <span style={{ background:"rgba(255,59,48,0.92)", color:"#fff", padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#fff", display:"inline-block", animation:"pulse 1s infinite" }}/>REC
              </span>
              <span style={{ background:"rgba(0,0,0,0.65)", color:(MAX-elapsed)<=30?"#ff9500":"#fff", padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                {(MAX-elapsed)<=30&&"⚠️ "}{fmt(elapsed)} / {fmt(MAX)}
              </span>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.2)", borderRadius:2 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:pct>85?"#ff3b30":pct>65?"#ff9500":"#1a6cf5", borderRadius:2, transition:"width .8s linear" }}/>
            </div>
          </div>
        )}
        {state==="done" && <div style={{ position:"absolute", top:10, right:10, background:"rgba(52,199,89,0.9)", color:"#fff", padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700 }}>✅ Recorded {fmt(elapsed)}</div>}
      </div>
      <div style={{ display:"flex", gap:10, marginTop:10 }}>
        {state==="idle" && <button style={S.btnP} onClick={startPreview}>Enable Camera</button>}
        {state==="preview" && <button style={{ ...S.btnP, background:"#ff3b30" }} onClick={startRec}>⏺ Start Recording</button>}
        {state==="recording" && <button style={{ ...S.btnP, background:"#1a1a1a" }} onClick={stopRec}>⏹ Stop Recording</button>}
        {state==="done" && <button style={S.btnG} onClick={reset}>🔄 Re-record</button>}
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
function Shell({ me, setMe, screen, setScreen, logout, watchTarget, setWatchTarget, chatTarget, setChatTarget, filterInd, setFilterInd, notify }) {
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Load all profiles
  useEffect(() => {
    sb.from("profiles").select("*").then(({ data }) => {
      setAllUsers(data || []);
      setLoadingUsers(false);
    });
  }, []);

  // Load messages & subscribe to realtime
  useEffect(() => {
    if (!me) return;
    sb.from("messages").select("*")
      .or(`from_id.eq.${me.id},to_id.eq.${me.id}`)
      .order("created_at", { ascending:true })
      .then(({ data }) => setMessages(data || []));

    const channel = sb.channel("messages-" + me.id)
      .on("postgres_changes", {
        event:"INSERT", schema:"public", table:"messages",
        filter:`to_id=eq.${me.id}`
      }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();
    return () => sb.removeChannel(channel);
  }, [me?.id]);

  async function sendMsg(toId, text) {
    const { data, error } = await sb.from("messages").insert({
      from_id: me.id, to_id: toId, text, read: false
    }).select().single();
    if (!error && data) setMessages(prev => [...prev, data]);
    else if (error) notify("Failed to send message","error");
  }

  function getConvo(aId, bId) {
    return messages.filter(m => (m.from_id===aId&&m.to_id===bId)||(m.from_id===bId&&m.to_id===aId));
  }

  function peers() {
    const s = new Set();
    messages.forEach(m => {
      if (m.from_id===me.id) s.add(m.to_id);
      if (m.to_id===me.id) s.add(m.from_id);
    });
    return [...s].map(id => allUsers.find(u => u.id===id)).filter(Boolean);
  }

  const unread = messages.filter(m => m.to_id===me.id && !m.read).length;
  const startups = allUsers.filter(u => u.role==="startup");
  const relS = me.role==="investor" ? startups.filter(s => me.industries?.includes(s.industry)) : startups;
  const displayS = filterInd==="All" ? (me.role==="investor"?relS:startups) : (me.role==="investor"?relS.filter(s=>s.industry===filterInd):startups.filter(s=>s.industry===filterInd));

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh" }}>
      <header style={S.hdr}>
        <div style={S.logoRow} onClick={() => setScreen("feed")} className="cp">
          <div style={S.lm}>I</div><span style={S.lt}>InvestMe</span>
        </div>
        <nav style={{ display:"flex", gap:2 }}>
          {[
            { icon:"🏠", lbl:"Feed", s:"feed" },
            { icon:"💬", lbl:"Messages", s:"messages", badge:unread },
            { icon:"👤", lbl:"Profile", s:"profile" }
          ].map(n => (
            <button key={n.s} style={{ ...S.nBtn, ...((screen===n.s||(screen==="chat"&&n.s==="messages")||(screen==="watch"&&n.s==="feed"))?S.nBtnOn:{}) }} onClick={() => setScreen(n.s)}>
              <span style={{ position:"relative", fontSize:20 }}>{n.icon}{n.badge>0&&<span style={S.badge}>{n.badge}</span>}</span>
              <span style={{ fontSize:10, color:(screen===n.s||(screen==="chat"&&n.s==="messages"))?"#1a6cf5":"#aaa" }}>{n.lbl}</span>
            </button>
          ))}
          <button style={S.nBtn} onClick={logout}><span style={{ fontSize:20 }}>↩️</span><span style={{ fontSize:10, color:"#aaa" }}>Out</span></button>
        </nav>
      </header>
      <main style={{ flex:1, overflowY:"auto" }}>
        {loadingUsers && screen==="feed" ? <Spinner /> : null}
        {screen==="feed" && !loadingUsers && <Feed me={me} displayS={displayS} filterInd={filterInd} setFilterInd={setFilterInd} setWatchTarget={setWatchTarget} setScreen={setScreen} setChatTarget={setChatTarget} notify={notify} />}
        {screen==="profile" && <Profile me={me} setWatchTarget={setWatchTarget} setScreen={setScreen} setChatTarget={setChatTarget} allUsers={allUsers} notify={notify} />}
        {screen==="messages" && <Inbox peers={peers()} me={me} messages={messages} setChatTarget={setChatTarget} setScreen={setScreen} allUsers={allUsers} />}
        {screen==="chat" && chatTarget && <Chat me={me} peer={chatTarget} convo={getConvo(me.id,chatTarget.id)} sendMsg={sendMsg} setScreen={setScreen} />}
        {screen==="watch" && watchTarget && <Watch startup={watchTarget} me={me} setChatTarget={setChatTarget} setScreen={setScreen} notify={notify} />}
      </main>
    </div>
  );
}

// ─── FEED ─────────────────────────────────────────────────────────────────────
function Feed({ me, displayS, filterInd, setFilterInd, setWatchTarget, setScreen, setChatTarget, notify }) {
  const [likedMap, setLikedMap] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  useEffect(() => {
    if (!me || !displayS.length) return;
    const ids = displayS.map(s => s.id);
    // Load like counts
    sb.from("likes").select("startup_id").in("startup_id", ids).then(({ data }) => {
      const counts = {};
      (data||[]).forEach(l => { counts[l.startup_id] = (counts[l.startup_id]||0)+1; });
      setLikeCounts(counts);
    });
    // Load own likes
    sb.from("likes").select("startup_id").eq("user_id", me.id).in("startup_id", ids).then(({ data }) => {
      const map = {};
      (data||[]).forEach(l => { map[l.startup_id] = true; });
      setLikedMap(map);
    });
  }, [displayS.length, me?.id]);

  async function toggleLike(startupId) {
    const isLiked = likedMap[startupId];
    setLikedMap(m => ({ ...m, [startupId]:!isLiked }));
    setLikeCounts(c => ({ ...c, [startupId]:(c[startupId]||0)+(isLiked?-1:1) }));
    if (isLiked) {
      await sb.from("likes").delete().eq("user_id",me.id).eq("startup_id",startupId);
    } else {
      await sb.from("likes").insert({ user_id:me.id, startup_id:startupId });
    }
  }

  async function incrementViews(startup) {
    await sb.from("profiles").update({ views: (startup.views||0)+1 }).eq("id", startup.id);
    setWatchTarget({ ...startup, views:(startup.views||0)+1 });
    setScreen("watch");
  }

  return (
    <div style={{ paddingBottom:40 }}>
      <div style={S.fBar}>
        {["All",...INDUSTRIES].map(ind => (
          <button key={ind} style={{ ...S.fChip, ...(filterInd===ind?S.fChipOn:{}) }} onClick={() => setFilterInd(ind)}>
            {ind!=="All"&&ICONS[ind]} {ind}
          </button>
        ))}
      </div>
      {me.role==="investor" && filterInd==="All" && (
        <div style={S.hint}>Showing pitches for: {me.industries?.map(i=>`${ICONS[i]} ${i}`).join(" · ")}</div>
      )}
      <div style={{ padding:"0 14px", display:"flex", flexDirection:"column", gap:16 }}>
        {displayS.length===0 && <p style={{ textAlign:"center", color:"#ccc", padding:"60px 0" }}>No pitches yet.</p>}
        {displayS.map(s => (
          <div key={s.id} style={S.card} className="card">
            <div style={{ position:"relative", cursor:"pointer" }} onClick={() => incrementViews(s)}>
              <img src={s.video_thumb || s.videoThumb || `https://picsum.photos/seed/${s.id}/400/300`} alt={s.pitch_title} style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block" }} />
              <div style={S.playBtn}>▶</div>
              <div style={S.indBadge}>{ICONS[s.industry]} {s.industry}</div>
              {s.video_url && <div style={{ position:"absolute", top:10, right:10, background:"rgba(26,108,245,0.85)", color:"#fff", borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700 }}>📹 Live</div>}
            </div>
            <div style={{ padding:"14px 16px 16px" }}>
              <div style={{ display:"flex", alignItems:"center", marginBottom:10 }}>
                <Av src={s.avatar_url || s.avatar} name={s.name} size={38} />
                <div style={{ marginLeft:10 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{s.name}</div>
                  <div style={{ color:"#aaa", fontSize:12 }}>{s.founder || s.name}</div>
                </div>
              </div>
              <p style={{ margin:"0 0 4px", fontWeight:700, fontSize:15 }}>{s.pitch_title || s.pitchTitle || s.name}</p>
              <p style={{ margin:"0 0 12px", color:"#666", fontSize:13, lineHeight:1.5 }}>{s.bio}</p>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button style={S.aBtn} onClick={() => toggleLike(s.id)}>
                  {likedMap[s.id]?"❤️":"🤍"} {likeCounts[s.id]||s.likes||0}
                </button>
                <button style={S.aBtn}>👁 {s.views||0}</button>
                {me.role==="investor" && (
                  <button style={{ ...S.aBtn, marginLeft:"auto", background:"#f0f5ff", color:"#1a6cf5", padding:"6px 14px", borderRadius:20, fontWeight:700 }}
                    onClick={() => { setChatTarget(s); setScreen("chat"); }}>💬 Message</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WATCH ────────────────────────────────────────────────────────────────────
function Watch({ startup, me, setChatTarget, setScreen, notify }) {
  const [liked, setLiked] = useState(false);
  const videoSrc = startup.video_url || startup.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4";
  return (
    <div style={{ padding:16, paddingBottom:40 }}>
      <button style={S.back} onClick={() => setScreen("feed")}>← Back to Feed</button>
      <div style={S.card}>
        <video src={videoSrc} controls autoPlay style={{ width:"100%", display:"block", background:"#000", maxHeight:280 }} />
        <div style={{ padding:"16px 20px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", marginBottom:12 }}>
            <Av src={startup.avatar_url||startup.avatar} name={startup.name} size={50} />
            <div style={{ marginLeft:12 }}>
              <div style={{ fontWeight:700, fontSize:17 }}>{startup.name}</div>
              <div style={{ color:"#1a6cf5", fontSize:13 }}>{ICONS[startup.industry]} {startup.industry}</div>
            </div>
          </div>
          <h2 style={{ margin:"0 0 8px", fontSize:19, fontWeight:800 }}>{startup.pitch_title||startup.pitchTitle}</h2>
          <p style={{ color:"#555", lineHeight:1.6, margin:"0 0 16px" }}>{startup.bio}</p>
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <button style={S.aBtn} onClick={() => setLiked(!liked)}>{liked?"❤️":"🤍"} {(startup.likes||0)+(liked?1:0)}</button>
            <button style={S.aBtn}>👁 {startup.views||0}</button>
            {me.role==="investor" && (
              <button style={{ ...S.btnP, width:"auto", padding:"9px 20px", fontSize:14, marginLeft:"auto" }}
                onClick={() => { setChatTarget(startup); setScreen("chat"); }}>💬 Message Startup</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ me, setWatchTarget, setScreen, setChatTarget, allUsers, notify }) {
  const isS = me.role==="startup";
  const investors = allUsers.filter(u => u.role==="investor");
  return (
    <div style={{ padding:"20px 16px 80px" }}>
      <div style={{ background:"#fff", borderRadius:18, padding:20, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"flex-start" }}>
          <Av src={me.avatar_url||me.avatar} name={me.name} size={72} />
          <div style={{ marginLeft:16, flex:1 }}>
            <h2 style={{ margin:"0 0 4px", fontSize:20, fontWeight:800 }}>{me.name}</h2>
            {me.firm && <p style={{ margin:"0 0 4px", color:"#1a6cf5", fontWeight:600, fontSize:14 }}>{me.firm}</p>}
            <p style={{ margin:"0 0 10px", color:"#666", fontSize:13, lineHeight:1.5 }}>{me.bio||"No bio yet."}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              <span style={{ background:"#f5f7fa", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{isS?"🚀 Startup":"💼 Investor"}</span>
              {isS && <span style={{ background:"#f0f5ff", color:"#1a6cf5", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{ICONS[me.industry]} {me.industry}</span>}
            </div>
          </div>
        </div>
      </div>
      {isS && <>
        <h3 style={S.secT}>My Pitch</h3>
        <div style={{ ...S.card, marginBottom:20, cursor:"pointer" }} onClick={() => { setWatchTarget(me); setScreen("watch"); }}>
          <img src={me.video_thumb||me.videoThumb||`https://picsum.photos/seed/${me.id}/400/220`} alt="pitch" style={{ width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block" }} />
          <div style={{ padding:"12px 16px" }}><p style={{ margin:0, fontWeight:700 }}>{me.pitch_title||me.pitchTitle||"My Pitch"}</p></div>
        </div>
        <h3 style={S.secT}>Find Investors</h3>
        {investors.map(inv => (
          <div key={inv.id} style={{ ...S.card, padding:"14px 16px", display:"flex", alignItems:"center", marginBottom:10 }}>
            <Av src={inv.avatar_url||inv.avatar} name={inv.name} size={48} />
            <div style={{ marginLeft:12, flex:1 }}>
              <div style={{ fontWeight:700 }}>{inv.name}</div>
              {inv.firm && <div style={{ color:"#1a6cf5", fontSize:13 }}>{inv.firm}</div>}
              <div style={{ color:"#aaa", fontSize:12, marginTop:2 }}>{inv.industries?.map(i=>ICONS[i]).join(" ")}</div>
            </div>
            <button style={S.smBtn} onClick={() => { setChatTarget(inv); setScreen("chat"); }}>Message</button>
          </div>
        ))}
      </>}
      {!isS && <>
        <h3 style={S.secT}>Your focus areas</h3>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {me.industries?.map(ind => (
            <span key={ind} style={{ background:"#f0f5ff", color:"#1a6cf5", borderRadius:20, padding:"6px 14px", fontSize:13, fontWeight:600 }}>{ICONS[ind]} {ind}</span>
          ))}
        </div>
      </>}
    </div>
  );
}

// ─── INBOX ────────────────────────────────────────────────────────────────────
function Inbox({ peers, me, messages, setChatTarget, setScreen, allUsers }) {
  function lastMsg(pid) {
    return messages.filter(m=>(m.from_id===me.id&&m.to_id===pid)||(m.from_id===pid&&m.to_id===me.id)).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];
  }
  const suggestions = (me.role==="investor" ? allUsers.filter(u=>u.role==="startup") : allUsers.filter(u=>u.role==="investor"))
    .filter(u => !peers.find(p=>p.id===u.id)).slice(0,3);
  return (
    <div style={{ padding:"20px 16px 80px" }}>
      <h2 style={{ margin:"0 0 16px", fontSize:22, fontWeight:800 }}>Messages</h2>
      {peers.length===0 && <p style={{ textAlign:"center", color:"#ccc", padding:"40px 0" }}>No conversations yet.</p>}
      {peers.map(peer => {
        const lm = lastMsg(peer.id);
        const ur = messages.filter(m=>m.from_id===peer.id&&m.to_id===me.id&&!m.read).length;
        return (
          <div key={peer.id} style={{ ...S.card, padding:"14px 16px", display:"flex", alignItems:"center", marginBottom:10, cursor:"pointer" }} onClick={() => { setChatTarget(peer); setScreen("chat"); }}>
            <Av src={peer.avatar_url||peer.avatar} name={peer.name} size={48} />
            <div style={{ marginLeft:12, flex:1, minWidth:0 }}>
              <div style={{ fontWeight:ur?700:500 }}>{peer.name}</div>
              <div style={{ color:"#aaa", fontSize:13, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{lm?lm.text:"Start chatting"}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0, marginLeft:8 }}>
              {lm && <span style={{ fontSize:11, color:"#ccc" }}>{timeAgo(lm.created_at)}</span>}
              {ur>0 && <span style={{ background:"#1a6cf5", color:"#fff", borderRadius:10, padding:"2px 7px", fontSize:11, fontWeight:700 }}>{ur}</span>}
            </div>
          </div>
        );
      })}
      {suggestions.length>0 && <>
        <h3 style={{ ...S.secT, marginTop:24 }}>{me.role==="investor"?"Startups to explore":"Investors to connect with"}</h3>
        {suggestions.map(u => (
          <div key={u.id} style={{ ...S.card, padding:"14px 16px", display:"flex", alignItems:"center", marginBottom:10, opacity:0.8 }}>
            <Av src={u.avatar_url||u.avatar} name={u.name} size={44} />
            <div style={{ marginLeft:12, flex:1 }}>
              <div style={{ fontWeight:600 }}>{u.name}</div>
              <div style={{ color:"#aaa", fontSize:12 }}>{u.industry||u.industries?.join(", ")}</div>
            </div>
            <button style={S.smBtn} onClick={() => { setChatTarget(u); setScreen("chat"); }}>Message</button>
          </div>
        ))}
      </>}
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function Chat({ me, peer, convo, sendMsg, setScreen }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const btm = useRef();
  useEffect(() => { btm.current?.scrollIntoView({ behavior:"smooth" }); }, [convo]);
  async function send() {
    if (!text.trim() || sending) return;
    setSending(true);
    await sendMsg(peer.id, text.trim());
    setText(""); setSending(false);
  }
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 62px)" }}>
      <div style={{ display:"flex", alignItems:"center", padding:"12px 16px", borderBottom:"1px solid #f0f0f0", background:"#fff" }}>
        <button style={S.back} onClick={() => setScreen("messages")}>←</button>
        <Av src={peer.avatar_url||peer.avatar} name={peer.name} size={38} />
        <div style={{ marginLeft:10 }}>
          <div style={{ fontWeight:700 }}>{peer.name}</div>
          <div style={{ fontSize:12, color:"#aaa" }}>{peer.role==="startup"?peer.industry:peer.firm}</div>
        </div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16, background:"#fafafa" }}>
        {convo.length===0 && <p style={{ textAlign:"center", color:"#ccc", paddingTop:40 }}>Say hello! 👋</p>}
        {convo.map(msg => {
          const isMe = msg.from_id===me.id;
          return (
            <div key={msg.id} style={{ display:"flex", justifyContent:isMe?"flex-end":"flex-start", marginBottom:10 }}>
              <div style={{ maxWidth:"75%", padding:"10px 14px", borderRadius:18, ...(isMe?{background:"#1a6cf5",color:"#fff",borderBottomRightRadius:4}:{background:"#fff",color:"#0d1117",boxShadow:"0 1px 6px rgba(0,0,0,0.07)",borderBottomLeftRadius:4}) }}>
                <p style={{ margin:0, lineHeight:1.5, fontSize:14 }}>{msg.text}</p>
                <span style={{ fontSize:10, opacity:0.6, display:"block", textAlign:"right", marginTop:4 }}>{timeAgo(msg.created_at)}</span>
              </div>
            </div>
          );
        })}
        <div ref={btm} />
      </div>
      <div style={{ display:"flex", gap:10, padding:"12px 16px", background:"#fff", borderTop:"1px solid #f0f0f0" }}>
        <input style={{ ...S.inp, borderRadius:24, flex:1 }} placeholder={`Message ${peer.name}…`} value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} />
        <button style={{ background:sending?"#aaa":"#1a6cf5", color:"#fff", border:"none", borderRadius:24, padding:"0 20px", fontSize:18, cursor:"pointer" }} onClick={send}>➤</button>
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
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
  hdr:{position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px"},
  nBtn:{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",padding:"6px 10px",borderRadius:10,gap:2,position:"relative"},
  nBtnOn:{background:"#f0f5ff"},
  badge:{position:"absolute",top:-2,right:-4,background:"#ff3b30",color:"#fff",fontSize:9,fontWeight:700,width:15,height:15,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"},
  fBar:{display:"flex",gap:7,overflowX:"auto",padding:"12px 14px 8px",scrollbarWidth:"none"},
  fChip:{background:"#f5f7fa",border:"1.5px solid #eee",borderRadius:20,padding:"6px 12px",fontSize:12,cursor:"pointer",whiteSpace:"nowrap",fontWeight:500,fontFamily:"'DM Sans',sans-serif",flexShrink:0},
  fChipOn:{background:"#1a6cf5",color:"#fff",border:"1.5px solid #1a6cf5"},
  hint:{margin:"0 14px 10px",padding:"9px 13px",background:"#f0f5ff",borderRadius:11,fontSize:12,color:"#1a6cf5"},
  card:{background:"#fff",borderRadius:18,boxShadow:"0 2px 14px rgba(0,0,0,0.06)",overflow:"hidden"},
  playBtn:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.18)",fontSize:40,color:"#fff"},
  indBadge:{position:"absolute",top:10,left:10,background:"rgba(0,0,0,0.55)",color:"#fff",borderRadius:20,padding:"4px 10px",fontSize:11,backdropFilter:"blur(4px)"},
  aBtn:{background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,color:"#555",padding:"4px 6px",borderRadius:8,fontFamily:"'DM Sans',sans-serif"},
  back:{background:"none",border:"none",cursor:"pointer",fontSize:15,fontWeight:700,color:"#1a6cf5",padding:"0 0 12px",display:"block"},
  secT:{fontSize:15,fontWeight:700,color:"#0d1117",margin:"0 0 10px"},
  smBtn:{background:"#f0f5ff",color:"#1a6cf5",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0},
  toast:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",color:"#fff",padding:"12px 24px",borderRadius:24,fontSize:14,fontWeight:600,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,0.25)",whiteSpace:"nowrap",transition:"background .3s"},
};

const CSS = `
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
`;
