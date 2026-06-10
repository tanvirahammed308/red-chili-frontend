// app/components/MenuSection.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/features/product/product.slice";
import { IProduct, productCategories } from "@/redux/features/product/product.types";
import Image from "next/image";

// Import icons from React Icons
import { FiShoppingCart, FiSearch, FiChevronDown, FiX } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";

interface MenuSectionProps {
  limit?: number;
  showHeader?: boolean;
  showFilter?: boolean;
}

export default function MenuSection({ limit, showHeader = true, showFilter = true }: MenuSectionProps) {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: any) => state.product);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts() as any);
  }, [dispatch]);

  // Filter products
  const filteredProducts = products.filter((product: IProduct) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Apply limit if specified
  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  const getDisplayPrice = (product: IProduct) => {
    if (product.name === "Slow Cooker Chile") {
      return "$15.00 - $25.00";
    }
    return `$${product.price.toFixed(2)}`;
  };

  const getBasePrice = (product: IProduct) => {
    if (product.name === "Slow Cooker Chile") return 15;
    return product.price;
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  const addToCart = (product: IProduct) => {
    const quantity = quantities[product._id] || 1;
    if (quantity === 0) return;

    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity }]);
    }
    
    setQuantities(prev => ({ ...prev, [product._id]: 0 }));
    showNotification(`Added ${quantity}x ${product.name} to cart`);
  };

  const showNotification = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const updateCartQuantity = (productId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.product._id === productId) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => 
    sum + (getBasePrice(item.product) * item.quantity), 0
  );
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get category color for badge
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Pizza: "bg-red-100 text-red-700",
      Burger: "bg-amber-100 text-amber-700",
      Biryani: "bg-orange-100 text-orange-700",
      Pasta: "bg-green-100 text-green-700",
      Dessert: "bg-pink-100 text-pink-700",
      Beverage: "bg-blue-100 text-blue-700",
      Bowl: "bg-purple-100 text-purple-700",
      Soup: "bg-teal-100 text-teal-700",
      Appetizer: "bg-yellow-100 text-yellow-700",
      Grilled: "bg-rose-100 text-rose-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Error loading menu: {error}</p>
        <button 
          onClick={() => dispatch(getAllProducts() as any)}
          className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Our Menu</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 text-lg">Discover our delicious selection of freshly prepared dishes</p>
          </div>
        )}

        {/* Filters */}
        {showFilter && (
          <div className="max-w-4xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category Filter Dropdown */}
              <div className="relative w-full md:w-auto">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center justify-between gap-2 w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-amber-500 transition"
                >
                  <span className="text-gray-700">
                    {selectedCategory === "all" ? "All Categories" : selectedCategory}
                  </span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showCategoryDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowCategoryDropdown(false)} />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-40 py-2 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                          selectedCategory === "all" ? "text-amber-600 bg-amber-50" : "text-gray-700"
                        }`}
                      >
                        All Categories
                      </button>
                      {productCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                            selectedCategory === category ? "text-amber-600 bg-amber-50" : "text-gray-700"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md transition"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="font-semibold">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayedProducts.map((product: IProduct) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {/* Product Image */}
                <div className="relative h-52 overflow-hidden bg-gray-200">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      🍽️
                    </div>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Only {product.stock} left
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Sold Out
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(product.category)}`}>
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                    <span className="text-xl font-bold text-amber-600">
                      {getDisplayPrice(product)}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  
                  {product.name === "Slow Cooker Chile" && (
                    <p className="text-xs text-gray-400 mb-3">🍲 Small $15 | Large $25</p>
                  )}

                  {/* Quantity Selector & Add Button */}
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-full">
                        <button
                          onClick={() => updateQuantity(product._id, -1)}
                          className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
                          disabled={quantities[product._id] <= 0}
                        >
                          <FaMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quantities[product._id] || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, 1)}
                          className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
                          disabled={quantities[product._id] >= product.stock}
                        >
                          <FaPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!quantities[product._id]}
                        className={`flex-1 py-2 rounded-full font-semibold transition ${
                          quantities[product._id]
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full mt-4 py-2 bg-gray-200 text-gray-400 rounded-full font-semibold cursor-not-allowed"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button (if limit is set) */}
        {limit && products.length > limit && (
          <div className="text-center mt-12">
            <button className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-full font-semibold transition">
              View Full Menu →
            </button>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCart(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
            {/* Cart Header */}
            <div className="p-6 border-b bg-gradient-to-r from-amber-600 to-amber-700 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Your Cart</h2>
                  <p className="text-sm text-amber-100 mt-1">{cartItemCount} item(s)</p>
                </div>
                <button 
                  onClick={() => setShowCart(false)} 
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <FiShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-2">Start adding some delicious items!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex gap-3 border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-sm text-amber-600">${getBasePrice(item.product).toFixed(2)} each</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateCartQuantity(item.product._id, -1)}
                            className="w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center"
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product._id, 1)}
                            className="w-7 h-7 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center"
                          >
                            <FaPlus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-red-500 text-xs ml-auto hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ${(getBasePrice(item.product) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">Subtotal</span>
                <span className="text-2xl font-bold text-amber-600">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    alert(`✅ Order placed!\n\nTotal: $${cartTotal.toFixed(2)}\n\nThank you for your order!`);
                    setCart([]);
                    setShowCart(false);
                  }
                }}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-full font-semibold transition ${
                  cart.length > 0
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Checkout
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}