import { showNotification } from "@mantine/notifications";
import axios, { AxiosError } from "axios";
import getConfig from "next/config";

interface Config {
  method: string;
  url: string;
  data?: any;
  params?: any;
  headers?: any;
  timeout?: number;
}

export const UseApi = async (config: Config) => {
  const { publicRuntimeConfig } = getConfig();
  // Axios interceptor
  const axiosInstance = axios.create({
    baseURL: publicRuntimeConfig.API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const response = await axiosInstance.request(config);
    return response;
  } catch (error: any | AxiosError) {
    console.error("UseApi error: ", error);
    showNotification({
      autoClose: 5000,
      title: "Request Failed",
      message: error.response.data.message,
      styles: (theme) => ({
        root: {
          backgroundColor: theme.colors.red[6],
          borderColor: theme.colors.red[6],

          "&::before": { backgroundColor: theme.white },
        },

        title: { color: theme.white },
        description: { color: theme.white },
        closeButton: {
          color: theme.white,
          "&:hover": { backgroundColor: theme.colors.blue[7] },
        },
      }),
    });
    throw error;
  }
};
