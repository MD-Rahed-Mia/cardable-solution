import useAuth from "@/context/authContext";
import deleteProduct from "@/services/products/deleteProduct";
import { ProductType } from "@/types/products/product.types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();

  const handleDeleteProduct = async () => {
    try {
      if (user) {
        const result = await deleteProduct(product.id, user?.uid);

        if (result) {
          Alert.alert("Success", "Product deleted successfully.");
        } else {
          Alert.alert("Failed", "Failed to delete product. Please try again.");
        }
      } else {
        Alert.alert("Error", "User not authenticated.");
      }
    } catch (error) {
      console.error("Failed to delete product: ", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while deleting the product."
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productId}>ID: {product.id}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.imagePlaceholder}>
          <MaterialIcons name="image" size={50} color="#B0BEC5" />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Category: <Text style={styles.detailValue}>{product.category}</Text>
          </Text>
          <Text style={styles.detailText}>
            Dealer Price:
            <Text style={styles.detailValue}>
              {" "}
              &#2547;{product.dealerPrice}
            </Text>
          </Text>
          <Text style={styles.detailText}>
            Trade Price:
            <Text style={styles.detailValue}> &#2547;{product.tradePrice}</Text>
          </Text>
          <Text style={styles.detailText}>
            Retailer Price:
            <Text style={styles.detailValue}>
              {" "}
              &#2547;{product.retailerPrice}
            </Text>
          </Text>
          <Text style={styles.detailText}>
            Ctn Size: <Text style={styles.detailValue}>{product.ctnSize}</Text>
          </Text>
          <Text style={styles.detailText}>
            Stock: <Text style={styles.detailValue}>{product.stock}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              "Delete Product",
              `Are you sure you want to delete "${product.title}"?`,
              [
                {
                  text: "Cancel",
                  onPress: () => null,
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: handleDeleteProduct,
                  style: "destructive", // Red text for destructive action
                },
              ]
            )
          }
        >
          <MaterialIcons name="delete" size={24} color="#D32F2F" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push({
              pathname: "/(main)/(products)/edit-product",
              params: {
                productId: product.id,
              },
            })
          }
        >
          <MaterialIcons name="edit" size={24} color="#0065F8" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    width: "95%", // Make it take most of the width
    alignSelf: "center", // Center the card
  },
  cardHeader: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 10,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productId: {
    fontSize: 14,
    color: "#777",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#ECEFF1",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  detailText: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },
  detailValue: {
    fontWeight: "600",
    color: "#333",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 15,
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00CAFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: "#D32F2F",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 15,
  },
  editButtonText: {
    color: "#0065F8",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ProductCard;
