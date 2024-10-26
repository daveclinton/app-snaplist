import { Stack } from 'expo-router';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { useSession } from '~/context/SessionContext';

export default function Home() {
  const { signOut } = useSession();

  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <ScreenContent path="app/(drawer)/index.tsx" title="Home" />
        <Button title="Sign Out" onPress={signOut} />
      </Container>
    </>
  );
}
