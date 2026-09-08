import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Loader2, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { fetchProductByHandle, fetchProducts, formatMoney } from "@/lib/shopify";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => {
    const name = params.handle
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} — UrbanCart` },
        {
          name: "description",
          content: `Buy ${name} at UrbanCart. Priced in rand with nationwide delivery and free shipping over R500.`,
        },
        { property: "og:title", content: `${name} — UrbanCart` },
        {
          property: "og:description",
          content: `Buy ${name} at UrbanCart — rand pricing, delivered across South Africa.`,
        },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);
  const wishlist = useWishlistStore();
  const [activeImage, setActiveImage] = useState(0);
  const [variantId, setVariantId] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  const { data: related } = useQuery({
    queryKey: ["products", "related"],
    queryFn: () => fetchProducts(12),
  });

  const node = product?.node;
  const variants = useMemo(() => node?.variants.edges.map((e) => e.node) ?? [], [node]);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!node) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-24 text-center sm:px-8">
        <h1 className="text-2xl uppercase">Product not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This item may have sold out or been removed.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/shop" search={{ q: undefined, category: undefined, sort: undefined }}>
            Back to shop
          </Link>
        </Button>
      </div>
    );
  }

  const images = node.images.edges.map((e) => e.node);
  const price = variant?.price ?? node.priceRange.minVariantPrice;
  const inWishlist = wishlist.items.some((i) => i.handle === node.handle);

  const add = async (goToCheckout: boolean) => {
    if (!variant) return;
    await addItem({
      product: product!,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    if (goToCheckout) {
      const url = useCartStore.getState().checkoutUrl;
      if (url) window.open(`${url}${url.includes("?") ? "&" : "?"}channel=online_store`, "_blank");
    } else {
      toast.success(`${node.title} added to cart`);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <nav className="label-mono mb-6 text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        /{" "}
        <Link
          to="/shop"
          search={{ q: undefined, category: undefined, sort: undefined }}
          className="hover:text-foreground"
        >
          Shop
        </Link>{" "}
        / <span className="text-foreground">{node.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            {images[activeImage] && (
              <img
                src={images[activeImage].url}
                alt={images[activeImage].altText ?? node.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                    i === activeImage ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl uppercase sm:text-4xl">{node.title}</h1>
          <p className="mt-3 text-2xl font-semibold">
            {formatMoney(price.amount, price.currencyCode)}
          </p>
          <p className="mt-4 max-w-[60ch] text-sm text-muted-foreground">{node.description}</p>

          {variants.length > 1 && (
            <div className="mt-6">
              <p className="label-mono mb-2 text-muted-foreground">Choose an option</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    disabled={!v.availableForSale}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-40 ${
                      v.id === variant?.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="rounded-full"
              disabled={cartLoading || !variant?.availableForSale}
              onClick={() => add(false)}
            >
              {cartLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add to cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full"
              disabled={cartLoading || !variant?.availableForSale}
              onClick={() => add(true)}
            >
              Buy now
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full"
              aria-label="Save to wishlist"
              onClick={() => {
                wishlist.toggle({
                  handle: node.handle,
                  title: node.title,
                  image: images[0]?.url ?? null,
                  price,
                });
                toast.success(inWishlist ? "Removed from wishlist" : "Saved to wishlist");
              }}
            >
              <Heart className={`h-5 w-5 ${inWishlist ? "fill-accent text-accent" : ""}`} />
            </Button>
          </div>

          <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-accent" /> Free delivery over R500 · 2–4 working days
              nationwide
            </li>
            <li className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-accent" /> 30-day returns on unused items
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-accent" /> Secure checkout, all prices in ZAR
              incl. VAT
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl uppercase">You may also like</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(related ?? [])
            .filter((p) => p.node.handle !== handle)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
