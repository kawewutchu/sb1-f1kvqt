import React, { useEffect, useState } from 'react';
import { useSound } from '../hooks/useSound';

interface QueueNumberProps {
  number: string | null;
  size?: 'large' | 'medium';
  highlight?: boolean;
  serviceName?: string;
}

export const QueueNumber: React.FC<QueueNumberProps> = ({ 
  number, 
  size = 'medium',
  highlight = false,
  serviceName,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const { announceQueue } = useSound();
  const [prevNumber, setPrevNumber] = useState(number);

  useEffect(() => {
    if (number !== prevNumber && number && serviceName) {
      setIsFlashing(true);
      announceQueue(serviceName, number);
      const timer = setTimeout(() => setIsFlashing(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevNumber(number);
  }, [number, prevNumber, announceQueue, serviceName]);

  const baseClasses = "font-mono rounded-xl transition-all duration-500 text-center";
  const sizeClasses = size === 'large' 
    ? "text-8xl md:text-9xl p-8" // Increased font size for TV
    : "text-5xl md:text-6xl p-6";
  const flashClasses = isFlashing 
    ? "animate-flash bg-yellow-100" 
    : "bg-white";
  const highlightClasses = highlight 
    ? "border-l-8 border-blue-500" // Increased border width for visibility
    : "";

  return (
    <div className={`${baseClasses} ${sizeClasses} ${flashClasses} ${highlightClasses}`}>
      {number || '-'}
    </div>
  );
}