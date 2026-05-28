/**
 * Socket.io Server Configuration
 * Real-time notifications for admin dashboard
 */

import { Server } from 'socket.io';

let io;

export const initSocketServer = (server) => {
  if (io) {
    return io;
  }

  io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/api/socket',
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join admin room for receiving notifications
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log('👨‍💼 Admin joined room:', socket.id);
    });

    // Leave admin room
    socket.on('leave-admin', () => {
      socket.leave('admin-room');
      console.log('👋 Admin left room:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit notification to admin dashboard
export const emitToAdmin = (event, data) => {
  try {
    const io = getIO();
    io.to('admin-room').emit(event, data);
    console.log(`📤 Emitted ${event} to admin:`, data);
  } catch (error) {
    console.error('Error emitting to admin:', error);
  }
};

// Notification types
export const NOTIFICATION_TYPES = {
  NEW_VISITOR: 'new-visitor',
  USER_LOGIN: 'user-login',
  PAGE_VIEW: 'page-view',
  NEW_ORDER: 'new-order',
  NEW_USER: 'new-user',
};
