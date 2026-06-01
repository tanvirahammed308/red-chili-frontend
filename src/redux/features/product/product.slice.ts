// redux/features/product/product.slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IProduct,
  IProductState,
  ICreateProductData,
  IUpdateProductData,
} from "./product.types";
import api from "@/lib/axios";
import { AxiosError } from "axios";

// Initial state
const initialState: IProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  totalCount: 0,
};

// ============= Async Thunks =============

// Get all products
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products");
      return {
        products: response.data.products as IProduct[],
        count: response.data.count as number,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Failed to fetch products";
        return rejectWithValue(message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch products");
    }
  }
);

// Get single product by ID
export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.product as IProduct;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Product not found";
        return rejectWithValue(message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Product not found");
    }
  }
);

// Create product (Admin only) - FIXED VERSION
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data: ICreateProductData, { rejectWithValue }) => {
    console.log("🔵 1. Thunk received data:", data);
    
    try {
      // Create FormData
      const formData = new FormData();
      
      // Safely append all fields with fallback values
      formData.append("name", String(data.name || ""));
      formData.append("description", String(data.description || ""));
      formData.append("price", String(data.price || 0));
      formData.append("category", String(data.category || ""));
      formData.append("stock", String(data.stock || 0));
      
      // Append image if exists
      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
        console.log("🔵 2. Image attached:", data.image.name);
      } else {
        console.log("🔵 2. No image attached");
      }

      // Debug: Log formData contents
      console.log("🔵 3. FormData contents:");
      for (let pair of formData.entries()) {
        const value = pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1];
        console.log(`    ${pair[0]}: ${value}`);
      }

      // Make API request
      console.log("🔵 4. Sending request to backend...");
      const response = await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("🟢 5. API Response:", response.data);
      return response.data.product as IProduct;
      
    } catch (error: any) {
      console.error("🔴 6. Error caught:", error);
      
      // Handle Axios errors
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || error.message || "Failed to create product";
        console.error("🔴 7. Axios error message:", message);
        return rejectWithValue(message);
      }
      
      // Handle regular errors
      if (error instanceof Error) {
        console.error("🔴 8. Error message:", error.message);
        return rejectWithValue(error.message);
      }
      
      // Handle unknown errors
      console.error("🔴 9. Unknown error:", error);
      return rejectWithValue("Failed to create product");
    }
  }
);

// Update product (Admin only)
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }: { id: string; data: IUpdateProductData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      if (data.name) formData.append("name", String(data.name));
      if (data.description) formData.append("description", String(data.description));
      if (data.price) formData.append("price", String(data.price));
      if (data.category) formData.append("category", String(data.category));
      if (data.stock) formData.append("stock", String(data.stock));
      if (data.image && data.image instanceof File) formData.append("image", data.image);

      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.product as IProduct;
      
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Failed to update product";
        return rejectWithValue(message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to update product");
    }
  }
);

// Delete product (Admin only)
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || "Failed to delete product";
        return rejectWithValue(message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to delete product");
    }
  }
);

// ============= Slice =============

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear selected product
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    
    // Clear all product data
    clearAllProducts: (state) => {
      state.products = [];
      state.selectedProduct = null;
      state.loading = false;
      state.error = null;
      state.totalCount = 0;
    },
    
    // Set selected product manually
    setSelectedProduct: (state, action: PayloadAction<IProduct | null>) => {
      state.selectedProduct = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // ============= Get All Products =============
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalCount = action.payload.count;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============= Get Product By ID =============
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedProduct = null;
      })

      // ============= Create Product =============
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.totalCount += 1;
        console.log("✅ Product added to state:", action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Product creation rejected:", action.payload);
      })

      // ============= Update Product =============
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.loading = false;
        
        // Update in products list
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        
        // Update selected product if it's the same
        if (state.selectedProduct?._id === action.payload._id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ============= Delete Product =============
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        state.totalCount -= 1;
        
        // Clear selected product if deleted
        if (state.selectedProduct?._id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSelectedProduct,
  clearAllProducts,
  setSelectedProduct,
} = productSlice.actions;

// Export reducer
export default productSlice.reducer;