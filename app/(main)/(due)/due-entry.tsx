import useAuth from "@/context/authContext";
import addDue from "@/services/due/addDue";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert, // For the dropdown menu
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DueEntry = () => {
  const [formData, setFormData] = useState({
    outletName: "",
    routeName: "",
    dueDate: new Date(),
    collectionDate: new Date(),
    amount: "",
    reference: "",
    owner: "",
    currentStatus: "Pending", // Default status
  });

  const { user } = useAuth();

  const [displayDueDate, setDisplayDueDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );
  const [displayCollectionDate, setDisplayCollectionDate] = useState(
    new Date().toLocaleDateString("en-GB")
  );
  const [isStatusDropdownVisible, setIsStatusDropdownVisible] = useState(false);

  const statusOptions = ["Pending", "Collected", "Cancelled"];

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDatePicker = (currentDate, type) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        const newDate = selectedDate || currentDate;
        if (type === "dueDate") {
          setFormData((prev) => ({ ...prev, dueDate: newDate }));
          setDisplayDueDate(newDate.toLocaleDateString("en-GB"));
        } else if (type === "collectionDate") {
          setFormData((prev) => ({ ...prev, collectionDate: newDate }));
          setDisplayCollectionDate(newDate.toLocaleDateString("en-GB"));
        }
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const handleStatusSelect = (status) => {
    setFormData((prev) => ({ ...prev, currentStatus: status }));
    setIsStatusDropdownVisible(false);
  };

  const handleSubmit = async () => {
    try {
      if (user) {
        const dueInformation = {
          dueDate: formData.dueDate,
          collectionDate: formData.collectionDate,
          outletName: formData.outletName,
          routeName: formData.routeName,
          owner: formData.owner,
          amount: Number(formData.amount),
          reference: formData.reference,
          status: formData.currentStatus,
        };
        const result = await addDue(user.uid, dueInformation);

        if (result) {
          Alert.alert("Success", "Due entry saved successfully!");
          setFormData({
            outletName: "",
            routeName: "",
            dueDate: new Date(),
            collectionDate: new Date(),
            amount: "",
            reference: "",
            owner: "",
            currentStatus: "Pending",
          });
          setDisplayDueDate(new Date().toLocaleDateString("en-GB"));
          setDisplayCollectionDate(new Date().toLocaleDateString("en-GB"));
        } else {
          Alert.alert("Error", "Failed to save due entry. Please try again.");
        }
      }
    } catch (error) {
      console.log("Error submitting due entry:", error);
      Alert.alert("Error", "Failed to save due entry. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New Due Entry</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Outlet Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., City Mart"
          placeholderTextColor="#999"
          value={formData.outletName}
          onChangeText={(text) => handleChange("outletName", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Route Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Main Road"
          placeholderTextColor="#999"
          value={formData.routeName}
          onChangeText={(text) => handleChange("routeName", text)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Owner Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Main Road"
          placeholderTextColor="#999"
          value={formData.owner}
          onChangeText={(text) => handleChange("owner", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => handleDatePicker(formData.dueDate, "dueDate")}
        >
          <Text style={styles.datePickerButtonText}>{displayDueDate}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Collection Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() =>
            handleDatePicker(formData.collectionDate, "collectionDate")
          }
        >
          <Text style={styles.datePickerButtonText}>
            {displayCollectionDate}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 2500.50"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={formData.amount}
          onChangeText={(text) => handleChange("amount", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reference</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Sales Invoice #001"
          placeholderTextColor="#999"
          value={formData.reference}
          onChangeText={(text) => handleChange("reference", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Current Status</Text>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsStatusDropdownVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {formData.currentStatus}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={isStatusDropdownVisible}
          onRequestClose={() => setIsStatusDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsStatusDropdownVisible(false)}
          >
            <View style={styles.dropdownContainer}>
              <FlatList
                data={statusOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleStatusSelect(item)}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Save Due Entry</Text>
      </TouchableOpacity>
    </ScrollView>
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
  input: {
    height: 50,
    borderColor: "#CED4DA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#343A40",
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
  dropdownButton: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderColor: "#CED4DA",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
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
  dropdownButtonText: {
    fontSize: 16,
    color: "#343A40",
  },
  dropdownArrow: {
    fontSize: 14,
    color: "#495057",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownContainer: {
    width: "80%",
    maxHeight: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "#CED4DA",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#343A40",
  },
  submitButton: {
    backgroundColor: "#28A745", // Green color for submit
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#28A745",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DueEntry;
