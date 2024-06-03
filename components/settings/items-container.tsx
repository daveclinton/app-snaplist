import React from "react";

import { Text, View } from "@/ui";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export const ItemsContainer = ({ children, title }: Props) => {
  return (
    <>
      {title && <Text className="py-4 text-lg" />}
      {
        <View className="border-t-[1px] border-neutral-200 px-4 py-2">
          {children}
        </View>
      }
    </>
  );
};
