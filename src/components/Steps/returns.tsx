// ReturnsForm.js

import React from 'react';
import { TextInput } from 'react-native';

import { type ReturnsFormProps } from '@/api';
import { Select, Switch, Text, View } from '@/ui';

const ReturnsForm = ({ formData, updateNestedForm }: ReturnsFormProps) => {
  return (
    <View className="space-y-4 p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-medium dark:text-gray-200">
          Accept Returns
        </Text>
        <Switch.Root
          checked={formData.returns.accepted}
          onChange={(value) => updateNestedForm('returns', 'accepted', value)}
          accessibilityLabel="switch"
          className="pb-2"
        >
          <Switch.Icon checked={formData.returns.accepted} />
          <Switch.Label text="switch" />
        </Switch.Root>
      </View>

      {formData.returns.accepted && (
        <>
          <View>
            <Text className="mb-2 text-base font-medium dark:text-gray-200">
              Return Period (Days)
            </Text>
            <TextInput
              value={formData.returns.period.toString()}
              onChangeText={(value) =>
                updateNestedForm('returns', 'period', parseInt(value))
              }
              placeholder="Enter return period"
              keyboardType="number-pad"
            />
          </View>

          <View>
            <Text className="mb-2 text-base font-medium dark:text-gray-200">
              Shipping Paid By
            </Text>
            <Select
              value={formData.returns.shippingPaidBy}
              onSelect={(value) =>
                updateNestedForm('returns', 'shippingPaidBy', value)
              }
              options={[
                { value: 'Buyer', label: 'Buyer' },
                { value: 'Seller', label: 'Seller' },
              ]}
              placeholder="Select who pays return shipping"
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ReturnsForm;
