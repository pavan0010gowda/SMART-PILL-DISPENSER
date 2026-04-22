import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // PUT YOUR EXACT IP ADDRESS HERE TOO!
  const SERVER_URL = 'http://10.202.44.88:5000/api/medicines'; 

  // This function fetches real data from your MySQL database
  const fetchMedicines = async () => {
    try {
      const response = await fetch(SERVER_URL);
      const data = await response.json();
      setMedicines(data);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  // This re-loads the data every time you look at the screen
  useFocusEffect(
    useCallback(() => {
      fetchMedicines();
    }, [])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medDetails}>{item.dosage} at {item.time}</Text>
      </View>
      <View style={styles.stockBadge}>
        <Text style={styles.stockText}>{item.stock} left</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Routine</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3182CE" />
      ) : medicines.length === 0 ? (
        <Text style={styles.emptyText}>No medicines added yet. Tap below to start!</Text>
      ) : (
        <FlatList
          data={medicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#2D3748', marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  medName: { fontSize: 18, fontWeight: '600', color: '#1A202C' },
  medDetails: { fontSize: 14, color: '#718096', marginTop: 4 },
  stockBadge: { backgroundColor: '#EBF4FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  stockText: { color: '#3182CE', fontWeight: 'bold' },
  addButton: { backgroundColor: '#3182CE', padding: 16, borderRadius: 15, alignItems: 'center', marginBottom: 30 },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#718096', marginTop: 50, fontSize: 16 }
});