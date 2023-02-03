import Image from "next/image";
import Post from "@ui/Post";
import { ReactNode, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useApp";
import { getProfileTweets } from "@/redux/slices/profile.slice";
import Loader from "../../components/Loading";
import { useRouter } from "next/router";

const UserTweets = ({ username }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { tweets } = useAppSelector((state) => state.profile);
  useEffect(() => {
    const getTweets = async () => {
      dispatch(getProfileTweets(username));
      setLoading(false);
    };
    getTweets();
    return () => setLoading(true);
  }, [username]);
  if (loading) return <Loader />;

  return (
    <ul className="[&_p:last-child]:text-slate-500 [&_p:first-child]:text-lg divide-y divide-slate-200">
      {tweets.allIds.map((tweetID, i) => {
        const {
          id,
          content,
          attachments,
          owner,
          createdAt: date,
          viewCount: views,
          likeCount: likes,
          replyCount,
          retweetCount,
          liked,
        } = tweets.byId[tweetID];

        return (
          <li key={`tweet-${id}`}>
            <Post
              id={id}
              user={owner}
              content={content}
              attachments={attachments}
              date={date}
              liked={liked ?? false}
              likes={likes}
              views={views}
              retweetCount={retweetCount}
              replyCount={replyCount}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default UserTweets;
