var ta = require("time-ago");
const mapPostOutput = (post, userId) => {
  return {
    _id: post._id,
    image: post.image,
    owner: {
      _id: post.owner._id,
      name: post.owner.name,
      avatar: post.owner.avatar,
    },
    caption: post.caption,
    likesCount: post.likes.length,
    isliked: post.likes.includes(userId),
    timeAgo: ta.ago(post.createdAt),
  };
};

module.exports = {
  mapPostOutput,
};
