import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import Splash from "../screens/Splash";
import ForceUpdate from "../screens/ForceUpdate";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import GuestStack from "./GuestStack";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { token } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);

  if (isUpdateRequired) {
    return <ForceUpdate />;
  }

  if (isLoading) {
    return <Splash onComplete={(updateRequired) => {
      if (updateRequired) {
        setIsUpdateRequired(true);
      } else {
        setIsLoading(false);
      }
    }} />;
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
        <Stack.Screen name="ForceUpdate" component={ForceUpdate} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
