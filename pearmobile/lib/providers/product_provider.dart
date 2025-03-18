import 'package:flutter/material.dart';
import 'package:pearmobile/models/product.dart';
import 'package:pearmobile/services/product_service.dart';

class ProductProvider with ChangeNotifier {
  final ProductService _productService = ProductService();
  
  List<Product> _products = [];
  bool _loading = false;
  String _error = '';
  String _searchQuery = '';
  
  List<Product> get products => _products;
  bool get loading => _loading;
  String get error => _error;
  String get searchQuery => _searchQuery;
  
  // Get filtered products based on search query
  List<Product> get filteredProducts {
    if (_searchQuery.isEmpty) {
      return _products;
    }
    
    return _products.where((product) => 
      product.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
      product.model.toLowerCase().contains(_searchQuery.toLowerCase()) ||
      product.type.toLowerCase().contains(_searchQuery.toLowerCase())
    ).toList();
  }
  
  // Fetch all products
  Future<void> fetchProducts(String token) async {
    _loading = true;
    _error = '';
    notifyListeners();
    
    try {
      _products = await _productService.getProducts(token);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }
  
  // Set search query
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }
  
  // Clear any errors
  void clearError() {
    _error = '';
    notifyListeners();
  }
}