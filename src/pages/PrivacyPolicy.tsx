import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const PrivacyPolicy = () => (
  <>
    <Navbar />
    <main className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: March 4, 2026</p>

          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you use BookMyJunk's services, we may collect personal information including your name, phone number, email address, and location details provided through our booking form or app. We also collect information about the e-waste items you wish to dispose of.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use your information to schedule and complete e-waste pickups, communicate with you about your requests, improve our services, and comply with environmental regulations. We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. All data transmission is encrypted using SSL/TLS protocols.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">4. Cookies & Analytics</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website uses cookies and Google Analytics to understand user behavior and improve our services. You can disable cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">5. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use third-party services such as Google Analytics, WhatsApp Business, and payment processors. These services have their own privacy policies governing the use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information. To exercise these rights, contact us at connectwithus@bookmyjunk.com or call +91 8976769851.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">7. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:<br />
                Email: <a href="mailto:connectwithus@bookmyjunk.com" className="text-primary hover:underline">connectwithus@bookmyjunk.com</a><br />
                Phone: <a href="tel:+918976769851" className="text-primary hover:underline">+91 8976769851</a><br />
                Address: Andheri (E), Mumbai, Maharashtra, India
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </>
);

export default PrivacyPolicy;
