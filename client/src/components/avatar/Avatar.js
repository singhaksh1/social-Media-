import React from "react";
import userImg from "../../assets/gamer.png";
import "./Avatar.scss";
function Avatar({ src }) {
  return (
    <div className="Avatar">
      <img src={src ? src : userImg} alt="User Avatar" />
    </div>
  );
}

export default Avatar;
