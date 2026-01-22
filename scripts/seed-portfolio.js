#!/usr/bin/env node

/**
 * Portfolio Seed Script
 * Populates the database with sample portfolio items
 *
 * Usage: node scripts/seed-portfolio.js
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Read .env.local file manually
const envPath = path.join(__dirname, "..", ".env.local");
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const uriMatch = envContent.match(/MONGODB_URI=(.+)/);
  if (uriMatch) {
    MONGODB_URI = uriMatch[1].trim();
  }
}

if (!MONGODB_URI) {
  console.error(
    "ERROR: MONGODB_URI not found in environment variables or .env.local",
  );
  console.error("Please set MONGODB_URI or create .env.local file");
  process.exit(1);
}

// Define schemas inline (same as in models.ts)
const portfolioItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    localeContent: {
      ro: {
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        body: String,
      },
      en: {
        title: String,
        excerpt: String,
        body: String,
      },
    },
    eventMeta: {
      eventType: String,
      location: String,
      startsAt: Date,
      endsAt: Date,
    },
    tags: [String],
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    isFeatured: { type: Boolean, default: false },
    orderIndex: { type: Number, default: 0 },
    coverImageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PortfolioImage",
    },
  },
  { timestamps: true },
);

const PortfolioItem =
  mongoose.models.PortfolioItem ||
  mongoose.model("PortfolioItem", portfolioItemSchema);

const sampleItems = [
  {
    slug: "tech-conference-2024",
    localeContent: {
      ro: {
        title: "Conferință Tehnologie & Inovație 2024",
        excerpt:
          "O conferință de anvergură cu peste 500 de participanți, dedicată tehnologiilor emergente și transformării digitale în industria românească.",
        body: `## Despre Eveniment

Conferința Tehnologie & Inovație 2024 a reunit lideri din industrie, antreprenori și specialiști IT pentru a discuta despre viitorul tehnologiei în România.

### Servicii Oferite

- Garderobă profesională pentru 500+ participanți
- Sistem digital de management cu QR code
- Personal dedicat pe parcursul întregului eveniment
- Depozitare sigură pentru laptop-uri și echipamente

### Provocări

Am gestionat un flux intens de participanți în timpul pauzelor, asigurând timpi de așteptare minimi și o experiență fluidă pentru toți invitații.

### Rezultate

- 500+ participanți deserviți
- Timp mediu de serviciu: sub 30 secunde
- Rating satisfacție: 4.9/5
- Zero pierderi sau daune`,
      },
      en: {
        title: "Tech Conference & Innovation 2024",
        excerpt:
          "A major conference with over 500 participants, dedicated to emerging technologies and digital transformation in Romanian industry.",
        body: `## About the Event

Tech & Innovation Conference 2024 brought together industry leaders, entrepreneurs, and IT specialists to discuss the future of technology in Romania.

### Services Provided

- Professional cloakroom for 500+ attendees
- Digital management system with QR codes
- Dedicated staff throughout the event
- Secure storage for laptops and equipment

### Challenges

We managed intense participant flow during breaks, ensuring minimal wait times and a smooth experience for all guests.

### Results

- 500+ attendees served
- Average service time: under 30 seconds
- Satisfaction rating: 4.9/5
- Zero losses or damages`,
      },
    },
    eventMeta: {
      eventType: "conference",
      location: "București, România",
      startsAt: new Date("2024-03-15"),
      endsAt: new Date("2024-03-17"),
    },
    tags: ["conferință", "tehnologie", "500+ participanți", "2024"],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: true,
    orderIndex: 0,
  },
  {
    slug: "music-festival-summer-2023",
    localeContent: {
      ro: {
        title: "Summer Beats Festival 2023",
        excerpt:
          "Festival de muzică electronică în aer liber cu 3 zile de distracție și peste 10.000 de participanți zilnic.",
        body: `## Despre Festival

Summer Beats Festival este cel mai mare festival de muzică electronică din regiunea noastră, aducând artiști internaționali și fani din toată Europa.

### Servicii Oferite

- Garderoabe multiple pentru acces rapid
- Sistem cashless integrat
- Depozitare pentru rucsacuri și articole voluminoase
- Program prelungit 24/7

### Logistică

Am instalat 5 puncte de garderobă strategice pentru a asigura acces facil din orice zonă a festivalului.`,
      },
      en: {
        title: "Summer Beats Festival 2023",
        excerpt:
          "Outdoor electronic music festival with 3 days of entertainment and over 10,000 daily attendees.",
        body: `## About the Festival

Summer Beats Festival is the largest electronic music festival in our region, bringing international artists and fans from across Europe.

### Services Provided

- Multiple cloakrooms for quick access
- Integrated cashless system
- Storage for backpacks and bulky items
- Extended 24/7 schedule`,
      },
    },
    eventMeta: {
      eventType: "festival",
      location: "Cluj-Napoca, România",
      startsAt: new Date("2023-07-20"),
      endsAt: new Date("2023-07-23"),
    },
    tags: ["festival", "muzică", "summer", "10000+ participanți"],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: true,
    orderIndex: 1,
  },
  {
    slug: "corporate-gala-luxury-brand",
    localeContent: {
      ro: {
        title: "Gală Corporativă - Brand de Lux Internațional",
        excerpt:
          "Eveniment elegant cu 200 de invitați VIP, organizat de un brand internațional de lux pentru lansarea noii colecții.",
        body: `## Despre Eveniment

O gală exclusivistă care a celebrat lansarea colecției de toamnă a unui brand de lux recunoscut mondial.

### Servicii Premium

- Garderobă VIP cu personal în costume formale
- Verificare biometrică pentru securitate maximă
- Ambalare specială pentru blănuri și articole de lux
- Serviciu valet pentru haine

### Atenție la Detalii

Am asigurat un serviciu discret și de înaltă clasă, în concordanță cu imaginea brandului și așteptările invitaților VIP.`,
      },
      en: {
        title: "Corporate Gala - International Luxury Brand",
        excerpt:
          "Elegant event with 200 VIP guests, organized by an international luxury brand for their new collection launch.",
        body: `## About the Event

An exclusive gala celebrating the fall collection launch of a world-renowned luxury brand.

### Premium Services

- VIP cloakroom with formally dressed staff
- Biometric verification for maximum security
- Special packaging for furs and luxury items
- Valet service for garments`,
      },
    },
    eventMeta: {
      eventType: "gala",
      location: "București, România",
      startsAt: new Date("2023-10-05"),
      endsAt: new Date("2023-10-05"),
    },
    tags: ["gală", "corporate", "VIP", "lux"],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: false,
    orderIndex: 2,
  },
  {
    slug: "sports-championship-2024",
    localeContent: {
      ro: {
        title: "Campionatul Național de Baschet 2024",
        excerpt:
          "Turneu sportiv cu meciuri zilnice pe parcursul a 2 săptămâni, găzduind echipe și suporteri din toată țara.",
        body: `## Despre Campionat

Cel mai important eveniment de baschet al anului, reunind cele mai bune echipe din România.

### Servicii Oferite

- Garderobă pentru sportivi și oficiali
- Depozitare echipament sportiv
- Program flexibil adaptat orarul meciurilor
- Servicii pentru suporteri

### Impact

Am deservit peste 5.000 de persoane pe parcursul campionatului, contribuind la succesul evenimentului.`,
      },
      en: {
        title: "National Basketball Championship 2024",
        excerpt:
          "Sports tournament with daily matches over 2 weeks, hosting teams and supporters from across the country.",
        body: `## About the Championship

The most important basketball event of the year, bringing together the best teams from Romania.

### Services Provided

- Cloakroom for athletes and officials
- Sports equipment storage
- Flexible schedule adapted to match times
- Services for supporters`,
      },
    },
    eventMeta: {
      eventType: "sports",
      location: "Constanța, România",
      startsAt: new Date("2024-04-10"),
      endsAt: new Date("2024-04-24"),
    },
    tags: ["sport", "baschet", "campionat", "2024"],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: false,
    orderIndex: 3,
  },
  {
    slug: "wedding-expo-2023",
    localeContent: {
      ro: {
        title: "Târg de Nunți & Eventos 2023",
        excerpt:
          "Expoziție dedicată industriei de nunți cu peste 100 de expozanți și mii de vizitatori în cele 3 zile.",
        body: `## Despre Târg

Cel mai mare eveniment dedicat industriei de nunți din România, unde cuplurile își pot planifica ziua perfectă.

### Servicii

- Garderobă pentru expozanți și vizitatori
- Depozitare mostre și materiale promoționale
- Sistem rapid pentru trafic intens

### Experiență

Am contribuit la succesul târgului oferind servicii profesionale care au făcut experiența vizitatorilor mai plăcută.`,
      },
      en: {
        title: "Wedding & Events Expo 2023",
        excerpt:
          "Exhibition dedicated to the wedding industry with over 100 exhibitors and thousands of visitors over 3 days.",
        body: `## About the Expo

The largest event dedicated to the wedding industry in Romania, where couples can plan their perfect day.

### Services

- Cloakroom for exhibitors and visitors
- Storage for samples and promotional materials
- Rapid system for heavy traffic`,
      },
    },
    eventMeta: {
      eventType: "exhibition",
      location: "București, România",
      startsAt: new Date("2023-11-10"),
      endsAt: new Date("2023-11-12"),
    },
    tags: ["expoziție", "nunți", "evenimente", "2023"],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: false,
    orderIndex: 4,
  },
  {
    slug: "jazz-concert-intimate",
    localeContent: {
      ro: {
        title: "Concert Intim de Jazz - Sala Radio",
        excerpt:
          "Seară de jazz cu un artist internațional renumit, într-o atmosferă elegantă și intimă pentru 150 de melomani.",
        body: `## Despre Concert

O seară magică de jazz autentic în Sala Radio, cu un artist laureat Grammy.

### Servicii

- Garderobă elegantă
- Personal discret și profesionist
- Gestionare blănuri și haine de seară

### Atmosferă

Am contribuit la experiența rafinată a serii cu servicii impecabile și discreție totală.`,
      },
      en: {
        title: "Intimate Jazz Concert - Radio Hall",
        excerpt:
          "Jazz evening with a renowned international artist, in an elegant and intimate atmosphere for 150 music lovers.",
        body: `## About the Concert

A magical evening of authentic jazz at Radio Hall, with a Grammy-winning artist.

### Services

- Elegant cloakroom
- Discreet and professional staff
- Fur and evening wear management`,
      },
    },
    eventMeta: {
      eventType: "concert",
      location: "București, România",
      startsAt: new Date("2024-02-14"),
      endsAt: new Date("2024-02-14"),
    },
    tags: ["concert", "jazz", "intim", "cultură"],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: false,
    orderIndex: 5,
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Check if portfolio items already exist
    const existingCount = await PortfolioItem.countDocuments();
    if (existingCount > 0) {
      console.log(
        `\nDatabase already contains ${existingCount} portfolio item(s).`,
      );
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise((resolve) => {
        readline.question(
          "Do you want to delete existing items and reseed? (yes/no): ",
          resolve,
        );
      });
      readline.close();

      if (answer.toLowerCase() !== "yes") {
        console.log("Seeding cancelled.");
        process.exit(0);
      }

      console.log("Deleting existing portfolio items...");
      await PortfolioItem.deleteMany({});
      console.log("✓ Deleted existing items");
    }

    console.log("\nSeeding portfolio items...");

    for (const item of sampleItems) {
      const created = await PortfolioItem.create(item);
      console.log(
        `✓ Created: ${created.localeContent.ro.title} (${created.slug})`,
      );
    }

    console.log(
      `\n✅ Successfully seeded ${sampleItems.length} portfolio items!`,
    );
    console.log(
      "\nNote: Images are not included in the seed. Upload images via the admin panel.",
    );
    console.log(
      "Access admin panel at: http://localhost:3000/admin/portfolio\n",
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

seed();
