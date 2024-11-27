import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useCallback, useMemo } from "react";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsEnvelope, BsBookmark, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { graphqlClient } from "@/clients/api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { it } from "node:test";

interface TwitterLayoutProps {
  children: React.ReactNode;
}

interface TwitterSidebarButtons {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const sideBarMenuItems: TwitterSidebarButtons[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <BsBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BsBookmark />,
        link: "/",
      },
      {
        title: "Twitter Blue",
        icon: <BiMoney />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BiUser />,
        link: `/${user?.id}`,
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "More Options",
        icon: <SlOptions />,
        link: "/",
      },
    ],
    [user?.id]
  );
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

  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className="col-span-2 sm:col-span-3 flex  sm:justify-end items-start pt-8 mr-16 relative">
          <div>
            <div className="text-6xl hover:bg-gray-300 rounded-full h-fit w-fit p-4 cursor-pointer transition-all">
              <BsTwitter />
            </div>
            <div className=" mt-4 text-2xl font-semibold flex flex-col ">
              <ul>
                {sideBarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.link}
                      className="flex justify-start items-center gap-6 hover:bg-gray-800 rounded-full w-fit px-6 py-6 cursor-pointer mt-2"
                    >
                      <span className="text-4xl">{item.icon}</span>
                      <span className=" hidden sm:inline ">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button className="hidden sm:block rounded-full bg-[#1d9bf0] w-fit px-24  py-6 cursor-pointer font-semibold">
                  Tweet
                </button>
                <button className="block sm:hidden rounded-full bg-[#1d9bf0] w-fit px-6 py-6 cursor-pointer font-semibold">
                  <BsTwitter />
                </button>
              </div>
            </div>
          </div>

          {user && (
            <div className="absolute bottom-5 flex gap-2 items-center bg-slate-800 px-3 py-2 rounded-full">
              {user && user.profileImageUrl && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageUrl}
                  alt="profile image"
                  width={50}
                  height={50}
                />
              )}
              <div className="hidden sm:block">
                <h3 className=" text-xl">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll no-scrollbar  border-gray-600">
          {props.children}
        </div>
        <div className=" col-span-0 sm:col-span-3 p-5">
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
};

export default TwitterLayout;
