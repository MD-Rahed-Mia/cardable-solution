import useAuth from "@/context/authContext";
import deleteChallan from "@/services/challan/deleteChallan";
import searchChallan from "@/services/challan/searchChallan";
import AntDesign from "@expo/vector-icons/AntDesign";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChallanDataType } from "./add-challan";

const ViewChallan = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { user } = useAuth();
  const [challans, setChallans] = useState<ChallanDataType[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStartDate = (event, selectedDate) => {
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDate = (event, selectedDate) => {
    if (selectedDate) setEndDate(selectedDate);
  };

  function showStartDatePicker() {
    DateTimePickerAndroid.open({
      value: startDate,
      onChange: handleStartDate,
      mode: "date",
      is24Hour: true,
    });
  }

  function showEndDatePicker() {
    DateTimePickerAndroid.open({
      value: endDate,
      onChange: handleEndDate,
      mode: "date",
      is24Hour: true,
    });
  }

  async function handleGenerateReport() {
    try {
      if (user) {
        setLoading(true);
        const challanList = await searchChallan(
          user.uid,
          startDate.toISOString(),
          endDate.toISOString()
        );
        setChallans(challanList);
      }
    } catch (error) {
      console.error("Error fetching challans: ", error);
      Alert.alert("Error", "Failed to fetch challans. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteChallan(challanId: string) {
    try {
      if (user) {
        const result = await deleteChallan(user.uid, challanId);
        if (result) {
          Alert.alert("Success", "Challan deleted successfully.");
          handleGenerateReport(); // Refresh the list after deletion
        } else {
          Alert.alert("Failed", "Failed to delete challan. Please try again.");
        }
      } else {
        Alert.alert("Error", "User not authenticated.");
      }
    } catch (error) {
      console.error("Failed to delete challan: ", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while deleting the challan."
      );
    }
  }

  const renderChallan = ({ item }: { item: ChallanDataType }) => (
    <View style={styles.challanCard}>
      <View style={styles.challanHeader}>
        <Text style={styles.challanNo}>Challan No: {item.challanNo}</Text>
        <Text style={styles.challanDate}>
          {item.timestamp?.toDate().toLocaleDateString("en-GB")}
        </Text>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemTextTitle}>{product.title}</Text>
            <Text style={styles.itemText}>Qty: {product.liftingQuantity}</Text>
            <Text style={styles.itemText}>Price: ${product.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              "Confirm Delete Challan?",
              `Are you sure you want to delete Challan No: ${item.challanNo}?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => null,
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => handleDeleteChallan(item.challanNo),
                },
              ]
            )
          }
        >
          <AntDesign name="delete" size={20} color="#D32F2F" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>View Challans</Text>

      <View style={styles.datePickerContainer}>
        <Pressable style={styles.dateButton} onPress={showStartDatePicker}>
          <Text style={styles.dateButtonText}>
            From: {startDate.toLocaleDateString("en-GB")}
          </Text>
        </Pressable>
        <Pressable style={styles.dateButton} onPress={showEndDatePicker}>
          <Text style={styles.dateButtonText}>
            To: {endDate.toLocaleDateString("en-GB")}
          </Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleGenerateReport}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.searchButtonText}>Search Challan</Text>
        )}
      </TouchableOpacity>

      {loading && challans.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={styles.loadingIndicator}
        />
      ) : challans.length === 0 ? (
        <Text style={styles.noDataText}>
          No challans found for the selected date range.
        </Text>
      ) : (
        <FlatList
          data={challans}
          keyExtractor={(item) => item.challanNo}
          renderItem={renderChallan}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#004D40",
    marginBottom: 20,
    alignSelf: "flex-start",
    width: "100%",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    width: "100%",
  },
  dateButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  loadingIndicator: {
    marginTop: 30,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#777",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  challanCard: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  challanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 10,
  },
  challanNo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004D40",
  },
  challanDate: {
    fontSize: 14,
    color: "#777",
  },
  itemsContainer: {
    marginTop: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
  },
  itemTextTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 2,
  },
  itemText: {
    fontSize: 13,
    color: "#555",
    flex: 1,
    textAlign: "center",
  },
  actionContainer: {
    marginTop: 15,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: "#D32F2F",
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ViewChallan;
