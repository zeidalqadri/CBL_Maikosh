import React from 'react';

const LearningOutcomes = ({ outcomes }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-2xl font-bold text-alloui-primary mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-alloui-gold" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Learning Outcomes
      </h3>
      <p className="text-gray-600 mb-4">
        By the end of this module, you will be able to:
      </p>
      <ul className="space-y-3">
        {outcomes.map((outcome, index) => (
          <li key={index} className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-alloui-gold text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
              {index + 1}
            </span>
            <span className="text-gray-800">{outcome}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LearningOutcomes;