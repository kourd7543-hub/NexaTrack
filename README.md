# 🌍 NexaTrack — Real-Time Location Intelligence Platform

![NexaTrack Banner](background.jpg)

> A modern, privacy-first web application for real-time GPS location tracking, location history, device recovery, and secure location sharing — all without any backend server.

---

## 🚀 Live Demo

> Deploy on [Netlify](https://netlify.com) for free HTTPS hosting — required for Geolocation API to work properly.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📍 **Live GPS Tracking** | Real-time location detection using browser Geolocation API |
| 🗺️ **Interactive Map** | Leaflet.js map with Normal + Satellite view toggle |
| 📜 **Location History** | Last 10 locations saved with timestamps and addresses |
| 🔗 **Share Location** | Generate unique TS-XXXXX codes to share location |
| 📱 **Device Recovery** | Find lost device via phone number, share code, or last known location |
| 💬 **WhatsApp & SMS** | Send location directly via WhatsApp or SMS |
| 🔒 **Privacy First** | All data encrypted with session tokens — no backend, no server storage |
| 📧 **Contact Form** | EmailJS powered contact form — messages direct to Gmail |
| 🌐 **Animated Globe** | 3D rotating globe shown before tracking starts |
| ✨ **Particle Background** | Animated particle network on all pages |

---

## 📁 Project Structure

```
NexaTrack/
│
├── index.html            # Main page — tracking dashboard
├── about.html            # About page with feature links
├── contact.html          # Contact form with EmailJS
├── find-device.html      # Lost device recovery page
├── privacy.html          # Privacy policy page
├── live-tracking.html    # Live tracking feature detail
├── interactive-map.html  # Interactive map feature detail
│
├── script.js             # Main JS — tracking, history, share, EmailJS
├── find-device.js        # Find device logic — phone, code, last known
├── globe.js              # Animated 3D globe (canvas)
├── particles.js          # Particle background animation
│
├── style.css             # Full dark tech theme styling
└── background.jpg        # Hero background image
```

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom dark tech theme (Orbitron + Rajdhani fonts)
- **Vanilla JavaScript** — No frameworks
- **Leaflet.js** — Interactive maps
- **OpenStreetMap** — Free map tiles
- **ESRI Satellite** — Satellite view tiles
- **Nominatim API** — Reverse geocoding (address from coordinates)
- **EmailJS** — Contact form email delivery
- **Canvas API** — Animated globe and particles
- **localStorage + sessionStorage** — Encrypted local data storage

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nexatrack.git
cd nexatrack
```

### 2. Open with Live Server

> ⚠️ **Important:** Geolocation API requires `localhost` or `HTTPS`. Do NOT open `index.html` directly as a file.

- Install **Live Server** extension in VS Code
- Right click `index.html` → **Open with Live Server**
- Site opens at `http://127.0.0.1:5500`

### 3. Setup EmailJS (Contact Form)

1. Go to [emailjs.com](https://www.emailjs.com) → Create free account
2. Add Gmail service → Copy **Service ID**
3. Create "Contact Us" template → Copy **Template ID**
4. Go to Account → General → Copy **Public Key**
5. Open `script.js` and update these lines:

```javascript
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
```

---

## 🔒 Privacy & Security

- ✅ **No backend server** — zero server-side data storage
- ✅ **Session token encryption** — data encrypted with unique per-session token
- ✅ **Cross-browser isolation** — encrypted data unreadable in other browsers
- ✅ **localStorage only** — all data stays on user's device
- ✅ **Permission-based** — browser always asks before accessing location
- ✅ **No ads, no tracking** — pure privacy-first design

---

## 📱 How Device Recovery Works

```
Before losing device:
1. Open NexaTrack → Click "Track My Location"
2. Click "Share Location" → Note the TS-XXXXX code

If device is lost:
3. Open find-device.html from any device
4. Enter your TS-XXXXX code → Location appears on map

Via Phone Number:
5. Enter lost device's phone number
6. WhatsApp/SMS message sent with tracking link
7. When opened → location shared back via Google Maps
```

---

## 🚀 Deployment (Netlify — Free)

1. Go to [netlify.com](https://netlify.com) → Login
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop your **project folder**
4. Get your free HTTPS link: `https://nexatrack-xxx.netlify.app`
5. Location tracking works perfectly on HTTPS ✅

---

## 📸 Pages Overview

| Page | Description |
|---|---|
| `index.html` | Main dashboard with map, stats, history, share |
| `find-device.html` | Lost device recovery — 3 methods |
| `about.html` | Platform overview and feature links |
| `contact.html` | Contact form with EmailJS integration |
| `privacy.html` | Privacy policy |

---

## 🐛 Known Issues

- Geolocation does NOT work on `file://` — use Live Server or HTTPS hosting
- Share codes only work cross-device if Firebase is configured (optional)
- EmailJS free plan allows 200 emails/month

---

## 👨‍💻 Developer

**Sandeep**
Frontend Web Developer — Passionate about building interactive web applications.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub!
