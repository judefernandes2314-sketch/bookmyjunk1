import { motion } from "framer-motion";

const videos = [
  {
    title: "How BookMyJunk Recycles E-Waste Responsibly",
    description: "See our eco-friendly e-waste disposal process from doorstep collection to certified recycling.",
    embedUrl: "https://www.youtube.com/embed/Q5sd300ct3E",
  },
  {
    title: "BookMyJunk — Featured on National Media",
    description: "Our e-waste management solutions recognized as best e-waste recycler in India.",
    embedUrl: "https://www.youtube.com/embed/QnVrUpl1QjE",
  },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const VideosSection = () => (
  <section id="videos" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">Watch</span>
        <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
          See Us in Action
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Watch how our electronic waste pickup service works and why leading brands trust us.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
      >
        {videos.map((v) => (
          <motion.div
            key={v.title}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group bg-card rounded-2xl overflow-hidden card-elevated border border-border"
          >
            <div className="aspect-video bg-muted relative overflow-hidden rounded-t-2xl">
              <iframe
                src={v.embedUrl}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display font-semibold text-lg text-card-foreground">{v.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{v.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default VideosSection;
