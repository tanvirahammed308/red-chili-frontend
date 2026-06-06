// components/admin/products/LivePreview.tsx
"use client";

import { FaEye, FaImage } from "react-icons/fa";

interface LivePreviewProps {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imagePreview: string;
}

export default function LivePreview({ name, description, price, category, stock, imagePreview }: LivePreviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-red-700 flex items-center gap-2">
          <FaEye className="text-red-600" /> Live Preview
        </h2>
        <p className="text-red-500 text-sm">See how your product will appear</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4">
        <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 mb-4">
          {imagePreview ? (
            <img src={imagePreview} alt={name || "Preview"} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <FaImage className="text-5xl" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold text-red-700">{name || "Product Name"}</h3>
            {category && (
              <span className="inline-block mt-1 text-xs px-2 py-1 bg-red-100 rounded-full text-red-600">
                {category}
              </span>
            )}
          </div>

          <p className="text-gray-600 text-sm">{description || "Product description will appear here"}</p>

          <div className="pt-3 border-t border-red-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-red-600">${price.toLocaleString()}</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}