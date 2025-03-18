import 'package:flutter/material.dart';
import 'package:pearmobile/models/user.dart';
import 'package:pearmobile/services/auth_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  final FlutterSecureStorage _storage = FlutterSecureStorage();

  User? _user;
  bool _loading = false;
  String _error = '';

  User? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get loading => _loading;
  String get error => _error;
  String? get token => _user?.token;

  AuthProvider() {
    _initUser();
  }

  Future<void> _initUser() async {
    await _setLoadingState(true);
    try {
      _user = await _authService.getCurrentUser();
    } catch (e) {
      _setError(e);
    } finally {
      await _setLoadingState(false);
    }
  }

  Future<bool> login(String email, String password) async {
    return await _authenticate(() => _authService.login(email, password));
  }

  Future<bool> signup(String email, String password) async {
    return await _authenticate(
        () => _authService.signup(email, password));
  }

  Future<bool> forgotPassword(String email) async {
    return await _execute(() => _authService.forgotPassword(email));
  }

  Future<bool> verifyOtp(String otp) async {
    return await _execute(() => _authService.verifyOtp(otp));
  }

  Future<void> logout() async {
    _user = null;
    _loading = false;
    _error = '';
    await _storage.delete(key: 'token');
    await _storage.delete(key: 'user');
    notifyListeners();
  }

  void clearError() {
    _error = '';
    notifyListeners();
  }

  Future<bool> resetPassword(String newPassword, String confirmPassword) async {
    if (newPassword != confirmPassword) {
      throw Exception("Passwords do not match.");
    }
    // TODO: Implement the actual password reset logic, e.g., make an API call.
    return true;
  }

  Future<void> _setLoadingState(bool state) async {
    _loading = state;
    notifyListeners();
  }

  void _setError(dynamic e) {
    _error = e.toString();
  }

  Future<bool> _authenticate(Future<User?> Function() authMethod) async {
    await _setLoadingState(true);
    _error = '';
    notifyListeners();
    try {
      _user = await authMethod();
      return true;
    } catch (e) {
      _setError(e);
      return false;
    } finally {
      await _setLoadingState(false);
    }
  }

  Future<bool> _execute(Future<void> Function() method) async {
    await _setLoadingState(true);
    _error = '';
    notifyListeners();
    try {
      await method();
      return true;
    } catch (e) {
      _setError(e);
      return false;
    } finally {
      await _setLoadingState(false);
    }
  }
}
