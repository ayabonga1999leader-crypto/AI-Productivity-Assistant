import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanCart — Street-ready essentials, shipped across South Africa" },
      {
        name: "description",
        content:
          "UrbanCart is a South African online store for everyday street essentials. Shop in rands with secure checkout and nationwide delivery.",
      },
      { property: "og:title", content: "UrbanCart — Street-ready essentials in South Africa" },
      {
        property: "og:description",
        content:
          "Shop apparel, footwear and accessories in ZAR. Secure checkout, nationwide delivery.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts(8),
  });

  return (
    <>
      <section className="relative">
        <div className="relative aspect-[16/10] sm:aspect-[21/9] overflow-hidden bg-muted">
          <img
            src={heroImage}
            alt="Model in streetwear against a sunlit concrete wall"
            width={1600}
            height={1104}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-[1400px] w-full px-5 sm:px-8">
            <div className="max-w-xl">
              <p className="label-mono text-accent">Now shipping nationwide</p>
              <h1 className="mt-4 text-4xl sm:text-6xl lg:text-7xl leading-[0.9] uppercase">
                Wear the street
              </h1>
              <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-md">
                Everyday essentials built for South African cities. Real rands, real stock, secure
                Shopify checkout.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none">
                  <Link to="/shop">
                    Shop all products <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none">
                  <Link to="/delivery">Delivery &amp; returns</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-5 grid gap-4 sm:grid-cols-3 text-sm">
          <div className="flex items-center gap-3">
            <Truck className="h-4 w-4 text-accent" />
            <span>Nationwide courier delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span>Secure checkout in ZAR</span>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCcw className="h-4 w-4 text-accent" />
            <span>30-day returns</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl uppercase">New arrivals</h2>
          <Link to="/shop" className="label-mono text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted" />
                <div className="h-4 bg-muted mt-3 w-2/3" />
                <div className="h-4 bg-muted mt-2 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <p className="font-semibold">No products found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your store is live but empty — add your first product and it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
