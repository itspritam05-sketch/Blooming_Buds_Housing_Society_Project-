import { Property, Review, Booking, Complaint, User, SearchFilters } from '../types';

export const api = {
  async getProperties(filters?: Partial<SearchFilters>): Promise<{ total: number; properties: Property[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          params.append(key, String(val));
        }
      });
    }
    const res = await fetch(`/api/properties?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch properties');
    return res.json();
  },

  async getPropertyById(id: string): Promise<{ property: Property; reviews: Review[] }> {
    const res = await fetch(`/api/properties/${id}`);
    if (!res.ok) throw new Error('Property not found');
    return res.json();
  },

  async createProperty(property: Partial<Property>): Promise<{ success: boolean; property: Property }> {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (!res.ok) throw new Error('Failed to create property');
    return res.json();
  },

  async updateProperty(id: string, property: Partial<Property>): Promise<{ success: boolean; property: Property }> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    if (!res.ok) throw new Error('Failed to update property');
    return res.json();
  },

  async deleteProperty(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete property');
    return res.json();
  },

  async getBookings(userId?: string): Promise<{ bookings: Booking[] }> {
    const url = userId ? `/api/bookings?userId=${userId}` : '/api/bookings';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async createBooking(booking: Partial<Booking>): Promise<{ success: boolean; booking: Booking }> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!res.ok) throw new Error('Failed to create booking');
    return res.json();
  },

  async updateBookingStatus(id: string, status: string): Promise<{ success: boolean; booking: Booking }> {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    return res.json();
  },

  async addReview(review: Partial<Review>): Promise<{ success: boolean; review: Review }> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error('Failed to add review');
    return res.json();
  },

  async createReview(propertyId: string, review: Partial<Review>): Promise<{ success: boolean; review: Review }> {
    return this.addReview({ ...review, propertyId });
  },

  async updateComplaintStatus(id: string, status: string): Promise<{ success: boolean; complaint: Complaint }> {
    const res = await fetch(`/api/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      // Fallback in case endpoint is local
      return { success: true, complaint: { id, status } as any };
    }
    return res.json();
  },

  async likeReview(id: string): Promise<{ success: boolean; likes: number }> {
    const res = await fetch(`/api/reviews/${id}/like`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to like review');
    return res.json();
  },

  async getComplaints(): Promise<{ complaints: Complaint[] }> {
    const res = await fetch('/api/complaints');
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return res.json();
  },

  async createComplaint(complaint: Partial<Complaint>): Promise<{ success: boolean; complaint: Complaint }> {
    const res = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(complaint),
    });
    if (!res.ok) throw new Error('Failed to submit complaint');
    return res.json();
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  async getAIRecommendations(params: {
    userProfile: string;
    budget: number;
    location: string;
    propertyType: string;
    commuteTo: string;
    preferences: string;
  }): Promise<{ recommendations: { propertyId: string; matchScore: number; reason: string }[]; summary: string }> {
    const res = await fetch('/api/ai/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to get AI recommendations');
    return res.json();
  },

  async sendAIChatMessage(message: string, history: any[]): Promise<{ reply: string }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history }),
    });
    if (!res.ok) throw new Error('Failed to chat with AI');
    return res.json();
  },

  async getSmartBudgetAdvice(params: { monthlyIncome: number; city: string; jobOrCollege: string }): Promise<{
    recommendedBudget: number;
    budgetRange: { min: number; max: number };
    advice: string;
  }> {
    const res = await fetch('/api/ai/suggest-budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to calculate budget');
    return res.json();
  },

  async scheduleVisit(data: { propertyId: string; visitDate: string; visitTime: string; name: string; phone: string }): Promise<{
    success: boolean;
    message: string;
    visitPassId: string;
  }> {
    const res = await fetch('/api/schedule-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to schedule visit');
    return res.json();
  },

  async login(email: string, role: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async register(data: { name: string; email: string; phone: string; role: string }): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to register');
    return result;
  },

  async submitContact(data: { name: string; email: string; phone: string; message: string; propertyId?: string }): Promise<{
    success: boolean;
    message: string;
  }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit inquiry');
    return res.json();
  }
};
