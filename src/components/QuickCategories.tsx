import React from 'react';
import { 
  Building, 
  Home, 
  Users, 
  Clock, 
  Hotel, 
  Sparkles, 
  Briefcase, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { PropertyType } from '../types';

interface QuickCategoriesProps {
  onSelectCategory: (category: PropertyType | 'All') => void;
  selectedCategory: PropertyType | 'All';
}

export const QuickCategories: React.FC<QuickCategoriesProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categories = [
    {
      id: 'All',
      name: 'All Properties',
      count: '26+ Stays',
      description: 'Explore full Blooming Buds catalog',
      icon: Building,
      badge: 'Popular',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
      borderHover: 'hover:border-emerald-500'
    },
    {
      id: 'Co-Living',
      name: 'Co-Living Suites',
      count: 'Fully Furnished',
      description: 'Workstations, High-Speed WiFi & Community',
      icon: Users,
      badge: 'For Techies',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      borderHover: 'hover:border-blue-500'
    },
    {
      id: 'PG',
      name: 'PGs & Hostels',
      count: 'Cot / Room Basis',
      description: 'Home-cooked food, laundry & housekeeping',
      icon: GraduationCap,
      badge: 'Students & Freshers',
      bgGradient: 'from-amber-500/10 to-yellow-500/10',
      borderHover: 'hover:border-amber-500'
    },
    {
      id: 'Flat',
      name: 'Flats & 1/2/3 BHK',
      count: 'Flat Basis',
      description: 'Spacious modern homes for families & friends',
      icon: Home,
      badge: 'Family & Pros',
      bgGradient: 'from-teal-500/10 to-emerald-500/10',
      borderHover: 'hover:border-teal-500'
    },
    {
      id: 'Apartment',
      name: 'Luxury Apartments',
      count: 'Gated Society',
      description: 'Clubhouse, Swimming pool, EV chargers & Gym',
      icon: Sparkles,
      badge: 'Premium Living',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderHover: 'hover:border-purple-500'
    },
    {
      id: 'One-Day Stay',
      name: '1-Day Transit Stays',
      count: 'Daily Booking',
      description: 'Business trips, interviews & visitor transit',
      icon: Clock,
      badge: 'Zero Deposit',
      bgGradient: 'from-rose-500/10 to-orange-500/10',
      borderHover: 'hover:border-rose-500'
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored Accommodations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Designed For Every Lifestyle
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Pick the stay model that fits your budget, duration, and living preferences.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1.5 self-start md:self-end"
          >
            <span>View all inventory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                id={`cat-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onSelectCategory(cat.id as any)}
                className={`cursor-pointer p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 shadow-md'
                    : `bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 ${cat.borderHover} hover:shadow-md hover:-translate-y-0.5`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200/60 dark:border-slate-700 flex items-center justify-center ${isSelected ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-200'} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {cat.badge}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400 opacity-0 group-hover:opacity-100'} transition-opacity`} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
