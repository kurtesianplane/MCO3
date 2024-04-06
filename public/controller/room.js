var currentRoomIndex = Number(localStorage.getItem('currentRoomIndex')) || 0;
var currentRoomName = "Lab" + (currentRoomIndex + 1);
var totalRooms = 5;

function initializeRoom() {
    updateRoomInfo();
   
    const seatElements = document.querySelectorAll('.seat-plan > div');
    seatElements.forEach(seat => seat.addEventListener('click', handleSeatClick));
   
    const bookNowButton = document.getElementById('book-now-button'); // Adjust the ID if needed 
    bookNowButton.addEventListener('click', redirectToBooking);
    }
   
    function redirectToBooking() {
    const selectedSeat = localStorage.getItem('selectedSeat');
    const currentRoomName = document.getElementById('room-name').textContent; // Get room name from UI
   
    if (selectedSeat) {
    const timeslot = document.getElementById('timeslot-select').value; // Assuming you have a timeslot dropdown
   
    const bookingUrl = `/book.html?room=${currentRoomName}&timeslot=${timeslot}&seat=${selectedSeat}`;
    window.location.href = bookingUrl;
    } else {
    alert("Please select a seat before booking.");
    }
   }

 document.addEventListener('DOMContentLoaded', initializeRoom);

 function updateRoomInfo() {
 fetch(`/get-room-data/${currentRoomName}`)
 .then(response => response.json())
 .then(data => {
 const room = data.room;
 
 if (!room) {
 console.error('Room not found:', currentRoomName);
 return;
 }
 
 console.log("currentRoomName:", currentRoomName); 
 document.getElementById('room-name').textContent = room.roomName;
 document.getElementById('room-capacity').textContent = room.roomCapacity;
 document.getElementById('room-description').textContent = room.description;
 document.getElementById('room-equipment').textContent = room.equipment.join(', ');
 document.getElementById('room-timeslots').textContent = room.timeslots.map(timeslot => `${timeslot.startTime} - ${timeslot.endTime}`).join(', ');
 document.getElementById('room-in-use').textContent = room.inUse;
 document.getElementById('room-reserved').textContent = room.reserved;
 document.getElementById('room-label').textContent = `Lab ${currentRoomIndex + 1}`;
 updateSeatStatuses(data.reservations);
 })
 .catch((error) => {
 console.error('Error:', error);
 });
 }

 function navigateToRoom(index) {
 if (index >= 0 && index < totalRooms) {
 currentRoomIndex = index;
 localStorage.setItem('currentRoomIndex', String(currentRoomIndex));

 console.log("Navigating to room:", currentRoomName)

 window.location.href = `room${currentRoomIndex + 1}.html?roomName=${currentRoomName}`;
 }
 }

 function updateSeatStatuses(reservations) {
 const seatElements = document.querySelectorAll('.seat-plan > div');

 seatElements.forEach(seatElement => {
 const seatNumber = seatElement.dataset.seatNumber;

 seatElement.classList.remove('color-3', 'color-4', 'color-5', 'highlighted');

 if (reservations.some(reservation => reservation.seat === seatNumber)) {
 seatElement.classList.add('color-4');
 } else {
 seatElement.classList.add('color-3');
 }
 });
 }

 document.addEventListener('DOMContentLoaded', initializeRoom);

 function handleSeatClick(event) {
 const clickedSeat = event.target;

 // Check if the seat is available
 if (!clickedSeat.classList.contains('color-3')) { 
 return;
 }

 // Remove the 'highlighted' class from all seats
 const seats = document.querySelectorAll('.seat-plan > div');
 seats.forEach(seat => seat.classList.remove('highlighted'));

 // Add the 'highlighted' class to the clicked seat
 clickedSeat.classList.add('highlighted');

 // Store the selected seat in localStorage
 localStorage.setItem('selectedSeat', clickedSeat.dataset.seatNumber);
 }

 document.getElementById('prev-room').addEventListener('click', function(event) {
 event.preventDefault();
 navigateToRoom(currentRoomIndex - 1);
 });

 document.getElementById('next-room').addEventListener('click', function(event) {
 event.preventDefault();
 navigateToRoom(currentRoomIndex + 1);
 });
