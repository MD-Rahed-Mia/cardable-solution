import { db } from "@/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

const deleteChallan = async (userId: string, challanId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId, "challan", challanId));
    return true;
  } catch (error) {
    console.log("Failed to delete challan.", error);
    return false;
  }
};

export default deleteChallan;
