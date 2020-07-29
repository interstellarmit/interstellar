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
    <h1>{props.page.name + ": " + props.page.title}</h1>
    <div>{"Description: " + props.page.description}</div>
    <UserList users={users} />
    </>
  );
};
