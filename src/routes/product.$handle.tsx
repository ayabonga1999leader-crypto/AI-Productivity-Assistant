import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, formatMoney } from "@/lib/shopify";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => {
    const name = params.handle.replace(/-/g, " ");
    return {
      meta: [
        { title: `${name} — UrbanCart` },
        {
          name: "description",
          content: `Buy ${name} at UrbanCart. Priced in South African rands with secure checkout and nationwide delivery.`,
        },
        { property: "og:title", content: `${name} — UrbanCart` },
        {
          property: "og:description",
          content: `Buy ${name} at UrbanCart, priced in rands with nationwide delivery.`,
        },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
  });

  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);
  const [variantId, setVariantId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-20 grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-24 text-center">
        <h1 className="text-2xl uppercase">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This item may have been removed from the store.
        </p>
        <Button asChild className="mt-6 rounded-none">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const node = product.node;
  const images = node.images.edges;
  const variants = node.variants.edges.map((v) => v.node);
  const selected = variants.find((v) => v.id === variantId) ?? variants[0];

  const handleAddToCart = async () => {
    if (!selected) return;
    await addItem({
      product,
      variantId: selected.id,
      variantTitle: selected.title,
      price: selected.price,
      quantity: 1,
      selectedOptions: selected.selectedOptions || [],
    });
    toast.success(`${node.title} added to cart`, { position: "top-center" });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-5 sm:px-8 py-10">
      <Link
        to="/shop"
        className="inline-flex items-center label-mono text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3 mr-2" /> Back to shop
      </Link>

      <div className="mt-6 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="aspect-[4/5] bg-muted overflow-hidden">
            {images[activeImage] ? (
              <img
                src={images[activeImage].node.url}
                alt={images[activeImage].node.altText ?? node.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center label-mono text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <button
                  key={img.node.url}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "size-16 overflow-hidden border",
                    i === activeImage ? "border-accent" : "border-border",
                  )}
                >
                  <img
                    src={img.node.url}
                    alt={img.node.altText ?? node.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:pt-4">
          <h1 className="text-3xl sm:text-4xl uppercase">{node.title}</h1>
          <p className="mt-3 font-mono text-2xl">
            {selected
              ? formatMoney(selected.price.amount, selected.price.currencyCode)
              : formatMoney(
                  node.priceRange.minVariantPrice.amount,
                  node.priceRange.minVariantPrice.currencyCode,
                )}
          </p>
          {node.description && (
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-prose">
              {node.description}
            </p>
          )}

          {variants.length > 1 && (
            <div className="mt-8">
              <p className="label-mono text-muted-foreground mb-3">Options</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    disabled={!v.availableForSale}
                    onClick={() => setVariantId(v.id)}
                    className={cn(
                      "px-4 py-2 text-[13px] border transition-colors",
                      v.id === selected?.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-foreground",
                      !v.availableForSale && "opacity-40 line-through cursor-not-allowed",
                    )}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={cartLoading || !selected || !selected.availableForSale}
            size="lg"
            className="mt-8 w-full sm:w-auto rounded-none"
          >
            {cartLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selected?.availableForSale ? (
              "Add to cart"
            ) : (
              "Sold out"
            )}
          </Button>

          <p className="mt-6 label-mono text-muted-foreground">
            Nationwide delivery · 30-day returns · Priced in ZAR
          </p>
        </div>
      </div>
    </section>
  );
}
