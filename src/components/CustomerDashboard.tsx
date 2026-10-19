import React, { useState } from 'react';
import { 
  User as UserIcon, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  Plus, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Building, 
  ShieldCheck, 
  CreditCard,
  FileText,
  AlertCircle
} from 'lucide-react';
import { User, Booking, Property, Complaint, UserRole } from '../types';
import { api } from '../services/api';

interface CustomerDashboardProps {
  currentUser: User | null;
  bookings: Booking[];
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onCancelBooking: (bookingId: string) => void;
  onOpenAuth?: (role?: UserRole, mode?: 'login' | 'signup') => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  bookings,
  savedProperties,
  onSelectProperty,
  onCancelBooking,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'complaints' | 'saved' | 'profile'>('bookings');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newComplaintSubject, setNewComplaintSubject] = useState('');
  const [newComplaintType, setNewComplaintType] = useState<'Maintenance' | 'Security' | 'Billing' | 'Other'>('Maintenance');
  const [newComplaintDesc, setNewComplaintDesc] = useState('');
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  React.useEffect(() => {
    api.getComplaints().then(res => setComplaints(res.complaints)).catch(console.error);
  }, []);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resident Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Please log in or create a resident account to manage your room allotments, raise maintenance requests, download rent invoices, and access saved society listings.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth?.('customer', 'login')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth?.('customer', 'signup')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintSubject || !newComplaintDesc) return;

    try {
      const res = await api.createComplaint({
        userId: currentUser.id,
        userName: currentUser.name,
        propertyTitle: bookings[0]?.propertyTitle || 'Blooming Buds Housing Society',
        type: newComplaintType,
        subject: newComplaintSubject,
        description: newComplaintDesc,
        priority: 'Medium'
      });
      setComplaints(prev => [res.complaint, ...prev]);
      setShowComplaintForm(false);
      setNewComplaintSubject('');
      setNewComplaintDesc('');
      alert('Support ticket created! The society caretaker will attend to it within 2 hours.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/30 border border-emerald-400 text-emerald-200">
                KYC VERIFIED RESIDENT ✓
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">{currentUser.email} • {currentUser.phone}</p>
            <p className="text-[11px] text-emerald-300/80 mt-1">Resident ID: {currentUser.id} • Member Since {currentUser.createdAt}</p>
          </div>
        </div>

        {/* Quick Resident Stats */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[90px]">
            <span className="text-xl font-black block">{bookings.length}</span>
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Bookings</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[90px]">
            <span className="text-xl font-black block">{savedProperties.length}</span>
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'bookings', label: 'My Active Stays & Invoices', icon: Calendar, count: bookings.length },
          { id: 'complaints', label: 'Society Helpdesk & Tickets', icon: AlertCircle, count: complaints.length },
          { id: 'saved', label: 'Saved Wishlist', icon: Heart, count: savedProperties.length },
          { id: 'profile', label: 'Resident Profile & KYC', icon: UserIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: Bookings & Invoices */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No Bookings Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Browse our verified society listings and reserve your stay in minutes.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={b.propertyImage}
                    alt={b.propertyTitle}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                      <span className="text-xs font-mono text-slate-400">ID: {b.id}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {b.propertyTitle}
                    </h3>
                    <p className="text-xs text-slate-500">{b.address}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-300">
                      <span><strong>Move-in:</strong> {b.checkIn}</span>
                      <span>•</span>
                      <span><strong>Duration:</strong> {b.stayDuration}</span>
                      <span>•</span>
                      <span><strong>Rent Basis:</strong> {b.rentType}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      ₹{b.totalAmount.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-emerald-600 font-bold">Paid via {b.paymentMethod}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Invoice: {b.invoiceNumber}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>

                    {b.status === 'Confirmed' && (
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100"
                      >
                        Request Move-Out / Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Complaints & Helpdesk */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Society Helpdesk & Maintenance Requests
              </h3>
              <p className="text-xs text-slate-400">
                Log requests for plumbing, electricity, WiFi speed, AC service, or security
              </p>
            </div>

            <button
              onClick={() => setShowComplaintForm(!showComplaintForm)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Support Ticket</span>
            </button>
          </div>

          {showComplaintForm && (
            <form onSubmit={handleCreateComplaint} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">New Service Ticket</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Issue Category</label>
                  <select
                    value={newComplaintType}
                    onChange={(e) => setNewComplaintType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Maintenance">Maintenance & Servicing</option>
                    <option value="Security">Society Security / Gate Pass</option>
                    <option value="Billing">Rent & Deposit Billing</option>
                    <option value="Other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newComplaintSubject}
                    onChange={(e) => setNewComplaintSubject(e.target.value)}
                    placeholder="e.g. WiFi router reset required on 4th floor"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  required
                  value={newComplaintDesc}
                  onChange={(e) => setNewComplaintDesc(e.target.value)}
                  placeholder="Provide apartment room number and convenient time for technician visit..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{c.id}</span>
                    <span className="text-xs text-slate-400">• {c.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{c.subject}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                </div>

                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                  {c.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Saved Wishlist */}
      {activeTab === 'saved' && (
        <div>
          {savedProperties.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Heart className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No Saved Properties</h3>
              <p className="text-xs text-slate-500 mt-1">Tap the heart icon on any property card to save it for future reference.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProperty(p)}
                  className="cursor-pointer p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:border-emerald-500 transition-all"
                >
                  <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover rounded-2xl mb-3" />
                  <span className="text-[10px] font-bold text-emerald-600 uppercase">{p.propertyType} • {p.rentType}</span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">{p.title}</h4>
                  <p className="text-xs text-slate-500">{p.area}, {p.city}</p>
                  <div className="mt-3 flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-base font-black">₹{p.rent.toLocaleString()}</span>
                    <span className="text-xs font-bold text-emerald-600">View Details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Profile & KYC */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Resident Identity & KYC Details</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Legal Name</span>
              <span className="font-bold">{currentUser.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Primary Email</span>
              <span className="font-bold">{currentUser.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Contact Number</span>
              <span className="font-bold">{currentUser.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Aadhaar / Govt ID Verification</span>
              <span className="text-emerald-600 font-bold">Verified on File (UIDAI Verified ✓)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Permanent Address</span>
              <span className="font-bold">Pune, Maharashtra, India</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
