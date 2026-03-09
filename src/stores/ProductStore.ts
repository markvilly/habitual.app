import { makeAutoObservable, runInAction } from "mobx";
import { Product, Category } from "../types";
import { productService, SearchParams } from "../services/ProductService";

export class ProductStore {
  // ─── State ────────────────────────────────────────────────────────────────
  products: Product[] = [];
  trendingProducts: Product[] = [];
  popularProducts: Product[] = [];
  categories: Category[] = [];
  selectedProduct: Product | null = null;
  searchResults: Product[] = [];

  loading = false;
  searchLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ─── Computed ─────────────────────────────────────────────────────────────
  get hasProducts() {
    return this.products.length > 0;
  }

  get hasTrending() {
    return this.trendingProducts.length > 0;
  }

  get hasPopular() {
    return this.popularProducts.length > 0;
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  async loadHomeData() {
    this.loading = true;
    this.error = null;
    try {
      const [trending, popular, categories] = await Promise.all([
        productService.fetchTrendingProducts(),
        productService.fetchPopularProducts(),
        productService.fetchCategories(),
      ]);
      runInAction(() => {
        this.trendingProducts = trending;
        this.popularProducts = popular;
        this.categories = categories;
        this.loading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message ?? "Failed to load home data";
        this.loading = false;
      });
    }
  }

  async loadProductById(id: number) {
    this.loading = true;
    this.error = null;
    try {
      const product = await productService.fetchProductById(id);
      runInAction(() => {
        this.selectedProduct = product;
        this.loading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message ?? "Failed to load product";
        this.loading = false;
      });
    }
  }

  async loadProductsByCategory(categoryId: number) {
    this.loading = true;
    this.error = null;
    try {
      const products = await productService.fetchProductsByCategory(categoryId);
      runInAction(() => {
        this.products = products;
        this.loading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message ?? "Failed to load products";
        this.loading = false;
      });
    }
  }

  async search(params: SearchParams) {
    this.searchLoading = true;
    this.error = null;
    try {
      const results = await productService.searchProducts(params);
      runInAction(() => {
        this.searchResults = results;
        this.searchLoading = false;
      });
    } catch (e: any) {
      runInAction(() => {
        this.error = e?.message ?? "Search failed";
        this.searchLoading = false;
      });
    }
  }

  clearSearch() {
    this.searchResults = [];
  }

  clearSelectedProduct() {
    this.selectedProduct = null;
  }

  clearError() {
    this.error = null;
  }
}
