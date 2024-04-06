const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: Date, required: true },
    timeslot: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    },
    seat: { type: String, required: true }
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;
