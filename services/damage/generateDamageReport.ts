import { db } from "@/firebaseConfig";
import { ProductType } from "@/types/products/product.types";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

const generateDamageReport = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const start = Timestamp.fromDate(
      new Date(new Date(startDate).setHours(0, 0, 0, 0))
    );
    const end = Timestamp.fromDate(
      new Date(new Date(endDate).setHours(23, 59, 59, 999))
    );

    const q = query(
      collection(db, "users", userId, "damages"),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );

    const querySnapshot = await getDocs(q);

    const categoryItem: ProductType[] = [];

    querySnapshot.forEach((doc) => {
      const findExistingIndex = categoryItem.findIndex(
        (item) => item.id === doc.data().id
      );

      if (findExistingIndex === -1) {
        categoryItem.push(doc.data());
      } else {
        const existingItem = categoryItem[findExistingIndex];

        const updateValue = {
          ...existingItem,
          damageQuantity:
            existingItem.damageQuantity + doc.data().damageQuantity,
        };

        categoryItem[findExistingIndex] = updateValue;
      }
    });

    return categoryItem;
  } catch (error) {
    console.log("Failed to generate report,", error);
    return [];
  }
};

export default generateDamageReport;
