import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/features/products/data/products";
import { buildWhatsAppUrl } from "@/lib/utils/format";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  ArrowRight,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Award,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#040d1a] text-white [content-visibility:auto] [contain-intrinsic-size:0_400px]">
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#0B3C5D]/40 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#1E5F8B]/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-12 grid gap-12 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-xl bg-[#0d5ea6] grid place-items-center text-white font-display font-black text-sm shadow-[0_0_20px_rgba(13,94,166,0.5)] group-hover:shadow-[0_0_30px_rgba(13,94,166,0.8)] transition-all">
              AQ
            </div>
            <span className="font-display font-black text-2xl tracking-tight">
              AQ <span className="text-[#5b9bd5]">Beds</span>
            </span>
          </Link>
          <p className="mt-5 text-white/50 max-w-sm leading-relaxed text-sm">
            Premium ottoman, divan and storage beds engineered for perfect sleep. Handcrafted
            quality, delivered to your door across the UK.
          </p>
          <form className="mt-7 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email for exclusive offers"
              className="flex-1 h-11 rounded-2xl px-4 bg-white/5 border border-white/10 placeholder:text-white/30 text-sm text-white outline-none focus:border-[#1E5F8B] transition-all"
            />
            <button
              type="submit"
              className="h-11 px-4 rounded-2xl bg-[#0d5ea6] text-white text-sm font-bold hover:bg-[#1E5F8B] hover:scale-105 transition-all flex-shrink-0 flex items-center"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-7 flex items-center gap-3">
            {[
              { href: "#", icon: Instagram, label: "Instagram" },
              { href: "#", icon: Facebook, label: "Facebook" },
              { href: "#", icon: Twitter, label: "Twitter" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 grid place-items-center hover:bg-[#0d5ea6] hover:border-[#0d5ea6] hover:scale-110 transition-all duration-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-white/40 mb-5">
            Shop
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li>
              <Link to="/shop" className="hover:text-white transition-colors">
                All Beds
              </Link>
            </li>
            {CATEGORIES.slice(1, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="hover:text-white transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-white/40 mb-5">
            Support
          </h4>
          <ul className="space-y-3 text-sm text-white/60">
            {[
              { label: "About AQ Beds", to: "/about" },
              { label: "Contact Us", to: "/contact" },
              { label: "FAQs", to: "/faqs" },
              { label: "Delivery Info", to: "/delivery" },
              { label: "Returns Policy", to: "/returns" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to as any} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-black text-xs uppercase tracking-widest text-white/40 mb-5">
            Contact
          </h4>
          <ul className="space-y-4 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#5b9bd5]" />
              <a href="mailto:aqbeds2822@gmail.com" className="hover:text-white transition-colors">
                aqbeds2822@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#5b9bd5]" />
              <a href="tel:+447519791128" className="hover:text-white transition-colors">
                +44 7519 791128
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-[#5b9bd5]" />
              <span>United Kingdom</span>
            </li>
          </ul>
          <a
            href={buildWhatsAppUrl("Hello AQ Beds")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-2xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba5a] hover:scale-105 transition-all shadow-[0_0_20px_rgba(37,211,102,0.2)]"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.93L0 24l6.4-1.68a11.86 11.86 0 0 0 5.64 1.44h.01c6.54 0 11.84-5.3 11.84-11.84 0-3.16-1.23-6.13-3.37-8.44Z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0d5ea6]/20 grid place-items-center flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-[#5b9bd5]" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Secure Checkout</p>
              <p className="text-xs text-white/40">Protected by SSL encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0d5ea6]/20 grid place-items-center flex-shrink-0">
              <Truck className="h-6 w-6 text-[#5b9bd5]" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Free UK Delivery</p>
              <p className="text-xs text-white/40">On all bed orders</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#0d5ea6]/20 grid place-items-center flex-shrink-0">
              <Award className="h-6 w-6 text-[#5b9bd5]" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white">Easy Returns</p>
              <p className="text-xs text-white/40">30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-white/30">© 2018 AQ Beds. All rights reserved.</span>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <Link to="/faqs" className="hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/faqs" className="hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
