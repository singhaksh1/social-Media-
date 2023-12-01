import React from "react";
import Avatar from "../avatar/Avatar";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "./Post.scss";
import { useDispatch } from "react-redux";
import { deletPost, likedandUnlikePost } from "../../redux/slices/postsSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../redux/slices/appConfigSlice";
import { TOAST_SUCESS } from "../../App";

function Post({ post, myProfileId }) {
  // console.log("post", post);
  // console.log("myProfileId", myProfileId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handlePostLiked() {
    dispatch(
      likedandUnlikePost({
        postId: post._id,
      })
    );
    dispatch(
      showToast({
        type: TOAST_SUCESS,
        message: "liked or unliked",
      })
    );
  }

  return (
    <div className="Post">
      <div
        className="heading"
        onClick={() => navigate(`/profile/${post.owner._id}`)}
      >
        <Avatar src={post?.owner?.avatar?.url} />
        <h4>{post?.owner?.name}</h4>
        {/* {myProfileId === post.owner._id && <button>Delete Post</button>} */}
      </div>
      <div className="content">
        <img src={post?.image?.url} alt="post img" />
      </div>
      <div className="footer">
        <div className="likes" onClick={handlePostLiked}>
          {post.isliked ? (
            <AiFillHeart className="icon" style={{ color: "red" }} />
          ) : (
            <AiOutlineHeart className="icon" />
          )}

          <h4>{post?.likesCount} likes</h4>
        </div>
        <p className="caption">{post?.caption}</p>
        <h6 className="time-ago">{post?.timeAgo}</h6>
      </div>
    </div>
  );
}

export default Post;
