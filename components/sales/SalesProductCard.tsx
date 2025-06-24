import { ProductType } from "@/types/products/product.types";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SalesProductCardProps {
  product: ProductType;
  endData: string;
  startDate: string;
}

const SalesProductCard = ({
  product,
  endData,
  startDate,
}: SalesProductCardProps) => {
  function handleGeneratingProductReport() {
    router.push({
      pathname: "/(main)/(sales)/generated-product-report",
      params: {
        id: product.id,
        startDate: startDate.toString(),
        endDate: endData.toString(),
      },
    });
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleGeneratingProductReport}
    >
      <View style={styles.header}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productPrice}>
          Dealer Price: &#2547;{product.dealerPrice}
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.productPrice}>
          Trade Price: &#2547;{product.tradePrice}
        </Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.productPrice}>
          Retailer Price: &#2547;{product.retailerPrice}
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Container Size:</Text>
          <Text style={styles.detailValue}>{product.ctnSize}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{product.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    width: "98%",
    alignSelf: "center",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#555",
  },
  detailsContainer: {
    marginBottom: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F5F5F5",
  },
  detailLabel: {
    fontSize: 15,
    color: "#555",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});

export default SalesProductCard;
