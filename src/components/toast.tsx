import {
  AlertCircle,
  Check,
  Info,
  type LucideIcon,
  XCircle,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import RootSiblings from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TIMEOUT = 2000;

type ToastType = 'success' | 'error' | 'info' | 'warning';

const IconMap: Record<ToastType, LucideIcon> = {
  success: Check,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export function show(message: string, type: ToastType = 'success') {
  if (process.env.NODE_ENV === 'test') return;
  const item = new RootSiblings(<Toast message={message} type={type} />);
  setTimeout(() => {
    item.destroy();
  }, TIMEOUT + 1000);
}

const getIconColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'text-cyan-600 dark:text-cyan-200';
    case 'error':
      return 'text-red-600 dark:text-red-200';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-200';
    case 'info':
      return 'text-cyan-600 dark:text-cyan-200';
    default:
      return 'text-cyan-600 dark:text-cyan-200';
  }
};

const getIconBgColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-cyan-100 dark:bg-cyan-800';
    case 'error':
      return 'bg-red-100 dark:bg-red-800';
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-800';
    case 'info':
      return 'bg-cyan-100 dark:bg-cyan-800';
    default:
      return 'bg-cyan-100 dark:bg-cyan-800';
  }
};

function Toast({ message, type }: { message: string; type: ToastType }) {
  const { top } = useSafeAreaInsets();
  const [alive, setAlive] = useState(true);
  const Icon = IconMap[type];
  const iconColor = getIconColor(type);
  const iconBgColor = getIconBgColor(type);

  useEffect(() => {
    setTimeout(() => {
      setAlive(false);
    }, TIMEOUT);
  }, []);

  return (
    <View
      className="pointer-events-none absolute inset-x-4"
      style={{ top: top + 15 }}
    >
      {alive && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutUp}
          className="flex-1 flex-row gap-4 rounded-sm border border-cyan-200 bg-white px-4 py-5 shadow-lg dark:border-cyan-800 dark:bg-cyan-950"
        >
          <View
            className={`size-8 shrink-0 items-center justify-center rounded-full ${iconBgColor}`}
          >
            <Icon size={16} className={iconColor} strokeWidth={2.5} />
          </View>
          <View className="h-full flex-1 justify-center">
            <Text className="text-base text-cyan-900 dark:text-cyan-50">
              {message}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default Toast;
