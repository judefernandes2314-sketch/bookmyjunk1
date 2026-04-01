import { motion } from "framer-motion";
import appScreenshot from "@/assets/bmj-app-2.webp";

import truckImg   from "@/assets/bookmyjunk_van.png";
import plantImg   from "@/assets/bookmyjunk_plant.png";
import certImg    from "@/assets/bookmyjunk_certificate.png";

const steps = [
  {
    title: "Smart Pickup",
    sub: "Doorstep collection",
    image: truckImg,
    imageAlt: "BookMyJunk Truck",
    accent: "border-[#0a6e34]",
    accentMobile: "border-l-[#0a6e34]",
  },
  {
    title: "Recycling",
    sub: "CPCB authorized",
    image: plantImg,
    imageAlt: "Recycling Plant",
    accent: "border-[#0a6e34]",
    accentMobile: "border-l-[#0a6e34]",
  },
  {
    title: "Certificate",
    sub: "Eco-Warrior award",
    image: certImg,
    imageAlt: "Eco-Warrior Certificate",
    accent: "border-[#0a6e34]",
    accentMobile: "border-l-[#0a6e34]",
  },
];

const ArrowRight = () => (
  <svg
    className="hidden md:block"
    width="14" height="14" viewBox="0 0 14 14" fill="none"
  >
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="white" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const ArrowDown = () => (
  <svg
    className="block md:hidden"
    width="14" height="14" viewBox="0 0 14 14" fill="none"
  >
    <path
      d="M7 2v10M3 8l4 4 4-4"
      stroke="white" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const AppDownloadSection = () => (
  <section id="download" className="py-16 md:py-24 bg-primary relative overflow-hidden">

    {/* Decorative circles */}
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-foreground/5 rounded-full" />
    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary-foreground/5 rounded-full" />

    <div className="container mx-auto px-4 md:px-8 relative z-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 md:mb-12"
      >
        <p className="text-primary-foreground/60 font-display font-bold text-xs tracking-widest uppercase mb-2">
          Process Overview
        </p>
        <h2 className="font-display font-bold text-white text-2xl md:text-4xl leading-tight">
          From your phone to a cleaner planet
        </h2>
      </motion.div>

      {/* Flow */}
      <div className="flex flex-col md:flex-row md:items-center gap-0">

        {/* ── Phone mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="flex-shrink-0 flex flex-col items-center relative"
        >
          {/* FREE badge — outside the phone frame so it's never clipped */}
          <span
            className="absolute -top-2 -right-2 md:-right-3 z-[100] bg-secondary text-secondary-foreground
                       font-display font-extrabold text-[9px] px-2.5 py-1 rounded-full shadow-md animate-float"
          >
            FREE
          </span>

          {/* Phone frame */}
          <div
            className="relative"
            style={{
              width: 110, height: 212,
              background: "#111",
              borderRadius: 22,
              padding: 7,
              boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
            }}
          >
            {/* Notch */}
            <div
              className="absolute z-10"
              style={{
                top: 10, left: "50%", transform: "translateX(-50%)",
                width: 26, height: 5, background: "#2a2a2a", borderRadius: 3,
              }}
            />
            {/* Screen */}
            <div
              className="w-full h-full overflow-hidden flex flex-col gap-[5px]"
              style={{
                background: "#f3d700",
                borderRadius: 17,
                padding: "18px 6px 8px",
              }}
            >
              {/* App top bar */}
              <div className="flex justify-between items-center px-0.5 mb-1">
                <div style={{ width:28, height:9, background:"#0a6e34", borderRadius:3, opacity:.9 }} />
                <div style={{ width:13, height:13, background:"#0a6e34", borderRadius:"50%", opacity:.55 }} />
              </div>
              {/* App screenshot — uses your actual imported image */}
              <div className="flex-1 overflow-hidden rounded-[14px]">
                <img
                  src={appScreenshot}
                  alt="BookMyJunk App"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <p className="mt-3 text-center font-display font-bold text-white text-[13px] leading-snug">
            BookMyJunk<br />App
          </p>
        </motion.div>

        {/* ── Arrow 1 ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.14 }}
          className="flex-shrink-0 flex items-center justify-center
                     w-8 h-8 rounded-full my-3 md:my-0 md:mx-2.5
                     bg-white/20 border border-white/40"
        >
          <ArrowRight />
          <ArrowDown />
        </motion.div>

        {/* ── Step Cards ── */}
        {steps.map((step, i) => (
          <>
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className={`
                flex-1 min-w-0 bg-white rounded-[18px] overflow-hidden
                flex flex-col items-center text-center
                md:border-t-[5px] ${step.accent}
                flex-row md:flex-col text-left md:text-center
                border-l-[5px] md:border-l-0 ${step.accentMobile}
                rounded-[14px] md:rounded-[18px]
                w-full max-w-[400px] md:max-w-none md:w-auto
                hover:-translate-y-1 transition-transform duration-200
              `}
              style={{ boxShadow: undefined }}
            >
              {/* Image zone */}
              <div
                className="flex items-center justify-center bg-white overflow-hidden flex-shrink-0
                           w-[100px] h-[90px] md:w-full md:h-[160px] p-2.5 md:p-4"
              >
                <img src={step.image} alt={step.imageAlt} className="max-w-full max-h-full object-contain" />
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1 p-3 md:px-5 md:pb-5 md:items-center">
                <p className="font-display font-bold text-[#0d2b1a] text-[15px]">{step.title}</p>
                <p className="text-[#5a8068] text-[12.5px] leading-snug">{step.sub}</p>
              </div>
            </motion.div>

            {/* Arrow between steps (not after last) */}
            {i < steps.length - 1 && (
              <motion.div
                key={`arrow-${i}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.28 + i * 0.15 }}
                className="flex-shrink-0 flex items-center justify-center
                           w-8 h-8 rounded-full my-3 md:my-0 md:mx-2.5
                           bg-white/20 border border-white/40"
              >
                <ArrowRight />
                <ArrowDown />
              </motion.div>
            )}
          </>
        ))}

      </div>
    </div>
  </section>
);

export default AppDownloadSection;
