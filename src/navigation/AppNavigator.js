import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import Splash from "../screens/Splash";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import GuestStack from "./GuestStack";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { token } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
        <Stack.Screen name="GuestLogin" component={GuestStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
