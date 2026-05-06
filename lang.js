// ========== NEXATRACK — LANGUAGE SYSTEM ==========

const TRANSLATIONS = {
  en: {
    'nav-home': 'Home',
    'nav-about': 'About',
    'nav-find': 'Find Device',
    'nav-contact': 'Contact',
    'nav-status': 'System Online',
    'btn-track': 'Track My Location',
    'btn-find': 'Find Lost Device',
    'dash-title': 'Live Dashboard',
    'btn-watch': 'Start Live Watch',
    'btn-clear': 'Clear History',
    'btn-share': 'Share Link',
    'map-title': 'Live Map',
    'globe-text': 'Click "Track My Location" to begin',
    'history-title': 'Location History',
    'no-history': 'No history yet. Click Track to begin.',
    'share-title': 'Share & Find',
    'share-link': 'Copy Share Link',
    'share-wa': 'Send via WhatsApp',
    'share-sms': 'Send via SMS',
    'share-lost': 'Lost Device Recovery',
    'feat-1': 'Live GPS Tracking',
    'feat-2': 'Location History',
    'feat-3': 'Share Location',
    'feat-4': 'Device Recovery',
    'feat-5': 'Privacy First',
    'find-hero-title': 'Lost Device Finder',
    'find-hero-desc': 'Locate a lost device using phone number, share link, or device code',
    'emergency-title': 'Setup Emergency Info — Before Losing Device',
    'emergency-desc': 'Save your name and phone number. If device is lost and someone finds it — they will see this info and can alert you directly.',
    'owner-name': 'Your Name',
    'owner-phone': 'Your WhatsApp Number',
    'owner-reward': 'Reward Message (optional)',
    'btn-save-emergency': 'Save Emergency Info',
    'emergency-saved': 'Emergency Info Saved!',
    'find-phone-title': 'Find by Phone Number',
    'find-phone-desc': 'Send a location request to the lost device via WhatsApp or SMS.',
    'btn-send-request': 'Send Request',
    'btn-watch-live': 'Watch Live Location',
    'find-code-title': 'Find by Share Code',
    'find-code-desc': 'Enter the TS-XXXXX code generated when "Share Location" was clicked.',
    'btn-track-device': 'Track Device',
    'find-own-title': 'I Lost My Own Device',
    'find-own-desc': 'View last known location saved before device was lost.',
    'btn-load-last': 'Load Last Known Location',
    'about-title': 'About NexaTrack',
    'contact-title': 'Contact Us',
    'contact-desc': 'Have a question or feedback? Reach out anytime.',
    'btn-send': 'Send Message',
    'footer-copy': '© 2026 NexaTrack | Developed by Sandeep',
    'footer-privacy': 'Privacy Policy',
    'footer-about': 'About',
    'footer-contact': 'Contact',
  },
  hi: {
    'nav-home': 'होम',
    'nav-about': 'परिचय',
    'nav-find': 'डिवाइस खोजें',
    'nav-contact': 'संपर्क',
    'nav-status': 'सिस्टम चालू',
    'btn-track': 'मेरी लोकेशन ट्रैक करें',
    'btn-find': 'खोया डिवाइस ढूंढें',
    'dash-title': 'लाइव डैशबोर्ड',
    'btn-watch': 'लाइव वॉच शुरू करें',
    'btn-clear': 'हिस्ट्री साफ करें',
    'btn-share': 'शेयर लिंक',
    'map-title': 'लाइव मैप',
    'globe-text': '"मेरी लोकेशन ट्रैक करें" पर क्लिक करें',
    'history-title': 'लोकेशन हिस्ट्री',
    'no-history': 'अभी कोई हिस्ट्री नहीं।',
    'share-title': 'शेयर करें',
    'share-link': 'शेयर लिंक कॉपी करें',
    'share-wa': 'WhatsApp से भेजें',
    'share-sms': 'SMS से भेजें',
    'share-lost': 'खोया डिवाइस रिकवरी',
    'feat-1': 'लाइव GPS ट्रैकिंग',
    'feat-2': 'लोकेशन हिस्ट्री',
    'feat-3': 'लोकेशन शेयर',
    'feat-4': 'डिवाइस रिकवरी',
    'feat-5': 'प्राइवेसी फर्स्ट',
    'find-hero-title': 'खोया डिवाइस खोजें',
    'find-hero-desc': 'फोन नंबर, शेयर लिंक या डिवाइस कोड से खोया डिवाइस ढूंढें',
    'emergency-title': 'इमरजेंसी जानकारी सेटअप करें',
    'emergency-desc': 'अपना नाम और फोन नंबर सेव करें।',
    'owner-name': 'आपका नाम',
    'owner-phone': 'आपका WhatsApp नंबर',
    'owner-reward': 'इनाम संदेश (वैकल्पिक)',
    'btn-save-emergency': 'इमरजेंसी जानकारी सेव करें',
    'emergency-saved': 'इमरजेंसी जानकारी सेव हो गई!',
    'find-phone-title': 'फोन नंबर से खोजें',
    'find-phone-desc': 'खोए डिवाइस पर WhatsApp या SMS से लोकेशन रिक्वेस्ट भेजें।',
    'btn-send-request': 'रिक्वेस्ट भेजें',
    'btn-watch-live': 'लाइव लोकेशन देखें',
    'find-code-title': 'शेयर कोड से खोजें',
    'find-code-desc': '"शेयर लोकेशन" क्लिक करने पर बना कोड डालें।',
    'btn-track-device': 'डिवाइस ट्रैक करें',
    'find-own-title': 'मेरा खुद का डिवाइस खो गया',
    'find-own-desc': 'डिवाइस खोने से पहले सेव की गई अंतिम लोकेशन देखें।',
    'btn-load-last': 'अंतिम लोकेशन लोड करें',
    'about-title': 'NexaTrack के बारे में',
    'contact-title': 'हमसे संपर्क करें',
    'contact-desc': 'कोई सवाल या सुझाव? कभी भी संपर्क करें।',
    'btn-send': 'संदेश भेजें',
    'footer-copy': '© 2026 NexaTrack | Sandeep द्वारा विकसित',
    'footer-privacy': 'गोपनीयता नीति',
    'footer-about': 'परिचय',
    'footer-contact': 'संपर्क',
  }
};

function getCurrentLang() {
  return localStorage.getItem('nx_lang') || 'en';
}

function setLang(lang) {
  localStorage.setItem('nx_lang', lang);
  applyTranslations(lang);
  updateToggleBtn(lang);
}

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });
}

function updateToggleBtn(lang) {
  const btn = document.getElementById('langToggleBtn');
  if (!btn) return;
  if (lang === 'en') {
    btn.innerHTML = `<span class="lang-active">EN</span><span class="lang-divider">|</span><span class="lang-inactive">हि</span>`;
  } else {
    btn.innerHTML = `<span class="lang-inactive">EN</span><span class="lang-divider">|</span><span class="lang-active">हि</span>`;
  }
}

function toggleLang() {
  const current = getCurrentLang();
  setLang(current === 'en' ? 'hi' : 'en');
}

document.addEventListener('DOMContentLoaded', () => {
  const lang = localStorage.getItem('nx_lang') || 'en';
  localStorage.setItem('nx_lang', lang);
  applyTranslations(lang);
  updateToggleBtn(lang);
});