import { ProductType } from "@/types/products/product.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface SalesReportCardProps {
  product: ProductType;
}

const SalesReportCard = ({ product }: SalesReportCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.skuText}>SKU: {product.sku}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Container Size:</Text>
          <Text style={styles.detailValue}>{product.ctnSize}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Dealer Price:</Text>
          <Text style={styles.detailValue}> &#2547;{product.dealerPrice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Trade Price:</Text>
          <Text style={styles.detailValue}> &#2547;{product.tradePrice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Retailer Price:</Text>
          <Text style={styles.detailValue}> &#2547;{product.retailerPrice}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current Stock:</Text>
          <Text style={styles.detailValue}>{product.stock}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.soldQuantityText}>
          Sold Quantity: <Text style={styles.soldQuantityValue}>{product?.salesQuantity || 0}</Text>
        </Text>
      </View>
    </View>
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
    width: '98%',
    alignSelf: 'center',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
  },
  skuText: {
    fontSize: 14,
    color: "#777",
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F5F5F5',
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
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  soldQuantityText: {
    fontSize: 16,
    color: "#004D40", // Dark teal for emphasis
    fontWeight: "600",
  },
  soldQuantityValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#007BFF", // Blue for highlight
  },
});

export default SalesReportCard;
