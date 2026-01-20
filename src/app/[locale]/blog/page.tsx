import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// This would normally fetch from Supabase
const blogPosts = [
  {
    id: 1,
    slug: "ghid-organizare-garderoba-festival",
    titleRo: "Ghid Complet: Cum să Organizezi Garderoba la un Festival",
    titleEn: "Complete Guide: How to Organize Cloakroom at a Festival",
    excerptRo:
      "De la dimensionarea spațiului la training-ul staff-ului, tot ce trebuie să știi pentru o garderobă eficientă.",
    excerptEn:
      "From space sizing to staff training, everything you need to know for an efficient cloakroom.",
    imageUrl: "/placeholder-blog.jpg",
    date: "2026-01-15",
    readTime: "8 min",
    category: "Ghiduri",
  },
  {
    id: 2,
    slug: "top-5-greseli-garderoba-evenimente",
    titleRo: "Top 5 Greșeli în Organizarea Garderoabei la Evenimente",
    titleEn: "Top 5 Mistakes in Event Cloakroom Organization",
    excerptRo:
      "Învață din experiența noastră și evită aceste greșeli comune care pot ruina experiența participanților.",
    excerptEn:
      "Learn from our experience and avoid these common mistakes that can ruin attendee experience.",
    imageUrl: "/placeholder-blog.jpg",
    date: "2026-01-10",
    readTime: "6 min",
    category: "Tips & Tricks",
  },
  {
    id: 3,
    slug: "tehnologia-in-garderoba-moderna",
    titleRo: "Tehnologia în Garderoba Modernă: Token-uri vs QR vs RFID",
    titleEn: "Technology in Modern Cloakroom: Tokens vs QR vs RFID",
    excerptRo:
      "Comparație detaliată între diferitele sisteme de identificare pentru garderobă.",
    excerptEn:
      "Detailed comparison between different identification systems for cloakroom.",
    imageUrl: "/placeholder-blog.jpg",
    date: "2026-01-05",
    readTime: "10 min",
    category: "Tehnologie",
  },
];

export default function BlogPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero
        title={locale === "ro" ? "Blog & Resurse" : "Blog & Resources"}
        subtitle={
          locale === "ro"
            ? "Ghiduri, sfaturi și insights din industria evenimentelor"
            : "Guides, tips and insights from the events industry"
        }
        variant="page"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured Post */}
          {blogPosts[0] && (
            <Card className="mb-12 overflow-hidden lg:flex">
              <div className="lg:w-1/2">
                <div className="h-64 bg-muted lg:h-full" />
              </div>
              <div className="lg:w-1/2">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                      {blogPosts[0].category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(blogPosts[0].date).toLocaleDateString(
                        locale === "ro" ? "ro-RO" : "en-US",
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {blogPosts[0].readTime}
                    </span>
                  </div>
                  <CardTitle className="text-3xl">
                    {locale === "ro"
                      ? blogPosts[0].titleRo
                      : blogPosts[0].titleEn}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-base">
                    {locale === "ro"
                      ? blogPosts[0].excerptRo
                      : blogPosts[0].excerptEn}
                  </CardDescription>
                  <Link href={`/${locale}/blog/${blogPosts[0].slug}`}>
                    <Button>
                      {locale === "ro" ? "Citește Articolul" : "Read Article"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          )}

          {/* Blog Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="flex flex-col overflow-hidden">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">
                    {locale === "ro" ? post.titleRo : post.titleEn}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="mb-4 line-clamp-3">
                    {locale === "ro" ? post.excerptRo : post.excerptEn}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString(
                        locale === "ro" ? "ro-RO" : "en-US",
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
                <div className="border-t p-4">
                  <Link href={`/${locale}/blog/${post.slug}`}>
                    <Button variant="ghost" className="w-full">
                      {locale === "ro" ? "Citește mai mult" : "Read more"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-12 flex justify-center">
            <Button variant="outline">
              {locale === "ro" ? "Încarcă mai multe" : "Load more"}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
