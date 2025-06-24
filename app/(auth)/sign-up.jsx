import { router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator, // For loading state
  Alert, // For displaying messages
  KeyboardAvoidingView, // To handle keyboard pushing content
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { app } from "../../firebaseConfig"; // Assuming firebaseConfig is correctly set up

const SignUpScreen = () => { // Renamed from SignUp for consistency
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [message, setMessage] = useState(""); // State for displaying messages

  const handleSignUp = async () => {
    setLoading(true);
    setMessage(""); // Clear previous messages
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      setMessage("Account created successfully!");
      Alert.alert("Success", "Your account has been created successfully!");
      router.replace("/(main)/home"); // Navigate on success
    } catch (error) {
      console.error("Error creating user:", error.message);
      let errorMessage = "Failed to create account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      setMessage(errorMessage);
      Alert.alert("Sign Up Failed", errorMessage); // Use Alert for immediate feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Cardable Solution</Text>
        <Text style={styles.subTitle}>Sign Up</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={(e) => setEmail(e.toLocaleLowerCase())}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.inputField}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(e) => setPassword(e)}
          />
        </View>

        {message ? <Text style={styles.messageText}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInLink} // Renamed style for clarity
          onPress={() => router.push("sign-in")}
        >
          <Text style={styles.signInLinkText}>Already have an account? <Text style={styles.signInLinkHighlight}>Sign In.</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA", // Light blue background
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00796B", // Darker teal
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: "#004D40", // Even darker teal
    marginBottom: 40,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },
  inputField: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  signUpButton: { // Style for the main action button
    width: "80%",
    maxWidth: 350,
    backgroundColor: "#007BFF", // Blue primary color
    paddingVertical: 18,
    borderRadius: 30, // Fully rounded corners
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signInLink: { // Style for the secondary link
    marginTop: 30,
    paddingVertical: 10,
  },
  signInLinkText: {
    color: "#555",
    fontSize: 16,
  },
  signInLinkHighlight: {
    color: "#007BFF", // Blue highlight
    fontWeight: "bold",
  },
});

export default SignUpScreen;
