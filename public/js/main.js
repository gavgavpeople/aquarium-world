// ========== Contact form: validation and AJAX submit ==========
// Runs only on the contact page (where the form exists)
const contactForm = document.getElementById("contact-form");
 
if (contactForm) {
  const messageBox = document.getElementById("form-messages");
 
  // Shows a list of messages (errors or success) above the form
  function showMessages(messages) {
    messageBox.innerHTML = "";
    const list = document.createElement("ul");
    messages.forEach(text => {
      const item = document.createElement("li");
      item.textContent = text;
      list.appendChild(item);
    });
    messageBox.appendChild(list);
  }
 
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
 
    // Client-side validation
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const errors = [];
 
    if (!name) errors.push("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
    if (!message) errors.push("Please enter a message.");
 
    if (errors.length > 0) {
      showMessages(errors);
      return;
    }
 
    // Send the form to the server without reloading the page
    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: { "X-Requested-With": "fetch" },
        body: new URLSearchParams(new FormData(contactForm))
      });
      const data = await response.json();
 
      if (response.ok) {
        showMessages([data.message]);
        contactForm.reset();
      } else {
        showMessages(data.errors);
      }
    } catch {
      showMessages(["Sorry, something went wrong. Please try again."]);
    }
  });
}
 
// ========== Kids' activity: Rockpool Explorer ==========
// Runs only on the activity page (where the rocks exist)
const rocks = document.querySelectorAll(".rock");
const foundCount = document.getElementById("found-count");
let found = 0;
 
if (rocks.length > 0) {
  rocks.forEach(rock => {
    rock.addEventListener("click", () => {
      // Only count each rock once
      if (!rock.classList.contains("found")) {
        rock.classList.add("found");
        found++;
        foundCount.textContent = `You found ${found} of ${rocks.length} creatures.`;
 
        // Reveal the creature and hide the rock
        rock.nextElementSibling.hidden = false;
        rock.hidden = true;
 
        if (found === rocks.length) {
          foundCount.textContent = `Well done! You found all ${rocks.length} creatures!`;
        }
      }
    });
  });
}
 
// ========== Home page: AJAX exhibit search ==========
// Runs only on the home page (where the search box exists)
const input = document.getElementById("search");
 
if (input) {
  const resultsList = document.getElementById("search-results");
 
  input.addEventListener("input", async () => {
    // Ask the server for matching exhibits (search text made URL-safe)
    const response = await fetch(`/api/search?q=${encodeURIComponent(input.value)}`);
    const results = await response.json();
 
    // Clear old results, then show each match as a link to its zone
    resultsList.innerHTML = "";
 
    results.forEach(result => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `/zone/${result.slug}`;
      link.textContent = `${result.name} (${result.zone_name})`;
      item.appendChild(link);
      resultsList.appendChild(item);
    });
  });
}