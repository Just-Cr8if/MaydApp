import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet,
  FlatList, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/buttons/Button';
import ActionButton from '../../components/buttons/ActionButton';
import PageLink from '../../components/links/PageLink';
import { baseStyles, screenWidth } from '../../styles/baseStyles';

const DriverHomeScreen = ({ navigation }) => {
  const { driverInfo, fetchBatchedOrders } = useAuth();
  const [ordersData, setOrdersData] = useState([]);
  useEffect(() => {
    const getBatchedOrders = async () => {
      try {
        if (driverInfo?.networks?.length > 0) {
          const fetchedBatchedOrders = await fetchBatchedOrders(driverInfo.networks);
          setOrdersData(fetchedBatchedOrders);
        }
        else {
          console.log('Nothing to see')
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    getBatchedOrders();
  }, [driverInfo]);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'flex-start' }}>
      <Text style={styles.pageHeader}>Open Orders</Text>
      <FlatList
        data={ordersData}
        keyExtractor={(item) => item.hub_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.hubContainer}>
            <Text style={styles.hubTitle}>Hub: {item.hub_name}</Text>
            <FlatList
              data={item.orders} // Iterates over the orders array inside the hub
              keyExtractor={(order) => order.id.toString()}
              renderItem={({ item: order }) => (
                <View style={[styles.orderContainer, baseStyles.screenWidth]}>
                  <View>
                    <Text style={styles.orderInformation}>{order.orders.length} Orders</Text>
                    <Text style={styles.orderInformation}>Collect Orders & Depart By</Text>
                    <Text style={styles.important}>{order.formatted_scheduled_departure_time}</Text>
                  </View>
                  <View>
                    <ActionButton
                      title="Details"
                      onPress={() => navigation.navigate('OrderDetails', { order })}
                      textColor="#00A6FF"
                    />
                    <ActionButton
                      title="Accept"
                      onPress={() => {
                        /* Accept functionality to be implemented */
                      }}
                      textColor="#1D9B00"
                    />
                  </View>
                </View>
              )}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default DriverHomeScreen;

const styles = StyleSheet.create({
  pageHeader: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 10
  },
  hubContainer: {
    marginBottom: 30
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hubTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  orderInformation: {
    fontSize: 16,
    fontWeight: '500'
  },
  important: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600'
  }
});