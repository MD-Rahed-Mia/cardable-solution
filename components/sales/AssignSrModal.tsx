import { db } from "@/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs } from "firebase/firestore";
import React, { SetStateAction, useEffect, useState } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";

interface SR {
  id: string;
  srName: string;
}

const AssignSRModal = ({
  visible,
  onClose,
  userId,
  setSrName,
}: {
  visible: boolean;
  onClose: () => void;
  userId: string;
  setSrName: React.Dispatch<SetStateAction<string>>;
}) => {
  const [srList, setSrList] = useState<SR[]>([]);
  const [selectedSr, setSelectedSr] = useState<string>("");

  useEffect(() => {
    const fetchSrList = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", userId, "sr-list")
        );

        const list: SR[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, srName: docSnap.data().srName });
        });
        setSrList(list);
      } catch (error) {
        console.log("Fetch SR error:", error);
      }
    };

    if (visible) fetchSrList();
  }, [visible]);

  const handleAssign = () => {
    setSrName(selectedSr);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Assign Rider</Text>

          <Picker
            selectedValue={selectedSr}
            onValueChange={(value) => setSelectedSr(value)}
            style={styles.dropdown}
          >
            <Picker.Item label="Select SR" value="" />
            {srList.map((sr) => (
              <Picker.Item key={sr.id} label={sr.srName} value={sr.srName} />
            ))}
          </Picker>

          <View style={styles.actions}>
            <Button title="Cancel" onPress={onClose} />
            <Button
              title="Assign"
              onPress={handleAssign}
              disabled={!selectedSr}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AssignSRModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  dropdown: {
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
