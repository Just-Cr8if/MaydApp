import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const OrderDetailsScreen = ({ route }) => {
  const { order } = route.params; // Get the selected order from navigation

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Batched Order Details</Text>
      <Text>Batched Order ID: {order.id}</Text>
      <Text>Status: {order.status}</Text>
      <Text>Total Miles: {order.total_miles}</Text>
      <Text># Orders: {order.orders.length}</Text>
      <FlatList
        data={order.orders}
        keyExtractor={(subOrder) => subOrder.id.toString()}
        renderItem={({ item: subOrder }) => (
          <View style={styles.subOrderContainer}>
            <Text>Order ID: {subOrder.id}</Text>
            <Text>Consumer: {subOrder.consumer_name}</Text>
            <Text>Phone: {subOrder.consumer_phone}</Text>
            <Text>Delivery Details:</Text>
            <Text>  - Address: {subOrder.delivery_details.address}</Text>
            <Text>  - City: {subOrder.delivery_details.city}</Text>
            <Text>  - Instructions: {subOrder.delivery_details.driver_instructions}</Text>
            <Text>Order Items:</Text>
            {subOrder.order_items.map((item, index) => (
                <View key={index}>
                    <Text style={styles.itemText}>
                        - {item.quantity} x {item.menu_item_name} - ${item.line_total}
                    </Text>
                </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subOrderContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default OrderDetailsScreen;