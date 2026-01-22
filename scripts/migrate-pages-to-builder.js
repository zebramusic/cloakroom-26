#!/usr/bin/env node

/**
 * Migration Script: Convert Static Pages to Site Builder
 *
 * This script creates SitePage records for existing static pages:
 * - servicii, industrii, preturi, despre, parteneri, shop
 *
 * It converts the content to blocks (hero, features, cta) and publishes them.
 */

const { MongoClient } = require("mongodb");
const readline = require("readline");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cloakroom";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function migrate() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db();
    const pages = db.collection("sitepages");

    // Define pages to migrate
    const pagesToMigrate = [
      {
        slug: "servicii",
        title: {
          ro: "Servicii Complete pentru Evenimente",
          en: "Complete Event Services",
        },
        blocks: [
          {
            type: "hero",
            order: 0,
            content: {
              ro: {
                title: "Servicii Complete pentru Evenimente",
                subtitle:
                  "De la festivaluri cu 12.000 participanți la evenimente corporate. Soluții complete de garderobă profesională.",
                backgroundImage: "",
                ctaText: "Solicită Ofertă",
                ctaLink: "/cere-oferta",
              },
              en: {
                title: "Complete Event Services",
                subtitle:
                  "From 12,000-attendee festivals to corporate events. Complete professional cloakroom solutions.",
                backgroundImage: "",
                ctaText: "Request Quote",
                ctaLink: "/en/cere-oferta",
              },
            },
          },
          {
            type: "cta",
            order: 1,
            content: {
              ro: {
                title: "Pregătit să Discutăm Evenimentul Tău?",
                subtitle:
                  "Completează formularul și primești o ofertă personalizată în 24 de ore.",
                primaryText: "Solicită Ofertă Acum",
                primaryLink: "/cere-oferta",
                secondaryText: "Vezi Prețuri",
                secondaryLink: "/preturi",
              },
              en: {
                title: "Ready to Discuss Your Event?",
                subtitle:
                  "Fill out the form and receive a personalized quote within 24 hours.",
                primaryText: "Request Quote Now",
                primaryLink: "/en/cere-oferta",
                secondaryText: "View Pricing",
                secondaryLink: "/en/preturi",
              },
            },
          },
        ],
      },
      {
        slug: "industrii",
        title: {
          ro: "Industrii și Tipuri de Evenimente",
          en: "Industries & Event Types",
        },
        blocks: [
          {
            type: "hero",
            order: 0,
            content: {
              ro: {
                title: "Industrii și Tipuri de Evenimente",
                subtitle:
                  "Experiență în toate tipurile de evenimente - de la festivaluri majore la conferințe corporate.",
                backgroundImage: "",
                ctaText: "Solicită Ofertă",
                ctaLink: "/cere-oferta",
              },
              en: {
                title: "Industries & Event Types",
                subtitle:
                  "Experience across all event types - from major festivals to corporate conferences.",
                backgroundImage: "",
                ctaText: "Request Quote",
                ctaLink: "/en/cere-oferta",
              },
            },
          },
          {
            type: "features",
            order: 1,
            content: {
              ro: {
                title: "Sectoare și Evenimente Deservite",
                subtitle: "Peste 10 ani de experiență în diverse industrii",
                features: [
                  {
                    icon: "Music",
                    title: "Festivaluri Muzicale",
                    description:
                      "De la festivaluri boutique la mega-evenimente cu 50.000+ participanți. Experiență la Electric Castle, Untold, și alte festivaluri majore.",
                  },
                  {
                    icon: "Users",
                    title: "Conferințe & Corporate",
                    description:
                      "Conferințe internaționale, summits, events corporate. Soluții discrete și premium pentru evenimente business.",
                  },
                  {
                    icon: "Building2",
                    title: "Evenimente Indoor",
                    description:
                      "Săli de sport, arene, centre de convenții. Infrastructură adaptată spațiilor închise cu trafic intens.",
                  },
                  {
                    icon: "Trophy",
                    title: "Evenimente Sportive",
                    description:
                      "Competiții, maratoane, turnee. Soluții rapide pentru volume mari de participanți în timp scurt.",
                  },
                  {
                    icon: "Presentation",
                    title: "Expoziții & Târguri",
                    description:
                      "Târguri comerciale, expoziții de artă, lansări de produse. Garderobă cu supraveghere și securitate sporită.",
                  },
                  {
                    icon: "PartyPopper",
                    title: "Evenimente Private",
                    description:
                      "Nunți premium, petreceri private, gale. Serviciu personalizat și atenție la detalii.",
                  },
                ],
              },
              en: {
                title: "Sectors & Events Served",
                subtitle:
                  "Over 10 years of experience across various industries",
                features: [
                  {
                    icon: "Music",
                    title: "Music Festivals",
                    description:
                      "From boutique festivals to mega-events with 50,000+ attendees. Experience at Electric Castle, Untold, and other major festivals.",
                  },
                  {
                    icon: "Users",
                    title: "Conferences & Corporate",
                    description:
                      "International conferences, summits, corporate events. Discrete and premium solutions for business events.",
                  },
                  {
                    icon: "Building2",
                    title: "Indoor Events",
                    description:
                      "Sports halls, arenas, convention centers. Infrastructure adapted to enclosed spaces with heavy traffic.",
                  },
                  {
                    icon: "Trophy",
                    title: "Sports Events",
                    description:
                      "Competitions, marathons, tournaments. Fast solutions for large volumes of participants in short time.",
                  },
                  {
                    icon: "Presentation",
                    title: "Exhibitions & Fairs",
                    description:
                      "Trade fairs, art exhibitions, product launches. Cloakroom with monitoring and enhanced security.",
                  },
                  {
                    icon: "PartyPopper",
                    title: "Private Events",
                    description:
                      "Premium weddings, private parties, galas. Personalized service and attention to detail.",
                  },
                ],
              },
            },
          },
          {
            type: "cta",
            order: 2,
            content: {
              ro: {
                title: "Pregătit să Discutăm Evenimentul Tău?",
                subtitle:
                  "Completează formularul și primești o ofertă personalizată în 24 de ore.",
                primaryText: "Solicită Ofertă Acum",
                primaryLink: "/cere-oferta",
                secondaryText: "Vezi Servicii",
                secondaryLink: "/servicii",
              },
              en: {
                title: "Ready to Discuss Your Event?",
                subtitle:
                  "Fill out the form and receive a personalized quote within 24 hours.",
                primaryText: "Request Quote Now",
                primaryLink: "/en/cere-oferta",
                secondaryText: "View Services",
                secondaryLink: "/en/servicii",
              },
            },
          },
        ],
      },
      {
        slug: "preturi",
        title: { ro: "Prețuri și Pachete", en: "Pricing & Packages" },
        blocks: [
          {
            type: "hero",
            order: 0,
            content: {
              ro: {
                title: "Prețuri și Pachete",
                subtitle:
                  "Transparent, flexibil, competitiv. Prețuri adaptate la dimensiunea și complexitatea evenimentului tău.",
                backgroundImage: "",
                ctaText: "Solicită Ofertă Personalizată",
                ctaLink: "/cere-oferta",
              },
              en: {
                title: "Pricing & Packages",
                subtitle:
                  "Transparent, flexible, competitive. Prices adapted to your event size and complexity.",
                backgroundImage: "",
                ctaText: "Request Custom Quote",
                ctaLink: "/en/cere-oferta",
              },
            },
          },
          {
            type: "features",
            order: 1,
            content: {
              ro: {
                title: "Factori care Influențează Prețul",
                subtitle:
                  "Fiecare eveniment este unic. Iată ce luăm în considerare:",
                features: [
                  {
                    icon: "Users",
                    title: "Număr de Participanți",
                    description:
                      "De la 100 la 12.000+ participanți. Infrastructura și echipa se scalează proporțional.",
                  },
                  {
                    icon: "Calendar",
                    title: "Durată și Program",
                    description:
                      "De la evenimente de o zi la festivaluri de 3-4 zile. Schimburi multiple sau non-stop.",
                  },
                  {
                    icon: "MapPin",
                    title: "Locație și Acces",
                    description:
                      "Indoor vs outdoor, accesibilitate, necesități de transport și logistică.",
                  },
                  {
                    icon: "Package",
                    title: "Servicii Adiționale",
                    description:
                      "Gardă de corp, asigurare bunuri, sistem ticketing digital, servicii VIP.",
                  },
                  {
                    icon: "Clock",
                    title: "Cerințe de Timp",
                    description:
                      "Urgențe sub 7 zile pot include costuri de mobilizare rapidă.",
                  },
                  {
                    icon: "Shield",
                    title: "Nivel de Securitate",
                    description:
                      "De la standard la premium cu supraveghere video și personal de securitate.",
                  },
                ],
              },
              en: {
                title: "Factors Affecting Price",
                subtitle: "Every event is unique. Here's what we consider:",
                features: [
                  {
                    icon: "Users",
                    title: "Number of Attendees",
                    description:
                      "From 100 to 12,000+ attendees. Infrastructure and team scale proportionally.",
                  },
                  {
                    icon: "Calendar",
                    title: "Duration & Schedule",
                    description:
                      "From one-day events to 3-4 day festivals. Multiple shifts or non-stop.",
                  },
                  {
                    icon: "MapPin",
                    title: "Location & Access",
                    description:
                      "Indoor vs outdoor, accessibility, transport and logistics needs.",
                  },
                  {
                    icon: "Package",
                    title: "Additional Services",
                    description:
                      "Security guards, goods insurance, digital ticketing system, VIP services.",
                  },
                  {
                    icon: "Clock",
                    title: "Time Requirements",
                    description:
                      "Emergencies under 7 days may include rapid mobilization costs.",
                  },
                  {
                    icon: "Shield",
                    title: "Security Level",
                    description:
                      "From standard to premium with video surveillance and security personnel.",
                  },
                ],
              },
            },
          },
          {
            type: "cta",
            order: 2,
            content: {
              ro: {
                title: "Solicită o Ofertă Personalizată",
                subtitle:
                  "Completează formularul cu detaliile evenimentului și primești o estimare exactă în maxim 24 de ore.",
                primaryText: "Completează Formularul",
                primaryLink: "/cere-oferta",
                secondaryText: "Contact Direct",
                secondaryLink: "/contact",
              },
              en: {
                title: "Request a Custom Quote",
                subtitle:
                  "Fill out the form with event details and receive an exact estimate within 24 hours.",
                primaryText: "Fill Out Form",
                primaryLink: "/en/cere-oferta",
                secondaryText: "Direct Contact",
                secondaryLink: "/en/contact",
              },
            },
          },
        ],
      },
      {
        slug: "despre",
        title: { ro: "Despre Garderobă Pro", en: "About Garderobă Pro" },
        blocks: [
          {
            type: "hero",
            order: 0,
            content: {
              ro: {
                title: "Despre Garderobă Pro",
                subtitle:
                  "Pasiune pentru evenimente și atenție la detalii. De peste 10 ani aducem ordine și siguranță la cele mai mari evenimente din România.",
                backgroundImage: "",
                ctaText: "Solicită Ofertă",
                ctaLink: "/cere-oferta",
              },
              en: {
                title: "About Garderobă Pro",
                subtitle:
                  "Passion for events and attention to detail. For over 10 years bringing order and safety to Romania's largest events.",
                backgroundImage: "",
                ctaText: "Request Quote",
                ctaLink: "/en/cere-oferta",
              },
            },
          },
          {
            type: "features",
            order: 1,
            content: {
              ro: {
                title: "Valorile Noastre",
                subtitle: "Principiile care ne ghidează fiecare decizie",
                features: [
                  {
                    icon: "Target",
                    title: "Profesionalism",
                    description:
                      "Echipă antrenată, procese testate, echipamente de ultimă generație. Zero compromisuri la calitate.",
                  },
                  {
                    icon: "Users",
                    title: "Orientare către Client",
                    description:
                      "Fiecare eveniment este unic. Ne adaptăm cerințelor tale, nu invers.",
                  },
                  {
                    icon: "Award",
                    title: "Excelență",
                    description:
                      "Peste 500 de evenimente fără incidente majore. Track record impecabil în industrie.",
                  },
                  {
                    icon: "Heart",
                    title: "Pasiune",
                    description:
                      "Nu doar facem o treabă - construim experiențe memorabile pentru participanți.",
                  },
                  {
                    icon: "Shield",
                    title: "Securitate",
                    description:
                      "Protocoale stricte, asigurare completă, personal verificat. Bunurile clienților sunt prioritatea #1.",
                  },
                ],
              },
              en: {
                title: "Our Values",
                subtitle: "The principles guiding every decision we make",
                features: [
                  {
                    icon: "Target",
                    title: "Professionalism",
                    description:
                      "Trained team, tested processes, state-of-the-art equipment. Zero compromises on quality.",
                  },
                  {
                    icon: "Users",
                    title: "Client Focus",
                    description:
                      "Every event is unique. We adapt to your requirements, not vice versa.",
                  },
                  {
                    icon: "Award",
                    title: "Excellence",
                    description:
                      "Over 500 events without major incidents. Impeccable track record in the industry.",
                  },
                  {
                    icon: "Heart",
                    title: "Passion",
                    description:
                      "We don't just do a job - we build memorable experiences for attendees.",
                  },
                  {
                    icon: "Shield",
                    title: "Security",
                    description:
                      "Strict protocols, full insurance, verified personnel. Client belongings are priority #1.",
                  },
                ],
              },
            },
          },
          {
            type: "cta",
            order: 2,
            content: {
              ro: {
                title: "Hai să Colaborăm",
                subtitle:
                  "Suntem aici să transformăm logistica evenimentului tău într-o experiență fără griji.",
                primaryText: "Solicită Ofertă",
                primaryLink: "/cere-oferta",
                secondaryText: "Vezi Portofoliu",
                secondaryLink: "/portfolio",
              },
              en: {
                title: "Let's Collaborate",
                subtitle:
                  "We're here to transform your event logistics into a worry-free experience.",
                primaryText: "Request Quote",
                primaryLink: "/en/cere-oferta",
                secondaryText: "View Portfolio",
                secondaryLink: "/en/portfolio",
              },
            },
          },
        ],
      },
      {
        slug: "parteneri",
        title: { ro: "Partenerii Noștri", en: "Our Partners" },
        blocks: [
          {
            type: "hero",
            order: 0,
            content: {
              ro: {
                title: "Partenerii Noștri",
                subtitle:
                  "Peste 10 ani de colaborări de succes cu cele mai mari evenimente și branduri din România.",
                backgroundImage: "",
                ctaText: "Devino Partener",
                ctaLink: "/contact",
              },
              en: {
                title: "Our Partners",
                subtitle:
                  "Over 10 years of successful collaborations with Romania's largest events and brands.",
                backgroundImage: "",
                ctaText: "Become a Partner",
                ctaLink: "/en/contact",
              },
            },
          },
          {
            type: "cta",
            order: 1,
            content: {
              ro: {
                title: "Vrei să Colaborăm?",
                subtitle:
                  "Căutăm parteneriate pe termen lung cu organizatori de evenimente și venue-uri.",
                primaryText: "Contactează-ne",
                primaryLink: "/contact",
                secondaryText: "Solicită Ofertă",
                secondaryLink: "/cere-oferta",
              },
              en: {
                title: "Want to Collaborate?",
                subtitle:
                  "We seek long-term partnerships with event organizers and venues.",
                primaryText: "Contact Us",
                primaryLink: "/en/contact",
                secondaryText: "Request Quote",
                secondaryLink: "/en/cere-oferta",
              },
            },
          },
        ],
      },
      {
        slug: "shop",
        title: {
          ro: "Magazin - Echipamente Garderobă",
          en: "Shop - Cloakroom Equipment",
        },
        blocks: [
          {
            type: "hero",
            order: 0,
            content: {
              ro: {
                title: "Magazin - Echipamente Garderobă",
                subtitle:
                  "Echipamente profesionale pentru garderobă - stanzi, umerașe, rafturi, sisteme complete. Calitate premium, prețuri competitive.",
                backgroundImage: "",
                ctaText: "Vezi Produse",
                ctaLink: "/shop",
              },
              en: {
                title: "Shop - Cloakroom Equipment",
                subtitle:
                  "Professional cloakroom equipment - tags, hangers, racks, complete systems. Premium quality, competitive prices.",
                backgroundImage: "",
                ctaText: "View Products",
                ctaLink: "/en/shop",
              },
            },
          },
        ],
      },
    ];

    console.log(
      `\n🔄 Will migrate ${pagesToMigrate.length} pages to Site Builder:\n`,
    );
    pagesToMigrate.forEach((p) => console.log(`  - ${p.slug}`));

    // Auto-confirm for piped input
    const isInteractive = process.stdin.isTTY;
    let answer = "yes";

    if (isInteractive) {
      answer = await question("\n⚠️  Continue with migration? (yes/no): ");
    } else {
      console.log("\n⚠️  Auto-confirming migration (non-interactive mode)");
    }

    if (answer.toLowerCase() !== "yes") {
      console.log("❌ Migration cancelled");
      rl.close();
      await client.close();
      return;
    }

    let created = 0;
    let updated = 0;

    for (const pageData of pagesToMigrate) {
      const existing = await pages.findOne({ slug: pageData.slug });

      if (existing) {
        // Update existing page
        await pages.updateOne(
          { slug: pageData.slug },
          {
            $set: {
              title: pageData.title,
              blocks: pageData.blocks,
              status: "published",
              publishedAt: new Date(),
              updatedAt: new Date(),
            },
          },
        );
        console.log(`✅ Updated: ${pageData.slug}`);
        updated++;
      } else {
        // Create new page
        await pages.insertOne({
          slug: pageData.slug,
          title: pageData.title,
          description: { ro: "", en: "" },
          blocks: pageData.blocks,
          metaTitle: pageData.title,
          metaDescription: { ro: "", en: "" },
          status: "published",
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Created: ${pageData.slug}`);
        created++;
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Created: ${created} pages`);
    console.log(`   Updated: ${updated} pages`);
    console.log(
      `\nNext step: Update page.tsx files to fetch from Site Builder`,
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    rl.close();
    await client.close();
  }
}

migrate();
