import { db } from "@/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const fetchAllNotes = async (userId: string) => {
  try {
    const q = query(collection(db, "users", userId, "notes"), orderBy("timestamp", "desc"));

    const snapShot = await getDocs(q);

    if (snapShot.empty) {
      console.log("No notes found for this user.");
      return false;
    }
    const notes = snapShot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched notes:", notes);
    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return false;
  }
};

export default fetchAllNotes;
