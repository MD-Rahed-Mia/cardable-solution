import { ChallanDataType } from "@/app/(main)/(challan)/add-challan";
import { db } from "@/firebaseConfig";
import {
  doc,
  increment,
  setDoc,
  Timestamp,
  updateDoc
} from "firebase/firestore";

const postingChallan = async (
  userId: string,
  challanData: ChallanDataType,
  challanDate: Date
): Promise<boolean> => {
  try {
    // Set challan document
    await setDoc(
      doc(db, "users", userId, "challan", challanData.challanNo),
      {
        ...challanData,
        timestamp: Timestamp.fromDate(challanDate),
      },
      { merge: true }
    );

    const updates = challanData.items.map((item) => {
      const productRef = doc(db, "users", userId, "products", item.id);
      return updateDoc(productRef, {
        stock: increment(item.liftingQuantity),
      });
    });

    await Promise.all(updates);

    return true;
  } catch (error) {
    console.log("Failed to post challan:", error);
    return false;
  }
};

export default postingChallan;
