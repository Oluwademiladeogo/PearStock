import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../utils/api";
import Cookies from "js-cookie";

// Define interfaces for product data and filter options
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

interface FilterOptions {
  type: string;
  store: string;
}

const Products: React.FC = () => {
  const router = useRouter();
  const { hydrated, isAuthenticated } = useProtectedRoute();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Modal state variables
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // New product and edit product state
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: "",
    store: "",
  });
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [availableStores, setAvailableStores] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products data on mount if authenticated
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/products/");
        if (isMounted) {
          const productData = response.data;
          setProducts(Array.isArray(productData) ? productData : []);
          setFilteredProducts(Array.isArray(productData) ? productData : []);
          // Extract unique types and stores for filter options
          if (Array.isArray(productData)) {
            setAvailableTypes([
              ...new Set(productData.map((p: Product) => p.type)),
            ]);
            setAvailableStores([
              ...new Set(productData.map((p: Product) => p.store)),
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProducts();
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Apply search and filter logic whenever search or filterOptions update
  useEffect(() => {
    let tempProducts = [...products];
    if (search) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filterOptions.type) {
      tempProducts = tempProducts.filter(
        (product) => product.type === filterOptions.type,
      );
    }
    if (filterOptions.store) {
      tempProducts = tempProducts.filter(
        (product) => product.store === filterOptions.store,
      );
    }
    setFilteredProducts(tempProducts);
    setCurrentPage(1); // Reset pagination on filtering change
  }, [search, filterOptions, products]);

  // Set product data for editing when one product is selected
  useEffect(() => {
    if (selectedProducts.length === 1) {
      const selected = products.find((p) => p.id === selectedProducts[0]);
      if (selected) {
        setEditProduct(selected);
      }
    }
  }, [selectedProducts, products]);

  // Redirect to login if unauthenticated
  if (!hydrated) return <LoadingSpinner />;
  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSelectProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id],
    );
  };

  const handleDeleteSelected = async () => {
    if (!confirm("Are you sure you want to delete the selected products?")) {
      return;
    }

    setIsLoading(true);
    try {
      await Promise.all(
        selectedProducts.map((id) => api.delete(`/api/products/${id}/`)),
      );
      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id)),
      );
      setFilteredProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id)),
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Failed to delete some products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setNewProduct({});
    setShowAddModal(true);
  };

  const handleEditSelected = () => {
    if (selectedProducts.length !== 1) {
      alert("Please select exactly one product to edit");
      return;
    }
    setShowEditModal(true);
  };

  const handleFilter = () => {
    setShowFilterModal(true);
  };

  const submitNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCookie = Cookies.get("user");
      const user = userCookie ? JSON.parse(userCookie) : null;

      if (!user) {
        alert("User information not found. Please log in again.");
        return;
      }

      const productData = {
        ...newProduct,
        price:
          typeof newProduct.price === "string"
            ? parseFloat(newProduct.price)
            : newProduct.price,
        user: user.id, // Include the user ID in the product data
      };

      const response = await api.post("/api/products/", productData);
      const newProductResponse = response.data;

      setProducts((prevProducts) => [...prevProducts, newProductResponse]);
      setFilteredProducts((prevFilteredProducts) => [
        ...prevFilteredProducts,
        newProductResponse,
      ]);
      setShowAddModal(false);
      setNewProduct({});
    } catch (error: any) {
      console.error("Error adding product:", error.response?.data);
      alert("Failed to add product. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put(
        `/api/products/${editProduct.id}/`,
        editProduct,
      );
      const updatedProduct = response.data;

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p,
        ),
      );
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p,
        ),
      );
      setShowEditModal(false);
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error deleting products:", error);
      alert("Failed to delete some products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilterModal(false);
    // Filter happens via useEffect with filterOptions dependency
  };

  const resetFilters = () => {
    setFilterOptions({ type: "", store: "" });
    setShowFilterModal(false);
  };

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">All Items</h1>
        <p className="text-gray-600">Items detail information</p>
        <div className="flex justify-between items-center mt-4">
          <input
            type="text"
            placeholder="Search Item"
            value={search}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-md w-1/3"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAddProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              + Add Item
            </button>
            <button
              onClick={handleFilter}
              className="bg-gray-200 px-4 py-2 rounded-md"
              disabled={isLoading}
            >
              Filter
            </button>
            {selectedProducts.length > 0 && (
              <>
                {selectedProducts.length === 1 && (
                  <button
                    onClick={handleEditSelected}
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                    disabled={isLoading}
                  >
                    Edit Selected
                  </button>
                )}
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  disabled={isLoading}
                >
                  Delete Selected
                </button>
              </>
            )}
          </div>
        </div>

        {filterOptions.type || filterOptions.store ? (
          <div className="mt-4 flex items-center">
            <span className="mr-2">Active filters:</span>
            {filterOptions.type && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                Type: {filterOptions.type}
                <button
                  onClick={() =>
                    setFilterOptions({ ...filterOptions, type: "" })
                  }
                  className="ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {filterOptions.store && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Store: {filterOptions.store}
                <button
                  onClick={() =>
                    setFilterOptions({ ...filterOptions, store: "" })
                  }
                  className="ml-1"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* Products Table or Loading */}
      {isLoading ? (
        <div className="max-w-6xl mx-auto mt-6 flex justify-center py-10">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow mt-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedProducts(
                        e.target.checked
                          ? products.map((product) => product.id)
                          : [],
                      )
                    }
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
                    }
                  />
                </th>
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
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 ${
                      selectedProducts.includes(product.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                      />
                    </td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-md"
                      />
                    </td>
                    <td className="px-4 py-2">{product.model}</td>
                    <td className="px-4 py-2">{product.type}</td>
                    <td className="px-4 py-2">{product.store}</td>
                    <td className="px-4 py-2">${product.price}</td>
                    <td className="px-4 py-2">{product.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No products to display.
                    <button
                      onClick={handleAddProduct}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md ml-4"
                    >
                      + Add Item
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {currentProducts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {indexOfFirstProduct + 1} to{" "}
            {Math.min(indexOfLastProduct, filteredProducts.length)} out of{" "}
            {filteredProducts.length} records
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 border rounded-md ${
                currentPage === 1 ? "text-gray-400" : "text-gray-700"
              }`}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-4 py-2 border rounded-md ${
                currentPage === totalPages ? "text-gray-400" : "text-gray-700"
              }`}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={submitNewProduct}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={newProduct.name || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={newProduct.model || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, model: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={newProduct.type || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, type: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Store</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={newProduct.store || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, store: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                  value={newProduct.price || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={newProduct.image || ""}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                  value={newProduct.stock || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={submitEditProduct}>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={editProduct.name || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={editProduct.model || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, model: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={editProduct.type || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, type: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Store</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={editProduct.store || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, store: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                  value={editProduct.price || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={editProduct.image || ""}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded"
                  value={editProduct.stock || ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      stock: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Filter Products</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={filterOptions.type}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, type: e.target.value })
                }
              >
                <option value="">All Types</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Store</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={filterOptions.store}
                onChange={(e) =>
                  setFilterOptions({ ...filterOptions, store: e.target.value })
                }
              >
                <option value="">All Stores</option>
                {availableStores.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 border rounded"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
