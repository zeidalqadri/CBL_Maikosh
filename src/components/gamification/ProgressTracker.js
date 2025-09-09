import React from 'react';
import { AllouiIcon } from '../icons';

const ExperienceBar = ({ currentXP, nextLevelXP, level, levelName }) => {
  const percentage = (currentXP / nextLevelXP) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-alloui-primary">Coach Level {level}</h3>
          <p className="text-sm text-gray-600">{levelName}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-alloui-gold">{currentXP}</div>
          <div className="text-xs text-gray-500">/ {nextLevelXP} XP</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="bg-gray-200 rounded-full h-4">
          <div 
            className="bg-gradient-to-r from-alloui-primary to-alloui-gold rounded-full h-4 transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <div className="h-full rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-600">
        <span>{Math.round(percentage)}% to next level</span>
        <span>{nextLevelXP - currentXP} XP remaining</span>
      </div>
    </div>
  );
};

const SkillProgressCard = ({ skill, level, progress, maxLevel = 5 }) => {
  const getSkillColor = (level) => {
    if (level >= 5) return 'from-purple-400 to-purple-600';
    if (level >= 4) return 'from-alloui-gold to-yellow-500';
    if (level >= 3) return 'from-success-green to-green-600';
    if (level >= 2) return 'from-basketball-orange to-orange-600';
    return 'from-gray-400 to-gray-600';
  };

  const getSkillLabel = (level) => {
    if (level >= 5) return 'Master';
    if (level >= 4) return 'Expert';
    if (level >= 3) return 'Advanced';
    if (level >= 2) return 'Intermediate';
    if (level >= 1) return 'Beginner';
    return 'Novice';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <AllouiIcon name={skill.icon} size="sm" className="text-alloui-primary mr-2" />
          <div>
            <h4 className="font-bold text-alloui-primary">{skill.name}</h4>
            <p className="text-xs text-gray-600">{getSkillLabel(level)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-alloui-gold">Lv.{level}</div>
        </div>
      </div>

      {/* Skill Level Stars */}
      <div className="flex items-center space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <AllouiIcon
            key={star}
            name="star"
            size="sm"
            className={star <= level ? 'text-alloui-gold' : 'text-gray-300'}
          />
        ))}
      </div>

      {/* Progress to Next Level */}
      {level < maxLevel && progress && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress to Lv.{level + 1}</span>
            <span>{progress.current}/{progress.target}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r ${getSkillColor(level + 1)} rounded-full h-2 transition-all duration-300`}
              style={{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {level >= maxLevel && (
        <div className="text-center text-xs text-purple-600 font-bold">
          🌟 MASTERED 🌟
        </div>
      )}
    </div>
  );
};

const StreakCounter = ({ currentStreak, longestStreak, streakType = 'daily' }) => {
  const getStreakIcon = () => {
    if (currentStreak >= 30) return 'fire';
    if (currentStreak >= 7) return 'star';
    return 'calendar';
  };

  const getStreakColor = () => {
    if (currentStreak >= 30) return 'text-red-500';
    if (currentStreak >= 7) return 'text-alloui-gold';
    return 'text-basketball-orange';
  };

  return (
    <div className="bg-gradient-to-r from-basketball-orange/10 to-alloui-gold/10 border border-basketball-orange/20 rounded-lg p-4">
      <div className="text-center">
        <AllouiIcon name={getStreakIcon()} size="xl" className={getStreakColor()} />
        <div className="mt-2">
          <div className={`text-2xl font-bold ${getStreakColor()}`}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </div>
          <div className="text-sm text-gray-600 capitalize">{streakType} Learning Streak</div>
          {longestStreak > currentStreak && (
            <div className="text-xs text-gray-500 mt-1">
              Best: {longestStreak} days
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActivityHeatmap = ({ activityData = {} }) => {
  // Generate last 12 weeks of dates
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();
  const weeks = [];
  
  // Group dates into weeks
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const getActivityLevel = (date) => {
    const dateString = date.toISOString().split('T')[0];
    const activity = activityData[dateString] || 0;
    
    if (activity === 0) return 'bg-gray-100';
    if (activity <= 2) return 'bg-success-green/30';
    if (activity <= 4) return 'bg-success-green/60';
    return 'bg-success-green';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <h4 className="font-bold text-alloui-primary mb-3 flex items-center">
        <AllouiIcon name="chart" size="sm" className="mr-2 text-alloui-gold" />
        Learning Activity
      </h4>
      
      <div className="mb-3">
        <div className="grid grid-cols-12 gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="space-y-1">
              {week.map((date, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getActivityLevel(date)}`}
                  title={`${date.toLocaleDateString()}: ${activityData[date.toISOString().split('T')[0]] || 0} activities`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>Less</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
          <div className="w-3 h-3 rounded-sm bg-success-green/30"></div>
          <div className="w-3 h-3 rounded-sm bg-success-green/60"></div>
          <div className="w-3 h-3 rounded-sm bg-success-green"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

const MilestoneTimeline = ({ milestones = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h4 className="font-bold text-alloui-primary mb-4 flex items-center">
        <AllouiIcon name="timeline" size="sm" className="mr-2 text-alloui-gold" />
        Coaching Journey Milestones
      </h4>

      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex items-start">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              milestone.completed 
                ? 'bg-success-green' 
                : milestone.current 
                ? 'bg-alloui-gold' 
                : 'bg-gray-300'
            }`}>
              <AllouiIcon 
                name={milestone.icon} 
                size="sm" 
                className={milestone.completed || milestone.current ? 'text-white' : 'text-gray-600'} 
              />
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h5 className={`font-bold ${milestone.completed ? 'text-success-green' : 'text-alloui-primary'}`}>
                  {milestone.title}
                </h5>
                {milestone.completed && (
                  <span className="text-xs text-gray-500">
                    {milestone.completedAt}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
              
              {milestone.current && milestone.progress && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{milestone.progress.current}/{milestone.progress.target}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-alloui-gold rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(milestone.progress.current / milestone.progress.target) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressTracker = ({ 
  userLevel = 1, 
  currentXP = 0, 
  nextLevelXP = 1000,
  userSkills = {},
  currentStreak = 0,
  longestStreak = 0,
  activityData = {},
  milestones = []
}) => {
  const levelNames = {
    1: 'Rookie Coach',
    2: 'Learning Coach',
    3: 'Developing Coach', 
    4: 'Skilled Coach',
    5: 'Advanced Coach',
    6: 'Expert Coach',
    7: 'Master Coach',
    8: 'Elite Coach',
    9: 'Legendary Coach',
    10: 'Hall of Fame Coach'
  };

  const coachingSkills = [
    { id: 'fundamentals', name: 'Fundamentals', icon: 'basketball' },
    { id: 'tactics', name: 'Tactics & Strategy', icon: 'strategy' },
    { id: 'communication', name: 'Communication', icon: 'communication' },
    { id: 'leadership', name: 'Leadership', icon: 'whistle' },
    { id: 'player-development', name: 'Player Development', icon: 'growth' },
    { id: 'game-management', name: 'Game Management', icon: 'timer' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-alloui-primary mb-4 flex items-center justify-center">
          <AllouiIcon name="growth" size="lg" className="mr-3 text-alloui-gold" />
          Progress Tracking
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Monitor your coaching development journey with detailed progress tracking and skill advancement.
        </p>
      </div>

      {/* Experience Level */}
      <ExperienceBar
        currentXP={currentXP}
        nextLevelXP={nextLevelXP}
        level={userLevel}
        levelName={levelNames[userLevel] || 'Champion Coach'}
      />

      {/* Skills and Streak Row */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Coaching Skills */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-alloui-primary mb-4 flex items-center">
              <AllouiIcon name="target" size="sm" className="mr-2 text-alloui-gold" />
              Coaching Skills
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coachingSkills.map(skill => (
                <SkillProgressCard
                  key={skill.id}
                  skill={skill}
                  level={userSkills[skill.id]?.level || 0}
                  progress={userSkills[skill.id]?.progress}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* Learning Streak */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-alloui-primary mb-4 flex items-center">
              <AllouiIcon name="fire" size="sm" className="mr-2 text-basketball-orange" />
              Learning Streak
            </h3>
            <StreakCounter
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              streakType="daily"
            />
          </div>
        </div>
      </div>

      {/* Activity and Milestones */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ActivityHeatmap activityData={activityData} />
        <MilestoneTimeline milestones={milestones} />
      </div>
    </div>
  );
};

export default ProgressTracker;