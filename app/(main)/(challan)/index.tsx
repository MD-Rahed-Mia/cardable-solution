import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native"; // Keep Pressable if preferred, but TouchableOpacity is more common for simple buttons

const Challan = () => {
  const challanButton = [
    {
      title: "Add Challan",
      icon: <Entypo name="add-to-list" size={30} color="#00796B" />,
      onPress: () => router.push("/(main)/(challan)/add-challan"), // Adjusted route for consistency
    },
    {
      title: "View Challan",
      icon: <MaterialIcons name="view-list" size={30} color="#00796B" />, // Changed icon for better representation
      onPress: () => router.push("/(main)/(challan)/view-challan"), // Adjusted route for consistency
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Challan Management</Text>

      <View style={styles.buttonsGrid}>
        {challanButton.map((btn) => (
          <Pressable // Using Pressable as in original, but TouchableOpacity also works
            key={btn.title}
            style={styles.buttonCard}
            onPress={btn.onPress}
          >
            <View style={styles.iconContainer}>
              {btn.icon}
            </View>
            <Text style={styles.buttonText}>{btn.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#004D40",
    marginBottom: 30,
    alignSelf: 'flex-start',
    width: '100%',
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
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    aspectRatio: 1, // Makes cards square
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default Challan;
