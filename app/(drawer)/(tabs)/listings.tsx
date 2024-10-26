import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Listings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Listings' }} />
      <Container>
        <ScreenContent path="app/(drawer)/(tabs)/listings" title="Listings" />
      </Container>
    </>
  );
}
