import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // This gives us free professional icons!
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // Replaced shouldShowAlert
    shouldShowList: true,   // Replaced shouldShowAlert
  }),
});

export default function TabLayout() {
  useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('We need notification permissions to remind you about your medicine!');
      }
    }
    requestPermissions();
  }, []);
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#3182CE', // The blue color when a tab is selected
      headerShown: false // Hides the default top header so our custom one shows
    }}>
      
      {/* Tab 1: The Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Routine',
          tabBarIcon: ({ color }) => <FontAwesome name="calendar-check-o" size={24} color={color} />,
        }}
      />

      {/* Tab 2: The Add Medicine Screen */}
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Medicine',
          tabBarIcon: ({ color }) => <FontAwesome name="plus-square" size={24} color={color} />,
        }}
      />

    </Tabs>
  );
}