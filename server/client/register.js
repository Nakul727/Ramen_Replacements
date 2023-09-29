// register.js

import { displayMessage, hideMessage } from "./helper.js";

async function register_user(name, email, pass) 
{
    try 
	{
        const response = await fetch("http://localhost:8080/acc/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: name, email: email, password: pass }),
        });
        if (response.ok) {
            const result = await response.text();
            displayMessage("registeration-result", "Profile Registered");
        } else {
            const errorData = await response.json();
            displayMessage("registeration-result", errorData.error);
        }
    } 
	catch (error) 
	{
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

        if (pass !== pass_confirm) {
            displayMessage("registeration-result","Passwords do not match.");
            return;
        } else {
            hideMessage("registeration-result");
        }
		
        register_user(name, email, pass);
    }
}