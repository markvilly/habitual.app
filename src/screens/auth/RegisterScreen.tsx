import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { register } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const INTEREST_OPTIONS = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Home & Garden",
  "Beauty",
  "Toys",
  "Automotive",
];

export default function RegisterScreen({ navigation }: Props) {
  const { setUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Name, email, and password are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await register({ name, email, password, phoneNumber, interests });
      setUser(response);
    } catch (error: any) {
      Alert.alert("Registration Failed", error?.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-primary mb-1">Create Account</Text>
        <Text className="text-text-secondary mb-8">Join habitual today</Text>

        <TextInput
          className="bg-surface border border-gray-200 rounded-xl px-4 py-3.5 text-text-primary mb-4"
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="bg-surface border border-gray-200 rounded-xl px-4 py-3.5 text-text-primary mb-4"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          className="bg-surface border border-gray-200 rounded-xl px-4 py-3.5 text-text-primary mb-4"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          className="bg-surface border border-gray-200 rounded-xl px-4 py-3.5 text-text-primary mb-6"
          placeholder="Phone Number (optional)"
          placeholderTextColor="#9CA3AF"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Text className="text-text-primary font-semibold mb-3">
          Select Interests (optional)
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-8">
          {INTEREST_OPTIONS.map((item) => {
            const selected = interests.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleInterest(item)}
                className={`px-4 py-2 rounded-full border ${
                  selected
                    ? "bg-primary border-primary"
                    : "bg-surface border-gray-200"
                }`}
              >
                <Text className={selected ? "text-white font-medium" : "text-text-secondary"}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center mb-4"
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text className="text-center text-text-secondary">
            Already have an account?{" "}
            <Text className="text-primary font-semibold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
