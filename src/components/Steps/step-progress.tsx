import { CheckCircle, Circle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  activeColor?: string;
  inactiveColor?: string;
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  activeColor = '#0284c7',
  inactiveColor = '#d1d5db',
}) => {
  return (
    <View className="flex-row justify-between bg-gray-50 px-4 py-2 dark:bg-gray-800">
      {Array.from({ length: totalSteps }, (_, index) => index + 1).map(
        (step) => (
          <View key={step} className="flex flex-col items-center">
            {step <= currentStep ? (
              <CheckCircle color={activeColor} size={24} />
            ) : (
              <Circle color={inactiveColor} size={24} />
            )}
            <Text
              className={`mt-1 text-sm ${
                step <= currentStep
                  ? `text-[${activeColor}]`
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Step {step}
            </Text>
          </View>
        ),
      )}
    </View>
  );
};

export default StepProgressIndicator;
