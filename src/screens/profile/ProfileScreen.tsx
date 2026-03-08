import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getProfile, updateInterests, updateProfile } from "../../api/profile";
import { useAuth } from "../../context/AuthContext";
import { ProfileResponse } from "../../types";

const INTEREST_OPTIONS = [
  "Electronics", "Books", "Fashion", "Sports",
  "Home & Garden", "Beauty", "Toys", "Automotive",
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getProfile(user.id);
      setProfile(data);
      setName(data.name);
      setPhoneNumber(data.phoneNumber ?? "");
      setInterests(data.interests ?? []);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetchProfile(); }, [fetchProfile]));

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    try {
      await updateProfile(user.id, { name, email: profile.email, phoneNumber });
      await updateInterests(user.id, { interests });
      Alert.alert("Saved", "Profile updated successfully.");
      setEditing(false);
      fetchProfile();
    } catch {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      <View className="bg-primary px-6 pt-14 pb-10 items-center">
        <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-3">
          <Text className="text-white text-3xl font-bold">
            {profile?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-white text-xl font-bold">{profile?.name}</Text>
        <Text className="text-purple-200 text-sm">{profile?.email}</Text>
      </View>

      <View className="px-6 pt-6">
        {editing ? (
          <>
            <Text className="text-text-primary font-semibold mb-2">Full Name</Text>
            <TextInput
              className="bg-surface border border-gray-200 rounded-xl px-4 py-3.5 text-text-primary mb-4"
              value={name}
              onChangeText={setName}
            />
            <Text className="text-text-primary font-semibold mb-2">Phone Number</Text>
            <TextInput
              className="bg-surface border border-gray-200 rounded-xl px-4 py-3.5 text-text-primary mb-6"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text className="text-text-primary font-semibold mb-3">Interests</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {INTEREST_OPTIONS.map((item) => {
                const selected = interests.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggleInterest(item)}
                    className={`px-4 py-2 rounded-full border ${
                      selected ? "bg-primary border-primary" : "bg-surface border-gray-200"
                    }`}
                  >
                    <Text className={selected ? "text-white font-medium" : "text-text-secondary"}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                className="flex-1 border border-gray-200 rounded-xl py-4 items-center"
                onPress={() => setEditing(false)}
              >
                <Text className="text-text-secondary font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary rounded-xl py-4 items-center"
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View className="bg-surface rounded-2xl p-4 mb-4">
              <View className="mb-3">
                <Text className="text-text-muted text-xs mb-0.5">FULL NAME</Text>
                <Text className="text-text-primary font-medium">{profile?.name}</Text>
              </View>
              <View className="mb-3">
                <Text className="text-text-muted text-xs mb-0.5">EMAIL</Text>
                <Text className="text-text-primary font-medium">{profile?.email}</Text>
              </View>
              <View>
                <Text className="text-text-muted text-xs mb-0.5">PHONE</Text>
                <Text className="text-text-primary font-medium">
                  {profile?.phoneNumber || "Not set"}
                </Text>
              </View>
            </View>

            {(profile?.interests?.length ?? 0) > 0 && (
              <View className="bg-surface rounded-2xl p-4 mb-4">
                <Text className="text-text-muted text-xs mb-2">INTERESTS</Text>
                <View className="flex-row flex-wrap gap-2">
                  {profile?.interests?.map((item) => (
                    <View key={item} className="bg-purple-100 px-3 py-1 rounded-full">
                      <Text className="text-primary text-sm">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              className="bg-primary rounded-xl py-4 items-center mb-4"
              onPress={() => setEditing(true)}
            >
              <Text className="text-white font-semibold">Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="border border-error rounded-xl py-4 items-center mb-8"
              onPress={logout}
            >
              <Text className="text-error font-semibold">Sign Out</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}
