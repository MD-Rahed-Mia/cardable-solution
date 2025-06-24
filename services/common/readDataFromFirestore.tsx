import { db } from "@/firebaseConfig";
import { ProductType } from "@/types/products/product.types";
import { collection, getDocs } from "firebase/firestore";

const readDataFromFirestore = async (collectionRef: string[]) => {
  try {
    if (!collectionRef || collectionRef.length === 0) {
      console.log("Please add required collection path.");
      return null;
    }

    const querySnapshot = await getDocs(collection(db, ...collectionRef as [string, ...string[]]));

    const result: ProductType[] = [];

    querySnapshot.forEach((doc) => {
      const data: ProductType = { id: doc.id, ...doc.data() } as ProductType;
      result.push(data);
    });

    return result;
  } catch (error) {
    console.log("Failed to read data.", error);
    return null;
  }
};

export default readDataFromFirestore;
