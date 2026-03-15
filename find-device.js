// ========== NEXATRACK — FIND DEVICE SCRIPT ==========

const FIREBASE_URL = "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com";
const API_URL = 'https://nexatrack.netlify.app/.netlify/functions/location';

function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.className = 'toast', 3500);
}

// ===== SESSION TOKEN =====
function getSessionToken() {
  let token = sessionStorage.getItem('nx_session_token');
  if (!token) {
    token = 'NX-' + Math.random().toString(36).substr(2, 16).toUpperCase() + '-' + Date.now();
    sessionStorage.setItem('nx_session_token', token);
  }
  return token;
}

// ===== EMERGENCY INFO SAVE =====
function saveEmergencyInfo() {
  const name   = document.getElementById('ownerName').value.trim();
  const phone  = document.getElementById('ownerPhone').value.trim();
  const reward = document.getElementById('ownerReward').value.trim();

  if (!name || !phone) {
    showToast('Naam aur phone number dono zaroori hain!', 'error');
    return;
  }

  const info = { name, phone, reward, savedAt: new Date().toLocaleString('en-IN') };
  localStorage.setItem('nx_emergency_info', JSON.stringify(info));
  document.getElementById('emergencySavedBadge').style.display = 'inline-flex';
  showToast('Emergency info save ho gayi! ✅', 'success');
}

// ===== CHECK EMERGENCY INFO ON PAGE OPEN =====
function checkEmergencyInfo() {
  const saved = localStorage.getItem('nx_emergency_info');
  if (!saved) return;

  const info = JSON.parse(saved);
  document.getElementById('ownerName').value   = info.name   || '';
  document.getElementById('ownerPhone').value  = info.phone  || '';
  document.getElementById('ownerReward').value = info.reward || '';
  document.getElementById('emergencySavedBadge').style.display = 'inline-flex';

  const isOwner = sessionStorage.getItem('nx_is_owner');
  if (!isOwner) {
    showLostAlert(info);
  }
}

// ===== SHOW LOST DEVICE ALERT =====
function showLostAlert(info) {
  const overlay = document.getElementById('lostAlert');
  const display = document.getElementById('ownerInfoDisplay');

  display.innerHTML = `
    <div class="owner-info-row">
      <i class="fa-solid fa-user"></i>
      <span>Owner</span>
      <strong>${info.name}</strong>
    </div>
    <div class="owner-info-row">
      <i class="fa-solid fa-phone"></i>
      <span>Contact</span>
      <strong>${info.phone}</strong>
    </div>
    ${info.reward ? `
    <div class="owner-info-row">
      <i class="fa-solid fa-gift"></i>
      <span>Reward</span>
      <strong style="color:var(--accent2)">${info.reward}</strong>
    </div>` : ''}
    <div class="owner-info-row">
      <i class="fa-solid fa-clock"></i>
      <span>Info Saved</span>
      <strong>${info.savedAt}</strong>
    </div>
  `;

  document.getElementById('alertWaBtn').onclick  = () => sendAlertToOwner(info.phone, 'whatsapp');
  document.getElementById('alertSmsBtn').onclick = () => sendAlertToOwner(info.phone, 'sms');
  overlay.style.display = 'flex';
}

// ===== SEND ALERT TO OWNER =====
function sendAlertToOwner(ownerPhone, method) {
  const cleaned = ownerPhone.replace(/[\s\-\(\)\+]/g, '');
  if (navigator.geolocation) {
    showToast('Location dhundh raha hoon...', 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        sendAlert(cleaned, `https://maps.google.com/?q=${lat},${lon}`, method);
      },
      () => sendAlert(cleaned, null, method),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  } else {
    sendAlert(cleaned, null, method);
  }
}

function sendAlert(cleaned, mapsLink, method) {
  const locationText = mapsLink
    ? `\n\n📍 Meri current location:\n${mapsLink}`
    : '\n\n📍 (Location share nahi ho payi)';

  const msg = encodeURIComponent(
    `🚨 Aapka phone mujhe mila hai!\n\nMai aapka device return karna chahta hoon.${locationText}\n\n— NexaTrack ke zariye bheja gaya`
  );

  if (method === 'whatsapp') {
    const waNum = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
  } else {
    window.open(`sms:${cleaned}?body=${msg}`, '_blank');
  }
  showToast('Owner ko alert bhej diya! 📨', 'success');
}

// ===== CLOSE ALERT =====
function closeLostAlert() {
  sessionStorage.setItem('nx_is_owner', 'true');
  document.getElementById('lostAlert').style.display = 'none';
}

// ===== FIREBASE HELPER =====
async function fbGet(code) {
  if (FIREBASE_URL.includes('YOUR-PROJECT-ID')) return null;
  try {
    const res  = await fetch(`${FIREBASE_URL}/locations/${code}.json`);
    const data = await res.json();
    return (data && data.lat) ? data : null;
  } catch { return null; }
}

// ===== METHOD 1: PHONE NUMBER =====
function findByPhone() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (!phone) { showToast('Phone number daalo!', 'error'); return; }

  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.length < 10) { showToast('Valid phone number daalo.', 'error'); return; }

  const siteLink = 'https://nexatrack.netlify.app/index.html?track=1';
  const msg = encodeURIComponent(
    `🔍 Aapka device locate karne ki koshish ho rahi hai (NexaTrack se).\n\nAgar yeh aapka device hai, apni location share karne ke liye yahan click karein:\n${siteLink}\n\n⚠️ Sirf tab click karein agar aap is request ko jaante hain.`
  );

  const waNum = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  const box   = document.getElementById('lastLocationBox');

  box.innerHTML = `
    <div class="recovery-options">
      <p style="color:#e0eaff;font-size:15px;font-weight:600;margin-bottom:14px">
        <i class="fa-solid fa-mobile-screen-button" style="color:var(--accent)"></i>
        Request bhej rahe hain: <strong style="color:var(--accent)">${phone}</strong>
      </p>
      <div class="recovery-btns">
        <a href="https://wa.me/${waNum}?text=${msg}" target="_blank" class="btn-whatsapp">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp se bhejo
        </a>
        <a href="sms:${phone}?body=${msg}" class="btn-sms">
          <i class="fa-solid fa-message"></i> SMS se bhejo
        </a>
      </div>
      <div class="find-note" style="margin-top:12px">
        <i class="fa-solid fa-circle-info"></i>
        Jab device owner link kholega aur location allow karega —
        "Watch Live Location" button dabao map pe dikhegi.
      </div>
    </div>
  `;
  showToast('Request bhejo — phir Watch Live Location dabao!', 'success');
}

// ===== METHOD 2: CODE =====
async function findByCode() {
  const raw = document.getElementById('codeInput').value.trim().toUpperCase();
  if (!raw) { showToast('Device code daalo!', 'error'); return; }

  showToast('Dhundh raha hoon...', 'info');

  const fbData = await fbGet(raw);
  if (fbData) { showRecoveryResult(fbData); return; }

  const local = localStorage.getItem('ts_shared_' + raw);
  if (local) { showRecoveryResult(JSON.parse(local)); return; }

  showToast(`Code "${raw}" nahi mila.`, 'error');
}

// ===== SHOW RESULT =====
function showRecoveryResult(data) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  const box = document.getElementById('lastLocationBox');

  box.innerHTML = `
    <div class="recovery-result">
      <div class="result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h4>Device Location Mili!</h4>
      <div class="result-details">
        <p><i class="fa-solid fa-globe"></i> <span>Latitude</span>  <strong>${lat.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-globe"></i> <span>Longitude</span> <strong>${lon.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-bullseye"></i> <span>Accuracy</span> <strong>${data.accuracy} meters</strong></p>
        <p><i class="fa-solid fa-clock"></i> <span>Time</span> <strong>${data.time}</strong></p>
      </div>
      <div class="result-actions">
        <a href="${data.link}" target="_blank" class="btn-primary">
          <i class="fa-solid fa-map"></i> Google Maps
        </a>
        <button class="btn-secondary" onclick="showOnLeaflet(${lat}, ${lon})">
          <i class="fa-solid fa-location-dot"></i> Map pe dikhao
        </button>
        <button class="btn-secondary" onclick="copyCoords('${lat}', '${lon}')">
          <i class="fa-solid fa-copy"></i> Copy
        </button>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  showToast('Location mil gayi!', 'success');
}

// ===== MY LOST DEVICE =====
async function loadLastKnown() {
  const box = document.getElementById('lastLocationBox');
  box.innerHTML = `<div class="no-history"><i class="fa-solid fa-spinner fa-spin"></i> Dhundh raha hoon...</div>`;

  const saved = localStorage.getItem('ts_last_location');
  if (!saved) {
    box.innerHTML = `
      <div class="no-history">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;color:var(--danger);display:block;margin-bottom:12px"></i>
        <strong>Koi saved location nahi mili.</strong><br><br>
        Device khone se pehle Home page pe jao aur <strong>"Track My Location"</strong> click karo.<br><br>
        <a href="index.html" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;margin-top:10px;text-decoration:none">
          <i class="fa-solid fa-home"></i> Home Page pe jao
        </a>
      </div>
    `;
    return;
  }

  const data = JSON.parse(saved);
  const lat  = parseFloat(data.lat);
  const lon  = parseFloat(data.lon);

  document.getElementById('lastLocationBox').innerHTML = `
    <div class="recovery-result">
      <div class="result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h4>Last Known Location Mili!</h4>
      <div class="result-details">
        <p><i class="fa-solid fa-globe"></i>   <span>Latitude</span>  <strong>${lat.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-globe"></i>   <span>Longitude</span> <strong>${lon.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-bullseye"></i> <span>Accuracy</span> <strong>${data.accuracy} meters</strong></p>
        <p><i class="fa-solid fa-clock"></i>   <span>Recorded</span>  <strong>${data.time}</strong></p>
      </div>
      <div class="result-actions">
        <a href="https://maps.google.com/?q=${lat},${lon}" target="_blank" class="btn-primary">
          <i class="fa-solid fa-map"></i> Google Maps
        </a>
        <button class="btn-secondary" onclick="showOnLeaflet(${lat}, ${lon})">
          <i class="fa-solid fa-location-dot"></i> Map pe dikhao
        </button>
        <button class="btn-secondary" onclick="copyCoords('${lat}', '${lon}')">
          <i class="fa-solid fa-copy"></i> Copy
        </button>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  showToast('Last known location load ho gayi!', 'success');
}

// ===== LIVE LOCATION WATCH =====
let liveWatchInterval = null;

async function watchLiveLocation() {
  const box = document.getElementById('lastLocationBox');
  box.innerHTML = `
    <div class="no-history">
      <i class="fa-solid fa-satellite-dish fa-beat" style="font-size:2rem;color:var(--accent);display:block;margin-bottom:12px"></i>
      <strong style="color:var(--accent)">Waiting for device...</strong><br><br>
      <small style="color:var(--text-muted)">
        Jaise hi device link kholega aur location allow karega —
        yahan automatically map pe dikhegi
      </small><br><br>
      <button class="btn-secondary" onclick="stopWatching()" style="margin-top:8px">
        <i class="fa-solid fa-stop"></i> Stop Watching
      </button>
    </div>
  `;

  showToast('Watching for device location...', 'info');

  liveWatchInterval = setInterval(async () => {
    try {
      const res  = await fetch(API_URL);
      if (res.status === 404) return;
      const data = await res.json();
      if (data && data.lat) {
        const age = Date.now() - data.updatedAt;
        if (age < 120000) {
          clearInterval(liveWatchInterval);
          showLiveResult(data);
        }
      }
    } catch(e) { console.error('Fetch error:', e); }
  }, 3000);

  setTimeout(() => {
    clearInterval(liveWatchInterval);
    showToast('Timeout — device ne respond nahi kiya.', 'error');
  }, 300000);
}

function stopWatching() {
  clearInterval(liveWatchInterval);
  showToast('Watching band kar diya.', 'info');
}

function showLiveResult(data) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);

  document.getElementById('lastLocationBox').innerHTML = `
    <div class="recovery-result">
      <div class="result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h4 style="color:var(--success)">🎯 Live Location Aa Gayi!</h4>
      <div class="result-details">
        <p><i class="fa-solid fa-globe"></i>   <span>Latitude</span>  <strong>${lat.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-globe"></i>   <span>Longitude</span> <strong>${lon.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-bullseye"></i> <span>Accuracy</span> <strong>${data.accuracy} meters</strong></p>
        <p><i class="fa-solid fa-clock"></i>   <span>Time</span>      <strong>${data.time}</strong></p>
      </div>
      <div class="result-actions">
        <a href="${data.link}" target="_blank" class="btn-primary">
          <i class="fa-solid fa-map"></i> Google Maps
        </a>
        <button class="btn-secondary" onclick="showOnLeaflet(${lat}, ${lon})">
          <i class="fa-solid fa-location-dot"></i> Map pe dikhao
        </button>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  showToast('🎯 Live location aa gayi!', 'success');
}

// ===== LEAFLET MAP =====
let rMap = null;

function showOnLeaflet(lat, lon) {
  const mapDiv = document.getElementById('recoveryMap');
  mapDiv.style.display    = 'block';
  mapDiv.style.height     = '380px';
  mapDiv.style.marginTop  = '20px';
  mapDiv.style.borderRadius = '12px';
  mapDiv.style.overflow   = 'hidden';
  mapDiv.style.border     = '1px solid rgba(26,110,245,0.3)';

  if (rMap) { rMap.setView([lat, lon], 16); return; }

  rMap = L.map('recoveryMap').setView([lat, lon], 16);
  const street    = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' });
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri' });
  street.addTo(rMap);
  L.control.layers({ 'Normal': street, 'Satellite': satellite }).addTo(rMap);

  const icon = L.divIcon({
    className: '',
    html: `<div style="width:42px;height:42px;background:linear-gradient(135deg,#ff4d6d,#c70033);border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(255,77,109,0.8);border:2px solid rgba(255,255,255,0.3);">
      <i class="fa-solid fa-mobile-screen-button" style="transform:rotate(45deg);color:white;font-size:17px"></i></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42]
  });

  L.marker([lat, lon], { icon }).addTo(rMap)
    .bindPopup(`<b style="color:#ff4d6d">Lost Device</b><br><small>${lat.toFixed(5)}, ${lon.toFixed(5)}</small>`)
    .openPopup();

  L.circle([lat, lon], {
    radius: 60, color: '#ff4d6d',
    fillColor: 'rgba(255,77,109,0.1)',
    fillOpacity: 0.3, weight: 1, dashArray: '6,4'
  }).addTo(rMap);
}

// ===== COPY COORDS =====
function copyCoords(lat, lon) {
  navigator.clipboard.writeText(`${lat}, ${lon}`)
    .then(() => showToast('Coordinates copy ho gayi!', 'success'))
    .catch(() => showToast(`Coords: ${lat}, ${lon}`, 'info'));
}

// ===== INIT =====
window.onload = () => {
  checkEmergencyInfo();
};