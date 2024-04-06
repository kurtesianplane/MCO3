const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomName: String,
    roomCapacity: Number,
    timeslots: [{
        startTime: String,
        endTime: String
    }],
    inUse: Number,
    reserved: Number
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;