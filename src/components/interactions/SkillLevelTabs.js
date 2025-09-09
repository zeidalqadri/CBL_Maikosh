import React, { useState } from 'react';
import { AllouiIcon } from '../icons';

/**
 * SkillLevelTabs - Progressive disclosure for different skill levels
 * Creates tabbed interfaces for beginner, intermediate, and advanced content
 */
const SkillLevelTabs = ({ 
  levels = [],
  defaultLevel = 0,
  vertical = false,
  showProgressionPath = true,
  className = ""
}) => {
  const [activeLevel, setActiveLevel] = useState(defaultLevel);

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 1: return 'star-outline';
      case 2: return 'star-half';
      case 3: return 'star-full';
      default: return 'circle';
    }
  };

  const getDifficultyColor = (difficulty, isActive) => {
    if (!isActive) return 'text-gray-400';
    
    switch (difficulty) {
      case 1: return 'text-success-green';
      case 2: return 'text-basketball-orange';
      case 3: return 'text-team-red';
      default: return 'text-alloui-primary';
    }
  };

  const getProgressPercentage = () => {
    if (levels.length === 0) return 0;
    return ((activeLevel + 1) / levels.length) * 100;
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Progress Header */}
      {showProgressionPath && (
        <div className="bg-gradient-to-r from-alloui-primary to-alloui-court-blue text-white p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Skill Progression Path</h3>
            <div className="text-sm opacity-80">
              Level {activeLevel + 1} of {levels.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-alloui-gold h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          {/* Current level info */}
          {levels[activeLevel] && (
            <div className="mt-2 text-sm opacity-90">
              <strong>{levels[activeLevel].name}:</strong> {levels[activeLevel].description}
            </div>
          )}
        </div>
      )}

      <div className={`flex ${vertical ? 'flex-row' : 'flex-col'}`}>
        {/* Tabs */}
        <div className={`${vertical ? 'flex-col w-1/4 border-r' : 'flex-row border-b'} flex bg-gray-50`}>
          {levels.map((level, index) => (
            <button
              key={index}
              onClick={() => setActiveLevel(index)}
              className={`
                ${vertical ? 'w-full' : 'flex-1'} 
                px-4 py-3 text-left transition-all duration-200
                ${activeLevel === index 
                  ? 'bg-white text-alloui-primary border-l-4 border-alloui-gold shadow-sm' 
                  : 'text-gray-600 hover:text-alloui-primary hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                {/* Difficulty indicator */}
                <div className={`${getDifficultyColor(level.difficulty, activeLevel === index)}`}>
                  <AllouiIcon 
                    name={getDifficultyIcon(level.difficulty)} 
                    size="sm" 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">{level.name}</div>
                  {level.subtitle && (
                    <div className="text-xs text-gray-500 mt-0.5">{level.subtitle}</div>
                  )}
                </div>

                {/* Completion status */}
                {level.completed && (
                  <AllouiIcon 
                    name="check-circle" 
                    size="sm" 
                    className="text-success-green"
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`${vertical ? 'flex-1' : ''} p-6`}>
          {levels[activeLevel] && (
            <SkillLevelContent level={levels[activeLevel]} />
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Content component for individual skill levels
 */
const SkillLevelContent = ({ level }) => {
  return (
    <div className="space-y-6">
      {/* Level header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-alloui-primary">{level.name}</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Difficulty:</span>
            <div className="flex space-x-0.5">
              {[1, 2, 3].map((star) => (
                <AllouiIcon
                  key={star}
                  name="star-full"
                  size="xs"
                  className={star <= level.difficulty ? 'text-basketball-orange' : 'text-gray-300'}
                />
              ))}
            </div>
          </div>
        </div>
        
        {level.description && (
          <p className="text-gray-600 mt-2">{level.description}</p>
        )}
      </div>

      {/* Prerequisites */}
      {level.prerequisites && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-alloui-primary mb-2 flex items-center">
            <AllouiIcon name="info" size="sm" className="mr-2" />
            Prerequisites
          </h4>
          <ul className="space-y-1">
            {level.prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-center text-sm">
                <AllouiIcon name="check" size="xs" className="text-success-green mr-2" />
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main content */}
      <div className="prose prose-sm max-w-none">
        {level.content}
      </div>

      {/* Skills to develop */}
      {level.skills && (
        <div>
          <h4 className="font-semibold text-alloui-primary mb-3 flex items-center">
            <AllouiIcon name="target" size="sm" className="mr-2" />
            Skills to Develop
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {level.skills.map((skill, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AllouiIcon 
                  name="basketball" 
                  size="xs" 
                  className="text-basketball-orange mt-1 flex-shrink-0" 
                />
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drills */}
      {level.drills && (
        <div>
          <h4 className="font-semibold text-alloui-primary mb-3 flex items-center">
            <AllouiIcon name="drill" size="sm" className="mr-2" />
            Recommended Drills
          </h4>
          <div className="space-y-3">
            {level.drills.map((drill, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium">{drill.name}</h5>
                  {drill.duration && (
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {drill.duration}
                    </span>
                  )}
                </div>
                {drill.description && (
                  <p className="text-sm text-gray-600">{drill.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success metrics */}
      {level.successMetrics && (
        <div className="bg-success-green/10 rounded-lg p-4">
          <h4 className="font-semibold text-success-green mb-2 flex items-center">
            <AllouiIcon name="trophy" size="sm" className="mr-2" />
            Success Metrics
          </h4>
          <ul className="space-y-1">
            {level.successMetrics.map((metric, index) => (
              <li key={index} className="flex items-center text-sm">
                <AllouiIcon name="target" size="xs" className="text-success-green mr-2" />
                {metric}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common mistakes */}
      {level.commonMistakes && (
        <div className="bg-team-red/10 rounded-lg p-4">
          <h4 className="font-semibold text-team-red mb-2 flex items-center">
            <AllouiIcon name="warning" size="sm" className="mr-2" />
            Common Mistakes to Avoid
          </h4>
          <ul className="space-y-1">
            {level.commonMistakes.map((mistake, index) => (
              <li key={index} className="flex items-center text-sm">
                <AllouiIcon name="x-circle" size="xs" className="text-team-red mr-2" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next steps */}
      {level.nextSteps && (
        <div className="border-t pt-4 mt-6">
          <h4 className="font-semibold text-alloui-primary mb-2">What's Next?</h4>
          <p className="text-gray-600 text-sm">{level.nextSteps}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Pre-configured skill level tabs for common coaching scenarios
 */
export const CoachingLevelTabs = ({ children, ...props }) => (
  <SkillLevelTabs 
    levels={[
      {
        name: "Beginner Coach",
        subtitle: "New to coaching",
        difficulty: 1,
        description: "Starting your coaching journey with fundamental concepts"
      },
      {
        name: "Intermediate Coach", 
        subtitle: "1-3 years experience",
        difficulty: 2,
        description: "Building on basics with advanced strategies and techniques"
      },
      {
        name: "Advanced Coach",
        subtitle: "3+ years experience", 
        difficulty: 3,
        description: "Mastering complex concepts and leadership skills"
      }
    ]}
    {...props}
  >
    {children}
  </SkillLevelTabs>
);

export const PlayerDevelopmentTabs = ({ children, ...props }) => (
  <SkillLevelTabs
    levels={[
      {
        name: "Youth (8-12)",
        subtitle: "Foundation building",
        difficulty: 1,
        description: "Focus on fun, basic skills, and game understanding"
      },
      {
        name: "Teen (13-17)", 
        subtitle: "Skill refinement",
        difficulty: 2,
        description: "Developing advanced techniques and tactical awareness"
      },
      {
        name: "Adult/Elite",
        subtitle: "Peak performance",
        difficulty: 3,
        description: "Perfecting skills and maximizing potential"
      }
    ]}
    {...props}
  >
    {children}
  </SkillLevelTabs>
);

export default SkillLevelTabs;