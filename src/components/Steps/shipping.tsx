import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { type ShippingFormProps } from '@/api';

const ShippingForm = ({ formData, updateNestedForm }: ShippingFormProps) => {
  return (
    <View className="space-y-4 p-4">
      <View>
        <Text className="mb-2 text-base font-medium dark:text-gray-200">
          Shipping Service
        </Text>
        <TextInput
          value={formData.shipping.service}
          onChangeText={(value) =>
            updateNestedForm('shipping', 'service', value)
          }
          placeholder="Enter shipping service"
        />
      </View>
      <View>
        <Text className="mb-2 text-base font-medium dark:text-gray-200">
          Shipping Cost
        </Text>
        <TextInput
          value={formData.shipping.cost.toString()}
          onChangeText={(value) =>
            updateNestedForm('shipping', 'cost', parseFloat(value))
          }
          placeholder="Enter shipping cost"
          keyboardType="decimal-pad"
        />
      </View>
      <View>
        <Text className="mb-2 text-base font-medium dark:text-gray-200">
          Dispatch Days
        </Text>
        <TextInput
          value={formData.shipping.dispatchDays.toString()}
          onChangeText={(value) =>
            updateNestedForm('shipping', 'dispatchDays', parseInt(value))
          }
          placeholder="Enter dispatch days"
          keyboardType="number-pad"
        />
      </View>
    </View>
  );
};

export default ShippingForm;
