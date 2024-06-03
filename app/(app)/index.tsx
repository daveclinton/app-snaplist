/* eslint-disable max-lines-per-function */
import { MasonryFlashList } from "@shopify/flash-list";
import React from "react";
import { TextInput } from "react-native";

import { Card } from "@/components/card";
import {
  EmptyList,
  FocusAwareStatusBar,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "@/ui";
import { CameraSvg } from "@/ui/icons/camera";
import { MenuIcon } from "@/ui/icons/menu";
import { SearchIcon } from "@/ui/icons/search";
import { usePosts } from "@/api/use-posts";

const Maercari = require("../../assets/mercari.svg");
const Facebook = require("../../assets/facebook.svg");
const Ebay = require("../../assets/ebay.svg");
const EmptyState = require("../../assets/emptyState.svg");

export default function Feed() {
  const { data, isLoading, isError } = usePosts();
  const renderItem = React.useCallback(
    ({ item }: { item: any }) => <Card {...item} />,
    []
  );

  if (isError) {
    return (
      <>
        <FocusAwareStatusBar />
        <View className="flex-1 justify-center items-center p-6">
          <View className="h-36 w-36">
            <Image
              source={EmptyState}
              className=" h-full w-full overflow-hidden"
            />
          </View>
          <Text> Error Loading data </Text>
        </View>
      </>
    );
  }
  return (
    <>
      <FocusAwareStatusBar />
      <View className="flex-1 justify-center p-6">
        <View className="flex flex-row items-center rounded-xl border-[0.5px]  border-neutral-300 bg-[#FAFAFA] px-2.5">
          <TouchableOpacity className="mr-2">
            <SearchIcon />
          </TouchableOpacity>
          <TextInput
            className="h-[50px] flex-1"
            placeholder="Search my items"
            autoCapitalize="none"
            autoCorrect={false}
            value=""
          />
          <TouchableOpacity>
            <CameraSvg />
          </TouchableOpacity>
        </View>
        <Text className="text-md ml-6 mt-4 font-semibold">Platforms</Text>
        <View className="mb-4 flex w-full flex-row justify-around">
          <View className="justify-cente flex  items-center">
            <View className="h-12 w-12 items-center justify-center rounded-md shadow-lg shadow-white">
              <MenuIcon />
            </View>
            <Text className="font-bold !text-[#393392] underline">All</Text>
          </View>
          <View className="justify-cente flex  items-center">
            <View className="h-12 w-12 items-center justify-center rounded-md shadow-lg shadow-white">
              <Image source={Ebay} className="h-full w-full overflow-hidden" />
            </View>
            <Text className="font-bold">Ebay</Text>
          </View>
          <View className="justify-cente flex  items-center">
            <View className="h-12 w-12 items-center justify-center rounded-md shadow-lg shadow-white">
              <Image
                source={Facebook}
                className="h-full w-full overflow-hidden"
              />
            </View>
            <Text className="font-bold">Facebook</Text>
          </View>
          <View className="justify-cente flex  items-center">
            <View className="h-12 w-12 items-center justify-center rounded-md shadow-lg shadow-white">
              <Image
                source={Maercari}
                className="h-full w-full overflow-hidden"
              />
            </View>
            <Text className="font-bold">Mercari</Text>
          </View>
        </View>
        <MasonryFlashList
          data={data as any}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(_, index) => `item-${index}`}
          ListEmptyComponent={<EmptyList isLoading={isLoading} />}
          estimatedItemSize={300}
        />
      </View>
    </>
  );
}
