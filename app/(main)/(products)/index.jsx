import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AllProduct from "../../../components/products/AllProduct";

interface ButtonType {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

const Products = () => {
  const ProductButton: ButtonType[] = [
    {
      title: "Add Product",
      icon: <Entypo name="plus" size={30} color="#00796B" />,
      onPress: () => router.push("/(main)/(products)/add-product")
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Products</Text>

      <View style={styles.buttonGrid}>
        {ProductButton.map((button, index) => (
          <TouchableOpacity style={styles.buttonCard} key={index} onPress={button.onPress}>
            <View style={styles.iconContainer}>
              {button.icon}
            </View>
            <Text style={styles.buttonText}>{button.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.allProductContainer}>
        <AllProduct />
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
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20, // Space between add product button and product list
  },
  buttonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "45%", // Takes up about half the width
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
  allProductContainer: {
    flex: 1, // Allows AllProduct to take remaining space
    width: '100%',
  },
});

export default Products;
