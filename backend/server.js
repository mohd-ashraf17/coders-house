require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
require('./db')();
const Router = require('./routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use('/storage', express.static('storage'))
app.use(cookieParser())
// const corsOption = {
//     origin: ['http://localhost:5173']
// }
// app.use(cors(corsOption))
app.use(cors());
app.use(express.json({ limit: '10mb' }))
app.use(Router)
const server = app.listen(PORT, () => console.log(`running on PORT ${PORT}`));
// sockets
const io = require('socket.io')(server, {
    cors: {
        origin: 'https://coders-house.vercel.app',
        methods: ['GET', 'POST'],
    },
});
const socketUserMapping = {};
io.on('connection', (socket) => {
    // console.log(`new connection ${socket.id}`)
    socket.on('join', ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        clients.forEach((clientId) => {
            io.to(clientId).emit('add_peer', {
                peerId: socket.id,
                createOffer: false,
                user
            })
            socket.emit('add_peer', {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId]
            })
        })
        socket.join(roomId);
    })

    // candle relay ice
    socket.on('ralay-ice', ({ peerId, icecandidate }) => {
        io.to(peerId).emit('ice-candidate', { peerId: socket.id, icecandidate });
    })
    // candle ralay sdp
    socket.on('relay-SDP', ({ peerId, sessionDescription }) => {
        io.to(peerId).emit('sessionDespription', { peerId: socket.id, sessionDescription });
    })
    // handle mute unMute
    socket.on('mute', ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        clients.forEach(client => {
            io.to(client).emit('mute', { peerId: socket.id, userId })
        })
    })

    socket.on('unMute', ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        clients.forEach(client => {
            io.to(client).emit('unMute', { peerId: socket.id, userId })
        })
    })


    // leaving the room
    const leaveRoom = ({ roomId }) => {
        const { rooms } = socket;
        // console.log(socketUserMapping)
        Array.from(rooms).forEach(roomId => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId)) || []
            clients.forEach(clientId => {
                io.to(clientId).emit('remove-peer', { peerId: socket.id, user: socketUserMapping[socket.id] })

                socket.emit('remove-peer', {
                    peerId: clientId,
                    user: socketUserMapping[clientId]
                })
            })
            socket.leave(roomId)
        })
        delete socketUserMapping[socket.id]
    }
    socket.on('leave', leaveRoom)
    socket.on('disconnecting', leaveRoom)
})