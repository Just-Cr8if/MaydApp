import React, { useContext, useState, useEffect, useRef } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Animated,
    StyleSheet, FlatList, SafeAreaView, Image, Appearance, useColorScheme,
  Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useRestaurantAuth } from "../../context/RestaurantContext";
import LottieLoadingAnimation from '../../components/animations/LottieLoadingAnimation';
import LargeButton from "../../components/buttons/LargeButton";


const RestaurantHomeScreen = ({ navigation }) => {
    const {
      venue,
      restaurantOrders,
      setRestaurantOrders,
      updateAsyncStorageOrders,
      updateOrderStatus,
      getMenuItems,
      displayedMenuItems,
    } = useRestaurantAuth();
  
    const { width } = Dimensions.get('window');
    const isLargeScreen = width >= 768;
    const [restaurantCategories, setRestaurantCategories] = useState([]);
    const nav = useNavigation()
  
    // Group items by category
    const groupItemsByCategory = (items) => {
        if (!items || items.length === 0) return []; // Handle undefined or empty array
        const groupedItems = [];
        let currentCategory = null;
    
        items.forEach((item) => {
          if (item.item_type !== currentCategory) {
            currentCategory = item.item_type;
            groupedItems.push({ type: 'header', category: currentCategory });
          }
          groupedItems.push({ type: 'item', data: item });
        });
    
        return groupedItems;
      };
  
    const MenuItemCard = ({ item }) => {
      return (
        <TouchableOpacity
            onPress={() => nav.navigate('RestaurantMenuItem', { menuItem: item })}
        >
        <View style={styles.card}>
          <View style={styles.details}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>
        </View>
        </TouchableOpacity>
      );
    };
  
    useEffect(() => {
      let isCancelled = false;
  
      const fetchData = async () => {
        try {
          const fetchedMenuItems = await getMenuItems(venue);
          // Additional logic can be added here if needed
        } catch (error) {
          console.error('Error in fetchData:', error);
        }
      };
      fetchData();
  
      return () => {
        isCancelled = true;
      };
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
          <Text style={styles.venueName}>{venue?.venue_name}</Text>
          <Text>Create Menu</Text>
          <TouchableOpacity
            onPress={() => nav.navigate('RestaurantMenuItem')}
          >
          <Text>Add A Menu Item</Text>
          </TouchableOpacity>
          <FlatList
            data={groupedData}
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
const mainColorO = "rgba(0, 166, 255, 0.5)";
const mint = "#3EB489";
const darkColor = "#202124";
const charcoal = "#36454F";
const lightgrey = "#E5E4E2";
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    venueName: {
      fontSize: 24,
      fontWeight: 'bold',
      margin: 16,
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
      flexDirection: 'row',
      marginBottom: 16,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#fff',
      elevation: 3, // For Android shadow
      shadowColor: '#000', // For iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
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
  });
  
  export default RestaurantHomeScreen;