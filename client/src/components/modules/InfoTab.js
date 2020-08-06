import React, { Component, useState } from "react";
import { List, Typography, Row, Col } from "antd";
const { Title, Text } = Typography;
import UserList from "./UserList";
export default function InfoTab(props) {
  let users = props.users.filter((user) => {
    return user.userId !== props.user.userId;
  });
  if (props.inPage) {
    users.push(Object.assign(props.user, { pageIds: props.pageIds }));
  }
  return (
    <>
      <Title level={3}>{props.page.title}</Title>
      <Row>
        <Col span={12}>
          <Text>{"Description: " + props.page.description}</Text>
        </Col>
        <Col span={12}>
          <UserList
            users={users}
            allPages={props.allPages}
            showClasses={true}
            pageIds={props.pageIds}
          />
        </Col>
      </Row>
    </>
  );
}
