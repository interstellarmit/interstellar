import React, { Component, useState } from "react";
import { List, Typography, Row, Col, Rate, Divider } from "antd";
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
      <Row>
        <Col span={12}>
          {props.page.pageType === "Class" ? (
            <React.Fragment>
              <Row>{"Professor: " + props.page.professor}</Row>
              <Row>
                <Rate allowHalf defaultValue={parseFloat(props.page.rating)} disabled count={7} />
                <div style={{ padding: '10px' }}>{props.page.rating}/7.0</div>
                {/* <div style={{ padding: '10px' }}>{props.page.hours} hours</div> */}
              </Row>
            </React.Fragment>
          ) : (
              <></>
            )}
          <Row>
            <Text>{props.page.description}</Text>
          </Row>
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
