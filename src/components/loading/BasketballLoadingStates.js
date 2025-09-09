import { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import BrandLogo from '../BrandLogo';

// Main Basketball Loading Component
export default function BasketballLoadingStates({ 
  type = 'dribbling', 
  message = 'Loading...', 
  size = 'medium',
  theme = 'default' 
}) {
  const { getBasketballTheme, currentModule } = useNavigation();
  const activeTheme = theme === 'default' ? getBasketballTheme() : theme;

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24',
    xlarge: 'w-32 h-32'
  };

  const LoadingComponent = getLoadingComponent(type);

  return (
    <div className="basketball-loading-container flex flex-col items-center justify-center p-6">
      <div className={`${sizeClasses[size]} mb-4`}>
        <LoadingComponent theme={activeTheme} size={size} />
      </div>
      
      {message && (
        <p className="basketball-loading-message text-center text-gray-600 dark:text-gray-300 animate-pulse">
          {getBasketballMessage(activeTheme, message)}
        </p>
      )}
    </div>
  );
}

// Basketball Dribbling Loader
export function DribblingLoader({ theme, size }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Basketball */}
      <div className={`
        basketball-ball
        w-full h-full
        bg-gradient-to-br from-orange-400 to-orange-600
        rounded-full
        border-2 border-orange-700
        shadow-lg
        relative
        animate-bounce
        ${theme === 'offense' ? 'animate-pulse' : ''}
      `} style={{ animationDuration: '1.2s' }}>
        {/* Basketball Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-orange-800 absolute"></div>
          <div className="h-full w-px bg-orange-800 absolute"></div>
          <div className="w-3/4 h-3/4 border border-orange-800 rounded-full"></div>
        </div>
        
        {/* Shadow */}
        <div className={`
          absolute -bottom-2 left-1/2 transform -translate-x-1/2
          w-full h-2 bg-black opacity-20 rounded-full
          animate-pulse
        `} style={{ animationDuration: '1.2s' }}></div>
      </div>
    </div>
  );
}

// Court Drawing Loader
export function CourtDrawingLoader({ theme, size }) {
  const [drawProgress, setDrawProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrawProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <svg 
        viewBox="0 0 100 50" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Court Outline */}
        <rect 
          x="2" y="2" width="96" height="46" 
          fill="none" 
          stroke="#d4b24c" 
          strokeWidth="1"
          className="animate-pulse"
          style={{
            strokeDasharray: 200,
            strokeDashoffset: 200 - (drawProgress * 2),
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
        
        {/* Center Circle */}
        <circle 
          cx="50" cy="25" r="8" 
          fill="none" 
          stroke="#d4b24c" 
          strokeWidth="1"
          style={{
            strokeDasharray: 50,
            strokeDashoffset: 50 - (drawProgress * 0.5),
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
        
        {/* Three-point Arcs */}
        <path 
          d="M 15 5 Q 25 15 15 45" 
          fill="none" 
          stroke="#d4b24c" 
          strokeWidth="1"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100 - drawProgress,
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
        <path 
          d="M 85 5 Q 75 15 85 45" 
          fill="none" 
          stroke="#d4b24c" 
          strokeWidth="1"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100 - drawProgress,
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`
          text-xs font-medium text-alloui-gold
          ${theme === 'fundamentals' ? 'animate-pulse' : ''}
        `}>
          {Math.round(drawProgress)}%
        </div>
      </div>
    </div>
  );
}

// Shooting Sequence Loader
export function ShootingSequenceLoader({ theme, size }) {
  const [phase, setPhase] = useState(0);
  const phases = ['setup', 'shooting', 'arc', 'swish'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev + 1) % phases.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const currentPhase = phases[phase];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Basketball Hoop */}
      <div className="absolute top-2 right-4">
        <div className="w-8 h-1 bg-orange-600 rounded"></div>
        <div className="w-6 h-4 border-2 border-gray-600 border-t-0 ml-1 relative">
          {/* Net */}
          <div className={`
            absolute top-0 left-0 right-0 h-3
            ${currentPhase === 'swish' ? 'animate-bounce' : ''}
          `}>
            <div className="w-full h-px bg-gray-400"></div>
            <div className="flex justify-between mt-1">
              <div className="w-px h-2 bg-gray-400"></div>
              <div className="w-px h-2 bg-gray-400"></div>
              <div className="w-px h-2 bg-gray-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Basketball with Animation */}
      <div className={`
        absolute w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-600
        rounded-full border border-orange-800 shadow-lg
        transition-all duration-800 ease-in-out
        ${currentPhase === 'setup' ? 'bottom-2 left-2' : ''}
        ${currentPhase === 'shooting' ? 'bottom-8 left-6' : ''}
        ${currentPhase === 'arc' ? 'top-8 right-8' : ''}
        ${currentPhase === 'swish' ? 'top-6 right-6 opacity-0' : ''}
      `}>
        {/* Basketball Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-orange-800 absolute"></div>
          <div className="h-full w-px bg-orange-800 absolute"></div>
        </div>
      </div>

      {/* Success Particles */}
      {currentPhase === 'swish' && (
        <div className="absolute top-6 right-6">
          <div className="animate-ping w-2 h-2 bg-green-400 rounded-full"></div>
          <div className="animate-ping w-1 h-1 bg-yellow-400 rounded-full absolute top-1 left-2"></div>
          <div className="animate-ping w-1 h-1 bg-blue-400 rounded-full absolute top-2 left-1"></div>
        </div>
      )}
    </div>
  );
}

// Team Formation Loader
export function TeamFormationLoader({ theme, size }) {
  const [formationStep, setFormationStep] = useState(0);
  const players = [
    { id: 1, position: { x: 50, y: 80 }, role: 'Point Guard' },
    { id: 2, position: { x: 30, y: 60 }, role: 'Shooting Guard' },
    { id: 3, position: { x: 70, y: 60 }, role: 'Small Forward' },
    { id: 4, position: { x: 25, y: 40 }, role: 'Power Forward' },
    { id: 5, position: { x: 75, y: 40 }, role: 'Center' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFormationStep(prev => (prev + 1) % (players.length + 1));
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Court Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded opacity-30"></div>
      
      {/* Players */}
      {players.map((player, index) => (
        <div
          key={player.id}
          className={`
            absolute w-3 h-3 rounded-full transition-all duration-500 ease-out
            ${index < formationStep ? 'bg-alloui-gold scale-100 opacity-100' : 'bg-gray-400 scale-50 opacity-30'}
            ${theme === 'teamwork' ? 'animate-pulse' : ''}
          `}
          style={{
            left: `${player.position.x}%`,
            top: `${player.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Player Number */}
          <div className="absolute -top-1 -left-1 text-xs font-bold text-white bg-black rounded-full w-4 h-4 flex items-center justify-center">
            {player.id}
          </div>
        </div>
      ))}

      {/* Formation Lines */}
      {formationStep > 2 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Connect players with lines */}
          <line x1="30%" y1="60%" x2="50%" y2="80%" stroke="#d4b24c" strokeWidth="1" opacity="0.5" />
          <line x1="70%" y1="60%" x2="50%" y2="80%" stroke="#d4b24c" strokeWidth="1" opacity="0.5" />
          <line x1="25%" y1="40%" x2="30%" y2="60%" stroke="#d4b24c" strokeWidth="1" opacity="0.5" />
          <line x1="75%" y1="40%" x2="70%" y2="60%" stroke="#d4b24c" strokeWidth="1" opacity="0.5" />
        </svg>
      )}
    </div>
  );
}

// Module-Specific Loading Themes
export function ModuleLoadingWrapper({ moduleNumber, children, message }) {
  const moduleThemes = {
    1: { type: 'dribbling', message: 'Learning fundamentals...', logoVariant: 'default' },
    2: { type: 'team-formation', message: 'Building player development...', logoVariant: 'gold' },
    3: { type: 'court-drawing', message: 'Studying rules...', logoVariant: 'navy' },
    4: { type: 'shooting', message: 'Practicing basic skills...', logoVariant: 'gold' },
    5: { type: 'team-formation', message: 'Understanding teamwork...', logoVariant: 'default' },
    6: { type: 'shooting', message: 'Learning offensive strategies...', logoVariant: 'basketball' },
    7: { type: 'court-drawing', message: 'Mastering defense...', logoVariant: 'navy' },
    8: { type: 'shooting', message: 'Advanced tactics loading...', logoVariant: 'gold' },
    9: { type: 'team-formation', message: 'Game management principles...', logoVariant: 'default' },
    10: { type: 'dribbling', message: 'Understanding psychology...', logoVariant: 'basketball' },
    11: { type: 'court-drawing', message: 'Advanced coaching methods...', logoVariant: 'navy' },
    12: { type: 'shooting', message: 'Preparing certification...', logoVariant: 'gold' }
  };

  const theme = moduleThemes[moduleNumber] || moduleThemes[1];

  return (
    <div className="module-loading-wrapper flex flex-col items-center">
      <div className="mb-4">
        <BrandLogo size="large" variant={theme.logoVariant} className="animate-pulse" />
      </div>
      <BasketballLoadingStates 
        type={theme.type}
        message={message || theme.message}
        theme={`module-${moduleNumber}`}
      />
      {children}
    </div>
  );
}

// Utility Functions
function getLoadingComponent(type) {
  const components = {
    'dribbling': DribblingLoader,
    'court-drawing': CourtDrawingLoader,
    'shooting': ShootingSequenceLoader,
    'team-formation': TeamFormationLoader
  };
  
  return components[type] || DribblingLoader;
}

function getBasketballMessage(theme, defaultMessage) {
  const messages = {
    'leadership': 'Building leadership skills...',
    'development': 'Developing players...',
    'rules': 'Learning the game rules...',
    'skills': 'Practicing fundamentals...',
    'teamwork': 'Building team chemistry...',
    'offense': 'Studying offensive plays...',
    'defense': 'Mastering defensive strategies...',
    'tactics': 'Advanced tactical analysis...',
    'management': 'Game management principles...',
    'psychology': 'Understanding player psychology...',
    'coaching': 'Advanced coaching techniques...',
    'certification': 'Preparing for excellence...'
  };

  return messages[theme] || defaultMessage;
}

// Export all loaders for individual use
export {
  DribblingLoader,
  CourtDrawingLoader, 
  ShootingSequenceLoader,
  TeamFormationLoader,
  ModuleLoadingWrapper
};