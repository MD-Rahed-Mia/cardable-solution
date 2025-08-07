import { db } from "@/firebaseConfig";
import { fetchProduct } from "@/redux/features/products/productSlice";
import { ProductType } from "@/types/products/product.types";
import { AntDesign } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../context/authContext";

interface EditProductType extends ProductType {
  isActive: true;
}

const EditProduct = () => {
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  const { user } = useAuth();
  const { products, isLoading } = useSelector((state) => state.productR);

  const { productId } = useLocalSearchParams();

  const [editProductData, setEditProductData] = useState<EditProductType>();

  useEffect(() => {
    if (products && productId) {
      const currentProduct = products.find(
        (item: ProductType) => item.id === productId
      );

      setEditProductData(currentProduct);
    }
  }, [productId, products, isLoading]);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState(() => editProductData?.category);

  const [categories, setCategories] = useState([
    { label: "UHT", value: "UHT" },
    { label: "Tetra pack", value: "tetra pack" },
    { label: "Hotfil", value: "hotfil" },
    { label: "Powder Milk", value: "powder milk" },
    { label: "Junior Juice", value: "junior juice" },
    { label: "Flavor Milk", value: "flavor milk" },
    { label: "Latina", value: "latina" },
    { label: "MFD", value: "mfd" },
    { label: "Electrolite", value: "elctrolite" },
    { label: "Beverage", value: "beverage" },
  ]);

  const handleUpdateProduct = async () => {
    try {
      await updateDoc(doc(db, "users", user?.uid, "products", productId), {
        ...editProductData,
        dealerPrice: Number(editProductData?.dealerPrice),
        retailerPrice: Number(editProductData?.retailerPrice),
        tradePrice: Number(editProductData?.tradePrice),
        sku: Number(editProductData?.sku),
      });

      dispatch(fetchProduct(user?.uid));

      Alert.alert("Update Successful.");
    } catch (error) {
      console.error("Failed to add product:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while adding the product."
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Edit Product</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>Title</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Product Title"
            placeholderTextColor="#888"
            value={editProductData?.title}
            onChangeText={(text: string) =>
              setEditProductData((prev) => ({ ...prev, title: text }))
            }
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>SKU(pack size)</Text>
          <TextInput
            style={styles.inputField}
            placeholder="SKU"
            placeholderTextColor="#888"
            value={editProductData?.sku.toString()}
            autoCapitalize="none"
            keyboardType="number-pad"
            onChangeText={(text: string) =>
              setEditProductData((prev) => ({ ...prev, sku: text }))
            }
          />
        </View>

        <View style={[styles.inputGroup, { zIndex: 1000 }]}>
          <DropDownPicker
            open={categoryOpen}
            value={category}
            items={categories}
            setOpen={setCategoryOpen}
            setValue={setCategory}
            setItems={setCategories}
            placeholder="Select Category"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            textStyle={styles.dropdownText}
            placeholderStyle={styles.dropdownPlaceholder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>Stock</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Stock Quantity"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={editProductData?.stock?.toString()}
            onChangeText={(text: string) =>
              setEditProductData((prev) => ({ ...prev, stock: Number(text) }))
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>Dealer Price</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Dealer Price"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={editProductData?.dealerPrice.toString()}
            onChangeText={(text: string) =>
              setEditProductData((prev) => ({
                ...prev,
                dealerPrice: text,
              }))
            }
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.title}>Trade Price</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Trade Price"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={editProductData?.tradePrice.toString()}
            onChangeText={(text: string) =>
              setEditProductData((prev) => ({
                ...prev,
                tradePrice: text,
              }))
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>Retailer Price</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Retailer Price"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={editProductData?.retailerPrice.toString()}
            onChangeText={(text: string) =>
              setEditProductData((prev) => ({
                ...prev,
                retailerPrice: text,
              }))
            }
          />
        </View>

        <View
          style={{
            ...styles.inputGroup,
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>Status</Text>
          <Checkbox
            value={editProductData?.isActive}
            onValueChange={() =>
              setEditProductData((prev) => ({
                ...prev,
                isActive: !prev?.isActive,
              }))
            }
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>CTN Size</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Carton Size (e.g., 24, 12)"
            placeholderTextColor="#888"
            value={editProductData?.ctnSize.toString()}
            onChangeText={(text: string) =>
              setEditProductData((prev) => ({ ...prev, ctnSize: Number(text) }))
            }
            keyboardType="default"
          />
        </View>

        <TouchableOpacity
          style={styles.addProductButton}
          onPress={handleUpdateProduct}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <AntDesign name="edit" size={20} color="#fff" />
              <Text style={styles.addProductButtonText}>Update Product</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  container: {
    padding: 20,
    backgroundColor: "#F0F2F5",
    flexGrow: 1,
    paddingBottom: 50, // Add some padding at the bottom for scroll
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#004D40",
    marginBottom: 20,
    alignSelf: "flex-start",
    width: "100%",
  },
  inputGroup: {
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  inputField: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#E0E0E0",
    minHeight: 50,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
    borderRadius: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownPlaceholder: {
    color: "#888",
  },
  addProductButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    width: "100%",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  addProductButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    paddingLeft: 15,
    marginVertical: 5,
    fontWeight: "bold",
    color: "gray",
  },
});
