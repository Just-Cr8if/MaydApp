import React, { useContext, useState, useEffect, useMemo } from "react";
import { View, Text, Button, Pressable, TouchableOpacity, Animated,
    StyleSheet, FlatList, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions } from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import SwipeableItem from 'react-native-swipeable-item';


const RestaurantHomeScreen = ({ navigation }) => {
    const { venue, restaurantOrders } = useRestaurantAuth();
    const [orderType, setOrderType] = useState('All');
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Track selected order
    const [kitchenView, setKitchenView] = useState(false); // Track Kitchen View toggle
    const { width } = Dimensions.get('window');
    const isLargeScreen = width >= 768;

    // Memoized counts for each order type
    const orderCounts = useMemo(() => {
        const counts = {
            New: restaurantOrders.filter((order) => order.status === 'submitted').length,
            Open: restaurantOrders.filter((order) => order.status === 'accepted').length,
            Closed: restaurantOrders.filter((order) => order.status === 'closed').length,
        };
        return counts;
    }, [restaurantOrders]);

    // Filter orders based on orderType
    const filteredOrders = useMemo(() => {
        if (orderType === 'New') {
            return restaurantOrders.filter((order) => order.status === 'submitted');
        } else if (orderType === 'Open') {
            return restaurantOrders.filter((order) => order.status === 'accepted');
        } else if (orderType === 'Closed') {
            return restaurantOrders.filter((order) => order.status === 'closed');
        }
        return restaurantOrders; // Show all orders for 'All'
    }, [orderType, restaurantOrders]);

    const handleAccept = (orderId) => {
        console.log('accepted', orderId);
        // Update order status or make an API call here
      };
      
      const handleDecline = (orderId) => {
        console.log('declined', orderId);
        // Update order status or make an API call here
      };
      

      const LeftUnderlay = ({ onPress }) => (
          <TouchableOpacity onPress={onPress}
            style={[styles.underlayAction, styles.alignLeft, { backgroundColor: 'green' }]}
          >
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>
      );
      
      const RightUnderlay = ({ onPress }) => (
          <TouchableOpacity onPress={onPress}
          style={[styles.underlayAction, styles.alignRight, { backgroundColor: 'red' }]}
          >
            <Text style={styles.actionText}>Decline</Text>
          </TouchableOpacity>
      );
      
            

      const renderOrder = ({ item }) => {
        const isSelected = selectedOrderId === item.id;
      
        return (
          <SwipeableItem
            key={item.id}
            item={item}
            overSwipe={20}
            snapPointsLeft={[100]}
            snapPointsRight={[100]}
            renderUnderlayLeft={() => (
              <LeftUnderlay onPress={() => handleAccept(item.id)} />
            )}
            renderUnderlayRight={() => (
              <RightUnderlay onPress={() => handleDecline(item.id)} />
            )}
          >
            <Pressable
              style={styles.orderContainer}
              onPress={() =>
                !kitchenView && setSelectedOrderId(isSelected ? null : item.id)
              }
            >
              {/* Your existing order item code */}
              <Text style={styles.customerName}>Customer: {item.customer_name}</Text>
              <Text style={styles.submittedTime}>
                Time:{' '}
                {new Date(item.submitted_timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              {(kitchenView || isSelected) && (
                <View style={styles.orderDetails}>
                  <Text style={styles.orderStatus}>Status: {item.status}</Text>
                  {item.order_items?.map((orderItem) => (
                    <View key={orderItem.id} style={styles.orderItem}>
                      <Image
                        source={{ uri: orderItem.menu_item.picture }}
                        style={styles.orderImage}
                      />
                      <View>
                        <Text style={styles.itemName}>
                          {orderItem.menu_item.name}
                        </Text>
                        <Text style={styles.itemPrice}>
                          Price: ${orderItem.menu_item.price}
                        </Text>
                        <Text style={styles.itemDescription}>
                          {orderItem.menu_item.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          </SwipeableItem>
        );
      };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.venueName}>{venue?.venue_name}</Text>
                <View style={styles.orderHeaderContainer}>
                    <TouchableOpacity
                        style={styles.orderHeaderButton}
                        onPress={() => setOrderType('New')}
                    >
                        <Text style={[styles.orderButtonText, { color: 'green' }]}>New Orders</Text>
                        <Text style={styles.numOrderText}>{orderCounts.New}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.orderHeaderButton}
                        onPress={() => setOrderType('Open')}
                    >
                        <Text style={[styles.orderButtonText, { color: 'blue' }]}>Open Orders</Text>
                        <Text style={styles.numOrderText}>{orderCounts.Open}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.orderHeaderButton}
                        onPress={() => setOrderType('Closed')}
                    >
                        <Text style={[styles.orderButtonText, { color: 'red' }]}>Closed Orders</Text>
                        <Text style={styles.numOrderText}>{orderCounts.Closed}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.kitchenViewButton}
                    onPress={() => setKitchenView((prev) => !prev)}
                >
                    <Text style={styles.kitchenViewText}>
                        {kitchenView ? 'Exit Kitchen View' : 'Kitchen View'}
                    </Text>
                </TouchableOpacity>

                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderOrder}
                    contentContainerStyle={styles.listContainer}
                />

            </SafeAreaView>
        </View>
    );
};

export default RestaurantHomeScreen;

const mainColor = "#00A6FF"
const mainColorO = "rgba(0, 166, 255, 0.5)";
const mint = "#3EB489";
const green = "green";
const orange = "orange";
const red = "red";
const darkColor = "#202124";
const charcoal = "#36454F";
const lightgrey = "#E5E4E2";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 75,
        backgroundColor: 'white'
    },
    venueName: {
        fontSize: 15,
        fontWeight: '600',
        alignSelf: 'flex-start',
    },
    orderHeaderContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        marginVertical: 20
    },
    orderHeaderButton: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#fff',

        // Shadow for iOS
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,

        // Shadow for Android
        elevation: 3,
    },
    orderButtonText: {
        fontSize: 16,
        fontWeight: '600'
    },
    numOrderText: {
        fontSize: 25,
        fontWeight: '600',
        marginTop: 15
    },
    kitchenViewButton: {
        alignSelf: 'flex-end',
        backgroundColor: mainColor,
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderRadius: 8,
        alignItems: 'center',
    },
    kitchenViewText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 5,
    },
    orderContainer: {
        backgroundColor: '#fff',
        minHeight: 80,
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    underlayAction: {
        justifyContent: 'center',
        paddingHorizontal: 20,
        minHeight: 80,
        borderRadius: 8,
        marginVertical: 8,
        
      },
      alignLeft: {
        alignItems: 'flex-end',
      },
      alignRight: {
        alignItems: 'flex-start',
      },
      actionText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
    customerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    submittedTime: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    orderDetails: {
        marginTop: 8,
    },
    orderStatus: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    orderItem: {
        flexDirection: 'row',
        marginTop: 16,
    },
    orderImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 8,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 12,
        color: '#666',
    },
    itemDescription: {
        fontSize: 12,
        color: '#666',
        width: 300
    },
});