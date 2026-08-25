import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery & returns — UrbanCart" },
      {
        name: "description",
        content:
          "How UrbanCart ships across South Africa, expected courier timelines, returns policy and payment options at checkout.",
      },
      { property: "og:title", content: "Delivery & returns — UrbanCart" },
      {
        property: "og:description",
        content: "Courier timelines, returns and payment options for UrbanCart orders in South Africa.",
      },
    ],
  }),
  component: Delivery,
});

const sections = [
  {
    title: "Delivery",
    body: "Orders are couriered nationwide. Main-centre deliveries typically arrive in 2–3 working days, regional and outlying areas in 3–5 working days. Delivery cost is calculated at checkout based on your address.",
  },
  {
    title: "Order tracking",
    body: "You will receive an order confirmation by email as soon as payment clears, followed by a tracking reference once your parcel is collected by the courier.",
  },
  {
    title: "Returns",
    body: "Unworn items in original packaging can be returned within 30 days of delivery. Start a return by replying to your order confirmation email with your order number.",
  },
  {
    title: "Payments",
    body: "Checkout is handled securely by Shopify. All prices are shown and charged in South African rands (ZAR).",
  },
];

function Delivery() {
  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-8 py-14">
      <p className="label-mono text-accent">Customer care</p>
      <h1 className="mt-3 text-3xl sm:text-5xl uppercase">Delivery &amp; returns</h1>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {sections.map((s) => (
          <div key={s.title} className="py-6">
            <h2 className="text-lg uppercase">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
