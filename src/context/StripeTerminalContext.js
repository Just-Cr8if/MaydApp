import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useStripeTerminal } from '@stripe/stripe-terminal-react-native';

const StripeTerminalContext = createContext();

export const StripeTerminalProvider = ({ children }) => {
  const [isTerminalReady, setIsTerminalReady] = useState(false);

  const {
    initialize,
    discoverReaders,
    connectBluetoothReader,
    connectedReader,
    discoveredReaders,
    collectPaymentMethod,
    processPayment,
  } = useStripeTerminal({
    onUpdateDiscoveredReaders: (readers) => {
      console.log('[Stripe terminal]: Readers updated', readers);
    },
    onDidChangeConnectionStatus: (status) => {
      console.log('[Stripe terminal]: Connection status changed:', status);
    },
  });

  useEffect(() => {
    const initTerminal = async () => {
      try {
        const result = await initialize();
        console.log('[Stripe terminal]: Initialized!', result);
        setIsTerminalReady(true);
      } catch (err) {
        console.error('❌ Stripe Terminal init failed:', err);
        setIsTerminalReady(false);
      }
    };

    initTerminal();
  }, [initialize]);

  const value = useMemo(
    () => ({
      isTerminalReady,
      discoverReaders,
      connectBluetoothReader,
      connectedReader,
      discoveredReaders,
      collectPaymentMethod,
      processPayment,
    }),
    [
      isTerminalReady,
      discoverReaders,
      connectBluetoothReader,
      connectedReader,
      discoveredReaders,
      collectPaymentMethod,
      processPayment,
    ]
  );

  return (
    <StripeTerminalContext.Provider value={value}>
      {children}
    </StripeTerminalContext.Provider>
  );
};

export const useStripeTerminalContext = () => useContext(StripeTerminalContext);