import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const addProduct = async (userId, product) => {
  if (!userId && !product) {
    console.log("Product and user Id Required.");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, "users", userId, "products"), {
      ...product,
      stock: Number(product.stock),
    });
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export default addProduct;
