import React, { createContext, useContext } from "react";
import { rootStore, RootStore } from "./RootStore";

export const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
export const useProductStore = () => useContext(StoreContext).productStore;

export { rootStore };
