import 'package:pearmobile/models/user.dart';
import 'package:pearmobile/services/api_service.dart';
import 'package:pearmobile/config/api_config.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class AuthService {
  final ApiService _apiService = ApiService();
  static const String _userKey = 'user';

  // Login user
  Future<User> login(String email, String password) async {
    try {
      final response = await _apiService.post(ApiConfig.login, {
        'email': email,
        'password': password,
      });

      final user = User.fromJson({
        ...response['user'],
        'token': response['token'],
      });

      await _saveUserToStorage(user);
      return user;
    } catch (e) {
      rethrow;
    }
  }

  // Register user
  Future<User> signup(
    String email,
    String password,
  ) async {
    try {
      final response = await _apiService.post(ApiConfig.signup, {
        'email': email,
        'password': password,
      });

      final user = User.fromJson({
        ...response['user'],
        'token': response['token'],
      });

      await _saveUserToStorage(user);
      return user;
    } catch (e) {
      rethrow;
    }
  }

  // Forgot password
  Future<void> forgotPassword(String email) async {
    try {
      await _apiService.post(ApiConfig.forgotPassword, {'email': email});
    } catch (e) {
      rethrow;
    }
  }

  // Verify OTP
  Future<void> verifyOtp(String otp) async {
    try {
      await _apiService.post(ApiConfig.verifyOtp, {'otp': otp});
    } catch (e) {
      rethrow;
    }
  }

  // Reset Password
  Future<void> resetPassword(String password, String confirmPassword) async {
    try {
      await _apiService.post(ApiConfig.resetPassword, {
        'password': password,
        'confirmPassword': confirmPassword,
      });
    } catch (e) {
      rethrow;
    }
  }

  // Logout user
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
  }

  // Get current user from storage
  Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(_userKey);

    if (userJson == null) return null;

    try {
      return User.fromJson(json.decode(userJson));
    } catch (e) {
      return null;
    }
  }

  // Save user to storage
  Future<void> _saveUserToStorage(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, json.encode(user.toJson()));
  }
}
