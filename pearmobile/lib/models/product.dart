class Product {
  final int id;
  final String name;
  final String model;
  final String type;
  final String store;
  final String price;
  final String image;
  final int stock;

  Product({
    required this.id,
    required this.name,
    required this.model,
    required this.type,
    required this.store,
    required this.price,
    required this.image,
    required this.stock,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      model: json['model'],
      type: json['type'],
      store: json['store'],
      price: json['price'],
      image: json['image'],
      stock: json['stock'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'model': model,
      'type': type,
      'store': store,
      'price': price,
      'image': image,
      'stock': stock,
    };
  }
}