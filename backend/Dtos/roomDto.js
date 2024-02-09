class RoomDto {
_id;
topic;
roomType;
speackers;
ownerId;
createdAt;

constructor(room) {
    this._id = room._id;
    this.topic = room.topic;
    this.roomType = room.roomType;
    this.speackers = room.speackers;
    this.ownerId = room.ownerId;
    this.createdAt = room.createdAt;
}

}

module.exports = RoomDto;