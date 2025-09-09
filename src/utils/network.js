// Get client IP address from request
export const getClientIP = (req) => {
  // Check various headers for the real IP
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  const cfConnectingIP = req.headers['cf-connecting-ip']; // Cloudflare
  const socketRemote = req.connection?.remoteAddress;
  const socketLocal = req.socket?.remoteAddress;
  const infoRemote = req.info?.remoteAddress;
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || cfConnectingIP || socketRemote || socketLocal || infoRemote || '127.0.0.1';
};

// Validate IP address format
export const isValidIP = (ip) => {
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Check if IP is from localhost/private network
export const isLocalIP = (ip) => {
  if (!ip) return false;
  
  // Localhost
  if (ip === '127.0.0.1' || ip === '::1') return true;
  
  // Private IP ranges
  const privateRanges = [
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./
  ];
  
  return privateRanges.some(range => range.test(ip));
};

// Hash IP for privacy (optional)
export const hashIP = (ip) => {
  if (!ip) return 'unknown';
  
  // Simple hash function for IP privacy
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};