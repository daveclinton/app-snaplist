/* eslint-disable max-lines-per-function */
/* eslint-disable react/no-unstable-nested-components */
import { Link, SplashScreen, Tabs, useRouter } from "expo-router";
import React, { useCallback, useEffect } from "react";

import { isAuthenticated } from "@/api/common/client";
import { Pressable, View } from "@/ui";
import { Feed as FeedIcon, Settings as SettingsIcon } from "@/ui/icons";
import { ArrowLeft } from "@/ui/icons/arrow-left";
import { Help } from "@/ui/icons/help";
import { ListItem } from "@/ui/icons/list-icon";
import { Metrics } from "@/ui/icons/metrics";
import { Notifications } from "@/ui/icons/notifications";

export default function TabLayout() {
  const router = useRouter();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      if (authStatus) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      hideSplash();
    }, 1000);
  }, [hideSplash]);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          headerRight: () => <CreateNewPostLink />,
          tabBarTestID: "feed-tab",
          headerTitleAlign: "center",
          tabBarActiveTintColor: "#2A2661",
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          },
          headerRightContainerStyle: {
            alignItems: "flex-end",
          },
        }}
      />
      <Tabs.Screen
        name="metrics"
        options={{
          title: "Metrics",
          tabBarIcon: ({ color }) => <Metrics color={color} />,
          tabBarActiveTintColor: "#2A2661",
          tabBarTestID: "style-tab",
          headerTitleAlign: "center",
          headerRight: () => <CreateNewPostLink />,
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          },
          headerRightContainerStyle: {
            alignItems: "flex-end",
          },
        }}
      />
      <Tabs.Screen
        name="list-item"
        options={{
          title: "List Item",
          tabBarIcon: ({ color }) => <ListItem color={color} />,
          tabBarActiveTintColor: "#2A2661",
          tabBarTestID: "settings-tab",
          headerTitleAlign: "center",
          headerRight: () => <CreateNewPostLink />,
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          },
          headerRightContainerStyle: {
            alignItems: "flex-end",
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          headerLeft: () => (
            <View className="ml-10">
              <ArrowLeft />
            </View>
          ),
          tabBarActiveTintColor: "#2A2661",
          tabBarTestID: "settings-tab",
          headerTitleAlign: "center",
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          },
          headerRightContainerStyle: {
            alignItems: "flex-end",
          },
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: "Help",
          tabBarIcon: ({ color }) => <Help color={color} />,
          headerRight: () => <CreateNewPostLink />,
          headerLeft: () => (
            <View className="ml-10">
              <ArrowLeft />
            </View>
          ),
          tabBarActiveTintColor: "#2A2661",

          tabBarTestID: "settings-tab",
          headerTitleAlign: "center",
          headerStyle: {
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
          },
          headerRightContainerStyle: {
            alignItems: "flex-end",
          },
        }}
      />
    </Tabs>
  );
}

const CreateNewPostLink = () => {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable className="mr-10">
        <Notifications />
      </Pressable>
    </Link>
  );
};
