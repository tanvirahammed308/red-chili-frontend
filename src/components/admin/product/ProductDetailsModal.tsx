// components/admin/products/ProductDetailsModal.tsx
"use client";

import { IProduct } from "@/redux/features/product/product.types";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";

interface ProductDetailsModalProps {
  product: IProduct;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductDetailsModal({ product, onClose, onEdit, onDelete }: ProductDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            <div className="relative h-96 rounded-xl overflow-hidden bg-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div>
            <div className="mb-4">
              <span className="text-sm text-red-600 font-medium mb-2 inline-block">{product.category}</span>
              <h2 className="text-2xl font-bold text-red-700 mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 text-sm" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(0 reviews)</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-red-600">${product.price}</span>
              {product.stock > 0 ? (
                <span className="ml-3 text-sm text-green-600">In Stock ({product.stock} items)</span>
              ) : (
                <span className="ml-3 text-sm text-red-600">Out of Stock</span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="border-t border-red-200 pt-4 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Product ID:</span>
                <span className="font-mono text-sm text-red-600">{product._id}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Category:</span>
                <span className="text-red-600">{product.category}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Stock Status:</span>
                <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {product.stock > 0 ? `${product.stock} items available` : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Added on:</span>
                <span className="text-red-600">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onEdit}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit Product
              </button>
              <button
                onClick={onDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}