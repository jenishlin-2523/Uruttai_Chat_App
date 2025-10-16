const User = require('../models/User');
const Message = require('../models/Message');

const socketHandler = (io) => {
  const userSockets = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user_connected', async (userId) => {
      userSockets.set(userId, socket.id);
      
      await User.findByIdAndUpdate(userId, { online: true });
      
      io.emit('user_status', { userId, online: true });
    });

    socket.on('send_message', async (data) => {
      try {
        const message = new Message({
          sender: data.sender,
          receiver: data.receiver,
          content: data.content,
          messageType: data.messageType || 'text',
        });

        await message.save();
        await message.populate('sender', 'username avatar');
        await message.populate('receiver', 'username avatar');

        const receiverSocketId = userSockets.get(data.receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
          
          io.to(receiverSocketId).emit('message_delivered', {
            messageId: message._id,
          });
        }

        socket.emit('message_sent', message);
      } catch (error) {
        socket.emit('message_error', { error: error.message });
      }
    });

    socket.on('typing', (data) => {
      const receiverSocketId = userSockets.get(data.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          userId: data.sender,
          isTyping: data.isTyping,
        });
      }
    });

    socket.on('message_read', async (data) => {
      try {
        await Message.findByIdAndUpdate(data.messageId, { read: true });
        
        const senderSocketId = userSockets.get(data.sender);
        if (senderSocketId) {
          io.to(senderSocketId).emit('message_read_confirmation', {
            messageId: data.messageId,
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          await User.findByIdAndUpdate(userId, {
            online: false,
            lastSeen: new Date(),
          });
          io.emit('user_status', { userId, online: false });
          break;
        }
      }
    });
  });
};

module.exports = socketHandler;