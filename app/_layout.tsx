import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Image, Text, StyleSheet, Animated, ImageBackground, Platform } from "react-native";
import { ListingsProvider } from "@/hooks/listings-store";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="listing/[id]" 
        options={{ 
          title: "Listing Details",
          presentation: "card"
        }} 
      />
      <Stack.Screen 
        name="create-listing" 
        options={{ 
          title: "Create Listing",
          presentation: "modal"
        }} 
      />
    </Stack>
  );
}

function CustomSplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={[splashStyles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ImageBackground 
        source={{ uri: 'https://r2-pub.rork.com/generated-images/9a0c1304-93bf-4a1c-be25-bb15a94de50e.png' }}
        style={splashStyles.backgroundImage}
        imageStyle={splashStyles.backgroundImageStyle}
      >
        <View style={splashStyles.overlay} />
        <Animated.View 
          style={[
            splashStyles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={splashStyles.logoContainer}>
            <Image 
              source={{ uri: 'https://r2-pub.rork.com/generated-images/43e70422-31c6-4586-b1de-10a650402e76.png' }}
              style={splashStyles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={splashStyles.title}>Plebeya</Text>
          <Text style={splashStyles.subtitle}>Classifieds</Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Prevent auto-hide and manage splash screen manually
    const prepareSplash = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn('SplashScreen.preventAutoHideAsync() failed:', e);
      }
    };
    
    prepareSplash();

    const timer = setTimeout(async () => {
      setIsReady(true);
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('SplashScreen.hideAsync() failed:', e);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <CustomSplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <ListingsProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </ListingsProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </SafeAreaProvider>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.15,
    resizeMode: 'repeat',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(37, 99, 235, 0.8)',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logo: {
    width: 100,
    height: 100,
    tintColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});