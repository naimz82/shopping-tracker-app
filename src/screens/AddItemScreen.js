import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { addItem } from "../storage/storage";

export default function AddItemScreen({ navigation }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Item name is required";
    }
    
    if (!unit.trim()) {
      newErrors.unit = "Unit is required";
    }
    
    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      newErrors.price = "Price must be a valid number greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      Alert.alert("Validation Error", "Please fill in all fields correctly");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      unit: unit.trim(),
      pricePerUnit: parseFloat(price),
      createdAt: new Date().toISOString(),
    };

    await addItem(newItem);
    Alert.alert("Success", "Item added successfully!", [
      { text: "OK", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <MaterialIcons name="add-shopping-cart" size={60} color="#2196F3" />
        <Text style={styles.headerText}>Add New Item to Database</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>
          <MaterialIcons name="label" size={16} color="#666" /> Item Name
        </Text>
        <View style={[styles.inputContainer, errors.name && styles.inputError]}>
          <MaterialIcons name="shopping-basket" size={20} color="#666" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors({...errors, name: null});
            }}
            placeholder="e.g., Eggs, Milk, Bread"
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <Text style={styles.label}>
          <MaterialIcons name="straighten" size={16} color="#666" /> Unit
        </Text>
        <View style={[styles.inputContainer, errors.unit && styles.inputError]}>
          <MaterialIcons name="inventory" size={20} color="#666" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            value={unit} 
            onChangeText={(text) => {
              setUnit(text);
              if (errors.unit) setErrors({...errors, unit: null});
            }}
            placeholder="e.g., kg, pack, pcs, liter"
          />
        </View>
        {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}

        <Text style={styles.label}>
          <MaterialIcons name="attach-money" size={16} color="#666" /> Price per Unit (RM)
        </Text>
        <View style={[styles.inputContainer, errors.price && styles.inputError]}>
          <MaterialIcons name="payments" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={price}
            keyboardType="decimal-pad"
            onChangeText={(text) => {
              setPrice(text);
              if (errors.price) setErrors({...errors, price: null});
            }}
            placeholder="0.00"
          />
        </View>
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <MaterialIcons name="save" size={24} color="#fff" />
          <Text style={styles.buttonText}>Save Item</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="cancel" size={24} color="#666" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  contentContainer: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { 
    marginTop: 16,
    marginBottom: 8, 
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputError: {
    borderColor: "#f44336",
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#f44336",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: "row",
    marginTop: 24,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});
