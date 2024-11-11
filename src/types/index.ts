export type ServicePoint = 
  | 'registration'
  | 'room1'
  | 'room2'
  | 'lab'
  | 'dressing'
  | 'injection'
  | 'xray'
  | 'observation'
  | 'pharmacy';

export interface Queue {
  id: string;
  number: string;
  currentPoint: ServicePoint;
  timestamp: string;
  status: 'waiting' | 'serving' | 'completed';
  history: {
    point: ServicePoint;
    timestamp: string;
  }[];
}

export interface ServicePointData {
  id: ServicePoint;
  name: string;
  icon: string;
  currentQueue: string | null;
  nextQueue: string | null;
}