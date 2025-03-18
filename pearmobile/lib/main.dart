import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pearmobile/providers/auth_provider.dart';
import 'package:pearmobile/providers/theme_provider.dart';
import 'package:pearmobile/providers/product_provider.dart';
import 'package:pearmobile/config/routes.dart';
import 'package:pearmobile/config/theme.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
      ],
      child: const PearStockApp(),
    ),
  );
}

class PearStockApp extends StatelessWidget {
  const PearStockApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    
    return MaterialApp(
      title: 'PearStock',
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: themeProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      initialRoute: authProvider.isAuthenticated ? Routes.dashboard : Routes.login,
      onGenerateRoute: RouteGenerator.generateRoute,
    );
  }
}