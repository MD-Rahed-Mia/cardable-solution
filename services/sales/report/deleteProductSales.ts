import { db } from "@/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

const deleteProductSales = async (userId: string, salesId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId, "sales", salesId));
    console.log("delete successful.", salesId);
    return true;
  } catch (error) {
    console.log("Failed to delete products.", error);
    return false;
  }
};

export default deleteProductSales;
