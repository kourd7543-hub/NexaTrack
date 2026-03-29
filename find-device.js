// AAPKA PURANA TRACKING LOGIC
function trackViaPhone() {
    const phone = document.getElementById('phoneNumber').value;
    if(!phone) {
        showToast("Please enter a number", "error");
        return;
    }
    // SMS Link Method (Jo aapne pehle manga tha)
    const backupNum = "91XXXXXXXXXX"; // Apna number yahan dalein
    const trackLink = `https://${window.location.hostname}/track.html?to=${backupNum}`;
    window.location.href = `sms:${phone}?body=🚨 NexaTrack Alert: ${trackLink}`;
}

// --- NEW AUTOMATION LOGIC (ONLY THIS ADDED) ---
let autoInterval = null;

function startNexaAutomation() {
    showToast("Automation Started!", "success");
    autoInterval = setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log("Background Syncing...");
        });
    }, 60000); // Har 1 min mein check karega
}

function stopNexaAutomation() {
    clearInterval(autoInterval);
    showToast("Automation Stopped", "info");
}

function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}