// ========== NEXATRACK — FIND DEVICE SCRIPT ==========

const FIREBASE_URL = "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com";
// Firebase use karna hai toh upar apna URL daalo, warna chhod do — site kaam karegi

// =============================================

function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.className = 'toast', 3500);
}

// ===== FIREBASE HELPERS =====
async function fbSave(code, data) {
  if (FIREBASE_URL.includes('YOUR-PROJECT-ID')) return false;
  try {
    const res = await fetch(`${FIREBASE_URL}/locations/${code}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch { return false; }
}

async function fbGet(code) {
  if (FIREBASE_URL.includes('YOUR-PROJECT-ID')) return null;
  try {
    const res = await fetch(`${FIREBASE_URL}/locations/${code}.json`);
    const data = await res.json();
    return (data && data.lat) ? data : null;
  } catch { return null; }
}

async function saveToFirebase(code, lat, lon, accuracy, time) {
  const data = {
    lat, lon, accuracy, time, code,
    link: `https://maps.google.com/?q=${lat},${lon}`
  };
  await fbSave(code, data);
}

// ===== METHOD 1: PHONE NUMBER =====
function findByPhone() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (!phone) { showToast('Phone number daalo!', 'error'); return; }

  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  if (cleaned.length < 10) { showToast('Valid phone number daalo (min 10 digits).', 'error'); return; }

  const siteLink = window.location.origin + '/index.html';
  const msg = encodeURIComponent(
    `🔍 Aapka device locate karne ki koshish ho rahi hai (NexaTrack se).\n\nAgar yeh aapka device hai, apni location share karne ke liye yahan click karein:\n${siteLink}\n\n⚠️ Sirf tab click karein agar aap is request ko jaante hain.`
  );

  const waNum = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  const box = document.getElementById('lastLocationBox');

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
        Jab device owner link kholega aur "Track My Location" dabayega,
        unki location Google Maps link ke through share ho jayegi.
      </div>
    </div>
  `;
  showToast('Method choose karo — WhatsApp ya SMS!', 'success');
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

  showToast(`Code "${raw}" nahi mila. Sahi code daalo ya pehle Home pe location share karo.`, 'error');
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
        <p><i class="fa-solid fa-globe"></i> <span>Latitude</span> <strong>${lat.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-globe"></i> <span>Longitude</span> <strong>${lon.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-bullseye"></i> <span>Accuracy</span> <strong>${data.accuracy} meters</strong></p>
        <p><i class="fa-solid fa-clock"></i> <span>Time</span> <strong>${data.time}</strong></p>
        ${data.code ? `<p><i class="fa-solid fa-tag"></i> <span>Code</span> <strong>${data.code}</strong></p>` : ''}
      </div>
      <div class="result-actions">
        <a href="${data.link}" target="_blank" class="btn-primary">
          <i class="fa-solid fa-map"></i> Google Maps
        </a>
        <button class="btn-secondary" onclick="showOnLeaflet(${lat}, ${lon})">
          <i class="fa-solid fa-location-dot"></i> Map pe dikhao
        </button>
        <button class="btn-secondary" onclick="copyCoords('${lat}', '${lon}')">
          <i class="fa-solid fa-copy"></i> Coords Copy
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
        Device khone se pehle Home page pe jao aur <strong>"Track My Location"</strong> click karo.
        Isse last location save ho jaayegi.<br><br>
        <a href="index.html" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;margin-top:10px;text-decoration:none">
          <i class="fa-solid fa-home"></i> Home Page pe jao
        </a>
      </div>
    `;
    return;
  }

  const data = JSON.parse(saved);
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  const googleLink = `https://maps.google.com/?q=${lat},${lon}`;

  box.innerHTML = `
    <div class="recovery-result">
      <div class="result-icon"><i class="fa-solid fa-circle-check"></i></div>
      <h4>Last Known Location Mili!</h4>
      <div class="result-details">
        <p><i class="fa-solid fa-globe"></i> <span>Latitude</span> <strong>${lat.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-globe"></i> <span>Longitude</span> <strong>${lon.toFixed(6)}</strong></p>
        <p><i class="fa-solid fa-bullseye"></i> <span>Accuracy</span> <strong>${data.accuracy} meters</strong></p>
        <p><i class="fa-solid fa-clock"></i> <span>Recorded</span> <strong>${data.time}</strong></p>
      </div>
      <div class="result-actions">
        <a href="${googleLink}" target="_blank" class="btn-primary">
          <i class="fa-solid fa-map"></i> Google Maps
        </a>
        <button class="btn-secondary" onclick="showOnLeaflet(${lat}, ${lon})">
          <i class="fa-solid fa-location-dot"></i> Map pe dikhao
        </button>
        <button class="btn-secondary" onclick="copyCoords('${lat}', '${lon}')">
          <i class="fa-solid fa-copy"></i> Coords Copy
        </button>
      </div>
    </div>
  `;
  showOnLeaflet(lat, lon);
  showToast('Last known location load ho gayi!', 'success');
}

// ===== LEAFLET MAP =====
let rMap = null;

function showOnLeaflet(lat, lon) {
  const mapDiv = document.getElementById('recoveryMap');
  mapDiv.style.display = 'block';
  mapDiv.style.height = '380px';
  mapDiv.style.marginTop = '20px';
  mapDiv.style.borderRadius = '12px';
  mapDiv.style.overflow = 'hidden';
  mapDiv.style.border = '1px solid rgba(26,110,245,0.3)';

  if (rMap) {
    rMap.setView([lat, lon], 16);
    return;
  }

  rMap = L.map('recoveryMap').setView([lat, lon], 16);

  const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  });
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '© Esri'
  });
  street.addTo(rMap);
  L.control.layers({ 'Normal': street, 'Satellite': satellite }).addTo(rMap);

  const icon = L.divIcon({
    className: '',
    html: `<div style="
      width:42px;height:42px;
      background:linear-gradient(135deg,#ff4d6d,#c70033);
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 20px rgba(255,77,109,0.8);
      border:2px solid rgba(255,255,255,0.3);">
      <i class="fa-solid fa-mobile-screen-button" style="transform:rotate(45deg);color:white;font-size:17px"></i>
    </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42]
  });

  L.marker([lat, lon], { icon }).addTo(rMap)
    .bindPopup(`<b style="color:#ff4d6d"><i class="fa-solid fa-mobile-screen-button"></i> Lost Device</b><br><small>${lat.toFixed(5)}, ${lon.toFixed(5)}</small>`)
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