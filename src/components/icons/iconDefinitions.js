/**
 * Basketball-themed icon definitions for the alloui platform
 * Each icon is designed to replace emoticons and generic icons
 * with branded, basketball-inspired visual elements
 */

export const iconDefinitions = {
  // Navigation Icons (replacing arrow emoticons ➜→)
  'arrow-right': {
    viewBox: '0 0 24 24',
    path: 'M9 5l7 7-7 7',
    ariaLabel: 'Navigate forward'
  },
  'arrow-left': {
    viewBox: '0 0 24 24',
    path: 'M15 19l-7-7 7-7',
    ariaLabel: 'Navigate back'
  },
  'arrow-up': {
    viewBox: '0 0 24 24',
    path: 'M19 15l-7-7-7 7',
    ariaLabel: 'Navigate up'
  },
  'arrow-down': {
    viewBox: '0 0 24 24',
    path: 'M5 9l7 7 7-7',
    ariaLabel: 'Navigate down'
  },
  
  // Home Icons (replacing 🏠)
  'home': {
    viewBox: '0 0 24 24',
    path: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
    ariaLabel: 'Home page'
  },
  'court-home': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="1" fill="none" stroke="currentColor"/>
        <circle cx="6" cy="12" r="3" fill="none"/>
        <circle cx="18" cy="12" r="3" fill="none"/>
        <line x1="12" y1="6" x2="12" y2="18"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Basketball court home'
  },

  // Basketball Icons (replacing 🏀)
  'basketball': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="9" fill="none"/>
        <path d="M12 3c0 6-3 9-9 9"/>
        <path d="M21 12c-6 0-9-3-9-9"/>
        <path d="M3 12c6 0 9 3 9 9"/>
        <path d="M12 21c0-6 3-9 9-9"/>
      </>
    ),
    ariaLabel: 'Basketball'
  },
  'basketball-simple': {
    viewBox: '0 0 24 24',
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
    fill: 'currentColor',
    ariaLabel: 'Basketball ball'
  },

  // Module/Education Icons (replacing 📚💡)
  'module': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="1" fill="none"/>
        <circle cx="8" cy="10" r="2" fill="none"/>
        <circle cx="16" cy="10" r="2" fill="none"/>
        <line x1="12" y1="4" x2="12" y2="16"/>
        <path d="M6 18l6-2 6 2"/>
      </>
    ),
    ariaLabel: 'Learning module'
  },
  'insight': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="5" fill="none"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Key insight'
  },

  // Target/Goal Icons (replacing 🎯)
  'target': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="10" fill="none"/>
        <circle cx="12" cy="12" r="6" fill="none"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Target goal'
  },
  'basketball-hoop': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <ellipse cx="12" cy="6" rx="8" ry="2" fill="none"/>
        <line x1="4" y1="6" x2="4" y2="8"/>
        <line x1="20" y1="6" x2="20" y2="8"/>
        <path d="M4 8c0 1.5 3.5 3 8 3s8-1.5 8-3"/>
        <circle cx="12" cy="18" r="3" fill="none"/>
        <line x1="12" y1="11" x2="12" y2="15"/>
      </>
    ),
    ariaLabel: 'Basketball hoop target'
  },

  // Success Icons (replacing ✅)
  'success': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="10" fill="none"/>
        <path d="M9 12l2 2 4-4" strokeWidth="2"/>
      </>
    ),
    ariaLabel: 'Success completed'
  },
  'swish-success': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <ellipse cx="12" cy="6" rx="6" ry="1.5" fill="none"/>
        <path d="M8 6c0 .5 0 1 0 1.5L10 18"/>
        <path d="M16 6c0 .5 0 1 0 1.5L14 18"/>
        <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Perfect shot success'
  },

  // Error Icons (replacing ❌)
  'error': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="10" fill="none"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </>
    ),
    ariaLabel: 'Error occurred'
  },
  'miss-shot': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <ellipse cx="12" cy="6" rx="6" ry="1.5" fill="none"/>
        <path d="M6 6L8 16"/>
        <path d="M18 6L16 16"/>
        <circle cx="6" cy="18" r="1.5" fill="currentColor"/>
        <path d="M6 18L18 18" strokeDasharray="2 2"/>
      </>
    ),
    ariaLabel: 'Missed shot error'
  },

  // Trophy/Achievement Icons (replacing 🏆🎖️)
  'trophy': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M7 21h10"/>
        <path d="M12 17v4"/>
        <path d="M8 5h8a4 4 0 014 4v2a4 4 0 01-4 4H8a4 4 0 01-4-4V9a4 4 0 014-4z"/>
        <path d="M5 9H3a1 1 0 00-1 1v1a1 1 0 001 1h2"/>
        <path d="M19 9h2a1 1 0 011 1v1a1 1 0 01-1 1h-2"/>
      </>
    ),
    ariaLabel: 'Championship trophy'
  },
  'medal': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="15" r="6" fill="none"/>
        <circle cx="12" cy="15" r="3" fill="none"/>
        <path d="M9 9l3 6 3-6"/>
        <path d="M9 9V3l3 2 3-2v6"/>
      </>
    ),
    ariaLabel: 'Achievement medal'
  },

  // Lock Icons (replacing 🔒🔓)
  'locked': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </>
    ),
    ariaLabel: 'Content locked'
  },
  'unlocked': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
        <path d="M7 11V7a5 5 0 019.9-1"/>
      </>
    ),
    ariaLabel: 'Content unlocked'
  },

  // Whistle Icons (for coaching/referee actions)
  'whistle': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <ellipse cx="10" cy="12" rx="4" ry="6" fill="none"/>
        <path d="M14 12h6"/>
        <circle cx="17" cy="12" r="1" fill="currentColor"/>
        <circle cx="10" cy="10" r="1" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Referee whistle'
  },

  // Progress/Loading Icons
  'loading': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </>
    ),
    ariaLabel: 'Loading in progress'
  },

  // Menu Icons
  'menu': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </>
    ),
    ariaLabel: 'Open menu'
  },
  'close': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </>
    ),
    ariaLabel: 'Close menu'
  },

  // User/Profile Icons
  'user': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4" fill="none"/>
      </>
    ),
    ariaLabel: 'User profile'
  },

  // Settings Icons
  'settings': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="3" fill="none"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
      </>
    ),
    ariaLabel: 'Settings'
  },

  // Timeout/Pause Icons
  'timeout-pause': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
        <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Pause timeout'
  },

  // Module Navigation Icons
  'overview': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2v0a2 2 0 00-2-2h-2a2 2 0 00-2 2z"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="15" y2="16"/>
      </>
    ),
    ariaLabel: 'Module overview'
  },

  'resources': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
        <path d="M8 6h8"/>
        <path d="M8 10h8"/>
        <path d="M8 14h5"/>
      </>
    ),
    ariaLabel: 'Learning resources'
  },

  'drill': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="9" fill="none"/>
        <path d="M8 12h8"/>
        <path d="M12 8v8"/>
        <circle cx="12" cy="12" r="3" fill="none"/>
        <path d="M16 8L12 12l-4-4"/>
        <path d="M8 16l4-4 4 4"/>
      </>
    ),
    ariaLabel: 'Practice drill'
  },

  'knowledge-check': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="10" fill="none"/>
        <path d="M9 12l2 2 4-4"/>
        <circle cx="12" cy="12" r="3" fill="none"/>
      </>
    ),
    ariaLabel: 'Knowledge check quiz'
  },

  // Additional icons for modules/index.js
  'teacher': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4" fill="none"/>
        <path d="M12 11v6"/>
        <circle cx="12" cy="15" r="1" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Teacher instructor'
  },
  
  'rules': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" fill="none"/>
        <line x1="7" y1="8" x2="17" y2="8"/>
        <line x1="7" y1="12" x2="17" y2="12"/>
        <line x1="7" y1="16" x2="13" y2="16"/>
      </>
    ),
    ariaLabel: 'Rules and regulations'
  },

  'violation': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="10" fill="none"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </>
    ),
    ariaLabel: 'Violation warning'
  },

  'hand-signal': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M8 2v4l3-3 3 3V2"/>
        <path d="M14 6v6h4"/>
        <path d="M14 18v4"/>
        <path d="M14 12h-4v6h4"/>
      </>
    ),
    ariaLabel: 'Hand signal'
  },

  'court': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="1" fill="none"/>
        <circle cx="6" cy="12" r="3" fill="none"/>
        <circle cx="18" cy="12" r="3" fill="none"/>
        <line x1="12" y1="6" x2="12" y2="18"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Basketball court'
  },

  'movement': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        <path d="M8 16l4-4 4 4"/>
      </>
    ),
    ariaLabel: 'Movement and agility'
  },

  'strategy': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" fill="none"/>
        <path d="M9 9h6v6H9z"/>
        <circle cx="7" cy="7" r="1" fill="currentColor"/>
        <circle cx="17" cy="17" r="1" fill="currentColor"/>
        <path d="M7 17l10-10"/>
      </>
    ),
    ariaLabel: 'Strategy and tactics'
  },

  'communication': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <path d="M9 9h6"/>
        <path d="M9 13h3"/>
      </>
    ),
    ariaLabel: 'Communication'
  },

  'calendar': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <rect x="7" y="14" width="2" height="2"/>
        <rect x="15" y="14" width="2" height="2"/>
      </>
    ),
    ariaLabel: 'Calendar schedule'
  },

  'science': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M9 2v6l-2 4h10l-2-4V2"/>
        <circle cx="12" cy="17" r="5" fill="none"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Sports science'
  },

  // Additional missing icons
  'strength': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M14 4V2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2H6a1 1 0 00-1 1v2a1 1 0 001 1h1v8H6a1 1 0 00-1 1v2a1 1 0 001 1h4a1 1 0 001-1v-2h2v2a1 1 0 001 1h4a1 1 0 001-1v-2a1 1 0 00-1-1h-1V8h1a1 1 0 001-1V5a1 1 0 00-1-1h-4z"/>
      </>
    ),
    ariaLabel: 'Strength training'
  },

  'psychology': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <circle cx="8.5" cy="9" r="1.5" fill="none"/>
        <circle cx="15.5" cy="9" r="1.5" fill="none"/>
        <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </>
    ),
    ariaLabel: 'Sports psychology'
  },

  'billing': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="1" y="4" width="22" height="16" rx="2" fill="none"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </>
    ),
    ariaLabel: 'Billing and payments'
  },

  // Tools and Actions Icons
  'template': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="3" y="2" width="14" height="20" rx="1" fill="none"/>
        <rect x="7" y="6" width="6" height="1" fill="currentColor"/>
        <rect x="7" y="9" width="8" height="1" fill="currentColor"/>
        <rect x="7" y="12" width="5" height="1" fill="currentColor"/>
        <rect x="19" y="4" width="2" height="16" rx="1" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Template'
  },
  'trash': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="m3 6 1.5 14a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1L21 6"/>
        <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </>
    ),
    ariaLabel: 'Delete'
  },
  'save': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17,21 17,13 7,13 7,21"/>
        <polyline points="7,3 7,8 15,8"/>
      </>
    ),
    ariaLabel: 'Save'
  },
  'triangle': {
    viewBox: '0 0 24 24',
    path: 'M12 2 L22 20 L2 20 Z',
    ariaLabel: 'Triangle cone'
  },
  'video': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </>
    ),
    ariaLabel: 'Video'
  },
  'rocket': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </>
    ),
    ariaLabel: 'Rocket launch'
  },
  'pause': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </>
    ),
    ariaLabel: 'Pause'
  },
  'play': {
    viewBox: '0 0 24 24',
    path: 'M8 5v14l11-7z',
    ariaLabel: 'Play'
  },
  'list': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </>
    ),
    ariaLabel: 'List'
  },
  'info': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </>
    ),
    ariaLabel: 'Information'
  },
  'check': {
    viewBox: '0 0 24 24',
    path: 'M20 6L9 17l-5-5',
    ariaLabel: 'Check mark'
  },
  'equipment': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </>
    ),
    ariaLabel: 'Equipment'
  },
  'growth': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </>
    ),
    ariaLabel: 'Growth and progress'
  },
  'chart': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </>
    ),
    ariaLabel: 'Chart'
  },
  'refresh': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </>
    ),
    ariaLabel: 'Refresh'
  },
  'search': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </>
    ),
    ariaLabel: 'Search'
  },
  'plus': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </>
    ),
    ariaLabel: 'Add'
  },
  'filter': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </>
    ),
    ariaLabel: 'Filter'
  },
  'eye': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ),
    ariaLabel: 'View'
  },
  'fire': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
      </>
    ),
    ariaLabel: 'Hot topic'
  },
  'heart': {
    viewBox: '0 0 24 24',
    path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    ariaLabel: 'Like'
  },
  'reply': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <polyline points="9 17 4 12 9 7"/>
        <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
      </>
    ),
    ariaLabel: 'Reply'
  },
  'edit': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="m18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </>
    ),
    ariaLabel: 'Edit'
  },
  'notification-on': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        <circle cx="18" cy="6" r="3" fill="currentColor"/>
      </>
    ),
    ariaLabel: 'Notifications on'
  },
  'notification-off': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </>
    ),
    ariaLabel: 'Notifications off'
  },
  'related': {
    viewBox: '0 0 24 24',
    path: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </>
    ),
    ariaLabel: 'Related'
  }
};