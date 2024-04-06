// bookingUtils.js

// Import your data files:
const reservationsData = require('./model/reservations'); 
const roomsData = require('./model/rooms');

function getAvailableTimeslots(roomName) {
  const room = roomsData.find(room => room.roomName === roomName);
  if (!room) {
    return []; // Return empty array if room not found
  }

  const availableTimeslots = room.timeslots.filter(timeslot => {
    const relevantReservations = reservationsData.filter(reservation => 
        reservation.roomName === roomName &&
        reservation.timeslot.startTime === timeslot.startTime &&
        reservation.timeslot.endTime === timeslot.endTime
    );

    return room.roomCapacity - relevantReservations.length > 0; // Check if any seats are left
  });

  return availableTimeslots;
}

function getAvailableSeats(roomName, timeslot) { 
  const room = roomsData.find(r => r.roomName === roomName);
  const availableSeats = [];

  if (room) {
    const startTime = timeslot.startTime;
    const endTime = timeslot.endTime;

    // Assuming your room seat layout is something like ['L1', 'L2', 'C1', 'C2' .... 'R3']
    for (let i = 1; i <= room.roomCapacity; i++) {
      const isLeft = i % 3 === 1;
      const isRight = i % 3 === 0;
      const rowNumber = Math.ceil(i / 3); 
      const columnLetter = isLeft ? 'L' : (isRight ? 'R' : 'C'); 
      const seatId = `${columnLetter}${rowNumber}`;

      const isReserved = reservationsData.some(reservation => {
        return reservation.roomName === roomName &&
               reservation.timeslot.startTime === startTime &&
               reservation.timeslot.endTime === endTime &&
               reservation.seat === seatId;  
      });

      if (!isReserved) {
        availableSeats.push(seatId);
      }
    }
  }

  return availableSeats;
}

module.exports = { getAvailableTimeslots, getAvailableSeats };