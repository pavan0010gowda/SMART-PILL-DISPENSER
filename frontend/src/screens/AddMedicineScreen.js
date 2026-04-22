import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddMedicineScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const router = useRouter();

  // REPLACE THIS with your computer's IPv4 address from the terminal!
  const SERVER_URL = 'http://10.202.44.88:5000/api/medicines';

  const handleSave = async () => {
    if (!name || !dosage || !time) {
      Alert.alert("Error", "Please fill in all fields!");
      return;
    }

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, dosage, time }),
      });

      if (response.ok) {
        Alert.alert("Success!", `${name} has been added to your routine.`);
        router.push('/'); // Sends you back to the dashboard
      } else {
        Alert.alert("Error", "Failed to save medicine.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Make sure your server is running and the IP is correct.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Medicine</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Medicine Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. Paracetamol" 
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Dosage</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 1 Tablet" 
          value={dosage}
          onChangeText={setDosage}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Time</Text>
        <TextInput 
          style={styles.input} 
          placeholder="e.g. 09:00 AM" 
          value={time}
          onChangeText={setTime}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Routine</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 50, paddingHorizontal: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#2D3748', marginBottom: 30 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 16, color: '#4A5568', marginBottom: 8, fontWeight: '500' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: 15, borderRadius: 10, fontSize: 16 },
  saveButton: { backgroundColor: '#48BB78', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});