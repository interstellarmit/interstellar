import React, { useState } from "react";
import { Button, List, Space } from "antd";
import { MessageOutlined, LikeOutlined } from "@ant-design/icons";
import ProfilePic from "./ProfilePic";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function PostListItem(props) {
  return (
    <List.Item
      key={props.groupPost.post._id}
      actions={[
        <IconText
          icon={LikeOutlined}
          text={props.groupPost.post.reacts}
          key="list-vertical-like-o"
        />,
        <IconText
          icon={MessageOutlined}
          text={props.groupPost.comments.length}
          key="list-vertical-message"
        />,
      ]}
    >
      <List.Item.Meta
        avatar={<ProfilePic user={props.user} />}
        title={props.groupPost.post.title}
      />
      {props.groupPost.post.text}
    </List.Item>
  );
}
