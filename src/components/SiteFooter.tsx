import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/categories";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-4">
        <div>
          <p className="font-display text-lg">
            URBANCART<span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-[30ch] text-sm text-muted-foreground">
            South Africa's marketplace for fashion, tech, beauty and home. Priced in rand,
            delivered nationwide.
          </p>
        </div>

        <div>
          <p className="label-mono mb-3 text-muted-foreground">Shop</p>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/shop"
                  search={{ category: c.name, q: undefined, sort: undefined }}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-mono mb-3 text-muted-foreground">Help</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/delivery"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Delivery & returns
              </Link>
            </li>
            <li>
              <Link
                to="/wishlist"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                My account
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label-mono mb-3 text-muted-foreground">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>hello@urbancart.co.za</li>
            <li>011 234 5678</li>
            <li>Mon–Fri, 08:00–17:00 SAST</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:px-8">
          <p>© {new Date().getFullYear()} UrbanCart. All prices in ZAR (incl. VAT).</p>
          <p>Free delivery on orders over R500</p>
        </div>
      </div>
    </footer>
  );
}
