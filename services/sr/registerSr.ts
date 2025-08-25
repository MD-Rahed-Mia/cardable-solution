import { db } from "@/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const registerSr = async (
  userId: string,
  srDetail: {
    name: string;
    phoneNumber: string;
    dateOfJoin: string;
    routeList: string[];
  }
) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "sr-list"),
      srDetail
    );

    if (docRef.id) {
      return {
        message: "Sr register successful.",
        success: true,
      };
    } else {
      return {
        message: "Sr register failed.",
        success: false,
      };
    }
  } catch (error) {
    console.log("register error : ", error);

    return {
      message: "Failed to register sr.",
      success: false,
    };
  }
};

export default registerSr;
