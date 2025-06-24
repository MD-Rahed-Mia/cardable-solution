import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export interface UpdateProfileInformationType {
  email: string;
  displayName: string;
  phoneNumber: string;
  businessName: string;
  companyName: string;
  groupName: string;
  zoneName: string;
  address: string;
  initialInvestment: number;
}

const updateProfileInformation = async (
  userId: string,
  profileInfo: UpdateProfileInformationType
): Promise<boolean> => {
  try {
    const profileDocRef = doc(db, "users", userId, "businessProfile", "profile");

    await setDoc(profileDocRef, profileInfo, { merge: true });

    return true;
  } catch (error) {
    console.log("error updating profile information:", error);
    return false;
  }
};

export default updateProfileInformation;
