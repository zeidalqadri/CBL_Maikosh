import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const QuizErrorFallback = (error, retry, errorId) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-team-red">
    <div className="flex items-center mb-4">
      <svg className="w-6 h-6 text-team-red mr-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <h3 className="text-lg font-semibold text-team-red">Quiz Temporarily Unavailable</h3>
    </div>
    
    <p className="text-gray-700 mb-4">
      We're experiencing a technical issue with this quiz. Your learning progress has been saved, 
      and you can continue with other parts of the module.
    </p>
    
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h4 className="font-medium text-blue-900 mb-2">What you can do:</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• Continue reading the learning materials</li>
        <li>• Practice the drills and exercises</li>
        <li>• Return to try the quiz later</li>
        <li>• Contact support if this persists</li>
      </ul>
    </div>

    <div className="flex space-x-3">
      <button 
        onClick={retry}
        className="bg-basketball-orange hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Retry Quiz
      </button>
      
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="bg-court-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Back to Learning
      </button>
    </div>
    
    <p className="text-xs text-gray-500 mt-4">
      Error Reference: {errorId}
    </p>
  </div>
);

const QuizErrorBoundary = ({ children, userId }) => {
  return (
    <ErrorBoundary 
      name="QuizBoundary"
      fallback={QuizErrorFallback}
      userId={userId}
    >
      {children}
    </ErrorBoundary>
  );
};

export default QuizErrorBoundary;