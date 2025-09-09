/**
 * Module Icon Mapping Utility
 * Provides consistent iconography across all basketball coaching modules
 * Replaces emoticons with AllouiIcon equivalents
 */

export const getModuleTabConfig = () => [
  { id: 'overview', name: 'Overview', iconName: 'overview' },
  { id: 'concepts', name: 'Key Concepts', iconName: 'insight' },
  { id: 'drills', name: 'Practical Drills', iconName: 'drill' },
  { id: 'quiz', name: 'Knowledge Check', iconName: 'knowledge-check' },
  { id: 'resources', name: 'Resources', iconName: 'resources' }
];

// Emoticon to AllouiIcon mapping for legacy support
export const emoticonToIconMapping = {
  '📋': 'overview',
  '💡': 'insight', 
  '🏀': 'basketball',
  '✅': 'success',
  '📚': 'resources',
  '🎯': 'target',
  '⚡': 'loading',
  '🏆': 'trophy',
  '🔒': 'locked',
  '🔓': 'unlocked',
  '➜': 'arrow-right',
  '→': 'arrow-right',
  '📱': 'settings',
  '⚙️': 'settings',
  '👤': 'user',
  '🏠': 'home',
  '🎖️': 'medal',
  '🌟': 'success',
  '⭐': 'success'
};

// Basketball-themed icon variants for different module types
export const getModuleIconVariant = (moduleNumber) => {
  if (moduleNumber <= 3) return 'default'; // Fundamentals
  if (moduleNumber <= 6) return 'basketball'; // Skills
  if (moduleNumber <= 9) return 'gold'; // Advanced
  return 'navy'; // Mastery
};

// Get appropriate icon for module navigation
export const getModuleNavIcon = (moduleNumber) => {
  const variants = {
    1: 'home',
    2: 'user', 
    3: 'whistle',
    4: 'whistle',
    5: 'drill',
    6: 'target',
    7: 'basketball-hoop',
    8: 'target',
    9: 'settings',
    10: 'insight',
    11: 'trophy',
    12: 'medal'
  };
  return variants[moduleNumber] || 'module';
};