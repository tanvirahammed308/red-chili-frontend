// components/admin/products/FiltersSidebar.tsx
"use client";

import { FaFilter, FaSearch, FaChartLine } from "react-icons/fa";
import { productCategories } from "@/schemas/product.schema";

interface FiltersSidebarProps {
  searchTerm: string;
  selectedCategory: string;
  filteredProductsLength: number;
  lowStockCount: number;
  outOfStockCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function FiltersSidebar({
  searchTerm,
  selectedCategory,
  filteredProductsLength,
  lowStockCount,
  outOfStockCount,
  onSearchChange,
  onCategoryChange
}: FiltersSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaFilter className="text-red-600" /> Filters
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">All Categories</option>
            {productCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FaChartLine className="text-red-500" /> Statistics
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total Products:</span>
              <span className="font-semibold text-red-700">{filteredProductsLength}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Categories:</span>
              <span className="font-semibold text-red-700">{productCategories.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Low Stock (&lt;10):</span>
              <span className="font-semibold text-orange-600">{lowStockCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Out of Stock:</span>
              <span className="font-semibold text-red-600">{outOfStockCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}