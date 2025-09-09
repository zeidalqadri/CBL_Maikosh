import React, { useState, useRef, useEffect } from 'react';
import { announceToScreenReader, createKeyboardNavigation } from '../../utils/accessibility';
import AccessibleButton from '../accessibility/AccessibleButton';
import { AccessibleFormField, AccessibleRadioGroup } from '../accessibility/AccessibleForm';

/**
 * Accessible Quiz Component
 * WCAG 2.1 AA compliant quiz interface with comprehensive accessibility features
 */
const AccessibleQuiz = ({
  questions,
  onSubmit,
  onQuestionAnswered,
  currentQuestionIndex = 0,
  userAnswers = {},
  showResults = false,
  results = null,
  className = ''
}) => {
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const questionRef = useRef(null);
  const optionsRef = useRef([]);
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnswer = userAnswers[currentQuestion?.id] !== undefined;
  
  // Announce question changes to screen readers
  useEffect(() => {
    if (currentQuestion) {
      const announcement = `Question ${currentQuestionIndex + 1} of ${totalQuestions}. ${currentQuestion.question}`;
      announceToScreenReader(announcement, 'polite');
    }
  }, [currentQuestionIndex, currentQuestion, totalQuestions]);
  
  // Set up keyboard navigation for options
  useEffect(() => {
    if (optionsRef.current.length > 0) {
      const handleKeyDown = createKeyboardNavigation(
        optionsRef.current,
        (index) => handleAnswerSelect(currentQuestion.options[index].id)
      );
      
      questionRef.current?.addEventListener('keydown', handleKeyDown);
      
      return () => {
        questionRef.current?.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentQuestion]);
  
  const handleAnswerSelect = (optionId) => {
    onQuestionAnswered(currentQuestion.id, optionId);
    
    const selectedOption = currentQuestion.options.find(opt => opt.id === optionId);
    announceToScreenReader(
      `Selected: ${selectedOption.text}`,
      'polite'
    );
  };
  
  const handleNext = () => {
    if (hasAnswer) {
      announceToScreenReader('Moving to next question');
    }
  };
  
  const handleSubmit = () => {
    announceToScreenReader('Submitting quiz answers');
    onSubmit(userAnswers);
  };
  
  if (showResults && results) {
    return <QuizResults results={results} questions={questions} userAnswers={userAnswers} />;
  }
  
  if (!currentQuestion) {
    return (
      <div role="alert" className="text-center py-8">
        <p>No questions available.</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      role="form"
      aria-labelledby="quiz-title"
    >
      {/* Quiz Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress
          </span>
          <span 
            className="text-sm text-gray-600"
            aria-label={`Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
          >
            {currentQuestionIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div 
          className="w-full bg-gray-200 rounded-full h-2"
          role="progressbar"
          aria-valuenow={((currentQuestionIndex + 1) / totalQuestions) * 100}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Quiz progress"
        >
          <div 
            className="bg-basketball-orange h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` 
            }}
          />
        </div>
      </div>
      
      {/* Question */}
      <div 
        ref={questionRef}
        className="mb-6"
        tabIndex={-1}
      >
        <h2 
          id="quiz-title"
          className="text-xl font-semibold text-gray-900 mb-6"
        >
          Question {currentQuestionIndex + 1}
        </h2>
        
        <div className="mb-6">
          <p className="text-lg text-gray-800 leading-relaxed">
            {currentQuestion.question}
          </p>
          
          {currentQuestion.description && (
            <p className="text-sm text-gray-600 mt-2">
              {currentQuestion.description}
            </p>
          )}
        </div>
        
        {/* Answer Options */}
        <fieldset className="mb-6">
          <legend className="sr-only">
            Choose your answer for question {currentQuestionIndex + 1}
          </legend>
          
          <AccessibleRadioGroup
            name={`question-${currentQuestion.id}`}
            options={currentQuestion.options.map(option => ({
              value: option.id,
              label: option.text,
              description: option.description
            }))}
            value={userAnswers[currentQuestion.id]}
            onChange={handleAnswerSelect}
            className="space-y-4"
          />
        </fieldset>
        
        {/* Question-specific feedback */}
        {hasAnswer && currentQuestion.feedback && (
          <div 
            className="mt-4 p-4 bg-blue-50 border-l-4 border-court-blue rounded-r"
            role="region"
            aria-label="Question feedback"
          >
            <p className="text-sm text-gray-700">
              {currentQuestion.feedback}
            </p>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <AccessibleButton
          onClick={() => onQuestionAnswered('previous')}
          variant="secondary"
          disabled={currentQuestionIndex === 0}
          ariaLabel={`Go to previous question. Currently on question ${currentQuestionIndex + 1} of ${totalQuestions}`}
        >
          Previous
        </AccessibleButton>
        
        <div className="flex gap-3">
          {!isLastQuestion ? (
            <AccessibleButton
              onClick={handleNext}
              variant="primary"
              disabled={!hasAnswer}
              ariaLabel={hasAnswer 
                ? `Continue to question ${currentQuestionIndex + 2}` 
                : 'Please select an answer to continue'
              }
            >
              Next
            </AccessibleButton>
          ) : (
            <AccessibleButton
              onClick={handleSubmit}
              variant="primary"
              disabled={!hasAnswer}
              ariaLabel={hasAnswer 
                ? 'Submit quiz answers' 
                : 'Please answer this question to submit the quiz'
              }
            >
              Submit Quiz
            </AccessibleButton>
          )}
        </div>
      </div>
      
      {/* Accessibility Instructions */}
      <div className="mt-6 text-sm text-gray-500 border-t pt-4">
        <p>
          <strong>Keyboard navigation:</strong> Use Tab to move between options, 
          Space or Enter to select, and arrow keys to navigate between choices.
        </p>
      </div>
    </div>
  );
};

// Quiz Results Component
const QuizResults = ({ results, questions, userAnswers }) => {
  const { score, totalQuestions, correctAnswers, incorrectAnswers } = results;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    announceToScreenReader(
      `Quiz completed. Your score is ${score} out of ${totalQuestions}, which is ${percentage} percent.`,
      'assertive'
    );
  }, [score, totalQuestions, percentage]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Results Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quiz Results
        </h2>
        
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-basketball-orange to-team-red text-white text-2xl font-bold mb-4">
          {percentage}%
        </div>
        
        <p className="text-lg text-gray-700">
          You scored <strong>{score}</strong> out of <strong>{totalQuestions}</strong> questions correctly.
        </p>
      </div>
      
      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="text-center p-4 bg-success-green bg-opacity-10 rounded-lg">
          <div className="text-2xl font-bold text-success-green">
            {correctAnswers.length}
          </div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        
        <div className="text-center p-4 bg-team-red bg-opacity-10 rounded-lg">
          <div className="text-2xl font-bold text-team-red">
            {incorrectAnswers.length}
          </div>
          <div className="text-sm text-gray-600">Incorrect</div>
        </div>
      </div>
      
      {/* Performance Feedback */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Feedback
        </h3>
        
        <div 
          className={`p-4 rounded-lg ${
            percentage >= 80 
              ? 'bg-success-green bg-opacity-10 border border-success-green' 
              : percentage >= 60 
              ? 'bg-basketball-orange bg-opacity-10 border border-basketball-orange'
              : 'bg-team-red bg-opacity-10 border border-team-red'
          }`}
          role="status"
        >
          <p className="text-gray-800">
            {percentage >= 80 ? (
              "Excellent work! You have a strong understanding of this material."
            ) : percentage >= 60 ? (
              "Good job! You're on the right track, but consider reviewing some concepts."
            ) : (
              "Keep practicing! Review the material and try again to improve your understanding."
            )}
          </p>
        </div>
      </div>
      
      {/* Question Review */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Question Review
        </h3>
        
        <div className="space-y-6">
          {questions.map((question, index) => {
            const userAnswer = userAnswers[question.id];
            const correctOption = question.options.find(opt => opt.isCorrect);
            const userOption = question.options.find(opt => opt.id === userAnswer);
            const isCorrect = userAnswer === correctOption?.id;
            
            return (
              <div 
                key={question.id}
                className={`p-4 rounded-lg border ${
                  isCorrect 
                    ? 'bg-success-green bg-opacity-5 border-success-green' 
                    : 'bg-team-red bg-opacity-5 border-team-red'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCorrect ? 'bg-success-green text-white' : 'bg-team-red text-white'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Question {index + 1}
                    </h4>
                    <p className="text-gray-700 mb-3">
                      {question.question}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Your answer:</span> {userOption?.text || 'Not answered'}
                      </div>
                      {!isCorrect && (
                        <div className="text-success-green">
                          <span className="font-medium">Correct answer:</span> {correctOption?.text}
                        </div>
                      )}
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-gray-700">
                          <strong>Explanation:</strong> {question.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-center gap-4">
        <AccessibleButton
          onClick={() => window.location.reload()}
          variant="secondary"
          ariaLabel="Retake the quiz"
        >
          Retake Quiz
        </AccessibleButton>
        
        <AccessibleButton
          onClick={() => window.history.back()}
          variant="primary"
          ariaLabel="Continue to next module"
        >
          Continue Learning
        </AccessibleButton>
      </div>
    </div>
  );
};

export default AccessibleQuiz;