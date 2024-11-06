import * as React from 'react';

import RecentListings from '@/components/recent-listings';
import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/ui';

import { userData } from '.';

export default function Style() {
  return (
    <SafeAreaView>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <RecentListings scans={userData.recentScans} />
      </ScrollView>
    </SafeAreaView>
  );
}
