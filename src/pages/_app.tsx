import MainLayout from "@/components/layouts/Main";
import "@/styles/globals.css";
import App, { AppContext } from "next/app";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NotificationsProvider } from "@mantine/notifications";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "eos-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const queryClient = new QueryClient();

  return (
    <>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{
            fontFamily: "Inter, sans-serif",
            colorScheme,
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>

                <ReactQueryDevtools
                  initialIsOpen={false}
                  position="bottom-left"
                />
              </Hydrate>
            </QueryClientProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
