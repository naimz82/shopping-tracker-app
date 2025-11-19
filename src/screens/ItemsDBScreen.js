import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { getItems, deleteItem } from "../storage/storage";

export default function ItemsDBScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadItems);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }, []);

  const handleDeleteItem = (item) => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteItem(item.id);
            loadItems();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="inventory-2" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No items in database</Text>
          <Text style={styles.emptySubtext}>Add your first item to get started</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="shopping-basket" size={24} color="#4CAF50" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.detailRow}>
                  <MaterialIcons name="label" size={12} color="#666" />
                  <Text style={styles.unit}>{item.unit}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialIcons name="attach-money" size={14} color="#666" />
                  <Text style={styles.price}>RM {item.pricePerUnit.toFixed(2)}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item)}
              >
                <MaterialIcons name="delete" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddItem")}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
        <Text style={styles.addText}>Add New Item</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: { 
    flex: 1, 
    padding: 16,
    backgroundColor: "#f5f5f5"
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  name: { 
    fontSize: 15, 
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  unit: { 
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  price: { 
    marginLeft: 4,
    fontWeight: "600",
    color: "#4CAF50",
    fontSize: 15,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
