import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRestaurantAuth } from '../../../context/RestaurantContext';
import { useNavigation } from '@react-navigation/native';
import { PageContainer, PageBody } from '../../../components/helperComponents/PageElements';

const TablesScreen = () => {
  const { tables } = useRestaurantAuth();
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.orderContainer}
        onPress={() => navigation.navigate('TableOrders', { tableId: item.id })}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[styles.customerName, { marginRight: 10 }]}>
            Table {item.table_number}
          </Text>
          <Text style={styles.customerName}>View Orders</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PageContainer>

      <PageBody>
        <Text style={styles.header}>Tables</Text>
        <FlatList
          data={tables}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </PageBody>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
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
});

export default TablesScreen;