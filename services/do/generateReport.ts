import { db } from "@/firebaseConfig";
import {
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";

const generateDoReport = async (userId, startDate, endDate) => {
  try {
    const doEntriesRef = collection(db, "users", userId, "do");

    console.log("start date : ", startDate);
    console.log("end date : ", endDate);

    const start = Timestamp.fromDate(
      new Date(new Date(startDate).setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date(endDate).setHours(23, 59, 59, 999))
    );

    const q = query(
      doEntriesRef,
      where("doDate", ">=", start),
      where("doDate", "<=", end)
    );

    const querySnapshot = await getDocs(q);

    const reportData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return reportData;
  } catch (error) {
    console.error("Error generating report:", error);
    return false;
  }
};

export default generateDoReport;
