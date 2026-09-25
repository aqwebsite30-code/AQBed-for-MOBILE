import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns Policy — AQ Beds" },
      {
        name: "description",
        content:
          "AQ Beds 30-day returns policy — unused items in original packaging. Free returns, easy process, and fast refunds for UK customers.",
      },
      { property: "og:title", content: "Returns Policy — AQ Beds" },
      { property: "og:description", content: "AQ Beds 30-day returns policy — unused items in original packaging. Free returns, easy process, and fast refunds for UK customers." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/returns" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Returns Policy — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: Returns,
});

function Returns() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 animate-fade-in">
      <h1 className="font-display font-bold text-4xl">Returns Policy</h1>
      <p className="mt-3 text-muted-foreground">
        We want you to love your AQ Bed. If something isn't right, we're here to help.
      </p>

      <section className="mt-10 space-y-8">
        <div className="rounded-[32px] border border-brand/10 bg-brand/[0.03] p-8 backdrop-blur-md shadow-card">
          <h2 className="font-display font-bold text-xl text-brand">30-Day Return Window</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            You have <strong>30 days from the date of delivery</strong> to return your item if you
            change your mind. To be eligible, items must be unused, in the same condition you
            received them, and in their original packaging.
          </p>
        </div>

        <div className="rounded-[32px] border border-brand/10 bg-brand/[0.03] p-8 backdrop-blur-md shadow-card">
          <h2 className="font-display font-bold text-xl text-brand">How to Start a Return</h2>
          <ol className="mt-3 text-muted-foreground leading-relaxed space-y-2 list-decimal pl-5">
            <li>
              <strong>Contact us</strong> within 14 days of delivery via email at{" "}
              <a href="mailto:aqbeds2822@gmail.com" className="text-brand underline">
                aqbeds2822@gmail.com
              </a>{" "}
              or WhatsApp.
            </li>
            <li>Provide your order number and reason for return.</li>
            <li>
              We will <strong>arrange a collection</strong> from your address at no cost to you.
            </li>
            <li>Pack the item securely in its original packaging for collection.</li>
          </ol>
        </div>

        <div className="rounded-[32px] border border-brand/10 bg-brand/[0.03] p-8 backdrop-blur-md shadow-card">
          <h2 className="font-display font-bold text-xl text-brand">Refund Timeline</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Once we receive your returned item and inspect it, we will process your refund{" "}
            <strong>within 14 days</strong>. The money will be returned to your original payment
            method. You will receive a confirmation email once the refund is complete.
          </p>
        </div>

        <div className="rounded-[32px] border border-brand/10 bg-brand/[0.03] p-8 backdrop-blur-md shadow-card">
          <h2 className="font-display font-bold text-xl text-brand">Exclusions</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            <strong>Custom or made-to-order items</strong> (including bespoke sizes, non-standard
            fabrics, and personalised beds) are <strong>non-returnable</strong> unless faulty. We
            recommend ordering fabric swatches before committing to a custom piece.
          </p>
        </div>

        <div className="rounded-[32px] border border-brand/10 bg-brand/[0.03] p-8 backdrop-blur-md shadow-card">
          <h2 className="font-display font-bold text-xl text-brand">Damaged on Arrival</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            If your bed arrives damaged or with a manufacturing defect, please{" "}
            <strong>contact us within 48 hours</strong> of delivery. Include photos of the damage
            and your order number. We will arrange a free replacement or full refund — whichever you
            prefer.
          </p>
        </div>
      </section>

      <div className="mt-12 p-8 rounded-[32px] bg-gradient-to-br from-brand to-brand-accent text-white shadow-luxury text-center">
        <h2 className="font-display font-bold text-2xl">Need help with a return?</h2>
        <p className="mt-2 text-white/70">Our team is ready to assist you.</p>
        <a
          href="/contact"
          className="mt-5 inline-flex h-12 items-center justify-center rounded-2xl bg-white px-8 text-brand font-bold hover:bg-secondary transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
