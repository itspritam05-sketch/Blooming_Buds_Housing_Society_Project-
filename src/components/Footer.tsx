import React, { useState } from 'react';
import { 
  Building, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { SOCIETY_LOGO_URL } from '../assets/logo';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onSelectCity: (city: string) => void;
  onOpenLogoModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectCity,
  onOpenLogoModal,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-slate-50 text-slate-700 pt-14 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Zero Brokerage</p>
              <p className="text-slate-500">Direct society allotment & verified owners</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">48hr Deposit Refund</p>
              <p className="text-slate-500">100% legal refund on checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">AI Stay Matcher</p>
              <p className="text-slate-500">Personalized smart commute matching</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">360° Society Tours</p>
              <p className="text-slate-500">Inspect rooms before physical visit</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <button
                id="footer-logo-img-btn"
                type="button"
                onClick={onOpenLogoModal}
                title="Click to maximize Blooming Buds logo image"
                className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 hover:ring-emerald-500 bg-white shadow-md flex items-center justify-center shrink-0 hover:scale-105 transition-all cursor-pointer group focus:outline-hidden"
              >
                <img
                  src={SOCIETY_LOGO_URL}
                  alt="Blooming Buds Housing Society"
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </button>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Blooming Buds <span className="text-emerald-600 font-light">Housing Society</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              Blooming Buds Housing Society is India's premium tech-enabled residential collective. We provide fully furnished PGs, co-living rooms, family apartments, and 1-day transit suites tailored for students, techies, and modern families.
            </p>

            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Society Helpline: +91 1800 200 4545 (24x7)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>allotment@bloomingbuds.in</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Central HQ: Blooming Buds Tower, Viman Nagar, Pune 411014</span>
              </p>
            </div>
          </div>

          {/* Col 2: Accommodations */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Stay Categories</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => onSelectCategory('Co-Living')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Executive Co-Living
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('PG')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Student PGs & Hostels
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Flat')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  1 BHK & 2 BHK Flats
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Apartment')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Luxury Gated Apartments
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('One-Day Stay')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  1-Day Transit Suites
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Metro Cities */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Metro Society Hubs</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => onSelectCity('Pune')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Pune (Hinjewadi & Viman Nagar)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('Bengaluru')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Bengaluru (Indiranagar & Whitefield)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('Mumbai')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Mumbai (Powai & Bandra West)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('Hyderabad')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Hyderabad (Hitec City & Gachibowli)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('Gurgaon')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Gurgaon (CyberHub & Golf Course)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCity('Delhi')} className="hover:text-emerald-600 transition-colors cursor-pointer text-left">
                  Delhi (North Campus DU & Saket)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Early Allotment Alerts</h4>
            <p className="text-slate-600">
              Get notified when new zero-deposit rooms open up in your preferred tech park or college radius.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You're on the priority list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-emerald-500 text-xs shadow-2xs"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Join Society Priority List
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Blooming Buds Housing Society Collective. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-600">
            <span className="hover:text-emerald-700 cursor-pointer">Society Bylaws</span>
            <span className="hover:text-emerald-700 cursor-pointer">Rental Agreement Terms</span>
            <span className="hover:text-emerald-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-emerald-700 cursor-pointer">RERA Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
