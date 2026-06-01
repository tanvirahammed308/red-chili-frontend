

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface IProductState {
  products: IProduct[];
  selectedProduct: IProduct | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export interface ICreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: File;
}

export interface IUpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image?: File;
}

export interface IApiResponse {
  success: boolean;
  message?: string;
}

export interface IGetAllProductsResponse extends IApiResponse {
  count: number;
  products: IProduct[];
}

export interface IGetProductResponse extends IApiResponse {
  product: IProduct;
}

export interface ICreateProductResponse extends IApiResponse {
  product: IProduct;
}

export interface IUpdateProductResponse extends IApiResponse {
  product: IProduct;
}

export interface IDeleteProductResponse extends IApiResponse {
  productId?: string;
}