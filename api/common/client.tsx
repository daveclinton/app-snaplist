import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const client = axios.create({
  baseURL: "https://snaplist-tdfh.onrender.com/api/v1",
  // baseURL: "http://157.173.202.98:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  async (config) => {
    const userData = await AsyncStorage.getItem("user-data");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      const token = parsedUserData.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem("user-data");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const isValidToken = (token: any) => {
  return !!token;
};

export const isAuthenticated = async () => {
  const userData = await getUserData();
  if (!userData) {
    return false;
  }
  const { access_token: token } = userData;
  return isValidToken(token);
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem("user-data");
    console.log("User data removed from AsyncStorage");
  } catch (error) {
    console.error("Error removing user data:", error);
  }
};
