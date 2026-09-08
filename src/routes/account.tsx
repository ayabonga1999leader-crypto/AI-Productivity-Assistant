import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, MapPin, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — UrbanCart" },
      {
        name: "description",
        content: "Track UrbanCart orders, manage delivery addresses and review your saved items.",
      },
      { property: "og:title", content: "My account — UrbanCart" },
      { property: "og:description", content: "Orders, addresses and saved items in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-5 py-14 sm:px-8">
      <p className="label-mono text-accent">Your space</p>
      <h1 className="mt-3 text-3xl uppercase sm:text-4xl">My account</h1>
      <p className="mt-4 max-w-[60ch] text-sm text-muted-foreground">
        Sign-in is coming soon. In the meantime your cart and wishlist are saved on this device.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border p-5">
          <Package className="h-5 w-5 text-accent" />
          <h2 className="mt-3 font-semibold">Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Order history and tracking will appear here once you've checked out.
          </p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <MapPin className="h-5 w-5 text-accent" />
          <h2 className="mt-3 font-semibold">Addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Save home and work addresses across all nine SA provinces.
          </p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <Heart className="h-5 w-5 text-accent" />
          <h2 className="mt-3 font-semibold">Wishlist</h2>
          <p className="mt-1 text-sm text-muted-foreground">Items you've saved for later.</p>
          <Button asChild variant="outline" size="sm" className="mt-3 rounded-full">
            <Link to="/wishlist">View wishlist</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-surface p-5 text-sm text-muted-foreground">
        <User className="h-4 w-4 text-accent" />
        Questions about an order? Email hello@urbancart.co.za or call 011 234 5678.
      </div>
    </div>
  );
}
