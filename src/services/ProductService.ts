import * as productApi from "../api/products";
import { Product, Category } from "../types";

export interface SearchParams {
  q?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
}

class ProductService {
  async fetchProductById(id: number): Promise<Product> {
    return productApi.getProduct(id);
  }

  async fetchAllProducts(): Promise<Product[]> {
    return productApi.getProducts();
  }

  async fetchProductsByCategory(categoryId: number): Promise<Product[]> {
    return productApi.getProductsByCategory(categoryId);
  }

  async fetchTrendingProducts(): Promise<Product[]> {
    return productApi.getTrendingProducts();
  }

  async fetchPopularProducts(): Promise<Product[]> {
    return productApi.getPopularProducts();
  }

  async searchProducts(params: SearchParams): Promise<Product[]> {
    return productApi.searchProducts(params);
  }

  async fetchCategories(): Promise<Category[]> {
    return productApi.getCategories();
  }

  async fetchCategoryById(id: number): Promise<Category> {
    return productApi.getCategory(id);
  }
}

export const productService = new ProductService();
