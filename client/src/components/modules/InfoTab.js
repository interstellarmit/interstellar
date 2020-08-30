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
  let rating = String(props.page.rating);
  if (rating.length === 1) {
    rating += ".0";
  }
  //let adminUser = props.users.concat(props.user).find((user) => {
  //  return user.userId === (props.page.adminIds[0] || "");
  //});
  //let admin = adminUser ? adminUser.name.split(" ")[0] : "the group creator";
  return (
    <>
      <Row style={{ height: "100%" }} gutter={[16, 16]}>
        <Col span={12} style={{ height: "100%" }}>
          {props.page.pageType === "Class" ? (
            <React.Fragment>
              <Row>{"Professor: " + props.page.professor}</Row>
              <Row>
                <Rate allowHalf defaultValue={parseFloat(props.page.rating)} disabled count={7} />
                <div style={{ padding: "10px" }}>{rating}/7.0</div>
                <div style={{ padding: "10px" }}>{props.page.hours} hours</div>
              </Row>
            </React.Fragment>
          ) : (
            <></>
          )}
          <Row>
            <Text>{props.page.description}</Text>
          </Row>
          <Row>
            {props.page.pageType === "Group" && !props.page.locked ? (
              <Text style={{ fontStyle: "italic" }}>{"This is a public group."}</Text>
            ) : (
              <></>
            )}
          </Row>
        </Col>
        <Col span={12} style={{ height: "100%" }}>
          <UserList
            users={users}
            allPages={props.allPages}
            showClasses={true}
            pageIds={props.pageIds}
            page={props.page}
            adminIds={props.page.adminIds}
            isSiteAdmin={props.isSiteAdmin}
          />
        </Col>
      </Row>
    </>
  );
}
