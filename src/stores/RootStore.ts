import { ProductStore } from "./ProductStore";

export class RootStore {
  productStore: ProductStore;

  constructor() {
    this.productStore = new ProductStore();
  }
}

export const rootStore = new RootStore();
