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
    <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
      {/* Premium Background System */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gallery">
        {/* Grain/Noise Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.03] z-[1]" />
        
        {/* Mesh Gradient Bloom Effects */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Top Primary Glow */}
          <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] 
            bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/15 via-primary/5 to-transparent blur-[120px] rounded-full animate-glow-pulse" />
          
          {/* Left Side Accent Bloom */}
          <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] 
            bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-orange-600/5 to-transparent blur-[100px] rounded-full" />
          
          {/* Right Side Cool Bloom */}
          <div className="absolute top-[40%] -right-[15%] w-[60%] h-[60%] 
            bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/5 via-violet-600/2 to-transparent blur-[110px] rounded-full opacity-60" />
          
          {/* Bottom Center Support Bloom */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] 
            bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-[130px] rounded-full" />
          
          {/* Dynamic Floating Mesh Orbs */}
          <div className="absolute top-[15%] left-[15%] w-64 h-64 bg-primary/10 rounded-full blur-[90px] animate-pulse" />
          <div className="absolute top-[65%] right-[20%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
        </div>
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
