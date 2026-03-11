import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, User, Clock } from "lucide-react";
import DOMPurify from "dompurify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogSEO from "@/components/BlogSEO";
import { getPostBySlug, resolveImageUrl, type BlogPost as BlogPostType } from "@/lib/blog-api";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug).then((p) => {
      setPost(p);
      setLoading(false);
    });
    // Track view
    const API_BASE = import.meta.env.VITE_API_URL || "";
    if (API_BASE) {
      fetch(`${API_BASE}/api/blog/view/${slug}`, { method: "POST" }).catch(() => {});
    }
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-24 bg-background min-h-screen">
          <div className="container mx-auto px-4 max-w-3xl animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-64 bg-muted rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-24 bg-background min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <Link to="/blog" className="text-primary font-medium hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const readingTime = Math.max(1, Math.round(post.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 220));

  return (
    <>
      <Navbar />
      <BlogSEO post={post} />

      {/* Hero image */}
      <div className="pt-24 container mx-auto px-4 max-w-3xl">
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-2xl object-cover max-h-[420px]"
        />
      </div>

      <main className="pb-24 bg-background min-h-screen">
        <article className="container mx-auto px-4 max-w-3xl mt-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Blog
            </Link>

            {/* Title card */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10 card-elevated mb-10">
              <h1 className="text-3xl md:text-[2.5rem] font-display font-bold text-foreground leading-[1.2] tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary/60" /> {post.author}
                </span>
                {post.publish_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary/60" />
                    {new Date(post.publish_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary/60" /> {readingTime} min read
                </span>
              </div>

              {post.excerpt && (
                <p className="mt-5 text-muted-foreground text-[1.05rem] leading-relaxed border-l-4 border-primary/30 pl-5 italic">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Article body */}
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />

            {/* Bottom nav */}
            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> All Articles
              </Link>
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
