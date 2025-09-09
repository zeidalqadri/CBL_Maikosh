import React, { useState } from 'react';
import { AllouiIcon } from '../icons';
import { videoScenarios, scenarioCategories, difficultyLevels, getScenariosByCategory } from '../../data/videoScenarios';

const ScenarioCard = ({ scenario, onStart }) => {
  const levelInfo = difficultyLevels.find(level => level.id === scenario.level);
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-alloui-gold transition-all duration-200 overflow-hidden">
      {/* Card Header with Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-alloui-primary to-alloui-court-blue">
        <div className="absolute inset-0 flex items-center justify-center">
          <AllouiIcon name="video" size="xl" className="text-alloui-gold/30" />
        </div>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${levelInfo.color} text-white`}>
            {levelInfo.name}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
          {scenario.estimatedTime}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/70 text-white p-3 rounded">
            <h3 className="font-bold text-lg mb-1">{scenario.title}</h3>
            <p className="text-sm opacity-90">{scenario.description}</p>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Category and Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AllouiIcon 
              name={scenarioCategories.find(cat => cat.id === scenario.category)?.icon || 'video'} 
              size="xs" 
              className="text-alloui-primary" 
            />
            <span className="text-sm font-medium text-gray-600 capitalize">{scenario.category}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <AllouiIcon name="user" size="xs" />
            <span>{scenario.segments.length} segments</span>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-alloui-primary mb-2">Learning Objectives:</h4>
          <ul className="space-y-1">
            {scenario.learningObjectives.slice(0, 2).map((objective, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <AllouiIcon name="check" size="xs" className="text-success-green mt-0.5 mr-2 flex-shrink-0" />
                <span>{objective}</span>
              </li>
            ))}
            {scenario.learningObjectives.length > 2 && (
              <li className="text-sm text-gray-500 italic">
                +{scenario.learningObjectives.length - 2} more objectives...
              </li>
            )}
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStart(scenario)}
          className="w-full bg-gradient-to-r from-alloui-primary to-alloui-court-blue hover:from-alloui-court-blue hover:to-alloui-primary text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          <AllouiIcon name="play" size="sm" className="mr-2" />
          Start Scenario
        </button>
      </div>
    </div>
  );
};

const ScenarioLibrary = ({ onScenarioSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const filteredScenarios = Object.values(videoScenarios).filter(scenario => {
    const categoryMatch = selectedCategory === 'all' || scenario.category === selectedCategory;
    const levelMatch = selectedLevel === 'all' || scenario.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-alloui-primary mb-4 flex items-center justify-center">
          <AllouiIcon name="video" size="lg" className="mr-3 text-alloui-gold" />
          Video Scenario Challenges
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Practice real coaching situations through interactive video scenarios. Make decisions, 
          receive feedback, and build your coaching confidence in a safe learning environment.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="settings" size="sm" className="mr-2 text-alloui-gold" />
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {scenarioCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-alloui-gold text-alloui-primary shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <AllouiIcon name={category.icon} size="xs" className="mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <h3 className="font-bold text-alloui-primary mb-3 flex items-center">
              <AllouiIcon name="target" size="sm" className="mr-2 text-alloui-gold" />
              Difficulty Level
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedLevel === 'all'
                    ? 'bg-alloui-gold text-alloui-primary shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Levels
              </button>
              {difficultyLevels.map(level => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedLevel === level.id
                      ? `bg-${level.color} text-white shadow-md`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          <span className="font-medium text-alloui-primary">{filteredScenarios.length}</span> scenarios found
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <AllouiIcon name="info" size="xs" />
          <span>Click any scenario to start learning</span>
        </div>
      </div>

      {/* Scenarios Grid */}
      {filteredScenarios.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onStart={onScenarioSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AllouiIcon name="search" size="xl" className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-500 mb-2">No scenarios found</h3>
          <p className="text-gray-400">Try adjusting your filters to see more scenarios.</p>
        </div>
      )}

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-r from-basketball-orange/10 to-alloui-gold/10 border border-basketball-orange/20 rounded-lg p-6 text-center">
        <AllouiIcon name="rocket" size="lg" className="text-basketball-orange mx-auto mb-3" />
        <h3 className="text-xl font-bold text-alloui-primary mb-2">More Scenarios Coming Soon</h3>
        <p className="text-gray-700 mb-4">
          We're constantly adding new video scenarios based on real coaching situations. 
          Have a specific scenario you'd like to see? Let us know!
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <AllouiIcon name="calendar" size="xs" className="mr-1 text-basketball-orange" />
            <span>Game Management Scenarios</span>
          </div>
          <div className="flex items-center">
            <AllouiIcon name="user" size="xs" className="mr-1 text-basketball-orange" />
            <span>Referee Interactions</span>
          </div>
          <div className="flex items-center">
            <AllouiIcon name="strategy" size="xs" className="mr-1 text-basketball-orange" />
            <span>Tactical Decision Making</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioLibrary;