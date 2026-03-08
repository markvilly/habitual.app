import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getOrders } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";
import { OrderResponse, OrderStatus } from "../../types";
import { OrderStackParamList } from "../../navigation/types";

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
};

export default function OrdersScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<OrderStackParamList>>();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getOrders(user.id);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetchOrders(); }, [fetchOrders]));

  const renderItem = ({ item }: { item: OrderResponse }) => {
    const [bgColor, textColor] = STATUS_COLOR[item.status].split(" ");
    return (
      <TouchableOpacity
        className="bg-surface rounded-2xl p-4 mb-3"
        onPress={() => navigation.navigate("OrderDetail", { orderId: item.orderId })}
      >
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-text-primary font-semibold">Order #{item.orderId}</Text>
          <View className={`${bgColor} px-3 py-1 rounded-full`}>
            <Text className={`${textColor} text-xs font-medium`}>{item.status}</Text>
          </View>
        </View>
        <Text className="text-text-secondary text-sm mb-2">
          {new Date(item.orderDate).toLocaleDateString()} · {item.items.length} item{item.items.length !== 1 ? "s" : ""}
        </Text>
        <Text className="text-primary font-bold">${item.totalAmount.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="bg-primary px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold">My Orders</Text>
        <Text className="text-purple-200 text-sm">{orders.length} total order{orders.length !== 1 ? "s" : ""}</Text>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">📦</Text>
          <Text className="text-text-secondary text-base">No orders yet.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => String(o.orderId)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
