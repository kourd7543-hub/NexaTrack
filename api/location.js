const https = require('https');

const BIN_ID  = '69b68854c3097a1dd5285b61';
const API_KEY = '$2a$10$pP1GSFftdJaWXlAft2OUGeGelQLKt90nNB/DlSAuhTt45ZJQaNxn6';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { lat, lon, accuracy, time } = req.body;
      const payload = {
        lat, lon, accuracy, time,
        link: `https://maps.google.com/?q=${lat},${lon}`,
        updatedAt: Date.now()
      };
      await updateBin(payload);
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const data = await getBin();
      if (data && data.lat) {
        return res.status(200).json(data);
      }
    } catch(e) {}
    return res.status(404).json({ error: 'No location yet' });
  }

  return res.status(405).end('Method not allowed');
};

function updateBin(data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'api.jsonbin.io',
      path: `/v3/b/${BIN_ID}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function getBin() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.jsonbin.io',
      path: `/v3/b/${BIN_ID}/latest`,
      method: 'GET',
      headers: { 'X-Master-Key': API_KEY }
    };
    let result = '';
    const req = https.request(options, (res) => {
      res.on('data', (chunk) => { result += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(result);
          resolve(parsed.record || null);
        } catch { resolve(null); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}