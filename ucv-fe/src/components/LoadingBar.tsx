import { useEffect, useState } from 'react';

interface LoadingBarProps {
  isVisible: boolean;
  progress: number;
  className?: string;
}

export function LoadingBar({ isVisible, progress, className = '' }: LoadingBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setDisplayProgress(progress);
    } else {
      // Reset after transition completes
      const timeout = setTimeout(() => setDisplayProgress(0), 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, progress]);

  if (!isVisible && displayProgress === 0) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-200/20 ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-200 ease-out shadow-sm relative overflow-hidden"
        style={{ 
          width: `${displayProgress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 blur-sm opacity-40" />
      </div>
    </div>
  );
}

export default LoadingBar;
