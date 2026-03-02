import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CategoriesSection from "@/components/CategoriesSection";
import StatsSection from "@/components/StatsSection";
import BookingForm from "@/components/BookingForm";
import AppDownloadSection from "@/components/AppDownloadSection";
import VideosSection from "@/components/VideosSection";
import FAQSection from "@/components/FAQSection";
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
        <StatsSection />
        <BookingForm />
        <AppDownloadSection />
        <FAQSection />
        
      </main>
      <Footer />
      <StickyBottomCTA />
      <WhatsAppFloat />
    </>
  );
};

export default Index;
