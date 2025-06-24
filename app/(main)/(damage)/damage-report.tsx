import Calender from "@/components/date/Calender";
import useAuth from "@/context/authContext";
import generateDamageReport from "@/services/damage/generateDamageReport";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DamageItemType {
  id: string;
  category: string;
  ctnSize: number;
  damageQuantity: number;
  dealerPrice: number;
  isActive: boolean;
  retailerPrice: number;
  sku: number;
  stock: number;
  timestamp: string;
  title: string;
  tradePrice: number;
}

const DamageReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { user } = useAuth();

  const [damageList, setDamageList] = useState<DamageItemType[]>([]);

  const handleGenerateReport = async () => {
    try {
      const result = await generateDamageReport(user?.uid, startDate, endDate);
      setDamageList(result);
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const RenderDamageTableRow = ({ item }: { item: DamageItemType }) => {
    const damagePrice = item.dealerPrice * item.damageQuantity;

    return (
      <View style={modernStyles.tableRow}>
        <Text style={[modernStyles.tableCell, { flex: 2 }]}>{item.title}</Text>
        <Text style={modernStyles.tableCell}>{item.category}</Text>
        {/* <Text style={modernStyles.tableCell}>{item.sku}</Text> */}
        <Text style={modernStyles.tableCell}>{item.ctnSize}</Text>
        <Text style={modernStyles.tableCell}>{item.damageQuantity}</Text>
        <Text style={modernStyles.tableCell}>{item.tradePrice}</Text>
        <Text style={modernStyles.tableCell}>{damagePrice.toFixed(1)}</Text>
      </View>
    );
  };
  return (
    <View style={modernStyles.container}>
      <Text style={modernStyles.headerTitle}>Damage Report</Text>

      <View style={modernStyles.dateRangePicker}>
        <View style={modernStyles.datePickerColumn}>
          <Text style={modernStyles.dateLabel}>Start Date</Text>
          <Calender date={startDate} setDate={setStartDate} />
        </View>
        <View style={modernStyles.datePickerColumn}>
          <Text style={modernStyles.dateLabel}>End Date</Text>
          <Calender date={endDate} setDate={setEndDate} />
        </View>
      </View>

      <TouchableOpacity
        style={modernStyles.generateButton}
        onPress={handleGenerateReport}
      >
        <Text style={modernStyles.generateButtonText}>Generate Report</Text>
      </TouchableOpacity>

      {damageList.length > 0 ? (
        <View style={modernStyles.tableContainer}>
          <View style={modernStyles.tableHeader}>
            <Text style={[modernStyles.tableHeaderCell, { flex: 2 }]}>
              Item Title
            </Text>
            <Text style={modernStyles.tableHeaderCell}>Category</Text>
            {/* <Text style={modernStyles.tableHeaderCell}>SKU</Text> */}
            <Text style={modernStyles.tableHeaderCell}>CTN Size</Text>
            <Text style={modernStyles.tableHeaderCell}>Dam. Qty</Text>
            <Text style={modernStyles.tableHeaderCell}>Trade Price</Text>
            <Text style={modernStyles.tableHeaderCell}>Damage Price</Text>
          </View>
          <FlatList
            data={damageList}
            renderItem={({ item }) => <RenderDamageTableRow item={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={modernStyles.damageList}
          />
        </View>
      ) : (
        <View style={modernStyles.noDataContainer}>
          <Text style={modernStyles.noDataText}>
            Select a date range and generate your damage report.
          </Text>
        </View>
      )}
    </View>
  );
};

export default DamageReport;

const modernStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 25,
    textAlign: "center",
  },
  dateRangePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  datePickerColumn: {
    width: "48%",
  },
  dateLabel: {
    fontSize: 15,
    color: "#34495e",
    marginBottom: 8,
    fontWeight: "600",
  },
  generateButton: {
    backgroundColor: "#1abc9c",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    shadowColor: "#1abc9c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  generateButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ecf0f1",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#34495e",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f2f2f2",
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: "#2c3e50",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  damageList: {
    paddingBottom: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
});
