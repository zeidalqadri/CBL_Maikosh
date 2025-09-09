/**
 * Basketball-inspired animations for alloui icons
 * Custom CSS animations that enhance user interaction
 */

export const basketballAnimations = `
  @keyframes basketball-dribble {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  @keyframes basketball-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes basketball-swish {
    0% { 
      transform: translateY(-10px) scale(0.8);
      opacity: 0.7;
    }
    50% { 
      transform: translateY(0px) scale(1);
      opacity: 1;
    }
    100% { 
      transform: translateY(5px) scale(0.9);
      opacity: 0.8;
    }
  }

  @keyframes court-slide {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { transform: translateX(0%); opacity: 1; }
    100% { transform: translateX(0%); opacity: 1; }
  }

  @keyframes whistle-blow {
    0%, 100% { transform: translateX(0) rotate(0deg); }
    25% { transform: translateX(-2px) rotate(-2deg); }
    75% { transform: translateX(2px) rotate(2deg); }
  }

  @keyframes scoreboard-flip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(90deg); }
    100% { transform: rotateY(0deg); }
  }

  @keyframes team-huddle {
    0% { 
      transform: scale(0.8) translateY(10px);
      opacity: 0.5;
    }
    50% { 
      transform: scale(1.05) translateY(-2px);
      opacity: 0.9;
    }
    100% { 
      transform: scale(1) translateY(0px);
      opacity: 1;
    }
  }

  @keyframes timeout-pause {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes champion-rise {
    0% { 
      transform: translateY(20px) scale(0.5);
      opacity: 0;
    }
    50% { 
      transform: translateY(-5px) scale(1.1);
      opacity: 0.8;
    }
    100% { 
      transform: translateY(0px) scale(1);
      opacity: 1;
    }
  }

  @keyframes shot-clock-countdown {
    0% { transform: scale(1); color: var(--alloui-gold); }
    50% { transform: scale(1.1); color: var(--alloui-gold); }
    90% { transform: scale(1.2); color: #ef4444; }
    100% { transform: scale(1); color: #ef4444; }
  }

  @keyframes free-throw-focus {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(212, 178, 76, 0.4);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(212, 178, 76, 0);
    }
  }

  /* Animation classes */
  .animate-basketball-dribble {
    animation: basketball-dribble 1s ease-in-out infinite;
  }

  .animate-basketball-spin {
    animation: basketball-spin 2s linear infinite;
  }

  .animate-basketball-swish {
    animation: basketball-swish 0.8s ease-out;
  }

  .animate-court-slide {
    animation: court-slide 0.6s ease-out;
  }

  .animate-whistle-blow {
    animation: whistle-blow 0.3s ease-in-out 3;
  }

  .animate-scoreboard-flip {
    animation: scoreboard-flip 0.8s ease-in-out;
  }

  .animate-team-huddle {
    animation: team-huddle 1.2s ease-out;
  }

  .animate-timeout-pause {
    animation: timeout-pause 2s ease-in-out infinite;
  }

  .animate-champion-rise {
    animation: champion-rise 1.5s ease-out;
  }

  .animate-shot-clock-countdown {
    animation: shot-clock-countdown 1s ease-in-out infinite;
  }

  .animate-free-throw-focus {
    animation: free-throw-focus 2s ease-in-out infinite;
  }

  /* Hover effects */
  .basketball-hover:hover {
    animation: basketball-dribble 0.6s ease-in-out;
  }

  .court-hover:hover {
    animation: court-slide 0.4s ease-out;
  }

  .trophy-hover:hover {
    animation: champion-rise 0.8s ease-out;
  }

  /* Responsive animations - reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .animate-basketball-dribble,
    .animate-basketball-spin,
    .animate-basketball-swish,
    .animate-court-slide,
    .animate-whistle-blow,
    .animate-scoreboard-flip,
    .animate-team-huddle,
    .animate-timeout-pause,
    .animate-champion-rise,
    .animate-shot-clock-countdown,
    .animate-free-throw-focus,
    .basketball-hover:hover,
    .court-hover:hover,
    .trophy-hover:hover {
      animation: none;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .basketball-hover:hover,
    .court-hover:hover,
    .trophy-hover:hover {
      transform: scale(1.05);
    }
  }
`;

// Animation utility functions
export const getBasketballAnimation = (type, duration = '1s') => {
  const animations = {
    dribble: `basketball-dribble ${duration} ease-in-out infinite`,
    spin: `basketball-spin ${duration} linear infinite`,
    swish: `basketball-swish ${duration} ease-out`,
    slide: `court-slide ${duration} ease-out`,
    whistle: `whistle-blow 0.3s ease-in-out 3`,
    flip: `scoreboard-flip ${duration} ease-in-out`,
    huddle: `team-huddle ${duration} ease-out`,
    pause: `timeout-pause ${duration} ease-in-out infinite`,
    rise: `champion-rise ${duration} ease-out`,
    countdown: `shot-clock-countdown ${duration} ease-in-out infinite`,
    focus: `free-throw-focus ${duration} ease-in-out infinite`
  };

  return animations[type] || animations.dribble;
};