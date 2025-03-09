import React, { useContext, useState, useEffect, useRef } from "react";
import { isEqual } from 'lodash';
import { View, Text, StyleSheet, FlatList, Modal, TextInput, Image, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import Button from "../../components/buttons/Button";
import { Colors, Layout } from '../../styles/Constants';
import CustomDropdown from "../../components/helperComponents/CustomDropdown";
import CustomDropdownSmall from "../../components/helperComponents/CustomDropdownSmall";
import { toTitlecase } from "../../../utils/utilityFunctions";
import { PageContainer, PageBody } from "../../components/helperComponents/PageElements";
import CustomHeader from "../../components/helperComponents/CustomHeader";
import PulsatingButton from "../../components/buttons/PulsatingButton";
import MenuItemCard from "../../components/helperComponents/MenuItemCard";
import OrderItemCard from "../../components/helperComponents/OrderItemCard";


const RestaurantManageOrderScreen = ({ navigation }) => {
    const { venue, tables, getMenuItems, displayedMenuItems,
      getOtherMenus, getOtherMenuItems, menus, setMenus, submitOrder
    } = useRestaurantAuth();
  
    const nav = useNavigation();
    const [selectedMenu, setSelectedMenu] = useState(venue?.menu);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableOrderModalVisible, setTableOrderModalVisible] = useState(false);
    const [orders, setOrders] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMenuItems, setFilteredMenuItems] = useState(Object.values(displayedMenuItems));
    const [orderList, setOrderList] = useState([]);

    // Populate menus with the venue's menu and fetched other menus
    useEffect(() => {
        const fetchMenus = async () => {
        try {
            if (venue?.menu) {
            const fetchedOtherMenus = await getOtherMenus(venue);
            setMenus([venue.menu, ...fetchedOtherMenus]);
            setSelectedMenu(venue.menu);
            }
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
        };

        fetchMenus();
    }, [venue]);

    useEffect(() => {
      // Convert displayedMenuItems (object) to an array & filter based on the search query
      const filtered = Object.values(displayedMenuItems).filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMenuItems(filtered);
    }, [searchQuery, displayedMenuItems]);

    // Populate menus with the venue's menu and fetched other menus
    useEffect(() => {
      if (!selectedTable?.id) {
        setSelectedTable(tables[0]);
      }
    }, [menus, tables]);

    useEffect(() => {
      if (Object.keys(orders).length > 0) {
        const updatedOrders = Object.values(orders)
          .flat()
          .map(({ orderItem, quantity }) => ({ ...orderItem, quantity })); // Extract orderItem and quantity
        setOrderList(updatedOrders);
      }
    }, [orders]);

    // Extract only needed fields, including selected customizations
    const extractOrderItemData = (item, selectedCustomizations) => {
      return {
        id: item.id,
        name: item.name,
        menu: item.menu,
        price: item.price,
        customizations: selectedCustomizations,
      };
    };

    const handleAddToOrder = (quantity, item, selectedCustomizations) => {
      if (!selectedTable?.id) {
        console.error("No selected table provided");
        return;
      }

      // Extract only the necessary fields
      const formattedOrderItem = extractOrderItemData(item, selectedCustomizations);

      // Create the new order object for this table
      const newOrder = {
        quantity,
        orderItem: formattedOrderItem,
      };

      // Update the orders object in state: append the new order to the existing array
      setOrders((prevOrders) => {
        const tableOrders = prevOrders[selectedTable.id] || [];
        return {
          ...prevOrders,
          [selectedTable.id]: [...tableOrders, newOrder],
        };
      });
    };

    const handleRemoveFromOrder = (item) => {
      if (!selectedTable?.id) {
        console.error("No selected table provided");
        return;
      }
      
      setOrders((prevOrders) => {
        const tableOrders = prevOrders[selectedTable.id] || [];
        let removed = false;
        const updatedOrders = tableOrders.filter((order) => {
          // Remove the first occurrence that matches the item id
          if (!removed && order.id === item.id) {
            removed = true;
            return false;
          }
          return true;
        });
        return {
          ...prevOrders,
          [selectedTable.id]: updatedOrders,
        };
      });
    };
    
    // Handle menu selection
    const handleMenuSelect = async (menu) => {
        try {
        setSelectedMenu(menu);
        await getOtherMenuItems(menu);
        } catch (error) {
        console.error('Error selecting menu:', error);
        }
    };

    // Extract unique categories from displayedMenuItems
    const extractCategories = (itemsObj) => {
      if (!itemsObj || typeof itemsObj !== 'object' || Object.keys(itemsObj).length === 0) {
      return []; // Return an empty array if itemsObj is undefined, not an object, or empty
      }
  
      const items = Object.values(itemsObj); // Convert object to array of items
  
      const uniqueCategories = [...new Set(items.map((item) => item.item_type))]; // Extract unique categories
      return uniqueCategories.filter(Boolean); // Remove null or undefined categories
    };
    
    // Safely initialize categories
    const categories = extractCategories(filteredMenuItems);

    // Group items by category
    const groupItemsByCategory = (itemsObj) => {
      if (!itemsObj || Object.keys(itemsObj).length === 0) return [];
  
      const items = Object.values(itemsObj);
      const groupedItems = [];
  
      // Group items by their category
      const categoryMap = items.reduce((acc, item) => {
        if (!acc[item.item_type]) {
          acc[item.item_type] = [];
        }
        acc[item.item_type].push(item);
        return acc;
      }, {});
  
      // Create a grouped structure with headers and items
      Object.entries(categoryMap).forEach(([category, items]) => {
        groupedItems.push({ type: 'header', category }); // Add the category header
        items.forEach((item) => {
          groupedItems.push({ type: 'item', data: item }); // Add the items under the category
        });
      });
  
      return groupedItems;
    };
  
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          await getMenuItems(venue);
        } catch (error) {
          console.error('Error in fetchData:', error);
        }
      };
      fetchData();
    }, [venue]);
  
    const groupedData = groupItemsByCategory(filteredMenuItems);

    const renderItem = ({ item }) => {

      if (item.type === 'header') {
        return (
          <View style={styles.header}>
            <Text style={styles.headerText}>{toTitlecase(item.category)}</Text>
          </View>
        );
      }

      // Guard: if item.data doesn't exist, return null (or render a fallback)
      if (!item.data) {
        return null;
      }

      const isSelected = orderList && orderList.some(order => order.id === item.data.id);

      return <MenuItemCard item={item.data} handleAddToOrder={handleAddToOrder} handleRemoveFromOrder={handleRemoveFromOrder} isSelected={isSelected} />;
    };
  
    return (
      <PageContainer>
        <CustomHeader
          title={"Back to orders"}
        />
        <PageBody>
        <Modal
          visible={tableOrderModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableWithoutFeedback
                onPress={() => setTableOrderModalVisible(false)}
              >
                <Image 
                  source={require('../../images/close-icon.png')}
                  style={{width: 25, height: 25, position: 'absolute', top: 10, right: 10}}
                />
              </TouchableWithoutFeedback>
              <FlatList
                data={orderList}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => <OrderItemCard item={item} />}
                contentContainerStyle={styles.flatListContainer}
              />
              <View style={styles.buttonRow}>
              <Button
                title="Submit Order"
                onPress={async () => {
                  // Calculate the base total from the orderList
                  const baseTotal = orderList.reduce(
                    (acc, item) => acc + parseFloat(item.price) * item.quantity,
                    0
                  );
                  const taxRate = 0.08; // 8% tax rate
                  const taxesAndFees = baseTotal * taxRate;
                  const orderTotal = baseTotal + taxesAndFees;
                  
                  // Construct the payment breakdown object
                  const paymentBreakdown = {
                    baseAmount: baseTotal.toFixed(2),
                    orderTotal: orderTotal.toFixed(2),
                    taxes: taxesAndFees.toFixed(2),
                    stripeFee: '0.00',
                    mobylmenuFee: '0.00',
                    deliveryFee: '0.00',
                    stripePaymentIntentId: null,
                  };
                  
                  // Submit the order with the constructed breakdown
                  await submitOrder(orderList, paymentBreakdown, "at_venue", venue, selectedTable?.id);
                  setOrderList([]);
                  setTableOrderModalVisible(false);
                }}
              />
              </View>

            </View>
          </View>
        </Modal>
          {Object.keys(orders || {}).length > 0 && (
            <PulsatingButton 
              onPress={() => setTableOrderModalVisible(true)}
              imageSource={require('../../images/order-tab-icon-blue.png')}
            />
          )}

          <FlatList
            data={groupedData}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <View>
                  <Text style={styles.headerText}>Menus</Text>
                  <CustomDropdown 
                    menus={menus} 
                    selectedMenu={selectedMenu} 
                    handleMenuSelect={handleMenuSelect} 
                  />

                  <Text style={[styles.headerText, { marginTop: 10 }]}>Select Table</Text>
                  <CustomDropdownSmall
                    tables={tables}
                    selectedTable={selectedTable}
                    setSelectedTable={setSelectedTable}
                  />

                  <Text style={[styles.headerText]}>Quick Search</Text>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              }
            keyExtractor={(item, index) =>
              item.type === 'header' ? `header-${item.category}` : `item-${item.data.id}`
            }
            renderItem={renderItem}
            contentContainerStyle={[{ overflow: 'visible' }]}
          />
        </PageBody>
      </PageContainer>
    );
  };
  
const styles = StyleSheet.create({
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.mainFontColor,
  },
  header: {
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  displayTableOrderButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10001,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightModeLightGrey,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 8,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10
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

});
  
  export default RestaurantManageOrderScreen;