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
      {/* Motion Alert Banner */}
      {data.motionDetected && (
        <View style={styles.alertBanner}>
          <View style={styles.alertBannerLeft}>
            <Text style={styles.alertIcon}>⚠️</Text>
            <View>
              <Text style={styles.alertTitle}>Motion Detected!</Text>
              <Text style={styles.alertSubtitle}>Intrusion at {data.distance}cm distance</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.alertButton} onPress={() => showToastMessage('🚨 Responding to intrusion!')}>
            <Text style={styles.alertButtonText}>RESPOND</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* System Overview Card */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>System Overview</Text>
        <View style={styles.overviewStats}>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewIcon, { backgroundColor: '#E8F5E8' }]}>
              <Text style={styles.overviewIconText}>🟢</Text>
            </View>
            <Text style={styles.overviewLabel}>Status</Text>
            <Text style={[styles.overviewValue, { color: '#4CAF50' }]}>Online</Text>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewIcon, { backgroundColor: '#E3F2FD' }]}>
              <Text style={styles.overviewIconText}>🛡️</Text>
            </View>
            <Text style={styles.overviewLabel}>Protection</Text>
            <Text style={[styles.overviewValue, { color: '#2196F3' }]}>Active</Text>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewIcon, { backgroundColor: '#FFF3E0' }]}>
              <Text style={styles.overviewIconText}>⚡</Text>
            </View>
            <Text style={styles.overviewLabel}>Power</Text>
            <Text style={[styles.overviewValue, { color: '#FF9800' }]}>{data.batteryLevel}%</Text>
          </View>
        </View>
      </View>

      {/* Quick Stats Cards */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickStats}>
          <View style={styles.statCard}>
            <View style={[styles.statCardHeader, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.statCardIcon}>🔋</Text>
            </View>
            <Text style={styles.statCardValue}>{data.batteryLevel}%</Text>
            <Text style={styles.statCardLabel}>Battery Level</Text>
            <View style={styles.statCardProgress}>
              <View style={[styles.statCardProgressFill, { width: `${data.batteryLevel}%`, backgroundColor: '#4CAF50' }]} />
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statCardHeader, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.statCardIcon}>☀️</Text>
            </View>
            <Text style={styles.statCardValue}>{data.solarVoltage}V</Text>
            <Text style={styles.statCardLabel}>Solar Power</Text>
            <View style={styles.statCardProgress}>
              <View style={[styles.statCardProgressFill, { width: '85%', backgroundColor: '#FF9800' }]} />
            </View>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statCardHeader, { backgroundColor: '#2196F3' }]}>
              <Text style={styles.statCardIcon}>📶</Text>
            </View>
            <Text style={styles.statCardValue}>{data.wifiStrength}/4</Text>
            <Text style={styles.statCardLabel}>WiFi Signal</Text>
            <View style={styles.statCardProgress}>
              <View style={[styles.statCardProgressFill, { width: `${data.wifiStrength * 25}%`, backgroundColor: '#2196F3' }]} />
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Environmental Monitoring */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Monitoring</Text>
        
        <View style={styles.envGrid}>
          <View style={styles.envCardNew}>
            <View style={styles.envCardTop}>
              <View style={[styles.envIconContainer, { backgroundColor: '#FFE0B2' }]}>
                <Text style={styles.envIconNew}>🌡️</Text>
              </View>
              <View style={styles.envTrendContainer}>
                <Text style={styles.envTrend}>↗ +1.2°</Text>
              </View>
            </View>
            <Text style={styles.envLabelNew}>Temperature</Text>
            <Text style={[styles.envValueNew, { color: '#FF9800' }]}>{data.temperature}°C</Text>
            <View style={[styles.envProgressNew, { backgroundColor: '#FFE0B2' }]}>
              <View style={[styles.envProgressFillNew, { backgroundColor: '#FF9800', width: `${Math.min(parseFloat(data.temperature) * 2.5, 100)}%` }]} />
            </View>
          </View>

          <View style={styles.envCardNew}>
            <View style={styles.envCardTop}>
              <View style={[styles.envIconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.envIconNew}>💧</Text>
              </View>
              <View style={styles.envTrendContainer}>
                <Text style={styles.envTrend}>→ 0.5%</Text>
              </View>
            </View>
            <Text style={styles.envLabelNew}>Humidity</Text>
            <Text style={[styles.envValueNew, { color: '#2196F3' }]}>{data.humidity}%</Text>
            <View style={[styles.envProgressNew, { backgroundColor: '#E3F2FD' }]}>
              <View style={[styles.envProgressFillNew, { backgroundColor: '#2196F3', width: `${parseFloat(data.humidity)}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.soilCard}>
          <View style={styles.soilCardHeader}>
            <View style={[styles.envIconContainer, { backgroundColor: '#E8F5E8' }]}>
              <Text style={styles.envIconNew}>🌱</Text>
            </View>
            <View>
              <Text style={styles.soilTitle}>Soil Moisture</Text>
              <Text style={styles.soilSubtitle}>Optimal range: 30-70%</Text>
            </View>
            <Text style={[styles.soilValue, { color: '#4CAF50' }]}>{data.soilMoisture}%</Text>
          </View>
          <View style={[styles.soilProgress, { backgroundColor: '#E8F5E8' }]}>
            <View style={[styles.soilProgressFill, { backgroundColor: '#4CAF50', width: `${parseFloat(data.soilMoisture)}%` }]} />
          </View>
          <Text style={styles.soilStatus}>
            {parseFloat(data.soilMoisture) < 30 ? '🔴 Too Dry' : 
             parseFloat(data.soilMoisture) > 70 ? '🔵 Too Wet' : '🟢 Optimal'}
          </Text>
        </View>
      </View>

      {/* Security Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Status</Text>
        
        <View style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <View style={[styles.securityIcon, { backgroundColor: data.motionDetected ? '#FFEBEE' : '#E8F5E8' }]}>
              <Text style={styles.securityIconText}>
                {data.motionDetected ? '🚨' : '🛡️'}
              </Text>
            </View>
            <View style={styles.securityInfo}>
              <Text style={styles.securityTitle}>
                {data.motionDetected ? 'INTRUSION DETECTED' : 'ALL CLEAR'}
              </Text>
              <Text style={styles.securitySubtitle}>
                Last scan: {new Date().toLocaleTimeString()}
              </Text>
            </View>
            <View style={[styles.securityStatus, { 
              backgroundColor: data.motionDetected ? '#f44336' : '#4CAF50' 
            }]}>
              <Text style={styles.securityStatusText}>
                {data.motionDetected ? 'ALERT' : 'SAFE'}
              </Text>
            </View>
          </View>
          
          {data.motionDetected && (
            <View style={styles.securityDetails}>
              <View style={styles.securityDetail}>
                <Text style={styles.securityDetailLabel}>Detection Range:</Text>
                <Text style={styles.securityDetailValue}>{data.distance}cm</Text>
              </View>
              <View style={styles.securityDetail}>
                <Text style={styles.securityDetailLabel}>Threat Level:</Text>
                <Text style={[styles.securityDetailValue, { color: '#f44336' }]}>HIGH</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.tabTitle}>Analytics & Reports</Text>
            
            {/* Performance Summary */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>🎯 Today's Performance</Text>
              <View style={styles.analyticsGrid}>
                <View style={styles.analyticsMetric}>
                  <Text style={styles.metricValue}>24</Text>
                  <Text style={styles.metricLabel}>Intrusions Detected</Text>
                </View>
                <View style={styles.analyticsMetric}>
                  <Text style={[styles.metricValue, { color: '#4CAF50' }]}>18</Text>
                  <Text style={styles.metricLabel}>Animals Scared</Text>
                </View>
                <View style={styles.analyticsMetric}>
                  <Text style={[styles.metricValue, { color: '#FF9800' }]}>6</Text>
                  <Text style={styles.metricLabel}>Sound Alerts</Text>
                </View>
                <View style={styles.analyticsMetric}>
                  <Text style={[styles.metricValue, { color: '#2196F3' }]}>99.2%</Text>
                  <Text style={styles.metricLabel}>System Uptime</Text>
                </View>
              </View>
            </View>

            {/* Environmental Trends */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>🌡️ Environmental Trends (24h)</Text>
              <View style={styles.trendItem}>
                <Text style={styles.trendLabel}>Temperature Range</Text>
                <Text style={styles.trendValue}>22.3°C - 32.1°C</Text>
              </View>
              <View style={styles.trendItem}>
                <Text style={styles.trendLabel}>Average Humidity</Text>
                <Text style={styles.trendValue}>67.5%</Text>
              </View>
              <View style={styles.trendItem}>
                <Text style={styles.trendLabel}>Soil Moisture Trend</Text>
                <Text style={[styles.trendValue, { color: '#4CAF50' }]}>↗ Increasing</Text>
              </View>
              <View style={styles.trendItem}>
                <Text style={styles.trendLabel}>Weather Condition</Text>
                <Text style={styles.trendValue}>Partly Cloudy</Text>
              </View>
            </View>

            {/* Weekly Summary */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>📊 Weekly Summary</Text>
              <View style={styles.weeklyStats}>
                <View style={styles.weeklyItem}>
                  <Text style={styles.weeklyDay}>Mon</Text>
                  <Text style={styles.weeklyCount}>12</Text>
                </View>
                <View style={styles.weeklyItem}>
                  <Text style={styles.weeklyDay}>Tue</Text>
                  <Text style={styles.weeklyCount}>8</Text>
                </View>
                <View style={styles.weeklyItem}>
                  <Text style={styles.weeklyDay}>Wed</Text>
                  <Text style={styles.weeklyCount}>15</Text>
                </View>
                <View style={styles.weeklyItem}>
                  <Text style={styles.weeklyDay}>Thu</Text>
                  <Text style={styles.weeklyCount}>7</Text>
                </View>
                <View style={styles.weeklyItem}>
                  <Text style={styles.weeklyDay}>Fri</Text>
                  <Text style={styles.weeklyCount}>11</Text>
                </View>
                <View style={styles.weeklyItem}>
                  <Text style={styles.weeklyDay}>Sat</Text>
                  <Text style={styles.weeklyCount}>9</Text>
                </View>
                <View style={styles.weeklyItem}>
                  <Text style={styles.weeklyDay}>Sun</Text>
                  <Text style={styles.weeklyCount}>6</Text>
                </View>
              </View>
            </View>

            {/* System Health */}
            <View style={styles.analyticsCard}>
              <Text style={styles.analyticsTitle}>⚙️ System Health</Text>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Solar Panel Efficiency</Text>
                <View style={styles.healthBar}>
                  <View style={[styles.healthFill, { width: '89%', backgroundColor: '#4CAF50' }]} />
                </View>
                <Text style={styles.healthValue}>89%</Text>
              </View>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Battery Health</Text>
                <View style={styles.healthBar}>
                  <View style={[styles.healthFill, { width: '92%', backgroundColor: '#4CAF50' }]} />
                </View>
                <Text style={styles.healthValue}>92%</Text>
              </View>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Sensor Accuracy</Text>
                <View style={styles.healthBar}>
                  <View style={[styles.healthFill, { width: '96%', backgroundColor: '#4CAF50' }]} />
                </View>
                <Text style={styles.healthValue}>96%</Text>
              </View>
            </View>
          </ScrollView>
        );
      
      case 'controls':
        return (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.tabTitle}>Device Controls</Text>
            
            {/* Manual Controls */}
            <View style={styles.controlSection}>
              <Text style={styles.controlSectionTitle}>🎮 Manual Controls</Text>
              
              <View style={styles.controlGrid}>
                <TouchableOpacity 
                  style={[styles.controlCard, { backgroundColor: '#4CAF50' }]}
                  onPress={() => showToastMessage('🦾 Arm movement activated')}
                >
                  <Text style={styles.controlIcon}>🦾</Text>
                  <Text style={styles.controlTitle}>Move Arms</Text>
                  <Text style={styles.controlSubtitle}>Scare away intruders</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.controlCard, { backgroundColor: '#FF9800' }]}
                  onPress={() => showToastMessage('🔊 Sound alert activated')}
                >
                  <Text style={styles.controlIcon}>🔊</Text>
                  <Text style={styles.controlTitle}>Sound Alert</Text>
                  <Text style={styles.controlSubtitle}>Loud buzzer alarm</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.controlButton, { backgroundColor: '#f44336' }]}
                onPress={() => showToastMessage('🚨 Emergency mode activated - All systems active!')}
              >
                <Text style={styles.controlButtonText}>🚨 EMERGENCY MODE</Text>
              </TouchableOpacity>
            </View>

            {/* Detection Modes */}
            <View style={styles.controlSection}>
              <Text style={styles.controlSectionTitle}>🎯 Detection Modes</Text>
              
              <View style={styles.modeCard}>
                <View style={styles.modeHeader}>
                  <Text style={styles.modeTitle}>Motion Detection</Text>
                  <View style={[styles.modeToggle, { backgroundColor: '#4CAF50' }]}>
                    <Text style={styles.modeStatus}>ON</Text>
                  </View>
                </View>
                <Text style={styles.modeDescription}>Detects movement within 5-meter range</Text>
              </View>
              
              <View style={styles.modeCard}>
                <View style={styles.modeHeader}>
                  <Text style={styles.modeTitle}>Sound Detection</Text>
                  <View style={[styles.modeToggle, { backgroundColor: '#FF9800' }]}>
                    <Text style={styles.modeStatus}>AUTO</Text>
                  </View>
                </View>
                <Text style={styles.modeDescription}>Responds to animal sounds and noises</Text>
              </View>
              
              <View style={styles.modeCard}>
                <View style={styles.modeHeader}>
                  <Text style={styles.modeTitle}>Night Mode</Text>
                  <View style={[styles.modeToggle, { backgroundColor: '#9E9E9E' }]}>
                    <Text style={styles.modeStatus}>OFF</Text>
                  </View>
                </View>
                <Text style={styles.modeDescription}>Enhanced sensitivity during nighttime</Text>
              </View>
            </View>

            {/* Sensitivity Settings */}
            <View style={styles.controlSection}>
              <Text style={styles.controlSectionTitle}>⚙️ Sensitivity Settings</Text>
              
              <View style={styles.sensitivityCard}>
                <Text style={styles.sensitivityLabel}>Motion Sensitivity</Text>
                <View style={styles.sensitivityBar}>
                  <View style={[styles.sensitivityFill, { width: '75%' }]} />
                </View>
                <Text style={styles.sensitivityValue}>High</Text>
              </View>
              
              <View style={styles.sensitivityCard}>
                <Text style={styles.sensitivityLabel}>Sound Sensitivity</Text>
                <View style={styles.sensitivityBar}>
                  <View style={[styles.sensitivityFill, { width: '60%' }]} />
                </View>
                <Text style={styles.sensitivityValue}>Medium</Text>
              </View>
              
              <View style={styles.sensitivityCard}>
                <Text style={styles.sensitivityLabel}>Response Delay</Text>
                <View style={styles.sensitivityBar}>
                  <View style={[styles.sensitivityFill, { width: '30%' }]} />
                </View>
                <Text style={styles.sensitivityValue}>0.5s</Text>
              </View>
            </View>

            {/* Schedule Controls */}
            <View style={styles.controlSection}>
              <Text style={styles.controlSectionTitle}>⏰ Schedule Controls</Text>
              
              <View style={styles.scheduleCard}>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleLabel}>Active Hours</Text>
                  <Text style={styles.scheduleValue}>06:00 - 18:00</Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleLabel}>Sleep Mode</Text>
                  <Text style={styles.scheduleValue}>18:00 - 06:00</Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Text style={styles.scheduleLabel}>Weekly Schedule</Text>
                  <Text style={styles.scheduleValue}>Monday - Sunday</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      
      case 'settings':
        return (
          <ScrollView style={styles.tabContent}>
            <Text style={styles.tabTitle}>Device Settings</Text>
            
            {/* Device Information */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>📱 Device Information</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Device ID</Text>
                <Text style={styles.settingValue}>BB-001-2024</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Firmware Version</Text>
                <Text style={styles.settingValue}>v2.1.3</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Hardware Model</Text>
                <Text style={styles.settingValue}>BantayBot Pro</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Last Update</Text>
                <Text style={styles.settingValue}>Jan 15, 2025</Text>
              </View>
            </View>

            {/* Network Settings */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🌐 Network Settings</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>WiFi Status</Text>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={[styles.settingValue, { color: '#4CAF50', maxWidth: 'none' }]}>Connected</Text>
                </View>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Network Name</Text>
                <Text style={styles.settingValue}>FarmNet_2.4G</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Signal Strength</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>-45 dBm (Excellent)</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>IP Address</Text>
                <Text style={styles.settingValue}>192.168.1.105</Text>
              </View>
            </View>

            {/* Power Management */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🔋 Power Management</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Solar Panel Status</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Charging</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Battery Health</Text>
                <Text style={styles.settingValue}>92% (Good)</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Power Mode</Text>
                <Text style={styles.settingValue}>Auto Optimize</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Low Battery Alert</Text>
                <Text style={styles.settingValue}>25%</Text>
              </View>
            </View>

            {/* Sensor Configuration */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🔧 Sensor Configuration</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Motion Sensor (PIR)</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Active</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Temperature Sensor</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>DHT22 - OK</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Humidity Sensor</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>DHT22 - OK</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Soil Moisture</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Capacitive - OK</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Distance Sensor</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Ultrasonic - OK</Text>
              </View>
            </View>

            {/* Alert Settings */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🔔 Alert Settings</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Mobile Notifications</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Enabled</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Sound Alerts</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Enabled</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Alert Frequency</Text>
                <Text style={styles.settingValue}>Every 30 seconds</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Quiet Hours</Text>
                <Text style={styles.settingValue}>22:00 - 06:00</Text>
              </View>
            </View>

            {/* Security Settings */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🔒 Security Settings</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Device Password</Text>
                <Text style={styles.settingValue}>••••••••</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Remote Access</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Enabled</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Encryption</Text>
                <Text style={styles.settingValue}>WPA3-PSK</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Auto Lock</Text>
                <Text style={styles.settingValue}>15 minutes</Text>
              </View>
            </View>

            {/* Maintenance */}
            <View style={styles.settingsCard}>
              <Text style={styles.settingsTitle}>🛠️ Maintenance</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Last Maintenance</Text>
                <Text style={styles.settingValue}>Jan 10, 2025</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Next Service Due</Text>
                <Text style={[styles.settingValue, { color: '#FF9800' }]}>Mar 10, 2025</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Total Runtime</Text>
                <Text style={styles.settingValue}>1,247 hours</Text>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>System Status</Text>
                <Text style={[styles.settingValue, { color: '#4CAF50' }]}>Healthy</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                onPress={() => showToastMessage('📡 Checking for firmware updates...')}
              >
                <Text style={styles.actionButtonText}>Check Updates</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                onPress={() => showToastMessage('🔄 System restart initiated...')}
              >
                <Text style={styles.actionButtonText}>Restart Device</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                onPress={() => showToastMessage('⚠️ Factory reset requires confirmation')}
              >
                <Text style={styles.actionButtonText}>Factory Reset</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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

  // Alert Banner
  alertBanner: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    margin: 20,
    marginBottom: 15,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  alertBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f44336',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  alertButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },

  // Overview Card
  overviewCard: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 15,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  overviewIconText: {
    fontSize: 20,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  quickStats: {
    paddingTop: 10,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 15,
    width: 140,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statCardHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statCardIcon: {
    fontSize: 20,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  statCardProgress: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  statCardProgressFill: {
    height: '100%',
    borderRadius: 2,
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

  // Environmental Cards - New Design
  envGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  envCardNew: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  envCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  envIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envIconNew: {
    fontSize: 18,
  },
  envTrendContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  envTrend: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  envLabelNew: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  envValueNew: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  envProgressNew: {
    height: 4,
    borderRadius: 2,
  },
  envProgressFillNew: {
    height: '100%',
    borderRadius: 2,
  },

  // Soil Card
  soilCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  soilCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  soilTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  soilSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  soilValue: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 'auto',
  },
  soilProgress: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  soilProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  soilStatus: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Security Card
  securityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  securityIconText: {
    fontSize: 24,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  securitySubtitle: {
    fontSize: 12,
    color: '#666',
  },
  securityStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  securityStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  securityDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  securityDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  securityDetailLabel: {
    fontSize: 13,
    color: '#666',
  },
  securityDetailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
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
    marginBottom: 20,
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
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsMetric: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  trendLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  trendValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyItem: {
    alignItems: 'center',
    flex: 1,
  },
  weeklyDay: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  weeklyCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 32,
    textAlign: 'center',
  },
  healthItem: {
    marginBottom: 15,
  },
  healthLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  healthBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 5,
  },
  healthFill: {
    height: '100%',
    borderRadius: 4,
  },
  healthValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
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
  controlSection: {
    marginBottom: 25,
  },
  controlSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  controlGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  controlCard: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  controlIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  controlTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  controlSubtitle: {
    color: 'white',
    fontSize: 11,
    opacity: 0.9,
    textAlign: 'center',
  },
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
  modeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modeStatus: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modeDescription: {
    fontSize: 13,
    color: '#666',
  },
  sensitivityCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sensitivityLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  sensitivityBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 5,
  },
  sensitivityFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  sensitivityValue: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scheduleLabel: {
    fontSize: 14,
    color: '#666',
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  // Settings
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
    minHeight: 56,
  },
  settingLabel: {
    fontSize: 15,
    color: '#495057',
    fontWeight: '500',
    flex: 1,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'right',
    maxWidth: '50%',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    minWidth: 100,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  actionButtons: {
    marginTop: 10,
    marginBottom: 40,
    paddingHorizontal: 0,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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