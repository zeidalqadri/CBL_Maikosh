// Secure logging utility to replace console.log
class SecureLogger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  // Sanitize sensitive data before logging
  sanitizeData(data) {
    if (!data) return data;
    
    const sensitiveKeys = [
      'password', 'token', 'secret', 'key', 'auth', 'credential',
      'email', 'phone', 'ssn', 'credit', 'card', 'payment',
      'session', 'cookie', 'authorization'
    ];
    
    if (typeof data === 'string') {
      // Don't log if it looks like sensitive data
      if (sensitiveKeys.some(key => data.toLowerCase().includes(key))) {
        return '[SENSITIVE_DATA_REDACTED]';
      }
      return data;
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = Array.isArray(data) ? [] : {};
      
      for (const [key, value] of Object.entries(data)) {
        const keyLower = key.toLowerCase();
        
        if (sensitiveKeys.some(sensitive => keyLower.includes(sensitive))) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeData(value);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  // Format log entry with timestamp and level
  formatLog(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data: this.sanitizeData(data) })
    };
    
    return logEntry;
  }

  // Log info level messages
  info(message, data = null) {
    const logEntry = this.formatLog('INFO', message, data);
    
    if (this.isDevelopment) {
      console.log(`[${logEntry.timestamp}] INFO: ${message}`, 
        data ? logEntry.data : '');
    }
    
    // In production, send to proper logging service
    if (this.isProduction) {
      this.sendToLoggingService(logEntry);
    }
  }

  // Log warning level messages
  warn(message, data = null) {
    const logEntry = this.formatLog('WARN', message, data);
    
    if (this.isDevelopment) {
      console.warn(`[${logEntry.timestamp}] WARN: ${message}`, 
        data ? logEntry.data : '');
    }
    
    if (this.isProduction) {
      this.sendToLoggingService(logEntry);
    }
  }

  // Log error level messages
  error(message, error = null, data = null) {
    const logEntry = this.formatLog('ERROR', message, {
      ...(error && {
        error: {
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
          name: error.name
        }
      }),
      ...(data && { data })
    });
    
    if (this.isDevelopment) {
      console.error(`[${logEntry.timestamp}] ERROR: ${message}`, 
        error ? logEntry.data.error : '', data ? logEntry.data.data : '');
    }
    
    if (this.isProduction) {
      this.sendToLoggingService(logEntry);
    }
  }

  // Log debug messages (development only)
  debug(message, data = null) {
    if (!this.isDevelopment) return;
    
    const logEntry = this.formatLog('DEBUG', message, data);
    console.debug(`[${logEntry.timestamp}] DEBUG: ${message}`, 
      data ? logEntry.data : '');
  }

  // Security-specific logging
  security(message, data = null) {
    const logEntry = this.formatLog('SECURITY', message, data);
    
    // Always log security events
    console.warn(`[${logEntry.timestamp}] SECURITY: ${message}`, 
      data ? logEntry.data : '');
    
    // Send to security monitoring service
    if (this.isProduction) {
      this.sendToSecurityService(logEntry);
    }
  }

  // Audit logging for compliance
  audit(action, userId, data = null) {
    const logEntry = this.formatLog('AUDIT', `User action: ${action}`, {
      userId,
      action,
      ...(data && { data })
    });
    
    // Always log audit events
    console.log(`[${logEntry.timestamp}] AUDIT: User ${userId} performed ${action}`, 
      data ? logEntry.data : '');
    
    // Send to audit service
    if (this.isProduction) {
      this.sendToAuditService(logEntry);
    }
  }

  // Send to external logging service (implement based on your service)
  sendToLoggingService(logEntry) {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // In browser, use console instead of process.stdout
      console.log('[LOG]', logEntry);
    } else {
      // In Node.js/server environment
      process.stdout.write(JSON.stringify(logEntry) + '\n');
    }
  }

  // Send to security monitoring service
  sendToSecurityService(logEntry) {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // In browser, use console instead of process.stderr
      console.warn('[SECURITY]', { ...logEntry, alertLevel: 'HIGH' });
    } else {
      // In Node.js/server environment
      process.stderr.write(JSON.stringify({
        ...logEntry,
        alertLevel: 'HIGH'
      }) + '\n');
    }
  }

  // Send to audit service
  sendToAuditService(logEntry) {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // In browser, use console instead of process.stdout
      console.log('[AUDIT]', { ...logEntry, type: 'AUDIT' });
    } else {
      // In Node.js/server environment
      process.stdout.write(JSON.stringify({
        ...logEntry,
        type: 'AUDIT'
      }) + '\n');
    }
  }
}

// Create singleton instance
const logger = new SecureLogger();

// Export the logger instance and individual methods
export default logger;
export const { info, warn, error, debug, security, audit } = logger;