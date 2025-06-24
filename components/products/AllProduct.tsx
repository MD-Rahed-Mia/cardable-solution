import { fetchProduct } from "@/redux/features/products/productSlice";
import { ProductType } from "@/types/products/product.types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../context/authContext";
import SearchContainer from "../search/SearchContainer";

import deleteProduct from "@/services/products/deleteProduct";
import { router } from "expo-router";

interface ProductTableRowProps {
  product: ProductType;
  onDeleteSuccess: () => void;
}

const ProductTableRow = ({
  product,
  onDeleteSuccess,
}: ProductTableRowProps) => {
  const { user } = useAuth();

  const handleDeleteProduct = async () => {
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
          onPress: async () => {
            try {
              if (user) {
                const result = await deleteProduct(product.id, user?.uid);
                if (result) {
                  Alert.alert("Success", "Product deleted successfully.");
                  onDeleteSuccess();
                } else {
                  Alert.alert(
                    "Failed",
                    "Failed to delete product. Please try again."
                  );
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
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={productStyles.tableRow}>
      <Text style={[productStyles.tableCell, productStyles.titleCell]}>
        {product.title}
      </Text>
      <Text style={productStyles.tableCell}>{product.sku}</Text>
      <Text style={productStyles.tableCell}>{product.category}</Text>
      <Text style={productStyles.tableCell}>৳{product.dealerPrice}</Text>
      <Text style={productStyles.tableCell}>৳{product.tradePrice}</Text>
      <Text style={productStyles.tableCell}>৳{product.retailerPrice}</Text>
      <Text style={productStyles.tableCell}>{product.ctnSize}</Text>
      <Text style={[productStyles.tableCell, productStyles.stockCell]}>
        {product.stock}
      </Text>
      <View style={productStyles.actionsCell}>
        <TouchableOpacity
          style={productStyles.editButton}
          onPress={() =>
            router.push({
              pathname: "/(main)/(products)/edit-product",
              params: {
                productId: product.id,
              },
            })
          }
        >
          <MaterialIcons name="edit" size={18} color="#0065F8" />
        </TouchableOpacity>
        <TouchableOpacity
          style={productStyles.deleteButton}
          onPress={handleDeleteProduct}
        >
          <MaterialIcons name="delete" size={18} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AllProduct = () => {
  const { user } = useAuth();
  const [filterProducts, setFilterProduct] = useState<ProductType[]>([]);
  const [productCounter, setProductCounter] = useState<number>(0);

  const { products, isLoading, isError } = useSelector(
    (state: any) => state.productR
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      user?.uid &&
      (!products ||
        products.length === 0 ||
        products.length !== filterProducts.length)
    ) {
      dispatch(fetchProduct(user.uid));
    }
  }, [dispatch, user?.uid, products, filterProducts]);

  useMemo(() => {
    if (products) {
      setFilterProduct(products);
    }
  }, []);

  useMemo(() => {
    setProductCounter(filterProducts.length);
  }, [filterProducts]);

  function handleRefreshProduct() {
    dispatch(fetchProduct(user.uid));
  }

  return (
    <View style={productStyles.container}>
      <SearchContainer
        setFilterData={setFilterProduct}
        originalData={products}
      />
      <Text style={productStyles.productCounterText}>
        Total Products: {productCounter}
      </Text>

      {/* Outer ScrollView for horizontal scrolling */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={productStyles.horizontalScrollView}
      >
        <View style={productStyles.tableContainer}>
          {/* Table Header - Now inside the same horizontal ScrollView content */}
          <View style={productStyles.tableHeader}>
            <Text
              style={[
                productStyles.tableHeaderCell,
                productStyles.titleHeaderCell,
              ]}
            >
              Title
            </Text>
            <Text style={productStyles.tableHeaderCell}>SKU</Text>
            <Text style={productStyles.tableHeaderCell}>Category</Text>
            <Text style={productStyles.tableHeaderCell}>Dealer Price</Text>
            <Text style={productStyles.tableHeaderCell}>Trade Price</Text>
            <Text style={productStyles.tableHeaderCell}>Retailer Price</Text>
            <Text style={productStyles.tableHeaderCell}>CTN Size</Text>
            <Text style={productStyles.tableHeaderCell}>Stock</Text>
            <Text style={productStyles.tableHeaderCell}>Actions</Text>
          </View>

          {/* FlatList for vertical scrolling */}
          <FlatList
            data={filterProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductTableRow
                product={item}
                onDeleteSuccess={handleRefreshProduct}
              />
            )}
            onRefresh={handleRefreshProduct}
            refreshing={isLoading}
            ListEmptyComponent={
              isLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#007BFF"
                  style={productStyles.loadingIndicator}
                />
              ) : (
                <Text style={productStyles.emptyListText}>
                  No products found.
                </Text>
              )
            }
            contentContainerStyle={productStyles.flatListContent}
            nestedScrollEnabled
          />
        </View>
      </ScrollView>
    </View>
  );
};

const productStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  productCounterText: {
    marginHorizontal: 15,
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  horizontalScrollView: {
    flex: 1, // Allows the outer ScrollView to take up available vertical space
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tableContainer: {
    minWidth: 950, // Ensures content is wider than screen, enabling horizontal scroll
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E0E7EB",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#BDC3C7",
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 4,
    minWidth: 90,
  },
  titleHeaderCell: {
    minWidth: 180,
    flex: 2,
    textAlign: "left",
    paddingLeft: 10,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
    minWidth: 950, // Match tableContainer minWidth
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 4,
    minWidth: 90,
  },
  titleCell: {
    minWidth: 180,
    flex: 2,
    textAlign: "left",
    paddingLeft: 10,
    fontWeight: "600",
  },
  stockCell: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  actionsCell: {
    flex: 1,
    minWidth: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  deleteButton: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: "#FFEBEE",
  },
  editButton: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: "#E0F7FA",
  },
  loadingIndicator: {
    marginTop: 50,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
  flatListContent: {},
});

export default AllProduct;
