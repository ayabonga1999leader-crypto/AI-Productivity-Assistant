import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-12 grid gap-8 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-xl">
            URBANCART<span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-sm text-primary-foreground/60 max-w-[34ch]">
            Everyday essentials for South African streets. Shipped nationwide, priced in rands.
          </p>
        </div>
        <div>
          <p className="label-mono text-primary-foreground/50 mb-3">Shop</p>
          <div className="space-y-2 text-sm">
            <Link to="/shop" className="block hover:text-accent transition-colors">
              All products
            </Link>
            <Link to="/delivery" className="block hover:text-accent transition-colors">
              Delivery &amp; returns
            </Link>
          </div>
        </div>
        <div>
          <p className="label-mono text-primary-foreground/50 mb-3">Payments</p>
          <p className="text-sm text-primary-foreground/60">
            Secure Shopify checkout. Cards, EFT and Instant EFT supported at checkout.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-5 flex flex-wrap gap-2 justify-between label-mono text-primary-foreground/50">
          <span>© {new Date().getFullYear()} UrbanCart</span>
          <span>Made in South Africa</span>
        </div>
      </div>
    </footer>
  );
}
