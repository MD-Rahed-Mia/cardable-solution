import { router, Stack } from "expo-router";
import { auth } from "../../firebaseConfig";

const MainLayout = () => {
  const user = auth.currentUser;

  if (!user) {
    router.replace("sign-in");
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="products" />
      <Stack.Screen name="sales" />
    </Stack>
  );
};

export default MainLayout;
