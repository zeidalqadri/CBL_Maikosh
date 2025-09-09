import React, { useState } from 'react';
import { AllouiIcon } from '../icons';

/**
 * CoachsCornerTip - Basketball-themed coaching tips and insights
 * Transforms generic "Remember" boxes to themed coaching elements
 */
const CoachsCornerTip = ({ 
  type = 'tip', // 'tip', 'protip', 'mistake', 'drill'
  title,
  children,
  icon,
  expandable = false,
  coach = 'Coach',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(!expandable);

  const getTypeConfig = () => {
    switch (type) {
      case 'protip':
        return {
          bgColor: 'bg-gradient-to-r from-alloui-gold/10 to-basketball-orange/10',
          borderColor: 'border-l-4 border-alloui-gold',
          iconName: icon || 'trophy',
          iconColor: 'text-alloui-gold',
          headerBg: 'bg-alloui-gold/20',
          defaultTitle: 'Pro Tip from the Coach',
          animation: 'animate-pulse-subtle'
        };
      case 'mistake':
        return {
          bgColor: 'bg-gradient-to-r from-team-red/10 to-basketball-orange/10',
          borderColor: 'border-l-4 border-team-red',
          iconName: icon || 'warning',
          iconColor: 'text-team-red',
          headerBg: 'bg-team-red/20',
          defaultTitle: 'Common Mistake Alert',
          animation: 'animate-pulse'
        };
      case 'drill':
        return {
          bgColor: 'bg-gradient-to-r from-success-green/10 to-m5-primary/10',
          borderColor: 'border-l-4 border-success-green',
          iconName: icon || 'drill',
          iconColor: 'text-success-green',
          headerBg: 'bg-success-green/20',
          defaultTitle: 'Drill Spotlight',
          animation: ''
        };
      default: // 'tip'
        return {
          bgColor: 'bg-gradient-to-r from-alloui-primary/10 to-alloui-court-blue/10',
          borderColor: 'border-l-4 border-alloui-primary',
          iconName: icon || 'whistle',
          iconColor: 'text-alloui-primary',
          headerBg: 'bg-alloui-primary/20',
          defaultTitle: "Coach's Corner",
          animation: ''
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className={`${config.bgColor} ${config.borderColor} rounded-lg overflow-hidden shadow-md mb-6 ${className}`}>
      {/* Header */}
      <div 
        className={`${config.headerBg} px-4 py-3 ${expandable ? 'cursor-pointer' : ''}`}
        onClick={expandable ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`${config.iconColor} ${config.animation}`}>
              <AllouiIcon 
                name={config.iconName} 
                size="md" 
                className="drop-shadow-sm"
              />
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {title || config.defaultTitle}
              </h4>
              {coach && type !== 'mistake' && (
                <p className="text-sm text-gray-600 mt-0.5">
                  <span className="font-medium">{coach}</span> shares an insight
                </p>
              )}
            </div>
          </div>

          {expandable && (
            <div className="text-gray-500">
              <AllouiIcon 
                name="chevron-down" 
                size="sm"
                className={`transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          <div className="prose prose-sm max-w-none text-gray-700">
            {children}
          </div>

          {/* Basketball-themed decorative element */}
          <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <AllouiIcon name="basketball" size="xs" className="text-basketball-orange" />
              <span>Keep practicing and improving</span>
              <AllouiIcon name="basketball" size="xs" className="text-basketball-orange" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Specialized versions for different coaching scenarios
 */
export const ProTip = ({ children, coach = "Coach", ...props }) => (
  <CoachsCornerTip type="protip" coach={coach} {...props}>
    {children}
  </CoachsCornerTip>
);

export const CommonMistake = ({ children, ...props }) => (
  <CoachsCornerTip 
    type="mistake" 
    title="Avoid This Common Mistake"
    {...props}
  >
    {children}
  </CoachsCornerTip>
);

export const DrillSpotlight = ({ children, title, ...props }) => (
  <CoachsCornerTip 
    type="drill" 
    title={title || "Featured Drill"}
    {...props}
  >
    {children}
  </CoachsCornerTip>
);

/**
 * Interactive Coaching Quote component
 */
export const CoachingQuote = ({ quote, author = "Basketball Wisdom", className = "" }) => (
  <div className={`bg-gradient-to-r from-alloui-gold/20 to-basketball-orange/20 rounded-lg p-6 border border-alloui-gold/30 ${className}`}>
    <div className="flex items-start space-x-4">
      <div className="text-alloui-gold text-4xl font-serif leading-none">"</div>
      <div>
        <blockquote className="text-lg font-medium text-gray-800 italic mb-2">
          {quote}
        </blockquote>
        <cite className="text-sm text-gray-600 font-medium">
          — {author}
        </cite>
      </div>
      <div className="text-alloui-gold text-4xl font-serif leading-none self-end">"</div>
    </div>
    
    <div className="flex items-center justify-center mt-4 pt-4 border-t border-alloui-gold/20">
      <AllouiIcon name="whistle" size="sm" className="text-alloui-gold" />
    </div>
  </div>
);

export default CoachsCornerTip;