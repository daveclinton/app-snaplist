import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  type FormComponentProps,
  type ListingFormData,
  type NestedKeys,
} from '@/api';
import BasicInfoForm from '@/components/Steps/basic-info';
import PricingForm from '@/components/Steps/pricing';
import ReturnsForm from '@/components/Steps/returns';
import ShippingForm from '@/components/Steps/shipping';
import SpecificsForm from '@/components/Steps/specifics-info';
import StepProgressIndicator from '@/components/Steps/step-progress';
import { Button, Text } from '@/ui';

const STEPS = [
  {
    id: 1,
    title: 'Basic Information',
    component: BasicInfoForm,
    validate: (data: ListingFormData) => {
      const errors: Record<string, string> = {};
      if (!data.title) errors.title = 'Title is required';
      if (!data.description) errors.description = 'Description is required';
      if (!data.categoryId) errors.category = 'Category is required';
      if (!data.condition) errors.condition = 'Condition is required';
      return errors;
    },
  },
  {
    id: 2,
    title: 'Product Details',
    component: SpecificsForm,
    validate: (data: ListingFormData) => {
      const errors: Record<string, string> = {};
      if (!data.specifics.manufacturer)
        errors.manufacturer = 'Manufacturer is required';
      if (!data.specifics.productName)
        errors.productName = 'Product name is required';
      if (!data.specifics.category) errors.category = 'Category is required';
      return errors;
    },
  },
  {
    id: 3,
    title: 'Price & Pictures',
    component: PricingForm,
    validate: (data: ListingFormData) => {
      const errors: Record<string, string> = {};
      if (!data.price) errors.price = 'Price is required';
      if (!data.pictures?.length)
        errors.pictures = 'At least one picture is required';
      return errors;
    },
  },
  {
    id: 4,
    title: 'Shipping',
    component: ShippingForm,
    validate: (data: ListingFormData) => {
      const errors: Record<string, string> = {};
      if (!data.shipping.service)
        errors.shippingService = 'Shipping service is required';
      if (!data.shipping.cost)
        errors.shippingCost = 'Shipping cost is required';
      if (!data.shipping.dispatchDays)
        errors.dispatchDays = 'Dispatch days is required';
      return errors;
    },
  },
  {
    id: 5,
    title: 'Returns Policy',
    component: ReturnsForm,
    validate: () => ({}),
  },
] as const;

const createListingPayload = (formData: ListingFormData) => ({
  title: formData.title,
  description: formData.description,
  categoryId: formData.categoryId,
  categoryName: formData.categoryName,
  price: parseFloat(formData.price),
  pictures: formData.pictures,
  specifics: formData.specifics,
  shipping: {
    service: formData.shipping.service,
    cost: parseFloat(formData.shipping.cost),
    dispatchDays: formData.shipping.dispatchDays,
  },
  returns: {
    accepted: formData.returns.accepted,
    period: formData.returns.period,
    shippingPaidBy: formData.returns.shippingPaidBy,
  },
});

export default function CreateListingScreen() {
  const router = useRouter();
  const { initialData } = useLocalSearchParams<{ initialData: string }>();
  const parsedInitialData: ListingFormData = JSON.parse(
    decodeURIComponent(initialData),
  );

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ListingFormData>(parsedInitialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const updateForm = (
    field: keyof ListingFormData,
    value: ListingFormData[typeof field],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const updateNestedForm = (parent: NestedKeys, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const validateStep = () => {
    const currentStep = STEPS[step - 1];
    const newErrors = currentStep.validate(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < STEPS.length) {
        setStep((s) => s + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = createListingPayload(formData);
      console.log('Submitting:', payload);
      const encodedInitialData = encodeURIComponent(JSON.stringify(payload));
      router.push({
        pathname: '/scan/post-listing',
        params: { initialData: encodedInitialData },
      });
    } catch (error) {
      console.error('Error creating listing:', error);
      setErrors({ submit: 'Failed to create listing. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[step - 1].component;
  const stepProps: FormComponentProps = {
    formData,
    updateForm,
    updateNestedForm,
    errors,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Scan Results',
          headerBackTitle: 'Feed',
          headerStyle: {
            backgroundColor: isDark ? '#030712' : '#f9fafb',
          },
          headerTintColor: isDark ? '#f3f4f6' : '#111827',
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StepProgressIndicator
          currentStep={step}
          totalSteps={STEPS.length}
          activeColor="#0284c7"
          inactiveColor="#d1d5db"
        />

        <View className="border-b border-gray-200 p-4 dark:border-gray-800">
          <Text className="text-xl font-bold dark:text-gray-100">
            {STEPS[step - 1].title}
          </Text>
        </View>

        <ScrollView className="flex-1">
          <CurrentStepComponent categories={[]} {...stepProps} />
        </ScrollView>

        {errors.submit && (
          <View className="bg-red-100 px-4 py-2 dark:bg-red-900">
            <Text className="text-red-600 dark:text-red-100">
              {errors.submit}
            </Text>
          </View>
        )}

        <View className="flex-row justify-between border-t border-gray-200 p-4 dark:border-gray-800">
          {step > 1 && (
            <Button
              variant="secondary"
              label="Back"
              onPress={() => setStep((s) => s - 1)}
            />
          )}
          <Button
            label={step < STEPS.length ? 'Next' : 'Create Listing'}
            onPress={handleNext}
            loading={isLoading}
            className="ml-auto"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
