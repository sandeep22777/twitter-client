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
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { GetServerSideProps } from "next";
import { getAllTweets } from "@/graphql/query/tweet";

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

interface HomeProps {
  tweets?: Tweet[];
}

export default function Home(props: HomeProps) {
  const { user } = useCurrentUser();
  // const { tweets = [] } = useGetAllTweets();

  const [content, setContent] = useState("");

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
      <TwitterLayout>
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
        {props.tweets?.map((tweet) =>
          tweet ? <FeedCard key={tweet?.id} data={tweet as Tweet} /> : null
        )}
      </TwitterLayout>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const allTweets = await graphqlClient.request(getAllTweets);

  return {
    props: {
      tweets: allTweets.getAllTweets as Tweet[],
    },
  };
};
