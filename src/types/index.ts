export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
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
