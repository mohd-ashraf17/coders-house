const Room = require('../model/roomModel');

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await Room.create({
            topic,
            roomType,
            ownerId,
            speackers: [ownerId]
        });
        return room;
    }
    async getAllRooms(payload) {
        const rooms = await Room.find({ roomType: { $in: payload } }).populate('ownerId').populate('speackers').exec();
        return rooms;
    }
    async getRoom(roomId) {
        const room = await Room.findOne({ _id: roomId })
        return room;
    }
}

module.exports = new RoomService;