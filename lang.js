// ========== NEXATRACK — COMPLETE LANGUAGE SYSTEM ==========

const TRANSLATIONS = {
  en: {
    // NAV
    'nav-home': 'Home', 'nav-about': 'About', 'nav-find': 'Find Device',
    'nav-contact': 'Contact', 'nav-status': 'System Online',
    // HERO
    'hero-badge': 'LIVE SYSTEM ACTIVE',
    'hero-title': 'Real-Time Location',
    'hero-title2': 'Intelligence Platform',
    'hero-desc': 'Track live location, store history, and recover lost devices using phone number or share link.',
    'btn-track': 'Track My Location', 'btn-find': 'Find Lost Device',
    // STATS
    'stat-accuracy': 'Accuracy (m)', 'stat-speed': 'Speed (km/h)', 'stat-updates': 'Updates',
    // DASHBOARD
    'dash-title': 'Live Dashboard', 'btn-watch': 'Start Live Watch',
    'btn-clear': 'Clear History', 'btn-share': 'Share Link',
    // LOCATION DETAILS
    'loc-details': 'Location Details',
    'lbl-lat': 'Latitude', 'lbl-lon': 'Longitude', 'lbl-acc': 'Accuracy',
    'lbl-alt': 'Altitude', 'lbl-speed': 'Speed', 'lbl-updated': 'Last Updated',
    'lbl-address': 'Address', 'lbl-waiting': 'Waiting...', 'lbl-fetching': 'Fetching...',
    // MAP
    'map-title': 'Live Map',
    'globe-text': 'Click "Track My Location" to begin',
    // HISTORY
    'history-title': 'Location History',
    'no-history': 'No history yet. Click Track to begin.',
    // SHARE
    'share-title': 'Share & Find', 'share-link': 'Copy Share Link',
    'share-wa': 'Send via WhatsApp', 'share-sms': 'Send via SMS',
    'share-lost': 'Lost Device Recovery',
    // FEATURES STRIP
    'feat-1': 'Live GPS Tracking', 'feat-2': 'Location History',
    'feat-3': 'Share Location', 'feat-4': 'Device Recovery', 'feat-5': 'Privacy First',
    // FIND DEVICE PAGE
    'find-hero-title': 'Lost Device Finder',
    'find-hero-desc': 'Locate a lost device using phone number, share link, or device code',
    'find-phone-title': 'Find by Phone Number',
    'find-phone-desc': 'Send a location request to the lost device via WhatsApp or SMS.',
    'btn-send-request': 'Send Request',
    'find-code-title': 'Find by Share Code',
    'find-code-desc': 'Enter the TS-XXXXX code generated when Share Location was clicked.',
    'btn-track-device': 'Track Device',
    'find-own-title': 'Live Location / Last Known',
    'find-own-desc': 'View last known location saved before device was lost.',
    'btn-watch-live': 'Watch Live', 'btn-load-last': 'Last Known',
    // ABOUT PAGE
    'about-title': 'About NexaTrack',
    'about-tagline': 'Real-Time Location Intelligence',
    'about-subtitle': 'Your smart and reliable real-time location tracking solution.',
    'about-what-title': 'What is NexaTrack?',
    'about-what-desc': 'NexaTrack is a modern web-based application that allows users to track their real-time geographical location instantly. It uses advanced browser Geolocation technology to provide accurate coordinates and display them on an interactive map.',
    'about-feat1-title': 'Live Tracking', 'about-feat1-desc': 'Instantly detect your current location.',
    'about-feat2-title': 'Interactive Map', 'about-feat2-desc': 'View your exact position visually.',
    'about-feat3-title': 'Location History', 'about-feat3-desc': 'Review past locations with timestamps.',
    'about-feat4-title': 'Device Recovery', 'about-feat4-desc': 'Find lost device by phone or code.',
    'about-feat5-title': 'Privacy Focused', 'about-feat5-desc': 'No user data is stored on servers.',
    'about-dev-title': 'Developer',
    'about-dev-desc': 'Developed by <strong>Sandeep</strong><br>Frontend Web Developer<br>Passionate about building interactive web applications.',
    // CONTACT PAGE
    'contact-title': 'Contact Us',
    'contact-desc': 'Have a question or feedback? Reach out anytime.',
    'contact-name': 'Your Name', 'contact-email': 'Your Email', 'contact-msg': 'Your Message',
    'btn-send': 'Send Message',
    // FOOTER
    'footer-copy': '© 2026 NexaTrack | Developed by Sandeep',
    'footer-privacy': 'Privacy Policy', 'footer-about': 'About', 'footer-contact': 'Contact',
    // TOASTS
    'toast-geo-unsupported': 'Geolocation not supported by this browser.',
    'toast-fetching': 'Fetching your location...',
    'toast-tracked': 'Location tracked successfully!',
    'toast-watch-stop': 'Live watch stopped.',
    'toast-watch-start': 'Live watch started! Location updates automatically.',
    'toast-cleared': 'History cleared.',
    'toast-track-first': 'Please track your location first!',
    'toast-share-ready': 'Share link ready!',
    'toast-track-first2': 'Track location first!',
    'toast-copied': 'Link copied to clipboard!',
    'toast-msg-sent': 'Message sent successfully!',
    'toast-msg-fail': 'Failed to send. Please try again!',
    'toast-perm-denied': 'Location permission denied. Please allow location access.',
    'toast-unavail': 'Location information unavailable.',
    'toast-timeout': 'Location request timed out. Try again.',
  },
  hi: {
    // NAV
    'nav-home': 'होम', 'nav-about': 'परिचय', 'nav-find': 'डिवाइस खोजें',
    'nav-contact': 'संपर्क', 'nav-status': 'सिस्टम चालू है',
    // HERO
    'hero-badge': 'लाइव सिस्टम सक्रिय',
    'hero-title': 'रियल-टाइम लोकेशन',
    'hero-title2': 'इंटेलिजेंस प्लेटफॉर्म',
    'hero-desc': 'लाइव लोकेशन ट्रैक करें, हिस्ट्री सेव करें, और फोन नंबर या शेयर लिंक से खोया डिवाइस ढूंढें।',
    'btn-track': 'मेरी लोकेशन ट्रैक करें', 'btn-find': 'खोया डिवाइस ढूंढें',
    // STATS
    'stat-accuracy': 'सटीकता (मीटर)', 'stat-speed': 'गति (km/h)', 'stat-updates': 'अपडेट',
    // DASHBOARD
    'dash-title': 'लाइव डैशबोर्ड', 'btn-watch': 'लाइव वॉच शुरू करें',
    'btn-clear': 'हिस्ट्री साफ करें', 'btn-share': 'लिंक शेयर करें',
    // LOCATION DETAILS
    'loc-details': 'लोकेशन विवरण',
    'lbl-lat': 'अक्षांश', 'lbl-lon': 'देशांतर', 'lbl-acc': 'सटीकता',
    'lbl-alt': 'ऊंचाई', 'lbl-speed': 'गति', 'lbl-updated': 'अंतिम अपडेट',
    'lbl-address': 'पता', 'lbl-waiting': 'प्रतीक्षा करें...', 'lbl-fetching': 'खोज रहे हैं...',
    // MAP
    'map-title': 'लाइव मैप',
    'globe-text': '"मेरी लोकेशन ट्रैक करें" पर क्लिक करें',
    // HISTORY
    'history-title': 'लोकेशन हिस्ट्री',
    'no-history': 'अभी कोई हिस्ट्री नहीं। ट्रैक करने के लिए क्लिक करें।',
    // SHARE
    'share-title': 'शेयर करें और खोजें', 'share-link': 'शेयर लिंक कॉपी करें',
    'share-wa': 'WhatsApp से भेजें', 'share-sms': 'SMS से भेजें',
    'share-lost': 'खोया डिवाइस रिकवरी',
    // FEATURES STRIP
    'feat-1': 'लाइव GPS ट्रैकिंग', 'feat-2': 'लोकेशन हिस्ट्री',
    'feat-3': 'लोकेशन शेयर', 'feat-4': 'डिवाइस रिकवरी', 'feat-5': 'प्राइवेसी फर्स्ट',
    // FIND DEVICE PAGE
    'find-hero-title': 'खोया डिवाइस खोजें',
    'find-hero-desc': 'फोन नंबर, शेयर लिंक या डिवाइस कोड से खोया डिवाइस ढूंढें',
    'find-phone-title': 'फोन नंबर से खोजें',
    'find-phone-desc': 'खोए डिवाइस पर WhatsApp या SMS से लोकेशन रिक्वेस्ट भेजें।',
    'btn-send-request': 'रिक्वेस्ट भेजें',
    'find-code-title': 'शेयर कोड से खोजें',
    'find-code-desc': '"शेयर लोकेशन" क्लिक करने पर बना TS कोड डालें।',
    'btn-track-device': 'डिवाइस ट्रैक करें',
    'find-own-title': 'लाइव लोकेशन / अंतिम लोकेशन',
    'find-own-desc': 'डिवाइस खोने से पहले सेव की गई अंतिम लोकेशन देखें।',
    'btn-watch-live': 'लाइव देखें', 'btn-load-last': 'अंतिम लोकेशन',
    // ABOUT PAGE
    'about-title': 'NexaTrack के बारे में',
    'about-tagline': 'रियल-टाइम लोकेशन इंटेलिजेंस',
    'about-subtitle': 'आपका स्मार्ट और विश्वसनीय रियल-टाइम लोकेशन ट्रैकिंग समाधान।',
    'about-what-title': 'NexaTrack क्या है?',
    'about-what-desc': 'NexaTrack एक आधुनिक वेब-आधारित एप्लिकेशन है जो उपयोगकर्ताओं को तुरंत अपनी रियल-टाइम भौगोलिक स्थान ट्रैक करने देती है। यह सटीक निर्देशांक देने के लिए उन्नत ब्राउज़र Geolocation तकनीक का उपयोग करती है।',
    'about-feat1-title': 'लाइव ट्रैकिंग', 'about-feat1-desc': 'तुरंत अपनी वर्तमान लोकेशन जानें।',
    'about-feat2-title': 'इंटरेक्टिव मैप', 'about-feat2-desc': 'अपनी सटीक स्थिति नक्शे पर देखें।',
    'about-feat3-title': 'लोकेशन हिस्ट्री', 'about-feat3-desc': 'पिछली लोकेशन टाइमस्टैम्प के साथ देखें।',
    'about-feat4-title': 'डिवाइस रिकवरी', 'about-feat4-desc': 'फोन या कोड से खोया डिवाइस ढूंढें।',
    'about-feat5-title': 'प्राइवेसी फोकस्ड', 'about-feat5-desc': 'कोई डेटा सर्वर पर स्टोर नहीं होता।',
    'about-dev-title': 'डेवलपर',
    'about-dev-desc': '<strong>Sandeep</strong> द्वारा विकसित<br>फ्रंटएंड वेब डेवलपर<br>इंटरेक्टिव वेब एप्लिकेशन बनाने में रुचि।',
    // CONTACT PAGE
    'contact-title': 'हमसे संपर्क करें',
    'contact-desc': 'कोई सवाल या सुझाव? कभी भी संपर्क करें।',
    'contact-name': 'आपका नाम', 'contact-email': 'आपका ईमेल', 'contact-msg': 'आपका संदेश',
    'btn-send': 'संदेश भेजें',
    // FOOTER
    'footer-copy': '© 2026 NexaTrack | Sandeep द्वारा विकसित',
    'footer-privacy': 'गोपनीयता नीति', 'footer-about': 'परिचय', 'footer-contact': 'संपर्क',
    // TOASTS
    'toast-geo-unsupported': 'यह ब्राउज़र Geolocation सपोर्ट नहीं करता।',
    'toast-fetching': 'आपकी लोकेशन ढूंढी जा रही है...',
    'toast-tracked': 'लोकेशन सफलतापूर्वक ट्रैक हो गई!',
    'toast-watch-stop': 'लाइव वॉच बंद हो गई।',
    'toast-watch-start': 'लाइव वॉच शुरू! लोकेशन अपने आप अपडेट होगी।',
    'toast-cleared': 'हिस्ट्री साफ हो गई।',
    'toast-track-first': 'पहले अपनी लोकेशन ट्रैक करें!',
    'toast-share-ready': 'शेयर लिंक तैयार है!',
    'toast-track-first2': 'पहले लोकेशन ट्रैक करें!',
    'toast-copied': 'लिंक कॉपी हो गई!',
    'toast-msg-sent': 'संदेश सफलतापूर्वक भेज दिया!',
    'toast-msg-fail': 'भेजने में विफल। फिर कोशिश करें!',
    'toast-perm-denied': 'लोकेशन की अनुमति नहीं मिली। कृपया अनुमति दें।',
    'toast-unavail': 'लोकेशन जानकारी उपलब्ध नहीं है।',
    'toast-timeout': 'लोकेशन अनुरोध का समय समाप्त। फिर कोशिश करें।',
  }
};

function getCurrentLang() {
  return localStorage.getItem('nx_lang') || 'en';
}

function t(key) {
  const lang = getCurrentLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS['en'][key]) || key;
}

function setLang(lang) {
  localStorage.setItem('nx_lang', lang);
  applyTranslations(lang);
  updateToggleBtn(lang);
  // Hindi font body pe apply karo
  if (lang === 'hi') {
    document.body.style.fontFamily = "'Noto Sans Devanagari', sans-serif";
  } else {
    document.body.style.fontFamily = '';
  }
}

function applyTranslations(lang) {
  const tr = TRANSLATIONS[lang];
  if (!tr) return;
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (tr[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = tr[key];
      } else {
        el.innerHTML = tr[key];
      }
    }
  });
  // data-lang-wait wale elements bhi update karo
  document.querySelectorAll('[data-lang-wait]').forEach(el => {
    const key = el.getAttribute('data-lang-wait');
    const currentText = el.innerText.trim();
    if (tr[key] && (currentText === 'Waiting...' || currentText === 'प्रतीक्षा करें...' || currentText === 'Fetching...' || currentText === 'खोज रहे हैं...')) {
      el.innerText = tr[key];
    }
  });
}

function updateToggleBtn(lang) {
  const btn = document.getElementById('langToggleBtn');
  if (!btn) return;
  if (lang === 'en') {
    btn.innerHTML = '<span class="lang-active">EN</span><span class="lang-divider">|</span><span class="lang-inactive">हि</span>';
  } else {
    btn.innerHTML = '<span class="lang-inactive">EN</span><span class="lang-divider">|</span><span class="lang-active">हि</span>';
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
  if (lang === 'hi') {
    document.body.style.fontFamily = "'Noto Sans Devanagari', sans-serif";
  }
});