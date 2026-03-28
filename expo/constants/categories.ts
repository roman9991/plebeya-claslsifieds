import { CategoryInfo } from '@/types/listing';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'items',
    label: 'For Sale',
    icon: 'ShoppingBag',
    color: '#3B82F6',
    description: 'Buy and sell items'
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: 'Briefcase',
    color: '#8B5CF6',
    description: 'Find employment opportunities'
  },
  {
    id: 'services',
    label: 'Services',
    icon: 'Wrench',
    color: '#F59E0B',
    description: 'Offer or find services'
  },
  {
    id: 'housing',
    label: 'Housing',
    icon: 'Home',
    color: '#10B981',
    description: 'Rentals and real estate'
  },
  {
    id: 'community',
    label: 'Community',
    icon: 'Users',
    color: '#EC4899',
    description: 'Events and activities'
  }
];

export const getCategoryInfo = (categoryId: ListingCategory): CategoryInfo | undefined => {
  return CATEGORIES.find(cat => cat.id === categoryId);
};