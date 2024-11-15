import { useMMKVBoolean } from 'react-native-mmkv';

import { storage } from '../storage';

const USER_INITIATED = 'USER_INITIATED';

export const useInitiated = () => {
  const [isInitiated, setIsInitated] = useMMKVBoolean(USER_INITIATED, storage);
  if (isInitiated === undefined) {
    return [false, setIsInitated] as const;
  }
  return [isInitiated, setIsInitated] as const;
};
