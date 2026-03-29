// ========== NEXATRACK — FIND DEVICE SCRIPT ==========

const API_URL = 'https://nexa-track.vercel.app/api/location';

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.className = 'toast', 3500);
}

// ===== TAB SWITCH =====
function switchTab(tab) {
  document.querySelectorAll('.method-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  event.currentTarget.classList.add('active');
}

// ===== COPY CODE =====
function copyCode(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}

// ===== CEIR REPORT =====
function reportToCEIR() {
  const imei = document.getElementById('imeiInput').value.trim();
  if (!imei || imei.length < 15) {
    showToast('Please enter valid 15-digit IMEI!', 'error');
    return;
  }
  localStorage.setItem('nx_imei', imei);
  showToast('IMEI saved! Opening CEIR portal...', 'success');
  setTimeout(() => {
    window.open('https://ceir.gov.in/Home/index.jsp', '_blank');
  }, 1000);
}

// ===== FIND BY PHONE =====
function findByPhone() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (!phone) { showToast('Please enter a phone number!', 'error'); return; }
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.length < 10) { showToast('Enter valid phone number.', 'error'); return; }
  const siteLink = 'https://nexa-track.vercel.app/index.html?track=1';
  const msg = encodeURIComponent(
    `🔍 Someone is trying to locate this device using NexaTrack.\n\nIf this is your device, click the link below to share your location:\n${siteLink}\n\n⚠️ Only respond if you recognize this request.`
  );
  const waNum = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  document.getElementById('findResultBox').innerHTML = `
    <div class="quick-card" style="margin-top:16px">
      <p style="color:var(--text);font-size:15px;font-weight:600;margin-bottom:14px">
        <i class="fa-solid fa-mobile-screen-button" style="color:var(--accent)"></i>
        Sending to: <strong style="color:var(--accent)">${phone}</strong>
      </p>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a href="https://wa.me/${waNum}?text=${msg}" target="_blank" class="ceir-btn" style="background:linear-gradient(135deg,#25D366,#1da851)">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
        <a href="sms:${phone}?body=${msg}" class="btn-primary">
          <i class="fa-solid fa-message"></i> SMS
        </a>
      </div>
      <div class="warning-box" style="margin-top:14px">
        <i class="fa-solid fa-circle-info" style="color:var(--accent)"></i>
        <p>When they open the link and allow location — click "Watch Live" to see it on map.</p>
      </div>
    </div>
  `;
  showToast('Choose WhatsApp or SMS!', 'success');
}

// ===== FIND BY CODE =====
async function findByCode() {
  const raw = document.getElementById('codeInput').value.trim().toUpperCase();
  if (!raw) { showToast('Please enter a device code!', 'error'); return; }
  showToast('Searching...', 'info');
  const local = localStorage.getItem('ts_shared_' + raw);
  if (local) { showRecoveryResult(JSON.parse(local)); return; }
  showToast(`Code "${raw}" not found.`, 'error');
}

// ===== SHOW RECOVERY RESULT =====
function showRecoveryResult(data) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  document.getElementById('lastLocationBox').innerHTML = `
    <div class="recovery-result">
      <div class="result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h4>Device Location Found!</h4>
      <div class="result-details">
        <p><i class="fa-solid fa-globe"></i> <span>Latitude</span> <strong>${lat.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-globe"></i> <span>Longitude</span> <strong>${lon.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-bullseye"></i> <span>Accuracy</span> <strong>${data.accuracy}m</strong></p>
        <p><i class="fa-solid fa-clock"></i> <span>Time</span> <strong>${data.time}</strong></p>
      </div>
      <div class="result-actions">
        <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" class="btn-primary">
          <i class="fa-solid fa-map"></i> Google Maps
        </a>
        <button class="btn-secondary" onclick="showOnLeaflet(${lat}, ${lon})">
          <i class="fa-solid fa-location-dot"></i> Show on Map
        </button>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  showToast('Location found!', 'success');
}

// ===== LOAD LAST KNOWN =====
async function loadLastKnown() {
  const box = document.getElementById('lastLocationBox');
  box.innerHTML = `<div class="no-history"><i class="fa-solid fa-spinner fa-spin"></i> Searching...</div>`;

  // Try API first (Tasker would have sent here)
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      if (data && data.lat) {
        showRecoveryResult(data);
        return;
      }
    }
  } catch(e) {}

  // Fallback to localStorage
  const saved = localStorage.getItem('ts_last_location');
  if (saved) {
    showRecoveryResult(JSON.parse(saved));
    return;
  }

  box.innerHTML = `
    <div class="no-history">
      <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger);font-size:1.5rem;display:block;margin-bottom:10px"></i>
      <strong>No saved location found.</strong><br><br>
      Setup Auto-Track (Tasker) before losing your device.<br>
      <button class="btn-secondary" onclick="switchTabDirect('tasker')" style="margin-top:12px">
        <i class="fa-solid fa-robot"></i> Setup Auto-Track
      </button>
    </div>
  `;
}

function switchTabDirect(tab) {
  document.querySelectorAll('.method-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  document.querySelectorAll('.method-tab')[tab === 'imei' ? 0 : tab === 'tasker' ? 1 : 2].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== WATCH LIVE =====
let liveWatchInterval = null;

async function watchLiveLocation() {
  const box = document.getElementById('lastLocationBox');
  box.innerHTML = `
    <div class="no-history">
      <i class="fa-solid fa-satellite-dish fa-beat" style="font-size:1.8rem;color:var(--accent);display:block;margin-bottom:12px"></i>
      <strong style="color:var(--accent)">Waiting for device signal...</strong><br><br>
      <small style="color:var(--text-muted)">Location will appear automatically when device sends it</small><br><br>
      <button class="btn-secondary" onclick="stopWatching()" style="margin-top:8px">
        <i class="fa-solid fa-stop"></i> Stop
      </button>
    </div>
  `;
  showToast('Watching for live location...', 'info');
  liveWatchInterval = setInterval(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.lat) {
        const age = Date.now() - (data.updatedAt || 0);
        if (age < 600000) {
          clearInterval(liveWatchInterval);
          showRecoveryResult(data);
          showToast('🎯 Live location received!', 'success');
        }
      }
    } catch(e) {}
  }, 3000);
  setTimeout(() => {
    clearInterval(liveWatchInterval);
    showToast('Timeout — no signal received.', 'error');
  }, 600000);
}

function stopWatching() {
  clearInterval(liveWatchInterval);
  showToast('Stopped watching.', 'info');
}

// ===== LEAFLET MAP =====
let rMap = null;

function showOnLeaflet(lat, lon) {
  const mapDiv = document.getElementById('recoveryMap');
  mapDiv.style.display = 'block';
  mapDiv.style.height = '350px';
  mapDiv.style.marginTop = '16px';
  mapDiv.style.borderRadius = '12px';
  mapDiv.style.overflow = 'hidden';
  mapDiv.style.border = '1px solid rgba(26,110,245,0.3)';
  if (rMap) { rMap.setView([lat, lon], 16); return; }
  rMap = L.map('recoveryMap').setView([lat, lon], 16);
  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' });
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri' });
  street.addTo(rMap);
  L.control.layers({ 'Normal': street, 'Satellite': satellite }).addTo(rMap);
  const icon = L.divIcon({
    className: '',
    html: `<div style="width:40px;height:40px;background:linear-gradient(135deg,#ff4d6d,#c70033);border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(255,77,109,0.8);">
      <i class="fa-solid fa-mobile-screen-button" style="transform:rotate(45deg);color:white;font-size:16px"></i></div>`,
    iconSize: [40, 40], iconAnchor: [20, 40]
  });
  L.marker([lat, lon], { icon }).addTo(rMap)
    .bindPopup(`<b style="color:#ff4d6d">Lost Device</b><br><small>${lat.toFixed(5)}, ${lon.toFixed(5)}</small>`)
    .openPopup();
  L.circle([lat, lon], { radius: 60, color: '#ff4d6d', fillColor: 'rgba(255,77,109,0.1)', fillOpacity: 0.3, weight: 1 }).addTo(rMap);
}

window.onload = () => {
  const saved = localStorage.getItem('nx_imei');
  if (saved) document.getElementById('imeiInput').value = saved;
};