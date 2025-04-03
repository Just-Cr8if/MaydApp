import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRestaurantAuth } from '../../../context/RestaurantContext';
import { PageContainer, PageBody } from '../../../components/helperComponents/PageElements';
import { useRoute } from '@react-navigation/native';
import CustomHeader from '../../../components/helperComponents/CustomHeader';
import { Colors, Fonts, Spacing } from '../../../styles/Constants';
import PaymentOrderItemCard from '../../../components/helperComponents/PaymentOrderItemCard';
import LargeButton from '../../../components/buttons/LargeButton';

const TableOrdersScreen = ({ }) => {
    const { getTableOrders, venue } = useRestaurantAuth();
    const [orders, setOrders] = useState([]);
    const route = useRoute();
    const { tableId } = route.params;
    const [selectedOrders, setSelectedOrders] = useState({});
    const [orderTotal, setOrderTotal] = useState(0);
    const nav = useNavigation();

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const fetchedOrders = await getTableOrders(tableId);
            setOrders(fetchedOrders);
          } catch (error) {
            console.error('Error fetching orders:', error);
          }
        };
    
        fetchOrders();
      }, []);

    const handleSelect = (order) => {
        setSelectedOrders((prev) => {
            if (order.id in prev) {
            // Deselect: remove the order from selectedOrders
            const updated = { ...prev };
            delete updated[order.id];
            return updated;
            } else {
            // Select: add the order
            return {
                ...prev,
                [order.id]: order,
            };
            }
        });
    };

    const renderItem = ({ item }) => {
        const isSelected = item.id in selectedOrders;
      return (
        <PaymentOrderItemCard item={item} isSelected={isSelected} onSelect={() => handleSelect(item)} setOrderTotal={setOrderTotal}/>
      );
    };

  return (
    <PageContainer>
      <CustomHeader title={`Table ${tableId}`} />
      <PageBody>
        <FlatList
            data={orders}
            keyExtractor={(item) => item?.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
        />
        {Object.keys(selectedOrders).length > 0 && (
            <LargeButton title={`Subtotal: $${orderTotal.toFixed(2)}`}
                onPress={
                    () => {
                        nav.navigate('PaymentScreen', {
                            orders: selectedOrders
                        });
                    }
                }/>
        )}
      </PageBody>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDetails: {
    marginTop: 10,
  },
  orderItem: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  customizations: {
    marginTop: 5,
  },
  customizationTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  customizationText: {
    fontSize: 14,
    color: '#555',
  },
  itemNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
  },
});

export default TableOrdersScreen;