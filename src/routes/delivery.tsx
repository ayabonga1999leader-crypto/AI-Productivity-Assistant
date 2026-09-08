import { createFileRoute } from "@tanstack/react-router";

const PROVINCES = [
  { name: "Gauteng", eta: "1–2 working days" },
  { name: "Western Cape", eta: "2–3 working days" },
  { name: "KwaZulu-Natal", eta: "2–3 working days" },
  { name: "Eastern Cape", eta: "3–4 working days" },
  { name: "Free State", eta: "2–4 working days" },
  { name: "Mpumalanga", eta: "2–4 working days" },
  { name: "Limpopo", eta: "3–4 working days" },
  { name: "North West", eta: "3–4 working days" },
  { name: "Northern Cape", eta: "3–5 working days" },
];

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery & returns — UrbanCart South Africa" },
      {
        name: "description",
        content:
          "UrbanCart delivery times by province, courier fees in rand, free delivery over R500 and our 30-day returns policy.",
      },
      { property: "og:title", content: "Delivery & returns — UrbanCart" },
      {
        property: "og:description",
        content: "Nationwide courier delivery across all nine provinces, plus 30-day returns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <div className="mx-auto max-w-[900px] px-5 py-14 sm:px-8">
      <p className="label-mono text-accent">Help</p>
      <h1 className="mt-3 text-3xl uppercase sm:text-4xl">Delivery &amp; returns</h1>
      <p className="mt-4 max-w-[60ch] text-sm text-muted-foreground">
        We courier to all nine provinces. Orders placed before 12:00 SAST on a working day are
        packed the same day.
      </p>

      <section className="mt-10">
        <h2 className="text-xl uppercase">Delivery times &amp; fees</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Province</th>
                <th className="px-4 py-3 text-left font-semibold">Estimated delivery</th>
                <th className="px-4 py-3 text-left font-semibold">Fee</th>
              </tr>
            </thead>
            <tbody>
              {PROVINCES.map((p) => (
                <tr key={p.name} className="border-t border-border">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.eta}</td>
                  <td className="px-4 py-3 text-muted-foreground">R70 · free over R500</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-lg font-semibold">Returns</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Return any unused item in its original packaging within 30 days for a refund or
            exchange. Beauty products must be sealed.
          </p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-lg font-semibold">Tracking</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You'll get a tracking link by email and SMS as soon as your parcel leaves our warehouse
            in Johannesburg.
          </p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-lg font-semibold">Collection</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Free click &amp; collect from our Braamfontein pickup point, Mon–Fri 09:00–17:00.
          </p>
        </div>
        <div className="rounded-2xl border border-border p-5">
          <h2 className="text-lg font-semibold">Need help?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Email hello@urbancart.co.za or call 011 234 5678, Mon–Fri 08:00–17:00 SAST.
          </p>
        </div>
      </section>
    </div>
  );
}
