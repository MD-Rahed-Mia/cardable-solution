import { addProductSlice } from "@/redux/features/products/productSlice";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { useDispatch } from "react-redux";
import useAuth from "../../../context/authContext";
import addProduct from "../../../services/products/addProduct";

const AddProduct = () => {
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [dealerPrice, setDealerPrice] = useState("");
  const [tradePrice, setTradePrice] = useState("");
  const [retailerPrice, setRetailerPrice] = useState("");
  const [ctnSize, setCtnSize] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  const { user } = useAuth();

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState(null);

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

  const handleAddProduct = async () => {
    if (
      !title.trim() ||
      !sku.trim() ||
      !stock.trim() ||
      !dealerPrice.trim() ||
      !ctnSize.trim() ||
      !category
    ) {
      Alert.alert("Input Error", "All fields are required.");
      return;
    }

    setIsAdding(true);
    try {
      const product = {
        title,
        sku,
        stock: Number(stock),
        dealerPrice: Number(dealerPrice),
        tradePrice: Number(tradePrice),
        retailerPrice: Number(retailerPrice),
        ctnSize: Number(ctnSize),
        category,
        isActive: true,
      };
      const result = await addProduct(user?.uid, product);

      if (result) {
        dispatch(addProductSlice(product));
        Alert.alert("Success", "Product added successfully.");
        setTitle("");
        setSku("");
        setStock("");
        setDealerPrice("");
        setCtnSize("");
        setCategory(null);
        setTradePrice("");
        setDealerPrice("");
        setRetailerPrice("");
      } else {
        Alert.alert("Failed", "Failed to add product. Please try again.");
      }
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

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Add New Product</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>Title</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Product Title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>SKU(pack size)</Text>
          <TextInput
            style={styles.inputField}
            placeholder="SKU"
            placeholderTextColor="#888"
            value={sku}
            onChangeText={setSku}
            keyboardType="number-pad"
            autoCapitalize="none"
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
            value={stock}
            onChangeText={setStock}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>Dealer Price</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Dealer Price"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={dealerPrice}
            onChangeText={setDealerPrice}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.title}>Trade Price</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Trade Price"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={tradePrice}
            onChangeText={setTradePrice}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>Retailer Price</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Retailer Price"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={retailerPrice}
            onChangeText={setRetailerPrice}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.title}>CTN Size</Text>
          <TextInput
            style={styles.inputField}
            placeholder="Carton Size (e.g., 24, 12)"
            placeholderTextColor="#888"
            value={ctnSize}
            onChangeText={setCtnSize}
            keyboardType="default"
          />
        </View>

        <TouchableOpacity
          style={styles.addProductButton}
          onPress={handleAddProduct}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <AntDesign name="pluscircleo" size={20} color="#fff" />
              <Text style={styles.addProductButtonText}>Add Product</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddProduct;

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
