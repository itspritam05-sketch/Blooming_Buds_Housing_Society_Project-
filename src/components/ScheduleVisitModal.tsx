import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  QrCode, 
  Building,
  ArrowRight
} from 'lucide-react';
import { Property, User } from '../types';

interface ScheduleVisitModalProps {
  property: Property | null;
  currentUser: User | null;
  onClose: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  property,
  currentUser,
  onClose,
}) => {
  if (!property) return null;

  const [visitDate, setVisitDate] = useState('2025-03-02');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM');
  const [visitorName, setVisitorName] = useState(currentUser?.name || '');
  const [visitorPhone, setVisitorPhone] = useState(currentUser?.phone || '');
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top-Left Back Button */}
            <button
              id="visit-modal-back-btn"
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hidden xs:flex">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isScheduled ? 'Visitor Gate Pass Confirmed' : 'Schedule Free Physical Visit'}
              </h3>
              <p className="text-xs text-slate-400">Zero charges • Accompanied by Society Caretaker</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isScheduled ? (
          <form onSubmit={handleSchedule} className="py-6 space-y-4 text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <img src={property.images[0]} alt={property.title} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{property.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{property.societyName}, {property.area}</p>
                <p className="text-xs font-black text-emerald-600">₹{property.rent.toLocaleString()} / mo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Convenient Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                </select>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Society caretaker ({property.owner.name}) will meet you at the main security gate.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <span>Confirm Visit & Generate Gate Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Visit Scheduled Successfully!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Show this digital visitor pass to the security guard at Blooming Buds Main Gate.
              </p>
            </div>

            {/* Digital Gate Pass Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">DIGITAL GATE PASS</span>
                <span className="font-mono text-[10px] text-slate-400">PASS-BB-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Visitor:</span>
                <span className="font-bold">{visitorName} ({visitorPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="font-bold">{visitDate} • {timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Caretaker:</span>
                <span className="font-bold">{property.owner.name} ({property.owner.phone})</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
