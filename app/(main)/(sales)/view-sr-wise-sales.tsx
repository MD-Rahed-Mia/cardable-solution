import useAuth from "@/context/authContext";
import { db } from "@/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
import RNFetchBlob from "rn-fetch-blob";
import XLSX from "xlsx";

interface ProductSale {
  id: string;
  category: string;
  ctnSize: number;
  dealerPrice: number;
  isActive: boolean;
  retailerPrice: number;
  salesQuantity: number;
  sku: number;
  srName: string;
  stock: number;
  timestamp: Timestamp;
  title: string;
  tradePrice: number;
}

interface AggregatedSale {
  productId: string;
  title: string;
  category: string;
  totalSalesQuantity: number;
  totalAmount: number;
  dealerPrice: number;
  tradePrice: number;
}

const ViewSrWiseSales = ({ userId }: { userId: string }) => {
  const [srList, setSrList] = useState<string[]>([]);
  const [selectedSr, setSelectedSr] = useState<string>("");
  const { user } = useAuth();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [aggregatedSales, setAggregatedSales] = useState<AggregatedSale[]>([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fetch SR List
  useEffect(() => {
    const fetchSrList = async () => {
      if (!user) return;
      const snapshot = await getDocs(
        collection(db, "users", user.uid, "sr-list")
      );
      const names: string[] = [];
      snapshot.forEach((docSnap) => {
        names.push(docSnap.data().srName);
      });
      setSrList(names);
    };
    fetchSrList();
  }, [user]);

  // Fetch sales
  const fetchSales = async () => {
    if (!selectedSr || !user) {
      setAggregatedSales([]);
      return;
    }

    setLoadingReport(true);

    const salesRef = collection(db, "users", user.uid, "sales");
    const start = Timestamp.fromDate(
      new Date(new Date(startDate).setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date(endDate).setHours(23, 59, 59, 999))
    );

    try {
      const q = query(
        salesRef,
        where("srName", "==", selectedSr.trim()),
        where("timestamp", ">=", start),
        where("timestamp", "<=", end)
      );

      const snapshot = await getDocs(q);
      const productMap = new Map<string, AggregatedSale>();

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ProductSale;
        const productId = data.id;
        const salesQty = data.salesQuantity || 0;
        const totalAmount = (data.retailerPrice || 0) * salesQty;

        if (productMap.has(productId)) {
          const existing = productMap.get(productId)!;
          existing.totalSalesQuantity += salesQty;
          existing.totalAmount += totalAmount;
        } else {
          productMap.set(productId, {
            productId,
            title: data.title,
            category: data.category,
            dealerPrice: data.dealerPrice,
            tradePrice: data.tradePrice,
            totalSalesQuantity: salesQty,
            totalAmount: totalAmount,
          });
        }
      });

      setAggregatedSales(Array.from(productMap.values()));
    } catch (error) {
      console.error("Fetch sales error:", error);
      setAggregatedSales([]);
    } finally {
      setLoadingReport(false);
    }
  };

  // Export XLSX
  const exportToXLSX = async () => {
    if (aggregatedSales.length === 0) {
      Alert.alert("No Data", "Generate report first to download.");
      return;
    }

    setDownloading(true);

    try {
      const dataToExport = aggregatedSales.map((item) => ({
        Product: item.title,
        Category: item.category,
        "Total Quantity": item.totalSalesQuantity,
        "Dealer Price": item.dealerPrice,
        "Trade Price": item.tradePrice,
        "Total Amount": item.totalAmount,
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SR Sales");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      const fileName = `SR_Sales_${Date.now()}.xlsx`;
      const { DownloadDir } = RNFetchBlob.fs.dirs;
      const path = `${DownloadDir}/${fileName}`;

      await RNFetchBlob.fs.writeFile(path, wbout, "base64");

      RNFetchBlob.android.addCompleteDownload({
        title: fileName,
        description: "SR Wise Sales Report",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        path,
        showNotification: true,
      });

      Alert.alert("Success", `File saved to Downloads as ${fileName}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to export file.");
    } finally {
      setDownloading(false);
    }
  };

  const renderItem = ({ item }: { item: AggregatedSale }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, { width: 180 }]}>{item.title}</Text>
      <Text style={[styles.tableCell, { width: 120 }]}>{item.category}</Text>
      <Text style={[styles.tableCell, { width: 80 }]}>
        {item.totalSalesQuantity}
      </Text>
      <Text style={[styles.tableCell, { width: 90 }]}>৳{item.dealerPrice}</Text>
      <Text style={[styles.tableCell, { width: 90 }]}>৳{item.tradePrice}</Text>
      <Text style={[styles.tableCell, { width: 120 }]}>
        ৳{item.totalAmount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>View SR Wise Sales</Text>

      <Picker
        selectedValue={selectedSr}
        onValueChange={(value) => setSelectedSr(value)}
        style={styles.dropdown}
      >
        <Picker.Item label="Select SR" value="" />
        {srList.map((sr, idx) => (
          <Picker.Item key={idx} label={sr} value={sr} />
        ))}
      </Picker>

      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>Start Date: {startDate.toDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>End Date: {endDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(_, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={fetchSales}
          disabled={loadingReport}
        >
          {loadingReport ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Report</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={exportToXLSX}
          disabled={downloading || aggregatedSales.length === 0}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Download XLSX</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Sales Table */}
      <View style={styles.tableContainer}>
        <ScrollView horizontal>
          <View>
            <View style={[styles.tableRow, styles.headerRow]}>
              <Text style={[styles.tableCell, styles.headerCell, { width: 180 }]}>
                Product
              </Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: 120 }]}>
                Category
              </Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: 80 }]}>
                Quantity
              </Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: 90 }]}>
                Dealer Price
              </Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: 90 }]}>
                Trade Price
              </Text>
              <Text style={[styles.tableCell, styles.headerCell, { width: 120 }]}>
                Total Amount
              </Text>
            </View>
            {aggregatedSales.length === 0 ? (
              <Text style={styles.emptyText}>No sales found.</Text>
            ) : (
              <FlatList
                data={aggregatedSales}
                keyExtractor={(item) => item.productId}
                renderItem={renderItem}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ViewSrWiseSales;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 5,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  generateButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  downloadButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  tableContainer: {
    flex: 1,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  headerRow: {
    backgroundColor: "#eef",
    flexDirection: "row",
    paddingVertical: 12,
  },
  headerCell: { fontWeight: "bold", paddingHorizontal: 10 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 12,
  },
  tableCell: { paddingHorizontal: 10, color: "#555" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888", padding: 10 },
});
