import AsyncStorage from "@react-native-async-storage/async-storage";

// Keys
const ITEMS_KEY = "@items_db";
const LISTS_KEY = "@shopping_lists";

// -------------------------
// Helpers
// -------------------------
export const getItems = async () => {
  try {
    const json = await AsyncStorage.getItem(ITEMS_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error reading items:", e);
    return [];
  }
};

export const saveItems = async (items) => {
  try {
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving items:", e);
  }
};

export const addItem = async (item) => {
  try {
    const items = await getItems();
    const newItems = [...items, item];
    await saveItems(newItems);
    return newItems;
  } catch (e) {
    console.error("Error adding item:", e);
    return [];
  }
};

export const updateItem = async (id, updatedItem) => {
  try {
    const items = await getItems();
    const newItems = items.map((item) =>
      item.id === id ? { ...item, ...updatedItem, id } : item
    );
    await saveItems(newItems);
    return newItems;
  } catch (e) {
    console.error("Error updating item:", e);
    return [];
  }
};

export const deleteItem = async (id) => {
  try {
    const items = await getItems();
    const newItems = items.filter((item) => item.id !== id);
    await saveItems(newItems);
    return newItems;
  } catch (e) {
    console.error("Error deleting item:", e);
    return [];
  }
};

// -------------------------
// Default preset items
// -------------------------
const defaultItems = [
  { id: "1", name: "Eggs", unit: "tray", pricePerUnit: 6.5, createdAt: new Date().toISOString() },
  { id: "2", name: "Bread", unit: "loaf", pricePerUnit: 4.5, createdAt: new Date().toISOString() },
  { id: "3", name: "Milk", unit: "1L box", pricePerUnit: 11.0, createdAt: new Date().toISOString() },
  { id: "4", name: "Rice", unit: "5kg", pricePerUnit: 20.0, createdAt: new Date().toISOString() },
];

// Flags to track seeding status
let isSeeding = false;
let seedPromise = null;

// Seed default items the first time app runs
export const seedDefaultItemsIfEmpty = async () => {
  // If already seeding, wait for that operation to complete
  if (isSeeding && seedPromise) {
    return seedPromise;
  }

  try {
    isSeeding = true;
    
    // Create the promise that we'll return
    seedPromise = (async () => {
      const items = await getItems();
      if (items.length === 0) {
        await saveItems(defaultItems);
        return defaultItems;
      }
      return items;
    })();

    const result = await seedPromise;
    return result;
  } finally {
    isSeeding = false;
    seedPromise = null;
  }
};

// -------------------------
// Shopping Lists
// -------------------------
export const getLists = async () => {
  try {
    const json = await AsyncStorage.getItem(LISTS_KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error reading shopping lists:", e);
    return [];
  }
};

export const saveLists = async (lists) => {
  try {
    await AsyncStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  } catch (e) {
    console.error("Error saving shopping lists:", e);
  }
};

export const addList = async (list) => {
  try {
    const lists = await getLists();
    const newLists = [...lists, list];
    await saveLists(newLists);
    return newLists;
  } catch (e) {
    console.error("Error adding shopping list:", e);
    return [];
  }
};

export const updateList = async (id, updatedList) => {
  try {
    const lists = await getLists();
    const newLists = lists.map((list) =>
      list.id === id ? { ...list, ...updatedList, id } : list
    );
    await saveLists(newLists);
    return newLists;
  } catch (e) {
    console.error("Error updating shopping list:", e);
    return [];
  }
};

export const deleteList = async (id) => {
  try {
    const lists = await getLists();
    const newLists = lists.filter((list) => list.id !== id);
    await saveLists(newLists);
    return newLists;
  } catch (e) {
    console.error("Error deleting shopping list:", e);
    return [];
  }
};
