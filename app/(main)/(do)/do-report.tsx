import useAuth from "@/context/authContext";
import generateDoReport from "@/services/do/generateReport";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface DoListType {
  id: string;
  bank: string;
  branch: string;
  accountNumber: string;
  doAmount: number;
  doDate: string;
  reference: string;
}

const DoReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [displayStartDate, setDisplayStartDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );
  const [displayEndDate, setDisplayEndDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );
  const { user } = useAuth();
  const [doList, setDoList] = useState([]);

  const handleDatePicker = (currentDate, type) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        const newDate = selectedDate || currentDate;

        if (type === "start") {
          setStartDate(newDate);
          setDisplayStartDate(newDate.toLocaleDateString("en-GB"));
        } else if (type === "end") {
          setEndDate(newDate);
          setDisplayEndDate(newDate.toLocaleDateString("en-GB"));
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const generateReport = async () => {
    if (endDate < startDate) {
      Alert.alert("Date Error", "End Date cannot be before Start Date.");
      return;
    }

    try {
      if (!user?.uid) {
        Alert.alert("Error", "User not authenticated. Cannot generate report.");
        return;
      }
      const data = await generateDoReport(
        user.uid,
        startDate,
        endDate
      );
      if (data) {
        setDoList(data);
      } else {
        setDoList([]);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      Alert.alert("Error", "An error occurred while generating the report.");
    }
  };

  const DoReportItem = ({ item }) => (
    <View style={styles.reportItemContainer}>
      <Text style={styles.reportItemText}>
        <Text style={styles.reportItemLabel}>Bank:</Text> {item.bank}
      </Text>
      <Text style={styles.reportItemText}>
        <Text style={styles.reportItemLabel}>Branch:</Text> {item.branch}
      </Text>
      <Text style={styles.reportItemText}>
        <Text style={styles.reportItemLabel}>Account Number:</Text> {item.accountNumber || 'N/A'}
      </Text>
      <Text style={styles.reportItemText}>
        <Text style={styles.reportItemLabel}>DO Amount:</Text> {item.doAmount}
      </Text>
      <Text style={styles.reportItemText}>
        <Text style={styles.reportItemLabel}>DO Date:</Text>{" "}
        {item.doDate.toDate().toLocaleDateString("en-GB")}
      </Text>
      <Text style={styles.reportItemText}>
        <Text style={styles.reportItemLabel}>Reference:</Text> {item.reference || 'N/A'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>DO Report</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => handleDatePicker(startDate, "start")}
        >
          <Text style={styles.datePickerButtonText}>{displayStartDate}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => handleDatePicker(endDate, "end")}
        >
          <Text style={styles.datePickerButtonText}>{displayEndDate}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generateReport}>
        <Text style={styles.generateButtonText}>Generate Report</Text>
      </TouchableOpacity>

      <FlatList
        renderItem={({ item }) => <DoReportItem item={item} />}
        keyExtractor={(item) => item.id}
        data={doList}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            No DO entries found for the selected date range.
          </Text>
        )}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ItemSeparatorComponent={() => (
          <View style={styles.itemSeparator} />
        )}
        ListHeaderComponent={() => doList.length > 0 && (
          <Text style={styles.listHeader}>
            DO Entries
          </Text>
        )}
        ListFooterComponent={() => <View style={{ height: 20 }} />}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
        overScrollMode="never"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 30,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#495057",
    marginBottom: 8,
    fontWeight: "600",
  },
  datePickerButton: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    borderColor: "#CED4DA",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#343A40",
  },
  generateButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#007BFF",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  flatList: {
    flex: 1,
    marginTop: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#343A40",
    textAlign: 'center',
  },
  reportItemContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reportItemText: {
    fontSize: 15,
    color: "#495057",
    marginBottom: 4,
  },
  reportItemLabel: {
    fontWeight: "bold",
    color: "#343A40",
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#E9ECEF",
    marginVertical: 5,
  },
  emptyListText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6C757D",
  },
});

export default DoReport;
