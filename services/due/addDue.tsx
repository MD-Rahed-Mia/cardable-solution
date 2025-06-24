import { db } from "@/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export interface DueInformation {
  id?: string;
  dueDate: string;
  collectionDate: string;
  outletName: string;
  routeName: string;
  owner: string;
  amount: number;
  reference: string;
  status: string;
}

const addDue = async (userId: string, dueInformation: DueInformation) => {
  try {
    console.log("Adding due for user:", userId, "with data:", dueInformation);
    if (!userId || !dueInformation) {
      console.error("User ID or due information is missing");
      return false;
    }

    await addDoc(collection(db, "users", userId, "dues"), dueInformation);
    console.log("Due added successfully");
    return true;
  } catch (error) {
    console.log("Error adding due:", error);
    return false;
  }
};

export default addDue;
