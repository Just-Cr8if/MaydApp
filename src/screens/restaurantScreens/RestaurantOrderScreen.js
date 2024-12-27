import React, { useContext, useState, useEffect, useMemo } from "react";
import { View, Text, Button, Pressable, TouchableOpacity, Animated,
    StyleSheet, FlatList, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions, Modal, TextInput
 } from 'react-native';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import SwipeableItem from 'react-native-swipeable-item';
import RNEventSource from "react-native-event-source";
import { MOBYLMENU_API_BASE_URL } from "../../config";


const RestaurantOrderScreen = ({ navigation }) => {
    const { venue, restaurantOrders, setRestaurantOrders, updateAsyncStorageOrders,
        updateOrderStatus
     } = useRestaurantAuth();
    const [orderType, setOrderType] = useState('All');
    const [selectedOrderId, setSelectedOrderId] = useState(null); // Track selected order
    const [kitchenView, setKitchenView] = useState(false); // Track Kitchen View toggle
    const { width } = Dimensions.get('window');
    const isLargeScreen = width >= 768;
    const [isDeclineModalVisible, setDeclineModalVisible] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [declineOrderId, setDeclineOrderId] = useState(null);
    
    useEffect(() => {
        // Initialize the SSE connection
        const eventSource = new RNEventSource(
            `${MOBYLMENU_API_BASE_URL}/sse/?venue_id=${venue?.id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    
        console.log("SSE Connection initialized:", eventSource);
    
        // Log the connection's readyState
        console.log("SSE readyState (initial):", eventSource?.eventSource?.readyState);
    
        // Listen for the 'open' event to confirm the connection
        eventSource.onopen = () => {
            console.log("SSE connection opened");
        };
    
        // Log any progress or state changes
        const logProgress = () => {
            console.log("SSE readyState (progress):", eventSource?.eventSource?.readyState);
        };
    
        // Check for 'message' events
        eventSource.addEventListener("message", (event) => {
            console.log("Raw SSE message received:", event);
            try {
                const newOrder = JSON.parse(event.data);
                console.log("Parsed message data:", newOrder);
    
                // Update the state and async storage
                setRestaurantOrders((prevOrders) => {
                    const updatedOrders = [...prevOrders, newOrder];
                    console.log("Updated restaurant orders:", updatedOrders);
                    updateAsyncStorageOrders(updatedOrders);
                    return updatedOrders;
                });
            } catch (error) {
                console.error("Error parsing SSE message:", error);
            }
        });
    
        // Log errors
        eventSource.onerror = (error) => {
            console.error("SSE Error:", error.message || error);
            logProgress(); // Log readyState after error
        };
    
        // Cleanup on unmount
        return () => {
            console.log("Closing SSE connection");
            eventSource.close();
            logProgress(); // Log readyState after closing
        };
    }, []);
    

    // Memoized counts for each order type
    const orderCounts = useMemo(() => {
        const counts = {
            New: restaurantOrders.filter((order) => order.status === 'submitted').length,
            Open: restaurantOrders.filter((order) => order.status === 'accepted').length,
            Closed: restaurantOrders.filter((order) => ['closed', 'declined'].includes(order.status)).length,
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
            return restaurantOrders.filter((order) => ['closed', 'declined'].includes(order.status));
        }
        return restaurantOrders.filter((order) => order.status === 'submitted');
    }, [orderType, restaurantOrders]);

    const transformOrderType = (item) => {
        if (item.order_type === 'pick_up') {
            return 'Pick Up';
        } else if (item.order_type === 'delivery') {
            return 'Delivery';
        } else if (item.order_type === 'table' && item.table) {
            return `Table #${item.table.table_number}`;
        }
        return item.order_type; // Fallback in case order_type doesn't match
    };
    

    const handleAccept = (orderId) => {
        updateOrderStatus(orderId, 'accepted');
      };
      
    const handleDecline = (orderId) => {
        setDeclineOrderId(orderId)
        setDeclineModalVisible(true);
    };

    const handleClose = (orderId) => {
        updateOrderStatus(orderId, 'closed');
    };

    const confirmDecline = () => {
        // Call the function to update the order
        updateOrderStatus(declineOrderId, 'declined', declineReason);

        // Reset state and close modal
        setDeclineModalVisible(false);
        setDeclineReason('');
        setDeclineOrderId(null);
    };

    const cancelDecline = () => {
        // Close the modal and reset state
        setDeclineModalVisible(false);
        setDeclineReason('');
        setSelectedOrderId(null);
    };

      const LeftUnderlay = ({ onPress }) => (
          <TouchableOpacity onPress={onPress}
            style={[styles.underlayAction, styles.alignLeft, { backgroundColor: green }]}
          >
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>
      );

      const LeftCloseUnderlay = ({ onPress }) => (
        <TouchableOpacity onPress={onPress}
          style={[styles.underlayAction, styles.alignLeft, { backgroundColor: mainColor }]}
        >
          <Text style={styles.actionText}>Close</Text>
        </TouchableOpacity>
    );
      
      const RightUnderlay = ({ onPress }) => (
          <TouchableOpacity onPress={onPress}
          style={[styles.underlayAction, styles.alignRight, { backgroundColor: red }]}
          >
            <Text style={styles.actionText}>Decline</Text>
          </TouchableOpacity>
      );

      const renderEmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders here yet.</Text>
        </View>
        );

      const renderOrder = ({ item }) => {
        const isSelected = selectedOrderId === item.id;
    
        // Conditions for swiping behavior
        const isSwipeDisabled = item.status === 'closed' || item.status === 'declined';
        const isSwipeRestrictedToClose = item.status === 'accepted';
    
        if (isSwipeDisabled) {
            // Render without swiping functionality
            return (
                <Pressable
                    style={styles.orderContainer}
                    onPress={() =>
                        !kitchenView && setSelectedOrderId(isSelected ? null : item.id)
                    }
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.customerName, { marginRight:10 }]}>{transformOrderType(item)}</Text>
                        <Text style={styles.customerName}>{item.customer_name}</Text>
                    </View>
                    <Text style={styles.submittedTime}>
                        Order Placed:{' '}
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
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.itemQuantity}>
                                                {orderItem.quantity} x
                                            </Text>
                                            <Text style={styles.itemName}>
                                                {orderItem.menu_item.name}
                                            </Text>
                                        </View>
                                        <Text style={styles.itemPrice}>
                                            Price: ${orderItem.line_total}
                                        </Text>
                                        <Text style={styles.itemDescription}>
                                            {orderItem.note}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </Pressable>
            );
        }
    
        // Render SwipeableItem for other statuses
        return (
            <SwipeableItem
                key={item.id}
                item={item}
                overSwipe={20}
                snapPointsLeft={isSwipeRestrictedToClose ? [100] : [100]} // Left swipe for "close" when accepted
                snapPointsRight={!isSwipeRestrictedToClose ? [100] : []} // Disable right swipe for "accepted"
                renderUnderlayLeft={
                    isSwipeRestrictedToClose
                        ? () => <LeftCloseUnderlay onPress={() => handleClose(item.id)} />
                        : () => <LeftUnderlay onPress={() => handleAccept(item.id)} />
                }
                renderUnderlayRight={
                    !isSwipeRestrictedToClose
                        ? () => <RightUnderlay onPress={() => handleDecline(item.id)} />
                        : undefined
                }
            >
                <Pressable
                    style={styles.orderContainer}
                    onPress={() =>
                        !kitchenView && setSelectedOrderId(isSelected ? null : item.id)
                    }
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.customerName, { marginRight:10 }]}>{transformOrderType(item)}</Text>
                        <Text style={styles.customerName}>{item.customer_name}</Text>
                    </View>
                    <Text style={styles.submittedTime}>
                        Order Placed:{' '}
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
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.itemQuantity}>
                                                {orderItem.quantity} x
                                            </Text>
                                            <Text style={styles.itemName}>
                                                {orderItem.menu_item.name}
                                            </Text>
                                        </View>
                                        <Text style={styles.itemPrice}>
                                            Price: ${orderItem.menu_item.price}
                                        </Text>
                                        
                                        {orderItem.customizations?.length > 0 && orderItem.customizations?.map((group, groupIndex) => (
                                        <View key={groupIndex} style={styles.customizationGroup}>
                                            <Text style={styles.customizationGroupName}>
                                                {group.group_name}:
                                            </Text>
                                            {group.options?.map((option, optionIndex) => (
                                                <Text key={optionIndex} style={styles.customizationOption}>
                                                    - {option.name} {option.price_modifier > 0 && `(+ $${option.price_modifier})`}
                                                </Text>
                                            ))}
                                        </View>
                                        ))}
                                        <Text style={styles.itemDescription}>
                                            {orderItem.note}
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
            <Modal
                visible={isDeclineModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Are you sure you want to decline?</Text>
                        <Text style={styles.modalSubtitle}>This cannot be undone. Let the customer know why:</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter reason for declining..."
                            value={declineReason}
                            onChangeText={setDeclineReason}
                        />
                        <View style={styles.buttonRow}>
                            <Button title="Cancel" onPress={cancelDecline} />
                            <Button
                                title="Confirm"
                                onPress={confirmDecline}
                                disabled={!declineReason.trim()} // Disable if no reason
                            />
                        </View>
                    </View>
                </View>
            </Modal>
                <Text style={styles.venueName}>Manage Orders</Text>
                <View style={styles.orderHeaderContainer}>
                    <TouchableOpacity
                        style={styles.orderHeaderButton}
                        onPress={() => setOrderType('New')}
                    >
                        <Text style={[styles.orderButtonText, { color: green }]}>New Orders</Text>
                        <Text style={styles.numOrderText}>{orderCounts.New}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.orderHeaderButton}
                        onPress={() => setOrderType('Open')}
                    >
                        <Text style={[styles.orderButtonText, { color: mainColor }]}>Open Orders</Text>
                        <Text style={styles.numOrderText}>{orderCounts.Open}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.orderHeaderButton}
                        onPress={() => setOrderType('Closed')}
                    >
                        <Text style={[styles.orderButtonText, { color: red }]}>Closed Orders</Text>
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
                    ListEmptyComponent={renderEmptyComponent}
                />

            </SafeAreaView>
        </View>
    );
};

export default RestaurantOrderScreen;

const mainColor = "#00A6FF"
const mainColorO = "rgba(0, 166, 255, 0.5)";
const mint = "#3EB489";
const green = "#32B53D";
const orange = "orange";
const red = "#FF0B0B";
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
        borderRadius: 8,
        marginVertical: 8,
        flex: 1
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
    itemQuantity: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 5
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
    customizationGroup: {
        marginTop: 10,
    },
    customizationGroupName: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    customizationOption: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
});