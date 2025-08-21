import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Clock, Eye } from 'lucide-react-native';
import { Listing } from '@/types/listing';
import { getCategoryInfo } from '@/constants/categories';

const { width } = Dimensions.get('window');

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const categoryInfo = getCategoryInfo(listing.category);
  
  const formatPrice = () => {
    if (!listing.price) return 'Free';
    if (listing.priceType === 'hourly') return `$${listing.price}/hr`;
    if (listing.priceType === 'negotiable') return `$${listing.price} (negotiable)`;
    return `$${listing.price.toLocaleString()}`;
  };

  const formatDate = () => {
    const now = new Date();
    const posted = new Date(listing.postedAt);
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/listing/${listing.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      {listing.images.length > 0 && (
        <Image source={{ uri: listing.images[0] }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryInfo?.color }]}>
              {categoryInfo?.label}
            </Text>
          </View>
          <Text style={styles.price}>{formatPrice()}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{listing.description}</Text>

        <View style={styles.footer}>
          <View style={styles.location}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.locationText}>{listing.location}</Text>
          </View>
          
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.metaText}>{formatDate()}</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={14} color="#6B7280" />
              <Text style={styles.metaText}>{listing.views}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
});