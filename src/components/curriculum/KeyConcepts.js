import React, { useState } from 'react';
import { CoachingAccordion, ProTip, CoachingQuote } from '../interactions';
import { AllouiIcon } from '../icons';

const KeyConcepts = ({ concepts }) => {
  // Transform concepts data for the new interactive accordion
  const accordionItems = concepts.map((concept, index) => ({
    title: concept.title,
    subtitle: concept.description,
    content: (
      <div className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed">{concept.description}</p>
        </div>
        
        <div className="space-y-3">
          {concept.details.map((detail, detailIndex) => (
            <div key={detailIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <AllouiIcon name="basketball" size="xs" className="text-basketball-orange" />
              </div>
              <p className="text-gray-700 flex-1">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    icon: getConceptIcon(concept.title, index),
    category: getCategoryForConcept(concept.title),
    keyPoints: concept.details,
    tags: getTagsForConcept(concept.title)
  }));

  return (
    <div className="space-y-8 mb-8">
      {/* Section header with enhanced styling */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-alloui-primary mb-2 flex items-center justify-center">
          <AllouiIcon name="insight" size="lg" className="mr-3 text-alloui-gold" />
          Key Concepts
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Master these fundamental coaching concepts to build a solid foundation for your basketball coaching journey.
        </p>
      </div>

      {/* Interactive Accordion */}
      <CoachingAccordion 
        items={accordionItems}
        defaultOpen={[0]}
        multipleOpen={false}
        animated={true}
      />

      {/* Coaching insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <ProTip coach="Coach Thompson">
          <p>
            The best coaches master all these roles but know when to emphasize each one. 
            In practice, you might be primarily a teacher. During games, you're a motivator and strategist. 
            Off the court, you're often an advisor and friend.
          </p>
        </ProTip>

        <CoachingQuote 
          quote="Coaching is not about being perfect. It's about being authentic and continuously growing alongside your players."
          author="Successful Basketball Coach"
        />
      </div>

      {/* Visual summary */}
      <div className="bg-gradient-to-r from-alloui-primary/10 to-alloui-court-blue/10 rounded-lg p-6 border border-alloui-gold/20">
        <h4 className="font-bold text-alloui-primary mb-4 flex items-center">
          <AllouiIcon name="target" size="sm" className="mr-2 text-alloui-gold" />
          Remember: Integration is Key
        </h4>
        <p className="text-gray-700 leading-relaxed">
          These concepts work together as a complete coaching philosophy. Your coaching style will blend elements 
          from each area based on your personality, your team's needs, and the specific situation you're facing. 
          The goal is to develop your authentic coaching voice while remaining flexible and adaptable.
        </p>
      </div>
    </div>
  );
};

// Helper functions to enhance concepts with metadata
function getConceptIcon(title, index) {
  const iconMap = {
    "The Coach's Roles": 'whistle',
    "Coaching Styles": 'strategy',
    "Coaching Philosophy": 'insight',
    "Phases of Learning": 'growth',
    "COACH Acronym": 'trophy'
  };
  
  return iconMap[title] || 'circle';
}

function getCategoryForConcept(title) {
  const categoryMap = {
    "The Coach's Roles": 'Foundation',
    "Coaching Styles": 'Approach',
    "Coaching Philosophy": 'Mindset',
    "Phases of Learning": 'Development',
    "COACH Acronym": 'Excellence'
  };
  
  return categoryMap[title] || 'Concept';
}

function getTagsForConcept(title) {
  const tagMap = {
    "The Coach's Roles": ['Leadership', 'Management', 'Mentorship'],
    "Coaching Styles": ['Communication', 'Adaptation', 'Psychology'],
    "Coaching Philosophy": ['Values', 'Vision', 'Purpose'],
    "Phases of Learning": ['Skill Development', 'Progression', 'Mastery'],
    "COACH Acronym": ['Character', 'Excellence', 'Growth']
  };
  
  return tagMap[title] || ['Basketball', 'Coaching'];
}

export default KeyConcepts;