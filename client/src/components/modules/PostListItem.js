import React, { useState } from "react";
import { Button, List } from "antd";

export default function PostListItem(props) {
  return (
    <List.Item>
      <Button>Like</Button>
    </List.Item>
  );
}
