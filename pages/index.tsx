import localFont from "next/font/local";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";

import FeedCard from "@/components/FeedCards";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

interface TwitterSidebarButtons {
  title: string;
  icon: React.ReactNode;
}

const sideBarMenuItems: TwitterSidebarButtons[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "More Options",
    icon: <SlOptions />,
  },
];

export default function Home() {
  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) {
        return toast.error(`Google Token Not found`);
      }

      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        {
          token: googleToken,
        }
      );

      toast.success("Verified Success");
      console.log(verifyGoogleToken, "vgt");

      if (verifyGoogleToken)
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);
    },
    []
  );
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen pl-56">
        <div className="col-span-3 flex flex-col justify-start items-start pl-56 pt-8 mr-16">
          <div className="text-6xl hover:bg-gray-300 rounded-full h-fit w-fit p-4 cursor-pointer transition-all">
            <BsTwitter />
          </div>
          <div className=" mt-4 text-2xl font-semibold flex flex-col ">
            <ul>
              {sideBarMenuItems.map((item) => (
                <li
                  key={item.title}
                  className="flex justify-start items-center gap-6 hover:bg-gray-800 rounded-full w-fit px-6 py-6 cursor-pointer mt-2"
                >
                  <span className="text-4xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button className=" rounded-full bg-[#1d9bf0] w-fit px-24  py-6 cursor-pointer font-semibold">
                Tweet
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll no-scrollbar  border-gray-600">
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
        <div className="col-span-3 p-5">
          <div className=" p-5 bg-slate rounded-lg">
            <h1 className="my-2 text-2xl">New to Twitter?</h1>
            <GoogleLogin onSuccess={handleLoginWithGoogle} />
          </div>
        </div>
      </div>
    </div>
  );
}
