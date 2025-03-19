import 'package:shared_preferences/shared_preferences.dart';

class ApiConfig {
  // Base URL for API requests
  static const String baseUrl =
      'http://localhost:8000/api'; // Use localhost with Android emulator
  // static const String baseUrl = 'http://127.0.0.1:8000/api'; // Use for iOS simulator

  // Authentication endpoints
  static const String login = '/login/';
  static const String signup = '/signup/';
  static const String forgotPassword = '/forgot-password/';
  static const String verifyOtp = '/verify-otp/';
  static const String resetPassword = '/reset-password/';
  // Product endpoints
  static const String products = '/products/';

  // Headers
  static Map<String, String> headers(String? token) {
    Map<String, String> headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token != null) {
      headers['Authorization'] = 'Token $token';
    }

    return headers;
  }

  // Save token to shared preferences
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  // Retrieve token from shared preferences
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  // Remove token from shared preferences
  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }
}
