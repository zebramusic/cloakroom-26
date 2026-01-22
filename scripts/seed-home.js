// Seed script for home page content blocks
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Load environment variables manually
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/cloakroom";

const ContentBlockSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["hero", "featureGrid", "cta"],
      required: true,
    },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    visibility: {
      type: String,
      enum: ["public", "hidden"],
      default: "public",
    },
    orderIndex: { type: Number, default: 0 },
  },
  { _id: false },
);

const SitePageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "home",
        "services",
        "industries",
        "pricing",
        "about",
        "contact",
        "legal-terms",
        "legal-privacy",
        "legal-cookies",
        "blog-index",
      ],
    },
    slug: { type: String, required: true },
    localeData: {
      ro: {
        headline: String,
        intro: String,
        blocks: [ContentBlockSchema],
        seo: {
          title: { type: String, required: true },
          description: { type: String, required: true },
          ogImage: String,
          canonical: String,
        },
      },
      en: {
        headline: String,
        intro: String,
        blocks: [ContentBlockSchema],
        seo: {
          title: { type: String, required: true },
          description: { type: String, required: true },
          ogImage: String,
          canonical: String,
        },
      },
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    version: { type: Number, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date,
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    previewToken: String,
  },
  { timestamps: true },
);

const SitePage =
  mongoose.models.SitePage || mongoose.model("SitePage", SitePageSchema);

async function seed() {
  try {
    console.log("🌱 Seeding home page content...\n");
    console.log(
      "Connecting to MongoDB:",
      MONGODB_URI.replace(/\/\/.*@/, "//<credentials>@"),
    );

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Check if home page already exists
    const existingPage = await SitePage.findOne({ key: "home" });
    if (existingPage) {
      console.log("⚠️  Home page already exists. Skipping seed.");
      console.log(
        "   To re-seed, delete existing home page in MongoDB first.\n",
      );
      process.exit(0);
    }

    // Create home page with sample blocks
    const homePage = await SitePage.create({
      key: "home",
      slug: "/",
      localeData: {
        ro: {
          blocks: [
            {
              id: "hero-1",
              type: "hero",
              data: {
                headline: "Servicii Profesionale de Garderobă",
                subheadline:
                  "Soluții complete pentru evenimente de toate dimensiunile. Echipamente moderne, personal calificat, servicii impecabile.",
                primaryCta: {
                  text: "Cere Ofertă",
                  href: "/cere-oferta",
                  variant: "default",
                },
                secondaryCta: {
                  text: "Vezi Produse",
                  href: "/shop",
                  variant: "outline",
                },
                alignment: "center",
              },
              visibility: "public",
              orderIndex: 0,
            },
            {
              id: "features-1",
              type: "featureGrid",
              data: {
                title: "De Ce Să Ne Alegi",
                subtitle: "Oferim soluții profesionale adaptate nevoilor tale",
                features: [
                  {
                    id: "feat-1",
                    icon: "zap",
                    title: "Rapiditate",
                    description:
                      "Sistem de gestionare ultra-rapid cu etichete numerotate și organizare eficientă.",
                  },
                  {
                    id: "feat-2",
                    icon: "shield",
                    title: "Siguranță",
                    description:
                      "Personal instruit, sisteme de securitate și asigurare pentru bunurile clienților.",
                  },
                  {
                    id: "feat-3",
                    icon: "users",
                    title: "Profesionalism",
                    description:
                      "Echipă cu experiență în evenimente de toate dimensiunile.",
                  },
                ],
                columns: 3,
              },
              visibility: "public",
              orderIndex: 1,
            },
            {
              id: "cta-1",
              type: "cta",
              data: {
                headline: "Pregătit să Organizezi Evenimentul Perfect?",
                description:
                  "Contactează-ne astăzi pentru o ofertă personalizată.",
                primaryCta: {
                  text: "Cere Ofertă Gratuită",
                  href: "/cere-oferta",
                  variant: "default",
                },
                secondaryCta: {
                  text: "Vezi Portofoliul",
                  href: "/portofoliu",
                  variant: "outline",
                },
                backgroundColor: "primary",
              },
              visibility: "public",
              orderIndex: 2,
            },
          ],
          seo: {
            title: "Servicii Profesionale de Garderobă | Cloakroom Pro",
            description:
              "Soluții complete de garderobă pentru evenimente: echipamente moderne, personal calificat, servicii impecabile. Solicită ofertă gratuită!",
          },
        },
        en: {
          blocks: [
            {
              id: "hero-1-en",
              type: "hero",
              data: {
                headline: "Professional Cloakroom Services",
                subheadline:
                  "Complete solutions for events of all sizes. Modern equipment, trained staff, impeccable service.",
                primaryCta: {
                  text: "Get Quote",
                  href: "/en/cere-oferta",
                  variant: "default",
                },
                secondaryCta: {
                  text: "View Products",
                  href: "/en/shop",
                  variant: "outline",
                },
                alignment: "center",
              },
              visibility: "public",
              orderIndex: 0,
            },
            {
              id: "features-1-en",
              type: "featureGrid",
              data: {
                title: "Why Choose Us",
                subtitle:
                  "We provide professional solutions tailored to your needs",
                features: [
                  {
                    id: "feat-1-en",
                    icon: "zap",
                    title: "Speed",
                    description:
                      "Ultra-fast management system with numbered tags and efficient organization.",
                  },
                  {
                    id: "feat-2-en",
                    icon: "shield",
                    title: "Safety",
                    description:
                      "Trained staff, security systems and insurance for customer belongings.",
                  },
                  {
                    id: "feat-3-en",
                    icon: "users",
                    title: "Professionalism",
                    description: "Experienced team in events of all sizes.",
                  },
                ],
                columns: 3,
              },
              visibility: "public",
              orderIndex: 1,
            },
            {
              id: "cta-1-en",
              type: "cta",
              data: {
                headline: "Ready to Organize the Perfect Event?",
                description: "Contact us today for a personalized quote.",
                primaryCta: {
                  text: "Get Free Quote",
                  href: "/en/cere-oferta",
                  variant: "default",
                },
                secondaryCta: {
                  text: "View Portfolio",
                  href: "/en/portofoliu",
                  variant: "outline",
                },
                backgroundColor: "primary",
              },
              visibility: "public",
              orderIndex: 2,
            },
          ],
          seo: {
            title: "Professional Cloakroom Services | Cloakroom Pro",
            description:
              "Complete cloakroom solutions for events: modern equipment, trained staff, impeccable service. Request a free quote!",
          },
        },
      },
      status: "published",
      version: 1,
      publishedAt: new Date(),
    });

    console.log("✅ Created home page with blocks (published)");
    console.log(
      `   - RO: ${homePage.localeData.ro.blocks.length} blocks (Hero + Features + CTA)`,
    );
    console.log(
      `   - EN: ${homePage.localeData.en.blocks.length} blocks (Hero + Features + CTA)\n`,
    );

    console.log("🎉 Home page seeding complete!\n");
    console.log("Next steps:");
    console.log(
      "1. Visit http://localhost:3000 to see the site builder content",
    );
    console.log(
      "2. Go to http://localhost:3000/admin/site/pages/home to edit blocks",
    );
    console.log("3. Add, remove, or modify blocks and publish changes\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
