import React, { Component, useState } from 'react';
import { List, Avatar} from "antd";
import ProfilePic from "./ProfilePic";
export default function LoungeListItem(props) {
  
  return (
    <List.Item>
              <Avatar.Group maxCount={6}>
              {users.map((user)=>{return <ProfilePic user={user} />})}
                </Avatar.Group>
              {props.name}
    </List.Item>
  
  );
};
