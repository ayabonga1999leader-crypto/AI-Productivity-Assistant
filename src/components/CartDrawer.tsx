import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { formatMoney } from "@/lib/shopify";

const FREE_DELIVERY_THRESHOLD = 500;

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, isLoading, totalAmount, checkoutUrl, updateQuantity, removeItem, syncCart } =
    useCartStore();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = totalAmount
    ? parseFloat(totalAmount.amount)
    : items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const handleCheckout = () => {
    if (!checkoutUrl) return;
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    window.open(url.toString(), "_blank");
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Cart">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent p-0 text-[10px] text-accent-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0
              ? "Your cart is empty"
              : `${totalItems} item${totalItems !== 1 ? "s" : ""} · prices in ZAR`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nothing here yet.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="space-y-4 py-2">
                {items.map((item) => {
                  const image = item.product.node.images?.edges?.[0]?.node;
                  return (
                    <div key={item.lineId} className="flex gap-4">
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        {image && (
                          <img
                            src={image.url}
                            alt={item.product.node.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.product.node.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.selectedOptions.map((o) => o.value).join(" · ")}
                        </p>
                        <p className="mt-1 font-mono text-sm">
                          {formatMoney(item.price.amount, item.price.currencyCode)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label="Remove item"
                          onClick={() => removeItem(item.lineId)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex items-center gap-1 rounded-full border border-border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              {remaining > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Add {formatMoney(remaining)} more for free delivery.
                </p>
              ) : (
                <p className="text-xs text-accent">You qualify for free delivery.</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-mono text-lg font-semibold">{formatMoney(subtotal)}</span>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full"
                disabled={isLoading || !checkoutUrl}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" /> Secure checkout
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
