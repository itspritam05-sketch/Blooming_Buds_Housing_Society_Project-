import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Building, 
  ShieldCheck, 
  Download, 
  Printer, 
  Calendar, 
  IndianRupee, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Lock, 
  FileText,
  Clock,
  LogIn,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, Booking, User } from '../types';

interface BookingModalProps {
  property: Property | null;
  currentUser: User | null;
  onClose: () => void;
  onBookingSuccess: (newBooking: Booking) => void;
  onRequireAuth?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  property,
  currentUser,
  onClose,
  onBookingSuccess,
  onRequireAuth,
}) => {
  if (!property) return null;

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [checkInDate, setCheckInDate] = useState('2025-03-01');
  const [stayMonths, setStayMonths] = useState(property.propertyType === 'One-Day Stay' ? 1 : 6);
  const [guestsCount, setGuestsCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('BLOOMFIRST');
  const [couponApplied, setCouponApplied] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'Netbanking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);

  // Financial Calculations
  const isDaily = property.propertyType === 'One-Day Stay';
  const baseRent = property.rent * (isDaily ? stayMonths : 1);
  const deposit = isDaily ? 0 : property.depositAmount;
  const maintenance = isDaily ? 0 : property.maintenanceCharges;
  const discount = couponApplied ? Math.round(baseRent * 0.10) : 0;
  const subtotal = baseRent + deposit + maintenance - discount;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const totalPayable = subtotal + tax;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newBooking: Booking = {
        id: `BK-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.images[0],
        propertyType: property.propertyType,
        societyName: property.societyName,
        address: `${property.area}, ${property.city}`,
        city: property.city,
        userId: currentUser?.id || `usr-${Date.now()}`,
        userName,
        userEmail,
        userPhone,
        checkIn: checkInDate,
        checkOut: isDaily ? 'Next Day' : `${stayMonths} Months`,
        guestsCount,
        stayDuration: isDaily ? `${stayMonths} Days` : `${stayMonths} Months`,
        rentType: property.rentType,
        baseRent,
        depositAmount: deposit,
        maintenanceAmount: maintenance,
        discountAmount: discount,
        taxAmount: tax,
        totalAmount: totalPayable,
        paymentStatus: 'Paid',
        paymentMethod,
        transactionId: `TXN-BB-${Date.now().toString().slice(-8)}`,
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'Confirmed',
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        specialRequests
      };

      setCompletedBooking(newBooking);
      setStep('confirmed');
      onBookingSuccess(newBooking);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 1400);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top-Left Back Button */}
            <button
              id="booking-modal-back-btn"
              onClick={() => {
                if (step === 'payment') setStep('details');
                else onClose();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hidden xs:flex">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {step === 'confirmed' ? 'Booking Confirmed!' : 'Reserve Blooming Buds Residence'}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400">Zero Brokerage Guarantee • Direct Society Allotment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Gate: If not logged in, require sign in first */}
        {!currentUser ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Sign In Required to Book
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To guarantee zero-brokerage society allotment and generate your verified tenancy agreement, please sign in or create an account first.
              </p>
            </div>

            {/* Property brief */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  {property.propertyType} • {property.rentType}
                </span>
                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {property.title}
                </p>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                  ₹{property.rent.toLocaleString()} {isDaily ? '/ day' : '/ month'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => {
                  onRequireAuth ? onRequireAuth() : onClose();
                }}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <>
        {/* STEP 1: Details & Dates */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="py-6 space-y-6">
            
            {/* Property Summary Card */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="text-left flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  {property.propertyType} • {property.rentType}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {property.title}
                </h4>
                <p className="text-xs text-slate-500 truncate">
                  {property.area}, {property.city}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  ₹{property.rent.toLocaleString()}
                </span>
                <p className="text-[10px] text-slate-400">
                  {isDaily ? '/ day' : '/ month'}
                </p>
              </div>
            </div>

            {/* Resident Contact Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Primary Resident Information
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Stay Duration & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Check-in Move Date</label>
                <input
                  type="date"
                  required
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  {isDaily ? 'Number of Days' : 'Initial Agreement Duration'}
                </label>
                <select
                  value={stayMonths}
                  onChange={(e) => setStayMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {isDaily ? (
                    <>
                      <option value={1}>1 Day Stay</option>
                      <option value={2}>2 Days Stay</option>
                      <option value={3}>3 Days Stay</option>
                      <option value={7}>1 Week</option>
                    </>
                  ) : (
                    <>
                      <option value={1}>1 Month (Flexible)</option>
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months (Recommended)</option>
                      <option value={11}>11 Months Standard Lease</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">Number of Guests</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>

            {/* Special Request */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">Special Preferences (Optional)</label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Vegetarian floor preferred, parking space for 2-wheeler, early check-in"
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            {/* Coupon Code */}
            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Coupon: {couponCode} (10% First Booking Off)
                </span>
              </div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                -₹{discount.toLocaleString()}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>First Month Rent</span>
                <span>₹{baseRent.toLocaleString()}</span>
              </div>
              {deposit > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Refundable Security Deposit</span>
                  <span>₹{deposit.toLocaleString()}</span>
                </div>
              )}
              {maintenance > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Society Maintenance</span>
                  <span>₹{maintenance.toLocaleString()}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Special Society Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>GST (5%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>Total Amount Payable Now</span>
                <span className="text-emerald-600 dark:text-emerald-400">₹{totalPayable.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment Gateway</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

        {/* STEP 2: Razorpay / Stripe Payment Gateway Simulator */}
        {step === 'payment' && (
          <div className="py-6 space-y-6">
            
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Payment Gateway Total</p>
                <p className="text-2xl font-black text-emerald-400">₹{totalPayable.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  256-BIT ENCRYPTED
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Razorpay / Stripe Secured</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Payment Mode
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
                  { id: 'Debit Card', label: 'Debit Card', icon: CreditCard },
                  { id: 'Netbanking', label: 'Net Banking', icon: Building }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-600 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <pm.icon className="w-5 h-5" />
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI View */}
            {paymentMethod === 'UPI' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <div className="w-40 h-40 mx-auto rounded-2xl bg-white p-3 shadow-md flex flex-col items-center justify-center border">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=bloomingbuds@upi&pn=BloomingBudsSociety&am=${totalPayable}&cu=INR`}
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Scan with GPay, PhonePe, Paytm, or BHIM UPI
                </p>
                <p className="text-[11px] text-slate-400">UPI ID: bloomingbuds@icici</p>
              </div>
            )}

            {/* Card View */}
            {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4532 •••• •••• 8892"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Valid Thru</label>
                    <input
                      type="text"
                      defaultValue="08/29"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="782"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep('details')}
                className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Back
              </button>

              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="flex-1 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Verifying Banking Confirmation...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Payment of ₹{totalPayable.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Booking Confirmed & Official Tax Invoice */}
        {step === 'confirmed' && completedBooking && (
          <div className="py-6 space-y-6 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Booking Successfully Confirmed!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your society allotment pass and legal rental invoice have been generated.
              </p>
            </div>

            {/* Official Society Tax Invoice Card */}
            <div id="printable-invoice" className="p-6 rounded-3xl bg-white dark:bg-slate-800 text-left border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-base text-emerald-700 dark:text-emerald-400">
                      Blooming Buds Housing Society
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">GSTIN: 27AABCB1234F1Z8 • Reg No: MH/PUN/2018/8892</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-white">INVOICE</p>
                  <p className="text-[10px] font-mono text-emerald-600">{completedBooking.invoiceNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Allotted To</p>
                  <p className="font-bold text-slate-900 dark:text-white">{completedBooking.userName}</p>
                  <p className="text-slate-500">{completedBooking.userPhone}</p>
                  <p className="text-slate-500">{completedBooking.userEmail}</p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Property Details</p>
                  <p className="font-bold text-slate-900 dark:text-white truncate">{completedBooking.propertyTitle}</p>
                  <p className="text-slate-500">{completedBooking.address}</p>
                  <p className="text-slate-500">Move-in: {completedBooking.checkIn}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span>Base Rent ({completedBooking.stayDuration})</span>
                  <span>₹{completedBooking.baseRent.toLocaleString()}</span>
                </div>
                {completedBooking.depositAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Security Deposit (Refundable)</span>
                    <span>₹{completedBooking.depositAmount.toLocaleString()}</span>
                  </div>
                )}
                {completedBooking.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-₹{completedBooking.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST Taxes</span>
                  <span>₹{completedBooking.taxAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-extrabold text-sm text-slate-900 dark:text-white">
                  <span>Total Paid (via {completedBooking.paymentMethod})</span>
                  <span className="text-emerald-600 dark:text-emerald-400">₹{completedBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
                <span>Transaction ID: {completedBooking.transactionId}</span>
                <span className="text-emerald-600 font-bold">Status: ALLOTMENT VERIFIED ✓</span>
              </div>
            </div>

            {/* Invoice Print / Download Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePrintInvoice}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Tax Invoice</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
              >
                Close & Return to Browse
              </button>
            </div>

          </div>
        )}
        </>
        )}

      </div>
    </div>
  );
};
