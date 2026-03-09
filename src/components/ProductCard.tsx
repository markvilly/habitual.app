import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../types";

const BASE_URL = "http://localhost:8080";

function resolveImageURL(url: string | undefined): string {
  if (!url) return "https://via.placeholder.com/200x180";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url}`;
}

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  const originalPrice = (product.price * 1.1).toFixed(2);
  const discountPct = "10% OFF";
  const rating = 5.0;
  const reviewCount = 34;

  return (
    <TouchableOpacity
      className="bg-white border border-gray-300 rounded-3xl mr-4 shadow-sm overflow-hidden"
      style={{ width: 248 }}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image area */}
      <View className="bg-gray-100 items-center justify-center" style={{ height: 180 }}>
        <Image
          source={{ uri: resolveImageURL(product.imageURL) }}
          style={{ width: "80%", height: "80%" }}
          resizeMode="contain"
        />
        {/* Wishlist button */}
        <TouchableOpacity
          className="absolute top-3 right-3 bg-white rounded-full items-center justify-center shadow-sm"
          style={{ width: 36, height: 36 }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 16 }}>♡</Text>
        </TouchableOpacity>
      </View>

      {/* Info area */}
      <View className="p-4">
        {/* Name */}
        <Text className="text-text-primary font-bold text-lg" numberOfLines={1}>
          {product.name}
        </Text>

        {/* Price row */}
        <View className="flex-row items-center mt-1 gap-2">
          <Text className="text-text-primary font-bold text-base">${product.price}</Text>
          <Text className="text-text-secondary text-sm line-through">${originalPrice}</Text>
          <View className="bg-green-100 rounded-full px-2 py-0.5 ml-auto">
            <Text className="text-green-600 font-bold text-xs">{discountPct}</Text>
          </View>
        </View>

        {/* Description */}
        <Text className="text-text-secondary text-xs mt-2 leading-4" numberOfLines={2}>
          {product.description}
        </Text>

        {/* Bottom row */}
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center gap-1">
            <Text style={{ fontSize: 13 }}>⭐</Text>
            <Text className="text-text-primary font-bold text-xs">{rating}</Text>
            <Text className="text-text-secondary text-xs">({reviewCount})</Text>
            <Text className="text-text-primary font-bold text-xs ml-1">
              {product.category?.name}
            </Text>
          </View>
          {product.popular && (
            <View className="bg-blue-100 rounded-full px-3 py-1">
              <Text className="text-blue-500 font-bold text-xs">STAFF PICK</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
