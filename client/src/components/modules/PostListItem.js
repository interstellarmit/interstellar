import React, { useState } from "react";
import { Button, List, Space } from "antd";
import { MessageOutlined, StarOutlined, StarFilled } from "@ant-design/icons";
import ProfilePic from "./ProfilePic";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function PostListItem(props) {
  var postTitle = props.groupPost.post.title
    .split(" ")
    .map((x) => {
      if (x.length > 20) {
        return x.slice(0, 20) + "...";
      } else {
        return x;
      }
    })
    .join(" ");

  return (
    <div
      onClick={() => {
        props.setActivePost(props.groupPost);
      }}
      style={{
        display: "flex",
        background: "#FFFFFF",
        border: "1px solid #d9d9d9",
        boxSizing: "borderBox",
        borderRadius: "10px",
        padding: "0px",
        marginRight: "10px",
        marginTop: "10px",
      }}
    >
      <List.Item
        style={{
          width: "100%",
          padding: "15px 20px 15px 20px",
        }}
        key={props.groupPost.post._id}
        actions={
          props.groupPost.post.reacts.includes(props.user.userId)
            ? [
                <IconText
                  icon={StarFilled}
                  text={props.groupPost.post.reacts.length}
                  key="list-vertical-star-o"
                />,
                <IconText
                  icon={MessageOutlined}
                  text={props.groupPost.comments.length}
                  key="list-vertical-message"
                />,
              ]
            : [
                <IconText
                  icon={StarOutlined}
                  text={props.groupPost.post.reacts.length}
                  key="list-vertical-star-o"
                />,
                <IconText
                  icon={MessageOutlined}
                  text={props.groupPost.comments.length}
                  key="list-vertical-message"
                />,
              ]
        }
      >
        <List.Item.Meta avatar={<ProfilePic user={props.poster} />} title={postTitle} />
        {props.groupPost.post.text}
      </List.Item>
    </div>
  );
}
