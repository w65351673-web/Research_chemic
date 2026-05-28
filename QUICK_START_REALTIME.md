# Quick Start - Real-Time Alerts

## ✅ Installation Complete!

Socket.io has been installed and configured. Here's how to use it:

## 🚀 Start the Server

```bash
npm run dev
```

This will start the custom server with Socket.io enabled on port 3000.

## 📱 See It in Action

### Step 1: Open Admin Dashboard
1. Navigate to `http://localhost:3000/admin`
2. Log in with your admin credentials
3. Look for the **green "Live" indicator** in the top-right corner

### Step 2: Test Visitor Tracking
1. Open a new **incognito/private window**
2. Go to `http://localhost:3000`
3. Navigate to different pages like `/products`
4. **Watch your admin dashboard** - you'll see alerts like:
   - 🔔 New visitor on /products
   - 🔔 New visitor on /about

### Step 3: Test User Login
1. In the incognito window, log in with a test user
2. **Watch your admin dashboard** - you'll see:
   - 🔔 User john@gmail.com logged in

### Step 4: Test Page Views
1. While logged in, navigate to different pages
2. **Watch your admin dashboard** - you'll see:
   - 🔔 User john@gmail.com opened Dashboard Page
   - 🔔 User john@gmail.com opened Products Page

## 🎯 What You'll See

### Real-Time Alerts Panel
- **Location**: Top-right corner of admin dashboard
- **Features**:
  - Animated slide-in notifications
  - Auto-dismiss after 10 seconds
  - Manual close button (X)
  - Timestamp for each alert
  - Bell icon with badge counter

### Connection Status
- **Green dot + "Live"** = Connected ✅
- **Red dot + "Disconnected"** = Not connected ❌

## 🎨 Alert Examples

```
🔔 New visitor on /products/body-lotion
Page: /products/body-lotion
10:13:45 AM

🔔 User john@gmail.com logged in
Email: john@gmail.com
10:14:22 AM

🔔 User john@gmail.com opened Dashboard Page
Page: /admin
10:15:03 AM
```

## 🔧 Troubleshooting

### No Alerts Appearing?
1. Check the "Live" indicator is **green**
2. Refresh the admin dashboard
3. Check browser console for errors
4. Make sure you're using `npm run dev` (not `npm run dev:next`)

### Connection Issues?
1. Stop the server (Ctrl+C)
2. Restart with `npm run dev`
3. Clear browser cache
4. Try a different browser

## 📊 Files Modified

- ✅ `server.js` - Custom server with Socket.io
- ✅ `package.json` - Updated scripts
- ✅ `src/app/admin/layout.jsx` - Added RealTimeAlerts component
- ✅ `src/app/layout.js` - Added VisitorTracker
- ✅ `src/app/api/auth/login/route.js` - Added login tracking

## 🎉 You're All Set!

Your admin dashboard now has **real-time visibility** into all site activity!

---

**Need Help?** Check `REALTIME_ALERTS_README.md` for detailed documentation.
