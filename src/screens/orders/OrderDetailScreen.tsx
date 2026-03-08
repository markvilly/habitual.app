import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getOrder } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";
import { OrderItem, OrderResponse, OrderStatus } from "../../types";
import { OrderStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<OrderStackParamList, "OrderDetail">;

const STATUS_STEPS: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailScreen({ route }: Props) {
  const { orderId } = route.params;
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrder(user.id, orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [orderId, user]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-secondary">Order not found.</Text>
      </View>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);

  const renderItem = ({ item }: { item: OrderItem }) => (
    <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
      <View className="flex-1 mr-4">
        <Text className="text-text-primary font-medium">{item.productName}</Text>
        <Text className="text-text-secondary text-sm">Qty: {item.quantity}</Text>
      </View>
      <Text className="text-text-primary font-semibold">${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-background">
      <View className="bg-primary px-6 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold">Order #{order.orderId}</Text>
        <Text className="text-purple-200 text-sm">
          Placed on {new Date(order.orderDate).toLocaleDateString()}
        </Text>
      </View>

      <FlatList
        data={order.items}
        keyExtractor={(i) => String(i.productId)}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            {/* Status tracker */}
            <View className="bg-surface mx-4 mt-4 rounded-2xl p-4 mb-4">
              <Text className="text-text-primary font-semibold mb-4">Order Status</Text>
              <View className="flex-row justify-between">
                {STATUS_STEPS.map((step, idx) => (
                  <View key={step} className="items-center flex-1">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                        idx <= currentStep ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      <Text className={idx <= currentStep ? "text-white text-xs" : "text-gray-400 text-xs"}>
                        {idx + 1}
                      </Text>
                    </View>
                    <Text className="text-text-muted text-xs text-center">{step}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="px-4 mb-2">
              <Text className="text-text-primary font-semibold text-base">Items</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View className="bg-surface mx-4 mt-4 rounded-2xl p-4 mb-8">
            <View className="flex-row justify-between">
              <Text className="text-text-secondary text-base">Total</Text>
              <Text className="text-text-primary text-xl font-bold">
                ${order.totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
