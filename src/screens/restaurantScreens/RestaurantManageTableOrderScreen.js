import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import CustomHeader from '../../components/helperComponents/CustomHeader';
import { PageContainer, PageBody } from "../../components/helperComponents/PageElements";

const RestaurantManageOrderScreen = () => {
  // Get tableId from navigation params (if provided)
  const route = useRoute();
  const { tableId: routeTableId } = route.params || {};

  // Local state for selected table, available tables, order item options, and current order items.
  const [selectedTableId, setSelectedTableId] = useState(routeTableId || null);
  const [availableTables, setAvailableTables] = useState([]);
  const [orderItemOptions, setOrderItemOptions] = useState([]);
  const [currentOrderItems, setCurrentOrderItems] = useState([]);


  // Add an order item to the current order list (initial quantity set to 1)
  const handleAddOrderItem = (orderItemOption) => {
    const existingItem = currentOrderItems.find(item => item.id === orderItemOption.id);
    if (existingItem) {
      // Increment quantity if already added
      setCurrentOrderItems(currentOrderItems.map(item => 
        item.id === orderItemOption.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCurrentOrderItems([...currentOrderItems, { ...orderItemOption, quantity: 1 }]);
    }
  };

  // For demonstration, tapping an order item in the current list increments its quantity.
  const handleEditOrderItem = (orderItem) => {
    setCurrentOrderItems(currentOrderItems.map(item => 
      item.id === orderItem.id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  return (
    <PageContainer>
      <CustomHeader
        title={"Back"}
      />
      <PageBody>
        <Text style={styles.header}>
          Manage Orders for Table {selectedTableId ? selectedTableId : '(select a table below)'}
        </Text>

        {/* If no tableId was provided, render a dropdown for table selection if tables exist */}
        {!selectedTableId && (
          availableTables.length > 0 ? (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Select a table:</Text>
              <Picker
                selectedValue={selectedTableId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedTableId(itemValue)}
              >
                <Picker.Item label="-- Choose a table --" value={null} />
                {availableTables.map((table) => (
                  <Picker.Item
                    key={table.id}
                    label={`Table ${table.table_number}`}
                    value={table.id}
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <Text style={styles.emptyText}>No available tables found.</Text>
          )
        )}

        <Text style={styles.subHeader}>Order Item Options</Text>
        <FlatList
          data={orderItemOptions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.optionItem} 
              onPress={() => handleAddOrderItem(item)}
            >
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.subHeader}>Current Order Items</Text>
        {currentOrderItems.length === 0 ? (
          <Text style={styles.emptyText}>No items added yet.</Text>
        ) : (
          <FlatList
            data={currentOrderItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.orderItem} 
                onPress={() => handleEditOrderItem(item)}
              >
                <Text style={styles.orderText}>
                  {item.name} (Qty: {item.quantity})
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </PageBody>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8
  },
  optionItem: {
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 4,
    marginBottom: 8
  },
  optionText: {
    fontSize: 16
  },
  orderItem: {
    padding: 12,
    backgroundColor: '#e0ffe0',
    borderRadius: 4,
    marginBottom: 8
  },
  orderText: {
    fontSize: 16
  },
  emptyText: {
    fontSize: 16,
    color: '#888'
  }
});

export default RestaurantManageOrderScreen;