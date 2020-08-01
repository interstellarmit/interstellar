import React, { Component, useState } from 'react';
import { List } from "antd";
export default function UserList(props) {
  
  return (
    <List 
        dataSource = {props.posts}
        renderItem = {(post) => {
            return (<List.Item>
                <h1>{post.title};</h1>
                {post.content};
            </List.Item>);
        }}
    />
  );
};
