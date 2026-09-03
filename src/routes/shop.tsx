import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { fetchProducts, formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Sort = "featured" | "price-asc" | "price-desc" | "title";

interface ShopSearch {
  q?: string | undefined;
  category?: string | undefined;
  sort?: Sort | undefined;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const rawSort = search["sort"];
    return {
      q: typeof search["q"] === "string" && search["q"] ? (search["q"] as string) : undefined,
      category:
        typeof search["category"] === "string" && search["category"]
          ? (search["category"] as string)
          : undefined,
      sort:
        rawSort === "price-asc" || rawSort === "price-desc" || rawSort === "title"
          ? rawSort
          : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Shop all products — UrbanCart South Africa" },
      {
        name: "description",
        content:
          "Browse fashion, electronics, beauty, home and fitness products in ZAR. Filter by category, brand and price with free delivery over R500.",
      },
      { property: "og:title", content: "Shop all products — UrbanCart" },
      {
        property: "og:description",
        content: "Fashion, electronics, beauty and more — priced in rand, delivered nationwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function price(p: ShopifyProduct) {
  return parseFloat(p.node.priceRange.minVariantPrice.amount);
}

function ShopPage() {
  const { q, category, sort } = Route.useSearch();
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", category, q],
    queryFn: () => {
      const parts: string[] = [];
      if (category) parts.push(`product_type:'${category}'`);
      if (q) parts.push(q);
      return fetchProducts(50, parts.length ? parts.join(" AND ") : undefined);
    },
  });

  const products = data ?? [];

  const allBrands = useMemo(
    () => Array.from(new Set(products.map((p) => p.node.title.split(" ")[0]))).sort(),
    [products],
  );
  const ceiling = useMemo(
    () => (products.length ? Math.ceil(Math.max(...products.map(price)) / 100) * 100 : 5000),
    [products],
  );

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      const brandOk = brands.length === 0 || brands.includes(p.node.title.split(" ")[0]);
      const priceOk = maxPrice === null || price(p) <= maxPrice;
      return brandOk && priceOk;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") list = [...list].sort((a, b) => price(b) - price(a));
    if (sort === "title") list = [...list].sort((a, b) => a.node.title.localeCompare(b.node.title));
    return list;
  }, [products, brands, maxPrice, sort]);

  const navigateSearch = (next: Partial<ShopSearch>) => ({
    to: "/shop" as const,
    search: { q, category, sort, ...next },
  });

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <header className="mb-8">
        <p className="label-mono text-accent">{category ?? "All categories"}</p>
        <h1 className="mt-2 text-3xl uppercase sm:text-4xl">
          {q ? `Results for “${q}”` : (category ?? "Shop everything")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Prices in South African rand · Free delivery over R500
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          {...navigateSearch({ category: undefined })}
          className="rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:border-accent"
          activeOptions={{ includeSearch: true }}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            {...navigateSearch({ category: c.name })}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors hover:border-accent ${
              category === c.name ? "border-accent bg-accent text-accent-foreground" : "border-border"
            }`}
          >
            {c.name}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full lg:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
          </Button>
          <Select
            value={sort ?? "featured"}
            onValueChange={(v) => {
              const url = new URL(window.location.href);
              if (v === "featured") url.searchParams.delete("sort");
              else url.searchParams.set("sort", v);
              window.history.replaceState(null, "", url.toString());
              window.location.assign(url.toString());
            }}
          >
            <SelectTrigger className="w-[170px] rounded-full">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="title">Name: A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="space-y-6 rounded-xl border border-border bg-surface p-5">
            <div>
              <p className="label-mono mb-3 text-muted-foreground">Max price</p>
              <Slider
                value={[maxPrice ?? ceiling]}
                max={ceiling}
                min={100}
                step={100}
                onValueChange={([v]) => setMaxPrice(v)}
              />
              <p className="mt-2 font-mono text-sm">up to {formatMoney(maxPrice ?? ceiling)}</p>
            </div>
            <div>
              <p className="label-mono mb-3 text-muted-foreground">Brand</p>
              <div className="space-y-2">
                {allBrands.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={brands.includes(b)}
                      onCheckedChange={(checked) =>
                        setBrands((prev) =>
                          checked ? [...prev, b] : prev.filter((x) => x !== b),
                        )
                      }
                    />
                    {b}
                  </label>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full"
              onClick={() => {
                setBrands([]);
                setMaxPrice(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        </aside>

        <div>
          {isLoading ? (
            <div className="grid place-items-center py-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="py-24 text-center text-sm text-muted-foreground">
              Could not load products. Please refresh.
            </p>
          ) : visible.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((p) => (
                <ProductCard key={p.node.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
