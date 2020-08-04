import React, { Component, useState } from "react";
import { List, Avatar } from "antd";
import ProfilePic from "./ProfilePic";
export default function LoungeListItem(props) {
  return (
    <List.Item onClick={props.redirect}>
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
