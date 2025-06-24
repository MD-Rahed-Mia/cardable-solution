import { Colors } from "@/constants/Colors";
import { auth } from "@/firebaseConfig";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ForgetPassword = () => {
  const [email, setEmail] = useState<string>("");

  async function handleResetPassword() {
    if (email.length === 0 || email.length < 8) {
      Alert.alert("Invalid Email.");
    }

    try {
      sendPasswordResetEmail(auth, email).then(() => {
        Alert.alert("Reset password sent successfully.");
        router.push("/sign-in");
      });
    } catch (error) {
      console.log("Error: ", error);
      Alert.alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forget Password</Text>
      <TextInput
        style={styles.emailContainer}
        placeholder="Email"
        placeholderTextColor={"gray"}
        onChangeText={(text) => setEmail(text.trim())}
        value={email}
      />

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPassword}
      >
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.defaultColor.color,
  },
  emailContainer: {
    backgroundColor: "white",
    width: "100%",
    height: 60,
    marginVertical: 20,
    padding: 10,
    borderRadius: 5,
  },
  resetButton: {
    paddingHorizontal: 60,
    paddingVertical: 14,
    backgroundColor: Colors.defaultColor.color,
    borderRadius: 60,
  },
  resetButtonText: {
    color: "white",
  },
});
