import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Trees, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Sun, 
  Eye, 
  ArrowRight,
  Maximize2,
  CheckCircle2,
  HeartHandshake,
  Waves,
  Zap,
  Star
} from 'lucide-react';
import { SOCIETY_HERO_IMAGE } from '../assets/societyMedia';
import { SOCIETY_LOGO_URL } from '../assets/logo';

interface SocietyShowcaseBannerProps {
  onExploreStays?: () => void;
  onOpenMap?: () => void;
  onOpenLogoModal?: () => void;
}

export const SocietyShowcaseBanner: React.FC<SocietyShowcaseBannerProps> = ({
  onExploreStays,
  onOpenMap,
  onOpenLogoModal,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [activeView, setActiveView] = useState<'campus' | 'amenities' | 'green'>('campus');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax transform calculation
  const parallaxOffset = Math.min(Math.max(scrollY * 0.12, 0), 120);

  const societyHighlights = [
    {
      title: 'Botanical Zen Gardens',
      desc: '3.5 acres of tree-lined walking avenues & flowering lotus ponds',
      icon: Trees,
      tag: 'Eco-Living',
      color: 'emerald'
    },
    {
      title: 'Biometric Smart Access',
      desc: '24x7 triple-tier security with RFID barrier & CCTV coverage',
      icon: ShieldCheck,
      tag: '100% Safe',
      color: 'teal'
    },
    {
      title: 'Olympic Infinity Pool',
      desc: 'Temperature-controlled swimming & multi-sport clubhouse',
      icon: Waves,
      tag: 'Recreation',
      color: 'blue'
    },
    {
      title: 'Zero Power Cut Grid',
      desc: '100% solar backed green power with high-speed fiber internet',
      icon: Zap,
      tag: 'Smart Society',
      color: 'amber'
    }
  ];

  return (
    <section className="relative w-full overflow-hidden my-6 sm:my-10">
      {/* Full-width aesthetic visual container */}
      <div className="relative w-full min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950">
        
        {/* Parallax Background Image */}
        <div 
          className="absolute inset-0 w-full h-[125%] -top-[10%] pointer-events-none transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translate3d(0, ${parallaxOffset}px, 0) scale(1.05)`,
          }}
        >
          <img
            src={SOCIETY_HERO_IMAGE}
            alt="Blooming Buds Housing Society Panoramic View"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Multi-layered cinematic gradients for readability and smooth aesthetic scroll */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/50" />
        </div>

        {/* Ambient floating glow circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Fullscreen Zoom Overlay Trigger */}
        <button
          onClick={() => setIsFullscreenPreview(true)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
          title="View Full High-Resolution Campus Photo"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Expand View</span>
        </button>

        {/* Content Box with High Contrast Glass Cards */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col justify-between h-full">
          
          {/* Top Pill & Society Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              id="society-banner-logo-btn"
              type="button"
              onClick={onOpenLogoModal}
              title="Click to maximize Blooming Buds insignia"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 hover:border-white/40 text-white text-xs font-bold shadow-lg transition-all cursor-pointer group text-left"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/60 bg-white shrink-0 group-hover:scale-110 transition-transform">
                <img
                  src={SOCIETY_LOGO_URL}
                  alt="Blooming Buds Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="tracking-wide">Blooming Buds Housing Society • Master-Planned Collective</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </button>

            {/* Quick Rating Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold">4.92 / 5</span>
              <span className="text-slate-300 font-light">• 3,400+ Resident Reviews</span>
            </div>
          </div>

          {/* Center Main Headline */}
          <div className="max-w-3xl text-left my-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              A Serene Botanical Haven <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
                Crafted for Modern Living
              </span>
            </h2>
            
            <p className="mt-3.5 text-sm sm:text-base text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow-xs">
              Experience thoughtfully designed flats, executive co-living rooms, and premium studio suites surrounded by lush gardens, world-class amenities, and 24x7 gated security with zero brokerage.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                id="showcase-explore-btn"
                onClick={() => {
                  if (onExploreStays) {
                    onExploreStays();
                  } else {
                    const el = document.getElementById('explore-listings-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-slate-950" />
                <span>Explore Society Accommodations</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenMap && (
                <button
                  id="showcase-map-btn"
                  onClick={onOpenMap}
                  className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-emerald-300" />
                  <span>View Society Map</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Society Highlights Grid (Glass Floating Cards) */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {societyHighlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 text-emerald-300 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      {item.tag}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Fullscreen Photo Modal */}
      {isFullscreenPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsFullscreenPreview(false)}
        >
          <div 
            className="relative max-w-6xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFullscreenPreview(false)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <img
              src={SOCIETY_HERO_IMAGE}
              alt="Blooming Buds Housing Society High-Res"
              className="w-full h-auto max-h-[80vh] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 sm:p-6 bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold">Blooming Buds Housing Society — Panoramic Campus View</h3>
                <p className="text-xs text-slate-400 mt-0.5">High-rise residential towers, manicured botanical avenues & executive club</p>
              </div>
              <button
                onClick={() => {
                  setIsFullscreenPreview(false);
                  const el = document.getElementById('explore-listings-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 cursor-pointer"
              >
                View Stays Here →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
