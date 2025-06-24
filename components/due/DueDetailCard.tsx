import useAuth from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const DueDetailCard = ({ data }) => {
  const {
    amount,
    collectionDate,
    dueDate,
    outletName,
    owner,
    reference,
    routeName,
    status,
  } = data;

  const formatDate = (dateObject) => {
    if (dateObject && typeof dateObject.toDate === "function") {
      return dateObject.toDate().toLocaleDateString();
    } else if (dateObject instanceof Date) {
      return dateObject.toLocaleDateString();
    } else if (typeof dateObject === "string") {
      try {
        return new Date(dateObject).toLocaleDateString();
      } catch (e) {
        return dateObject;
      }
    }
    return "N/A";
  };

  const [selectedLanguage, setSelectedLanguage] = useState();
  const { user } = useAuth();

  async function handleChangeStatus(newStatus: string | null) {
    if (newStatus) {
      try {
        // Assuming you have a function to update the status in your backend
        // await updateDueStatus(data.id, newStatus);
        console.log(`Status updated to ${newStatus} for due ID: ${data.id}`);
        setSelectedLanguage(newStatus);

        const docRef = doc(db, "users", user?.uid, "dues", data.id);

        await updateDoc(docRef, { status: newStatus });
        console.log("Status updated successfully:", newStatus);
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.amountText}>
          Amount: ${amount ? amount.toFixed(2) : "N/A"}
        </Text>
        <Text style={[styles.statusText, styles[status.toLowerCase()]]}>
          {status || "N/A"}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Outlet:</Text>
        <Text style={styles.value}>{outletName || "N/A"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>{owner || "N/A"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Route:</Text>
        <Text style={styles.value}>{routeName || "N/A"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Reference:</Text>
        <Text style={styles.value}>{reference || "N/A"}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Due Date:</Text>
        <Text style={styles.value}>{formatDate(dueDate)}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Collection Date:</Text>
        <Text style={styles.value}>{formatDate(collectionDate)}</Text>
      </View>

      <View>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            handleChangeStatus(itemValue)
          }
        >
          <Picker.Item label="Update due status" value={null} />
          <Picker.Item label="Pending" value={"Pending"} />
          <Picker.Item label="Collected" value={"Collected"} />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  amountText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    overflow: "hidden", // Ensures border radius is applied correctly
  },
  pending: {
    backgroundColor: "#ffeb3b", // Yellow
    color: "#333",
  },
  paid: {
    backgroundColor: "#4CAF50", // Green
    color: "#fff",
  },
  overdue: {
    backgroundColor: "#F44336", // Red
    color: "#fff",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    padding: 20,
  },
});

export default DueDetailCard;
