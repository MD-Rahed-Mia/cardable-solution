import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import useAuth from "../../context/authContext";
import { fetchProduct } from "../../redux/features/products/productSlice";

const Home = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchProduct(user.uid));
    }
  }, [user]);

  async function handleSignOut() {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const navigationButton = [
    {
      title: "Products",
      icon: <Ionicons name="cube-outline" size={30} color="#00796B" />,
      onPress: () => router.push("/(main)/(products)"),
    },
    {
      title: "Sales",
      icon: (
        <MaterialCommunityIcons
          name="point-of-sale"
          size={30}
          color="#00796B"
        />
      ),
      onPress: () => router.push("/(main)/(sales)"),
    },
    {
      title: "Damage",
      icon: (
        <MaterialCommunityIcons
          name="salesforce"
          size={30}
          color="#00796B"
        />
      ),
      onPress: () => router.push("/(main)/(damage)"),
    },
    {
      title: "Challan",
      icon: <AntDesign name="filetext1" size={30} color="#00796B" />,
      onPress: () => router.push("/(main)/(challan)"),
    },
    {
      title: "DO",
      icon: <AntDesign name="filetext1" size={30} color="#00796B" />,
      onPress: () => router.push("/(main)/(do)"),
    },
    {
      title: "Due",
      icon: (
        <MaterialCommunityIcons name="currency-bdt" size={30} color="#00796B" />
      ),
      onPress: () => router.push("/(main)/(due)"),
    },
    {
      title: "Notes",
      icon: (
        <MaterialCommunityIcons name="lead-pencil" size={30} color="#00796B" />
      ),
      onPress: () => router.push("/(main)/(notes)"),
    },
    {
      title: "Profile",
      icon: <AntDesign name="user" size={30} color="#00796B" />,
      onPress: () => router.push("/(main)/(profile)"),
    },

    {
      title: "Sign Out",
      icon: <Ionicons name="log-out-outline" size={30} color="#D32F2F" />,
      onPress: handleSignOut,
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
      }}
      style={styles.container}
    >
      <Text style={styles.welcomeText}>Welcome, {user?.email || "User"}!</Text>
      <Text style={styles.headerTitle}>Dashboard</Text>

      <View style={styles.buttonsGrid}>
        {navigationButton.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={button.onPress}
            style={styles.buttonCard}
          >
            <View style={styles.iconContainer}>{button.icon}</View>
            <Text style={styles.buttonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#004D40",
    marginBottom: 30,
    alignSelf: "flex-start",
  },
  buttonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
  },
  buttonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
    aspectRatio: 1,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default Home;
