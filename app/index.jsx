import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useAuth from "../context/authContext";

const LandingPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("home");
    }
  }, [user, loading]);

  function handleGoToLogin() {
    if (user) {
      router.replace("(main)/home");
    } else {
      router.push("sign-up");
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading user session...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📦</Text>
        <Text style={styles.title}>Inventory Management Solution</Text>
        <Text style={styles.subtitle}>
          Streamline your stock, track products, and manage your inventory with
          ease.
        </Text>
        <TouchableOpacity
          style={styles.startedButton}
          onPress={handleGoToLogin}
        >
          <Text style={styles.startedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#00796B",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    width: "90%",
    maxWidth: 500,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#004D40",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  startedButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  startedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LandingPage;
