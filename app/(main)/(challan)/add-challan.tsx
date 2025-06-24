import ChallanProductCard from "@/components/challan/ChallanProductCard";
import Calender from "@/components/date/Calender";
import SearchContainer from "@/components/search/SearchContainer";
import useAuth from "@/context/authContext";
import postingChallan from "@/services/challan/postingChallan";
import { ProductType } from "@/types/products/product.types";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

export interface ChallanItemsType extends ProductType {
  liftingQuantity: number;
}

export interface ChallanDataType {
  challanNo: string;
  items: ChallanItemsType[];
  timestamp?: any;
}

const AddChallan = () => {
  const { products, isLoading, isError } = useSelector(
    (state) => state.productR
  );
  const { user } = useAuth();
  const [filterProducts, setFilterProducts] = useState<ProductType[]>([]);
  const [challanDate, setChallanDate] = useState<Date>(new Date());

  useMemo(() => {
    const filterItem = products.filter((item) => item.isActive == true);
    setFilterProducts(filterItem);
  }, [products]);

  const [challanData, setChallanData] = useState<ChallanDataType>({
    challanNo: "",
    items: [],
    timestamp: Timestamp.fromDate(challanDate),
  });
  const [isPosting, setIsPosting] = useState(false);

  // State for custom alert modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const showCustomAlert = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  function handleChallanNo(text: string) {
    setChallanData((prev) => ({ ...prev, challanNo: text }));
  }

  async function handlePostingChallan() {
    if (!challanData.challanNo.trim()) {
      showCustomAlert("Input Error", "Challan No cannot be empty.");
      return;
    }
    if (challanData.items.length === 0) {
      showCustomAlert(
        "Input Error",
        "Please add at least one product to the challan."
      );
      return;
    }

    setIsPosting(true);
    try {
      const result = await postingChallan(user?.uid, challanData, challanDate);

      if (result) {
        showCustomAlert("Success", "Successfully added challan.");
        router.replace("/(main)/(challan)");
      } else {
        showCustomAlert("Failed", "Failed to add challan. Please try again.");
      }
    } catch (error) {
      console.error("Failed to post challan:", error);
      showCustomAlert(
        "Error",
        "An unexpected error occurred while posting the challan."
      );
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.headerTitle}>Add New Challan</Text>

      <View style={styles.inputGroup}>
        <TextInput
          placeholder="Challan No"
          placeholderTextColor="#888"
          style={styles.challanInput}
          onChangeText={handleChallanNo}
          value={challanData.challanNo}
          keyboardType="default"
          autoCapitalize="none"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={styles.loadingIndicator}
        />
      ) : isError ? (
        <Text style={styles.errorText}>Failed to load products.</Text>
      ) : products && products.length > 0 ? (
        <FlatList
          data={filterProducts}
          keyExtractor={(item) => item.id}
          ListHeaderComponentStyle={styles.listHeaderComponentStyle} // Apply style to the wrapper
          ListHeaderComponent={
            <View style={styles.listHeaderContent}>
              <View style={styles.searchCalenderRow}>
                <View style={styles.searchContainer}>
                  <SearchContainer
                    originalData={products}
                    setFilterData={setFilterProducts}
                  />
                </View>
                <View style={styles.calendarContainer}>
                  <Calender date={challanDate} setDate={setChallanDate} />
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <ChallanProductCard
              product={item}
              setChallanData={setChallanData}
              challanData={challanData}
            />
          )}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <Text style={styles.noProductsText}>
          No products available to add to challan.
        </Text>
      )}

      <TouchableOpacity
        style={styles.postChallanButton}
        onPress={handlePostingChallan}
        disabled={isPosting}
      >
        {isPosting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.postChallanButtonText}>Post Challan</Text>
        )}
      </TouchableOpacity>

      {/* Custom Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 20,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 25,
    alignSelf: "flex-start",
    width: "100%",
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 10,
    backgroundColor: "#fff", // Ensure background is white for shadow to show
  },
  challanInput: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  loadingIndicator: {
    marginTop: 30,
  },
  errorText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#e74c3c", // Red for errors
    fontWeight: "500",
  },
  noProductsText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#7f8c8d", // Grey for informational text
    fontStyle: "italic",
  },
  productList: {
    paddingBottom: 20,
  },
  listHeaderComponentStyle: {
    marginBottom: 15,
  },
  listHeaderContent: {
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
  searchCalenderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 2,
  },
  calendarContainer: {
    flex: 1,
  },
  postChallanButton: {
    backgroundColor: "#2980b9", // Modern blue
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    width: "100%",
    shadowColor: "#2980b9",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  postChallanButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.8,
  },
  // Styles for custom modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)", // Dim background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%", // Make modal responsive
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: "#2980b9",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    elevation: 2,
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default AddChallan;
