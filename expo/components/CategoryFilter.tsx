import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Icons from 'lucide-react-native';
import { CATEGORIES } from '@/constants/categories';
import { ListingCategory } from '@/types/listing';

interface CategoryFilterProps {
  selectedCategory: ListingCategory | null;
  onSelectCategory: (category: ListingCategory | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.categoryItem,
          !selectedCategory && styles.categoryItemActive
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <View style={[styles.iconContainer, !selectedCategory && styles.iconContainerActive]}>
          <Icons.Grid3x3 size={20} color={!selectedCategory ? 'white' : '#6B7280'} />
        </View>
        <Text style={[styles.categoryLabel, !selectedCategory && styles.categoryLabelActive]}>
          All
        </Text>
      </TouchableOpacity>

      {CATEGORIES.map((category) => {
        const IconComponent = Icons[category.icon as keyof typeof Icons] as any;
        const isActive = selectedCategory === category.id;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryItem, isActive && styles.categoryItemActive]}
            onPress={() => onSelectCategory(category.id)}
          >
            <View style={[
              styles.iconContainer,
              isActive && styles.iconContainerActive,
              { backgroundColor: isActive ? category.color : category.color + '20' }
            ]}>
              <IconComponent size={20} color={isActive ? 'white' : category.color} />
            </View>
            <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryItemActive: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: '#2563EB',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#111827',
    fontWeight: '600',
  },
});