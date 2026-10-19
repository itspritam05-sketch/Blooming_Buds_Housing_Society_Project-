import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Send, 
  Phone, 
  ShieldCheck, 
  Check, 
  Building 
} from 'lucide-react';
import { Property, User } from '../types';

interface ChatWithOwnerModalProps {
  property: Property | null;
  currentUser: User | null;
  onClose: () => void;
}

export const ChatWithOwnerModal: React.FC<ChatWithOwnerModalProps> = ({
  property,
  currentUser,
  onClose,
}) => {
  if (!property) return null;

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'owner'; text: string; time: string }>>([
    {
      sender: 'owner',
      text: `Hello ${currentUser?.name || 'there'}! I am ${property.owner.name}, caretaker of ${property.societyName}. How can I assist you with this ${property.propertyType}?`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { sender: 'user' as const, text: inputText, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'owner',
          text: `Thanks for asking! Yes, this unit is completely verified and available for immediate move-in. Would you like to schedule a physical tour or shall I send you the floor video on WhatsApp?`,
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full h-[520px] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-emerald-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Top-Left Back Button */}
            <button
              id="chat-modal-back-btn"
              onClick={onClose}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all font-bold text-xs shadow-2xs group shrink-0 cursor-pointer"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-bold text-xs">Back</span>
            </button>

            <img
              src={property.owner.avatar}
              alt={property.owner.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1">
                <h4 className="font-extrabold text-sm">{property.owner.name}</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <p className="text-[10px] text-emerald-200">
                Caretaker • {property.societyName} • Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${property.owner.phone}`}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-2xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to caretaker..."
            className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
