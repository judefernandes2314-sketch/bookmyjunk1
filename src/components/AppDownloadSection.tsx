import { motion } from "framer-motion";
import appScreenshot from "@/assets/bmj-app-2.webp";
import truckImg from "@/assets/bookmyjunk_van.png";
import plantImg from "@/assets/bookmyjunk_plant.png";
import certImg  from "@/assets/bookmyjunk_certificate.png";

// IMAGE_HEIGHT controls the fixed height of every image in the row.
// All items share this height so arrows and text align perfectly.
const IMAGE_HEIGHT = 260;
const PHONE_WIDTH  = 148;
const PHONE_HEIGHT = IMAGE_HEIGHT;

const steps = [
  {
    image: truckImg,
    alt:   "BookMyJunk Van",
    title: "Smart Pickup Routing",
    sub:   "BookMyJunk schedules and maps the nearest vehicle to collect your e-waste directly from your doorstep.",
  },
  {
    image: plantImg,
    alt:   "Recycling Plant",
    title: "Responsible Recycling",
    sub:   "Aggregated E-waste is sent to CPCB authorized recycler.",
  },
  {
    image: certImg,
    alt:   "Eco-Warrior Certificate",
    title: "Eco-Warrior Certificate",
    sub:   "Certificate of Appreciation as an Eco-Warrior is issued to the user through the app/portal.",
  },
];

const Arrow = () => (
  <div className="flex-shrink-0 flex items-center justify-center
                  w-9 h-9 rounded-full
                  bg-white/15 border border-white/25
                  mx-3 self-center
                  hover:bg-white/25 transition-all duration-200 cursor-default">
    {/* Right arrow — desktop */}
    <svg className="hidden md:block" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {/* Down arrow — mobile */}
    <svg className="block md:hidden" width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2v10M3 8l4 4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const Label = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mt-5 w-full text-left md:text-left text-center">
    <p className="font-display font-bold text-white text-lg md:text-xl leading-snug">
      {title}
    </p>
    <div className="w-8 h-[3px] rounded bg-white/35 mt-2 mx-auto md:mx-0" />
    <p className="text-white/70 text-sm md:text-[15px] mt-3 leading-relaxed">
      {sub}
    </p>
  </div>
);

const AppDownloadSection = () => (
  <section id="download" className="bg-primary relative overflow-hidden py-16 md:py-24">

    {/* Subtle bg gradients */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: `
        radial-gradient(ellipse 60% 50% at 90% 10%, rgba(255,255,255,0.07) 0%, transparent 60%),
        radial-gradient(ellipse 40% 40% at 5% 90%, rgba(0,60,20,0.3) 0%, transparent 60%)
      `
    }} />

    <div className="container mx-auto px-6 md:px-10 relative z-10">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 md:mb-16"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-px bg-white/40" />
          <p className="font-display font-bold text-[11px] tracking-[0.15em] uppercase text-white/50">
            Process Overview
          </p>
        </div>
        <h2 className="font-display font-extrabold text-white tracking-tight leading-tight"
          style={{ fontSize: "clamp(28px, 4vw, 50px)" }}>
          From your phone to{" "}
          <span className="font-medium text-white/50">a cleaner planet</span>
        </h2>
      </motion.div>

      {/* ── Flow ──
           Desktop: horizontal flex, items-start so image+text stack per column,
                    arrows use self-center to sit at image midpoint naturally
                    since all images are the SAME fixed height.
           Mobile:  column, arrows point down.
      ── */}
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-0">

        {/* ── Phone ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="flex flex-col items-center md:items-start flex-shrink-0 relative"
        >
          {/* FREE badge */}
          <span className="absolute -top-2 right-[calc(50%-70px)] md:right-auto md:-right-4
                           z-50 bg-secondary text-secondary-foreground
                           font-display font-extrabold text-[9px] px-3 py-1
                           rounded-full shadow-md animate-float">
            FREE
          </span>

          {/* Phone frame */}
          <div style={{
            height: PHONE_HEIGHT,
            width:  PHONE_WIDTH,
            background: "#111",
            borderRadius: 22,
            padding: 5,
            boxShadow: "0 0 0 2px rgba(255,255,255,0.18), 0 16px 48px rgba(0,0,0,0.45)",
            position: "relative",
            flexShrink: 0,
          }}>
            {/* Notch */}
            <div style={{
              position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
              width: 26, height: 5, background: "#2a2a2a", borderRadius: 3, zIndex: 3,
            }} />
            {/* Screen — full bleed screenshot, no fake UI */}
            <div style={{
              width: "100%", height: "100%",
              borderRadius: 18, overflow: "hidden",
            }}>
              <img
                src={appScreenshot}
                alt="BookMyJunk App"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          </div>

          <Label title="BookMyJunk App" sub="Book your pickup" />
        </motion.div>

        {/* Arrow 1 */}
        <Arrow />

        {/* ── Step cards ── */}
        {steps.map((step, i) => (
          <>
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="flex-1 min-w-0 flex flex-col items-center md:items-start group"
            >
              {/* Fixed height image box — same for all */}
              <div className="w-full flex items-center justify-center"
                style={{ height: IMAGE_HEIGHT }}>
                <img
                  src={step.image}
                  alt={step.alt}
                  className="max-w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{
                    height: "100%",
                    width: "auto",
                    maxHeight: IMAGE_HEIGHT,
                    objectFit: "contain",
                    filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.22))",
                  }}
                />
              </div>

              <Label title={step.title} sub={step.sub} />
            </motion.div>

            {/* Arrow between steps */}
            {i < steps.length - 1 && <Arrow key={`arrow-${i}`} />}
          </>
        ))}

      </div>
    </div>
  </section>
);

export default AppDownloadSection;
