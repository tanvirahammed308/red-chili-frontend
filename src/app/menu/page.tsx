// app/components/MenuSection.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/features/product/product.slice";
import { IProduct } from "@/redux/features/product/product.types";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { FaPlus, FaMinus } from "react-icons/fa";

interface MenuSectionProps {
  limit?: number;
  title?: string;
  subtitle?: string;
  showCart?: boolean;
}

export default function MenuSection({ 
  limit, 
  title = "LUNCH MENU", 
  subtitle = "Discover our signature dishes crafted with passion",
  showCart = true 
}: MenuSectionProps) {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: any) => state.product);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cart, setCart] = useState<any[]>([]);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts() as any);
  }, [dispatch]);

  // Group products by category
  const groupedProducts = products.reduce((acc: { [key: string]: IProduct[] }, product: IProduct) => {
    const category = product.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Error loading menu: {error}</p>
        <button 
          onClick={() => dispatch(getAllProducts() as any)}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div 
          className="relative h-80 md:h-96 bg-cover bg-center rounded-3xl overflow-hidden mb-16 shadow-2xl"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200')",
            backgroundBlendMode: "overlay"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <div className="inline-block px-6 py-2 bg-red-500 text-white text-sm rounded-full mb-4">
              Since 2024
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              {title}
            </h1>
            <div className="w-24 h-1 bg-red-500 mx-auto my-4 rounded-full" />
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Menu Cards */}
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-gray-500 text-xl">No menu items available.</p>
              <p className="text-gray-400 mt-2">Please add products to your database.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groupedProducts).map(([category, items]) => (
                <div key={category}>
                  {/* Category Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">
                          {category === "Bowl" && "🥗"}
                          {category === "Soup" && "🥣"}
                          {category === "Appetizer" && "🍤"}
                          {category === "Grilled" && "🔥"}
                          {category === "Pizza" && "🍕"}
                          {category === "Burger" && "🍔"}
                          {category === "Pasta" && "🍝"}
                          {category === "Dessert" && "🍰"}
                          {category === "Beverage" && "🥤"}
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800">{category}</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                      <span className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full font-medium">
                        {items.length} items
                      </span>
                    </div>
                  </div>

                  {/* Menu Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((product: IProduct) => (
                      <div
                        key={product._id}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200"
                      >
                        {/* Card Image */}
                        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                              🍽️
                            </div>
                          )}
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {product.name === "Slow Cooker Chile" && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                                🔥 Popular
                              </span>
                            )}
                            {product.stock < 10 && product.stock > 0 && (
                              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                                Only {product.stock} left
                              </span>
                            )}
                          </div>
                          {/* Price Tag */}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                            <span className="text-lg font-bold text-red-600">
                              {getDisplayPrice(product)}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                          <div className="mb-2">
                            <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-gray-500 text-sm line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              <span className="text-red-500">●</span> {product.category}
                            </span>
                            {product.name === "Slow Cooker Chile" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                                🍲 Small $15 | Large $25
                              </span>
                            )}
                          </div>

                          {/* Quantity & Add Button */}
                          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(product._id, -1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
                                disabled={quantities[product._id] <= 0}
                              >
                                <FaMinus className="w-3 h-3" />
                              </button>
                              <span className="w-10 text-center font-semibold text-gray-700">
                                {quantities[product._id] || 0}
                              </span>
                              <button
                                onClick={() => updateQuantity(product._id, 1)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              disabled={!quantities[product._id]}
                              className={`flex-1 py-2 rounded-full font-semibold text-sm transition-all ${
                                quantities[product._id]
                                  ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      {showCart && (
        <button
          onClick={() => setShowCartSidebar(true)}
          className="fixed bottom-6 right-6 z-50 group bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300"
        >
          <div className="relative">
            <FiShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
                {cartItemCount}
              </span>
            )}
          </div>
        </button>
      )}

      {/* Cart Sidebar */}
      {showCartSidebar && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowCartSidebar(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-red-600 to-red-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Your Order</h2>
                  <p className="text-sm text-red-100 mt-1">{cartItemCount} delicious item(s)</p>
                </div>
                <button 
                  onClick={() => setShowCartSidebar(false)} 
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🛒</span>
                  </div>
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add some delicious items!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex gap-4 border-b pb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-sm text-red-600 font-medium">
                          ${getBasePrice(item.product).toFixed(2)} each
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateCartQuantity(item.product._id, -1)}
                            className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product._id, 1)}
                            className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
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
                        <p className="font-bold text-gray-800 text-lg">
                          ${(getBasePrice(item.product) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">Total</span>
                <span className="text-2xl font-bold text-red-600">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    alert(`✅ Order placed!\nTotal: $${cartTotal.toFixed(2)}\n\nThank you for your order!`);
                    setCart([]);
                    setShowCartSidebar(false);
                  }
                }}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-full font-semibold transition ${
                  cart.length > 0
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Place Order
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Free delivery on orders over $50
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}