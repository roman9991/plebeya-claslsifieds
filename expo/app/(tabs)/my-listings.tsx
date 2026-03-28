import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useListings } from '@/hooks/listings-store';
import { ListingCard } from '@/components/ListingCard';
import { Trash2 } from 'lucide-react-native';

export default function MyListingsScreen() {
  const { userListings, deleteListing } = useListings();

  const handleDelete = (listingId: string, title: string) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteListing(listingId)
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "My Listings" }} />
      <View style={styles.container}>
        {userListings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptyText}>
              Your posted listings will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={userListings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.listingWrapper}>
                <ListingCard listing={item} />
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id, item.title)}
                >
                  <Trash2 size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    paddingVertical: 16,
  },
  listingWrapper: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 24,
    right: 32,
    backgroundColor: '#EF4444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});