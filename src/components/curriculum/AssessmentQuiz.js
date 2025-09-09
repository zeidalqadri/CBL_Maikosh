import React, { useState, useMemo, useCallback, memo } from 'react';
import { useErrorHandler } from '../ErrorBoundary';
import logger from '../../utils/logger';

const AssessmentQuiz = memo(({ questions, onComplete, userId, moduleId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { handleError, handleAsyncError } = useErrorHandler(`QuizModule_${moduleId}`, userId);

  const handleAnswerSelect = useCallback((answerIndex) => {
    setSelectedAnswer(answerIndex);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (selectedAnswer !== null) {
      setShowExplanation(true);
    }
  }, [selectedAnswer]);

  const handleContinue = async () => {
    try {
      setError(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestion + 1] || null);
        setShowExplanation(false);
      } else {
        setIsSubmitting(true);
        setShowResults(true);
        
        if (onComplete) {
          const score = Object.entries(answers).reduce((total, [index, answer]) => {
            return total + (questions[index].correctAnswer === answer ? 1 : 0);
          }, 0);
          
          // Handle quiz completion with error handling
          await handleAsyncError(
            () => onComplete(score, questions.length, answers),
            null
          );
          
          logger.audit('quiz_completed', userId, {
            moduleId,
            score,
            totalQuestions: questions.length,
            percentage: Math.round((score / questions.length) * 100)
          });
        }
      }
    } catch (error) {
      const errorId = handleError(error, true);
      setError({
        message: 'Failed to process quiz completion. Please try again.',
        id: errorId,
        retryable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setShowExplanation(false);
    }
  }, [currentQuestion, answers]);

  const calculateScore = useMemo(() => {
    return Object.entries(answers).reduce((total, [index, answer]) => {
      return total + (questions[index].correctAnswer === answer ? 1 : 0);
    }, 0);
  }, [answers, questions]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setError(null);
    setIsSubmitting(false);
    
    logger.audit('quiz_reset', userId, { moduleId });
  }, [userId, moduleId]);

  // Memoize error display component to prevent re-renders
  const ErrorDisplay = memo(({ error, onRetry, onDismiss }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h4 className="text-red-800 font-medium">Quiz Error</h4>
          <p className="text-red-700 text-sm mt-1">{error.message}</p>
          {error.id && (
            <p className="text-red-600 text-xs mt-2">Error ID: {error.id}</p>
          )}
        </div>
      </div>
      <div className="flex space-x-2 mt-4">
        {error.retryable && onRetry && (
          <button 
            onClick={onRetry}
            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
          >
            Try Again
          </button>
        )}
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  ));

  // Memoize results calculation
  const resultsData = useMemo(() => {
    if (!showResults) return null;
    const score = calculateScore;
    const percentage = Math.round((score / questions.length) * 100);
    return { score, percentage };
  }, [showResults, calculateScore, questions.length]);
  
  if (showResults) {
    const { score, percentage } = resultsData;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-bold text-alloui-primary mb-4 text-center">
          Quiz Results
        </h3>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-success-green mb-2">
            {score}/{questions.length}
          </div>
          <div className="text-xl text-gray-600 mb-4">
            {percentage}% Score
          </div>
          
          <div className={`inline-block px-4 py-2 rounded-full text-white font-medium ${
            percentage >= 80 ? 'bg-success-green' : 
            percentage >= 60 ? 'bg-basketball-orange' : 'bg-team-red'
          }`}>
            {percentage >= 80 ? 'Excellent!' : 
             percentage >= 60 ? 'Good Job!' : 'Keep Studying!'}
          </div>
        </div>
        
        <div className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                isCorrect ? 'border-success-green bg-green-50' : 'border-team-red bg-red-50'
              }`}>
                <div className="flex items-start">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                    isCorrect ? 'bg-success-green' : 'bg-team-red'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">
                      {question.question}
                    </p>
                    <div className="text-sm">
                      <p className={`mb-1 ${isCorrect ? 'text-success-green' : 'text-team-red'}`}>
                        Your answer: {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-success-green mb-1">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-neutral-gray italic">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-6">
          <button 
            onClick={resetQuiz}
            className="btn btn-primary"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // Memoize current question and progress
  const currentQuestionData = useMemo(() => {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    return { question, progress };
  }, [questions, currentQuestion]);
  
  const { question, progress } = currentQuestionData;

  // Validate questions prop
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    const validationError = new Error('Quiz questions not provided or invalid');
    handleError(validationError, false);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-team-red">
        <h3 className="text-lg font-semibold text-team-red mb-2">Quiz Unavailable</h3>
        <p className="text-gray-600">The quiz questions could not be loaded. Please refresh the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Error Display */}
      {error && (
        <ErrorDisplay 
          error={error}
          onRetry={() => {
            setError(null);
            if (error.retryAction) {
              error.retryAction();
            }
          }}
          onDismiss={() => setError(null)}
        />
      )}

      <h3 className="text-2xl font-bold text-alloui-primary mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-alloui-gold" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Knowledge Check Quiz
      </h3>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-alloui-gold h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Question */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {question.question}
        </h4>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedAnswer === index
                  ? showExplanation
                    ? index === question.correctAnswer
                      ? 'border-success-green bg-green-50'
                      : 'border-team-red bg-red-50'
                    : 'border-alloui-gold bg-yellow-50'
                  : 'border-gray-300 hover:border-alloui-gold hover:bg-gray-50'
              } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium mr-3 ${
                  selectedAnswer === index
                    ? showExplanation
                      ? index === question.correctAnswer
                        ? 'border-success-green bg-success-green text-white'
                        : 'border-team-red bg-team-red text-white'
                      : 'border-alloui-gold bg-alloui-gold text-white'
                    : 'border-gray-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-gray-900">{option}</span>
                {showExplanation && index === question.correctAnswer && (
                  <svg className="w-5 h-5 text-success-green ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Explanation */}
      {showExplanation && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
          <p className="text-blue-800">{question.explanation}</p>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex space-x-3">
          {!showExplanation ? (
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleContinue}
              disabled={isSubmitting}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {currentQuestion < questions.length - 1 ? 'Next Question' : 
               isSubmitting ? 'Processing...' : 'See Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// Set display name for debugging
AssessmentQuiz.displayName = 'AssessmentQuiz';

export default AssessmentQuiz;