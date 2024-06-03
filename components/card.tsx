import { Link } from 'expo-router';
import React from 'react';

import type { Post } from '@/api';
import { Image, Pressable, Text, View } from '@/ui';
import { Dots } from '@/ui/icons/dots';
import { Rate } from '@/ui/icons/rate';

type Props = Post;

const images = [
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515386474292-47555758ef2e?auto=format&fit=crop&w=800&q=80',
  'https://plus.unsplash.com/premium_photo-1666815503002-5f07a44ac8fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
];

export const Card = ({ id }: Props) => {
  return (
    <Link href={`/feed/${id}`} asChild>
      <Pressable className="ml-2">
        <View className="my-2 flex items-center justify-center overflow-hidden rounded-xl  border border-neutral-300 bg-white  dark:bg-neutral-900">
          <Image
            className="h-[125px] w-[125px] overflow-hidden rounded-t-xl"
            contentFit="contain"
            source={{
              uri: images[Math.floor(Math.random() * images.length)],
            }}
          />

          <View className="p-2">
            <Text className=" pt-3  text-sm font-bold ">TMA-2 HD Wireless</Text>
            <Text className=" py-1 text-sm font-bold text-[#FE3A30]">
              Rp. 1.500.000
            </Text>
            <View className="mt-2 flex w-full flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <Rate />
                <Text>4.6</Text>
              </View>
              <Text>86 Reviews</Text>
              <Dots />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
