import useAuth from "@/context/authContext";
import registerSr from "@/services/sr/registerSr";
import React, { useState } from "react";
import {
    Alert,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const AddSr = () => {
  const [srName, setSrName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfJoin, setDateOfJoin] = useState("");
  const [route, setRoute] = useState("");
  const [routeList, setRouteList] = useState([]);
  const [err, setErr] = useState<string | null>(null);

  //   user list
  const { user } = useAuth();

  const addRoute = () => {
    if (route.trim() !== "") {
      setRouteList([...routeList, route]);
      setRoute("");
    }
  };

  //   validation
  function validation() {
    setErr(null);
    if (srName.length < 3) {
      setErr("Invalid SR Name.");
      return false;
    }
    if (phone.length < 11) {
      setErr("Invalid phone number.");
      return false;
    }
    if (dateOfJoin.length < 6) {
      setErr("Invalid date of join.");
      return false;
    }
    if (routeList.length < 1) {
      setErr("Minimum 1 route required.");
      return false;
    }

    return true;
  }

  const handleSubmit = async () => {
    const newSr = {
      srName,
      phone,
      dateOfJoin,
      routeList,
    };

    // if validation failed exit
    if (!validation()) {
      Alert.alert(err);
      return;
    }

    try {
      const result = await registerSr(user?.uid, newSr);

      if (result) {
        Alert.alert(result.message);
      }
    } catch (error) {
      console.log("Failed to register new sr.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register New SR</Text>

      <TextInput
        style={styles.input}
        placeholder="SR Name"
        value={srName}
        onChangeText={setSrName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Join (YYYY-MM-DD)"
        value={dateOfJoin}
        onChangeText={setDateOfJoin}
      />

      <View style={styles.routeRow}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Add Route"
          value={route}
          onChangeText={setRoute}
        />
        <Button title="Add" onPress={addRoute} />
      </View>

      <FlatList
        data={routeList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.routeItem}>• {item}</Text>
        )}
      />

      <Button title="Register SR" onPress={handleSubmit} />
    </View>
  );
};

export default AddSr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  routeItem: {
    fontSize: 16,
    marginLeft: 5,
    marginBottom: 5,
  },
});
