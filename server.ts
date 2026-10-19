import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PROPERTIES, INITIAL_REVIEWS } from './src/data/properties';
import { Property, Review, Booking, Complaint, User } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store seeded with initial properties
let properties: Property[] = [...INITIAL_PROPERTIES];
let reviews: Review[] = [...INITIAL_REVIEWS];
let bookings: Booking[] = [
  {
    id: 'BK-2025-001',
    propertyId: 'bb-pune-01',
    propertyTitle: 'Blooming Buds Grand Orchid Co-Living & Luxury PG',
    propertyImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    propertyType: 'Co-Living',
    societyName: 'Blooming Buds Housing Society - Orchid Heights',
    address: 'Plot 42, Viman Nagar, Pune',
    city: 'Pune',
    userId: 'usr-101',
    userName: 'Tanmay Bhattacharya',
    userEmail: 'tanmay.b@example.com',
    userPhone: '+91 98230 11223',
    checkIn: '2025-02-01',
    checkOut: '2025-07-31',
    guestsCount: 1,
    stayDuration: '6 Months',
    rentType: 'Cot Basis',
    baseRent: 9500,
    depositAmount: 10000,
    maintenanceAmount: 0,
    discountAmount: 950,
    taxAmount: 855,
    totalAmount: 19405,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    transactionId: 'UPI-BB-88992211',
    bookingDate: '2025-01-20',
    status: 'Confirmed',
    invoiceNumber: 'INV-2025-0089',
    specialRequests: 'Upper bunk preferred, vegetarian food preference.'
  },
  {
    id: 'BK-2025-002',
    propertyId: 'bb-blr-02',
    propertyTitle: 'Blooming Buds Palm 1-Day Executive Transit Suite',
    propertyImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    propertyType: 'One-Day Stay',
    societyName: 'Blooming Buds Housing Society - Palm Enclave',
    address: '100 Feet Road, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    userId: 'usr-105',
    userName: 'Akash Mehrotra',
    userEmail: 'akash.m@example.com',
    userPhone: '+91 98450 99887',
    checkIn: '2025-02-05',
    checkOut: '2025-02-07',
    guestsCount: 1,
    stayDuration: '2 Days',
    rentType: 'Room Basis',
    baseRent: 3700,
    depositAmount: 0,
    maintenanceAmount: 0,
    discountAmount: 370,
    taxAmount: 333,
    totalAmount: 3663,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    transactionId: 'CC-TXN-44556677',
    bookingDate: '2025-01-28',
    status: 'Confirmed',
    invoiceNumber: 'INV-2025-0104'
  }
];

let complaints: Complaint[] = [
  {
    id: 'CMP-101',
    userId: 'usr-101',
    userName: 'Tanmay Bhattacharya',
    propertyId: 'bb-pune-01',
    propertyTitle: 'Blooming Buds Grand Orchid Co-Living',
    type: 'Maintenance',
    subject: '3rd Floor Study Room AC servicing',
    description: 'The AC in the quiet study room is making a humming sound and cooling slowly.',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2025-01-26'
  }
];

const ADMIN_OWNER_EMAIL = 'pritambhanase05@gmail.com';

let users: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Pritam Bhanase (Owner & Admin)',
    email: 'pritambhanase05@gmail.com',
    phone: '+91 98220 12345',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    savedProperties: ['bb-pune-01', 'bb-pune-02', 'bb-blr-02'],
    createdAt: '2023-01-01'
  },
  {
    id: 'usr-customer-1',
    name: 'Aarav Patel (Resident)',
    email: 'aarav.patel@example.com',
    phone: '+91 98200 11223',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    isVerified: true,
    savedProperties: ['bb-pune-01'],
    createdAt: '2024-11-10'
  }
];

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', propertiesCount: properties.length, serverTime: new Date().toISOString() });
  });

  // Properties API
  app.get('/api/properties', (req, res) => {
    let filtered = [...properties];
    const {
      city,
      area,
      propertyType,
      bhk,
      furnishing,
      genderPreference,
      rentType,
      stayDuration,
      foodIncluded,
      parking,
      petsAllowed,
      wifi,
      ac,
      lift,
      balcony,
      ownerVerified,
      minPrice,
      maxPrice,
      minRating,
      query,
      sortBy
    } = req.query;

    if (city && typeof city === 'string' && city !== 'All') {
      filtered = filtered.filter(p => p.city.toLowerCase() === city.toLowerCase());
    }

    if (area && typeof area === 'string') {
      filtered = filtered.filter(p => p.area.toLowerCase().includes(area.toLowerCase()));
    }

    if (propertyType && typeof propertyType === 'string' && propertyType !== 'All') {
      filtered = filtered.filter(p => p.propertyType === propertyType);
    }

    if (bhk && typeof bhk === 'string' && bhk !== 'All') {
      filtered = filtered.filter(p => p.bhk === bhk);
    }

    if (furnishing && typeof furnishing === 'string' && furnishing !== 'All') {
      filtered = filtered.filter(p => p.furnishing === furnishing);
    }

    if (genderPreference && typeof genderPreference === 'string' && genderPreference !== 'All') {
      filtered = filtered.filter(p => p.genderPreference === genderPreference || p.genderPreference === 'Any');
    }

    if (rentType && typeof rentType === 'string' && rentType !== 'All') {
      filtered = filtered.filter(p => p.rentType === rentType);
    }

    if (stayDuration && typeof stayDuration === 'string' && stayDuration !== 'All') {
      filtered = filtered.filter(p => p.stayDuration.includes(stayDuration as any));
    }

    if (foodIncluded === 'true') {
      filtered = filtered.filter(p => p.foodIncluded || p.amenities.includes('food_included'));
    }

    if (parking === 'true') {
      filtered = filtered.filter(p => p.parking || p.amenities.includes('parking'));
    }

    if (petsAllowed === 'true') {
      filtered = filtered.filter(p => p.petsAllowed);
    }

    if (wifi === 'true') {
      filtered = filtered.filter(p => p.amenities.includes('wifi'));
    }

    if (ac === 'true') {
      filtered = filtered.filter(p => p.amenities.includes('ac'));
    }

    if (lift === 'true') {
      filtered = filtered.filter(p => p.amenities.includes('lift'));
    }

    if (balcony === 'true') {
      filtered = filtered.filter(p => p.balcony || p.amenities.includes('balcony'));
    }

    if (ownerVerified === 'true') {
      filtered = filtered.filter(p => p.owner.isVerified || p.isVerified);
    }

    if (minPrice) {
      filtered = filtered.filter(p => p.rent >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(p => p.rent <= Number(maxPrice));
    }

    if (minRating) {
      filtered = filtered.filter(p => p.rating >= Number(minRating));
    }

    if (query && typeof query === 'string' && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.societyName.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.nearbyLandmarks.colleges.some(c => c.toLowerCase().includes(q)) ||
        p.nearbyLandmarks.companies.some(c => c.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.rent - a.rent);
    } else if (sortBy === 'rating-desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // recommended / featured first
      filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
    }

    res.json({ total: filtered.length, properties: filtered });
  });

  app.get('/api/properties/:id', (req, res) => {
    const property = properties.find(p => p.id === req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    const propReviews = reviews.filter(r => r.propertyId === req.params.id);
    res.json({ property, reviews: propReviews });
  });

  app.post('/api/properties', (req, res) => {
    const newProperty: Property = {
      ...req.body,
      id: `bb-custom-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    properties.unshift(newProperty);
    res.status(201).json({ success: true, property: newProperty });
  });

  app.put('/api/properties/:id', (req, res) => {
    const index = properties.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }
    properties[index] = { ...properties[index], ...req.body };
    res.json({ success: true, property: properties[index] });
  });

  app.delete('/api/properties/:id', (req, res) => {
    const initialLen = properties.length;
    properties = properties.filter(p => p.id !== req.params.id);
    if (properties.length === initialLen) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ success: true, message: 'Property removed successfully' });
  });

  // Bookings API
  app.get('/api/bookings', (req, res) => {
    const { userId } = req.query;
    if (userId && typeof userId === 'string') {
      return res.json({ bookings: bookings.filter(b => b.userId === userId) });
    }
    res.json({ bookings });
  });

  app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;
    const newBooking: Booking = {
      ...bookingData,
      id: `BK-${new Date().getFullYear()}-${String(bookings.length + 1).padStart(3, '0')}`,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      transactionId: bookingData.transactionId || `TXN-BB-${Date.now().toString().slice(-8)}`
    };
    bookings.unshift(newBooking);
    res.status(201).json({ success: true, booking: newBooking });
  });

  app.patch('/api/bookings/:id/status', (req, res) => {
    const { status } = req.body;
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    booking.status = status;
    res.json({ success: true, booking });
  });

  // Reviews API
  app.get('/api/reviews/:propertyId', (req, res) => {
    const propReviews = reviews.filter(r => r.propertyId === req.params.propertyId);
    res.json({ reviews: propReviews });
  });

  app.post('/api/reviews', (req, res) => {
    const newReview: Review = {
      ...req.body,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      helpfulCount: 0,
      isVerifiedStay: true
    };
    reviews.unshift(newReview);

    // Recalculate property average rating
    const prop = properties.find(p => p.id === newReview.propertyId);
    if (prop) {
      const propRevs = reviews.filter(r => r.propertyId === prop.id);
      const totalScore = propRevs.reduce((acc, curr) => acc + curr.rating, 0);
      prop.rating = Number((totalScore / propRevs.length).toFixed(1));
      prop.reviewsCount = propRevs.length;
    }

    res.status(201).json({ success: true, review: newReview });
  });

  app.post('/api/reviews/:id/like', (req, res) => {
    const review = reviews.find(r => r.id === req.params.id);
    if (review) {
      review.likes += 1;
      return res.json({ success: true, likes: review.likes });
    }
    res.status(404).json({ error: 'Review not found' });
  });

  // Complaints API
  app.get('/api/complaints', (req, res) => {
    res.json({ complaints });
  });

  app.post('/api/complaints', (req, res) => {
    const newComplaint: Complaint = {
      ...req.body,
      id: `CMP-${Date.now().toString().slice(-4)}`,
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    complaints.unshift(newComplaint);
    res.status(201).json({ success: true, complaint: newComplaint });
  });

  app.patch('/api/complaints/:id/status', (req, res) => {
    const { status } = req.body;
    const cmp = complaints.find(c => c.id === req.params.id);
    if (!cmp) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    cmp.status = status;
    res.json({ success: true, complaint: cmp });
  });

  // Users & Auth API
  app.get('/api/users', (req, res) => {
    res.json({ users });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, role } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Strict Owner & Admin authorization check: Only the owner (pritambhanase05@gmail.com) can log in as owner or admin
    if ((role === 'admin' || role === 'owner') && cleanEmail !== ADMIN_OWNER_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: `Access Denied: Only the verified owner (${ADMIN_OWNER_EMAIL}) is authorized to log in as ${role === 'admin' ? 'Society Admin' : 'Property Owner'}.`
      });
    }

    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      // Auto-create user
      const isOwnerAdmin = cleanEmail === ADMIN_OWNER_EMAIL.toLowerCase();
      user = {
        id: `usr-${Date.now()}`,
        name: isOwnerAdmin ? 'Pritam Bhanase (Owner & Admin)' : cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '+91 98220 12345',
        role: isOwnerAdmin ? ((role as any) || 'admin') : ((role as any) || 'customer'),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
        savedProperties: [],
        createdAt: new Date().toISOString().split('T')[0]
      };
      users.push(user);
    } else {
      // Ensure owner gets selected role when logging in
      if (cleanEmail === ADMIN_OWNER_EMAIL.toLowerCase()) {
        user.role = (role as any) || 'admin';
        user.name = user.role === 'admin' ? 'Pritam Bhanase (Owner & Admin)' : 'Pritam Bhanase (Owner)';
      }
    }
    res.json({ success: true, user });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, role } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    // Strict Owner & Admin authorization check on registration
    if ((role === 'admin' || role === 'owner') && cleanEmail !== ADMIN_OWNER_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: `Access Denied: Only the verified owner (${ADMIN_OWNER_EMAIL}) is authorized to register with ${role === 'admin' ? 'Admin' : 'Owner'} privileges.`
      });
    }

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const isOwnerAdmin = cleanEmail === ADMIN_OWNER_EMAIL.toLowerCase();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: isOwnerAdmin ? 'Pritam Bhanase (Owner & Admin)' : name,
      email: cleanEmail,
      phone,
      role: isOwnerAdmin ? ((role as any) || 'admin') : (role || 'customer'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      savedProperties: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    res.status(201).json({ success: true, user: newUser });
  });

  // Analytics API for Owner & Admin Dashboards
  app.get('/api/analytics', (req, res) => {
    const totalProperties = properties.length;
    const totalBookings = bookings.length;
    const grossRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const avgRating = Number((properties.reduce((sum, p) => sum + p.rating, 0) / (totalProperties || 1)).toFixed(2));
    const occupancyRate = 88.5; // percentage

    const cityBreakdown = properties.reduce((acc: Record<string, number>, p) => {
      acc[p.city] = (acc[p.city] || 0) + 1;
      return acc;
    }, {});

    const typeBreakdown = properties.reduce((acc: Record<string, number>, p) => {
      acc[p.propertyType] = (acc[p.propertyType] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalProperties,
      totalBookings,
      grossRevenue,
      avgRating,
      occupancyRate,
      cityBreakdown,
      typeBreakdown,
      monthlyRevenue: [
        { month: 'Sep', revenue: 145000, bookings: 14 },
        { month: 'Oct', revenue: 198000, bookings: 19 },
        { month: 'Nov', revenue: 230000, bookings: 22 },
        { month: 'Dec', revenue: 310000, bookings: 28 },
        { month: 'Jan', revenue: 385000, bookings: 35 },
        { month: 'Feb', revenue: 420000, bookings: 41 }
      ]
    });
  });

  // AI Property Matcher & Recommendation via Gemini 3.7 Flash
  app.post('/api/ai/recommend', async (req, res) => {
    try {
      const { userProfile, budget, location, propertyType, commuteTo, preferences } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // High quality rule-based match fallback if Gemini API key not set
        const matches = properties
          .filter(p => {
            if (location && !p.city.toLowerCase().includes(location.toLowerCase()) && !p.area.toLowerCase().includes(location.toLowerCase())) {
              return false;
            }
            if (budget && p.rent > Number(budget) * 1.3) {
              return false;
            }
            return true;
          })
          .slice(0, 4);

        return res.json({
          recommendations: matches.map(m => ({
            propertyId: m.id,
            matchScore: Math.floor(88 + Math.random() * 11),
            reason: `Excellent match for your preferences in ${m.area}, ${m.city}. Fits within budget with verified owner security and premium amenities.`
          })),
          summary: `We found ${matches.length} top matching homes across Blooming Buds Housing Society that align with your lifestyle, budget, and commute requirements.`
        });
      }

      // Format properties for Gemini context
      const propertiesSummary = properties.map(p => ({
        id: p.id,
        title: p.title,
        type: p.propertyType,
        city: p.city,
        area: p.area,
        rent: p.rent,
        rentType: p.rentType,
        bhk: p.bhk,
        gender: p.genderPreference,
        foodIncluded: p.foodIncluded,
        amenities: p.amenities.slice(0, 8),
        landmarks: p.nearbyLandmarks
      }));

      const prompt = `You are the AI Housing Concierge for Blooming Buds Housing Society. 
The user is looking for an ideal accommodation.
User profile:
- Profile/Role: ${userProfile || 'Student / Working Professional'}
- Target Budget: ₹${budget || 'Any'}
- Target Location/City: ${location || 'Any'}
- Preferred Property Type: ${propertyType || 'Any'}
- Daily Commute Target: ${commuteTo || 'Flexible'}
- Special Preferences: ${preferences || 'Clean, safe, high-speed wifi'}

Available Properties in Blooming Buds Society:
${JSON.stringify(propertiesSummary, null, 2)}

Analyze the user's requirements against our properties and select the top 3-5 best matching property IDs.
Return your response STRICTLY as a valid JSON object in this format:
{
  "recommendations": [
    {
      "propertyId": "id-from-list",
      "matchScore": 95,
      "reason": "Clear concise 1-2 sentence explanation of why this property fits their budget, commute, and lifestyle."
    }
  ],
  "summary": "Warm 2-sentence encouraging summary from Blooming Buds Housing Society."
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an expert real-estate and rental advisor for Blooming Buds Housing Society. Always provide accurate, helpful property matching.'
        }
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      console.error('AI recommendation error:', error);
      // Fallback
      const topProps = properties.slice(0, 3);
      res.json({
        recommendations: topProps.map(p => ({
          propertyId: p.id,
          matchScore: 92,
          reason: `Prime verified stay in ${p.area}, ${p.city} with all modern amenities and zero brokerage.`
        })),
        summary: 'Here are our top recommended residences in Blooming Buds Housing Society based on your inquiry.'
      });
    }
  });

  // AI Chat Assistant ("Buds Concierge") with Intelligent Multi-Lingual Contextual Engine
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      const userQuery = (message || '').trim();
      const lowerQ = userQuery.toLowerCase();
      const ai = getGeminiClient();

      if (ai) {
        try {
          const propertiesContext = properties.slice(0, 10).map(p => ({
            id: p.id,
            title: p.title,
            type: p.propertyType,
            bhk: p.bhk,
            city: p.city,
            area: p.area,
            rent: p.rent,
            rentType: p.rentType,
            deposit: p.depositAmount,
            foodIncluded: p.foodIncluded,
            gender: p.genderPreference,
            landmarks: p.nearbyLandmarks,
            phone: p.owner.phone
          }));

          const systemInstruction = `You are 'Buds Concierge', the intelligent, friendly, and helpful AI assistant for Blooming Buds Housing Society.
You assist prospective tenants, students, families, and IT professionals in finding their ideal stay, answering questions about society rules, amenities, food/mess, rents, deposits, and scheduling visits.

We have properties in:
- Talegaon Dabhade (Pune District): Greenfield Boys PG (₹6,500 with food, near DY Patil & Station), Kasturi Girls PG (₹7,000 with food, near Nutan College & MIDC), Valley Mist 2BHK Society Flat (₹16,000), Smart Nest 1BHK (₹10,500), Highway Transit 1-Day Stay (₹1,450/day).
- Pune: Viman Nagar Co-Living (₹9,500), Hinjewadi 2BHK (₹28,000), Kothrud 1BHK (₹14,500), Baner 3BHK (₹38,000), Wakad Studio (₹12,000), Kharadi PG (₹8,500).
- Bengaluru (Koramangala, Indiranagar, Whitefield), Mumbai (Powai, Bandra, Andheri), Hyderabad (Gachibowli, Hitec City), Delhi & Gurgaon.

Society Core Rules:
1. Zero brokerage across all properties.
2. Transparent deposit refund guarantee within 48 hours of checkout.
3. 3-tier security (CCTV, Biometric gates, 24/7 Security guard).
4. Nutritious food included in PGs/Hostels (breakfast, lunch, dinner).

If the user writes in Hindi or Hinglish, reply warmly in Hinglish/Hindi. If in English, reply in English.
Keep answers structured, concise, and helpful with bullet points where appropriate.

Real Property Database:
${JSON.stringify(propertiesContext, null, 2)}`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: [
              ...(conversationHistory || []).map((h: any) => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              })),
              {
                role: 'user',
                parts: [{ text: userQuery }]
              }
            ],
            config: {
              systemInstruction,
              temperature: 0.7
            }
          });

          if (response.text && response.text.trim()) {
            return res.json({ reply: response.text });
          }
        } catch (geminiErr) {
          console.warn('Gemini API call failed, falling back to smart society NLP engine:', geminiErr);
        }
      }

      // Smart Contextual Society NLP Engine (Executes dynamically when offline or API key absent)
      let reply = '';

      // 1. Talegaon Dabhade specific questions
      if (lowerQ.includes('talegaon') || lowerQ.includes('dabhade') || lowerQ.includes('dy patil') || lowerQ.includes('nutan') || lowerQ.includes('somatane')) {
        reply = `🏡 **Blooming Buds Society — Talegaon Dabhade Stays:**\n\n` +
          `We have 5 prime verified accommodations in Talegaon Dabhade with zero brokerage:\n\n` +
          `1. **Blooming Buds Greenfield Executive Co-Living & Boys PG**\n` +
          `   • 💰 **Rent:** ₹6,500/mo (Cot Basis) | Deposit: ₹8,000\n` +
          `   • 🍱 **Food:** 3-time hygienic meals included | High-speed WiFi, Hot Water, Study Desk\n` +
          `   • 📍 **Location:** Station Road (0.7 km to Talegaon Station, 0.9 km to DY Patil College)\n\n` +
          `2. **Blooming Buds Kasturi Royal Girls PG & Hostel**\n` +
          `   • 💰 **Rent:** ₹7,000/mo (Cot Basis) | Deposit: ₹10,000\n` +
          `   • 🛡️ **Safety:** Biometric access, female warden, CCTV, 3 meals included\n` +
          `   • 📍 **Location:** Near Nutan Maharashtra Engineering College (0.5 km) & MIDC\n\n` +
          `3. **Valley Mist 2BHK Garden Society Flat**\n` +
          `   • 💰 **Rent:** ₹16,000/mo (Entire Flat) | Deposit: ₹35,000\n` +
          `   • 🛋️ **Furnishing:** Fully Furnished, Modular Kitchen, Society Clubhouse & Gym\n` +
          `   • 📍 **Location:** Somatane Phata / Old Mumbai-Pune Highway\n\n` +
          `4. **Smart Nest 1BHK Society Apartment**\n` +
          `   • 💰 **Rent:** ₹10,500/mo | Maratha Colony, Talegaon (Near Station & Hospital)\n\n` +
          `5. **Highway Transit 1-Day Stay Suite**\n` +
          `   • 💰 **Rent:** ₹1,450/day | AC, Smart TV, Free Breakfast (Opp. Toll Plaza)\n\n` +
          `Would you like to schedule a physical visit or book one of these options?`;
      }
      // 2. Girls PG / Hostel inquiries
      else if (lowerQ.includes('girl') || lowerQ.includes('female') || lowerQ.includes('ladies') || lowerQ.includes('mahila') || lowerQ.includes('ladki')) {
        reply = `🌸 **Girls PG & Hostels in Blooming Buds Housing Society:**\n\n` +
          `All our ladies residences feature 24/7 female wardens, biometric turnstiles, and zero-brokerage direct owner leases:\n\n` +
          `• **Talegaon Dabhade:** *Kasturi Royal Girls PG* — ₹7,000/mo (Food included, near Nutan & DY Patil)\n` +
          `• **Pune (Viman Nagar):** *Lotus Girls Hostel* — ₹8,800/mo (Food included, near Symbiosis Law Campus)\n` +
          `• **Bengaluru (Koramangala):** *Orchid Women Co-Living* — ₹11,000/mo (Near Sony World Signal)\n` +
          `• **Delhi (North Campus):** *Greenwood Girls Residence* — ₹9,500/mo (Near Hansraj & Hindu College)\n\n` +
          `All accommodations include 3 meals, daily housekeeping, RO water, and high-speed WiFi.`;
      }
      // 3. Boys PG / Hostel inquiries
      else if (lowerQ.includes('boy') || lowerQ.includes('bachelor') || lowerQ.includes('ladke') || lowerQ.includes('male')) {
        reply = `⚡ **Boys PGs & Hostels in Blooming Buds Housing Society:**\n\n` +
          `• **Talegaon Dabhade:** *Greenfield Boys PG* — ₹6,500/mo (Food included, 700m to Station, 900m to DY Patil)\n` +
          `• **Pune (Viman Nagar):** *Grand Orchid Co-Living* — ₹9,500/mo (Near Phoenix Mall & Symbiosis)\n` +
          `• **Pune (Hinjewadi):** *Tech Hub Boys PG* — ₹8,500/mo (Near Infosys & Wipro Phase 1)\n` +
          `• **Bengaluru (Whitefield):** *Silicon Co-Living* — ₹10,500/mo (Near ITPL)\n\n` +
          `Includes WiFi, 3 meals, laundry machine, gym access, and power backup.`;
      }
      // 4. One-Day Stay inquiries
      else if (lowerQ.includes('one-day') || lowerQ.includes('1 day') || lowerQ.includes('one day') || lowerQ.includes('transit') || lowerQ.includes('daily stay') || lowerQ.includes('1-day')) {
        reply = `🛎️ **1-Day Transit Suites & Guest Rooms:**\n\n` +
          `Ideal for business trips, interviews, parent college visits, and highway transit:\n\n` +
          `• **Talegaon Dabhade:** *Highway Transit Suite* — ₹1,450/day (AC, Smart TV, Free Breakfast, Opp. Toll Plaza)\n` +
          `• **Bengaluru (Indiranagar):** *Palm Executive Suite* — ₹1,850/day (Near 100 Ft Road)\n` +
          `• **Mumbai (Powai):** *Lakeview Transit Room* — ₹2,200/day (Near IIT Bombay & Hiranandani)\n\n` +
          `✨ **Features:** 24-hr check-in, attached private bathroom, fresh linen, toiletries, and high-speed WiFi. Zero security deposit required!`;
      }
      // 5. Flats (1BHK, 2BHK, 3BHK)
      else if (lowerQ.includes('flat') || lowerQ.includes('apartment') || lowerQ.includes('1bhk') || lowerQ.includes('2bhk') || lowerQ.includes('3bhk') || lowerQ.includes('family')) {
        reply = `🏢 **Society Flats & Apartments for Rent:**\n\n` +
          `• **Talegaon Dabhade (1 BHK):** *Smart Nest* — ₹10,500/mo (Semi-Furnished, Maratha Colony)\n` +
          `• **Talegaon Dabhade (2 BHK):** *Valley Mist* — ₹16,000/mo (Fully Furnished, Garden View)\n` +
          `• **Pune Hinjewadi (2 BHK):** *Flora High-Rise* — ₹28,000/mo (Opp. Infosys Circle)\n` +
          `• **Pune Kothrud (1 BHK):** *Greenfield Society* — ₹14,500/mo (Near MIT Kothrud)\n` +
          `• **Pune Baner (3 BHK):** *Crown Penthouse* — ₹38,000/mo (Near High Street)\n\n` +
          `All flats are inside gated Blooming Buds societies with 24/7 security, covered parking, and zero brokerage!`;
      }
      // 6. Food / Mess / Meals
      else if (lowerQ.includes('food') || lowerQ.includes('mess') || lowerQ.includes('khana') || lowerQ.includes('meal') || lowerQ.includes('breakfast') || lowerQ.includes('dinner') || lowerQ.includes('lunch') || lowerQ.includes('veg')) {
        reply = `🍲 **Food & Dining in Blooming Buds PGs & Co-Living:**\n\n` +
          `• **3-Times Daily Meals:** Fresh breakfast with tea/coffee, packed lunch (or hot lunch in mess), and multi-course dinner.\n` +
          `• **Hygienic Kitchens:** Prepared by certified resident chefs with filtered RO water.\n` +
          `• **Veg & Non-Veg:** Daily pure vegetarian spread with special non-veg / egg options available on Wednesdays & Sundays.\n` +
          `• **Kitchens in Flats:** Society flats (1BHK/2BHK) come with piped gas modular kitchens and refrigerators for personal cooking.`;
      }
      // 7. Security Deposit & Brokerage policies
      else if (lowerQ.includes('deposit') || lowerQ.includes('brokerage') || lowerQ.includes('refund') || lowerQ.includes('paisa') || lowerQ.includes('advance') || lowerQ.includes('hidden')) {
        reply = `🛡️ **Deposit & Zero Brokerage Policy:**\n\n` +
          `• **Zero Brokerage (₹0):** Direct owner-to-tenant lease agreements with no agent commissions.\n` +
          `• **Transparent Deposit:** Only 1 to 2 months rent equivalent for PGs (e.g. ₹8,000–₹10,000 in Talegaon).\n` +
          `• **Guaranteed Refund:** Security deposit is refunded to your bank/UPI within **48 hours of checkout** after physical room handover.\n` +
          `• **Official Digital Invoices:** Instant GST-compliant receipts and online payment tracking via UPI, Credit Card, or Net Banking.`;
      }
      // 8. Gate timings, Rules & Visits
      else if (lowerQ.includes('rule') || lowerQ.includes('gate') || lowerQ.includes('time') || lowerQ.includes('curfew') || lowerQ.includes('visit') || lowerQ.includes('schedule') || lowerQ.includes('caretaker')) {
        reply = `🔑 **Society Timings & Schedule Visit:**\n\n` +
          `• **Gate Timings:** PGs and Hostels close main gates at 10:30 PM (Talegaon) / 11:30 PM (Pune) with late night digital pass via caretaker.\n` +
          `• **Guests & Parents:** Visitor lounge on ground floor; parents stay rooms available on request.\n` +
          `• **Schedule a Visit:** Click 'Schedule Visit' on any listing to generate an instant gate pass, or call our resident society helpline at **+91 1800 200 4545** (9 AM to 8 PM daily).`;
      }
      // 9. Booking process
      else if (lowerQ.includes('book') || lowerQ.includes('rent kaise') || lowerQ.includes('process') || lowerQ.includes('apply') || lowerQ.includes('document')) {
        reply = `📝 **How to Book Your Stay in 3 Simple Steps:**\n\n` +
          `1. **Select Property:** Browse our Talegaon, Pune, Bengaluru, or Mumbai listings.\n` +
          `2. **Click 'Book Now':** Choose your check-in date, occupancy (Single/Double/Flat), and stay duration.\n` +
          `3. **Instant Confirmation:** Pay token amount via UPI/Card to lock your bed/flat and receive an instant digital society agreement.\n\n` +
          `📄 **Documents required:** Any Govt Photo ID (Aadhaar / Passport / College ID / Work ID).`;
      }
      // 10. General / Greeting / Other questions
      else {
        reply = `Namaste! 🙏 I am **Buds Concierge**, your AI assistant for **Blooming Buds Housing Society**.\n\n` +
          `How can I help you today? You can ask me:\n` +
          `• 📍 *"Show PGs & Flats in Talegaon Dabhade near DY Patil"* \n` +
          `• 💰 *"What is the rent for 1BHK / 2BHK in Pune?"*\n` +
          `• 👧 *"Show Girls PG with food included"* \n` +
          `• 🚗 *"Show 1-Day transit stays near highway"* \n` +
          `• 🛡️ *"Explain deposit refund guarantee & zero brokerage"* \n\n` +
          `Feel free to type in Hindi, Hinglish, or English!`;
      }

      res.json({ reply });
    } catch (error: any) {
      console.error('AI chat error:', error);
      res.json({
        reply: `Hello! I am Buds Concierge at Blooming Buds Housing Society. We have verified PGs, flats, co-living rooms, and one-day transit stays across Talegaon Dabhade, Pune, Bengaluru, and Mumbai with zero brokerage. How can I help your stay today?`
      });
    }
  });

  // Smart Budget & Commute Advisor via Gemini
  app.post('/api/ai/suggest-budget', async (req, res) => {
    try {
      const { monthlyIncome, city, targetArea, jobOrCollege } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        const incomeNum = Number(monthlyIncome) || 50000;
        const recommendedRent = Math.round(incomeNum * 0.30);
        return res.json({
          recommendedBudget: recommendedRent,
          budgetRange: { min: Math.round(incomeNum * 0.20), max: Math.round(incomeNum * 0.35) },
          advice: `Following the standard 30% financial rule of thumb, spending around ₹${recommendedRent.toLocaleString()} on rent in ${city || 'your city'} gives optimal balance between comfort, amenities, and savings.`
        });
      }

      const prompt = `Calculate and advise on an optimal rental budget for:
- Monthly Income / Allowance: ₹${monthlyIncome}
- Target City: ${city || 'Pune / Bengaluru'}
- Location / College / Job: ${jobOrCollege || targetArea || 'IT Park'}

Provide response as JSON with fields:
{
  "recommendedBudget": number,
  "budgetRange": { "min": number, "max": number },
  "advice": "Financial breakdown and advice for accommodation types (e.g. Co-Living vs 1BHK vs PG)."
}`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      res.json(parsed);
    } catch (err) {
      res.json({
        recommendedBudget: 15000,
        budgetRange: { min: 10000, max: 20000 },
        advice: 'We recommend allocating 25-30% of your income for rent to enjoy high quality amenities with security.'
      });
    }
  });

  // Contact Form API
  app.post('/api/contact', (req, res) => {
    const { name, email, phone, message, propertyId } = req.body;
    console.log('Contact inquiry received:', { name, email, phone, message, propertyId });
    res.json({ success: true, message: 'Thank you! The Blooming Buds society manager will contact you within 15 minutes.' });
  });

  // Schedule Visit API
  app.post('/api/schedule-visit', (req, res) => {
    const { propertyId, visitDate, visitTime, name, phone } = req.body;
    res.json({
      success: true,
      message: `Physical site visit confirmed for ${visitDate} at ${visitTime}. Our society caretaker will receive you at the gate.`,
      visitPassId: `VP-${Date.now().toString().slice(-6)}`
    });
  });

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Blooming Buds Housing Society server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
