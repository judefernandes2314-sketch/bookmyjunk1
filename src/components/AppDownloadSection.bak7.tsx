import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import appScreenshot from "@/assets/bmj-app-2.webp";
import truckImg from "@/assets/bookmyjunk_van.png";
import plantImg from "@/assets/bookmyjunk_plant.png";
import certImg  from "@/assets/bookmyjunk_certificate.png";

const steps = [
  {
    id: "s1",
    image: truckImg,
    imageAlt: "BookMyJunk Van",
    title: "Smart Pickup Routing",
    sub: "BookMyJunk schedules and maps the nearest vehicle to collect your e-waste directly from your doorstep.",
    cert: false,
  },
  {
    id: "s2",
    image: plantImg,
    imageAlt: "Recycling Plant",
    title: "Responsible Recycling",
    sub: "Aggregated E-waste is sent to CPCB authorized recycler.",
    cert: false,
  },
  {
    id: "s3",
    image: certImg,
    imageAlt: "Eco-Warrior Certificate",
    title: "Eco-Warrior Certificate",
    sub: "Certificate of Appreciation as an Eco-Warrior is issued to the user through the app/portal.",
    cert: true,
  },
];

const ArrowRight = () => (
  <svg className="hidden md:block" width="15" height="15" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowDown = () => (
  <svg className="block md:hidden" width="15" height="15" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M3 8l4 4 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AppDownloadSection = () => {
  const s1Ref  = useRef<HTMLDivElement>(null);
  const s2Ref  = useRef<HTMLDivElement>(null);
  const s3Ref  = useRef<HTMLDivElement>(null);
  const a1Ref  = useRef<HTMLDivElement>(null);
  const a2Ref  = useRef<HTMLDivElement>(null);
  const a3Ref  = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const align = () => {
    if (window.innerWidth < 860) return;
    const refImg = s1Ref.current?.querySelector(".step-img") as HTMLElement;
    if (!refImg) return;
    const imgH   = refImg.offsetHeight;
    const arrowH = 38;
    const mt     = imgH / 2 - arrowH / 2;
    [a1Ref, a2Ref, a3Ref].forEach(ref => {
      if (ref.current) ref.current.style.marginTop = `${mt}px`;
    });
    if (phoneRef.current) phoneRef.current.style.height = `${imgH}px`;
  };

  useEffect(() => {
    align();
    window.addEventListener("resize", align);
    return () => window.removeEventListener("resize", align);
  }, []);

  return (
    <section id="download" className="py-20 md:py-24 bg-primary relative overflow-hidden">

      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 60% 50% at 90% 10%, rgba(255,255,255,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at 5% 90%, rgba(0,80,30,0.35) 0%, transparent 60%)
        `
      }}/>

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-0.5 bg-white/40 rounded"/>
            <p className="text-primary-foreground/55 font-display font-bold text-[11px] tracking-[0.16em] uppercase">
              Process Overview
            </p>
          </div>
          <h2 className="font-display font-extrabold text-white leading-[1.12] tracking-tight"
            style={{ fontSize: "clamp(32px, 3.8vw, 52px)" }}>
            From your phone to{" "}
            <span className="text-white/55 font-medium">a cleaner planet</span>
          </h2>
        </motion.div>

        {/* Flow */}
        <div className="flex flex-col md:flex-row md:items-start gap-0">

          {/* ── Phone ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="flex-shrink-0 flex flex-col items-center relative self-center md:self-start mb-4 md:mb-0"
          >
            <span className="absolute -top-2 -right-4 z-[100] bg-secondary text-secondary-foreground
                             font-display font-extrabold text-[9px] tracking-wide
                             px-3 py-1 rounded-full shadow-lg animate-float">
              FREE
            </span>

            {/* Phone glow ring */}
            <div className="rounded-[27px]" style={{
              padding: 3,
              background: "linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.4)",
            }}>
              <div className="relative" style={{ width: 116, background: "#111", borderRadius: 24, padding: 7 }}
                ref={phoneRef}>
                {/* Notch */}
                <div className="absolute z-10" style={{
                  top: 11, left: "50%", transform: "translateX(-50%)",
                  width: 28, height: 5, background: "#252525", borderRadius: 3,
                }}/>
                {/* Screen */}
                <div className="w-full h-full overflow-hidden flex flex-col" style={{
                  background: "#f3d700", borderRadius: 19, padding: "19px 7px 8px", gap: 5,
                }}>
                  <div className="flex justify-between items-center px-0.5 mb-1">
                    <div style={{ width: 30, height: 10, background: "#0a6e34", borderRadius: 3, opacity: 0.9 }}/>
                    <div style={{ width: 14, height: 14, background: "#0a6e34", borderRadius: "50%", opacity: 0.55 }}/>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-[14px]">
                    <img src={appScreenshot} alt="BookMyJunk App" className="w-full h-full object-cover"
                      onLoad={align}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center md:text-left">
              <p className="font-display font-bold text-white text-[20px] leading-snug tracking-tight">BookMyJunk App</p>
              <div className="w-9 h-[3px] bg-white/40 rounded mt-2 mx-auto md:mx-0"/>
              <p className="text-white/70 text-[14.5px] mt-2 leading-relaxed">Book your pickup</p>
            </div>
          </motion.div>

          {/* Arrow 1 */}
          <motion.div ref={a1Ref}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="flex-shrink-0 self-start flex items-center justify-center
                       w-[38px] h-[38px] rounded-full bg-white/15 border border-white/30
                       backdrop-blur-md mx-4 my-4 md:my-0
                       hover:bg-white/25 hover:scale-110 transition-all duration-200">
            <ArrowRight/><ArrowDown/>
          </motion.div>

          {/* Steps */}
          {steps.map((step, i) => {
            const stepRef = [s1Ref, s2Ref, s3Ref][i];
            const arrowRef = [null, a2Ref, a3Ref][i];
            return (
              <>
                <motion.div
                  key={step.id}
                  ref={stepRef}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.24 + i * 0.16 }}
                  className="flex-1 min-w-0 flex flex-col items-center md:items-start
                             w-full max-w-[420px] md:max-w-none mx-auto md:mx-0 group"
                >
                  {/* Image */}
                  <div
                    className="step-img w-full relative transition-transform duration-300 group-hover:-translate-y-1"
                    style={{
                      ...(step.cert ? { width: 200 } : {}),
                    }}
                  >
                    <div style={{ paddingTop: step.cert ? "140%" : "75%" }}/>
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      onLoad={align}
                      className="absolute inset-0 w-full h-full object-contain
                                 transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{
                        filter: step.cert
                          ? "drop-shadow(0 4px 20px rgba(0,0,0,0.25))"
                          : "drop-shadow(0 8px 24px rgba(0,0,0,0.2))",
                      }}
                    />
                  </div>

                  {/* Label */}
                  <div className="mt-5 w-full text-center md:text-left">
                    <p className="font-display font-bold text-white leading-snug tracking-tight"
                       style={{ fontSize: "clamp(17px, 1.6vw, 20px)" }}>
                      {step.title}
                    </p>
                    <div className="w-9 h-[3px] bg-white/40 rounded mt-2 mx-auto md:mx-0"/>
                    <p className="text-white/70 mt-2 leading-relaxed"
                       style={{ fontSize: "clamp(13px, 1.1vw, 14.5px)" }}>
                      {step.sub}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow between steps */}
                {arrowRef && (
                  <motion.div
                    key={`arrow-${i}`}
                    ref={arrowRef}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    className="flex-shrink-0 self-start flex items-center justify-center
                               w-[38px] h-[38px] rounded-full bg-white/15 border border-white/30
                               backdrop-blur-md mx-4 my-4 md:my-0
                               hover:bg-white/25 hover:scale-110 transition-all duration-200">
                    <ArrowRight/><ArrowDown/>
                  </motion.div>
                )}
              </>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
