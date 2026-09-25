import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AQ Beds" },
      {
        name: "description",
        content: "AQ Beds crafts premium beds with timeless design and lasting comfort.",
      },
      { property: "og:title", content: "About — AQ Beds" },
      { property: "og:description", content: "AQ Beds crafts premium beds with timeless design and lasting comfort. Handcrafted in the UK." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/about" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 animate-fade-in">
      <h1 className="font-display font-bold text-4xl">About AQ Beds</h1>
      <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
        We design and build premium beds for people who care about how they sleep — and how their
        bedroom looks. Every AQ Bed is engineered for durability, dressed in luxurious fabrics, and
        finished by hand.
      </p>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        From plush ottomans to space-saving storage beds and statement chesterfields, our collection
        is built to last decades, not seasons. Choose your size, fabric, mattress and frame, and
        we'll deliver it to your door — free, across the UK.
      </p>
    </div>
  );
}
