import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { Inter, Quicksand } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const quickSand = Quicksand({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider
      clientId={
        "641581268225-mmi68mc4k3n1nd20lofej4o0hbv8rjlv.apps.googleusercontent.com"
      }
    >
      <div className={inter.className}>
        <Component {...pageProps} />
        <Toaster />
      </div>
    </GoogleOAuthProvider>
  );
}
