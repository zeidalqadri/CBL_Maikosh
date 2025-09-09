import React, { useState } from 'react';
import { AnimatedPlayDiagram, DrillSpotlight, CommonMistake } from '../interactions';
import { AllouiIcon } from '../icons';
import { moduleOnePlayDiagrams } from '../../data/playDiagrams';

const PracticalDrills = ({ drills }) => {
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [activeVisualization, setActiveVisualization] = useState('coachingStyleDemonstration');

  return (
    <div className="space-y-8 mb-8">
      {/* Section Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-alloui-primary mb-2 flex items-center justify-center">
          <AllouiIcon name="drill" size="lg" className="mr-3 text-success-green" />
          Practical Drills & Visualizations
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Apply what you've learned through hands-on exercises and interactive visualizations 
          that bring coaching concepts to life.
        </p>
      </div>

      {/* Interactive Visualizations */}
      <div className="bg-gradient-to-r from-success-green/10 to-basketball-orange/10 rounded-lg p-6">
        <h4 className="font-bold text-alloui-primary mb-4 flex items-center">
          <AllouiIcon name="play" size="sm" className="mr-2 text-success-green" />
          Interactive Coaching Visualizations
        </h4>
        
        {/* Visualization Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'coachingStyleDemonstration', label: 'Coaching Styles', icon: 'strategy' },
            { id: 'learningPhasesDemo', label: 'Learning Phases', icon: 'growth' },
            { id: 'coachRolesVisualization', label: 'Coach Roles', icon: 'user' }
          ].map((viz) => (
            <button
              key={viz.id}
              onClick={() => setActiveVisualization(viz.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeVisualization === viz.id
                  ? 'bg-success-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <AllouiIcon 
                name={viz.icon} 
                size="xs" 
                className={`mr-2 ${activeVisualization === viz.id ? 'text-white' : 'text-success-green'}`}
              />
              {viz.label}
            </button>
          ))}
        </div>

        {/* Active Visualization */}
        <AnimatedPlayDiagram 
          playData={moduleOnePlayDiagrams[activeVisualization]}
          width={700}
          height={450}
          autoPlay={false}
          speed={2000}
        />
      </div>
      
      {/* Hands-on Drills */}
      <div>
        <h4 className="font-bold text-alloui-primary mb-4 flex items-center">
          <AllouiIcon name="whistle" size="sm" className="mr-2 text-basketball-orange" />
          Hands-On Practice Drills
        </h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          {drills.map((drill, index) => (
            <DrillSpotlight 
              key={index}
              title={drill.name}
              expandable={true}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-success-green bg-success-green/10 px-3 py-1 rounded-full">
                    Duration: {drill.duration}
                  </span>
                </div>
                
                <div>
                  <h5 className="font-semibold text-alloui-primary mb-2 flex items-center">
                    <AllouiIcon name="target" size="xs" className="mr-2 text-basketball-orange" />
                    Objective
                  </h5>
                  <p className="text-gray-700">{drill.objective}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-alloui-primary mb-2 flex items-center">
                    <AllouiIcon name="info" size="xs" className="mr-2 text-basketball-orange" />
                    Description
                  </h5>
                  <p className="text-gray-700">{drill.description}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-alloui-primary mb-2 flex items-center">
                    <AllouiIcon name="settings" size="xs" className="mr-2 text-basketball-orange" />
                    Setup
                  </h5>
                  <p className="text-gray-700">{drill.setup}</p>
                </div>
                
                <div>
                  <h5 className="font-semibold text-alloui-primary mb-3 flex items-center">
                    <AllouiIcon name="insight" size="xs" className="mr-2 text-basketball-orange" />
                    Key Points
                  </h5>
                  <div className="space-y-2">
                    {drill.keyPoints.map((point, pointIndex) => (
                      <div key={pointIndex} className="flex items-start space-x-3 p-2 bg-gray-50 rounded">
                        <AllouiIcon name="check" size="xs" className="text-success-green mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-alloui-primary mb-2 flex items-center">
                    <AllouiIcon name="equipment" size="xs" className="mr-2 text-basketball-orange" />
                    Equipment Needed
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {drill.equipment.map((item, itemIndex) => (
                      <span 
                        key={itemIndex}
                        className="text-xs bg-alloui-gold/20 text-alloui-primary px-2 py-1 rounded font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </DrillSpotlight>
          ))}
        </div>
      </div>

      {/* Coaching Tips for Drills */}
      <div className="grid md:grid-cols-2 gap-6">
        <DrillSpotlight title="Making Drills Effective">
          <div className="space-y-3">
            <p className="text-gray-700">
              The key to effective drill implementation is not just following the steps, 
              but understanding the <strong>why</strong> behind each drill.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <AllouiIcon name="basketball" size="xs" className="text-basketball-orange mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Always explain the purpose before starting</span>
              </li>
              <li className="flex items-start">
                <AllouiIcon name="basketball" size="xs" className="text-basketball-orange mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Watch for understanding, not just completion</span>
              </li>
              <li className="flex items-start">
                <AllouiIcon name="basketball" size="xs" className="text-basketball-orange mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Adapt based on your group's needs and experience</span>
              </li>
            </ul>
          </div>
        </DrillSpotlight>

        <CommonMistake>
          <div className="space-y-3">
            <p className="font-medium text-team-red">
              Rushing Through the Learning Process
            </p>
            <p className="text-gray-700">
              Many new coaches try to cover too much material too quickly. Remember the learning phases - 
              give your participants time to process and practice each concept before moving forward.
            </p>
            <p className="text-sm text-gray-600 italic">
              Quality over quantity: It's better to master one concept thoroughly than to briefly touch on many.
            </p>
          </div>
        </CommonMistake>
      </div>
    </div>
  );
};

export default PracticalDrills;