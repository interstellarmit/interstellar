import React, { Component, useState } from "react";
import DDQLSection from "./DDQLSection";
import { Row, Col, Typography, Alert, Button } from "antd";
const { Title, Text } = Typography;
import LoungeList from "./LoungeList";
import UserList from "./UserList";
export default function DashboardTab(props) {
  let users = props.users.filter((user) => {
    return user.userId !== props.user.userId;
  });
  if (props.inPage) {
    users.push(Object.assign(props.user, { pageIds: props.pageIds }));
  }
  return (
    <>
      <Row>
        {props.seeHelpText ? (
          <Col span={12}>
            <Alert
              message="Help create a class calendar"
              description={
                <div>
                  The add button lets you: <br /> - add new due dates and quicklinks for everyone to
                  see <br />- view a public feed of other students' duedates and quicklinks to add
                  to your own feed.
                </div>
              }
              type="info"
              showIcon
              closable
              afterClose={() => {
                props.setSeeHelpText(false);
              }}
            />
          </Col>
        ) : (
          <React.Fragment />
        )}
        {props.page.adminIds.length < 5 ? (
          <Col span={props.seeHelpText ? 12 : 24}>
            <Alert
              message="Request ability to push out due dates from public feed to everyone automatically
      "
              description={
                <div>
                  <Button type="primary" style={{ marginTop: "10px" }}>
                    Become Due Date Verifier
                  </Button>
                </div>
              }
              type="info"
              showIcon
              closeable
              style={{ height: "100%" }}
              closable
            />
          </Col>
        ) : (
          <React.Fragment />
        )}
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={18}>
          <DDQLSection
            dataSource={props.dueDates}
            users={props.users}
            page={props.page}
            createNewDDQL={props.createNewDDQL}
            editDDQL={props.editDDQL}
            user={props.user}
            isSiteAdmin={props.isSiteAdmin}
            type="DueDate"
          />

          <DDQLSection
            dataSource={props.quickLinks}
            users={props.users}
            page={props.page}
            createNewDDQL={props.createNewDDQL}
            isSiteAdmin={props.isSiteAdmin}
            editDDQL={props.editDDQL}
            user={props.user}
            type="QuickLink"
          />
        </Col>
        <Col span={6}>
          <UserList
            users={users}
            allPages={props.allPages}
            showClasses={true}
            pageIds={props.pageIds}
            page={props.page}
            adminIds={props.page.adminIds}
            isSiteAdmin={props.isSiteAdmin}
            dashboard={true}
          />
        </Col>
      </Row>
    </>
  );
  /*
        <Col span={12}>
          <Title level={4}>{"Open Lounges"}</Title>
          <LoungeList
            redirect={(link) => props.redirectPage(link)}
            lounges={props.lounges}
            users={props.users}
            page={props.page}
          />
        </Col>*/
}
