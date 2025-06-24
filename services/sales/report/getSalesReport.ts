import { ReportType } from "@/app/(main)/(sales)/sales-report";
import { db } from "@/firebaseConfig";
import {
  collection,
  documentId,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

const getSalesReport = async (
  startDate: string,
  endDate: string,
  userId: string
) => {
  if (!startDate || !endDate || !userId) {
    throw new Error("Start date, end date, and user ID are required.");
  }

  try {
    // Set startDate to 00:00:00 and endDate to 23:59:59.999 to cover full days
    const start = Timestamp.fromDate(
      new Date(new Date(startDate).setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date(endDate).setHours(23, 59, 59, 999))
    );

    const salesRef = collection(db, "users", userId, "sales");
    const q = query(
      salesRef,
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );

    const snapshot = await getDocs(q);

    const salesSummary: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Check fields existence
      if (!data.id) {
        console.warn("Document missing productId:", doc.id);
        return;
      }

      const salesQuantity = data.salesQuantity ?? 0;

      if (salesSummary[data.id]) {
        salesSummary[data.id] += salesQuantity;
      } else {
        salesSummary[data.id] = salesQuantity;
      }
    });

    const productId = Object.keys(salesSummary);

    // query product with id
    const queryProduct = query(
      collection(db, "users", userId, "products"),
      where(documentId(), "in", [...productId])
    );

    // console.log("query product : ", queryProduct);

    const querySnapshot = await getDocs(queryProduct);

    const productWithSales: ReportType[] = [];

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const sales = salesSummary[doc.id];
      const data: ReportType = {
        id: doc.id,
        ...doc.data(),
        salesQuantity: sales,
      };
      productWithSales.push(data);
    });

    return productWithSales;
  } catch (error) {
    console.error("Failed to get sales report:", error);
    throw error;
  }
};

export default getSalesReport;
