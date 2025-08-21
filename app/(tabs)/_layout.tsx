import { Tabs } from "expo-router";
import { Home, Plus, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Browse",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Post",
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: color,
              borderRadius: 20,
              padding: 8,
            }}>
              <Plus size={20} color="white" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="my-listings"
        options={{
          title: "My Listings",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { View } from 'react-native';