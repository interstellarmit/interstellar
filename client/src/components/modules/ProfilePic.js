import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";

export default function ProfilePic(props) {
  if ((props.user.name || "").startsWith("Anonymous")) return <Avatar icon={<UserOutlined />} />;
  let initials = (props.user.name || "0").split(" ").map((name) => {
    return name[0];
  });
  initials = initials[0] + initials[initials.length - 1];
  return <Avatar size={props.size}>{initials}</Avatar>;
}
