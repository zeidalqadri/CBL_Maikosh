import React, { useState, useRef, useEffect } from 'react';
import { AllouiIcon } from '../icons';

const VideoScenarioPlayer = ({ scenario, onComplete }) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDecisions, setShowDecisions] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const currentScene = scenario.segments[currentSegment];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.current.addEventListener('ended', handleVideoEnd);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          videoRef.current.removeEventListener('ended', handleVideoEnd);
        }
      };
    }
  }, [currentSegment]);

  const handleTimeUpdate = () => {
    if (videoRef.current && currentScene.pauseAt) {
      const currentTime = videoRef.current.currentTime;
      const videoDuration = videoRef.current.duration;
      
      // Update progress
      setProgress((currentTime / videoDuration) * 100);
      
      // Check if we should pause for decision
      if (currentTime >= currentScene.pauseAt && !showDecisions) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowDecisions(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (!currentScene.decisions) {
      // Auto-advance to next segment if no decisions needed
      handleNextSegment();
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleDecisionSelect = (decision) => {
    setSelectedDecision(decision);
    setFeedback(decision.feedback);
    
    // Update score
    const newScore = score + decision.points;
    setScore(newScore);

    // Hide decisions panel after selection
    setTimeout(() => {
      setShowDecisions(false);
      setSelectedDecision(null);
      setFeedback(null);
      
      // Continue video or advance to next segment
      if (decision.nextAction === 'continue') {
        handlePlay();
      } else {
        handleNextSegment();
      }
    }, 3000);
  };

  const handleNextSegment = () => {
    if (currentSegment < scenario.segments.length - 1) {
      setCurrentSegment(prev => prev + 1);
      setProgress(0);
      setShowDecisions(false);
      setSelectedDecision(null);
      setFeedback(null);
    } else {
      // Scenario complete
      if (onComplete) {
        onComplete({
          score,
          maxScore: scenario.segments.reduce((total, segment) => 
            total + (segment.decisions ? Math.max(...segment.decisions.map(d => d.points)) : 0), 0
          ),
          completedAt: new Date().toISOString()
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentSegment(0);
    setScore(0);
    setProgress(0);
    setShowDecisions(false);
    setSelectedDecision(null);
    setFeedback(null);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Scenario Header */}
      <div className="bg-gradient-to-r from-alloui-primary to-alloui-court-blue text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <AllouiIcon name="video" size="lg" className="mr-3 text-alloui-gold" />
              {scenario.title}
            </h2>
            <p className="text-alloui-gold/90 mt-2">{scenario.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-alloui-gold/80">Score</div>
            <div className="text-2xl font-bold text-alloui-gold">{score}</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-alloui-gold/80 mb-2">
            <span>Segment {currentSegment + 1} of {scenario.segments.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="bg-alloui-primary/50 rounded-full h-2">
            <div 
              className="bg-alloui-gold rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Current Scene Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-alloui-primary mb-2">{currentScene.title}</h3>
          <p className="text-gray-600">{currentScene.description}</p>
        </div>

        {/* Video Player */}
        <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6">
          <video
            ref={videoRef}
            className="w-full aspect-video"
            poster={currentScene.thumbnail}
            preload="metadata"
          >
            <source src={currentScene.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="bg-alloui-gold hover:bg-yellow-400 text-alloui-primary p-3 rounded-full transition-colors"
                >
                  <AllouiIcon name={isPlaying ? 'pause' : 'play'} size="sm" />
                </button>
                
                <div className="text-white text-sm">
                  {currentScene.title}
                </div>
              </div>
              
              <button
                onClick={handleRestart}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <AllouiIcon name="refresh" size="xs" className="mr-2" />
                Restart
              </button>
            </div>
          </div>
        </div>

        {/* Decision Panel */}
        {showDecisions && currentScene.decisions && (
          <div className="bg-gradient-to-r from-basketball-orange/10 to-alloui-gold/10 border border-basketball-orange/20 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-bold text-alloui-primary mb-4 flex items-center">
              <AllouiIcon name="target" size="sm" className="mr-2 text-basketball-orange" />
              What would you do?
            </h4>
            <p className="text-gray-700 mb-6">{currentScene.question}</p>
            
            <div className="grid gap-4">
              {currentScene.decisions.map((decision, index) => (
                <button
                  key={index}
                  onClick={() => handleDecisionSelect(decision)}
                  disabled={selectedDecision !== null}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedDecision === decision
                      ? decision.isCorrect
                        ? 'border-success-green bg-success-green/10 text-success-green'
                        : 'border-team-red bg-team-red/10 text-team-red'
                      : 'border-gray-200 hover:border-alloui-gold hover:bg-alloui-gold/5 text-gray-700'
                  } ${selectedDecision && selectedDecision !== decision ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium mb-2">{decision.text}</div>
                      <div className="text-sm opacity-75">{decision.description}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedDecision === decision && (
                        <AllouiIcon 
                          name={decision.isCorrect ? 'check' : 'close'} 
                          size="sm" 
                          className={decision.isCorrect ? 'text-success-green' : 'text-team-red'}
                        />
                      )}
                      <div className={`text-sm font-bold ${
                        selectedDecision === decision
                          ? decision.isCorrect ? 'text-success-green' : 'text-team-red'
                          : 'text-alloui-gold'
                      }`}>
                        +{decision.points}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Panel */}
        {feedback && (
          <div className={`border rounded-lg p-4 mb-6 ${
            selectedDecision?.isCorrect 
              ? 'border-success-green bg-success-green/10' 
              : 'border-team-red bg-team-red/10'
          }`}>
            <h5 className={`font-bold mb-2 flex items-center ${
              selectedDecision?.isCorrect ? 'text-success-green' : 'text-team-red'
            }`}>
              <AllouiIcon 
                name={selectedDecision?.isCorrect ? 'check' : 'info'} 
                size="sm" 
                className="mr-2" 
              />
              {selectedDecision?.isCorrect ? 'Great Choice!' : 'Learning Opportunity'}
            </h5>
            <p className="text-gray-700">{feedback}</p>
          </div>
        )}

        {/* Coaching Tips */}
        {currentScene.coachingTip && (
          <div className="bg-alloui-primary/10 border border-alloui-primary/20 rounded-lg p-4">
            <h5 className="font-bold text-alloui-primary mb-2 flex items-center">
              <AllouiIcon name="whistle" size="sm" className="mr-2 text-alloui-gold" />
              Coaching Tip
            </h5>
            <p className="text-gray-700">{currentScene.coachingTip}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoScenarioPlayer;