import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const blogPosts = [
  {
    title: "How to Recycle Old Electronics Safely in India",
    excerpt: "A comprehensive guide on how to recycle old electronics responsibly. Learn where to dispose old computers, recycle mobile phones, and more.",
    date: "2026-02-20",
    readTime: "5 min",
    category: "Guide",
    slug: "how-to-recycle-old-electronics",
  },
  {
    title: "Why E-Waste Disposal Services in India Are Critical",
    excerpt: "India generates 3.2 million tonnes of e-waste annually. Discover why eco-friendly e-waste disposal matters and how certified recyclers are making a difference.",
    date: "2026-02-15",
    readTime: "7 min",
    category: "Industry",
    slug: "e-waste-disposal-services-india",
  },
  {
    title: "Best E-Waste Recycler in Mumbai: What to Look For",
    excerpt: "Finding the best e-waste recycler in your city? Here's a checklist to identify certified e-waste recycling companies you can trust.",
    date: "2026-02-10",
    readTime: "4 min",
    category: "Tips",
    slug: "best-e-waste-recycler-mumbai",
  },
  {
    title: "E-Waste Collection Centre Near Me: Your Complete Guide",
    excerpt: "Don't know where to find an e-waste collection centre near you? BookMyJunk's doorstep e-waste collection removes the hassle entirely.",
    date: "2026-02-05",
    readTime: "4 min",
    category: "Guide",
    slug: "e-waste-collection-centre-near-me",
  },
  {
    title: "Corporate E-Waste Management: IT Asset Disposition Best Practices",
    excerpt: "For businesses looking for electronic scrap recycling service and safe disposal of e-waste, here's how to manage your IT assets responsibly.",
    date: "2026-01-28",
    readTime: "6 min",
    category: "Business",
    slug: "corporate-e-waste-management",
  },
  {
    title: "Sell Old Electronics for Recycling: Get Value from Your E-Waste",
    excerpt: "Did you know you can sell old electronics for recycling? Learn how BookMyJunk's buyback program works and turn your junk into value.",
    date: "2026-01-20",
    readTime: "3 min",
    category: "Tips",
    slug: "sell-old-electronics-recycling",
  },
];

const categoryColors: Record<string, string> = {
  Guide: "bg-primary/10 text-primary",
  Industry: "bg-secondary/20 text-secondary-foreground",
  Tips: "bg-accent text-accent-foreground",
  Business: "bg-muted text-muted-foreground",
};

const Blog = () => (
  <>
    <Navbar />
    <main className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">Blog</span>
          <h1 className="mt-3 text-3xl md:text-5xl font-display font-bold text-foreground">
            E-Waste Insights & Guides
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Stay informed about responsible e-waste recycling, eco-friendly disposal tips, and industry news.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border card-elevated hover:card-elevated transition-all group cursor-pointer overflow-hidden"
            >
              <div className="h-40 bg-accent/50 flex items-center justify-center">
                <span className="text-4xl">♻️</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category] || ""}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>
                <h2 className="font-display font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Blog;
