import useAuth from "@/context/authContext";
import { fetchUserProfile } from "@/redux/features/profile/profileSlice";
import updateProfileInformation from "@/services/profile/updateProfileInformation";
import { getAuth, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const EditProfile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [address, setAddress] = useState("");
  const [initialInvestment, setInitialInvestment] = useState("");
  const [loading, setLoading] = useState(false);

  const { profile, isLoading } = useSelector((state) => state.profileR);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || "");
      setCompanyName(profile.companyName || "");
      setGroupName(profile.groupName || "");
      setZoneName(profile.zoneName || "");
      setAddress(profile.address || "");
      setInitialInvestment(profile.initialInvestment?.toString() || "0");
      setDisplayName(profile.displayName || "");
      setPhoneNumber(profile.phoneNumber || "");
    }
  }, [profile]);

  // useEffect(() => {
  //   if (user) {
  //     setDisplayName(user.displayName || "");
  //     setPhoneNumber(user.phoneNumber || "");
  //     setBusinessName("");
  //     setCompanyName("");
  //     setGroupName("");
  //     setZoneName("");
  //     setAddress("");
  //     setInitialInvestment("");
  //   }
  // }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });

        const profileInfo = {
          email: user?.email || "",
          displayName: displayName,
          phoneNumber: phoneNumber,
          businessName: businessName,
          companyName: companyName,
          groupName: groupName,
          zoneName: zoneName,
          address: address,
          initialInvestment: Number(initialInvestment) || 0,
        };

        if (user?.uid) {
          const isSuccess = await updateProfileInformation(
            user.uid,
            profileInfo
          );

          if (isSuccess) {
            dispatch(fetchUserProfile(user.uid));
            Alert.alert("Success", "Profile updated successfully!");
          }
        }
      } else {
        Alert.alert("Error", "No user logged in.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <Text style={styles.header}>User Profile</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={{ ...styles.input, backgroundColor: "lightgray" }}
            value={user?.email || "N/A"}
            editable={false}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your display name"
            placeholderTextColor="#999"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter business name"
            placeholderTextColor="#999"
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter company name"
            placeholderTextColor="#999"
            value={companyName}
            onChangeText={setCompanyName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            placeholderTextColor="#999"
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Zone Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter zone name"
            placeholderTextColor="#999"
            value={zoneName}
            onChangeText={setZoneName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Initial Investment</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter initial investment"
            placeholderTextColor="#999"
            value={initialInvestment}
            onChangeText={setInitialInvestment}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save Profile"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderColor: "#CED4DA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#343A40",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#007BFF",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditProfile;
