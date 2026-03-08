import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getProduct } from "../../api/products";
import { addToCart } from "../../api/cart";
import { addToWishlist } from "../../api/wishlist";
import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "ProductDetail">;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  useEffect(() => {
    getProduct(productId)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user) return;
    setAddingToCart(true);
    try {
      await addToCart(user.id, { productId, quantity: 1 });
      Alert.alert("Added to Cart", `${product?.name} has been added to your cart.`);
    } catch {
      Alert.alert("Error", "Failed to add item to cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return;
    setAddingToWishlist(true);
    try {
      await addToWishlist(user.id, { productId });
      Alert.alert("Added to Wishlist", `${product?.name} has been saved.`);
    } catch {
      Alert.alert("Error", "Failed to add item to wishlist.");
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-secondary">Product not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: product.imageURL || "https://via.placeholder.com/400x300" }}
          className="w-full h-72"
          resizeMode="cover"
        />
        <View className="p-6">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-text-primary text-2xl font-bold flex-1 mr-4">
              {product.name}
            </Text>
            <Text className="text-primary text-2xl font-bold">${product.price}</Text>
          </View>

          <Text className="text-text-secondary text-sm mb-4">{product.category?.name}</Text>

          <View className="flex-row gap-2 mb-4">
            {product.trending && (
              <View className="bg-orange-100 px-3 py-1 rounded-full">
                <Text className="text-orange-600 text-xs font-medium">Trending</Text>
              </View>
            )}
            {product.popular && (
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600 text-xs font-medium">Popular</Text>
              </View>
            )}
          </View>

          <Text className="text-text-primary text-base leading-6">{product.description}</Text>
        </View>
      </ScrollView>

      <View className="px-6 pb-8 pt-4 bg-surface border-t border-gray-100 flex-row gap-3">
        <TouchableOpacity
          className="flex-1 border border-primary rounded-xl py-4 items-center"
          onPress={handleAddToWishlist}
          disabled={addingToWishlist}
        >
          {addingToWishlist ? (
            <ActivityIndicator color="#6C63FF" />
          ) : (
            <Text className="text-primary font-semibold">Save</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-2 bg-primary rounded-xl py-4 items-center px-8"
          onPress={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold">Add to Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
