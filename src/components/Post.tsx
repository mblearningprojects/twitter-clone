import { ReactNode, useEffect, useState } from "react";
import TweetDropdownMenu from "@rd/DropdownMenu";
import HoverCardDemo from "@rd/HoverCard";
import useAuth from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/useApp";
import { toggleTweetLike, updateTweet } from "../redux/slices/tweet.slice";

import {
  HiOutlineHeart,
  HiHeart,
  HiArrowUpTray,
  HiOutlineChatBubbleOvalLeft,
  HiOutlineArrowPath,
  HiOutlineChartBarSquare,
} from "react-icons/hi2";
import axios from "@/client/axios";
import useOnScreen from "@/hooks/useOnScreen";
import { RiBarChartLine } from "react-icons/ri";

interface Props {
  id: string;
  content: string;
  name: string;
  username: string;
  date: string;
  src: string;
  initials: string;
  followers: string;
  following: string;
  description: string;
  children?: ReactNode;
  [key: string]: any;
}

const Post = ({
  id,
  content,
  name,
  username,
  date,
  children,
  src,
  initials,
  followers,
  following,
  description,
  ...props
}: Props) => {
  const [postVisible, postRef] = useOnScreen();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [likedByMe, setLikedByMe] = useState(false);

  const handleLikeClick = () => dispatch(toggleTweetLike(id));

  useEffect(() => {
    if (!id) return;
    const checkLike = async () => {
      const res = await axios.get(`/tweet/${id}/likedByMe`);
      setLikedByMe(res.data?.liked);
    };
    checkLike();
  }, []);
  useEffect(() => {
    if (postVisible && id) {
      dispatch(
        updateTweet(
          id,
          { viewCount: (props?.views ?? 0) + 1 },
          { silent: true }
        )
      );
    }
  }, [postVisible]);

  return (
    <div className="flex flex-1 gap-x-4" ref={postRef}>
      <div className="flex-shrink-0">
        <HoverCardDemo
          profile={src}
          alt={name}
          initials={initials}
          name={name}
          username={username}
          following={following}
          followers={followers}
          description={description}
        />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex flex-1">
          <div className="flex flex-1 gap-x-1 text-sm">
            <span className="text-slate-900 font-bold">{name}</span>
            <span className="text-slate-600 font-medium">@{username}</span>·
            <span className="text-slate-600 font-medium">{date}</span>
          </div>
          <div className="">
            <TweetDropdownMenu
              username={username}
              tweetID={id}
              tweetByMe={user?.username === username}
            />
          </div>
        </div>
        <div className="text-sm text-slate-900">{content}</div>
        {children}
        <div>
          <ul className="flex items-stretch mt-4 gap-x-10 xl:gap-x-14 text-xs text-slate-700 [&_li:first-child]:hidden [&_li:first-child]:lg:flex [&_li]:flex [&_li]:items-center [&_li]:gap-x-2 [&_li:xl]:gap-x-3 ">
            <li>
              <HiOutlineChartBarSquare className="w-5 h-5" />
              {props?.views ?? 0}
            </li>
            <li>
              <HiOutlineChatBubbleOvalLeft className="w-5 h-5" />
              {props?.replyCount ?? 0}
            </li>
            <li>
              <HiOutlineArrowPath className="w-5 h-5" />
              {props?.retweetCount ?? 0}
            </li>
            <li onClick={handleLikeClick} className="hover:text-[#f91880]">
              <div className="relative">
                <div className="absolute rounded-full m-[-8px] hover:bg-[#f9188033] top-0 bottom-0 left-0 right-0"></div>
                {likedByMe ? (
                  <HiHeart className="w-5 h-5" />
                ) : (
                  <HiOutlineHeart className="w-5 h-5" />
                )}
              </div>
              {props?.likes ?? 0}
            </li>
            <li>
              <RiBarChartLine className="w-5 h-5" />
              {props?.views ?? 0}
            </li>
            <li>
              <HiArrowUpTray className="w-5 h-5" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
