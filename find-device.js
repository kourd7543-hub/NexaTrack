const API_URL = 'https://nexa-track.vercel.app/api/location';

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  setTimeout(() => t.className = 'toast', 3500);
}

// Copy URL
function copyText(id, btn) {
  const text = document.getElementById(id).innerText.trim();
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> &nbsp;Copied!';
    setTimeout(() => btn.innerHTML = '<i class="fa-solid fa-copy"></i> &nbsp;Copy URL', 2000);
  });
}

// Copy Tasker JSON body
function copyTaskerBody(btn) {
  const body = `{"lat": "%LOC".split(",")[0], "lon": "%LOC".split(",")[1], "accuracy": "%LOCACC", "time": "%DATE %TIME", "device": "%DEVID", "link": "https://maps.google.com/?q=%LOC"}`;
  navigator.clipboard.writeText(body).then(() => {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> &nbsp;Copied!';
    setTimeout(() => btn.innerHTML = '<i class="fa-solid fa-copy"></i> &nbsp;Copy Body', 2000);
  });
}

// Find by phone
function findByPhone() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (!phone || phone.replace(/[\s\-\(\)\+]/g, '').length < 10) {
    showToast('Valid phone number daalo!', 'error'); return;
  }
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  const waNum = cleaned.startsWith('91') ? cleaned : '91' + cleaned;
  const link = 'https://nexa-track.vercel.app/index.html?track=1';
  const msg = encodeURIComponent(`🔍 NexaTrack se location request hai.\n\nApni location share karne ke liye:\n${link}\n\n⚠️ Sirf tab karo agar aap is request ko jaante ho.`);
  document.getElementById('phoneResult').innerHTML = `
    <div class="result-box" style="margin-top:14px">
      <h4><i class="fa-solid fa-circle-check"></i> Send to ${phone}</h4>
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
  showToast('WhatsApp ya SMS choose karo!', 'success');
}

// Find by code
function findByCode() {
  const raw = document.getElementById('codeInput').value.trim().toUpperCase();
  if (!raw) { showToast('Code daalo!', 'error'); return; }
  const local = localStorage.getItem('ts_shared_' + raw);
  if (local) {
    showResult(JSON.parse(local), 'codeResult');
    return;
  }
  showToast(`"${raw}" code nahi mila.`, 'error');
}

function showResult(data, targetId) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  const el = document.getElementById(targetId);
  if (el) {
    el.innerHTML = `
      <div class="result-box" style="margin-top:14px">
        <h4><i class="fa-solid fa-circle-check"></i> Location Found!</h4>
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
  }
  showOnMap(lat, lon);
  showToast('Location mil gayi!', 'success');
}

// Watch live
let watchInterval = null;

async function watchLive() {
  document.getElementById('stopBtn').style.display = 'inline-flex';
  document.getElementById('liveBox').innerHTML = `
    <div style="text-align:center;padding:20px;color:var(--text-muted)">
      <i class="fa-solid fa-satellite-dish fa-beat" style="color:var(--accent);font-size:1.5rem;display:block;margin-bottom:10px"></i>
      <strong style="color:var(--accent)">Signal ka wait hai...</strong><br>
      <small>Jaise hi device location bhejega, yahan dikhega</small>
    </div>
  `;
  showToast('Live watch shuru...', 'info');

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
        }
      }
    } catch(e) {}
  }, 3000);

  setTimeout(() => {
    clearInterval(watchInterval);
    document.getElementById('stopBtn').style.display = 'none';
    showToast('Timeout — koi signal nahi aaya.', 'error');
  }, 300000);
}

function stopWatch() {
  clearInterval(watchInterval);
  document.getElementById('stopBtn').style.display = 'none';
  showToast('Watch band kar di.', 'info');
}

async function loadLast() {
  document.getElementById('liveBox').innerHTML = `<div class="no-data"><i class="fa-solid fa-spinner fa-spin"></i> Dhundh raha hun...</div>`;

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
      <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger)"></i><br><br>
      Koi saved location nahi mili.<br>
      <small>Tasker setup karo ya home page se "Track My Location" click karo.</small>
    </div>
  `;
}

function showLiveData(data) {
  const lat = parseFloat(data.lat);
  const lon = parseFloat(data.lon);
  document.getElementById('liveBox').innerHTML = `
    <div class="result-box">
      <h4><i class="fa-solid fa-circle-check"></i> Location Mili!</h4>
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
  showToast('Location aa gayi!', 'success');
}

// Leaflet map
let lMap = null;

function showOnMap(lat, lon) {
  const mapDiv = document.getElementById('liveMap');
  mapDiv.style.display = 'block';
  if (lMap) { lMap.setView([lat, lon], 16); return; }
  lMap = L.map('liveMap').setView([lat, lon], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(lMap);
  const icon = L.divIcon({
    className: '',
    html: `<div style="width:38px;height:38px;background:linear-gradient(135deg,#ff4d6d,#c70033);border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(255,77,109,0.8);">
      <i class="fa-solid fa-mobile-screen-button" style="transform:rotate(45deg);color:white;font-size:15px"></i></div>`,
    iconSize: [38, 38], iconAnchor: [19, 38]
  });
  L.marker([lat, lon], { icon }).addTo(lMap)
    .bindPopup(`<b style="color:#ff4d6d">Lost Device</b><br><small>${lat.toFixed(5)}, ${lon.toFixed(5)}</small>`)
    .openPopup();
}