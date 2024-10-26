import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Scan() {
  return (
    <>
      <Stack.Screen options={{ title: 'Scan' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(tabs)/home.tsx" title="Scan" />
      </Container>
    </>
  );
}
