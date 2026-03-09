import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getDealsByCategory } from "../../api/deals";
import { useProductStore } from "../../stores";
import { Category, Deal, Product } from "../../types";

const BASE_URL = "http://localhost:8080";
function resolveImageURL(url: string | undefined): string {
  if (!url) return "https://via.placeholder.com/80";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
}

type Props = {
  categories: Category[];
  onProductPress: (productId: number) => void;
};

const InterestsSection = observer(function InterestsSection({ categories, onProductPress }: Props) {
  const productStore = useProductStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const cache = useRef<Map<number, { products: Product[]; deals: Deal[] }>>(new Map());
  const [cachedData, setCachedData] = useState<{ products: Product[]; deals: Deal[] } | null>(null);

  useEffect(() => {
    if (!categories.length) return;
    const cat = categories[activeIndex];

    const hit = cache.current.get(cat.id);
    if (hit) {
      setCachedData(hit);
      return;
    }

    setCachedData(null);
    Promise.all([
      productStore.loadProductsByCategory(cat.id).then(() => productStore.products.slice()),
      getDealsByCategory(cat.id),
    ]).then(([products, deals]) => {
      const entry = { products, deals };
      cache.current.set(cat.id, entry);
      setCachedData(entry);
    });
  }, [activeIndex, categories]);

  const products = cachedData?.products ?? [];
  const loading = cachedData === null;

  if (!categories.length) return null;

  const getDeal = (productId: number) =>
    (cachedData?.deals ?? []).find((d: Deal) => d.product.id === productId);

  return (
    <View className="mx-5 mb-6 bg-surface border border-gray-300 rounded-3xl overflow-hidden shadow-sm">
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 }}
      >
        {categories.map((cat, i) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActiveIndex(i)}
            className="mr-6"
          >
            <Text
              className={
                i === activeIndex
                  ? "text-text-primary font-bold text-base"
                  : "text-text-muted text-base"
              }
            >
              {cat.name}
            </Text>
            {i === activeIndex && (
              <View className="h-0.5 bg-text-primary mt-1 rounded-full" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product list */}
      <View className="px-4 pb-4 mt-2">
        {loading ? (
          <ActivityIndicator color="#FFD600" className="py-8" />
        ) : products.length === 0 ? (
          <Text className="text-text-muted text-center py-8">No products found.</Text>
        ) : (
          products.map((product) => {
            const deal = getDeal(product.id);
            const hasDiscount = !!deal;
            const discountPct = hasDiscount
              ? Math.round(((product.price - deal!.discountPrice) / product.price) * 100)
              : 0;

            return (
              <TouchableOpacity
                key={product.id}
                onPress={() => onProductPress(product.id)}
                className="flex-row border border-gray-200 p-2 rounded-xl items-center mb-4"
                activeOpacity={0.7}
              >
                {/* Image */}
                <View className="w-20 h-20 bg-background rounded-2xl overflow-hidden mr-4">
                  <Image
                    source={{ uri: resolveImageURL(product.imageURL) }}
                    className="w-full h-full"
                    resizeMode="contain"                  />
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-text-primary font-medium text-base" numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View className="flex-row items-center mt-1 gap-2">
                    <Text className="text-text-primary font-bold text-sm">
                      ${hasDiscount ? deal!.discountPrice.toFixed(2) : product.price.toFixed(2)}
                    </Text>
                    {hasDiscount && (
                      <>
                        <Text className="text-text-muted text-sm line-through">
                          ${product.price.toFixed(2)}
                        </Text>
                        <View className="bg-success/20 px-2 py-0.5 rounded-full">
                          <Text className="text-success text-xs font-semibold">
                            {discountPct}% OFF
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </View>
  );
});

export default InterestsSection;
