import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type ProductProps } from "../types";

interface StoreState {
  products: ProductProps[];
  product: ProductProps | null;
  editProduct: (id: number | null) => void;
  addProduct: ({
    id,
    title,
    img,
    price,
    description,
    rate,
  }: ProductProps) => void;
  updateProduct: ({
    id,
    title,
    img,
    price,
    description,
    rate,
  }: ProductProps) => void;
  removeProduct: (id: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      product: null,
      addProduct: ({
        id,
        title,
        img,
        price,
        description,
        rate,
      }: ProductProps) => {
        set((state) => ({
          products: [
            ...state.products,
            {
              id,
              title,
              img,
              price,
              description,
              rate,
            } as ProductProps,
          ],
        }));
      },
      editProduct: (id) => {
        if (id) {
          set((state) => ({
            product: state.products.find((p) => p.id === id) as ProductProps,
          }));
        } else {
          set(() => ({ product: null }));
        }
      },
      removeProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },
      updateProduct: ({
        id,
        title,
        img,
        price,
        description,
        rate,
      }: ProductProps) => {
        const newProducts = get().products;
        const index = newProducts.findIndex((obj) => obj.id == id);

        newProducts[index].title = title;
        newProducts[index].img = img;
        newProducts[index].price = price;
        newProducts[index].description = description;
        newProducts[index].rate = rate;

        set(() => ({
          products: newProducts,
        }));
      },
    }),
    {
      name: "products",
    }
  )
);
