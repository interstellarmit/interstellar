import React, { Component, useState } from 'react';
import { List } from "antd";
import ProfilePic from "./ProfilePic";
export default function UserList(props) {
  
  return (
    <List 
        dataSource = {props.users}
        renderItem = {(user) => {
            return (<List.Item>
              <ProfilePic user={user} />
              {user.name}
            </List.Item>);
        }}
    />
  );
};
