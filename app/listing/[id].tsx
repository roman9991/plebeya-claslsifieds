import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, Eye, Mail, Phone, DollarSign, Briefcase, Package } from 'lucide-react-native';
import { useListingById, useListings } from '@/hooks/listings-store';
import { getCategoryInfo } from '@/constants/categories';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const listing = useListingById(id as string);
  const { incrementViews } = useListings();

  useEffect(() => {
    if (listing) {
      incrementViews(listing.id);
    }
  }, [listing?.id]);

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Listing not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const categoryInfo = getCategoryInfo(listing.category);

  const formatPrice = () => {
    if (!listing.price) return 'Free';
    if (listing.priceType === 'hourly') return `$${listing.price}/hr`;
    if (listing.priceType === 'negotiable') return `$${listing.price} (negotiable)`;
    return `$${listing.price.toLocaleString()}`;
  };

  const formatDate = () => {
    return new Date(listing.postedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContact = (type: 'email' | 'phone') => {
    if (type === 'email' && listing.contactEmail) {
      Linking.openURL(`mailto:${listing.contactEmail}?subject=${listing.title}`);
    } else if (type === 'phone' && listing.contactPhone) {
      if (Platform.OS === 'web') {
        Alert.alert('Phone', listing.contactPhone);
      } else {
        Linking.openURL(`tel:${listing.contactPhone}`);
      }
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {listing.images.length > 0 && (
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.imageContainer}
        >
          {listing.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>
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

        <Text style={styles.title}>{listing.title}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.metaText}>{listing.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.metaText}>{formatDate()}</Text>
          </View>
          <View style={styles.metaItem}>
            <Eye size={16} color="#6B7280" />
            <Text style={styles.metaText}>{listing.views} views</Text>
          </View>
        </View>

        {listing.condition && (
          <View style={styles.detailRow}>
            <Package size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>Condition:</Text>
            <Text style={styles.detailValue}>{listing.condition}</Text>
          </View>
        )}

        {listing.employmentType && (
          <View style={styles.detailRow}>
            <Briefcase size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>Employment:</Text>
            <Text style={styles.detailValue}>{listing.employmentType}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posted by</Text>
          <Text style={styles.postedBy}>{listing.postedBy}</Text>
        </View>

        <View style={styles.contactContainer}>
          {listing.contactEmail && (
            <TouchableOpacity 
              style={[styles.contactButton, styles.emailButton]}
              onPress={() => handleContact('email')}
            >
              <Mail size={20} color="white" />
              <Text style={styles.contactButtonText}>Email Seller</Text>
            </TouchableOpacity>
          )}
          
          {listing.contactPhone && (
            <TouchableOpacity 
              style={[styles.contactButton, styles.phoneButton]}
              onPress={() => handleContact('phone')}
            >
              <Phone size={20} color="white" />
              <Text style={styles.contactButtonText}>Call Seller</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
  },
  imageContainer: {
    height: 300,
  },
  image: {
    width: width,
    height: 300,
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  postedBy: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  contactContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emailButton: {
    backgroundColor: '#2563EB',
  },
  phoneButton: {
    backgroundColor: '#10B981',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});