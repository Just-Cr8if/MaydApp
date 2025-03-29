import React, { useContext, useState, useEffect, useMemo } from "react";
import { View, Text, Button, Pressable, TouchableOpacity, Animated,
    StyleSheet, FlatList, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions, Modal, TextInput
 } from 'react-native';
 import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import SwipeableItem from 'react-native-swipeable-item';
import { MOBYLMENU_API_BASE_URL, WEBSOCKET_URL, WEBSOCKET_URL_LOCAL } from "../../config";
import { toTitlecase } from "../../../utils/utilityFunctions";
import { PageContainer, PageBody } from "../../components/helperComponents/PageElements";

const RestaurantOrderScreen = ({ navigation }) => {
    const { venue, restaurantOrders, setRestaurantOrders, updateAsyncStorageOrders,
        updateOrderStatus, restaurantInfo, tableRequests, setTableRequests, patchTableRequest,
        getTableRequests, getRecentOrders
     } = useRestaurantAuth();
    const [orderType, setOrderType] = useState('All');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [kitchenView, setKitchenView] = useState(false);
    const [isDeclineModalVisible, setDeclineModalVisible] = useState(false);
    const [declineReason, setDeclineReason] = useState('');
    const [declineOrderId, setDeclineOrderId] = useState(null);
    const [showTableRequests, setShowTableRequests] = useState(false);

    useEffect(() => {
          const fetchOrderData = async () => {
            try {
              await getRecentOrders(venue?.id);
              await getTableRequests(venue?.id);
            } catch (error) {
              console.error('Error fetching orders:', error);
            }
          };
          fetchOrderData();
        }, [venue]);
    
    // Ensure token and venue are available.
    const token = restaurantInfo?.token;
    const venueId = venue?.id;

    // --- Orders WebSocket ---
    const ordersWsUrl =
        token && venueId
        ? `${WEBSOCKET_URL}orders?token=${token}&venue=${venueId}`
        : null;

    const {
        sendMessage: sendOrdersMessage,
        lastMessage: ordersLastMessage,
        readyState: ordersReadyState,
    } = useWebSocket(ordersWsUrl, {
        onOpen: () => console.log("Orders WebSocket connection opened"),
        onClose: () => console.log("Orders WebSocket connection closed"),
        onError: (error) => console.error("Orders WebSocket error:", error),
        shouldReconnect: () => true,
    });

    const ordersConnectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[ordersReadyState];

    useEffect(() => {
        if (ordersLastMessage !== null) {
        try {
            const orderData = JSON.parse(ordersLastMessage.data);

            // Only process certain statuses.
            if (
            (orderData.status === "canceled")
            ) {
            console.log("Ignoring order update with status:", orderData.status);
            return;
            }
            console.log("New order received:", orderData);

            setRestaurantOrders((prevOrders) => {
            const orderIndex = prevOrders.findIndex(
                (order) => order.id === orderData.id
            );
            if (orderIndex !== -1) {
                const updatedOrders = [...prevOrders];
                updatedOrders[orderIndex] = {
                ...updatedOrders[orderIndex],
                ...orderData,
                };
                return updatedOrders;
            } else {
                return [...prevOrders, orderData];
            }
            });
        } catch (err) {
            
        }
        }
    }, [ordersLastMessage, setRestaurantOrders]);

    // --- Table Requests WebSocket ---
    const tableRequestsWsUrl =
        token && venueId
        ? `${WEBSOCKET_URL}table_requests?token=${token}&venue=${venueId}`
        : null;

    const {
        sendMessage: sendTableRequestsMessage,
        lastMessage: tableRequestsLastMessage,
        readyState: tableRequestsReadyState,
    } = useWebSocket(tableRequestsWsUrl, {
        onOpen: () =>
        console.log("Table Requests WebSocket connection opened"),
        onClose: () =>
        console.log("Table Requests WebSocket connection closed"),
        onError: (error) =>
        console.error("Table Requests WebSocket error:", error),
        shouldReconnect: () => true,
    });

    const tableRequestsConnectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[tableRequestsReadyState];

    useEffect(() => {
        if (tableRequestsLastMessage !== null) {
        try {
            const tableRequestData = JSON.parse(tableRequestsLastMessage.data);
            console.log("New table request received:", tableRequestData);

            setTableRequests((prevRequests) => {
            const reqIndex = prevRequests.findIndex(
                (req) => req.id === tableRequestData.id
            );
            if (reqIndex !== -1) {
                const updatedRequests = [...prevRequests];
                updatedRequests[reqIndex] = {
                ...updatedRequests[reqIndex],
                ...tableRequestData,
                };
                return updatedRequests;
            } else {
                return [...prevRequests, tableRequestData];
            }
            });
        } catch (err) {
            
        }
        }
    }, [tableRequestsLastMessage, setTableRequests]);

    const orders = Array.isArray(restaurantOrders) ? restaurantOrders : [];

    const orderCounts = useMemo(() => {
        if (orders.length === 0) {
          return { New: 0, Open: 0, Closed: 0 };
        }
        return {
          New: orders.filter(order => order.status === 'submitted').length,
          Open: orders.filter(order => order.status === 'accepted').length,
          Closed: orders.filter(order =>
            ['closed', 'declined'].includes(order.status)
          ).length,
        };
      }, [orders]);
      
      const filteredOrders = useMemo(() => {
        if (orders.length === 0) return [];
        
        if (orderType === 'New') {
          return orders.filter(order => order.status === 'submitted' || order.status === 'pending');
        } else if (orderType === 'Open') {
          return orders.filter(order => order.status === 'accepted');
        } else if (orderType === 'Closed') {
          return orders.filter(order =>
            ['closed', 'declined'].includes(order.status)
          );
        }
        // Default fallback
        return orders.filter(order => order.status === 'submitted' || order.status === 'pending');
      }, [orderType, orders]);

    const transformOrderType = (item) => {
        if (item.order_type === 'table' && item?.table?.table_number) {
            return `Table #${item?.table?.table_number || item?.venue_table_id}`;
        } else if (item.order_type === 'pick_up') {
            return 'Pick Up';
        } else if (item.order_type === 'delivery') {
            return 'Delivery';
        }
        return 'Unknown';
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

    const handleFulfill = async (tableRequestId) => {
        await patchTableRequest(venue.id, tableRequestId, true);
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
                snapPointsLeft={isSwipeRestrictedToClose ? [100] : [100]}
                snapPointsRight={!isSwipeRestrictedToClose ? [100] : []}
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
                        <Text style={styles.customerName}>{toTitlecase(item.customer_name)}</Text>
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

    const renderTableRequests = ({ item }) => {
        // Render SwipeableItem for other statuses
        return (
            <SwipeableItem
                key={item.id}
                item={item}
                overSwipe={20}
                snapPointsLeft={[100]} // Left swipe for "close" when accepted
                renderUnderlayLeft={
                    () => <LeftCloseUnderlay onPress={() => handleFulfill(item.id)} />
                }
            >
                <Pressable
                    style={styles.orderContainer}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.customerName, { marginRight:10 }]}>Table</Text>
                        <Text style={styles.customerName}>{item?.table?.table_number || item?.venue_table_id}</Text>
                    </View>
                    <Text style={styles.submittedTime}>
                        Table Request:{' '}
                        {new Date(item.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                </Pressable>
            </SwipeableItem>
        );
    };
           
    return (
        <PageContainer>
            <PageBody>
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
                                disabled={!declineReason.trim()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
                <TouchableOpacity
                    style={styles.plusSignAndTextContainer}
                    onPress={() => navigation.navigate('RestaurantManageTableOrder')}    
                >
                    <Image
                        source={{ uri: "https://mobyl-menu-bucket.s3.amazonaws.com/MM-Images/plus.png" }}
                        style={{ width: 15, height: 15, marginRight: 5 }}
                    />
                    <Text style={styles.venueName}>Add Order</Text>
                </TouchableOpacity>
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <TouchableOpacity
                        style={styles.kitchenViewButton}
                        onPress={() => setKitchenView((prev) => !prev)}
                    >
                        <Text style={styles.kitchenViewText}>
                            {kitchenView ? 'Exit Kitchen View' : 'Kitchen View'}
                        </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        style={styles.kitchenViewButton}
                        onPress={() => setShowTableRequests((prev) => !prev)}
                    >
                        <Text style={styles.kitchenViewText}>
                            {showTableRequests ? 'Hide Requests' : 'Show Requests'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {showTableRequests ? (
                <FlatList
                    data={tableRequests}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTableRequests}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    showsVerticalScrollIndicator={false}
                />
                )
                :
                (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item, index) => (item?.id ? item.id.toString() : `fallback-${index}`)}
                    renderItem={renderOrder}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={renderEmptyComponent}
                    showsVerticalScrollIndicator={false}
                />
                )}

            </PageBody>
        </PageContainer>
    );
};

export default RestaurantOrderScreen;

const mainColor = "#00A6FF"
const green = "#32B53D";
const red = "#FF0B0B";


const styles = StyleSheet.create({
    plusSignAndTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    venueName: {
        fontSize: 15,
        fontWeight: '700',
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