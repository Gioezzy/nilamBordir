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

export interface OrderWithDetails extends Order {
  order_items: (OrderItem & {
    product: Product | null;
    design: Design | null;
  })[];
  payment: Payment | null;
  profile: Profile;
}

export interface CartItem {
  product: Product;
  quantity: number;
  design?: Design;
  customDescription?: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface DesignWithUser extends Design {
  profile: Profile;
  category: Category | null;
}
