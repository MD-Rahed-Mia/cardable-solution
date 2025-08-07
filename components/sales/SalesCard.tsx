import { SalesProductListType } from "@/app/(main)/(sales)/add-sales";
import { ProductType } from "@/types/products/product.types";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface SalesCardProps {
  product: ProductType;
  salesProductList: SalesProductListType[];
  setSalesProductList: React.Dispatch<
    React.SetStateAction<SalesProductListType[]>
  >;
}

const SalesCard = ({
  product,
  salesProductList,
  setSalesProductList,
}: SalesCardProps) => {
  const [salesQuantity, setSalesQuantity] = useState<number>(0);

  function handleSalesQuantity(text: string) {
    const quantity = Number(text);

    if (text === "" || quantity === 0) {
      setSalesQuantity(0);
      setSalesProductList((prevList) =>
        prevList.filter((item) => item.id !== product.id)
      );
      return;
    }

    if (quantity < 0 || isNaN(quantity)) {
      setSalesQuantity(0);
      return;
    }

    setSalesQuantity(quantity);

    setSalesProductList((prevList) => {
      const existing = prevList.find((item) => item.id === product.id);

      if (existing) {
        return prevList.map((item) =>
          item.id === product.id ? { ...item, salesQuantity: quantity } : item
        );
      } else {
        return [...prevList, { ...product, salesQuantity: quantity }];
      }
    });
  }

  const currentQuantity =
    salesProductList
      .find((item) => item.id === product.id)
      ?.salesQuantity.toString() || "";

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <Text style={styles.productName}>{product.title}</Text>
        <Text style={styles.productDetail}>
          Dealer Price:{" "}
          <Text style={styles.productDetailValue}>
            {" "}
            &#2547;{product.dealerPrice} = &#2547;
            {(product.dealerPrice * salesQuantity).toFixed(1)}
          </Text>
        </Text>
        <Text style={styles.productDetail}>
          Trade Price:{" "}
          <Text style={styles.productDetailValue}>
            {" "}
            &#2547;{product.tradePrice} = &#2547;
            {(product.tradePrice * salesQuantity).toFixed(1)}
          </Text>
        </Text>
        <Text style={styles.productDetail}>
          Retailer Price:{" "}
          <Text style={styles.productDetailValue}>
            {" "}
            &#2547;{product.retailerPrice}
          </Text>
        </Text>
        <Text style={styles.productDetail}>
          Stock: <Text style={styles.productDetailValue}>{product.stock}</Text>
        </Text>
      </View>
      <View style={styles.rightContent}>
        <TextInput
          style={styles.quantityInput}
          placeholder="Qty"
          placeholderTextColor="#B0BEC5"
          keyboardType="numeric"
          onChangeText={handleSalesQuantity}
          value={currentQuantity}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    width: "98%", // Adjust width to fit better in a list
    alignSelf: "center",
  },
  leftContent: {
    flex: 1,
    marginRight: 10,
  },
  rightContent: {
    alignItems: "flex-end",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productDetail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  productDetailValue: {
    fontWeight: "600",
    color: "#333",
  },
  quantityInput: {
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderRadius: 10,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    textAlign: "center",
    color: "#333",
    backgroundColor: "#F8F8F8",
  },
});

export default SalesCard;
