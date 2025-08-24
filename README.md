# BantayBot Monitor App

A React Native mobile application for monitoring your BantayBot solar-powered automated scarecrow system. This app displays real-time sensor data, motion alerts, and allows remote control of deterrent mechanisms.

## Features

- 📊 **Real-time Environmental Monitoring**: Temperature, humidity, and soil moisture
- 🚨 **Motion Detection Alerts**: PIR sensor and ultrasonic distance monitoring  
- 🔋 **System Status**: Battery level and WiFi signal strength
- 🎛️ **Remote Controls**: Manual arm movement and buzzer activation
- 📱 **Mobile-First Design**: Optimized for smartphones and tablets
- 🎭 **Demo Mode**: Sample data for testing and development

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device (available on App Store/Google Play)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd BantayBotUI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

4. **Run on your device:**
   - Install Expo Go on your phone
   - Scan the QR code displayed in your terminal
   - The app will load with demo data

## App Screens & Features

### Main Dashboard
- **System Status**: Online/offline indicator, battery level, WiFi signal
- **Environmental Data**: Live temperature, humidity, soil moisture readings
- **Intrusion Detection**: Motion status and distance measurements
- **Control Panel**: Manual controls for arms and buzzer

### Demo Data
The app currently runs with simulated data that updates every 3 seconds:
- Temperature: 20-35°C
- Humidity: 40-80%
- Soil Moisture: 20-80%
- Motion Detection: Random alerts
- Distance: 50-350cm readings
- Battery: 70-100% levels

## Connecting to Arduino Hardware

To connect this app to your actual BantayBot Arduino system, you'll need to implement the communication layer. Here are the options:

### Option 1: WiFi Direct Communication

**Arduino Side Setup:**
```cpp
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "your-wifi-network";
const char* password = "your-wifi-password";

// Sensor pins
#define PIR_PIN 2
#define TRIGGER_PIN 5
#define ECHO_PIN 18
#define DHT_PIN 4
#define SOIL_MOISTURE_PIN A0

WebSocketsServer webSocket = WebSocketsServer(81);

void setup() {
  Serial.begin(115200);
  
  // Initialize sensors
  pinMode(PIR_PIN, INPUT);
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  
  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  
  // Read sensor data every 2 seconds
  static unsigned long lastSensorRead = 0;
  if (millis() - lastSensorRead > 2000) {
    sendSensorData();
    lastSensorRead = millis();
  }
}

void sendSensorData() {
  StaticJsonDocument<200> doc;
  
  // Read sensors
  doc["temperature"] = readTemperature();
  doc["humidity"] = readHumidity(); 
  doc["soilMoisture"] = readSoilMoisture();
  doc["motionDetected"] = digitalRead(PIR_PIN);
  doc["distance"] = readDistance();
  doc["batteryLevel"] = readBatteryLevel();
  doc["timestamp"] = millis();
  
  String jsonString;
  serializeJson(doc, jsonString);
  webSocket.broadcastTXT(jsonString);
}

// Implement sensor reading functions
float readTemperature() { /* DHT sensor code */ }
float readHumidity() { /* DHT sensor code */ }
float readSoilMoisture() { /* Analog read and conversion */ }
float readDistance() { /* Ultrasonic sensor code */ }
float readBatteryLevel() { /* Battery voltage measurement */ }

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_CONNECTED:
      Serial.printf("Client %u connected\n", num);
      break;
    case WStype_TEXT:
      // Handle commands from app
      handleCommand((char*)payload);
      break;
  }
}

void handleCommand(String command) {
  if (command == "activate_arms") {
    // Move servo arms
  } else if (command == "activate_buzzer") {
    // Sound buzzer
  }
}
```

**App Side Setup:**
Create a new file `services/ArduinoConnection.js`:

```javascript
class ArduinoConnection {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.arduinoIP = '192.168.1.100'; // Your Arduino's IP
  }

  connect() {
    try {
      this.ws = new WebSocket(`ws://${this.arduinoIP}:81`);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('Connected to Arduino');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.onDataReceived(data);
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        setTimeout(() => this.connect(), 5000); // Reconnect
      };
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

  sendCommand(command) {
    if (this.ws && this.isConnected) {
      this.ws.send(command);
    }
  }

  onDataReceived(data) {
    // Update your app state with real sensor data
    // This replaces the generateDemoData() function
  }
}

export default new ArduinoConnection();
```

### Option 2: HTTP REST API

**Arduino Setup:**
```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>

WebServer server(80);

void setup() {
  // WiFi setup...
  
  server.on("/api/sensors", HTTP_GET, handleSensors);
  server.on("/api/control", HTTP_POST, handleControl);
  server.begin();
}

void handleSensors() {
  StaticJsonDocument<300> doc;
  doc["temperature"] = readTemperature();
  doc["humidity"] = readHumidity();
  // ... other sensors
  
  String response;
  serializeJson(doc, response);
  server.send(200, "application/json", response);
}
```

**App Setup:**
```javascript
// services/api.js
const ARDUINO_BASE_URL = 'http://192.168.1.100'; // Arduino IP

export const fetchSensorData = async () => {
  try {
    const response = await fetch(`${ARDUINO_BASE_URL}/api/sensors`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch sensor data:', error);
    return null;
  }
};

export const sendControlCommand = async (command) => {
  try {
    await fetch(`${ARDUINO_BASE_URL}/api/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
  } catch (error) {
    console.error('Failed to send command:', error);
  }
};
```

### Hardware Requirements

**Arduino Components:**
- ESP32 or ESP8266 (for WiFi capability)
- DHT11/DHT22 (temperature/humidity sensor)
- PIR motion sensor
- HC-SR04 ultrasonic sensor
- Soil moisture sensor
- Servo motors (for arm movement)
- Buzzer/speaker
- Solar panel + battery management
- Relay modules (for high-power devices)

**Wiring Diagram:**
```
ESP32 Connections:
├── DHT22 → Pin 4
├── PIR Sensor → Pin 2  
├── Ultrasonic Trigger → Pin 5
├── Ultrasonic Echo → Pin 18
├── Soil Moisture → A0
├── Servo 1 → Pin 12
├── Servo 2 → Pin 13
├── Buzzer → Pin 14
└── Battery Monitor → A1
```

## Production Setup

### Building for Production

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS:**
   ```bash
   eas build:configure
   ```

3. **Build for Android:**
   ```bash
   eas build --platform android
   ```

4. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

### Environment Configuration

Create different environment configs for demo vs production:

**Demo Mode** (default):
- Uses `generateDemoData()` function
- Updates every 3 seconds with random values
- No real hardware connection required

**Production Mode**:
- Replace demo data with real Arduino connection
- Implement error handling and reconnection logic
- Add authentication if needed

## Troubleshooting

### Common Issues

1. **App won't start:**
   - Run `npx expo install --fix` to resolve dependencies
   - Clear cache: `npx expo start --clear`

2. **Can't connect to Arduino:**
   - Check WiFi network (phone and Arduino must be on same network)
   - Verify Arduino IP address
   - Check firewall settings

3. **Sensor data not updating:**
   - Check Arduino serial monitor for errors
   - Verify sensor wiring and power supply
   - Test individual sensors separately

### Network Configuration

For local development, ensure your phone and Arduino are on the same WiFi network. For remote access, consider:

- **Port Forwarding**: Open router ports for external access
- **VPN**: Set up VPN for secure remote monitoring  
- **Cloud Service**: Use AWS IoT or Google Cloud IoT for data relay

## Contributing

This is a capstone project for Polytechnic University of the Philippines by:
- Danseco, Prince Vincent
- Folloso, John Alexis B.
- Poblete, Jules M.
- Sebuco, John Carlos G.
- Seguerra, Errol A.

## License

Academic project - PUP Lopez, Quezon

---

🤖 **BantayBot** - Protecting crops with solar-powered automation