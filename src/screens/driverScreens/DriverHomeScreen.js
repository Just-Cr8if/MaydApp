import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,
  FlatList, SafeAreaView, Alert, Linking, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';

import ActionButton from '../../components/buttons/ActionButton';
import { baseStyles, screenWidth } from '../../styles/baseStyles';

const DriverHomeScreen = ({ navigation }) => {
  const { driverInfo, fetchBatchedOrders, createDriverBatchedOrder,
    fetchDriverBatchedOrder, initializePushNotifications
   } = useAuth();
  const [ordersData, setOrdersData] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  useEffect(() => {
    if (driverInfo && !driverInfo.expoPushToken) {
      initializePushNotifications();
    }
  }, [driverInfo]);

  console.log(ordersData)

  useEffect(() => {
    const getOrders = async () => {
      try {
        // Step 1: Check for active orders
        if (driverInfo?.user_id) {
          const activeOrder = await fetchDriverBatchedOrder(driverInfo.user_id);
          if (activeOrder) {
            setActiveOrder(activeOrder); // Assuming `setActiveOrder` is a state setter
            return;
          }
        }
  
        // Step 2: Fetch batched orders if no active orders
        if (driverInfo?.networks?.length > 0) {
          const fetchedBatchedOrders = await fetchBatchedOrders(driverInfo.networks);
          setOrdersData(fetchedBatchedOrders);
        } else {
          console.log('Nothing to see');
        }
      } catch (error) {
        console.error('Error initializing orders:', error);
      }
    };
  
    getOrders();
  }, [driverInfo]);  

  const parseLocation = (locationString) => {
    // Extract longitude and latitude from the SRID string
    const match = locationString.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
    if (match) {
      return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) };
    }
    return null;
  };
  
  const handlePhonePress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      Alert.alert('Error', 'Unable to make a phone call', [{ text: 'OK' }])
    );
  };
  
  const handleAddressPress = (location) => {
    const coords = parseLocation(location);
    if (coords) {
      const { latitude, longitude } = coords;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      Linking.openURL(url).catch((err) =>
        Alert.alert('Error', 'Unable to open Google Maps', [{ text: 'OK' }])
      );
    } else {
      Alert.alert('Error', 'Invalid location data', [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white'}}>
      {activeOrder ?
       // Active Order Screen
       <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.pageHeader}>Active Orders <Text style={{ fontSize: 18 }}>({activeOrder.num_orders})</Text></Text>
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.activeOrderInformation}>
            Collect & Depart By: <Text style={styles.activeOrderImportant}>{activeOrder.formatted_scheduled_departure_time}</Text>
          </Text>
          <View style={styles.row}>
            <Text style={styles.routeInfo}>{activeOrder.distance} Miles</Text>
            <Text style={styles.routeInfo}>EST: {activeOrder.duration} Minutes</Text>
          </View>
          
          <Text>{activeOrder.route_steps}</Text>
          <View style={styles.horizontalLine}></View>
          <FlatList
            data={activeOrder.orders}
            keyExtractor={(customerOrder) => customerOrder.id.toString()}
            renderItem={({ item: customerOrder }) => (
              <View style={styles.customerOrderContainer}>
                <Text style={styles.customerOrderTextBold}>#{customerOrder.id}</Text>
                <Text style={styles.customerOrderTextBold}>{customerOrder.venue_name}</Text>
                <Text style={styles.customerOrderTextBold}>Order Items</Text>
                {customerOrder.order_items.map((item, index) => (
                    <View key={index}>
                        <Text style={styles.customerOrderText}>
                            - {item.quantity} x {item.menu_item_name} - ${item.line_total}
                        </Text>
                    </View>
                ))}

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.customerOrderTextBold}>{customerOrder.consumer_name}</Text>
                  <TouchableOpacity onPress={() => handlePhonePress(customerOrder.consumer_phone)}>
                    <Image
                      source={require('../../images/phone.png')}
                      style={{ width: 24, height: 24, marginLeft: 25 }}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => handleAddressPress(customerOrder.delivery_details.location)}
                  style={styles.customerOrderAddressContainer}
                >
                  <Text style={[styles.customerOrderText, styles.highlightedText]}>
                    {customerOrder.delivery_details.address}
                  </Text>
                  <Text style={[styles.customerOrderText, styles.highlightedText]}>
                    {customerOrder.delivery_details.city}, {customerOrder.delivery_details.zip_code}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.customerOrderTextBold}>Delivery/Parking Instructions</Text>
                <Text style={styles.customerOrderText}>{customerOrder.delivery_details.driver_instructions}</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Camera', { driverId: driverInfo?.user_id, orderIds: [customerOrder.id] })}
                >
                  <Image
                    source={require('../../images/camera.png')}
                    style={{ width: 30, height: 24, marginTop: 10, marginLeft: 10 }}
                  />
                </TouchableOpacity>
                
              </View>
            )}
          />
        </View>
      </View>
      :
      <View style={styles.container}>
      <Text style={styles.pageHeader}>Open Orders</Text>
      <FlatList
        data={ordersData}
        keyExtractor={(hub) => hub.hub_id.toString()}
        renderItem={({ item: hub }) => (
          <View style={styles.hubContainer}>
            <Text style={styles.hubTitle}>Hub: {hub.hub_name}</Text>
            <FlatList
              data={hub.orders} // Iterates over the orders array inside the hub
              keyExtractor={(order) => order.id.toString()}
              renderItem={({ item: order }) => (
                <View style={[styles.orderContainer, baseStyles.screenWidth]}>
                  <View>
                    <Text style={styles.orderInformation}>
                      {order.num_orders} {order.num_orders === 1 ? "Order" : "Orders"}
                    </Text>
                    <Text style={styles.orderInformation}>Collect Orders & Depart By</Text>
                    <Text style={styles.important}>{order.formatted_scheduled_departure_time}</Text>
                  </View>
                  <View style={styles.actionButtonContainer}>
                    <ActionButton
                      title="Details"
                      onPress={() => navigation.navigate('OrderDetails', { order })}
                      textColor="#00A6FF"
                    />
                    <ActionButton
                      title="Accept"
                      onPress={async () => {
                        try {
                          const response = await createDriverBatchedOrder(
                            driverInfo?.user_id, // Driver ID
                            order.id, // Batched order ID
                            hub.hub_id, // Network hub ID
                            "accepted" // Status
                          );
                          Alert.alert("Success", "Order Accepted!", [{ text: "OK" }]);
                          setActiveOrder(order);
                        } catch (error) {
                          Alert.alert("Error", error.message, [{ text: "OK" }]);
                        }
                      }}
                      textColor="#1D9B00"
                    />
                  </View>
                </View>
              )}
            />
          </View>
        )}
      />
      </View>
      }
    </SafeAreaView>
  );
};

export default DriverHomeScreen;

const lightGrey = "#F1EFEF"

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 280
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  pageHeader: {
    fontSize: 22,
    fontWeight: '600'
  },
  routeInfo: {
    marginRight: 10,
    fontSize: 15
  },
  hubContainer: {
    marginBottom: 30
  },
  orderContainer: {
    justifyContent: 'space-between'
  },
  hubTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  orderInformation: {
    fontSize: 16,
    fontWeight: '500'
  },
  important: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600'
  },
  actionButtonContainer: { 
    flexDirection: 'row', 
    alignSelf: 'flex-end', 
    justifyContent: 'space-around', 
    width: '55%',
    marginRight: 10
  },
  activeOrderInformation: {
    fontSize: 18,
    fontWeight: '600'
  },
  activeOrderImportant: {
    color: 'red',
    fontSize: 18,
    fontWeight: '600'
  },
  horizontalLine: {
    height: .5,
    backgroundColor: 'lightgrey',
    marginTop: 10,
  },
  customerOrderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: 10,
    paddingBottom: 20
  },

  customerOrderAddressContainer: {
    backgroundColor: lightGrey,
    marginVertical: 5,
    paddingVertical: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.65,
    elevation: 2,
  },
  customerOrderText: {
    fontSize: 17,
    marginLeft: 10
  },
  customerOrderTextBold: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 3
  }
});