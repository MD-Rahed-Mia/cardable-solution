import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const ViewNotes = () => {
  const { title, notes } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.divider} />
          <Text style={styles.content}>{notes}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
});

export default ViewNotes;
