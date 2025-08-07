import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const ViewCurrentSaleReport = () => {
  const { productList } = useLocalSearchParams();
  const parsedProductList = JSON.parse(productList || "[]");

  if (!parsedProductList || parsedProductList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Product found.</Text>
      </View>
    );
  }

  // ✅ Calculate total price
  const totalPrice = parsedProductList.reduce(
    (sum, item) => sum + item.tradePrice * item.salesQuantity,
    0
  );

  return (
    <ScrollView horizontal>
      <View style={styles.paper}>
        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { maxWidth: 45 }]}>
            SL
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 3 }]}>
            Product
          </Text>
          <Text style={[styles.cell, styles.headerCell]}>Price</Text>
          <Text style={[styles.cell, styles.headerCell]}>Qty</Text>
          <Text style={[styles.cell, styles.headerCell]}>Total</Text>
        </View>

        {/* Table Rows */}
        {parsedProductList.map((item, index) => (
          <View
            key={item.id || index}
            style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
          >
            <Text style={[styles.cell, { maxWidth: 30 }]}>{index + 1}</Text>
            <Text style={[styles.cell, { flex: 3 }]}>{item.title}</Text>
            <Text style={styles.cell}>৳ {item.tradePrice}</Text>
            <Text style={styles.cell}>{item.salesQuantity}</Text>
            <Text style={styles.cell}>
              ৳ {item.tradePrice * item.salesQuantity}
            </Text>
          </View>
        ))}

        {/* Total Row */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.cell, { flex: 3, fontWeight: "bold" }]}>
            Total
          </Text>
          <Text style={styles.cell}></Text>
          <Text style={styles.cell}></Text>
          <Text style={[styles.cell, styles.totalAmount]}>৳ {totalPrice}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ViewCurrentSaleReport;

const styles = StyleSheet.create({
  paper: {
    width: Dimensions.get("window").width,
    backgroundColor: "#fff",
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 10,
    alignItems: "center",
  },
  headerRow: {
    borderBottomWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  evenRow: {
    backgroundColor: "#fafafa",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  totalRow: {
    backgroundColor: "#f0f8ff",
    borderTopWidth: 2,
    borderColor: "#ccc",
    marginTop: 40,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e90ff",
  },
});
