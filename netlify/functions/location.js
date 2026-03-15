// ========== NEXATRACK — NETLIFY FUNCTION ==========
const https = require('https');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const BIN_ID  = '69b68854c3097a1dd5285b61';
const API_KEY = '$2a$10$pP1GSFftdJaWXlAft2OUGeGelQLKt90nNB/DlSAuhTt45ZJQaNxn6';

  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      const payload = {
        lat: data.lat,
        lon: data.lon,
        accuracy: data.accuracy,
        time: data.time,
        link: `https://maps.google.com/?q=${data.lat},${data.lon}`,
        updatedAt: Date.now()
      };

      await updateBin(BIN_ID, API_KEY, payload);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  if (event.httpMethod === 'GET') {
    try {
      const data = await getBin(BIN_ID, API_KEY);
      if (data && data.lat) {
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }
    } catch(e) {}
    return { statusCode: 404, headers, body: JSON.stringify({ error: 'No location yet' }) };
  }

  return { statusCode: 405, headers, body: 'Method not allowed' };
};

function updateBin(binId, apiKey, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'api.jsonbin.io',
      path: `/v3/b/${binId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey,
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

function getBin(binId, apiKey) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.jsonbin.io',
      path: `/v3/b/${binId}/latest`,
      method: 'GET',
      headers: { 'X-Master-Key': apiKey }
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