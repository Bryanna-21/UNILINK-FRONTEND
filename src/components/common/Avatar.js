import React from "react";
import "../../styles/components/avatar.css";

const Avatar = ({
  src,
  name = "",
  size = "medium",
  status = "",
  bordered = false,
  onClick,
}) => {
  const sizes = {
    small: 35,
    medium: 50,
    large: 70,
    xlarge: 100,
  };

  const avatarSize = sizes[size] || sizes.medium;

  const initials = name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`avatar-container ${
        bordered ? "avatar-bordered" : ""
      }`}
      style={{
        width: avatarSize,
        height: avatarSize,
      }}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="avatar-image"
        />
      ) : (
        <div className="avatar-placeholder">
          {initials || "U"}
        </div>
      )}

      {status && (
        <span
          className={`status-indicator ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
