import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

// This would normally fetch from Supabase based on slug
const getPostBySlug = (slug: string) => {
  const posts: Record<string, any> = {
    "ghid-organizare-garderoba-festival": {
      titleRo: "Ghid Complet: Cum să Organizezi Garderoba la un Festival",
      titleEn: "Complete Guide: How to Organize Cloakroom at a Festival",
      date: "2026-01-15",
      readTime: "8 min",
      category: "Ghiduri",
      contentRo: `
        <p>Organizarea unei garderobe eficiente la un festival este esențială pentru experiența participanților. În acest ghid complet, vom acoperi tot ce trebuie să știi.</p>
        
        <h2>1. Dimensionarea Spațiului</h2>
        <p>Primul pas este să calculezi corect spațiul necesar. Regula de bază: 1 mp pentru fiecare 50 de participanți estimați să folosească garderoba.</p>
        
        <h2>2. Alegerea Echipamentelor</h2>
        <p>Ai nevoie de rack-uri mobile, token-uri numerotate, ghișee pentru personal, și sistem de bariere pentru organizarea fluxului.</p>
        
        <h2>3. Training-ul Staff-ului</h2>
        <p>Personalul trebuie instruit în: proceduri de primire/predare, sistem de token-uri, gestionare situații speciale, și comunicare cu participanții.</p>
        
        <h2>4. Flux și Organizare</h2>
        <p>Creează zone separate pentru primire și predare. Folosește semnalistică clară și bariere pentru ghidarea participanților.</p>
        
        <h2>Concluzie</h2>
        <p>O garderobă bine organizată face diferența între un festival reușit și unul plin de reclamații. Investește timp în planificare și vei avea participanți mulțumiți.</p>
      `,
      contentEn: `
        <p>Organizing an efficient cloakroom at a festival is essential for attendee experience. In this complete guide, we'll cover everything you need to know.</p>
        
        <h2>1. Space Sizing</h2>
        <p>The first step is to correctly calculate the required space. Basic rule: 1 sqm for every 50 attendees estimated to use the cloakroom.</p>
        
        <h2>2. Equipment Selection</h2>
        <p>You need mobile racks, numbered tokens, staff counters, and barrier systems for flow organization.</p>
        
        <h2>3. Staff Training</h2>
        <p>Staff must be trained in: check-in/check-out procedures, token system, special situation management, and attendee communication.</p>
        
        <h2>4. Flow and Organization</h2>
        <p>Create separate zones for check-in and pick-up. Use clear signage and barriers to guide attendees.</p>
        
        <h2>Conclusion</h2>
        <p>A well-organized cloakroom makes the difference between a successful festival and one full of complaints. Invest time in planning and you'll have satisfied attendees.</p>
      `,
    },
  };

  return posts[slug] || null;
};

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  unstable_setRequestLocale(locale);

  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link href={`/${locale}/blog`}>
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === "ro" ? "Înapoi la Blog" : "Back to Blog"}
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {post.category}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            {locale === "ro" ? post.titleRo : post.titleEn}
          </h1>

          <div className="mb-8 flex items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString(
                locale === "ro" ? "ro-RO" : "en-US",
                { year: "numeric", month: "long", day: "numeric" },
              )}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Featured Image Placeholder */}
          <div className="mb-12 h-96 rounded-lg bg-muted" />

          <Separator className="mb-12" />

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{
              __html: locale === "ro" ? post.contentRo : post.contentEn,
            }}
          />

          <Separator className="my-12" />

          {/* Author / CTA */}
          <div className="rounded-lg bg-muted p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold">
              {locale === "ro"
                ? "Ai nevoie de ajutor pentru evenimentul tău?"
                : "Need help with your event?"}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {locale === "ro"
                ? "Contactează-ne pentru o consultație gratuită"
                : "Contact us for a free consultation"}
            </p>
            <Link href={`/${locale}/contact`}>
              <Button size="lg">
                {locale === "ro" ? "Contactează-ne" : "Contact Us"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
