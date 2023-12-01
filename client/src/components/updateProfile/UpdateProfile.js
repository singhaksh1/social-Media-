import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import dumyImg from "../../assets/gamer.png";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMyProfile,
  showToast,
  updateMyProfile,
} from "../../redux/slices/appConfigSlice";
import { useNavigate } from "react-router-dom";
import { TOAST_SUCESS } from "../../App";
function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userImg, setUserImg] = useState("");

  useEffect(() => {
    setName(myProfile?.name || "");
    setBio(myProfile?.bio || "");
    setUserImg(myProfile?.avatar?.url || "");
  }, [myProfile]);

  function handleImageChange(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
        // console.log("img data", fileReader.result);
      }
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userImg,
      })
    );
    dispatch(
      showToast({
        type: TOAST_SUCESS,
        message: "Profile Updated Successfully",
      })
    );
  }
  // does not navigate on the login page but user deleted successfully ???//
  // solve this problem first
  function handleDelete(e) {
    e.preventDefault();
    dispatch(deleteMyProfile());
    navigate("/login");
    dispatch(
      showToast({
        type: TOAST_SUCESS,
        message: "User Deleted Successfully",
      })
    );
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg ? userImg : dumyImg} alt={name} />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input
              value={name}
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              value={bio}
              type="text"
              placeholder="Your Bio"
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              value="Update"
              type="submit"
              className="btn-primary"
              onClick={handleSubmit}
            />
          </form>

          <button className="delete-account btn-primary" onClick={handleDelete}>
            Delet Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
