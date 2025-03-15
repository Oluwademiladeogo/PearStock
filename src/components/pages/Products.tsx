import React, { useEffect, useState } from "react";
import productsData from "../../data/products.json";

interface Product {
  id: number;
  name: string;
  model: string;
  type: string;
  store: string;
  price: string;
  image: string;
  stock: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    setProducts(productsData.products || []);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">All Items</h1>
        <p className="text-gray-600">Items detail Information</p>
        <div className="flex justify-between items-center mt-4">
          <input
            type="text"
            placeholder="Search Item"
            value={search}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-md w-1/3"
          />
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">+ Add Item</button>
            <button className="bg-gray-200 px-4 py-2 rounded-md">Filter</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow mt-6">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b bg-gray-10">
              <th className="px-4 py-2">Item Name</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Model</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Store</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md" />
                </td>
                <td className="px-4 py-2">{product.model}</td>
                <td className="px-4 py-2">{product.type}</td>
                <td className="px-4 py-2">{product.store}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="max-w-6xl mx-auto mt-6 flex justify-between items-center">
        <p className="text-gray-600">Showing {indexOfFirstProduct + 1} to {indexOfLastProduct} out of {filteredProducts.length} records</p>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? "text-gray-400" : "text-gray-700"}`}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded-md ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? "text-gray-400" : "text-gray-700"}`}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;