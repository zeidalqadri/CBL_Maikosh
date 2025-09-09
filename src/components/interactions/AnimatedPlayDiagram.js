import React, { useState, useEffect } from 'react';
import { AllouiIcon } from '../icons';

/**
 * AnimatedPlayDiagram - Basketball court SVG with animated player movements
 * Shows step-by-step play breakdowns with timing controls and looping animations
 */
const AnimatedPlayDiagram = ({ 
  playData, 
  width = 600, 
  height = 400, 
  autoPlay = true,
  speed = 1000 // milliseconds per step
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hasStarted, setHasStarted] = useState(false);

  // Court dimensions (scaled proportionally)
  const courtWidth = width * 0.8;
  const courtHeight = height * 0.8;
  const courtX = (width - courtWidth) / 2;
  const courtY = (height - courtHeight) / 2;

  useEffect(() => {
    let interval;
    if (isPlaying && hasStarted && playData?.steps) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = (prev + 1) % playData.steps.length;
          return nextStep;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasStarted, speed, playData?.steps]);

  const handlePlay = () => {
    setHasStarted(true);
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setHasStarted(false);
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
  };

  if (!playData) return null;

  const currentStepData = playData.steps[currentStep];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-whistle-silver">
      {/* Header */}
      <div className="bg-alloui-primary text-white p-4">
        <h3 className="text-lg font-bold flex items-center">
          <AllouiIcon name="basketball" size="sm" variant="gold" className="mr-2" />
          {playData.title}
        </h3>
        <p className="text-alloui-gold text-sm mt-1">{playData.description}</p>
      </div>

      {/* Court Diagram */}
      <div className="p-6 bg-m5-accent">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto bg-m5-primary rounded-lg shadow-inner"
        >
          {/* Basketball Court */}
          <g>
            {/* Court outline */}
            <rect
              x={courtX}
              y={courtY}
              width={courtWidth}
              height={courtHeight}
              fill="#8B4513"
              stroke="#FFFFFF"
              strokeWidth="3"
              rx="4"
            />
            
            {/* Center line */}
            <line
              x1={courtX}
              y1={courtY + courtHeight/2}
              x2={courtX + courtWidth}
              y2={courtY + courtHeight/2}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            
            {/* Center circle */}
            <circle
              cx={courtX + courtWidth/2}
              cy={courtY + courtHeight/2}
              r={courtWidth * 0.08}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            
            {/* Left hoop */}
            <circle
              cx={courtX + courtWidth * 0.05}
              cy={courtY + courtHeight/2}
              r={courtWidth * 0.025}
              fill="#FF7F00"
              stroke="#000"
              strokeWidth="2"
            />
            
            {/* Right hoop */}
            <circle
              cx={courtX + courtWidth * 0.95}
              cy={courtY + courtHeight/2}
              r={courtWidth * 0.025}
              fill="#FF7F00"
              stroke="#000"
              strokeWidth="2"
            />
            
            {/* Three-point lines (simplified) */}
            <path
              d={`M ${courtX + courtWidth * 0.22} ${courtY + courtHeight * 0.1} 
                  Q ${courtX + courtWidth * 0.05} ${courtY + courtHeight/2} 
                  ${courtX + courtWidth * 0.22} ${courtY + courtHeight * 0.9}`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <path
              d={`M ${courtX + courtWidth * 0.78} ${courtY + courtHeight * 0.1} 
                  Q ${courtX + courtWidth * 0.95} ${courtY + courtHeight/2} 
                  ${courtX + courtWidth * 0.78} ${courtY + courtHeight * 0.9}`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
            />

            {/* Players */}
            {currentStepData?.players?.map((player, index) => (
              <g key={`player-${index}`}>
                {/* Player circle */}
                <circle
                  cx={courtX + (player.x * courtWidth)}
                  cy={courtY + (player.y * courtHeight)}
                  r={12}
                  fill={player.team === 'offense' ? '#0066CC' : '#C8102E'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className={hasStarted ? 'transition-all duration-500 ease-in-out' : ''}
                />
                {/* Player number */}
                <text
                  x={courtX + (player.x * courtWidth)}
                  y={courtY + (player.y * courtHeight) + 4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {player.number}
                </text>
                
                {/* Movement arrows */}
                {player.movement && (
                  <g className={hasStarted ? 'opacity-100' : 'opacity-0'}>
                    <defs>
                      <marker
                        id={`arrowhead-${index}`}
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill={player.team === 'offense' ? '#FFD700' : '#FF7F00'}
                        />
                      </marker>
                    </defs>
                    <line
                      x1={courtX + (player.x * courtWidth)}
                      y1={courtY + (player.y * courtHeight)}
                      x2={courtX + (player.movement.toX * courtWidth)}
                      y2={courtY + (player.movement.toY * courtHeight)}
                      stroke={player.team === 'offense' ? '#FFD700' : '#FF7F00'}
                      strokeWidth="3"
                      markerEnd={`url(#arrowhead-${index})`}
                      className="animate-pulse"
                    />
                  </g>
                )}
              </g>
            ))}

            {/* Ball */}
            {currentStepData?.ball && (
              <circle
                cx={courtX + (currentStepData.ball.x * courtWidth)}
                cy={courtY + (currentStepData.ball.y * courtHeight)}
                r={8}
                fill="#FF7F00"
                stroke="#000"
                strokeWidth="2"
                className={hasStarted ? 'transition-all duration-500 ease-in-out' : ''}
              >
                {/* Ball bounce animation */}
                {currentStepData.ball.bouncing && (
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0,0; 0,-10; 0,0"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            )}
          </g>
        </svg>
      </div>

      {/* Step Information */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-alloui-primary">
            Step {currentStep + 1}: {currentStepData?.title}
          </h4>
          <div className="text-sm text-gray-600">
            {currentStep + 1} of {playData.steps.length}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{currentStepData?.description}</p>

        {/* Key Points */}
        {currentStepData?.keyPoints && (
          <div className="mb-4">
            <h5 className="font-medium text-alloui-primary mb-2">Key Points:</h5>
            <ul className="space-y-1">
              {currentStepData.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="w-2 h-2 bg-basketball-orange rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center justify-between">
          {/* Step indicators */}
          <div className="flex space-x-1">
            {playData.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-alloui-gold' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Step ${index + 1}`}
              />
            ))}
          </div>

          {/* Playback controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              className="p-2 text-gray-600 hover:text-alloui-primary transition-colors"
              title="Reset"
            >
              <AllouiIcon name="reset" size="sm" />
            </button>
            
            <button
              onClick={handlePlay}
              className="flex items-center px-4 py-2 bg-alloui-gold text-white rounded-md hover:bg-alloui-gold/90 transition-colors"
            >
              <AllouiIcon 
                name={isPlaying ? "pause" : "play"} 
                size="sm" 
                className="mr-1" 
              />
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={() => setCurrentStep((prev) => (prev + 1) % playData.steps.length)}
              className="p-2 text-gray-600 hover:text-alloui-primary transition-colors"
              title="Next Step"
            >
              <AllouiIcon name="arrow-right" size="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPlayDiagram;