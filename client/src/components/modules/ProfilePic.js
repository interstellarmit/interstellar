import React, { Component, useState } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

export default function ProfilePic(props) {
  if (props.user.name.startsWith("Anonymous")) return <Avatar icon={<UserOutlined />} />;
  let initials = props.user.name.split(" ").map((name) => {
    return name[0];
  });
  initials = initials[0] + initials[initials.length - 1];
  return <Avatar>{initials}</Avatar>;
}
