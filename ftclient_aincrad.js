(function () {
  "use strict";

  // ═══════════════════ APP INFO ═══════════════════
  const APP_NAME = "FT CLIENT";
  const APP_VERSION = "OFFICIAL";
  const APP_FULL_NAME = APP_NAME + " " + APP_VERSION;
  const OWNER_NAME = "ARAFAT";
  const OWNER_TG = "https://t.me/ftgaming2";
  const CHANNEL_TG = "https://t.me/+Qjrl3DUTGVU2MWZl";
  const KEY_CHECK_URL = 'https://raw.githubusercontent.com/arafathosan109-maker/ft_client_time-loader/refs/heads/main/timer.text';
  const TIMER_URL = 'https://raw.githubusercontent.com/rifatislam50/Timer.text-/refs/heads/main/Time _loader.text';


  // ═══════════════════ STATE ═══════════════════
  let logQueue = [];
  let isLoggingActive = false;
  let logInterval = null;
  let minProgressTime = 30000; 
  let logDisplayDelay = 700;
  let loadedTimeSeconds = 0;


  // ═══════════════════ STYLES ═══════════════════
  function injectStyles() {
    if (document.getElementById('ft-premium-styles')) return;
    const st = document.createElement("style");
    st.id = 'ft-premium-styles';
    st.textContent = `
      :root {
        --bg-color: #050807; 
        --electric-glow-1: #00f2ff;
        --electric-glow-2: #ff00ff;
        --success-color: #2ecc71;
        --danger-color: #ff4757;
        --text-color: #e0e5ec;
        --text-muted: #718096;
        --btn-height: 52px;
        --white-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes nb-rotate-glow { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
      @keyframes nb-popIn { 0% { opacity: 0; transform: scale(0.9) translateY(20px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes nb-fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.05); } }
      @keyframes nb-pulse { 0%, 100% { opacity: 0.6 } 50% { opacity: 1 } }
      @keyframes nb-logFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes nb-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .ft-overlay {
        position: fixed; inset: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.9); z-index: 2147483647;
        display: flex; align-items: center; justify-content: center;
        padding: 20px; backdrop-filter: blur(12px);
        font-family: 'Segoe UI', Roboto, sans-serif;
      }
      .ft-wrapper {
        position: relative; padding: 2px; border-radius: 24px; background: rgba(255, 255, 255, 0.05);
        overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9); width: 400px; max-width: 95vw;
        animation: nb-popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .ft-glow-layer {
        position: absolute; inset: -50%; pointer-events: none; z-index: 0;
        background: conic-gradient(transparent 0deg, var(--electric-glow-1) 60deg, transparent 120deg, var(--electric-glow-2) 180deg, transparent 240deg, var(--electric-glow-1) 300deg, transparent 360deg);
        animation: nb-rotate-glow 5s linear infinite;
      }
      .ft-content {
        position: relative; z-index: 1; background: var(--bg-color); border-radius: 22px;
        padding: 30px; display: flex; flex-direction: column; gap: 20px;
      }
      .ft-header {
        display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 15px;
      }
      .ft-title {
        font-size: 17px; font-weight: 900; letter-spacing: 2px; color: var(--electric-glow-1); text-transform: uppercase;
      }
      .ft-input {
        width: 100%; background: #080a09; border: 1.5px solid #1a1a1a; border-radius: 12px;
        height: var(--btn-height); padding: 0 15px; color: #fff; font-size: 14px; text-align: center; outline: none;
        transition: all 0.3s ease;
        box-shadow: var(--white-shadow);
      }
      .ft-input:focus { border-color: var(--electric-glow-1); box-shadow: 0 0 15px rgba(255, 255, 255, 0.3); }
      .ft-input.shake { animation: nb-shake 0.4s; border-color: var(--danger-color); }
      .ft-btn {
        width: 100%; height: var(--btn-height); border-radius: 12px; 
        background: linear-gradient(135deg, var(--electric-glow-1), var(--electric-glow-2));
        color: #000; font-weight: 800; border: none; cursor: pointer; text-transform: uppercase; 
        display: flex; align-items: center; justify-content: center; text-decoration: none;
        transition: all 0.3s ease; font-size: 14px; letter-spacing: 1px;
      }
      .ft-btn:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3); }
      .ft-method-card {
        background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px; padding: 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
        transition: all 0.3s ease;
        box-shadow: var(--white-shadow);
      }
      .ft-method-card:hover { border-color: var(--electric-glow-1); background: rgba(255, 255, 255, 0.08); box-shadow: 0 0 15px rgba(255, 255, 255, 0.3); }
      .ft-log-area {
        max-height: 0; opacity: 0; background: rgba(0, 0, 0, 0.6); border-radius: 12px; 
        overflow: hidden; font-family: 'Consolas', 'Courier New', monospace; font-size: 11px; 
        display: flex; flex-direction: column; gap: 6px;
        transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease, padding 0.4s ease;
      }
      .ft-log-area.active {
        max-height: 240px; opacity: 1; padding: 15px; margin: 5px 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: var(--white-shadow);
        overflow-y: auto;
      }
      .ft-log-entry { 
        display: flex; gap: 10px; animation: nb-logFadeIn 0.3s ease forwards; 
        line-height: 1.4; color: var(--text-color);
      }
      .ft-progress-container { margin: 5px 0; }
      .ft-progress-info { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); font-weight: 800; margin-bottom: 8px; }
      .ft-progress-bar-bg { height: 7px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; }
      .ft-progress-bar-fill { 
        height: 100%; width: 0%; 
        background: linear-gradient(90deg, var(--electric-glow-1), var(--electric-glow-2)); 
        box-shadow: 0 0 10px var(--electric-glow-1); 
        transition: width 0.3s linear; 
      }
      .ft-footer-branding {
        display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 5px;
      }
      .ft-owner-text {
        font-size: 15px; color: var(--success-color); font-weight: 900; 
        text-transform: uppercase; letter-spacing: 1.5px;
        cursor: pointer; text-decoration: none;
        transition: all 0.3s ease;
      }
      .ft-owner-text:hover {
        color: var(--electric-glow-1);
        text-shadow: 0 0 10px var(--electric-glow-1);
      }
      .ft-version-text {
        font-size: 10px; color: var(--text-muted); font-weight: 600;
        padding: 2px 6px; background: rgba(255, 255, 255, 0.05); border-radius: 4px;
      }
      .ft-exit { animation: nb-fadeOut 0.3s forwards; }
      .ft-button-group { display: flex; flex-direction: column; gap: 12px; }
      .ft-log-area::-webkit-scrollbar { width: 3px; }
      .ft-log-area::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    `;
    const head = document.head || document.getElementsByTagName('head')[0];
    if (head) head.appendChild(st);
  }

  // ═══════════════════ LOGGING ═══════════════════
  function queueLog(icon, text, color = '#e0e5ec') {
    logQueue.push({ icon, text, color });
    if (!isLoggingActive) startLogQueue();
  }

  function startLogQueue() {
    isLoggingActive = true;
    logInterval = setInterval(() => {
      if (logQueue.length > 0) {
        const item = logQueue.shift();
        const area = document.getElementById("ft-log-output");
        if (area) {
          if (!area.classList.contains('active')) {
            area.classList.add('active');
          }
          const entry = document.createElement("div");
          entry.className = "ft-log-entry";
          entry.innerHTML = `<span style="color:${item.color}">${item.icon}</span> <span style="color:${item.color}">${item.text}</span>`;
          area.appendChild(entry);
          area.scrollTop = area.scrollHeight;
        }
      } else {
        clearInterval(logInterval);
        isLoggingActive = false;
      }
    }, logDisplayDelay);
  }

  // ═══════════════════ UI RENDERING ═══════════════════
  function createWrapper(contentHTML) {
    const wrapper = document.createElement("div");
    wrapper.className = "ft-wrapper";
    wrapper.innerHTML = `<div class="ft-glow-layer"></div><div class="ft-content">${contentHTML}</div>`;
    return wrapper;
  }

  function renderLogin() {
    const body = document.body || document.getElementsByTagName('body')[0];
    if (!body) return setTimeout(renderLogin, 100);

    const ov = document.createElement("div");
    ov.id = "ft-main-overlay";
    ov.className = "ft-overlay";
    
    const wrapper = createWrapper(`
      <div class="ft-header">
        <div style="width:10px;height:10px;background:var(--electric-glow-1);border-radius:50%;box-shadow:0 0 8px var(--electric-glow-1);"></div>
        <div class="ft-title">${APP_FULL_NAME}</div>
      </div>
      <div style="text-align:center; color:var(--text-muted); font-size:11px; margin-top:-10px;">AUTHENTICATION REQUIRED</div>
      <input id="ft-key-input" class="ft-input" type="password" placeholder="ENTER LICENSE KEY...">
      <div class="ft-button-group">
        <button id="ft-verify-btn" class="ft-btn">VERIFY ACCESS</button>
        <a href="${CHANNEL_TG}" target="_blank" class="ft-btn">JOIN TELEGRAM</a>
      </div>
      <div class="ft-footer-branding">
        <span class="ft-owner-text">OWNER ${OWNER_NAME}</span>
        <span class="ft-version-text">V1.0.1</span>
      </div>
    `);
    
    ov.appendChild(wrapper);
    body.appendChild(ov);

    const ownerEl = wrapper.querySelector('.ft-owner-text');
    if (ownerEl) {
      ownerEl.addEventListener('click', () => {
        window.open(OWNER_TG, '_blank');
      });
    }

    document.getElementById("ft-verify-btn").onclick = async () => {
      const key = document.getElementById("ft-key-input").value.trim();
      if (!key) return document.getElementById("ft-key-input").classList.add('shake');
      
      const btn = document.getElementById("ft-verify-btn");
      const input = document.getElementById("ft-key-input");
      btn.textContent = "VERIFYING...";
      btn.disabled = true;

      try {
        const res = await fetch(KEY_CHECK_URL + "?t=" + Date.now());
        const validKeys = await res.text();
        if (validKeys.includes(key)) {
          btn.style.background = 'var(--success-color)';
          btn.textContent = "GRANTED";
          setTimeout(() => {
            wrapper.classList.add('ft-exit');
            setTimeout(() => {
              wrapper.remove();
              renderMethodSelection();
            }, 300);
          }, 600);
        } else {
          btn.classList.add('shake');
          input.classList.add('shake');
          setTimeout(() => {
            btn.classList.remove('shake');
            input.classList.remove('shake');
            btn.textContent = "VERIFY ACCESS";
            btn.disabled = false;
          }, 600);
        }
      } catch (e) {
        btn.classList.add('shake');
        btn.disabled = false;
      }
    };
  }

  function renderMethodSelection() {
    const overlay = document.getElementById("ft-main-overlay");
    const newWrapper = createWrapper(`
      <div class="ft-header">
        <div style="width:10px;height:10px;background:var(--success-color);border-radius:50%;box-shadow:0 0 8px var(--success-color);"></div>
        <div class="ft-title">SELECT TARGET</div>
      </div>
      <div id="method-aincrad" class="ft-method-card">
        <div>
          <div style="color:#fff; font-weight:700;">AINCRAD</div>
          <div style="font-size:10px; color:var(--text-muted);">PREMIUM SECURE BYPASS</div>
        </div>
        <div style="color:var(--electric-glow-1); font-weight:900; padding-left: 20px;">SELECT</div>
      </div>
      <div class="ft-footer-branding">
        <span class="ft-owner-text">OWNER ${OWNER_NAME}</span>
        <span class="ft-version-text">V1.0.1</span>
      </div>
    `);
    overlay.appendChild(newWrapper);

    const ownerEl = newWrapper.querySelector('.ft-owner-text');
    if (ownerEl) {
      ownerEl.addEventListener('click', () => {
        window.open(OWNER_TG, '_blank');
      });
    }

    document.getElementById("method-aincrad").onclick = () => {
      newWrapper.remove(); 
      renderExploitPanel();
    };

  }

  function renderExploitPanel() {
    const overlay = document.getElementById("ft-main-overlay");
    const wrapper = createWrapper(`
      <div class="ft-header">
        <span style="width:8px;height:8px;background:var(--electric-glow-1);border-radius:50%;box-shadow:0 0 8px var(--electric-glow-1);animation:nb-pulse 1s infinite;"></span>
        <div class="ft-title">BYPASS CONSOLE</div>
        <div style="margin-left:auto; font-size:10px; color:var(--success-color); font-weight:900;">● LIVE</div>
      </div>
      <div id="ft-log-output" class="ft-log-area"></div>
      <div class="ft-progress-container">
        <div class="ft-progress-info">
          <span>PROGRESS</span>
          <span id="ft-progress-pct">0%</span>
        </div>
        <div class="ft-progress-bar-bg">
          <div id="ft-progress-fill" class="ft-progress-bar-fill"></div>
        </div>
      </div>
      <div class="ft-footer-branding">
        <span class="ft-owner-text">OWNER ${OWNER_NAME}</span>
        <span class="ft-version-text">Bypass System V1.0.1</span>
      </div>
    `);
    overlay.appendChild(wrapper);
    startBypassLogic();
  }

  async function loadTimerFromGitHub() {
    try {
      const res = await fetch(TIMER_URL + "?t=" + Date.now());
      const text = await res.text();
      const parsed = parseInt(text.trim(), 10);
      if (!isNaN(parsed) && parsed > 0) {
        loadedTimeSeconds = parsed;
        minProgressTime = parsed * 1000;
        return true;
      }
    } catch (e) {}
    loadedTimeSeconds = 30;
    minProgressTime = 30000;
    return false;
  }

  // ═══════════════════ ORIGINAL BYPASS LOGIC ═══════════════════
  async function startBypassLogic() {
    const h = location.host;
    const startTime = Date.now();
    queueLog('⚡', 'INITIALIZING FT BYPASS CORE...', '#00f2ff');
    queueLog('📡', `TARGET DETECTED: ${h.toUpperCase()}`, '#718096');
    queueLog('🛡️', 'ANALYZING SECURITY PROTOCOLS...', '#2ecc71');
    queueLog('🔍', 'SCANNING FOR API VULNERABILITIES...', '#00f2ff');

    const progFill = document.getElementById("ft-progress-fill");
    const progPct = document.getElementById("ft-progress-pct");
    const updateProgress = (p) => {
      if (progFill) progFill.style.width = p + "%";
      if (progPct) progPct.textContent = Math.floor(p) + "%";
    };

    const progInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min((elapsed / minProgressTime) * 100, 99);
      updateProgress(p);
    }, 150);

    try {
      let domain = "";
      if (h.includes('tarviral.com')) domain = 'tarviral.com';
      else if (h.includes('rodaemotor.com')) domain = 'rodaemotor.com';
      else if (h.includes('donpviral.xyz')) domain = 'donpviral.xyz';
      else {
          queueLog('❌', 'FATAL: DOMAIN NOT SUPPORTED', '#ff4757');
          setTimeout(() => { document.getElementById("ft-main-overlay").remove(); }, 3000);
          clearInterval(progInterval);
          return;
      }
      queueLog('🛰️', `CONNECTING TO ${domain.toUpperCase()}...`, '#00f2ff');
      queueLog('⏳', 'Please Wait We Will Feace The Letest Data', '#ffa500');
      const proto = window.location.protocol;
      const sessionRes = await fetch(`${proto}//${domain}/api/session-info`, { credentials: 'include' });
      const sessionData = await sessionRes.json();
      queueLog('✅', 'Data Found', '#2ecc71');
      queueLog('📥', 'Data Collect', '#00f2ff');
      if (!sessionData.sessionToken) throw new Error("Token Error");
      queueLog('🛠️', 'Working', '#ff00ff');
      queueLog('🔐', `TOKEN: ${sessionData.sessionToken.substring(0, 15)}...`, '#2ecc71');
      queueLog('🔗', 'ESTABLISHING BYPASS TUNNEL...', '#00f2ff');
      const input = encodeURIComponent(JSON.stringify({ "0": { "json": { "token": sessionData.sessionToken, "progress": sessionData.totalStage + 1, "stageId": sessionData.stageId } } }));
      queueLog('🧬', 'INJECTING BYPASS PAYLOAD...', '#ff00ff');
      const bypassRes = await fetch(`${proto}//${domain}/api/trpc/linkSession.nextStage?batch=1&input=${input}`, { credentials: 'include', headers: { 'trpc-accept': 'application/jsonl', 'x-trpc-source': 'nextjs-react' } });
      queueLog('📦', 'PARSING RESPONSE HEADERS...', '#718096');
      const bypassText = await bypassRes.text();
      let dest = null;
      bypassText.trim().split('\n').forEach(line => {
          try {
              const j = JSON.parse(line);
              dest = j?.json?.[2]?.[0]?.[0]?.destinationLink || j?.json?.[2]?.[0]?.[0]?.url;
          } catch (e) {}
      });
      if (dest) {
          queueLog('🎯', `REDIRECT TARGET: ${dest.substring(0, 40)}...`, '#2ecc71');
          queueLog('🔑', `TOKEN ON: ${dest}`, '#00f2ff');
      }
      const statusIntervalMs = 2000;
      const fillLogs = [
        { i: '🛡️', t: 'BYPASSING CLOUDFLARE WAF...', c: '#00f2ff' },
        { i: '🧬', t: 'DECRYPTING DESTINATION HASH...', c: '#ff00ff' },
        { i: '🛰️', t: 'STABILIZING UPLINK...', c: '#718096' },
        { i: '✔️', t: 'PAYLOAD VERIFIED & EXECUTED', c: '#2ecc71' },
        { i: '🚀', t: 'OPTIMIZING CONNECTION ROUTE...', c: '#00f2ff' }
      ];
      let logIdx = 0;
      const fillInterval = setInterval(() => {
        if (logIdx < fillLogs.length) {
          queueLog(fillLogs[logIdx].i, fillLogs[logIdx].t, fillLogs[logIdx].c);
          logIdx++;
        }
      }, statusIntervalMs);
      const waitTime = Math.max(0, minProgressTime - (Date.now() - startTime));
      setTimeout(() => {
        queueLog('✅', 'All Done', '#2ecc71');
        updateProgress(100);
        clearInterval(progInterval);
        clearInterval(fillInterval);
        if (dest) setTimeout(() => { window.location.href = dest; }, 2000);
        else setTimeout(() => { document.getElementById("ft-main-overlay").remove(); }, 3000);
      }, waitTime);
    } catch (error) {
      queueLog('❌', `CRITICAL ERROR: ${error.message.toUpperCase()}`, '#ff4757');
      clearInterval(progInterval);
      setTimeout(() => { document.getElementById("ft-main-overlay").remove(); }, 3000);
    }
  }

  // ═══════════════════ INITIALIZATION ═══════════════════
  const init = async () => {
    injectStyles();
    await loadTimerFromGitHub();
    renderLogin();
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
