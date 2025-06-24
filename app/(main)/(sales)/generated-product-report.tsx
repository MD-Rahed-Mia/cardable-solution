import useAuth from "@/context/authContext";
import deleteProductSales from "@/services/sales/report/deleteProductSales";
import getProductReport from "@/services/sales/report/getProductReport";
import { ProductType } from "@/types/products/product.types";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; // For download icon
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import XLSX from "xlsx";

// Augment ProductType to include sales-specific fields for this report
export interface ProductReportItemType extends ProductType {
  salesQuantity: number;
  price: number; // Assuming `price` here refers to the actual selling price per unit
  docId: string; // ID for the specific sales entry, used for deletion
}

const GeneratedProductReport = () => {
  const { id, endDate, startDate } = useLocalSearchParams();
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ProductReportItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  const start = startDate ? new Date(startDate as string) : null;
  const end = endDate ? new Date(endDate as string) : null;

  const requestStoragePermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need storage permission to save the file."
      );
      return false;
    }
    return true;
  };

  async function handleFetchProductData() {
    try {
      setLoading(true);
      const result = await getProductReport(
        start?.toISOString() || "",
        end?.toISOString() || "",
        user?.uid,
        id as string
      );
      setReportData(result || []);
    } catch (error) {
      console.log("Failed to fetch report:", error);
      Alert.alert("Error", "Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user && id && start && end) {
      handleFetchProductData();
    }
  }, [user, id, startDate, endDate]);

  const exportToXLSXAndroidDownload = async () => {
    setDownloading(true);
    const permission = await requestStoragePermission();

    if (!permission) {
      setDownloading(false);
      Alert.alert("Storage permission required.");
      return;
    }

    if (reportData.length === 0) {
      setDownloading(false);
      Alert.alert("No Data", "No data to export for this report.");
      return;
    }

    try {
      const reformattedData = reportData.map(
        (data: ProductReportItemType) => ({
          Date: data.timestamp?.seconds
            ? new Date(data.timestamp.seconds * 1000).toLocaleString("en-GB")
            : "",
          "Product Title": data.title,
          SKU: data.sku,
          "CTN Size": data.ctnSize,
          "Dealer Price": data.dealerPrice,
          "Trade Price": data.tradePrice,
          "Retailer Price": data.retailerPrice,
          "Sales Quantity": data.salesQuantity,
          "Selling Price Total": data.salesQuantity * data.retailerPrice, // Using retailer price for sales total
          "Current Stock": data.stock,
        })
      );

      const ws = XLSX.utils.json_to_sheet(reformattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Product Report");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const fileName = `Product_Sales_Report_${id}_${Date.now()}.xlsx`;

      const { DownloadDir } = RNFetchBlob.fs.dirs;
      const path = `${DownloadDir}/${fileName}`;

      await RNFetchBlob.fs.writeFile(path, wbout, "base64");

      RNFetchBlob.android.addCompleteDownload({
        title: fileName,
        description: "XLSX report file",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        path,
        showNotification: true,
      });

      Alert.alert("Success", `File saved to Downloads folder as ${fileName}`);
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", error.message || "Failed to export file.");
    } finally {
      setDownloading(false);
    }
  };

  async function handleDeleteProduct(salesId: string) {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this sales record?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Optimistic UI update
              setReportData((prev) => prev.filter((item) => item.docId !== salesId));
              await deleteProductSales(user?.uid, salesId);
              Alert.alert("Success", "Sales record deleted successfully.");
            } catch (error) {
              console.log("failed to delete sales", error);
              Alert.alert("Error", "Failed to delete sales record.");
              // Revert UI if deletion fails
              handleFetchProductData(); // Re-fetch data to restore deleted item
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  const RenderProductTableRow = ({ item }: { item: ProductReportItemType }) => (
    <View style={productReportStyles.tableRow}>
      <Text style={[productReportStyles.tableCell, productReportStyles.titleCell]}>{item.title}</Text>
      <Text style={productReportStyles.tableCell}>{item.sku}</Text>
      <Text style={productReportStyles.tableCell}>{item.ctnSize}</Text>
      <Text style={productReportStyles.tableCell}>৳{item.retailerPrice}</Text>
      <Text style={[productReportStyles.tableCell, productReportStyles.salesQuantityCell]}>{item.salesQuantity}</Text>
      <Text style={productReportStyles.tableCell}>৳{(item.salesQuantity * item.retailerPrice).toFixed(2)}</Text>
      <Text style={productReportStyles.tableCell}>{item.stock}</Text>
      <Text style={productReportStyles.tableCell}>
        {new Date(item.timestamp?.seconds * 1000).toLocaleDateString("en-GB")}
      </Text>
      <TouchableOpacity
        style={productReportStyles.deleteButton}
        onPress={() => handleDeleteProduct(item.docId)}
      >
        <MaterialCommunityIcons name="delete" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const DownLoadButton = () => (
    <View style={productReportStyles.downloadButtonContainer}>
      <TouchableOpacity
        style={productReportStyles.downloadButton}
        onPress={exportToXLSXAndroidDownload}
        disabled={downloading || reportData.length === 0}
      >
        {downloading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <MaterialCommunityIcons name="microsoft-excel" size={24} color="#FFFFFF" />
            <Text style={productReportStyles.downloadButtonText}>Download Report</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (!start || !end) {
    return <Text style={productReportStyles.error}>Invalid start or end date.</Text>;
  }

  if (loading) {
    return (
      <View style={productReportStyles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={productReportStyles.loadingText}>Loading Report...</Text>
      </View>
    );
  }

  return (
    <View style={productReportStyles.container}>
      <View style={productReportStyles.header}>
        <Text style={productReportStyles.heading}>Product Sales Report</Text>
        <Text style={productReportStyles.subheading}>For Product ID: {id}</Text>
      </View>

      <View style={productReportStyles.dateRow}>
        <View style={productReportStyles.dateDisplay}>
          <Text style={productReportStyles.dateLabel}>Start Date:</Text>
          <Text style={productReportStyles.dateDisplayText}>
            {start.toLocaleDateString("en-GB")}
          </Text>
        </View>

        <View style={productReportStyles.dateDisplay}>
          <Text style={productReportStyles.dateLabel}>End Date:</Text>
          <Text style={productReportStyles.dateDisplayText}>
            {end.toLocaleDateString("en-GB")}
          </Text>
        </View>
      </View>

      {reportData.length === 0 ? (
        <View style={productReportStyles.center}>
          <Text style={productReportStyles.noDataText}>
            No sales found for this product in the selected date range.
          </Text>
          <DownLoadButton />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={productReportStyles.horizontalScrollView}>
          <View style={productReportStyles.tableContainer}>
            <View style={productReportStyles.tableHeader}>
              <Text style={[productReportStyles.tableHeaderCell, productReportStyles.titleHeaderCell]}>Title</Text>
              <Text style={productReportStyles.tableHeaderCell}>SKU</Text>
              <Text style={productReportStyles.tableHeaderCell}>CTN Size</Text>
              <Text style={productReportStyles.tableHeaderCell}>Retailer Price</Text>
              <Text style={productReportStyles.tableHeaderCell}>Sales Qty</Text>
              <Text style={productReportStyles.tableHeaderCell}>Selling Price</Text>
              <Text style={productReportStyles.tableHeaderCell}>Stock</Text>
              <Text style={productReportStyles.tableHeaderCell}>Timestamp</Text>
              <Text style={productReportStyles.tableHeaderCell}>Actions</Text>
            </View>
            <FlatList
              data={reportData}
              keyExtractor={(item) => item.docId || item.id} // Use docId for key if available
              contentContainerStyle={productReportStyles.listContainer}
              renderItem={({ item }) => <RenderProductTableRow item={item} />}
              ListFooterComponent={DownLoadButton}
              nestedScrollEnabled
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default GeneratedProductReport;

const productReportStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F2F5",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A202C",
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 16,
    color: "#4A5568",
    marginTop: 4,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  dateDisplay: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
    borderColor: "#E2E8F0",
    borderWidth: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: "#718096",
    fontWeight: "500",
    marginBottom: 4,
  },
  dateDisplayText: {
    fontSize: 15,
    color: "#2D3748",
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F0F2F5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4A5568",
  },
  noDataText: {
    fontSize: 18,
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    padding: 20,
    fontSize: 16,
    color: "#E53E3E",
    textAlign: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    margin: 16,
  },
  horizontalScrollView: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
    minWidth: 800, // Adjust this based on your column widths
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
    fontSize: 11,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 4,
    minWidth: 70, // Default minimum width for cells
  },
  titleHeaderCell: {
    minWidth: 150, // Wider for the title column
    flex: 2,
    textAlign: "left",
    paddingLeft: 8,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 4,
    minWidth: 70, // Default minimum width for cells
  },
  titleCell: {
    minWidth: 150,
    flex: 2,
    textAlign: "left",
    paddingLeft: 8,
  },
  salesQuantityCell: {
    fontWeight: "bold",
    color: "#007AFF", // Highlight sales quantity
  },
  listContainer: {
    paddingBottom: 20,
  },
  downloadButtonContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
    marginBottom: 10,
    alignSelf: 'center',
    width: "100%",
  },
  downloadButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    gap: 10,
    elevation: 6,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  deleteButton: {
    backgroundColor: "#EF4444", // Red for delete
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60, // Give it a fixed width for consistent column layout
  },
});