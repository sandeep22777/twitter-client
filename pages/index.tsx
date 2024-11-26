import localFont from "next/font/local";
import {
  BiHash,
  BiHomeCircle,
  BiImageAlt,
  BiMoney,
  BiUser,
} from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";

import FeedCard from "@/components/FeedCards";
import { SlOptions } from "react-icons/sl";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCreateTweetMutation, useGetAllTweets } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

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
  const { user } = useCurrentUser();
  const { tweets = [] } = useGetAllTweets();

  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      console.log(googleToken, "googletoken");
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

      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },

    []
  );

  const { mutate } = useCreateTweetMutation();

  const handleCreateTweet = useCallback(() => {
    mutate({
      content,
    });
    setContent("");
  }, [content, mutate]);

  const handleSelectImage = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen pl-56">
        <div className="col-span-3 flex flex-col justify-start items-start pl-56 pt-8 mr-16 relative">
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
          {user && (
            <div className=" absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
              {user && user.profileImageUrl && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageUrl}
                  alt="profile image"
                  width={50}
                  height={50}
                />
              )}
              <div className="flex gap-3 pr-2">
                <h3 className="text-xl">{user.firstName}</h3>
                <h3 className="text-xl">{user.lastName}</h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll no-scrollbar  border-gray-600">
          <div className="border border-r-0 border-l-0 border-b-0 border-gray-200 p-5 hover:bg-slate-900 transition-all cursor-pointer">
            <div className="grid grid-cols-12 gap-4">
              {user?.profileImageUrl && (
                <div className="col-span-1">
                  <Image
                    src={user && user?.profileImageUrl}
                    alt="profile picture"
                    width="64"
                    height="64"
                    className="rounded-full"
                  />
                </div>
              )}
              <div className="col-span-11 ">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-transparent text-2xl px-2 py-4 border-b  border-gray-600"
                  placeholder="what's happening"
                  rows={4}
                ></textarea>
                <div className="pb-8 flex justify-between items-center mt-2 ">
                  <BiImageAlt
                    className="text-2xl hover:bg-blue-600"
                    onClick={handleSelectImage}
                  />
                  <button
                    onClick={handleCreateTweet}
                    className=" rounded-full bg-[#1d9bf0] w-fit px-12  py-2 cursor-pointer font-semibold"
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet) =>
            tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
          )}
        </div>
        <div className="col-span-3 p-5">
          {!user && (
            <div className=" p-5 bg-slate rounded-lg">
              <h1 className="my-2 text-2xl">New to Twitter?</h1>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
