'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FaBell, FaUser, FaEye, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function RealTimeAlerts() {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize Socket.io client
    const socketInstance = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to Socket.io server');
      setIsConnected(true);
      // Join admin room
      socketInstance.emit('join-admin');
    });

    socketInstance.on('admin-joined', (data) => {
      console.log('✅ Joined admin room:', data);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.io server');
      setIsConnected(false);
    });

    // Listen for new visitor notifications
    socketInstance.on('new-visitor', (data) => {
      addAlert({
        id: Date.now(),
        type: 'visitor',
        icon: <FaEye className="text-blue-400" />,
        ...data,
      });
    });

    // Listen for user login notifications
    socketInstance.on('user-login', (data) => {
      addAlert({
        id: Date.now(),
        type: 'login',
        icon: <FaUser className="text-green-400" />,
        ...data,
      });
    });

    // Listen for page view notifications
    socketInstance.on('page-view', (data) => {
      addAlert({
        id: Date.now(),
        type: 'page-view',
        icon: <FaEye className="text-sky-400" />,
        ...data,
      });
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.emit('leave-admin');
      socketInstance.disconnect();
    };
  }, []);

  const addAlert = (alert) => {
    setAlerts((prev) => [alert, ...prev].slice(0, 5)); // Keep only last 5 alerts
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      removeAlert(alert.id);
    }, 10000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 w-96 max-w-full">
      {/* Connection Status */}
      <div className="mb-2 flex items-center justify-end">
        <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-sky-400'}`} />
          <span className="text-gray-300">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
          >
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-4 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">
                      {alert.message}
                    </p>
                    {alert.location && (
                      <p className="text-gray-400 text-xs mt-1">
                        📍 {alert.location.city}, {alert.location.country}
                      </p>
                    )}
                    {alert.device && (
                      <p className="text-gray-400 text-xs mt-1">
                        💻 {alert.device.type} • {alert.device.browser} • {alert.device.os}
                      </p>
                    )}
                    {alert.page && (
                      <p className="text-gray-400 text-xs mt-1">
                        Page: {alert.page}
                      </p>
                    )}
                    {alert.email && (
                      <p className="text-gray-400 text-xs mt-1">
                        Email: {alert.email}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bell Icon Indicator */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-4 right-4 bg-sky-500 text-white rounded-full p-3 shadow-lg"
        >
          <FaBell size={20} />
          <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {alerts.length}
          </span>
        </motion.div>
      )}
    </div>
  );
}
