import React from 'react';
import { Plus, RotateCcw, Users } from 'lucide-react';
import { ServicePoint } from '../types';
import { useQueues } from '../hooks/useQueues';

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

export const Admin: React.FC = () => {
  const { queues, createQueue, moveQueue, updateQueueStatus, resetQueues } = useQueues();

  const handleResetQueues = () => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะรีเซ็ตคิวทั้งหมด?')) {
      resetQueues();
    }
  };

  const handleCompleteQueue = (queueId: string) => {
    if (window.confirm('ยืนยันการเสร็จสิ้นและนำคิวออกจากระบบ?')) {
      updateQueueStatus(queueId, 'completed');
    }
  };

  const getQueueStats = () => {
    const total = queues.filter(q => q.status !== 'completed').length;
    const activeQueues = queues.filter(q => q.status !== 'completed');
    return { total, activeQueues };
  };

  const stats = getQueueStats();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">จัดการคิว</h1>
            <p className="text-gray-600">ระบบจัดการคิวอ้อมกอด เมดิคอล สหคลินิก</p>
            <p className="text-sm text-gray-500 mt-1">
              วันที่ {new Date().toLocaleDateString('th-TH', { dateStyle: 'full' })}
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={createQueue}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>สร้างคิวใหม่</span>
            </button>
            
            <button
              onClick={handleResetQueues}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>รีเซ็ตคิว</span>
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">คิวที่กำลังให้บริการ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {Object.entries(servicePointNames).map(([pointId, pointName]) => {
          const pointQueues = stats.activeQueues.filter(q => q.currentPoint === pointId);
          
          if (pointQueues.length === 0) return null;
          
          return (
            <div key={pointId} className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="bg-gray-50 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-800">{pointName}</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมายเลขคิว
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เวลา
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ย้ายไปยังจุดบริการ
                    </th>
                    {pointId === 'pharmacy' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        การดำเนินการ
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pointQueues.map((queue) => (
                    <tr key={queue.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {queue.number}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(queue.timestamp).toLocaleTimeString('th-TH')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          onChange={(e) => moveQueue(queue.id, e.target.value as ServicePoint)}
                          value={queue.currentPoint}
                        >
                          {Object.entries(servicePointNames).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                          ))}
                        </select>
                      </td>
                      {pointId === 'pharmacy' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleCompleteQueue(queue.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            เสร็จสิ้น
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}