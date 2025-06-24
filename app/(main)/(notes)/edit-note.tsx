import useAuth from "@/context/authContext";
import updateNote from "@/services/notes/updateNote";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const EditNotes = () => {
  const { noteId, title, notes } = useLocalSearchParams();

  const [editTitle, setEditTitle] = React.useState(title || "");
  const [EditNotes, setEditNotes] = React.useState(notes || "");
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleTitleChange = (text: string) => {
    setEditTitle(text);
  };
  const handleNotesChange = (text: string) => {
    setEditNotes(text);
  };

  const handleSaveNote = async () => {
    try {
      setIsLoading(true);

      if (user) {
        const result = await updateNote(user?.uid, noteId as string, EditNotes);
        if (result) {
          router.replace("/all-notes");
        }
      }
    } catch (error) {
      console.log("failed to save note:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#9CA3AF"
            style={styles.titleInput}
            onChangeText={handleTitleChange}
            value={editTitle}
            editable={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Write your notes here..."
            placeholderTextColor="#9CA3AF"
            multiline
            style={styles.notesInput}
            onChangeText={handleNotesChange}
            value={EditNotes}
          />
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSaveNote}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Updating..." : "Update Note"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  inputWrapper: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 15,
    paddingHorizontal: 20,
    color: "#1F2937",
    borderRadius: 12,
    backgroundColor: "lightgray",
  },
  notesInput: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    minHeight: 200,
    textAlignVertical: "top",
    color: "#1F2937",
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default EditNotes;
