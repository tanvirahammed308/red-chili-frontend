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
  title = "OUR MENU", 
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

  // Get categories that have products
  const availableCategories = Object.keys(groupedProducts).sort();

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
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div 
          className="relative h-80 md:h-96 bg-cover bg-center rounded-2xl overflow-hidden mb-12 shadow-lg"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200')",
            backgroundBlendMode: "overlay"
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
              {title}
            </h1>
            <div className="w-20 h-1 bg-red-500 mx-auto my-3 rounded-full" />
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Menu Items by Category - SIDE BY SIDE GRID WITH BORDERS */}
        <div className="max-w-7xl mx-auto">
          {availableCategories.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-3">🍽️</div>
              <p className="text-gray-500 text-lg">No menu items available.</p>
              <p className="text-sm text-gray-400 mt-1">Please add products to your database.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {availableCategories.map((category) => (
                <div key={category}>
                  {/* Category Header with Border */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-red-500 rounded-full" />
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {category}
                      </h2>
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-300">
                        {groupedProducts[category].length} items
                      </span>
                    </div>
                  </div>

                  {/* GRID - Side by Side with Borders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedProducts[category].map((product: IProduct) => (
                      <div
                        key={product._id}
                        className="bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:shadow-lg transition-all overflow-hidden"
                      >
                        {/* Product Image with Border Bottom */}
                        <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 relative border-b border-gray-200">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl text-gray-400">
                              🍽️
                            </div>
                          )}
                          {/* Popular Badge */}
                          {product.name === "Slow Cooker Chile" && (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md">
                              🌶️ Popular
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 text-base leading-tight line-clamp-1">
                              {product.name}
                            </h3>
                            <span className="text-lg font-bold text-red-600">
                              {getDisplayPrice(product)}
                            </span>
                          </div>
                          
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          
                          {/* Category Tag with Border */}
                          <div className="mb-3">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                              {product.category}
                            </span>
                          </div>
                          
                          {/* Size note for Slow Cooker Chile */}
                          {product.name === "Slow Cooker Chile" && (
                            <div className="text-xs text-gray-400 mb-3 bg-gray-50 p-1 rounded text-center border border-gray-200">
                              Small $15 | Large $25
                            </div>
                          )}
                          
                          {/* Quantity Selector & Add Button with Borders */}
                          <div className="flex items-center justify-between gap-2 mt-2 pt-3 border-t-2 border-gray-200">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => updateQuantity(product._id, -1)}
                                className="w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center transition"
                                disabled={quantities[product._id] <= 0}
                              >
                                <FaMinus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="w-8 text-center font-medium text-gray-700">
                                {quantities[product._id] || 0}
                              </span>
                              <button
                                onClick={() => updateQuantity(product._id, 1)}
                                className="w-7 h-7 rounded-md border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center transition"
                              >
                                <FaPlus className="w-3 h-3 text-gray-600" />
                              </button>
                            </div>
                            <button
                              onClick={() => addToCart(product)}
                              disabled={!quantities[product._id]}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition border ${
                                quantities[product._id]
                                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
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

      {/* Floating Cart Button with Border */}
      {showCart && (
        <button
          onClick={() => setShowCartSidebar(true)}
          className="fixed bottom-6 right-6 z-40 bg-red-600 hover:bg-red-700 text-white p-3.5 rounded-full shadow-lg transition border-2 border-red-400"
        >
          <FiShoppingCart className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white">
              {cartItemCount}
            </span>
          )}
        </button>
      )}

      {/* Shopping Cart Sidebar */}
      {showCartSidebar && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowCartSidebar(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l-2 border-red-300">
            {/* Cart Header */}
            <div className="p-5 border-b-2 bg-red-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Your Order</h2>
                  <p className="text-sm text-red-100 mt-1">{cartItemCount} item(s)</p>
                </div>
                <button 
                  onClick={() => setShowCartSidebar(false)} 
                  className="p-1 hover:bg-white/20 rounded transition"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-3">🛒</div>
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-1">Add items from the menu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex gap-3 border-b-2 border-gray-200 pb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                        <p className="text-sm text-red-600">${getBasePrice(item.product).toFixed(2)} each</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateCartQuantity(item.product._id, -1)}
                            className="w-6 h-6 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-200"
                          >
                            -
                          </button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product._id, 1)}
                            className="w-6 h-6 bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-200"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product._id)}
                            className="text-red-500 text-xs ml-2 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">${(getBasePrice(item.product) * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div className="border-t-2 p-5 bg-gray-50 border-gray-300">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-gray-700">Total</span>
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
                className={`w-full py-2.5 rounded-md font-semibold transition border-2 ${
                  cart.length > 0
                    ? "bg-red-600 hover:bg-red-700 text-white border-red-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                }`}
              >
                Place Order
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}