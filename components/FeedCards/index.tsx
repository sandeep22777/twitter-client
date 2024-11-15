import Image from "next/image";
import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";

const FeedCard: React.FC = () => {
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-200 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-1">
          <Image
            src="https://avatars.githubusercontent.com/u/72358529?v=4&size=64"
            alt="profile picture"
            width="64"
            height="64"
            className="rounded-full"
          />
        </div>
        <div className="col-span-11">
          <h5>Sandeep Amararapu</h5>
          <p>
            $SEND Airdrop will have a claim penalty 🪂 Very interesting read
            from @0xrooter - Founder of @suilendprotocol and @save_finance
            Suilend will probably implement the "Maturity Airdrop" - new latest
            approach to airdrops, which sets a decreasing penalty on token
            claims{" "}
          </p>
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
