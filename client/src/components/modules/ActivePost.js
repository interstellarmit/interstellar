import React, { useState } from "react";
import { Card } from "antd";

export default function ActivePost(props) {
  return (
    <Card title={props.activePost.post.title}>
      {props.activePost.post.text}
      {props.activePost.post.labels}
    </Card>
  );
}
