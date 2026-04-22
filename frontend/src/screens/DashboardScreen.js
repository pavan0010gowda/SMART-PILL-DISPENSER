import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // MAKE SURE THIS IS YOUR CORRECT IP ADDRESS!
  const SERVER_URL = 'http://10.202.44.88:5000/api/medicines'; 

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

  useFocusEffect(
    useCallback(() => {
      fetchMedicines();
    }, [])
  );

  // New function to handle taking the medicine
  const handleTakeMedicine = async (id, name, currentStock) => {
    if (currentStock <= 0) {
      Alert.alert("Out of Stock", `You don't have any ${name} left!`);
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/${id}/take`, {
        method: 'PUT',
      });

      if (response.ok) {
        Alert.alert("Done!", `You took ${name}.`);
        fetchMedicines(); // Reload the list to show the new stock number
      } else {
        Alert.alert("Error", "Could not update the database.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not reach the server.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medDetails}>{item.dosage} at {item.time}</Text>
        <Text style={styles.stockText}>Stock: {item.stock} left</Text>
      </View>
      
      {/* The New "Take" Button */}
      <TouchableOpacity 
        style={[styles.takeButton, item.stock === 0 && styles.disabledButton]} 
        onPress={() => handleTakeMedicine(item.id, item.name, item.stock)}
      >
        <FontAwesome name="check-circle" size={20} color="#FFF" style={{ marginRight: 6 }} />
        <Text style={styles.takeButtonText}>Take</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Today's Routine</Text>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#3182CE" />
      ) : medicines.length === 0 ? (
        <Text style={styles.emptyText}>No medicines added yet. Go to the Add tab!</Text>
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
  headerContainer: { marginBottom: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#2D3748' },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardInfo: { flex: 1 },
  medName: { fontSize: 18, fontWeight: '600', color: '#1A202C' },
  medDetails: { fontSize: 14, color: '#718096', marginTop: 4 },
  stockText: { fontSize: 13, color: '#E53E3E', marginTop: 4, fontWeight: '500' },
  takeButton: { backgroundColor: '#48BB78', flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center' },
  disabledButton: { backgroundColor: '#A0AEC0' },
  takeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#718096', marginTop: 50, fontSize: 16 }
});