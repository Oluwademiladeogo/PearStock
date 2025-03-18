import 'package:pearmobile/models/product.dart';
import 'package:pearmobile/services/api_service.dart';
import 'package:pearmobile/config/api_config.dart';

class ProductService {
  final ApiService _apiService = ApiService();

  // Get all products
  Future<List<Product>> getProducts(String token) async {
    try {
      final response = await _apiService.get(
        ApiConfig.products,
        token: token,
      );
      
      final List<dynamic> productsJson = response['data'] ?? [];
      return productsJson.map((json) => Product.fromJson(json)).toList();
    } catch (e) {
      // If API fails, use mock data for development
      return _getMockProducts();
    }
  }

  // Get a single product by ID
  Future<Product> getProductById(int id, String token) async {
    try {
      final response = await _apiService.get(
        '${ApiConfig.products}/$id',
        token: token,
      );
      
      return Product.fromJson(response['data']);
    } catch (e) {
      rethrow;
    }
  }

  // Mock products data for development
  List<Product> _getMockProducts() {
    return [
      Product(
        id: 1,
        name: "Hammer",
        model: "HM-1234",
        type: "Hand Tool",
        store: "Hardware Central",
        price: "\$25",
        image: "https://example.com/images/hammer.jpg",
        stock: 50,
      ),
      Product(
        id: 2,
        name: "Screwdriver",
        model: "SD-5678",
        type: "Hand Tool",
        store: "Hardware Central",
        price: "\$15",
        image: "https://example.com/images/screwdriver.jpg",
        stock: 75,
      ),
      // More mock products...
    ];
  }
}