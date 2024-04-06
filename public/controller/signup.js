const signupButton = document.getElementById('signup-button');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const emailInput = document.getElementById('email');
        const typeInput = document.getElementById('type');
        const errorMessages = document.getElementById('error-messages');

        signupButton.addEventListener('click', () => {
            const username = usernameInput.value;
            const password = passwordInput.value;
            const email = emailInput.value;
            const type = typeInput.value;

            // Basic client-side validation (add more if needed)
            if (!username || !password || !email || !type) {
                errorMessages.textContent = 'Please fill out all fields.';
                return; 
            }

            // Prepare data to send to the server
            const signupData = {
                username: username,
                password: password,
                email: email,
                type: type
            };

            // Send POST request to your signup route using fetch
            fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            })
            .then(response => {
                if (response.ok) { // 200 status code – Successful signup
                    window.location.href = 'login.html'; // Redirect to the login page
                } else {
                    return response.text();  // Get the error message as text
                }
            })
            .then(data => {
                // Note: Assuming text-based error message
                errorMessages.textContent = data; 
            })
            .catch(error => {
                console.error('Error submitting signup:', error);
                errorMessages.textContent = 'An error occurred during signup.';
            }); 
        });