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
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
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
        <PromoBanner />
      </main>
      <Footer />
      <StickyBottomCTA />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
