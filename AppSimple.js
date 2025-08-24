import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [data, setData] = useState({
    temperature: '28.5',
    humidity: '65',
    soilMoisture: '45',
    motionDetected: false,
    distance: '150',
    batteryLevel: '85',
  });

  // Update demo data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temperature: (Math.random() * 15 + 20).toFixed(1),
        humidity: (Math.random() * 40 + 40).toFixed(1),
        soilMoisture: (Math.random() * 60 + 20).toFixed(1),
        motionDetected: Math.random() > 0.7,
        distance: (Math.random() * 300 + 50).toFixed(0),
        batteryLevel: (Math.random() * 30 + 70).toFixed(0),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 BantayBot Monitor</Text>
        <Text style={styles.status}>🟢 Online</Text>
      </View>

      <ScrollView style={styles.content}>
        {data.motionDetected && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>⚠️ Motion Detected!</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Data</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardLabel}>🌡️ Temperature</Text>
            <Text style={styles.cardValue}>{data.temperature}°C</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>💧 Humidity</Text>
            <Text style={styles.cardValue}>{data.humidity}%</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>🌱 Soil Moisture</Text>
            <Text style={styles.cardValue}>{data.soilMoisture}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardLabel}>🔋 Battery</Text>
            <Text style={styles.cardValue}>{data.batteryLevel}%</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>📏 Distance</Text>
            <Text style={styles.cardValue}>{data.distance} cm</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>👁️ Motion</Text>
            <Text style={styles.cardValue}>{data.motionDetected ? 'DETECTED' : 'Clear'}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>🦾 Move Arms</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>🔊 Sound Alert</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Demo Mode - Sample Data</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  status: {
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  alert: {
    backgroundColor: '#ff4757',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  alertText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLabel: {
    fontSize: 16,
    color: '#666',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 10,
    flex: 0.45,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    marginBottom: 20,
  },
});