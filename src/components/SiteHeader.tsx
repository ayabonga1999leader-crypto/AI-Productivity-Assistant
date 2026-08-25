import { Link } from "@tanstack/react-router";
import { CartDrawer } from "@/components/CartDrawer";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/delivery", label: "Delivery" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-lg leading-none">
            URBANCART<span className="text-accent">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block label-mono text-muted-foreground">ZA · ZAR</span>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
