import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const ViewCurrentChallanDetail = () => {
  const { challan } = useLocalSearchParams();

  const parsedChallan = JSON.parse(challan || "{}");
  const items = parsedChallan?.items || [];

  // Format timestamp to readable date
  const createdAt = new Date(
    parsedChallan?.timestamp?.seconds * 1000
  ).toLocaleString();

  // Calculate total based on dealerPrice * liftingQuantity
  const totalAmount = items.reduce(
    (sum, item) => sum + item.dealerPrice * item.liftingQuantity,
    0
  );

  return (
    <ScrollView horizontal>
      <View style={styles.paper}>
        {/* Header Info */}
        <Text style={styles.challanTitle}>Challan Details</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Challan No:</Text>
          <Text style={styles.infoValue}>
            {parsedChallan?.challanNo || "N/A"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date:</Text>
          <Text style={styles.infoValue}>{createdAt}</Text>
        </View>

        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, { maxWidth: 40 }]}>
            SL
          </Text>
          <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>
            Product
          </Text>
          <Text style={[styles.cell, styles.headerCell]}>SKU</Text>
          <Text style={[styles.cell, styles.headerCell]}>Qty</Text>
          <Text style={[styles.cell, styles.headerCell]}>Rate</Text>
          <Text style={[styles.cell, styles.headerCell]}>Total</Text>
        </View>

        {/* Table Body */}
        {items.map((item, index) => (
          <View
            key={item.id || index}
            style={[
              styles.row,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
          >
            <Text style={[styles.cell, { maxWidth: 40 }]}>{index + 1}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{item.title}</Text>
            <Text style={styles.cell}>{item.sku}</Text>
            <Text style={styles.cell}>{item.liftingQuantity}</Text>
            <Text style={styles.cell}>৳ {item.dealerPrice}</Text>
            <Text style={styles.cell}>
              ৳ {item.dealerPrice * item.liftingQuantity}
            </Text>
          </View>
        ))}

        {/* Total Row */}
        <View style={[styles.row, styles.totalRow]}>
          <Text style={[styles.cell, { flex: 5, fontWeight: "bold" }]}>
            Total
          </Text>
          <Text style={[styles.cell, styles.totalAmount]}>৳ {totalAmount}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ViewCurrentChallanDetail;

const styles = StyleSheet.create({
  paper: {
    width: Dimensions.get("window").width,
    backgroundColor: "#fff",
    padding: 16,
  },
  challanTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
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
    marginTop: 12,
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
    marginTop: 50,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 6,
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
    textAlign: "right",
  },
});
