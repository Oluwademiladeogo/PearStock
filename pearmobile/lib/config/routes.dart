import 'package:flutter/material.dart';
import 'package:pearmobile/screens/dashboard_screen.dart';
import 'package:pearmobile/screens/login_screen.dart';
import 'package:pearmobile/screens/signup_screen.dart';
import 'package:pearmobile/screens/forgot_password_screen.dart';
import 'package:pearmobile/screens/verify_otp_screen.dart';
import 'package:pearmobile/screens/products_screen.dart';

class Routes {
  static const String login = '/login';
  static const String signup = '/signup';
  static const String forgotPassword = '/forgot-password';
  static const String verifyOtp = '/verify-otp';
  static const String dashboard = '/dashboard';
  static const String products = '/products';
  static const String logout = '/logout';
  static const String resetPassword = '/reset-password';
}

class RouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case Routes.login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case Routes.signup:
        return MaterialPageRoute(builder: (_) => const SignupScreen());
      case Routes.forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());
      case Routes.verifyOtp:
        return MaterialPageRoute(builder: (_) => const VerifyOtpScreen());
      case Routes.dashboard:
        return MaterialPageRoute(builder: (_) => const DashboardScreen());
      case Routes.products:
        return MaterialPageRoute(builder: (_) => const ProductsScreen());
      case Routes.logout:
        return MaterialPageRoute(builder: (_) {
          // This is just a placeholder - the actual logout is handled in the navbar
          return const LoginScreen();
        });
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
