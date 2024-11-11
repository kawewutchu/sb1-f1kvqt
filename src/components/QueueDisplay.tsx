import React from 'react';
import { Clock } from 'lucide-react';
import { ServicePointData } from '../types';

interface QueueDisplayProps {
  point: ServicePointData;
}

export const QueueDisplay: React.FC<QueueDisplayProps> = ({ point }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{point.name}</h3>
        <Clock className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">คิวปัจจุบัน</p>
          <div className="text-4xl font-bold text-blue-600">
            {point.currentQueue || '-'}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">คิวถัดไป</p>
          <div className="text-2xl font-semibold text-gray-500">
            {point.nextQueue || '-'}
          </div>
        </div>
      </div>
    </div>
  );
}