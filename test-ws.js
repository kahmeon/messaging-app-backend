const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:5000');

ws.on('open', () => {
    console.log('✅ Connected to WebSocket!');
    ws.send(JSON.stringify({ senderId: 1, content: "Hello WebSocket!" }));
});

ws.on('message', (data) => console.log('📩 Message Received:', data));
ws.on('error', (err) => console.log('❌ WebSocket Error:', err));
ws.on('close', () => console.log('🔌 WebSocket Disconnected'));
