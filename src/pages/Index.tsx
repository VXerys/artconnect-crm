import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Stats from "@/components/landing/Stats";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";
import { useLayoutEffect } from "react";

const Index = () => {
  // Scroll ke top saat halaman di-refresh
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Unified Background Glows - Fixed position untuk seamless effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Primary glow - top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Secondary glow - middle left */}
        <div className="absolute top-[40%] -left-[200px] w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        
        {/* Tertiary glow - middle right */}
        <div className="absolute top-[60%] -right-[200px] w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-3xl" />
        
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <Stats />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
