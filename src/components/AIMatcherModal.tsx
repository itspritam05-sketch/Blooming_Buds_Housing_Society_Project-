import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Sparkles, 
  Send, 
  Bot, 
  Building, 
  CheckCircle2, 
  MapPin, 
  IndianRupee, 
  ArrowRight, 
  RefreshCw, 
  Star,
  GraduationCap,
  Briefcase,
  Users,
  Home
} from 'lucide-react';
import { Property } from '../types';
import { api } from '../services/api';

interface AIMatcherModalProps {
  properties: Property[];
  onClose: () => void;
  onSelectProperty: (property: Property) => void;
  onBookNow: (property: Property) => void;
}

export const AIMatcherModal: React.FC<AIMatcherModalProps> = ({
  properties,
  onClose,
  onSelectProperty,
  onBookNow,
}) => {
  const [profile, setProfile] = useState('IT / Tech Professional');
  const [city, setCity] = useState('Pune');
  const [budget, setBudget] = useState(18000);
  const [propertyType, setPropertyType] = useState('Co-Living');
  const [commuteTo, setCommuteTo] = useState('Hinjewadi / Viman Nagar');
  const [preferences, setPreferences] = useState('High-speed WiFi, AC, food included, quiet environment');
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    recommendations: { propertyId: string; matchScore: number; reason: string }[];
    summary: string;
  } | null>(null);

  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await api.getAIRecommendations({
        userProfile: profile,
        budget,
        location: city,
        propertyType,
        commuteTo,
        preferences
      });
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchedProperty = (id: string): Property | undefined => {
    return properties.find(p => p.id === id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-purple-200 dark:border-purple-900/50 shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top-Left Back Button */}
            <button
              id="ai-matcher-back-btn"
              onClick={() => {
                if (results) setResults(null);
                else onClose();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md hidden xs:flex">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Buds AI Property Matcher
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                AI powered recommendations based on your preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form or Results View */}
        {!results ? (
          <form onSubmit={handleMatchSubmit} className="py-6 space-y-5">
            
            {/* Persona Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                I am looking as a:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'IT / Tech Professional', label: 'Tech Professional', icon: Briefcase },
                  { id: 'Student / Fresher', label: 'College Student', icon: GraduationCap },
                  { id: 'Family / Couple', label: 'Family / Couple', icon: Users },
                  { id: 'Business / Transit Traveler', label: 'Transit Traveler', icon: Home }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProfile(item.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      profile === item.id
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-600 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* City & Commute */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Target City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Commute Destination (Office / College / Landmark)
                </label>
                <input
                  type="text"
                  value={commuteTo}
                  onChange={(e) => setCommuteTo(e.target.value)}
                  placeholder="e.g. Hinjewadi Phase 1, EON IT Park, IIT, CyberHub"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Budget & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Max Monthly Rent
                  </label>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                    ₹{budget.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={1000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Preferred Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="Co-Living">Co-Living Space</option>
                  <option value="PG">PG / Student Hostel</option>
                  <option value="Flat">1BHK / 2BHK Flat</option>
                  <option value="Apartment">Luxury Apartment</option>
                  <option value="One-Day Stay">One-Day Stay</option>
                </select>
              </div>
            </div>

            {/* Specific Preferences */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Lifestyle & Amenities Requirements
              </label>
              <textarea
                rows={2}
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. Vegetarian food, air conditioner, 100Mbps wifi for work-from-home, gym, balcony"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini AI is analyzing society residences...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Compatibility Match</span>
                </>
              )}
            </button>

          </form>
        ) : (
          /* RESULTS VIEW */
          <div className="py-6 space-y-6">
            
            {/* AI Summary Banner */}
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 leading-relaxed flex items-start gap-3">
              <Bot className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-purple-800 dark:text-purple-300">AI Concierge Analysis</p>
                <p className="mt-1">{results.summary}</p>
              </div>
            </div>

            {/* Matched Property Cards */}
            <div className="space-y-4">
              {results.recommendations.map((rec, i) => {
                const prop = getMatchedProperty(rec.propertyId);
                if (!prop) return null;

                return (
                  <div
                    key={prop.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:border-purple-500 transition-all text-left"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-16 h-16 rounded-2xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {prop.propertyType}
                            </span>
                            <span className="text-xs text-slate-400">{prop.area}, {prop.city}</span>
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                            {prop.title}
                          </h4>
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            ₹{prop.rent.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">({prop.rentType})</span>
                          </p>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-center shadow-xs shrink-0">
                        <span className="text-[10px] font-bold uppercase block text-purple-200">Match Score</span>
                        <span className="text-base font-black">{rec.matchScore}%</span>
                      </div>
                    </div>

                    {/* AI Reasoning Text */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-purple-600 dark:text-purple-400">Why this fits: </span>
                      {rec.reason}
                    </div>

                    {/* Action Row */}
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          onSelectProperty(prop);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200"
                      >
                        View Residence
                      </button>

                      <button
                        onClick={() => {
                          onBookNow(prop);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs flex items-center gap-1"
                      >
                        <span>Reserve Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setResults(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Modify Search Parameters</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
