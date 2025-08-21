import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Stack } from 'expo-router';
import { Plus } from 'lucide-react-native';

export default function PostScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Post Listing" }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Plus size={48} color="#2563EB" />
          </View>
          <Text style={styles.title}>Create a New Listing</Text>
          <Text style={styles.description}>
            Reach thousands of potential buyers and sellers in your area
          </Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/create-listing')}
          >
            <Text style={styles.buttonText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});