import { Link } from 'expo-router';
import { Box, ChevronRight, Store } from 'lucide-react-native';
import React from 'react';

import { type RecentScan } from '@/api/user/types';
import { Text, TouchableOpacity, View } from '@/ui';

const RecentListings = ({
  scans,
  viewAll = false,
}: {
  scans: RecentScan[];
  viewAll?: boolean;
}) => {
  if (scans.length === 0) {
    return (
      <View className="mb-6 items-center justify-center">
        <View className="mb-4 w-full flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Listings
          </Text>
          {viewAll && (
            <View className="flex-row items-center">
              <Link
                href="/(app)/listings"
                className="mr-1 text-sm text-cyan-600 dark:text-cyan-400"
              >
                View All
              </Link>
              <ChevronRight size={16} color="#0891b2" />
            </View>
          )}
        </View>

        <View className="w-full items-center rounded-xl bg-white p-6 dark:bg-gray-800">
          <View className="mb-4 size-24 items-center justify-center rounded-full bg-cyan-50 dark:bg-cyan-900">
            <Box size={48} color="#0891b2" strokeWidth={1.5} />
          </View>

          <Text className="mb-2 text-center text-xl font-semibold text-gray-900 dark:text-white">
            No Recent Listings
          </Text>

          <Text className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Looks like you haven't scanned any listings yet. Start exploring and
            add your first listing!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Listings
        </Text>
        {viewAll && (
          <View className="flex-row items-center">
            <Link
              href="/(app)/listings"
              className="mr-1 text-sm text-cyan-600 dark:text-cyan-400"
            >
              View All
            </Link>
            <ChevronRight size={16} color="#0891b2" />
          </View>
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
};

export default RecentListings;
