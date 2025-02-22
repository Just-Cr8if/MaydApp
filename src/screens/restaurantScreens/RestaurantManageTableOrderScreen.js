import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Modal, TextInput, ScrollView } from 'react-native';
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
      getOtherMenus, getOtherMenuItems, menus, setMenus
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

    console.log('ORDERS', orderList[0]?.name);

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
      if (!itemsObj || Object.keys(itemsObj).length === 0) return []; // Handle undefined or empty object
  
      const items = Object.values(itemsObj); // Convert the object to an array
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
  
      return <MenuItemCard item={item.data} handleAddToOrder={handleAddToOrder} />;
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
              <FlatList
                data={orderList}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => <OrderItemCard item={item} />}
                contentContainerStyle={styles.flatListContainer}
              />
              <View style={styles.buttonRow}>
                <Button
                  title="Submit Order"
                  onPress={() => setTableOrderModalVisible(false)}
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