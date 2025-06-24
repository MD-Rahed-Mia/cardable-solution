import { db } from "@/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export interface DoDataType {
  bank: string;
  branch: string;
  accountNumber: string;
  doAmount: number;
  doDate: string;
  reference: string;
}

const addNewDo = async (userId: string, doData: DoDataType) => {
  const collectionRef = collection(db, "users", userId, "do");

  await addDoc(collectionRef, doData);

  try {
  } catch (error) {
    console.log("Failed to add new DO:", error);
    return false;
  }
};

export default addNewDo;
