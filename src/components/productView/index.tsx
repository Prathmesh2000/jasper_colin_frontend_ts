"use client"; 

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';

interface Product {
  id: string;
  productName: string;
  price: number;
  category: string;
  detail: string;
}

interface Filters {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ProductViewComponentProps {
  role: 'user' | 'admin';
}

export const ProductViewComponent: React.FC<ProductViewComponentProps> = ({ role = 'user' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({ name: '', category: '', price: '' });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}/api/products`);
      setProducts(response.data?.data || []);
      setFilteredProducts(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(newFilters.name.toLowerCase()) &&
        product.category.toLowerCase().includes(newFilters.category.toLowerCase()) &&
        (newFilters.price ? product.price <= Number(newFilters.price) : true)
    );
    setFilteredProducts(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.BASE_URL}/api/products/${id}`, { withCredentials: true });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditProduct(product);
    setIsNew(false);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditProduct({ id: '', productName: '', price: 0, category: '', detail: '' });
    setIsNew(true);
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        await axios.post(`${process.env.BASE_URL}/api/products`, { ...editProduct, price: Number(editProduct?.price) || 0, name: editProduct?.productName }, { withCredentials: true });
      } else {
        await axios.put(`${process.env.BASE_URL}/api/products/${editProduct?.id}`, { ...editProduct, price: Number(editProduct?.price) || 0, name: editProduct?.productName }, { withCredentials: true });
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-end mb-4">  
        <Link className="bg-red-500 text-white py-2 px-4 rounded flex items-center gap-2" href={'/login'}>Login With Different Account</Link>
      </div>
      <h1 className="text-center text-2xl mb-6">Product List</h1>

      <div className="flex justify-end mb-4">
        {role === 'admin' && (
          <button className="bg-green-500 text-white py-2 cursor-pointer px-4 rounded flex items-center gap-2" onClick={handleAddClick}>
            <FaPlus /> Add Product
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          name="name"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          name="category"
          placeholder="Filter by Category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Max Price"
          value={filters.price}
          onChange={handleFilterChange}
          className="p-2 border rounded w-full"
        />
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="border-b px-4 py-2">Product Name</th>
            <th className="border-b px-4 py-2">Price</th>
            <th className="border-b px-4 py-2">Category</th>
            <th className="border-b px-4 py-2">Description</th>
            {role === 'admin' && <th className="border-b px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border-b px-4 py-2">{product.productName}</td>
              <td className="border-b px-4 py-2">Rs. {product.price}</td>
              <td className="border-b px-4 py-2">{product.category}</td>
              <td className="border-b px-4 py-2">{product.detail}</td>
              {role === 'admin' && (
                <td className="border-b px-4 py-2">
                  <FaEdit className="text-yellow-500 cursor-pointer mr-2" onClick={() => handleEditClick(product)} />
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(product.id)} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded w-96">
            <h1 className="text-xl mb-4">{isNew ? "Add Product" : "Edit Product"}</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Product Name"
                value={editProduct?.productName}
                onChange={(e) => setEditProduct({ ...editProduct!, productName: e.target.value })}
                required
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={editProduct?.price}
                onChange={(e) => setEditProduct({ ...editProduct!, price: e.target.value })}
                required
                className="w-full p-2 mb-4 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={editProduct?.category}
                onChange={(e) => setEditProduct({ ...editProduct!, category: e.target.value })}
                required
                className="w-full p-2 mb-4 border rounded"
              />
              <textarea
                placeholder="Description"
                value={editProduct?.detail}
                onChange={(e) => setEditProduct({ ...editProduct!, detail: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                  {isNew ? "Add Product" : "Save Changes"}
                </button>
                <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
