// webSocket
const socketIo = require('socket.io');
const Message = require('../models/Message');

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: '*', // Adjust for security
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('sendMessage', async (data) => {
            try {
                const message = await Message.create(data);
                io.emit('receiveMessage', message); // Broadcast message
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};
