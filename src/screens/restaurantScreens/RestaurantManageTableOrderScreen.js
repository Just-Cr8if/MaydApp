import React, { useContext, useState, useEffect, useRef, use } from "react";
import { View, Text, Pressable, TextInput, TouchableOpacity, Animated,
  StyleSheet, FlatList, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import SwipeableItem from 'react-native-swipeable-item';
import Button from "../../components/buttons/Button";
import { Colors, Layout } from '../../styles/Constants';
import CustomDropdown from "../../components/helperComponents/CustomDropdown";
import CustomDropdownSmall from "../../components/helperComponents/CustomDropdownSmall";
import { toTitlecase } from "../../../utils/utilityFunctions";
import { PageContainer, PageBody } from "../../components/helperComponents/PageElements";
import CustomHeader from "../../components/helperComponents/CustomHeader";
import PulsatingButton from "../../components/buttons/PulsatingButton";


const RestaurantManageOrderScreen = ({ navigation }) => {
    const { venue, tables, getMenuItems, displayedMenuItems,
      getOtherMenus, getOtherMenuItems, menus, setMenus, deleteMenuItem, 
      getTableRequests
    } = useRestaurantAuth();
  
    const nav = useNavigation();
    const [selectedMenu, setSelectedMenu] = useState(venue?.menu);
    const [selectedTable, setSelectedTable] = useState(null);
    const [tableOrderModalVisible, setTableOrderModalVisible] = useState(false);
    const [orders, setOrders] = useState({});

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

    // Populate menus with the venue's menu and fetched other menus
    useEffect(() => {

    }, [menus]);

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
    
    
    
    const RightUnderlay = ({ onPress }) => (
        <TouchableOpacity onPress={onPress}
        style={[styles.underlayAction, styles.alignRight, { backgroundColor: Colors.green }]}
        >
          <Text style={styles.actionText}>+ Add</Text>
        </TouchableOpacity>
    );

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
    const categories = extractCategories(displayedMenuItems); // Use extractCategories directly

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

    console.log("orders", orders["3"][1]);
  
    const MenuItemCard = ({ item }) => {
      const [quantity, setQuantity] = useState(1);
      const [selectedCustomizations, setSelectedCustomizations] = useState({});
      const [showCustomizations, setShowCustomizations] = useState(false); // Toggle state
    
      const handleDecrease = () => {
        if (quantity > 1) {
          setQuantity(quantity - 1);
        }
      };
    
      const handleIncrease = () => {
        setQuantity(quantity + 1);
      };
    
      const toggleCustomization = (groupName, option) => {
        setSelectedCustomizations((prev) => {
          const groupSelections = prev[groupName] || [];
          if (groupSelections.includes(option)) {
            return {
              ...prev,
              [groupName]: groupSelections.filter((opt) => opt !== option),
            };
          } else {
            return {
              ...prev,
              [groupName]: [...groupSelections, option],
            };
          }
        });
      };
    
      return (
        <SwipeableItem
          key={item.id}
          item={item}
          overSwipe={20}
          snapPointsRight={[100]}
          renderUnderlayRight={() => (
            <RightUnderlay
              onPress={() => handleAddToOrder(quantity, item, selectedCustomizations)}
            />
          )}
        >
          <View style={[styles.cardContainer]}>
            <View style={[styles.card]}>
              <View style={styles.details}>
                <Text style={styles.name}>{toTitlecase(item.name)}</Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.quantityButtonContainer}>
                  <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                {item.customization_groups?.length > 0 && (
                  <TouchableOpacity
                    style={styles.customizationToggle}
                    onPress={() => setShowCustomizations((prev) => !prev)}
                  >
                    <Image 
                      source={require('../../images/edit-icon.png')} 
                      style={{ width: 25, height: 25 }}
                    />
                  </TouchableOpacity>
                )}

              </View>
            </View>
    
            {/* Customization Groups (Hidden by Default) */}
            {showCustomizations && (
              <View style={styles.customizationGroupContainer}>
                {item.customization_groups.map((group, index) => (
                  <View key={index} style={styles.customizationGroup}>
                    <Text style={styles.customizationGroupTitle}>{group.name}</Text>
                    {group.options.map((option, optIndex) => {
                      const isSelected =
                        selectedCustomizations[group.name]?.includes(option) || false;
                      return (
                        <TouchableOpacity
                          key={optIndex}
                          style={[
                            styles.customizationOption,
                            isSelected && styles.selectedCustomizationOption,
                          ]}
                          onPress={() => toggleCustomization(group.name, option)}
                        >
                          <Text style={styles.customizationOptionText}>{option.name}</Text>
                          <Text style={styles.customizationOptionPrice}>
                            +${option.price_modifier}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            )}
          </View>
        </SwipeableItem>
      );
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
  
    const groupedData = groupItemsByCategory(displayedMenuItems);
  
    const renderItem = ({ item }) => {
      if (item.type === 'header') {
        return (
          <View style={styles.header}>
            <Text style={styles.headerText}>{toTitlecase(item.category)}</Text>
          </View>
        );
      }
  
      return <MenuItemCard item={item.data} />;
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
            animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.buttonRow}>
                    <Button
                        title="Submit Order"
                        onPress={() => {
                          setTableOrderModalVisible(false);
                        }}
                    />
                </View>
                  </View>
              </View>
          </Modal>

        <PulsatingButton 
          onPress={
            () => {
              setTableOrderModalVisible(true);
            }
          }
          imageSource={require('../../images/order-tab-icon-blue.png')}
        />
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

const mainColor = "#00A6FF"
const lightgrey = "#E5E4E2";
  
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
  cardContainer: {
    flexDirection: 'column',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  card: {
    flexDirection: 'row',
    minHeight: 80,
    justifyContent: 'space-between'
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  details: {
    padding: 8,
    width: '80%',
  },
  actionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '20%',
    justifyContent: 'space-around',
  },
  quantityButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  quantityButton: {
    borderRadius: 8,
  },
  quantityButtonText: {
    fontSize: 30,
    color: Colors.primary,
  },
  quantityText: {
    fontSize: 20,
    color: Colors.darkModeBlack,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#333',
  },
  actionButton: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.65,
    elevation: 2,
    backgroundColor: mainColor,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 37,
  },
  actionButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 10,
    zIndex: 1000,
    elevation: 10,
  },
  actionButtonContainerTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
    paddingVertical: 20,
    borderRadius: 10,
  },
  menuItem: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 1.65,
    elevation: 2,
    backgroundColor: lightgrey,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30
  },
  selectedMenu: {
    backgroundColor: mainColor, 
    borderColor: '#4CAF50',
  },
  menuText: {
    color: '#000',
  },
  selectedMenuText: {
    color: '#fff',
  },
  underlayAction: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    padding: 16,
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
  customizationGroupContainer: {
    paddingHorizontal: 10
  },
  customizationGroup: {
    marginVertical: 10
  },
  customizationGroupTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5
  },
  customizationOption: {
    padding: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedCustomizationOption: {
    backgroundColor: "#FFD700",
    borderColor: "#FFA500",
  },
  customizationToggle: {
    padding: 5,
    borderRadius: 5,
  },
  customizationToggleText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700"
  },

});
  
  export default RestaurantManageOrderScreen;