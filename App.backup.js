import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  SafeAreaView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Demo data generator
const generateDemoData = () => ({
  temperature: (Math.random() * 15 + 20).toFixed(1), // 20-35°C
  humidity: (Math.random() * 40 + 40).toFixed(1), // 40-80%
  soilMoisture: (Math.random() * 60 + 20).toFixed(1), // 20-80%
  motionDetected: Math.random() > 0.7,
  distance: (Math.random() * 300 + 50).toFixed(0), // 50-350cm
  lastMotionTime: new Date().toLocaleTimeString(),
  systemStatus: 'Online',
  batteryLevel: (Math.random() * 30 + 70).toFixed(0), // 70-100%
  wifiSignal: Math.floor(Math.random() * 4) + 1 // 1-4 bars
});

const SensorCard = ({ title, value, unit, icon, status }) => (
  <View style={[styles.card, status === 'alert' && styles.alertCard]}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={[styles.cardValue, status === 'alert' && styles.alertText]}>
      {value} {unit}
    </Text>
  </View>
);

const ControlButton = ({ title, icon, onPress, active }) => (
  <TouchableOpacity 
    style={[styles.controlButton, active && styles.activeButton]} 
    onPress={onPress}
  >
    <Text style={[styles.controlIcon, active && styles.activeIcon]}>{icon}</Text>
    <Text style={[styles.controlButtonText, active && styles.activeButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function App() {
  const [data, setData] = useState(generateDemoData());
  const [armActive, setArmActive] = useState(false);
  const [buzzerActive, setBuzzerActive] = useState(false);

  // Update demo data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateDemoData());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleArmToggle = () => {
    setArmActive(!armActive);
    Alert.alert(
      'Arm Movement', 
      `Arms ${!armActive ? 'activated' : 'deactivated'}`,
      [{ text: 'OK' }]
    );
  };

  const handleBuzzerToggle = () => {
    setBuzzerActive(!buzzerActive);
    Alert.alert(
      'Buzzer Alert', 
      `Buzzer ${!buzzerActive ? 'activated' : 'deactivated'}`,
      [{ text: 'OK' }]
    );
  };

  const getMotionStatus = () => {
    return data.motionDetected ? 'alert' : 'normal';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#1e3c72" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BantayBot Monitor</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: '#2ecc71' }]} />
          <Text style={styles.statusText}>{data.systemStatus}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Motion Detection Alert */}
        {data.motionDetected && (
          <View style={styles.alertBanner}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.alertBannerText}>
              Motion Detected! Last seen: {data.lastMotionTime}
            </Text>
          </View>
        )}

        {/* System Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.row}>
            <SensorCard 
              title="Battery" 
              value={data.batteryLevel} 
              unit="%" 
              icon="🔋" 
            />
            <SensorCard 
              title="WiFi Signal" 
              value={data.wifiSignal} 
              unit="/4" 
              icon="📶" 
            />
          </View>
        </View>

        {/* Environmental Sensors */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Data</Text>
          <View style={styles.row}>
            <SensorCard 
              title="Temperature" 
              value={data.temperature} 
              unit="°C" 
              icon="🌡️" 
            />
            <SensorCard 
              title="Humidity" 
              value={data.humidity} 
              unit="%" 
              icon="💧" 
            />
          </View>
          <SensorCard 
            title="Soil Moisture" 
            value={data.soilMoisture} 
            unit="%" 
            icon="🌱" 
          />
        </View>

        {/* Motion Detection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intrusion Detection</Text>
          <View style={styles.row}>
            <SensorCard 
              title="Motion Status" 
              value={data.motionDetected ? "DETECTED" : "Clear"} 
              unit="" 
              icon="👁️" 
              status={getMotionStatus()}
            />
            <SensorCard 
              title="Distance" 
              value={data.distance} 
              unit="cm" 
              icon="📏" 
            />
          </View>
        </View>

        {/* Control Panel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manual Controls</Text>
          <View style={styles.controlPanel}>
            <ControlButton
              title="Move Arms"
              icon="🤖"
              active={armActive}
              onPress={handleArmToggle}
            />
            <ControlButton
              title="Sound Alert"
              icon="🔊"
              active={buzzerActive}
              onPress={handleBuzzerToggle}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🤖 BantayBot - Solar Powered Automated Scarecrow
          </Text>
          <Text style={styles.demoText}>Demo Mode - Sample Data</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#1e3c72',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  alertBanner: {
    backgroundColor: '#ff4757',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertBannerText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertCard: {
    borderColor: '#ff4757',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  alertText: {
    color: '#ff4757',
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#2ecc71',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeButton: {
    backgroundColor: '#2ecc71',
  },
  controlButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  activeButtonText: {
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  demoText: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  controlIcon: {
    fontSize: 24,
  },
  activeIcon: {
    fontSize: 24,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
});
