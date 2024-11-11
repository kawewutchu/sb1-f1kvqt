import React, { useMemo, useEffect, useState } from 'react';
import { ServicePointData } from '../types';
import { useQueues } from '../hooks/useQueues';
import { QueueNumber } from '../components/QueueNumber';
import { Users, Clock, Bell } from 'lucide-react';

const servicePointNames: Record<string, string> = {
  registration: 'ซักประวัติ',
  room1: 'ห้องตรวจ 1',
  room2: 'ห้องตรวจ 2',
  lab: 'ห้อง Lab',
  dressing: 'ห้องทำแผล',
  injection: 'ฉีดยา',
  xray: 'X-ray',
  observation: 'สังเกตอาการ',
  pharmacy: 'จ่ายเงิน/รับยา',
};

export const Dashboard: React.FC = () => {
  const { queues } = useQueues();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const servicePoints = useMemo(() => {
    const points: ServicePointData[] = Object.entries(servicePointNames).map(([id, name]) => {
      const pointQueues = queues
        .filter(q => q.currentPoint === id && q.status !== 'completed')
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

      const [currentQueue, nextQueue] = pointQueues;

      return {
        id: id as ServicePointData['id'],
        name,
        icon: '',
        currentQueue: currentQueue?.number || null,
        nextQueue: nextQueue?.number || null,
      };
    });

    return points;
  }, [queues]);

  const totalActiveQueues = queues.filter(q => q.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-[1920px] mx-auto"> {/* Optimized for 1080p TV */}
        <header className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-6 text-center">
            อ้อมกอด เมดิคอล สหคลินิก
          </h1>
          <div className="grid grid-cols-3 gap-8 text-2xl">
            <div className="flex items-center justify-center space-x-3 bg-blue-50 rounded-xl p-4">
              <Clock className="w-8 h-8 text-blue-600" />
              <span className="font-medium">
                {currentTime.toLocaleTimeString('th-TH', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-green-50 rounded-xl p-4">
              <Users className="w-8 h-8 text-green-600" />
              <span className="font-medium">คิวที่รอ: {totalActiveQueues}</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-yellow-50 rounded-xl p-4">
              <Bell className="w-8 h-8 text-yellow-600" />
              <span className="font-medium">กรุณาสังเกตหมายเลขคิว</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {servicePoints.map((point) => (
            <div
              key={point.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-4xl font-bold text-gray-800">{point.name}</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-xl font-medium text-gray-500 mb-3">
                    คิวปัจจุบัน
                  </div>
                  <QueueNumber 
                    number={point.currentQueue} 
                    size="large"
                    highlight={true}
                    serviceName={point.name}
                  />
                </div>

                <div>
                  <div className="text-xl font-medium text-gray-500 mb-3">
                    คิวถัดไป
                  </div>
                  <QueueNumber 
                    number={point.nextQueue} 
                    size="medium"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}