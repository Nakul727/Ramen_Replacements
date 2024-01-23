// Function to display a message at a specified HTML element
function displayMessage(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerText = message;
    element.style.display = 'block';
  }
}

// Function to hide a message at a specified HTML element
function hideMessage(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

export { displayMessage, hideMessage };
