import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  Download,
  Building,
  Sparkles
} from 'lucide-react';
import { SOCIETY_LOGO_URL } from '../assets/logo';

interface LogoModalProps {
  onClose: () => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({ onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div 
      id="logo-maximized-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="logo-maximized-container"
        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top-Left Back Button */}
            <button
              id="logo-modal-back-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Go Back"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                Blooming Buds Insignia
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 hidden xs:inline-block">
                Official Emblem
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.75}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 disabled:opacity-30 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-1.5 text-[11px] font-bold text-slate-500 min-w-[40px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 disabled:opacity-30 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 cursor-pointer ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              id="logo-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Maximized Image Viewer Canvas */}
        <div className="p-6 sm:p-10 flex-1 overflow-auto flex items-center justify-center bg-radial from-slate-100 to-slate-200/90 dark:from-slate-800/80 dark:to-slate-950 min-h-[320px] sm:min-h-[420px]">
          <div 
            className="transition-transform duration-200 ease-out flex items-center justify-center select-none"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="p-4 sm:p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl ring-8 ring-emerald-500/10 border border-slate-200/80 dark:border-slate-700 max-w-sm sm:max-w-md">
              <img
                src={SOCIETY_LOGO_URL}
                alt="Blooming Buds Housing Society Official Emblem"
                className="w-full h-auto object-contain rounded-2xl shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Details & Info */}
        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Blooming Buds Housing Society</strong> — Verified Registered Residential Collective
            </span>
          </div>
          <a
            href={SOCIETY_LOGO_URL}
            download="blooming-buds-logo.jpg"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200/60 dark:border-emerald-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save Image</span>
          </a>
        </div>
      </div>
    </div>
  );
};
