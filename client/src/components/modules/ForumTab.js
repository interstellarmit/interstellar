import React, { Component } from "react";
import { get, post } from "../../utilities";
import { Row, Col, Divider, Button, Grid } from "antd";
import PostList from "./PostList";

export default function ForumTab(props) {
  return (
    <div>
      <h1>ForumTab!</h1>

      <Col span={8}>
      <div>Forum post</div>
      </Col>

      
      <Button> Add New Post </Button>

      <h3>Posts</h3>

      <Col span={8}>

      <div>Current post: Blah blah blah blah blah blah blah;</div>

      </Col>
      
    </div>
  );
};