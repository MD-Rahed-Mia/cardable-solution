import { db } from "@/firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

const deleteProduct = async (productId: string, userId: string) => {
  if (!productId) {
    console.log("Product ID required. ");
    return false;
  }

  if (!userId) {
    console.log("UID required. ");
    return false;
  }
  try {
    const productRef = doc(db, "users", userId, "products", productId);

    await deleteDoc(productRef);

    return true;
  } catch (error) {
    console.log("Faile to delete product: ", error);
    return false;
  }
};

export default deleteProduct;
