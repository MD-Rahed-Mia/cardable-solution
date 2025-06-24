import { auth } from "@/firebaseConfig";
import { updatePassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Colors = {
  defaultColor: {
    color: "#3498db",
  },
};

const user = auth.currentUser;

const App = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      if (newPassword !== confirmPassword) {
        setErrorMsg("Confirm password not match.");
        return;
      }

      if (newPassword.length < 6) {
        setErrorMsg("Password too short.");
        return;
      }

      updatePassword(user, newPassword)
        .then(() => {
          Alert.alert("Update password successful.");
          setNewPassword("");
          setConfirmPassword("");
        })
        .catch((err) => {
          setErrorMsg(err.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log("Failed to change password.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={{ ...styles.mainTitle, color: Colors.defaultColor.color }}>
          Change Password
        </Text>
        <View style={styles.formContainer}>
          {errorMsg && <Text style={styles.errorMsg}>{errorMsg}</Text>}
          <TextInput
            placeholder="New password"
            secureTextEntry={true}
            style={styles.inputField}
            placeholderTextColor="#9ca3af"
            onChangeText={(text) => setNewPassword(text.trim())}
            value={newPassword}
          />
          <TextInput
            placeholder="Confirm password"
            secureTextEntry={true}
            style={styles.inputField}
            placeholderTextColor="#9ca3af"
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text.trim())}
          />
        </View>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: Colors.defaultColor.color,
          }}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Update Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: 25,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
    width: "100%",
    maxWidth: 450,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  formContainer: {
    gap: 20,
  },
  inputField: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    fontSize: 18,
    color: "#1f2937",
  },
  button: {
    marginTop: 30,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 18,
  },
  errorMsg: {
    color: "red",
  },
});
