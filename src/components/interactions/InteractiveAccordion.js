import React, { useState, useRef, useEffect } from 'react';
import { AllouiIcon } from '../icons';

/**
 * InteractiveAccordion - Enhanced accordion with basketball theming
 * Converts text blocks to engaging expandable sections
 */
const InteractiveAccordion = ({ 
  items = [],
  multipleOpen = false,
  defaultOpen = [0],
  theme = 'default',
  animated = true,
  className = ""
}) => {
  const [openItems, setOpenItems] = useState(new Set(defaultOpen));

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    
    if (multipleOpen) {
      if (newOpenItems.has(index)) {
        newOpenItems.delete(index);
      } else {
        newOpenItems.add(index);
      }
    } else {
      newOpenItems.clear();
      if (!openItems.has(index)) {
        newOpenItems.add(index);
      }
    }
    
    setOpenItems(newOpenItems);
  };

  const getThemeConfig = () => {
    switch (theme) {
      case 'coaching':
        return {
          containerBg: 'bg-gradient-to-b from-alloui-primary/5 to-alloui-court-blue/5',
          itemBg: 'bg-white',
          itemBorder: 'border border-whistle-silver',
          headerBg: 'bg-alloui-primary',
          headerHoverBg: 'hover:bg-alloui-primary/90',
          headerText: 'text-white',
          contentBg: 'bg-gray-50',
          accent: 'text-alloui-gold'
        };
      case 'fundamentals':
        return {
          containerBg: 'bg-gradient-to-b from-basketball-orange/5 to-success-green/5',
          itemBg: 'bg-white',
          itemBorder: 'border border-basketball-orange/20',
          headerBg: 'bg-basketball-orange',
          headerHoverBg: 'hover:bg-basketball-orange/90',
          headerText: 'text-white',
          contentBg: 'bg-orange-50',
          accent: 'text-success-green'
        };
      case 'drills':
        return {
          containerBg: 'bg-gradient-to-b from-success-green/5 to-m5-primary/5',
          itemBg: 'bg-white',
          itemBorder: 'border border-success-green/20',
          headerBg: 'bg-success-green',
          headerHoverBg: 'hover:bg-success-green/90',
          headerText: 'text-white',
          contentBg: 'bg-green-50',
          accent: 'text-basketball-orange'
        };
      default:
        return {
          containerBg: 'bg-gray-50/50',
          itemBg: 'bg-white',
          itemBorder: 'border border-gray-200',
          headerBg: 'bg-gray-100',
          headerHoverBg: 'hover:bg-gray-200',
          headerText: 'text-gray-900',
          contentBg: 'bg-white',
          accent: 'text-alloui-gold'
        };
    }
  };

  const themeConfig = getThemeConfig();

  return (
    <div className={`${themeConfig.containerBg} rounded-lg p-4 ${className}`}>
      <div className="space-y-3">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            item={item}
            index={index}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
            themeConfig={themeConfig}
            animated={animated}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Individual accordion item component
 */
const AccordionItem = ({ item, index, isOpen, onToggle, themeConfig, animated }) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const hasProgress = item.progress !== undefined;
  const hasIcon = item.icon || item.difficulty || item.category;

  return (
    <div className={`${themeConfig.itemBg} ${themeConfig.itemBorder} rounded-lg overflow-hidden shadow-sm`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full px-4 py-4 text-left ${themeConfig.headerBg} ${themeConfig.headerHoverBg} ${themeConfig.headerText} transition-colors focus:outline-none focus:ring-2 focus:ring-alloui-gold focus:ring-inset`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {/* Icon or category indicator */}
            {hasIcon && (
              <div className="flex-shrink-0">
                {item.icon ? (
                  <AllouiIcon name={item.icon} size="sm" className={themeConfig.accent} />
                ) : item.difficulty ? (
                  <div className="flex space-x-0.5">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= item.difficulty 
                            ? 'bg-basketball-orange' 
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                ) : item.category ? (
                  <span className="px-2 py-1 text-xs font-medium bg-white/20 rounded text-white">
                    {item.category}
                  </span>
                ) : null}
              </div>
            )}

            {/* Title and subtitle */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.title}</h3>
              {item.subtitle && (
                <p className="text-sm opacity-80 mt-1">{item.subtitle}</p>
              )}
            </div>

            {/* Progress indicator */}
            {hasProgress && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                  <span className="text-xs font-bold">{item.progress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Expand/collapse icon */}
          <div className="flex-shrink-0 ml-2">
            <AllouiIcon 
              name="chevron-down" 
              size="sm"
              className={`transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        style={animated ? { height: `${contentHeight}px` } : undefined}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          !animated && !isOpen ? 'hidden' : ''
        }`}
      >
        <div className={`${themeConfig.contentBg} p-4 border-t border-gray-200/50`}>
          {/* Main content */}
          <div className="prose prose-sm max-w-none text-gray-700">
            {item.content}
          </div>

          {/* Key points */}
          {item.keyPoints && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Points:</h4>
              <ul className="space-y-2">
                {item.keyPoints.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-basketball-orange rounded-full mt-2 mr-3"></span>
                    <span className="text-sm text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {item.tags && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 text-xs font-medium bg-alloui-gold/20 text-alloui-primary rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {item.actions && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {item.actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={action.onClick}
                    className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                      action.primary
                        ? 'bg-alloui-gold text-white hover:bg-alloui-gold/90'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {action.icon && (
                      <AllouiIcon name={action.icon} size="xs" className="mr-1" />
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Pre-configured accordion variants for common use cases
 */
export const CoachingAccordion = (props) => (
  <InteractiveAccordion theme="coaching" {...props} />
);

export const FundamentalsAccordion = (props) => (
  <InteractiveAccordion theme="fundamentals" {...props} />
);

export const DrillsAccordion = (props) => (
  <InteractiveAccordion theme="drills" multipleOpen {...props} />
);

export default InteractiveAccordion;