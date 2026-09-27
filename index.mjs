import express from "express";
import { all, get, run } from "./database/db.mjs";

await run(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  visit_date TEXT NOT NULL,
  adults INTEGER NOT NULL,
  children INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

const app = express();
const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const zones = await all("SELECT * FROM zones");
    res.render("home", { zones });
});

app.get("/faq", (req, res) => {
    res.render("faq");
});
app.get("/zone/:slug", async (req, res) => {
    const zone = await get("SELECT * FROM zones WHERE slug = ?", [req.params.slug]);
    if (!zone) {
        return res.status(404).send("Zone not found");
    }
    const exhibitions = await all("SELECT * FROM exhibitions WHERE zone_id = ?", [zone.id]);
    res.render("zone", { zone, exhibitions });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/contact", async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const message = (req.body.message || "").trim();
  const errors = [];

  if (!name) errors.push("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
  if (!message) errors.push("Please enter a message.");

  if (errors.length > 0) {
    return res.status(400).render("contact", { errors });
  }

  await run("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
  res.render("contact", { submitted: true });
});

app.post("/tickets", async (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const visitDate = (req.body.visit_date || "").trim();
  const adults = Number(req.body.adults);
  const children = Number(req.body.children);
  const errors = [];
  const today = new Date().toISOString().slice(0, 10);
  const maxDate = (new Date().getFullYear() + 1) + today.slice(4);
  
  if (!name) errors.push("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate) || visitDate < today) errors.push("Please choose a date from today onwards.");
  if (visitDate > maxDate) errors.push("Bookings can only be made up to one year ahead.");
  if (!Number.isInteger(adults) || adults < 0 || adults > 10) errors.push("Adults must be between 0 and 10.");
  if (!Number.isInteger(children) || children < 0 || children > 10) errors.push("Children must be between 0 and 10.");
  if (adults + children === 0) errors.push("Please book at least one ticket.");

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    await run(
      "INSERT INTO bookings (name, email, visit_date, adults, children) VALUES (?, ?, ?, ?, ?)",
      [name, email, visitDate, adults, children]
    );
    res.json({ message: `Thanks ${name}, your tickets for ${visitDate} are booked!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: ["Sorry, we couldn't save your booking. Please try again."] });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});