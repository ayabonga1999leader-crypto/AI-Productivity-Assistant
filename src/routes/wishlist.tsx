import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatMoney } from "@/lib/shopify";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My wishlist — UrbanCart" },
      {
        name: "description",
        content: "Everything you've saved on UrbanCart, ready to move into your cart when you are.",
      },
      { property: "og:title", content: "My wishlist — UrbanCart" },
      { property: "og:description", content: "Your saved UrbanCart items in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8">
      <p className="label-mono text-accent">Saved items</p>
      <h1 className="mt-3 text-3xl uppercase sm:text-4xl">My wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border py-20 text-center">
          <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Nothing saved yet.</p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/shop" search={{ q: undefined, category: undefined, sort: undefined }}>
              Start shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article key={item.handle} className="group relative">
              <button
                onClick={() => remove(item.handle)}
                aria-label={`Remove ${item.title} from wishlist`}
                className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-2 text-foreground shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
              <Link
                to="/product/$handle"
                params={{ handle: item.handle }}
                className="block aspect-[4/5] overflow-hidden rounded-2xl bg-muted"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </Link>
              <div className="mt-3">
                <Link to="/product/$handle" params={{ handle: item.handle }} className="text-sm font-medium">
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatMoney(item.price.amount, item.price.currencyCode)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
