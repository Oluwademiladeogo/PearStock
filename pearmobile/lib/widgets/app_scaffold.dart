import 'package:flutter/material.dart';
import 'package:pearmobile/widgets/pear_app_bar.dart';
import 'package:pearmobile/widgets/mobile_navbar.dart';

class AppScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final Widget? bottomNavigationBar;
  final bool showMobileNavbar;

  const AppScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.bottomNavigationBar,
    this.showMobileNavbar = true,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PearAppBar(
        title: title,
        actions: actions,
      ),
      body: Stack(
        children: [
          // Main content
          body,
          
          // Mobile navbar overlay
          if (showMobileNavbar) 
            const MobileNavbar(),
        ],
      ),
      floatingActionButton: floatingActionButton,
      floatingActionButtonLocation: floatingActionButtonLocation,
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}