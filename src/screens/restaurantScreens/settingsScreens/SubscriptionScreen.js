import React from 'react';
import { View, Text } from 'react-native';
import { settingsStyles } from '../../../styles/settingsStyles';
import CustomHeader from '../../../components/helperComponents/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { PageContainer, PageBody } from '../../../components/helperComponents/PageElements';

const SubscriptionScreen = () => {
  const nav = useNavigation();
  return (
    <PageContainer>
      <CustomHeader
        title={"Settings"}
        onBackPress={() => {
          nav.goBack();
        }}
      />
      <PageBody>
        <Text>SubscriptionScreen</Text>
      </PageBody>
    </PageContainer>
  );
};

export default SubscriptionScreen;