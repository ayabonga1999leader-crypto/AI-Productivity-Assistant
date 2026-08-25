import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const node = product.node;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges.find((v) => v.node.availableForSale)?.node
    ?? node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(`${node.title} added to cart`, { position: "top-center" });
  };

  return (
    <article className="group flex flex-col">
      <Link
        to="/product/$handle"
        params={{ handle: node.handle }}
        className="block relative aspect-[4/5] overflow-hidden bg-muted"
      >
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? node.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full grid place-items-center label-mono text-muted-foreground">
            No image
          </div>
        )}
        {variant && !variant.availableForSale && (
          <span className="absolute top-2 left-2 label-mono bg-primary text-primary-foreground px-2 py-1">
            Sold out
          </span>
        )}
      </Link>

      <div className="pt-3 flex-1">
        <Link to="/product/$handle" params={{ handle: node.handle }}>
          <h3 className="text-sm font-semibold leading-tight hover:text-accent transition-colors">
            {node.title}
          </h3>
        </Link>
        {node.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{node.description}</p>
        )}
        <p className="mt-2 font-mono text-sm">
          {formatMoney(price.amount, price.currencyCode)}
        </p>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isLoading || !variant || !variant.availableForSale}
        className="mt-3 w-full rounded-none"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to cart"}
      </Button>
    </article>
  );
}
