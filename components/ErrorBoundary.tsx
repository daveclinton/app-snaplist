import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          error={this.state.error!}
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorScreenProps {
  error: Error;
  onReset: () => void;
}

export const ErrorScreen = ({ error, onReset }: ErrorScreenProps) => (
  <View className="bg-background-primary flex-1 items-center justify-center p-4">
    <Text className="mb-2 text-xl font-bold text-red-500">Oops! Something went wrong</Text>
    <Text className="mb-6 text-center text-sm text-neutral-600">{error.message}</Text>
    <Pressable onPress={onReset} className="bg-primary rounded-md px-6 py-3">
      <Text className="font-medium text-white">Try Again</Text>
    </Pressable>
  </View>
);
