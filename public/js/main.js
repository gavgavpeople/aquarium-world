const contactForm = document.getElementById("contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const errors = [];

    if (!name) errors.push("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
    if (!message) errors.push("Please enter a message.");

    if (errors.length > 0) {
      event.preventDefault();

      const messageBox = document.getElementById("form-messages");
      messageBox.innerHTML = "";

      const list = document.createElement("ul");
      errors.forEach(error => {
        const item = document.createElement("li");
        item.textContent = error;
        list.appendChild(item);
      });
      messageBox.appendChild(list);
    }
  });
}