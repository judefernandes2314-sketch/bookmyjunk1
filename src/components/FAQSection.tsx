import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "What is e-waste and why should I recycle it?", a: "E-waste includes any discarded electronic devices — old laptops, mobile phones, TVs, printers, cables, and batteries. Improper disposal releases toxic chemicals like lead and mercury into the environment. Responsible e-waste recycling through BookMyJunk ensures safe disposal and material recovery." },
  { q: "How does the free doorstep e-waste collection work?", a: "Simply fill out the booking form on our website with your details and the e-waste items you want to dispose. Our team will schedule a pickup at your doorstep — completely free of charge. We operate in Mumbai, Delhi, Bangalore, Hyderabad, Pune, and 50+ cities across India." },
  { q: "What electronics can I recycle with BookMyJunk?", a: "We accept almost all electronic waste: old computers, laptops, mobile phones, tablets, TVs, monitors, printers, scanners, keyboards, cables, chargers, batteries, servers, networking equipment, air conditioners, refrigerators, and washing machines." },
  { q: "Is BookMyJunk a certified e-waste recycling company?", a: "Yes! We are CPCB (Central Pollution Control Board) authorized and ISO certified. All our recycling processes comply with the E-Waste Management Rules, 2016. We provide proper disposal certificates for corporate clients." },
  { q: "How do you ensure data security during e-waste disposal?", a: "Data security is our top priority. All storage devices undergo certified data destruction — including degaussing, shredding, and secure wiping — before any material is recycled. We provide data destruction certificates upon request." },
  { q: "Do you offer bulk e-waste pickup for businesses?", a: "Absolutely! We offer comprehensive IT asset disposition (ITAD) services for corporates. This includes bulk electronic scrap recycling, compliance certificates, asset tracking, and secure data destruction. Over 500 companies trust us." },
  { q: "Where are e-waste collection centres near me?", a: "BookMyJunk has collection points and partner facilities across India. But you don't need to visit one — our doorstep collection service brings the convenience to you. Just book a pickup and we'll come to your location." },
  { q: "Can I sell old electronics for recycling?", a: "Yes, depending on the condition and type of electronics, we offer buyback for certain items. Contact us through the booking form and our team will assess the value of your old electronics." },
];

const FAQSection = () => (
  <section id="faq" className="py-20 bg-accent/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">FAQ</span>
        <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Everything you need to know about our e-waste disposal services in India.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <AccordionItem value={`faq-${i}`} className="bg-card rounded-xl border border-border px-6 card-elevated">
                <AccordionTrigger className="text-left font-display font-medium text-card-foreground hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default FAQSection;
