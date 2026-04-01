import { motion } from "framer-motion";
import { Download, Smartphone, CheckCircle2, Star } from "lucide-react";
import appScreenshot from "@/assets/bmj-app-2.webp";

const benefits = [
  "Schedule pickup in 30 seconds",
  "Track your pickup in real-time",
  "Get instant price estimates",
  "Earn rewards for recycling",
  "100% data destruction guarantee",
  "Digital disposal certificates",
];

const AppDownloadSection = () => (
  <section id="download" className="py-24 bg-primary relative overflow-hidden">
    {/* Decorative circles */}
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-foreground/5 rounded-full" />
    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary-foreground/5 rounded-full" />

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary-foreground/60 font-semibold text-sm tracking-widest uppercase">Download the App</span>
          <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold text-primary-foreground leading-tight">
            Recycle E-waste <br />From Your Phone
          </h2>
          <p className="mt-4 text-primary-foreground/70 text-lg leading-relaxed max-w-lg">
            The BookMyJunk app makes e-waste disposal effortless. Book a free doorstep pickup, track collection, and get disposal certificates — all from your smartphone.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&pcampaignid=web_sharehttps://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get BookMyJunk on Google Play Store"
                className="h-14 hover:opacity-80 transition"
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/bookmyjunk/id1595834562"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download BookMyJunk on App Store"
                className="h-14 hover:opacity-80 transition"
              />
            </a>
          </div>

          <div className="mt-5 flex items-center gap-3 text-primary-foreground/50 text-sm">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <span>4.8 rating · 50,000+ downloads</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          {/* Phone mockup */}
          <div className="relative">
            <div className="w-64 h-[520px] bg-foreground rounded-[40px] p-3 shadow-2xl">
              <div className="w-full h-full bg-background rounded-[32px] overflow-hidden">
                <img
                  src={appScreenshot}
                  alt="BookMyJunk App Screenshot"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to the original mockup UI
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback mockup (hidden by default) */}
                <div className="w-full h-full flex-col items-center justify-center text-center p-6" style={{ display: 'none' }}>
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
                    <Smartphone className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg">BookMyJunk</h3>
                  <p className="text-muted-foreground text-sm mt-2">India's #1 E-waste Recycling App</p>
                  <div className="mt-6 space-y-3 w-full">
                    <div className="bg-accent rounded-xl p-3 text-left">
                      <p className="text-xs font-medium text-accent-foreground">📍 Select Location</p>
                      <p className="text-xs text-muted-foreground">Mumbai, Maharashtra</p>
                    </div>
                    <div className="bg-accent rounded-xl p-3 text-left">
                      <p className="text-xs font-medium text-accent-foreground">📦 Items</p>
                      <p className="text-xs text-muted-foreground">2 Laptops, 3 Phones</p>
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-xl p-3 text-center">
                      <p className="text-sm font-semibold">Book Free Pickup →</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-float">
              FREE
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default AppDownloadSection;
