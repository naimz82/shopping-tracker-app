import "react-native-get-random-values";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { seedDefaultItemsIfEmpty } from "./src/storage/storage";
import { MaterialIcons } from "@expo/vector-icons";

// --- Import Screens (you will create these next) ---
import ItemsDBScreen from "./src/screens/ItemsDBScreen";
import AddItemScreen from "./src/screens/AddItemScreen";
import ShoppingListScreen from "./src/screens/ShoppingListScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  // Seed default items when app starts
  useEffect(() => {
    seedDefaultItemsIfEmpty();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="ShoppingList"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2196F3",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >

        <Stack.Screen 
          name="ShoppingList" 
          component={ShoppingListScreen} 
          options={{ 
            title: "Shopping List",
            headerLeft: () => (
              <MaterialIcons name="shopping-cart" size={24} color="#fff" style={{ marginRight: 10 }} />
            ),
          }}
        />

        <Stack.Screen 
          name="ItemsDB" 
          component={ItemsDBScreen} 
          options={{ 
            title: "Items Database",
            headerLeft: () => null,
          }}
        />

        <Stack.Screen 
          name="AddItem" 
          component={AddItemScreen} 
          options={{ 
            title: "Add New Item",
            headerLeft: () => null,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
