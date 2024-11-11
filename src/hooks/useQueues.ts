import { useState, useEffect } from 'react';
import { Queue } from '../types';

const QUEUE_STORAGE_KEY = 'clinic_queues';
const QUEUE_DATE_KEY = 'clinic_queue_date';

export function useQueues() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [nextQueueNumber, setNextQueueNumber] = useState(1);

  // Load queues and handle real-time updates
  useEffect(() => {
    const loadQueues = () => {
      const today = new Date().toDateString();
      const storedDate = localStorage.getItem(QUEUE_DATE_KEY);
      
      // Reset queues if it's a new day
      if (storedDate !== today) {
        localStorage.setItem(QUEUE_DATE_KEY, today);
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify([]));
        setNextQueueNumber(1);
        setQueues([]);
      } else {
        const storedQueues = localStorage.getItem(QUEUE_STORAGE_KEY);
        if (storedQueues) {
          const parsedQueues = JSON.parse(storedQueues);
          setQueues(parsedQueues);
          
          // Set next queue number based on existing queues
          const maxNumber = parsedQueues.reduce((max: number, queue: Queue) => {
            const num = parseInt(queue.number.slice(1));
            return num > max ? num : max;
          }, 0);
          setNextQueueNumber(maxNumber + 1);
        }
      }
    };

    // Initial load
    loadQueues();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === QUEUE_STORAGE_KEY) {
        loadQueues();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const saveQueues = (newQueues: Queue[]) => {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(newQueues));
    setQueues(newQueues);
    
    // Dispatch custom event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: QUEUE_STORAGE_KEY,
      newValue: JSON.stringify(newQueues),
    }));
  };

  const createQueue = () => {
    const newQueue: Queue = {
      id: crypto.randomUUID(),
      number: `Q${String(nextQueueNumber).padStart(3, '0')}`,
      currentPoint: 'registration',
      timestamp: new Date().toISOString(),
      status: 'waiting',
      history: [
        {
          point: 'registration',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const newQueues = [...queues, newQueue];
    saveQueues(newQueues);
    setNextQueueNumber(prev => prev + 1);
  };

  const moveQueue = (queueId: string, newPoint: Queue['currentPoint'], newTimestamp?: string) => {
    const newQueues = queues.map(queue => {
      if (queue.id === queueId) {
        return {
          ...queue,
          currentPoint: newPoint,
          timestamp: newTimestamp || queue.timestamp,
          history: [
            ...queue.history,
            {
              point: newPoint,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return queue;
    });
    saveQueues(newQueues);
  };

  const updateQueueStatus = (queueId: string, status: Queue['status']) => {
    const newQueues = queues.map(queue => {
      if (queue.id === queueId) {
        return { ...queue, status };
      }
      return queue;
    });
    saveQueues(newQueues);
  };

  const resetQueues = () => {
    saveQueues([]);
    setNextQueueNumber(1);
  };

  return {
    queues,
    createQueue,
    moveQueue,
    updateQueueStatus,
    resetQueues,
  };
}