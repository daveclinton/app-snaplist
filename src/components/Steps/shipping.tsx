import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { type ShippingFormProps } from '@/api';

const ShippingForm = ({
  formData,
  updateNestedForm,
  updateForm,
}: ShippingFormProps) => {
  return (
    <View style={styles.container}>
      {/* Shipping Service */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Shipping Service</Text>
        <TextInput
          value={formData.shipping.service}
          onChangeText={(value) =>
            updateNestedForm('shipping', 'service', value)
          }
          placeholder="Enter shipping service"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Shipping Cost */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Shipping Cost</Text>
        <TextInput
          value={formData.shipping.cost.toString()}
          onChangeText={(value) =>
            updateNestedForm('shipping', 'cost', parseFloat(value || '0'))
          }
          placeholder="Enter shipping cost"
          keyboardType="decimal-pad"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Dispatch Days */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Dispatch Days</Text>
        <TextInput
          value={formData.shipping.dispatchDays.toString()}
          onChangeText={(value) =>
            updateNestedForm('shipping', 'dispatchDays', parseInt(value || '0'))
          }
          placeholder="Enter dispatch days"
          keyboardType="number-pad"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Stock Quantity */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Stock Quantity</Text>
        <TextInput
          value={formData.stock_quantity?.toString() || ''}
          onChangeText={(value) =>
            updateForm('stock_quantity', parseInt(value || '0'))
          }
          placeholder="Enter stock quantity"
          keyboardType="number-pad"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Discount Percentage */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Discount Percentage</Text>
        <TextInput
          value={formData.discount_percentage?.toString() || ''}
          onChangeText={(value) =>
            updateForm('discount_percentage', parseFloat(value || '0'))
          }
          placeholder="Enter discount percentage"
          keyboardType="decimal-pad"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Tags */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tags</Text>
        <TextInput
          value={formData.tags?.join(', ') || ''}
          onChangeText={(value) =>
            updateForm(
              'tags',
              value.split(',').map((tag) => tag.trim()),
            )
          }
          placeholder="Enter tags (comma-separated)"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
});

export default ShippingForm;
