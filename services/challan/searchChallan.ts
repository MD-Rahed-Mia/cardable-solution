import { db } from "@/firebaseConfig";
import {
    collection,
    getDocs,
    query,
    Timestamp,
    where
} from "firebase/firestore";

const searchChallan = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const start = Timestamp.fromDate(
      new Date(new Date(startDate).setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date(endDate).setHours(23, 59, 59, 999))
    );
    const challanRef = collection(db, "users", userId, "challan");

    const q = query(
      challanRef,
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );

    const snapshot = await getDocs(q);

    const challans: any[] = [];
    snapshot.forEach((doc) => {
      challans.push({ id: doc.id, ...doc.data() });
    });

    return challans;
  } catch (error) {
    console.log("Failed to search challan:", error);
    return [];
  }
};


export default searchChallan;