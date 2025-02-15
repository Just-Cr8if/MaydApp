import React, { useContext, useState, useEffect, useRef, use } from "react";
import { View, Text, Pressable, TextInput, TouchableOpacity, Animated,
    StyleSheet, FlatList, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import LottieLoadingAnimation from '../../components/animations/LottieLoadingAnimation';
import LargeButton from "../../components/buttons/LargeButton";
import SwipeableItem from 'react-native-swipeable-item';
import Button from "../../components/buttons/Button";
import { Colors, Layout } from '../../styles/Constants';


const RestaurantHomeScreen = ({ navigation }) => {
    const { venue, restaurantOrders, setRestaurantOrders, updateAsyncStorageOrders,
      getRecentOrders, getMenuItems, displayedMenuItems,
        getOtherMenus, getOtherMenuItems, setDisplayedMenuItems,
        menus, setMenus, deleteMenuItem, getTableRequests
    } = useRestaurantAuth();
  
    const { width } = Dimensions.get('window');
    const isLargeScreen = width >= 768;
    const nav = useNavigation();
    const [selectedMenu, setSelectedMenu] = useState(venue?.menu);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);

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
    
    const RightUnderlay = ({ onPress }) => (
        <TouchableOpacity onPress={onPress}
        style={[styles.underlayAction, styles.alignRight, { backgroundColor: red }]}
        >
            <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
    );

    const handleDelete = (itemId) => {
        setItemIdToDelete(itemId);
        setIsDeleteModalVisible(true);
      };

    const confirmDelete = () => {
        deleteMenuItem(itemIdToDelete);
        setItemIdToDelete(null);
        setIsDeleteModalVisible(false);
    };

    const cancelDelete = () => {
        setItemIdToDelete(null);
        setIsDeleteModalVisible(false);
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
  
    const MenuItemCard = ({ item }) => {
      return (
        <SwipeableItem
            key={item.id}
            item={item}
            overSwipe={20}
            snapPointsRight={[100]}
            renderUnderlayRight={() => (
                <RightUnderlay onPress={() => handleDelete(item.id)} />
            )}
        >
            <Pressable
                style={[
                    styles.card
                ]}
                onPress={() => nav.navigate('RestaurantMenuItem', { menuItem: item, venue: venue, categories: categories })}
            >
                <View style={styles.details}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {item.description}
                    </Text>
                    <Text style={styles.price}>${item.price}</Text>
                </View>
            </Pressable>
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
            <Text style={styles.headerText}>{item.category}</Text>
          </View>
        );
      }
  
      return <MenuItemCard item={item.data} />;
    };
  
    return (
      <View style={styles.container}>
        <SafeAreaView>
        <Modal
            visible={isDeleteModalVisible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Are you sure you want to delete this item?</Text>
                    <Text style={styles.modalSubtitle}>This cannot be undone</Text>
                    <View style={styles.buttonRow}>
                        <Button title="Cancel" onPress={cancelDelete} />
                        <Button
                            title="Confirm"
                            onPress={confirmDelete}
                        />
                    </View>
                </View>
            </View>
        </Modal>
          <FlatList
            data={groupedData}
            ListHeaderComponent={
                <View>
                  <Text style={styles.venueName}>{venue?.venue_name}</Text>
                    <View style={styles.actionButtonContainer}>
                    <View style={{ width: '100%', paddingLeft: 10, marginBottom: 15 }}>
                        <Text style={styles.headerText}>Menus</Text>
                    </View>
                    {menus.map((item, index) => (
                    <TouchableOpacity
                        key={`menu-${index}`}
                        style={[
                        styles.actionButton,
                        selectedMenu.id === item.id && styles.selectedMenu,
                        ]}
                        onPress={() => handleMenuSelect(item)}
                    >
                        <Text
                        style={[
                            styles.actionButtonText,
                            selectedMenu.id === item.id && styles.selectedMenuText,
                        ]}
                        >
                        {item.name}
                        </Text>
                    </TouchableOpacity>
                    ))}
                    </View>
                    <View style={styles.actionButtonContainerTop}>
                        <TouchableOpacity
                            onPress={() => nav.navigate('RestaurantMenuItem', { venue: venue, categories: categories })}
                            style={styles.actionButton}
                        >
                            <Text style={styles.actionButtonText}>Add A Menu Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => nav.navigate('RestaurantMenu', { venue: venue })}
                        >
                            <Text style={styles.actionButtonText}>Create Menu</Text>
                        </TouchableOpacity>
                    </View>      
                </View>
              }
            keyExtractor={(item, index) =>
              item.type === 'header' ? `header-${item.category}` : `item-${item.data.id}`
            }
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </SafeAreaView>
      </View>
    );
  };  

const mainColor = "#00A6FF"
const lightgrey = "#E5E4E2";
const red = "#FF0B0B";
  
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
},
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
},
headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
},
listContainer: {
    padding: 16,
},
card: {
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
image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
},
details: {
    flex: 1,
    padding: 8,
},
name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
},
description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
},
price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
},
actionButton: {
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
    height: 30,
    marginBottom: 10,
    marginRight: 20
},
actionButtonText: {
    fontSize: 15,
    fontWeight: '600'
},
actionButtonContainer: {
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
    backgroundColor: "#F9F9F9"
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
        borderRadius: 10
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

});
  
  export default RestaurantHomeScreen;