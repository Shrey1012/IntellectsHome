const roomService = require("../services/room-service");
const RoomDto = require("../dtos/room-dto");

class RoomsController {
  async create(req, res) {
    //room
    const { topic, roomType } = req.body;
    if (!topic || !roomType) {
      return res.status(400).json({ message: "Please enter all the fields" });
    }

    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user._id,
    });

    return res.status(200).json(new RoomDto(room));
  }

    async index(req, res) {
        const rooms = await roomService.getAllRooms(['open']);
        const allRooms = rooms.map((room) => new RoomDto(room));
        return res.status(200).json(allRooms);
    }

    async show(req, res) {
      const room = await roomService.getRoom(req.params.roomId);
      return res.status(200).json(room);
    }
}

module.exports = new RoomsController();
