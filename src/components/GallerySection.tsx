import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import BMJ_1 from "@/assets/Book-my-junk-ewaste-collection.webp";
import BMJ_2 from "@/assets/book-my-junk-electronic-waste-van.webp";
import BMJ_3 from "@/assets/book-my-junk-ewaste-collection-staff.webp";
import BMJ_4 from "@/assets/book-my-junk-ewaste-collection-van.webp";


/**
 * ✏️ EASY TO UPDATE: Just add/remove objects below to change gallery images.
 * Use imported assets or external URLs.
 */
/**
 * ✏️ HOW TO UPDATE GALLERY IMAGES:
 * 1. Drop your new image into src/assets/gallery/
 * 2. Import it below
 * 3. Add an entry to the galleryImages array
 */
const galleryImages = [
  { src: BMJ_1, alt: "E-waste collection drive", caption: "Community E-Waste Collection Drive" },
  { src: BMJ_2, alt: "Electronic waste van", caption: "Our Fleet Ready for Pickup" },
  { src: BMJ_3, alt: "E-waste collection staff", caption: "Our Dedicated Pickup Team" },
  { src: BMJ_4, alt: "E-waste collection van", caption: "Certified E-Waste Collection" },
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
        className="max-w-7xl mx-auto"
      >
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {galleryImages.map((img, i) => (
              <CarouselItem
                key={i}
                className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
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
