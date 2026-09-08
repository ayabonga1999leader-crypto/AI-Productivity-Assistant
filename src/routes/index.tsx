import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/categories";
import { fetchProducts } from "@/lib/shopify";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanCart — Online shopping in South Africa" },
      {
        name: "description",
        content:
          "Shop fashion, electronics, beauty, home and fitness at UrbanCart. Rand pricing, nationwide delivery and free shipping on orders over R500.",
      },
      { property: "og:title", content: "UrbanCart — Online shopping in South Africa" },
      {
        property: "og:description",
        content: "Fashion, tech, beauty and home essentials in ZAR, delivered across South Africa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "trending"],
    queryFn: () => fetchProducts(8),
  });

  return (
    <>
      <section className="relative">
        <div className="relative aspect-[16/11] sm:aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={hero}
            alt="Shopper carrying UrbanCart bags on a sunlit city street"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            <div className="max-w-xl">
              <p className="label-mono text-accent">New season · Spring 2026</p>
              <h1 className="mt-4 text-4xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl">
                Everything you need, in one cart
              </h1>
              <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
                Fashion, tech, beauty and home — priced in rand and delivered anywhere in South
                Africa.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/shop" search={{ q: undefined, category: undefined, sort: undefined }}>
                    Shop all products <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <Link to="/shop" search={{ category: "Fashion", q: undefined, sort: undefined }}>
                    Shop fashion
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-[1400px] gap-4 px-5 py-5 text-sm sm:grid-cols-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Truck className="h-4 w-4 text-accent" />
            <span>Free delivery on orders over R500</span>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="h-4 w-4 text-accent" />
            <span>30-day easy returns</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Secure checkout, ZAR pricing</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl uppercase sm:text-3xl">Shop by category</h2>
          <p className="label-mono text-muted-foreground">{CATEGORIES.length} departments</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.name, q: undefined, sort: undefined }}
              className="group relative overflow-hidden rounded-2xl bg-muted"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
              <div className="absolute bottom-0 p-5 text-background">
                <p className="text-lg font-semibold">{c.name}</p>
                <p className="text-sm opacity-80">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl uppercase sm:text-3xl">Trending now</h2>
            <Link
              to="/shop"
              search={{ q: undefined, category: undefined, sort: undefined }}
              className="label-mono text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(data ?? []).slice(0, 8).map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
