import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'reset-password',
};

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="reset-password"
        options={{ title: 'Reset Password' }}
      />
    </Stack>
  );
}
