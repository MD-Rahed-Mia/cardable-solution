import { db } from "@/firebaseConfig";
import { ProductType } from "@/types/products/product.types";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

const getProductReport = async (
  startDate: string,
  endDate: string,
  userId: string,
  productId: string
): Promise<ProductType[] | undefined> => {
  try {
    const start = Timestamp.fromDate(
      new Date(new Date(startDate).setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date(endDate).setHours(23, 59, 59, 999))
    );

    // Reference to user's sales collection
    const salesRef = collection(db, "users", userId, "sales");

    // Compose query with all filters
    const q = query(
      salesRef,
      where("timestamp", ">=", start),
      where("timestamp", "<=", end),
      where("id", "==", productId)
    );

    // Fetch documents
    const snapshot = await getDocs(q);

    // Parse and return data as ProductType[]
    const data: ProductType[] = [];
    snapshot.forEach((doc) => {
      console.log("report doc: ", doc.id);

      data.push({ id: doc.id, docId: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error("Failed to generate product report:", error);
    return undefined;
  }
};

export default getProductReport;
