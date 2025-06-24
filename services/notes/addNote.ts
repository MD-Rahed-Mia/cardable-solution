import { db } from "@/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export interface NotesType {
  title: string;
  notes: string;
}

const addNote = async (userId: string, note: NotesType): Promise<boolean> => {
  try {
    await setDoc(
      doc(db, "users", userId, "notes", note.title),
      {
        title: note.title,
        notes: note.notes,
        timestamp: Timestamp.now(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.log("Error adding note:", error);
    return false;
  }
};
export default addNote;
