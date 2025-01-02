import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { type ReturnsFormProps } from '@/api';
import { Select, Switch, Text, View } from '@/ui';

const ReturnsForm = ({ formData, updateNestedForm }: ReturnsFormProps) => {
  return (
    <View style={styles.container}>
      {/* Accept Returns Toggle */}
      <View style={styles.toggleContainer}>
        <Text style={styles.label}>Accept Returns</Text>
        <Switch.Root
          checked={formData.returns.accepted}
          onChange={(value) => updateNestedForm('returns', 'accepted', value)}
          accessibilityLabel="switch"
        >
          <Switch.Icon checked={formData.returns.accepted} />
          <Switch.Label text="switch" />
        </Switch.Root>
      </View>

      {/* Conditional Fields */}
      {formData.returns.accepted && (
        <>
          {/* Return Period */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Return Period (Days)</Text>
            <TextInput
              value={formData.returns.period.toString()}
              onChangeText={(value) =>
                updateNestedForm('returns', 'period', parseInt(value || '0'))
              }
              placeholder="Enter return period"
              keyboardType="number-pad"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Shipping Paid By */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Shipping Paid By</Text>
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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

export default ReturnsForm;
