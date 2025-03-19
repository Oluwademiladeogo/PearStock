import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:pearmobile/config/routes.dart';
import 'package:pearmobile/providers/auth_provider.dart';
import 'package:pearmobile/providers/theme_provider.dart';

class MobileNavbar extends StatefulWidget {
  const MobileNavbar({super.key});

  @override
  MobileNavbarState createState() => MobileNavbarState();
}

class MobileNavbarState extends State<MobileNavbar> {
  bool _isMenuOpen = false;

  void _toggleMenu() {
    setState(() {
      _isMenuOpen = !_isMenuOpen;
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final isDarkMode = themeProvider.isDarkMode;

    // Menu button that triggers the slide-in menu
    return Stack(
      children: [
        // Menu button
        Positioned(
          top: 16,
          right: 16,
          child: Container(
            decoration: BoxDecoration(
              color: isDarkMode ? Colors.blue.shade700 : Colors.blue.shade600,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Color(0x33000000),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: IconButton(
              icon: Icon(
                _isMenuOpen ? Icons.close : Icons.menu,
                color: Colors.white,
              ),
              onPressed: _toggleMenu,
              padding: const EdgeInsets.all(12),
              iconSize: 24,
            ),
          ),
        ),

        // Slide-in menu
        if (_isMenuOpen)
          Positioned(
            top: 70,
            right: 16,
            child: Container(
              width: 240,
              decoration: BoxDecoration(
                color: isDarkMode ? Colors.blue.shade500 : Colors.blue.shade100,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Color(0x33000000),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Text(
                          '📦 Inventory',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: isDarkMode ? Colors.white : Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Navigation items
                  _buildNavItem(
                    context,
                    icon: Icons.dashboard,
                    title: 'Dashboard',
                    route: Routes.dashboard,
                    isDarkMode: isDarkMode,
                  ),

                  _buildNavItem(
                    context,
                    icon: Icons.inventory,
                    title: 'Products',
                    route: Routes.products,
                    isDarkMode: isDarkMode,
                  ),

                  const SizedBox(height: 8),
                  const Divider(),

                  _buildNavItem(
                    context,
                    icon: Icons.logout,
                    title: 'Logout',
                    route: Routes.logout,
                    isDarkMode: isDarkMode,
                    onTap: () {
                      authProvider.logout();
                      Navigator.pushReplacementNamed(context, Routes.login);
                    },
                  ),

                  // Theme toggle
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16.0, vertical: 8.0),
                    child: Row(
                      children: [
                        _buildThemeButton(
                          context,
                          icon: Icons.light_mode,
                          label: 'Light',
                          isSelected: !isDarkMode,
                          onPressed: () => themeProvider.setDarkMode(false),
                        ),
                        const SizedBox(width: 8),
                        _buildThemeButton(
                          context,
                          icon: Icons.dark_mode,
                          label: 'Dark',
                          isSelected: isDarkMode,
                          onPressed: () => themeProvider.setDarkMode(true),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String route,
    required bool isDarkMode,
    VoidCallback? onTap,
  }) {
    final bool isCurrentRoute = ModalRoute.of(context)?.settings.name == route;

    return GestureDetector(
      onTap: onTap ??
          () {
            Navigator.pushReplacementNamed(context, route);
            _toggleMenu(); // Close menu after selection
          },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        decoration: BoxDecoration(
          color: isCurrentRoute ? Colors.blue.shade300 : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 18,
              color: isCurrentRoute
                  ? Colors.blue.shade900
                  : isDarkMode
                      ? Colors.white
                      : Colors.black,
            ),
            const SizedBox(width: 12),
            Text(
              title,
              style: TextStyle(
                fontWeight:
                    isCurrentRoute ? FontWeight.bold : FontWeight.normal,
                color: isCurrentRoute
                    ? Colors.blue.shade900
                    : isDarkMode
                        ? Colors.white
                        : Colors.black,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildThemeButton(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool isSelected,
    required VoidCallback onPressed,
  }) {
    return Expanded(
      child: ElevatedButton.icon(
        icon: Icon(icon, size: 16),
        label: Text(label),
        onPressed: () {
          onPressed();
          _toggleMenu(); // Close menu after selection
        },
        style: ElevatedButton.styleFrom(
          backgroundColor:
              isSelected ? Colors.blue.shade600 : Colors.blue.shade300,
          foregroundColor: isSelected ? Colors.white : Colors.black,
          padding: const EdgeInsets.symmetric(vertical: 8),
        ),
      ),
    );
  }
}
