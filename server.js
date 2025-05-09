
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./messageModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection com string real
mongoose.connect('mongodb+srv://amandafranceschi18:SenhaChat@2025@cluster0.cwes1fg.mongodb.net/chat-criative?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

io.on('connection', async (socket) => {
    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit('load messages', messages);

    socket.on('chat message', async (msg) => {
        const newMsg = new Message({ text: msg.text, sender: msg.sender });
        await newMsg.save();
        io.emit('chat message', newMsg);
    });

    socket.on('delete message', async (id) => {
        await Message.findByIdAndDelete(id);
        io.emit('delete message', id);
    });
});

server.listen(PORT, () => {
    console.log('Servidor rodando na porta', PORT);
});
