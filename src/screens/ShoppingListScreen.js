import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { getItems, addItem } from "../storage/storage";

export default function ShoppingListScreen() {
  const [items, setItems] = useState([]);
  const [entries, setEntries] = useState([]);
  const [customName, setCustomName] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data);
  };

  const addFromDB = (item) => {
    const newEntry = {
      id: Date.now().toString(),
      name: item.name,
      unit: item.unit,
      price: item.pricePerUnit,
      quantity: 1,
      total: item.pricePerUnit,
    };

    setEntries((prev) => [...prev, newEntry]);
  };

  const addCustomItem = async () => {
    if (!customName || !customUnit || !customPrice) return;

    const price = parseFloat(customPrice);

    // Create new item for database
    const newItem = {
      id: Date.now().toString(),
      name: customName.trim(),
      unit: customUnit.trim(),
      pricePerUnit: price,
      createdAt: new Date().toISOString(),
    };

    // Add to items database
    await addItem(newItem);
    
    // Reload items to show in the database list
    await loadItems();

    // Create entry for shopping list
    const newEntry = {
      id: Date.now().toString() + "_entry",
      name: customName,
      unit: customUnit,
      price,
      quantity: 1,
      total: price,
    };

    setEntries((prev) => [...prev, newEntry]);
    setCustomName("");
    setCustomUnit("");
    setCustomPrice("");
  };

  const changeQuantity = (id, newQty) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, quantity: newQty, total: newQty * e.price }
          : e
      )
    );
  };

  const removeEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const clearList = () => {
    Alert.alert(
      "Clear List",
      "Are you sure you want to clear the entire shopping list?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => setEntries([]),
        },
      ]
    );
  };

  const totalAmount = entries.reduce((sum, e) => sum + e.total, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="inventory-2" size={24} color="#2196F3" />
          <Text style={styles.sectionTitle}>Add From Item Database</Text>
        </View>
        
        {items.length === 0 ? (
          <View style={styles.emptyDB}>
            <Text style={styles.emptyDBText}>No items in database</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.itemCard} onPress={() => addFromDB(item)}>
                <View style={styles.itemCardIcon}>
                  <MaterialIcons name="add-shopping-cart" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardUnit}>{item.unit}</Text>
                <Text style={styles.cardPrice}>RM {item.pricePerUnit.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="edit" size={24} color="#FF9800" />
          <Text style={styles.sectionTitle}>Add Custom Item</Text>
        </View>
        <View style={styles.customForm}>
          <View style={styles.inputRow}>
            <MaterialIcons name="label" size={20} color="#666" style={styles.inputIconStyle} />
            <TextInput
              style={styles.input}
              placeholder="Item name"
              value={customName}
              onChangeText={setCustomName}
            />
          </View>
          <View style={styles.inputRow}>
            <MaterialIcons name="straighten" size={20} color="#666" style={styles.inputIconStyle} />
            <TextInput
              style={styles.input}
              placeholder="Unit (kg, pack, etc.)"
              value={customUnit}
              onChangeText={setCustomUnit}
            />
          </View>
          <View style={styles.inputRow}>
            <MaterialIcons name="attach-money" size={20} color="#666" style={styles.inputIconStyle} />
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="decimal-pad"
              value={customPrice}
              onChangeText={setCustomPrice}
            />
          </View>

          <TouchableOpacity style={styles.addCustomButton} onPress={addCustomItem}>
            <MaterialIcons name="add-circle" size={24} color="#fff" />
            <Text style={styles.addCustomText}>Add Custom Item</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderWithAction}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="shopping-cart" size={24} color="#4CAF50" />
            <Text style={styles.sectionTitle}>Shopping List</Text>
          </View>
          {entries.length > 0 && (
            <TouchableOpacity onPress={clearList}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {entries.length === 0 ? (
          <View style={styles.emptyList}>
            <MaterialIcons name="shopping-cart" size={60} color="#ccc" />
            <Text style={styles.emptyListText}>Your shopping list is empty</Text>
            <Text style={styles.emptyListSubtext}>Add items to get started</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            scrollEnabled={false}
            keyExtractor={(e) => e.id}
            renderItem={({ item }) => (
              <View style={styles.entry}>
                <View style={styles.entryLeft}>
                  <Text style={styles.entryName}>{item.name}</Text>
                  <Text style={styles.entryDetails}>
                    {item.quantity} × RM {item.price.toFixed(2)} / {item.unit}
                  </Text>
                </View>

                <View style={styles.entryRight}>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity 
                      style={styles.qtyButton}
                      onPress={() => changeQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <MaterialIcons name="remove-circle-outline" size={28} color="#f44336" />
                    </TouchableOpacity>

                    <Text style={styles.qtyNumber}>{item.quantity}</Text>

                    <TouchableOpacity 
                      style={styles.qtyButton}
                      onPress={() => changeQuantity(item.id, item.quantity + 1)}
                    >
                      <MaterialIcons name="add-circle-outline" size={28} color="#4CAF50" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.entryBottom}>
                    <Text style={styles.entryTotal}>RM {item.total.toFixed(2)}</Text>
                    <TouchableOpacity 
                      style={styles.deleteEntry}
                      onPress={() => removeEntry(item.id)}
                    >
                      <MaterialIcons name="delete" size={20} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {entries.length > 0 && (
        <View style={styles.totalBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Items:</Text>
            <Text style={styles.totalValue}>{entries.length}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Quantity:</Text>
            <Text style={styles.totalValue}>
              {entries.reduce((sum, e) => sum + e.quantity, 0)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalTextLabel}>TOTAL:</Text>
            <Text style={styles.totalText}>RM {totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      )}
      </ScrollView>
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
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionHeaderWithAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: { 
    fontWeight: "bold", 
    fontSize: 18,
    color: "#333",
    marginLeft: 8,
  },
  clearButton: {
    color: "#f44336",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyDB: {
    padding: 20,
    alignItems: "center",
  },
  emptyDBText: {
    color: "#999",
    fontSize: 14,
  },
  itemCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginLeft: 16,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { 
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  cardUnit: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  cardPrice: { 
    marginTop: 4,
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 16,
  },
  customForm: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputIconStyle: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  addCustomButton: {
    flexDirection: "row",
    backgroundColor: "#FF9800",
    padding: 14,
    borderRadius: 8,
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  addCustomText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  emptyList: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryLeft: {
    flex: 1,
  },
  entryName: { 
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  entryDetails: {
    color: "#666",
    fontSize: 13,
  },
  entryRight: {
    alignItems: "flex-end",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  qtyButton: {
    padding: 4,
  },
  qtyNumber: { 
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    minWidth: 30,
    textAlign: "center",
  },
  entryBottom: {
    flexDirection: "row",
    alignItems: "center",
  },
  entryTotal: { 
    fontWeight: "bold",
    fontSize: 18,
    color: "#4CAF50",
    marginRight: 12,
  },
  deleteEntry: {
    padding: 4,
  },
  totalBox: { 
    padding: 20,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  totalTextLabel: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
  },
  totalText: { 
    fontWeight: "bold", 
    fontSize: 24,
    color: "#4CAF50",
  },
});
