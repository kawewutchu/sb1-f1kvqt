import React from 'react';
import { QueueControl } from '../components/QueueControl';
import { ServicePoint } from '../types';
import { useQueues } from '../hooks/useQueues';

interface RoomProps {
  roomId: ServicePoint;
}

export const Room: React.FC<RoomProps> = ({ roomId }) => {
  const { queues, moveQueue, updateQueueStatus } = useQueues();
  
  // Get queues for this room sorted by timestamp
  const roomQueues = queues
    .filter(q => q.currentPoint === roomId && q.status !== 'completed')
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Get first queue as current queue
  const [currentQueue, ...waitingQueues] = roomQueues;
  
  const handleCallNext = () => {
    if (currentQueue) {
      // Mark current queue as completed
      updateQueueStatus(currentQueue.id, 'completed');
    }
  };
  
  const handleSkip = () => {
    if (currentQueue) {
      // Move current queue to the end of the waiting list
      const newTimestamp = new Date().toISOString();
      moveQueue(currentQueue.id, roomId, newTimestamp);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <QueueControl
          point={roomId}
          currentQueue={currentQueue?.number || null}
          onCallNext={handleCallNext}
          onSkip={handleSkip}
        />

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">คิวที่รอในห้องนี้</h3>
          <div className="space-y-2">
            {waitingQueues.map(queue => (
              <div
                key={queue.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-lg font-medium">{queue.number}</span>
                <span className="text-sm text-gray-500">
                  {new Date(queue.timestamp).toLocaleTimeString('th-TH')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}