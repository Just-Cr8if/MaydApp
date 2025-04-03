import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { PageContainer, PageBody } from '../../../components/helperComponents/PageElements';
import CustomHeader from '../../../components/helperComponents/CustomHeader';
import { toTitlecase } from '../../../../utils/utilityFunctions';
import { useStripeTerminal } from '@stripe/stripe-terminal-react-native';
import { useRestaurantAuth } from '../../../context/RestaurantContext';
import { useStripeTerminalContext } from '../../../context/StripeTerminalContext';

const PaymentScreen = () => {
  const route = useRoute();
  const ordersObject = route.params.orders || {};
  const orders = Object.values(ordersObject);

  const [connecting, setConnecting] = useState(false);

  const { discoverReaders, discoveredReaders } =
    useStripeTerminal({
      onUpdateDiscoveredReaders: (readers) => {
        // The `readers` variable will contain an array of all the discovered readers.
      },
    });

  useEffect(() => {
    const fetchReaders = async () => {
      try {
    const { error } = await discoverReaders({
      discoveryMethod: 'localMobile',
      simulated: true,
    });
        if (error) {
          console.error('❌ Error discovering readers:', error);
        } else {
          console.log('✅ Discovering readers...');
        }
      } catch (err) {
        console.error('❌ Error during discovery:', err);
      }
    };
    fetchReaders();
  }, [discoverReaders]);


  // const handleConnectReader = async (reader) => {
  //   setConnecting(true);
  //   try {
  //     const { reader: connected, error } = await connectBluetoothReader(reader);
  //     if (error) {
  //       console.error('❌ Connection failed:', error);
  //     } else {
  //       console.log('✅ Connected to reader:', connected);
  //     }
  //   } catch (err) {
  //     console.error('❌ Connect error:', err);
  //   }
  //   setConnecting(false);
  // };

  const calculateOrderTotal = (order) =>
    order.order_items.reduce((sum, item) => sum + item.line_total, 0);

  const grandTotal = orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
  const taxRate = 0.08;
  const mobylFee = 0.5;
  const stripePercentage = 0.029;
  const stripeFixed = 0.3;

  const tax = grandTotal * taxRate;
  const stripeFee = grandTotal * stripePercentage + stripeFixed;
  const totalWithFees = grandTotal + tax + mobylFee + stripeFee;

  return (
    <PageContainer>
      <CustomHeader title="Back" />
      <PageBody>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.heading}>Available Readers</Text>
          {/* {discoveredReaders.length === 0 ? (
            <Text style={{ marginBottom: 10 }}>Searching for readers...</Text>
          ) : (
            discoveredReaders.map((reader) => (
              <TouchableOpacity
                key={reader.serialNumber}
                onPress={() => handleConnectReader(reader)}
                style={styles.readerButton}
                disabled={connecting}
              >
                <Text style={styles.readerText}>{reader.label || reader.serialNumber}</Text>
              </TouchableOpacity>
            ))
          )}
          {connectedReader && (
            <Text style={styles.connectedText}>
              Connected to: {connectedReader.label || connectedReader.serialNumber}
            </Text>
          )} */}

          {orders.map((order) => {
            const orderTotal = calculateOrderTotal(order);
            return (
              <View key={order.id} style={styles.orderContainer}>
                <Text style={styles.orderTitle}>Table {order.table?.table_number}</Text>
                <Text style={styles.subText}>Customer: {toTitlecase(order.customer_name)}</Text>
                <Text
                  style={[
                    styles.subText,
                    { color: order.payment_method === 'online' ? 'green' : 'red' },
                  ]}
                >
                  {order.payment_method === 'online' ? 'Paid' : 'Unpaid'}
                </Text>

                {order.order_items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {toTitlecase(item.menu_item?.name)} × {item.quantity}
                    </Text>
                    <Text style={styles.itemPrice}>${item.line_total.toFixed(2)}</Text>
                  </View>
                ))}

                <View style={styles.orderTotalRow}>
                  <Text style={styles.orderTotalText}>Order Total:</Text>
                  <Text style={styles.orderTotalAmount}>${orderTotal.toFixed(2)}</Text>
                </View>
              </View>
            );
          })}

          <View style={styles.grandTotalContainer}>
            <Text style={styles.grandTotalLabel}>Subtotal: ${grandTotal.toFixed(2)}</Text>
            <Text style={styles.grandTotalLabel}>Tax (8%): ${tax.toFixed(2)}</Text>
            <Text style={styles.grandTotalLabel}>MobylMenu Fee: $0.50</Text>
            <Text style={styles.grandTotalLabel}>Stripe Fee: ${stripeFee.toFixed(2)}</Text>
            <View style={{ borderTopWidth: 1, marginTop: 10, paddingTop: 10 }}>
              <Text style={styles.grandTotalLabel}>Total: ${totalWithFees.toFixed(2)}</Text>
            </View>
          </View>

          {/* <TouchableOpacity
            style={styles.payButton}
            onPress={async () => {
              try {
                console.log('🔄 Collecting payment method...');
                const { paymentIntent, error: collectError } = await collectPaymentMethod({
                  amount: Math.round(totalWithFees * 100),
                  currency: 'usd',
                });

                if (collectError) {
                  console.error('❌ Error collecting payment:', collectError);
                  return;
                }

                console.log('✅ Collected payment method:', paymentIntent);

                const { paymentIntent: processedIntent, error: processError } =
                  await processPayment(paymentIntent);

                if (processError) {
                  console.error('❌ Error processing payment:', processError);
                  return;
                }

                console.log('💳 Payment successful:', processedIntent);
                // 🔁 TODO: Mark orders as paid via your backend
              } catch (err) {
                console.error('❌ Unexpected payment error:', err);
              }
            }}
            disabled={true}
          >
            <Text style={styles.payButtonText}>Tap to Pay ${totalWithFees.toFixed(2)}</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </PageBody>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  readerButton: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  readerText: {
    fontSize: 16,
  },
  connectedText: {
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
  },
  orderContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    marginBottom: 20,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  itemText: {
    fontSize: 15,
    flex: 1,
  },
  itemPrice: {
    fontSize: 15,
    textAlign: 'right',
  },
  orderTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 8,
  },
  orderTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grandTotalContainer: {
    paddingTop: 20,
    borderTopWidth: 2,
    borderColor: '#000',
    marginTop: 10,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;