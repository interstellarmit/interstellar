import React, { Component, useState } from "react";
import { List, Avatar, Button, Tooltip } from "antd";
import ProfilePic from "./ProfilePic";
import { UsergroupAddOutlined } from "@ant-design/icons";
export default function LoungeListItem(props) {
  const [hover, setHover] = React.useState(false);
  return (
    <List.Item
      onClick={props.redirect}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      style={{ backgroundColor: hover ? "#F6F6F6" : undefined }}
      actions={[
        <Tooltip title={"Enter " + props.pageName + " Lounge"}>
          <Button onClick={props.redirect} icon={<UsergroupAddOutlined />} type="text">
            Enter
          </Button>
        </Tooltip>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar.Group maxCount={6}>
            {props.users.map((user) => {
              return <ProfilePic user={user} />;
            })}
          </Avatar.Group>
        }
        title={props.pageName + " Lounge"}
      />
    </List.Item>
  );
}
