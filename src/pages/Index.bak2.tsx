import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import StatsSection from "@/components/StatsSection";
import BookingForm from "@/components/BookingForm";
import PromoBanner from "@/components/PromoBanner";
import ImageCarousel from "@/components/ImageCarousel";
import AppDownloadSection from "@/components/AppDownloadSection";
import VideosSection from "@/components/VideosSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import EcoWarriorsSection from "@/components/EcoWarriorsSection";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getAndClearHomeScrollTarget, scrollToSection } from "@/lib/scroll-utils";

const Index = () => {
  useEffect(() => {
    // Check if we came back from a subpage and should scroll to a section
    const targetSection = getAndClearHomeScrollTarget();
    if (targetSection) {
      // Use a small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        scrollToSection(targetSection);
      }, 100);
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <VideosSection />   
        <CategoriesSection />
        <ImageCarousel />
        <StatsSection />
        <BookingForm />
        <AppDownloadSection />
        <FAQSection />
        <BlogSection />
        <EcoWarriorsSection />
        <PromoBanner />
      </main>
      <Footer />
      <StickyBottomCTA />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
