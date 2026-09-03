import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartDrawer } from "@/components/CartDrawer";
import { CATEGORIES } from "@/lib/categories";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/shop", search: { q: term || undefined, category: undefined, sort: undefined } });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <p className="mx-auto max-w-[1400px] px-5 py-2 text-center label-mono sm:px-8">
          Free delivery on orders over R500 · Nationwide across South Africa
        </p>
      </div>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-5 sm:px-8">
        <Link to="/" className="font-display text-lg leading-none" onClick={() => setOpen(false)}>
          URBANCART<span className="text-accent">.</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 text-[13px] font-medium lg:flex">
          <Link
            to="/shop"
            search={{ q: undefined, category: undefined, sort: undefined }}
            className="text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Shop all
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/shop"
              search={{ category: c.name, q: undefined, sort: undefined }}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="rounded-full pl-9"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account" asChild>
            <Link to="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden rounded-full sm:inline-flex"
            aria-label="Wishlist"
            asChild
          >
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>
          <CartDrawer />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface lg:hidden">
          <div className="mx-auto max-w-[1400px] px-5 py-3 sm:px-8">
            <form onSubmit={submitSearch} className="mb-3 md:hidden">
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className="rounded-full"
              />
            </form>
            <Link
              to="/shop"
              search={{ q: undefined, category: undefined, sort: undefined }}
              onClick={() => setOpen(false)}
              className="block border-b border-border py-3 text-sm"
            >
              Shop all
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.name, q: undefined, sort: undefined }}
                onClick={() => setOpen(false)}
                className="block border-b border-border py-3 text-sm"
              >
                {c.name}
              </Link>
            ))}
            <Link
              to="/delivery"
              onClick={() => setOpen(false)}
              className="block py-3 text-sm"
            >
              Delivery & returns
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
