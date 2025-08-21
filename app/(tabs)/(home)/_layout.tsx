import { Stack } from "expo-router";
import { TouchableOpacity, Text, Linking, Platform, View, Image } from "react-native";
import { ExternalLink } from "lucide-react-native";

export default function HomeLayout() {
  const handlePlebeyaPress = () => {
    Linking.openURL('https://plebeya.com');
  };

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerTitle: () => (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Image 
                source={{ uri: 'https://r2-pub.rork.com/generated-images/c785dfac-1f3a-43bb-a4a1-24647e75960a.png' }}
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 8,
                  tintColor: '#2563EB',
                }}
                resizeMode="contain"
              />
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#111827',
              }}>
                Plebeya Classifieds
              </Text>
            </View>
          ),
          headerLargeTitle: false,
          headerShadowVisible: false,
          headerBlurEffect: 'regular',
          headerTransparent: false,
          headerRight: () => (
            <TouchableOpacity 
              onPress={handlePlebeyaPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{
                color: '#2563EB',
                fontSize: 14,
                fontWeight: '500',
                marginRight: 4,
              }}>
                Visit Plebeya
              </Text>
              <ExternalLink size={16} color="#2563EB" />
            </TouchableOpacity>
          ),
        }} 
      />
    </Stack>
  );
}