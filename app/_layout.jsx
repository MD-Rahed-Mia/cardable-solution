import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { Colors } from "../constants/Colors";
import { AuthProvider } from "../context/authContext";
import store from "../redux/store/store";

const RootLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <Provider store={store}>
          <StatusBar backgroundColor={Colors.statusBar.background} />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
          </Stack>
        </Provider>
      </AuthProvider>
    </SafeAreaView>
  );
};

export default RootLayout;
