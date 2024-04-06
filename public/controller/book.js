function getQueryParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

document.addEventListener('DOMContentLoaded', () => {
    const queryParams = getQueryParams(); 

    if (queryParams.timeslot) {
        document.getElementById('timeslot-select').value = queryParams.timeslot;
    }

    if (queryParams.seat) {
        document.getElementById('seat-select').value = queryParams.seat;
    }

    if (queryParams.room) {
        document.getElementById('room-select').value = queryParams.room;
    }
    
    const backToRoomBtn = document.getElementById('back-to-room-btn');

    if (queryParams.room) {
        const roomName = queryParams.room.toLowerCase().replace(' ', ''); 
        backToRoomBtn.addEventListener('click', () => {
            window.location.href = `room${roomName}.html`;
        });
    } else {
        backToRoomBtn.style.display = 'none';
    }

    const bookingForm = document.getElementById('booking-form');
    const nameInput = document.getElementById('name-input');
    const idInput = document.getElementById('id-input');
    const dateInput = document.getElementById('date-input');

    function updateRoomData() {
        fetch('/rooms')
            .then(response => response.json())
            .then(data => {
                const roomSelect = document.getElementById('room-select');
                roomSelect.innerHTML = '';
    
                data.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.roomName;
                    option.text = room.roomName;
                    roomSelect.appendChild(option);
                });
                
                const timeslotSelect = document.getElementById('timeslot-select');
                timeslotSelect.innerHTML = '';

                data[currentRoomIndex].availableTimeslots.forEach(timeslot => {
                    const option = document.createElement('option');
                    option.value = `${timeslot.startTime} - ${timeslot.endTime}`;
                    option.text = `${timeslot.startTime} - ${timeslot.endTime}`;
                    timeslotSelect.appendChild(option);
                });

                const seats = document.querySelectorAll('.color-3, .color-4, .color-5');
                seats.forEach(seatElement => {
                    let seatId = seatElement.dataset.seatNumber; 

                    if (data[currentRoomIndex].availableSeats.includes(seatId)) {
                        seatElement.classList.remove('in-use', 'reserved');
                        seatElement.classList.add('available');
                    } else {
                        // TODO: Handle the case where the seat is not available
                        seatElement.classList.remove('available'); 
                        // TODO: Add styling for unavailable seats (e.g., 'in-use', 'reserved') based on your design
                    }
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    bookingForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = {
            name: nameInput.value,
            id: idInput.value,
            date: dateInput.value,
            room: document.getElementById('room-select').value,
            seat: document.getElementById('seat-select').value,
            timeslot: document.getElementById('timeslot-select').value,
        };

        fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.redirect) {
                // Redirect the user to index.html
                window.location.href = data.redirect;
            } else {
                // Handle other responses or errors
            }
        })
        .catch(error => {
            console.error('Error during booking:', error);
            // Handle errors
        });
    });

    const regularBookButton = document.getElementById('regular-book-button');
    regularBookButton.addEventListener('click', event => {
        event.preventDefault();
        bookingForm.submit();
    });
});
