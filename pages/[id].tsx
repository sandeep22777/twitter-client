import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCards";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { graphql } from "@/gql";
import { Tweet, User } from "@/gql/graphql";
import { getUserById } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";

interface ServerProps {
  userInfo?: User;
}

const UserProfilePage: NextPage<ServerProps> = (props) => {
  // const { user } = useCurrentUser();
  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className=" flex items-center gap-6 py-3 px-3">
            <BsArrowLeftShort className="text-4xl " />
            <div>
              <h1 className="text-2xl font-bold">Sandeep Deepu</h1>
              <h1 className="text-md font-bold text-slate-500 ">
                {props.userInfo?.tweets?.length} Tweets
              </h1>
            </div>
          </nav>
          <div className="p-6 border-b border-slate-800">
            {props.userInfo?.profileImageUrl && (
              <Image
                src={props.userInfo?.profileImageUrl}
                alt={props.userInfo?.firstName}
                width={150}
                height={150}
                className="rounded-full"
              />
            )}
            <h1 className="text-2xl font-bold mt-5">Sandeep Deepu</h1>
          </div>
          <div>
            {props.userInfo?.tweets?.map(
              (tweet) =>
                tweet && <FeedCard key={tweet?.id} data={tweet as Tweet} />
            )}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;

  if (!id) return { notFound: true, props: { userInfo: undefined } };

  const userInfo = await graphqlClient.request(getUserById, { id });

  if (!userInfo?.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfilePage;
