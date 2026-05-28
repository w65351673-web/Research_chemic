# Real-Time Alerts with Socket.io

## 🚀 Features Implemented

Your admin dashboard now has **real-time notifications** for:

1. **🔔 New Visitor Alerts** - When someone visits your site
2. **🔔 User Login Alerts** - When a user logs in with their email
3. **🔔 Page View Alerts** - When users navigate to different pages

## 📁 Files Created

### Server Configuration
- `server.js` - Custom Next.js server with Socket.io integration
- `src/lib/socket/server.js` - Socket.io server utilities

### API Endpoints
- `src/app/api/track/visitor/route.js` - Track new visitors
- `src/app/api/track/page-view/route.js` - Track page views
- `src/app/api/track/user-login/route.js` - Track user logins

### Components
- `src/components/admin/RealTimeAlerts.jsx` - Real-time notification UI
- `src/components/tracking/VisitorTracker.jsx` - Automatic visitor tracking

### Hooks
- `src/hooks/useVisitorTracking.js` - Custom hook for tracking

## 🎯 How It Works

### 1. Visitor Tracking
When someone visits your site:
```
User visits /products/body-lotion
  ↓
VisitorTracker sends data to API
  ↓
API emits Socket.io event
  ↓
Admin dashboard shows: "🔔 New visitor on /products/body-lotion"
```

### 2. User Login Tracking
When a user logs in:
```
User logs in with john@gmail.com
  ↓
Login API sends notification
  ↓
Socket.io emits event
  ↓
Admin dashboard shows: "🔔 User john@gmail.com logged in"
```

### 3. Page View Tracking
When logged-in users navigate:
```
User navigates to /admin
  ↓
VisitorTracker sends page view
  ↓
Socket.io emits event
  ↓
Admin dashboard shows: "🔔 User john@gmail.com opened Dashboard Page"
```

## 🛠️ Setup Instructions

### 1. Install Dependencies (Already Done)
```bash
npm install socket.io socket.io-client
```

### 2. Start the Server
```bash
npm run dev
```

This now uses the custom server with Socket.io enabled.

### 3. Open Admin Dashboard
Navigate to `/admin` and you'll see:
- **Live indicator** (green dot) showing connection status
- **Real-time alerts** appearing in the top-right corner
- **Bell icon** with notification count

## 📊 Alert Types

### New Visitor Alert
```javascript
{
  type: 'visitor',
  page: '/products/body-lotion',
  userAgent: 'Mozilla/5.0...',
  timestamp: '2025-11-29T10:13:00.000Z',
  message: '🔔 New visitor on /products/body-lotion'
}
```

### User Login Alert
```javascript
{
  type: 'user-login',
  email: 'john@gmail.com',
  name: 'John Doe',
  timestamp: '2025-11-29T10:13:00.000Z',
  message: '🔔 User john@gmail.com logged in'
}
```

### Page View Alert
```javascript
{
  type: 'page-view',
  page: '/admin',
  user: 'john@gmail.com',
  timestamp: '2025-11-29T10:13:00.000Z',
  message: '🔔 User john@gmail.com opened Dashboard Page'
}
```

## 🎨 UI Features

### Alert Display
- **Animated entrance/exit** - Smooth slide-in from right
- **Auto-dismiss** - Alerts disappear after 10 seconds
- **Manual dismiss** - Click X to close immediately
- **Maximum 5 alerts** - Only shows last 5 notifications
- **Timestamp** - Shows when the event occurred

### Connection Status
- **Green dot** - Connected to Socket.io server
- **Red dot** - Disconnected (will attempt to reconnect)
- **"Live" indicator** - Shows real-time status

### Bell Icon
- **Badge counter** - Shows number of active alerts
- **Pulse animation** - Draws attention to new notifications

## 🔧 Customization

### Change Alert Duration
In `src/components/admin/RealTimeAlerts.jsx`:
```javascript
setTimeout(() => {
  removeAlert(alert.id);
}, 10000); // Change to 5000 for 5 seconds
```

### Change Max Alerts
```javascript
setAlerts((prev) => [alert, ...prev].slice(0, 5)); // Change 5 to any number
```

### Add More Alert Types
1. Create new API endpoint in `src/app/api/track/`
2. Add event listener in `RealTimeAlerts.jsx`
3. Emit event from your API

Example - New Order Alert:
```javascript
// In RealTimeAlerts.jsx
socketInstance.on('new-order', (data) => {
  addAlert({
    id: Date.now(),
    type: 'order',
    icon: <FaShoppingCart className="text-yellow-400" />,
    ...data,
  });
});
```

## 🚀 Production Deployment

### Environment Variables
No additional environment variables needed!

### Vercel/Netlify
⚠️ **Note**: Socket.io requires a persistent server connection.
- Vercel/Netlify use serverless functions (no persistent connections)
- For production, consider:
  - **Railway** - Supports WebSockets
  - **Render** - Supports WebSockets
  - **DigitalOcean App Platform** - Supports WebSockets
  - **AWS EC2** - Full control

### Alternative: Use Pusher
If you need serverless deployment:
```bash
npm install pusher pusher-js
```
Then replace Socket.io with Pusher API.

## 📝 Testing

### Test Visitor Tracking
1. Open admin dashboard in one browser
2. Open your site in another browser (incognito)
3. Navigate to different pages
4. See alerts appear in admin dashboard

### Test User Login
1. Keep admin dashboard open
2. Log in as a regular user
3. See login alert in admin dashboard

### Test Page Views
1. Keep admin dashboard open
2. Log in and navigate around
3. See page view alerts in admin dashboard

## 🐛 Troubleshooting

### Alerts Not Appearing
1. Check browser console for Socket.io connection errors
2. Verify server is running with `node server.js`
3. Check "Live" indicator is green
4. Refresh admin dashboard

### Connection Issues
- Make sure port 3000 is not blocked
- Check firewall settings
- Try different browser

### No Notifications on Login
- Check `src/app/api/auth/login/route.js` has Socket.io code
- Verify `global.io` is defined
- Check server console for errors

## 📚 Additional Features to Add

### Future Enhancements
- [ ] Sound notifications
- [ ] Desktop notifications (browser API)
- [ ] Email alerts for critical events
- [ ] Alert history/log
- [ ] Filter alerts by type
- [ ] Mute/unmute notifications
- [ ] Custom alert rules

## 🎉 Success!

Your admin dashboard now has **real-time visibility** into:
- Who's visiting your site
- What pages they're viewing
- When users log in
- All activity as it happens!

---

**Created**: November 2025
**Technology**: Socket.io + Next.js
**Status**: ✅ Fully Functional
