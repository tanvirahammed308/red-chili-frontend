// components/admin/products/ProductCard.tsx
"use client";

import { IProduct } from "@/redux/features/product/product.types";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

interface ProductCardProps {
  product: IProduct;
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
  onView: (product: IProduct) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-white/90 hover:bg-white rounded-full text-green-600 transition"
            title="Edit"
          >
            <FaEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 bg-white/90 hover:bg-white rounded-full text-red-600 transition"
            title="Delete"
          >
            <FaTrash size={14} />
          </button>
        </div>
        {product.stock === 0 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            Low Stock: {product.stock}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
          </div>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 ml-2 flex-shrink-0">
            {product.category}
          </span>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t">
          <div>
            <span className="text-2xl font-bold text-red-600">${product.price}</span>
            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
          </div>
          <button
            onClick={() => onView(product)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
          >
            <FaEye size={14} /> View Details
          </button>
        </div>
      </div>
    </div>
  );
}