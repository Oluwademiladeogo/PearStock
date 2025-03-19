# PearMobile

PearMobile is the Flutter-based mobile application component of the PearStock inventory management system. It allows users to manage their inventory, track products, and monitor stock levels on the go.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Features](#features)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)
- [Getting Help](#getting-help)

## Requirements

Before installing PearMobile, ensure you have the following prerequisites:

- Flutter SDK (Version 3.29 or later)
- Dart SDK (Version 3.0 or later)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- pearserver running on port 8000
- VS Code (optional, but recommended)
- Git

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/Oluwademiladeogo/PearStock
cd PearStock/pearmobile
```

### 2. Install Flutter Dependencies

```sh
flutter pub get
```

### 3. onfiguration

### API Configuration

The app is configured to connect to the backend API. You may need to update the API URL in the `lib/config/api_config.dart` file:

```dart
const String API_URL = "http://localhost:8000";
```

### Theme Customization

You can customize the app's theme by modifying the values in `lib/theme.dart`.

## Running the App

### Development Mode

Run the app in debug mode with hot reload:

```sh
flutter run
```

## Features

PearMobile offers the following features:

- **User Authentication**: Login and signup functionality
- **Product Management**: View, search, and filter products
- **Inventory Tracking**: Monitor stock levels with visual indicators
- **Dashboard**: Overview of inventory statistics
- **Responsive Design**: Optimized for various screen sizes
- **Dark Mode Support**: Toggle between light and dark themes

## Building for Production

### Android

Build the release APK:

```sh
flutter build apk
```

The output files will be located in `build/app/outputs/`.

### iOS (macOS only)

Build the iOS app:

```sh
flutter build ios
```

Then open the iOS project in Xcode to archive and distribute.

#### Build Failures

- Ensure Flutter is up to date:
  ```sh
  flutter upgrade
  ```
- Clean build files:
  ```sh
  flutter clean
  ```
- Get dependencies again:
  ```sh
  flutter pub get
  ```

#### API Connection Issues

- Check your internet connection
- Verify API URL is correct in the configuration
- Ensure the backend server is running

#### iOS Build Issues

- Run `pod install` in the `ios` directory:
  ```sh
  cd ios && pod install
  ```
- Update CocoaPods:
  ```sh
  sudo gem install cocoapods
  ```

## Getting Help

If you encounter any issues not covered here, please contact me or create an issue in the GitHub repository.

---

Built with 💙 by Demilade.