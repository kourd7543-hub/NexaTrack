// ========== NEXATRACK - MAIN SCRIPT ==========

let map, marker, watchId;
let locationHistory = [];
let updateCount = 0;
let isWatching = false;
let currentLat, currentLon;

// ===== EMAILJS CONFIG =====
const EMAILJS_PUBLIC_KEY  = "OOz4aGeqgL4JrEJ50";
const EMAILJS_SERVICE_ID  = "service_wa5tq7l";
const EMAILJS_TEMPLATE_ID = "template_d0gcm5t";

// ===== SESSION TOKEN & ENCRYPTION =====
function getSessionToken() {
  let token = sessionStorage.getItem('nx_session_token');
  if (!token) {
    token = 'NX-' + Math.random().toString(36).substr(2, 16).toUpperCase() + '-' + Date.now();
    sessionStorage.setItem('nx_session_token', token);
  }
  return token;
}

function encryptData(data) {
  const token = getSessionToken();
  const str = JSON.stringify(data);
  let encrypted = '';
  for (let i = 0; i < str.length; i++) {
    encrypted += String.fromCharCode(str.charCodeAt(i) ^ token.charCodeAt(i % token.length));
  }
  return btoa(encrypted);
}

function decryptData(encrypted) {
  try {
    const token = getSessionToken();
    const str = atob(encrypted);
    let decrypted = '';
    for (let i = 0; i < str.length; i++) {
      decrypted += String.fromCharCode(str.charCodeAt(i) ^ token.charCodeAt(i % token.length));
    }
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}

function secureSave(key, data) {
  const token = getSessionToken();
  const payload = {
    token: token,
    data: encryptData(data),
    time: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

function secureGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (payload.token !== getSessionToken()) return null;
    return decryptData(payload.data);
  } catch {
    return null;
  }
}

// ========== LOAD HISTORY ==========
function loadHistory() {
  const saved = localStorage.getItem('ts_history');
  if (saved) {
    locationHistory = JSON.parse(saved);
    if (document.getElementById('history-list')) {
      renderHistory();
    }
  }
}

function saveHistory() {
  localStorage.setItem('ts_history', JSON.stringify(locationHistory.slice(0, 50)));
}

// ========== MAIN TRACKING ==========
function startTracking() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported by this browser.', 'error');
    return;
  }
  showToast('Fetching your location...', 'info');
  navigator.geolocation.getCurrentPosition(showPosition, showError, {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  });
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const accuracy = Math.round(position.coords.accuracy);
  const altitude = position.coords.altitude ? Math.round(position.coords.altitude) + ' m' : 'N/A';
  const speed = position.coords.speed ? (position.coords.speed * 3.6).toFixed(1) + ' km/h' : 'N/A';
  const time = new Date().toLocaleString('en-IN');

  currentLat = lat;
  currentLon = lon;
  updateCount++;

  document.getElementById('lat').innerText = lat.toFixed(6);
  document.getElementById('lon').innerText = lon.toFixed(6);
  document.getElementById('accuracy').innerText = accuracy + ' meters';
  document.getElementById('altitude').innerText = altitude;
  document.getElementById('speed').innerText = speed;
  document.getElementById('time').innerText = time;

  document.getElementById('stat-accuracy').innerText = accuracy;
  document.getElementById('stat-speed').innerText = position.coords.speed ? (position.coords.speed * 3.6).toFixed(1) : '0';
  document.getElementById('stat-updates').innerText = updateCount;

  const entry = { lat: lat.toFixed(6), lon: lon.toFixed(6), accuracy, time, address: '' };
  locationHistory.unshift(entry);
  saveHistory();

  localStorage.setItem('ts_last_location', JSON.stringify({ lat, lon, accuracy, time }));
  secureSave('ts_last_location_secure', { lat, lon, accuracy, time });

  if (typeof hideGlobe === 'function') hideGlobe();

  if (!map) {
    map = L.map('map').setView([lat, lon], 16);
    const normal = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    });
    L.control.layers({ 'Normal Map': normal, 'Satellite View': satellite }).addTo(map);

    const customIcon = L.divIcon({
      className: '',
      html: '<div class="custom-marker"><i class="fa-solid fa-location-dot"></i></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
    marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
  } else {
    map.setView([lat, lon], 16);
    marker.setLatLng([lat, lon]);
  }

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(r => r.json())
    .then(data => {
      const place = data.display_name;
      document.getElementById('address').innerText = place;
      locationHistory[0].address = place;
      saveHistory();
      renderHistory();
      marker.bindPopup(`
        <div class="popup-content">
          <b><i class="fa-solid fa-location-dot"></i> Your Location</b><br>
          <small>${place}</small><br>
          <small>Accuracy: ${accuracy} m | ${time}</small>
        </div>
      `).openPopup();
    })
    .catch(() => {
      renderHistory();
    });

  showToast('Location tracked successfully!', 'success');
  document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

// ========== LIVE WATCH MODE ==========
function toggleWatch() {
  const btn = document.getElementById('watchBtn');
  if (isWatching) {
    navigator.geolocation.clearWatch(watchId);
    isWatching = false;
    btn.innerHTML = '<i class="fa-solid fa-play"></i> Start Live Watch';
    btn.classList.remove('active-watch');
    showToast('Live watch stopped.', 'info');
  } else {
    if (!navigator.geolocation) { showToast('Geolocation not supported.', 'error'); return; }
    watchId = navigator.geolocation.watchPosition(showPosition, showError, {
      enableHighAccuracy: true, timeout: 15000, maximumAge: 5000
    });
    isWatching = true;
    btn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Live Watch';
    btn.classList.add('active-watch');
    showToast('Live watch started! Location updates automatically.', 'success');
  }
}

// ========== HISTORY ==========
function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;
  if (locationHistory.length === 0) {
    list.innerHTML = '<div class="no-history">No history yet. Click Track to begin.</div>';
    return;
  }
  list.innerHTML = locationHistory.slice(0, 10).map((h, i) => `
    <div class="history-item" onclick="jumpToLocation(${h.lat}, ${h.lon})">
      <div class="history-num">${i + 1}</div>
      <div class="history-details">
        <div class="history-coords">${h.lat}, ${h.lon}</div>
        <div class="history-address">${h.address || 'Fetching address...'}</div>
        <div class="history-time"><i class="fa-solid fa-clock"></i> ${h.time}</div>
      </div>
      <div class="history-acc">${h.accuracy}m</div>
    </div>
  `).join('');
}

function jumpToLocation(lat, lon) {
  if (map) {
    map.setView([lat, lon], 16);
    if (marker) marker.setLatLng([lat, lon]);
  }
}

function clearHistory() {
  if (confirm('Clear all location history?')) {
    locationHistory = [];
    saveHistory();
    if (document.getElementById('history-list')) {
      renderHistory();
    }
    showToast('History cleared.', 'info');
  }
}

// ========== SHARE LOCATION ==========
function shareLocation() {
  if (!currentLat) {
    showToast('Please track your location first!', 'error');
    return;
  }
  const code = 'TS-' + Math.floor(10000 + Math.random() * 90000);
  const link = `https://maps.google.com/?q=${currentLat},${currentLon}`;
  const accuracy = document.getElementById('accuracy').innerText.replace(' meters', '');
  const time = new Date().toLocaleString('en-IN');

  const shareData = { lat: currentLat, lon: currentLon, code, link, time, accuracy };

  localStorage.setItem('ts_shared_' + code, JSON.stringify(shareData));
  secureSave('ts_shared_' + code, shareData);

  const box = document.getElementById('shareLinkBox');
  document.getElementById('shareLink').value = `${link} (Code: ${code})`;
  box.style.display = 'flex';
  showToast(`Share link ready! Code: ${code}`, 'success');
}

function copyShareLink() {
  if (!currentLat) {
    showToast('Please track your location first!', 'error');
    return;
  }
  shareLocation();
}

function sendWhatsApp() {
  if (!currentLat) { showToast('Track location first!', 'error'); return; }
  const msg = encodeURIComponent(`My live location: https://maps.google.com/?q=${currentLat},${currentLon}\n\nShared via NexaTrack`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function sendSMS() {
  if (!currentLat) { showToast('Track location first!', 'error'); return; }
  const msg = encodeURIComponent(`My location: https://maps.google.com/?q=${currentLat},${currentLon}`);
  window.open(`sms:?body=${msg}`, '_blank');
}

function copyToClipboard() {
  const input = document.getElementById('shareLink');
  input.select();
  document.execCommand('copy');
  showToast('Link copied to clipboard!', 'success');
}

// ========== CONTACT FORM — EMAILJS ==========
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  if (typeof emailjs === 'undefined') {
    console.error('EmailJS load nahi hua');
    return;
  }

  emailjs.init(EMAILJS_PUBLIC_KEY);

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    const templateParams = {
      from_name:  document.getElementById('from_name').value,
      from_email: document.getElementById('from_email').value,
      message:    document.getElementById('message').value
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        showToast('Message sent successfully!', 'success');
        form.reset();
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        btn.disabled = false;
      })
      .catch((error) => {
        showToast('Failed to send. Please try again!', 'error');
        console.error('EmailJS Error:', JSON.stringify(error));
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        btn.disabled = false;
      });
  });
}

// ========== ERROR HANDLING ==========
function showError(error) {
  const msgs = {
    1: 'Location permission denied. Please allow location access.',
    2: 'Location information unavailable.',
    3: 'Location request timed out. Try again.'
  };
  showToast(msgs[error.code] || 'Unknown error occurred.', 'error');
}

// ========== TOAST ==========
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.className = 'toast', 3500);
}

// ========== INIT ==========
window.onload = () => {
  loadHistory();
  initContactForm();
};