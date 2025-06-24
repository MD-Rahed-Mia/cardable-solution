import DueDetailCard from "@/components/due/DueDetailCard";
import useAuth from "@/context/authContext";
import dueReportGenerate from "@/services/due/dueReportGenerate";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DueReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { user } = useAuth();
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDate(currentDate);
  };
  const handleEndDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setEndDate(currentDate);
  };

  function showStartDate() {
    DateTimePickerAndroid.open({
      value: startDate,
      onChange: handleStartDate,
      mode: "date",
      is24Hour: true,
    });
  }

  function showEndDate() {
    DateTimePickerAndroid.open({
      value: endDate,
      onChange: handleEndDate,
      mode: "date",
      is24Hour: true,
    });
  }

  async function handleGenerateReport() {
    try {
      setIsLoading(true);
      const data = await dueReportGenerate(
        user?.uid,
        startDate.toISOString(),
        endDate.toISOString()
      );
      if (data) {
        console.log("Due report data:", data);
        setReportData(data);
      } else {
        console.log("No data found for the selected date range.");
      }
    } catch (error) {
      console.log("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  }
  const [selectedLanguage, setSelectedLanguage] = useState();

  async function handleChangeStatus(searchStatus) {
    if (searchStatus === "Collected") {
      setSelectedLanguage("Collected");

      const originalData = await dueReportGenerate(
        user?.uid,
        startDate.toISOString(),
        endDate.toISOString()
      );

      const filteredData = originalData.filter(
        (item) => item.status === "Collected"
      );
      setReportData(filteredData);
    } else if (searchStatus === "Pending") {
      setSelectedLanguage("Pending");

      const originalData = await dueReportGenerate(
        user?.uid,
        startDate.toISOString(),
        endDate.toISOString()
      );

      const filteredData = originalData.filter(
        (item) => item.status === "Pending"
      );
      setReportData(filteredData);
    } else {
      setSelectedLanguage("All");
      const originalData = await dueReportGenerate(
        user?.uid,
        startDate.toISOString(),
        endDate.toISOString()
      );
      setReportData(originalData);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={showStartDate}>
          <Text style={styles.buttonText}>
            {startDate.toLocaleDateString("en-GB") || "Start Date"}
          </Text>
        </Pressable>
        <Pressable style={styles.button} onPress={showEndDate}>
          <Text style={styles.buttonText}>
            {endDate.toLocaleDateString("en-GB") || "End Date"}
          </Text>
        </Pressable>
      </View>

      <View>
        <Pressable
          style={styles.generateButton}
          onPress={handleGenerateReport}
          disabled={isLoading}
        >
          <Text style={styles.generateButtonText}>
            {isLoading ? "Loading..." : "Generate Report"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={reportData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View>
            <Picker
              selectedValue={selectedLanguage}
              onValueChange={(itemValue, itemIndex) =>
                handleChangeStatus(itemValue)
              }
            >
              <Picker.Item label="All" value={"All"} />
              <Picker.Item label="Pending" value={"Pending"} />
              <Picker.Item label="Collected" value={"Collected"} />
            </Picker>
          </View>
        )}
        renderItem={({ item }) => <DueDetailCard data={item} />}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    width: 150,
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
  },
  salesContainer: {
    flex: 1,
  },
  generateButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default DueReport;
