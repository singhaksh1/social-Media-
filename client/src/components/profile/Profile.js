import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import "./Profile.scss";
import userImg from "../../assets/gamer.png";
import { useNavigate, useParams } from "react-router-dom";
import CreatePost from "../createPost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../redux/slices/postsSlice";
import { followAndUnfollowUser } from "../../redux/slices/feedSlice";
function Profile() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.postReducer.userProfile);
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const feedData = useSelector((state) => state.feedDataReducer.feedData);

  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState();

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );

    setIsMyProfile(myProfile?._id === params.userId);
    setIsFollowing(
      feedData.followings?.find((item) => item._id === params.userId)
    );
  }, [myProfile, params.userId, feedData]);

  function handleUserFollow() {
    dispatch(
      followAndUnfollowUser({
        userIdToFollow: params.userId,
      })
    );
  }

  return (
    <div className="Profile">
      <div className="container">
        <div className="left-part">
          {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map((post) => (
            <Post key={post._id} post={post} myProfileId={myProfile._id} />
          ))}
        </div>
        <div className="right-part">
          <div className="profile-card">
            <img
              className="user-img"
              src={
                userProfile?.avatar?.url ? userProfile?.avatar?.url : userImg
              }
              alt="useimg"
            />
            <h3 className="user-name">{userProfile?.name}</h3>
            <p style={{ paddingTop: "6px" }}>{userProfile?.bio}</p>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length} Following`}</h4>
            </div>
            {!isMyProfile && (
              <h5
                onClick={handleUserFollow}
                style={{ marginTop: "10px" }}
                className={
                  isFollowing ? "hover-link follow-link" : "btn-primary"
                }
              >
                {isFollowing ? "UnFollow" : "Follow"}
              </h5>
            )}
            {isMyProfile && (
              <button
                className="update-profile btn-secondary"
                onClick={() => navigate("/updateProfile")}
              >
                Update Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
