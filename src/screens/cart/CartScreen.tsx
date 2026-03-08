import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getCart, removeFromCart } from "../../api/cart";
import { placeOrder } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";
import { CartItem, CartResponse } from "../../types";

export default function CartScreen() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getCart(user.id);
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetchCart(); }, [fetchCart]));

  const handleRemove = async (itemId: number) => {
    if (!user) return;
    try {
      const updated = await removeFromCart(user.id, itemId);
      setCart(updated);
    } catch {
      Alert.alert("Error", "Failed to remove item.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || !cart?.items?.length) return;
    Alert.alert("Place Order", "Confirm your order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          setPlacingOrder(true);
          try {
            await placeOrder(user.id);
            Alert.alert("Order Placed!", "Your order has been placed successfully.");
            fetchCart();
          } catch {
            Alert.alert("Error", "Failed to place order.");
          } finally {
            setPlacingOrder(false);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
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
        <Text className="text-text-secondary text-sm">Qty: {item.quantity}</Text>
        <Text className="text-primary font-bold">${item.subTotal.toFixed(2)}</Text>
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

  const isEmpty = !cart?.items?.length;

  return (
    <View className="flex-1 bg-background">
      <View className="bg-primary px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold">My Cart</Text>
        <Text className="text-purple-200 text-sm">
          {cart?.items?.length ?? 0} item{cart?.items?.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">🛒</Text>
          <Text className="text-text-secondary text-base">Your cart is empty.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart?.items}
            keyExtractor={(i) => String(i.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
          <View className="bg-surface border-t border-gray-100 px-6 py-4">
            <View className="flex-row justify-between mb-4">
              <Text className="text-text-secondary text-base">Total</Text>
              <Text className="text-text-primary text-xl font-bold">
                ${cart?.totalPrice?.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-primary rounded-xl py-4 items-center"
              onPress={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">Place Order</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
