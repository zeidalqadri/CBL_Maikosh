import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import AccessibleButton from './AccessibleButton';
import AccessibleModal from './AccessibleModal';
import { announceToScreenReader } from '../../utils/accessibility';

/**
 * Accessibility Control Panel
 * Provides users with comprehensive accessibility options and customizations
 */
const AccessibilityPanel = ({ 
  isOpen, 
  onClose, 
  className = '' 
}) => {
  const {
    currentTheme,
    theme,
    fontSize,
    reducedMotion,
    themes,
    fontSizes,
    changeTheme,
    changeFontSize,
    toggleReducedMotion,
    resetToDefaults,
    meetsContrastRequirements
  } = useTheme();
  
  const [activeTab, setActiveTab] = useState('appearance');
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    announceToScreenReader(`Switched to ${tab} settings`);
  };
  
  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'motion', label: 'Motion & Animation', icon: '⚡' },
    { id: 'text', label: 'Text & Reading', icon: '📖' },
    { id: 'navigation', label: 'Navigation', icon: '🧭' }
  ];
  
  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Accessibility Settings"
      description="Customize your learning experience with accessibility options"
      size="large"
      className={className}
    >
      <div className="flex flex-col md:flex-row min-h-96">
        {/* Tab Navigation */}
        <nav 
          className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 p-4"
          role="tablist"
          aria-label="Accessibility settings categories"
        >
          <ul className="space-y-2">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-basketball-orange text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <span className="flex items-center">
                    <span className="mr-3" aria-hidden="true">{tab.icon}</span>
                    {tab.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Tab Content */}
        <div className="md:w-2/3 p-6">
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div 
              role="tabpanel"
              id="panel-appearance"
              aria-labelledby="tab-appearance"
            >
              <h3 className="text-lg font-semibold mb-4">Visual Appearance</h3>
              
              {/* Theme Selection */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Color Theme</h4>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(themes).map(([key, themeConfig]) => (
                    <label
                      key={key}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        currentTheme === key
                          ? 'border-basketball-orange bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={key}
                        checked={currentTheme === key}
                        onChange={() => changeTheme(key)}
                        className="sr-only"
                      />
                      <div 
                        className="w-8 h-8 rounded-full mr-3 flex-shrink-0 border-2"
                        style={{ 
                          backgroundColor: themeConfig.colors.primary,
                          borderColor: themeConfig.colors.background === '#FFFFFF' ? '#e5e7eb' : themeConfig.colors.background
                        }}
                        aria-hidden="true"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{themeConfig.name}</div>
                        <div className="text-sm text-gray-600">
                          {key === 'highContrast' && 'Enhanced contrast for better visibility'}
                          {key === 'darkMode' && 'Easier on the eyes in low light'}
                          {key === 'default' && 'Standard color scheme'}
                        </div>
                      </div>
                      {currentTheme === key && (
                        <svg 
                          className="w-5 h-5 text-basketball-orange" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Contrast Information */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Contrast Level</h5>
                <p className="text-sm text-blue-700">
                  {meetsContrastRequirements('AAA') ? (
                    <>✅ Exceeds WCAG AAA standards (7:1 ratio)</>
                  ) : meetsContrastRequirements('AA') ? (
                    <>✅ Meets WCAG AA standards (4.5:1 ratio)</>
                  ) : (
                    <>⚠️ Below recommended contrast levels</>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {/* Motion Tab */}
          {activeTab === 'motion' && (
            <div 
              role="tabpanel"
              id="panel-motion"
              aria-labelledby="tab-motion"
            >
              <h3 className="text-lg font-semibold mb-4">Motion & Animation</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={toggleReducedMotion}
                    className="form-checkbox text-basketball-orange focus:ring-basketball-orange mr-3"
                  />
                  <div>
                    <div className="font-medium">Reduce Motion</div>
                    <div className="text-sm text-gray-600">
                      Minimizes animations and motion effects throughout the site
                    </div>
                  </div>
                </label>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">About Reduced Motion</h5>
                  <p className="text-sm text-yellow-700">
                    This setting helps users who are sensitive to motion, have vestibular disorders, 
                    or prefer a calmer interface experience.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Text Tab */}
          {activeTab === 'text' && (
            <div 
              role="tabpanel"
              id="panel-text"
              aria-labelledby="tab-text"
            >
              <h3 className="text-lg font-semibold mb-4">Text & Reading</h3>
              
              {/* Font Size */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Text Size</h4>
                <div className="space-y-3">
                  {Object.entries(fontSizes).map(([key, sizes]) => (
                    <label
                      key={key}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        fontSize === key
                          ? 'border-basketball-orange bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fontSize"
                        value={key}
                        checked={fontSize === key}
                        onChange={() => changeFontSize(key)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div 
                          className="font-medium capitalize"
                          style={{ fontSize: sizes.lg }}
                        >
                          {key} Text
                        </div>
                        <div className="text-sm text-gray-600">
                          Base size: {sizes.base}
                        </div>
                      </div>
                      {fontSize === key && (
                        <svg 
                          className="w-5 h-5 text-basketball-orange" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Tab */}
          {activeTab === 'navigation' && (
            <div 
              role="tabpanel"
              id="panel-navigation"
              aria-labelledby="tab-navigation"
            >
              <h3 className="text-lg font-semibold mb-4">Navigation Assistance</h3>
              
              <div className="space-y-6">
                {/* Keyboard Shortcuts Info */}
                <div>
                  <h4 className="font-medium mb-3">Keyboard Shortcuts</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="font-mono bg-gray-200 px-2 py-1 rounded">Tab</dt>
                        <dd>Navigate forward</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-mono bg-gray-200 px-2 py-1 rounded">Shift + Tab</dt>
                        <dd>Navigate backward</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-mono bg-gray-200 px-2 py-1 rounded">Enter/Space</dt>
                        <dd>Activate button/link</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-mono bg-gray-200 px-2 py-1 rounded">Arrow Keys</dt>
                        <dd>Navigate within components</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-mono bg-gray-200 px-2 py-1 rounded">Escape</dt>
                        <dd>Close modals/menus</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                {/* Screen Reader Info */}
                <div>
                  <h4 className="font-medium mb-3">Screen Reader Support</h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      This site is optimized for screen readers including NVDA, JAWS, and VoiceOver. 
                      All interactive elements have proper labels and descriptions.
                    </p>
                  </div>
                </div>
                
                {/* Focus Indicators */}
                <div>
                  <h4 className="font-medium mb-3">Focus Indicators</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Visible focus indicators help you see which element is currently selected.
                  </p>
                  <div className="space-y-2">
                    <AccessibleButton variant="primary" size="small">
                      Example Button (try Tab to focus)
                    </AccessibleButton>
                    <a href="#" className="inline-block text-basketball-orange hover:underline">
                      Example Link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <AccessibleButton
                onClick={resetToDefaults}
                variant="secondary"
                ariaLabel="Reset all accessibility settings to default values"
              >
                Reset to Defaults
              </AccessibleButton>
              
              <AccessibleButton
                onClick={onClose}
                variant="primary"
                ariaLabel="Close accessibility settings panel"
              >
                Done
              </AccessibleButton>
            </div>
          </div>
        </div>
      </div>
    </AccessibleModal>
  );
};

export default AccessibilityPanel;