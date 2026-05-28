/**
 * Custom Next.js Server with Socket.io
 * Enables real-time notifications for admin dashboard
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Initialize Socket.io
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BASE_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  // Store io instance globally for API routes
  global.io = io;

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join admin room for receiving notifications
    socket.on('join-admin', () => {
      socket.join('admin-room');
      console.log('👨‍💼 Admin joined room:', socket.id);
      socket.emit('admin-joined', { success: true });
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

  server
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log('> Socket.io server initialized');
    });
});
