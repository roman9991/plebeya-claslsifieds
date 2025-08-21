import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, X } from 'lucide-react-native';
import { useListings } from '@/hooks/listings-store';
import { CATEGORIES } from '@/constants/categories';
import { ListingCategory, Listing } from '@/types/listing';

export default function CreateListingScreen() {
  const { addListing, isAddingListing } = useListings();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ListingCategory>('items');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'hourly' | 'negotiable' | 'free'>('fixed');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = cleaned.substring(0, 10);
    
    // Format as (nnn) nnn-nnnn
    if (limited.length >= 6) {
      return `(${limited.substring(0, 3)}) ${limited.substring(3, 6)}-${limited.substring(6)}`;
    } else if (limited.length >= 3) {
      return `(${limited.substring(0, 3)}) ${limited.substring(3)}`;
    } else if (limited.length > 0) {
      return `(${limited}`;
    }
    return limited;
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setContactPhone(formatted);
    
    // Close keyboard when phone number is complete (10 digits)
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length === 10) {
      Keyboard.dismiss();
    }
  };
  const [condition, setCondition] = useState<'new' | 'like-new' | 'good' | 'fair' | 'poor'>('good');
  const [employmentType, setEmploymentType] = useState<'full-time' | 'part-time' | 'contract' | 'freelance'>('full-time');
  const [images, setImages] = useState<string[]>([]);

  const descriptionRef = useRef<TextInput>(null);
  const priceRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!contactEmail.trim() && !contactPhone.trim()) {
      Alert.alert('Error', 'Please provide at least one contact method');
      return;
    }

    const newListing: Omit<Listing, 'id' | 'postedAt' | 'views'> = {
      title: title.trim(),
      description: description.trim(),
      category,
      price: price ? parseFloat(price) : undefined,
      priceType: price ? priceType : 'free',
      location: location.trim(),
      images,
      postedBy: 'Current User',
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      isActive: true,
      condition: category === 'items' ? condition : undefined,
      employmentType: category === 'jobs' ? employmentType : undefined,
    };

    addListing(newListing);
    Alert.alert('Success', 'Your listing has been posted!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter listing title"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                onSubmitEditing={() => descriptionRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryContainer}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryOption,
                        category === cat.id && styles.categoryOptionActive
                      ]}
                      onPress={() => setCategory(cat.id)}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        category === cat.id && styles.categoryOptionTextActive
                      ]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                ref={descriptionRef}
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your listing"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                returnKeyType="next"
                onSubmitEditing={() => priceRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <View style={styles.priceContainer}>
                <TextInput
                  ref={priceRef}
                  style={[styles.input, styles.priceInput]}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  returnKeyType="next"
                  onSubmitEditing={() => locationRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <View style={styles.priceTypeContainer}>
                  {(['fixed', 'hourly', 'negotiable', 'free'] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.priceTypeOption,
                        priceType === type && styles.priceTypeOptionActive
                      ]}
                      onPress={() => setPriceType(type)}
                    >
                      <Text style={[
                        styles.priceTypeText,
                        priceType === type && styles.priceTypeTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {category === 'items' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Condition</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryContainer}>
                    {(['new', 'like-new', 'good', 'fair', 'poor'] as const).map((cond) => (
                      <TouchableOpacity
                        key={cond}
                        style={[
                          styles.categoryOption,
                          condition === cond && styles.categoryOptionActive
                        ]}
                        onPress={() => setCondition(cond)}
                      >
                        <Text style={[
                          styles.categoryOptionText,
                          condition === cond && styles.categoryOptionTextActive
                        ]}>
                          {cond}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {category === 'jobs' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Employment Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryContainer}>
                    {(['full-time', 'part-time', 'contract', 'freelance'] as const).map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.categoryOption,
                          employmentType === type && styles.categoryOptionActive
                        ]}
                        onPress={() => setEmploymentType(type)}
                      >
                        <Text style={[
                          styles.categoryOptionText,
                          employmentType === type && styles.categoryOptionTextActive
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                ref={locationRef}
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, State"
                placeholderTextColor="#9CA3AF"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.imagesContainer}>
                  {images.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                      <Image source={{ uri }} style={styles.imagePreview} />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <X size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {images.length < 5 && (
                    <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                      <ImageIcon size={24} color="#6B7280" />
                      <Text style={styles.addImageText}>Add Photo</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Email</Text>
              <TextInput
                ref={emailRef}
                style={styles.input}
                value={contactEmail}
                onChangeText={setContactEmail}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput
                ref={phoneRef}
                style={styles.input}
                value={contactPhone}
                onChangeText={handlePhoneChange}
                placeholder="(555) 555-5555"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                blurOnSubmit={true}
                maxLength={14}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, isAddingListing && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isAddingListing}
            >
              <Text style={styles.submitButtonText}>
                {isAddingListing ? 'Posting...' : 'Post Listing'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryOptionActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryOptionTextActive: {
    color: 'white',
  },
  priceContainer: {
    gap: 8,
  },
  priceInput: {
    flex: 1,
  },
  priceTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priceTypeOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  priceTypeOptionActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  priceTypeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceTypeTextActive: {
    color: 'white',
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  addImageText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});