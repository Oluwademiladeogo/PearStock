import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:pearmobile/config/api_config.dart';

class ApiService {
  Future<dynamic> get(String endpoint, {String? token}) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: ApiConfig.headers(token),
    );
    
    return _processResponse(response);
  }

  Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> data, {
    String? token,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: ApiConfig.headers(token),
      body: jsonEncode(data),
    );
    
    return _processResponse(response);
  }

  Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> data, {
    String? token,
  }) async {
    final response = await http.put(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: ApiConfig.headers(token),
      body: jsonEncode(data),
    );
    
    return _processResponse(response);
  }

  Future<Map<String, dynamic>> delete(String endpoint, {String? token}) async {
    final response = await http.delete(
      Uri.parse('${ApiConfig.baseUrl}$endpoint'),
      headers: ApiConfig.headers(token),
    );
    
    return _processResponse(response);
  }

  dynamic _processResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isNotEmpty) {
        return json.decode(response.body);
      }
      return {};
    } else {
      Map<String, dynamic> errorResponse = {};
      try {
        errorResponse = json.decode(response.body);
      } catch (_) {
        errorResponse = {
          'error': 'Request failed with status: ${response.statusCode}',
        };
      }
      throw ApiException(
        response.statusCode,
        errorResponse['error'] ?? 'Unknown error occurred',
      );
    }
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String message;

  ApiException(this.statusCode, this.message);

  @override
  String toString() => 'ApiException: $statusCode - $message';
}