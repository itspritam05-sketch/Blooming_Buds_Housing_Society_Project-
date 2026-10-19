import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  ShieldCheck, 
  User, 
  Building, 
  Mail, 
  Lock, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';
import { api } from '../services/api';
import { SOCIETY_LOGO_URL } from '../assets/logo';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  initialRole?: UserRole;
  initialMode?: 'login' | 'signup';
  onOpenLogoModal?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  initialRole = 'customer',
  initialMode = 'login',
  onOpenLogoModal,
}) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'signup');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_OWNER_EMAIL = 'pritambhanase05@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetEmail = (email || (role === 'owner' ? ADMIN_OWNER_EMAIL : role === 'admin' ? ADMIN_OWNER_EMAIL : 'aarav.patel@example.com')).trim().toLowerCase();

    // Client validation for owner & admin roles
    if ((role === 'admin' || role === 'owner') && targetEmail !== ADMIN_OWNER_EMAIL.toLowerCase()) {
      setLoading(false);
      setError(`Access Restricted: Only the verified owner (${ADMIN_OWNER_EMAIL}) is permitted to log in as ${role === 'admin' ? 'Society Administrator' : 'Property Owner'}.`);
      return;
    }

    try {
      if (isRegister) {
        const res = await api.register({
          name: name || (role === 'admin' ? 'Pritam Bhanase (Owner & Admin)' : role === 'owner' ? 'Pritam Bhanase (Owner)' : 'Aarav Patel'),
          email: targetEmail,
          phone: phone || '+91 98200 11223',
          role
        });
        onLoginSuccess(res.user);
      } else {
        const res = await api.login(targetEmail, role);
        onLoginSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (selectedRole: UserRole) => {
    setLoading(true);
    setError('');
    try {
      const emailMap: Record<UserRole, string> = {
        customer: 'aarav.patel@example.com',
        owner: ADMIN_OWNER_EMAIL,
        admin: ADMIN_OWNER_EMAIL
      };
      const res = await api.login(emailMap[selectedRole], selectedRole);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Top-Left Back Button */}
            <button
              id="auth-modal-back-btn"
              type="button"
              onClick={() => {
                if (isRegister) {
                  setIsRegister(false);
                } else {
                  onClose();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title={isRegister ? "Back to Sign In" : "Back"}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <button
              type="button"
              onClick={onOpenLogoModal}
              title="Click to maximize logo"
              className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 bg-white shadow-xs flex items-center justify-center shrink-0 hover:scale-105 hover:ring-emerald-500 transition-all cursor-pointer group"
            >
              <img
                src={SOCIETY_LOGO_URL}
                alt="Blooming Buds Housing Society"
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                referrerPolicy="no-referrer"
              />
            </button>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {isRegister ? 'Create Resident Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-slate-500">Blooming Buds Housing Society</p>
            </div>
          </div>

          <button
            id="auth-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mt-4">
          <button
            id="auth-tab-login"
            type="button"
            onClick={() => setIsRegister(false)}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              !isRegister
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            id="auth-tab-signup"
            type="button"
            onClick={() => setIsRegister(true)}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isRegister
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Quick Demo Access Pills */}
        <div className="my-4 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-2 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>1-Click Instant Demo Login:</span>
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              id="demo-login-customer"
              type="button"
              onClick={() => handleQuickDemoLogin('customer')}
              className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 shadow-2xs hover:bg-emerald-100 transition-colors"
            >
              Resident
            </button>
            <button
              id="demo-login-owner"
              type="button"
              onClick={() => handleQuickDemoLogin('owner')}
              className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200/50 shadow-2xs hover:bg-teal-100 transition-colors"
            >
              Owner
            </button>
            <button
              id="demo-login-admin"
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="px-2 py-1.5 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 shadow-2xs hover:bg-slate-100 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
            I am a:
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {(['customer', 'owner', 'admin'] as const).map((r) => (
              <button
                key={r}
                id={`role-select-${r}`}
                type="button"
                onClick={() => {
                  setRole(r);
                  setError('');
                }}
                className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  role === r
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {r === 'customer' ? 'Resident' : r === 'owner' ? 'Owner' : 'Admin'}
              </button>
            ))}
          </div>

          {(role === 'admin' || role === 'owner') && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Owner Security Restriction:</strong> {role === 'admin' ? 'Administrator' : 'Property Owner'} privileges are exclusively granted to <strong>pritambhanase05@gmail.com</strong>.
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'admin' ? 'Pritam Bhanase (Owner & Admin)' : role === 'owner' ? 'Pritam Bhanase (Owner)' : 'e.g. Aarav Patel'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'owner' || role === 'admin' ? 'pritambhanase05@gmail.com' : 'user@example.com'}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-emerald-500"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Mobile Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-phone-input"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              id="auth-form-back-btn"
              type="button"
              onClick={() => {
                if (isRegister) {
                  setIsRegister(false);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
              title={isRegister ? "Back to Sign In" : "Cancel and Go Back"}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Toggle Register/Login */}
        <div className="mt-4 text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                id="auth-switch-to-login"
                type="button"
                onClick={() => setIsRegister(false)}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Blooming Buds?{' '}
              <button
                id="auth-switch-to-signup"
                type="button"
                onClick={() => setIsRegister(true)}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
