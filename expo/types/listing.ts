export type ListingCategory = 'jobs' | 'services' | 'items' | 'housing' | 'community';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  price?: number;
  priceType?: 'fixed' | 'hourly' | 'negotiable' | 'free';
  location: string;
  images: string[];
  postedBy: string;
  postedAt: Date;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  views: number;
  condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor'; // for items
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'freelance'; // for jobs
}

export interface CategoryInfo {
  id: ListingCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}