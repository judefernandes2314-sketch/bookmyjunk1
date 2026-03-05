import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";


/**
 * ✏️ EASY TO UPDATE: Just add/remove objects below to change gallery images.
 * Use imported assets or external URLs.
 */
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    alt: "E-waste collection drive",
    caption: "Community E-Waste Collection Drive",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    alt: "Recycling facility",
    caption: "Our State-of-the-Art Recycling Facility",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    alt: "Electronic waste sorting",
    caption: "Certified E-Waste Sorting Process",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    alt: "Old electronics recycling",
    caption: "Giving Old Electronics a New Life",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    alt: "Circuit board recycling",
    caption: "Precision Circuit Board Recovery",
  },
  {
    src: "https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800&q=80",
    alt: "Team at work",
    caption: "Our Dedicated Pickup Team",
  },
];

const GallerySection = () => (
  <section id="gallery" className="py-28 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-2xl mx-auto mb-14"
      >
        <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
          Gallery
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
          Our Work in Pictures
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          A glimpse into how we collect, sort, and responsibly recycle e-waste across India.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="max-w-5xl mx-auto"
      >
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {galleryImages.map((img, i) => (
              <CarouselItem
                key={i}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-md aspect-[4/3]"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay with caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-primary-foreground font-display font-semibold text-sm drop-shadow-lg">
                      {img.caption}
                    </span>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-5 h-10 w-10 bg-card border-border shadow-lg hover:bg-accent" />
          <CarouselNext className="hidden md:flex -right-5 h-10 w-10 bg-card border-border shadow-lg hover:bg-accent" />
        </Carousel>
      </motion.div>
    </div>
  </section>
);

export default GallerySection;
