/* eslint-disable max-lines-per-function */
import * as React from 'react';

import { MyBarChart } from '@/components/bar-chart';
import DonutChart from '@/components/donut-chart';
import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/ui';

const MarketCircle = ({ color }: { color: string }) => {
  return <View className={`bg-[${color}] h-4 w-4 rounded-full`} />;
};

export default function Metrics() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView className="px-4">
        <SafeAreaView className="flex-1">
          <View className="mt-4 w-full gap-y-5 rounded-lg bg-[#FAFAFA] px-2 py-4">
            <Text className="text-lg font-bold">Earned Total</Text>
            <View className="flex flex-row items-center justify-between">
              <MyBarChart />
              <Text className="text-xl font-bold">$95.550</Text>
            </View>
            <View className="mt-4 w-full rounded-lg bg-[#FAFAFA] px-2 py-4">
              <View className="mt-2 flex w-full flex-row justify-between">
                <View className="flex gap-y-3">
                  <Text className="text-lg font-semibold text-[#000000]">
                    Last Income
                  </Text>
                  <View className="flex  items-center rounded-md bg-[#323232]">
                    <Text className=" text-white">Apr-Jun</Text>
                  </View>
                </View>
                <DonutChart />
                <View className="flex justify-between">
                  <View>
                    <Text className="text-lg font-semibold">+ 55%</Text>
                    <Text className="font-semibold">month to month</Text>
                  </View>
                  <Text className="text-sm font-semibold">
                    Increase $459.98
                  </Text>
                </View>
              </View>
              <View className="mt-4 flex flex-row justify-start gap-2">
                <View className="flex items-center justify-center rounded-lg bg-[#3DD34C] p-3 align-middle">
                  <Text className="text-base text-white">Ebay</Text>
                </View>
                <View className="flex items-center justify-center rounded-lg bg-[#414CAA] p-3 align-middle">
                  <Text className="text-base text-white">Mercadi</Text>
                </View>
                <View className="flex items-center justify-center rounded-lg bg-[#2280FF] p-3 align-middle">
                  <Text className="text-base text-white">FB Marketplace</Text>
                </View>
              </View>
            </View>
            <View className="mt-4 w-full gap-y-5 rounded-lg bg-[#FAFAFA] px-2 py-4">
              <Text className="text-lg font-semibold">Platform Breakdown</Text>
              <View className="flex  flex-row justify-start gap-3">
                <View className=" flex flex-row items-center gap-2">
                  <MarketCircle color="#3DD34C" />
                  <Text>Ebay</Text>
                </View>
                <View className=" flex flex-row items-center gap-2">
                  <MarketCircle color="#414CAA" />
                  <Text>Mercari</Text>
                </View>
                <View className=" flex flex-row items-center gap-2">
                  <MarketCircle color="#2280FF" />
                  <Text>FB Marketplace</Text>
                </View>
              </View>
              <View className="flex gap-3">
                <View className="h-3 w-full rounded-md bg-[#2280FF]" />
                <View className="h-3 w-[40%] rounded-md bg-[#3DD34C]" />
                <View className="h-3 w-[70%] rounded-md bg-[#414CAA]" />
                <View className="h-3 w-[57%] rounded-md bg-[#3DD34C]" />
                <View className="h-3 w-[30%] rounded-md bg-[#2280FF]" />
                <View className="h-3 w-[87%] rounded-md bg-[#3DD34C]" />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
