import React, { Component, useState } from 'react';
import { List } from "antd";
import ProfilePic from "./ProfilePic";
export default function UserList(props) {
  
  return (
    <List 
        dataSource = {props.users}
        size="large"
  
        renderItem = {(user) => {
            return (<List.Item>
              <List.Item.Meta
                avatar={<ProfilePic user={user} />}
                title={user.name}
              />
              
              
            </List.Item>);
        }}
    />
  );
};
