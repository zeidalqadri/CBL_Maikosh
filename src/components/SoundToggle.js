import { useState, useRef, useEffect } from 'react';

/**
 * SoundToggle - Ambient sound control with visual feedback
 * Inspired by ecrin.digital's sophisticated audio integration
 */
export default function SoundToggle({ 
  className = '',
  position = 'fixed' // 'fixed' | 'relative'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    // Temporarily disable audio loading to prevent loading issues
    // TODO: Add audio file and re-enable
    setIsLoaded(true);
    
    // Placeholder for future audio implementation
    // const audio = new Audio('/sounds/ambient.mp3');
    // audio.loop = true;
    // audio.volume = volume;
    // audio.preload = 'auto';
    
    return () => {
      // Cleanup when needed
    };
  }, [volume]);

  const toggleSound = async () => {
    // Temporarily just toggle state without audio
    setIsPlaying(!isPlaying);
    
    // TODO: Implement actual audio playback when audio file is available
    /*
    if (!audioRef.current || !isLoaded) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
    */
  };

  const positionClasses = position === 'fixed' 
    ? 'fixed top-6 right-20 z-50' 
    : 'relative';

  return (
    <div className={`${positionClasses} ${className}`}>
      <button
        onClick={toggleSound}
        disabled={!isLoaded}
        className={`
          group
          relative
          w-12
          h-12
          bg-transparent
          border
          border-gray-600
          dark:border-gray-400
          rounded-full
          transition-all
          duration-300
          ease-out
          hover:border-alloui-gold
          hover:bg-alloui-gold/5
          disabled:opacity-40
          disabled:cursor-not-allowed
          ${!isLoaded ? 'animate-pulse' : ''}
        `}
        aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
      >
        {/* Sound waves visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-6 h-6">
            {/* Center dot */}
            <div 
              className={`
                absolute
                top-1/2
                left-1/2
                w-1
                h-1
                bg-gray-400
                dark:bg-gray-300
                rounded-full
                transition-colors
                duration-300
                group-hover:bg-alloui-gold
                ${isPlaying ? 'bg-alloui-gold animate-pulse' : ''}
                transform
                -translate-x-1/2
                -translate-y-1/2
              `}
            />
            
            {/* Inner wave */}
            <div 
              className={`
                absolute
                top-1/2
                left-1/2
                w-3
                h-3
                border
                border-gray-400
                dark:border-gray-300
                rounded-full
                transition-all
                duration-500
                group-hover:border-alloui-gold
                ${isPlaying ? 'border-alloui-gold scale-110 opacity-70' : 'opacity-50'}
                transform
                -translate-x-1/2
                -translate-y-1/2
              `}
            />
            
            {/* Outer wave */}
            <div 
              className={`
                absolute
                top-1/2
                left-1/2
                w-5
                h-5
                border
                border-gray-400
                dark:border-gray-300
                rounded-full
                transition-all
                duration-700
                group-hover:border-alloui-gold
                ${isPlaying ? 'border-alloui-gold scale-125 opacity-40' : 'opacity-30'}
                transform
                -translate-x-1/2
                -translate-y-1/2
              `}
            />
          </div>
        </div>

        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Hover ripple effect */}
        <div 
          className={`
            absolute
            inset-0
            bg-alloui-gold/10
            rounded-full
            transition-transform
            duration-300
            ${isPlaying ? 'scale-100' : 'scale-0'}
            group-hover:scale-100
          `}
        />
      </button>

      {/* Volume control (appears on hover) */}
      <div 
        className={`
          absolute
          top-full
          right-0
          mt-2
          w-24
          opacity-0
          pointer-events-none
          transition-all
          duration-300
          group-hover:opacity-100
          group-hover:pointer-events-auto
          ${isPlaying ? 'group-hover:translate-y-0' : ''}
        `}
      >
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              if (audioRef.current) {
                audioRef.current.volume = newVolume;
              }
            }}
            className={`
              w-full
              h-1
              bg-gray-700
              rounded-lg
              appearance-none
              cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-alloui-gold
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-3
              [&::-moz-range-thumb]:h-3
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-alloui-gold
              [&::-moz-range-thumb]:border-none
              [&::-moz-range-thumb]:cursor-pointer
            `}
          />
          <div className="text-xs text-gray-400 text-center mt-1">
            Volume
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline sound toggle for embedding in content
 */
export function InlineSoundToggle({ className = '' }) {
  return (
    <SoundToggle 
      position="relative"
      className={`inline-block ${className}`}
    />
  );
}