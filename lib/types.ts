import { Database } from './supabase/database.types';

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert =
  Database['public']['Tables']['categories']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Design = Database['public']['Tables']['designs']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];

export type UserRole = Database['public']['Enums']['user_role'];
export type OrderStatus = Database['public']['Enums']['order_status'];
export type DesignStatus = Database['public']['Enums']['design_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];

export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductImage {
  url: string;
}

export type ProductWithTypedImages = Omit<Product, 'sample_images'> & {
  sample_images: ProductImage[] | null;
};

export interface ProductSnapshot {
  name: string;
  price: number;
}

export type TypedOrderItem = Omit<OrderItem, 'product_snapshot'> & {
  product_snapshot: ProductSnapshot | null;
};

export type TypedPayment = Payment & {
  midtrans_token: string | null;
};

export interface AdminOrderItem extends TypedOrderItem {
  products: ProductWithTypedImages | null;
  designs: (Design & { categories: Category | null }) | null;
}

export interface OrderWithDetails extends Order {
  profiles: {
    full_name: string | null;
    phone: string | null;
    address: string | null;
  } | null;

  order_items: (TypedOrderItem & {
    products: ProductWithTypedImages | null;
    designs: (Design & { categories: Category | null }) | null;
  })[];

  payment: TypedPayment[] | null;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
  customization?: OrderCustomization;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface DesignWithUser extends Design {
  profile: Profile;
  category: Category | null;
}

export interface ContentItem {
  id: string;
  type: 'text' | 'logo';
  value: string;
  layout: 'vertical' | 'horizontal';
  position: 'left' | 'right';
}

// Specific customization types for each category
export interface SalempangCustomization {
  categorySlug: 'salempang';
  titik: string;
  font: string;
  threadColor: string;
  salempangColor: string;
  contentGap: string;
  contents: ContentItem[];
  hasLogo: boolean;
  logoSize?: string;
  logoFileUrl?: string;
  designReferenceUrls?: string[];
  additionalNotes?: string;
  basePriceFromTitik: number;
  logoPrice: number;
  totalPrice: number;
}

export interface BordirNamaCustomization {
  categorySlug: 'bordir-nama';
  name: string;
  textColor: string;
  backgroundColor: string;
  additionalNotes?: string;
  totalPrice: number;
}

export interface BordirLogoCustomization {
  categorySlug: 'bordir-logo';
  logoFile?: File;
  logoFileUrl?: string;
  backgroundColor: string;
  additionalNotes?: string;
  totalPrice: number;
}

export interface GenericCustomization {
  categorySlug: 'generic';
  additionalNotes?: string;
  totalPrice: number;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'design' | 'system';
  is_read?: string;
  related_id?: string;
  created_at: string;
}

export type OrderCustomization =
  | SalempangCustomization
  | BordirNamaCustomization
  | BordirLogoCustomization
  | GenericCustomization;