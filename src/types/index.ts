export interface User {
  id: string;
  name: string;
  businessName?: string;
  accountType: 'personal' | 'company';
  role: 'helper' | 'seeker' | 'both';
  region: string;
  commune?: string;
  address?: string;
  phoneNumber: string;
  phoneVisible: boolean;
  facebookLink?: string;
  email?: string;
  profilePicture?: string;
  logo?: string;
  skills: string[];
  services?: string[];
  rating: number;
  reviewCount: number;
  badges: Badge[];
  createdAt: string;
  isVerified: boolean;
}

export interface Badge {
  id: string;
  name: string;
  type: 'verified' | 'trusted_helper' | 'popular_business';
  description: string;
  icon: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  type: 'help_request' | 'help_offer';
  category: string;
  title: string;
  description: string;
  images?: string[];
  location: {
    region: string;
    commune?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'open' | 'solved' | 'closed';
  createdAt: string;
  updatedAt: string;
  contactMethod: 'message' | 'phone' | 'both';
  urgency: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  image?: string;
  timestamp: string;
  isRead: boolean;
  type: 'contact_request' | 'message';
  status: 'pending' | 'approved' | 'blocked';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  type: 'thank_you' | 'review';
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  type: 'tip' | 'story' | 'expert_content';
  title: string;
  content: string;
  image?: string;
  author: string;
  createdAt: string;
  featured: boolean;
}

export interface MapPin {
  id: string;
  userId: string;
  user: User;
  coordinates: {
    lat: number;
    lng: number;
  };
  posts: Post[];
  isOnline: boolean;
}

export type Language = 'mg' | 'fr' | 'en';

export interface AppState {
  currentUser: User | null;
  language: Language;
  isOnline: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'message' | 'rating' | 'contact_request' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}
