import React from 'react';
import { Users, Building, ShieldCheck, Star, Award, HeartHandshake } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '18,500+',
      label: 'Happy Residents',
      subtext: 'Students & Working Pros',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Building,
      value: '140+',
      label: 'Society Wings & Towers',
      subtext: 'Across 6 Major Metro Hubs',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Verified Society Units',
      subtext: 'Zero Fake Listings Guarantee',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: Star,
      value: '4.88 / 5',
      label: 'Resident Satisfaction',
      subtext: 'Over 4,200 Verified Reviews',
      color: 'from-rose-500 to-pink-600'
    }
  ];

  return (
    <div className="py-12 bg-emerald-900/5 dark:bg-slate-900/40 border-y border-emerald-100/50 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md shrink-0`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {stat.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
