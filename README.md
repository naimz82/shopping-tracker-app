# Shopping Tracker App

A simple mobile application built with React Native and Expo to help you track your shopping lists and expenses.

## Features

- Track shopping items and lists
- Track item prices as you shop
- Cross-platform support (iOS & Android)
- Persistent local storage using AsyncStorage
- Clean and intuitive user interface

## Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **AsyncStorage** - Local data persistence
- **React Native Vector Icons** - Icon library

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (optional, but recommended)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing on physical devices)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naimz82/shopping-tracker-app.git
   cd shopping-tracker-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or if you're using yarn:
   ```bash
   yarn install
   ```

## Running the App

### Start the Development Server

```bash
npm start
```
or
```bash
npx expo start
```

This will start the Expo development server and display a QR code in your terminal.

### Run on Different Platforms

#### iOS (macOS only)
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Web
```bash
npm run web
```

### Testing on Physical Devices

1. Install the **Expo Go** app on your iOS or Android device
2. Scan the QR code displayed in your terminal using:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app's QR code scanner
3. The app will load on your device

### Testing on Emulators/Simulators

- **iOS Simulator**: Requires Xcode (macOS only)
- **Android Emulator**: Requires Android Studio

## Project Structure

```
shopping-tracker-app/
├── App.js              # Main application component
├── index.js            # Entry point
├── package.json        # Dependencies and scripts
├── app.json           # Expo configuration
└── assets/            # Images, fonts, and other assets
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator (macOS only)
- `npm run web` - Run in web browser

## Dependencies

- `expo` - Expo SDK
- `react` - React library
- `react-native` - React Native framework
- `@react-navigation/native` - Navigation library
- `@react-navigation/native-stack` - Stack navigator
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-vector-icons` - Icon components
- `uuid` - Unique ID generation

## Development

To start developing:

1. Open `App.js` in your favorite code editor
2. Make your changes
3. The app will automatically reload with your changes (Fast Refresh)

## Troubleshooting

### Metro Bundler Issues
If you encounter issues with the Metro bundler, try:
```bash
npm start --clear
```

### Dependency Issues
If you have dependency problems, try:
```bash
rm -rf node_modules
npm install
```

### Cache Issues
Clear Expo cache:
```bash
npx expo start -c
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Project Link: [https://github.com/naimz82/shopping-tracker-app](https://github.com/naimz82/shopping-tracker-app)

---

**Happy Shopping Tracking! 🛒**
