// register.js

// Function to display a message at a specified HTML element
function displayMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerText = message;
        element.style.display = "block";
    }
}

// Function to hide a message at a specified HTML element
function hideMessage(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = "none";
    }
}

async function register_user(name, email, pass) 
{
    try {
		// send POST request to API
        const response = await fetch("acc/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: name, email: email, password: pass }),
        });

		// display message according to the response
        if (response.ok) {
            const result = await response.text();
            displayMessage("registeration-result", "Profile Registered");
        } else {
            const errorData = await response.json();
            displayMessage("registeration-result", errorData.error);
        }
    } catch (error) {
        displayMessage("registeration-result","API could not be contacted.");
    }
}

window.onload = () => {

	let submit_button = document.getElementById("register-submit");

	submit_button.onclick = async () => {
		let name = document.getElementById("register-name").value;
		let email = document.getElementById("register-email").value;
		let pass = document.getElementById("register-pass").value;
		let pass_confirm = document.getElementById("register-pass-confirm").value;

        // Check if the passwords match
        if (pass !== pass_confirm) {
            displayMessage("registeration-result","Passwords do not match.");
            return;
        } else {
            hideMessage("registeration-result");
        }
		
        register_user(name, email, pass);
    }
}