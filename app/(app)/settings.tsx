/* eslint-disable react/react-in-jsx-scope */
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import { logout } from "@/api/common/client";
import { Item } from "@/components/settings/item";
import { ItemsContainer } from "@/components/settings/items-container";
import { colors, FocusAwareStatusBar, ScrollView, View } from "@/ui";
import { Rate, Share, Support } from "@/ui/icons";

export default function Settings() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const { colorScheme } = useColorScheme();
  const iconColor =
    colorScheme === "dark" ? colors.neutral[400] : colors.neutral[500];
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="flex-1 px-4 pt-1 ">
          <ItemsContainer>
            <Item text="Notifications" icon={<Share color={iconColor} />} />
            <Item text="Privacy" icon={<Rate color={iconColor} />} />
            <Item text="Manage Account" icon={<Support color={iconColor} />} />
            <Item text="Saved" icon={<Share color={iconColor} />} />
            <Item text="About" icon={<Share color={iconColor} />} />
            <Item
              text="Logout"
              onPress={() => {
                handleLogout();
                router.replace("/onboarding");
              }}
            />
          </ItemsContainer>
        </View>
      </ScrollView>
    </>
  );
}
