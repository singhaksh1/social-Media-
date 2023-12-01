import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.scss";
import Avatar from "../avatar/Avatar";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";

import { axiosClient } from "../../utils/axiosClient";
import { KEY_ACCESS_TOKEN, removeItem } from "../../utils/localStorageManager";
import { TOAST_SUCESS } from "../../App";
import { showToast } from "../../redux/slices/appConfigSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  async function handleLogOutClick() {
    try {
      await axiosClient.post("/auth/logout");
      removeItem(KEY_ACCESS_TOKEN);
      navigate("/login");
      dispatch(
        showToast({
          type: TOAST_SUCESS,
          message: "LogOut Successfully",
        })
      );
    } catch (e) {}
  }
  return (
    <div className="Navbar">
      <div className="containers">
        <h2 className="banner hover-link" onClick={() => navigate("/")}>
          Social Media
        </h2>
        <div className="right-side">
          <div
            className="profile hover-link"
            onClick={() => navigate(`/profile/${myProfile?._id}`)}
          >
            <Avatar src={myProfile?.avatar?.url} />
          </div>
          <div className="logout hover-link" onClick={handleLogOutClick}>
            <AiOutlineLogout />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
