"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAllProducts } from "@/redux/features/product/product.slice";
import { IProduct } from "@/redux/features/product/product.types";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { FaPlus, FaMinus, FaEye } from "react-icons/fa";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "@/redux/features/cart/cart.slice";
import Swal from "sweetalert2";

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
  showCart = true,
}: MenuSectionProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { cart, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
    if (currentUser) {
      dispatch(getCart());
    }
  }, [dispatch, currentUser]);

  // Group products by category
  const groupedProducts = products.reduce<Record<string, IProduct[]>>(
    (acc, product) => {
      const category = product.category ?? "Other";
      (acc[category] = acc[category] || []).push(product);
      return acc;
    },
    {}
  );

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
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change),
    }));
  };

  const handleAddToCart = async (product: IProduct) => {
    if (!currentUser) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to add items to your cart",
        confirmButtonColor: "#dc2626",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    const quantity = quantities[product._id] || 1;
    if (quantity === 0) return;

    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
      setQuantities((prev) => ({ ...prev, [product._id]: 0 }));
      Swal.fire({
        icon: "success",
        title: "Added to Cart!",
        text: `${quantity} × ${product.name} added to your cart`,
        timer: 1500,
        showConfirmButton: false,
        position: "bottom-end",
        toast: true,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Failed to add to cart",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleUpdateCartQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId);
      return;
    }

    try {
      await dispatch(updateCartItem({ productId, quantity: newQuantity })).unwrap();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Failed to update quantity",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    const result = await Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(removeCartItem(productId)).unwrap();
        Swal.fire({
          icon: "success",
          title: "Removed!",
          text: "Item removed from cart",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Failed to remove item",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to clear your entire cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Clear All",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(clearCart()).unwrap();
        Swal.fire({
          icon: "success",
          title: "Cleared!",
          text: "Your cart has been cleared",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error || "Failed to clear cart",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  const handleViewDetails = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const cartTotal = cart?.totalPrice || 0;
  const cartItemCount = cart?.totalItems || 0;

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
          onClick={() => dispatch(getAllProducts())}
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
        {/* HERO */}
        <div
          className="relative h-80 md:h-96 bg-cover bg-center rounded-2xl overflow-hidden mb-12 shadow-lg"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200')",
            backgroundBlendMode: "overlay",
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

        {/* MENU GRID */}
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            {availableCategories.map((category) => (
              <div key={category}>
                {/* CATEGORY HEADER */}
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

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedProducts[category].slice(0, limit).map((product) => (
                    <div
                      key={product._id}
                      className="bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:shadow-lg transition-all overflow-hidden group"
                    >
                      {/* IMAGE */}
                      <div
                        className="h-44 bg-gray-100 border-b border-gray-200 relative cursor-pointer"
                        onClick={() => handleViewDetails(product._id)}
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            alt={product.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">
                            🍽️
                          </div>
                        )}
                        {/* View Details Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="bg-white text-gray-800 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2">
                            <FaEye /> Quick View
                          </span>
                        </div>
                      </div>

                      {/* INFO */}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">
                              {product.name}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <span className="text-red-600 font-bold whitespace-nowrap ml-2">
                            {getDisplayPrice(product)}
                          </span>
                        </div>

                        {/* BUTTONS SECTION */}
                        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t-2 border-gray-200">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(product._id, -1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <FaMinus size={12} />
                            </button>

                            <span className="w-6 text-center font-medium text-sm">
                              {quantities[product._id] || 0}
                            </span>

                            <button
                              onClick={() => updateQuantity(product._id, 1)}
                              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(product._id)}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CART BUTTON */}
      {showCart && cartItemCount > 0 && (
        <button
          onClick={() => setShowCartSidebar(true)}
          className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition flex items-center gap-2 z-40"
        >
          <FiShoppingCart size={20} />
          <span className="bg-white text-red-600 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
            {cartItemCount}
          </span>
        </button>
      )}

      {/* CART SIDEBAR */}
      {showCartSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowCartSidebar(false)}
          />

          <div className="fixed right-0 top-0 w-full sm:w-96 h-full bg-white shadow-2xl z-50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center bg-red-600 text-white rounded-tl-2xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiShoppingCart />
                Your Cart
              </h2>
              <button
                onClick={() => setShowCartSidebar(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!cart || cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                  <button
                    onClick={() => setShowCartSidebar(false)}
                    className="mt-4 text-red-600 hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.product} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-red-600 font-bold text-sm">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          onClick={() => handleUpdateCartQuantity(item.product, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateCartQuantity(item.product, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FaPlus size={10} />
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.product)}
                          className="text-red-500 text-xs hover:underline ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between mb-3">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-bold text-red-600">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Delivery Fee:</span>
                  <span>Free</span>
                </div>
                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleClearCart}
                  className="w-full mt-2 text-red-600 text-sm hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}