import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

const UK_NAMES = [
  "Diva",
  "Oliver",
  "Sophie",
  "Jack",
  "Emma",
  "Thomas",
  "Lucy",
  "George",
  "Mia",
  "Arthur",
  "Chloe",
  "William",
  "Isla",
  "Noah",
  "Grace",
  "Harry",
  "Amelia",
  "Leo",
  "Olivia",
  "Freddie",
];
const UK_CITIES = [
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Glasgow",
  "Sheffield",
  "Liverpool",
  "Bristol",
  "Edinburgh",
  "Leicester",
  "Coventry",
  "Cardiff",
];
const BEDS = [
  "Aurora Plush Ottoman Bed",
  "Verona Winged Ottoman",
  "Kensington Linen Divan",
  "Chelsea Buttoned Set",
  "Atlas Storage Bed",
  "Regent Chesterfield",
  "Bellagio Tufted Bed",
];

export function SalesTicker() {
  const [sale, setSale] = useState<{ id: number; name: string; city: string; bed: string } | null>(
    null,
  );

  if (typeof window !== "undefined") {
    const now = performance.now();
    console.log(`[AQ-DEBUG] SalesTicker Rendered at: ${now.toFixed(2)}ms`);
  }

  useEffect(() => {
    const now = performance.now();
    console.log(`[AQ-DEBUG] SalesTicker Mounted at: ${now.toFixed(2)}ms`);
  }, []);

  useEffect(() => {
    let idCounter = 0;
    const generateSale = () => {
      const name = UK_NAMES[Math.floor(Math.random() * UK_NAMES.length)];
      const city = UK_CITIES[Math.floor(Math.random() * UK_CITIES.length)];
      const bed = BEDS[Math.floor(Math.random() * BEDS.length)];
      setSale({ id: idCounter++, name, city, bed });
    };

    // Initial sale immediately
    generateSale();

    // Loop every 6 seconds
    const interval = setInterval(() => {
      generateSale();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand text-brand-foreground py-2 overflow-hidden relative z-50 border-b border-white/10 hidden sm:block">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-6">
        <AnimatePresence mode="wait">
          {sale && (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-xs font-medium"
            >
              <ShoppingBag className="w-3 h-3 text-cta" />
              <span>
                <span className="font-bold text-white">{sale.name}</span> from {sale.city} just
                bought a{" "}
                <span className="font-bold text-cta underline underline-offset-2">{sale.bed}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
