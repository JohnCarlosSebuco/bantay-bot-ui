import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Animated, RefreshControl, Platform, Modal, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [data, setData] = useState({
    temperature: '25.7',
    humidity: '69.7',
    soilMoisture: '32.2',
    motionDetected: false,
    distance: '150',
    batteryLevel: '84',
    solarVoltage: '13.0',
    wifiStrength: 1,
  });
  
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [notificationCount, setNotificationCount] = useState(5);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = {
        temperature: (Math.random() * 15 + 20).toFixed(1),
        humidity: (Math.random() * 40 + 40).toFixed(1),
        soilMoisture: (Math.random() * 60 + 20).toFixed(1),
        motionDetected: Math.random() > 0.8,
        distance: (Math.random() * 300 + 50).toFixed(0),
        batteryLevel: (Math.random() * 30 + 70).toFixed(0),
        solarVoltage: (Math.random() * 2 + 12).toFixed(1),
        wifiStrength: Math.floor(Math.random() * 4) + 1,
      };
      
      setData(newData);
      
      // Increase notification count when motion is detected
      if (newData.motionDetected && Math.random() > 0.5) {
        setNotificationCount(prev => prev + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setData(prevData => ({
        temperature: (Math.random() * 15 + 20).toFixed(1),
        humidity: (Math.random() * 40 + 40).toFixed(1),
        soilMoisture: (Math.random() * 60 + 20).toFixed(1),
        motionDetected: Math.random() > 0.8,
        distance: (Math.random() * 300 + 50).toFixed(0),
        batteryLevel: (Math.random() * 30 + 70).toFixed(0),
        solarVoltage: (Math.random() * 2 + 12).toFixed(1),
        wifiStrength: Math.floor(Math.random() * 4) + 1,
      }));
      setRefreshing(false);
      showToastMessage('✓ Data refreshed successfully');
    }, 1000);
  }, []);

  const renderDashboard = () => (
    <>
      {/* Quick Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickStats}>
        <View style={[styles.quickStatCard, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.quickStatIcon}>🔋</Text>
          <Text style={styles.quickStatValue}>{data.batteryLevel}%</Text>
          <Text style={styles.quickStatLabel}>Battery</Text>
        </View>
        
        <View style={[styles.quickStatCard, { backgroundColor: '#FF9800' }]}>
          <Text style={styles.quickStatIcon}>☀️</Text>
          <Text style={styles.quickStatValue}>{data.solarVoltage}V</Text>
          <Text style={styles.quickStatLabel}>Solar</Text>
        </View>
        
        <View style={[styles.quickStatCard, { backgroundColor: '#2196F3' }]}>
          <Text style={styles.quickStatIcon}>📶</Text>
          <Text style={styles.quickStatValue}>{data.wifiStrength}/4</Text>
          <Text style={styles.quickStatLabel}>WiFi</Text>
        </View>
      </ScrollView>

      {/* Environmental Monitoring */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Monitoring</Text>
        
        <View style={[styles.envCard, { borderLeftColor: '#FF9800' }]}>
          <View style={styles.envCardContent}>
            <Text style={styles.envIcon}>🌡️</Text>
            <View style={styles.envInfo}>
              <Text style={styles.envLabel}>Temperature</Text>
              <Text style={[styles.envValue, { color: '#FF9800' }]}>{data.temperature} °C</Text>
            </View>
          </View>
          <View style={[styles.progressBar, { backgroundColor: '#FFE0B2' }]}>
            <View style={[styles.progressFill, { backgroundColor: '#FF9800', width: `${Math.min(parseFloat(data.temperature) * 2.5, 100)}%` }]} />
          </View>
        </View>

        <View style={[styles.envCard, { borderLeftColor: '#2196F3' }]}>
          <View style={styles.envCardContent}>
            <Text style={styles.envIcon}>💧</Text>
            <View style={styles.envInfo}>
              <Text style={styles.envLabel}>Humidity</Text>
              <Text style={[styles.envValue, { color: '#2196F3' }]}>{data.humidity} %</Text>
            </View>
          </View>
          <View style={[styles.progressBar, { backgroundColor: '#E3F2FD' }]}>
            <View style={[styles.progressFill, { backgroundColor: '#2196F3', width: `${parseFloat(data.humidity)}%` }]} />
          </View>
        </View>

        <View style={[styles.envCard, { borderLeftColor: '#4CAF50' }]}>
          <View style={styles.envCardContent}>
            <Text style={styles.envIcon}>🌱</Text>
            <View style={styles.envInfo}>
              <Text style={styles.envLabel}>Soil Moisture</Text>
              <Text style={[styles.envValue, { color: '#4CAF50' }]}>{data.soilMoisture} %</Text>
            </View>
          </View>
          <View style={[styles.progressBar, { backgroundColor: '#E8F5E8' }]}>
            <View style={[styles.progressFill, { backgroundColor: '#4CAF50', width: `${parseFloat(data.soilMoisture)}%` }]} />
          </View>
        </View>
      </View>

      {/* Intrusion Detection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Intrusion Detection</Text>
        
        <View style={styles.intrusionCards}>
          <View style={styles.intrusionCard}>
            <Text style={styles.intrusionIcon}>🎯</Text>
            <Text style={styles.intrusionLabel}>Motion</Text>
            <Text style={styles.intrusionValue}>{data.motionDetected ? 'DETECTED' : 'Clear'}</Text>
          </View>
          
          <View style={styles.intrusionCard}>
            <Text style={styles.intrusionIcon}>📏</Text>
            <Text style={styles.intrusionLabel}>Distance</Text>
            <Text style={styles.intrusionValue}>{data.distance}cm</Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Analytics</Text>
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>Today's Performance</Text>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Detection Events</Text>
                <Text style={styles.analyticsValue}>12</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>Average Temperature</Text>
                <Text style={styles.analyticsValue}>28.5°C</Text>
              </View>
              <View style={styles.analyticsRow}>
                <Text style={styles.analyticsLabel}>System Uptime</Text>
                <Text style={[styles.analyticsValue, { color: '#4CAF50' }]}>99.8%</Text>
              </View>
            </View>
          </View>
        );
      
      case 'controls':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Manual Controls</Text>
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => showToastMessage('🦾 Arm movement activated')}
            >
              <Text style={styles.controlButtonText}>🦾 Move Arms</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, { backgroundColor: '#f44336' }]}
              onPress={() => showToastMessage('🔊 Sound alert activated')}
            >
              <Text style={styles.controlButtonText}>🔊 Sound Alert</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'settings':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>Settings</Text>
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>Device Information</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Device ID</Text>
                <Text style={styles.settingValue}>BB-001</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Version</Text>
                <Text style={styles.settingValue}>v1.0.0</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Connection</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Demo Mode</Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return renderDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>BantayBot</Text>
          <Text style={styles.headerSubtitle}>Crop Protection System</Text>
        </View>
        
        <TouchableOpacity style={styles.notificationButton} onPress={() => {
          setShowAlerts(true);
          setNotificationCount(0);
        }}>
          <Text style={styles.notificationIcon}>🔔</Text>
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusDot}>●</Text>
          <Text style={styles.statusText}>Online</Text>
        </View>
        <Text style={styles.statusTime}>Updated: {new Date().toLocaleTimeString()}</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { key: 'dashboard', icon: '📊', label: 'Dashboard' },
          { key: 'analytics', icon: '📈', label: 'Analytics' },
          { key: 'controls', icon: '⚙️', label: 'Controls' },
          { key: 'settings', icon: '🔧', label: 'Settings' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.navItem, activeTab === tab.key && styles.navItemActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.navIcon, activeTab === tab.key && styles.navIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.navLabel, activeTab === tab.key && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <AlertHistory visible={showAlerts} onClose={() => setShowAlerts(false)} />
      <Toast message={toastMessage} visible={showToast} />
    </SafeAreaView>
  );
}

const AlertHistory = ({ visible, onClose }) => {
  const alerts = [
    { id: '1', type: 'motion', message: 'Motion detected in sector A', time: '2 min ago', severity: 'high' },
    { id: '2', type: 'moisture', message: 'Soil moisture below threshold', time: '15 min ago', severity: 'medium' },
    { id: '3', type: 'battery', message: 'Battery level at 25%', time: '1 hour ago', severity: 'low' },
    { id: '4', type: 'temperature', message: 'High temperature alert', time: '2 hours ago', severity: 'medium' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      case 'low': return '#2196F3';
      default: return '#666';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'motion': return '👁';
      case 'moisture': return '💧';
      case 'battery': return '🔋';
      case 'temperature': return '🌡';
      default: return '⚠';
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.alertModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Recent Alerts</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.alertItem}>
                <View style={[styles.alertIconContainer, { 
                  backgroundColor: getSeverityColor(item.severity) + '20' 
                }]}>
                  <Text style={styles.alertItemIcon}>{getAlertIcon(item.type)}</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{item.message}</Text>
                  <Text style={styles.alertTime}>{item.time}</Text>
                </View>
                <View style={[styles.severityDot, { backgroundColor: getSeverityColor(item.severity) }]} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const Toast = ({ message, visible }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  // Header Styles
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  notificationButton: {
    padding: 5,
    position: 'relative',
  },
  notificationIcon: {
    color: 'white',
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Status Bar
  statusBar: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    color: '#4CAF50',
    fontSize: 12,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  statusTime: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },

  content: {
    flex: 1,
  },

  // Quick Stats
  quickStats: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  quickStatCard: {
    width: 120,
    height: 100,
    borderRadius: 15,
    marginRight: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickStatIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  quickStatValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  quickStatLabel: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  // Environmental Cards
  envCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  envCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  envIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  envInfo: {
    flex: 1,
  },
  envLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  envValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Intrusion Detection
  intrusionCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intrusionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flex: 0.48,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  intrusionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  intrusionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  intrusionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'android' ? 16 : 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  navItemActive: {
    backgroundColor: '#f8f9fa',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#666',
  },
  navLabelActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },

  // Tab Content
  tabContent: {
    padding: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  
  // Analytics
  analyticsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#666',
  },
  analyticsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Controls
  controlButton: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Settings
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 14,
    color: '#666',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  alertModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertItemIcon: {
    fontSize: 20,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  toastText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});