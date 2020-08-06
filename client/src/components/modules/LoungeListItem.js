import React, { Component, useState } from "react";
import { List, Avatar, Button } from "antd";
import ProfilePic from "./ProfilePic";
import { UsergroupAddOutlined } from "@ant-design/icons";
export default function LoungeListItem(props) {
  return (
    <List.Item
      actions={[
        <Button onClick={props.redirect}>
          <UsergroupAddOutlined />
        </Button>,
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
        title={props.name}
        description={props.home ? props.pageName : undefined}
      />
    </List.Item>
  );
}
