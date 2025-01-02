import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

const PriceInput = ({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatPrice = (input: string) => {
    // Remove all non-numeric characters except for the decimal point
    let cleaned = input.replace(/[^0-9.]/g, '');

    // Split into whole and decimal parts
    const parts = cleaned.split('.');

    // If there are more than two parts (multiple decimal points), return the previous value
    if (parts.length > 2) return value;

    // If there is a decimal part, limit it to 2 digits
    if (parts[1]?.length > 2) {
      cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    // Prevent leading zeros unless it's a decimal
    if (parts[0].length > 1 && parts[0][0] === '0' && parts[0][1] !== '.') {
      cleaned = parts[0].substring(1) + (parts[1] ? `.${parts[1]}` : '');
    }

    return cleaned;
  };

  const handleChangeText = (text: string) => {
    const formattedText = formatPrice(text);
    setDisplayValue(formattedText);
    onChangeText(formattedText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.currencyContainer}>
        <Text style={styles.currencySymbol}>$</Text>
      </View>
      <TextInput
        value={displayValue}
        onChangeText={handleChangeText}
        placeholder="0.00"
        keyboardType="decimal-pad"
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#9CA3AF"
        accessibilityLabel="Price input"
        accessibilityHint="Enter the price in dollars and cents"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 16,
  },
  currencyContainer: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingLeft: 50, // Adjust padding to accommodate the currency symbol
    paddingRight: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 4,
    color: '#EF4444',
    fontSize: 14,
  },
});

export default PriceInput;
