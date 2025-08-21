import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useListings } from '@/hooks/listings-store';
import { ListingCard } from '@/components/ListingCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';

export default function HomeScreen() {
  const { 
    filteredListings, 
    isLoading, 
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory 
  } = useListings();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListingCard listing={item} />}
        ListHeaderComponent={
          <>
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            {filteredListings.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No listings found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your filters or search query
                </Text>
              </View>
            )}
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});