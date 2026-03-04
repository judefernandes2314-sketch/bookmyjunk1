import { motion } from "framer-motion";
import { Monitor, Smartphone, Laptop, Tv, Printer, Battery, Cable, Server, Wind, Refrigerator, WashingMachine, Cpu, Keyboard, Mouse, Headphones } from "lucide-react";

const categories = [
  { icon: Laptop, name: "Laptops & Notebooks", desc: "Old, broken or unused laptops" },
  { icon: Monitor, name: "Desktop Computers", desc: "CPUs, monitors & peripherals" },
  { icon: Smartphone, name: "Mobile Phones", desc: "Smartphones & feature phones" },
  { icon: Tv, name: "Televisions", desc: "LED, LCD, CRT & smart TVs" },
  { icon: Printer, name: "Printers & Scanners", desc: "Inkjet, laser & multifunction" },
  { icon: Keyboard, name: "Keyboards & Mouse", desc: "Wired & wireless input devices" },
  { icon: Headphones, name: "Audio & Speakers", desc: "Headphones, speakers & sound systems" },
  { icon: Cable, name: "Cables & Chargers", desc: "Power cords, USB cables & adapters" },
  { icon: Battery, name: "Batteries", desc: "Li-ion, lead-acid & dry cells" },
  { icon: Server, name: "Servers & Networking", desc: "Routers, switches & server racks" },
  { icon: Wind, name: "Air Conditioners", desc: "Split, window & portable ACs" },
  { icon: Refrigerator, name: "Refrigerators", desc: "Single & double door fridges" },
  { icon: WashingMachine, name: "Washing Machines", desc: "Front & top load washers" },
  { icon: Cpu, name: "Circuit Boards & PCBs", desc: "Motherboards & electronic components" },
  { icon: Mouse, name: "Other Electronics", desc: "Any electronic item not listed" },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-28 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-transparent to-accent/20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
            What We Accept
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            E-Waste Categories
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            We responsibly recycle all types of electronic waste. Select any item below to schedule a free doorstep pickup.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.name}
              href="#book"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04, ease }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="group relative flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-border bg-card card-elevated cursor-pointer transition-colors duration-300 hover:border-primary/40 min-h-[160px]"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                <cat.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1 leading-tight">{cat.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="text-center mt-10 text-muted-foreground text-sm"
        >
          {//Don't see your item? <a href="#book" className="text-primary font-medium story-link">Contact us</a> — we accept almost everything electronic.}
        </motion.p>
      </div>
    </section>
  );
};

export default CategoriesSection;
