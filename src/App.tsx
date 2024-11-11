import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { Room } from './pages/Room';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 text-sm font-medium"
                >
                  หน้าแสดงคิว
                </Link>
                <Link
                  to="/admin"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900 text-sm font-medium"
                >
                  จัดการคิว
                </Link>
                <Link
                  to="/room/room1"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900 text-sm font-medium"
                >
                  ห้องตรวจ 1
                </Link>
                <Link
                  to="/room/room2"
                  className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-900 text-sm font-medium"
                >
                  ห้องตรวจ 2
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/room/room1" element={<Room roomId="room1" />} />
          <Route path="/room/room2" element={<Room roomId="room2" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;