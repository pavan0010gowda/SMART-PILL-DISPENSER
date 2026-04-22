import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // This gives us free professional icons!

export default function TabLayout() {
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