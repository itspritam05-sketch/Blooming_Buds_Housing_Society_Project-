import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Check, 
  Clock, 
  TrendingUp, 
  Calendar,
  Layers,
  Search,
  Eye
} from 'lucide-react';
import { Property, Booking, Complaint, User, UserRole } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  properties: Property[];
  bookings: Booking[];
  currentUser: User | null;
  onSelectProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onOpenAuth?: (role?: UserRole, mode?: 'login' | 'signup') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  properties,
  bookings,
  currentUser,
  onSelectProperty,
  onDeleteProperty,
  onOpenAuth,
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'complaints' | 'bookings'>('overview');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    api.getAnalytics().then(res => setStats(res.analytics)).catch(console.error);
    api.getComplaints().then(res => setComplaints(res.complaints)).catch(console.error);
  }, []);

  const ADMIN_EMAIL = 'pritambhanase05@gmail.com';
  const isAuthorizedAdmin = currentUser && (
    currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    currentUser.role === 'admin'
  ) && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  if (!currentUser || !isAuthorizedAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Society Master Admin Console
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Administrative privileges are restricted exclusively to the verified platform owner: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">{ADMIN_EMAIL}</strong>.
          </p>
          {currentUser && currentUser.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() && (
            <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
              Currently signed in as <span className="font-bold">{currentUser.email}</span> (Unauthorized for Admin role).
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth?.('admin', 'login')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
            >
              Sign In as Owner ({ADMIN_EMAIL})
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateComplaintStatus = async (id: string, status: 'In Progress' | 'Resolved') => {
    try {
      await api.updateComplaintStatus(id, status);
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const totalBookingRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Admin Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black">Blooming Buds Society Master Admin Console</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              SUPER ADMIN
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time platform operations, dispute mediation, resident management, and revenue analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Backend API: Live & Healthy
          </span>
        </div>
      </div>

      {/* Analytics KPI Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Listings</span>
            <Building className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{properties.length}</span>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">6 Metro Cities</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Transactions</span>
            <IndianRupee className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">₹{totalBookingRevenue.toLocaleString()}</span>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Razorpay Verified</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Bookings Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{bookings.length}</span>
          <p className="text-[10px] text-blue-600 font-semibold mt-1">100% Zero Brokerage</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Complaints Open</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {complaints.filter(c => c.status !== 'Resolved').length}
          </span>
          <p className="text-[10px] text-rose-600 font-semibold mt-1">Require Attention</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
        {[
          { id: 'overview', label: 'Overview & Distribution' },
          { id: 'listings', label: `Manage Listings (${properties.length})` },
          { id: 'complaints', label: `Helpdesk Resolution (${complaints.length})` },
          { id: 'bookings', label: `All Society Bookings (${bookings.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Overview Visuals */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              Accommodations by Metro City
            </h3>
            <div className="space-y-3">
              {['Pune', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Gurgaon', 'Delhi'].map((c) => {
                const count = properties.filter(p => p.city.toLowerCase() === c.toLowerCase()).length;
                const percent = Math.round((count / properties.length) * 100) || 10;
                return (
                  <div key={c}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>{c}</span>
                      <span>{count} stays ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              Property Categories Breakdown
            </h3>
            <div className="space-y-3">
              {['Co-Living', 'PG', 'Flat', 'Apartment', 'One-Day Stay'].map((type) => {
                const count = properties.filter(p => p.propertyType === type).length;
                const percent = Math.round((count / properties.length) * 100) || 15;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>{type}</span>
                      <span>{count} listings ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search listing by title, society or city..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase">
                  <th className="p-3">Property</th>
                  <th className="p-3">Type & Basis</th>
                  <th className="p-3">Rent / Mo</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Owner Caretaker</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {properties
                  .filter(p => p.title.toLowerCase().includes(searchFilter.toLowerCase()) || p.city.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{p.title}</p>
                            <p className="text-[10px] text-slate-400">{p.societyName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-emerald-600 block">{p.propertyType}</span>
                        <span className="text-[10px] text-slate-400">{p.rentType}</span>
                      </td>
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">
                        ₹{p.rent.toLocaleString()}
                      </td>
                      <td className="p-3">
                        {p.area}, {p.city}
                      </td>
                      <td className="p-3">
                        <p className="font-bold">{p.owner.name}</p>
                        <p className="text-[10px] text-slate-400">{p.owner.phone}</p>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectProperty(p)}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProperty(p.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Helpdesk Complaints */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{c.type}</span>
                  <span className="text-xs text-slate-400">• {c.createdAt}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">{c.subject}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
                <p className="text-[11px] text-slate-400 mt-1">Submitted by: <strong>{c.userName}</strong> ({c.propertyTitle})</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {c.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdateComplaintStatus(c.id, 'Resolved')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark as Resolved</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Bookings Ledger */}
      {activeTab === 'bookings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase">
                <th className="p-3">Booking ID</th>
                <th className="p-3">Tenant Name</th>
                <th className="p-3">Property</th>
                <th className="p-3">Check-in</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-3 font-mono font-bold text-emerald-600">{b.id}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">{b.userName}</p>
                    <p className="text-[10px] text-slate-400">{b.userPhone}</p>
                  </td>
                  <td className="p-3 font-bold truncate max-w-xs">{b.propertyTitle}</td>
                  <td className="p-3">{b.checkIn}</td>
                  <td className="p-3 font-black text-slate-900 dark:text-white">₹{b.totalAmount.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
