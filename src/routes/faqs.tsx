import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — AQ Beds" },
      { name: "description", content: "Frequently asked questions about AQ Beds." },
      { property: "og:title", content: "FAQs — AQ Beds" },
      { property: "og:description", content: "Frequently asked questions about AQ Beds delivery, returns, materials, payments and more." },
      { property: "og:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
      { property: "og:url", content: "https://www.aqbeds.com/faqs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "FAQs — AQ Beds" },
      { name: "twitter:image", content: "https://www.aqbeds.com/Home%20page%20images/1000152185-clean.webp" },
    ],
  }),
  component: FAQsPage,
});

const faqs = [
  {
    question: "Do you offer free delivery?",
    answer:
      "Yes, we offer free delivery on all beds nationwide. Fast, reliable, and secure directly to your door.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return window from the date of delivery. Items must be unused and in their original packaging. Contact us within 14 days to initiate a return and we'll arrange a free collection.",
  },
  {
    question: "Do you offer cash on delivery?",
    answer:
      "Yes, we offer Cash on Delivery so you can inspect your bed before completing payment. Stress-free and convenient!",
  },
  {
    question: "How long does shipping normally take?",
    answer:
      "Beds and mattresses typically ship within 3 to 7 business days. Sofas and upholstery take 5 to 10 business days. Made-to-order items may take 2–4 weeks.",
  },
  {
    question: "Do your beds come with a warranty?",
    answer:
      "Absolutely. All AQ Beds products are backed by a standard 1-year manufacturer warranty covering any defects in materials and workmanship.",
  },
  {
    question: "What materials are used in AQ Beds?",
    answer:
      "Our frames are built from solid hardwood and high-grade engineered wood. We use premium foam, pocket springs, and a range of luxurious fabrics including linen, velvet, and leather. All materials are sourced with durability and comfort in mind.",
  },
  {
    question: "Do you offer assembly or installation services?",
    answer:
      "Most beds are designed for easy self-assembly and come with all required tools and instructions. We also offer a white-glove assembly service in selected areas — simply select it at checkout or contact us for a quote.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major debit and credit cards, Cash on Delivery (COD), and online bank transfers. All payments are processed securely.",
  },
  {
    question: "How do I track my delivery?",
    answer:
      "Once your order ships, you'll receive a tracking link by email and SMS. You can use it to follow your delivery in real time and get an estimated arrival window.",
  },
  {
    question: "What happens if my bed arrives damaged?",
    answer:
      "If your bed arrives damaged or faulty, contact us within 48 hours with photos of the issue. We will arrange a free replacement or full refund — whichever you prefer.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "You can change or cancel your order within 24 hours of placing it — just get in touch. After that, please refer to our 30-day returns policy.",
  },
];

function FAQsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 animate-fade-in relative min-h-[60vh]">
      <div className="mb-12 text-center text-brand">
        <h1 className="font-display font-bold text-4xl sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Everything you need to know about AQ Beds.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-[32px] border border-brand/10 bg-brand/[0.03] p-8 backdrop-blur-md shadow-card hover:shadow-luxury transition-all duration-300 group"
          >
            <h2 className="font-display font-bold text-xl text-brand flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-cta rounded-full shrink-0 shadow-[0_0_10px_var(--color-cta)]" />
              {faq.question}
            </h2>
            <p className="mt-4 text-brand/70 pl-5 border-l-2 border-brand/10 ml-1.5 leading-relaxed font-medium">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center p-12 rounded-[40px] bg-gradient-to-br from-brand to-brand-accent text-white shadow-luxury">
        <h2 className="font-display font-bold text-3xl mb-4">Still have questions?</h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          Our team is here to help you find the perfect bed for your home.
        </p>
        <a
          href="/contact"
          className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-10 text-brand font-bold hover:bg-secondary transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
