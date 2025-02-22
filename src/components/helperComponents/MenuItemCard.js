import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SwipeableItem from 'react-native-swipeable-item';
import { Colors } from '../../styles/Constants';
import { toTitlecase } from '../../../utils/utilityFunctions';

const RightUnderlay = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}
    style={[styles.underlayAction, styles.alignRight, { backgroundColor: Colors.green }]}
    >
      <Text style={styles.actionText}>+ Add</Text>
    </TouchableOpacity>
);

const MenuItemCard = ({ item, handleAddToOrder }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [showCustomizations, setShowCustomizations] = useState(false); // Toggle state

    const swipeableRef = useRef(null);
  
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

    const handleOrderAndClose = () => {
      handleAddToOrder(quantity, item, selectedCustomizations);
  
      // 🔹 Close the swipe action after adding the item
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };
  
    return (
      <SwipeableItem
        key={item.id}
        ref={swipeableRef}
        item={item}
        overSwipe={20}
        snapPointsRight={[100]}
        renderUnderlayRight={() => (
          <RightUnderlay onPress={handleOrderAndClose} />
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

  export default MenuItemCard;

  const styles = StyleSheet.create({
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
      alignItems: 'center',
      width: '100%'
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
      backgroundColor: Colors.primary,
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
      backgroundColor: Colors.lightgrey,
      width: 150,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      height: 30
    },
    selectedMenu: {
      backgroundColor: Colors.primary, 
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