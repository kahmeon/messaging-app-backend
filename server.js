const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();
const server = http.createServer(app);

// ✅ Add CSP Headers to Allow WebSockets
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "connect-src 'self' ws://localhost:5000;");
    next();
});

// ✅ Ensure WebSocket Server is Initialized Properly
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// ✅ WebSocket Events
console.log(`🟢 WebSocket is initializing...`);
io.on("connection", (socket) => {
    console.log(`🔗 New client connected: ${socket.id}`);

    socket.on("sendMessage", (data) => {
        console.log(`📩 Message received from ${data.senderId}: ${data.content}`);
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// ✅ Middleware & Routes
app.use(express.json());
app.use(cors());  
app.use(helmet());  // Keep helmet for security
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);

// ✅ Sync Database
sequelize.sync().then(() => console.log('✅ Database Connected!'));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🟢 WebSocket is listening on ws://localhost:${PORT}`);
});
