// app/products/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProductById } from "@/redux/features/product/product.slice";
import { addToCart } from "@/redux/features/cart/cart.slice";
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaShoppingCart, 
  FaHeart, 
  FaRegHeart, 
  FaShare, 
  FaArrowLeft, 
  FaTruck, 
  FaClock, 
  FaUtensils, 
  FaFire, 
  FaLeaf, 
  FaChevronLeft, 
  FaChevronRight, 
  FaQuoteLeft, 
  FaMinus, 
  FaPlus 
} from "react-icons/fa";
import { MdLocalOffer, MdZoomIn } from "react-icons/md";
import Swal from "sweetalert2";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, loading } = useAppSelector((state) => state.product);
  const { currentUser } = useAppSelector((state) => state.auth);
  
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const reviewsContainerRef = useRef<HTMLDivElement>(null);

  // Product images array - use product image or fallback
  const productImages = product?.image 
    ? [product.image, product.image, product.image, product.image, product.image]
    : ["/images/placeholder.jpg", "/images/placeholder.jpg", "/images/placeholder.jpg", "/images/placeholder.jpg", "/images/placeholder.jpg"];

  // Reviews data
  const reviews: Review[] = [
    {
      id: 1,
      name: "John Doe",
      avatar: "JD",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely delicious! The butter chicken was creamy and perfectly spiced. Will order again!",
      verified: true
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "JS",
      rating: 4,
      date: "5 days ago",
      comment: "Great food, fast delivery. The portion size was generous. Highly recommended!",
      verified: true
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "MJ",
      rating: 5,
      date: "1 week ago",
      comment: "Best biryani in town! The spices were perfect and meat was tender.",
      verified: true
    },
    {
      id: 4,
      name: "Sarah Williams",
      avatar: "SW",
      rating: 4,
      date: "2 weeks ago",
      comment: "Delicious pizza! Fresh ingredients and perfect crust.",
      verified: false
    }
  ];

  const sizes = ["Small", "Medium", "Large", "Extra Large"];

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id as string));
    }
  }, [dispatch, id]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const handleAddToCart = async () => {
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

    if (!product) return;

    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity 
      })).unwrap();
      
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

  const handleAddToWishlist = () => {
    if (!currentUser) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to add items to your wishlist",
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
    setIsWishlisted(!isWishlisted);
    Swal.fire({
      icon: "success",
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      text: isWishlisted ? `${product?.name} removed from your wishlist` : `${product?.name} added to your wishlist`,
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "bottom-end",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || "Product",
        text: `Check out ${product?.name} on our menu!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Product link copied to clipboard",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    }
  };

  const updateQuantity = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-500 text-xs sm:text-sm" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500 text-xs sm:text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-500 text-xs sm:text-sm" />);
      }
    }
    return stars;
  };

  const calculateAverageRating = () => {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const scrollReviews = (direction: "left" | "right") => {
    if (reviewsContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = reviewsContainerRef.current.scrollLeft;
      reviewsContainerRef.current.scrollTo({
        left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center">
          <div className="text-5xl sm:text-6xl mb-4">🍽️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">The product you're looking for doesn't exist.</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-red-300 text-sm sm:text-base"
        >
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <FaArrowLeft className="text-red-600 text-xs sm:text-sm" />
          </div>
          <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors hidden xs:inline">
            Back to Menu
          </span>
          <span className="text-gray-700 font-medium group-hover:text-red-600 transition-colors xs:hidden">
            Back
          </span>
        </button>
      </div>

      {/* Product Main Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Left Side - Images */}
            <div>
              {/* Main Image */}
              <div className="relative h-64 sm:h-80 md:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 mb-3 sm:mb-4 group">
                <Image
                  src={productImages[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 50vw"
                />
                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black/50 text-white p-1.5 sm:p-2 rounded-full hover:bg-black/70 transition"
                  aria-label="Zoom in"
                >
                  <MdZoomIn size={16} className="sm:w-5 sm:h-5" />
                </button>
                {product.stock !== undefined && product.stock < 10 && product.stock > 0 && (
                  <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-orange-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    Only {product.stock} left
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                      activeImage === idx 
                        ? "border-red-500 ring-1 sm:ring-2 ring-red-200 scale-105" 
                        : "border-gray-200 hover:border-red-300 hover:scale-105"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div>
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] sm:text-xs bg-red-100 text-red-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                  {product.category || "Food"}
                </span>
                {product.stock !== undefined && product.stock > 0 ? (
                  <span className="text-[10px] sm:text-xs bg-green-100 text-green-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    In Stock
                  </span>
                ) : (
                  <span className="text-[10px] sm:text-xs bg-red-100 text-red-600 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {renderStars(4.5)}
                </div>
                <span className="text-gray-500 text-xs sm:text-sm">(128 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">${product.price.toFixed(2)}</span>
                <span className="text-gray-400 line-through ml-2 text-sm sm:text-base">${(product.price * 1.2).toFixed(2)}</span>
                <span className="text-green-600 text-xs sm:text-sm ml-2">20% OFF</span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {showFullDescription
                    ? product.description
                    : `${product.description?.substring(0, 150) || ''}...`}
                  {product.description?.length > 150 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-red-600 hover:underline ml-2 font-medium text-sm"
                    >
                      {showFullDescription ? "Show Less" : "Read More"}
                    </button>
                  )}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Select Size</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base ${
                        selectedSize === size
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-300 hover:border-red-300 hover:bg-red-50/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => updateQuantity(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={12} className="sm:w-4 sm:h-4" />
                    </button>
                    <span className="text-lg sm:text-xl font-semibold w-8 sm:w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(1)}
                      disabled={quantity >= (product.stock || 99)}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition"
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={12} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {product.stock || 0} items available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:from-red-700 hover:to-red-600 transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShoppingCart size={14} className="sm:w-4 sm:h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="px-4 py-2.5 sm:px-6 sm:py-3.5 border-2 border-gray-300 rounded-lg sm:rounded-xl font-semibold hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isWishlisted ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart size={14} />}
                  <span className="hidden xs:inline">Wishlist</span>
                </button>
                <button
                  onClick={handleShare}
                  className="px-4 py-2.5 sm:px-6 sm:py-3.5 border-2 border-gray-300 rounded-lg sm:rounded-xl font-semibold hover:border-red-300 hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaShare size={14} />
                  <span className="hidden xs:inline">Share</span>
                </button>
              </div>

              {/* Delivery Info */}
              <div className="border-t-2 pt-4 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <FaTruck className="text-green-600 text-xs sm:text-sm" />
                  </div>
                  <span className="text-gray-600">Free delivery on orders over $30</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                    <FaClock className="text-orange-600 text-xs sm:text-sm" />
                  </div>
                  <span className="text-gray-600">Estimated delivery: 20-30 min</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <FaUtensils className="text-red-600 text-xs sm:text-sm" />
                  </div>
                  <span className="text-gray-600">Prepared with love by our expert chefs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Nutrition Info */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <FaFire className="text-red-500 text-sm sm:text-base" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-lg">Nutrition</h3>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-1 sm:py-2 border-b"><span className="text-gray-500">Calories</span><span className="font-medium">~450 kcal</span></div>
              <div className="flex justify-between py-1 sm:py-2 border-b"><span className="text-gray-500">Protein</span><span className="font-medium">25g</span></div>
              <div className="flex justify-between py-1 sm:py-2 border-b"><span className="text-gray-500">Carbs</span><span className="font-medium">45g</span></div>
              <div className="flex justify-between py-1 sm:py-2"><span className="text-gray-500">Fat</span><span className="font-medium">15g</span></div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <FaLeaf className="text-green-500 text-sm sm:text-base" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-lg">Ingredients</h3>
            </div>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
              <li className="flex items-center gap-2">✓ Fresh chicken breast</li>
              <li className="flex items-center gap-2">✓ Indian spices</li>
              <li className="flex items-center gap-2">✓ Fresh cream & butter</li>
              <li className="flex items-center gap-2">✓ Garlic & ginger</li>
              <li className="flex items-center gap-2">✓ Tomato puree</li>
            </ul>
          </div>

          {/* Allergy Info */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <MdLocalOffer className="text-orange-500 text-sm sm:text-base" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm sm:text-lg">Allergy Info</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">Contains dairy, nuts. Prepared in a kitchen that handles gluten, eggs, and soy.</p>
            <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg sm:rounded-xl border border-yellow-200">
              <p className="text-[10px] sm:text-xs text-yellow-700">⚠️ Please inform about allergies before ordering.</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaStar className="text-yellow-500 text-sm sm:text-base" />
                Customer Reviews
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">What our customers say</p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">{calculateAverageRating()}</div>
              <div className="flex items-center gap-0.5 sm:gap-1 justify-end">{renderStars(parseFloat(calculateAverageRating()))}</div>
              <div className="text-gray-500 text-xs sm:text-sm">Based on {reviews.length} reviews</div>
            </div>
          </div>

          {/* Reviews Carousel */}
          <div className="relative">
            <button
              onClick={() => scrollReviews("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 -ml-2 sm:-ml-3"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-600 text-xs sm:text-sm" />
            </button>
            <div
              ref={reviewsContainerRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="min-w-[280px] sm:min-w-[320px] md:min-w-[350px] bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <FaQuoteLeft className="text-red-200 text-2xl sm:text-3xl mb-2 sm:mb-3" />
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-red-600 font-semibold text-xs sm:text-sm">{review.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{review.name}</p>
                        <div className="flex items-center gap-0.5 sm:gap-1">{renderStars(review.rating)}</div>
                      </div>
                    </div>
                    {review.verified && (
                      <span className="text-[10px] sm:text-xs bg-green-100 text-green-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-[10px] sm:text-xs mt-2">{review.date}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => scrollReviews("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 -mr-2 sm:-mr-3"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-600 text-xs sm:text-sm" />
            </button>
          </div>

          {/* Write Review Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (!currentUser) {
                  Swal.fire({
                    icon: "info",
                    title: "Login Required",
                    text: "Please login to write a review",
                    confirmButtonColor: "#dc2626",
                  }).then((result) => {
                    if (result.isConfirmed) router.push("/login");
                  });
                } else {
                  Swal.fire({
                    title: "Write a Review",
                    html: `
                      <div class="flex justify-center gap-1 sm:gap-2 mb-4" id="rating-stars">
                        ${[1, 2, 3, 4, 5].map(star => `
                          <button type="button" data-rating="${star}" class="rating-star text-2xl sm:text-3xl text-gray-300 hover:text-yellow-500 transition">★</button>
                        `).join('')}
                      </div>
                      <textarea id="review-text" class="w-full p-2 sm:p-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" rows="4" placeholder="Share your experience..."></textarea>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Submit Review",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#dc2626",
                    preConfirm: () => {
                      const rating = document.querySelector('.rating-star.text-yellow-500')?.getAttribute('data-rating');
                      const review = (document.getElementById('review-text') as HTMLTextAreaElement)?.value;
                      if (!rating) {
                        Swal.showValidationMessage('Please select a rating');
                        return false;
                      }
                      if (!review?.trim()) {
                        Swal.showValidationMessage('Please write a review');
                        return false;
                      }
                      return { rating: parseInt(rating), review };
                    }
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        icon: "success",
                        title: "Review Submitted",
                        text: "Thank you for your feedback!",
                        confirmButtonColor: "#dc2626",
                      });
                    }
                  });
                }
              }}
              className="px-5 py-2 sm:px-8 sm:py-3 bg-red-600 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-md"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="relative h-28 sm:h-32 md:h-36 bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image || "/images/placeholder.jpg"}
                    alt="Related product"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm line-clamp-1">Related Item {item}</h3>
                  <p className="text-red-600 font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">$14.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={productImages[activeImage]}
              alt={product.name}
              width={1200}
              height={800}
              className="w-full h-full object-contain rounded-xl sm:rounded-2xl"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/20 text-white p-1.5 sm:p-2 rounded-full hover:bg-white/30 transition text-sm sm:text-base"
              aria-label="Close zoom"
            >
              ✕
            </button>
            <button
              onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 sm:left-4 bg-white/20 text-white p-1.5 sm:p-2 rounded-full hover:bg-white/30 transition"
              aria-label="Previous image"
            >
              <FaChevronLeft size={16} className="sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={() => setActiveImage((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 sm:right-4 bg-white/20 text-white p-1.5 sm:p-2 rounded-full hover:bg-white/30 transition"
              aria-label="Next image"
            >
              <FaChevronRight size={16} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
        }
        
        @media (max-width: 640px) {
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}