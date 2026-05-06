const API_URL = 'https://nexa-track.vercel.app/api/location';

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
 setTimeout(() => t.className = 'toast', 12000);
}

// ===== FIND BY PHONE =====
function findByPhone() {
  const phone = document.getElementById('phoneInput').value.trim();
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (!phone || cleaned.length < 10) {
    showToast('Please enter a valid phone number!', 'error');
    return;
  }
  const waNum = cleaned.startsWith('91') ? cleaned : '91' + cleaned;
  const link = 'https://nexa-track.vercel.app/index.html?track=1';
  const msg = encodeURIComponent(
  `Location request: ${link}`
);
  document.getElementById('phoneResult').innerHTML = `
    <div class="result-box">
      <h4><i class="fa-solid fa-circle-check"></i> REQUEST READY — ${phone}</h4>
      <div class="result-actions">
        <a href="https://wa.me/${waNum}?text=${msg}" target="_blank" class="wa-btn">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
        <a href="sms:${phone}?body=${msg}" class="btn-primary" style="text-decoration:none">
          <i class="fa-solid fa-message"></i> SMS
        </a>
      </div>
    </div>
  `;
  showToast('Choose WhatsApp or SMS to send!', 'success');
}

// ===== FIND BY CODE =====
function findByCode() {
  const raw = document.getElementById('codeInput').value.trim().toUpperCase();
  if (!raw) { showToast('Please enter a share code!', 'error'); return; }
  const local = localStorage.getItem('ts_shared_' + raw);
  if (local) {
    const data = JSON.parse(local);
    const lat = parseFloat(data.lat);
    const lon = parseFloat(data.lon);
    document.getElementById('codeResult').innerHTML = `
      <div class="result-box">
        <h4><i class="fa-solid fa-circle-check"></i> LOCATION FOUND</h4>
        <div class="result-row"><span>Latitude</span><strong>${lat.toFixed(6)}</strong></div>
        <div class="result-row"><span>Longitude</span><strong>${lon.toFixed(6)}</strong></div>
        <div class="result-row"><span>Accuracy</span><strong>${data.accuracy}m</strong></div>
        <div class="result-row"><span>Time</span><strong>${data.time}</strong></div>
        <div class="result-actions">
          <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" class="btn-primary" style="text-decoration:none">
            <i class="fa-solid fa-map"></i> Google Maps
          </a>
        </div>
      </div>
    `;
    showOnMap(lat, lon);
    showToast('Location found!', 'success');
    return;
  }
  showToast(`"${raw}" code not found.`, 'error');
}

// ===== WATCH LIVE =====
let watchInterval = null;

function watchLive() {
  document.getElementById('stopBtn').style.display = 'inline-flex';
  document.getElementById('liveBox').innerHTML = `
    <div class="no-data">
      <i class="fa-solid fa-satellite-dish fa-beat" style="color:var(--accent);font-size:1.5rem;display:block;margin-bottom:10px"></i>
      <strong style="color:var(--accent)">Waiting for signal...</strong><br>
      <small>As soon as the device shares location, it will appear here.</small>
    </div>
  `;
  showToast('Live watch started...', 'info');

  watchInterval = setInterval(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.lat) {
        const age = Date.now() - (data.updatedAt || 0);
        if (age < 600000) {
          clearInterval(watchInterval);
          document.getElementById('stopBtn').style.display = 'none';
          showLiveData(data);
          showToast('🎯 Live location received!', 'success');
        }
      }
    } catch(e) {}
  }, 3000);

  setTimeout(() => {
    clearInterval(watchInterval);
    document.getElementById('stopBtn').style.display = 'none';
    showToast('Timeout — no signal received.', 'error');
  }, 300000);
}

function stopWatch() {
  clearInterval(watchInterval);
  document.getElementById('stopBtn').style.display = 'none';
  showToast('Live watch stopped.', 'info');
}

// ===== LOAD LAST KNOWN =====
async function loadLast() {
  document.getElementById('liveBox').innerHTML = `
    <div class="no-data">
      <i class="fa-solid fa-spinner fa-spin" style="color:var(--accent);font-size:1.2rem;display:block;margin-bottom:8px"></i>
      Searching...
    </div>
  `;

  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      if (data && data.lat) { showLiveData(data); return; }
    }
  } catch(e) {}

  const saved = localStorage.getItem('ts_last_location');
  if (saved) { showLiveData(JSON.parse(saved)); return; }

  document.getElementById('liveBox').innerHTML = `
    <div class="no-data">
      <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger);font-size:1.3rem;display:block;margin-bottom:10px"></i>
      No saved location found.<br>
      <small>Home page pe "Track My Location" click karo aur "Share Location" karo — tab yahan dikhega.</small>
    </div>
  `;
}

// ===== SHOW LIVE DATA =====
function showLiveData(data) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  document.getElementById('liveBox').innerHTML = `
    <div class="result-box">
      <h4><i class="fa-solid fa-circle-check"></i> LOCATION FOUND</h4>
      <div class="result-row"><span>Latitude</span><strong>${lat.toFixed(6)}</strong></div>
      <div class="result-row"><span>Longitude</span><strong>${lon.toFixed(6)}</strong></div>
      <div class="result-row"><span>Accuracy</span><strong>${data.accuracy}m</strong></div>
      <div class="result-row"><span>Time</span><strong>${data.time}</strong></div>
      <div class="result-actions">
        <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" class="btn-primary" style="text-decoration:none">
          <i class="fa-solid fa-map"></i> Google Maps
        </a>
        <button class="btn-secondary" onclick="navigator.clipboard.writeText('${lat}, ${lon}').then(()=>showToast('Copied!','success'))">
          <i class="fa-solid fa-copy"></i> Copy
        </button>
      </div>
    </div>
  `;
  showOnMap(lat, lon);
}

// ===== LEAFLET MAP =====
let lMap = null;

function showOnMap(lat, lon) {
  const mapDiv = document.getElementById('liveMap');
  mapDiv.style.display = 'block';
  if (lMap) { lMap.setView([lat, lon], 16); return; }
  lMap = L.map('liveMap').setView([lat, lon], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(lMap);
  const icon = L.divIcon({
    className: '',
    html: `<div style="width:38px;height:38px;background:linear-gradient(135deg,#ff4d6d,#c70033);border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(255,77,109,0.8);">
      <i class="fa-solid fa-mobile-screen-button" style="transform:rotate(45deg);color:white;font-size:15px"></i>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38]
  });
  L.marker([lat, lon], { icon }).addTo(lMap)
    .bindPopup(`<b style="color:#ff4d6d">Lost Device</b><br><small>${lat.toFixed(5)}, ${lon.toFixed(5)}</small>`)
    .openPopup();
}