/* eslint-disable max-lines-per-function */
import React from "react";
import { TextInput } from "react-native";

import {
  FocusAwareStatusBar,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "@/ui";
import { CaretDown } from "@/ui/icons";
import { SearchIcon } from "@/ui/icons/search";

export default function Help() {
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1  p-6">
        <View className="flex flex-row items-center rounded-xl border-[0.5px]  border-neutral-300 bg-[#FAFAFA] px-2.5">
          <TouchableOpacity className="mr-2">
            <SearchIcon />
          </TouchableOpacity>
          <TextInput
            className="h-[50px] flex-1"
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
            value=""
          />
        </View>
        <View className="mt-3 flex flex-row justify-around">
          <Text className="text-md font-semibold text-[#2A2661] ">FAQs</Text>
          <Text>Contact Us</Text>
        </View>
        <ScrollView
          className="mt-4"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View className="mr-2 items-center rounded-md bg-[#2A2661] px-4 py-2">
            <Text className="text-white">All</Text>
          </View>
          <View className="mr-2 items-center rounded-md bg-[#C4C5C4] px-4 py-2">
            <Text className="text-white">Services</Text>
          </View>
          <View className="mr-2 items-center rounded-md bg-[#C4C5C4] px-4 py-2">
            <Text className="text-white">Account</Text>
          </View>
          <View className="mr-2 items-center rounded-md bg-[#C4C5C4] px-4 py-2">
            <Text className="text-white">Generate</Text>
          </View>
          <View className="items-center rounded-md bg-[#C4C5C4] px-4 py-2">
            <Text className="text-white">Markets</Text>
          </View>
        </ScrollView>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between border-b-[0.5px] pb-4">
            <Text className="text-md font-semibold">
              How do i do something on SnapLite?
            </Text>
            <CaretDown />
          </View>
          <Text>
            Lorem ipsum dolor sit amet consectetur. Vitae rhoncus condimentum
            rhoncus tortor enim eget elit. Sapien vel sit eget morbi lorem. Amet
            at gravida auctor id. Cursus mollis mi arcu magna nibh. Donec.
          </Text>
        </View>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-md font-semibold">
              Lorem ipsum dolor sit amet
            </Text>
            <CaretDown />
          </View>
        </View>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-md font-semibold">
              Lorem ipsum dolor sit amet
            </Text>
            <CaretDown />
          </View>
        </View>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-md font-semibold">
              Lorem ipsum dolor sit amet
            </Text>
            <CaretDown />
          </View>
        </View>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-md font-semibold">
              Lorem ipsum dolor sit amet
            </Text>
            <CaretDown />
          </View>
        </View>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-md font-semibold">
              Lorem ipsum dolor sit amet
            </Text>
            <CaretDown />
          </View>
        </View>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-md font-semibold">
              Lorem ipsum dolor sit amet
            </Text>
            <CaretDown />
          </View>
        </View>
        <View className="mt-4 w-full gap-y-5 rounded-lg border-2 border-[#EDEDED]  px-2 py-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-md font-semibold">
              Lorem ipsum dolor sit amet
            </Text>
            <CaretDown />
          </View>
        </View>
      </ScrollView>
    </>
  );
}
