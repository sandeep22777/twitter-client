import { Tweet } from "@/gql/graphql";
import Image from "next/image";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;
  return (
    <div className=" border-r-0 border-l-0 border-b-0 border-gray-200 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1">
          {data.author?.profileImageUrl && (
            <Image
              src={data.author?.profileImageUrl}
              alt="profile picture"
              width="64"
              height="64"
              className="rounded-full"
            />
          )}
        </div>
        <div className="col-span-11">
          <h5>
            {data.author?.firstName} {data.author?.lastName}
          </h5>
          <p>{data.content}</p>
          <div className="flex justify-between text-2xl mt-6 items-center p-2 w-[90%]">
            <div>
              <BiMessageRounded className="hover:bg-blue-600" />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div>
              <AiOutlineHeart />
            </div>
            <div>
              <BiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
