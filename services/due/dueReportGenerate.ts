import { db } from "@/firebaseConfig";
import {
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { DueInformation } from "./addDue";

const dueReportGenerate = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const start = Timestamp.fromDate(new Date(new Date(startDate).setHours(0, 0, 0, 0)));
    const end = Timestamp.fromDate(new Date(new Date(endDate).setHours(23, 59, 59, 999)));
    console.log(
      "Generating due report for user:",
      userId,
      "from",
      startDate,
      "to",
      endDate
    );
    if (!userId || !startDate || !endDate) {
      console.error("User ID, start date, or end date is missing");
      return false;
    }
    const dueRef = collection(db, "users", userId, "dues");
    const dueQuery = query(
      dueRef,
      where("dueDate", ">=", start),
      where("dueDate", "<=", end)
    );
    const querySnapshot = await getDocs(dueQuery);
    const dueReport: DueInformation[] = [];
    querySnapshot.forEach((doc) => {
      const dueData = doc.data();
      dueReport.push({
        id: doc.id,
        ...dueData,
      });
    });
    console.log("Due report generated successfully:", dueReport);
    return dueReport;
  } catch (error) {
    console.log("failed to generate due report", error);
    return false;
  }
};
export default dueReportGenerate;
