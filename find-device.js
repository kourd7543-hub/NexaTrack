// ========== NEXATRACK — FIND DEVICE SCRIPT ==========

const FIREBASE_URL = "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com";
const API_URL = 'https://nexa-track.vercel.app/api/location';

function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.className = 'toast', 3500);
}

function getSessionToken() {
  let token = sessionStorage.getItem('nx_session_token');
  if (!token) {
    token = 'NX-' + Math.random().toString(36).substr(2, 16).toUpperCase() + '-' + Date.now();
    sessionStorage.setItem('nx_session_token', token);
  }
  return token;
}

function saveEmergencyInfo() {
  const name   = document.getElementById('ownerName').value.trim();
  const phone  = document.getElementById('ownerPhone').value.trim();
  const reward = document.getElementById('ownerReward').value.trim();
  if (!name || !phone) { showToast('Name and phone number are required!', 'error'); return; }
  const info = { name, phone, reward, savedAt: new Date().toLocaleString('en-IN') };
  localStorage.setItem('nx_emergency_info', JSON.stringify(info));
  document.getElementById('emergencySavedBadge').style.display = 'inline-flex';
  showToast('Emergency info saved! ✅', 'success');
}

function checkEmergencyInfo() {
  const saved = localStorage.getItem('nx_emergency_info');
  if (!saved) return;
  const info = JSON.parse(saved);
  document.getElementById('ownerName').value   = info.name   || '';
  document.getElementById('ownerPhone').value  = info.phone  || '';
  document.getElementById('ownerReward').value = info.reward || '';
  document.getElementById('emergencySavedBadge').style.display = 'inline-flex';
  const isOwner = sessionStorage.getItem('nx_is_owner');
  if (!isOwner) { showLostAlert(info); }
}

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
      <span>Saved At</span>
      <strong>${info.savedAt}</strong>
    </div>
  `;
  document.getElementById('alertWaBtn').onclick  = () => sendAlertToOwner(info.phone, 'whatsapp');
  document.getElementById('alertSmsBtn').onclick = () => sendAlertToOwner(info.phone, 'sms');
  overlay.style.display = 'flex';
}

function sendAlertToOwner(ownerPhone, method) {
  const cleaned = ownerPhone.replace(/[\s\-\(\)\+]/g, '');
  if (navigator.geolocation) {
    showToast('Getting your location...', 'info');
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
    ? `\n\n📍 My current location:\n${mapsLink}`
    : '\n\n📍 (Location could not be shared)';
  const msg = encodeURIComponent(
    `🚨 I found your phone!\n\nI want to return your device.${locationText}\n\n— Sent via NexaTrack`
  );
  if (method === 'whatsapp') {
    const waNum = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
  } else {
    window.open(`sms:${cleaned}?body=${msg}`, '_blank');
  }
  showToast('Owner has been alerted! 📨', 'success');
}

function closeLostAlert() {
  sessionStorage.setItem('nx_is_owner', 'true');
  document.getElementById('lostAlert').style.display = 'none';
}

async function fbGet(code) {
  if (FIREBASE_URL.includes('YOUR-PROJECT-ID')) return null;
  try {
    const res  = await fetch(`${FIREBASE_URL}/locations/${code}.json`);
    const data = await res.json();
    return (data && data.lat) ? data : null;
  } catch { return null; }
}

function findByPhone() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (!phone) { showToast('Please enter a phone number!', 'error'); return; }
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.length < 10) { showToast('Please enter a valid phone number.', 'error'); return; }
  const siteLink = 'https://nexa-track.vercel.app/index.html?track=1';
    const msg = encodeURIComponent(`🔍 NexaTrack: Share your location here:\n${siteLink}`);
  const waNum = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  const box   = document.getElementById('lastLocationBox');
  box.innerHTML = `
    <div class="recovery-options">
      <p style="color:#e0eaff;font-size:15px;font-weight:600;margin-bottom:14px">
        <i class="fa-solid fa-mobile-screen-button" style="color:var(--accent)"></i>
        Sending request to: <strong style="color:var(--accent)">${phone}</strong>
      </p>
      <div class="recovery-btns">
        <a href="https://wa.me/${waNum}?text=${msg}" target="_blank" class="btn-whatsapp">
          <i class="fa-brands fa-whatsapp"></i> Send via WhatsApp
        </a>
        <a href="sms:${phone}?body=${msg}" class="btn-sms">
          <i class="fa-solid fa-message"></i> Send via SMS
        </a>
      </div>
      <div class="find-note" style="margin-top:12px">
        <i class="fa-solid fa-circle-info"></i>
        When the device owner opens the link and allows location — click "Watch Live Location" to see it on map.
      </div>
    </div>
  `;
  showToast('Choose method — WhatsApp or SMS!', 'success');
  document.getElementById('lastLocationBox').scrollIntoView({ behavior: 'smooth' });
}

async function findByCode() {
  const raw = document.getElementById('codeInput').value.trim().toUpperCase();
  if (!raw) { showToast('Please enter a device code!', 'error'); return; }
  showToast('Searching...', 'info');
  const fbData = await fbGet(raw);
  if (fbData) { showRecoveryResult(fbData); return; }
  const local = localStorage.getItem('ts_shared_' + raw);
  if (local) { showRecoveryResult(JSON.parse(local)); return; }
  showToast(`Code "${raw}" not found.`, 'error');
}

function showRecoveryResult(data) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  document.getElementById('lastLocationBox').innerHTML = `
    <div class="recovery-result">
      <div class="result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h4>Device Location Found!</h4>
      <div class="result-details">
        <p><i class="fa-solid fa-globe"></i>   <span>Latitude</span>  <strong>${lat.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-globe"></i>   <span>Longitude</span> <strong>${lon.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-bullseye"></i> <span>Accuracy</span> <strong>${data.accuracy} meters</strong></p>
        <p><i class="fa-solid fa-clock"></i>   <span>Time</span>      <strong>${data.time}</strong></p>
      </div>
      <div class="result-actions">
        <a href="${data.link}" target="_blank" class="btn-primary">
          <i class="fa-solid fa-map"></i> Open in Google Maps
        </a>
        <button class="btn-secondary" onclick="showOnLeaflet(${lat}, ${lon})">
          <i class="fa-solid fa-location-dot"></i> Show on Map
        </button>
        <button class="btn-secondary" onclick="copyCoords('${lat}', '${lon}')">
          <i class="fa-solid fa-copy"></i> Copy
        </button>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}" target="_blank" class="btn-secondary">
  <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
</a>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  showToast('Location found!', 'success');
}

async function loadLastKnown() {
  const box = document.getElementById('lastLocationBox');
  box.innerHTML = `<div class="no-history"><i class="fa-solid fa-spinner fa-spin"></i> Searching...</div>`;
  const saved = localStorage.getItem('ts_last_location');
  if (!saved) {
    box.innerHTML = `
      <div class="no-history">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;color:var(--danger);display:block;margin-bottom:12px"></i>
        <strong>No saved location found.</strong><br><br>
        Before losing your device, go to Home page and click <strong>"Track My Location"</strong>.<br><br>
        <a href="index.html" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;margin-top:10px;text-decoration:none">
          <i class="fa-solid fa-home"></i> Go to Home Page
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
      <h4>Last Known Location Found!</h4>
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
          <i class="fa-solid fa-location-dot"></i> Show on Map
        </button>
        <button class="btn-secondary" onclick="copyCoords('${lat}', '${lon}')">
          <i class="fa-solid fa-copy"></i> Copy
        </button>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  showToast('Last known location loaded!', 'success');
}

let liveWatchInterval = null;

async function watchLiveLocation() {
  const box = document.getElementById('lastLocationBox');
  box.innerHTML = `
    <div class="no-history">
      <i class="fa-solid fa-satellite-dish fa-beat" style="font-size:2rem;color:var(--accent);display:block;margin-bottom:12px"></i>
      <strong style="color:var(--accent)">Waiting for device...</strong><br><br>
      <small style="color:var(--text-muted)">
        As soon as the device opens the link and allows location —
        it will automatically appear on the map here
      </small><br><br>
      <button class="btn-secondary" onclick="stopWatching()" style="margin-top:8px">
        <i class="fa-solid fa-stop"></i> Stop Watching
      </button>
    </div>
  `;
  showToast('Watching for device location...', 'info');
  document.getElementById('lastLocationBox').scrollIntoView({ behavior: 'smooth' });
  liveWatchInterval = setInterval(async () => {
    try {
      const res  = await fetch(API_URL);
      if (res.status === 404) return;
      const data = await res.json();
      if (data && data.lat) {
        clearInterval(liveWatchInterval);
        showLiveResult(data);
      }
    } catch(e) { console.error('Fetch error:', e); }
  }, 3000);
  setTimeout(() => {
    clearInterval(liveWatchInterval);
    showToast('Timeout — device did not respond.', 'error');
  }, 600000);
}

function stopWatching() {
  clearInterval(liveWatchInterval);
  showToast('Stopped watching.', 'info');
}

function showLiveResult(data) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  document.getElementById('lastLocationBox').innerHTML = `
    <div class="recovery-result">
      <div class="result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h4 style="color:var(--success)">🎯 Live Location Received!</h4>
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
          <i class="fa-solid fa-location-dot"></i> Show on Map
        </button>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}" target="_blank" class="btn-secondary">
           <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
        </a>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  document.getElementById('recoveryMap').scrollIntoView({ behavior: 'smooth' });
  showToast('🎯 Live location received!', 'success');
}

let rMap = null;

function showOnLeaflet(lat, lon) {
  const mapDiv = document.getElementById('recoveryMap');
  mapDiv.style.display = 'block';
  mapDiv.style.height = '380px';
  mapDiv.style.marginTop = '20px';
  mapDiv.style.borderRadius = '12px';
  mapDiv.style.overflow = 'hidden';
  mapDiv.style.border = '1px solid rgba(26,110,245,0.3)';
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
    iconSize: [42, 42], iconAnchor: [21, 42]
  });
  L.marker([lat, lon], { icon }).addTo(rMap)
    .bindPopup(`<b style="color:#ff4d6d">Lost Device</b><br><small>${lat.toFixed(5)}, ${lon.toFixed(5)}</small>`)
    .openPopup();
  L.circle([lat, lon], { radius: 60, color: '#ff4d6d', fillColor: 'rgba(255,77,109,0.1)', fillOpacity: 0.3, weight: 1, dashArray: '6,4' }).addTo(rMap);
}

function copyCoords(lat, lon) {
  navigator.clipboard.writeText(`${lat}, ${lon}`)
    .then(() => showToast('Coordinates copied!', 'success'))
    .catch(() => showToast(`Coords: ${lat}, ${lon}`, 'info'));
}

window.onload = () => {
  checkEmergencyInfo();
};