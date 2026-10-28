export interface Product {
  id: string;
  name: string;
  category: 'food' | 'treats' | 'bedding' | 'care' | 'gear';
  targetPet: 'dog' | 'cat' | 'all';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  shortDesc: string;
  description: string;
  features: string[];
  specs: {
    weightOrSize?: string;
    origin?: string;
    suitableFor?: string;
    shelfLife?: string;
    material?: string;
  };
  nutrition?: {
    protein: string;
    fat: string;
    fiber: string;
    moisture: string;
    calories: string;
  };
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  tags: string[];
}

export interface PetProfile {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  gender: 'boy' | 'girl';
  ageYears: number;
  weightKg: number;
  birthday: string;
  dietNotes: string;
  allergies: string[];
  avatarIcon: string;
}

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'REGULAR' | 'SILVER' | 'GOLD_VIP' | 'PLATINUM';
  points: number;
  spentTotal: number;
  nextTierSpend: number;
  couponsCount: number;
  joinDate: string;
  address: string;
  pets: PetProfile[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  discount: number;
  shippingFee: number;
  finalAmount: number;
  pointsEarned: number;
  status: 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  shippingMethod: string;
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
  trackingCode: string;
}
