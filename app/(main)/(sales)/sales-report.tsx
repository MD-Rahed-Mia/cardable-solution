import useAuth from "@/context/authContext";
import getSalesReport from "@/services/sales/report/getSalesReport";
import { ProductType } from "@/types/products/product.types";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
import XLSX from "xlsx";

export interface ReportType extends ProductType {
  salesQuantity: number;
}

// Inline SalesReportCard for table row rendering
const RenderSalesTableRow = ({ item }: { item: ReportType }) => (
  <View style={salesReportStyles.tableRow}>
    <Text style={[salesReportStyles.tableCell, salesReportStyles.titleCell]}>{item.title}</Text>
    <Text style={salesReportStyles.tableCell}>{item.sku}</Text>
    <Text style={salesReportStyles.tableCell}>{item.ctnSize}</Text>
    <Text style={salesReportStyles.tableCell}>{item.dealerPrice}</Text>
    <Text style={salesReportStyles.tableCell}>{item.tradePrice}</Text>
    <Text style={salesReportStyles.tableCell}>{item.retailerPrice}</Text>
    <Text style={[salesReportStyles.tableCell, salesReportStyles.quantityCell]}>{item.salesQuantity}</Text>
    <Text style={salesReportStyles.tableCell}>{item.stock}</Text>
  </View>
);


const SalesReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { user } = useAuth();
  const [report, setReport] = useState<ReportType[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
        setLoadingReport(true);
        const result = await getSalesReport(
          startDate.toISOString(),
          endDate.toISOString(),
          user?.uid
        );
        setReport(result);
      }
    } catch (error) {
      console.error("Error generating sales report: ", error);
      Alert.alert("Error", "Failed to generate report. Please try again.");
    } finally {
      setLoadingReport(false);
    }
  }

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

  const exportToXLSXAndroidDownload = async () => {
    setDownloading(true);
    const permission = await requestStoragePermission();

    if (!permission) {
      setDownloading(false);
      return;
    }

    if (report.length === 0) {
      Alert.alert("No Data", "Generate a report first to download.");
      setDownloading(false);
      return;
    }

    try {
      // Map data to a flat structure suitable for XLSX, possibly selecting relevant fields
      const dataToExport = report.map(item => ({
        "Product Title": item.title,
        "SKU": item.sku,
        "CTN Size": item.ctnSize,
        "Dealer Price": item.dealerPrice,
        "Trade Price": item.tradePrice,
        "Retailer Price": item.retailerPrice,
        "Sales Quantity": item.salesQuantity,
        "Current Stock": item.stock,
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sales Report");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const fileName = `Sales_Report_${Date.now()}.xlsx`;

      const { DownloadDir } = RNFetchBlob.fs.dirs;
      const path = `${DownloadDir}/${fileName}`;

      await RNFetchBlob.fs.writeFile(path, wbout, "base64");

      RNFetchBlob.android.addCompleteDownload({
        title: fileName,
        description: "XLSX sales report file",
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

  const DownloadReportButton = () => (
    <TouchableOpacity
      style={salesReportStyles.downloadButton}
      onPress={exportToXLSXAndroidDownload}
      disabled={downloading || report.length === 0}
    >
      {downloading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <MaterialCommunityIcons name="microsoft-excel" size={24} color="#fff" />
          <Text style={salesReportStyles.downloadButtonText}>Download Report</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={salesReportStyles.container}>
      <Text style={salesReportStyles.headerTitle}>Sales Report</Text>

      <View style={salesReportStyles.datePickerContainer}>
        <Pressable style={salesReportStyles.dateButton} onPress={showStartDatePicker}>
          <Text style={salesReportStyles.dateButtonText}>From: {startDate.toLocaleDateString("en-GB")}</Text>
        </Pressable>
        <Pressable style={salesReportStyles.dateButton} onPress={showEndDatePicker}>
          <Text style={salesReportStyles.dateButtonText}>To: {endDate.toLocaleDateString("en-GB")}</Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={salesReportStyles.generateReportButton}
        onPress={handleGenerateReport}
        disabled={loadingReport}
      >
        {loadingReport ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={salesReportStyles.generateReportButtonText}>Generate Report</Text>
        )}
      </TouchableOpacity>

      {loadingReport && report.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={salesReportStyles.loadingIndicator}
        />
      ) : report.length === 0 ? (
        <Text style={salesReportStyles.emptyListText}>
          No sales data found for the selected date range.
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={salesReportStyles.horizontalScrollView}>
          <View style={salesReportStyles.tableContainer}>
            <View style={salesReportStyles.tableHeader}>
              <Text style={[salesReportStyles.tableHeaderCell, salesReportStyles.titleHeaderCell]}>Item Title</Text>
              <Text style={salesReportStyles.tableHeaderCell}>SKU</Text>
              <Text style={salesReportStyles.tableHeaderCell}>CTN Size</Text>
              <Text style={salesReportStyles.tableHeaderCell}>Dealer Price</Text>
              <Text style={salesReportStyles.tableHeaderCell}>Trade Price</Text>
              <Text style={salesReportStyles.tableHeaderCell}>Retailer Price</Text>
              <Text style={[salesReportStyles.tableHeaderCell, salesReportStyles.quantityHeaderCell]}>Sold Qty</Text>
              <Text style={salesReportStyles.tableHeaderCell}>Stock</Text>
            </View>
            <FlatList
              data={report}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <RenderSalesTableRow item={item} />}
              contentContainerStyle={salesReportStyles.flatListContent}
              nestedScrollEnabled
              ListFooterComponent={DownloadReportButton}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const salesReportStyles = StyleSheet.create({
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
    alignSelf: 'flex-start',
    width: '100%',
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
    alignItems: 'center',
  },
  dateButtonText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
  generateReportButton: {
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
  generateReportButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  loadingIndicator: {
    marginTop: 30,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  downloadButton: {
    backgroundColor: "#28A745",
    paddingVertical: 15,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
    width: "100%",
    shadowColor: "#28A745",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  downloadButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
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
    minWidth: 700, // Adjusted minWidth for the table to accommodate all columns
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
    minWidth: 70, // Minimum width for each header cell
  },
  titleHeaderCell: {
    minWidth: 160,
    flex: 2,
    textAlign: "left",
    paddingLeft: 10,
  },
  quantityHeaderCell: {
    minWidth: 80,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 4,
    minWidth: 70, // Minimum width for each data cell
  },
  titleCell: {
    minWidth: 160,
    flex: 2,
    textAlign: "left",
    paddingLeft: 10,
  },
  quantityCell: {
    fontWeight: 'bold',
    color: '#007BFF', // Highlight sold quantity
  },
});

export default SalesReport;