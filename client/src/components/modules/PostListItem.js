import React, { useState } from "react";
import { Tag, List, Space } from "antd";
import { MessageOutlined, StarOutlined, StarFilled, ClockCircleOutlined } from "@ant-design/icons";
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

  var mainDivStyle = {
    display: "flex",
    background: "#FFFFFF",
    border: "1px solid #d9d9d9",
    boxSizing: "borderBox",
    borderRadius: "10px",
    padding: "0px",
    marginRight: "10px",
    marginTop: "10px",
    boxShadow: "0 10px 25px rgba(0,0,0,.02), 0 4px 10px rgba(0,0,0,.02)",
  };

  if (props.isActivePost) {
    mainDivStyle.border = "1px solid #1f1f1f";
  }

  const formatDueDate = (duedate) => {
    return (
      new Date(duedate.toString()).toString().substring(4, 11) +
      new Date(duedate.toString()).toLocaleString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handleReact = () => {
    props.updatePost({
      postId: props.groupPost.post._id,
      reacting: true,
    });
  };

  return (
    <div style={mainDivStyle}>
      <List.Item
        style={{
          width: "100%",
          padding: "15px 20px 15px 20px",
        }}
        key={props.groupPost.post._id}
        actions={[
          <div onClick={handleReact}>
            {props.groupPost.post.reacts.includes(props.user.userId) ? (
              <IconText
                icon={StarFilled}
                text={props.groupPost.post.reacts.length}
                key="list-vertical-star-o"
              />
            ) : (
              <IconText
                icon={StarOutlined}
                text={props.groupPost.post.reacts.length}
                key="list-vertical-star-o"
              />
            )}
          </div>,
          <IconText
            icon={MessageOutlined}
            text={props.groupPost.comments.length}
            key="list-vertical-message"
          />,
          <div
            style={{
              cursor: "default",
            }}
          >
            <IconText
              icon={ClockCircleOutlined}
              text={formatDueDate(props.groupPost.post.timestamp)}
              key="list-vertical-time"
            />
          </div>,
        ]}
      >
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            props.setActivePost(props.groupPost);
          }}
        >
          <List.Item.Meta avatar={<ProfilePic user={props.poster} />} title={postTitle} />
          {props.groupPost.post.text}
        </div>
      </List.Item>
    </div>
  );
}
