const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const messagesRoute = require('./routes/messagesRoute');

const app = express();

require('dotenv').config();

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"], 
  methods: ["GET", "POST"], 
  credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/messages', messagesRoute);

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@chatappcluster.g2kuv.mongodb.net/?retryWrites=true&w=majority&appName=chatAppCluster`;
mongoose.connect(mongoURI)
    .then(() => {
        console.log("DB Connection SuccessFull");
    })
    .catch((error) => {
        console.log("DB Connection Error : ", error);
    });

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"], 
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});
