fetch('/get-user-data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('username-display').textContent = data.username;
                document.getElementById('student-type-display').textContent = data.type;
                document.getElementById('student-email-display').textContent = data.email;
                document.getElementById('student-description-display').textContent = data.description;
            })
            .catch(error => console.error('Error:', error));

            fetch('/get-all-students')
            .then(response => response.json())
            .then(data => {
                const studentGrid = document.getElementById('student-grid');
                data.forEach(student => {
                    const studentCard = document.createElement('div');
                    studentCard.classList.add('user-card');
                    studentCard.innerHTML = `
                        <h3>${student.username}</h3>
                        <p>Type: ${student.type}</p>
                        <p>Email: ${student.email}</p>
                        <button onclick="showReservations('${student.username}')">Show Reservations</button>
                    `;
                    studentGrid.appendChild(studentCard);
                });
            })
            .catch(error => console.error('Error:', error));
        

        // Fetch user reservations and display them
        fetch('/get-user-data')
        .then(response => response.json())
        .then(data => {

            return fetch(`/get-user-reservations?username=${data.username}`);
        })
        .then(response => response.json())
        .then(reservations => {
            const reservationList = document.getElementById('reservation-list');
            reservations.forEach(reservation => {
                const reservationElement = document.createElement('div');
                reservationElement.textContent = `${reservation.roomName} - ${reservation.timeslot.startTime} - ${reservation.timeslot.endTime} - ${reservation.seat}`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = function() {
                    fetch(`/delete-reservation?id=${reservation.id}`, {
                        method: 'DELETE',
                    })
                    .then(response => {
                        if (response.ok) {
                            reservationList.removeChild(reservationElement);
                        } else {
                            console.error('Error deleting reservation:', response.statusText);
                        }
                    })
                    .catch(error => console.error('Error:', error));
                };
                reservationElement.appendChild(deleteButton);
                reservationList.appendChild(reservationElement);
            });
        })
        .catch(error => console.error('Error:', error));

        // Edit Profile Modal
        const modal = document.getElementById('edit-profile-modal');
        const btn = document.getElementById('edit-profile-button');
        const span = document.getElementsByClassName('close')[0];

        btn.onclick = function() {
            modal.style.display = 'block';
            document.getElementById('edit-username').value = document.getElementById('username-display').textContent;
            document.getElementById('edit-email').value = document.getElementById('student-email-display').textContent;
            document.getElementById('edit-description').value = document.getElementById('student-description-display').textContent;
        }

        span.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        document.getElementById('edit-profile-form').addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('edit-username').value;
            const email = document.getElementById('edit-email').value;
            const description = document.getElementById('edit-description').value;

            const updatedData = {
                username: username,
                email: email,
                description: description
            };

            fetch('/update-user-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })
            .then(response => {
                if (response.ok) {
                    // Update the displayed user data
                    document.getElementById('username-display').textContent = username;
                    document.getElementById('student-email-display').textContent = email;
                    document.getElementById('student-description-display').textContent = description;
                } else {
                    console.error('Error updating user data:', response.statusText);
                }
            })
            .catch(error => console.error('Error:', error));

            modal.style.display = 'none';
        });
    
        function showReservations(username) {
            fetch(`/get-user-reservations?username=${username}`)
              .then(response => response.json())
              .then(reservations => {
                const reservationsData = document.querySelector('.reservations_data');
                reservationsData.innerHTML = ''; // Clear any existing reservations
          
                reservations.forEach(reservation => {
                  const reservationDiv = document.createElement('div');
                  reservationDiv.classList.add('reservation');
                  reservationDiv.innerHTML = `
                    <h4>${reservation.room.roomName}</h4>
                    <p>${reservation.timeslot.startTime} - ${reservation.timeslot.endTime}</p>
                    <p>Seat: ${reservation.seat}</p>
                  `;
                  reservationsData.appendChild(reservationDiv);
                });
              })
              .catch(error => console.error('Error:', error));
          }          