const loginButton = document.getElementById('login-button');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessages = document.getElementById('error-messages');

        loginButton.addEventListener('click', () => {
            const username = usernameInput.value;
            const password = passwordInput.value;

            // Basic client-side validation (add more if needed)
            if (!username || !password) {
                errorMessages.textContent = 'Please fill out both username and password.';
                return; 
            }

            // Prepare data to send to the server
            const loginData = {
                username: username,
                password: password
            };

            // Send POST request to your login route using fetch
            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                if (response.ok) { // 200 status code – Successful login
                    window.location.href = 'userprofile.html'; // Redirect to the user profile page
                } else {
                    return response.text();  // Get the error message as text
                }
            })
            .then(data => {
                // Note: Assuming text-based error message
                errorMessages.textContent = data; 
            })
            .catch(error => {
                console.error('Error submitting login:', error);
                errorMessages.textContent = 'An error occurred during login.';
            }); 
        });

        window.onload = function() {
            fetch('/login-status')
                .then(response => response.json())
                .then(data => {
                if (data.loggedIn) {
                    // The user is logged in, redirect them to the user profile page
                    window.location.href = '../view/userprofile.html';
                }
                });
            };