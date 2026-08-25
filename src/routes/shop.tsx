import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop all products — UrbanCart" },
      {
        name: "description",
        content:
          "Browse the full UrbanCart catalogue: apparel, footwear and accessories priced in South African rands with secure checkout.",
      },
      { property: "og:title", content: "Shop all products — UrbanCart" },
      {
        property: "og:description",
        content: "The full UrbanCart catalogue, priced in rands with nationwide delivery.",
      },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts(50),
  });

  return (
    <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12">
      <p className="label-mono text-accent">Catalogue</p>
      <h1 className="mt-3 text-3xl sm:text-5xl uppercase">All products</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {isLoading ? "Loading stock…" : `${products.length} item${products.length === 1 ? "" : "s"} · all prices in ZAR`}
      </p>

      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-muted" />
                <div className="h-4 bg-muted mt-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-semibold">No products found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a product to your store and it will show up here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10">
            {products.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
