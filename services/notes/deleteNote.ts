import { db } from "@/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

const deleteNote = async (noteId: string, userId: string): Promise<boolean> => {
  try {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await deleteDoc(noteRef);
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};

export default deleteNote;
