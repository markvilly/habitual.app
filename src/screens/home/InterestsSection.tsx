import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getProductsByCategory } from "../../api/products";
import { getDealsByCategory } from "../../api/deals";
import { Category, Deal, Product } from "../../types";

type Props = {
  categories: Category[];
  onProductPress: (productId: number) => void;
};

export default function InterestsSection({ categories, onProductPress }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categories.length) return;
    const cat = categories[activeIndex];
    setLoading(true);
    Promise.all([getProductsByCategory(cat.id), getDealsByCategory(cat.id)])
      .then(([prods, catDeals]) => {
        setProducts(prods);
        setDeals(catDeals);
      })
      .finally(() => setLoading(false));
  }, [activeIndex, categories]);

  if (!categories.length) return null;

  const getDeal = (productId: number) =>
    deals.find((d) => d.product.id === productId);

  return (
    <View className="mx-5 mb-6 bg-surface rounded-3xl overflow-hidden shadow-sm">
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
                className="flex-row items-center mb-4"
                activeOpacity={0.7}
              >
                {/* Image */}
                <View className="w-20 h-20 bg-background rounded-2xl overflow-hidden mr-4">
                  <Image
                    source={{ uri: product.imageURL || "https://via.placeholder.com/80" }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
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
}
