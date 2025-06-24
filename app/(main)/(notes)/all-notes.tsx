import useAuth from "@/context/authContext";
import deleteNote from "@/services/notes/deleteNote";
import fetchAllNotes from "@/services/notes/fetchAllNotes";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AllNotes = () => {
  const [notes, setNotes] = React.useState([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);

  async function fetchNotes() {
    try {
      if (user) {
        const result = await fetchAllNotes(user.uid);
        if (result) {
          setNotes(result);
        } else {
          setNotes([]);
        }
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  async function handleDeleteNote(noteId: string) {
    try {
      const result = await deleteNote(noteId, user?.uid);
      if (result) {
        fetchNotes();
      } else {
        console.error("Failed to delete note.");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.noteCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/view-notes",
          params: { title: item.title, notes: item.notes, noteId: item.id },
        })
      }
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={3}>
        {item.notes}
      </Text>
      <Text style={styles.noteTimestamp}>
        {item.timestamp instanceof Timestamp
          ? item.timestamp.toDate().toLocaleDateString("en-GB")
          : "Invalid Date"}
      </Text>
      <View style={styles.noteActions}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() =>
            router.push({
              pathname: "/edit-note",
              params: { noteId: item.id, title: item.title, notes: item.notes },
            })
          }
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              "Delete Note",
              "Are you sure you want to delete this note?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => handleDeleteNote(item.id),
                },
              ],
              { cancelable: true }
            )
          }
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Loading Notes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>All Notes</Text>
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={renderNoteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notesListContainer}
        />
      ) : (
        <View style={styles.noNotesContainer}>
          <Text style={styles.noNotesText}>No notes yet. Start writing!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  notesListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 10,
  },
  noteTimestamp: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
    marginBottom: 10,
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  actionButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  noNotesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  noNotesText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default AllNotes;
