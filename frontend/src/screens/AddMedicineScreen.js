import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function AddMedicineScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const router = useRouter();

  const SERVER_URL = 'http://192.168.1.9:5000/api/medicines';

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert("Permission needed", "Enable notifications!");
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    setupNotifications();
  }, []);

  // ⏰ Convert "09:30 AM" → {hour, minute}
  const parseTimeString = (timeStr) => {
    try {
      const cleanStr = timeStr.replace(/\s+/g, '').toUpperCase();
      const isPM = cleanStr.includes('PM');
      const isAM = cleanStr.includes('AM');

      const timePart = cleanStr.replace('AM', '').replace('PM', '');
      let [hours, minutes] = timePart.split(':');

      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);

      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;

      return { hour: hours, minute: minutes };
    } catch {
      return null;
    }
  };

  const handleSave = async () => {
    if (!name || !dosage || !time) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      // ✅ Save to backend
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dosage, time }),
      });

      if (!response.ok) {
        Alert.alert("Error", "Failed to save medicine.");
        return;
      }

      // ✅ DAILY NOTIFICATION (FIX)
      const scheduledTime = parseTimeString(time);

      if (!scheduledTime) {
        Alert.alert("Error", "Use format like 09:30 AM");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💊 Time for your Medicine!",
          body: `Please take your ${name} (${dosage}).`,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY, // 🔥 DAILY
          hour: scheduledTime.hour,
          minute: scheduledTime.minute,
          channelId: 'default',
        },
      });

      Alert.alert(
        "Success!",
        `${name} reminder set daily at ${time}`
      );

      router.push('/');
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Server not reachable.");
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
          placeholder="e.g. 09:30 AM"
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
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#48BB78',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});