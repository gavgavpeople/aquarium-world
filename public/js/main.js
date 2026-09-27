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

const ticketDialog = document.getElementById('ticket-dialog');
const ticketForm = document.getElementById('ticket-form');
const ticketMessage = document.getElementById('ticket-message');
const dateInput = document.getElementById('t-date');

const now = new Date();
const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
const nextYear = (now.getFullYear() + 1) + today.slice(4);

dateInput.min = today;
dateInput.max = nextYear;

ticketForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  ticketMessage.textContent = 'Booking…';

  try {
    const response = await fetch('/tickets', {
      method: 'POST',
      body: new URLSearchParams(new FormData(ticketForm))
    });
    const data = await response.json();

    if (response.ok) {
      ticketMessage.textContent = data.message;
      ticketForm.reset();
    } else {
      ticketMessage.textContent = data.errors.join(' ');
    }
  } catch {
    ticketMessage.textContent = 'Something went wrong. Please try again.';
  }
});

document.getElementById('ticket-open').addEventListener('click', () => {
  ticketDialog.showModal();
});

document.getElementById('ticket-close').addEventListener('click', () => {
  ticketDialog.close();
});