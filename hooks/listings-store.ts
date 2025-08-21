import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { Listing, ListingCategory } from '@/types/listing';
import { MOCK_LISTINGS } from '@/mocks/listings';

const STORAGE_KEY = 'classifieds_listings';
const USER_LISTINGS_KEY = 'classifieds_user_listings';

export const [ListingsProvider, useListings] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ListingCategory | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

  // Load all listings
  const listingsQuery = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.map((listing: any) => ({
            ...listing,
            postedAt: new Date(listing.postedAt)
          }));
        }
        // Initialize with mock data
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_LISTINGS));
        return MOCK_LISTINGS;
      } catch (error) {
        console.error('Error loading listings:', error);
        return MOCK_LISTINGS;
      }
    }
  });

  // Load user's listings IDs
  const userListingsQuery = useQuery({
    queryKey: ['userListings'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(USER_LISTINGS_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error loading user listings:', error);
        return [];
      }
    }
  });

  // Add new listing
  const addListingMutation = useMutation({
    mutationFn: async (newListing: Omit<Listing, 'id' | 'postedAt' | 'views'>) => {
      const listing: Listing = {
        ...newListing,
        id: Date.now().toString(),
        postedAt: new Date(),
        views: 0
      };

      const currentListings = listingsQuery.data || [];
      const updatedListings = [listing, ...currentListings];
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
      
      // Add to user's listings
      const userListings = userListingsQuery.data || [];
      const updatedUserListings = [listing.id, ...userListings];
      await AsyncStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(updatedUserListings));
      
      return listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    }
  });

  // Delete listing
  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const currentListings = listingsQuery.data || [];
      const updatedListings = currentListings.filter(l => l.id !== listingId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
      
      // Remove from user's listings
      const userListings = userListingsQuery.data || [];
      const updatedUserListings = userListings.filter((id: string) => id !== listingId);
      await AsyncStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(updatedUserListings));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
    }
  });

  // Increment view count
  const incrementViewsMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const currentListings = listingsQuery.data || [];
      const updatedListings = currentListings.map(l => 
        l.id === listingId ? { ...l, views: l.views + 1 } : l
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedListings));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    }
  });

  // Filter listings
  const filteredListings = useMemo(() => {
    let filtered = listingsQuery.data || [];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(l => l.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.location.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceRange) {
      filtered = filtered.filter(l => {
        if (!l.price) return false;
        return l.price >= priceRange.min && l.price <= priceRange.max;
      });
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }, [listingsQuery.data, selectedCategory, searchQuery, priceRange]);

  // Get user's listings
  const userListings = useMemo(() => {
    const userIds = userListingsQuery.data || [];
    const allListings = listingsQuery.data || [];
    return allListings.filter(l => userIds.includes(l.id));
  }, [listingsQuery.data, userListingsQuery.data]);

  return {
    listings: listingsQuery.data || [],
    filteredListings,
    userListings,
    isLoading: listingsQuery.isLoading || userListingsQuery.isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    addListing: addListingMutation.mutate,
    deleteListing: deleteListingMutation.mutate,
    incrementViews: incrementViewsMutation.mutate,
    isAddingListing: addListingMutation.isPending
  };
});

// Helper hooks
export function useListingById(id: string) {
  const { listings } = useListings();
  return listings.find(l => l.id === id);
}

export function useListingsByCategory(category: ListingCategory) {
  const { listings } = useListings();
  return useMemo(() => 
    listings.filter(l => l.category === category),
    [listings, category]
  );
}