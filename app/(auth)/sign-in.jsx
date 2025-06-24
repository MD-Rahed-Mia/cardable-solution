import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { app } from "../../firebaseConfig";

const SignInScreen = () => {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setMessage("Sign In successful!");
      router.replace("/(main)/home");
    } catch (error) {
      console.error("Sign In Error:", error.message);
      let errorMessage = "Failed to sign in. Please check your credentials.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "That email address is invalid!";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      }
      setMessage(errorMessage);
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  function handleGotoForgetpassword() {
    router.replace("forget-password");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Cardable Solution</Text>
        <Text style={styles.subTitle}>Sign In</Text>

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
          <TouchableOpacity
            style={styles.forgetButton}
            onPress={handleGotoForgetpassword}
          >
            <Text>Forget password?</Text>
          </TouchableOpacity>
        </View>

        {message ? <Text style={styles.messageText}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpLink}
          onPress={() => router.push("sign-up")}
        >
          <Text style={styles.signUpLinkText}>
            Don't have an account?{" "}
            <Text style={styles.signUpLinkHighlight}>Sign Up.</Text>
          </Text>
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
    textShadowColor: "rgba(0, 0, 0, 0.1)",
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
    borderColor: "#E0E0E0",
  },
  messageText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  signInButton: {
    width: "80%",
    maxWidth: 350,
    backgroundColor: "#007BFF",
    paddingVertical: 18,
    borderRadius: 30,
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
  signUpLink: {
    marginTop: 30,
    paddingVertical: 10,
  },
  signUpLinkText: {
    color: "#555",
    fontSize: 16,
  },
  signUpLinkHighlight: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  forgetButton: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
});

export default SignInScreen;
