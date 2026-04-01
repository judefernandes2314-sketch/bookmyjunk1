import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { resolveImageUrl, type BlogPost } from "@/lib/blog-api";
import { setHomeScrollTarget } from "@/lib/scroll-utils";

const BlogSection = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const base = "https://api.jambologos.com";
      try {
        const featuredRes = await fetch(`${base}/api/blog/homepage`);
        const featured: BlogPost[] = featuredRes.ok ? await featuredRes.json() : [];

        const ensureThree = async (seed: BlogPost[]) => {
          const unique = new Map<string, BlogPost>();
          for (const p of seed) unique.set(p.slug, p);
          if (unique.size >= 3) return Array.from(unique.values()).slice(0, 3);

          const latestRes = await fetch(`${base}/api/blog`);
          const latest: BlogPost[] = latestRes.ok ? await latestRes.json() : [];
          for (const p of latest) unique.set(p.slug, p);
          return Array.from(unique.values()).slice(0, 3);
        };

        const finalPosts = featured.length
          ? await ensureThree(featured)
          : await ensureThree([]);

        setPosts(finalPosts);
      } catch {
        try {
          const latestRes = await fetch(`${base}/api/blog`);
          const latest: BlogPost[] = latestRes.ok ? await latestRes.json() : [];
          setPosts(latest.slice(0, 3));
        } catch {
          setPosts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase">Blog</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold text-foreground">
            Latest Articles
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Tips, guides, and news on responsible e-waste recycling.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border animate-pulse">
                <div className="h-48 bg-muted rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border hover:shadow-lg transition-all group overflow-hidden flex flex-col h-full"
              >
                <Link to={`/blog/${post.slug}`} className="flex flex-col h-full">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={resolveImageUrl(post.image) || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.publish_date
                          ? new Date(post.publish_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : ""}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <span className="mt-auto pt-4 inline-flex items-center text-primary text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                      Read Article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/blog"
            onClick={() => setHomeScrollTarget("blog")}
            className="inline-flex items-center gap-2 border border-primary/60 text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
          >
            View All Articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
