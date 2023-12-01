const Post = require("../models/Post");
const User = require("../models/User");
const { mapPostOutput } = require("../utils/Utils");
const { sucess, error } = require("../utils/responseWrapper");
const cloudinary = require("cloudinary").v2;

const followOrUnfollowUserController = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;
    const curUserId = req._id;

    const userToFollow = await User.findById(userIdToFollow);
    const curUser = await User.findById(curUserId);

    if (curUserId === userIdToFollow) {
      return res.send(error(409, "User cannot follow themselves"));
    }

    if (!userToFollow) {
      return res.send(error(404, "Usertofollow not found"));
    }

    if (curUser.followings.includes(userIdToFollow)) {
      //already followed
      const followingIndex = curUser.followings.indexOf(userIdToFollow);
      curUser.followings.splice(followingIndex, 1);

      const followerIndex = userToFollow.followers.indexOf(curUserId);
      userToFollow.followers.splice(followerIndex, 1);
    } else {
      userToFollow.followers.push(curUserId);
      curUser.followings.push(userIdToFollow);
    }

    await curUser.save();
    await userToFollow.save();

    return res.send(sucess(200, { user: userToFollow }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getPostsOfFollowing = async (req, res) => {
  try {
    const curUserId = req._id;
    const curUser = await User.findById(curUserId)
      .populate("followings")
      .populate("followers");

    // const fullPosts = await Post.find({
    //   owner: {
    //     $in: curUser.followings,
    //   },
    // }).populate("owner");

    const fullPosts = await Post.find({
      $or: [
        { owner: { $in: curUser.followings } },
        { owner: { $in: curUser.followers } },
      ],
    }).populate("owner");

    const posts = fullPosts
      .map((item) => mapPostOutput(item, req._id))
      .reverse();

    let followingsIds = curUser.followings.map((item) => item._id);
    const followersIds = curUser.followers.map((item) => item._id);
    followingsIds.push(req._id);

    const newFollowingsIds = followingsIds.concat(followersIds);

    const suggestions = await User.find({
      _id: {
        $nin: newFollowingsIds,
      },
    });

    return res.send(sucess(200, { ...curUser._doc, suggestions, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getMyPosts = async (req, res) => {
  try {
    const curUserId = req._id;
    const allUserPosts = await Post.find({
      owner: curUserId,
    }).populate("likes");

    return res.send(sucess(200, { allUserPosts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserPosts = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.send(error(400, "userId is required"));
    }

    const allUserPosts = await Post.find({
      owner: userId,
    }).populate("likes");

    return res.send(sucess(200, { allUserPosts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const curUserId = req._id;

    const curUser = await User.findById(curUserId);

    //delete all posts
    await Post.deleteMany({
      owner: curUserId,
    });

    // remove myself from followers following

    curUser.followers.forEach(async (followerId) => {
      const follower = await User.findById(followerId);
      const index = follower.followings.indexOf(curUserId);
      follower.followings.splice(index, 1);
      await follower.save();
    });

    // remove myself from my followings followers

    curUser.followings.forEach(async (followingId) => {
      const following = await User.findById(followingId);
      const index = following.followers.indexOf(curUserId);
      following.followers.splice(index, 1);
      await following.save();
    });

    // remove myself from all likes

    const allPosts = await Post.find();
    allPosts.forEach(async (post) => {
      const index = post.likes.indexOf(curUserId);
      post.likes.splice(index, 1);
      await post.save();
    });

    //delete user

    await curUser.deleteOne();

    //delete cookies

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
    });

    return res.send(sucess(200, "user deleted successfully"));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = await User.findById(req._id);

    res.send(sucess(200, { user }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;

    const user = await User.findById(req._id);

    if (name) {
      user.name = name;
    }
    if (bio) {
      user.bio = bio;
    }
    if (userImg) {
      const cloudImg = await cloudinary.uploader.upload(userImg, {
        folder: "profileImg",
      });
      user.avatar = {
        url: cloudImg.secure_url,
        publicId: cloudImg.public_id,
      };
    }
    await user.save();
    return res.send(sucess(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });

    const fullPosts = user.posts;
    const posts = fullPosts
      .map((item) => mapPostOutput(item, req._id))
      .reverse();

    return res.send(sucess(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  followOrUnfollowUserController,
  getPostsOfFollowing,
  getMyPosts,
  getUserPosts,
  deleteMyProfile,
  getMyInfo,
  updateUserProfile,
  getUserProfile,
};
