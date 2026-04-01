import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const targetSection = sessionStorage.getItem("homeScrollTarget");
    if (!targetSection) return;

    sessionStorage.removeItem("homeScrollTarget");

    const intervalId = window.setInterval(() => {
      const el = document.getElementById(targetSection);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.clearInterval(intervalId);
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [location.state?._scrollTrigger]);

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
