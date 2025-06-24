import { db } from "@/firebaseConfig";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

const updateNote = async (
  userId: string,
  noteId: string,
  updateNotes: string
) => {
  try {
    const docRef = doc(db, "users", userId, "notes", noteId);
    await updateDoc(docRef, {
      notes: updateNotes,
      timestamp: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error updating note:", error);
    return false;
  }
};

export default updateNote;
