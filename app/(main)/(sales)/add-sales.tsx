import Calender from "@/components/date/Calender";
import SalesCard from "@/components/sales/SalesCard";
import SearchContainer from "@/components/search/SearchContainer";
import useAuth from "@/context/authContext";
import { fetchProduct } from "@/redux/features/products/productSlice";
import addSales from "@/services/sales/addSales";
import { ProductType } from "@/types/products/product.types";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export interface SalesProductListType extends ProductType {
  salesQuantity: number;
}

export interface StoreType {
  products: ProductType[];
  isLoading: boolean;
  isError: string | null;
}

const AddSales = () => {
  const { products, isLoading, isError }: StoreType = useSelector(
    (state) => state.productR
  );
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [postingLoading, setPostingLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [filterProducts, setFilterProducts] = useState<ProductType[]>([]);
  const [activeProducts, setActiveProducts] = useState<ProductType[]>([]);
  const [salesCount, setSalesCount] = useState<number>(0);

  const [salesDate, setSalesDate] = useState(new Date());

  const [salesValue, setSalesValue] = useState<number>(0);

  useMemo(() => {
    if (products) {
      const filterItem = products.filter((item) => item.isActive === true);
      setActiveProducts(filterItem);
      setFilterProducts(filterItem);
    }
  }, [products, user]);

  const [salesProductList, setSalesProductList] = useState<
    SalesProductListType[]
  >([]);

  useEffect(() => {
    const value = salesProductList?.length
      ? salesProductList.reduce(
          (total, item) => total + item.tradePrice * item.salesQuantity,
          0
        )
      : 0;

    setSalesValue(value);
  }, [salesProductList]);

  useEffect(() => {
    if (user?.uid && (!products || products.length === 0)) {
      dispatch(fetchProduct(user.uid));
    }
  }, [dispatch, user?.uid, products]);

  useEffect(() => {
    setSalesCount(salesProductList.length);
  }, [salesProductList]);

  if (isLoading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }
  if (isError) {
    return <Text style={styles.errorText}>Failed to loading products...</Text>;
  }

  async function handleSalesPosting() {
    setPostingLoading(true);
    try {
      if (user) {
        const result = await addSales(user?.uid, salesProductList, salesDate);
        if (result) {
          setSalesProductList([]);
          router.replace("/(main)/(sales)");
        }
      }
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setPostingLoading(false);
    }
  }

  function handleRefreshProduct() {
    dispatch(fetchProduct(user.uid));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        {products && (
          <FlatList
            data={filterProducts}
            keyExtractor={(item) => item.id}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <Text style={styles.userEmailText}>{user?.email}</Text>
                <View style={styles.topControlsContainer}>
                  <View style={styles.searchContainer}>
                    <SearchContainer
                      setFilterData={setFilterProducts}
                      originalData={activeProducts}
                    />
                  </View>
                  <View style={styles.calendarContainer}>
                    <Calender date={salesDate} setDate={setSalesDate} />
                  </View>
                </View>

                <View style={styles.salesSummaryContainer}>
                  <Text style={styles.salesItemText}>
                    Sales Item:{" "}
                    <Text style={styles.salesCountValue}>{salesCount}</Text>
                  </Text>

                  <Text style={styles.salesValueText}>
                    Sales Value:{" "}
                    <Text style={styles.salesValueValue}>
                      &#2547;{salesValue}
                    </Text>
                  </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <SalesCard
                product={item}
                salesProductList={salesProductList}
                setSalesProductList={setSalesProductList}
              />
            )}
            refreshing={false}
            onRefresh={handleRefreshProduct}
          />
        )}

        <Pressable
          style={styles.submitButton}
          onPress={handleSalesPosting}
          disabled={postingLoading}
        >
          <Text style={styles.buttonText}>
            {postingLoading ? "Loading..." : "Post New Sales"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 5,
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "#333",
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "#e74c3c",
  },
  headerContainer: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  userEmailText: {
    fontSize: 12,
    textAlign: "right",
    color: "#555",
    marginBottom: 10,
  },
  topControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  searchContainer: {
    flex: 2,
    marginRight: 5,
  },
  calendarContainer: {
    width: 150,
    marginLeft: 5,
  },
  salesSummaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 10,
  },
  salesItemText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  salesCountValue: {
    fontSize: 22,
    color: "#3498db", // A modern blue
    fontWeight: "bold",
  },
  salesValueText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  salesValueValue: {
    fontSize: 22,
    color: "#2ecc71", // A modern green
    fontWeight: "bold",
  },
  submitButton: {
    marginHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#0065F8",
    marginTop: 20,
    marginBottom: Platform.OS === "ios" ? 20 : 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    elevation: 8,
  },
  submitButtonPressed: {
    backgroundColor: "#0056e0",
    transform: [{ translateY: 1 }],
  },
  submitButtonDisabled: {
    backgroundColor: "#a0c8f5",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddSales;
