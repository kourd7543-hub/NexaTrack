// ========== NEXATRACK — NETLIFY FUNCTION ==========
// Yeh ek simple in-memory store hai
// Location save aur fetch karta hai

let storedLocation = null;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // OPTIONS request handle karo (CORS)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // POST — location save karo
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      storedLocation = {
        lat: data.lat,
        lon: data.lon,
        accuracy: data.accuracy,
        time: data.time,
        link: `https://maps.google.com/?q=${data.lat},${data.lon}`,
        updatedAt: Date.now()
      };
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid data' })
      };
    }
  }

  // GET — location fetch karo
  if (event.httpMethod === 'GET') {
    if (!storedLocation) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'No location yet' })
      };
    }
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(storedLocation)
    };
  }

  return { statusCode: 405, headers, body: 'Method not allowed' };
};