import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import { PageContainer, PageBody } from '../../components/helperComponents/PageElements';
import CustomHeader from '../../components/helperComponents/CustomHeader';
import { Colors, Spacing } from '../../styles/Constants';
import { useRestaurantAuth } from '../../context/RestaurantContext';

const RestaurantManageOrderScreen = () => {
  // Get tableId from navigation params (if provided)
  const route = useRoute();
  const { tableId: routeTableId } = route.params || {};

  const { getTableOrders, getTables, venue, lastSelectedTableId , setLastSelectedTableId } = useRestaurantAuth();

  // Local state for selected table, available tables, order item options, current order items, and fetched table orders.
  const [selectedTableId, setSelectedTableId] = useState(lastSelectedTableId || routeTableId || null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderItemOptions, setOrderItemOptions] = useState([]);
  const [currentOrderItems, setCurrentOrderItems] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available tables if no tableId was passed in via route params
  useEffect(() => {
    if (!routeTableId) {
      const fetchTables = async () => {
        try {
          // Replace with your actual API endpoint for fetching tables.
          const result = await getTables(venue.id);
          setTables(result);
          if (!lastSelectedTableId) {
            setSelectedTableId(result[0].id);
            setLastSelectedTableId(result[0].id);
          }
        } catch (error) {
          console.error('Error fetching available tables:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchTables();
    }
  }, [routeTableId]);

  // Whenever selectedTableId or tables change, update selectedTable using find.
  useEffect(() => {
    console.log('tables', tables);
    console.log('selectedTableId', selectedTableId);
    if (tables.length > 0 && selectedTableId) {
      const tableObj = tables.find((table) => table.id === Number(selectedTableId));
      console.log('tableObj', tableObj);
      if (tableObj) {
        setSelectedTable(tableObj);
      }
    } else {
      console.log("BLANK")
    }
  }, [selectedTableId, tables]);

  console.log('selectedTable', selectedTable);

  // Fetch table orders whenever the selected table changes
  useEffect(() => {
    const fetchTableOrders = async () => {
      if (selectedTableId) {
        const result = await getTableOrders(selectedTableId);
        setTableOrders(result);
      }
    };
    fetchTableOrders();
  }, [selectedTableId]);

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

  // Render an individual order card based on the structure from your sample.
  const renderOrderCard = ({ item }) => {
    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.orderCustomer}>Customer: {item.customer_name}</Text>
        <Text style={styles.orderStatus}>Status: {item.status}</Text>
        <Text style={styles.orderSubmitted}>
          Submitted: {new Date(item.submitted_timestamp).toLocaleString()}
        </Text>
        {item.consumer && (
          <Text style={styles.orderConsumer}>By: {item.consumer.username}</Text>
        )}
        <Text style={styles.orderType}>Type: {item.order_type}</Text>
        <Text style={styles.orderPayment}>Payment: {item.payment_method}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <PageContainer>
        <CustomHeader title="Back" />
        <PageBody>
          <Text>Loading...</Text>
        </PageBody>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <CustomHeader title="Back" />
      <PageBody>
        <Text style={styles.header}>
          Manage Orders for Table {selectedTable?.table_number}
        </Text>

        {/* Always show the dropdown when tables are fetched */}
        {tables.length > 0 && (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Select a table:</Text>
            <Picker
              selectedValue={selectedTableId || tables[0]?.id}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setSelectedTableId(itemValue)
                setLastSelectedTableId(itemValue)
              }}
            >
              {tables.map((table) => (
                <Picker.Item
                  key={table.id}
                  label={`Table ${table.table_number}`}
                  value={table.id}
                />
              ))}
            </Picker>
          </View>
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

        <Text style={styles.subHeader}>Recent Orders (Last 72 Hours)</Text>
        {tableOrders.length === 0 ? (
          <Text style={styles.emptyText}>No recent orders found for this table.</Text>
        ) : (
          <FlatList
            data={tableOrders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderOrderCard}
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
    color: Colors.mainFontColor,
    marginBottom: Spacing.medium,
  },
  pickerContainer: {
    marginBottom: Spacing.medium,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.mainFontColor,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.large,
    marginBottom: Spacing.small,
    color: Colors.mainFontColor,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.disabledGrey,
    marginBottom: Spacing.medium,
  },
  optionItem: {
    padding: Spacing.small,
    backgroundColor: Colors.lightgrey,
    borderRadius: 4,
    marginBottom: Spacing.small,
  },
  optionText: {
    fontSize: 16,
    color: Colors.mainFontColor,
  },
  orderItem: {
    padding: Spacing.small,
    backgroundColor: Colors.mintColor,
    borderRadius: 4,
    marginBottom: Spacing.small,
  },
  orderText: {
    fontSize: 16,
    color: Colors.white,
  },
  orderCard: {
    padding: Spacing.medium,
    backgroundColor: Colors.lightModeLightGrey,
    borderRadius: 8,
    marginBottom: Spacing.medium,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.mainFontColor,
  },
  orderCustomer: {
    fontSize: 16,
    color: Colors.mainFontColor,
  },
  orderStatus: {
    fontSize: 16,
    color: Colors.primary,
  },
  orderSubmitted: {
    fontSize: 14,
    color: Colors.disabledGrey,
  },
  orderConsumer: {
    fontSize: 14,
    color: Colors.mainFontColor,
  },
  orderType: {
    fontSize: 14,
    color: Colors.mainFontColor,
  },
  orderPayment: {
    fontSize: 14,
    color: Colors.mainFontColor,
  },
});

export default RestaurantManageOrderScreen;
