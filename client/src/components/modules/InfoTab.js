import React, { Component, useState } from 'react';
import { List } from "antd";
import UserList from "./UserList";
export default function InfoTab(props) {
  let users = props.users.filter((user) => {return user.userId !== props.user.userId}) 
  if(props.inPage) {
    users.push(props.user)
  }
  return (
    <>
    <h3>{props.page.title}</h3>
    <div>{"Description: " + props.page.description}</div>
    <UserList users={users} />
    </>
  );
};
