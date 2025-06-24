import useAuth from "@/context/authContext";
import addNewDo from "@/services/do/addDo";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DoEntry = () => {
  const [formData, setFormData] = useState({
    bank: "",
    branch: "",
    accountNumber: "",
    doAmount: "",
    doDate: new Date(),
    reference: "",
  });

  const [displayDoDate, setDisplayDoDate] = useState("Select Date");
  const { user } = useAuth();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoDate = () => {
    DateTimePickerAndroid.open({
      value: formData.doDate,
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate || formData.doDate;
        setFormData((prev) => ({ ...prev, doDate: currentDate }));
        setDisplayDoDate(currentDate.toLocaleDateString("en-GB"));
      },
      mode: "date",
      is24Hour: true,
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.bank ||
      !formData.branch ||
      !formData.accountNumber ||
      !formData.doAmount ||
      !formData.doDate ||
      !formData.reference
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addNewDo(user?.uid, {
        bank: formData.bank,
        branch: formData.branch,
        accountNumber: formData.accountNumber,
        doAmount: Number(formData.doAmount),
        doDate: Timestamp.fromDate(formData.doDate),
        reference: formData.reference,
      });

      setFormData({
        bank: "",
        branch: "",
        accountNumber: "",
        doAmount: "",
        doDate: new Date(),
        reference: "",
      });
      alert("Do Entry Added Successfully");
      setDisplayDoDate("Select Date");
    } catch (error) {
      console.log("faied to add new DO:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>New DO Entry</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Bank Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., ABC Bank"
          placeholderTextColor="#999"
          value={formData.bank}
          onChangeText={(text) => handleChange("bank", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Branch</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Gulshan Branch"
          placeholderTextColor="#999"
          value={formData.branch}
          onChangeText={(text) => handleChange("branch", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Account number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1234 5678 9012"
          placeholderTextColor="#999"
          value={formData.accountNumber}
          onChangeText={(text) => handleChange("accountNumber", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>DO Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 50000"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={formData.doAmount}
          onChangeText={(text) => handleChange("doAmount", text)}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>DO Date</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={handleDoDate}
        >
          <Text style={styles.datePickerButtonText}>{displayDoDate}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reference</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Invoice #12345"
          placeholderTextColor="#999"
          value={formData.reference}
          onChangeText={(text) => handleChange("reference", text)}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit DO Entry</Text>
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
    backgroundColor: "#E9ECEF",
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
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    marginBottom: 50,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
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
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DoEntry;
