import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// Dummy data for now (later this will come from our database)
const dummyMedicines = [
  { id: '1', name: 'Paracetamol', dosage: '1 Tablet', time: '09:00 AM', stock: 12 },
  { id: '2', name: 'Vitamin C', dosage: '2 Tablets', time: '08:00 PM', stock: 30 },
];

export default function DashboardScreen() {
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
      
      <FlatList
        data={dummyMedicines}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Medicine</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  medName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C',
  },
  medDetails: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  stockBadge: {
    backgroundColor: '#EBF4FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  stockText: {
    color: '#3182CE',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3182CE',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});