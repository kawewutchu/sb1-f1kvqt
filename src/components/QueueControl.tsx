import React from 'react';
import { ChevronRight, SkipForward } from 'lucide-react';
import { ServicePoint } from '../types';

interface QueueControlProps {
  point: ServicePoint;
  currentQueue: string | null;
  onCallNext: () => void;
  onSkip: () => void;
}

export const QueueControl: React.FC<QueueControlProps> = ({
  point,
  currentQueue,
  onCallNext,
  onSkip,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">ควบคุมคิว - {point}</h2>
      
      <div className="flex flex-col space-y-4">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-2">คิวปัจจุบัน</p>
          <p className="text-5xl font-bold text-blue-600">{currentQueue || '-'}</p>
        </div>
        
        <button
          onClick={onCallNext}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
          <span>เรียกคิวถัดไป</span>
        </button>
        
        <button
          onClick={onSkip}
          className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <SkipForward className="w-5 h-5" />
          <span>ข้ามคิว</span>
        </button>
      </div>
    </div>
  );
}