import Entypo from "@expo/vector-icons/Entypo";
import Foundation from "@expo/vector-icons/Foundation";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonType {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const Damage = () => {
  const damageButton: ButtonType[] = [
    {
      title: "Add Damage",
      icon: <Entypo name="plus" size={30} color="#00796B" />,
      onPress: () => router.push("/add-damage"),
    },
    {
      title: "Generate Damage Report",
      icon: <Foundation name="clipboard-notes" size={30} color="#00796B" />,
      onPress: () => router.push("/damage-report"),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Damage Dashboard</Text>

      <View style={styles.buttonsGrid}>
        {damageButton.map((button, index) => (
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
    alignSelf: "flex-start",
    width: "100%",
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
    aspectRatio: 1,
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

export default Damage;
