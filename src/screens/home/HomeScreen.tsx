import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getCategories, getPopularProducts, getTrendingProducts, searchProducts } from "../../api/products";
import { Category, Product } from "../../types";
import { HomeStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeMain">;

function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="bg-surface rounded-2xl mr-4 w-44 shadow-sm"
      onPress={onPress}
    >
      <Image
        source={{ uri: product.imageURL || "https://via.placeholder.com/176x120" }}
        className="w-full h-32 rounded-t-2xl"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="text-text-primary font-semibold text-sm" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="text-text-secondary text-xs mt-0.5">{product.category?.name}</Text>
        <Text className="text-primary font-bold text-base mt-1">${product.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const [trending, setTrending] = useState<Product[]>([]);
  const [popular, setPopular] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrendingProducts(), getPopularProducts(), getCategories()])
      .then(([t, p, c]) => {
        setTrending(t);
        setPopular(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await searchProducts({ q });
      setSearchResults(results);
    } finally {
      setSearching(false);
    }
  }, []);

  const goToProduct = (productId: number) =>
    navigation.navigate("ProductDetail", { productId });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-primary px-6 pt-14 pb-8">
        <Text className="text-white text-2xl font-bold">habitual</Text>
        <Text className="text-purple-200 text-sm mt-0.5">Discover your next obsession</Text>
        <View className="bg-white rounded-xl flex-row items-center px-4 mt-4">
          <Text className="text-text-muted mr-2">🔍</Text>
          <TextInput
            className="flex-1 py-3 text-text-primary"
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <View className="px-6 py-4">
          <Text className="text-text-primary font-semibold mb-3">Search Results</Text>
          {searching ? (
            <ActivityIndicator color="#6C63FF" />
          ) : searchResults.length === 0 ? (
            <Text className="text-text-muted">No results found.</Text>
          ) : (
            searchResults.map((p) => (
              <TouchableOpacity
                key={p.id}
                className="flex-row items-center bg-surface rounded-xl p-3 mb-2"
                onPress={() => goToProduct(p.id)}
              >
                <Image
                  source={{ uri: p.imageURL || "https://via.placeholder.com/48" }}
                  className="w-12 h-12 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-text-primary font-medium">{p.name}</Text>
                  <Text className="text-primary font-bold">${p.price}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Categories */}
      {!searchQuery && (
        <>
          <View className="px-6 pt-6 pb-2 flex-row justify-between items-center">
            <Text className="text-text-primary font-bold text-lg">Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                className="items-center mr-4"
              >
                <View className="w-16 h-16 bg-purple-100 rounded-2xl items-center justify-center mb-1">
                  <Text className="text-2xl">🛍️</Text>
                </View>
                <Text className="text-text-secondary text-xs text-center">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Trending */}
          <View className="px-6 pt-6 pb-2">
            <Text className="text-text-primary font-bold text-lg">Trending Now</Text>
          </View>
          <FlatList
            horizontal
            data={trending}
            keyExtractor={(p) => String(p.id)}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => goToProduct(item.id)} />
            )}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            showsHorizontalScrollIndicator={false}
          />

          {/* Popular */}
          <View className="px-6 pt-6 pb-2">
            <Text className="text-text-primary font-bold text-lg">Popular Picks</Text>
          </View>
          <FlatList
            horizontal
            data={popular}
            keyExtractor={(p) => String(p.id)}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={() => goToProduct(item.id)} />
            )}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}
    </ScrollView>
  );
}
