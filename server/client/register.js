// register.js

window.onload = () => {

	let submit_button = document.getElementById("register-submit");

	submit_button.onclick = async () => {
		let name = document.getElementById("register-name").value;
		let email = document.getElementById("register-email").value;
		let pass = document.getElementById("register-pass").value;
		let pass_confirm = document.getElementById("register-pass-confirm").value;

		console.log(name);
    }
}
