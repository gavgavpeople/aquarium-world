// ========== Imports ==========
import express from "express";
import { all, get, run } from "./database/db.mjs";

// ========== App setup and middleware ==========
const app = express();
const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static("public"));               // serves CSS, JS and images
app.use(express.urlencoded({ extended: true })); // reads form data into req.body

// ========== Page routes ==========
// Home page: zones are loaded from the database
app.get("/", async (req, res) => {
  const zones = await all("SELECT * FROM zones");
  res.render("home", { zones });
});

app.get("/faq", (req, res) => {
  res.render("faq");
});

app.get("/activity", (req, res) => {
  res.render("activity");
});

// One dynamic route for every zone page, e.g. /zone/coral-reef
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

// ========== Form handling ==========
// Contact form: replies with JSON for AJAX requests, or a full page if JavaScript is off
app.post("/contact", async (req, res) => {
  const wantsJson = req.get("X-Requested-With") === "fetch";
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const message = (req.body.message || "").trim();
  const errors = [];

  // Server-side validation
  if (!name) errors.push("Please enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Please enter a valid email address.");
  if (!message) errors.push("Please enter a message.");

  if (errors.length > 0) {
    if (wantsJson) return res.status(400).json({ errors });
    return res.status(400).render("contact", { errors });
  }

  // Parameterised query (? placeholders) prevents SQL injection
  await run("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", [name, email, message]);

  if (wantsJson) return res.json({ message: "Thanks! Your message has been sent." });
  res.render("contact", { submitted: true });
});

// ========== API routes (AJAX) ==========
// Exhibit search: returns matching exhibits and their zone as JSON
app.get("/api/search", async (req, res) => {
  const query = (req.query.q || "").trim();
  if (!query) return res.json([]);

  const results = await all(
    `SELECT exhibitions.name, zones.name AS zone_name, zones.slug
     FROM exhibitions
     JOIN zones ON exhibitions.zone_id = zones.id
     WHERE exhibitions.name LIKE ? OR exhibitions.description LIKE ?
     LIMIT 10`,
    [`%${query}%`, `%${query}%`]
  );
  res.json(results);
});

// ========== Start server ==========
app.listen(PORT, (err) => {
  if (err) throw err; // e.g. port 5000 already in use
  console.log(`Server is running on http://localhost:${PORT}`);
});