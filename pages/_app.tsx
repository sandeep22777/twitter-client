import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Inter, Quicksand } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const inter = Inter({ subsets: ["latin"] });
const quickSand = Quicksand({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider
        clientId={
          "641581268225-mmi68mc4k3n1nd20lofej4o0hbv8rjlv.apps.googleusercontent.com"
        }
      >
        <div className={inter.className}>
          <Component {...pageProps} />
          <Toaster />
          <ReactQueryDevtools />
        </div>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}
