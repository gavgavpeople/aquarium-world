import { run } from './db.mjs';

async function setup() {
    await run("DROP TABLE IF EXISTS messages");
    await run("DROP TABLE IF EXISTS exhibitions");
    await run("DROP TABLE IF EXISTS zones");
    await run(`CREATE TABLE IF NOT EXISTS zones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        image TEXT,
        image_alt TEXT
    )`);

    await run(`CREATE TABLE IF NOT EXISTS exhibitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Tank exhibit', 'Interactive experience', 'Hands-on activity')),
        description TEXT NOT NULL,
        image TEXT,
        image_alt TEXT,
        FOREIGN KEY (zone_id) REFERENCES zones(id)
    )`);

    await run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    const coastal = await run(
        "INSERT INTO zones (name, slug, description) VALUES (?, ?, ?)",
        ["Coastal Rockpools", "coastal-rockpools", "Bring your explorers to discover hiding crabs, colourful anemones, sticky starfish, puffins, and playful seals in our shallow coastal basins. Learn how our care team rehabilitates rescued seal pups and discover simple ways your family can help keep local shores clean!"]
    );

    const coral = await run(
        "INSERT INTO zones (name, slug, description) VALUES (?, ?, ?)",
        ["Coral Reef", "coral-reef", "Dive into a vibrant tropical paradise to spot clownfish, sea turtles, gliding rays, tiny seahorses, and sleek reef sharks patrolling the reef. Along the way, you'll see how our coral restoration projects actively safeguard these fragile marine habitats from climate change."]
    );

    const deepSea = await run(
        "INSERT INTO zones (name, slug, description) VALUES (?, ?, ?)",
        ["Deep Sea Trench", "deep-sea-trench", "Step into the mysterious ocean depths to encounter glowing jellyfish, giant spider crabs, and anglerfish using natural biological headlamps. This illuminating exhibit highlights vital marine research working to protect these fragile deep-sea ecosystems from industrial impact."]
    );

    const freshwater = await run(
        "INSERT INTO zones (name, slug, description) VALUES (?, ?, ?)",
        ["Freshwater Rivers & Rainforest", "freshwater-rivers-rainforest", "Journey through a lush jungle habitat filled with playful otters, bright poison dart frogs, schooling piranhas, and massive prehistoric arapaima. As you explore, discover how freshwater conservation projects preserve these vital river systems and the communities that rely on them."]
    );

    const exhibitions = [
        [coastal.lastID, "Rockpool Touch Tank", "Hands-on activity", "Roll up your sleeves for a hands-on encounter with sticky starfish, hiding crabs, and velvety sea anemones in shallow, kid-friendly basins. Guided by expert handlers, families learn how to interact gently with rockpool creatures while discovering how to protect delicate shoreline habitats."],
        [coastal.lastID, "Seal Cove", "Tank exhibit", "Watch rescued seals gracefully glide and splash through clear waters in this spacious, floor-to-ceiling tank exhibit. Visitors get an up-close look at these playful marine mammals while learning about local rehabilitation efforts that help sick and injured seal pups return to the wild."],
        [coastal.lastID, "Puffin Cliff Keeper Talk", "Interactive experience", "Join our passionate animal care team for a lively, interactive session surrounded by charming puffins as they waddle and dive along a simulated coastal cliff. Kids and adults can ask questions, watch feeding time, and learn how simple daily choices help keep coastal waters clean and safe for seabirds."],

        [coral.lastID, "Reef Tunnel Walkthrough", "Interactive experience", "Walk beneath a 360-degree glass canopy as sleek reef sharks, gliding rays, and schools of vibrant fish swim right overhead. This thrilling, fully immersive experience puts your family in the centre of the action while showcasing why healthy coral reefs are essential to ocean biodiversity."],
        [coral.lastID, "Turtle Lagoon", "Tank exhibit", "Get up close with rescued sea turtles as they gracefully navigate a sunlit, shallow-water habitat. This calming tank exhibit gives visitors a front-row seat to these majestic creatures while sharing inspiring stories of marine rescue and rehabilitation."],
        [coral.lastID, "Coral Nursery Workshop", "Hands-on activity", "Get creative at a fun, hands-on station where kids and adults can learn how scientists grow and plant new coral fragments. Families get to build their own mock coral fragments to see firsthand how active reef restoration protects these fragile underwater ecosystems from climate change."],

        [deepSea.lastID, "Glowing Jellyfish Gallery", "Tank exhibit", "Step into a tranquil, darkened space and watch delicate jellyfish drift and glow like floating lanterns. This mesmerising tank exhibit highlights the wondrous beauty of natural bioluminescence and the delicate balance required to protect deep-ocean life."],
        [deepSea.lastID, "Anglerfish in the Dark", "Interactive experience", "Test your sight in a dark, interactive cavern where you must spot the faint, glowing lures of hidden anglerfish! Young explorers will love using infrared-style visuals to navigate the deep while discovering how these strange creatures hunt in the pitch-black abyss."],
        [deepSea.lastID, "Deep Sea Submarine Explorer", "Hands-on activity", "Take the helm of a virtual submersible in this hands-on simulation that takes your family miles below the surface. Work together as a crew to pilot past giant spider crabs, collect marine data, and learn how scientists protect fragile ocean trenches from industrial pollution."],

        [freshwater.lastID, "Otter Riverbank Watch", "Tank exhibit", "Energetic otters zoom, slide, and flip through flowing waters in this captivating tank exhibit. Families get a front-row view of their playful antics while learning how healthy river ecosystems keep these lively creatures thriving."],
        [freshwater.lastID, "Rainforest Frog Hunt", "Interactive experience", "Embark on a fun adventure through lush jungle greenery to spot brightly coloured poison dart frogs hiding in their habitat. This interactive quest challenges young explorers to use their keen eyes while discovering how their bright colours warn predators to stay away."],
        [freshwater.lastID, "River Clean-Up Challenge", "Hands-on activity", "Jump into action with an engaging, hands-on game where kids and adults work together to clear plastic waste from a simulated river. It’s an exciting way for visitors of all ages to learn how everyday actions protect vital freshwater habitats and the animals that rely on them."]
    ];

    for (const exhibition of exhibitions) {
        await run(
            "INSERT INTO exhibitions (zone_id, name, type, description) VALUES (?, ?, ?, ?)",
            exhibition
        );
    }

    console.log("Database ready.");
    process.exit(0);
}

setup();