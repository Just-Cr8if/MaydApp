import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { toTitlecase } from '../../../utils/utilityFunctions';
import { Colors } from '../../styles/Constants';

const PaymentOrderItemCard = ({ item, isSelected, onSelect, setOrderTotal }) => {
  const total = item.order_items.reduce((acc, o) => acc + o.line_total, 0);
  const isDisabled = setOrderTotal && item.payment_method === 'online';

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        isSelected && styles.selectedOrder,
        isDisabled && styles.disabledCard,
      ]}
      activeOpacity={isDisabled ? 1 : 0.7}
      onPress={() => {
        if (isDisabled) return;
        onSelect(item);
        if (setOrderTotal) {
          setOrderTotal((prev) => isSelected ? prev - total : prev + total);
        }
      }}
    >
      <View style={styles.card}>
        <View style={styles.details}>
          <Text style={styles.name}>Table {item.table?.table_number}</Text>
          <Text style={styles.description}>Customer: {toTitlecase(item.customer_name)}</Text>
          <Text style={[styles.paymentStatus, { color: item.payment_method === 'online' ? 'green' : 'red' }]}>
            {item.payment_method === 'online' ? 'Paid' : 'Unpaid'}
          </Text>
        </View>
      </View>

      {item.order_items?.length > 0 && (
        <View style={styles.customizationGroupContainer}>
          {item.order_items.map((orderItem, index) => (
            <View key={index} style={styles.customizationGroup}>
              <Text style={styles.customizationGroupTitle}>
                {toTitlecase(orderItem.menu_item?.name)} × {orderItem.quantity}
              </Text>
              {orderItem.customizations?.map((group, groupIdx) => (
                <View key={groupIdx} style={styles.customizationGroup}>
                  <Text style={styles.customizationGroupTitle}>{group.name}</Text>
                  {group.options.map((option, optIdx) => (
                    <View key={optIdx} style={styles.customizationOption}>
                      <Text style={styles.customizationOptionText}>{option.name}</Text>
                      <Text style={styles.customizationOptionPrice}>+${option.price_modifier}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
      <View>
        <Text style={styles.price}>
          Total: ${total.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

  export default PaymentOrderItemCard;

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
      backgroundColor: '#d0f0c0',
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
    disabledCard: {
      opacity: 0.4,
    },
    
  
  });