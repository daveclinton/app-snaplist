import { getItem, removeItem, setItem } from '@/core/storage';

const TOKEN = 'token';

const USER_SESSION_ID = 'user_session_id';

export type TokenType = {
  access: string;
  refresh: string;
};

export const getToken = () => getItem<TokenType>(TOKEN);
export const removeToken = () => removeItem(TOKEN);
export const setToken = (value: TokenType) => setItem<TokenType>(TOKEN, value);

export const getUserSessionId = () => getItem<string>(USER_SESSION_ID);
export const removeUserSessionId = () => removeItem(USER_SESSION_ID);
export const setUserSessionId = (value: string) =>
  setItem<string>(USER_SESSION_ID, value);
