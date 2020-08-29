import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import ErrorBoundary from "react-native-error-boundary";
import HomeStack from "./src/routes/homeStack";
import AuthContextProvider from "./src/auth/AuthContext";

export default function App() {
  const errorHandler = (error) => {
    console.log(error);
  };
  return (
    <ErrorBoundary onError={errorHandler}>
      <NavigationContainer>
        <AuthContextProvider>
          <HomeStack />
        </AuthContextProvider>
      </NavigationContainer>
    </ErrorBoundary>
  );
}
