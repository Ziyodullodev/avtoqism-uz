export interface Vehicle {
  id: string;
  make: string;
  model: string;
  generation?: string | null;
  yearFrom: number;
  yearTo?: number | null;
  engine: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  imageUrl?: string | null;
  vinPattern?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  parentId?: string | null;
  children?: Category[];
  _count?: {
    parts: number;
  };
}

export interface PartCompatibility {
  id: string;
  partId: string;
  vehicleId: string;
  notes?: string | null;
  vehicle: Vehicle;
}

export interface Review {
  id: string;
  partId: string;
  authorName: string;
  carModel?: string | null;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

export interface Part {
  id: string;
  name: string;
  slug: string;
  oemNumber: string;
  brand: string;
  country: string;
  isOriginal: boolean;
  price: number;
  oldPrice?: number | null;
  stock: number;
  unit: string;
  warranty?: string | null;
  description: string;
  specifications: string; // JSON string
  images: string; // JSON string
  rating: number;
  reviewCount: number;
  badge?: string | null;
  crossCodes?: string | null;
  categoryId: string;
  category?: Category;
  compatibility?: PartCompatibility[];
  reviews?: Review[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CartItem {
  part: Part;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  partId: string;
  quantity: number;
  price: number;
  part: Part;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  region: string;
  cityAddress: string;
  deliveryMethod: string;
  deliveryCost: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  notes?: string | null;
  trackingCode?: string | null;
  items?: OrderItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserSavedCar {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  nickname?: string;
  plateNumber?: string;
  vin?: string;
}
