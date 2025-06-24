import { SalesProductListType } from "@/app/(main)/(sales)/add-sales";
import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  increment,
  Timestamp,
  updateDoc
} from "firebase/firestore";

const addSales = async (
  userId: string,
  productList: SalesProductListType[],
  salesDate: Date
): Promise<boolean> => {
  try {
    if (!userId) {
      console.log("Failed to update sales. Required user ID.");
      return false;
    }

    if (productList.length < 1) {
      console.log("Failed to update sales. No sales found.");
      return false;
    }

    const selectedTime = Timestamp.fromDate(salesDate);

    await Promise.all(
      productList.map((item) =>
        addDoc(collection(db, "users", userId, "sales"), {
          ...item,
          timestamp: selectedTime,
        }).then((sales) => {
          updateDoc(doc(db, "users", userId, "products", item.id), {
            stock: increment(-item.salesQuantity),
          });
        })
      )
    );

    return true;
  } catch (error) {
    console.log("Failed to update sales.", error);
    return false;
  }
};

export default addSales;
