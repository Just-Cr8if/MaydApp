import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SwipeableItem from 'react-native-swipeable-item';
import { Colors } from '../../styles/Constants';
import { toTitlecase } from '../../../utils/utilityFunctions';

const LeftUnderlay = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.underlayAction, styles.alignLeft, { backgroundColor: Colors.green }]}
  >
    <Text style={styles.actionText}>+ Add</Text>
  </TouchableOpacity>
);

const RightUnderlay = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.underlayAction, styles.alignRight, { backgroundColor: Colors.red }]}
  >
    <Text style={styles.actionText}>- Remove</Text>
  </TouchableOpacity>
);


const MenuItemCard = ({ item, handleAddToOrder, handleRemoveFromOrder, isSelected }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedCustomizations, setSelectedCustomizations] = useState({});
    const [showCustomizations, setShowCustomizations] = useState(false);

    console.log("SELECTED CUSTOMIZATIONS", selectedCustomizations);

    const swipeableRef = useRef(null);
  
    const handleDecrease = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };
  
    const handleIncrease = () => {
      setQuantity(quantity + 1);
    };
  
    const toggleCustomization = (groupId, option, isMultiple, maxSelections) => {
      setSelectedCustomizations((prev) => {
        const newCustomizations = { ...prev };
        const groupIdStr = String(groupId);
        const existingSelections = newCustomizations[groupIdStr] || [];
    
        const isOptionSelected = existingSelections.some((customization) => customization.id === option.id);
    
        if (isMultiple) {
          if (isOptionSelected) {
            // Remove the option if already selected
            const updatedSelections = existingSelections.filter((customization) => customization.id !== option.id);
            if (updatedSelections.length === 0) {
              delete newCustomizations[groupIdStr]; // Remove the key if empty
            } else {
              newCustomizations[groupIdStr] = updatedSelections;
            }
          } else {
            // Prevent exceeding maxSelections
            if (existingSelections.length >= maxSelections) return prev;
    
            newCustomizations[groupIdStr] = [...existingSelections, option];
          }
        } else {
          // Single-selection: Replace previous selection
          newCustomizations[groupIdStr] = [option];
        }
    
        return newCustomizations;
      });
    };
    

    const handleOrderAndClose = () => {
      handleAddToOrder(quantity, item, selectedCustomizations);
  
      // 🔹 Close the swipe action after adding the item
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };

    const handleRemoveOrderAndClose = () => {
      handleRemoveFromOrder(item.id);
  
      // 🔹 Close the swipe action after removing the item
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
        snapPointsLeft={[100]}
        snapPointsRight={isSelected ? [100] : []}
        renderUnderlayLeft={() => (
          <LeftUnderlay onPress={handleOrderAndClose} />
        )}
        renderUnderlayRight={() =>
          isSelected ? (
            <RightUnderlay onPress={handleRemoveOrderAndClose} />
          ) : null
        }
      >
        <View style={[styles.cardContainer, isSelected && styles.selectedOrder]}>
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

              {item.customizations?.length > 0 && (
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
              {item.customizations.map((group, index) => {
                const selectedOptions = selectedCustomizations[group.id] || [];
                const isMaxReached = selectedOptions.length >= group.max_selections;

                return (
                  <View key={index} style={styles.customizationGroup}>
                    <Text style={styles.customizationGroupTitle}>
                      {group.name} {group.min_selections > 0 && <Text style={styles.required}>*Required</Text>}
                    </Text>
                    {group.options.map((option, optIndex) => {
                      const isSelected = selectedOptions.includes(option);

                      return (
                        <TouchableOpacity
                          key={optIndex}
                          style={[
                            styles.customizationOption,
                            isSelected && styles.selectedCustomizationOption,
                            isMaxReached && !isSelected && styles.disabledOption
                          ]}
                          onPress={() => !isMaxReached || isSelected ? toggleCustomization(group.id, option, group.max_selections > 1, group.max_selections) : null}
                        >
                          <Text style={styles.customizationOptionText}>{option.name}</Text>
                          <Text style={styles.customizationOptionPrice}>+${option.price_modifier}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
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
    selectedOrder: {
      backgroundColor: '#d0f0c0', // Light green background to indicate selection
      borderColor: '#76c893',
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