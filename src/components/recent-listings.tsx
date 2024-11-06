import { ChevronRight, Store } from 'lucide-react-native';

import { type userData } from '@/app/(app)';
import { Text, TouchableOpacity, View } from '@/ui';

const RecentListings = ({
  scans,
  viewAll = false,
}: {
  scans: typeof userData.recentScans;
  viewAll?: boolean;
}) => (
  <View className="mb-6">
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
        Recent Listings
      </Text>
      {viewAll && (
        <TouchableOpacity className="flex-row items-center">
          <Text className="mr-1 text-sm  text-cyan-600 dark:text-cyan-400">
            View All
          </Text>
          <ChevronRight size={16} color="#0891b2" />
        </TouchableOpacity>
      )}
    </View>

    {scans.map((scan) => (
      <TouchableOpacity
        key={scan.id}
        className="mb-3 rounded-xl bg-white p-4 dark:bg-gray-800"
        activeOpacity={0.7}
      >
        <View className="flex-row">
          <View className="mr-3 size-16 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
            <Store size={24} color="#94a3b8" />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-base font-medium text-gray-900 dark:text-white">
              {scan.name}
            </Text>
            <Text
              className="mb-2 text-sm text-gray-500 dark:text-gray-400"
              numberOfLines={1}
            >
              {scan.description}
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row">
                {scan.postedOn.map((platform) => (
                  <View
                    key={platform}
                    className="mr-2 rounded-full bg-cyan-50 px-2 py-1 dark:bg-cyan-900"
                  >
                    <Text className="text-xs text-cyan-600 dark:text-cyan-300">
                      {platform}
                    </Text>
                  </View>
                ))}
              </View>
              <Text className="text-xs text-gray-400 dark:text-gray-500">
                {scan.date}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

export default RecentListings;
