# ⚡ START PROJECT - PowerShell Commands

## 🚀 Quick Start Command

### Option 1: Automatic (Easiest)
```powershell
.\START_APP.ps1
```
This starts both server and client in separate windows automatically.

---

## 🔧 Manual Start (Two Terminals)

### Terminal 1 - Start Server (Backend)
```powershell
cd c:\Users\arunv\Desktop\Triplane\server
npm run dev
```

### Terminal 2 - Start Client (Frontend)
```powershell
cd c:\Users\arunv\Desktop\Triplane\client
npm start
```

---

## 📌 Expected Output

### Server Terminal:
```
Server is running on port 5000
MongoDB Connected: localhost (or your Atlas cluster)
```

### Client Terminal:
```
Compiled successfully!
webpack compiled successfully

On Your Network:  http://192.168.x.x:3000
Local:            http://localhost:3000
```

Browser will automatically open to **http://localhost:3000**

---

## ⚠️ Before Running

Make sure you've updated `server/.env` with:
- ✅ MongoDB connection string (MONGO_URI)
- ✅ Cloudinary credentials (CLOUD_NAME, API_KEY, API_SECRET)

---

## 🛑 Stop the Servers

Press **Ctrl + C** in each terminal window

---

## 🔄 Restart

Just run the same commands again

---

**That's it!** 🎉
