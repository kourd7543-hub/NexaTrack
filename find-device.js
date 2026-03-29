// NEXATRACK - NO DATABASE VERSION
function startNexaAutomation() {
    const myNumber = prompt("Enter your Backup Phone Number (where you want to receive location):");
    if(!myNumber) return;

    localStorage.setItem('backup_number', myNumber);
    showToast("Automation Ready! Backup Number Saved.", "success");
    
    // Tasker jaisa behavior: Bina app ke background check
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log("System Check: GPS is Working.");
        });
    }
}

function locateDevice() {
    const phone = document.getElementById('searchCode').value; // Yahan phone number daalein
    const backupNum = localStorage.getItem('backup_number') || "919999999999"; 
    
    if(!phone) {
        showToast("Please enter the lost phone number", "error");
        return;
    }

    // Ek special Google Maps link generate karna
    const trackerLink = `https://nexa-track.vercel.app/track.html?to=${backupNum}`;
    const msg = encodeURIComponent(`🚨 NexaTrack Alert: Your device is being located. Click to verify: ${trackerLink}`);
    
    // SMS bhejne ka option
    window.location.href = `sms:${phone}?body=${msg}`;
    showToast("Tracking Link Sent via SMS!", "info");
}