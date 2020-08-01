import React, { Component, useState } from 'react';
import { List } from "antd";
export default function PostList(props) {
  
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
