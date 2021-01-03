import React, { Component, useState, useEffect } from "react";
import { List, Typography, Row, Col, Rate, Divider } from "antd";
const { Title, Text } = Typography;
import UserList from "./UserList";

export default function InfoTab(props) {
  useEffect(() => {
    document.getElementsByClassName("ant-tabs-content")[0].style.height = "100%";
  });
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
              {props.page.professor ? <Row>{"Professor: " + props.page.professor}</Row> : <></>}
              <Row>
                {props.page.rating ? (
                  <React.Fragment>
                    <Rate
                      allowHalf
                      defaultValue={parseFloat(props.page.rating)}
                      disabled
                      count={7}
                    />
                    <div style={{ padding: "10px" }}>{rating}/7.0</div>
                  </React.Fragment>
                ) : (
                  <></>
                )}
                <div style={{ padding: "10px" }}>
                  {props.page.in_class_hours
                    ? Number(props.page.in_class_hours + props.page.out_of_class_hours).toFixed(1) +
                      " Hours"
                    : ""}
                </div>
              </Row>
            </React.Fragment>
          ) : (
            <></>
          )}
          <Row>
            <Text>
              {(props.page.description || "")
                .replace(new RegExp("&nbsp;", "g"), " ")
                .replace(new RegExp("&quot;", "g"), '"')
                .replace(new RegExp("<([^>])*>", "g"), "")}
            </Text>
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
            showClasses={props.showClasses}
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
