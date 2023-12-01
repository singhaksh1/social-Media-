import React, { useEffect } from "react";
import "./Feed.scss";
import Post from "../post/Post";
import Follower from "../follower/Follower";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../redux/slices/feedSlice";
function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feedDataReducer.feedData);

  useEffect(() => {
    dispatch(getFeedData());
  }, []);

  return (
    <div className="feed">
      <div className="container">
        <div className="left-part">
          {feedData?.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="right-part">
          {feedData?.followings?.length > 0 && (
            <div className="following">
              <h3 className="title">You are Following</h3>
              {feedData?.followings?.map((user) => (
                <Follower key={user._id} user={user} showBtn={true} />
              ))}
            </div>
          )}
          {feedData?.suggestions?.length > 0 && (
            <div className="suggestions">
              <h3 className="title">Suggested for you </h3>
              {feedData?.suggestions?.map((user) => (
                <Follower key={user._id} user={user} showBtn={true} />
              ))}
            </div>
          )}
          {feedData?.followers?.length > 0 && (
            <div className="suggestions">
              <h3 className="title">You Followered by </h3>
              {feedData?.followers?.map((user) => (
                <Follower key={user._id} user={user} showBtn={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feed;
