export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  /** Optional text shown below the price (e.g. "Average installed price: $12,000") */
  priceSubtext?: string;
  images: string[];
  category: string;
  specifications: Record<string, string>;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductQuestion {
  id: string;
  productSlug: string;
  author: string;
  body: string;
  answer?: string;
  createdAt: string;
  /** When to show (for admin-scheduled questions); defaults to createdAt */
  scheduledFor?: string;
}

export interface CanadianIncentive {
  id: string;
  location: string;
  province: string;
  program: string;
  type: 'rebate' | 'loan' | 'tax-credit' | 'financing' | 'grant';
  amount: string;
  details: string;
  eligibility: string;
  link?: string;
}
