import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getWishlist, removeFromWishlist, shareWishlist } from "../../api/wishlist";
import { useAuth } from "../../context/AuthContext";
import { WishlistItem, WishlistResponse } from "../../types";

export default function WishlistScreen() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getWishlist(user.id);
      setWishlist(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetchWishlist(); }, [fetchWishlist]));

  const handleRemove = async (itemId: number) => {
    if (!user) return;
    try {
      const updated = await removeFromWishlist(user.id, itemId);
      setWishlist(updated);
    } catch {
      Alert.alert("Error", "Failed to remove item.");
    }
  };

  const handleShare = async () => {
    if (!user) return;
    setSharing(true);
    try {
      const { shareUrl } = await shareWishlist(user.id);
      await Share.share({ message: `Check out my wishlist: ${shareUrl}` });
    } catch {
      Alert.alert("Error", "Failed to share wishlist.");
    } finally {
      setSharing(false);
    }
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <View className="flex-row bg-surface rounded-2xl p-4 mb-3 items-center">
      <Image
        source={{ uri: item.productImageURL || "https://via.placeholder.com/64" }}
        className="w-16 h-16 rounded-xl mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="text-text-primary font-semibold" numberOfLines={1}>
          {item.productName}
        </Text>
        <Text className="text-primary font-bold">${item.productPrice.toFixed(2)}</Text>
        <Text className="text-text-muted text-xs mt-0.5">
          Added {new Date(item.addedAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleRemove(item.id)} className="p-2">
        <Text className="text-error text-lg">✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const isEmpty = !wishlist?.items?.length;

  return (
    <View className="flex-1 bg-background">
      <View className="bg-primary px-6 pt-14 pb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-2xl font-bold">Wishlist</Text>
          <Text className="text-purple-200 text-sm">
            {wishlist?.items?.length ?? 0} saved item{wishlist?.items?.length !== 1 ? "s" : ""}
          </Text>
        </View>
        {!isEmpty && (
          <TouchableOpacity
            onPress={handleShare}
            disabled={sharing}
            className="bg-white/20 px-4 py-2 rounded-xl"
          >
            {sharing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white font-medium">Share</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">💜</Text>
          <Text className="text-text-secondary text-base">Your wishlist is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={wishlist?.items}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
