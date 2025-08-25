import useAuth from "@/context/authContext";
import { db } from "@/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SR {
  id: string;
  srName: string;
  phone: string;
  dateOfJoin: string;
  routeList: string[];
}

const SRList = ({ userId }: { userId: string }) => {
  const [srList, setSrList] = useState<SR[]>([]);
  const { user } = useAuth();

  const fetchSrList = async () => {
    try {
      if (user) {
        const querySnapshot = await getDocs(
          collection(db, "users", user?.uid, "sr-list")
        );
        const list: SR[] = [];

        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as SR);
        });
        setSrList(list);
      }
    } catch (error) {
      console.log("Fetch SR error:", error);
    }
  };

  const deleteSr = async (srId: string) => {
    try {
      await deleteDoc(doc(db, "users", user?.uid, "sr-list", srId));
      setSrList(srList.filter((sr) => sr.id !== srId));
    } catch (error) {
      console.log("Delete SR error:", error);
    }
  };

  useEffect(() => {
    fetchSrList();
  }, []);

  const renderItem = ({ item }: { item: SR }) => (
    <View>
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          marginVertical: 10,
          fontWeight: "bold",
        }}
      >
        SR List
      </Text>
      <View style={styles.row}>
        <View style={styles.infoContainer}>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{item.srName}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{item.phone}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>Join Date:</Text>
            <Text style={styles.value}>{item.dateOfJoin}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.label}>Routes:</Text>
            <Text style={styles.value}>{item.routeList.join(", ")}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => deleteSr(item.id)}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {srList.length > 0 ? (
        <FlatList
          data={srList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No SRs found.</Text>
        </View>
      )}
    </View>
  );
};

export default SRList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  row: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  infoColumn: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    color: "#333",
  },
  value: {
    color: "#555",
    flexShrink: 1,
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});
