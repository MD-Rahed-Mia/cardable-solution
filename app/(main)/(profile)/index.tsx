import { Colors } from "@/constants/Colors";
import useAuth from "@/context/authContext";
import { fetchUserProfile } from "@/redux/features/profile/profileSlice";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("Acme Corp");
  const [companyName, setCompanyName] = useState("Acme Holdings");
  const [groupName, setGroupName] = useState("Alpha Group");
  const [zoneName, setZoneName] = useState("North Zone");
  const [address, setAddress] = useState("123 Main St, Anytown");
  const [initialInvestment, setInitialInvestment] = useState("100000");
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state: any) => state.profileR);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   if (user) {
  //     setDisplayName(user.displayName || "");
  //     setPhoneNumber(user.phoneNumber || "");
  //   }
  // }, [profile, user]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile(user.uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || "N/A");
      setCompanyName(profile.companyName || "N/A");
      setGroupName(profile.groupName || "N/A");
      setZoneName(profile.zoneName || "N/A");
      setAddress(profile.address || "N/A");
      setInitialInvestment(profile.initialInvestment?.toString() || "0");
      setDisplayName(profile.displayName || "");
      setPhoneNumber(profile.phoneNumber || "");
    }
  }, [profile]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <Text style={styles.header}>Business Profile</Text>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.valueText}>{profile?.email || "N/A"}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>User Name: {displayName}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Phone Number: {phoneNumber}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Business Name:</Text>
        <Text style={styles.valueText}>{businessName || "N/A"}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Company Name:</Text>
        <Text style={styles.valueText}>{companyName || "N/A"}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Group Name:</Text>
        <Text style={styles.valueText}>{groupName || "N/A"}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Zone Name:</Text>
        <Text style={styles.valueText}>{zoneName || "N/A"}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.valueText}>{address || "N/A"}</Text>
      </View>

      <View style={styles.infoGroup}>
        <Text style={styles.label}>Initial Investment:</Text>
        <Text style={styles.valueText}>{initialInvestment || "N/A"}</Text>
      </View>
      <TouchableOpacity
        style={styles.changePasswordButton}
        onPress={() => router.push("/change-password")}
      >
        <Text style={styles.editButtonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.push("/edit-profile")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </ScrollView>
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
  infoGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  label: {
    fontSize: 16,
    color: "#495057",
    fontWeight: "600",
    flex: 1,
  },
  valueText: {
    fontSize: 16,
    color: "#343A40",
    fontWeight: "normal",
    flex: 2,
    textAlign: "right",
  },
  input: {
    height: 40,
    borderColor: "#CED4DA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#E9ECEF",
    color: "#343A40",
    flex: 2,
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
  editButton: {
    backgroundColor: "#6C757D",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#6C757D",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  changePasswordButton: {
    backgroundColor: Colors.defaultColor.color,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    ...Platform.select({
      ios: {
        shadowColor: "#6C757D",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Profile;
