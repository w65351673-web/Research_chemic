/**
 * IP Geolocation Utility
 * Get visitor location from IP address
 */

// Get IP address from request
export function getClientIP(request) {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cfConnecting = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  if (cfConnecting) {
    return cfConnecting;
  }
  
  return null;
}

// Get location data from IP using free ipapi.co service
export async function getLocationFromIP(ip) {
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.')) {
    return {
      ip: ip || 'localhost',
      country: 'Local',
      city: 'Development',
      region: 'Local',
      latitude: null,
      longitude: null,
    };
  }

  try {
    // Using ipapi.co free tier (1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'BuyResearchChems/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }

    const data = await response.json();

    return {
      ip: ip,
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return {
      ip: ip,
      country: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      latitude: null,
      longitude: null,
    };
  }
}

// Parse user agent to get device info
export function parseUserAgent(userAgent) {
  if (!userAgent) {
    return {
      type: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown',
    };
  }

  // Detect device type
  let type = 'Desktop';
  if (/mobile/i.test(userAgent)) {
    type = 'Mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    type = 'Tablet';
  }

  // Detect browser
  let browser = 'Unknown';
  if (/chrome/i.test(userAgent) && !/edg/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/edg/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/opera|opr/i.test(userAgent)) {
    browser = 'Opera';
  }

  // Detect OS
  let os = 'Unknown';
  if (/windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/mac/i.test(userAgent)) {
    os = 'macOS';
  } else if (/linux/i.test(userAgent)) {
    os = 'Linux';
  } else if (/android/i.test(userAgent)) {
    os = 'Android';
  } else if (/ios|iphone|ipad/i.test(userAgent)) {
    os = 'iOS';
  }

  return { type, browser, os };
}
