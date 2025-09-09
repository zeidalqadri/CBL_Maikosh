import React, { useState, useEffect } from 'react';
import { AllouiIcon } from '../icons';

const AchievementBadge = ({ achievement, isUnlocked, progress, onClick }) => {
  const getGradientClass = (tier) => {
    switch (tier) {
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'gold': return 'from-alloui-gold to-yellow-500';
      case 'platinum': return 'from-purple-400 to-purple-600';
      case 'legend': return 'from-red-400 to-pink-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getProgressPercentage = () => {
    if (isUnlocked) return 100;
    if (!progress) return 0;
    return Math.min((progress.current / progress.target) * 100, 100);
  };

  return (
    <div 
      onClick={() => onClick(achievement)}
      className={`group relative bg-white rounded-lg shadow-md border transition-all duration-200 cursor-pointer overflow-hidden ${
        isUnlocked 
          ? 'border-alloui-gold hover:shadow-lg hover:border-alloui-gold ring-2 ring-alloui-gold/20' 
          : 'border-gray-200 hover:shadow-md hover:border-gray-300'
      }`}
    >
      {/* Achievement Header */}
      <div className={`bg-gradient-to-r ${getGradientClass(achievement.tier)} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${isUnlocked ? 'bg-white/20' : 'bg-black/20'}`}>
              <AllouiIcon 
                name={achievement.icon} 
                size="lg" 
                className={isUnlocked ? 'text-white' : 'text-white/50'} 
              />
            </div>
            <div className="ml-3">
              <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-white/70'}`}>
                {achievement.name}
              </h3>
              <p className={`text-sm ${isUnlocked ? 'text-white/90' : 'text-white/60'}`}>
                {achievement.tier.toUpperCase()} • {achievement.points} XP
              </p>
            </div>
          </div>
          
          {isUnlocked && (
            <div className="bg-white/20 p-2 rounded-full">
              <AllouiIcon name="check" size="sm" className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Achievement Content */}
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
          {achievement.description}
        </p>

        {/* Progress Bar */}
        {!isUnlocked && progress && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress.current}/{progress.target}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${getGradientClass(achievement.tier)} rounded-full h-2 transition-all duration-300`}
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="space-y-1">
          {achievement.requirements.map((req, index) => (
            <div key={index} className="flex items-start text-xs text-gray-600">
              <AllouiIcon 
                name={isUnlocked ? 'check' : 'circle'} 
                size="xs" 
                className={`mr-2 mt-0.5 flex-shrink-0 ${isUnlocked ? 'text-success-green' : 'text-gray-400'}`} 
              />
              <span className={isUnlocked ? 'line-through text-gray-500' : ''}>{req}</span>
            </div>
          ))}
        </div>

        {/* Unlock Date */}
        {isUnlocked && achievement.unlockedAt && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <AllouiIcon name="calendar" size="xs" className="mr-1" />
              <span>Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Locked Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px]" />
      )}
    </div>
  );
};

const AchievementModal = ({ achievement, isOpen, onClose, isUnlocked, progress }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${achievement.tier === 'gold' ? 'alloui-gold' : achievement.tier === 'silver' ? 'gray-300' : 'orange-400'} to-${achievement.tier === 'gold' ? 'yellow-500' : achievement.tier === 'silver' ? 'gray-500' : 'orange-600'} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-4 rounded-full mr-4">
                <AllouiIcon name={achievement.icon} size="xl" className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{achievement.name}</h2>
                <p className="text-white/90">{achievement.tier.toUpperCase()} Achievement</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            >
              <AllouiIcon name="close" size="sm" className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-bold text-alloui-primary mb-2">Description</h3>
            <p className="text-gray-700">{achievement.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-alloui-primary mb-3">Requirements</h3>
            <div className="space-y-2">
              {achievement.requirements.map((req, index) => (
                <div key={index} className="flex items-start">
                  <AllouiIcon 
                    name={isUnlocked ? 'check' : 'circle'} 
                    size="sm" 
                    className={`mr-3 mt-0.5 flex-shrink-0 ${isUnlocked ? 'text-success-green' : 'text-gray-400'}`} 
                  />
                  <span className={`text-gray-700 ${isUnlocked ? 'line-through text-gray-500' : ''}`}>
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!isUnlocked && progress && (
            <div className="mb-6">
              <h3 className="font-bold text-alloui-primary mb-3">Progress</h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Current Progress</span>
                  <span>{progress.current}/{progress.target}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className={`bg-gradient-to-r from-alloui-primary to-alloui-court-blue rounded-full h-3 transition-all duration-300`}
                    style={{ width: `${Math.min((progress.current / progress.target) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round((progress.current / progress.target) * 100)}% Complete
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-alloui-primary/10 to-alloui-court-blue/10 border border-alloui-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-alloui-primary">Reward</div>
                <div className="text-sm text-gray-600">Experience Points</div>
              </div>
              <div className="text-2xl font-bold text-alloui-gold">
                +{achievement.points} XP
              </div>
            </div>
          </div>

          {isUnlocked && achievement.unlockedAt && (
            <div className="mt-4 text-center text-sm text-gray-500">
              🎉 Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()} 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AchievementSystem = ({ userAchievements = {}, userProgress = {} }) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [filterTier, setFilterTier] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Define all available achievements
  const achievements = [
    {
      id: 'first_login',
      name: 'Welcome Coach!',
      description: 'Complete your first login and explore the coaching platform',
      icon: 'whistle',
      tier: 'bronze',
      points: 50,
      requirements: ['Log in to your coaching account'],
      category: 'getting-started'
    },
    {
      id: 'module_completion',
      name: 'Knowledge Seeker',
      description: 'Complete your first learning module with a passing score',
      icon: 'module',
      tier: 'bronze',
      points: 100,
      requirements: ['Complete Module 1: Introduction to Coaching', 'Achieve 70% or higher on module quiz'],
      category: 'learning'
    },
    {
      id: 'drill_creator',
      name: 'Drill Master',
      description: 'Create and save your first custom basketball drill',
      icon: 'strategy',
      tier: 'silver',
      points: 150,
      requirements: ['Use the Interactive Drill Builder', 'Create and save a custom drill'],
      category: 'tools'
    },
    {
      id: 'scenario_champion',
      name: 'Decision Maker',
      description: 'Complete video scenarios with excellent decision-making skills',
      icon: 'video',
      tier: 'silver',
      points: 200,
      requirements: ['Complete 3 video scenarios', 'Achieve 80% average score across scenarios'],
      category: 'scenarios'
    },
    {
      id: 'community_contributor',
      name: 'Community Helper',
      description: 'Actively participate in the coaching community forums',
      icon: 'communication',
      tier: 'gold',
      points: 300,
      requirements: ['Create 5 forum posts', 'Receive 10 likes on your posts', 'Help answer other coaches\' questions'],
      category: 'community'
    },
    {
      id: 'module_expert',
      name: 'Coaching Scholar',
      description: 'Master all fundamental coaching modules with excellence',
      icon: 'trophy',
      tier: 'gold',
      points: 500,
      requirements: ['Complete all 12 modules', 'Achieve 90% or higher average quiz score', 'Submit all practical assessments'],
      category: 'learning'
    },
    {
      id: 'mentor',
      name: 'Coaching Mentor',
      description: 'Become a guiding voice in the coaching community',
      icon: 'teacher',
      tier: 'platinum',
      points: 750,
      requirements: ['Help 20 new coaches in forums', 'Create 10 high-quality posts', 'Receive community moderator recognition'],
      category: 'community'
    },
    {
      id: 'legend',
      name: 'Basketball Coaching Legend',
      description: 'Achieve mastery across all aspects of the coaching platform',
      icon: 'crown',
      tier: 'legend',
      points: 1000,
      requirements: ['Complete certification requirements', 'Unlock all other achievements', 'Contribute to platform development'],
      category: 'mastery'
    }
  ];

  const tierOptions = [
    { id: 'all', name: 'All Tiers', count: achievements.length },
    { id: 'bronze', name: 'Bronze', count: achievements.filter(a => a.tier === 'bronze').length },
    { id: 'silver', name: 'Silver', count: achievements.filter(a => a.tier === 'silver').length },
    { id: 'gold', name: 'Gold', count: achievements.filter(a => a.tier === 'gold').length },
    { id: 'platinum', name: 'Platinum', count: achievements.filter(a => a.tier === 'platinum').length },
    { id: 'legend', name: 'Legend', count: achievements.filter(a => a.tier === 'legend').length }
  ];

  const statusOptions = [
    { id: 'all', name: 'All Achievements' },
    { id: 'unlocked', name: 'Unlocked' },
    { id: 'locked', name: 'Locked' },
    { id: 'in-progress', name: 'In Progress' }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    const tierMatch = filterTier === 'all' || achievement.tier === filterTier;
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'unlocked' && userAchievements[achievement.id]) ||
      (filterStatus === 'locked' && !userAchievements[achievement.id] && !userProgress[achievement.id]) ||
      (filterStatus === 'in-progress' && userProgress[achievement.id] && !userAchievements[achievement.id]);
    
    return tierMatch && statusMatch;
  });

  const unlockedCount = achievements.filter(a => userAchievements[a.id]).length;
  const totalXP = achievements
    .filter(a => userAchievements[a.id])
    .reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-alloui-primary mb-4 flex items-center justify-center">
          <AllouiIcon name="trophy" size="lg" className="mr-3 text-alloui-gold" />
          Achievement System
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Track your coaching journey and unlock achievements as you master new skills and contribute to the community.
        </p>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-2xl font-bold text-alloui-gold">{unlockedCount}/{achievements.length}</div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-2xl font-bold text-alloui-gold">{totalXP}</div>
            <div className="text-sm text-gray-600">Total Experience</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="text-2xl font-bold text-alloui-gold">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="filter" size="sm" className="mr-2 text-alloui-gold" />
              Filter by Tier
            </h3>
            <div className="flex flex-wrap gap-2">
              {tierOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setFilterTier(option.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterTier === option.id
                      ? 'bg-alloui-gold text-alloui-primary shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.name}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filterTier === option.id ? 'bg-alloui-primary/20' : 'bg-gray-300'
                  }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="settings" size="sm" className="mr-2 text-alloui-gold" />
              Filter by Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setFilterStatus(option.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === option.id
                      ? 'bg-alloui-gold text-alloui-primary shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map(achievement => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            isUnlocked={!!userAchievements[achievement.id]}
            progress={userProgress[achievement.id]}
            onClick={setSelectedAchievement}
          />
        ))}
      </div>

      {/* Achievement Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        isUnlocked={selectedAchievement && !!userAchievements[selectedAchievement.id]}
        progress={selectedAchievement && userProgress[selectedAchievement.id]}
      />
    </div>
  );
};

export default AchievementSystem;