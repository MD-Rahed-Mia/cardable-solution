import {
  ChallanDataType,
  ChallanItemsType,
} from "@/app/(main)/(challan)/add-challan";
import { ProductType } from "@/types/products/product.types";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface ChallanProductCardProps {
  product: ProductType;
  challanData: ChallanDataType;
  setChallanData: React.Dispatch<React.SetStateAction<ChallanDataType>>;
}

const ChallanProductCard = ({
  product,
  challanData,
  setChallanData,
}: ChallanProductCardProps) => {
  const handleInputQuantity = (text: string) => {
    const quantity = Number(text);

    setChallanData((prev) => {
      const existingIndex = prev.items.findIndex(
        (item) => item.id === product.id
      );

      // Copy existing items
      const updatedItems = [...prev.items];

      if (quantity > 0) {
        const updatedProduct: ChallanItemsType = {
          ...product,
          liftingQuantity: quantity,
        };

        if (existingIndex !== -1) {
          // Update existing item
          updatedItems[existingIndex] = updatedProduct;
        } else {
          // Add new item
          updatedItems.push(updatedProduct);
        }
      } else if (existingIndex !== -1) {
        // Remove item if quantity is 0
        updatedItems.splice(existingIndex, 1);
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>Price: {product.price}</Text>
        <Text style={styles.ctnsize}>Ctn Size: {product.ctnSize}</Text>
        <Text style={styles.quantity}>Stock: {product.stock}</Text>
      </View>
      <View style={styles.right}>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="quantity"
          onChangeText={handleInputQuantity}
          placeholderTextColor={"gray"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    elevation: 5,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    marginTop: 10,
  },
  left: {},
  right: {},
  title: {
    fontWeight: "bold",
    fontSize: 12,
  },
  price: {
    fontSize: 14,
    color: "#333",
  },
  ctnsize: {
    fontSize: 14,
    color: "#333",
  },
  quantity: {
    fontSize: 14,
    color: "#555",
  },
  input: {
    minWidth: 80,
    maxWidth: 100,
    padding: 10,
    fontSize: 16,
    borderRadius: 10,
    borderColor: "lightgray",
    borderWidth: 1,
    textAlign: "center",
    color: "black",
  },
});

export default ChallanProductCard;
