const RoomService = require('../service/roomService')
const RoomDto = require('../Dtos/roomDto');

class roomsController {
    async create(req, res) {
        const { topic, roomType } = req.body;
        if (!topic || !roomType) {
            return res.status(400).json('all fields are required!');
        }
        const room = await RoomService.create({
            topic,
            roomType,
            ownerId: req.user._id
        })
        return res.json(new RoomDto(room))
    }
    async index(req, res) {
        const rooms = await RoomService.getAllRooms(['Open']);
        const allRooms = rooms.map(room => new RoomDto(room));
        return res.json(allRooms);
    }
    async show(req, res) {
        const room = await RoomService.getRoom(req.params.roomId)
        return res.json(room)
    }
}

module.exports = new roomsController;